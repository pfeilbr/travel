import type { Day, Plan, RoadTrip, Stay, Tag } from '../data/roadtrips/types';

export const TAG_LABEL: Record<Tag, string> = {
  flowers: 'Flowers', photo: 'Photo spot', 'dress-up': 'Dress up', lobster: 'Lobster', burmese: 'Burmese',
  design: 'Design', lights: 'Holiday lights', trees: 'Trees', outdoors: 'Outdoors', birthday: 'Birthday',
  free: 'Free', cozy: 'Cozy', history: 'History',
};

export const TAG_ICON: Record<Tag, string> = {
  flowers: 'foliage', photo: 'camera', 'dress-up': 'sparkle', lobster: 'fishing', burmese: 'restaurants',
  design: 'grid', lights: 'sparkle', trees: 'tree', outdoors: 'hiking', birthday: 'heart', free: 'check',
  cozy: 'flame', history: 'history',
};

export interface PlanCost {
  lodging: number;
  tax: number;
  food: number;
  gas: number;
  tolls: number;
  tickets: number;
  total: number;
}

export interface PlanStats {
  nights: number;
  miles: number;
  minutes: number;
  longestDay: number;
  /** Nights by kind of bed, e.g. { hotel: 5, cabin: 2 }. */
  beds: Record<string, number>;
}

export function byId<T extends { id: string }>(list: T[]): Record<string, T> {
  return Object.fromEntries(list.map((x) => [x.id, x]));
}

/** The pick for each night (first stay listed). */
export function nightStays(trip: RoadTrip, plan: Plan): { day: Day; stay: Stay }[] {
  const stays = byId(trip.stays);
  return plan.days.flatMap((day) => (day.stays?.length ? [{ day, stay: stays[day.stays[0]] }] : []));
}

export function dayMinutes(day: Day): number {
  return day.legs.reduce((s, l) => s + l.minutes, 0);
}

export function dayMiles(day: Day): number {
  return day.legs.reduce((s, l) => s + l.miles, 0);
}

export function planStats(trip: RoadTrip, plan: Plan): PlanStats {
  const beds: Record<string, number> = {};
  nightStays(trip, plan).forEach(({ stay }) => { beds[stay.kind] = (beds[stay.kind] ?? 0) + 1; });
  return {
    nights: nightStays(trip, plan).length,
    miles: plan.days.reduce((s, d) => s + dayMiles(d), 0),
    minutes: plan.days.reduce((s, d) => s + dayMinutes(d), 0),
    longestDay: Math.max(0, ...plan.days.map(dayMinutes)),
    beds,
  };
}

/** Estimated cost for two: picked stays plus lodging tax, every listed meal for 2, gas, tolls and extras. */
export function planCost(trip: RoadTrip, plan: Plan): PlanCost {
  const meals = byId(trip.meals);
  const lodging = nightStays(trip, plan).reduce((s, { stay }) => s + stay.price, 0);
  const food = plan.days.flatMap((d) => d.meals).reduce((s, id) => s + meals[id].perPerson * 2, 0);
  const gas = Math.round((planStats(trip, plan).miles / trip.car.mpg) * trip.car.gas);
  const tax = Math.round(lodging * trip.lodgingTax);
  const tickets = plan.tickets.reduce((s, t) => s + t.cost, 0);
  const rounded = Math.round(lodging);
  return { lodging: rounded, tax, food, gas, tolls: plan.tolls, tickets, total: rounded + tax + food + gas + plan.tolls + tickets };
}

/** "Sun, Nov 29" */
export function dayLabel(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Round to the nearest $50 for headline totals ("about $3,450"). */
export function roughly(n: number): string {
  return '$' + (Math.round(n / 50) * 50).toLocaleString('en-US');
}

/** Google Maps driving directions through each stop. */
export function directionsUrl(stops: string[]): string {
  return 'https://www.google.com/maps/dir/' + stops.map((s) => encodeURIComponent(s)).join('/') + '/';
}

/** Interleave several photo lists: first of each, then second of each, … */
export function interleave<T>(lists: T[][]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(0, ...lists.map((l) => l.length)); i++) lists.forEach((l) => { if (l[i] !== undefined) out.push(l[i]); });
  return out;
}

/** Split a photo spec "rt-boston#2" into its set id and index. */
export function photoSpec(spec: string): { set: string; index: number } {
  const [set, i] = spec.split('#');
  return { set, index: i ? Number(i) : 0 };
}
