# Waypoint (travel)

Everything travel and the things that go with it: trips and live availability checks, places with
photos and real ratings, wishlists, reviews and trip plans. It's a static web app on GitHub Pages
with Supabase for user accounts and data.

**Live:** https://pfeilbr.github.io/travel/

## What's in it

- **Landing page:** hero search (where / stay / drive), the latest live-checked trip, top picks, and browse-by-vibe tiles.
- **Explore and trip pages:** an Airbnb-style browse view. Photo-carousel cards, filter chips (roof, cabin, glamping, biking,
  fishing, waterfalls…), sorting, and a split list + map view with price pins. Filters live in the URL, so links are shareable.
- **Place pages:** photo mosaic and lightbox, a sticky booking card with live availability by lodging type, Google rating and
  review themes, cabin details, what's nearby, a map, and community reviews.
- **Ski section (`/ski/`):** a Camping | Ski switch in the header. Resorts across Vermont, New Hampshire, New York,
  Pennsylvania, Utah, Colorado, Montana, California & Tahoe, Arizona, Québec and British Columbia: a hub with a region bar,
  region pages (tips, which pass works, holiday events, list + map), an all-resorts explorer (filter by pass, sleigh rides,
  snowmobiling, ice skating, scenic lifts, nightlife…; sort by vertical, snowfall, price or live new snow), resort pages
  (stats and terrain mix, live snow and weather, where to stay, things to do, après, Christmas/New Year's and other events,
  getting there, reviews) and a holiday calendar (`/ski/holidays/`).
- **Biking, kayaking, pickleball and camping (`/bike/`, `/kayak/`, `/pickleball/`, `/camping/`):** the same regions,
  each with a hub (regions, close to home, destinations, events, filterable list + map) and spot pages (facts,
  features, live weather, outfitters, events, lodging, nearby, and cross-links to ski resorts and other activities).
  The header switches between Camping, Ski, Biking, Kayaking and Pickleball.
- **Live snow:** the browser asks [Open-Meteo](https://open-meteo.com/) (free, no key) for the 7-day snowfall forecast and
  last week's snow at each mountain's elevation. It's a model forecast; each resort links its official snow report.
- **Trips (`/trips/`):** dated live-availability checks of NY State Parks and DEC campgrounds (ReserveAmerica, Campspot),
  with per-type counts, base rates, cabin site numbers and gotchas. Once a trip's dates pass, its page says it's a snapshot.
- **Calendar feeds:** `/ski/events.ics` plus `/bike/`, `/kayak/`, `/pickleball/` and `/camping/events.ics` hold every
  confirmed 2026-27 event as an all-day event (subscribe to them); dates that only follow past years stay out until posted.
- **Search (`/search/`):** every campground, resort and spot, matched in the browser (accents and punctuation ignored).
- **Date-aware pages:** past trips and events are labeled and sorted last, resorts count down to opening day, spots say
  whether they're in season, and campgrounds say when they've closed.
- **Discoverability:** `sitemap.xml`, `robots.txt`, Open Graph/Twitter cards with 1200px images, schema.org JSON-LD
  (Campground, SkiResort, Event for confirmed dates), a 404 page and a web app manifest.
- **Accounts (Supabase Auth):** email + password, magic link, Google and Apple. Users get wishlists (heart any place),
  their own reviews, and trip plans.

## Stack

| Piece | Choice |
|---|---|
| Frontend | [Astro](https://astro.build) static build, vanilla TypeScript islands, Leaflet + OpenStreetMap |
| Hosting | GitHub Pages (`.github/workflows/pages.yml`) |
| Auth + DB | Supabase free tier: Postgres with SQL migrations and row-level security |
| Photos | Wikimedia Commons (free licenses, credited), fetched by `scripts/fetch_images.py`; Openverse (CC Flickr photos) as a fallback |
| Weather | Open-Meteo forecast API, called from the browser |
| Tests | Vitest (`tests/js`), Python unittest (`tests/*.py`), pgTAP RLS tests (`supabase/tests`) |
| Quality bar | WCAG AA contrast (axe-clean on key pages, light and dark), 375px with no sideways scroll, visible keyboard focus |

## Layout

```
src/
  pages/            routes: / explore/ trips/[slug]/ places/[id]/ wishlists/ account/ credits/ auth/callback/
                    ski/ ski/explore/ ski/holidays/ ski/[region]/ ski/resorts/[id]/
                    [pursuit]/ [pursuit]/[id]/ (bike, kayak, pickleball, camping)
  components/       Header, AuthModal, PlaceCard, Explorer (filters + map), PhotoMosaic, CommunityReviews…
                    ski/ResortCard, ski/SkiExplorer, ski/SnowReport, ski/RegionTabs
  data/             places.ts, trips.ts (typed content), images.json (generated photo credits)
                    ski/types.ts, ski/regions.ts, ski/resorts/*.ts (one file per research batch)
                    outdoors/types.ts, outdoors/pursuits.ts, outdoors/spots/*.ts
  lib/              supabase client, wishlist, filter/format helpers, paths
  assets/places/    downloaded photos (optimized at build)
supabase/
  migrations/       schema (profiles, wishlists, reviews, trip_plans) + RLS
  tests/            pgTAP tests run in CI
scripts/            fetch_images.py, supabase_admin.py, check_site.py (links, titles, sitemap)
```

## Develop

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321/travel/. Sign-in is hidden unless `.env` has the public Supabase URL and key (see `.env.example`).

```bash
npm test && npx astro check && npm run build && python3 -m unittest discover -s tests && python3 scripts/check_site.py dist --base /travel
```

## Deploy

Push to `main`:

- **Deploy to GitHub Pages:** type-check, tests, build, link check, deploy. It gets the browser Supabase key from the
  `SUPABASE_PROJECT_REF` variable and the `SUPABASE_ACCESS_TOKEN` secret.
- **Database:** pgTAP tests on a throwaway Supabase, then migrations (`scripts/supabase_admin.py migrate`, via the Management API)
  applied to the hosted project. Auth settings (providers, redirect allow-list) belong to the shared
  [app-platform](https://github.com/pfeilbr/app-platform) project and are never changed from this repo's CI.
- **Daily rebuild** (09:07 UTC): the Pages workflow also runs on a schedule so date-aware pages (past trips, closed
  campgrounds, upcoming events, opening-day badges) roll over without a push.
- **Link check** (Mondays): `scripts/check_links.py` fetches every official URL in `src/data`; a dead one fails the run.
- **Keep-alive** (daily): one public-key request to the database API so the free Supabase project, shared by all
  apps, never pauses after 7 idle days.

| Actions setting | Kind | Purpose |
|---|---|---|
| `SUPABASE_PROJECT_REF` | variable | hosted project |
| `SUPABASE_ACCESS_TOKEN` | secret | Management API: migrations, auth settings, browser key (the only Supabase secret) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | secrets | Google sign-in (already applied to the shared project) |
| `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET` | variable / secret | Apple sign-in (needs an Apple Developer account) |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_SENDER_EMAIL` / `SMTP_PASS` | variables / secret | sending email to real users (e.g. Resend) |

## Note

The repo and site are public. Never commit booking/confirmation numbers, IDs, or anything personal.
Availability and prices are point-in-time snapshots; always confirm on the booking site.
