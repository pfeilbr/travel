#!/usr/bin/env python3
"""Configure the hosted Supabase project from CI (deterministic, re-runnable).

Subcommands
  auth-config   Merge into the shared project's auth settings (add-only: redirect URLs are merged,
                providers only switched on, an existing site URL kept). Prefer `app-platform add-app`.
                Builds on: site URL, redirect allow-list,
                email + magic link, and Google / Apple / custom SMTP when their
                secrets are present (providers without secrets are left disabled).
  anon-key      Print the project's public anon (publishable) key, for the build.
  migrate       Apply pending supabase/migrations/*.sql through the Management API
                (token only, no DB password). Applied versions are recorded in
                supabase_migrations.schema_migrations, the same table the Supabase CLI uses.

Environment
  SUPABASE_ACCESS_TOKEN   personal access token (required)
  SUPABASE_PROJECT_REF    project ref, e.g. abcdefghijklmnop (required)
  SITE_URL                default https://pfeilbr.github.io/travel/
  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
  APPLE_CLIENT_ID / APPLE_CLIENT_SECRET
  SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_SENDER_EMAIL / SMTP_SENDER_NAME

Usage: python3 scripts/supabase_admin.py migrate [--dry-run]
       python3 scripts/supabase_admin.py auth-config [--dry-run]
       python3 scripts/supabase_admin.py anon-key
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from pathlib import Path

API = "https://api.supabase.com/v1"
DEFAULT_SITE = "https://pfeilbr.github.io/travel/"
LOCAL_DEV = "http://localhost:4321/travel/"


def auth_payload(env: dict[str, str]) -> dict:
    """Build the auth config PATCH body from environment values. Pure; unit-tested."""
    site = env.get("SITE_URL") or DEFAULT_SITE
    site = site if site.endswith("/") else site + "/"
    body: dict = {
        "site_url": site,
        "uri_allow_list": ",".join([site + "auth/callback/", site + "**", LOCAL_DEV + "auth/callback/"]),
        "external_email_enabled": True,
        "mailer_autoconfirm": False,
        "password_min_length": 8,
        "mailer_otp_exp": 3600,
    }
    google = env.get("GOOGLE_CLIENT_ID"), env.get("GOOGLE_CLIENT_SECRET")
    body["external_google_enabled"] = all(google)
    if all(google):
        body["external_google_client_id"], body["external_google_secret"] = google
    apple = env.get("APPLE_CLIENT_ID"), env.get("APPLE_CLIENT_SECRET")
    body["external_apple_enabled"] = all(apple)
    if all(apple):
        body["external_apple_client_id"], body["external_apple_secret"] = apple
    smtp_keys = ("SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_SENDER_EMAIL")
    if all(env.get(k) for k in smtp_keys):
        body.update({
            "smtp_host": env["SMTP_HOST"],
            "smtp_port": str(env.get("SMTP_PORT") or "465"),
            "smtp_user": env["SMTP_USER"],
            "smtp_pass": env["SMTP_PASS"],
            "smtp_admin_email": env["SMTP_SENDER_EMAIL"],
            "smtp_sender_name": env.get("SMTP_SENDER_NAME") or "Waypoint",
            "rate_limit_email_sent": 100,
        })
    return body


def redacted(body: dict) -> dict:
    return {k: ("***" if any(s in k for s in ("secret", "pass")) else v) for k, v in body.items()}


def anon_key_from(keys: list[dict]) -> str:
    """Pick the browser-safe key: the legacy 'anon' JWT, else the first publishable key."""
    for k in keys:
        if k.get("name") == "anon" and k.get("api_key"):
            return k["api_key"]
    for k in keys:
        if k.get("type") == "publishable" and k.get("api_key"):
            return k["api_key"]
    raise LookupError("no anon/publishable key found")


MIGRATIONS_DIR = Path("supabase/migrations")
TRACKING_DDL = (
    "create schema if not exists supabase_migrations; "
    "create table if not exists supabase_migrations.schema_migrations "
    "(version text primary key, statements text[], name text);"
)


def parse_migration(path: Path) -> tuple[str, str]:
    """`20261001120000_init.sql` -> ("20261001120000", "init")."""
    m = re.fullmatch(r"(\d{14})_([a-z0-9_]+)\.sql", path.name)
    if not m:
        raise ValueError(f"bad migration filename: {path.name}")
    return m.group(1), m.group(2)


def pending_migrations(files: list[Path], applied: set[str]) -> list[tuple[str, str, Path]]:
    """Local migrations not yet applied, oldest first."""
    rows = sorted((*parse_migration(f), f) for f in files)
    return [r for r in rows if r[0] not in applied]


def migration_sql(version: str, name: str, sql: str) -> str:
    """One atomic batch: the migration plus its tracking row."""
    safe = name.replace("'", "''")
    return (f"begin;\n{sql.rstrip().rstrip(';')};\n"
            f"insert into supabase_migrations.schema_migrations (version, name) values ('{version}', '{safe}');\n"
            "commit;")


def _query(ref: str, token: str, sql: str):
    return _request("POST", f"/projects/{ref}/database/query", token, {"query": sql})


def _request(method: str, path: str, token: str, body: dict | None = None):
    req = urllib.request.Request(
        API + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json", "User-Agent": "pfeilbr-travel/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
        return json.loads(raw) if raw else None


def shared_safe(current: dict, body: dict) -> dict:
    """Make a PATCH safe for the shared app-platform project: only ever add.
    Redirect URLs are merged into the existing allow-list, the site URL is kept if one is set,
    and providers are only switched on (a missing secret never disables another app's sign-in)."""
    out = {k: v for k, v in body.items() if not (k.startswith("external_") and k.endswith("_enabled") and v is False)}
    existing = [u.strip() for u in (current.get("uri_allow_list") or "").split(",") if u.strip()]
    for u in (body.get("uri_allow_list") or "").split(","):
        if u.strip() and u.strip() not in existing:
            existing.append(u.strip())
    out["uri_allow_list"] = ",".join(existing)
    if current.get("site_url"):
        out.pop("site_url", None)
    return out


def main(argv: list[str]) -> int:
    if len(argv) < 2 or argv[1] not in ("auth-config", "anon-key", "migrate"):
        print(__doc__)
        return 2
    env = dict(os.environ)
    token, ref = env.get("SUPABASE_ACCESS_TOKEN"), env.get("SUPABASE_PROJECT_REF")
    if argv[1] == "auth-config" and "--dry-run" in argv:
        print(json.dumps(redacted(auth_payload(env)), indent=2, sort_keys=True))
        return 0
    if not token or not ref:
        print("SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF are required", file=sys.stderr)
        return 1
    if argv[1] == "migrate":
        _query(ref, token, TRACKING_DDL)
        rows = _query(ref, token, "select version from supabase_migrations.schema_migrations") or []
        todo = pending_migrations(sorted(MIGRATIONS_DIR.glob("*.sql")), {r["version"] for r in rows})
        for version, name, path in todo:
            print(f"{'would apply' if '--dry-run' in argv else 'applying'} {version}_{name}")
            if "--dry-run" not in argv:
                _query(ref, token, migration_sql(version, name, path.read_text(encoding="utf-8")))
        print(f"migrations: {len(todo)} pending, {len(rows)} already applied")
        return 0
    if argv[1] == "anon-key":
        print(anon_key_from(_request("GET", f"/projects/{ref}/api-keys?reveal=true", token)))
        return 0
    body = shared_safe(_request("GET", f"/projects/{ref}/config/auth", token) or {}, auth_payload(env))
    _request("PATCH", f"/projects/{ref}/config/auth", token, body)
    enabled = [p for p in ("google", "apple") if body.get(f"external_{p}_enabled")]
    print(f"auth config merged for {ref}: enabled={','.join(enabled) or 'none newly'} smtp={'custom' if 'smtp_host' in body else 'unchanged'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
