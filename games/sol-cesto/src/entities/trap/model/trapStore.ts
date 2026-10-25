import { create } from 'zustand';

import type { TrapType } from './types';

/** Traps by the index of the cell they are on. */
export type TrapMap = Partial<Record<number, TrapType>>;

interface TrapState {
  /** Traps stay on their cells until the next level: the hero doesn't take them away. */
  traps: TrapMap;
  /** Replaces all traps, e.g. with the ones of a new level. */
  setTraps: (traps: TrapMap) => void;
}

export const useTrapStore = create<TrapState>()((set) => ({
  traps: {},
  setTraps: (traps) => set({ traps }),
}));
