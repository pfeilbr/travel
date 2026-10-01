import { describe, expect, it } from 'vitest';
import { availabilityLine, compact, dateRange, drive, hasRoof, lowestPrice, money, nights, openTypes } from '../../src/lib/format';
import type { TripOption } from '../../src/data/types';

const opt = (p: Partial<TripOption>): TripOption => ({ placeId: 'x', driveMin: 60, miles: 40, available: {}, price: {}, flags: [], notes: [], ...p });

describe('format', () => {
  it('formats drive time', () => {
    expect(drive(45)).toBe('45 min');
    expect(drive(60)).toBe('1 hr');
    expect(drive(135)).toBe('2 hr 15 min');
  });
  it('formats money and compact counts', () => {
    expect(money(20)).toBe('$20');
    expect(money(80.5)).toBe('$80.50');
    expect(compact(337)).toBe('337');
    expect(compact(1333)).toBe('1.3k');
    expect(compact(2000)).toBe('2k');
    expect(compact(23963)).toBe('24k');
  });
  it('summarizes availability, skipping zeros', () => {
    expect(availabilityLine(opt({ available: { tent: 48, cabin: 3, cottage: 0 } }))).toBe('3 cabins · 48 tent sites');
    expect(availabilityLine(opt({ available: { cabin: 1 } }))).toBe('1 cabin');
    expect(availabilityLine(opt({ available: { glamping: 'available' } }))).toBe('Glamping tent open');
    expect(availabilityLine(opt({ available: { cabin: 0 } }))).toBe('Nothing open');
  });
  it('finds open types, lowest price and roofs', () => {
    const o = opt({ available: { tent: 40, cabin: 6, cottage: 0 }, price: { tent: 20, cabin: 80.5, cottage: 300 } });
    expect(openTypes(o).sort()).toEqual(['cabin', 'tent']);
    expect(lowestPrice(o)).toBe(20);
    expect(lowestPrice(o, ['cabin'])).toBe(80.5);
    expect(lowestPrice(o, ['cottage'])).toBeNull();
    expect(hasRoof(o)).toBe(true);
    expect(hasRoof(opt({ available: { tent: 3, cabin: 0 } }))).toBe(false);
  });
  it('counts nights and formats ranges', () => {
    expect(nights('2026-10-04', '2026-10-05')).toBe(1);
    expect(dateRange('2026-10-04', '2026-10-05')).toBe('Sun, Oct 4 – Mon, Oct 5');
  });
});
