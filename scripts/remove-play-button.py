#!/usr/bin/env python3
"""Remove the click-to-play overlay from WGPlayground game pages.

The extra "Play Game" poster added a second click before WG's own play screen.
We now let the WG iframe load directly on page open. Only pages that embed a
WGPlayground `/ifr/` frame are touched; legacy native games keep their poster.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"

WG_MARKER = "play.wgplayground.com/ifr/"

THUMB_RE = re.compile(r'<div class="game-thumbnail">[\s\S]*?</div>\s*', re.MULTILINE)
IFRAME_SRC_RE = re.compile(
    r'data-src="(https://play\.wgplayground\.com/ifr/[^"]*)"(\s*\n\s*)style="display: none;"'
)

DESC_OLD = "Click <strong>Play Game</strong> above to load the game."
DESC_NEW = "The game loads automatically above."

HOWTO_OLD = (
    "<li>Click the <strong>Play Game</strong> button on this page to start</li>\n"
    "<li>Tap or click <strong>Play</strong> inside the game frame after it loads</li>"
)
HOWTO_NEW = (
    "<li>The game loads right away — tap or click <strong>Play</strong> inside "
    "the game frame to start</li>\n"
    "<li>A short video ad may play before the game begins</li>"
)


def main() -> None:
    count = 0
    for path in GAME_DIR.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if WG_MARKER not in text:
            continue
        original = text
        text = THUMB_RE.sub("", text, count=1)
        text = IFRAME_SRC_RE.sub(r'src="\1"\2style="display: block;"', text)
        text = text.replace(DESC_OLD, DESC_NEW)
        text = text.replace(HOWTO_OLD, HOWTO_NEW)
        if text != original:
            path.write_text(text, encoding="utf-8")
            count += 1
    print(f"Removed play button from {count} WG game pages")


if __name__ == "__main__":
    main()
