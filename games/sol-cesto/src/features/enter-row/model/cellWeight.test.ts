import { describe, expect, it } from 'vitest';

import { createEnemy } from '@/entities/enemy';
import { MODIFIER } from '@/entities/modifier';
import { PICKUP_TYPE } from '@/entities/pickup';

import { getCellWeight, getCellWeights } from './cellWeight';

const modifiers = {
  [MODIFIER.attackChance]: 50,
  [MODIFIER.magicChance]: 20,
  [MODIFIER.strawberryChance]: 30,
  [MODIFIER.chestChance]: -50,
};

describe('getCellWeight', () => {
  it('weighs an empty cell as 1', () => {
    expect(getCellWeight({}, modifiers)).toBe(1);
  });

  it('adds the modifier of the active attack', () => {
    expect(getCellWeight({ enemy: createEnemy('beast') }, modifiers)).toBe(1.5);
    expect(getCellWeight({ enemy: createEnemy('shifter', () => 0.999) }, modifiers)).toBe(1.2);
  });

  it('adds the modifier of the pickup type, negative ones too', () => {
    expect(getCellWeight({ pickup: PICKUP_TYPE.strawberry }, modifiers)).toBe(1.3);
    expect(getCellWeight({ pickup: PICKUP_TYPE.chest }, modifiers)).toBe(0.5);
  });

  it('weighs a cell as 1 when its modifier is 0', () => {
    const none = { ...modifiers, [MODIFIER.attackChance]: 0 };

    expect(getCellWeight({ enemy: createEnemy('ogre') }, none)).toBe(1);
  });
});

describe('getCellWeights', () => {
  it('weighs each cell by what lies on it', () => {
    const weightOf = getCellWeights(
      { 3: createEnemy('beast') },
      { 4: PICKUP_TYPE.chest },
      modifiers,
    );

    expect(weightOf(3)).toBe(1.5);
    expect(weightOf(4)).toBe(0.5);
    expect(weightOf(5)).toBe(1);
  });
});
