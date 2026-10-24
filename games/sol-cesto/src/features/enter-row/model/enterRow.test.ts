import { beforeEach, describe, expect, it } from 'vitest';

import { getRowCells, useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';

import { enterRow } from './enterRow';

describe('enterRow', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useEnemyStore.setState({ enemies: { 0: createEnemy('shifter') } });
  });

  it('moves the player and gives enemies a turn', () => {
    enterRow(1, () => 0);

    expect(useBoardStore.getState().playerIndex).toBe(4);
    expect(useEnemyStore.getState().enemies[0]?.activeAttack).not.toBe(
      createEnemy('shifter').activeAttack,
    );
  });

  it('makes the enemy on the entered cell disappear', () => {
    useEnemyStore.setState({ enemies: { 0: createEnemy('beast'), 1: createEnemy('beast') } });

    enterRow(0, () => 0);

    expect(useBoardStore.getState().playerIndex).toBe(0);
    expect(useEnemyStore.getState().enemies).toEqual({ 1: createEnemy('beast') });
  });

  it('gives enemies no turn when the row has no cells left', () => {
    getRowCells(1).forEach(() => enterRow(1));
    const { enemies } = useEnemyStore.getState();

    enterRow(1);

    expect(useEnemyStore.getState().enemies).toBe(enemies);
  });
});
