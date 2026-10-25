import { beforeEach, describe, expect, it } from 'vitest';

import { createEnemy } from './enemy';
import { useEnemyStore } from './enemyStore';

const shifter = createEnemy('shifter', () => 0);

describe('useEnemyStore', () => {
  beforeEach(() => {
    useEnemyStore.setState(useEnemyStore.getInitialState());
  });

  it('starts with no enemies', () => {
    expect(useEnemyStore.getState().enemies).toEqual({});
  });

  it('replaces all enemies', () => {
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast') } });

    useEnemyStore.getState().setEnemies({ 5: shifter });

    expect(useEnemyStore.getState().enemies).toEqual({ 5: shifter });
  });

  it('lets every enemy take its turn and keeps them on their cells', () => {
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast'), 5: shifter } });

    useEnemyStore.getState().advanceTurn();
    const { enemies } = useEnemyStore.getState();

    expect(enemies[1]).toEqual(createEnemy('beast'));
    expect(enemies[5]?.activeAttack).not.toBe(shifter.activeAttack);
  });

  it('removes the enemy from a cell and keeps the others', () => {
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast'), 5: shifter } });

    useEnemyStore.getState().removeEnemy(1);

    expect(useEnemyStore.getState().enemies).toEqual({ 5: shifter });
  });

  it('does nothing when the cell has no enemy', () => {
    useEnemyStore.setState({ enemies: { 1: createEnemy('beast') } });
    const before = useEnemyStore.getState();

    useEnemyStore.getState().removeEnemy(2);

    expect(useEnemyStore.getState()).toBe(before);
  });
});
