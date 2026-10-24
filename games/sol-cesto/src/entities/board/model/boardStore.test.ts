import { beforeEach, describe, expect, it } from 'vitest';

import { CELL_COUNT, createInitialCells, useBoardStore } from './boardStore';

describe('useBoardStore', () => {
  beforeEach(() => {
    useBoardStore.setState({ cells: createInitialCells() });
  });

  it('starts with a full board of numbered cells', () => {
    const { cells } = useBoardStore.getState();

    expect(CELL_COUNT).toBe(16);
    expect(cells).toEqual(Array.from({ length: 16 }, (_, index) => index + 1));
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
});
