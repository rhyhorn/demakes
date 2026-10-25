import { beforeEach, describe, expect, it } from 'vitest';

import { useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';
import { INVENTORY_ITEM, registerInventoryIcon, useHeroStore } from '@/entities/hero';

import { ITEM_AIM } from './inventory';
import {
  applyAimedItem,
  cancelItemAim,
  finishShot,
  fireAimedItem,
  toggleItemAim,
  useItemAimStore,
} from './itemAimStore';

const { potion, whirlwind, arrow } = INVENTORY_ITEM;

describe('itemAimStore', () => {
  beforeEach(() => {
    useItemAimStore.setState(useItemAimStore.getInitialState());
    useHeroStore.setState(useHeroStore.getInitialState());
    useEnemyStore.setState({ enemies: {} });
    useBoardStore.setState(useBoardStore.getInitialState());
    registerInventoryIcon(0, null);
  });

  it('starts and stops aiming an aimed item, knowing what it is aimed at', () => {
    useHeroStore.setState({ inventory: [potion, whirlwind, arrow] });

    toggleItemAim(1);
    expect(useItemAimStore.getState().aiming).toEqual({ slot: 1, aim: ITEM_AIM.row });

    toggleItemAim(2);
    expect(useItemAimStore.getState().aiming).toEqual({ slot: 2, aim: ITEM_AIM.enemy });

    toggleItemAim(2);
    expect(useItemAimStore.getState().aiming).toBeNull();

    toggleItemAim(1);
    cancelItemAim();
    expect(useItemAimStore.getState().aiming).toBeNull();
  });

  it('does not aim an item that is used at once', () => {
    useHeroStore.setState({ inventory: [potion] });

    toggleItemAim(0);
    toggleItemAim(1);

    expect(useItemAimStore.getState().aiming).toBeNull();
  });

  it('uses the aimed whirlwind on the row and stops aiming', () => {
    const beast = createEnemy('beast');
    useEnemyStore.setState({ enemies: { 0: beast, 5: beast } });
    useHeroStore.setState({ inventory: [whirlwind] });
    toggleItemAim(0);

    expect(applyAimedItem(0)).toBe(true);

    expect(useEnemyStore.getState().enemies).toEqual({ 5: beast });
    expect(useHeroStore.getState().inventory).toEqual([]);
    expect(useItemAimStore.getState().aiming).toBeNull();
  });

  it('does nothing on a row without an aimed whirlwind', () => {
    useHeroStore.setState({ inventory: [whirlwind, arrow] });

    expect(applyAimedItem(0)).toBe(false);

    toggleItemAim(1);
    expect(applyAimedItem(0)).toBe(false);

    expect(useHeroStore.getState().inventory).toEqual([whirlwind, arrow]);
  });

  it('fires the aimed arrow at the enemy, which dies once the arrow lands', () => {
    const shark = createEnemy('shark');
    useEnemyStore.setState({ enemies: { 3: shark, 9: shark } });
    useHeroStore.setState({ inventory: [arrow, potion] });
    // Tests have no DOM: the icon only has to say where it is.
    const from = { left: 10, top: 20, width: 30, height: 30 } as DOMRect;
    registerInventoryIcon(0, { getBoundingClientRect: () => from } as HTMLElement);
    toggleItemAim(0);

    fireAimedItem(9);

    expect(useItemAimStore.getState()).toMatchObject({
      aiming: null,
      shot: { slot: 0, target: 9, from },
    });
    expect(useEnemyStore.getState().enemies).toEqual({ 3: shark, 9: shark });

    finishShot();

    expect(useItemAimStore.getState().shot).toBeNull();
    expect(useEnemyStore.getState().enemies).toEqual({ 3: shark });
    expect(useBoardStore.getState().visited).toEqual([9]);
    expect(useBoardStore.getState().moves).toBe(1);
    expect(useHeroStore.getState().inventory).toEqual([potion]);
  });

  it('hits at once when the arrow is not on the screen', () => {
    const beast = createEnemy('beast');
    useEnemyStore.setState({ enemies: { 4: beast } });
    useHeroStore.setState({ inventory: [arrow] });
    toggleItemAim(0);

    fireAimedItem(4);

    expect(useItemAimStore.getState()).toEqual({ aiming: null, shot: null });
    expect(useEnemyStore.getState().enemies).toEqual({});
    expect(useHeroStore.getState().inventory).toEqual([]);
  });

  it('fires the arrow only at an enemy', () => {
    useEnemyStore.setState({ enemies: { 4: createEnemy('beast') } });
    useHeroStore.setState({ inventory: [arrow] });
    toggleItemAim(0);

    fireAimedItem(5);

    expect(useItemAimStore.getState().aiming).toEqual({ slot: 0, aim: ITEM_AIM.enemy });
    expect(useHeroStore.getState().inventory).toEqual([arrow]);
  });
});
