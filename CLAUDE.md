# CLAUDE.md

**Waypoint**: everything travel and the things that go with it (trips with live availability, places with
photos and ratings, guides, gear). It's an Astro static web app on GitHub Pages
(https://pfeilbr.github.io/travel/) from the **public** repo `pfeilbr/travel`, with **Supabase** (free tier) for
auth (email + password, magic link, Google, Apple) and data (wishlists, reviews, trip plans).

## Architecture

- `src/pages` are routes. The site is served under `/travel/` (`astro.config.mjs` `base`). Build internal links
  with `url()` from `src/lib/paths.ts`, never hard-coded `/…`.
- Content is typed TypeScript in `src/data/` (`places.ts`, `trips.ts`, types in `types.ts`). A place is reusable;
  a trip holds the date-specific live availability and prices for a set of places.
- Photos: `scripts/fetch_images.py` (config `scripts/image_sources.json`) downloads freely licensed Wikimedia
  Commons images to `src/assets/places/<id>/` and writes credits to `src/data/images.json`. Only free licenses;
  always credit (lightbox, place page, `/credits/`). Never use Google/Tripadvisor/booking-site photos.
  Commons sometimes answers 429 from cloud IPs; the script backs off, and an `{"openverse": "...", "must": [...],
  "fallback": true}` source pulls CC BY/BY-SA/CC0 Flickr photos via Openverse only when Commons comes up short
  (anonymous limit ~200 queries/day). Ski entries set `"winter": true` (snow keywords rank higher),
  `"keep_subcats": ["ski"]` and `"min_width": 1000`. When Commons is throttling hard (Retry-After 30s+), run
  `--openverse-first` (Openverse only, plus pinned Commons includes), then rerun the places that came up empty
  without the flag. Several fetches can run in parallel on different `--only` ids; images.json merges under a lock.
  Curate from a contact sheet (`montage` of `src/assets/places/*/N.jpg`) and add bad titles to `exclude`
  (`File:…` or `Openverse:<uuid>`). Openverse name matches are often the wrong place (another "Rouge River",
  "Stowe" in England): read the photo titles in images.json too, not just the thumbnails. Delete files that
  images.json no longer references before committing (uncredited photos must not land in the repo).
  Hub heroes: an `hero-<slug>` entry in image_sources.json, else `Pursuit.hero` (a spot photo by title).
- Google ratings: record `rating`, `reviews` count, `asOf` date and a `maps.google.com/?cid=` link. Review
  themes are **our paraphrase**, never verbatim review text.
- Date-aware bits (past trips, closed campgrounds, upcoming-event rails) are computed at build time; the Pages
  workflow rebuilds daily at 09:07 UTC so they roll over without a push.
- Client code talks to Supabase directly (`src/lib/supabase.ts`). Security is row-level security in
  `supabase/migrations`. The site must still build and work (signed out) with no Supabase env.
- Schema changes go in new timestamped files in `supabase/migrations/`, plus pgTAP tests in `supabase/tests/`.
  Never edit a migration that has been applied to the hosted project.

## Ski section

- Data: `src/data/ski/types.ts` (schema), `regions.ts` (11 regions, grouped Northeast / Rockies / Pacific & Southwest /
  Canada), `resorts/*.ts` (one file per batch, picked up by a glob in `src/data/ski/index.ts`). Resort ids share the
  place-id namespace (wishlists, reviews) and must not collide; `tests/js/ski-data.test.ts` checks ids, coords,
  dates, URLs and stats.
- Each resort records official URLs (site, snow report, trail map, webcams), 2026-27 passes and season dates, stats,
  lowest lift ticket, activities, lodging, things to do, après, events, getting there, Google rating and paraphrased
  review themes. Events use `confirmed: false` (shown as "Usually") until the resort posts this season's date.
- Prices are in the region's currency (CAD for Québec and BC). Keep `asOf` dates current when re-checking.
- Live weather is client-side Open-Meteo (`src/lib/ski.ts` URL builders, `src/lib/ski-live.ts` cached batch loader).
  It is a model forecast, never presented as a measured snow report.
- Adding a resort: append to the right `resorts/*.ts`, add an `image_sources.json` entry (Commons category if one
  exists, plus an Openverse fallback), run `python3 scripts/fetch_images.py --only <id>` and look at the photos.

## Biking, kayaking, pickleball and camping sections

- Same 11 regions as ski. One shared schema: `src/data/outdoors/types.ts` (`Spot`), activity definitions with their
  `kinds` and feature vocabularies in `pursuits.ts`, data in `spots/*.ts` (glob in `src/data/outdoors/index.ts`).
- Routes: `/<slug>/` hub (region tiles, close-to-home and destination rails, upcoming events, list + map explorer
  with URL filters) and `/<slug>/<id>/` spot pages (facts, features, live 7-day weather, outfitters, events,
  lodging, nearby, reviews, map, and "make a trip of it" cross-links to nearby spots, ski resorts and places).
  Slugs: `bike`, `kayak`, `pickleball`, `camping`. The camping hub also features the live-checked trip.
- Spot ids share the global id namespace with places and resorts; `tests/js/spots-data.test.ts` enforces it.
  Set `resortId` when a bike park or courts sit at a ski resort so both pages link to each other.
- The ski and outdoors explorers share `src/lib/listmap.ts` (Leaflet list + map) and `src/styles/listmap.css`.
  Sticky offsets use the `--header-h` token.

## Verify before every commit

```
npm test && npx astro check && npm run build && python3 -m unittest discover -s tests && python3 scripts/check_site.py dist --base /travel
```

Preview with the `web` launch config (`npm run dev`, http://localhost:4321/travel/). Commit and push small
changes as you go, then confirm the Pages deploy and the Database workflow pass
(`gh run list --repo pfeilbr/travel -L3`) and check the live URL.

## UX bar

Take cues from Airbnb and Hipcamp: photo-first cards, one accent color (`--accent` ember), rounded corners,
generous whitespace, sticky booking card, filter chips, list + map. Design tokens live in
`src/styles/global.css`, with dark mode via `prefers-color-scheme` / `[data-theme]`. Everything must work at
375px wide.

## Adding a trip (availability check)

1. Add or update places in `src/data/places.ts` (coords, Google rating with today's `asOf`, review themes).
2. Run live availability (below) and add a `Trip` in `src/data/trips.ts`.
3. `python3 scripts/fetch_images.py --only <new ids>` for photos. Look at them and curate the `exclude`/`include` lists.

## Campground availability lookups (NY State Parks + DEC on ReserveAmerica)

Look up only. Never book, sign in, or enter payment.

- Park page: `https://newyorkstateparks.reserveamerica.com/camping/x/r/campgroundDetails.do?contractCode=NY&parkId=<id>`.
  Verified IDs: Green Lakes 165, Selkirk Shores 82, Glimmerglass 78, Nicks Lake 699, Sampson 232, Robert H. Treman 221,
  Moreau Lake 311, Keuka Lake 228, Watkins Glen 254.
- URL date params don't run a search, and neither does setting hidden fields. This works as JS in the built-in browser:
  ```js
  document.querySelector('.adp-icon-btn').click(); await new Promise(r=>setTimeout(r,500));
  document.querySelector('td[aria-label="October 04, 2026"]').click();
  lengthOfStay.value='1'; lengthOfStay.dispatchEvent(new Event('change',{bubbles:true}));
  search_avail.click();
  ```
  Read "N site(s) available out of M" and the per-type chips. "From $X*" is the base rate before fees.
- A site detail page (`campsiteDetails.do?...&siteId=`) shows "Use Fees (N night)", which confirms short stays price,
  and lists cabin amenities.
- Campspot: `https://www.campspot.com/book/<park>/search/<arrive>/<depart>/guests0,2,0/list` works directly.
- webrez (Firelight Camps) is behind a Cloudflare human check, so don't try to get past it. Google Maps' hotel panel
  (set check-in/out) shows partner prices instead.
- Google Maps ratings: open `google.com/maps/search/<name>`, read rating, count and coordinates; the Reviews tab
  has recent text to paraphrase.

## Privacy: this repo is public

Never commit booking/confirmation numbers, passport/ID details, loyalty numbers, phone numbers of private
people, home addresses, or secrets. Supabase keys: only the public anon/publishable key ever reaches the browser
(derived in CI); the access token, DB password and OAuth secrets live only in GitHub Actions secrets.

## Shared Supabase platform

This app's Supabase project is the shared **app-platform** project (`pfeilbr/app-platform`, `app-platform status`).
Travel's tables live in `public` (it came first); other apps use their own schemas. Never patch auth settings
(providers, site URL, redirect allow-list) from this repo: use `app-platform add-app`. `scripts/supabase_admin.py
auth-config` would overwrite the shared allow-list, so don't run it.
