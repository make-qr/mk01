#!/usr/bin/env python3
"""Per-game SEO optimization: unique meta, content, schema, and UI text."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"
BASE = "https://monkeymart.one"
SKIP = {"template.html", "example-game.html"}

PLACEHOLDER_MARKERS = (
    "clever monkey running your own shop",
    "exciting store management game where you become",
    "perfect blend of casual gameplay and strategic management",
)

ACRONYMS = {
    "fnaf": "FNAF",
    "gta": "GTA",
    "ctr": "CTR",
    "lol": "LOL",
    "td": "TD",
    "x3m": "X3M",
    "3d": "3D",
    "2d": "2D",
    "ms": "MS",
    "ucn": "UCN",
    "rpg": "RPG",
}

GENRE_RULES: list[tuple[str, str, list[str]]] = [
    (r"puzzle|2048|tetris|minesweeper|wordle|sudoku|mahjong|solitaire|block-blast|ball-puzzle|sort-puzzle|hex-match|merge", "Puzzle", ["logic", "brain teasers", "pattern matching"]),
    (r"slope|tunnel-rush|run-3|doodle-jump|geometry-dash|geodash|stickman-hook|death-run|chrome-dino|flappy|stack|snow-rider|temple-run|edge-surf", "Arcade", ["fast reflexes", "endless runner", "high-score chasing"]),
    (r"moto-x3m|drift|traffic-jam|madalin|route-66|racing|kart|mario-kart", "Racing", ["speed", "stunts", "vehicle control"]),
    (r"basket|soccer|boxing|volley|ball-and|sports|retro-bowl", "Sports", ["physics-based fun", "quick matches", "competitive play"]),
    (r"super-smash|1v1|fight|nerd-fight|rooftop-snipers", "Fighting", ["combat", "multiplayer duels", "character battles"]),
    (r"fnaf|horror|baldis|scary", "Horror", ["suspense", "survival", "jump scares"]),
    (r"mario|sonic|platform|geodash|fireboy|snail-bob|papas|run-", "Platform", ["level progression", "timing", "exploration"]),
    (r"pokemon|zelda|ocarina|rpg|adventure|minecraft|eaglercraft", "Adventure", ["exploration", "quests", "open worlds"]),
    (r"bloons|tower-defense|strategy|conflict|defenders|tanks", "Strategy", ["planning", "resource management", "tower placement"]),
    (r"bitlife|monkey-mart|papas|pizzeria|freezeria|idle|clicker|cookie-clicker", "Simulation", ["life choices", "management", "upgrades"]),
    (r"blackjack|poker|pool-billiard|casino", "Card & Board", ["classic table games", "strategy", "luck and skill"]),
    (r"shoot|commando|delta-force|smash-kart", "Action", ["action-packed gameplay", "quick sessions", "skill-based challenges"]),
]

GENRE_COPY = {
    "Puzzle": {
        "intro": "{name} is a free browser puzzle game on MonkeyMart.one. Train your brain, solve challenges, and improve your score with every attempt.",
        "how": [
            "Read the board or puzzle layout before making a move",
            "Plan several steps ahead instead of rushing",
            "Use patterns to solve faster and more consistently",
            "Retry levels to beat your personal best",
        ],
        "features": [
            "Free to play in your browser — no download",
            "Works on desktop, tablet, and mobile",
            "Quick sessions perfect for short breaks",
            "Simple controls with deep strategic gameplay",
        ],
    },
    "Arcade": {
        "intro": "{name} is a fast-paced arcade game you can play free online at MonkeyMart.one. Dodge obstacles, react quickly, and chase your highest score.",
        "how": [
            "Use keyboard or touch controls to steer and react",
            "Stay focused as speed increases over time",
            "Learn obstacle patterns to survive longer",
            "Beat your best run and challenge friends",
        ],
        "features": [
            "Instant play — no install required",
            "Endless or level-based high-score gameplay",
            "Smooth browser performance on modern devices",
            "Great for quick, addictive game sessions",
        ],
    },
    "Racing": {
        "intro": "{name} is a thrilling racing game available free on MonkeyMart.one. Master controls, complete stunts, and race to the finish.",
        "how": [
            "Accelerate and brake with keyboard or touch",
            "Balance speed with control on tight corners",
            "Learn each track or stunt layout",
            "Replay levels to improve your time and score",
        ],
        "features": [
            "Free online racing — play instantly",
            "Stunt ramps, traffic, and challenging courses",
            "Responsive controls for desktop and mobile",
            "Replayable levels and time trials",
        ],
    },
    "Sports": {
        "intro": "{name} is a fun sports arcade game on MonkeyMart.one. Jump in for quick matches, wild physics, and competitive fun.",
        "how": [
            "Use simple controls to move, jump, or shoot",
            "Time your actions for maximum impact",
            "Adapt to unpredictable physics moments",
            "Play short rounds and try to outscore opponents",
        ],
        "features": [
            "Casual sports gameplay in the browser",
            "Great for multiplayer-style fun",
            "Short rounds — easy to pick up and play",
            "Free with no download required",
        ],
    },
    "Fighting": {
        "intro": "{name} is an action fighting game you can play free at MonkeyMart.one. Battle opponents, land combos, and dominate the arena.",
        "how": [
            "Learn basic attacks, blocks, and movement",
            "Combine attacks for stronger combos",
            "Watch opponent patterns and counterattack",
            "Practice in short rounds to improve timing",
        ],
        "features": [
            "Browser-based fighting — play instantly",
            "Character battles and competitive duels",
            "Keyboard controls with responsive action",
            "Free to play, no account required",
        ],
    },
    "Horror": {
        "intro": "{name} is a suspense horror game on MonkeyMart.one. Explore carefully, survive the night, and see how long you can last.",
        "how": [
            "Pay attention to audio and visual cues",
            "Manage resources and movement carefully",
            "Learn enemy patterns to avoid jumpscares",
            "Stay calm and plan your next move",
        ],
        "features": [
            "Free horror gameplay in the browser",
            "Atmospheric suspense and challenge",
            "Great for fans of survival horror",
            "Play instantly without downloading",
        ],
    },
    "Platform": {
        "intro": "{name} is a platform adventure you can play free on MonkeyMart.one. Jump, explore levels, and overcome obstacles to progress.",
        "how": [
            "Master jumping and movement timing",
            "Watch for traps, gaps, and moving platforms",
            "Collect items or complete level goals",
            "Replay tricky sections to improve",
        ],
        "features": [
            "Classic platform gameplay in the browser",
            "Level-based progression and challenges",
            "Works on desktop and mobile browsers",
            "Free online play — no download",
        ],
    },
    "Adventure": {
        "intro": "{name} is an adventure game available free on MonkeyMart.one. Explore worlds, complete quests, and discover what lies ahead.",
        "how": [
            "Explore areas and talk to characters",
            "Collect items and unlock new paths",
            "Follow quest objectives step by step",
            "Save progress when the game allows",
        ],
        "features": [
            "Immersive adventure in your browser",
            "Exploration and story-driven gameplay",
            "Replayable quests and discoveries",
            "Free to play at MonkeyMart.one",
        ],
    },
    "Strategy": {
        "intro": "{name} is a strategy game on MonkeyMart.one. Plan your moves, manage resources, and outsmart opponents to win.",
        "how": [
            "Study the map and plan early placements",
            "Balance offense and defense",
            "Upgrade wisely as difficulty increases",
            "Adapt your strategy each round",
        ],
        "features": [
            "Tactical browser gameplay",
            "Resource and unit management",
            "Increasing challenge across levels",
            "Free online — no download needed",
        ],
    },
    "Simulation": {
        "intro": "{name} is a simulation game on MonkeyMart.one. Make decisions, grow your progress, and build your way to success.",
        "how": [
            "Start with basic tasks and earn currency",
            "Invest in upgrades that improve efficiency",
            "Unlock new features as you progress",
            "Balance short-term gains with long-term growth",
        ],
        "features": [
            "Casual management and life-sim fun",
            "Progression through upgrades and unlocks",
            "Relaxing gameplay for all ages",
            "Free browser play at MonkeyMart.one",
        ],
    },
    "Card & Board": {
        "intro": "{name} is a classic card or board game on MonkeyMart.one. Play free online and test your skill and strategy.",
        "how": [
            "Learn the basic rules before playing",
            "Think ahead before each move or bet",
            "Practice to improve win rate",
            "Play casually or chase high scores",
        ],
        "features": [
            "Classic gameplay in the browser",
            "Single-player sessions anytime",
            "Simple interface and quick rounds",
            "Completely free — no download",
        ],
    },
    "Action": {
        "intro": "{name} is an action game on MonkeyMart.one. React fast, complete missions, and enjoy adrenaline-packed browser gameplay.",
        "how": [
            "Learn controls and movement first",
            "Use cover and timing to survive",
            "Complete objectives before time runs out",
            "Replay missions to improve performance",
        ],
        "features": [
            "Fast action gameplay online",
            "Skill-based challenges and missions",
            "Play free on desktop or mobile",
            "No installation required",
        ],
    },
    "Casual": {
        "intro": "{name} is a casual browser game on MonkeyMart.one. Easy to start, fun to master, and free to play anytime.",
        "how": [
            "Start playing with simple tap or keyboard controls",
            "Learn mechanics through short practice rounds",
            "Aim for higher scores each session",
            "Come back daily to improve your results",
        ],
        "features": [
            "Pick-up-and-play casual fun",
            "Short sessions for any schedule",
            "Free online at MonkeyMart.one",
            "Works on modern browsers and mobile",
        ],
    },
}


def slug_to_name(slug: str) -> str:
    parts = slug.split("-")
    out = []
    for p in parts:
        low = p.lower()
        if low in ACRONYMS:
            out.append(ACRONYMS[low])
        elif p.isdigit():
            out.append(p)
        else:
            out.append(p.capitalize())
    name = " ".join(out)
    name = re.sub(r"\bX3m\b", "X3M", name, flags=re.I)
    name = re.sub(r"\bFnaf\b", "FNAF", name, flags=re.I)
    return name


def detect_genre(slug: str, name: str) -> str:
    hay = f"{slug} {name.lower()}"
    for pattern, genre, _ in GENRE_RULES:
        if re.search(pattern, hay, re.I):
            return genre
    return "Casual"


def genre_keywords(genre: str, name: str, slug: str) -> str:
    base = [
        f"{name.lower()}",
        f"play {name.lower()}",
        f"{name.lower()} online",
        f"{name.lower()} free",
        f"{name.lower()} unblocked",
        "browser game",
        "monkeymart.one",
    ]
    extras = {
        "Puzzle": ["puzzle game", "brain game"],
        "Arcade": ["arcade game", "endless runner"],
        "Racing": ["racing game", "driving game"],
        "Sports": ["sports game", "physics game"],
        "Fighting": ["fighting game", "battle game"],
        "Horror": ["horror game", "scary game"],
        "Simulation": ["simulation game", "tycoon game"],
    }
    base.extend(extras.get(genre, ["online game", "free game"]))
    return ", ".join(dict.fromkeys(base))


def build_title(name: str) -> str:
    return f"{name} - Play {name} Online Free | MonkeyMart.one"


def build_description(name: str, genre: str) -> str:
    hooks = {
        "Puzzle": f"Play {name} online for free. A challenging puzzle browser game with smart gameplay and no download required.",
        "Arcade": f"Play {name} online for free. Fast arcade action in your browser — dodge, survive, and beat your high score.",
        "Racing": f"Play {name} online for free. Racing thrills in your browser with stunts, speed, and instant play.",
        "Sports": f"Play {name} online for free. Quick sports arcade fun with simple controls and wild physics.",
        "Fighting": f"Play {name} online for free. Battle opponents in this browser fighting game — no download needed.",
        "Horror": f"Play {name} online for free. A suspense horror browser game — survive and test your nerves.",
        "Platform": f"Play {name} online for free. Jump, explore, and beat levels in this platform browser game.",
        "Adventure": f"Play {name} online for free. Explore, quest, and adventure in your browser at MonkeyMart.one.",
        "Strategy": f"Play {name} online for free. Plan, build, and outsmart opponents in this strategy browser game.",
        "Simulation": f"Play {name} online for free. Manage, upgrade, and grow in this casual simulation game.",
        "Card & Board": f"Play {name} online for free. Classic card and board fun in your browser — play instantly.",
        "Action": f"Play {name} online for free. Action-packed browser gameplay with fast missions and challenges.",
        "Casual": f"Play {name} online for free. Casual browser fun at MonkeyMart.one — no download, play instantly.",
    }
    desc = hooks.get(genre, hooks["Casual"])
    return desc[:160]


def has_quality_content(text: str) -> bool:
    m = re.search(r'<div class="game-description">(.*?)</div>', text, re.S)
    if not m:
        return False
    block = m.group(1).lower()
    if any(marker in block for marker in PLACEHOLDER_MARKERS):
        return False
    plain = re.sub(r"<[^>]+>", " ", m.group(1))
    words = len(plain.split())
    return words >= 100


def build_content(name: str, genre: str, slug: str) -> str:
    pack = GENRE_COPY.get(genre, GENRE_COPY["Casual"])
    intro = pack["intro"].format(name=name)
    how_items = "".join(f"<li>{item}</li>" for item in pack["how"])
    feat_items = "".join(f"<li>{item}</li>" for item in pack["features"])

    blog_slug = f"play-{slug}-online"
    blog_link = f'/blog/{blog_slug}.html'
    blog_exists = (ROOT / "blog" / f"{blog_slug}.html").exists()
    blog_line = (
        f'<p class="guide-inline-links"><a href="{blog_link}">Read the {name} online guide</a> · '
        f'<a href="/category/game.html">Browse all games</a> · <a href="/">Play Monkey Mart</a></p>'
        if blog_exists
        else (
            f'<p class="guide-inline-links"><a href="/category/game.html">Browse all games</a> · '
            f'<a href="/">Play Monkey Mart</a></p>'
        )
    )

    return f"""<div class="game-description">
