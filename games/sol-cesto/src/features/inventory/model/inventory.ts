import { BOARD_SIZE, getRowCells, useBoardStore } from '@/entities/board';
import { type EnemyMap, useEnemyStore } from '@/entities/enemy';
import { INVENTORY_ITEMS, ITEM_EFFECT, type InventoryItem, useHeroStore } from '@/entities/hero';
import { pickCells } from '@/shared/lib';

/** Whether using the item would do anything for the hero right now. */
export const canUseItem = (item: InventoryItem, hero: { health: number; maxHealth: number }) => {
  const { effect } = INVENTORY_ITEMS[item];
  if (effect === null) return false;

  switch (effect.kind) {
    case ITEM_EFFECT.heal:
      return hero.health < hero.maxHealth;
    case ITEM_EFFECT.killEnemy:
    case ITEM_EFFECT.killEnemyPerRow:
    case ITEM_EFFECT.killRowEnemies:
      return true;
    default: {
      const unknown: never = effect;
      return unknown;
    }
  }
};

/**
 * Cell the item in inventory slot `index` is going to hit: a random enemy for a spear. Undefined
 * for items that hit nothing on the board, or when there is nothing to hit. Nothing changes yet:
 * the inventory shows the item flying there first and then calls `applyItem`.
 */
export const pickItemTarget = (
  index: number,
  random: () => number = Math.random,
): number | undefined => {
  const item = useHeroStore.getState().inventory[index];
  if (item === undefined || INVENTORY_ITEMS[item].effect?.kind !== ITEM_EFFECT.killEnemy) {
    return undefined;
  }
  const { enemies } = useEnemyStore.getState();
  return pickCells(Object.keys(enemies).map(Number), 1, random)[0];
};

/**
 * Takes the enemy off the cell, if it is still there, and closes the cell as if visited. A kill
 * counts as a move towards opening the exit door, so every item that kills enemies goes through it.
 */
const killEnemy = (cell: number) => {
  const { enemies, removeEnemy } = useEnemyStore.getState();
  if (!(cell in enemies)) return;
  removeEnemy(cell);
  const board = useBoardStore.getState();
  board.markVisited(cell);
  board.countMove();
};

/**
 * A bomb: kills a random enemy in every row that has one, closing their cells as if visited. Using
 * it counts as one move towards opening the exit door, however many enemies it kills.
 */
const explodeBomb = (random: () => number) => {
  const { enemies, removeEnemy } = useEnemyStore.getState();
  const board = useBoardStore.getState();
  Array.from({ length: BOARD_SIZE }, (_, row) => {
    const rowEnemies = getRowCells(row).filter((cell) => cell in enemies);
    return pickCells(rowEnemies, 1, random)[0];
  }).forEach((cell) => {
    if (cell === undefined) return;
    removeEnemy(cell);
    board.markVisited(cell);
  });
  board.countMove();
};

/**
 * A whirlwind: kills every enemy in the row, closing their cells as if visited. Using it counts as
 * one move towards opening the exit door, however many enemies it kills.
 */
const sweepRow = (row: number) => {
  const { enemies, removeEnemy } = useEnemyStore.getState();
  const board = useBoardStore.getState();
  getRowCells(row)
    .filter((cell) => cell in enemies)
    .forEach((cell) => {
      removeEnemy(cell);
      board.markVisited(cell);
    });
  board.countMove();
};

/** Whether the item is aimed at a row the player picks on the board, like a whirlwind. */
export const isRowItem = (item: InventoryItem) =>
  INVENTORY_ITEMS[item].effect?.kind === ITEM_EFFECT.killRowEnemies;

/** Rows a row item can be aimed at: the ones with enemies, so it is never wasted on an empty row. */
export const getRowItemTargets = (enemies: EnemyMap) =>
  Array.from({ length: BOARD_SIZE }, (_, row) => row).filter((row) =>
    getRowCells(row).some((cell) => cell in enemies),
  );

/**
 * Uses the item in inventory slot `index` on `target`: the cell from `pickItemTarget`, or for a
 * row item the row the player picked. Applies its effect and takes it out of the inventory. A spear
 * without a target is simply used up. `random` picks the enemies a bomb kills. Does nothing (and
 * keeps the item) if the slot is empty, the item would do nothing now or a row item has no row.
 * Returns whether the item was used.
 */
export const applyItem = (index: number, target?: number, random: () => number = Math.random) => {
  const hero = useHeroStore.getState();
  const item = hero.inventory[index];
  if (item === undefined || !canUseItem(item, hero)) return false;

  const { effect } = INVENTORY_ITEMS[item];
  if (effect?.kind === ITEM_EFFECT.killRowEnemies) {
    if (target === undefined) return false;
    sweepRow(target);
  }
  if (effect?.kind === ITEM_EFFECT.heal) hero.heal(effect.amount);
  if (effect?.kind === ITEM_EFFECT.killEnemy && target !== undefined) killEnemy(target);
  if (effect?.kind === ITEM_EFFECT.killEnemyPerRow) explodeBomb(random);
  hero.removeItem(index);
  return true;
};

/** Uses the item at once: `pickItemTarget`, then `applyItem`. */
export const consumeItem = (index: number, random: () => number = Math.random) =>
  applyItem(index, pickItemTarget(index, random), random);
