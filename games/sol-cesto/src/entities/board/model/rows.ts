import { BOARD_SIZE } from '../config';

/** Cell indices of a row, left to right. */
export function getRowCells(row: number): number[] {
  return Array.from({ length: BOARD_SIZE }, (_, col) => row * BOARD_SIZE + col);
}

/** Cells of a row the player has not been to yet. */
export function getAvailableCells(row: number, visited: readonly number[]): number[] {
  return getRowCells(row).filter((index) => !visited.includes(index));
}

/**
 * How likely the player is to land on a cell compared to the other free cells of its row. A cell
 * of weight 1.5 is half as likely again as a cell of weight 1. Without one all cells weigh 1.
 */
export type CellWeight = (index: number) => number;

export const EQUAL_WEIGHT: CellWeight = () => 1;

/** Free cells of the row with their weights, ready for `pickWeighted`. */
export function getWeightedCells(
  row: number,
  visited: readonly number[],
  weightOf: CellWeight = EQUAL_WEIGHT,
): { index: number; weight: number }[] {
  return getAvailableCells(row, visited).map((index) => ({ index, weight: weightOf(index) }));
}

/**
 * Chance (0..1) that choosing this cell's row puts the player on it: the cell's weight out of the
 * weights of the row's free cells. Visited cells can't be entered.
 */
export function getCellChance(
  index: number,
  visited: readonly number[],
  weightOf: CellWeight = EQUAL_WEIGHT,
): number {
  if (visited.includes(index)) return 0;
  const cells = getWeightedCells(Math.floor(index / BOARD_SIZE), visited, weightOf);
  const total = cells.reduce((sum, cell) => sum + cell.weight, 0);
  return weightOf(index) / total;
}
