import { describe, expect, it } from 'vitest';

import { describeMovesLeft } from './door';

describe('describeMovesLeft', () => {
  it.each([
    [1, 'хід'],
    [2, 'ходи'],
    [4, 'ходи'],
    [5, 'ходів'],
    [11, 'ходів'],
    [21, 'хід'],
  ])('counts %i moves as «%s»', (movesLeft, word) => {
    expect(describeMovesLeft(movesLeft)).toBe(`Зроби ще ${movesLeft} ${word}`);
  });
});
