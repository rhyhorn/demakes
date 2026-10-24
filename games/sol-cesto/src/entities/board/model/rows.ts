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

/**
 * Free cells of the row with their weights, ready for `pickWeighted`. Negative weights count as 0,
 * and if no free cell weighs anything, they are all equally likely so the row can still be entered.
 */
export function getWeightedCells(
  row: number,
  visited: readonly number[],
  weightOf: CellWeight = EQUAL_WEIGHT,
): { index: number; weight: number }[] {
  const cells = getAvailableCells(row, visited).map((index) => ({
    index,
    weight: Math.max(0, weightOf(index)),
  }));
  if (cells.some(({ weight }) => weight > 0)) return cells;
  return cells.map(({ index }) => ({ index, weight: 1 }));
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
  const cells = getWeightedCells(Math.floor(index / BOARD_SIZE), visited, weightOf);
  const cell = cells.find((entry) => entry.index === index);
  if (!cell) return 0;
  return cell.weight / cells.reduce((sum, entry) => sum + entry.weight, 0);
}
