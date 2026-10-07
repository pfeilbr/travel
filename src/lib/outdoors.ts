import type { SkiRegionId } from '../data/ski/types';
import type { Spot, SpotSize } from '../data/outdoors/types';

// ---- filters (state lives in the URL so links are shareable)

export type SpotSort = 'recommended' | 'rating' | 'price' | 'name' | 'near';
export const SPOT_SORTS: SpotSort[] = ['recommended', 'rating', 'price', 'name', 'near'];

export interface SpotFilters {
  regions: SkiRegionId[];  // any of
  kinds: string[];         // any of
  features: string[];      // all of
  sizes: SpotSize[];       // any of
}

export const noSpotFilters = (): SpotFilters => ({ regions: [], kinds: [], features: [], sizes: [] });

/** Fields the filter and sort need, so the client can work from a slim JSON copy. */
export type SpotRow = Pick<Spot, 'id' | 'name' | 'region' | 'kind' | 'size' | 'features'> & {
  google?: { rating: number };
  price?: { from: number };
  /** Miles from the site's home base, for the "near" sort. */
  miles?: number;
};

export function matchesSpot(s: SpotRow, f: SpotFilters): boolean {
  if (f.regions.length && !f.regions.includes(s.region)) return false;
  if (f.kinds.length && !f.kinds.includes(s.kind)) return false;
  if (f.features.length && !f.features.every((x) => s.features.includes(x))) return false;
  if (f.sizes.length && !f.sizes.includes(s.size)) return false;
  return true;
}

export const SPOT_SIZE_LABEL: Record<SpotSize, string> = { major: 'Destination', mid: 'Weekend', local: 'Local favorite' };

const SIZE_RANK: Record<SpotSize, number> = { major: 0, mid: 1, local: 2 };

export function sortSpots<T extends SpotRow>(rows: T[], key: SpotSort): T[] {
  const rating = (r: T) => r.google?.rating ?? 0;
  const by: Record<SpotSort, (a: T, b: T) => number> = {
    recommended: (a, b) => SIZE_RANK[a.size] - SIZE_RANK[b.size] || rating(b) - rating(a) || a.name.localeCompare(b.name),
    rating: (a, b) => rating(b) - rating(a) || a.name.localeCompare(b.name),
    price: (a, b) => (a.price?.from ?? Infinity) - (b.price?.from ?? Infinity) || a.name.localeCompare(b.name),
    name: (a, b) => a.name.localeCompare(b.name),
    near: (a, b) => (a.miles ?? Infinity) - (b.miles ?? Infinity),
  };
  return [...rows].sort(by[key]);
}

export function parseSpotFilters(q: URLSearchParams): { filters: SpotFilters; sort: SpotSort } {
  const list = <T extends string>(k: string) => (q.get(k)?.split(',').filter(Boolean) ?? []) as T[];
  const sort = q.get('sort') as SpotSort;
  return {
    filters: { regions: list('region'), kinds: list('kind'), features: list('has'), sizes: list('size') },
    sort: SPOT_SORTS.includes(sort) ? sort : 'recommended',
  };
}

export function serializeSpotFilters(f: SpotFilters, sort: SpotSort): string {
  const q = new URLSearchParams();
  if (f.regions.length) q.set('region', f.regions.join(','));
  if (f.kinds.length) q.set('kind', f.kinds.join(','));
  if (f.features.length) q.set('has', f.features.join(','));
  if (f.sizes.length) q.set('size', f.sizes.join(','));
  if (sort !== 'recommended') q.set('sort', sort);
  const s = q.toString();
  return s ? `?${s}` : '';
}

/** "May – Oct", "Year-round". */
export function seasonText(s: Spot['season']): string {
  if (/year/i.test(s.from)) return 'Year-round';
  return s.from === s.to ? s.from : `${s.from} – ${s.to}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Whether a spot is in season in a given month (0-11): true/false, or null when the season text isn't month names. */
export function inSeason(s: Spot['season'], month: number): boolean | null {
  if (/year/i.test(s.from)) return true;
  const a = MONTHS.indexOf(s.from.slice(0, 3)), b = MONTHS.indexOf(s.to.slice(0, 3));
  if (a < 0 || b < 0) return null;
  return a <= b ? month >= a && month <= b : month >= a || month <= b; // wraps the new year (Nov–Mar)
}

/** "$45 day ticket", "Free drop-in", "C$38 site/night". */
export function priceText(p: NonNullable<Spot['price']>, currency: 'USD' | 'CAD' = 'USD'): string {
  if (p.from === 0) return `Free ${p.unit}`.trim();
  const n = Number.isInteger(p.from) ? p.from.toLocaleString('en-US') : p.from.toFixed(2);
  return `${currency === 'CAD' ? 'C$' : '$'}${n} ${p.unit}`.trim();
}

// ---- weather (Open-Meteo, no key): 7-day general forecast for any point

export function weatherUrl(lat: number, lng: number): string {
  const q = new URLSearchParams({
    latitude: lat.toFixed(4), longitude: lng.toFixed(4),
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,snowfall_sum,uv_index_max,sunrise,sunset',
    forecast_days: '7', timezone: 'auto', temperature_unit: 'fahrenheit', wind_speed_unit: 'mph', precipitation_unit: 'inch',
  });
  return `https://api.open-meteo.com/v1/forecast?${q}`;
}
