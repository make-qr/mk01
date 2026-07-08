#!/usr/bin/env python3
"""Import WGPlayground catalog into MonkeyMart.one (3t)."""
from __future__ import annotations

import html
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
WG_ROOT = Path("/home/vananh/huong-dan/he-thong-du-an/01_Game/wgplayground-clone")
WG_CATALOG_JS = WG_ROOT / "assets/js/wg-catalog.js"
WG_GRIDS_JS = WG_ROOT / "assets/js/wg-grids-data.js"
WG_IMAGES = WG_ROOT / "assets/images/games"

OUT_GAME_DIR = ROOT / "game"
OUT_IMG_DIR = ROOT / "assets/img/wg"
OUT_WG_GAMES_JS = ROOT / "assets/js/wg-games.js"
OUT_WG_GRIDS_JS = ROOT / "assets/js/wg-grids-home.js"
OUT_WG_BY_ID_JS = ROOT / "assets/js/wg-games-by-id.js"

BASE_URL = "https://monkeymart.one"

ADSENSE_SNIPPET = (
    '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4151519079019358"\n'
    '     crossorigin="anonymous"></script>'
)

FEATURED_CATS = ["Action", "Puzzles", "Cars", "Casual", "Arcade"]
PER_CAT_TOP = 4

WG_TO_MM = {
    "Action": "action",
    "Puzzles": "puzzle",
    "Casual": "casual",
    "Cars": "racing",
    "Simulation": "simulation",
    "Military & War": "action",
    "Multiplayer": "multiplayer",
    "Arcade": "arcade",
    "Cooking & Food": "casual",
    "Art": "casual",
    "Strategy": "strategy",
    "Card & Board": "board",
    "Educational": "educational",
    "2Players": "multiplayer",
    "Horror": "horror",
    "Sports": "sports",
    "Racing": "racing",
    "Idle": "idle",
    "Runner": "runner",
    "Tower Defense": "tower-defense",
    "Music": "music",
    "IO": "io",
    "Sandbox": "sandbox",
    "Adventure": "adventure",
}


def loads_lenient(s: str) -> dict:
    out: list[str] = []
    in_str = False
    esc = False
    for ch in s:
        if esc:
            out.append(ch)
            esc = False
            continue
        if ch == "\\":
            out.append(ch)
            esc = True
            continue
        if ch == '"':
            in_str = not in_str
            out.append(ch)
            continue
        if in_str and ch in "\n\r":
            out.append(" ")
            continue
        out.append(ch)
    return json.loads("".join(out))


def extract_json_object(text: str, marker: str) -> dict:
    start = text.find(marker)
    if start == -1:
        raise ValueError(f"{marker!r} not found")
    i = text.find("{", start)
    if i == -1:
        raise ValueError(f"JSON object missing after {marker!r}")
    depth = 0
    for j in range(i, len(text)):
        ch = text[j]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(text[i : j + 1])
                except json.JSONDecodeError:
                    return loads_lenient(text[i : j + 1])
    raise ValueError(f"Unclosed JSON object for {marker!r}")


def slug_from_path(path: str) -> str:
    return path.strip("/").replace("/", "-")


def map_cats(wg_cats: list[str] | None) -> list[str]:
    result: list[str] = []
    for c in wg_cats or []:
        mm = WG_TO_MM.get(c)
        if mm and mm not in result:
            result.append(mm)
    return result or ["casual"]


def parse_catalog() -> tuple[dict, dict]:
    text = WG_CATALOG_JS.read_text(encoding="utf-8")
    catalog = extract_json_object(text, "window.WGP_CATALOG = ")
    try:
        by_pub = extract_json_object(text, "window.WGP_BY_PUBLISHER = ")
    except ValueError:
        by_pub = {}
    return catalog, by_pub


def parse_grids() -> dict:
    if not WG_GRIDS_JS.is_file():
        return {"trending": [], "new": []}
    text = WG_GRIDS_JS.read_text(encoding="utf-8")
    m = re.search(r"var grids = (\{.*?\});", text, re.S)
    if not m:
        return {"trending": [], "new": []}
    return json.loads(m.group(1))


