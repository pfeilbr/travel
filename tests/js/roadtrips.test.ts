import { describe, expect, it } from 'vitest';
import { roadtrips, routesFor } from '../../src/data/roadtrips';
import { byId, interleave, photoSpec, dayMinutes, nightStays, planCost, planStats, directionsUrl, roughly } from '../../src/lib/roadtrip';
import type { RoadTrip } from '../../src/data/roadtrips/types';

const iso = /^\d{4}-\d{2}-\d{2}$/;
const https = (u: string) => /^https:\/\/\S+$/.test(u);
const inNE = ([lat, lng]: [number, number]) => lat > 38 && lat < 47.5 && lng > -80 && lng < -66;
const addDays = (d: string, n: number) => new Date(Date.parse(d + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);

describe('road trips', () => {
  it('has at least one trip', () => expect(roadtrips.length).toBeGreaterThan(0));

  it.each(roadtrips.map((t) => [t.slug, t] as const))('%s is consistent', (_s, t: RoadTrip) => {
    expect(t.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const d of [t.start, t.end, t.checkedAt]) expect(d).toMatch(iso);
    expect(t.plans.map((p) => p.id)).toContain(t.recommended);
    expect(t.hero.length).toBeGreaterThan(0);

    const ids = [...t.areas, ...t.stays, ...t.meals].map((x) => x.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i), 'duplicate ids').toEqual([]);
    const areas = byId(t.areas), stays = byId(t.stays), meals = byId(t.meals);

    for (const a of t.areas) {
      expect(inNE(a.coords), a.id).toBe(true);
      for (const x of a.things) {
        if (x.url) expect(https(x.url), x.url).toBe(true);
        if (x.coords) expect(inNE(x.coords), x.name).toBe(true);
      }
    }
    for (const s of t.stays) {
      expect(areas[s.area], s.id).toBeDefined();
      expect(inNE(s.coords), s.id).toBe(true);
      expect(https(s.url), s.url).toBe(true);
      expect(s.price, s.id).toBeGreaterThan(0);
      expect(s.priceAsOf).toMatch(iso);
    }
    for (const m of t.meals) {
      expect(areas[m.area], m.id).toBeDefined();
      expect(https(m.url), m.url).toBe(true);
      if (m.reserveUrl) expect(https(m.reserveUrl), m.reserveUrl).toBe(true);
      expect(m.perPerson, m.id).toBeGreaterThan(0);
    }

    for (const p of t.plans) {
      // One day per date, start to end, no gaps.
      expect(p.days[0].date, p.id).toBe(t.start);
      expect(p.days.at(-1)!.date, p.id).toBe(t.end);
      p.days.forEach((d, i) => {
        expect(d.date, `${p.id} day ${i + 1}`).toBe(addDays(t.start, i));
        expect(areas[d.area], `${p.id} ${d.date} area`).toBeDefined();
        for (const id of d.stays ?? []) expect(stays[id], `${p.id} ${d.date} stay ${id}`).toBeDefined();
        for (const id of d.meals) expect(meals[id], `${p.id} ${d.date} meal ${id}`).toBeDefined();
        for (const l of d.legs) { expect(l.minutes).toBeGreaterThan(0); expect(l.miles).toBeGreaterThan(0); }
        // Legs chain: each starts where the last ended.
        d.legs.slice(1).forEach((l, j) => expect(l.from, `${p.id} ${d.date}`).toBe(d.legs[j].to));
        expect(dayMinutes(d), `${p.id} ${d.date} driving`).toBeLessThanOrEqual(9 * 60);
      });
      // Every night but the last has somewhere to sleep.
      p.days.slice(0, -1).forEach((d) => expect(d.stays?.length, `${p.id} ${d.date} needs a stay`).toBeGreaterThan(0));
      expect(nightStays(t, p).length).toBe(p.days.length - 1);

      const route = routesFor(t.slug)[p.id];
      expect(route, `routes.json has ${t.slug}/${p.id} (run scripts/roadtrip_routes.py)`).toBeDefined();
      expect(route.line.length).toBeGreaterThan(10);
    }
  });
});

describe('road trip math', () => {
  const t = roadtrips[0];
  const p = t.plans[0];
  it('cost adds up', () => {
    const c = planCost(t, p);
    expect(c.total).toBe(c.lodging + c.tax + c.food + c.gas + c.tolls + c.tickets);
    expect(c.tax).toBe(Math.round(nightStays(t, p).reduce((s, n) => s + n.stay.price, 0) * t.lodgingTax));
    expect(c.lodging).toBe(Math.round(nightStays(t, p).reduce((s, n) => s + n.stay.price, 0)));
  });
  it('stats count nights and miles', () => {
    const s = planStats(t, p);
    expect(s.nights).toBe(p.days.length - 1);
    expect(Object.values(s.beds).reduce((a, b) => a + b, 0)).toBe(s.nights);
    expect(s.longestDay).toBe(Math.max(...p.days.map(dayMinutes)));
  });
  it('interleaves photo sets', () => {
    expect(interleave([[1, 2, 3], [10], [20, 21]])).toEqual([1, 10, 20, 2, 21, 3]);
    expect(interleave([])).toEqual([]);
  });
  it('parses photo specs', () => {
    expect(photoSpec('rt-boston#2')).toEqual({ set: 'rt-boston', index: 2 });
    expect(photoSpec('rt-boston')).toEqual({ set: 'rt-boston', index: 0 });
  });
  it('formats helpers', () => {
    expect(roughly(3424)).toBe('$3,400');
    expect(roughly(3476)).toBe('$3,500');
    expect(directionsUrl(['Verona, NY', 'Boston, MA'])).toBe('https://www.google.com/maps/dir/Verona%2C%20NY/Boston%2C%20MA/');
  });
});
