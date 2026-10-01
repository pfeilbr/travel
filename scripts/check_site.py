#!/usr/bin/env python3
"""Validate the static site before publishing.

Checks every HTML file under the site directory for:
  - a <title> element
  - local href/src references that point at files that exist

Usage: python3 scripts/check_site.py [site_dir]   (default: site)
Exits non-zero and prints each problem if anything is wrong.
"""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse


class _RefCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[str] = []
        self.has_title = False

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.has_title = True
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.refs.append(value)


def _is_local(ref: str) -> bool:
    parsed = urlparse(ref)
    return not (parsed.scheme or parsed.netloc or ref.startswith("#"))


def _resolve(page: Path, ref: str, site: Path) -> Path:
    path = unquote(urlparse(ref).path)
    target = (site / path.lstrip("/")) if path.startswith("/") else (page.parent / path)
    if ref.endswith("/") or target.is_dir():
        target = target / "index.html"
    return target


def check_site(site: Path) -> list[str]:
    problems: list[str] = []
    for page in sorted(site.rglob("*.html")):
        collector = _RefCollector()
        collector.feed(page.read_text(encoding="utf-8"))
        rel = page.relative_to(site)
        if not collector.has_title:
            problems.append(f"{rel}: missing <title>")
        for ref in collector.refs:
            if _is_local(ref) and not _resolve(page, ref, site).exists():
                problems.append(f"{rel}: broken link -> {ref}")
    return problems


def main(argv: list[str]) -> int:
    site = Path(argv[1] if len(argv) > 1 else "site")
    if not site.is_dir():
        print(f"site directory not found: {site}")
        return 1
    problems = check_site(site)
    for p in problems:
        print(p)
    print(f"{'FAIL' if problems else 'OK'}: {len(problems)} problem(s) in {site}/")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
