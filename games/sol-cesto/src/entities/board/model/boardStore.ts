import { create } from 'zustand';

import { BOARD_SIZE } from '../config';
import { getAvailableCells, pickRandom } from './rows';

export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

/** Moves the player has to make on a level before the exit door unlocks. */
export const REQUIRED_MOVES = 5;

/** Number of the level a run starts on. */
export const FIRST_LEVEL = 1;

/** Number of the last level: leaving it through the exit wins the run. */
export const FINAL_LEVEL = 10;

/** Placeholder content until rooms get real types: every cell is just a number. */
export function createInitialCells(): number[] {
  return Array.from({ length: CELL_COUNT }, (_, index) => index + 1);
}

interface BoardState {
  /** Row-major: index = row * BOARD_SIZE + col. */
  cells: number[];
  /** Cell the player stands on; null until the first row is chosen. */
  playerIndex: number | null;
  /** Cells the player has been to, including the current one. They can't be entered again. */
  visited: number[];
  /** Moves made on this level, up to `requiredMoves`. */
  moves: number;
  /** Moves needed to unlock the exit door on this level. */
  requiredMoves: number;
  /** Number of the current level: grows by one every time the player leaves through the exit. */
  level: number;
  setCell: (index: number, value: number) => void;
  /** Moves the player to a random not yet visited cell of the row. Does nothing if there is none. */
  enterRow: (row: number, random?: () => number) => void;
  /** Leaves through the unlocked door into the next level. Does nothing while it's locked. */
  exitLevel: () => void;
  /** Moves on to the next level whatever the state of the door, e.g. out of a room without moves. */
  nextLevel: () => void;
  /** Starts the run over from the first level, even while the exit is locked. */
  reset: () => void;
}

/** The exit door opens once the player has made all the moves the level requires. */
export function isExitOpen({ moves, requiredMoves }: Pick<BoardState, 'moves' | 'requiredMoves'>) {
  return moves >= requiredMoves;
}

type LevelState = Pick<BoardState, 'cells' | 'playerIndex' | 'visited' | 'moves' | 'requiredMoves'>;

const createLevelState = (): LevelState => ({
  cells: createInitialCells(),
  playerIndex: null,
  visited: [],
  moves: 0,
  requiredMoves: REQUIRED_MOVES,
});

export const useBoardStore = create<BoardState>()((set) => ({
  ...createLevelState(),
  level: FIRST_LEVEL,
  setCell: (index, value) =>
    set((state) => ({
      cells: state.cells.map((cell, cellIndex) => (cellIndex === index ? value : cell)),
    })),
  enterRow: (row, random = Math.random) =>
    set((state) => {
      const index = pickRandom(getAvailableCells(row, state.visited), random);
      if (index === undefined) return state;
      return {
        playerIndex: index,
        visited: [...state.visited, index],
        moves: Math.min(state.moves + 1, state.requiredMoves),
      };
    }),
  exitLevel: () =>
    set((state) => (isExitOpen(state) ? { ...createLevelState(), level: state.level + 1 } : state)),
  nextLevel: () => set((state) => ({ ...createLevelState(), level: state.level + 1 })),
  reset: () => set({ ...createLevelState(), level: FIRST_LEVEL }),
}));
