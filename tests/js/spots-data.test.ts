import { describe, expect, it } from 'vitest';
import { spots, pursuits, pursuitById } from '../../src/data/outdoors';
import { resorts, resortById, skiRegionById } from '../../src/data/ski';
import { places } from '../../src/data/places';

const iso = /^\d{4}-\d{2}-\d{2}$/;
const https = (u: string) => /^https:\/\/\S+$/.test(u);
const web = (u: string) => /^https?:\/\/\S+$/.test(u);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Year-round'];

describe('shared id namespace', () => {
  it('place, resort and spot ids never collide (wishlists and reviews key on them)', () => {
    const ids = [...places.map((p) => p.id), ...resorts.map((r) => r.id), ...spots.map((s) => s.id)];
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });
});

describe('spots', () => {
  it.each(spots.map((s) => [s.id, s] as const))('%s is well-formed', (_id, s) => {
    const p = pursuitById[s.pursuit];
    expect(p).toBeDefined();
    expect(s.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(skiRegionById[s.region]).toBeDefined();
    expect(p.kinds, s.kind).toContain(s.kind);
    for (const f of s.features) expect(p.features.map((x) => x.id), f).toContain(f);
    expect(s.coords[0]).toBeGreaterThan(30);
    expect(s.coords[0]).toBeLessThan(61);
    expect(s.coords[1]).toBeGreaterThan(-140);
    expect(s.coords[1]).toBeLessThan(-60);
    expect(s.tagline.length).toBeGreaterThan(0);
    expect(s.summary.length).toBeGreaterThan(40);
    for (const u of [s.url, s.bookingUrl, s.mapUrl, s.conditionsUrl].filter(Boolean)) expect(https(u!), u).toBe(true);
    expect(MONTHS, s.season.from).toContain(s.season.from);
    expect(MONTHS, s.season.to).toContain(s.season.to);
    expect(s.facts.length).toBeGreaterThanOrEqual(2);
    if (s.price) expect(s.price.from).toBeGreaterThanOrEqual(0);
    for (const l of s.lodging) expect(web(l.url), l.url).toBe(true);
    for (const t of [...s.thingsToDo, ...s.outfitters]) if (t.url) expect(web(t.url), t.url).toBe(true);
    for (const e of s.events) {
      expect(e.date, e.name).toMatch(iso);
      expect(e.date >= '2026-09-01' && e.date <= '2027-12-31', `${e.name} ${e.date}`).toBe(true);
      if (e.url) expect(web(e.url), e.url).toBe(true);
    }
    if (s.resortId) expect(resortById[s.resortId], s.resortId).toBeDefined();
    if (s.google) {
      expect(s.google.rating).toBeGreaterThanOrEqual(1);
      expect(s.google.rating).toBeLessThanOrEqual(5);
      expect(s.google.url).toMatch(/^https:\/\/maps\.google\.com\/\?cid=\d+$/);
    }
    expect(s.getting.code).toMatch(/^[A-Z]{3}$/);
  });
});

describe('pursuits', () => {
  it('a pinned hub hero names a spot of that pursuit', () => {
    for (const p of pursuits.filter((x) => x.hero)) {
      expect(spots.find((s) => s.id === p.hero!.spot)?.pursuit, p.id).toBe(p.id);
      expect(p.hero!.title).toMatch(/^(File|Openverse):/);
    }
  });
});
