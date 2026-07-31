"""WG catalog sync — scan clone HTML, diff pending, batch import."""
from __future__ import annotations

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from wg_game_tools import (
    WG_ROOT,
    _import_wg_module,
    local_game_ids,
    load_wg_games,
    write_wg_games,
)

ROOT = Path(__file__).resolve().parents[1]
CACHE_PATH = ROOT / ".cache" / "wg-clone-catalog.json"
CLONE_GAMES_DIR = WG_ROOT / "games"


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def mod_slug(path: str) -> str:
    return path.replace("/", "-")


def parse_clone_game_html(path: Path) -> dict | None:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return None

    m_ifr = re.search(r"play\.wgplayground\.com/ifr/([a-f0-9]+)", text, re.I)
    if not m_ifr:
        return None
    ifr = m_ifr.group(1)

    m_title = re.search(r"<title>([^<]+)</title>", text, re.I)
    name = path.stem.replace("-", " ").title()
    if m_title:
        name = re.sub(r"\s*[—\-|].*$", "", m_title.group(1)).strip() or name

    by = ""
    m_by = re.search(r"by\s*<strong>([^<]+)</strong>", text, re.I)
    if m_by:
        by = m_by.group(1).strip()

    cats: list[str] = []
    for m in re.finditer(r"games-catalogue\.html/games/([^\"'?#]+)", text):
        raw = m.group(1).replace("-", " ").strip()
        if not raw:
            continue
        cat = " ".join(w.capitalize() for w in raw.split())
        mapping = {
            "Card Board": "Card & Board",
            "Military War": "Military & War",
            "Cooking Food": "Cooking & Food",
            "Rhythm Dance Music": "Rhythm (Dance & Music)",
            "Pet Animal": "Pet & Animal",
            "Politics Government": "Politics & Government",
            "Real Time Tactics": "Real-Time Tactics",
            "Dress Up And Fashion": "Dress-up and Fashion",
            "Role Playing Rpg": "Role-Playing (RPG)",
            "Quiz Trivia": "Quiz & Trivia",
            "2players": "2Players",
        }
        cat = mapping.get(cat, cat)
        if cat not in cats:
            cats.append(cat)

    slug = path.stem
    wg_path = slug.replace("-", "/", 1) if "-" in slug else slug
    m_path = re.search(r"wgplayground\.com/game/([^\"'?#\s]+)", text, re.I)
    if m_path:
        wg_path = m_path.group(1).strip("/")

    return {
        "slug": slug,
        "name": name,
        "by": by,
        "ifr": ifr,
        "cats": cats or ["Casual"],
        "wgPath": wg_path,
        "c": "#6366f1",
    }


def scan_clone_catalog() -> dict[str, dict]:
    if not CLONE_GAMES_DIR.is_dir():
        return {}
    catalog: dict[str, dict] = {}
    for html in sorted(CLONE_GAMES_DIR.glob("*.html")):
        if html.name.startswith("_"):
            continue
        entry = parse_clone_game_html(html)
        if not entry:
            continue
        path = entry["wgPath"]
        slug = entry["slug"]
        # Tránh ghi đè khi 2 file HTML trỏ cùng wgPath (dùng slug làm path phụ)
        if path in catalog and mod_slug(path) != slug:
            path = slug
        catalog[path] = {
            "name": entry["name"],
            "by": entry["by"],
            "ifr": entry["ifr"],
            "cats": entry["cats"],
            "c": entry["c"],
            "slug": slug,
        }
    return catalog


def clone_html_stats() -> dict[str, int]:
    if not CLONE_GAMES_DIR.is_dir():
        return {"htmlTotal": 0, "embedPages": 0, "noEmbedPages": 0, "mmNativePages": 0}
    html_total = 0
    embed_pages = 0
    no_embed = 0
    mm_native = 0
    for html in CLONE_GAMES_DIR.glob("*.html"):
        if html.name.startswith("_"):
            continue
        html_total += 1
        text = html.read_text(encoding="utf-8", errors="ignore")
        has_ifr = bool(re.search(r"play\.wgplayground\.com/ifr/", text, re.I))
        if has_ifr:
            embed_pages += 1
        else:
            no_embed += 1
            if html.name.startswith("mm-"):
                mm_native += 1
    return {
        "htmlTotal": html_total,
        "embedPages": embed_pages,
        "noEmbedPages": no_embed,
        "mmNativePages": mm_native,
    }


def _build_catalog_items(
    catalog: dict[str, dict], local_ids: set[str]
) -> tuple[list[dict], list[dict], int]:
    pending: list[dict] = []
    in_project = 0
    all_items: list[dict] = []
    for path, game in catalog.items():
        ifr = game.get("ifr")
        if not ifr:
            continue
        slug = game.get("slug") or mod_slug(path)
        item = {
            "slug": slug,
            "name": game.get("name") or slug,
            "by": game.get("by") or "",
            "ifr": ifr,
            "cats": game.get("cats") or [],
            "inProject": slug in local_ids,
            "wgPath": path,
        }
        all_items.append(item)
        if slug in local_ids:
            in_project += 1
        else:
            pending.append(item)
    pending.sort(key=lambda x: x["name"].lower())
    all_items.sort(key=lambda x: x["name"].lower())
    return pending, all_items, in_project


