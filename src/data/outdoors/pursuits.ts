import type { PursuitId } from './types';

export interface Feature { id: string; label: string; icon: string }

export interface Pursuit {
  id: PursuitId;
  slug: string;              // route: /<slug>/ and /<slug>/<spot id>/
  name: string;              // "Mountain biking"
  short: string;             // header tab: "Biking"
  icon: string;
  noun: [one: string, many: string]; // "spot", "spots"
  title: string;             // hub h1
  tagline: string;
  blurb: string;
  season: string;            // when it's in season, broadly
  kinds: string[];
  features: Feature[];
  /** Label for Spot.price, e.g. "Day ticket". */
  priceLabel: string;
}

export const pursuits: Pursuit[] = [
  {
    id: 'bike', slug: 'bike', name: 'Mountain biking', short: 'Biking', icon: 'biking', noun: ['ride', 'rides'],
    title: 'Ride something new.',
    tagline: 'Lift-served bike parks, flow trails and singletrack towns',
    blurb: 'Ski resorts turn into bike parks when the snow melts, and whole towns are built around their trail networks. Find the lift-served downhill, the flow trails, the rentals and the post-ride beer.',
    season: 'May to October in the mountains; year-round in the desert',
    kinds: ['Lift-served bike park', 'Trail network', 'Gravel and rail trail'],
    features: [
      { id: 'lift-served', label: 'Lift-served', icon: 'gondola' },
      { id: 'shuttle', label: 'Shuttles', icon: 'car' },
      { id: 'downhill', label: 'Downhill', icon: 'mountain' },
      { id: 'flow', label: 'Flow trails', icon: 'biking' },
      { id: 'jump-lines', label: 'Jump lines', icon: 'park' },
      { id: 'cross-country', label: 'Cross-country', icon: 'map' },
      { id: 'enduro', label: 'Enduro', icon: 'vertical' },
      { id: 'skills-park', label: 'Pump track / skills park', icon: 'coaster' },
      { id: 'e-bikes', label: 'E-bikes allowed', icon: 'flame' },
      { id: 'rentals', label: 'Bike rentals', icon: 'bag' },
      { id: 'lessons', label: 'Lessons and camps', icon: 'kids' },
      { id: 'races', label: 'Races and festivals', icon: 'flag' },
    ],
    priceLabel: 'Day ticket',
  },
  {
    id: 'paddle', slug: 'kayak', name: 'Kayaking', short: 'Kayaking', icon: 'kayaking', noun: ['paddle', 'paddles'],
    title: 'Get on the water.',
    tagline: 'Lakes, canoe routes, rivers and sea kayaking',
    blurb: 'Quiet motor-free lakes, multi-day canoe routes with paddle-in campsites, canyon rivers and fjords with whales. Each spot lists where to put in, who rents boats and guides trips, and when the water is best.',
    season: 'Late May to early October; spring for snowmelt rivers',
    kinds: ['Lake', 'Canoe route', 'River', 'Whitewater', 'Sea kayaking', 'Reservoir'],
    features: [
      { id: 'flatwater', label: 'Flatwater', icon: 'kayaking' },
      { id: 'whitewater', label: 'Whitewater', icon: 'waterfalls' },
      { id: 'sea-kayak', label: 'Sea kayaking', icon: 'swimming' },
      { id: 'multi-day', label: 'Multi-day trips', icon: 'calendar' },
      { id: 'paddle-in-camping', label: 'Paddle-in camping', icon: 'tent' },
      { id: 'motor-free', label: 'Motor-free water', icon: 'check' },
      { id: 'rentals', label: 'Boat rentals', icon: 'bag' },
      { id: 'guided-tours', label: 'Guided tours', icon: 'users' },
      { id: 'sup', label: 'Paddleboarding', icon: 'swimming' },
      { id: 'wildlife', label: 'Wildlife', icon: 'foliage' },
      { id: 'fishing', label: 'Fishing', icon: 'fishing' },
      { id: 'swimming', label: 'Swimming', icon: 'swimming' },
    ],
    priceLabel: 'Rental',
  },
  {
    id: 'pickleball', slug: 'pickleball', name: 'Pickleball', short: 'Pickleball', icon: 'pickleball', noun: ['place to play', 'places to play'],
    title: 'Bring your paddle.',
    tagline: 'Courts worth a trip, from resort clinics to public complexes',
    blurb: 'Where to play on vacation: big public complexes with open play, mountain resorts with courts and clinics, and indoor centers for rainy days. Each spot lists courts, drop-in times, how to book and what it costs.',
    season: 'Outdoors spring to fall up north, year-round in the desert; indoor courts all year',
    kinds: ['Public courts', 'Pickleball center', 'Resort courts', 'Club'],
    features: [
      { id: 'dedicated', label: 'Dedicated courts', icon: 'grid' },
      { id: 'indoor', label: 'Indoor', icon: 'cabin' },
      { id: 'outdoor', label: 'Outdoor', icon: 'sun' },
      { id: 'lighted', label: 'Lighted', icon: 'moon' },
      { id: 'drop-in', label: 'Open play / drop-in', icon: 'users' },
      { id: 'reservations', label: 'Court reservations', icon: 'calendar' },
      { id: 'lessons', label: 'Lessons and clinics', icon: 'kids' },
      { id: 'tournaments', label: 'Tournaments', icon: 'flag' },
      { id: 'free', label: 'Free to play', icon: 'check' },
      { id: 'rentals', label: 'Paddle rentals', icon: 'bag' },
    ],
    priceLabel: 'To play',
  },
  {
    id: 'camp', slug: 'camping', name: 'Camping', short: 'Camping', icon: 'tent', noun: ['campground', 'campgrounds'],
    title: 'Sleep outside.',
    tagline: 'State and national park campgrounds, cabins, yurts and glamping',
    blurb: 'Lakeside state parks, national park classics, paddle-in sites and heated cabins, from the Adirondacks to the Sea to Sky. Each campground lists sites, cabins, when reservations open and what it costs.',
    season: 'Mid-May to mid-October up north; spring and fall in the desert',
    kinds: ['State park', 'National park', 'National forest', 'Provincial park', 'Private campground', 'Glamping'],
    features: [
      { id: 'tent', label: 'Tent sites', icon: 'tent' },
      { id: 'rv-hookups', label: 'RV hookups', icon: 'car' },
      { id: 'cabins', label: 'Cabins', icon: 'cabin' },
      { id: 'yurts', label: 'Yurts', icon: 'glamping' },
      { id: 'glamping', label: 'Glamping', icon: 'glamping' },
      { id: 'lean-tos', label: 'Lean-tos', icon: 'cottage' },
      { id: 'paddle-in', label: 'Paddle-in sites', icon: 'kayaking' },
      { id: 'backcountry', label: 'Backcountry', icon: 'hiking' },
      { id: 'showers', label: 'Showers', icon: 'swimming' },
      { id: 'lakefront', label: 'Lake or riverfront', icon: 'kayaking' },
      { id: 'swimming', label: 'Swimming beach', icon: 'swimming' },
      { id: 'pets', label: 'Pets allowed', icon: 'dog' },
      { id: 'winter', label: 'Open in winter', icon: 'snowflake' },
      { id: 'dark-sky', label: 'Dark skies', icon: 'moon' },
    ],
    priceLabel: 'Site',
  },
];

export const pursuitById = Object.fromEntries(pursuits.map((p) => [p.id, p])) as Record<PursuitId, Pursuit>;
export const pursuitBySlug = Object.fromEntries(pursuits.map((p) => [p.slug, p])) as Record<string, Pursuit>;

export function featureLabel(p: Pursuit, id: string): Feature | undefined {
  return p.features.find((f) => f.id === id);
}
