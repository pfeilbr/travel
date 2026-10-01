import { describe, expect, it } from 'vitest';
import { matches, parseFilters, recommendedRank, serializeFilters, sortRows, type Row } from '../../src/lib/filter';
import { places, placeById } from '../../src/data/places';
import { trips } from '../../src/data/trips';

const trip = trips[0];
const rank = recommendedRank(trip.options, trip.topPicks.map((p) => p.placeId));
const rows: Row[] = trip.options.map((o) => ({ place: placeById[o.placeId], option: o, rank: rank.get(o.placeId)! }));
const none = { lodging: [], activities: [] };

describe('filters', () => {
  it('ranks top picks first', () => {
    expect(sortRows(rows, 'recommended').slice(0, 3).map((r) => r.place.id)).toEqual(['robert-h-treman', 'green-lakes', 'selkirk-shores']);
  });
  it('filters by open cabins', () => {
    const ids = rows.filter((r) => matches(r, { ...none, lodging: ['cabin'] })).map((r) => r.place.id).sort();
    expect(ids).toEqual(['green-lakes', 'robert-h-treman', 'selkirk-shores']);
  });
  it('roof-only includes glamping and cottages', () => {
    const ids = rows.filter((r) => matches(r, { ...none, roofOnly: true })).map((r) => r.place.id);
    expect(ids).toContain('firelight-camps');
    expect(ids).toContain('sampson');
    expect(ids).not.toContain('keuka-lake');
  });
  it('requires all activities and respects max drive', () => {
    const ids = rows.filter((r) => matches(r, { ...none, activities: ['biking', 'fishing'], maxDrive: 90 })).map((r) => r.place.id);
    expect(ids).toEqual(['green-lakes']);
  });
  it('sorts by price, drive and rating', () => {
    expect(sortRows(rows, 'price')[0].place.id).toBe('glimmerglass');
    expect(sortRows(rows, 'drive')[0].place.id).toBe('green-lakes');
    expect(sortRows(rows, 'rating')[0].place.id).toBe('watkins-glen');
    expect(sortRows(rows, 'price', ['cabin'])[0].place.id).toBe('robert-h-treman');
  });
  it('filters by region', () => {
    const ids = rows.filter((r) => matches(r, { ...none, regions: ['Adirondacks', 'Lake Ontario'] })).map((r) => r.place.id).sort();
    expect(ids).toEqual(['nicks-lake', 'selkirk-shores']);
  });
  it('round-trips URL params', () => {
    const f = { lodging: ['cabin' as const], activities: ['biking' as const], maxDrive: 120, roofOnly: true };
    const s = serializeFilters(f, 'price');
    expect(parseFilters(new URLSearchParams(s))).toEqual({ filters: f, sort: 'price' });
    expect(serializeFilters({ lodging: [], activities: [] }, 'recommended')).toBe('');
    const g = { lodging: [], activities: [], maxDrive: undefined, roofOnly: false, regions: ['Finger Lakes'] };
    expect(parseFilters(new URLSearchParams(serializeFilters(g, 'recommended')))).toEqual({ filters: g, sort: 'recommended' });
  });
});

describe('data integrity', () => {
  it('every trip option points at a known place', () => {
    for (const t of trips) for (const o of t.options) expect(placeById[o.placeId], o.placeId).toBeDefined();
  });
  it('ratings are sane and dated', () => {
    for (const p of places) {
      expect(p.google.rating).toBeGreaterThanOrEqual(1);
      expect(p.google.rating).toBeLessThanOrEqual(5);
      expect(p.google.url).toMatch(/^https:\/\/maps\.google\.com\/\?cid=\d+$/);
      expect(p.google.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it('place ids are unique slugs', () => {
    const ids = places.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });
});
