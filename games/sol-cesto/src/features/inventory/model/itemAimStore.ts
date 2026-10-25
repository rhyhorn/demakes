import { create } from 'zustand';

import { useEnemyStore } from '@/entities/enemy';
import { getInventoryIconRect, getInventoryItem, useHeroStore } from '@/entities/hero';

import { applyItem, getItemAim, ITEM_AIM, type ItemAim } from './inventory';

/** An aimed item the player is picking a target for on the board. */
export interface ItemAiming {
  /** Inventory slot of the item. */
  slot: number;
  /** What it is aimed at: clicking a row or an enemy uses it there instead of moving the hero. */
  aim: ItemAim;
}

/** A fired item on its way from its inventory slot to the enemy's cell. It hits once it lands. */
export interface ItemShot {
  slot: number;
  target: number;
  /** Where the item's icon was in the slot on the screen: it flies out from there. */
  from: DOMRect;
}

interface ItemAimState {
  aiming: ItemAiming | null;
  shot: ItemShot | null;
}

export const useItemAimStore = create<ItemAimState>()(() => ({ aiming: null, shot: null }));

/**
 * Starts aiming the item in inventory slot `slot`, or stops if it is already being aimed. Does
 * nothing for an item that is used at once.
 */
export const toggleItemAim = (slot: number) => {
  const item = getInventoryItem(useHeroStore.getState().inventory, slot);
  const aim = item === null ? null : getItemAim(item);
  if (aim === null) return;
  useItemAimStore.setState((state) => ({
    aiming: state.aiming?.slot === slot ? null : { slot, aim },
  }));
};

export const cancelItemAim = () => useItemAimStore.setState({ aiming: null });

/** Uses the aimed row item on the row and stops aiming. Returns whether the item was used. */
export const applyAimedItem = (row: number) => {
  const { aiming } = useItemAimStore.getState();
  if (aiming?.aim !== ITEM_AIM.row) return false;
  cancelItemAim();
  return applyItem(aiming.slot, row);
};

/**
 * Fires the aimed enemy item at the enemy in `cell` and stops aiming: the inventory shows it flying
 * there (`shot`), and `finishShot` uses it. Without its icon on the screen it hits at once.
 */
export const fireAimedItem = (cell: number) => {
  const { aiming } = useItemAimStore.getState();
  if (aiming?.aim !== ITEM_AIM.enemy || !(cell in useEnemyStore.getState().enemies)) return;
  const from = getInventoryIconRect(aiming.slot);
  if (from === null) {
    cancelItemAim();
    applyItem(aiming.slot, cell);
    return;
  }
  useItemAimStore.setState({ aiming: null, shot: { slot: aiming.slot, target: cell, from } });
};

/** The fired item has landed: it hits its enemy. */
export const finishShot = () => {
  const { shot } = useItemAimStore.getState();
  if (shot === null) return;
  useItemAimStore.setState({ shot: null });
  applyItem(shot.slot, shot.target);
};
