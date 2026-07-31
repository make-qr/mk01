#!/usr/bin/env python3
"""Rebuild wg-grids-home.js from WG_GAMES catalog + MM_FEATURED pins."""
from __future__ import annotations

import sys

from home_grids import build_home_grids, write_home_grids


def main() -> int:
    grids = build_home_grids()
    write_home_grids(grids)
    print(
        f"Updated wg-grids-home.js — "
        f"trending: {len(grids['trending'])}, "
        f"new: {len(grids['new'])}, "
        f"topRated: {len(grids['topRated'])}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
