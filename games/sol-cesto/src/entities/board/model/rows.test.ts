import { describe, expect, it } from 'vitest';

import { getCellChance } from './rows';

describe('getCellChance', () => {
  it('splits the chance evenly across a fresh row', () => {
    expect(getCellChance(0, [])).toBe(0.25);
    expect(getCellChance(15, [])).toBe(0.25);
  });

  it('gives visited cells no chance and shares it among the rest of the row', () => {
    const visited = [4, 6];

    expect(getCellChance(4, visited)).toBe(0);
    expect(getCellChance(6, visited)).toBe(0);
    expect(getCellChance(5, visited)).toBe(0.5);
    expect(getCellChance(7, visited)).toBe(0.5);
  });

  it('ignores visited cells of other rows', () => {
    expect(getCellChance(8, [0, 1, 2])).toBe(0.25);
  });

  it('gives the last free cell of a row a certain chance', () => {
    expect(getCellChance(3, [0, 1, 2])).toBe(1);
  });
});
