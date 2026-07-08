#!/usr/bin/env python3
"""Generate SEO-optimized sitemap.xml for monkeymart.one"""
from __future__ import annotations

import re
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://monkeymart.one"
TODAY = date.today().isoformat()

# Paths never indexed
EXCLUDE_PARTS = {
    "404.html",
    "indexbackup.html",
    "example-game.html",
    "lesson-15.html",
}
EXCLUDE_DIRS = {"tools", "assets", "scripts", "community"}
EXCLUDE_PATTERNS = [
    re.compile(r"null.*\.html$", re.I),
    re.compile(r"^game/monkey-mart-2/null", re.I),
]

PRIORITY_RULES = [
    (lambda p: p in ("", "index.html"), 1.0, "daily"),
    (lambda p: p == "blog/index.html", 0.85, "weekly"),
    (lambda p: p.startswith("blog/"), 0.65, "weekly"),
    (lambda p: p.startswith("game/") and p.endswith("/index.html"), 0.75, "weekly"),
    (lambda p: p.startswith("game/"), 0.7, "weekly"),
    (lambda p: p.startswith("category/"), 0.8, "weekly"),
    (lambda p: p.startswith("note/"), 0.6, "monthly"),
    (lambda p: p in {"cookie-clicker-2/index.html"}, 0.75, "weekly"),
    (
        lambda p: p
        in {
            "how-to-play-monkey-mart/index.html",
            "monkey-mart-tips/index.html",
            "monkey-mart-unblocked/index.html",
        },
        0.9,
        "weekly",
    ),
    (lambda p: p.endswith(("about.html", "contact.html", "faq.html")), 0.4, "monthly"),
    (lambda p: p.endswith(("privacy.html", "terms.html", "cookie-policy.html", "disclaimer.html")), 0.3, "yearly"),
]


def should_include(rel: str) -> bool:
    rel = rel.replace("\\", "/")
    name = Path(rel).name
    if name in EXCLUDE_PARTS:
        return False
    parts = rel.split("/")
    if any(p in EXCLUDE_DIRS for p in parts):
        return False
    for pat in EXCLUDE_PATTERNS:
        if pat.search(rel):
            return False
    return True


def to_url(rel: str) -> str:
    rel = rel.replace("\\", "/")
    if rel == "index.html":
        return f"{BASE}/"
    if rel.endswith("/index.html"):
        base_path = rel[:-10].rstrip("/")
        return f"{BASE}/{base_path}/" if base_path else f"{BASE}/"
    return f"{BASE}/{rel}"


def get_meta(path: Path) -> tuple[float, str]:
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    for rule, priority, freq in PRIORITY_RULES:
        if rule(rel):
            return priority, freq
    return 0.5, "monthly"


def collect_urls() -> list[tuple[str, float, str, str]]:
    entries: list[tuple[str, float, str, str]] = []
    for html in sorted(ROOT.rglob("*.html")):
        rel = str(html.relative_to(ROOT)).replace("\\", "/")
        if not should_include(rel):
            continue
        url = to_url(rel)
        priority, changefreq = get_meta(html)
        lastmod = TODAY
        mtime = date.fromtimestamp(html.stat().st_mtime).isoformat()
        if mtime > lastmod:
            lastmod = mtime
        entries.append((url, priority, changefreq, lastmod))

    # dedupe by URL, keep highest priority
    seen: dict[str, tuple[str, float, str, str]] = {}
    for url, pri, freq, mod in entries:
        if url not in seen or pri > seen[url][1]:
            seen[url] = (url, pri, freq, mod)
    return sorted(seen.values(), key=lambda x: (-x[1], x[0] != f"{BASE}/", x[0]))


def write_sitemap(entries: list[tuple[str, float, str, str]], out: Path) -> None:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url, priority, changefreq, lastmod in entries:
        lines.extend([
            "  <url>",
            f"    <loc>{escape(url)}</loc>",
            f"    <lastmod>{lastmod}</lastmod>",
            f"    <changefreq>{changefreq}</changefreq>",
            f"    <priority>{priority:.2f}</priority>",
            "  </url>",
        ])
    lines.append("</urlset>")
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    entries = collect_urls()
    out = ROOT / "sitemap.xml"
    write_sitemap(entries, out)
    print(f"Wrote {len(entries)} URLs to {out}")


if __name__ == "__main__":
    main()
