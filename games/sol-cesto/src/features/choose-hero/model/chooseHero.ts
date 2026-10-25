import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { type HeroClass, useHeroStore } from '@/entities/hero';

/** The player picks the hero of the run: the hero takes the stats of the class and enters the dungeon. */
export function chooseHero(heroClass: HeroClass) {
  useHeroStore.getState().chooseHero(heroClass);
  useGameStore.getState().showScreen(GAME_SCREEN.dungeon);
}
