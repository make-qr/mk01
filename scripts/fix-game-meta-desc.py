#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "game"
slugs = sys.argv[1:] or [
    "smash-the-ants",
    "cool-tuning-paint-the-car",
    "dinosaurs-vs-asteroids",
    "merge-and-blast-2048",
    "hex-match",
]

for slug in slugs:
    path = ROOT / f"{slug}.html"
    text = path.read_text(encoding="utf-8")
    m = re.search(r'<meta content="([^"]+)" name="description"/>', text)
    if not m:
        print(f"skip {slug}: no meta description")
        continue
    desc = m.group(1)
    esc = desc.replace("\\", "\\\\").replace('"', '\\"')
    text = re.sub(
        r'<meta content="[^"]*" property="og:description"/>',
        f'<meta content="{desc}" property="og:description"/>',
        text,
        count=1,
    )
    text = re.sub(
        r'("@type": "VideoGame",\s*"name": "[^"]+",\s*)"description": "[^"]*"',
        rf'\1"description": "{esc}"',
        text,
        count=1,
    )
    path.write_text(text, encoding="utf-8")
    print(f"fixed {slug}")
