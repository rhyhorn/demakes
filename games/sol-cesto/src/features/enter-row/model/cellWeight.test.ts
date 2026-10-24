import { describe, expect, it } from 'vitest';

import { createEnemy } from '@/entities/enemy';
import { MODIFIER } from '@/entities/modifier';

import { getCellWeight, getCellWeights } from './cellWeight';

const modifiers = { [MODIFIER.attackChance]: 50, [MODIFIER.magicChance]: 20 };

describe('getCellWeight', () => {
  it('weighs an empty cell as 1', () => {
    expect(getCellWeight(undefined, modifiers)).toBe(1);
  });

  it('adds the modifier of the active attack', () => {
    expect(getCellWeight(createEnemy('beast'), modifiers)).toBe(1.5);
    expect(
      getCellWeight(
        createEnemy('shifter', () => 0.999),
        modifiers,
      ),
    ).toBe(1.2);
  });

  it('weighs an enemy as 1 when its modifier is 0', () => {
    const none = { [MODIFIER.attackChance]: 0, [MODIFIER.magicChance]: 0 };

    expect(getCellWeight(createEnemy('ogre'), none)).toBe(1);
  });
});

describe('getCellWeights', () => {
  it('weighs each cell by the enemy on it', () => {
    const weightOf = getCellWeights({ 3: createEnemy('beast') }, modifiers);

    expect(weightOf(3)).toBe(1.5);
    expect(weightOf(4)).toBe(1);
  });
});
