import { useBoardStore } from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';
import {
  INVENTORY_ITEMS,
  ITEM_EFFECT,
  type InventoryItem,
  type ItemEffect,
  useHeroStore,
} from '@/entities/hero';
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

/** Takes a random enemy off the board, if there is any, and closes its cell as if visited. */
const killRandomEnemy = (random: () => number) => {
  const { enemies, removeEnemy } = useEnemyStore.getState();
  const [cell] = pickCells(Object.keys(enemies).map(Number), 1, random);
  if (cell === undefined) return;
  removeEnemy(cell);
  useBoardStore.getState().markVisited(cell);
};

const applyEffect = (effect: ItemEffect, random: () => number) => {
  switch (effect.kind) {
    case ITEM_EFFECT.heal:
      useHeroStore.getState().heal(effect.amount);
      break;
    case ITEM_EFFECT.killEnemy:
      killRandomEnemy(random);
      break;
    default: {
      const unknown: never = effect;
      throw new Error(`Unknown item effect: ${String(unknown)}`);
    }
  }
};

/**
 * Uses the item in inventory slot `index`: applies its effect and takes it out of the inventory.
 * Does nothing (and keeps the item) if the slot is empty or the item would do nothing now.
 * Returns whether the item was used.
 */
export const consumeItem = (index: number, random: () => number = Math.random) => {
  const hero = useHeroStore.getState();
  const item = hero.inventory[index];
  if (item === undefined || !canUseItem(item, hero)) return false;

  const { effect } = INVENTORY_ITEMS[item];
  if (effect !== null) applyEffect(effect, random);
  hero.removeItem(index);
  return true;
};
