import { create } from 'zustand';

import { advanceEnemy } from './enemy';
import type { Enemy } from './types';

/** Enemies by the index of the cell they stand on. */
export type EnemyMap = Partial<Record<number, Enemy>>;

interface EnemyState {
  enemies: EnemyMap;
  /** Replaces all enemies, e.g. with the ones of a new level. */
  setEnemies: (enemies: EnemyMap) => void;
  /** Lets every enemy react to a player move. */
  advanceTurn: () => void;
  /** Takes the enemy off the cell. Does nothing if the cell has none. */
  removeEnemy: (cell: number) => void;
}

export const useEnemyStore = create<EnemyState>()((set) => ({
  enemies: {},
  setEnemies: (enemies) => set({ enemies }),
  advanceTurn: () =>
    set((state) => ({
      enemies: Object.fromEntries(
        Object.entries(state.enemies).map(([cell, enemy]) => [cell, enemy && advanceEnemy(enemy)]),
      ),
    })),
  removeEnemy: (cell) =>
    set((state) => {
      if (!(cell in state.enemies)) return state;
      const { [cell]: removed, ...enemies } = state.enemies;
      return { enemies };
    }),
}));
