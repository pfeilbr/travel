import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from check_site import check_site  # noqa: E402

DIST = Path(__file__).resolve().parents[1] / "dist"


def _write(root: Path, rel: str, text: str) -> None:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


class CheckSiteTest(unittest.TestCase):
    @unittest.skipUnless(DIST.is_dir(), "run `npm run build` first")
    def test_built_site_is_valid(self):
        self.assertEqual(check_site(DIST, "/travel"), [])

    def test_base_prefixed_links(self):
        with TemporaryDirectory() as d:
            root = Path(d)
            _write(root, "index.html", '<title>x</title><a href="/travel/a/">a</a><a href="/elsewhere/">b</a>')
            _write(root, "a/index.html", "<title>a</title>")
            self.assertEqual(check_site(root, "/travel"), ["index.html: broken link -> /elsewhere/"])

    def test_valid_links_pass(self):
        with TemporaryDirectory() as d:
            root = Path(d)
            _write(root, "index.html",
                   '<title>x</title><a href="trips/a/">a</a>'
                   '<a href="https://example.com">e</a><a href="#top">t</a>'
                   '<link href="/assets/s.css">')
            _write(root, "trips/a/index.html", '<title>a</title><a href="../../index.html">home</a>')
            _write(root, "assets/s.css", "")
            self.assertEqual(check_site(root), [])

    def test_broken_link_and_missing_title_reported(self):
        with TemporaryDirectory() as d:
            root = Path(d)
            _write(root, "index.html", '<a href="nope.html">x</a>')
            problems = check_site(root)
            self.assertIn("index.html: missing <title>", problems)
            self.assertIn("index.html: broken link -> nope.html", problems)

    def test_sitemap_must_match_indexable_pages(self):
        with TemporaryDirectory() as d:
            root = Path(d)
            _write(root, "index.html", "<title>x</title>")
            _write(root, "a/index.html", "<title>a</title>")
            _write(root, "private/index.html", '<title>p</title><meta name="robots" content="noindex">')
            _write(root, "sitemap.xml",
                   "<urlset><url><loc>https://h.io/travel/</loc></url>"
                   "<url><loc>https://h.io/travel/gone/</loc></url></urlset>")
            self.assertEqual(check_site(root, "/travel"), [
                "sitemap.xml: missing page -> https://h.io/travel/gone/",
                "sitemap.xml: page not listed -> a/index.html",
            ])


if __name__ == "__main__":
    unittest.main()
