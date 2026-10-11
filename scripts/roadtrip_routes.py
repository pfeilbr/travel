#!/usr/bin/env python3
"""Driving routes for road-trip plans, from OSRM.

Reads scripts/roadtrip_waypoints.json ({slug: {plan_id: [[name, lat, lng], ...]}}), asks the public
OSRM router for the driving route through each plan's stops in order, and writes
src/data/roadtrips/routes.json: per plan a simplified polyline (Douglas-Peucker, ~300 m tolerance,
5-decimal coords) plus OSRM miles/minutes per leg. The page draws the polyline on its map; the
day-by-day drive times in the trip data are the curated numbers (OSRM runs slow on interstates).

Usage:
  python3 scripts/roadtrip_routes.py [--only slug]

Idempotent: output is rewritten with sorted keys; plans whose waypoints did not change are kept
without a network call. Stdlib only.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
import time
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CONFIG = REPO / "scripts" / "roadtrip_waypoints.json"
OUT = REPO / "src" / "data" / "roadtrips" / "routes.json"
OSRM = "https://router.project-osrm.org/route/v1/driving/"
USER_AGENT = "pfeilbr-travel-site/1.0 (https://github.com/pfeilbr/travel)"
TOLERANCE_M = 300


def _perp_m(p, a, b):
    """Distance in metres from p to segment a-b (equirectangular; fine at this scale)."""
    lat0 = math.radians((a[0] + b[0]) / 2)
    kx, ky = 111320 * math.cos(lat0), 110540
    px, py = (p[1] - a[1]) * kx, (p[0] - a[0]) * ky
    bx, by = (b[1] - a[1]) * kx, (b[0] - a[0]) * ky
    seg = bx * bx + by * by
    t = 0 if seg == 0 else max(0, min(1, (px * bx + py * by) / seg))
    return math.hypot(px - t * bx, py - t * by)


def simplify(points: list[list[float]], tol: float = TOLERANCE_M) -> list[list[float]]:
    """Iterative Douglas-Peucker on [lat, lng] points."""
    if len(points) < 3:
        return [list(p) for p in points]
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        i, j = stack.pop()
        best, idx = 0.0, -1
        for k in range(i + 1, j):
            d = _perp_m(points[k], points[i], points[j])
            if d > best:
                best, idx = d, k
        if best > tol:
            keep[idx] = True
            stack += [(i, idx), (idx, j)]
    return [[round(p[0], 5), round(p[1], 5)] for p, k in zip(points, keep) if k]


def route(stops: list[list]) -> dict:
    coords = ";".join(f"{lng},{lat}" for _, lat, lng in stops)
    req = urllib.request.Request(f"{OSRM}{coords}?overview=full&geometries=geojson", headers={"User-Agent": USER_AGENT})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.load(r)
            break
        except Exception as e:  # noqa: BLE001 - public demo server; retry then fail loudly
            if attempt == 3:
                raise
            print(f"  retry after {e}", file=sys.stderr)
            time.sleep(3 * (attempt + 1))
    rt = data["routes"][0]
    line = [[lat, lng] for lng, lat in rt["geometry"]["coordinates"]]
    legs = [
        {"from": a[0], "to": b[0], "miles": round(leg["distance"] / 1609.344), "minutes": round(leg["duration"] / 60)}
        for a, b, leg in zip(stops, stops[1:], rt["legs"])
    ]
    return {"line": simplify(line), "legs": legs}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--only", help="just this trip slug")
    args = ap.parse_args(argv)
    config = json.loads(CONFIG.read_text())
    out = json.loads(OUT.read_text()) if OUT.exists() else {}
    for slug, plans in config.items():
        if slug.startswith("_") or (args.only and slug != args.only):
            continue
        for plan_id, stops in plans.items():
            prev = out.get(slug, {}).get(plan_id)
            if prev and prev.get("stops") == stops:
                continue
            print(f"{slug}/{plan_id}: {len(stops)} stops")
            out.setdefault(slug, {})[plan_id] = {"stops": stops, **route(stops)}
            time.sleep(1)
        for plan_id in list(out.get(slug, {})):
            if plan_id not in plans:
                del out[slug][plan_id]
    OUT.write_text(json.dumps(out, indent=1, sort_keys=True) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
