import { BOARD_SIZE, getRowCells, isExitOpen, useBoardStore } from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';

const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => getRowCells(row));

/** Fills the current level with new enemies. */
export function startLevel(random?: () => number) {
  useEnemyStore.getState().spawn(ROWS, random);
}

/** Leaves through the open exit door into a new level. Does nothing while the door is locked. */
export function exitLevel(random?: () => number) {
  if (!isExitOpen(useBoardStore.getState())) return;
  useBoardStore.getState().exitLevel();
  startLevel(random);
}
