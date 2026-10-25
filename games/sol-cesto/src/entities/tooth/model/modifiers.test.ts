import { describe, expect, it } from 'vitest';

import { MODIFIER } from '../config/modifiers';
import { describeToothProperty, formatModifier, isToothPropertyHelpful } from './modifiers';

describe('formatModifier', () => {
  it('always shows the sign', () => {
    expect(formatModifier(50)).toBe('+50%');
    expect(formatModifier(-50)).toBe('-50%');
    expect(formatModifier(0)).toBe('+0%');
  });
});

describe('describeToothProperty', () => {
  it('shows the icon of the modifier and the percentage', () => {
    expect(describeToothProperty({ modifier: MODIFIER.attackChance, value: 50 })).toBe('🗡 +50%');
    expect(describeToothProperty({ modifier: MODIFIER.strawberryChance, value: -50 })).toBe(
      '🍓 -50%',
    );
  });
});

describe('isToothPropertyHelpful', () => {
  it('counts more strawberries and chests as a buff', () => {
    expect(isToothPropertyHelpful({ modifier: MODIFIER.strawberryChance, value: 25 })).toBe(true);
    expect(isToothPropertyHelpful({ modifier: MODIFIER.chestChance, value: -25 })).toBe(false);
  });

  it('counts more enemies as a debuff', () => {
    expect(isToothPropertyHelpful({ modifier: MODIFIER.attackChance, value: 50 })).toBe(false);
    expect(isToothPropertyHelpful({ modifier: MODIFIER.magicChance, value: -50 })).toBe(true);
  });
});
