import json
import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

import fetch_images as fi  # noqa: E402

REPO = Path(__file__).resolve().parents[1]


def page(title="File:Lucifer Falls autumn.jpg", width=4000, height=2667, mime="image/jpeg",
         license_short="CC BY-SA 4.0", artist='<a href="//commons.wikimedia.org/wiki/User:X">Jane &amp; Doe</a>',
         description="Lucifer Falls in autumn. Taken from the rim trail.", categories="Quality images",
         date="2019-10-12", license_url="https://creativecommons.org/licenses/by-sa/4.0"):
    ext = {
        "LicenseShortName": {"value": license_short},
        "LicenseUrl": {"value": license_url},
        "Artist": {"value": artist},
        "ImageDescription": {"value": description},
        "Categories": {"value": categories},
        "DateTimeOriginal": {"value": date},
    }
    return {
        "title": title,
        "imageinfo": [{
            "mime": mime, "width": width, "height": height,
            "url": "https://upload.wikimedia.org/x/full.jpg",
            "thumburl": "https://upload.wikimedia.org/x/1600px-full.jpg",
            "thumbwidth": 1600, "thumbheight": round(1600 * height / width),
            "extmetadata": ext,
        }],
    }


class LicenseTest(unittest.TestCase):
    def test_free_licenses_normalized(self):
        cases = {
            "CC BY-SA 4.0": "CC BY-SA 4.0",
            "CC BY 2.0": "CC BY 2.0",
            "CC-BY-SA-3.0": "CC BY-SA 3.0",
            "CC BY-SA 2.5 se": "CC BY-SA 2.5",
            "CC0": "CC0",
            "Public domain": "Public domain",
            "PD-USGov": "Public domain",
        }
        for raw, want in cases.items():
            self.assertEqual(fi.normalize_license(raw), want, raw)

    def test_non_free_rejected(self):
        for raw in ("CC BY-NC 2.0", "CC BY-NC-SA 4.0", "CC BY-ND 4.0", "Fair use", "", "GFDL",
                    "All rights reserved"):
            self.assertIsNone(fi.normalize_license(raw), raw)

    def test_license_info_url_and_nonfree_flag(self):
        ext = page(license_short="CC0", license_url="")["imageinfo"][0]["extmetadata"]
        self.assertEqual(fi.license_info(ext), ("CC0", "https://creativecommons.org/publicdomain/zero/1.0/"))
        ext["NonFree"] = {"value": "true"}
        self.assertIsNone(fi.license_info(ext))
        self.assertIsNone(fi.license_info({}))


class CandidateTest(unittest.TestCase):
    def test_good_photo_is_candidate(self):
        self.assertTrue(fi.is_candidate(page()))

    def test_filters(self):
        self.assertFalse(fi.is_candidate(page(mime="image/png")))
        self.assertFalse(fi.is_candidate(page(width=1000, height=600)))  # too small
        self.assertFalse(fi.is_candidate(page(width=3000, height=3000)))  # not landscape
        self.assertFalse(fi.is_candidate(page(width=9000, height=2000)))  # extreme panorama
        self.assertFalse(fi.is_candidate(page(license_short="CC BY-NC 2.0")))
        self.assertFalse(fi.is_candidate(page(title="File:Park map 2019.jpg")))
        self.assertFalse(fi.is_candidate(page(title="File:Entrance sign.jpg")))
        self.assertFalse(fi.is_candidate(page(categories="Historical images of the park")))
        self.assertFalse(fi.is_candidate(page(date="1905")))
        self.assertFalse(fi.is_candidate({"title": "File:x.jpg"}))

    def test_heuristics_do_not_match_inside_words(self):
        self.assertFalse(fi.looks_unsuitable("File:Designer bridge at the lake.jpg"))
        self.assertTrue(fi.looks_unsuitable("File:Trail map.jpg"))

    def test_score_prefers_quality_and_keywords(self):
        plain = page(categories="", description="", title="File:IMG 1.jpg")
        good = page()
        self.assertGreater(fi.score(good), fi.score(plain))
        self.assertGreater(fi.score(good, ["lucifer"]), fi.score(good))


