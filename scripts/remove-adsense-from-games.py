#!/usr/bin/env python3
"""Remove the AdSense Auto Ads loader from WG game pages only.

Auto Ads (vignette/interstitial) competes with WGPlayground's own video ad and
can leave the game frame stuck after the ad. We keep AdSense on content pages
(home, blog, category, etc.) but strip it from game/*.html so games stay playable.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"

# Matches the 2-line loader regardless of surrounding whitespace.
PATTERN = re.compile(
    r'[ \t]*<script async src="https://pagead2\.googlesyndication\.com/pagead/js/'
    r'adsbygoogle\.js\?client=ca-pub-4151519079019358"\s*\n'
    r'[ \t]*crossorigin="anonymous"></script>\n?'
)


def main() -> None:
    count = 0
    for path in GAME_DIR.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        new_text, n = PATTERN.subn("", text)
        if n:
            path.write_text(new_text, encoding="utf-8")
            count += 1
    print(f"Removed AdSense loader from {count} game pages")


if __name__ == "__main__":
    main()
