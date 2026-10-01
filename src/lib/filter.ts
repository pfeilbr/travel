import type { Activity, Lodging, Place, TripOption } from '../data/types';
import { hasRoof, lowestPrice, openTypes } from './format';

export type SortKey = 'recommended' | 'price' | 'drive' | 'rating';

export interface Filters {
  lodging: Lodging[];        // any of
  activities: Activity[];    // all of
  maxDrive?: number;         // minutes
  roofOnly?: boolean;
  regions?: string[];        // any of
}

export interface Row { place: Place; option: TripOption; rank: number }

export function matches(r: Row, f: Filters): boolean {
  if (f.lodging.length && !openTypes(r.option).some((t) => f.lodging.includes(t))) return false;
  if (f.activities.length && !f.activities.every((a) => r.place.activities.includes(a))) return false;
  if (f.maxDrive && r.option.driveMin > f.maxDrive) return false;
  if (f.roofOnly && !hasRoof(r.option)) return false;
  if (f.regions?.length && !f.regions.includes(r.place.region)) return false;
  return true;
}

export function sortRows(rows: Row[], key: SortKey, lodging: Lodging[] = []): Row[] {
  const price = (r: Row) => lowestPrice(r.option, lodging) ?? Infinity;
  const by: Record<SortKey, (a: Row, b: Row) => number> = {
    recommended: (a, b) => a.rank - b.rank,
    price: (a, b) => price(a) - price(b) || a.rank - b.rank,
    drive: (a, b) => a.option.driveMin - b.option.driveMin,
    rating: (a, b) => b.place.google.rating - a.place.google.rating || b.place.google.reviews - a.place.google.reviews,
  };
  return [...rows].sort(by[key]);
}

/** Top picks first (in pick order), then everything else by drive time. */
export function recommendedRank(options: TripOption[], picks: string[]): Map<string, number> {
  const rest = options.filter((o) => !picks.includes(o.placeId)).sort((a, b) => a.driveMin - b.driveMin);
  return new Map([...picks, ...rest.map((o) => o.placeId)].map((id, i) => [id, i]));
}

export function parseFilters(q: URLSearchParams): { filters: Filters; sort: SortKey } {
  const list = <T extends string>(k: string) => (q.get(k)?.split(',').filter(Boolean) ?? []) as T[];
  const sort = (q.get('sort') as SortKey) || 'recommended';
  return {
    filters: {
      lodging: list<Lodging>('lodging'), activities: list<Activity>('do'), maxDrive: Number(q.get('drive')) || undefined,
      roofOnly: q.get('roof') === '1', ...(q.get('region') ? { regions: list<string>('region') } : {}),
    },
    sort: (['recommended', 'price', 'drive', 'rating'] as const).includes(sort) ? sort : 'recommended',
  };
}

export function serializeFilters(f: Filters, sort: SortKey): string {
  const q = new URLSearchParams();
  if (f.lodging.length) q.set('lodging', f.lodging.join(','));
  if (f.activities.length) q.set('do', f.activities.join(','));
  if (f.maxDrive) q.set('drive', String(f.maxDrive));
  if (f.roofOnly) q.set('roof', '1');
  if (f.regions?.length) q.set('region', f.regions.join(','));
  if (sort !== 'recommended') q.set('sort', sort);
  const s = q.toString();
  return s ? `?${s}` : '';
}
