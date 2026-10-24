import { beforeEach, describe, expect, it } from 'vitest';

import {
  CELL_COUNT,
  FINAL_LEVEL,
  FIRST_LEVEL,
  REQUIRED_MOVES,
  useBoardStore,
} from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { INITIAL_HERO_STATS, useHeroStore } from '@/entities/hero';
import { PICKUP_TYPE, usePickupStore } from '@/entities/pickup';

import { exitLevel, restartGame, startLevel } from './level';

describe('level', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useEnemyStore.setState(useEnemyStore.getInitialState());
    useHeroStore.setState(useHeroStore.getInitialState());
    usePickupStore.setState(usePickupStore.getInitialState());
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('starts a level with one enemy per row at least', () => {
    startLevel(() => 0);

    expect(Object.keys(useEnemyStore.getState().enemies)).toEqual(['0', '4', '8', '12']);
  });

  it('fills every cell without an enemy with a pickup', () => {
    startLevel(() => 0);
    const { enemies } = useEnemyStore.getState();
    const { pickups } = usePickupStore.getState();

    Array.from({ length: CELL_COUNT }, (_, cell) => cell).forEach((cell) =>
      expect(cell in enemies !== cell in pickups).toBe(true),
    );
    expect(pickups[1]).toBe(PICKUP_TYPE.strawberry);
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
    expect(Object.keys(useEnemyStore.getState().enemies)).toHaveLength(12);
  });

  it('wins the run after leaving the final level', () => {
    startLevel(() => 0);
    const { enemies } = useEnemyStore.getState();
    useBoardStore.setState({ moves: REQUIRED_MOVES, level: FINAL_LEVEL });

    exitLevel(() => 0.999);

    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.victory);
    expect(useBoardStore.getState().level).toBe(FINAL_LEVEL);
    expect(useEnemyStore.getState().enemies).toBe(enemies);
  });

  it('keeps going to the next level before the final one', () => {
    useGameStore.setState({ screen: GAME_SCREEN.dungeon });
    useBoardStore.setState({ moves: REQUIRED_MOVES, level: FINAL_LEVEL - 1 });

    exitLevel(() => 0.999);

    expect(useBoardStore.getState().level).toBe(FINAL_LEVEL);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
  });

  it('restarts the game from scratch after winning', () => {
    useBoardStore.setState({ level: FINAL_LEVEL });
    useGameStore.setState({ screen: GAME_SCREEN.victory });

    restartGame(() => 0);

    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
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
