#!/usr/bin/env python3
"""Remove commented-out category nav blocks from HTML files."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Nav comment block (game pages + index/category)
NAV_COMMENT = re.compile(
    r"<!-- <li><a href=\"(?:\.\./|/)category/battle-royale\.html\">.*?"
    r"<li><a href=\"(?:\.\./|/)category/board\.html\">.*?</li> -->",
    re.DOTALL,
)

# Homepage: commented Popular Categories + note-links section
HOME_SECTION = re.compile(
    r"\s*<!--\s*<h2>Popular Categories</h2>.*?</section>\s*-->",
    re.DOTALL,
)


def clean_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    text = NAV_COMMENT.sub("", text)
    if path.name == "index.html" and path.parent == ROOT:
        text = HOME_SECTION.sub("", text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = 0
    for html in sorted(ROOT.rglob("*.html")):
        if clean_file(html):
            changed += 1
            print(html.relative_to(ROOT))
    print(f"Updated {changed} files")


if __name__ == "__main__":
    main()
