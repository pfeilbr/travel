import { describe, expect, it } from 'vitest';
import {
  batchSnowUrl, daysUntil, eventsOf, forecastUrl, inches, matchesSki, miles, nearest, noSkiFilters, parseSkiFilters,
  price, seasonLine, serializeSkiFilters, shortDate, snowTotals, sortResorts, wmo,
} from '../../src/lib/ski';
import type { Resort } from '../../src/data/ski/types';

const resort = (p: Partial<Resort> & { id: string }): Resort => ({
  name: p.id, region: 'vermont', area: 'A', town: 'T', coords: [44, -72], size: 'mid', tagline: '', summary: '',
  url: 'https://x', snowReportUrl: 'https://x', passes: [], season: { opens: '2026-11-20', closes: '2027-04-15' },
  stats: { summitFt: 3000, baseFt: 1000, verticalFt: 2000, acres: 300, trails: 50, lifts: 6, snowfallIn: 200, terrain: { beginner: 20, intermediate: 50, advanced: 30 } },
  activities: [], lodging: [], thingsToDo: [], apres: [], events: [], getting: { airport: 'A', code: 'AAA', driveMin: 60 },
  ...p,
});

const a = resort({ id: 'a', size: 'major', passes: ['epic'], activities: ['night-skiing', 'tubing'], google: { rating: 4.5, url: '', asOf: '' }, ticket: { from: 150 } });
const b = resort({ id: 'b', region: 'utah', coords: [40.6, -111.6], passes: ['ikon', 'mountain-collective'], activities: ['tubing'], stats: { ...a.stats, verticalFt: 3000, acres: 2000, snowfallIn: 500 }, google: { rating: 4.8, url: '', asOf: '' }, season: { opens: '2026-11-14', closes: '2027-05-01' } });
const c = resort({ id: 'c', size: 'local', coords: [44.1, -72.1], ticket: { from: 40 } });

describe('ski format', () => {
  it('formats prices in USD and CAD', () => {
    expect(price(129)).toBe('$129');
    expect(price(1299)).toBe('$1,299');
    expect(price(89, 'CAD')).toBe('C$89');
  });
  it('formats dates and seasons', () => {
    expect(shortDate('2026-12-31')).toBe('Dec 31');
    expect(shortDate('2026-12-31', true)).toBe('Dec 31, 2026');
    expect(seasonLine(a.season)).toBe('Nov 20 – Apr 15');
    expect(daysUntil('2026-11-20', '2026-10-02')).toBe(49);
    expect(daysUntil('2026-10-01', '2026-10-02')).toBe(-1);
  });
  it('formats inches', () => {
    expect(inches(0)).toBe('0″');
    expect(inches(0.04)).toBe('<0.1″');
    expect(inches(3.46)).toBe('3.5″');
    expect(inches(12.4)).toBe('12″');
  });
  it('maps WMO codes', () => {
    expect(wmo(0).label).toBe('Clear');
    expect(wmo(73).icon).toBe('snowflake');
    expect(wmo(75).label).toBe('Heavy snow');
    expect(wmo(63).icon).toBe('rain');
  });
});

describe('ski geo', () => {
  it('computes distances and nearest resorts', () => {
    expect(Math.round(miles([40.7128, -74.006], [42.3601, -71.0589]))).toBe(190);
    expect(nearest(a, [a, b, c], 2).map((r) => r.id)).toEqual(['c', 'b']);
  });
});

describe('ski filters', () => {
  it('matches passes (any), activities (all), regions and sizes', () => {
    const f = noSkiFilters();
    expect([a, b, c].filter((r) => matchesSki(r, f))).toHaveLength(3);
    expect([a, b, c].filter((r) => matchesSki(r, { ...f, passes: ['epic', 'ikon'] })).map((r) => r.id)).toEqual(['a', 'b']);
    expect([a, b, c].filter((r) => matchesSki(r, { ...f, activities: ['tubing', 'night-skiing'] })).map((r) => r.id)).toEqual(['a']);
    expect([a, b, c].filter((r) => matchesSki(r, { ...f, regions: ['utah'] })).map((r) => r.id)).toEqual(['b']);
    expect([a, b, c].filter((r) => matchesSki(r, { ...f, sizes: ['local', 'mid'] })).map((r) => r.id)).toEqual(['b', 'c']);
  });
  it('sorts by each key', () => {
    const ids = (k: Parameters<typeof sortResorts>[1], snow?: Map<string, number>) => sortResorts([a, b, c], k, snow).map((r) => r.id);
    expect(ids('recommended')).toEqual(['a', 'b', 'c']);
    expect(ids('vertical')[0]).toBe('b');
    expect(ids('rating')).toEqual(['b', 'a', 'c']);
    expect(ids('price')).toEqual(['c', 'a', 'b']);
    expect(ids('opening')[0]).toBe('b');
    expect(ids('snow', new Map([['c', 8], ['a', 2]]))).toEqual(['c', 'a', 'b']);
  });
  it('round-trips filter state through the URL', () => {
    const q = '?region=vermont,utah&pass=ikon&do=tubing&size=major&sort=vertical';
    const { filters, sort } = parseSkiFilters(new URLSearchParams(q));
    expect(filters).toEqual({ regions: ['vermont', 'utah'], passes: ['ikon'], activities: ['tubing'], sizes: ['major'] });
    expect(sort).toBe('vertical');
    expect(decodeURIComponent(serializeSkiFilters(filters, sort))).toBe(q);
    expect(serializeSkiFilters(filters, sort, true)).not.toContain('region');
    expect(parseSkiFilters(new URLSearchParams('?sort=bogus')).sort).toBe('recommended');
    expect(serializeSkiFilters(noSkiFilters(), 'recommended')).toBe('');
  });
});

describe('ski events', () => {
  it('flattens and orders events by date', () => {
    const x = resort({ id: 'x', name: 'Xmas', events: [
      { name: 'NYE torchlight', kind: 'new-years', date: '2026-12-31', when: 'Dec 31', what: '', confirmed: false },
      { name: 'Santa Sunday', kind: 'christmas', date: '2026-12-20', when: 'Dec 20', what: '', confirmed: true },
      { name: 'Pond skim', kind: 'pond-skim', date: '2027-04-10', when: 'Apr', what: '', confirmed: false },
    ] });
    expect(eventsOf([x], ['christmas', 'new-years']).map((r) => r.event.name)).toEqual(['Santa Sunday', 'NYE torchlight']);
    expect(eventsOf([x])).toHaveLength(3);
  });
});

describe('open-meteo', () => {
  it('builds single and batch URLs in US units at the given elevation', () => {
    const u = new URL(forecastUrl(44.5303, -72.7814, 3640));
    expect(u.searchParams.get('elevation')).toBe('1109');
    expect(u.searchParams.get('temperature_unit')).toBe('fahrenheit');
    expect(u.searchParams.get('past_days')).toBe('7');
    const bu = new URL(batchSnowUrl([{ lat: 44.53, lng: -72.78, elevationFt: 1000 }, { lat: 40.58, lng: -111.65, elevationFt: 9000 }]));
    expect(bu.searchParams.get('latitude')).toBe('44.530,40.580');
    expect(bu.searchParams.get('elevation')).toBe('305,2743');
  });
  it('splits past and next snowfall around today', () => {
    const t = snowTotals({ time: ['2026-12-01', '2026-12-02', '2026-12-03', '2026-12-04'], snowfall_sum: [1.2, null, 3.04, 0.5] }, '2026-12-03');
    expect(t).toEqual({ past: 1.2, next: 3.5 });
  });
});
