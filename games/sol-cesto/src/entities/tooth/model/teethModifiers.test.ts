import { describe, expect, it } from 'vitest';

import { TOOTH_TYPE } from '../config';
import { MODIFIER } from '../config/modifiers';
import { TEST_TOOTH } from '../config/teeth';
import { NO_MODIFIERS } from './modifiers';
import { getTeethGoldMultiplier, getTeethModifiers } from './teethModifiers';

describe('getTeethModifiers', () => {
  it('is 0% everywhere when the mouth is empty', () => {
    expect(getTeethModifiers([null, null])).toEqual(NO_MODIFIERS);
  });

  it('adds up every property of every tooth', () => {
    const magicTooth = {
      type: TOOTH_TYPE.test,
      properties: [{ modifier: MODIFIER.magicChance, value: 30 }],
    } as const;

    expect(getTeethModifiers([TEST_TOOTH, null, magicTooth])).toEqual({
      [MODIFIER.attackChance]: 50,
      [MODIFIER.magicChance]: 30,
      [MODIFIER.strawberryChance]: -50,
      [MODIFIER.chestChance]: 0,
      [MODIFIER.spikesChance]: 0,
    });
  });

  it('ignores the gold multiplier properties', () => {
    const greedyTooth = { type: TOOTH_TYPE.greedy, properties: [{ goldMultiplier: 1 }] } as const;

    expect(getTeethModifiers([greedyTooth])).toEqual(NO_MODIFIERS);
  });

  it('keeps the totals within the allowed range', () => {
    expect(getTeethModifiers([TEST_TOOTH, TEST_TOOTH, TEST_TOOTH])).toMatchObject({
      [MODIFIER.attackChance]: 100,
      [MODIFIER.strawberryChance]: -100,
    });
  });
});

describe('getTeethGoldMultiplier', () => {
  const greedyTooth = { type: TOOTH_TYPE.greedy, properties: [{ goldMultiplier: 1 }] } as const;

  it('is 0 without teeth that change the gold multiplier', () => {
    expect(getTeethGoldMultiplier([TEST_TOOTH, null])).toBe(0);
  });

  it('adds up the bonuses of every tooth', () => {
    expect(getTeethGoldMultiplier([greedyTooth, TEST_TOOTH, greedyTooth])).toBe(2);
  });
});
