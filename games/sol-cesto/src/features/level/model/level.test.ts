import { beforeEach, describe, expect, it } from 'vitest';

import { REQUIRED_MOVES, useBoardStore } from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';

import { exitLevel, startLevel } from './level';

describe('level', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useEnemyStore.setState(useEnemyStore.getInitialState());
  });

  it('starts a level with one enemy per row at least', () => {
    startLevel(() => 0);

    expect(Object.keys(useEnemyStore.getState().enemies)).toEqual(['0', '4', '8', '12']);
  });

  it('keeps the enemies while the exit is locked', () => {
    startLevel(() => 0);
    const { enemies } = useEnemyStore.getState();

    exitLevel(() => 0.999);

    expect(useEnemyStore.getState().enemies).toBe(enemies);
  });

  it('spawns new enemies after leaving through the open exit', () => {
    startLevel(() => 0);
    useBoardStore.setState({ moves: REQUIRED_MOVES, visited: [0], playerIndex: 0 });

    exitLevel(() => 0.999);

    expect(useBoardStore.getState().visited).toEqual([]);
    expect(Object.keys(useEnemyStore.getState().enemies)).toHaveLength(8);
  });
});
