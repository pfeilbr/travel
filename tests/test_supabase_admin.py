import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from supabase_admin import (  # noqa: E402
    anon_key_from, auth_payload, migration_sql, parse_migration, pending_migrations, redacted, shared_safe,
)


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


class SharedSafeTest(unittest.TestCase):
    CURRENT = {"site_url": "https://pfeilbr.github.io/travel/", "external_google_enabled": True,
               "uri_allow_list": "https://pfeilbr.github.io/other/**,https://pfeilbr.github.io/travel/auth/callback/"}

    def test_never_disables_providers_or_drops_other_apps(self):
        b = shared_safe(self.CURRENT, auth_payload({}))  # no Google env: must not switch Google off
        self.assertNotIn("external_google_enabled", b)
        self.assertNotIn("external_apple_enabled", b)
        urls = b["uri_allow_list"].split(",")
        self.assertEqual(urls[0], "https://pfeilbr.github.io/other/**")
        self.assertEqual(len(urls), len(set(urls)))
        self.assertIn("http://localhost:4321/travel/auth/callback/", urls)
        self.assertNotIn("site_url", b)

    def test_enables_and_sets_site_url_when_absent(self):
        b = shared_safe({}, auth_payload({"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "s"}))
        self.assertTrue(b["external_google_enabled"])
        self.assertEqual(b["site_url"], "https://pfeilbr.github.io/travel/")


class MigrateTest(unittest.TestCase):
    def test_parse_migration(self):
        self.assertEqual(parse_migration(Path("20261001120000_init.sql")), ("20261001120000", "init"))
        with self.assertRaises(ValueError):
            parse_migration(Path("init.sql"))

    def test_pending_is_sorted_and_skips_applied(self):
        files = [Path("20261003000000_b.sql"), Path("20261001120000_init.sql"), Path("20261002000000_a.sql")]
        todo = pending_migrations(files, {"20261001120000"})
        self.assertEqual([v for v, _, _ in todo], ["20261002000000", "20261003000000"])

    def test_migration_sql_is_atomic_and_tracked(self):
        sql = migration_sql("20261001120000", "init", "create table t (x int);\n")
        self.assertTrue(sql.startswith("begin;"))
        self.assertTrue(sql.endswith("commit;"))
        self.assertIn("create table t (x int);", sql)
        self.assertIn("values ('20261001120000', 'init')", sql)

    def test_real_migrations_parse(self):
        root = Path(__file__).resolve().parents[1] / "supabase" / "migrations"
        self.assertTrue(pending_migrations(sorted(root.glob("*.sql")), set()))


if __name__ == "__main__":
    unittest.main()
