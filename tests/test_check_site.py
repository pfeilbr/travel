import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from check_site import check_site  # noqa: E402

REPO_SITE = Path(__file__).resolve().parents[1] / "site"


def _write(root: Path, rel: str, text: str) -> None:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


class CheckSiteTest(unittest.TestCase):
    def test_repo_site_is_valid(self):
        self.assertEqual(check_site(REPO_SITE), [])

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


if __name__ == "__main__":
    unittest.main()
