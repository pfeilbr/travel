import type { Count, Lodging, TripOption } from '../data/types';

export const LODGING_LABEL: Record<Lodging, string> = { tent: 'Tent site', cabin: 'Cabin', cottage: 'Cottage', glamping: 'Glamping tent' };
const PLURAL: Record<Lodging, string> = { tent: 'tent sites', cabin: 'cabins', cottage: 'cottages', glamping: 'glamping tents' };

export function drive(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function money(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

export function compact(n: number): string {
  return n >= 10_000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);
}

/** "3 cabins · 48 tent sites" — skips zero/unknown counts. */
export function availabilityLine(o: TripOption): string {
  const order: Lodging[] = ['glamping', 'cabin', 'cottage', 'tent'];
  const parts = order.flatMap((k) => {
    const c = o.available[k];
    if (c === undefined || c === 0) return [];
    if (c === 'available') return [`${LODGING_LABEL[k]} open`];
    if (c === 'check') return [`${LODGING_LABEL[k]}: check`];
    return [`${c} ${c === 1 ? LODGING_LABEL[k].toLowerCase() : PLURAL[k]}`];
  });
  return parts.join(' · ') || 'Nothing open';
}

const isOpen = (c: Count | undefined) => c === 'available' || (typeof c === 'number' && c > 0);

/** Lodging types actually bookable for the trip dates. */
export function openTypes(o: TripOption): Lodging[] {
  return (Object.keys(o.available) as Lodging[]).filter((k) => isOpen(o.available[k]));
}

/** Cheapest base rate among open lodging types (optionally restricted to some types). */
export function lowestPrice(o: TripOption, only?: Lodging[]): number | null {
  const prices = openTypes(o)
    .filter((k) => !only?.length || only.includes(k))
    .map((k) => o.price[k])
    .filter((p): p is number => typeof p === 'number');
  return prices.length ? Math.min(...prices) : null;
}

/** True when there's a roof: a cabin, cottage or glamping tent is open. */
export function hasRoof(o: TripOption): boolean {
  return openTypes(o).some((k) => k !== 'tent');
}

export function nights(start: string, end: string): number {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000);
}

export function dateRange(start: string, end: string): string {
  const f = (s: string, o: Intl.DateTimeFormatOptions) => new Date(s + 'T12:00:00').toLocaleDateString('en-US', o);
  return `${f(start, { weekday: 'short', month: 'short', day: 'numeric' })} – ${f(end, { weekday: 'short', month: 'short', day: 'numeric' })}`;
}

/** Today's ISO date (UTC). Pages are static, so this is the build date; Pages rebuilds daily. */
export function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/** A trip is over once its checkout day arrives: the availability no longer helps anyone book. */
export function tripIsPast(t: { end: string }, today = isoToday()): boolean {
  return t.end <= today;
}

/** The trip the home, explore and camping pages feature: the next upcoming one (most recently checked first,
 *  then soonest), falling back to the most recently checked once every trip has passed. */
export function latestTrip<T extends { checkedAt: string; start: string; end: string }>(trips: T[], today = isoToday()): T {
  const byCheck = [...trips].sort((a, b) => b.checkedAt.localeCompare(a.checkedAt) || a.start.localeCompare(b.start));
  return byCheck.find((t) => !tripIsPast(t, today)) ?? byCheck[0];
}

/** Camping is closed once the day after its last night (`seasonEnds`) has passed. */
export function seasonOver(seasonEnds: string | undefined, today = isoToday()): boolean {
  return !!seasonEnds && seasonEnds < today;
}
