import { create } from 'zustand';

/** Hero stats at the start of a run, as on the reference screenshot. */
export const INITIAL_HERO_STATS = {
  health: 5,
  maxHealth: 5,
  attack: 2,
  magic: 1,
} as const;

interface HeroState {
  /** Current health, from 0 up to `maxHealth`. */
  health: number;
  maxHealth: number;
  /** Physical attack. */
  attack: number;
  /** Magic attack. */
  magic: number;
  /** Lowers health by `amount`, but never below 0. Does nothing for 0 or less. */
  takeDamage: (amount: number) => void;
}

export const useHeroStore = create<HeroState>()((set) => ({
  ...INITIAL_HERO_STATS,
  takeDamage: (amount) =>
    set((state) => (amount > 0 ? { health: Math.max(0, state.health - amount) } : state)),
}));