class ThumbAndEntryTest(unittest.TestCase):
    def test_thumb_info_prefers_thumb(self):
        self.assertEqual(fi.thumb_info(page()["imageinfo"][0]),
                         ("https://upload.wikimedia.org/x/1600px-full.jpg", 1600, 1067))

    def test_thumb_info_falls_back_to_original(self):
        info = {"url": "https://u/x.jpg", "width": 1300, "height": 900}
        self.assertEqual(fi.thumb_info(info), ("https://u/x.jpg", 1300, 900))
        self.assertIsNone(fi.thumb_info({}))

    def test_build_entry_shape(self):
        e = fi.build_entry("robert-h-treman", 2, page())
        self.assertEqual(set(e), {"file", "title", "alt", "author", "license", "licenseUrl",
                                  "sourceUrl", "width", "height", "nearby"})
        self.assertEqual(e["file"], "src/assets/places/robert-h-treman/2.jpg")
        self.assertEqual(e["author"], "Jane & Doe")
        self.assertEqual(e["license"], "CC BY-SA 4.0")
        self.assertEqual(e["alt"], "Lucifer Falls in autumn.")
        self.assertEqual(e["sourceUrl"], "https://commons.wikimedia.org/wiki/File:Lucifer_Falls_autumn.jpg")
        self.assertEqual((e["width"], e["height"]), (1600, 1067))
        self.assertFalse(e["nearby"])

    def test_nearby_entry_names_place(self):
        e = fi.build_entry("firelight-camps", 1, page(title="File:Falls 1.jpg", description=""),
                           nearby="Buttermilk Falls State Park", alt_override="Waterfall in autumn")
        self.assertTrue(e["nearby"])
        self.assertEqual(e["alt"], "Waterfall in autumn (nearby Buttermilk Falls State Park)")
        e2 = fi.build_entry("firelight-camps", 1, page(), nearby="Buttermilk Falls State Park",
                            alt_override="Buttermilk Falls State Park in fall")
        self.assertEqual(e2["alt"], "Buttermilk Falls State Park in fall")

    def test_build_entry_rejects_nonfree(self):
        with self.assertRaises(ValueError):
            fi.build_entry("x", 1, page(license_short="CC BY-NC 4.0"))


class SlugAndTextTest(unittest.TestCase):
    def test_image_path(self):
        self.assertEqual(fi.image_path("green-lakes", 3), "src/assets/places/green-lakes/3.jpg")
        for bad in ("Green Lakes", "../x", "a/b", ""):
            with self.assertRaises(ValueError):
                fi.image_path(bad, 1)

    def test_clean_title_and_alt(self):
        self.assertEqual(fi.clean_title("File:Lucifer_Falls_(2019)_DSC_1234.jpg"), "Lucifer Falls (2019)")
        self.assertEqual(fi.make_alt("File:Round_Lake.jpg", ""), "Round Lake")
        self.assertEqual(fi.make_alt("File:x.jpg", "<b>Round Lake</b> at dawn. More."), "Round Lake at dawn.")

    def test_strip_html(self):
        self.assertEqual(fi.strip_html('<span>A &amp; <a href="#">B</a></span>\n C'), "A & B C")
        self.assertEqual(fi.strip_html(None), "")


class SelectionTest(unittest.TestCase):
    def test_pinned_first_then_ranked_minus_excluded(self):
        pages = {t: {} for t in ("File:A.jpg", "File:B.jpg", "File:C.jpg", "File:D.jpg")}
        include = fi.normalize_include(["C.jpg", {"title": "File:Missing.jpg"}])
        got = fi.select_pages(pages, ["File:A.jpg", "File:B.jpg", "File:C.jpg", "File:D.jpg"],
                              include, ["File:B.jpg"], 3)
        self.assertEqual(got, ["File:C.jpg", "File:A.jpg", "File:D.jpg"])

    def test_needs_download(self):
        with TemporaryDirectory() as d:
            dest = Path(d) / "1.jpg"
            self.assertTrue(fi.needs_download(dest, None, "File:A.jpg", False))
            dest.write_bytes(b"x")
            self.assertFalse(fi.needs_download(dest, {"title": "File:A.jpg"}, "File:A.jpg", False))
            self.assertTrue(fi.needs_download(dest, {"title": "File:B.jpg"}, "File:A.jpg", False))
            self.assertTrue(fi.needs_download(dest, {"title": "File:A.jpg"}, "File:A.jpg", True))


class OutputTest(unittest.TestCase):
    def test_render_json_is_deterministic_and_sorted(self):
        data = {"b": [fi.build_entry("b", 1, page())], "a": []}
        out = fi.render_json(data)
        self.assertEqual(out, fi.render_json(json.loads(out)))
        self.assertLess(out.index('"a"'), out.index('"b"'))
        self.assertTrue(out.endswith("\n"))

    def test_config_is_valid(self):
        cfg = json.loads((REPO / "scripts" / "image_sources.json").read_text())
        for pid, place in cfg["places"].items():
            fi.image_path(pid, 1)
            self.assertTrue(place["sources"], pid)
            for src in place["sources"]:
                self.assertTrue(("category" in src) ^ ("search" in src), (pid, src))

    def test_repo_images_json_matches_files(self):
        data_file = REPO / "src" / "data" / "images.json"
        if not data_file.exists():
            self.skipTest("images not fetched yet")
        data = json.loads(data_file.read_text())
        self.assertEqual(data_file.read_text(), fi.render_json(data))
        for pid, entries in data.items():
            for n, e in enumerate(entries, start=1):
                self.assertEqual(e["file"], fi.image_path(pid, n))
                self.assertTrue((REPO / e["file"]).is_file(), e["file"])
                self.assertIsNotNone(fi.normalize_license(e["license"]), e)


if __name__ == "__main__":
    unittest.main()
