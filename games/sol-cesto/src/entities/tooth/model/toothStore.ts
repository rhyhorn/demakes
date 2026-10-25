import { create } from 'zustand';

import { pickCells } from '@/shared/lib';

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

/** A tooth for testing with a single property: +25% to strawberries. */
export const SWEET_TOOTH: Tooth = {
  type: TOOTH_TYPE.sweet,
  properties: [{ modifier: MODIFIER.strawberryChance, value: 25 }],
};

/** A tooth for testing: +25% to physical enemies and -25% to magic ones. */
export const FANG_TOOTH: Tooth = {
  type: TOOTH_TYPE.fang,
  properties: [
    { modifier: MODIFIER.attackChance, value: 25 },
    { modifier: MODIFIER.magicChance, value: -25 },
  ],
};

/** A tooth for testing: +50% to chests and -25% to strawberries. */
export const GOLDEN_TOOTH: Tooth = {
  type: TOOTH_TYPE.golden,
  properties: [
    { modifier: MODIFIER.chestChance, value: 50 },
    { modifier: MODIFIER.strawberryChance, value: -25 },
  ],
};

/** A tooth for testing with a single property: -50% to magic enemies. */
export const MOON_TOOTH: Tooth = {
  type: TOOTH_TYPE.moon,
  properties: [{ modifier: MODIFIER.magicChance, value: -50 }],
};

/** A tooth for testing: +42% to strawberries and +25% to magic enemies. */
export const ROTTEN_TOOTH: Tooth = {
  type: TOOTH_TYPE.rotten,
  properties: [
    { modifier: MODIFIER.strawberryChance, value: 42 },
    { modifier: MODIFIER.magicChance, value: 25 },
  ],
};

/** Every tooth the hero may find during a run, e.g. in the tooth room. */
export const TOOTH_POOL: readonly Tooth[] = [
  TEST_TOOTH,
  SWEET_TOOTH,
  FANG_TOOTH,
  GOLDEN_TOOTH,
  MOON_TOOTH,
  ROTTEN_TOOTH,
];

/** Teeth a run starts with. */
export const STARTING_TEETH: readonly Tooth[] = [TEST_TOOTH, SWEET_TOOTH];

const ALL_SLOTS = Array.from({ length: TOOTH_SLOT_COUNT }, (_, slot) => slot);

/** Slots at the start of a run: every starting tooth in its own random slot, the rest empty. */
export function createStartingSlots(random: () => number = Math.random): readonly ToothSlot[] {
  const slots: ToothSlot[] = Array.from({ length: TOOTH_SLOT_COUNT }, () => null);
  pickCells(ALL_SLOTS, STARTING_TEETH.length, random).forEach((slot, index) => {
    slots[slot] = STARTING_TEETH[index];
  });
  return slots;
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
  /**
   * Puts the tooth into a random empty slot, or replaces a random tooth when the mouth is full.
   * Returns the slot.
   */
  addTooth: (tooth: Tooth, random?: () => number) => number;
  /** Empties the slot. */
  removeTooth: (slot: number) => void;
  /** Brings back the slots a run starts with: the starting teeth land in new random slots. */
  reset: (random?: () => number) => void;
}

export const useToothStore = create<ToothState>()((set, get) => ({
  slots: createStartingSlots(),
  addTooth: (tooth, random = Math.random) => {
    const { slots } = get();
    const empty = ALL_SLOTS.filter((slot) => slots[slot] === null);
    const [slot] = pickCells(empty.length > 0 ? empty : ALL_SLOTS, 1, random);
    set({ slots: withSlot(slots, slot, tooth) });
    return slot;
  },
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
