import { beforeEach, describe, expect, it } from 'vitest';

import { INITIAL_HERO_STATS, useHeroStore } from './heroStore';

describe('useHeroStore', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
  });

  it('starts with full health, base attack and magic and no gold', () => {
    const { health, maxHealth, attack, magic, gold } = useHeroStore.getState();

    expect({ health, maxHealth, attack, magic, gold }).toEqual(INITIAL_HERO_STATS);
    expect(health).toBe(maxHealth);
    expect(gold).toBe(0);
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

  it('gets health back from healing', () => {
    useHeroStore.setState({ health: 3 });

    useHeroStore.getState().heal(1);

    expect(useHeroStore.getState().health).toBe(4);
  });

  it('never heals above max health', () => {
    useHeroStore.setState({ health: 4 });

    useHeroStore.getState().heal(9);

    expect(useHeroStore.getState().health).toBe(INITIAL_HERO_STATS.maxHealth);
  });

  it('ignores healing of 0 or less', () => {
    const before = useHeroStore.getState();

    useHeroStore.getState().heal(0);
    useHeroStore.getState().heal(-1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('adds gold to the piggy bank', () => {
    useHeroStore.setState({ gold: 2 });

    useHeroStore.getState().addGold(4);

    expect(useHeroStore.getState().gold).toBe(6);
  });

  it('ignores gold of 0 or less', () => {
    const before = useHeroStore.getState();

    useHeroStore.getState().addGold(0);
    useHeroStore.getState().addGold(-1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('brings back the starting stats on reset', () => {
    useHeroStore.getState().takeDamage(3);
    useHeroStore.getState().addGold(5);

    useHeroStore.getState().reset();
    const { health, maxHealth, attack, magic, gold } = useHeroStore.getState();

    expect({ health, maxHealth, attack, magic, gold }).toEqual(INITIAL_HERO_STATS);
  });
});
