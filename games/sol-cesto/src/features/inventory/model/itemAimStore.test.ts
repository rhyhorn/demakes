import { beforeEach, describe, expect, it } from 'vitest';

import { useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';
import { INVENTORY_ITEM, useHeroStore } from '@/entities/hero';

import { applyAimedItem, cancelItemAim, toggleItemAim, useItemAimStore } from './itemAimStore';

describe('itemAimStore', () => {
  beforeEach(() => {
    useItemAimStore.setState(useItemAimStore.getInitialState());
    useHeroStore.setState(useHeroStore.getInitialState());
    useEnemyStore.setState({ enemies: {} });
    useBoardStore.setState(useBoardStore.getInitialState());
  });

  it('starts and stops aiming the item in a slot', () => {
    toggleItemAim(2);
    expect(useItemAimStore.getState().aimingSlot).toBe(2);

    toggleItemAim(2);
    expect(useItemAimStore.getState().aimingSlot).toBeNull();

    toggleItemAim(1);
    cancelItemAim();
    expect(useItemAimStore.getState().aimingSlot).toBeNull();
  });

  it('uses the aimed item on the row and stops aiming', () => {
    const beast = createEnemy('beast');
    useEnemyStore.setState({ enemies: { 0: beast, 5: beast } });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.whirlwind] });
    toggleItemAim(0);

    expect(applyAimedItem(0)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({ 5: beast });
    expect(useHeroStore.getState().inventory).toEqual([]);
    expect(useItemAimStore.getState().aimingSlot).toBeNull();
  });

  it('does nothing without an aimed item', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.whirlwind] });

    expect(applyAimedItem(0)).toBe(false);

    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.whirlwind]);
  });
});