def wg_url_to_slug(url: str, routes: dict[str, str]) -> str:
    if url in routes:
        return Path(routes[url]).stem
    m = re.search(r"/game/(.+?)/?$", url or "")
    if m:
        return m.group(1).replace("/", "-")
    return ""


def load_routes(catalog: dict) -> dict[str, str]:
    routes_js = WG_ROOT / "assets/js/game-routes.js"
    if routes_js.is_file():
        text = routes_js.read_text(encoding="utf-8")
        m = re.search(r"window\.WGP_GAME_ROUTES\s*=\s*(\{.*?\});", text, re.S)
        if m:
            raw = json.loads(m.group(1))
            return {k: Path(v).name for k, v in raw.items()}
    return {g.get("url", ""): f"{slug_from_path(path)}.html" for path, g in catalog.items()}


def copy_thumbnails(catalog: dict, *, dry_run: bool = False) -> int:
    copied = 0
    for path, game in catalog.items():
        if not game.get("ifr"):
            continue
        slug = slug_from_path(path)
        src_dir = WG_IMAGES / slug
        dest_dir = OUT_IMG_DIR / slug
        if not src_dir.is_dir():
            continue
        if dry_run:
            copied += 1
            continue
        dest_dir.mkdir(parents=True, exist_ok=True)
        for name in ("thumbnail.webp", "og.webp", "source.jpg"):
            src = src_dir / name
            if src.is_file():
                shutil.copy2(src, dest_dir / name)
        copied += 1
    return copied


def local_thumb(slug: str) -> str:
    return f"/assets/img/wg/{slug}/thumbnail.webp"


def local_page(slug: str) -> str:
    return f"/game/{slug}.html"


def grid_item_local(item: dict, routes: dict[str, str], catalog: dict) -> dict:
    slug = wg_url_to_slug(item.get("url", ""), routes)
    if not slug and item.get("url"):
        m = re.search(r"/game/(.+?)/?$", item["url"])
        if m:
            slug = m.group(1).replace("/", "-")
    path = slug.replace("-", "/", 1) if "/" not in slug else None
    # try find in catalog by slug
    entry = None
    for p, g in catalog.items():
        if slug_from_path(p) == slug:
            entry = g
            break
    img = local_thumb(slug) if slug else item.get("img", "")
    if entry and (OUT_IMG_DIR / slug / "thumbnail.webp").is_file():
        img = local_thumb(slug)
    return {
        "id": slug,
        "name": item.get("name") or (entry or {}).get("name", ""),
        "by": item.get("by") or (entry or {}).get("by", ""),
        "image": img,
        "url": local_page(slug),
        "c": item.get("c") or (entry or {}).get("c", "#6366f1"),
        "pip": item.get("pip", ""),
        "cats": item.get("cats") or (entry or {}).get("cats", []),
        "preview": item.get("preview", ""),
        "big": bool(item.get("big")),
    }


def build_top_rated(catalog: dict, trending_slugs: set[str]) -> list[dict]:
    picked: list[dict] = []
    seen: set[str] = set()

    def add_game(path: str, game: dict) -> None:
        slug = slug_from_path(path)
        if slug in seen or not game.get("ifr"):
            return
        seen.add(slug)
        picked.append(
            {
                "id": slug,
                "name": game["name"],
                "by": game.get("by", ""),
                "image": local_thumb(slug),
                "url": local_page(slug),
                "c": game.get("c", "#6366f1"),
                "pip": "top",
                "cats": game.get("cats", []),
            }
        )

    for cat in FEATURED_CATS:
        count = 0
        # prefer trending in this category first
        for path, game in catalog.items():
            if count >= PER_CAT_TOP:
                break
            if cat not in (game.get("cats") or []):
                continue
            slug = slug_from_path(path)
            if slug in seen:
                continue
            if slug in trending_slugs:
                add_game(path, game)
                count += 1
        for path, game in catalog.items():
            if count >= PER_CAT_TOP:
                break
            if cat not in (game.get("cats") or []):
                continue
            slug = slug_from_path(path)
            if slug in seen:
                continue
            add_game(path, game)
            count += 1
    return picked


def game_description(name: str, cats: list[str], pub: str) -> str:
    cat_text = ", ".join(cats[:2]).lower() if cats else "browser"
    return (
        f"Play {name} free online at MonkeyMart.one. "
        f"A {cat_text} game by {pub} — no download, works on desktop and mobile."
    )


