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
import { createStartingSlots, useToothStore } from '@/entities/tooth';

import { enterNextRoom, exitLevel, getRoomScreen, restartGame, startLevel } from './level';

describe('level', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useEnemyStore.setState(useEnemyStore.getInitialState());
    useHeroStore.setState(useHeroStore.getInitialState());
    usePickupStore.setState(usePickupStore.getInitialState());
    useGameStore.setState(useGameStore.getInitialState());
    useToothStore.setState(useToothStore.getInitialState());
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

  it('starts the run with picking the hero, then a dungeon, a shop, and alternates upgrade and tooth rooms on every second level', () => {
    const { heroSelect, dungeon, upgrade, tooth, shop } = GAME_SCREEN;

    expect(useGameStore.getState().screen).toBe(heroSelect);
    expect(
      Array.from({ length: FINAL_LEVEL }, (_, index) => getRoomScreen(FIRST_LEVEL + index)),
    ).toEqual([dungeon, shop, dungeon, tooth, dungeon, upgrade, dungeon, tooth, dungeon, upgrade]);
  });

  it('leads from the first dungeon to the shop through the open exit', () => {
    startLevel(() => 0);
    const { enemies } = useEnemyStore.getState();
    useBoardStore.setState({ moves: REQUIRED_MOVES, visited: [0], playerIndex: 0 });

    exitLevel(() => 0.999);

    expect(useBoardStore.getState().visited).toEqual([]);
    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL + 1);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.shop);
    expect(useEnemyStore.getState().enemies).toBe(enemies);
  });

  it('spawns new enemies on the dungeon after the upgrade room', () => {
    startLevel(() => 0);
    useBoardStore.setState({ level: FIRST_LEVEL + 1 });
    useGameStore.setState({ screen: GAME_SCREEN.upgrade });

    enterNextRoom(() => 0.999);

    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL + 2);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
    expect(Object.keys(useEnemyStore.getState().enemies)).toHaveLength(12);
  });

  it('wins the run after leaving the final upgrade room', () => {
    useBoardStore.setState({ level: FINAL_LEVEL });
    useGameStore.setState({ screen: GAME_SCREEN.upgrade });

    enterNextRoom(() => 0.999);

    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.victory);
    expect(useBoardStore.getState().level).toBe(FINAL_LEVEL);
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
    expect(useGameStore.getState().screen).toBe(getRoomScreen(FINAL_LEVEL));
  });

  it('restarts the game from scratch after winning', () => {
    useBoardStore.setState({ level: FINAL_LEVEL });
    useGameStore.setState({ screen: GAME_SCREEN.victory });

    restartGame(() => 0);

    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.heroSelect);
  });

  it('restarts the game from scratch after game over', () => {
    useHeroStore.setState({ health: 0 });
    useToothStore.getState().removeTooth(0);
    useBoardStore.setState({ moves: 2, visited: [0, 4], playerIndex: 4, level: 3 });
    useGameStore.setState({ screen: GAME_SCREEN.gameOver });

    restartGame(() => 0);

    expect(useHeroStore.getState().health).toBe(INITIAL_HERO_STATS.health);
    expect(useToothStore.getState().slots).toEqual(createStartingSlots(() => 0));
    expect(useBoardStore.getState().visited).toEqual([]);
    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
    expect(Object.keys(useEnemyStore.getState().enemies)).toEqual(['0', '4', '8', '12']);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.heroSelect);
  });
});
