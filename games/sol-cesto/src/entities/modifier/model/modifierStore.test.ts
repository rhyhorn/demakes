import { beforeEach, describe, expect, it } from 'vitest';

import { MAX_MODIFIER, MIN_MODIFIER, MODIFIER } from '../config';
import { INITIAL_MODIFIERS, useModifierStore } from './modifierStore';

describe('useModifierStore', () => {
  beforeEach(() => {
    useModifierStore.setState(useModifierStore.getInitialState());
  });

  it('starts with +50% to physical enemies and nothing to magic ones', () => {
    expect(useModifierStore.getState().modifiers).toEqual({
      [MODIFIER.attackChance]: 50,
      [MODIFIER.magicChance]: 0,
    });
  });

  it('sets one modifier and keeps the rest', () => {
    useModifierStore.getState().setModifier(MODIFIER.magicChance, 30);

    expect(useModifierStore.getState().modifiers).toEqual({
      [MODIFIER.attackChance]: 50,
      [MODIFIER.magicChance]: 30,
    });
  });

  it('keeps modifiers within the allowed range', () => {
    const { setModifier } = useModifierStore.getState();

    setModifier(MODIFIER.attackChance, 150);
    setModifier(MODIFIER.magicChance, -20);

    expect(useModifierStore.getState().modifiers).toEqual({
      [MODIFIER.attackChance]: MAX_MODIFIER,
      [MODIFIER.magicChance]: MIN_MODIFIER,
    });
  });

  it('brings back the starting modifiers on reset', () => {
    useModifierStore.getState().setModifier(MODIFIER.attackChance, 0);

    useModifierStore.getState().reset();

    expect(useModifierStore.getState().modifiers).toEqual(INITIAL_MODIFIERS);
  });
});
