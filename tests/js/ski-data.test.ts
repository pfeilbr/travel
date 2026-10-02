import { describe, expect, it } from 'vitest';
import { resorts, skiRegions, skiRegionById } from '../../src/data/ski';
import { places } from '../../src/data/places';
import { ACTIVITY, PASSES } from '../../src/lib/ski';

const iso = /^\d{4}-\d{2}-\d{2}$/;
const https = (u: string) => /^https:\/\/[^\s]+$/.test(u);
// Rough bounding boxes (lat/lng) so a swapped or mistyped coordinate fails loudly.
const BOX: Record<string, [number, number, number, number]> = {
  vermont: [42.7, 45.1, -73.5, -71.4], 'new-hampshire': [42.6, 45.4, -72.6, -70.6], 'new-york': [40.4, 45.1, -79.9, -71.8],
  pennsylvania: [39.6, 42.3, -80.6, -74.6], utah: [37.0, 42.1, -114.1, -109.0], colorado: [36.9, 41.1, -109.1, -102.0],
  montana: [44.3, 49.1, -116.1, -104.0], california: [32.5, 42.1, -124.5, -114.1], arizona: [31.3, 37.1, -114.9, -109.0],
  quebec: [44.9, 49.0, -79.6, -64.0], 'british-columbia': [48.2, 60.1, -139.1, -114.0],
};

describe('ski regions', () => {
  it('has unique ids and valid fields', () => {
    expect(new Set(skiRegions.map((r) => r.id)).size).toBe(skiRegions.length);
    for (const r of skiRegions) {
      expect(https(r.reportUrl), r.id).toBe(true);
      expect(r.tips.length, r.id).toBeGreaterThan(0);
      expect(BOX[r.id], r.id).toBeDefined();
    }
  });
});

describe('ski resorts', () => {
  it('have unique ids that never collide with place ids', () => {
    const ids = resorts.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    const placeIds = new Set(places.map((p) => p.id));
    for (const id of ids) {
      expect(placeIds.has(id), id).toBe(false);
      expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(id.length).toBeLessThanOrEqual(80);
    }
  });

  it.each(resorts.map((r) => [r.id, r] as const))('%s is well-formed', (_id, r) => {
    expect(skiRegionById[r.region]).toBeDefined();
    const [lat0, lat1, lng0, lng1] = BOX[r.region];
    expect(r.coords[0]).toBeGreaterThanOrEqual(lat0);
    expect(r.coords[0]).toBeLessThanOrEqual(lat1);
    expect(r.coords[1]).toBeGreaterThanOrEqual(lng0);
    expect(r.coords[1]).toBeLessThanOrEqual(lng1);
    for (const u of [r.url, r.snowReportUrl, r.trailMapUrl, r.webcamUrl].filter(Boolean)) expect(https(u!), u).toBe(true);
    expect(r.tagline.length).toBeGreaterThan(0);
    expect(r.summary.length).toBeGreaterThan(40);
    expect(r.passes.every((p) => PASSES.includes(p))).toBe(true);
    expect(r.activities.every((a) => a in ACTIVITY)).toBe(true);
    expect(r.season.opens).toMatch(iso);
    expect(r.season.closes).toMatch(iso);
    expect(r.season.opens < r.season.closes).toBe(true);
    expect(r.season.opens >= '2026-09-01' && r.season.opens <= '2027-02-01').toBe(true);

    const s = r.stats;
    expect(s.summitFt).toBeGreaterThan(s.baseFt);
    expect(Math.abs(s.summitFt - s.baseFt - s.verticalFt)).toBeLessThanOrEqual(Math.max(150, s.verticalFt * 0.12));
    expect(s.acres).toBeGreaterThan(0);
    expect(s.trails).toBeGreaterThan(0);
    expect(s.lifts).toBeGreaterThan(0);
    expect(s.snowfallIn).toBeGreaterThan(0);
    const mix = s.terrain.beginner + s.terrain.intermediate + s.terrain.advanced;
    expect(mix).toBeGreaterThanOrEqual(95);
    expect(mix).toBeLessThanOrEqual(105);
    if (r.ticket) expect(r.ticket.from).toBeGreaterThan(0);

    expect(r.lodging.length).toBeGreaterThan(0);
    for (const l of r.lodging) expect(https(l.url), l.url).toBe(true);
    for (const t of [...r.thingsToDo, ...r.apres]) if (t.url) expect(https(t.url), t.url).toBe(true);
    for (const e of r.events) {
      expect(e.date, e.name).toMatch(iso);
      if (e.end) expect(e.end >= e.date, e.name).toBe(true);
      expect(e.date >= '2026-09-01' && e.date <= '2027-08-31', `${e.name} ${e.date}`).toBe(true);
      if (e.url) expect(https(e.url), e.url).toBe(true);
    }
    if (r.google) {
      expect(r.google.rating).toBeGreaterThanOrEqual(1);
      expect(r.google.rating).toBeLessThanOrEqual(5);
      expect(r.google.url).toMatch(/^https:\/\/maps\.google\.com\/\?cid=\d+$/);
      expect(r.google.asOf).toMatch(iso);
    }
    expect(r.getting.code).toMatch(/^[A-Z]{3}$/);
    expect(r.getting.driveMin).toBeGreaterThan(0);
  });
});
