import {
  BOARD_SIZE,
  CELL_COUNT,
  FINAL_LEVEL,
  getRowCells,
  isExitOpen,
  useBoardStore,
} from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, type GameScreen, useGameStore } from '@/entities/game';
import { useHeroStore } from '@/entities/hero';
import { useModifierStore } from '@/entities/modifier';
import { usePickupStore } from '@/entities/pickup';

import { UPGRADE_ROOM_EVERY } from '../config';

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

/** Room of a level: every `UPGRADE_ROOM_EVERY`-th one is an upgrade room, the rest have enemies. */
export function getRoomScreen(level: number): GameScreen {
  return level % UPGRADE_ROOM_EVERY === 0 ? GAME_SCREEN.upgrade : GAME_SCREEN.dungeon;
}

/**
 * Moves on to the room of the next level, filling it with enemies when it is a dungeon, or wins the
 * run when the hero has left the final level.
 */
export function enterNextRoom(random?: () => number) {
  if (useBoardStore.getState().level >= FINAL_LEVEL) {
    useGameStore.getState().showScreen(GAME_SCREEN.victory);
    return;
  }
  useBoardStore.getState().nextLevel();
  const screen = getRoomScreen(useBoardStore.getState().level);
  if (screen === GAME_SCREEN.dungeon) startLevel(random);
  useGameStore.getState().showScreen(screen);
}

/** Leaves the dungeon through the open exit door into the next room. Does nothing while it's locked. */
export function exitLevel(random?: () => number) {
  if (!isExitOpen(useBoardStore.getState())) return;
  enterNextRoom(random);
}

/**
 * Starts a new run from the very beginning: a fresh hero with the starting modifiers on a fresh
 * level, back in the dungeon.
 */
export function restartGame(random?: () => number) {
  useHeroStore.getState().reset();
  useModifierStore.getState().reset();
  useBoardStore.getState().reset();
  startLevel(random);
  useGameStore.getState().showScreen(GAME_SCREEN.dungeon);
}
