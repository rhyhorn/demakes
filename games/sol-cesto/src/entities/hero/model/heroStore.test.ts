import { beforeEach, describe, expect, it } from 'vitest';

import { INITIAL_HERO_STATS, useHeroStore } from './heroStore';

describe('useHeroStore', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
  });

  it('starts with full health and base attack and magic', () => {
    const { health, maxHealth, attack, magic } = useHeroStore.getState();

    expect({ health, maxHealth, attack, magic }).toEqual(INITIAL_HERO_STATS);
    expect(health).toBe(maxHealth);
  });

  it('loses health from damage', () => {
    useHeroStore.getState().takeDamage(2);

    expect(useHeroStore.getState().health).toBe(3);
  });

  it('never drops health below 0', () => {
    useHeroStore.getState().takeDamage(99);

    expect(useHeroStore.getState().health).toBe(0);
  });

  it('ignores damage of 0 or less', () => {
    const before = useHeroStore.getState();

    useHeroStore.getState().takeDamage(0);
    useHeroStore.getState().takeDamage(-1);

    expect(useHeroStore.getState()).toBe(before);
  });
});
