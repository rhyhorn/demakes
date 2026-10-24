import { BOARD_SIZE } from '../config';

/** Cell indices of a row, left to right. */
export function getRowCells(row: number): number[] {
  return Array.from({ length: BOARD_SIZE }, (_, col) => row * BOARD_SIZE + col);
}

/** Cells of a row the player has not been to yet. */
export function getAvailableCells(row: number, visited: readonly number[]): number[] {
  return getRowCells(row).filter((index) => !visited.includes(index));
}

/** `random` returns a number in [0, 1), like Math.random. */
export function pickRandom<T>(items: readonly T[], random: () => number): T | undefined {
  return items[Math.floor(random() * items.length)];
}

/**
 * Chance (0..1) that choosing this cell's row puts the player on it: the row's free cells are
 * equally likely, visited cells can't be entered.
 */
export function getCellChance(index: number, visited: readonly number[]): number {
  if (visited.includes(index)) return 0;
  return 1 / getAvailableCells(Math.floor(index / BOARD_SIZE), visited).length;
}
