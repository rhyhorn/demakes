import { create } from 'zustand';

import { pickWeighted } from '@/shared/lib';

import { BOARD_SIZE } from '../config';
import { type CellWeight, EQUAL_WEIGHT, getWeightedCells } from './rows';

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
  /**
   * Moves the player to a random not yet visited cell of the row, picked by `weightOf` (all cells
   * equally likely without it). Does nothing if there is none.
   */
  enterRow: (row: number, random?: () => number, weightOf?: CellWeight) => void;
  /** Moves the player to the cell. Does nothing if she has already been there. */
  enterCell: (index: number) => void;
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

/** Cell of the row `enterRow` would move the player to, or undefined if the row has no cells left. */
export function pickRowCell(
  row: number,
  visited: readonly number[],
  random: () => number = Math.random,
  weightOf: CellWeight = EQUAL_WEIGHT,
): number | undefined {
  return pickWeighted(getWeightedCells(row, visited, weightOf), random)?.index;
}

export const useBoardStore = create<BoardState>()((set, get) => ({
  ...createLevelState(),
  level: FIRST_LEVEL,
  setCell: (index, value) =>
    set((state) => ({
      cells: state.cells.map((cell, cellIndex) => (cellIndex === index ? value : cell)),
    })),
  enterRow: (row, random, weightOf) => {
    const index = pickRowCell(row, get().visited, random, weightOf);
    if (index !== undefined) get().enterCell(index);
  },
  enterCell: (index) =>
    set((state) => {
      if (state.visited.includes(index)) return state;
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
