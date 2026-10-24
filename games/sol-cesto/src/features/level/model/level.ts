import {
  BOARD_SIZE,
  CELL_COUNT,
  FINAL_LEVEL,
  getRowCells,
  isExitOpen,
  useBoardStore,
} from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { useHeroStore } from '@/entities/hero';
import { usePickupStore } from '@/entities/pickup';

const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => getRowCells(row));
const CELLS = Array.from({ length: CELL_COUNT }, (_, cell) => cell);

/** Fills the current level with new enemies, then fills every cell left free with pickups. */
export function startLevel(random?: () => number) {
  useEnemyStore.getState().spawn(ROWS, random);
  const { enemies } = useEnemyStore.getState();
  usePickupStore.getState().spawn(
    CELLS.filter((cell) => !(cell in enemies)),
    random,
  );
}

/**
 * Leaves through the open exit door into a new level, or wins the run when it was the final one.
 * Does nothing while the door is locked.
 */
export function exitLevel(random?: () => number) {
  const board = useBoardStore.getState();
  if (!isExitOpen(board)) return;
  if (board.level >= FINAL_LEVEL) {
    useGameStore.getState().showScreen(GAME_SCREEN.victory);
    return;
  }
  useBoardStore.getState().exitLevel();
  startLevel(random);
}

/** Starts a new run from the very beginning: a fresh hero on a fresh level, back in the dungeon. */
export function restartGame(random?: () => number) {
  useHeroStore.getState().reset();
  useBoardStore.getState().reset();
  startLevel(random);
  useGameStore.getState().showScreen(GAME_SCREEN.dungeon);
}