<h1>{name} - Play Online Free</h1>
<p>{intro}</p>
<h2>How to Play {name}</h2>
<ul>
{how_items}
</ul>
<h2>{name} Features</h2>
<ul>
{feat_items}
</ul>
<h2>Play {name} Unblocked</h2>
<p>{name} runs in your browser at MonkeyMart.one — no download required. Play at school, home, or on mobile wherever browser games are allowed.</p>
{blog_line}
<h2>{name} FAQ</h2>
<h3>Is {name} free?</h3>
<p>Yes. You can play {name} for free on MonkeyMart.one with no download.</p>
<h3>Can I play {name} on mobile?</h3>
<p>Yes. {name} works in modern mobile and desktop browsers.</p>
<h3>Is {name} unblocked?</h3>
<p>{name} is a browser-based HTML5 game. Access depends on your network, but no app install is needed.</p>
</div>"""


def build_faq_schema(name: str) -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f"Is {name} free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"Yes. You can play {name} for free on MonkeyMart.one in your browser.",
                },
            },
            {
                "@type": "Question",
                "name": f"Can I play {name} on mobile?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"Yes. {name} works on phones, tablets, and desktop browsers.",
                },
            },
            {
                "@type": "Question",
                "name": f"Is {name} unblocked?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"{name} is a browser game at MonkeyMart.one with no download required.",
                },
            },
        ],
    }
    return f'<script type="application/ld+json">\n{json.dumps(data, indent=2, ensure_ascii=False)}\n</script>'


def set_meta(text: str, name: str, value: str, *, prop: str | None = None) -> str:
    if prop:
        pat = rf'<meta[^>]+property=["\']{re.escape(prop)}["\'][^>]*>'
        tag = f'<meta content="{value}" property="{prop}"/>'
    else:
        pat = rf'<meta[^>]+name=["\']{re.escape(name)}["\'][^>]*>'
        tag = f'<meta content="{value}" name="{name}"/>'
    if re.search(pat, text, re.I):
        return re.sub(pat, tag, text, count=1, flags=re.I)
    return text


def set_title(text: str, title: str) -> str:
    return re.sub(r"<title[^>]*>.*?</title>", f"<title>{title}</title>", text, count=1, flags=re.S)


def set_link_canonical(text: str, url: str) -> str:
    tag = f'<link href="{url}" rel="canonical"/>'
    if re.search(r'rel=["\']canonical["\']', text, re.I):
        return re.sub(r'<link[^>]+rel=["\']canonical["\'][^>]*>', tag, text, count=1, flags=re.I)
    return text


def replace_game_description(text: str, new_block: str) -> str:
    if re.search(r'<div class="game-description">', text, re.I):
        return re.sub(
            r"<!-- Game Description -->\s*<div class=\"game-description\">.*?</div>",
            f"<!-- Game Description -->\n{new_block}",
            text,
            count=1,
            flags=re.S,
        )
    anchor = re.search(r"<!-- More related games -->", text)
    if anchor:
        return text[: anchor.start()] + f"<!-- Game Description -->\n{new_block}\n" + text[anchor.start() :]
    return text


def upsert_faq_schema(text: str, faq_block: str) -> str:
    text = re.sub(
        r'<script type="application/ld\+json">\s*\{[^<]*"@type"\s*:\s*"FAQPage"[^<]*\}\s*</script>\s*',
        "",
        text,
        flags=re.S,
    )
    m = re.search(r"(<!-- Fonts and Styles -->)", text)
    if m:
        return text[: m.start()] + faq_block + "\n" + text[m.start() :]
    return re.sub(r"(</head>)", faq_block + r"\n\1", text, count=1)


def update_videogame_schema(text: str, name: str, slug: str, description: str, genre: str) -> str:
    play_mode = "MultiPlayer" if genre == "Fighting" else "SinglePlayer"
    data = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": name,
        "description": description,
        "url": f"{BASE}/game/{slug}.html",
        "image": f"{BASE}/assets/img/img-up/{slug}.png",
        "genre": [genre],
        "gamePlatform": "Web Browser",
        "applicationCategory": "Game",
        "operatingSystem": "Any",
        "playMode": play_mode,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
        },
        "publisher": {
            "@type": "Organization",
            "name": "Monkey Mart",
            "url": f"{BASE}/",
        },
    }
    block = f'<script type="application/ld+json">\n{json.dumps(data, indent=2, ensure_ascii=False)}\n</script>'
    return re.sub(
        r'<script type="application/ld\+json">\s*\{[^<]*"@type"\s*:\s*"VideoGame"[^<]*\}\s*</script>',
        block,
        text,
        count=1,
        flags=re.S,
    )


def fix_frame_ui(text: str, name: str, slug: str) -> str:
    safe_alt = f"{name} - play online free"
    text = re.sub(
        r'(<div class="game-thumbnail">\s*<img )alt="[^"]*"',
        rf'\1alt="{safe_alt}"',
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r"<div class=\"game-frame-title\">[^<]*</div>",
        f'<div class="game-frame-title">{name}</div>',
        text,
        count=1,
    )
    text = re.sub(
        r'(<button class="play-frame-button"[^>]*>\s*<i class="fas fa-play"></i>\s*)(Play Game|Play [^<]*)',
        rf"\1Play {name}",
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r'(<div class="loading-text">)Loading[^<]*(</div>)',
        rf"\1Loading {name}...\2",
        text,
        count=1,
    )
    img_url = f"{BASE}/assets/img/img-up/{slug}.png"
    text = set_meta(text, "", img_url, prop="og:image")
    text = set_meta(text, "twitter:image", img_url)
    text = set_meta(text, "", f"{BASE}/game/{slug}.html", prop="og:url")
    if 'name="twitter:card"' not in text:
        text = re.sub(
            r"(</head>)",
            '<meta content="summary_large_image" name="twitter:card"/>\n\\1',
            text,
            count=1,
        )
    text = set_meta(text, "twitter:title", build_title(name))
    text = set_meta(text, "twitter:description", build_description(name, detect_genre(slug, name)))
    if 'name="robots"' not in text:
        text = re.sub(r"(</head>)", '<meta content="index, follow" name="robots"/>\n\\1', text, count=1)
    return text


def process_file(path: Path) -> bool:
    slug = path.stem
    name = slug_to_name(slug)
    genre = detect_genre(slug, name)
    url = f"{BASE}/game/{path.name}"
    title = build_title(name)
    description = build_description(name, genre)
    keywords = genre_keywords(genre, name, slug)

    text = path.read_text(encoding="utf-8", errors="ignore")
    original = text

    text = set_title(text, title)
    text = set_meta(text, "description", description)
    text = set_meta(text, "keywords", keywords)
    text = set_meta(text, "", title, prop="og:title")
    text = set_meta(text, "", description, prop="og:description")
    text = set_link_canonical(text, url)
    text = fix_frame_ui(text, name, slug)
    text = update_videogame_schema(text, name, slug, description, genre)
    if 'property="og:type"' not in text:
        text = re.sub(r"(</head>)", '<meta content="website" property="og:type"/>\n\\1', text, count=1)
    if 'name="author"' not in text:
        text = re.sub(r"(</head>)", '<meta content="Monkey Mart" name="author"/>\n\\1', text, count=1)

    if not has_quality_content(text):
        content = build_content(name, genre, slug)
        text = replace_game_description(text, content)
        text = upsert_faq_schema(text, build_faq_schema(name))

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main(files: list[str] | None = None) -> None:
    updated = 0
    skipped_quality = 0
    if files:
        paths = [GAME_DIR / f for f in files]
    else:
        paths = sorted(GAME_DIR.glob("*.html"))
    for path in paths:
        if path.name in SKIP or not path.exists():
            continue
        before = path.read_text(encoding="utf-8", errors="ignore")
        if has_quality_content(before):
            skipped_quality += 1
        if process_file(path):
            updated += 1
            print(path.name)
    print(f"Done. Updated {updated} pages. Kept rich content on {skipped_quality} pages.")


if __name__ == "__main__":
    import sys

    main(sys.argv[1:] if len(sys.argv) > 1 else None)