CAT_SIDE_ICONS = {
    "Action": "fa-fire",
    "Puzzles": "fa-puzzle-piece",
    "Casual": "fa-dice",
    "Arcade": "fa-gamepad",
    "Simulation": "fa-vr-cardboard",
    "Cars": "fa-car-side",
    "Sports": "fa-futbol",
    "Strategy": "fa-chess",
    "Adventure": "fa-mountain-sun",
    "Horror": "fa-ghost",
    "Multiplayer": "fa-users",
}


def nav_menu_game(active: str = "games") -> str:
    games_active = ' class="active"' if active == "games" else ""
    classic_active = ' class="active"' if active == "classic" else ""
    return f"""<ul>
<li><a href="/"><i class="fas fa-home"></i> Home</a></li>
<li{games_active}><a href="../category/game.html"><i class="fas fa-gamepad"></i> All Games</a></li>
<li{classic_active}><a href="../category/classic.html"><i class="fas fa-clock-rotate-left"></i> Classic</a></li>
<li><a href="#" data-mm-surprise><i class="fas fa-dice"></i> Surprise me</a></li>
<li><a href="/blog/"><i class="fas fa-book"></i> Game Guides</a></li>
</ul>"""


def footer_html() -> str:
    return """<footer class="mm-footer">
<div class="mm-footer-inner">
<div class="mm-footer-top">
<div class="mm-footer-brand">
<div class="mm-footer-brand-logo"><a href="/"><img src="/assets/img/monkeymart.png" alt="Monkey Mart"/></a></div>
<p>Play free online games at MonkeyMart.one — no download, instant play on desktop and mobile. New titles added every week.</p>
<div class="mm-footer-social">
<a href="https://www.facebook.com/monkeymart.one" rel="nofollow" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
<a href="https://www.youtube.com/@MonkeyMart-k1d" rel="nofollow" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
</div>
</div>
<div class="mm-footer-col">
<h3>About</h3>
<ul>
<li><a href="/about.html">About Us</a></li>
<li><a href="/contact.html">Contact</a></li>
<li><a href="/faq.html">FAQ</a></li>
<li><a href="/blog/">Blog</a></li>
</ul>
</div>
<div class="mm-footer-col">
<h3>Quick Links</h3>
<ul>
<li><a href="/">Home</a></li>
<li><a href="/category/game.html">All Games</a></li>
<li><a href="/category/classic.html">Classic Games</a></li>
<li><a href="/blog/">Game Guides</a></li>
</ul>
</div>
<div class="mm-footer-col">
<h3>Legal</h3>
<ul>
<li><a href="/terms.html">Terms of Service</a></li>
<li><a href="/privacy.html">Privacy Policy</a></li>
<li><a href="/cookie-policy.html">Cookie Policy</a></li>
<li><a href="/disclaimer.html">Disclaimer</a></li>
</ul>
</div>
</div>
<div class="mm-footer-cats">
<div class="mm-footer-cats-head">
<h3><i class="fas fa-layer-group"></i>Game Categories</h3>
<a class="mm-footer-cats-all" href="/category/game.html">View all games →</a>
</div>
<nav class="mm-footer-cats-grid" aria-label="Game categories">
<a class="mm-cat-chip" href="/category/game.html?cat=Puzzles"><i class="fas fa-puzzle-piece"></i>Puzzles</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Casual"><i class="fas fa-dice"></i>Casual</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Arcade"><i class="fas fa-gamepad"></i>Arcade</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Action"><i class="fas fa-person-running"></i>Action</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Simulation"><i class="fas fa-vr-cardboard"></i>Simulation</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Card%20%26%20Board"><i class="fas fa-chess-board"></i>Card & Board</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Adventure"><i class="fas fa-mountain-sun"></i>Adventure</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Dress-up%20and%20Fashion"><i class="fas fa-shirt"></i>Dress-up and Fashion</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Art"><i class="fas fa-palette"></i>Art</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Beauty"><i class="fas fa-wand-magic-sparkles"></i>Beauty</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Cars"><i class="fas fa-car-side"></i>Cars</a>
<a class="mm-cat-chip" href="/category/game.html?cat=2Players"><i class="fas fa-user-group"></i>2Players</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Strategy"><i class="fas fa-chess"></i>Strategy</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Sports"><i class="fas fa-futbol"></i>Sports</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Platformer"><i class="fas fa-shoe-prints"></i>Platformer</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Educational"><i class="fas fa-graduation-cap"></i>Educational</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Multiplayer"><i class="fas fa-users"></i>Multiplayer</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Military%20%26%20War"><i class="fas fa-jet-fighter"></i>Military & War</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Horror"><i class="fas fa-ghost"></i>Horror</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Cooking%20%26%20Food"><i class="fas fa-utensils"></i>Cooking & Food</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Quiz%20%26%20Trivia"><i class="fas fa-circle-question"></i>Quiz & Trivia</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Fantasy"><i class="fas fa-hat-wizard"></i>Fantasy</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Role-Playing%20(RPG)"><i class="fas fa-dragon"></i>Role-Playing (RPG)</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Mystery"><i class="fas fa-magnifying-glass"></i>Mystery</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Sandbox"><i class="fas fa-cubes"></i>Sandbox</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Airplane"><i class="fas fa-plane"></i>Airplane</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Real-Time%20Tactics"><i class="fas fa-chess-knight"></i>Real-Time Tactics</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Rhythm%20(Dance%20%26%20Music)"><i class="fas fa-music"></i>Rhythm (Dance & Music)</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Pet%20%26%20Animal"><i class="fas fa-paw"></i>Pet & Animal</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Social"><i class="fas fa-comments"></i>Social</a>
<a class="mm-cat-chip" href="/category/game.html?cat=Politics%20%26%20Government"><i class="fas fa-landmark"></i>Politics & Government</a>
</nav>
</div>
</div>
<div class="mm-footer-bottom"><p>© 2025 Monkey Mart. All rights reserved.</p></div>
</footer>"""


