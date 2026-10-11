import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import roadtrip_routes as rr  # noqa: E402


class SimplifyTest(unittest.TestCase):
    def test_straight_line_collapses_to_endpoints(self):
        pts = [[42.0, -71.0 + i * 0.01] for i in range(50)]
        self.assertEqual(rr.simplify(pts), [[42.0, -71.0], [42.0, round(-71.0 + 49 * 0.01, 5)]])

    def test_keeps_a_real_corner(self):
        pts = [[42.0, -71.0], [42.0, -70.5], [42.5, -70.5]]
        self.assertEqual(len(rr.simplify(pts)), 3)

    def test_drops_small_wiggles(self):
        pts = [[42.0, -71.0], [42.0005, -70.9], [42.0, -70.8]]  # ~55 m off the line
        self.assertEqual(len(rr.simplify(pts)), 2)

    def test_short_inputs_pass_through(self):
        self.assertEqual(rr.simplify([[1.0, 2.0]]), [[1.0, 2.0]])


if __name__ == "__main__":
    unittest.main()
