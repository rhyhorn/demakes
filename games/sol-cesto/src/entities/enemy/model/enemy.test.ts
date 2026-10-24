import { describe, expect, it } from 'vitest';

import { ENEMY_BEHAVIOR_DESCRIPTIONS, ENEMY_TYPES } from '../config';
import { advanceEnemy, createEnemy, getActiveAttack, getEnemyTraits } from './enemy';

describe('createEnemy', () => {
  it('takes the stats of its type', () => {
    expect(createEnemy('beast')).toEqual({ type: 'beast', ...ENEMY_TYPES.beast.stats });
  });

  it('makes an ogre hit harder than a beast', () => {
    expect(createEnemy('ogre')).toEqual({
      type: 'ogre',
      attack: 4,
      magic: 0,
      activeAttack: 'attack',
    });
    expect(createEnemy('ogre').attack).toBeGreaterThan(createEnemy('beast').attack);
  });

  it('makes a shark hit harder than an ogre', () => {
    expect(createEnemy('shark')).toEqual({
      type: 'shark',
      attack: 7,
      magic: 0,
      activeAttack: 'attack',
    });
    expect(createEnemy('shark').attack).toBeGreaterThan(createEnemy('ogre').attack);
  });

  it('starts a shifter with a random attack', () => {
    expect(createEnemy('shifter', () => 0).activeAttack).toBe('attack');
    expect(createEnemy('shifter', () => 0.999).activeAttack).toBe('magic');
  });

  it('keeps the stats of a shifter whatever attack it starts with', () => {
    const { attack, magic } = ENEMY_TYPES.shifter.stats;

    expect(createEnemy('shifter', () => 0)).toMatchObject({ attack, magic });
    expect(createEnemy('shifter', () => 0.999)).toMatchObject({ attack, magic });
  });

  it('rolls no start attack for a type with a fixed one', () => {
    let rolls = 0;

    createEnemy('beast', () => {
      rolls += 1;
      return 0;
    });

    expect(rolls).toBe(0);
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
    const shifter = createEnemy('shifter', () => 0);
    const next = advanceEnemy(shifter);

    expect(next.activeAttack).not.toBe(shifter.activeAttack);
    expect(advanceEnemy(next)).toEqual(shifter);
  });
});

describe('getEnemyTraits', () => {
  it('has nothing to tell about a static enemy', () => {
    expect(getEnemyTraits('beast')).toEqual([]);
    expect(getEnemyTraits('ogre')).toEqual([]);
    expect(getEnemyTraits('shark')).toEqual([]);
  });

  it('describes every behavior of the type', () => {
    expect(getEnemyTraits('shifter')).toEqual([ENEMY_BEHAVIOR_DESCRIPTIONS.switchAttackEachTurn]);
  });
});
