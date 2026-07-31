#!/usr/bin/env python3
"""Import ubg98 / SlopeGame-family HTML5 games into MonkeyMart as classic pages."""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UBG_ROOT = Path("/home/vananh/clone/ubg98/github_ubg98")
CANDIDATES = ROOT / ".cache/ubg98-import-candidates.json"
IMG_DIR = ROOT / "assets/img/img-up"
GAME_DIR = ROOT / "game"
GAMES_JSON = ROOT / "game/games.json"
GAMES_JS = ROOT / "assets/js/games.js"
BASE_URL = "https://monkeymart.one"

import importlib.util

def _load_wg_import():
    path = ROOT / "scripts" / "import-wg-games.py"
    spec = importlib.util.spec_from_file_location("import_wg_games", path)
    if not spec or not spec.loader:
        raise SystemExit("Cannot load import-wg-games.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_wg = _load_wg_import()
footer_html = _wg.footer_html
nav_menu_game = _wg.nav_menu_game


def to_slug(repo: str) -> str:
    s = repo
    # Keep 3D / 2D glued as "3d" / "2d"
    s = re.sub(r"^(\d+)D(?=[A-Z])", r"\1d", s)
    s = re.sub(r"([a-z])([A-Z])", r"\1-\2", s)
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1-\2", s)
    s = re.sub(r"([A-Za-z])([0-9])", r"\1-\2", s)
    s = re.sub(r"([0-9])([A-Z])", r"\1-\2", s)
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def to_title(repo: str) -> str:
    s = re.sub(r"^(\d+)D(?=[A-Z])", r"\1D ", repo)
    s = re.sub(r"([a-z])([A-Z])", r"\1 \2", s)
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", s)
    s = re.sub(r"([A-Za-z])([0-9])", r"\1 \2", s)
    s = re.sub(r"([0-9])([A-Z])", r"\1 \2", s)
    return re.sub(r"\s+", " ", s).strip()


def pick_thumb(repo_dir: Path) -> Path | None:
    candidates = [
        repo_dir / "icons" / "icon-512.png",
        repo_dir / "icons" / "icon-256.png",
        repo_dir / "icons" / "icon-128.png",
        repo_dir / "favicon.png",
        repo_dir / "icon.png",
        repo_dir / "logo.png",
    ]
    for c in candidates:
        if c.is_file() and c.stat().st_size > 200:
            return c
    # largest png under images/icons shallow
    for folder in ("images", "img", "assets/images", "sprites"):
        d = repo_dir / folder
        if not d.is_dir():
            continue
        pngs = sorted(d.glob("*.png"), key=lambda p: -p.stat().st_size)
        for p in pngs[:5]:
            if p.stat().st_size > 2000 and "null" not in p.name.lower():
                return p
    ico = repo_dir / "favicon.ico"
    if ico.is_file() and ico.stat().st_size > 200:
        return ico
    return None


def ensure_thumb(repo: str, slug: str) -> str:
    """Copy best thumb into assets/img/img-up; return site path."""
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    src = pick_thumb(UBG_ROOT / repo)
    ext = ".png"
    if src:
        ext = src.suffix.lower() if src.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"} else ".png"
        dest = IMG_DIR / f"{slug}{ext}"
        if not dest.exists():
            try:
                shutil.copy2(src, dest)
            except Exception:
                dest = IMG_DIR / "monkey-mart-2.webp"
                return "/assets/img/img-up/monkey-mart-2.webp"
        return f"/assets/img/img-up/{slug}{ext}"
    # fallback
    return "/assets/img/img-up/monkey-mart-2.webp"


def guess_categories(title: str, repo: str) -> list[str]:
    blob = f"{title} {repo}".lower()
    cats: list[str] = []
    rules = [
        (("soccer", "basket", "football", "sport", "tennis", "bowling", "golf"), "sports"),
        (("puzzle", "match", "2048", "sort", "merge", "sudoku", "mahjong"), "puzzle"),
        (("race", "car", "drift", "drive", "moto", "road"), "racing"),
        (("shoot", "war", "tank", "gun", "battle", "clash"), "action"),
        (("run", "jump", "platform", "adventure"), "adventure"),
        (("sim", "idle", "tycoon", "clicker"), "simulation"),
        (("horror", "scary"), "horror"),
        (("board", "chess", "checkers", "card"), "board"),
    ]
    for keys, cat in rules:
        if any(k in blob for k in keys):
            cats.append(cat)
    if not cats:
        cats = ["arcade", "casual"]
    if "arcade" not in cats and "casual" not in cats:
        cats.append("casual")
    return cats[:3]


def render_page(game: dict) -> str:
    name = game["title"]
    slug = game["slug"]
    frame = game["frame_url"]
    thumb = game["image_path"]
    cats = game.get("categories") or ["casual"]
    desc = (
        f"Play {name} free online at MonkeyMart.one — no download. "
        f"Instant browser play on desktop and mobile."
    )
    page_url = f"{BASE_URL}/game/{slug}.html"
    thumb_abs = thumb if thumb.startswith("http") else f"{BASE_URL}{thumb}"
    thumb_rel = thumb if thumb.startswith("../") else (".." + thumb if thumb.startswith("/") else thumb)
    cat0 = cats[0].title() if cats else "Casual"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{name} - Play Online Free | MonkeyMart.one</title>
<meta name="description" content="{desc}"/>
<meta name="keywords" content="{name.lower()}, play {name.lower()} free, {name.lower()} online, monkeymart.one, unblocked"/>
<meta property="og:title" content="{name} - Play Online Free | MonkeyMart.one"/>
<meta property="og:description" content="{desc}"/>
<meta property="og:image" content="{thumb_abs}"/>
<meta property="og:url" content="{page_url}"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{name} - Play Online Free"/>
<meta name="twitter:description" content="{desc}"/>
<meta name="twitter:image" content="{thumb_abs}"/>
<link rel="canonical" href="{page_url}"/>
<meta name="robots" content="index, follow"/>
<link rel="dns-prefetch" href="https://ubg98.github.io"/>
<link rel="preload" as="image" href="{thumb}" fetchpriority="high"/>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" media="print" onload="this.media='all'"/>
<noscript><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"/></noscript>
<link href="../assets/css/style.css" rel="stylesheet"/>
<link href="../assets/css/wg-grids.css" rel="stylesheet"/>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SWBWGBV5PB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-SWBWGBV5PB');
</script>
<script type="application/ld+json">
{json.dumps({
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": name,
  "description": desc,
  "url": page_url,
  "image": thumb_abs,
  "genre": [cat0],
  "gamePlatform": "Web Browser",
  "applicationCategory": "Game",
  "operatingSystem": "Any",
  "playMode": "SinglePlayer",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock"},
}, indent=2)}
</script>
<script>
window.MM_CURRENT_GAME = {json.dumps({
  "id": slug,
  "name": name,
  "image": thumb,
  "url": f"/game/{slug}.html",
  "categories": cats,
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
<a href="../category/classic.html">Classic</a>
<span class="breadcrumb-sep" aria-hidden="true">/</span>
<span class="breadcrumb-current" aria-current="page">{name}</span>
</div>
</nav>

<section class="wg-game-layout wg-game-layout--cols wg-compact">
<div class="wg-stage-row">
<aside class="wg-side-rail wg-side-rail--left" aria-label="Similar games">
<h3 class="wg-side-rail-title"><i class="fas fa-gamepad"></i> Classic picks</h3>
<div class="wg-side-rail-track" id="mm-side-left"></div>
</aside>
<div class="wg-stage-center">
<div class="wg-player-wrap" id="mm-player">
<div class="game-thumbnail">
<img src="{thumb}" width="320" height="320" alt="{name}" fetchpriority="high" decoding="async"/>
<button class="play-frame-button" id="playGameButton" type="button"><i class="fas fa-play"></i> Play Game</button>
</div>
<iframe
  allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; gyroscope; accelerometer"
  allowfullscreen
  id="game-frame"
  data-src="{frame}"
  style="display: none;"
  title="{name}"></iframe>
<div class="loading-overlay" style="display: none;">
<div class="loading-spinner"></div>
<div class="loading-text">Loading {name}...</div>
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
<h1>{name}</h1>
<div class="wg-game-meta">
<span class="mm-tag">{cat0}</span>
<span class="mm-publisher">Classic HTML5</span>
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

<section class="mm-rail-section mm-rail-section--grid2">
<h2 class="mm-rail-heading"><i class="fas fa-fire"></i> More classic games</h2>
<div class="mm-rail-track mm-rail-track--grid2" id="mm-rail-classic"></div>
</section>

<section class="mm-rail-section mm-rail-section--grid2">
<h2 class="mm-rail-heading"><i class="fas fa-bolt"></i> Trending now</h2>
<div class="mm-rail-track mm-rail-track--grid2" id="mm-trending-rail"></div>
</section>

<div class="game-description">
<p>Play <strong>{name}</strong> free in your browser at MonkeyMart.one — no download required. Click <strong>Play Game</strong> above to start.</p>
<h2>How to Play {name}</h2>
<ul>
<li>Tap or click <strong>Play Game</strong> to load the player</li>
<li>Use keyboard or touch controls inside the game</li>
<li>Fullscreen for the best desktop experience</li>
<li>Works on mobile, tablet, and desktop browsers</li>
</ul>
<p class="guide-inline-links"><a href="../category/classic.html">More classic games</a> · <a href="../category/game.html">Browse all games</a> · <a href="/">Play Monkey Mart</a></p>
</div>
</section>

</main>
</div>
{footer_html()}
<script defer src="../assets/js/main.js"></script>
<script defer src="../assets/js/game-controls.js"></script>
<script defer src="../assets/js/wg-grids-home.js"></script>
<script defer src="../assets/js/wg-featured.js"></script>
<script defer src="../assets/js/games.js"></script>
<script defer src="../assets/js/mm-engage.js"></script>
</body>
</html>
"""


def load_candidates(limit: int | None) -> list[dict]:
    if not CANDIDATES.is_file():
        raise SystemExit(f"Missing {CANDIDATES} — run probe first")
    data = json.loads(CANDIDATES.read_text(encoding="utf-8"))
    items = data.get("ok") or []
    skip_repos = {
        "ubg98",
        "ubg98.github.io",
        "tmp",
        "patch",
        "json",
        "js",
        "files",
        "assets",
    }
    out = []
    for item in items:
        repo = item["repo"]
        if repo in skip_repos or repo.startswith("."):
            continue
        slug = to_slug(repo)
        title = to_title(repo)
        out.append(
            {
                "repo": repo,
                "slug": slug,
                "title": title,
                "frame_url": item.get("frame_url") or f"https://ubg98.github.io/{repo}/",
            }
        )
    if limit:
        out = out[:limit]
    return out


def append_games_json(entries: list[dict]) -> int:
    existing = json.loads(GAMES_JSON.read_text(encoding="utf-8"))
    have = {re.sub(r"[^a-z0-9]", "", g.get("title", "").lower()) for g in existing}
    have |= {Path(g.get("frame_url", "")).name.lower() for g in existing}
    added = 0
    for e in entries:
        key = re.sub(r"[^a-z0-9]", "", e["title"].lower())
        if key in have:
            continue
        existing.append(
            {
                "title": e["title"],
                "frame_url": e["frame_url"],
                "image_path": e["image_path"],
            }
        )
        have.add(key)
        added += 1
    GAMES_JSON.write_text(json.dumps(existing, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return added


def append_games_js(entries: list[dict]) -> int:
    text = GAMES_JS.read_text(encoding="utf-8")
    m = re.search(r"const games = (\[[\s\S]*?\n\]);", text)
    if not m:
        raise SystemExit("Could not parse const games in games.js")
    # Use a light parse: find existing ids
    existing_ids = set(re.findall(r"id:\s*'([^']+)'", m.group(1)))
    blocks = []
    for e in entries:
        if e["slug"] in existing_ids:
            continue
        img = e["image_path"]
        if img.startswith("/"):
            img_js = ".." + img
        else:
            img_js = img
        cats = e.get("categories") or ["arcade", "casual"]
        cat_js = ", ".join(f"'{c}'" for c in cats)
        blocks.append(
            "  {\n"
            f"    id: '{e['slug']}',\n"
            f"    name: {json.dumps(e['title'], ensure_ascii=False)},\n"
            f"    image: '{img_js}',\n"
            f"    categories: [{cat_js}]\n"
            "  }"
        )
        existing_ids.add(e["slug"])
    if not blocks:
        return 0
    insert = ",\n".join(blocks)
    # insert before closing ]; of games array
    old = m.group(1)
    # strip trailing whitespace/newline before ]
    new_arr = old.rstrip()
    if new_arr.endswith("]"):
        body = new_arr[:-1].rstrip()
        if body.endswith(","):
            body = body + "\n" + insert + "\n]"
        else:
            body = body + ",\n" + insert + "\n]"
    else:
        raise SystemExit("games array parse failed")
    text = text[: m.start(1)] + body + text[m.end(1) :]
    GAMES_JS.write_text(text, encoding="utf-8")
    return len(blocks)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="Import only N games (0 = all)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    cands = load_candidates(args.limit or None)
    # skip if page already exists
    todo = []
    for c in cands:
        if (GAME_DIR / f"{c['slug']}.html").exists():
            continue
        todo.append(c)
    print(f"candidates={len(cands)} to_create={len(todo)}")
    if args.dry_run:
        print("sample", [t["slug"] for t in todo[:20]])
        return 0

    created = []
    for c in todo:
        cats = guess_categories(c["title"], c["repo"])
        image = ensure_thumb(c["repo"], c["slug"])
        entry = {**c, "categories": cats, "image_path": image}
        html = render_page(entry)
        (GAME_DIR / f"{c['slug']}.html").write_text(html, encoding="utf-8")
        created.append(entry)

    n_json = append_games_json(created)
    n_js = append_games_js(created)
    print(f"created_pages={len(created)} games_json+={n_json} games_js+={n_js}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
