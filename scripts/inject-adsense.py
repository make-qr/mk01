#!/usr/bin/env python3
"""Inject Google AdSense Auto Ads loader into HTML pages missing it."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SNIPPET = (
    '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4151519079019358"\n'
    '     crossorigin="anonymous"></script>'
)
MARKER = "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"

# NOTE: "game" is skipped on purpose. WGPlayground game pages run their own
# video ad before play; AdSense Auto Ads (vignette/interstitial) competes with
# it and can leave the game frame stuck after the ad, so we keep those pages ad-free.
SKIP_DIRS = {".git", "node_modules", "assets/img", "cookie-clicker-2", "game"}


def should_skip(path: Path) -> bool:
    parts = set(path.parts)
    return bool(parts & SKIP_DIRS)


def inject_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="ignore")
    if MARKER in text:
        return False
    head_end = text.lower().find("</head>")
    if head_end == -1:
        return False
    updated = text[:head_end] + "\n  " + SNIPPET + "\n" + text[head_end:]
    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    count = 0
    for path in ROOT.rglob("*.html"):
        if should_skip(path):
            continue
        if inject_file(path):
            count += 1
            print(f"  + {path.relative_to(ROOT)}")
    print(f"Injected AdSense into {count} files")


if __name__ == "__main__":
    main()
