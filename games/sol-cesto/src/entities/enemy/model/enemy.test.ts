import { describe, expect, it } from 'vitest';

import { ENEMY_TYPES } from '../config';
import { advanceEnemy, createEnemy, getActiveAttack } from './enemy';

describe('createEnemy', () => {
  it('takes the stats of its type', () => {
    expect(createEnemy('beast')).toEqual({ type: 'beast', ...ENEMY_TYPES.beast.stats });
  });
});

describe('getActiveAttack', () => {
  it('returns only the attack that is active', () => {
    const enemy = { type: 'shifter', attack: 2, magic: 1, activeAttack: 'magic' } as const;

    expect(getActiveAttack(enemy)).toEqual({ kind: 'magic', value: 1 });
    expect(getActiveAttack({ ...enemy, activeAttack: 'attack' })).toEqual({
      kind: 'attack',
      value: 2,
    });
  });
});

describe('advanceEnemy', () => {
  it('leaves a static enemy as it is', () => {
    const beast = createEnemy('beast');

    expect(advanceEnemy(beast)).toEqual(beast);
  });

  it('switches the active attack of a shifter every turn', () => {
    const shifter = createEnemy('shifter');
    const next = advanceEnemy(shifter);

    expect(next.activeAttack).not.toBe(shifter.activeAttack);
    expect(advanceEnemy(next)).toEqual(shifter);
  });
});
