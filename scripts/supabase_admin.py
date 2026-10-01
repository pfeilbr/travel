#!/usr/bin/env python3
"""Configure the hosted Supabase project from CI (deterministic, re-runnable).

Subcommands
  auth-config   PATCH the project's auth settings: site URL, redirect allow-list,
                email + magic link, and Google / Apple / custom SMTP when their
                secrets are present (providers without secrets are left disabled).
  anon-key      Print the project's public anon (publishable) key, for the build.

Environment
  SUPABASE_ACCESS_TOKEN   personal access token (required)
  SUPABASE_PROJECT_REF    project ref, e.g. abcdefghijklmnop (required)
  SITE_URL                default https://pfeilbr.github.io/travel/
  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
  APPLE_CLIENT_ID / APPLE_CLIENT_SECRET
  SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_SENDER_EMAIL / SMTP_SENDER_NAME

Usage: python3 scripts/supabase_admin.py auth-config [--dry-run]
       python3 scripts/supabase_admin.py anon-key
"""

from __future__ import annotations

import json
import os
import sys
import urllib.request

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


def _request(method: str, path: str, token: str, body: dict | None = None):
    req = urllib.request.Request(
        API + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json", "User-Agent": "pfeilbr-travel/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
        return json.loads(raw) if raw else None


def main(argv: list[str]) -> int:
    if len(argv) < 2 or argv[1] not in ("auth-config", "anon-key"):
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
    if argv[1] == "anon-key":
        print(anon_key_from(_request("GET", f"/projects/{ref}/api-keys?reveal=true", token)))
        return 0
    body = auth_payload(env)
    _request("PATCH", f"/projects/{ref}/config/auth", token, body)
    enabled = [p for p in ("email", "google", "apple") if p == "email" or body.get(f"external_{p}_enabled")]
    print(f"auth config updated for {ref}: providers={','.join(enabled)} smtp={'custom' if 'smtp_host' in body else 'default'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
