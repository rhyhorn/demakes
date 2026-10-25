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
    case ITEM_EFFECT.killChosenEnemy:
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

/** What the player picks on the board for an item that is aimed. */
export const ITEM_AIM = {
  /** A row with enemies, like for a whirlwind. */
  row: 'row',
  /** One enemy, like for an arrow. */
  enemy: 'enemy',
} as const;

export type ItemAim = (typeof ITEM_AIM)[keyof typeof ITEM_AIM];

/** What the item is aimed at on the board, or `null` if it is used at once. */
export const getItemAim = (item: InventoryItem): ItemAim | null => {
  switch (INVENTORY_ITEMS[item].effect?.kind) {
    case ITEM_EFFECT.killRowEnemies:
      return ITEM_AIM.row;
    case ITEM_EFFECT.killChosenEnemy:
      return ITEM_AIM.enemy;
    default:
      return null;
  }
};

/** Rows a row item can be aimed at: the ones with enemies, so it is never wasted on an empty row. */
export const getRowItemTargets = (enemies: EnemyMap) =>
  Array.from({ length: BOARD_SIZE }, (_, row) => row).filter((row) =>
    getRowCells(row).some((cell) => cell in enemies),
  );

/** Whether the board has anything to aim the item at: a row with enemies or an enemy. */
export const hasItemAimTargets = (aim: ItemAim, enemies: EnemyMap) =>
  aim === ITEM_AIM.row ? getRowItemTargets(enemies).length > 0 : Object.keys(enemies).length > 0;

/**
 * Uses the item in inventory slot `index` on `target`: the cell from `pickItemTarget`, or for an
 * aimed item what the player picked (`getItemAim`): the row for a whirlwind, the enemy's cell for an
 * arrow. Applies its effect and takes it out of the inventory. A spear without a target is simply
 * used up, and so is an arrow whose enemy is already gone. `random` picks the enemies a bomb kills.
 * Does nothing (and keeps the item) if the slot is empty, the item would do nothing now or an aimed
 * item has no target. Returns whether the item was used.
 */
export const applyItem = (index: number, target?: number, random: () => number = Math.random) => {
  const hero = useHeroStore.getState();
  const item = hero.inventory[index];
  if (item === undefined || !canUseItem(item, hero)) return false;

  if (getItemAim(item) !== null && target === undefined) return false;

  const { effect } = INVENTORY_ITEMS[item];
  if (effect?.kind === ITEM_EFFECT.killRowEnemies && target !== undefined) sweepRow(target);
  if (effect?.kind === ITEM_EFFECT.heal) hero.heal(effect.amount);
  const kills =
    effect?.kind === ITEM_EFFECT.killEnemy || effect?.kind === ITEM_EFFECT.killChosenEnemy;
  if (kills && target !== undefined) killEnemy(target);
  if (effect?.kind === ITEM_EFFECT.killEnemyPerRow) explodeBomb(random);
  hero.removeItem(index);
  return true;
};

/** Uses the item at once: `pickItemTarget`, then `applyItem`. */
export const consumeItem = (index: number, random: () => number = Math.random) =>
  applyItem(index, pickItemTarget(index, random), random);
