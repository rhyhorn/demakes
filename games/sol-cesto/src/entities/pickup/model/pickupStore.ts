import { create } from 'zustand';

import { type PickupMap, spawnPickups } from './spawn';

interface PickupState {
  pickups: PickupMap;
  /** Replaces all pickups with new ones, one on every given cell. */
  spawn: (cells: readonly number[], random?: () => number) => void;
  /** Takes the pickup off the cell. Does nothing if the cell has none. */
  removePickup: (cell: number) => void;
}

export const usePickupStore = create<PickupState>()((set) => ({
  pickups: {},
  spawn: (cells, random) => set({ pickups: spawnPickups(cells, random) }),
  removePickup: (cell) =>
    set((state) => {
      if (!(cell in state.pickups)) return state;
      const { [cell]: removed, ...pickups } = state.pickups;
      return { pickups };
    }),
}));
