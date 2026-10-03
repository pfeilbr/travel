import { describe, expect, it } from 'vitest';
import { matchesSpot, noSpotFilters, parseSpotFilters, priceText, seasonText, serializeSpotFilters, sortSpots, weatherUrl, type SpotRow } from '../../src/lib/outdoors';

const a: SpotRow = { id: 'a', name: 'Alpha', region: 'vermont', kind: 'Trail network', size: 'major', features: ['flow', 'rentals'], google: { rating: 4.6 }, price: { from: 20 }, miles: 150 };
const b: SpotRow = { id: 'b', name: 'Bravo', region: 'utah', kind: 'Lift-served bike park', size: 'mid', features: ['lift-served', 'rentals'], google: { rating: 4.9 }, miles: 2000 };
const c: SpotRow = { id: 'c', name: 'Charlie', region: 'vermont', kind: 'Trail network', size: 'local', features: [], price: { from: 0 }, miles: 40 };

describe('spot filters', () => {
  it('matches regions and kinds (any), features (all), sizes (any)', () => {
    const f = noSpotFilters();
    const ids = (x: Partial<typeof f>) => [a, b, c].filter((r) => matchesSpot(r, { ...f, ...x })).map((r) => r.id);
    expect(ids({})).toEqual(['a', 'b', 'c']);
    expect(ids({ regions: ['vermont'] })).toEqual(['a', 'c']);
    expect(ids({ kinds: ['Lift-served bike park'] })).toEqual(['b']);
    expect(ids({ features: ['rentals'] })).toEqual(['a', 'b']);
    expect(ids({ features: ['rentals', 'flow'] })).toEqual(['a']);
    expect(ids({ sizes: ['local', 'mid'] })).toEqual(['b', 'c']);
  });
  it('sorts', () => {
    const ids = (k: Parameters<typeof sortSpots>[1]) => sortSpots([a, b, c], k).map((r) => r.id);
    expect(ids('recommended')).toEqual(['a', 'b', 'c']);
    expect(ids('rating')).toEqual(['b', 'a', 'c']);
    expect(ids('price')).toEqual(['c', 'a', 'b']);
    expect(ids('name')).toEqual(['a', 'b', 'c']);
    expect(ids('near')).toEqual(['c', 'a', 'b']);
  });
  it('round-trips through the URL', () => {
    const q = '?region=vermont,utah&kind=Trail network&has=rentals&size=major&sort=near';
    const { filters, sort } = parseSpotFilters(new URLSearchParams(q));
    expect(filters).toEqual({ regions: ['vermont', 'utah'], kinds: ['Trail network'], features: ['rentals'], sizes: ['major'] });
    expect(sort).toBe('near');
    expect(new URLSearchParams(serializeSpotFilters(filters, sort)).toString()).toBe(new URLSearchParams(q).toString());
    expect(parseSpotFilters(new URLSearchParams('?sort=nope')).sort).toBe('recommended');
    expect(serializeSpotFilters(noSpotFilters(), 'recommended')).toBe('');
  });
});

describe('spot formatting', () => {
  it('formats seasons and prices', () => {
    expect(seasonText({ from: 'May', to: 'Oct' })).toBe('May – Oct');
    expect(seasonText({ from: 'Year-round', to: 'Year-round' })).toBe('Year-round');
    expect(seasonText({ from: 'Jul', to: 'Jul' })).toBe('Jul');
    expect(priceText({ from: 45, unit: 'day ticket' })).toBe('$45 day ticket');
    expect(priceText({ from: 38, unit: 'site/night' }, 'CAD')).toBe('C$38 site/night');
    expect(priceText({ from: 0, unit: 'to play' })).toBe('Free to play');
    expect(priceText({ from: 12.5, unit: 'drop-in' })).toBe('$12.50 drop-in');
  });
  it('builds a 7-day weather URL in US units', () => {
    const u = new URL(weatherUrl(44.5889, -71.9466));
    expect(u.searchParams.get('latitude')).toBe('44.5889');
    expect(u.searchParams.get('forecast_days')).toBe('7');
    expect(u.searchParams.get('temperature_unit')).toBe('fahrenheit');
    expect(u.searchParams.get('daily')).toContain('precipitation_probability_max');
  });
});
