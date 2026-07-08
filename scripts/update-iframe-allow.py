#!/usr/bin/env python3
"""One-off migration: widen the game iframe `allow` attribute on WG game pages.

Older generated pages shipped `allow="fullscreen; autoplay"`, which is too
restrictive for WGPlayground's video-ad SDK (Google IMA). Missing permissions
such as `encrypted-media` can leave the ad player unable to signal completion,
so the game iframe never receives its src and stays black after the ad.
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"

OLD = 'allow="fullscreen; autoplay"'
NEW = (
    'allow="autoplay; fullscreen; encrypted-media; picture-in-picture; '
    'clipboard-write; gyroscope; accelerometer"'
)


def main() -> None:
    count = 0
    for path in GAME_DIR.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if OLD not in text:
            continue
        path.write_text(text.replace(OLD, NEW), encoding="utf-8")
        count += 1
    print(f"Updated iframe allow on {count} files")


if __name__ == "__main__":
    main()
