import { beforeEach, describe, expect, it } from 'vitest';

import { createEnemy } from './enemy';
import { useEnemyStore } from './enemyStore';

describe('useEnemyStore', () => {
  beforeEach(() => {
    useEnemyStore.setState(useEnemyStore.getInitialState());
  });

  it('starts with no enemies', () => {
    expect(useEnemyStore.getState().enemies).toEqual({});
  });

  it('spawns enemies on the given rows', () => {
    useEnemyStore.getState().spawn([[0, 1, 2, 3]], () => 0);

    expect(Object.keys(useEnemyStore.getState().enemies)).toEqual(['0']);
  });

  it('lets every enemy take its turn and keeps them on their cells', () => {
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast'), 5: createEnemy('shifter') } });

    useEnemyStore.getState().advanceTurn();
    const { enemies } = useEnemyStore.getState();

    expect(enemies[1]).toEqual(createEnemy('beast'));
    expect(enemies[5]?.activeAttack).not.toBe(createEnemy('shifter').activeAttack);
  });

  it('removes the enemy from a cell and keeps the others', () => {
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast'), 5: createEnemy('shifter') } });

    useEnemyStore.getState().removeEnemy(1);

    expect(useEnemyStore.getState().enemies).toEqual({ 5: createEnemy('shifter') });
  });

  it('does nothing when the cell has no enemy', () => {
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast') } });
    const before = useEnemyStore.getState();

    useEnemyStore.getState().removeEnemy(2);

    expect(useEnemyStore.getState()).toBe(before);
  });
});
