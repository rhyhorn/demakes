import { describe, expect, it } from 'vitest';

import { INVENTORY_ITEM, MAX_INVENTORY_SIZE } from '../config';
import {
  countInventoryItems,
  findFreeInventorySlot,
  getInventorySlots,
  INVENTORY_SLOT,
} from './inventory';

describe('getInventorySlots', () => {
  it('always returns every slot the hero could have', () => {
    expect(getInventorySlots([], 0)).toHaveLength(MAX_INVENTORY_SIZE);
    expect(getInventorySlots([], MAX_INVENTORY_SIZE)).toHaveLength(MAX_INVENTORY_SIZE);
  });

  it('puts items first, then free slots, then locked ones', () => {
    const slots = getInventorySlots([INVENTORY_ITEM.potion, INVENTORY_ITEM.spear], 3);

    expect(slots).toEqual([
      { state: INVENTORY_SLOT.filled, item: INVENTORY_ITEM.potion },
      { state: INVENTORY_SLOT.filled, item: INVENTORY_ITEM.spear },
      { state: INVENTORY_SLOT.empty },
      { state: INVENTORY_SLOT.locked },
      { state: INVENTORY_SLOT.locked },
      { state: INVENTORY_SLOT.locked },
    ]);
  });

  it('keeps empty slots between items in place', () => {
    const slots = getInventorySlots([null, INVENTORY_ITEM.spear], 3);

    expect(slots.slice(0, 3)).toEqual([
      { state: INVENTORY_SLOT.empty },
      { state: INVENTORY_SLOT.filled, item: INVENTORY_ITEM.spear },
      { state: INVENTORY_SLOT.empty },
    ]);
  });

  it('locks every slot when the hero has no inventory', () => {
    expect(getInventorySlots([], 0).every((slot) => slot.state === INVENTORY_SLOT.locked)).toBe(
      true,
    );
  });
});

describe('findFreeInventorySlot', () => {
  it('finds the first empty slot, including past the carried ones', () => {
    expect(findFreeInventorySlot([INVENTORY_ITEM.potion, null, INVENTORY_ITEM.spear], 4)).toBe(1);
    expect(findFreeInventorySlot([INVENTORY_ITEM.potion], 4)).toBe(1);
  });

  it('finds nothing when every available slot is taken', () => {
    expect(findFreeInventorySlot([INVENTORY_ITEM.potion, INVENTORY_ITEM.spear], 2)).toBeUndefined();
    expect(findFreeInventorySlot([], 0)).toBeUndefined();
  });
});

describe('countInventoryItems', () => {
  it('counts only filled slots', () => {
    expect(countInventoryItems([null, INVENTORY_ITEM.spear, null, INVENTORY_ITEM.potion])).toBe(2);
  });
});
