import { type InventoryItem, MAX_INVENTORY_SIZE } from '../config';

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

/**
 * All `MAX_INVENTORY_SIZE` slots in order: items first, then empty available slots,
 * then locked ones beyond `size`.
 */
export const getInventorySlots = (items: readonly InventoryItem[], size: number) =>
  Array.from({ length: MAX_INVENTORY_SIZE }, (_, index): InventorySlot => {
    if (index >= size) return { state: INVENTORY_SLOT.locked };
    const item = items[index];
    return item === undefined
      ? { state: INVENTORY_SLOT.empty }
      : { state: INVENTORY_SLOT.filled, item };
  });
