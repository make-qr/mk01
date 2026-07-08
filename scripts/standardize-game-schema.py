#!/usr/bin/env python3
"""Standardize VideoGame + BreadcrumbList schema and visible breadcrumbs on game pages."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"
BASE = "https://monkeymart.one"
SKIP = {"example-game.html", "template.html"}

SCHEMA_MARKER = "<!-- Monkey Mart: structured data -->"
BREADCRUMB_MARKER = "<!-- Monkey Mart: breadcrumb nav -->"


def extract_meta(text: str, *patterns: str) -> str | None:
    for pat in patterns:
        m = re.search(pat, text, re.I | re.S)
        if m:
            return m.group(1).strip()
    return None


def slug_to_title(slug: str) -> str:
    return slug.replace("-", " ").title()


def resolve_game_name(title: str, slug: str, frame_title: str | None = None) -> str:
    t = title.strip()
    if " | " in t:
        t = t.split(" | ", 1)[0].strip()
    for sep in (" – ", " - "):
        if sep in t:
            left, right = t.split(sep, 1)
            if re.search(r"\b(play|online|free|unblocked)\b", right, re.I):
                t = left.strip()
                break

    if "-" in t and t.lower().replace("-", " ") == slug.replace("-", " "):
        t = slug_to_title(slug)
    elif t.lower() == slug.replace("-", " "):
        t = slug_to_title(slug)

    if frame_title and ("-" in t or t.lower() == slug.replace("-", " ")):
        ft = frame_title.strip()
        if ft and ft[0].isupper() and "-" not in ft:
            t = ft

    return t or slug_to_title(slug)


def absolute_image(url: str | None, slug: str) -> str:
    if not url:
        return f"{BASE}/assets/img/img-up/{slug}.png"
    if url.startswith("http"):
        return url
    if url.startswith("/"):
        return f"{BASE}{url}"
    if url.startswith("../"):
        return f"{BASE}/{url.replace('../', '')}"
    return f"{BASE}/assets/img/img-up/{slug}.png"


def parse_existing_genre(text: str) -> list[str]:
    m = re.search(r'"genre"\s*:\s*"([^"]+)"', text)
    if m:
        return [m.group(1)]
    m = re.search(r'"genre"\s*:\s*\[(.*?)\]', text, re.S)
    if m:
        items = re.findall(r'"([^"]+)"', m.group(1))
        if items:
            return items[:3]
    return ["Casual"]


def remove_schema_blocks(text: str) -> str:
    """Remove Game/VideoGame/BreadcrumbList JSON-LD; keep FAQPage and others."""

    def replacer(match: re.Match) -> str:
        block = match.group(0)
        if "FAQPage" in block:
            return block
        if re.search(r'"@type"\s*:\s*"(Game|VideoGame|BreadcrumbList)"', block):
            return ""
        return block

    return re.sub(
        r'<script\s+type="application/ld\+json">\s*.*?\s*</script>',
        replacer,
        text,
        flags=re.S,
    )


def build_schemas(name: str, description: str, url: str, image: str, genre: list[str]) -> str:
    video_game = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": name,
        "description": description[:500] if description else f"Play {name} online for free on Monkey Mart.",
        "url": url,
        "image": image,
        "genre": genre,
        "gamePlatform": "Web Browser",
        "applicationCategory": "Game",
        "operatingSystem": "Any",
        "playMode": "SinglePlayer",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
        },
        "publisher": {
            "@type": "Organization",
            "name": "Monkey Mart",
            "url": f"{BASE}/",
        },
    }
    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
            {
                "@type": "ListItem",
                "position": 2,
                "name": "All Games",
                "item": f"{BASE}/category/game.html",
            },
            {"@type": "ListItem", "position": 3, "name": name, "item": url},
        ],
    }
    blocks = [
        SCHEMA_MARKER,
        f'<script type="application/ld+json">\n{json.dumps(video_game, indent=2, ensure_ascii=False)}\n</script>',
        f'<script type="application/ld+json">\n{json.dumps(breadcrumb, indent=2, ensure_ascii=False)}\n</script>',
    ]
    return "\n".join(blocks) + "\n"


def build_breadcrumb_nav(name: str) -> str:
    safe = (
        name.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
    return (
        f"{BREADCRUMB_MARKER}\n"
        '<nav class="breadcrumb-nav" aria-label="Breadcrumb">\n'
        '  <div class="breadcrumb-container">\n'
        '    <a href="/">Home</a>\n'
        '    <span class="breadcrumb-sep" aria-hidden="true">/</span>\n'
        '    <a href="../category/game.html">All Games</a>\n'
        '    <span class="breadcrumb-sep" aria-hidden="true">/</span>\n'
        f'    <span class="breadcrumb-current" aria-current="page">{safe}</span>\n'
        "  </div>\n"
        "</nav>\n"
    )


def insert_schema(text: str, schema_block: str) -> str:
    if SCHEMA_MARKER in text:
        text = re.sub(
            re.escape(SCHEMA_MARKER) + r".*?(?=\n(?:<link|<meta|<script(?! type=\"application/ld\+json\")|<!-- Fonts|<!-- Analytics|<style))",
            schema_block.rstrip() + "\n",
            text,
            count=1,
            flags=re.S,
        )
        return text

    anchors = [
        r'(<meta name="author"[^>]*>\s*)',
        r'(<link rel="canonical"[^>]*>\s*)',
        r'(<meta name="robots"[^>]*>\s*)',
    ]
    for anchor in anchors:
        if re.search(anchor, text, re.I):
            return re.sub(anchor, r"\1" + schema_block, text, count=1, flags=re.I)

    return re.sub(r"(</head>)", schema_block + r"\1", text, count=1)


def insert_breadcrumb_nav(text: str, nav_block: str) -> str:
    if BREADCRUMB_MARKER in text or 'class="breadcrumb-nav"' in text:
        text = re.sub(
            re.escape(BREADCRUMB_MARKER) + r".*?</nav>\s*",
            nav_block,
            text,
            count=1,
            flags=re.S,
        )
        return text

    m = re.search(r"(<section class=\"keyword-links\">.*?</section>\s*)", text, re.S)
    if m:
        return text[: m.end()] + nav_block + text[m.end() :]

    m = re.search(r"(</header>\s*)", text)
    if m:
        return text[: m.end()] + nav_block + text[m.end() :]
    return text


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="ignore")
    slug = path.stem

    title = extract_meta(
        text,
        r"<title[^>]*>(.*?)</title>",
    ) or slug.replace("-", " ").title()
    description = extract_meta(
        text,
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)',
        r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']',
    ) or f"Play {title} online for free in your browser on Monkey Mart."
    canonical = extract_meta(
        text,
        r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']*)',
        r'<link[^>]+href=["\']([^"\']*)["\'][^>]+rel=["\']canonical["\']',
    ) or f"{BASE}/game/{path.name}"
    og_image = extract_meta(
        text,
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']*)',
        r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+property=["\']og:image["\']',
    )
    frame_title = extract_meta(text, r'<div class="game-frame-title">([^<]+)</div>')
    name = resolve_game_name(title, slug, frame_title)
    image = absolute_image(og_image, slug)
    genre = parse_existing_genre(text)

    new_text = remove_schema_blocks(text)
    schema_block = build_schemas(name, description, canonical, image, genre)
    new_text = insert_schema(new_text, schema_block)
    new_text = insert_breadcrumb_nav(new_text, build_breadcrumb_nav(name))

    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated = 0
    for path in sorted(GAME_DIR.glob("*.html")):
        if path.name in SKIP:
            continue
        if process_file(path):
            updated += 1
            print(f"Updated: {path.name}")
    print(f"Done. Updated {updated} game pages.")


if __name__ == "__main__":
    main()
