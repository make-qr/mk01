#!/usr/bin/env python3
"""On-page SEO audit for monkeymart.one"""
from __future__ import annotations

import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {"404.html", "indexbackup.html", "example-game.html", "tools", "scripts"}


def extract(text: str, pattern: str) -> str | None:
    m = re.search(pattern, text, re.I | re.S)
    return m.group(1).strip() if m else None


def audit_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="ignore")
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    return {
        "path": rel,
        "title": extract(text, r"<title[^>]*>(.*?)</title>"),
        "description": extract(text, r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)')
        or extract(text, r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description'),
        "canonical": extract(text, r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']*)')
        or extract(text, r'<link[^>]+href=["\']([^"\']*)["\'][^>]+rel=["\']canonical'),
        "robots": extract(text, r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']*)'),
        "h1_count": len(re.findall(r"<h1\b", text, re.I)),
        "lang": extract(text, r"<html[^>]+lang=[\"']([^\"']+)"),
        "og_image": extract(text, r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']*)'),
    }


def main() -> None:
    rows = []
    for html in sorted(ROOT.rglob("*.html")):
        rel = str(html.relative_to(ROOT)).replace("\\", "/")
        if any(s in rel for s in SKIP) or "null" in rel.lower():
            continue
        rows.append(audit_file(html))

    missing_desc = [r["path"] for r in rows if not r["description"]]
    missing_canonical = [r["path"] for r in rows if not r["canonical"]]
    no_h1 = [r["path"] for r in rows if r["h1_count"] == 0]
    multi_h1 = [r["path"] for r in rows if r["h1_count"] > 1]
    titles = Counter(r["title"] for r in rows if r["title"])
    dup_titles = {t: c for t, c in titles.items() if c > 1}

    langs = Counter(r["lang"] or "missing" for r in rows)

    print("=== SEO AUDIT SUMMARY ===")
    print(f"Pages scanned: {len(rows)}")
    print(f"Missing meta description: {len(missing_desc)}")
    print(f"Missing canonical: {len(missing_canonical)}")
    print(f"Missing H1: {len(no_h1)}")
    print(f"Multiple H1: {len(multi_h1)}")
    print(f"Duplicate titles: {len(dup_titles)}")
    print(f"Lang tags: {dict(langs)}")

    if missing_desc[:10]:
        print("\nSample missing description:")
        for p in missing_desc[:10]:
            print(f"  - {p}")

    if missing_canonical[:10]:
        print("\nSample missing canonical:")
        for p in missing_canonical[:10]:
            print(f"  - {p}")

    if dup_titles:
        print("\nDuplicate titles (top 5):")
        for t, c in list(dup_titles.items())[:5]:
            print(f"  {c}x {t[:70]}")


if __name__ == "__main__":
    main()
