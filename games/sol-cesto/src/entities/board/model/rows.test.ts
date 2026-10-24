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

describe('getCellChance with weights', () => {
  /** Cell 0 is half as likely again as the rest. */
  const weightOf = (index: number) => (index === 0 ? 1.5 : 1);

  it('shares the chance by weight across the free cells of the row', () => {
    expect(getCellChance(0, [], weightOf)).toBeCloseTo(1.5 / 4.5);
    expect(getCellChance(1, [], weightOf)).toBeCloseTo(1 / 4.5);
  });

  it('adds up to a certain chance over the row', () => {
    const visited = [2];
    const total = [0, 1, 3].reduce(
      (sum, index) => sum + getCellChance(index, visited, weightOf),
      0,
    );

    expect(total).toBeCloseTo(1);
  });

  it('gives visited cells no chance whatever their weight', () => {
    expect(getCellChance(0, [0], weightOf)).toBe(0);
  });

  it('gives a cell of weight 0 no chance while the row has others', () => {
    const noFirst = (index: number) => (index === 0 ? 0 : 1);

    expect(getCellChance(0, [], noFirst)).toBe(0);
    expect(getCellChance(1, [], noFirst)).toBeCloseTo(1 / 3);
  });

  it('makes free cells equally likely when none of them weighs anything', () => {
    expect(getCellChance(3, [0, 1], () => 0)).toBe(0.5);
  });
});
