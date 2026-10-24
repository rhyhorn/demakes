import { create } from 'zustand';

import { type HeroAttackKind, useHeroStore } from '@/entities/hero';

import { UPGRADE_AMOUNT } from '../config';

interface UpgradeState {
  /** Attack the hero has raised in this room; null while the choice is not made and the room is closed. */
  chosen: HeroAttackKind | null;
}

export const useUpgradeStore = create<UpgradeState>()(() => ({
  chosen: null,
}));

/** The upgrade room opens once the hero has made her choice. */
export function isUpgradeRoomOpen({ chosen }: UpgradeState) {
  return chosen !== null;
}

/** Raises the chosen attack by `UPGRADE_AMOUNT` and opens the room. Only the first choice counts. */
export function chooseUpgrade(kind: HeroAttackKind) {
  if (isUpgradeRoomOpen(useUpgradeStore.getState())) return;
  useHeroStore.getState().raiseAttack(kind, UPGRADE_AMOUNT);
  useUpgradeStore.setState({ chosen: kind });
}

/**
 * Leaves the open upgrade room and closes it behind the hero. Does nothing while the room is closed.
 * Returns whether the hero has left; where she goes next is up to the caller (`enterNextRoom`).
 */
export function leaveUpgradeRoom() {
  if (!isUpgradeRoomOpen(useUpgradeStore.getState())) return false;
  useUpgradeStore.setState(useUpgradeStore.getInitialState());
  return true;
}
