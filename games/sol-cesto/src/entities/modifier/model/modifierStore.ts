import { create } from 'zustand';

import { MAX_MODIFIER, MIN_MODIFIER, MODIFIER, type Modifier } from '../config';

export type Modifiers = Record<Modifier, number>;

/** Modifiers at the start of a run. +50% to physical enemies is a placeholder for testing. */
export const INITIAL_MODIFIERS: Modifiers = {
  [MODIFIER.attackChance]: 50,
  [MODIFIER.magicChance]: 0,
};

interface ModifierState {
  /** Percentage of every modifier, from `MIN_MODIFIER` to `MAX_MODIFIER`. */
  modifiers: Modifiers;
  /** Sets the modifier, kept within `MIN_MODIFIER`..`MAX_MODIFIER`. */
  setModifier: (modifier: Modifier, value: number) => void;
  /** Brings back the modifiers a run starts with. */
  reset: () => void;
}

export const useModifierStore = create<ModifierState>()((set) => ({
  modifiers: INITIAL_MODIFIERS,
  setModifier: (modifier, value) =>
    set((state) => ({
      modifiers: {
        ...state.modifiers,
        [modifier]: Math.min(MAX_MODIFIER, Math.max(MIN_MODIFIER, value)),
      },
    })),
  reset: () => set({ modifiers: INITIAL_MODIFIERS }),
}));
