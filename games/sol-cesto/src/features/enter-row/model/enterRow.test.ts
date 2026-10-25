import { beforeEach, describe, expect, it } from 'vitest';

import { getRowCells, useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { useHeroStore } from '@/entities/hero';
import { PICKUP_TYPE, usePickupStore } from '@/entities/pickup';
import { MODIFIER, type Modifier, TEST_TOOTH, TOOTH_TYPE, useToothStore } from '@/entities/tooth';

import { enterCell, enterRow, finishDeath, getEnemyDamage, pickEntryCell } from './enterRow';

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
    useToothStore.setState({ slots: [] });
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

  it('leaves the game on until her death has played out', () => {
    useHeroStore.setState({ health: 1 });
    useEnemyStore.setState({ enemies: { 0: createEnemy('beast') } });

    enterCell(0, () => 0);

    expect(useHeroStore.getState().health).toBe(0);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);

    finishDeath();

    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.gameOver);
  });

  it('does not end the game for a living hero', () => {
    finishDeath();

    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
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
    /** Puts a single tooth with one property into the mouth. */
    const setTooth = (modifier: Modifier, value: number) =>
      useToothStore.setState({
        slots: [{ type: TOOTH_TYPE.test, properties: [{ modifier, value }] }],
      });

    // Row 0: a physical beast on cell 0, a magic shifter on cell 1, a chest and a strawberry.
    beforeEach(() => {
      useEnemyStore.setState({
        enemies: { 0: createEnemy('beast'), 1: createEnemy('shifter', () => 0.999) },
      });
      usePickupStore.setState({ pickups: { 2: PICKUP_TYPE.chest, 3: PICKUP_TYPE.strawberry } });
    });

    it('makes a physical enemy more likely to be landed on', () => {
      setTooth(MODIFIER.attackChance, 100);

      // Weights 2, 1, 1, 1: the first 40% of the roll goes to the beast.
      enterRow(0, () => 0.39);

      expect(useBoardStore.getState().playerIndex).toBe(0);
    });

    it('makes a magic enemy more likely to be landed on', () => {
      setTooth(MODIFIER.magicChance, 100);

      // Weights 1, 2, 1, 1: the shifter takes the roll from 20% to 60%.
      enterRow(0, () => 0.59);

      expect(useBoardStore.getState().playerIndex).toBe(1);
    });

    it('makes a strawberry more likely to be landed on', () => {
      setTooth(MODIFIER.strawberryChance, 100);

      // Weights 1, 1, 1, 2: the strawberry takes the roll from 60% on.
      enterRow(0, () => 0.61);

      expect(useBoardStore.getState().playerIndex).toBe(3);
    });

    it('makes a chest less likely to be landed on', () => {
      setTooth(MODIFIER.chestChance, -50);

      // Weights 1, 1, 0.5, 1: the chest only keeps the roll from 4/7 to 5/7.
      enterRow(0, () => 0.72);

      expect(useBoardStore.getState().playerIndex).toBe(3);
    });

    it('adds up the properties of all the teeth', () => {
      useToothStore.setState({ slots: [TEST_TOOTH, TEST_TOOTH] });

      // Two test teeth: +100% to physical enemies and -100% to strawberries, so weights 2, 1, 1, 0
      // and the beast takes the roll up to 1/2.
      enterRow(0, () => 0.49);

      expect(useBoardStore.getState().playerIndex).toBe(0);
    });
  });
});

describe('pickEntryCell and enterCell', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useHeroStore.setState(useHeroStore.getInitialState());
    useGameStore.setState({ screen: GAME_SCREEN.dungeon });
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast') } });
    usePickupStore.setState(usePickupStore.getInitialState());
    useToothStore.setState({ slots: [] });
  });

  it('picks the cell without changing anything yet', () => {
    const before = useBoardStore.getState();

    expect(pickEntryCell(0, () => 0.3)).toBe(1);
    expect(useBoardStore.getState()).toBe(before);
    expect(useEnemyStore.getState().enemies[1]).toBeDefined();
  });

  it('is undefined when the row has no cells left', () => {
    useBoardStore.setState({ visited: getRowCells(0) });

    expect(pickEntryCell(0)).toBeUndefined();
  });

  it('makes the move into the picked cell', () => {
    enterCell(1);

    expect(useBoardStore.getState().playerIndex).toBe(1);
    expect(useHeroStore.getState().health).toBe(4);
    expect(useEnemyStore.getState().enemies[1]).toBeUndefined();
  });

  it('does nothing in a visited cell', () => {
    enterCell(1);
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast') } });

    enterCell(1);

    expect(useHeroStore.getState().health).toBe(4);
    expect(useEnemyStore.getState().enemies[1]).toBeDefined();
  });
});
