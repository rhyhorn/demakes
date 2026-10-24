import { describe, expect, it } from 'vitest';

import { ENEMY_SPAWN } from '../config';
import { pickWeighted, spawnEnemies } from './spawn';
import type { EnemySpawnConfig } from './types';

const ROWS = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];

/** Returns the given values in turn, then keeps repeating the last one. */
const sequence =
  (...values: number[]) =>
  () =>
    values.length > 1 ? (values.shift() ?? 0) : (values[0] ?? 0);

const enemiesInRow = (enemies: object, cells: number[]) =>
  cells.filter((cell) => cell in enemies).length;

describe('pickWeighted', () => {
  const entries = [
    { id: 'a', weight: 1 },
    { id: 'b', weight: 3 },
  ];

  it('picks entries in proportion to their weight', () => {
    expect(pickWeighted(entries, () => 0)?.id).toBe('a');
    expect(pickWeighted(entries, () => 0.24)?.id).toBe('a');
    expect(pickWeighted(entries, () => 0.25)?.id).toBe('b');
    expect(pickWeighted(entries, () => 0.999)?.id).toBe('b');
  });

  it('returns nothing for an empty list', () => {
    expect(pickWeighted([], () => 0)).toBeUndefined();
  });
});

describe('spawnEnemies', () => {
  it('puts the minimum number of enemies in every row', () => {
    const enemies = spawnEnemies(ROWS, () => 0);

    ROWS.forEach((cells) => expect(enemiesInRow(enemies, cells)).toBe(ENEMY_SPAWN.perRow.min));
  });

  it('puts the maximum number of enemies in every row', () => {
    const enemies = spawnEnemies(ROWS, () => 0.999);

    ROWS.forEach((cells) => expect(enemiesInRow(enemies, cells)).toBe(ENEMY_SPAWN.perRow.max));
  });

  it('keeps every row within the limits with the default random', () => {
    Array.from({ length: 50 }).forEach(() => {
      const enemies = spawnEnemies(ROWS);

      ROWS.forEach((cells) => {
        const count = enemiesInRow(enemies, cells);
        expect(count).toBeGreaterThanOrEqual(ENEMY_SPAWN.perRow.min);
        expect(count).toBeLessThanOrEqual(ENEMY_SPAWN.perRow.max);
      });
    });
  });

  it('places enemies on random cells and picks their type by weight', () => {
    const config: EnemySpawnConfig = {
      perRow: { min: 2, max: 2 },
      types: [
        { type: 'beast', weight: 1 },
        { type: 'shifter', weight: 1 },
      ],
    };
    // count, first cell, second cell, first type, second type
    const enemies = spawnEnemies([ROWS[0] ?? []], sequence(0, 0.5, 0.9, 0, 0.9), config);

    expect(Object.keys(enemies)).toEqual(['2', '3']);
    expect(enemies[2]?.type).toBe('beast');
    expect(enemies[3]?.type).toBe('shifter');
  });

  it('never puts more enemies in a row than it has cells', () => {
    const config: EnemySpawnConfig = { perRow: { min: 9, max: 9 }, types: ENEMY_SPAWN.types };

    expect(Object.keys(spawnEnemies([[0, 1]], () => 0, config))).toEqual(['0', '1']);
  });
});
