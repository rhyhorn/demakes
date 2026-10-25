import { create } from 'zustand';

import { TOOTH_SLOT_COUNT, TOOTH_TYPE, type ToothType } from '../config';

export interface Tooth {
  type: ToothType;
}

/** A slot in the mouth: a tooth or `null` while it's empty. */
export type ToothSlot = Tooth | null;

/**
 * Slots at the start of a run. The first three hold placeholder teeth for testing, the rest are
 * empty.
 */
export const INITIAL_TOOTH_SLOTS: readonly ToothSlot[] = Array.from(
  { length: TOOTH_SLOT_COUNT },
  (_, slot) => (slot < 3 ? { type: TOOTH_TYPE.placeholder } : null),
);

/** The slots with `slot` holding `content`. */
const withSlot = (slots: readonly ToothSlot[], slot: number, content: ToothSlot) =>
  slots.map((current, index) => (index === slot ? content : current));

const isSlot = (slot: number) => Number.isInteger(slot) && slot >= 0 && slot < TOOTH_SLOT_COUNT;

interface ToothState {
  /** `TOOTH_SLOT_COUNT` slots, top jaw first, left to right. */
  slots: readonly ToothSlot[];
  /** Puts the tooth into the slot, replacing whatever was there. Ignores slots out of range. */
  placeTooth: (slot: number, tooth: Tooth) => void;
  /** Empties the slot. */
  removeTooth: (slot: number) => void;
  /** Brings back the slots a run starts with. */
  reset: () => void;
}

export const useToothStore = create<ToothState>()((set) => ({
  slots: INITIAL_TOOTH_SLOTS,
  placeTooth: (slot, tooth) => {
    if (!isSlot(slot)) return;
    set((state) => ({ slots: withSlot(state.slots, slot, tooth) }));
  },
  removeTooth: (slot) => {
    if (!isSlot(slot)) return;
    set((state) => ({ slots: withSlot(state.slots, slot, null) }));
  },
  reset: () => set({ slots: INITIAL_TOOTH_SLOTS }),
}));
