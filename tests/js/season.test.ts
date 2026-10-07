import { describe, expect, it } from 'vitest';
import { inSeason } from '../../src/lib/outdoors';
import { spots } from '../../src/data/outdoors';

describe('inSeason', () => {
  it('handles ranges, year-round and seasons across the new year', () => {
    expect(inSeason({ from: 'May', to: 'Oct' }, 9)).toBe(true);
    expect(inSeason({ from: 'May', to: 'Oct' }, 10)).toBe(false);
    expect(inSeason({ from: 'Year-round', to: 'Year-round' }, 1)).toBe(true);
    expect(inSeason({ from: 'Nov', to: 'Mar' }, 0)).toBe(true);
    expect(inSeason({ from: 'Nov', to: 'Mar' }, 6)).toBe(false);
  });
  it('understands every spot’s season', () => {
    const odd = spots.filter((s) => inSeason(s.season, 0) === null).map((s) => `${s.id}: ${s.season.from}–${s.season.to}`);
    expect(odd).toEqual([]);
  });
});
