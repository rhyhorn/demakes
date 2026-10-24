import { ENEMY_SPAWN } from '../config';
import { createEnemy } from './enemy';
import type { Enemy, EnemySpawnConfig } from './types';

/** Enemies by the index of the cell they stand on. */
export type EnemyMap = Partial<Record<number, Enemy>>;

/** `random` returns a number in [0, 1), like Math.random. */
export function pickWeighted<T extends { weight: number }>(
  entries: readonly T[],
  random: () => number,
): T | undefined {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = random() * total;
  return (
    entries.find((entry) => {
      roll -= entry.weight;
      return roll < 0;
    }) ?? entries.at(-1)
  );
}

/** Picks `count` different cells in random order. */
function pickCells(cells: readonly number[], count: number, random: () => number): number[] {
  const pool = [...cells];
  return Array.from(
    { length: Math.min(count, pool.length) },
    () => pool.splice(Math.floor(random() * pool.length), 1)[0],
  );
}

/**
 * Places enemies on a new level: every row gets from `perRow.min` to `perRow.max` of them on
 * random cells, each of a type picked by its weight.
 */
export function spawnEnemies(
  rows: readonly (readonly number[])[],
  random: () => number = Math.random,
  { perRow, types }: EnemySpawnConfig = ENEMY_SPAWN,
): EnemyMap {
  const enemies: EnemyMap = {};
  rows.forEach((cells) => {
    const count = perRow.min + Math.floor(random() * (perRow.max - perRow.min + 1));
    pickCells(cells, count, random).forEach((cell) => {
      const entry = pickWeighted(types, random);
      if (entry) enemies[cell] = createEnemy(entry.type);
    });
  });
  return enemies;
}
