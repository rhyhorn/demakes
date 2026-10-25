import { describe, expect, it } from 'vitest';

import { ENEMY_SPAWN, type EnemySpawnConfig } from '@/entities/enemy';
import { TRAP_SPAWN, TRAP_TYPE, type TrapSpawnConfig } from '@/entities/trap';

import { spawnDangers } from './spawnDangers';

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

const dangersInRow = ({ enemies, traps }: ReturnType<typeof spawnDangers>, cells: number[]) =>
  cells.filter((cell) => cell in enemies || cell in traps).length;

const NO_TRAPS: TrapSpawnConfig = { types: [] };

describe('spawnDangers', () => {
  it('puts the minimum number of dangers in every row', () => {
    const dangers = spawnDangers(ROWS, () => 0);

    ROWS.forEach((cells) => expect(dangersInRow(dangers, cells)).toBe(ENEMY_SPAWN.perRow.min));
  });

  it('puts the maximum number of dangers in every row', () => {
    const dangers = spawnDangers(ROWS, () => 0.999);

    ROWS.forEach((cells) => expect(dangersInRow(dangers, cells)).toBe(ENEMY_SPAWN.perRow.max));
  });

  it('keeps every row within the limits with the default random', () => {
    Array.from({ length: 50 }).forEach(() => {
      const dangers = spawnDangers(ROWS);

      ROWS.forEach((cells) => {
        const count = dangersInRow(dangers, cells);
        expect(count).toBeGreaterThanOrEqual(ENEMY_SPAWN.perRow.min);
        expect(count).toBeLessThanOrEqual(ENEMY_SPAWN.perRow.max);
      });
    });
  });

  it('never puts an enemy and a trap on one cell', () => {
    Array.from({ length: 50 }).forEach(() => {
      const { enemies, traps } = spawnDangers(ROWS);

      Object.keys(traps).forEach((cell) => expect(cell in enemies).toBe(false));
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
    // count, first cell, second cell, first type, second type, shifter's start attack
    const { enemies } = spawnDangers(
      [ROWS[0] ?? []],
      sequence(0, 0.5, 0.9, 0, 0.9, 0),
      config,
      NO_TRAPS,
    );

    expect(Object.keys(enemies)).toEqual(['2', '3']);
    expect(enemies[2]?.type).toBe('beast');
    expect(enemies[3]?.type).toBe('shifter');
    expect(enemies[3]?.activeAttack).toBe('attack');
  });

  it('puts spikes from the same pool as the enemies', () => {
    const config: EnemySpawnConfig = {
      perRow: { min: 2, max: 2 },
      types: [{ type: 'beast', weight: 1 }],
    };
    // count, first cell, second cell, first pick (beast), second pick (spikes)
    const { enemies, traps } = spawnDangers(
      [ROWS[0] ?? []],
      sequence(0, 0, 0, 0, 0.9),
      config,
      TRAP_SPAWN,
    );

    expect(Object.keys(enemies)).toEqual(['0']);
    expect(traps).toEqual({ 1: TRAP_TYPE.spikes });
  });

  it('spawns spikes less often than any enemy type', () => {
    const spikes = TRAP_SPAWN.types.find(({ type }) => type === TRAP_TYPE.spikes)?.weight ?? 0;

    ENEMY_SPAWN.types.forEach(({ weight }) => expect(spikes).toBeLessThanOrEqual(weight));
    expect(spikes).toBeGreaterThan(0);
  });

  it('spawns an ogre less often than the other types', () => {
    const weights = Object.fromEntries(ENEMY_SPAWN.types.map(({ type, weight }) => [type, weight]));

    expect(weights.ogre).toBeLessThan(weights.beast ?? 0);
    expect(weights.ogre).toBeLessThan(weights.shifter ?? 0);
  });

  it('never puts more dangers in a row than it has cells', () => {
    const config: EnemySpawnConfig = { perRow: { min: 9, max: 9 }, types: ENEMY_SPAWN.types };

    expect(Object.keys(spawnDangers([[0, 1]], () => 0, config).enemies)).toEqual(['0', '1']);
  });
});
