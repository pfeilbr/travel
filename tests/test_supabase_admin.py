import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from supabase_admin import anon_key_from, auth_payload, redacted  # noqa: E402


class AuthPayloadTest(unittest.TestCase):
    def test_defaults_enable_email_only(self):
        b = auth_payload({})
        self.assertEqual(b["site_url"], "https://pfeilbr.github.io/travel/")
        self.assertIn("https://pfeilbr.github.io/travel/auth/callback/", b["uri_allow_list"])
        self.assertIn("http://localhost:4321/travel/auth/callback/", b["uri_allow_list"])
        self.assertTrue(b["external_email_enabled"])
        self.assertFalse(b["external_google_enabled"])
        self.assertFalse(b["external_apple_enabled"])
        self.assertNotIn("smtp_host", b)

    def test_site_url_gets_trailing_slash(self):
        self.assertEqual(auth_payload({"SITE_URL": "https://x.dev/app"})["site_url"], "https://x.dev/app/")

    def test_google_needs_both_values(self):
        self.assertFalse(auth_payload({"GOOGLE_CLIENT_ID": "id"})["external_google_enabled"])
        b = auth_payload({"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "s"})
        self.assertTrue(b["external_google_enabled"])
        self.assertEqual(b["external_google_client_id"], "id")

    def test_apple_and_smtp(self):
        b = auth_payload({"APPLE_CLIENT_ID": "a", "APPLE_CLIENT_SECRET": "b", "SMTP_HOST": "smtp.resend.com",
                          "SMTP_USER": "resend", "SMTP_PASS": "p", "SMTP_SENDER_EMAIL": "hi@x.dev"})
        self.assertTrue(b["external_apple_enabled"])
        self.assertEqual(b["smtp_port"], "465")
        self.assertEqual(b["smtp_sender_name"], "Waypoint")

    def test_redaction_hides_secrets(self):
        r = redacted(auth_payload({"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "s", "SMTP_HOST": "h",
                                   "SMTP_USER": "u", "SMTP_PASS": "p", "SMTP_SENDER_EMAIL": "e"}))
        self.assertEqual(r["external_google_secret"], "***")
        self.assertEqual(r["smtp_pass"], "***")
        self.assertEqual(r["external_google_client_id"], "id")


class AnonKeyTest(unittest.TestCase):
    def test_prefers_legacy_anon(self):
        keys = [{"name": "service_role", "api_key": "svc"}, {"name": "anon", "api_key": "anon"}, {"type": "publishable", "api_key": "pub"}]
        self.assertEqual(anon_key_from(keys), "anon")

    def test_falls_back_to_publishable_and_never_service_role(self):
        self.assertEqual(anon_key_from([{"name": "service_role", "api_key": "svc"}, {"type": "publishable", "api_key": "pub"}]), "pub")
        with self.assertRaises(LookupError):
            anon_key_from([{"name": "service_role", "api_key": "svc"}])


if __name__ == "__main__":
    unittest.main()
