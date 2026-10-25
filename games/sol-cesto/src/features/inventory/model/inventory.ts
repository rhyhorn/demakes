import { useBoardStore } from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';
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
 * Uses the item in inventory slot `index` on `target` (from `pickItemTarget`): applies its effect
 * and takes it out of the inventory. A spear without a target is simply used up. Does nothing (and
 * keeps the item) if the slot is empty or the item would do nothing now. Returns whether the item
 * was used.
 */
export const applyItem = (index: number, target?: number) => {
  const hero = useHeroStore.getState();
  const item = hero.inventory[index];
  if (item === undefined || !canUseItem(item, hero)) return false;

  const { effect } = INVENTORY_ITEMS[item];
  if (effect?.kind === ITEM_EFFECT.heal) hero.heal(effect.amount);
  if (effect?.kind === ITEM_EFFECT.killEnemy && target !== undefined) killEnemy(target);
  hero.removeItem(index);
  return true;
};

/** Uses the item at once: `pickItemTarget`, then `applyItem`. */
export const consumeItem = (index: number, random: () => number = Math.random) =>
  applyItem(index, pickItemTarget(index, random));