def build_game_page(slug: str, game: dict, related: list[dict]) -> str:
    del related  # picks rendered by mm-engage.js
    name = game["name"]
    pub = game.get("by", "Publisher")
    ifr = game["ifr"]
    thumb = local_thumb(slug)
    og = f"/assets/img/wg/{slug}/og.webp"
    if not (ROOT / og.lstrip("/")).is_file():
        og = thumb
    cats = game.get("cats") or []
    mm_cats = map_cats(cats)
    desc = game_description(name, cats, pub)
    page_url = f"{BASE_URL}/game/{slug}.html"
    keywords = f"{name.lower()}, play {name.lower()} free, {name.lower()} online, monkeymart.one, browser game"
    primary_cat = cats[0] if cats else "Casual"
    side_icon = CAT_SIDE_ICONS.get(primary_cat, "fa-fire")

    cat_chips = ""
    for c in (cats[:4] or ["Casual"]):
        cat_chips += (
            f'<a class="mm-tag mm-tag-link" href="../category/game.html?cat={quote(c)}">'
            f"{html.escape(c)}</a>"
        )

    breadcrumb_cat = ""
    if cats:
        c0 = cats[0]
        breadcrumb_cat = (
            f'<span class="breadcrumb-sep" aria-hidden="true">/</span>'
            f'<a href="../category/game.html?cat={quote(c0)}">{html.escape(c0)}</a>'
        )

    more_cat_link = ""
    if cats:
        more_cat_link = (
            f'<a href="../category/game.html?cat={quote(cats[0])}">'
            f"More {html.escape(cats[0])} games</a> · "
        )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{html.escape(name)} - Play Online Free | MonkeyMart.one</title>
