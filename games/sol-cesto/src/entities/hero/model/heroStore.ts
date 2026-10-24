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
}

export const useHeroStore = create<HeroState>()(() => ({ ...INITIAL_HERO_STATS }));
