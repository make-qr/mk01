"""Build homepage grids (trending / new / topRated) from WG_GAMES + MM_FEATURED."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WG_GAMES_JS = ROOT / "assets/js/wg-games.js"
FEATURED_JS = ROOT / "assets/js/wg-featured.js"
OUT_WG_GRIDS_JS = ROOT / "assets/js/wg-grids-home.js"

TRENDING_LIMIT = 18
NEW_LIMIT = 18
TOP_LIMIT = 20
FEATURED_CATS = ["Action", "Puzzles", "Cars", "Casual", "Arcade"]
PER_CAT_TOP = 4
# Game pages no longer load full wg-games.js — keep enough per-category
# coverage in WG_GAMES_HOME for related rails / Surprise me.
PER_CAT_BROWSE = 10
BROWSE_CATALOG_CAP = 200


def parse_featured_ids(key: str) -> list[str]:
    if not FEATURED_JS.is_file():
        return []
    text = FEATURED_JS.read_text(encoding="utf-8")
    m = re.search(rf"{re.escape(key)}\s*:\s*\[(.*?)\]", text, re.S)
    if not m:
        return []
    return re.findall(r"'([^']+)'", m.group(1))


_WG_GAMES_CACHE: tuple[float, list[dict]] | None = None
_FEATURED_CACHE: tuple[float, dict[str, list[str]]] | None = None


def load_wg_games() -> list[dict]:
    global _WG_GAMES_CACHE
    if not WG_GAMES_JS.is_file():
        raise SystemExit(f"Missing {WG_GAMES_JS}")
    mtime = WG_GAMES_JS.stat().st_mtime
    if _WG_GAMES_CACHE and _WG_GAMES_CACHE[0] == mtime:
        return _WG_GAMES_CACHE[1]
    text = WG_GAMES_JS.read_text(encoding="utf-8")
    m = re.search(r"window\.WG_GAMES\s*=\s*(\[.*?\])\s*;", text, re.S)
    if not m:
        raise SystemExit(f"Could not parse WG_GAMES from {WG_GAMES_JS}")
    games = json.loads(m.group(1))
    _WG_GAMES_CACHE = (mtime, games)
    return games


def invalidate_wg_games_cache() -> None:
    global _WG_GAMES_CACHE
    _WG_GAMES_CACHE = None


def to_grid_item(game: dict, pip: str, *, big: bool = False) -> dict:
    gid = game.get("id") or ""
    cats = game.get("wgCategories") or game.get("categories") or []
    if isinstance(cats, list) and cats and isinstance(cats[0], str):
        cats = [c if c[0].isupper() else c.title() for c in cats]
    return {
        "id": gid,
        "name": game.get("name") or gid,
        "by": game.get("by") or "",
        "image": game.get("image") or f"/assets/img/wg/{gid}/thumbnail.webp",
        "url": game.get("url") or f"/game/{gid}.html",
        "c": game.get("c") or "#6366f1",
        "pip": pip,
        "cats": cats if isinstance(cats, list) else [],
        "preview": game.get("preview") or "",
        "big": bool(big),
    }


def pick_by_ids(games_by_id: dict[str, dict], ids: list[str], pip: str) -> list[dict]:
    out: list[dict] = []
    seen: set[str] = set()
    for gid in ids:
        g = games_by_id.get(gid)
        if not g or gid in seen:
            continue
        seen.add(gid)
        out.append(to_grid_item(g, pip))
    return out


def fill_round_robin(
    games_by_id: dict[str, dict],
    *,
    pip: str,
    limit: int,
    seen: set[str],
    prefer_cats: list[str] | None = None,
) -> list[dict]:
    prefer_cats = prefer_cats or FEATURED_CATS
    buckets: dict[str, list[dict]] = {c: [] for c in prefer_cats}
    fallback: list[dict] = []

    for g in games_by_id.values():
        gid = g.get("id")
        if not gid or gid in seen:
            continue
        cats = g.get("wgCategories") or []
        placed = False
        for cat in prefer_cats:
            if cat in cats:
                buckets[cat].append(g)
                placed = True
                break
        if not placed:
            fallback.append(g)

    out: list[dict] = []
    idx = 0
    while len(out) < limit:
        added = False
        for cat in prefer_cats:
            if idx < len(buckets[cat]):
                g = buckets[cat][idx]
                gid = g["id"]
                if gid not in seen:
                    seen.add(gid)
                    out.append(to_grid_item(g, pip))
                    added = True
                    if len(out) >= limit:
                        break
        if not added:
            break
        idx += 1

    for g in fallback:
        if len(out) >= limit:
            break
        gid = g.get("id")
        if not gid or gid in seen:
            continue
        seen.add(gid)
        out.append(to_grid_item(g, pip))

    for g in games_by_id.values():
        if len(out) >= limit:
            break
        gid = g.get("id")
        if not gid or gid in seen:
            continue
        seen.add(gid)
        out.append(to_grid_item(g, pip))

    return out[:limit]


def build_trending(games: list[dict], games_by_id: dict[str, dict]) -> list[dict]:
    featured = parse_featured_ids("trending")
    out = pick_by_ids(games_by_id, featured, "hot")
    if featured:
        return out
    seen: set[str] = set(g["id"] for g in out)
    out.extend(
        fill_round_robin(
            games_by_id,
            pip="hot",
            limit=TRENDING_LIMIT,
            seen=seen,
        )
    )
    return out[:TRENDING_LIMIT]


def build_new(games: list[dict], games_by_id: dict[str, dict], trending_ids: set[str]) -> list[dict]:
    featured = parse_featured_ids("new")
    out = pick_by_ids(games_by_id, featured, "new")
    if featured:
        if out and not any(x.get("big") for x in out):
            out[0]["big"] = True
        return out
    seen: set[str] = set(trending_ids)
    out = pick_by_ids(games_by_id, featured, "new")
    seen.update(g["id"] for g in out)

    # Prefer recent catalog tail (import order), then picks not in trending
    picks = parse_featured_ids("picks")
    for gid in picks:
        if len(out) >= NEW_LIMIT:
            break
        if gid in seen:
            continue
        g = games_by_id.get(gid)
        if g:
            seen.add(gid)
            out.append(to_grid_item(g, "new"))

    for g in reversed(games):
        if len(out) >= NEW_LIMIT:
            break
        gid = g.get("id")
        if not gid or gid in seen:
            continue
        seen.add(gid)
        out.append(to_grid_item(g, "new"))

    if out and not any(x.get("big") for x in out):
        out[0]["big"] = True

    return out[:NEW_LIMIT]


def build_top_rated(
    games_by_id: dict[str, dict],
    trending_ids: set[str],
) -> list[dict]:
    featured = parse_featured_ids("topRated")
    out = pick_by_ids(games_by_id, featured, "top")
    if featured:
        return out
    seen: set[str] = set(g["id"] for g in out)

    def add_game(g: dict) -> bool:
        gid = g.get("id")
        if not gid or gid in seen:
            return False
        seen.add(gid)
        out.append(to_grid_item(g, "top"))
        return True

    for cat in FEATURED_CATS:
        count = 0
        for gid in trending_ids:
            if count >= PER_CAT_TOP or len(out) >= TOP_LIMIT:
                break
            g = games_by_id.get(gid)
            if g and cat in (g.get("wgCategories") or []):
                if add_game(g):
                    count += 1
        for g in games_by_id.values():
            if count >= PER_CAT_TOP or len(out) >= TOP_LIMIT:
                break
            if cat not in (g.get("wgCategories") or []):
                continue
            if add_game(g):
                count += 1

    if len(out) < TOP_LIMIT:
        for item in fill_round_robin(
            games_by_id,
            pip="top",
            limit=TOP_LIMIT,
            seen=seen,
        ):
            out.append(item)
            if len(out) >= TOP_LIMIT:
                break

    return out[:TOP_LIMIT]


def parse_hidden_ids() -> list[str]:
    if not FEATURED_JS.is_file():
        return []
    text = FEATURED_JS.read_text(encoding="utf-8")
    m = re.search(r"window\.MM_HIDDEN\s*=\s*\[(.*?)\]\s*;", text, re.S)
    if not m:
        return []
    return re.findall(r"'([^']+)'", m.group(1))


def load_featured() -> dict[str, list[str]]:
    global _FEATURED_CACHE
    mtime = FEATURED_JS.stat().st_mtime if FEATURED_JS.is_file() else 0.0
    if _FEATURED_CACHE and _FEATURED_CACHE[0] == mtime:
        return {
            k: list(v) for k, v in _FEATURED_CACHE[1].items()
        }
    hidden = set(parse_hidden_ids())
    data = {
        "trending": [i for i in parse_featured_ids("trending") if i not in hidden],
        "new": [i for i in parse_featured_ids("new") if i not in hidden],
        "topRated": [i for i in parse_featured_ids("topRated") if i not in hidden],
        "picks": [i for i in parse_featured_ids("picks") if i not in hidden],
    }
    _FEATURED_CACHE = (mtime, {k: list(v) for k, v in data.items()})
    return data


def invalidate_featured_cache() -> None:
    global _FEATURED_CACHE
    _FEATURED_CACHE = None


def format_id_list(ids: list[str]) -> str:
    if not ids:
        return ""
    return "\n".join(f"    '{gid}'," for gid in ids)


def parse_featured_sizes() -> dict[str, dict[str, str]]:
    """Parse MM_FEATURED_SIZE + legacy MM_FEATURED_BIG → {rail: {id: 'wide'|'xl'}}."""
    out: dict[str, dict[str, str]] = {
        "trending": {},
        "new": {},
        "topRated": {},
        "picks": {},
    }
    if not FEATURED_JS.is_file():
        return out
    text = FEATURED_JS.read_text(encoding="utf-8")

    # MM_FEATURED_SIZE = { trending: { 'id': 'xl', ... }, ... }
    m = re.search(r"window\.MM_FEATURED_SIZE\s*=\s*\{(.*?)\n\};", text, re.S)
    if m:
        block = m.group(1)
        for key in out:
            km = re.search(rf"{re.escape(key)}\s*:\s*\{{(.*?)\}}", block, re.S)
            if not km:
                continue
            for gid, size in re.findall(r"'([^']+)'\s*:\s*'([^']+)'", km.group(1)):
                if size in ("wide", "xl"):
                    out[key][gid] = size

    # Legacy MM_FEATURED_BIG = { trending: ['id'], ... } → xl
    m2 = re.search(r"window\.MM_FEATURED_BIG\s*=\s*\{(.*?)\n\};", text, re.S)
    if m2:
        block = m2.group(1)
        for key in out:
            km = re.search(rf"{re.escape(key)}\s*:\s*\[(.*?)\]", block, re.S)
            if not km:
                continue
            for gid in re.findall(r"'([^']+)'", km.group(1)):
                out[key].setdefault(gid, "xl")

    return out


def format_size_map(sizes: dict[str, dict[str, str]], featured: dict[str, list[str]]) -> str:
    """Only keep sizes for ids that are still pinned."""
    lines: list[str] = []
    for key in ("trending", "new", "topRated", "picks"):
        pinned = set(featured.get(key) or [])
        rail = {
            gid: size
            for gid, size in (sizes.get(key) or {}).items()
            if gid in pinned and size in ("wide", "xl")
        }
        if not rail:
            continue
        inner = "\n".join(f"    '{gid}': '{size}'," for gid, size in rail.items())
        lines.append(f"  {key}: {{\n{inner}\n  }},")
    if not lines:
        return ""
    return "\n".join(lines)


def write_featured(
    featured: dict[str, list[str]],
    *,
    hidden: list[str] | None = None,
    sizes: dict[str, dict[str, str]] | None = None,
) -> None:
    from datetime import datetime, timezone

    if hidden is None:
        hidden = parse_hidden_ids()
    if sizes is None:
        sizes = parse_featured_sizes()
    # de-dupe, stable order
    seen: set[str] = set()
    hidden_clean: list[str] = []
    for gid in hidden:
        if gid and gid not in seen:
            seen.add(gid)
            hidden_clean.append(gid)
    hidden_set = set(hidden_clean)

    def clean(ids: list[str]) -> list[str]:
        return [i for i in (ids or []) if i and i not in hidden_set]

    trending = clean(featured.get("trending") or [])
    new = clean(featured.get("new") or [])
    top_rated = clean(featured.get("topRated") or [])
    picks = clean(featured.get("picks") or [])
    cleaned_featured = {
        "trending": trending,
        "new": new,
        "topRated": top_rated,
        "picks": picks,
    }
    size_block = format_size_map(sizes or {}, cleaned_featured)
    version = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    body = (
        "/*\n"
        " * Featured games — pin games on homepage rails & site-wide picks.\n"
        " * Edit in admin panel (python3 scripts/admin-server.py) or here.\n"
        " * MM_HIDDEN = broken / unpublished games — excluded from rails, catalog, grids.\n"
        " * MM_FEATURED_SIZE: wide=2× (2 cols), xl=4× (2×2).\n"
        " */\n"
        f"window.MM_CONFIG_VERSION = '{version}';\n"
        "window.MM_HIDDEN = [\n"
        f"{format_id_list(hidden_clean)}\n"
        "];\n"
        "window.MM_FEATURED = {\n"
        "  trending: [\n"
        f"{format_id_list(trending)}\n"
        "  ],\n"
        "  new: [\n"
        f"{format_id_list(new)}\n"
        "  ],\n"
        "  topRated: [\n"
        f"{format_id_list(top_rated)}\n"
        "  ],\n"
        "  picks: [\n"
        f"{format_id_list(picks)}\n"
        "  ],\n"
        "};\n"
    )
    if size_block:
        body += (
            "\nwindow.MM_FEATURED_SIZE = {\n"
            f"{size_block}\n"
            "};\n"
        )
    FEATURED_JS.write_text(body, encoding="utf-8")
    invalidate_featured_cache()


def set_hidden_ids(ids: list[str], *, sync_grids: bool = True) -> dict:
    """Replace MM_HIDDEN and drop those ids from featured pins."""
    featured = {
        "trending": parse_featured_ids("trending"),
        "new": parse_featured_ids("new"),
        "topRated": parse_featured_ids("topRated"),
        "picks": parse_featured_ids("picks"),
    }
    write_featured(featured, hidden=ids, sizes=parse_featured_sizes())
    if sync_grids:
        grids = build_home_grids()
        write_home_grids(grids)
        return {
            "hidden": len(parse_hidden_ids()),
            "trending": len(grids["trending"]),
            "new": len(grids["new"]),
            "topRated": len(grids["topRated"]),
        }
    return {"hidden": len(parse_hidden_ids())}


def load_classic_games() -> list[dict]:
    """Slim classic list from assets/js/games.js for admin picker."""
    path = ROOT / "assets/js/games.js"
    if not path.is_file():
        return []
    text = path.read_text(encoding="utf-8")
    # Prefer exported MM_CLASSIC_GAMES shape if present after runtime — parse const games array ids.
    ids = re.findall(
        r"\{\s*id:\s*'([^']+)'\s*,\s*name:\s*(\"(?:\\.|[^\"])*\"|'(?:\\.|[^'])*')\s*,\s*image:\s*'([^']+)'\s*,\s*categories:\s*\[([^\]]*)\]",
        text,
    )
    out: list[dict] = []
    seen: set[str] = set()
    for gid, name_raw, image, cats_raw in ids:
        if gid in seen:
            continue
        seen.add(gid)
        try:
            name = json.loads(name_raw) if name_raw.startswith('"') else name_raw.strip("'")
        except Exception:
            name = gid
        cats = re.findall(r"'([^']+)'", cats_raw)
        img = image.replace("../", "/")
        if not img.startswith("/"):
            img = "/" + img
        out.append(
            {
                "id": gid,
                "name": name,
                "by": "Classic",
                "image": img,
                "url": f"/game/{gid}.html",
                "c": "#6366f1",
                "cats": cats,
                "source": "classic",
            }
        )
    return out


def save_featured_and_sync(
    featured: dict[str, list[str]],
    *,
    sizes: dict[str, dict[str, str]] | None = None,
) -> dict:
    write_featured(featured, sizes=sizes)
    grids = build_home_grids()
    write_home_grids(grids)
    return {
        "trending": len(grids["trending"]),
        "new": len(grids["new"]),
        "topRated": len(grids["topRated"]),
    }


def slim_home_game(game: dict) -> dict:
    gid = game.get("id") or ""
    return {
        "id": gid,
        "name": game.get("name") or gid,
        "by": game.get("by") or "",
        "image": game.get("image") or f"/assets/img/wg/{gid}/thumbnail.webp",
        "url": game.get("url") or f"/game/{gid}.html",
        "c": game.get("c") or "#6366f1",
        "categories": game.get("categories") or [],
        "wgCategories": game.get("wgCategories") or game.get("cats") or [],
    }


def build_home_slim_catalog(
    games_by_id: dict[str, dict], grids: dict
) -> list[dict]:
    """Slim catalog for home + WG game pages (avoids full wg-games.js ~200KB)."""
    needed: list[str] = []
    seen: set[str] = set()

    def add(gid: str | None) -> None:
        if gid and gid not in seen:
            seen.add(gid)
            needed.append(gid)

    for key in ("trending", "new", "topRated", "picks"):
        for gid in parse_featured_ids(key):
            add(gid)
    for key in ("trending", "new", "topRated"):
        for item in grids.get(key) or []:
            add(item.get("id"))

    # Round-robin per WG category so related rails stay useful on game pages.
    cat_buckets: dict[str, list[str]] = {}
    for gid, g in games_by_id.items():
        for cat in g.get("wgCategories") or []:
            if not isinstance(cat, str) or not cat:
                continue
            cat_buckets.setdefault(cat, []).append(gid)

    idx = 0
    while len(needed) < BROWSE_CATALOG_CAP:
        added = False
        for cat, ids in cat_buckets.items():
            if idx >= PER_CAT_BROWSE:
                continue
            if idx >= len(ids):
                continue
            before = len(needed)
            add(ids[idx])
            if len(needed) > before:
                added = True
            if len(needed) >= BROWSE_CATALOG_CAP:
                break
        if not added:
            break
        idx += 1

    out: list[dict] = []
    for gid in needed:
        g = games_by_id.get(gid)
        if g:
            out.append(slim_home_game(g))
            continue
        # Fall back to grid item shape if catalog entry missing
        for key in ("trending", "new", "topRated"):
            for item in grids.get(key) or []:
                if item.get("id") == gid:
                    out.append(
                        slim_home_game(
                            {
                                "id": gid,
                                "name": item.get("name"),
                                "by": item.get("by"),
                                "image": item.get("image"),
                                "url": item.get("url"),
                                "c": item.get("c"),
                                "wgCategories": item.get("cats") or [],
                            }
                        )
                    )
                    break
    return out


def build_home_grids() -> dict:
    games = load_wg_games()
    hidden = set(parse_hidden_ids())
    games = [g for g in games if g.get("id") and g["id"] not in hidden]
    games_by_id = {g["id"]: g for g in games if g.get("id")}
    trending = build_trending(games, games_by_id)
    trending_ids = {g["id"] for g in trending}
    new = build_new(games, games_by_id, trending_ids)
    top_rated = build_top_rated(games_by_id, trending_ids)
    return {"trending": trending, "new": new, "topRated": top_rated}


def write_home_grids(grids: dict) -> None:
    from datetime import datetime, timezone

    games = load_wg_games()
    hidden = set(parse_hidden_ids())
    games_by_id = {
        g["id"]: g for g in games if g.get("id") and g["id"] not in hidden
    }
    slim = build_home_slim_catalog(games_by_id, grids)
    slim = [g for g in slim if g.get("id") not in hidden]
    version = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    body = (
        "/* Auto-generated — run: python3 scripts/sync-home-grids.py */\n"
        "(function () {\n"
        f"  window.MM_GRIDS_VERSION = '{version}';\n"
        f"  var grids = {json.dumps(grids, ensure_ascii=False)};\n"
        "  window.__WG_GRIDS_HOME__ = grids;\n"
        f"  window.WG_GAMES_HOME = {json.dumps(slim, ensure_ascii=False)};\n"
        "})();\n"
    )
    OUT_WG_GRIDS_JS.write_text(body, encoding="utf-8")
