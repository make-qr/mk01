"""Search WG catalog and import single games into MonkeyMart."""
from __future__ import annotations

import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
WG_ROOT = Path("/home/vananh/huong-dan/he-thong-du-an/01_Game/wgplayground-clone")
OUT_GAME_DIR = ROOT / "game"
OUT_IMG_DIR = ROOT / "assets/img/wg"
OUT_WG_GAMES_JS = ROOT / "assets/js/wg-games.js"

sys.path.insert(0, str(SCRIPTS))
from home_grids import load_wg_games  # noqa: E402


def slugify(text: str) -> str:
    s = (text or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "game"


def parse_ifr(value: str) -> str:
    value = (value or "").strip()
    if not value:
        raise ValueError("WG embed ID / URL is required")
    m = re.search(r"/ifr/([a-f0-9]+)", value, re.I)
    if m:
        return m.group(1)
    if re.fullmatch(r"[a-f0-9]{16,64}", value, re.I):
        return value
    raise ValueError("Invalid WG embed — paste iframe URL or hash from play.wgplayground.com")


def _import_wg_module():
    path = SCRIPTS / "import-wg-games.py"
    spec = importlib.util.spec_from_file_location("import_wg_games", path)
    if not spec or not spec.loader:
        raise RuntimeError("Could not load import-wg-games.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def local_game_ids() -> set[str]:
    return {g["id"] for g in load_wg_games() if g.get("id")}


def write_wg_games(games: list[dict]) -> None:
    if not games:
        existing = load_wg_games()
        if existing:
            raise ValueError(
                f"Refusing to wipe WG_GAMES ({len(existing)} games). List is empty."
            )
    payload = json.dumps(games, ensure_ascii=False, indent=2)
    OUT_WG_GAMES_JS.write_text(
        "/* Auto-generated — run: python3 scripts/import-wg-games.py */\n"
        f"window.WG_GAMES = {payload};\n",
        encoding="utf-8",
    )
    # Minified twin for category pages (smaller download).
    min_path = OUT_WG_GAMES_JS.with_name("wg-games.min.js")
    min_path.write_text(
        "/* Auto-generated min — do not edit */\n"
        f"window.WG_GAMES={json.dumps(games, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    try:
        from home_grids import invalidate_wg_games_cache

        invalidate_wg_games_cache()
    except Exception:  # noqa: BLE001
        pass


def _load_catalog() -> tuple[dict[str, dict], dict, str]:
    from wg_catalog_sync import load_wg_catalog

    catalog, source = load_wg_catalog(rescan=False)
    by_pub: dict = {}
    if not catalog:
        mod = _import_wg_module()
        if mod.WG_CATALOG_JS.is_file():
            try:
                catalog, by_pub = mod.parse_catalog()
                source = "wg-catalog.js"
            except Exception:  # noqa: BLE001
                catalog = {}
    return catalog, by_pub, source


def search_wg_catalog(query: str = "", *, limit: int = 50) -> list[dict]:
    mod = _import_wg_module()
    catalog, _by_pub, _source = _load_catalog()
    if not catalog:
        return []
    local_ids = local_game_ids()
    q = (query or "").strip().lower()
    rows: list[tuple[int, str, dict, dict]] = []

    for path, game in catalog.items():
        ifr = game.get("ifr")
        if not ifr:
            continue
        slug = mod.slug_from_path(path)
        name = game.get("name") or slug
        pub = game.get("by") or ""
        hay = f"{name} {slug} {pub} {' '.join(game.get('cats') or [])}".lower()
        if q and q not in hay:
            continue
        score = 0
        if slug in local_ids:
            score += 100
        if q:
            if slug == q:
                score -= 50
            elif name.lower().startswith(q):
                score -= 20
            elif slug.startswith(q.replace(" ", "-")):
                score -= 15
        rows.append((score, name.lower(), path, game))

    rows.sort(key=lambda x: (x[0], x[1]))
    out: list[dict] = []
    for _score, _name, path, game in rows[:limit]:
        slug = mod.slug_from_path(path)
        out.append(
            {
                "slug": slug,
                "name": game.get("name") or slug,
                "by": game.get("by") or "",
                "ifr": game.get("ifr") or "",
                "cats": game.get("cats") or [],
                "inProject": slug in local_ids,
                "wgPath": path,
            }
        )
    return out


def import_wg_game(slug: str) -> dict:
    mod = _import_wg_module()
    catalog, by_pub, source = _load_catalog()
    if not catalog:
        raise FileNotFoundError(
            "WG catalog trống — quét clone HTML trong tab Duyệt WG trước."
        )
    path = None
    game = None
    for p, g in catalog.items():
        if mod.slug_from_path(p) == slug:
            path = p
            game = g
            break
    if not game or not path:
        raise ValueError(f"Game not found in WG catalog: {slug}")
    if not game.get("ifr"):
        raise ValueError(f"Game has no playable embed: {slug}")

    local_ids = local_game_ids()
    if slug in local_ids:
        raise ValueError(f"Game already in project: {slug}")

    # Thumbnail
    src_dir = mod.WG_IMAGES / slug
    dest_dir = OUT_IMG_DIR / slug
    if src_dir.is_dir():
        dest_dir.mkdir(parents=True, exist_ok=True)
        for name in ("thumbnail.webp", "og.webp", "source.jpg"):
            src = src_dir / name
            if src.is_file():
                import shutil

                shutil.copy2(src, dest_dir / name)

    mm_cats = mod.map_cats(game.get("cats"))
    entry = {
        "id": slug,
        "name": game["name"],
        "by": game.get("by", ""),
        "image": mod.local_thumb(slug),
        "categories": mm_cats,
        "wgCategories": game.get("cats") or [],
        "ifr": game["ifr"],
        "url": mod.local_page(slug),
        "c": game.get("c", "#6366f1"),
    }

    OUT_GAME_DIR.mkdir(parents=True, exist_ok=True)
    related = mod.pick_related(path, game, catalog, by_pub)
    related_for_page = [
        {"name": r["name"], "image": r["image"], "url": r["url"]} for r in related
    ]
    page_html = mod.build_game_page(slug, game, related_for_page)
    (OUT_GAME_DIR / f"{slug}.html").write_text(page_html, encoding="utf-8")

    games = load_wg_games()
    games.append(entry)
    write_wg_games(games)

    return {
        "id": slug,
        "name": entry["name"],
        "url": entry["url"],
        "page": f"/game/{slug}.html",
    }


def add_manual_game(payload: dict) -> dict:
    mod = _import_wg_module()
    name = (payload.get("name") or "").strip()
    if not name:
        raise ValueError("Game name is required")
    slug = slugify(payload.get("slug") or name)
    if not slug:
        raise ValueError("Invalid slug")
    if slug in local_game_ids():
        raise ValueError(f"Game already in project: {slug}")

    ifr = parse_ifr(payload.get("ifr") or payload.get("embed") or "")
    pub = (payload.get("by") or payload.get("publisher") or "Publisher").strip()
    raw_cats = payload.get("cats") or payload.get("categories") or "Casual"
    if isinstance(raw_cats, str):
        wg_cats = [c.strip() for c in raw_cats.split(",") if c.strip()]
    else:
        wg_cats = [str(c).strip() for c in raw_cats if str(c).strip()]
    if not wg_cats:
        wg_cats = ["Casual"]

    thumb_url = (payload.get("thumbnail") or payload.get("image") or "").strip()
    dest_dir = OUT_IMG_DIR / slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    image = mod.local_thumb(slug)
    if thumb_url.startswith("http"):
        try:
            import urllib.request

            dest = dest_dir / "thumbnail.webp"
            urllib.request.urlretrieve(thumb_url, dest)
            if dest.stat().st_size > 0:
                image = mod.local_thumb(slug)
        except OSError as exc:
            raise ValueError(f"Could not download thumbnail: {exc}") from exc

    mm_cats = mod.map_cats(wg_cats)
    game = {
        "name": name,
        "by": pub,
        "ifr": ifr,
        "cats": wg_cats,
        "c": payload.get("c") or "#6366f1",
    }
    entry = {
        "id": slug,
        "name": name,
        "by": pub,
        "image": image,
        "categories": mm_cats,
        "wgCategories": wg_cats,
        "ifr": ifr,
        "url": mod.local_page(slug),
        "c": game["c"],
    }

    OUT_GAME_DIR.mkdir(parents=True, exist_ok=True)
    page_html = mod.build_game_page(slug, game, [])
    (OUT_GAME_DIR / f"{slug}.html").write_text(page_html, encoding="utf-8")

    games = load_wg_games()
    games.append(entry)
    write_wg_games(games)

    return {
        "id": slug,
        "name": name,
        "url": entry["url"],
        "page": f"/game/{slug}.html",
    }
