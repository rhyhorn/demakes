import { create } from 'zustand';

import { pickCells } from '@/shared/lib';

import { TOOTH_SLOT_COUNT, type ToothType } from '../config';
import type { Modifier } from '../config/modifiers';
import { STARTING_TEETH } from '../config/teeth';

/** A property of a tooth: while the tooth is in the mouth, it adds `value` percent to the modifier. */
export interface ToothModifierProperty {
  modifier: Modifier;
  value: number;
}

/** A property of a tooth: while the tooth is in the mouth, it adds `goldMultiplier` to the gold multiplier. */
export interface ToothGoldProperty {
  goldMultiplier: number;
}

export type ToothProperty = ToothModifierProperty | ToothGoldProperty;

/** Whether the property changes a chance modifier (rather than the gold multiplier). */
export const isModifierProperty = (property: ToothProperty): property is ToothModifierProperty =>
  'modifier' in property;

export interface Tooth {
  type: ToothType;
  /** A tooth has one or two properties. */
  properties: readonly [ToothProperty] | readonly [ToothProperty, ToothProperty];
}

/** A slot in the mouth: a tooth or `null` while it's empty. */
export type ToothSlot = Tooth | null;

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
