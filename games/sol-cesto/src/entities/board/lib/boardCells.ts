/**
 * Cells of the board on the screen. Things that fly to a cell from outside the board (an item the
 * hero throws at an enemy) need to know where it is.
 */
const cells = new Map<number, HTMLElement>();

/** Remembers the element of the cell, or forgets it when `element` is null. */
export function registerBoardCell(index: number, element: HTMLElement | null) {
  if (element) cells.set(index, element);
  else cells.delete(index);
}

/** Where the cell is on the screen, or null while the board isn't shown. */
export function getBoardCellRect(index: number): DOMRect | null {
  return cells.get(index)?.getBoundingClientRect() ?? null;
}
