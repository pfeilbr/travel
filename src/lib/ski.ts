import type { EventKind, Pass, Resort, ResortSize, SkiActivity, SkiEvent, SkiRegionId } from '../data/ski/types';

export const PASS_LABEL: Record<Pass, string> = { epic: 'Epic', ikon: 'Ikon', indy: 'Indy', 'mountain-collective': 'Mountain Collective' };
export const PASSES: Pass[] = ['epic', 'ikon', 'indy', 'mountain-collective'];
export const PASS_SHORT: Record<Pass, string> = { epic: 'Epic', ikon: 'Ikon', indy: 'Indy', 'mountain-collective': 'MC' };

/** "1 resort", "3 resorts". */
export const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`;

export const SIZE_LABEL: Record<ResortSize, string> = { major: 'Destination', mid: 'Weekend', local: 'Local hill' };

export const ACTIVITY: Record<SkiActivity, { label: string; icon: string }> = {
  'night-skiing': { label: 'Night skiing', icon: 'moon' },
  'terrain-park': { label: 'Terrain park', icon: 'park' },
  tubing: { label: 'Snow tubing', icon: 'tubing' },
  'sleigh-rides': { label: 'Sleigh rides', icon: 'sleigh' },
  snowmobiling: { label: 'Snowmobiling', icon: 'snowmobile' },
  'ice-skating': { label: 'Ice skating', icon: 'skate' },
  'scenic-lift': { label: 'Scenic lift rides', icon: 'gondola' },
  snowshoeing: { label: 'Snowshoeing', icon: 'snowshoe' },
  nordic: { label: 'Cross-country', icon: 'nordic' },
  'dog-sledding': { label: 'Dog sledding', icon: 'dog' },
  'mountain-coaster': { label: 'Mountain coaster', icon: 'coaster' },
  zipline: { label: 'Zipline', icon: 'zipline' },
  'fat-biking': { label: 'Fat biking', icon: 'biking' },
  spa: { label: 'Spa', icon: 'spa' },
  nightlife: { label: 'Nightlife', icon: 'nightlife' },
  kids: { label: 'Kids programs', icon: 'kids' },
  'cat-skiing': { label: 'Cat skiing', icon: 'snowcat' },
  'heli-skiing': { label: 'Heli skiing', icon: 'heli' },
  'hot-springs': { label: 'Hot springs', icon: 'springs' },
  'indoor-waterpark': { label: 'Indoor waterpark', icon: 'swimming' },
};

export const EVENT_LABEL: Record<EventKind, string> = {
  christmas: 'Christmas', 'new-years': 'New Year’s', opening: 'Opening day', festival: 'Festival',
  race: 'Race', tournament: 'Tournament', music: 'Music', 'pond-skim': 'Pond skim', other: 'Event',
};

export const EVENT_ICON: Record<EventKind, string> = {
  christmas: 'tree', 'new-years': 'sparkle', opening: 'flag', festival: 'sparkle', race: 'flag', tournament: 'flag',
  music: 'music', 'pond-skim': 'swimming', other: 'calendar',
};

export const ft = (n: number) => `${n.toLocaleString('en-US')} ft`;

/** "$129" or "C$129". */
export function price(n: number, currency: 'USD' | 'CAD' = 'USD'): string {
  const s = Number.isInteger(n) ? n.toLocaleString('en-US') : n.toFixed(2);
  return `${currency === 'CAD' ? 'C$' : '$'}${s}`;
}

const day = (iso: string) => new Date(iso + 'T12:00:00Z');

/** "Nov 21" (or "Nov 21, 2026" with year). */
export function shortDate(iso: string, year = false): string {
  return day(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}), timeZone: 'UTC' });
}

export function seasonLine(s: Resort['season']): string {
  return `${shortDate(s.opens)} – ${shortDate(s.closes)}`;
}

/** Whole days from `today` to `iso` (negative once passed). */
export function daysUntil(iso: string, today: string): number {
  return Math.round((day(iso).getTime() - day(today).getTime()) / 86_400_000);
}

/** Great-circle distance in miles. */
export function miles(a: [number, number], b: [number, number]): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

/** The n closest other resorts. */
export function nearest(r: Resort, all: Resort[], n = 4): Resort[] {
  return all.filter((o) => o.id !== r.id)
    .map((o) => ({ o, d: miles(r.coords, o.coords) }))
    .sort((a, b) => a.d - b.d).slice(0, n).map((x) => x.o);
}

// ---- filters (state lives in the URL so links are shareable)

export type SkiSort = 'recommended' | 'vertical' | 'acres' | 'snowfall' | 'rating' | 'price' | 'opening' | 'snow';
export const SKI_SORTS: SkiSort[] = ['recommended', 'vertical', 'acres', 'snowfall', 'rating', 'price', 'opening', 'snow'];

export interface SkiFilters {
  regions: SkiRegionId[];      // any of
  passes: Pass[];              // any of
  activities: SkiActivity[];   // all of
  sizes: ResortSize[];         // any of
}

export const noSkiFilters = (): SkiFilters => ({ regions: [], passes: [], activities: [], sizes: [] });

/** Fields the filter and sort need, so the client can work from a slim JSON copy. */
export type SkiRow = Pick<Resort, 'id' | 'name' | 'region' | 'size' | 'passes' | 'activities' | 'season'> & {
  stats: Pick<Resort['stats'], 'verticalFt' | 'acres' | 'snowfallIn'>;
  google?: { rating: number };
  ticket?: { from: number };
};

export function matchesSki(r: SkiRow, f: SkiFilters): boolean {
  if (f.regions.length && !f.regions.includes(r.region)) return false;
  if (f.passes.length && !f.passes.some((p) => r.passes.includes(p))) return false;
  if (f.activities.length && !f.activities.every((a) => r.activities.includes(a))) return false;
  if (f.sizes.length && !f.sizes.includes(r.size)) return false;
  return true;
}

const SIZE_RANK: Record<ResortSize, number> = { major: 0, mid: 1, local: 2 };

/** Sort a copy. `snow` maps resort id -> forecast inches for the "most new snow" sort. */
export function sortResorts<T extends SkiRow>(rows: T[], key: SkiSort, snow?: Map<string, number>): T[] {
  const rating = (r: T) => r.google?.rating ?? 0;
  const by: Record<SkiSort, (a: T, b: T) => number> = {
    recommended: (a, b) => SIZE_RANK[a.size] - SIZE_RANK[b.size] || rating(b) - rating(a) || b.stats.verticalFt - a.stats.verticalFt,
    vertical: (a, b) => b.stats.verticalFt - a.stats.verticalFt,
    acres: (a, b) => b.stats.acres - a.stats.acres,
    snowfall: (a, b) => b.stats.snowfallIn - a.stats.snowfallIn,
    rating: (a, b) => rating(b) - rating(a) || b.stats.verticalFt - a.stats.verticalFt,
    price: (a, b) => (a.ticket?.from ?? Infinity) - (b.ticket?.from ?? Infinity),
    opening: (a, b) => a.season.opens.localeCompare(b.season.opens) || a.name.localeCompare(b.name),
    snow: (a, b) => (snow?.get(b.id) ?? -1) - (snow?.get(a.id) ?? -1) || by.recommended(a, b),
  };
  return [...rows].sort(by[key]);
}

export function parseSkiFilters(q: URLSearchParams): { filters: SkiFilters; sort: SkiSort } {
  const list = <T extends string>(k: string) => (q.get(k)?.split(',').filter(Boolean) ?? []) as T[];
  const sort = q.get('sort') as SkiSort;
  return {
    filters: { regions: list('region'), passes: list('pass'), activities: list('do'), sizes: list('size') },
    sort: SKI_SORTS.includes(sort) ? sort : 'recommended',
  };
}

export function serializeSkiFilters(f: SkiFilters, sort: SkiSort, omitRegion = false): string {
  const q = new URLSearchParams();
  if (f.regions.length && !omitRegion) q.set('region', f.regions.join(','));
  if (f.passes.length) q.set('pass', f.passes.join(','));
  if (f.activities.length) q.set('do', f.activities.join(','));
  if (f.sizes.length) q.set('size', f.sizes.join(','));
  if (sort !== 'recommended') q.set('sort', sort);
  const s = q.toString();
  return s ? `?${s}` : '';
}

// ---- events

export interface EventRow { resort: Resort; event: SkiEvent }

/** Events of the given kinds across resorts, by date then resort name. */
export function eventsOf(all: Resort[], kinds?: EventKind[]): EventRow[] {
  return all.flatMap((resort) => resort.events.filter((e) => !kinds || kinds.includes(e.kind)).map((event) => ({ resort, event })))
    .sort((a, b) => a.event.date.localeCompare(b.event.date) || a.resort.name.localeCompare(b.resort.name));
}

export const HOLIDAY_KINDS: EventKind[] = ['christmas', 'new-years'];

// ---- live weather (Open-Meteo, no key, CORS-enabled)

const FT_TO_M = 0.3048;

/** Daily forecast + 7 past days for one point at a given elevation (ft), in US units. */
export function forecastUrl(lat: number, lng: number, elevationFt: number): string {
  const q = new URLSearchParams({
    latitude: lat.toFixed(4), longitude: lng.toFixed(4), elevation: String(Math.round(elevationFt * FT_TO_M)),
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,snowfall',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_probability_max,wind_speed_10m_max',
    past_days: '7', forecast_days: '7', timezone: 'auto',
    temperature_unit: 'fahrenheit', wind_speed_unit: 'mph', precipitation_unit: 'inch',
  });
  return `https://api.open-meteo.com/v1/forecast?${q}`;
}

