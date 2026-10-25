import { create } from 'zustand';

import { TOOTH_SLOT_COUNT, TOOTH_TYPE, type ToothType } from '../config';
import { MODIFIER, type Modifier } from '../config/modifiers';

/** A property of a tooth: while the tooth is in the mouth, it adds `value` percent to the modifier. */
export interface ToothProperty {
  modifier: Modifier;
  value: number;
}

export interface Tooth {
  type: ToothType;
  /** A tooth has one or two properties. */
  properties: readonly [ToothProperty] | readonly [ToothProperty, ToothProperty];
}

/** A slot in the mouth: a tooth or `null` while it's empty. */
export type ToothSlot = Tooth | null;

/** A tooth for testing: +50% to physical enemies and -50% to strawberries. */
export const TEST_TOOTH: Tooth = {
  type: TOOTH_TYPE.test,
  properties: [
    { modifier: MODIFIER.attackChance, value: 50 },
    { modifier: MODIFIER.strawberryChance, value: -50 },
  ],
};

/** Slots at the start of a run: the test tooth in a random slot, the rest empty. */
export function createStartingSlots(random: () => number = Math.random): readonly ToothSlot[] {
  const testSlot = Math.floor(random() * TOOTH_SLOT_COUNT);
  return Array.from({ length: TOOTH_SLOT_COUNT }, (_, slot) =>
    slot === testSlot ? TEST_TOOTH : null,
  );
}

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
  /** Brings back the slots a run starts with: the test tooth lands in a new random slot. */
  reset: (random?: () => number) => void;
}

export const useToothStore = create<ToothState>()((set) => ({
  slots: createStartingSlots(),
  placeTooth: (slot, tooth) => {
    if (!isSlot(slot)) return;
    set((state) => ({ slots: withSlot(state.slots, slot, tooth) }));
  },
  removeTooth: (slot) => {
    if (!isSlot(slot)) return;
    set((state) => ({ slots: withSlot(state.slots, slot, null) }));
  },
  reset: (random) => set({ slots: createStartingSlots(random) }),
}));
