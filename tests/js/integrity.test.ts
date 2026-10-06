import { describe, expect, it } from 'vitest';
import { trips } from '../../src/data/trips';
import { placeById } from '../../src/data/places';
import { resorts } from '../../src/data/ski';
import { spots } from '../../src/data/outdoors';
import { nights, openTypes } from '../../src/lib/format';
import imagesJson from '../../src/data/images.json';

const credits = imagesJson as Record<string, { file: string; license: string; author: string; sourceUrl: string }[]>;

describe('photos', () => {
  // Keys only (not eager), so no image is loaded.
  const onDisk = Object.keys(import.meta.glob('/src/assets/places/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}')).map((f) => f.slice(1));
  const credited = Object.values(credits).flat();

  it('every photo in the repo is credited (no uncredited files)', () => {
    const files = new Set(credited.map((c) => c.file));
    expect(onDisk.filter((f) => !files.has(f))).toEqual([]);
  });
  it('every credit points at a file and names its license and source', () => {
    const disk = new Set(onDisk);
    for (const c of credited) {
      expect(disk.has(c.file), c.file).toBe(true);
      expect(c.license, c.file).toBeTruthy();
      expect(c.sourceUrl, c.file).toMatch(/^https:\/\//);
    }
  });
});

describe('trips', () => {
  it('have valid dates and unique slugs', () => {
    expect(new Set(trips.map((t) => t.slug)).size).toBe(trips.length);
    for (const t of trips) {
      expect(nights(t.start, t.end), t.slug).toBeGreaterThan(0);
      expect(t.checkedAt <= t.start, `${t.slug} checked after arrival`).toBe(true);
    }
  });
  it('top picks are options, and open lodging has a price', () => {
    for (const t of trips) {
      const ids = new Set(t.options.map((o) => o.placeId));
      expect(ids.size, `${t.slug} duplicate options`).toBe(t.options.length);
      for (const p of t.topPicks) expect(ids.has(p.placeId), `${t.slug} pick ${p.placeId}`).toBe(true);
      for (const o of t.options) {
        expect(placeById[o.placeId], o.placeId).toBeDefined();
        for (const k of openTypes(o)) expect(o.price[k], `${t.slug} ${o.placeId} ${k} price`).toBeTypeOf('number');
        for (const s of o.cabinSites ?? []) expect(s).toMatch(/^[0-9A-Z]+$/);
      }
    }
  });
});

describe('events', () => {
  const all = [...resorts.map((r) => [r.id, r.events] as const), ...spots.map((s) => [s.id, s.events] as const)];
  it('end on or after they start and have no duplicate names per venue', () => {
    for (const [id, events] of all) {
      for (const e of events) if (e.end) expect(e.end >= e.date, `${id}: ${e.name}`).toBe(true);
      const names = events.map((e) => e.name);
      expect(new Set(names).size, `${id} duplicate event names`).toBe(names.length);
    }
  });
  it('confirmed events give this season’s date, not a usual one', () => {
    for (const [id, events] of all) {
      for (const e of events.filter((x) => x.confirmed)) {
        expect(e.when.trim(), `${id}: ${e.name}`).not.toBe('');
        const usual = /\((annual|typical)\)|last season|in 20(24|25)\)/i.test(e.when) && !/20(26|27)/.test(e.when);
        expect(usual, `${id}: ${e.name} “${e.when}” reads like a usual date`).toBe(false);
      }
    }
  });
});
