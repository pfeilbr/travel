# CLAUDE.md

Everything travel and the things that go with it — trips and itineraries, destination guides,
packing lists, gear, interactive tools, points/loyalty and other reference material — published
as a static site to GitHub Pages
(https://pfeilbr.github.io/travel/) from the **public** repo `pfeilbr/travel`.

## How publishing works

- `site/` is the published root. No build step, no static-site generator: plain HTML/CSS/JS.
- `.github/workflows/pages.yml` runs on every push to `main`: unit tests -> `scripts/check_site.py`
  -> upload `site/` -> deploy. Pages source is "GitHub Actions" (not a branch).
- After pushing, verify the deploy: `gh run watch --repo pfeilbr/travel $(gh run list --repo pfeilbr/travel -L1 --json databaseId -q '.[0].databaseId') --exit-status`,
  then fetch the live URL and confirm the change is there.

## Conventions

- Content lives in sections, one folder per page with an `index.html`; supporting files (images,
  data) sit alongside it:
  - `site/trips/<yyyy-mm-place>/` — a specific trip (e.g. `2026-11-lisbon`)
  - `site/guides/<topic>/` — destination guides, how-tos, lessons learned
  - `site/gear/<topic>/` — gear reviews, packing lists
  - `site/tools/<name>/` — interactive pages (calculators, checklists, maps)
  - `site/reference/<topic>/` — points/loyalty, visas, airlines, airports, apps
  Add a new section only when nothing above fits.
- Every new page gets linked from `site/index.html` under its section. Every page needs a `<title>`.
- Use relative links (`../../assets/style.css`), never root-absolute (`/assets/...`): the site is
  served under `/travel/`, so root-absolute paths break on Pages.
- Shared styles in `site/assets/style.css`; colors are CSS variables with a dark-mode override.
  Pages must work at phone width.
- External scripts only from a CDN (cdnjs/jsdelivr/unpkg); keep everything else self-contained.

## Privacy — this repo is public

Never commit booking/confirmation numbers, passport or ID details, loyalty account numbers,
phone numbers, home addresses, or exact private lodging addresses. Summarize ("hotel near X")
instead. If raw private notes are needed for planning, keep them in a git-ignored `private/` folder.

## Workflow

- Small change -> `python3 -m unittest discover -s tests -v && python3 scripts/check_site.py site`
  -> commit -> push -> verify the live page.
- Preview locally with `python3 -m http.server 8000 -d site`.
- Anything done more than once becomes a script in `scripts/` with a test in `tests/`
  (stdlib only; no dependencies unless clearly worth it).
