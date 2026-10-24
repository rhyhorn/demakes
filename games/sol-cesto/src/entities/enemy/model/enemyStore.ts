import { create } from 'zustand';

import { advanceEnemy } from './enemy';
import { type EnemyMap, spawnEnemies } from './spawn';

interface EnemyState {
  enemies: EnemyMap;
  /** Replaces all enemies with new ones placed on the given rows of cell indices. */
  spawn: (rows: readonly (readonly number[])[], random?: () => number) => void;
  /** Lets every enemy react to a player move. */
  advanceTurn: () => void;
  /** Takes the enemy off the cell. Does nothing if the cell has none. */
  removeEnemy: (cell: number) => void;
}

export const useEnemyStore = create<EnemyState>()((set) => ({
  enemies: {},
  spawn: (rows, random) => set({ enemies: spawnEnemies(rows, random) }),
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
