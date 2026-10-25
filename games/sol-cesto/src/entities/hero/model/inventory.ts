import { type InventoryItem, MAX_INVENTORY_SIZE } from '../config';

/**
 * Carried items by slot: `null` is an empty slot. Used items leave their slot empty, so the others
 * keep their places. Slots past the end of the array are empty too.
 */
export type InventoryContents = readonly (InventoryItem | null)[];

/** What an inventory slot shows. */
export const INVENTORY_SLOT = {
  /** Beyond the hero's inventory size: no hand holds it. */
  locked: 'locked',
  /** Available, but holds nothing. */
  empty: 'empty',
  /** Available and holds an item. */
  filled: 'filled',
} as const;

export type InventorySlotState = (typeof INVENTORY_SLOT)[keyof typeof INVENTORY_SLOT];

export type InventorySlot =
  | { state: typeof INVENTORY_SLOT.locked | typeof INVENTORY_SLOT.empty }
  | { state: typeof INVENTORY_SLOT.filled; item: InventoryItem };

/** Item in the slot, or `null` if the slot is empty or out of range. */
export const getInventoryItem = (inventory: InventoryContents, slot: number) =>
  inventory[slot] ?? null;

/** How many items are carried. */
export const countInventoryItems = (inventory: InventoryContents) =>
  inventory.filter((item) => item !== null).length;

/** The first empty slot among the `size` available ones, or `undefined` if they are all taken. */
export const findFreeInventorySlot = (inventory: InventoryContents, size: number) =>
  Array.from({ length: size }, (_, index) => index).find(
    (index) => getInventoryItem(inventory, index) === null,
  );

/**
 * All `MAX_INVENTORY_SIZE` slots in order: the available ones (`size`), filled or empty where
 * the items are, then locked ones.
 */
export const getInventorySlots = (items: InventoryContents, size: number) =>
  Array.from({ length: MAX_INVENTORY_SIZE }, (_, index): InventorySlot => {
    if (index >= size) return { state: INVENTORY_SLOT.locked };
    const item = getInventoryItem(items, index);
    return item === null ? { state: INVENTORY_SLOT.empty } : { state: INVENTORY_SLOT.filled, item };
  });
