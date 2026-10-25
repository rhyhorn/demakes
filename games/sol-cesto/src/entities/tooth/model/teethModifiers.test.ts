import { describe, expect, it } from 'vitest';

import { TOOTH_TYPE } from '../config';
import { MODIFIER } from '../config/modifiers';
import { NO_MODIFIERS } from './modifiers';
import { getTeethModifiers } from './teethModifiers';
import { TEST_TOOTH } from './toothStore';

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
    });
  });

  it('keeps the totals within the allowed range', () => {
    expect(getTeethModifiers([TEST_TOOTH, TEST_TOOTH, TEST_TOOTH])).toMatchObject({
      [MODIFIER.attackChance]: 100,
      [MODIFIER.strawberryChance]: -100,
    });
  });
});