/** Next-7-day and past-7-day snowfall for many points in one request. */
export function batchSnowUrl(points: { lat: number; lng: number; elevationFt: number }[]): string {
  const q = new URLSearchParams({
    latitude: points.map((p) => p.lat.toFixed(3)).join(','),
    longitude: points.map((p) => p.lng.toFixed(3)).join(','),
    elevation: points.map((p) => Math.round(p.elevationFt * FT_TO_M)).join(','),
    daily: 'snowfall_sum', past_days: '7', forecast_days: '7', timezone: 'auto', precipitation_unit: 'inch',
  });
  return `https://api.open-meteo.com/v1/forecast?${q}`;
}

/** Split a 14-day daily series (7 past incl. today-7.., then today + 6 ahead) into past/next sums. */
export function snowTotals(daily: { time: string[]; snowfall_sum: (number | null)[] }, today: string): { past: number; next: number } {
  let past = 0, next = 0;
  daily.time.forEach((t, i) => {
    const v = daily.snowfall_sum[i] ?? 0;
    if (t < today) past += v; else next += v;
  });
  const r = (n: number) => Math.round(n * 10) / 10;
  return { past: r(past), next: r(next) };
}

/** WMO weather code -> short label and icon name. */
export function wmo(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Clear', icon: 'sun' };
  if (code <= 2) return { label: 'Partly cloudy', icon: 'cloud-sun' };
  if (code === 3) return { label: 'Overcast', icon: 'cloud' };
  if (code === 45 || code === 48) return { label: 'Fog', icon: 'cloud' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: 'rain' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { label: 'Rain', icon: 'rain' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: code === 75 || code === 86 ? 'Heavy snow' : 'Snow', icon: 'snowflake' };
  if (code >= 95) return { label: 'Thunderstorm', icon: 'rain' };
  return { label: 'Mixed', icon: 'cloud' };
}

/** Inches with one decimal under 10, whole above: 0.4″, 6″, 12″. */
export function inches(n: number): string {
  if (n > 0 && n < 0.1) return '<0.1″';
  return `${n < 10 ? Math.round(n * 10) / 10 : Math.round(n)}″`;
}
