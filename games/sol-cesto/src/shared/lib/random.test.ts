import { describe, expect, it } from 'vitest';

import { pickCells, pickCount, pickWeighted } from './random';

describe('pickWeighted', () => {
  const entries = [
    { id: 'a', weight: 1 },
    { id: 'b', weight: 3 },
  ];

  it('picks entries in proportion to their weight', () => {
    expect(pickWeighted(entries, () => 0)?.id).toBe('a');
    expect(pickWeighted(entries, () => 0.24)?.id).toBe('a');
    expect(pickWeighted(entries, () => 0.25)?.id).toBe('b');
    expect(pickWeighted(entries, () => 0.999)?.id).toBe('b');
  });

  it('returns nothing for an empty list', () => {
    expect(pickWeighted([], () => 0)).toBeUndefined();
  });
});

describe('pickCells', () => {
  it('never picks more cells than there are', () => {
    expect(pickCells([0, 1], 9, () => 0)).toEqual([0, 1]);
  });
});

describe('pickCount', () => {
  it('stays within the limits', () => {
    expect(pickCount({ min: 1, max: 2 }, () => 0)).toBe(1);
    expect(pickCount({ min: 1, max: 2 }, () => 0.999)).toBe(2);
  });
});