<meta name="description" content="{html.escape(desc[:300])}"/>
<meta name="keywords" content="{html.escape(keywords)}"/>
<meta property="og:title" content="{html.escape(name)} - Play Online Free | MonkeyMart.one"/>
<meta property="og:description" content="{html.escape(desc[:300])}"/>
<meta property="og:image" content="{BASE_URL}{og}"/>
<meta property="og:url" content="{page_url}"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{html.escape(name)} - Play Online Free"/>
<meta name="twitter:description" content="{html.escape(desc[:300])}"/>
<meta name="twitter:image" content="{BASE_URL}{og}"/>
<link rel="canonical" href="{page_url}"/>
<meta name="robots" content="index, follow"/>
<script type="application/ld+json">
{json.dumps({
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": name,
  "description": desc[:300],
  "url": page_url,
  "image": f"{BASE_URL}{og}",
  "genre": cats[:3] if cats else ["Casual"],
  "gamePlatform": "Web Browser",
  "applicationCategory": "Game",
  "operatingSystem": "Any",
  "playMode": "SinglePlayer",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock"},
  "publisher": {"@type": "Organization", "name": pub},
}, indent=2)}
</script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"/>
<link href="../assets/css/style.css" rel="stylesheet"/>
<link href="../assets/css/wg-grids.css" rel="stylesheet"/>
{ADSENSE_SNIPPET}
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SWBWGBV5PB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-SWBWGBV5PB');
</script>
<script>
window.MM_CURRENT_GAME = {json.dumps({
  "id": slug,
  "name": name,
  "by": pub,
  "image": thumb,
  "ifr": ifr,
  "categories": mm_cats,
  "wgCategories": cats,
  "url": f"/game/{slug}.html",
}, ensure_ascii=False)};
</script>
</head>
<body>
<button class="menu-toggle" id="menu-toggle"><i class="fas fa-bars"></i></button>
<div class="menu-overlay" id="menu-overlay"></div>
<div class="main-wrapper">
<main class="main-content">
<header class="header">
<div class="container">
<div class="header-content">
<div class="logo"><a href="/"><img alt="Monkey Mart Logo" src="../assets/img/monkeymart.png"/></a></div>
<nav class="nav-menu">
{nav_menu_game("games")}
</nav>
</div>
</div>
</header>
<nav class="breadcrumb-nav" aria-label="Breadcrumb">
<div class="breadcrumb-container">
<a href="/">Home</a>
<span class="breadcrumb-sep" aria-hidden="true">/</span>
<a href="../category/game.html">All Games</a>
{breadcrumb_cat}
<span class="breadcrumb-sep" aria-hidden="true">/</span>
<span class="breadcrumb-current" aria-current="page">{html.escape(name)}</span>
</div>
</nav>

<section class="wg-game-layout wg-game-layout--cols wg-compact">
<div class="wg-stage-row">
<aside class="wg-side-rail wg-side-rail--left" aria-label="Similar games">
<h3 class="wg-side-rail-title"><i class="fas {side_icon}"></i> {html.escape(primary_cat)} picks</h3>
<div class="wg-side-rail-track" id="mm-side-left"></div>
</aside>
<div class="wg-stage-center">
<div class="wg-player-wrap" id="mm-player">
<div class="game-thumbnail">
<img src="..{thumb}" alt="{html.escape(name)}" loading="eager"/>
<button class="play-frame-button" id="playGameButton" type="button">
<i class="fas fa-play"></i> Play Game
</button>
</div>
<iframe
  allow="fullscreen; autoplay"
  allowfullscreen
  id="game-frame"
  data-src="https://play.wgplayground.com/ifr/{ifr}"
  style="display: none;"
  title="{html.escape(name)}"></iframe>
<div class="loading-overlay" style="display: none;">
<div class="loading-spinner"></div>
<div class="loading-text">Loading {html.escape(name)}...</div>
</div>
</div>
</div>
<aside class="wg-side-rail wg-side-rail--right" aria-label="Trending games">
<h3 class="wg-side-rail-title"><i class="fas fa-bolt"></i> Trending</h3>
<div class="wg-side-rail-track" id="mm-side-right"></div>
</aside>
</div>

<div class="wg-game-header">
<div class="wg-game-header-main">
<h1>{html.escape(name)}</h1>
<div class="wg-game-meta">
{cat_chips}
<span class="mm-publisher">by {html.escape(pub)}</span>
</div>
</div>
<div class="mm-action-bar">
<button class="mm-action-btn mm-like-btn" id="mm-like-btn" type="button" title="Add to favorites" aria-pressed="false"><i class="fas fa-heart"></i> Like</button>
<button class="mm-action-btn" id="share-btn" title="Share" type="button"><i class="fas fa-share-alt"></i> Share</button>
<button class="mm-action-btn" id="fullscreen-btn" title="Fullscreen" type="button"><i class="fas fa-expand"></i> Fullscreen</button>
<button class="mm-action-btn mm-action-btn--surprise" type="button" data-mm-surprise><i class="fas fa-dice"></i> Surprise me</button>
<div class="share-menu" id="share-menu">
<button class="control-btn" id="copy-link-btn" title="Copy Link" type="button"><i class="fas fa-link"></i></button>
<button class="control-btn" id="facebook-btn" title="Facebook" type="button"><i class="fab fa-facebook-f"></i></button>
<button class="control-btn" id="twitter-btn" title="Twitter" type="button"><i class="fab fa-twitter"></i></button>
<button class="control-btn" id="pinterest-btn" title="Pinterest" type="button"><i class="fab fa-pinterest-p"></i></button>
</div>
</div>
</div>

