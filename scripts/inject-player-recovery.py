#!/usr/bin/env python3
"""Add mm-player-recovery.js and gtag ad consent to existing WG game pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME_DIR = ROOT / "game"
WG_MARKER = "play.wgplayground.com/ifr/"
RECOVERY_SCRIPT = '<script src="../assets/js/mm-player-recovery.js" defer></script>'
RECOVERY_MARKER = "mm-player-recovery.js"

OLD_GTAG = """<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SWBWGBV5PB');
</script>"""

NEW_GTAG = """<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
  gtag('js', new Date());
  gtag('config', 'G-SWBWGBV5PB');
</script>"""


def main() -> None:
    gtag_count = 0
    script_count = 0
    for path in GAME_DIR.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if WG_MARKER not in text:
            continue
        original = text
        if OLD_GTAG in text and "gtag('consent'" not in text:
            text = text.replace(OLD_GTAG, NEW_GTAG, 1)
            gtag_count += 1
        if RECOVERY_MARKER not in text:
            anchor = '<script src="../assets/js/mm-engage.js"></script>'
            if anchor in text:
                text = text.replace(
                    anchor, anchor + "\n" + RECOVERY_SCRIPT, 1
                )
                script_count += 1
        if text != original:
            path.write_text(text, encoding="utf-8")
    print(f"Updated gtag consent on {gtag_count} pages")
    print(f"Added recovery script to {script_count} pages")


if __name__ == "__main__":
    main()
