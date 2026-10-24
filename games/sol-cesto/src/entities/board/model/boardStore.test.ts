import { beforeEach, describe, expect, it } from 'vitest';

import { CELL_COUNT, FIRST_LEVEL, isExitOpen, REQUIRED_MOVES, useBoardStore } from './boardStore';
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

  it('starts a level with no moves and a locked exit', () => {
    const state = useBoardStore.getState();

    expect(state.moves).toBe(0);
    expect(state.requiredMoves).toBe(REQUIRED_MOVES);
    expect(isExitOpen(state)).toBe(false);
  });

  it('starts the run on the first level', () => {
    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
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

  describe('moves and exit door', () => {
    const makeMoves = (count: number) => {
      Array.from({ length: count }, (_, move) => move % 4).forEach((row) =>
        useBoardStore.getState().enterRow(row, pickFirst),
      );
    };

    it('counts every move into a cell', () => {
      makeMoves(3);

      expect(useBoardStore.getState().moves).toBe(3);
      expect(isExitOpen(useBoardStore.getState())).toBe(false);
    });

    it('does not count a click on a row with no cells left', () => {
      getRowCells(0).forEach(() => useBoardStore.getState().enterRow(0));
      useBoardStore.getState().enterRow(0);

      expect(useBoardStore.getState().moves).toBe(4);
    });

    it('unlocks the exit once the required moves are made and stops counting', () => {
      makeMoves(REQUIRED_MOVES + 2);

      expect(useBoardStore.getState().moves).toBe(REQUIRED_MOVES);
      expect(isExitOpen(useBoardStore.getState())).toBe(true);
    });

    it('keeps the level while the exit is locked', () => {
      makeMoves(1);
      const before = useBoardStore.getState();

      useBoardStore.getState().exitLevel();

      expect(useBoardStore.getState()).toBe(before);
      expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
    });

    it('moves on to the next level after every exit', () => {
      makeMoves(REQUIRED_MOVES);
      useBoardStore.getState().exitLevel();
      makeMoves(REQUIRED_MOVES);
      useBoardStore.getState().exitLevel();

      expect(useBoardStore.getState().level).toBe(FIRST_LEVEL + 2);
    });

    it('moves on to the next level even while the exit is locked', () => {
      makeMoves(1);

      useBoardStore.getState().nextLevel();

      expect(useBoardStore.getState().level).toBe(FIRST_LEVEL + 1);
      expect(useBoardStore.getState().visited).toEqual([]);
    });

    it('goes back to the first level on reset', () => {
      useBoardStore.setState({ level: 7 });

      useBoardStore.getState().reset();

      expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
    });

    it('starts the level over after leaving through the open exit', () => {
      makeMoves(REQUIRED_MOVES);

      useBoardStore.getState().exitLevel();
      const { moves, playerIndex, visited } = useBoardStore.getState();

      expect(moves).toBe(0);
      expect(playerIndex).toBeNull();
      expect(visited).toEqual([]);
    });

    it('starts the level over on reset even while the exit is locked', () => {
      makeMoves(1);

      useBoardStore.getState().reset();
      const { moves, playerIndex, visited } = useBoardStore.getState();

      expect(moves).toBe(0);
      expect(playerIndex).toBeNull();
      expect(visited).toEqual([]);
    });
  });
});