<section class="mm-rail-section mm-rail-section--grid2" id="mm-related-section">
<h2 class="mm-rail-heading"><i class="fas fa-fire"></i> More like {html.escape(name)}</h2>
<div class="mm-rail-track mm-rail-track--grid2" id="mm-related-rail"></div>
</section>

<section class="mm-rail-section mm-rail-section--grid2">
<h2 class="mm-rail-heading"><i class="fas fa-bolt"></i> Trending now</h2>
<div class="mm-rail-track mm-rail-track--grid2" id="mm-trending-rail"></div>
</section>

<div class="wg-picks-section">
<h2 class="related-games-title">Popular picks</h2>
<div class="wg-picks-grid" id="mm-picks-grid"></div>
</div>

<section class="mm-rail-section mm-rail-section--grid2" id="mm-recent-section" hidden>
<h2 class="mm-rail-heading"><i class="fas fa-history"></i> Recently played</h2>
<div class="mm-rail-track mm-rail-track--grid2 mm-rail-track--personal" id="mm-recent-rail"></div>
</section>

<section class="mm-rail-section mm-rail-section--grid2" id="mm-favorites-section" hidden>
<h2 class="mm-rail-heading"><i class="fas fa-heart"></i> Your favorites</h2>
<div class="mm-rail-track mm-rail-track--grid2 mm-rail-track--personal" id="mm-favorites-rail"></div>
</section>

<div class="game-description">
<p>Play <strong>{html.escape(name)}</strong> free in your browser at MonkeyMart.one — no download required. Click <strong>Play Game</strong> above to load the game.</p>
<h2>How to Play {html.escape(name)}</h2>
<ul>
<li>Click the <strong>Play Game</strong> button on this page to start</li>
<li>Tap or click <strong>Play</strong> inside the game frame after it loads</li>
<li>Use fullscreen for the best experience on desktop</li>
<li>Works on mobile, tablet, and desktop browsers</li>
</ul>
<p class="guide-inline-links">{more_cat_link}<a href="../category/game.html">Browse all games</a> · <a href="/">Play Monkey Mart</a></p>
</div>
</section>

