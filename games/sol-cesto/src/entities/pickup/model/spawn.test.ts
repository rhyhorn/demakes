import { describe, expect, it } from 'vitest';

import { spawnPickups } from './spawn';
import { PICKUP_TYPE } from './types';

const CELLS = [1, 2, 3, 5, 6];

describe('spawnPickups', () => {
  it('fills every given cell', () => {
    expect(Object.keys(spawnPickups(CELLS)).map(Number)).toEqual(CELLS);
  });

  it('fills cells with strawberries', () => {
    expect(spawnPickups([1, 2], () => 0)).toEqual({
      1: PICKUP_TYPE.strawberry,
      2: PICKUP_TYPE.strawberry,
    });
  });

  it('fills cells with chests too', () => {
    expect(spawnPickups([1], () => 0.999)).toEqual({ 1: PICKUP_TYPE.chest });
  });

  it('puts nothing when there are no free cells', () => {
    expect(spawnPickups([])).toEqual({});
  });
});
