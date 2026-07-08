#!/usr/bin/env python3
"""Update generic meta title/description from existing game-description content."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"

GENERIC_META_MARKERS = (
    "Casual browser fun at MonkeyMart",
    "Racing thrills in your browser",
    "Explore, quest, and adventure in your browser",
    "A suspense horror browser game",
    "no download, play instantly",
)

GENERIC_BODY_MARKERS = (
    "is a casual browser game on MonkeyMart",
    "is a fast-paced arcade game you can play",
    "is a thrilling racing game available",
    "is a free browser puzzle game on MonkeyMart",
    "is an adventure game available free on MonkeyMart",
    "is a strategy game on MonkeyMart",
    "Easy to start, fun to master",
    "Pick-up-and-play casual fun",
)


def strip_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def truncate(text: str, limit: int = 155) -> str:
    if len(text) <= limit:
        return text
    cut = text[: limit - 1].rsplit(" ", 1)[0]
    return cut.rstrip(".,;:") + "…"


def extract_content(html: str) -> tuple[str, str] | None:
    m = re.search(
        r'<div class="game-description">\s*<h1>(.*?)</h1>\s*<p>(.*?)</p>',
        html,
        re.DOTALL | re.IGNORECASE,
    )
    if not m:
        return None
    h1 = strip_html(m.group(1))
    intro = strip_html(m.group(2))
    if not h1 or not intro:
        return None
    if any(marker in intro for marker in GENERIC_BODY_MARKERS):
        return None
    return h1, intro


def has_generic_meta(html: str) -> bool:
    return any(marker in html for marker in GENERIC_META_MARKERS)


def build_title(h1: str) -> str:
    if "|" in h1:
        base = h1.split("|", 1)[0].strip()
    else:
        base = h1
    if "MonkeyMart" in base:
        return base
    return f"{base} | MonkeyMart.one"


def build_description(intro: str) -> str:
    desc = intro
    if "MonkeyMart" not in desc and len(desc) < 130:
        desc = f"{desc} Play free at MonkeyMart.one."
    return truncate(desc)


def replace_meta(html: str, title: str, description: str) -> str:
    html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1)
    html = re.sub(
        r'(<meta content=")[^"]*(" name="description"/>)',
        rf"\g<1>{description}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'(<meta content=")[^"]*(" property="og:title"/>)',
        rf"\g<1>{title}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'(<meta content=")[^"]*(" property="og:description"/>)',
        rf"\g<1>{description}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'(<meta content=")[^"]*(" name="twitter:title"/>)',
        rf"\g<1>{title}\2",
        html,
        count=1,
    )
    # twitter description may be slightly shorter — use same for consistency
    html = re.sub(
        r'(<meta content=")[^"]*(" name="twitter:description"/>)',
        rf"\g<1>{description}\2",
        html,
        count=1,
    )
    # VideoGame schema description
    html = re.sub(
        r'("@type": "VideoGame",\s*"name": "[^"]*",\s*"description": ")[^"]*(")',
        rf"\g<1>{description}\2",
        html,
        count=1,
    )
    return html


def process_file(path: Path, dry_run: bool = False) -> str | None:
    html = path.read_text(encoding="utf-8")
    if not has_generic_meta(html):
        return None
    extracted = extract_content(html)
    if not extracted:
        return "skip-no-content"
    h1, intro = extracted
    title = build_title(h1)
    description = build_description(intro)
    new_html = replace_meta(html, title, description)
    if new_html == html:
        return "skip-unchanged"
    if not dry_run:
        path.write_text(new_html, encoding="utf-8")
    return "updated"


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    targets = [Path(p) for p in sys.argv[1:] if not p.startswith("--")]
    files = targets or sorted(GAME_DIR.glob("*.html"))
    updated = skipped = 0
    skip_no_content: list[str] = []

    for path in files:
        if path.name in {"template.html", "example-game.html"}:
            continue
        result = process_file(path, dry_run=dry_run)
        if result == "updated":
            updated += 1
            print(f"OK  {path.name}")
        elif result == "skip-no-content":
            skip_no_content.append(path.name)
        elif result is not None:
            skipped += 1

    print(f"\nUpdated: {updated}")
    if skip_no_content:
        print(f"Skipped (generic body, need manual content): {len(skip_no_content)}")
        for name in skip_no_content:
            print(f"  - {name}")
    if dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    main()