</main>
</div>
{footer_html()}
<div class="mm-suggest-modal" id="mm-suggest-modal" hidden aria-hidden="true">
<div class="mm-suggest-backdrop" data-mm-close></div>
<div class="mm-suggest-panel" role="dialog" aria-labelledby="mm-suggest-title">
<button class="mm-suggest-close" type="button" data-mm-close aria-label="Close">&times;</button>
<h2 id="mm-suggest-title">Try another game?</h2>
<p class="mm-suggest-lead">Players who enjoyed {html.escape(name)} also play these:</p>
<div class="mm-suggest-grid" id="mm-suggest-grid"></div>
<button class="mm-suggest-dismiss" type="button" data-mm-close>Keep playing</button>
</div>
</div>
<script src="../assets/js/main.js"></script>
<script src="../assets/js/game-controls.js"></script>
<script src="../assets/js/wg-grids-home.js"></script>
<script src="../assets/js/wg-featured.js"></script>
<script src="../assets/js/wg-games.js"></script>
<script src="../assets/js/mm-engage.js"></script>
</body>
</html>
"""


def pick_related(path: str, game: dict, catalog: dict, by_pub: dict, limit: int = 12) -> list[dict]:
    pub = game.get("by", "")
    cat = (game.get("cats") or [None])[0]
    paths: list[str] = []
    for p in by_pub.get(pub, []):
        if p != path and catalog.get(p, {}).get("ifr"):
            paths.append(p)
    for p, g in catalog.items():
        if p == path or not g.get("ifr"):
            continue
        if cat and cat in (g.get("cats") or []) and p not in paths:
            paths.append(p)
    out = []
    for p in paths[:limit]:
        g = catalog[p]
        slug = slug_from_path(p)
        out.append(
            {
                "name": g["name"],
                "image": local_thumb(slug),
                "url": f"../game/{slug}.html",
            }
        )
    return out


def write_js_files(
    wg_games: list[dict],
    grids_home: dict,
    by_id: dict[str, dict],
) -> None:
    OUT_WG_GAMES_JS.write_text(
        "/* Auto-generated — run: python3 scripts/import-wg-games.py */\n"
        f"window.WG_GAMES = {json.dumps(wg_games, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    OUT_WG_GRIDS_JS.write_text(
        "/* Auto-generated — run: python3 scripts/import-wg-games.py */\n"
        "(function () {\n"
        f"  var grids = {json.dumps(grids_home, ensure_ascii=False)};\n"
        "  window.__WG_GRIDS_HOME__ = grids;\n"
        "})();\n",
        encoding="utf-8",
    )
    OUT_WG_BY_ID_JS.write_text(
        "/* Auto-generated */\n"
        f"window.WG_GAMES_BY_ID = {json.dumps(by_id, ensure_ascii=False)};\n",
        encoding="utf-8",
    )


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    if not WG_CATALOG_JS.is_file():
        raise SystemExit(f"WG catalog not found: {WG_CATALOG_JS}")

    catalog, by_pub = parse_catalog()
    raw_grids = parse_grids()
    routes = load_routes(catalog)

    print(f"Catalog: {len(catalog)} games")
    thumb_count = copy_thumbnails(catalog, dry_run=dry_run)
    print(f"Thumbnails: {thumb_count}")

    wg_games: list[dict] = []
    by_id: dict[str, dict] = {}
    page_count = 0
    skip_no_ifr = 0

    trending_local = [
        grid_item_local(item, routes, catalog) for item in raw_grids.get("trending", [])
    ]
    new_local = [grid_item_local(item, routes, catalog) for item in raw_grids.get("new", [])]
    trending_slugs = {g["id"] for g in trending_local if g.get("id")}
    top_rated = build_top_rated(catalog, trending_slugs)

    grids_home = {
        "trending": [g for g in trending_local if g.get("id")],
        "new": [g for g in new_local if g.get("id")],
        "topRated": top_rated,
    }

    OUT_GAME_DIR.mkdir(parents=True, exist_ok=True)
    OUT_IMG_DIR.mkdir(parents=True, exist_ok=True)

    for path, game in sorted(catalog.items()):
        ifr = game.get("ifr")
        if not ifr:
            skip_no_ifr += 1
            continue
        slug = slug_from_path(path)
        mm_cats = map_cats(game.get("cats"))
        entry = {
            "id": slug,
            "name": game["name"],
            "by": game.get("by", ""),
            "image": local_thumb(slug),
            "categories": mm_cats,
            "wgCategories": game.get("cats") or [],
            "ifr": ifr,
            "url": local_page(slug),
            "c": game.get("c", "#6366f1"),
        }
        wg_games.append(entry)
        by_id[slug] = entry

        if not dry_run:
            related = pick_related(path, game, catalog, by_pub)
            related_for_page = [
                {"name": r["name"], "image": r["image"], "url": r["url"]} for r in related
            ]
            page_html = build_game_page(slug, game, related_for_page)
            (OUT_GAME_DIR / f"{slug}.html").write_text(page_html, encoding="utf-8")
            page_count += 1

    if not dry_run:
        write_js_files(wg_games, grids_home, by_id)

    print(f"Generated pages: {page_count} (skipped no-ifr: {skip_no_ifr})")
    print(f"WG_GAMES entries: {len(wg_games)}")
    print(
        f"Home grids — trending: {len(grids_home['trending'])}, "
        f"new: {len(grids_home['new'])}, topRated: {len(grids_home['topRated'])}"
    )
    if not dry_run:
        print(f"Wrote {OUT_WG_GAMES_JS}")
        print(f"Wrote {OUT_WG_GRIDS_JS}")


if __name__ == "__main__":
    main()
