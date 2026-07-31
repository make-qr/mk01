#!/usr/bin/env python3
"""One-shot optimize WG game pages: click-to-play, slim JS, defer, lower 3P priority."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"

IFRAME_RE = re.compile(
    r'<div class="wg-player-wrap" id="mm-player">\s*'
    r"<iframe\b(?P<iframe>.*?)</iframe>\s*"
    r"(?:<script>\(function\(\)\{var h=location\.hostname.*?</script>\s*)?"
    r'<div class="loading-overlay"[\s\S]*?</div>\s*'  # overlay only (non-greedy stops early — see rebuild below)
    r"</div>",
    re.S,
)

MM_CURRENT_RE = re.compile(
    r"window\.MM_CURRENT_GAME\s*=\s*(\{.*?\});\s*</script>",
    re.S,
)

SCRIPTS_RE = re.compile(
    r'<script src="../assets/js/main\.js"></script>\s*'
    r'<script src="../assets/js/game-controls\.js"></script>\s*'
    r'<script src="../assets/js/wg-grids-home\.js"></script>\s*'
    r'<script src="../assets/js/wg-featured\.js"></script>\s*'
    r'(?:<script src="../assets/js/wg-games\.js"></script>\s*)?'
    r'<script src="../assets/js/mm-player-recovery\.js(?:\?v=\d+)?"></script>\s*'
    r'<script src="../assets/js/mm-engage\.js"></script>',
    re.S,
)

NEW_SCRIPTS = """\
<script defer src="../assets/js/main.js"></script>
<script defer src="../assets/js/game-controls.js"></script>
<script defer src="../assets/js/wg-grids-home.js"></script>
<script defer src="../assets/js/wg-featured.js"></script>
<script defer src="../assets/js/mm-player-recovery.js?v=3"></script>
<script defer src="../assets/js/mm-engage.js"></script>"""

FA_OLD = (
    '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" '
    'rel="stylesheet"/>'
)
FA_NEW = (
    '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" '
    'rel="stylesheet" media="print" onload="this.media=\'all\'"/>\n'
    '<noscript><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" '
    'rel="stylesheet"/></noscript>'
)


def parse_current_game(text: str) -> dict | None:
    m = MM_CURRENT_RE.search(text)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def extract_iframe_src(iframe_inner: str) -> str | None:
    m = re.search(r'\bsrc="(https://play\.wgplayground\.com/ifr/[^"]+)"', iframe_inner)
    if m:
        return m.group(1)
    m = re.search(r'\bdata-src="(https://play\.wgplayground\.com/ifr/[^"]+)"', iframe_inner)
    return m.group(1) if m else None


def extract_title(iframe_inner: str, fallback: str) -> str:
    m = re.search(r'\btitle="([^"]*)"', iframe_inner)
    return m.group(1) if m else fallback


def build_player(name: str, thumb: str, ifr_url: str, loading_html: str) -> str:
    return (
        f'<div class="wg-player-wrap" id="mm-player">\n'
        f'<div class="game-thumbnail">\n'
        f'<img src="{thumb}" width="320" height="320" alt="{name}" '
        f'fetchpriority="high" decoding="async"/>\n'
        f'<button class="play-frame-button" id="playGameButton" type="button">'
        f'<i class="fas fa-play"></i> Play Game</button>\n'
        f"</div>\n"
        f"<iframe\n"
        f'  allow="autoplay; fullscreen; encrypted-media; picture-in-picture; '
        f'clipboard-write; gyroscope; accelerometer"\n'
        f"  allowfullscreen\n"
        f'  id="game-frame"\n'
        f'  data-src="{ifr_url}"\n'
        f'  style="display: none;"\n'
        f'  title="{name}"></iframe>\n'
        f"{loading_html}"
        f"</div>"
    )


def ensure_stage_center_closed(text: str) -> str:
    """Repair missing </div> for .wg-stage-center before the right rail."""
    idx = text.find('<div class="wg-stage-center">')
    if idx < 0:
        return text
    right = text.find('<aside class="wg-side-rail wg-side-rail--right"', idx)
    if right < 0:
        return text
    between = text[idx:right]
    opens = between.count("<div")
    closes = between.count("</div>")
    if opens == closes + 1:
        return text[:right] + "</div>\n" + text[right:]
    return text


def optimize_text(text: str, path: Path) -> str | None:
    if "play.wgplayground.com/ifr/" not in text:
        return None

    already = (
        'id="playGameButton"' in text
        and "wg-games.js" not in text
        and "defer src=" in text
    )
    if already:
        repaired = ensure_stage_center_closed(text)
        return repaired if repaired != text else None

    cur = parse_current_game(text) or {}
    name = cur.get("name") or path.stem
    thumb = cur.get("image") or f"/assets/img/wg/{cur.get('id', path.stem)}/thumbnail.webp"
    # Use root-relative thumb for preload; poster can use same or ../ relative
    thumb_attr = thumb if thumb.startswith("/") else f"/{thumb.lstrip('./')}"
    # From /game/*.html, root-relative assets work fine
    poster_src = thumb_attr

    m = IFRAME_RE.search(text)
    if not m:
        # Already click-to-play but maybe still has wg-games.js / old scripts
        if "wg-games.js" not in text and "fetchPriority='high'" not in text:
            repaired = ensure_stage_center_closed(text)
            return repaired if repaired != text else None
    else:
        ifr_url = extract_iframe_src(m.group("iframe"))
        if not ifr_url:
            print(f"  skip (no iframe src): {path.name}", file=sys.stderr)
            return None
        title = extract_title(m.group("iframe"), name)
        loading_html = (
            '<div class="loading-overlay" style="display: none;">\n'
            '<div class="loading-spinner"></div>\n'
            f'<div class="loading-text">Loading {title}...</div>\n'
            "</div>\n"
        )
        player = build_player(title, poster_src, ifr_url, loading_html)
        text = text[: m.start()] + player + text[m.end() :]
        text = ensure_stage_center_closed(text)

    # WGPlayer priority
    text = text.replace("a.fetchPriority='high'", "a.fetchPriority='auto'")

    # Preload poster once
    if 'rel="preload" as="image"' not in text:
        text = text.replace(
            '<link rel="dns-prefetch" href="https://universal.wgplayer.com"/>',
            f'<link rel="dns-prefetch" href="https://universal.wgplayer.com"/>'
            f'<link rel="preload" as="image" href="{poster_src}" fetchpriority="high"/>',
            1,
        )

    # Font Awesome non-blocking
    if FA_OLD in text and "onload=\"this.media='all'\"" not in text:
        text = text.replace(FA_OLD, FA_NEW, 1)

    # Scripts: drop wg-games.js, add defer
    if SCRIPTS_RE.search(text):
        text = SCRIPTS_RE.sub(NEW_SCRIPTS, text, count=1)
    else:
        text = re.sub(
            r'<script src="../assets/js/wg-games\.js"></script>\s*',
            "",
            text,
        )
        text = text.replace(
            'src="../assets/js/mm-player-recovery.js?v=2"',
            'src="../assets/js/mm-player-recovery.js?v=3"',
        )
        for src in (
            "main.js",
            "game-controls.js",
            "wg-grids-home.js",
            "wg-featured.js",
            "mm-player-recovery.js?v=3",
            "mm-engage.js",
        ):
            text = text.replace(
                f'<script src="../assets/js/{src}"></script>',
                f'<script defer src="../assets/js/{src}"></script>',
            )

    # Copy tweaks
    text = text.replace(
        "The game loads automatically above.",
        "Click <strong>Play Game</strong> above to start.",
    )
    text = text.replace(
        "The game loads right away — tap or click <strong>Play</strong> inside the game frame to start",
        "Tap or click <strong>Play Game</strong> to load the player",
    )

    return text


def main() -> int:
    paths = sorted(GAME_DIR.glob("*.html"))
    changed = 0
    skipped = 0
    for path in paths:
        raw = path.read_text(encoding="utf-8")
        if "wg-games.js" not in raw and "play.wgplayground.com/ifr/" not in raw:
            skipped += 1
            continue
        if "play.wgplayground.com/ifr/" not in raw:
            skipped += 1
            continue
        out = optimize_text(raw, path)
        if out is None or out == raw:
            skipped += 1
            continue
        path.write_text(out, encoding="utf-8")
        changed += 1
    print(f"optimized={changed} skipped={skipped} total={len(paths)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
