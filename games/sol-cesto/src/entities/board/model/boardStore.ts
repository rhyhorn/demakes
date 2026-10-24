import { create } from 'zustand';

import { BOARD_SIZE } from '../config';
import { getAvailableCells, pickRandom } from './rows';

export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

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
  setCell: (index: number, value: number) => void;
  /** Moves the player to a random not yet visited cell of the row. Does nothing if there is none. */
  enterRow: (row: number, random?: () => number) => void;
}

export const useBoardStore = create<BoardState>()((set) => ({
  cells: createInitialCells(),
  playerIndex: null,
  visited: [],
  setCell: (index, value) =>
    set((state) => ({
      cells: state.cells.map((cell, cellIndex) => (cellIndex === index ? value : cell)),
    })),
  enterRow: (row, random = Math.random) =>
    set((state) => {
      const index = pickRandom(getAvailableCells(row, state.visited), random);
      if (index === undefined) return state;
      return { playerIndex: index, visited: [...state.visited, index] };
    }),
}));
