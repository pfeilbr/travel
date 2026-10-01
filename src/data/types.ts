export type Lodging = 'tent' | 'cabin' | 'cottage' | 'glamping';
export type Activity =
  | 'biking' | 'fishing' | 'hiking' | 'waterfalls' | 'swimming' | 'kayaking'
  | 'nightlife' | 'wineries' | 'restaurants' | 'history' | 'foliage';

export interface GoogleRating {
  rating: number;
  reviews: number;
  /** maps.google.com/?cid= link to the place's Google Maps listing (reviews live there). */
  url: string;
  asOf: string; // ISO date the numbers were read
}

export interface NearbyItem {
  name: string;
  kind: 'eat' | 'drink' | 'do' | 'hike' | 'bike' | 'fish' | 'shop';
  what: string;
  distance?: string;
  url?: string;
}

export interface Place {
  id: string;
  name: string;
  town: string;
  region: string;
  kind: 'State park' | 'DEC campground' | 'Glamping';
  tagline: string;
  summary: string;
  activities: Activity[];
  lodging: Lodging[];
  coords: [lat: number, lng: number];
  seasonEnds?: string; // ISO date camping closes
  google: GoogleRating;
  /** Paraphrased themes from recent Google reviews — never verbatim review text. */
  reviewThemes: { loved: string[]; watchFor: string[] };
  booking: { label: string; url: string };
  phone?: string;
  cabinDetails?: {
    inside: string; outside: string; bring: string; rules: string;
  };
  nearby?: { title: string; note?: string; items: NearbyItem[] };
}

export type Count = number | 'available' | 'check';

export interface TripOption {
  placeId: string;
  driveMin: number;
  miles: number;
  /** Live availability for the trip dates by lodging type. */
  available: Partial<Record<Lodging, Count>>;
  /** Lowest base rate per night by lodging type (USD, before fees). */
  price: Partial<Record<Lodging, number>>;
  priceNote?: string;
  flags: string[];  // short gotchas shown as badges
  notes: string[];  // longer gotchas on the detail view
  cabinSites?: string[];
}

export interface Trip {
  slug: string;
  title: string;
  blurb: string;
  start: string; // ISO
  end: string;   // ISO
  origin: { name: string; coords: [number, number] };
  checkedAt: string;
  party: string;
  wants: string[];
  options: TripOption[];
  topPicks: { placeId: string; why: string }[];
  gotchas: string[];
  sources: { label: string; url: string }[];
}
