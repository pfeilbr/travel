// Road trips: a multi-day drive with several alternative day-by-day plans that share one pool of
// areas, stays and restaurants. Prices are per night for 2 adults (USD) as read on `priceAsOf`.

export type Tag =
  | 'flowers' | 'photo' | 'dress-up' | 'lobster' | 'burmese' | 'design' | 'lights'
  | 'trees' | 'outdoors' | 'birthday' | 'free' | 'cozy' | 'history';

export type StayKind = 'hotel' | 'inn' | 'resort' | 'cabin' | 'tent' | 'home';

export interface Rating {
  rating: number;
  reviews: number;
  /** Google Maps listing (maps.google.com/?cid= or a search link). */
  url: string;
  asOf: string;
}

export interface Thing {
  name: string;
  what: string;
  tags: Tag[];
  url?: string;
  /** Hours/dates that matter for this trip, e.g. "Thu–Sun 4–9 pm". */
  when?: string;
  /** Adult ticket in USD; 0 = free. */
  price?: number;
  priceNote?: string;
  coords?: [number, number];
}

export interface Area {
  id: string;
  name: string;
  state: string;
  coords: [number, number];
  tagline: string;
  summary: string;
  /** Photo set ids in images.json, interleaved (defaults to [`rt-<id>`]). */
  photos?: string[];
  things: Thing[];
  /** Typical early-December weather. */
  weather?: { high: number; low: number; note?: string };
}

export interface Stay {
  id: string;
  name: string;
  area: string;
  kind: StayKind;
  tier: 'splurge' | 'sweet spot' | 'value' | 'camping';
  url: string;
  bookUrl?: string;
  /** Nightly rate for 2 adults on the trip nights, with taxes and fees where the source showed them. */
  price: number;
  priceNote?: string;
  priceAsOf: string;
  priceSource: string;
  vibe: string;
  perks: string[];
  watchFor?: string[];
  coords: [number, number];
  photos?: string;
  rating?: Rating;
}

export interface Meal {
  id: string;
  name: string;
  area: string;
  kind: 'dinner' | 'lunch' | 'brunch' | 'treat';
  cuisine: string;
  url: string;
  reserveUrl?: string;
  /** Estimated cost per person with a drink, USD. */
  perPerson: number;
  dress?: string;
  hours?: string;
  why: string;
  order?: string;
  tags: Tag[];
  coords?: [number, number];
  rating?: Rating;
}

export interface Leg {
  from: string;
  to: string;
  miles: number;
  minutes: number;
  via?: string;
  note?: string;
}

export interface Step {
  time?: string;
  text: string;
  tags?: Tag[];
  url?: string;
}

export interface Day {
  date: string; // ISO
  title: string;
  area: string;
  birthday?: string;
  leave?: string;
  legs: Leg[];
  steps: Step[];
  /** Stay id for the night, first = the pick; the rest are alternatives. Omit on the last day. */
  stays?: string[];
  meals: string[];
  /** Photo set for the day card (defaults to the area's photos). */
  photo?: string;
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  bestFor: string;
  /** Short pros shown on the option card. */
  highlights: string[];
  tradeoffs: string[];
  days: Day[];
  tolls: number;
  /** Tickets and extras for two not tied to a listed meal (gardens, parking, breakfasts). */
  tickets: { label: string; cost: number }[];
}

export interface RoadTrip {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  start: string;
  end: string;
  travelers: string;
  checkedAt: string;
  /** Hero photos as "<set>" or "<set>#<index>" (first image unless an index is given). */
  hero: string[];
  plans: Plan[];
  recommended: string;
  areas: Area[];
  stays: Stay[];
  meals: Meal[];
  /** "Planned around ..." notes: why the plan fits the travelers. */
  touches: { title: string; text: string; tags: Tag[] }[];
  packing: string[];
  gotchas: string[];
  sources: { label: string; url: string }[];
  /** Assumptions for the gas estimate. */
  car: { mpg: number; gas: number };
  /** Average lodging tax added on top of nightly rates (0.12 = 12%). */
  lodgingTax: number;
}
