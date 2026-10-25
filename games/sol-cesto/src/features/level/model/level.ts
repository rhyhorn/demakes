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
import { usePickupStore } from '@/entities/pickup';
import { useToothStore } from '@/entities/tooth';
import { useTrapStore } from '@/entities/trap';

import { SHOP_ROOM_LEVELS, TOOTH_ROOM_EVERY, UPGRADE_ROOM_EVERY } from '../config';
import { spawnDangers } from './spawnDangers';

const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => getRowCells(row));
const CELLS = Array.from({ length: CELL_COUNT }, (_, cell) => cell);

/**
 * Fills the current level with new enemies and spikes, then fills every cell left free with
 * pickups.
 */
export function startLevel(random?: () => number) {
  const { enemies, traps } = spawnDangers(ROWS, random);
  useEnemyStore.getState().setEnemies(enemies);
  useTrapStore.getState().setTraps(traps);
  usePickupStore.getState().spawn(
    CELLS.filter((cell) => !(cell in enemies) && !(cell in traps)),
    random,
  );
}

/**
 * Room of a level: the `SHOP_ROOM_LEVELS` are shops, every `TOOTH_ROOM_EVERY`-th one is a tooth
 * room, every other `UPGRADE_ROOM_EVERY`-th one an upgrade room, the rest have enemies.
 */
export function getRoomScreen(level: number): GameScreen {
  if (SHOP_ROOM_LEVELS.includes(level)) return GAME_SCREEN.shop;
  if (level % TOOTH_ROOM_EVERY === 0) return GAME_SCREEN.tooth;
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
 * Starts a new run from the very beginning: the starting teeth on a fresh level, and back to
 * picking the hero, who then goes into the dungeon.
 */
export function restartGame(random?: () => number) {
  useHeroStore.getState().reset();
  useToothStore.getState().reset(random);
  useBoardStore.getState().reset();
  startLevel(random);
  useGameStore.getState().showScreen(GAME_SCREEN.heroSelect);
}
