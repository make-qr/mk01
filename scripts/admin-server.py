#!/usr/bin/env python3
"""Local admin server for MonkeyMart — localhost only."""
from __future__ import annotations

import json
import subprocess
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
DEFAULT_PORT = 8767

sys.path.insert(0, str(SCRIPTS))
from home_grids import (  # noqa: E402
    build_home_grids,
    invalidate_wg_games_cache,
    load_classic_games,
    load_featured,
    load_wg_games,
    parse_featured_sizes,
    parse_hidden_ids,
    save_featured_and_sync,
    set_hidden_ids,
    write_home_grids,
)
from wg_catalog_sync import (  # noqa: E402
    import_wg_games_batch,
    sync_wg_catalog,
)
from wg_game_tools import add_manual_game, import_wg_game, search_wg_catalog  # noqa: E402


def slim_catalog(games: list[dict] | None = None) -> list[dict]:
    games = games if games is not None else load_wg_games()
    hidden = set(parse_hidden_ids())
    return [
        {
            "id": g.get("id"),
            "name": g.get("name"),
            "by": g.get("by"),
            "image": g.get("image"),
            "url": g.get("url"),
            "c": g.get("c"),
            "cats": g.get("wgCategories") or [],
            "source": "wg",
            "hidden": g.get("id") in hidden,
        }
        for g in games
        if g.get("id")
    ]


def slim_classic_catalog() -> list[dict]:
    hidden = set(parse_hidden_ids())
    out = []
    for g in load_classic_games():
        gid = g.get("id")
        if not gid:
            continue
        item = dict(g)
        item["hidden"] = gid in hidden
        out.append(item)
    return out


def status_payload(featured: dict | None = None, games: list[dict] | None = None) -> dict:
    featured = featured if featured is not None else load_featured()
    games = games if games is not None else load_wg_games()
    classic = load_classic_games()
    return {
        "ok": True,
        "catalog": len(games),
        "classic": len(classic),
        "hidden": len(parse_hidden_ids()),
        "featured": {k: len(v) for k, v in featured.items()},
        "grids": None,
    }


def preview_payload(
    featured: dict | None = None,
    games: list[dict] | None = None,
    *,
    with_grids: bool = True,
) -> dict:
    featured = featured if featured is not None else load_featured()
    games = games if games is not None else load_wg_games()
    games_by_id = {g["id"]: g for g in games if g.get("id")}
    grids = build_home_grids() if with_grids else {"trending": [], "new": [], "topRated": []}

    def names(key: str) -> list[str]:
        ids = featured.get(key) or []
        if ids:
            return [games_by_id[i]["name"] for i in ids if i in games_by_id]
        return [g.get("name", "") for g in grids.get(key, [])[:12]]

    return {
        "ok": True,
        "sections": {
            "sideLeft": {
                "label": "Side rail trái — Popular picks",
                "source": "picks",
                "count": len(featured.get("picks") or []) or len(grids.get("topRated", [])),
                "games": names("picks")[:8],
            },
            "sideRight": {
                "label": "Side rail phải — Trending",
                "source": "trending",
                "count": len(featured.get("trending") or []) or len(grids.get("trending", [])),
                "games": names("trending")[:8],
            },
            "homeTrending": {
                "label": "Homepage + Game page — Trending now",
                "source": "trending",
                "count": len(names("trending")),
                "games": names("trending"),
            },
            "homeNew": {
                "label": "Homepage + Game page — New games",
                "source": "new",
                "count": len(names("new")),
                "games": names("new"),
            },
            "homeTop": {
                "label": "Homepage + Game page — Top rated",
                "source": "topRated",
                "count": len(names("topRated")),
                "games": names("topRated"),
            },
            "popularPicks": {
                "label": "Popular picks grid",
                "source": "picks",
                "count": len(names("picks")),
                "games": names("picks"),
            },
            "categorySort": {
                "label": "Category / All Games — sort Popular",
                "source": "trending → new → topRated → picks",
                "count": len(
                    set(
                        (featured.get("trending") or [])
                        + (featured.get("new") or [])
                        + (featured.get("topRated") or [])
                        + (featured.get("picks") or [])
                    )
                ),
                "games": names("trending")[:5]
                + names("new")[:3]
                + names("topRated")[:3],
            },
        },
    }


class AdminHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        if str(args[0]).startswith("GET /api/"):
            return
        super().log_message(fmt, *args)

    def end_headers(self) -> None:
        path = urlparse(self.path).path
        if path.startswith("/admin/") and path.endswith((".css", ".js")):
            self.send_header("Cache-Control", "private, max-age=60")
        else:
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _cors(self) -> None:
        origin = self.headers.get("Origin", "*")
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._cors()
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8"))

    def do_OPTIONS(self) -> None:
        if self.path.startswith("/api/"):
            self.send_response(204)
            self._cors()
            self.end_headers()
            return
        self.send_error(404)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/admin/bootstrap":
            games = load_wg_games()
            featured = load_featured()
            classic = slim_classic_catalog()
            self._json(
                {
                    "ok": True,
                    "games": slim_catalog(games),
                    "classic": classic,
                    "hidden": parse_hidden_ids(),
                    "featured": featured,
                    "sizes": parse_featured_sizes(),
                    "status": status_payload(featured, games),
                    "preview": preview_payload(featured, games, with_grids=True),
                }
            )
            return
        if path == "/api/admin/status":
            self._json(status_payload())
            return
        if path == "/api/admin/featured":
            self._json({
                "ok": True,
                "featured": load_featured(),
                "sizes": parse_featured_sizes(),
            })
            return
        if path == "/api/admin/catalog":
            self._json({"ok": True, "games": slim_catalog()})
            return
        if path == "/api/admin/preview":
            self._json(preview_payload())
            return
        if path == "/api/admin/wg-search":
            qs = parse_qs(parsed.query)
            q = (qs.get("q") or [""])[0]
            try:
                games = search_wg_catalog(q, limit=60)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, "games": games})
            return
        if path == "/api/admin/wg-pending":
            qs = parse_qs(parsed.query)
            q = (qs.get("q") or [""])[0]
            cat = (qs.get("cat") or [""])[0]
            filt = (qs.get("filter") or ["pending"])[0]
            try:
                from wg_catalog_sync import list_wg_games

                data = list_wg_games(query=q, category=cat, filter=filt, limit=500)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, **data})
            return
        super().do_GET()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        try:
            data = self._read_json()
        except json.JSONDecodeError:
            self._json({"ok": False, "error": "Invalid JSON"}, 400)
            return

        if path == "/api/admin/save":
            featured = {
                "trending": data.get("trending") or [],
                "new": data.get("new") or [],
                "topRated": data.get("topRated") or [],
                "picks": data.get("picks") or [],
            }
            raw_sizes = data.get("sizes") or {}
            sizes: dict[str, dict[str, str]] = {}
            for key in ("trending", "new", "topRated", "picks"):
                rail = raw_sizes.get(key) or {}
                if isinstance(rail, dict):
                    sizes[key] = {
                        str(gid): str(sz)
                        for gid, sz in rail.items()
                        if sz in ("wide", "xl") and gid
                    }
                else:
                    sizes[key] = {}
            try:
                counts = save_featured_and_sync(featured, sizes=sizes)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, "grids": counts})
            return

        if path == "/api/admin/hide-game":
            slug = (data.get("id") or data.get("slug") or "").strip()
            if not slug:
                self._json({"ok": False, "error": "Missing id"}, 400)
                return
            try:
                hidden = parse_hidden_ids()
                if slug not in hidden:
                    hidden.append(slug)
                result = set_hidden_ids(hidden, sync_grids=True)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, "hidden": parse_hidden_ids(), **result})
            return

        if path == "/api/admin/unhide-game":
            slug = (data.get("id") or data.get("slug") or "").strip()
            if not slug:
                self._json({"ok": False, "error": "Missing id"}, 400)
                return
            try:
                hidden = [h for h in parse_hidden_ids() if h != slug]
                result = set_hidden_ids(hidden, sync_grids=True)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, "hidden": parse_hidden_ids(), **result})
            return

        if path == "/api/admin/add-game":
            slug = (data.get("slug") or "").strip()
            if not slug:
                self._json({"ok": False, "error": "Missing slug"}, 400)
                return
            try:
                result = import_wg_game(slug)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, "game": result, "catalog": len(load_wg_games())})
            return

        if path == "/api/admin/add-game-manual":
            try:
                result = add_manual_game(data)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, "game": result, "catalog": len(load_wg_games())})
            return

        if path == "/api/admin/sync-grids":
            try:
                grids = build_home_grids()
                write_home_grids(grids)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json(
                {
                    "ok": True,
                    "grids": {
                        "trending": len(grids["trending"]),
                        "new": len(grids["new"]),
                        "topRated": len(grids["topRated"]),
                    },
                }
            )
            return

        if path == "/api/admin/wg-scan":
            pull = bool(data.get("pull"))
            try:
                result = sync_wg_catalog(pull=pull)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, **result})
            return

        if path == "/api/admin/wg-import-batch":
            slugs = data.get("slugs") or []
            if not isinstance(slugs, list) or not slugs:
                self._json({"ok": False, "error": "Missing slugs[]"}, 400)
                return
            try:
                result = import_wg_games_batch(slugs)
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": str(exc)}, 500)
                return
            self._json({"ok": True, **result, "catalog": len(load_wg_games())})
            return

        if path == "/api/admin/import-wg":
            script = SCRIPTS / "import-wg-games.py"
            if not script.is_file():
                self._json({"ok": False, "error": "import-wg-games.py not found"}, 404)
                return
            try:
                import importlib.util

                spec = importlib.util.spec_from_file_location("import_wg_games", script)
                iw = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(iw)
                catalog, _ = iw.parse_catalog()
                if not catalog:
                    existing = load_wg_games()
                    self._json(
                        {
                            "ok": False,
                            "error": (
                                "WG catalog trống — không import được. "
                                f"Giữ nguyên {len(existing)} game hiện có. "
                                "Cần restore wgplayground-clone trước."
                            ),
                        },
                        400,
                    )
                    return
            except Exception as exc:  # noqa: BLE001
                self._json({"ok": False, "error": f"WG catalog check failed: {exc}"}, 500)
                return
            try:
                proc = subprocess.run(
                    [sys.executable, str(script)],
                    cwd=str(ROOT),
                    capture_output=True,
                    text=True,
                    timeout=600,
                    check=False,
                )
            except subprocess.TimeoutExpired:
                self._json({"ok": False, "error": "Import timed out (10 min)"}, 500)
                return
            if proc.returncode != 0:
                err = (proc.stderr or proc.stdout or "Import failed").strip()[-2000:]
                self._json({"ok": False, "error": err}, 500)
                return
            invalidate_wg_games_cache()
            games = load_wg_games()
            self._json(
                {
                    "ok": True,
                    "catalog": len(games),
                    "log": (proc.stdout or "")[-1500:],
                }
            )
            return

        self.send_error(404)


def main() -> int:
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    server = ThreadingHTTPServer(("127.0.0.1", port), AdminHandler)
    print(f"MonkeyMart admin: http://127.0.0.1:{port}/admin/")
    print(f"Homepage preview: http://127.0.0.1:{port}/")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
