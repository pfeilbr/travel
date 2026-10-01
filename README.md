# travel

Everything travel and the things that go with it — trip plans and itineraries, destination
guides, packing lists, gear, tools and calculators, points/loyalty notes, and reference
material — published as a static site on GitHub Pages.

**Live site:** https://pfeilbr.github.io/travel/

## Layout

```
site/                     # everything here is published as-is
  index.html              # landing page; link each published page from here
  assets/style.css        # shared styles
  trips/<yyyy-mm-place>/  # a specific trip: plan, itinerary, notes
  guides/<topic>/         # destination guides, how-tos, lessons learned
  gear/<topic>/           # gear reviews, packing lists
  tools/<name>/           # interactive pages (calculators, checklists, maps)
  reference/<topic>/      # points/loyalty, visas, airlines, airports, apps
scripts/check_site.py     # validates the site (titles, broken local links)
tests/                    # unit tests (stdlib unittest, no dependencies)
.github/workflows/pages.yml  # test -> validate -> deploy on every push to main
```

## Publishing

Push to `main`. The **Deploy to GitHub Pages** workflow runs the tests, validates `site/`,
and deploys it. There is no build step: what's in `site/` is what gets served.

To add a page:

1. Create `site/<section>/<slug>/index.html` (link `../../assets/style.css` for shared styles).
2. Add a link to it in `site/index.html`.
3. Check locally, then push.

## Local development

```bash
python3 -m http.server 8000 -d site
```

```bash
python3 -m unittest discover -s tests -v && python3 scripts/check_site.py site
```

## Note

This repo is **public**, and so is the site. Don't commit confirmation numbers, passport
details, home addresses, or anything else you wouldn't post publicly.
