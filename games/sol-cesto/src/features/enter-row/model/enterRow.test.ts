import { beforeEach, describe, expect, it } from 'vitest';

import { getRowCells, useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { useHeroStore } from '@/entities/hero';
import { MODIFIER, useModifierStore } from '@/entities/modifier';
import { PICKUP_TYPE, usePickupStore } from '@/entities/pickup';

import { enterRow, getEnemyDamage } from './enterRow';

describe('getEnemyDamage', () => {
  const hero = { attack: 2, magic: 1 };

  it('is the difference when the enemy attack of the active kind is stronger', () => {
    expect(getEnemyDamage(createEnemy('beast'), hero)).toBe(1);
    expect(
      getEnemyDamage({ type: 'shifter', attack: 0, magic: 4, activeAttack: 'magic' }, hero),
    ).toBe(3);
  });

  it('compares only the active attack', () => {
    expect(
      getEnemyDamage({ type: 'shifter', attack: 9, magic: 1, activeAttack: 'magic' }, hero),
    ).toBe(0);
  });

  it('is 0 when the hero is as strong or stronger', () => {
    expect(getEnemyDamage(createEnemy('beast'), { attack: 3, magic: 0 })).toBe(0);
    expect(getEnemyDamage(createEnemy('beast'), { attack: 5, magic: 0 })).toBe(0);
  });
});

describe('enterRow', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useHeroStore.setState(useHeroStore.getInitialState());
    useGameStore.setState({ screen: GAME_SCREEN.dungeon });
    useEnemyStore.setState({ enemies: { 0: createEnemy('shifter', () => 0) } });
    usePickupStore.setState(usePickupStore.getInitialState());
    useModifierStore.setState(useModifierStore.getInitialState());
  });

  it('moves the player and gives enemies a turn', () => {
    enterRow(1, () => 0);

    expect(useBoardStore.getState().playerIndex).toBe(4);
    expect(useEnemyStore.getState().enemies[0]?.activeAttack).not.toBe(
      createEnemy('shifter', () => 0).activeAttack,
    );
  });

  it('makes the enemy on the entered cell disappear', () => {
    useEnemyStore.setState({ enemies: { 0: createEnemy('beast'), 1: createEnemy('beast') } });

    enterRow(0, () => 0);

    expect(useBoardStore.getState().playerIndex).toBe(0);
    expect(useEnemyStore.getState().enemies).toEqual({ 1: createEnemy('beast') });
  });

  it('hurts the hero with the enemy on the entered cell', () => {
    useEnemyStore.setState({ enemies: { 0: createEnemy('beast') } });

    enterRow(0, () => 0);

    expect(useHeroStore.getState().health).toBe(4);
  });

  it('hits with the attack the enemy had before the turn', () => {
    // After its turn this shifter would switch to attack 0 and deal no damage.
    useEnemyStore.setState({
      enemies: { 0: { type: 'shifter', attack: 0, magic: 3, activeAttack: 'magic' } },
    });

    enterRow(0, () => 0);

    expect(useHeroStore.getState().health).toBe(3);
  });

  it('ends the game when the hit takes health to 0', () => {
    useHeroStore.setState({ health: 1 });
    useEnemyStore.setState({ enemies: { 0: createEnemy('beast') } });

    enterRow(0, () => 0);

    expect(useHeroStore.getState().health).toBe(0);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.gameOver);
  });

  it('keeps the game going while the hero survives the hit', () => {
    useEnemyStore.setState({ enemies: { 0: createEnemy('beast') } });

    enterRow(0, () => 0);

    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
  });

  it('leaves the hero unhurt on a cell without an enemy', () => {
    enterRow(1, () => 0);

    expect(useHeroStore.getState().health).toBe(5);
  });

  it('heals the hero with the strawberry on the entered cell and takes it', () => {
    useHeroStore.setState({ health: 3 });
    usePickupStore.setState({ pickups: { 4: PICKUP_TYPE.strawberry, 5: PICKUP_TYPE.strawberry } });

    enterRow(1, () => 0);

    expect(useHeroStore.getState().health).toBe(4);
    expect(usePickupStore.getState().pickups).toEqual({ 5: PICKUP_TYPE.strawberry });
  });

  it('adds gold from the chest on the entered cell and takes it', () => {
    usePickupStore.setState({ pickups: { 4: PICKUP_TYPE.chest, 5: PICKUP_TYPE.strawberry } });

    enterRow(1, () => 0);

    expect(useHeroStore.getState().gold).toBe(3);
    expect(usePickupStore.getState().pickups).toEqual({ 5: PICKUP_TYPE.strawberry });
  });

  it('gives from 3 to 6 gold for a chest', () => {
    usePickupStore.setState({ pickups: { 4: PICKUP_TYPE.chest } });

    // The first roll picks the cell, the second one the amount of gold.
    const rolls = [0, 0.999];
    enterRow(1, () => rolls.shift() ?? 0);

    expect(useHeroStore.getState().gold).toBe(6);
  });

  it('gives enemies no turn when the row has no cells left', () => {
    getRowCells(1).forEach(() => enterRow(1));
    const { enemies } = useEnemyStore.getState();

    enterRow(1);

    expect(useEnemyStore.getState().enemies).toBe(enemies);
  });

  describe('chance modifiers', () => {
    // Row 0: a physical beast on cell 0, a magic shifter on cell 1, cells 2 and 3 are empty.
    beforeEach(() => {
      useEnemyStore.setState({
        enemies: { 0: createEnemy('beast'), 1: createEnemy('shifter', () => 0.999) },
      });
    });

    it('makes a physical enemy more likely to be landed on', () => {
      useModifierStore.setState({
        modifiers: { [MODIFIER.attackChance]: 100, [MODIFIER.magicChance]: 0 },
      });

      // Weights 2, 1, 1, 1: the first 40% of the roll goes to the beast.
      enterRow(0, () => 0.39);

      expect(useBoardStore.getState().playerIndex).toBe(0);
    });

    it('makes a magic enemy more likely to be landed on', () => {
      useModifierStore.setState({
        modifiers: { [MODIFIER.attackChance]: 0, [MODIFIER.magicChance]: 100 },
      });

      // Weights 1, 2, 1, 1: the shifter takes the roll from 20% to 60%.
      enterRow(0, () => 0.59);

      expect(useBoardStore.getState().playerIndex).toBe(1);
    });
  });
});
