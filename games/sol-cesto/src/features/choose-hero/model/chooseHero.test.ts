import { beforeEach, describe, expect, it } from 'vitest';

import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { HERO_CLASS, HERO_CLASSES, useHeroStore } from '@/entities/hero';

import { chooseHero } from './chooseHero';

describe('chooseHero', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
    useGameStore.setState({ screen: GAME_SCREEN.heroSelect });
  });

  it('makes the warrior with two attack and one magic', () => {
    chooseHero(HERO_CLASS.warrior);

    expect(useHeroStore.getState()).toMatchObject({
      heroClass: HERO_CLASS.warrior,
      attack: 2,
      magic: 1,
    });
  });

  it('makes the sorceress with one attack and two magic', () => {
    chooseHero(HERO_CLASS.sorceress);

    expect(useHeroStore.getState()).toMatchObject({
      heroClass: HERO_CLASS.sorceress,
      attack: 1,
      magic: 2,
      health: HERO_CLASSES.sorceress.stats.maxHealth,
    });
  });

  it('takes the hero into the dungeon', () => {
    chooseHero(HERO_CLASS.sorceress);

    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
  });
});
