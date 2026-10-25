import { type EnemyMap, useEnemyStore } from '@/entities/enemy';
import { useHeroStore } from '@/entities/hero';
import { type PickupMap, usePickupStore } from '@/entities/pickup';
import { getTeethGoldMultiplier, useToothStore } from '@/entities/tooth';

import { ROOM_CLEAR_GOLD } from '../config';
import { enterNextRoom } from './level';
import { useRoomClearStore } from './roomClearStore';

/** Whether the room has nothing left to fight or take: no enemies and no pickups, spikes aside. */
export const isRoomCleared = (room: { enemies: EnemyMap; pickups: PickupMap }) =>
  Object.keys(room.enemies).length === 0 && Object.keys(room.pickups).length === 0;

/**
 * Rewards the hero for clearing the room with `ROOM_CLEAR_GOLD` (times the gold multiplier). Only
 * once per room, only while she is alive, and only when the room is really cleared. Returns whether
 * she got the reward.
 */
export function clearRoom() {
  const hero = useHeroStore.getState();
  const room = {
    enemies: useEnemyStore.getState().enemies,
    pickups: usePickupStore.getState().pickups,
  };
  if (useRoomClearStore.getState().reward !== null || hero.health === 0 || !isRoomCleared(room)) {
    return false;
  }
  hero.addGold(ROOM_CLEAR_GOLD, getTeethGoldMultiplier(useToothStore.getState().slots));
  useRoomClearStore.setState({ reward: useHeroStore.getState().gold - hero.gold });
  return true;
}

/** Leaves the cleared room for the next one, whatever the exit door says. Does nothing otherwise. */
export function leaveClearedRoom(random?: () => number) {
  if (useRoomClearStore.getState().reward === null) return false;
  useRoomClearStore.setState({ reward: null });
  enterNextRoom(random);
  return true;
}
