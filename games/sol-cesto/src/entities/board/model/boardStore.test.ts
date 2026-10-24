import { beforeEach, describe, expect, it } from 'vitest';

import { CELL_COUNT, useBoardStore } from './boardStore';
import { getRowCells } from './rows';

/** Always picks the first available cell. */
const pickFirst = () => 0;
/** Always picks the last available cell. */
const pickLast = () => 0.999;

describe('useBoardStore', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
  });

  it('starts with a full board of numbered cells and no player', () => {
    const { cells, playerIndex, visited } = useBoardStore.getState();

    expect(CELL_COUNT).toBe(16);
    expect(cells).toEqual(Array.from({ length: 16 }, (_, index) => index + 1));
    expect(playerIndex).toBeNull();
    expect(visited).toEqual([]);
  });

  it('sets the value of a single cell', () => {
    const before = useBoardStore.getState().cells;

    useBoardStore.getState().setCell(5, 42);
    const after = useBoardStore.getState().cells;

    expect(after[5]).toBe(42);
    expect(after.filter((_, index) => index !== 5)).toEqual(
      before.filter((_, index) => index !== 5),
    );
    expect(after).not.toBe(before);
  });

  describe('enterRow', () => {
    it('places the player on a random cell of the chosen row', () => {
      useBoardStore.getState().enterRow(2, pickLast);

      expect(useBoardStore.getState().playerIndex).toBe(11);
      expect(useBoardStore.getState().visited).toEqual([11]);
    });

    it('never enters a visited cell again', () => {
      const { enterRow } = useBoardStore.getState();

      enterRow(1, pickFirst);
      enterRow(0, pickFirst);
      enterRow(1, pickFirst);

      expect(useBoardStore.getState().visited).toEqual([4, 0, 5]);
      expect(useBoardStore.getState().playerIndex).toBe(5);
    });

    it('fills a row with every pick using the default random', () => {
      const { enterRow } = useBoardStore.getState();

      getRowCells(3).forEach(() => enterRow(3));

      expect([...useBoardStore.getState().visited].sort((a, b) => a - b)).toEqual(getRowCells(3));
    });

    it('does nothing when the row has no cells left', () => {
      const { enterRow } = useBoardStore.getState();
      getRowCells(0).forEach(() => enterRow(0));
      const before = useBoardStore.getState();

      enterRow(0);

      expect(useBoardStore.getState()).toBe(before);
    });
  });
});
