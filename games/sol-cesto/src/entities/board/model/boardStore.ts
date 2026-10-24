import { create } from 'zustand';

import { BOARD_SIZE } from '../config';

export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

/** Placeholder content until rooms get real types: every cell is just a number. */
export function createInitialCells(): number[] {
  return Array.from({ length: CELL_COUNT }, (_, index) => index + 1);
}

interface BoardState {
  /** Row-major: index = row * BOARD_SIZE + col. */
  cells: number[];
  setCell: (index: number, value: number) => void;
}

export const useBoardStore = create<BoardState>()((set) => ({
  cells: createInitialCells(),
  setCell: (index, value) =>
    set((state) => ({
      cells: state.cells.map((cell, cellIndex) => (cellIndex === index ? value : cell)),
    })),
}));
