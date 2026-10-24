import { pickCells, pickCount, pickWeighted } from '@/shared/lib';

import { ENEMY_SPAWN } from '../config';
import { createEnemy } from './enemy';
import type { Enemy, EnemySpawnConfig } from './types';

/** Enemies by the index of the cell they stand on. */
export type EnemyMap = Partial<Record<number, Enemy>>;

/**
 * Places enemies on a new level: every row gets from `perRow.min` to `perRow.max` of them on
 * random cells, each of a type picked by its weight (and with a random starting attack if the type
 * has one).
 */
export function spawnEnemies(
  rows: readonly (readonly number[])[],
  random: () => number = Math.random,
  { perRow, types }: EnemySpawnConfig = ENEMY_SPAWN,
): EnemyMap {
  const enemies: EnemyMap = {};
  rows.forEach((cells) => {
    pickCells(cells, pickCount(perRow, random), random).forEach((cell) => {
      const entry = pickWeighted(types, random);
      if (entry) enemies[cell] = createEnemy(entry.type, random);
    });
  });
  return enemies;
}
