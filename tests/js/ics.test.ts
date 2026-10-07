import { describe, expect, it } from 'vitest';
import { calendar, fold } from '../../src/lib/ics';
import { feedEvents } from '../../src/lib/calendar-feed';
import { spots } from '../../src/data/outdoors';

describe('ics', () => {
  it('writes all-day events with an exclusive end and escaped text', () => {
    const ics = calendar('Test', [{ uid: 'a@x', start: '2026-12-31', summary: 'NYE; fireworks, party', description: 'Line one\nline two' }], '20261006T000000Z');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101');
    expect(ics).toContain('SUMMARY:NYE\\; fireworks\\, party');
    expect(ics).toContain('DESCRIPTION:Line one\\nline two');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });
  it('spans multi-day events through their last day', () => {
    expect(calendar('T', [{ uid: 'b', start: '2027-01-17', end: '2027-01-24', summary: 's' }], 'x')).toContain('DTEND;VALUE=DATE:20270125');
  });
  it('folds long lines at 75 octets', () => {
    const lines = fold('DESCRIPTION:' + 'é'.repeat(100)).split('\r\n');
    for (const l of lines) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    expect(lines.slice(1).every((l) => l.startsWith(' '))).toBe(true);
  });
  it('feeds only confirmed events, with unique ids', () => {
    const venues = spots.map((x) => ({ ...x, path: `x/${x.id}/` }));
    const evs = feedEvents(venues, new URL('https://h.io/travel/'));
    expect(evs.length).toBe(spots.flatMap((x) => x.events).filter((e) => e.confirmed).length);
    expect(new Set(evs.map((e) => e.uid)).size).toBe(evs.length);
  });
});
