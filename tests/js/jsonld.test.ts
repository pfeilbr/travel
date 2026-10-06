import { describe, expect, it } from 'vitest';
import { placeLd, resortLd, spotLd } from '../../src/lib/jsonld';
import { places } from '../../src/data/places';
import { resorts, skiRegionById } from '../../src/data/ski';
import { pursuitById, spots } from '../../src/data/outdoors';

const page = new URL('https://pfeilbr.github.io/travel/x/');

describe('JSON-LD', () => {
  it('describes a campground with its location', () => {
    const ld = placeLd(places[0], page);
    expect(ld['@type']).toBe('Campground');
    expect(ld.geo).toMatchObject({ latitude: places[0].coords[0], longitude: places[0].coords[1] });
    expect(JSON.stringify(ld)).not.toContain('aggregateRating');
  });

  it('publishes only confirmed resort events', () => {
    for (const r of resorts) {
      const events = resortLd(r, skiRegionById[r.region], page).event as { startDate: string }[];
      expect(events.length).toBe(r.events.filter((e) => e.confirmed).length);
      for (const e of events) expect(e.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('types every spot', () => {
    for (const s of spots) {
      const ld = spotLd(s, pursuitById[s.pursuit], skiRegionById[s.region], page);
      expect(ld['@type'], s.id).toBeTruthy();
      expect(ld.address).toMatchObject({ addressLocality: s.town });
    }
  });
});
