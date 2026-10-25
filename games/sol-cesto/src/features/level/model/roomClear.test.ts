import { beforeEach, describe, expect, it } from 'vitest';

import { FIRST_LEVEL, useBoardStore } from '@/entities/board';
import { createEnemy, useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { useHeroStore } from '@/entities/hero';
import { PICKUP_TYPE, usePickupStore } from '@/entities/pickup';
import { GREEDY_TOOTH, useToothStore } from '@/entities/tooth';
import { TRAP_TYPE, useTrapStore } from '@/entities/trap';

import { ROOM_CLEAR_GOLD } from '../config';
import { restartGame } from './level';
import { clearRoom, isRoomCleared, leaveClearedRoom } from './roomClear';
import { useRoomClearStore } from './roomClearStore';

describe('room clear', () => {
  beforeEach(() => {
    useBoardStore.setState(useBoardStore.getInitialState());
    useEnemyStore.setState({ enemies: {} });
    usePickupStore.setState({ pickups: {} });
    useTrapStore.setState({ traps: {} });
    useHeroStore.setState(useHeroStore.getInitialState());
    useToothStore.setState({ slots: [] });
    useGameStore.setState({ screen: GAME_SCREEN.dungeon });
    useRoomClearStore.setState(useRoomClearStore.getInitialState());
  });

  it('counts a room as cleared once no enemies and no pickups are left', () => {
    expect(isRoomCleared({ enemies: {}, pickups: {} })).toBe(true);
    expect(isRoomCleared({ enemies: { 3: createEnemy('beast') }, pickups: {} })).toBe(false);
    expect(isRoomCleared({ enemies: {}, pickups: { 3: PICKUP_TYPE.chest } })).toBe(false);
  });

  it('rewards the hero for a room with only spikes left, once', () => {
    useTrapStore.setState({ traps: { 5: TRAP_TYPE.spikes } });

    expect(clearRoom()).toBe(true);
    expect(clearRoom()).toBe(false);

    expect(useHeroStore.getState().gold).toBe(ROOM_CLEAR_GOLD);
    expect(useRoomClearStore.getState().reward).toBe(ROOM_CLEAR_GOLD);
  });

  it('multiplies the reward like any other gold', () => {
    useToothStore.setState({ slots: [GREEDY_TOOTH] });

    clearRoom();

    expect(useHeroStore.getState().gold).toBe(ROOM_CLEAR_GOLD * 2);
    expect(useRoomClearStore.getState().reward).toBe(ROOM_CLEAR_GOLD * 2);
  });

  it('gives nothing while something is left or the hero is dead', () => {
    usePickupStore.setState({ pickups: { 2: PICKUP_TYPE.strawberry } });
    expect(clearRoom()).toBe(false);

    usePickupStore.setState({ pickups: {} });
    useHeroStore.setState({ health: 0 });
    expect(clearRoom()).toBe(false);

    expect(useHeroStore.getState().gold).toBe(0);
    expect(useRoomClearStore.getState().reward).toBeNull();
  });

  it('leads the cleared room to the next one with the exit door still locked', () => {
    clearRoom();

    expect(leaveClearedRoom(() => 0)).toBe(true);

    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL + 1);
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.shop);
    expect(useRoomClearStore.getState().reward).toBeNull();
  });

  it('stays in a room that is not cleared', () => {
    expect(leaveClearedRoom()).toBe(false);

    expect(useBoardStore.getState().level).toBe(FIRST_LEVEL);
  });

  it('forgets the cleared room on a restart', () => {
    clearRoom();

    restartGame(() => 0);

    expect(useRoomClearStore.getState().reward).toBeNull();
  });
});
