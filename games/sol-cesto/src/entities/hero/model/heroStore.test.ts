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
});
