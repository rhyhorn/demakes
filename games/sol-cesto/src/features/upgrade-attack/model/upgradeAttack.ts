import { create } from 'zustand';

import { GAME_SCREEN, useGameStore } from '@/entities/game';
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

/** Leaves the open upgrade room for the dungeon. Does nothing while the room is closed. */
export function leaveUpgradeRoom() {
  if (!isUpgradeRoomOpen(useUpgradeStore.getState())) return;
  useUpgradeStore.setState(useUpgradeStore.getInitialState());
  useGameStore.getState().showScreen(GAME_SCREEN.dungeon);
}
