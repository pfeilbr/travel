// Ski section: regions, resorts, lodging, things to do and holiday events.
// A resort id shares the place-id namespace (wishlists, reviews), so it must not collide with a place id.

export type SkiRegionId =
  | 'vermont' | 'new-hampshire' | 'new-york' | 'pennsylvania'
  | 'utah' | 'colorado' | 'montana'
  | 'california' | 'arizona'
  | 'quebec' | 'british-columbia';

export type SkiGroup = 'Northeast' | 'Rockies' | 'Pacific & Southwest' | 'Canada';

export interface SkiRegion {
  id: SkiRegionId;
  name: string;            // "Vermont"
  short: string;           // "VT"
  group: SkiGroup;
  country: 'US' | 'CA';
  currency: 'USD' | 'CAD';
  tagline: string;
  blurb: string;
  center: [lat: number, lng: number];
  zoom: number;
  gateways: { code: string; name: string }[];  // airports
  /** Statewide snow report / conditions page (ski association or OnTheSnow). */
  reportUrl: string;
  /** Region-wide notes: drive tips, pass tips, holiday crowds. */
  tips: string[];
}

export type Pass = 'epic' | 'ikon' | 'indy' | 'mountain-collective';

export type SkiActivity =
  | 'night-skiing' | 'terrain-park' | 'tubing' | 'sleigh-rides' | 'snowmobiling' | 'ice-skating'
  | 'scenic-lift' | 'snowshoeing' | 'nordic' | 'dog-sledding' | 'mountain-coaster' | 'zipline'
  | 'fat-biking' | 'spa' | 'nightlife' | 'kids' | 'cat-skiing' | 'heli-skiing' | 'hot-springs' | 'indoor-waterpark';

export type ResortSize = 'major' | 'mid' | 'local';

export interface ResortStats {
  summitFt: number;
  baseFt: number;
  verticalFt: number;
  acres: number;           // skiable acres
  trails: number;
  lifts: number;
  snowfallIn: number;      // average annual snowfall, inches
  longestRunMi?: number;
  snowmakingPct?: number;  // % of terrain with snowmaking
  /** Terrain mix in percent; should add up to ~100. */
  terrain: { beginner: number; intermediate: number; advanced: number };
}

export type LodgeKind =
  | 'ski-in/ski-out' | 'slopeside' | 'base village' | 'hotel' | 'inn' | 'lodge' | 'condo' | 'cabin' | 'b&b' | 'hostel';

export interface Lodge {
  name: string;
  kind: LodgeKind;
  what: string;            // one or two sentences, our words
  url: string;             // official site of the property
  distance?: string;       // "Slopeside", "5 min drive"
  /** Typical lowest winter nightly rate in the region's currency, before taxes. Omit if unknown. */
  priceFrom?: number;
  priceNote?: string;      // "Midweek January; holidays 2–3x"
}

export type ThingKind = SkiActivity | 'eat' | 'drink' | 'shop' | 'museum' | 'other';

export interface SkiThing {
  name: string;
  kind: ThingKind;
  what: string;
  url?: string;
  distance?: string;
}

export type EventKind = 'christmas' | 'new-years' | 'opening' | 'festival' | 'race' | 'tournament' | 'music' | 'pond-skim' | 'other';

export interface SkiEvent {
  name: string;
  kind: EventKind;
  date: string;            // ISO start date (2026-27 season) for sorting
  end?: string;            // ISO end date for multi-day events
  when: string;            // human: "Dec 31, 6 pm", "Christmas week"
  what: string;
  url?: string;
  /** true when the 2026-27 date is published; false when it's the usual date from past years. */
  confirmed: boolean;
}

export interface Resort {
  id: string;
  name: string;
  region: SkiRegionId;
  area: string;            // sub-area: "Northern Green Mountains", "Lake Tahoe", "Summit County", "Laurentians"
  town: string;
  coords: [lat: number, lng: number];
  size: ResortSize;
  tagline: string;
  summary: string;
  url: string;             // official site
  snowReportUrl: string;   // official snow report / conditions page
  trailMapUrl?: string;
  webcamUrl?: string;
  passes: Pass[];
  /** Target dates for 2026-27 (ISO). */
  season: { opens: string; closes: string; note?: string };
  stats: ResortStats;
  /** Walk-up adult 1-day lift ticket, lowest typical price, in the region's currency. */
  ticket?: { from: number; note?: string };
  activities: SkiActivity[];
  lodging: Lodge[];
  thingsToDo: SkiThing[];
  apres: { name: string; what: string; url?: string }[];
  events: SkiEvent[];
  getting: { airport: string; code: string; driveMin: number; from?: { city: string; hours: number }[] };
  google?: { rating: number; reviews?: number; url: string; asOf: string };
  /** Paraphrased themes from recent reviews: never verbatim review text. */
  reviewThemes?: { loved: string[]; watchFor: string[] };
}
