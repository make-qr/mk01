#!/usr/bin/env python3
"""Inject universal.wgplayer.com tag into HTML pages (same placement as evony.html)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

WG_PLAYER_TAG = (
    '<link rel="dns-prefetch" href="https://universal.wgplayer.com"/>'
    '<script type="text/javascript" async>'
    "!function(e,t){a=e.createElement(\"script\"),m=e.getElementsByTagName(\"script\")[0],"
    "a.async=1,a.src=t,a.fetchPriority='high',m.parentNode.insertBefore(a,m)}"
    '(document,"https://universal.wgplayer.com/tag/?lh="+window.location.hostname+'
    '"&wp="+window.location.pathname+"&ws="+window.location.search);</script>'
)

ROBOTS_LDJSON = re.compile(
    r'(<meta name="robots" content="index, follow"/>\s*)'
    r'(<script type="application/ld\+json">)',
    re.IGNORECASE,
)

ROBOTS_LDJSON_REV = re.compile(
    r'(<meta content="index, follow" name="robots"/>\s*)'
    r'((?:<meta[^>]*>\s*|<!--[^>]*-->\s*)*)'
    r'(<script type="application/ld\+json">)',
    re.IGNORECASE,
)

ROBOTS_ANY = re.compile(
    r'(<meta name="robots"[^>]*>\s*)',
    re.IGNORECASE,
)

ROBOTS_ANY_REV = re.compile(
    r'(<meta content="index, follow" name="robots"/>\s*)',
    re.IGNORECASE,
)

CANONICAL = re.compile(
    r'(<link rel="canonical"[^>]*>\s*)',
    re.IGNORECASE,
)

CANONICAL_REV = re.compile(
    r'(<link href="[^"]+" rel="canonical"/>\s*)',
    re.IGNORECASE,
)

VIEWPORT = re.compile(
    r'(<meta name="viewport"[^>]*>\s*)',
    re.IGNORECASE,
)


def inject(text: str) -> tuple[str, bool]:
    if "universal.wgplayer.com" in text:
        return text, False

    m = ROBOTS_LDJSON.search(text)
    if m:
        return (
            text[: m.end(1)] + WG_PLAYER_TAG + "\n" + text[m.start(2) :],
            True,
        )

    m = ROBOTS_LDJSON_REV.search(text)
    if m:
        return (
            text[: m.end(1)] + WG_PLAYER_TAG + "\n" + text[m.start(2) :],
            True,
        )

    for pat in (ROBOTS_ANY, ROBOTS_ANY_REV):
        m = pat.search(text)
        if m:
            return text[: m.end(1)] + WG_PLAYER_TAG + "\n" + text[m.end(1) :], True

    for pat in (CANONICAL, CANONICAL_REV):
        m = pat.search(text)
        if m:
            return text[: m.end(1)] + WG_PLAYER_TAG + "\n" + text[m.end(1) :], True

    m = VIEWPORT.search(text)
    if m:
        return text[: m.end(1)] + WG_PLAYER_TAG + "\n" + text[m.end(1) :], True

    return text, False


def main() -> int:
    updated = 0
    skipped = 0
    failed: list[str] = []

    for path in sorted(ROOT.rglob("*.html")):
        text = path.read_text(encoding="utf-8")
        new_text, changed = inject(text)
        if not changed:
            if "universal.wgplayer.com" in text:
                skipped += 1
            else:
                failed.append(str(path.relative_to(ROOT)))
            continue
        path.write_text(new_text, encoding="utf-8")
        updated += 1

    print(f"updated: {updated}")
    print(f"already had tag: {skipped}")
    if failed:
        print(f"could not inject ({len(failed)}):")
        for f in failed[:20]:
            print(f"  - {f}")
        if len(failed) > 20:
            print(f"  ... and {len(failed) - 20} more")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