def load_catalog_cache() -> dict | None:
    if not CACHE_PATH.is_file():
        return None
    try:
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def save_catalog_cache(catalog: dict[str, dict], *, source: str) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "updatedAt": _utc_now(),
        "source": source,
        "count": len(catalog),
        "catalog": catalog,
    }
    CACHE_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def git_pull_clone() -> str:
    if not (WG_ROOT / ".git").is_dir():
        return "skip: no git repo"
    try:
        proc = subprocess.run(
            ["git", "pull", "--ff-only"],
            cwd=str(WG_ROOT),
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return "timeout"
    out = (proc.stdout or proc.stderr or "").strip()
    if proc.returncode != 0:
        return f"git pull failed: {out[-500:]}"
    return out[-300:] or "ok"


def load_wg_catalog(*, rescan: bool = False) -> tuple[dict[str, dict], str]:
    mod = _import_wg_module()
    if not rescan:
        cached = load_catalog_cache()
        if cached and cached.get("catalog"):
            return cached["catalog"], cached.get("source", "cache")

        try:
            catalog, _ = mod.parse_catalog()
            if catalog:
                save_catalog_cache(catalog, source="wg-catalog.js")
                return catalog, "wg-catalog.js"
        except Exception:  # noqa: BLE001
            pass

    catalog = scan_clone_catalog()
    if catalog:
        save_catalog_cache(catalog, source="clone-html-scan")
        return catalog, "clone-html-scan"
    return {}, "empty"


def sync_wg_catalog(*, pull: bool = False) -> dict:
    git_log = git_pull_clone() if pull else "skipped"
    catalog, source = load_wg_catalog(rescan=True)
    local_ids = local_game_ids()
    pending, all_items, in_project = _build_catalog_items(catalog, local_ids)
    stats = clone_html_stats()
    return {
        "git": git_log,
        "source": source,
        "wgTotal": len(all_items),
        "localTotal": len(local_ids),
        "inProject": in_project,
        "pendingCount": len(pending),
        "pending": pending,
        "allGames": all_items,
        "scannedAt": _utc_now(),
        **stats,
        "message": (
            "Tất cả game WG có embed đã có trong dự án."
            if not pending
            else f"Có {len(pending)} game mới chưa import."
        ),
    }


def list_wg_games(
    *,
    query: str = "",
    category: str = "",
    filter: str = "pending",
    limit: int = 500,
) -> dict:
    cached = load_catalog_cache()
    catalog, source = load_wg_catalog(rescan=False)
    local_ids = local_game_ids()
    pending, all_items, in_project = _build_catalog_items(catalog, local_ids)
    stats = clone_html_stats()

    mode = (filter or "pending").strip().lower()
    if mode in ("pending", "out", "new"):
        games = pending
    elif mode in ("in", "imported", "done"):
        games = [g for g in all_items if g["inProject"]]
    else:
        games = all_items

    q = (query or "").strip().lower()
    cat = (category or "").strip().lower()
    if q:
        games = [
            g
            for g in games
            if q in f"{g['name']} {g['slug']} {g['by']} {' '.join(g['cats'])}".lower()
        ]
    if cat:
        games = [
            g
            for g in games
            if any(c.lower() == cat for c in g.get("cats") or [])
        ]

    return {
        "pendingCount": len(pending),
        "inProjectCount": in_project,
        "filteredCount": len(games),
        "wgTotal": len(all_items),
        "localTotal": len(local_ids),
        "source": source,
        "scannedAt": (cached or {}).get("updatedAt"),
        "filter": mode,
        "games": games[:limit],
        **stats,
        "message": (
            "Tất cả game WG có embed đã có trong dự án."
            if not pending
            else f"Có {len(pending)} game mới chưa import."
        ),
    }


def list_pending_games(*, query: str = "", category: str = "", limit: int = 500) -> dict:
    return list_wg_games(query=query, category=category, filter="pending", limit=limit)


def import_wg_games_batch(slugs: list[str]) -> dict:
    imported: list[dict] = []
    errors: list[dict] = []
    catalog, source = load_wg_catalog(rescan=False)
    mod = _import_wg_module()

    for slug in slugs:
        slug = (slug or "").strip()
        if not slug:
            continue
        try:
            if not _catalog_has_slug(catalog, slug):
                raise ValueError(f"Not in WG catalog: {slug}")
            result = _import_from_catalog(mod, catalog, slug)
            imported.append(result)
        except Exception as exc:  # noqa: BLE001
            errors.append({"slug": slug, "error": str(exc)})

    return {
        "imported": imported,
        "errors": errors,
        "catalog": len(load_wg_games()),
        "source": source,
    }


def _catalog_has_slug(catalog: dict[str, dict], slug: str) -> bool:
    return any(mod_slug(p) == slug and g.get("ifr") for p, g in catalog.items())


def _import_from_catalog(mod, catalog: dict[str, dict], slug: str) -> dict:
    path = None
    game = None
    for p, g in catalog.items():
        if mod_slug(p) == slug:
            path = p
            game = g
            break
    if not game or not path:
        raise ValueError(f"Game not found: {slug}")
    if slug in local_game_ids():
        raise ValueError(f"Already in project: {slug}")

    import shutil

    src_dir = mod.WG_IMAGES / slug
    dest_dir = mod.OUT_IMG_DIR / slug
    if src_dir.is_dir():
        dest_dir.mkdir(parents=True, exist_ok=True)
        for name in ("thumbnail.webp", "og.webp", "source.jpg"):
            src = src_dir / name
            if src.is_file():
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

    mod.OUT_GAME_DIR.mkdir(parents=True, exist_ok=True)
    by_pub: dict = {}
    related = mod.pick_related(path, game, catalog, by_pub)
    related_for_page = [{"name": r["name"], "image": r["image"], "url": r["url"]} for r in related]
    page_html = mod.build_game_page(slug, game, related_for_page)
    (mod.OUT_GAME_DIR / f"{slug}.html").write_text(page_html, encoding="utf-8")

    games = load_wg_games()
    games.append(entry)
    write_wg_games(games)

    return {
        "id": slug,
        "name": entry["name"],
        "url": entry["url"],
        "page": f"/game/{slug}.html",
    }
