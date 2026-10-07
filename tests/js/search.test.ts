import { describe, expect, it } from 'vitest';
import { norm, search } from '../../src/lib/search';
import { buildIndex } from '../../src/lib/search-index';

const index = buildIndex();

describe('search', () => {
  it('indexes every place, resort and spot once', () => {
    expect(new Set(index.map((d) => d.u)).size).toBe(index.length);
    expect(index.length).toBeGreaterThan(350);
  });
  it('normalizes accents and punctuation', () => {
    expect(norm('Mont-Sainte-Anne, Québec')).toBe('mont sainte anne quebec');
  });
  it('ranks name matches first and requires every word', () => {
    expect(search(index, 'okemo')[0].n).toMatch(/Okemo/);
    expect(search(index, 'watkins glen')[0].u).toBe('places/watkins-glen/');
    expect(search(index, 'tremblant ski').every((d) => d.t === 'Ski resort')).toBe(true);
    expect(search(index, 'zzzz no such place')).toEqual([]);
    expect(search(index, '   ')).toEqual([]);
  });
});
