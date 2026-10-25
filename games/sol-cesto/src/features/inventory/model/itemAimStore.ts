import { create } from 'zustand';

import { applyItem } from './inventory';

interface ItemAimState {
  /**
   * Inventory slot of the row item the player is aiming, or `null`. While it is set, clicking a
   * row on the board uses the item on it instead of moving the hero.
   */
  aimingSlot: number | null;
}

export const useItemAimStore = create<ItemAimState>()(() => ({ aimingSlot: null }));

/** Starts aiming the row item in inventory slot `slot`, or stops if it is already being aimed. */
export const toggleItemAim = (slot: number) =>
  useItemAimStore.setState((state) => ({ aimingSlot: state.aimingSlot === slot ? null : slot }));

export const cancelItemAim = () => useItemAimStore.setState({ aimingSlot: null });

/** Uses the aimed item on the row and stops aiming. Returns whether the item was used. */
export const applyAimedItem = (row: number) => {
  const { aimingSlot } = useItemAimStore.getState();
  if (aimingSlot === null) return false;
  cancelItemAim();
  return applyItem(aimingSlot, row);
};
