// Outdoors sections beyond skiing: mountain biking, kayaking, pickleball and camping.
// They share the ski regions and a common "spot" shape so cards, maps, filters and photos work the same way.
// Spot ids share the place-id namespace (wishlists, reviews) with places and ski resorts and must not collide.
import type { Lodge, SkiEvent, SkiRegionId, SkiThing } from '../ski/types';

export type PursuitId = 'bike' | 'paddle' | 'pickleball' | 'camp';

export type SpotSize = 'major' | 'mid' | 'local'; // destination / weekend / local

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Spot {
  id: string;
  pursuit: PursuitId;
  name: string;
  region: SkiRegionId;
  area: string;              // "Northeast Kingdom", "Adirondacks", "Lake Tahoe", "Sea to Sky"
  town: string;
  coords: [lat: number, lng: number];
  /** One of the pursuit's kinds (see pursuits.ts), e.g. "Lift-served bike park", "Lake", "State park campground". */
  kind: string;
  size: SpotSize;
  tagline: string;           // ≤ 60 chars
  summary: string;           // 2–3 sentences, our words
  url: string;               // official site
  bookingUrl?: string;       // tickets, reservations, court booking, rentals
  mapUrl?: string;           // trail map, paddling map, campground map
  conditionsUrl?: string;    // trail status, water levels or flows, park alerts
  /** Months it's in season, e.g. { from: 'May', to: 'Oct' }; { from: 'Year-round', to: 'Year-round' } for always. */
  season: { from: string; to: string; note?: string };
  /** 3–6 headline stats: "Trail miles": "100+", "Sites": "149", "Courts": "12 lighted". */
  facts: { label: string; value: string }[];
  /** Typical lowest price in the region's currency: day ticket, campsite night, court fee or rental. */
  price?: { from: number; unit: string; note?: string };
  /** Feature ids from the pursuit's vocabulary (see pursuits.ts). */
  features: string[];
  levels?: Level[];
  /** Rentals, guides, outfitters, shops, clubs. */
  outfitters: { name: string; what: string; url?: string }[];
  lodging: Lodge[];
  thingsToDo: SkiThing[];
  /** Festivals, races, tournaments for 2026 or 2027 (confirmed: false = usual date from past years). */
  events: SkiEvent[];
  getting: { airport: string; code: string; driveMin: number; from?: { city: string; hours: number }[] };
  google?: { rating: number; reviews?: number; url: string; asOf: string };
  /** Paraphrased themes from recent reviews you actually read: never verbatim, omit if you read none. */
  reviewThemes?: { loved: string[]; watchFor: string[] };
  /** The ski resort id this sits at (bike parks, resort courts), if any. */
  resortId?: string;
}
