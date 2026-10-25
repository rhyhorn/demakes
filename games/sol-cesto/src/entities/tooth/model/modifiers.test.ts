import { describe, expect, it } from 'vitest';

import { MODIFIER } from '../config/modifiers';
import { describeToothProperty, formatModifier } from './modifiers';

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
