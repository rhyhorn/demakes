import { beforeEach, describe, expect, it } from 'vitest';

import { useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';
import { INVENTORY_ITEM, useHeroStore } from '@/entities/hero';

import { canUseItem, consumeItem } from './inventory';

describe('canUseItem', () => {
  it('lets a potion be used only while the hero is hurt', () => {
    expect(canUseItem(INVENTORY_ITEM.potion, { health: 4, maxHealth: 5 })).toBe(true);
    expect(canUseItem(INVENTORY_ITEM.potion, { health: 5, maxHealth: 5 })).toBe(false);
  });

  it('always lets a spear be used', () => {
    expect(canUseItem(INVENTORY_ITEM.spear, { health: 5, maxHealth: 5 })).toBe(true);
  });
});

describe('consumeItem', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
    useEnemyStore.setState({ enemies: {} });
    useBoardStore.setState(useBoardStore.getInitialState());
  });

  it('heals the hero by 1 with a potion and takes it out of the inventory', () => {
    useHeroStore.setState({
      health: 3,
      inventory: [INVENTORY_ITEM.spear, INVENTORY_ITEM.potion],
    });

    expect(consumeItem(1)).toBe(true);

    expect(useHeroStore.getState().health).toBe(4);
    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.spear]);
  });

  it('keeps the potion when the hero is at full health', () => {
    useHeroStore.setState({ health: 5, maxHealth: 5, inventory: [INVENTORY_ITEM.potion] });
    const before = useHeroStore.getState();

    expect(consumeItem(0)).toBe(false);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('kills a random enemy with a spear and takes it out of the inventory', () => {
    const beast = createEnemy('beast');
    useEnemyStore.setState({ enemies: { 2: beast, 5: beast, 9: beast } });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.spear, INVENTORY_ITEM.potion] });

    expect(consumeItem(0, () => 0.5)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({ 2: beast, 9: beast });
    expect(useBoardStore.getState().visited).toEqual([5]);
    expect(useBoardStore.getState().playerIndex).toBeNull();
    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.potion]);
  });

  it('uses up a spear when there are no enemies', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.spear] });

    expect(consumeItem(0)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({});
    expect(useHeroStore.getState().inventory).toEqual([]);
  });

  it('ignores an empty slot', () => {
    useHeroStore.setState({ health: 1, inventory: [INVENTORY_ITEM.potion] });
    const before = useHeroStore.getState();

    expect(consumeItem(1)).toBe(false);

    expect(useHeroStore.getState()).toBe(before);
  });
});
