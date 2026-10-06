#!/usr/bin/env python3
"""Check the external URLs in the typed data files for dead links.

Extracts every http(s) URL from string literals in src/data/**/*.ts, fetches each one
(HEAD, falling back to GET) with a browser-like User-Agent and prints a report grouped by
status. 403/429/5xx usually mean a bot wall, not a dead page, so they are listed but not
counted as broken.

Usage: python3 scripts/check_links.py [--json out.json] [--workers 16]
Exits non-zero when any URL is 404/410 or fails to resolve/connect.
"""

from __future__ import annotations

import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"
URL_RE = re.compile(r"""["'`](https?://[^"'`\s]+)["'`]""")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0 Safari/537.36")
SKIP_HOSTS = ("maps.google.com",)
GROUPS = [("ok", "OK"), ("moved", "Redirects to a different host"), ("dead", "404/410"),
          ("error", "DNS/connection errors"), ("blocked", "403/429/5xx (likely bot-blocked)")]


def _ssl_context() -> ssl.SSLContext:
    for ca in (os.environ.get("SSL_CERT_FILE"), "/root/.ccr/ca-bundle.crt"):
        if ca and Path(ca).is_file():
            return ssl.create_default_context(cafile=ca)
    return ssl.create_default_context()


CTX = _ssl_context()


def extract_urls() -> dict[str, list[str]]:
    """URL -> list of files (relative to the repo) it appears in."""
    found: dict[str, list[str]] = {}
    for path in sorted(DATA.rglob("*.ts")):
        rel = str(path.relative_to(ROOT))
        for url in URL_RE.findall(path.read_text(encoding="utf-8")):
            if "${" in url or urlparse(url).hostname in SKIP_HOSTS:
                continue  # template literals can't be fetched; Google Maps cid links are left alone
            found.setdefault(url, [])
            if rel not in found[url]:
                found[url].append(rel)
    return found


def _open(url: str, method: str, timeout: float):
    req = urllib.request.Request(url, method=method, headers={
        "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
        return resp.status, resp.geturl()


def check(url: str, timeout: float = 20) -> dict:
    result = {"url": url, "status": None, "final": url, "error": ""}
    for method in ("HEAD", "GET"):
        try:
            result["status"], result["final"] = _open(url, method, timeout)
            result["error"] = ""
            break
        except urllib.error.HTTPError as e:
            result["status"], result["final"], result["error"] = e.code, e.geturl() or url, ""
            if method == "GET":
                break  # some servers answer HEAD with 404/405/403, so always confirm with GET
        except Exception as e:  # DNS, TLS, timeout, connection reset
            result["status"], result["error"] = None, f"{type(e).__name__}: {getattr(e, 'reason', e)}"
    status = result["status"]
    if status is None:
        group = "error"
    elif status in (404, 410):
        group = "dead"
    elif status >= 400:
        group = "blocked"
    elif (urlparse(result["final"]).hostname or "").removeprefix("www.") != \
            (urlparse(url).hostname or "").removeprefix("www."):
        group = "moved"
    else:
        group = "ok"
    result["group"] = group
    return result


def main(argv: list[str]) -> int:
    args = argv[1:]
    out = args[args.index("--json") + 1] if "--json" in args else None
    workers = int(args[args.index("--workers") + 1]) if "--workers" in args else 16
    urls = extract_urls()
    print(f"checking {len(urls)} unique URLs from {DATA.relative_to(ROOT)}/ ...", file=sys.stderr)
    with ThreadPoolExecutor(max_workers=workers) as pool:
        results = list(pool.map(check, urls))
    for r in results:
        r["files"] = urls[r["url"]]
    for key, title in GROUPS:
        rows = sorted((r for r in results if r["group"] == key), key=lambda r: r["url"])
        print(f"\n== {title}: {len(rows)}")
        if key == "ok":
            continue
        for r in rows:
            extra = f" -> {r['final']}" if key == "moved" else f" {r['error']}" if r["error"] else ""
            print(f"  [{r['status'] or 'ERR'}] {r['url']}{extra}  ({', '.join(r['files'])})")
    if out:
        Path(out).write_text(json.dumps(results, indent=1) + "\n", encoding="utf-8")
    broken = sum(r["group"] in ("dead", "error") for r in results)
    print(f"\n{'FAIL' if broken else 'OK'}: {broken} broken of {len(results)} URL(s)")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
