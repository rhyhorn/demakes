import { describe, expect, it } from 'vitest';

import { INVENTORY_ITEM, MAX_INVENTORY_SIZE } from '../config';
import { getInventorySlots, INVENTORY_SLOT } from './inventory';

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

  it('locks every slot when the hero has no inventory', () => {
    expect(getInventorySlots([], 0).every((slot) => slot.state === INVENTORY_SLOT.locked)).toBe(
      true,
    );
  });
});
