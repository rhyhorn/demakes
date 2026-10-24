import { beforeEach, describe, expect, it } from 'vitest';

import { FIRST_LEVEL, REQUIRED_MOVES, useBoardStore } from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { INITIAL_HERO_STATS, useHeroStore } from '@/entities/hero';

import { exitLevel, restartGame, startLevel } from './level';

describe('level', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useEnemyStore.setState(useEnemyStore.getInitialState());
    useHeroStore.setState(useHeroStore.getInitialState());
    useGameStore.setState(useGameStore.getInitialState());
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
    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL + 1);
    expect(Object.keys(useEnemyStore.getState().enemies)).toHaveLength(8);
  });

  it('restarts the game from scratch after game over', () => {
    useHeroStore.setState({ health: 0 });
    useBoardStore.setState({ moves: 2, visited: [0, 4], playerIndex: 4, level: 3 });
    useGameStore.setState({ screen: GAME_SCREEN.gameOver });

    restartGame(() => 0);

    expect(useHeroStore.getState().health).toBe(INITIAL_HERO_STATS.health);
    expect(useBoardStore.getState().visited).toEqual([]);
    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
    expect(Object.keys(useEnemyStore.getState().enemies)).toEqual(['0', '4', '8', '12']);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
  });
});
