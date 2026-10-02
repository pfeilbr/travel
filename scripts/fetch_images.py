#!/usr/bin/env python3
"""Fetch freely-licensed place photos from Wikimedia Commons.

Reads scripts/image_sources.json (place id -> Commons categories / searches, or Openverse
queries for CC-licensed Flickr photos, plus a curated include/exclude list), picks the best
free-licensed landscape JPEGs for each place, downloads them (Commons: the 1280px thumbnail) to
src/assets/places/<id>/<n>.jpg and writes attribution to src/data/images.json.

Commons is preferred. Openverse (api.openverse.org) is the fallback when Commons is throttled:
anonymous use allows ~20 queries/minute and 200/day, so each place gets at most one or two
queries. A source that fails (HTTP 429, timeouts) is skipped with a warning, and a download that
fails moves on to the next-best candidate.

Usage:
  python3 scripts/fetch_images.py [--only id,id] [--force] [--candidates]

  --only        process just these place ids (other entries in images.json are kept)
  --force       re-download images even if the file on disk already matches
  --candidates  print the ranked candidate list per place and exit (no downloads); use it
                to curate include/exclude in image_sources.json

Re-running is idempotent: an image is only downloaded when its file is missing or the
title recorded for that path in images.json differs. images.json is rewritten with sorted
keys so the output is stable. Stdlib only.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://commons.wikimedia.org/w/api.php"
OPENVERSE = "https://api.openverse.org/v1/images/"
USER_AGENT = "pfeilbr-travel-site/1.0 (https://github.com/pfeilbr/travel)"
THUMB_WIDTH = 1280  # Wikimedia only serves standard thumbnail widths (…, 960, 1280, 1920)
MIN_WIDTH = 1200
LANDSCAPE_RATIO = 1.2
MAX_RATIO = 2.4  # skip extreme panoramas; they crop badly
DEFAULT_COUNT = 5

REPO = Path(__file__).resolve().parents[1]
CONFIG_PATH = REPO / "scripts" / "image_sources.json"
ASSETS_DIR = Path("src/assets/places")
DATA_PATH = Path("src/data/images.json")

EXTMETA_FIELDS = (
    "LicenseShortName|License|LicenseUrl|Artist|Credit|ImageDescription|ObjectName|"
    "DateTimeOriginal|Categories|NonFree|Copyrighted"
)

# Title / description / category words that mark an image as not a scenic photo.
BAD_WORDS = (
    "map", "maps", "logo", "sign", "signs", "signage", "diagram", "plan", "document",
    "postcard", "stereoscop", "chart", "plaque", "marker", "brochure", "seal", "flag",
    "kiosk", "nypl", "historical", "historic american", "drawing", "engraving", "lithograph",
    "illustration", "painting", "scan", "newspaper", "letter", "sanborn", "aerial", "black and white",
    "b&w", "bw", "sepia", "screenshot", "insect", "spider", "beetle", "fungus", "mushroom",
    "golf", "toilet", "restroom", "parking", "selfie",
)
BAD_CATEGORY_WORDS = (
    "historical images", "postcards", "black and white", "maps of", "logos", "signs in",
    "stereoscopic", "nypl", "drawings", "paintings", "insects", "fungi", "golf",
)
GOOD_WORDS = ("autumn", "fall", "foliage", "falls", "waterfall", "cascade", "gorge", "lake",
              "sunset", "sunrise", "view", "glen", "beach", "shore", "trail")
WINTER_WORDS = ("snow", "ski", "skiing", "skier", "skiers", "winter", "slope", "slopes", "powder",
                "gondola", "chairlift", "lift", "summit", "peak", "village")


# --------------------------------------------------------------------------- pure helpers

def strip_html(text: str | None) -> str:
    """Remove tags and entities, collapse whitespace."""
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", str(text))
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _meta(ext: dict, key: str) -> str:
    value = (ext or {}).get(key, {})
    if isinstance(value, dict):
        value = value.get("value", "")
    return "" if value is None else str(value)


def normalize_license(short: str) -> str | None:
    """Map a Commons LicenseShortName to a canonical free label, or None if not free.

    Free = CC0, public domain, CC BY, CC BY-SA (any version). NC/ND/GFDL-only/fair use -> None.
    """
    s = strip_html(short).strip()
    low = s.lower()
    if not low:
        return None
    if any(bad in low for bad in ("-nc", " nc", "-nd", " nd", "fair use", "non-free", "nonfree")):
        return None
    if low in ("cc0", "cc-zero", "cc0 1.0", "cc zero") or low.startswith("cc0"):
        return "CC0"
    if low.startswith("public domain") or low in ("pd", "pdm", "pdm-owner") or low.startswith("pd-"):
        return "Public domain"
    m = re.match(r"^cc[ -]by(?:[ -](sa))?(?:[ -](\d(?:\.\d)?))?(?:[ -]([a-z]{2,}))?$", low)
    if m:
        sa, version, _port = m.groups()
        label = "CC BY-SA" if sa else "CC BY"
        return f"{label} {version}" if version else label
    return None


def license_info(ext: dict) -> tuple[str, str] | None:
    """Return (license label, license url) for free images, else None."""
    if _meta(ext, "NonFree").strip().lower() in ("true", "1", "yes"):
        return None
    label = normalize_license(_meta(ext, "LicenseShortName")) or normalize_license(_meta(ext, "License"))
    if not label:
        return None
    url = _meta(ext, "LicenseUrl").strip()
    if not url:
        if label == "CC0":
            url = "https://creativecommons.org/publicdomain/zero/1.0/"
        elif label == "Public domain":
            url = "https://en.wikipedia.org/wiki/Public_domain"
    if url.startswith("//"):
        url = "https:" + url
    return label, url


def thumb_info(imageinfo: dict) -> tuple[str, int, int] | None:
    """Pick the download URL and its dimensions: the 1600px thumb, else the original."""
    url = imageinfo.get("thumburl") or imageinfo.get("url")
    if not url:
        return None
    width = imageinfo.get("thumbwidth") or imageinfo.get("width")
    height = imageinfo.get("thumbheight") or imageinfo.get("height")
    if not width or not height:
        return None
    return url, int(width), int(height)


def _words(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9&]+", text.lower()))


def looks_unsuitable(title: str, description: str = "", categories: str = "") -> bool:
    """Heuristic filter for maps, signs, documents, historical / b&w images etc."""
    hay = f"{title} {description}".lower()
    words = _words(hay)
    for bad in BAD_WORDS:
        if (" " in bad and bad in hay) or bad in words or (bad == "stereoscop" and bad in hay):
            return True
    cats = categories.lower()
    return any(bad in cats for bad in BAD_CATEGORY_WORDS)


def photo_year(ext: dict) -> int | None:
    m = re.search(r"\b(1[89]\d\d|20\d\d)\b", strip_html(_meta(ext, "DateTimeOriginal")))
    return int(m.group(1)) if m else None


def is_candidate(page: dict, min_width: int = MIN_WIDTH, ratio: float = LANDSCAPE_RATIO,
                 heuristics: bool = True) -> bool:
    """True if a page (imageinfo API result) is a free, landscape, large-enough JPEG photo."""
    infos = page.get("imageinfo") or []
    if not infos:
        return False
    info = infos[0]
    if info.get("mime") != "image/jpeg":
        return False
    width, height = int(info.get("width") or 0), int(info.get("height") or 0)
    if width < min_width or height <= 0:
        return False
    if not (width > height * ratio and width <= height * MAX_RATIO):
        return False
    ext = info.get("extmetadata") or {}
    if license_info(ext) is None:
        return False
    if not heuristics:
        return True
    year = photo_year(ext)
    if year is not None and year < 1970:
        return False
    return not looks_unsuitable(page.get("title", ""), strip_html(_meta(ext, "ImageDescription")),
                                _meta(ext, "Categories"))


def score(page: dict, prefer: list[str] | None = None, winter: bool = False) -> float:
    """Higher is better: featured/quality images, scenic keywords, resolution, aspect."""
    info = page["imageinfo"][0]
    ext = info.get("extmetadata") or {}
    cats = _meta(ext, "Categories").lower()
    text = f"{page.get('title', '')} {strip_html(_meta(ext, 'ImageDescription'))}".lower()
    s = 0.0
    if "featured pictures" in cats:
        s += 30
    if "quality images" in cats:
        s += 20
    if "valued images" in cats:
        s += 10
    words = _words(text)
    s += sum(2 for w in (WINTER_WORDS if winter else GOOD_WORDS) if w in words)
    s += sum(5 for w in (prefer or []) if w.lower() in text)
    w, h = int(info["width"]), int(info["height"])
    s += min(w / 1000.0, 5.0)
    if 1.3 <= w / h <= 1.8:
        s += 3
    return round(s, 3)


def openverse_license(code: str, version: str | None) -> str:
    """('by-sa', '2.0') -> 'CC BY-SA 2.0'; cc0 / pdm map to CC0 / Public domain."""
    code = (code or "").lower()
    if code == "cc0":
        return "CC0"
    if code in ("pdm", "pd"):
        return "Public domain"
    return f"CC {code.upper()} {version}".strip() if version else f"CC {code.upper()}"


def openverse_page(r: dict) -> dict | None:
    """Convert an Openverse image result to the Commons imageinfo shape used everywhere else."""
    if not r.get("id") or not r.get("url") or not r.get("width") or not r.get("height"):
        return None
    ftype = (r.get("filetype") or "").lower() or r["url"].rsplit(".", 1)[-1].split("?")[0].lower()
    tags = "|".join(t.get("name", "") for t in r.get("tags") or [] if isinstance(t, dict))
    label = strip_html(r.get("title") or "")
    ext = {
        "LicenseShortName": {"value": openverse_license(r.get("license", ""), r.get("license_version"))},
        "LicenseUrl": {"value": r.get("license_url") or ""},
        "Artist": {"value": r.get("creator") or ""},
        "ImageDescription": {"value": label},
        "Categories": {"value": tags},
    }
    return {
        "title": f"Openverse:{r['id']}",
        "label": label,
        "sourceUrl": r.get("foreign_landing_url") or r["url"],
        "provider": r.get("provider") or r.get("source") or "",
        "imageinfo": [{
            "mime": "image/jpeg" if ftype in ("jpg", "jpeg") else f"image/{ftype}",
            "width": int(r["width"]), "height": int(r["height"]), "url": r["url"], "extmetadata": ext,
        }],
    }


def mentions(page: dict, words: list[str]) -> bool:
    """True if the title, label, description or tags mention any of `words` (case-insensitive)."""
    if not words:
        return True
    info = (page.get("imageinfo") or [{}])[0]
    ext = info.get("extmetadata") or {}
    hay = " ".join((page.get("title", ""), page.get("label", ""), strip_html(_meta(ext, "ImageDescription")),
                    _meta(ext, "Categories"))).lower().replace("_", " ")
    return any(w.lower() in hay for w in words)


def clean_title(title: str) -> str:
    """'File:Lucifer_Falls_(2019)_DSC_1234.jpg' -> 'Lucifer Falls (2019)'."""
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(jpe?g|png|tiff?)$", "", name, flags=re.I)
    name = name.replace("_", " ")
    name = re.sub(r"\b(DSC|IMG|DSCN|DSCF|P\d{3}|PXL|GOPR)[ _-]?\d+\b", "", name, flags=re.I)
    name = re.sub(r"\b\d{8}[ _-]?\d{0,6}\b", "", name)
    name = re.sub(r"\s*[-–,]\s*$", "", name)
    return re.sub(r"\s+", " ", name).strip(" -–,")


def make_alt(title: str, description: str = "", nearby: str | None = None,
             override: str | None = None) -> str:
    """Short human description. Nearby fallbacks always name the place they show."""
    if override:
        alt = override.strip()
    else:
        desc = strip_html(description)
        desc = re.split(r"(?<=[.!?])\s", desc)[0] if desc else ""
        alt = desc if 8 <= len(desc) <= 140 else clean_title(title)
    if nearby and nearby.lower() not in alt.lower():
        alt = f"{alt} (nearby {nearby})"
    return alt


def file_page_url(title: str) -> str:
    return "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"), safe=":()_,.-'")


def image_path(place_id: str, n: int) -> str:
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", place_id):
        raise ValueError(f"bad place id: {place_id!r}")
    return f"{ASSETS_DIR.as_posix()}/{place_id}/{n}.jpg"


def build_entry(place_id: str, n: int, page: dict, nearby: str | None = None,
                alt_override: str | None = None) -> dict:
    info = page["imageinfo"][0]
    ext = info.get("extmetadata") or {}
    lic = license_info(ext)
    if lic is None:
        raise ValueError(f"{page.get('title')}: not a free license")
    thumb = thumb_info(info)
    if thumb is None:
        raise ValueError(f"{page.get('title')}: no image url")
    _url, width, height = thumb
    author = strip_html(_meta(ext, "Artist")) or strip_html(_meta(ext, "Credit")) or "Unknown"
    return {
        "file": image_path(place_id, n),
        "title": page["title"],
        "alt": make_alt(page.get("label") or page["title"], _meta(ext, "ImageDescription"), nearby, alt_override),
        "author": author,
        "license": lic[0],
        "licenseUrl": lic[1],
        "sourceUrl": page.get("sourceUrl") or file_page_url(page["title"]),
        "width": width,
        "height": height,
        "nearby": bool(nearby),
    }


def normalize_include(items: list) -> list[dict]:
    out = []
    for item in items or []:
        if isinstance(item, str):
            item = {"title": item}
        title = item["title"]
        if not title.startswith("File:"):
            title = "File:" + title
        out.append({**item, "title": title})
    return out


def select_pages(pages: dict[str, dict], ranked_titles: list[str], include: list[dict],
                 exclude: list[str], count: int) -> list[str]:
    """Pinned includes first (in order), then the best-ranked remaining candidates."""
    excluded = {t if t.startswith("File:") else "File:" + t for t in exclude or []}
    chosen: list[str] = []
    for item in include:
        t = item["title"]
        if t in pages and t not in excluded and t not in chosen:
            chosen.append(t)
    for t in ranked_titles:
        if len(chosen) >= count:
            break
        if t not in excluded and t not in chosen:
            chosen.append(t)
    return chosen[:count]


def render_json(data: dict) -> str:
    return json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def needs_download(dest: Path, old_entry: dict | None, title: str, force: bool) -> bool:
    if force or not dest.exists() or dest.stat().st_size == 0:
        return True
    return not old_entry or old_entry.get("title") != title


# --------------------------------------------------------------------------- network

def _request(url: str, tries: int = 5) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    delay = 2.0
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < tries - 1:
                retry = e.headers.get("Retry-After")
                time.sleep(float(retry) if retry and retry.isdigit() else delay)
                delay *= 2
                continue
            raise
        except urllib.error.URLError:
            if attempt < tries - 1:
                time.sleep(delay)
                delay *= 2
                continue
            raise
    raise RuntimeError("unreachable")


def api(**params) -> dict:
    params.update(format="json", formatversion="2", maxlag="5")
    return json.loads(_request(API + "?" + urllib.parse.urlencode(params)))


SKIP_SUBCATS = ("historical", "nypl", "postcard", "stereoscopic", "sanborn", "maps", "golf",
                "aerial", "people", "aircraft", "ship", "plancton", "school", "church", "airport",
                "olympic", "ski", "club", "crash", "station", "sports", "equestrian")


def category_files(category: str, depth: int = 1, _seen: set | None = None,
                   skip: tuple[str, ...] = SKIP_SUBCATS) -> list[str]:
    seen = _seen if _seen is not None else set()
    if category in seen:
        return []
    seen.add(category)
    files: list[str] = []
    subcats: list[str] = []
    cont: dict = {}
    while True:
        d = api(action="query", list="categorymembers", cmtitle=category, cmlimit="500",
                cmtype="file|subcat", **cont)
        for m in d.get("query", {}).get("categorymembers", []):
            (files if m["ns"] == 6 else subcats).append(m["title"])
        if "continue" not in d:
            break
        cont = {"cmcontinue": d["continue"]["cmcontinue"]}
    if depth > 0:
        for sub in subcats:
            if not any(w in sub.lower() for w in skip):
                files += category_files(sub, depth - 1, seen, skip)
    return files


def search_files(query: str, limit: int = 50) -> list[str]:
    d = api(action="query", list="search", srsearch=f"{query} filetype:bitmap", srnamespace="6",
            srlimit=str(limit))
    return [r["title"] for r in d.get("query", {}).get("search", [])]


def image_infos(titles: list[str]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    uniq = list(dict.fromkeys(titles))
    for i in range(0, len(uniq), 50):
        d = api(action="query", titles="|".join(uniq[i:i + 50]), prop="imageinfo",
                iiprop="url|extmetadata|size|mime", iiurlwidth=str(THUMB_WIDTH),
                iiextmetadatafilter=EXTMETA_FIELDS, iiextmetadatalanguage="en")
        for p in d.get("query", {}).get("pages", []):
            if p.get("imageinfo"):
                out[p["title"]] = p
    return out


_last_openverse = 0.0


def openverse_search(query: str, page_size: int = 20) -> list[dict]:
    """Free-licensed (CC BY / BY-SA / CC0 / PDM) wide photos for a query, as imageinfo-shaped pages."""
    global _last_openverse
    wait = 3.2 - (time.time() - _last_openverse)  # anonymous burst limit is 20/minute
    if wait > 0:
        time.sleep(wait)
    _last_openverse = time.time()
    q = urllib.parse.urlencode({"q": query, "license": "by,by-sa,cc0,pdm", "category": "photograph",
                                "aspect_ratio": "wide", "page_size": str(page_size), "mature": "false"})
    d = json.loads(_request(f"{OPENVERSE}?{q}", tries=2))
    return [p for p in (openverse_page(r) for r in d.get("results", [])) if p]


# --------------------------------------------------------------------------- orchestration

_commons_down = False  # set after Commons fails so the rest of this place skips it quickly


def _commons(fn, *args):
    """Call a Commons API helper; on failure mark Commons down for this run and return None."""
    global _commons_down
    if _commons_down:
        return None
    try:
        return fn(*args)
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
        print(f"  warning: Commons unavailable ({e}); skipping Commons for this place", file=sys.stderr)
        _commons_down = True
        return None

def gather(place: dict) -> tuple[dict[str, dict], list[str], dict[str, str | None]]:
    """Return (pages, ranked candidate titles, title -> nearby label).

    Commons sources run first. Openverse sources marked "fallback" only run when Commons came up
    short of the place's count (each query spends the small anonymous daily budget).
    """
    origin: dict[str, str | None] = {}
    order: list[str] = []
    skip = tuple(w for w in SKIP_SUBCATS if w not in place.get("keep_subcats", []))
    sources = place.get("sources", [])
    for src in sources:
        if "openverse" in src:
            continue
        if "category" in src:
            titles = _commons(category_files, src["category"], int(src.get("depth", 1)), None, skip) or []
        else:
            titles = _commons(search_files, src["search"], int(src.get("limit", 50))) or []
        for t in titles:
            if t not in origin:
                origin[t] = src.get("nearby")
                order.append(t)
    include = normalize_include(place.get("include", []))
    for item in include:
        if item["title"] not in origin or "nearby" in item:
            origin[item["title"]] = item.get("nearby")
        if item["title"] not in order:
            order.append(item["title"])
    pages: dict[str, dict] = (_commons(image_infos, order) or {}) if order else {}
    min_width = int(place.get("min_width", MIN_WIDTH))
    have = sum(1 for t in order if t in pages and is_candidate(pages[t], min_width=min_width))
    count = int(place.get("count", DEFAULT_COUNT))
    for src in sources:
        if "openverse" not in src or (src.get("fallback") and have >= count):
            continue
        try:
            found = openverse_search(src["openverse"])
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, ValueError) as e:
            print(f"  warning: Openverse query failed ({e})", file=sys.stderr)
            continue
        must = src.get("must", place.get("must", []))
        for p in found:
            if mentions(p, must) and p["title"] not in pages:
                pages[p["title"]] = p
                origin.setdefault(p["title"], src.get("nearby"))
                order.append(p["title"])
    prefer = place.get("prefer", [])
    winter = bool(place.get("winter"))
    cands = [t for t in order if t in pages and is_candidate(pages[t], min_width=min_width)]
    # Primary-place photos rank above nearby fallbacks; ties broken by title for determinism.
    ranked = sorted(cands, key=lambda t: (origin.get(t) is not None, -score(pages[t], prefer, winter), t))
    # Pinned includes only need a free license / JPEG (they were picked by a human).
    pinned_ok = {i["title"] for i in include
                 if i["title"] in pages and is_candidate(pages[i["title"]], min_width=min(min_width, 1000),
                                                         ratio=1.0, heuristics=False)}
    pages = {t: p for t, p in pages.items() if t in cands or t in pinned_ok}
    return pages, ranked, origin


def process_place(place_id: str, place: dict, old: list[dict], force: bool, root: Path,
                  candidates_only: bool = False) -> list[dict]:
    global _commons_down
    _commons_down = False  # throttling comes and goes; give Commons a fresh try for every place
    pages, ranked, origin = gather(place)
    if candidates_only:
        print(f"\n== {place_id}: {len(ranked)} candidates")
        for t in ranked[:60]:
            info = pages[t]["imageinfo"][0]
            tag = f" [nearby {origin[t]}]" if origin.get(t) else ""
            print(f"  {score(pages[t], place.get('prefer')):6.1f} {info['width']}x{info['height']} {t}{tag}")
        return old
    if old and (not pages or _commons_down):
        print(f"  {place_id}: sources unavailable; keeping the {len(old)} existing images", file=sys.stderr)
        return old
    include = normalize_include(place.get("include", []))
    count = int(place.get("count", DEFAULT_COUNT))
    # Rank a few spares so a failed download falls through to the next-best photo.
    chosen = select_pages(pages, ranked, include, place.get("exclude", []), count + 8)
    old_by_file = {e["file"]: e for e in old}
    alts = dict(place.get("alt", {}))
    alts.update({i["title"]: i["alt"] for i in include if i.get("alt")})
    entries: list[dict] = []
    for title in chosen:
        if len(entries) >= count:
            break
        page = pages[title]
        entry = build_entry(place_id, len(entries) + 1, page, origin.get(title), alts.get(title))
        dest = root / entry["file"]
        if needs_download(dest, old_by_file.get(entry["file"]), title, force):
            url = thumb_info(page["imageinfo"][0])[0]
            try:
                data = _request(url, tries=2)
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
                print(f"  skip {title}: download failed ({e})", file=sys.stderr)
                continue
            if not data.startswith(b"\xff\xd8"):
                print(f"  skip {title}: not a JPEG", file=sys.stderr)
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            print(f"  {entry['file']} <- {title} ({len(data) // 1024} KB)")
            time.sleep(1.0)  # be polite to the image host
        else:
            print(f"  {entry['file']} up to date")
        entries.append(entry)
    if len(entries) < count:
        print(f"  warning: {place_id}: only {len(entries)} of {count} images", file=sys.stderr)
    # Remove stale numbered files beyond the new count.
    folder = root / ASSETS_DIR / place_id
    if folder.is_dir():
        for f in folder.glob("*.jpg"):
            if f.stem.isdigit() and int(f.stem) > len(entries):
                f.unlink()
    return entries


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--only", help="comma-separated place ids")
    ap.add_argument("--force", action="store_true", help="re-download existing images")
    ap.add_argument("--candidates", action="store_true", help="list ranked candidates only")
    ap.add_argument("--config", default=str(CONFIG_PATH))
    ap.add_argument("--root", default=str(REPO))
    args = ap.parse_args(argv)

    root = Path(args.root)
    config = json.loads(Path(args.config).read_text(encoding="utf-8"))
    places = config["places"]
    only = [s.strip() for s in args.only.split(",")] if args.only else list(places)
    unknown = [p for p in only if p not in places]
    if unknown:
        ap.error(f"unknown place id(s): {', '.join(unknown)}")

    data_file = root / DATA_PATH
    existing = json.loads(data_file.read_text(encoding="utf-8")) if data_file.exists() else {}
    result = {k: v for k, v in existing.items() if k in places}
    for pid in only:
        print(f"{pid}:")
        result[pid] = process_place(pid, places[pid], existing.get(pid, []), args.force, root,
                                    args.candidates)
        if not args.candidates:  # save as we go so an interrupted run keeps its progress
            data_file.parent.mkdir(parents=True, exist_ok=True)
            data_file.write_text(render_json(result), encoding="utf-8")
    if not args.candidates:
        print(f"wrote {DATA_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
