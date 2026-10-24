import { describe, expect, it } from 'vitest';

import { createEnemy } from '@/entities/enemy';

import { getCellOutcome } from './cellOutcome';

describe('getCellOutcome', () => {
  const hero = { health: 5, attack: 2, magic: 1 };

  it('is safe on a cell without an enemy', () => {
    expect(getCellOutcome(undefined, hero)).toEqual({ kind: 'safe' });
  });

  it('is safe when the enemy deals no damage', () => {
    // A shifter in its magic form (🌀1) is no stronger than the hero's magic.
    expect(
      getCellOutcome(
        createEnemy('shifter', () => 0.999),
        hero,
      ),
    ).toEqual({ kind: 'safe' });
  });

  it('is damage when the hero survives the hit', () => {
    expect(getCellOutcome(createEnemy('beast'), hero)).toEqual({ kind: 'damage', damage: 1 });
  });

  it('is death when the hit takes health to 0 or below', () => {
    expect(getCellOutcome(createEnemy('beast'), { ...hero, health: 1 })).toEqual({
      kind: 'death',
      damage: 1,
    });
    expect(
      getCellOutcome({ type: 'beast', attack: 9, magic: 0, activeAttack: 'attack' }, hero),
    ).toEqual({ kind: 'death', damage: 7 });
  });
});
