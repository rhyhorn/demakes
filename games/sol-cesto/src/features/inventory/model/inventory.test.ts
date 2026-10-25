import { beforeEach, describe, expect, it } from 'vitest';

import { useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';
import { INVENTORY_ITEM, useHeroStore } from '@/entities/hero';

import { applyItem, canUseItem, consumeItem, getRowItemTargets, pickItemTarget } from './inventory';

describe('canUseItem', () => {
  it('lets a potion be used only while the hero is hurt', () => {
    expect(canUseItem(INVENTORY_ITEM.potion, { health: 4, maxHealth: 5 })).toBe(true);
    expect(canUseItem(INVENTORY_ITEM.potion, { health: 5, maxHealth: 5 })).toBe(false);
  });

  it('always lets a spear and a bomb be used', () => {
    expect(canUseItem(INVENTORY_ITEM.spear, { health: 5, maxHealth: 5 })).toBe(true);
    expect(canUseItem(INVENTORY_ITEM.bomb, { health: 5, maxHealth: 5 })).toBe(true);
  });
});

describe('getRowItemTargets', () => {
  it('lists the rows with enemies', () => {
    const beast = createEnemy('beast');

    expect(getRowItemTargets({ 1: beast, 3: beast, 13: beast })).toEqual([0, 3]);
    expect(getRowItemTargets({})).toEqual([]);
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
    expect(useBoardStore.getState().moves).toBe(1);
    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.potion]);
  });

  it('uses up a spear when there are no enemies', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.spear] });

    expect(consumeItem(0)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({});
    expect(useBoardStore.getState().moves).toBe(0);
    expect(useHeroStore.getState().inventory).toEqual([]);
  });

  it('kills one random enemy in every row with a bomb and counts it as a single move', () => {
    const beast = createEnemy('beast');
    // Row 0: cells 1 and 3, row 1: none, row 2: cell 9, row 3: cells 12 and 15.
    useEnemyStore.setState({ enemies: { 1: beast, 3: beast, 9: beast, 12: beast, 15: beast } });
    useBoardStore.setState({ moves: 2 });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.bomb, INVENTORY_ITEM.potion] });

    expect(consumeItem(0, () => 0.999)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({ 1: beast, 12: beast });
    expect(useBoardStore.getState().visited).toEqual([3, 9, 15]);
    expect(useBoardStore.getState().moves).toBe(3);
    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.potion]);
  });

  it('uses up a bomb without enemies, still counting a move', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.bomb] });

    expect(consumeItem(0)).toBe(true);

    expect(useBoardStore.getState().visited).toEqual([]);
    expect(useBoardStore.getState().moves).toBe(1);
    expect(useHeroStore.getState().inventory).toEqual([]);
  });

  it('ignores an empty slot', () => {
    useHeroStore.setState({ health: 1, inventory: [INVENTORY_ITEM.potion] });
    const before = useHeroStore.getState();

    expect(consumeItem(1)).toBe(false);

    expect(useHeroStore.getState()).toBe(before);
  });
});

describe('pickItemTarget', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
    useEnemyStore.setState({ enemies: {} });
    useBoardStore.setState(useBoardStore.getInitialState());
  });

  it('aims a spear at a random enemy without changing anything', () => {
    const beast = createEnemy('beast');
    useEnemyStore.setState({ enemies: { 2: beast, 5: beast, 9: beast } });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.spear] });
    const enemies = useEnemyStore.getState();
    const hero = useHeroStore.getState();

    expect(pickItemTarget(0, () => 0.999)).toBe(9);

    expect(useEnemyStore.getState()).toBe(enemies);
    expect(useHeroStore.getState()).toBe(hero);
  });

  it('has no target without enemies or for an item that hits nothing', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.spear, INVENTORY_ITEM.potion] });

    expect(pickItemTarget(0)).toBeUndefined();

    useEnemyStore.setState({ enemies: { 3: createEnemy('beast') } });

    expect(pickItemTarget(1)).toBeUndefined();
    expect(pickItemTarget(2)).toBeUndefined();
  });
});

describe('applyItem', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
    useEnemyStore.setState({ enemies: {} });
    useBoardStore.setState(useBoardStore.getInitialState());
  });

  it('kills the enemy the spear was aimed at', () => {
    const beast = createEnemy('beast');
    useEnemyStore.setState({ enemies: { 2: beast, 5: beast } });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.spear] });

    expect(applyItem(0, 2)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({ 5: beast });
    expect(useBoardStore.getState().visited).toEqual([2]);
    expect(useBoardStore.getState().moves).toBe(1);
    expect(useHeroStore.getState().inventory).toEqual([]);
  });

  it('kills every enemy in the row a whirlwind is aimed at and counts it as a single move', () => {
    const beast = createEnemy('beast');
    // Row 1 is cells 4–7.
    useEnemyStore.setState({ enemies: { 2: beast, 4: beast, 6: beast, 7: beast } });
    useBoardStore.setState({ moves: 2 });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.whirlwind, INVENTORY_ITEM.potion] });

    expect(applyItem(0, 1)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({ 2: beast });
    expect(useBoardStore.getState().visited).toEqual([4, 6, 7]);
    expect(useBoardStore.getState().moves).toBe(3);
    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.potion]);
  });

  it('kills the enemy an arrow is aimed at, whatever its attack', () => {
    const shark = createEnemy('shark');
    useEnemyStore.setState({ enemies: { 6: shark, 11: shark } });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.arrow] });

    expect(applyItem(0, 11)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({ 6: shark });
    expect(useBoardStore.getState().visited).toEqual([11]);
    expect(useBoardStore.getState().moves).toBe(1);
    expect(useHeroStore.getState().inventory).toEqual([]);
  });

  it('keeps an arrow without a target', () => {
    useEnemyStore.setState({ enemies: { 6: createEnemy('beast') } });
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.arrow] });

    expect(consumeItem(0)).toBe(false);

    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.arrow]);
  });

  it('keeps a whirlwind without a row', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.whirlwind] });

    expect(consumeItem(0)).toBe(false);

    expect(useBoardStore.getState().moves).toBe(0);
    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.whirlwind]);
  });

  it('uses up the spear when its enemy is already gone', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.spear] });

    expect(applyItem(0, 2)).toBe(true);

    expect(useBoardStore.getState().visited).toEqual([]);
    expect(useBoardStore.getState().moves).toBe(0);
    expect(useHeroStore.getState().inventory).toEqual([]);
  });
});
