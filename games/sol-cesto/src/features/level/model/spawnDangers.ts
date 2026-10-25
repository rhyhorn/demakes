import {
  createEnemy,
  ENEMY_SPAWN,
  type EnemyMap,
  type EnemySpawnConfig,
  type EnemyType,
} from '@/entities/enemy';
import { TRAP_SPAWN, type TrapMap, type TrapSpawnConfig, type TrapType } from '@/entities/trap';
import { pickCells, pickCount, pickWeighted } from '@/shared/lib';

/** What can stand on a dangerous cell: an enemy type or a trap, with its weight. */
type DangerEntry = { weight: number } & (
  { enemy: EnemyType; trap?: undefined } | { trap: TrapType; enemy?: undefined }
);

/** Enemy types and traps in one weighted pool, the traps last. */
function getDangerPool(enemyTypes: EnemySpawnConfig['types'], trapTypes: TrapSpawnConfig['types']) {
  return [
    ...enemyTypes.map(({ type, weight }): DangerEntry => ({ enemy: type, weight })),
    ...trapTypes.map(({ type, weight }): DangerEntry => ({ trap: type, weight })),
  ];
}

/**
 * Places the dangers of a new level: every row gets from `perRow.min` to `perRow.max` of them on
 * random cells, each an enemy or a trap picked by its weight (an enemy with a random starting
 * attack if its type has one).
 */
export function spawnDangers(
  rows: readonly (readonly number[])[],
  random: () => number = Math.random,
  { perRow, types: enemyTypes }: EnemySpawnConfig = ENEMY_SPAWN,
  { types: trapTypes }: TrapSpawnConfig = TRAP_SPAWN,
): { enemies: EnemyMap; traps: TrapMap } {
  const pool = getDangerPool(enemyTypes, trapTypes);
  const enemies: EnemyMap = {};
  const traps: TrapMap = {};
  rows.forEach((cells) => {
    pickCells(cells, pickCount(perRow, random), random).forEach((cell) => {
      const entry = pickWeighted(pool, random);
      if (entry?.enemy) enemies[cell] = createEnemy(entry.enemy, random);
      else if (entry?.trap) traps[cell] = entry.trap;
    });
  });
  return { enemies, traps };
}
