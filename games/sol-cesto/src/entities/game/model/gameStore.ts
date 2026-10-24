import { create } from 'zustand';

/** Screens of the game. Only one is shown at a time, instead of the whole scene. */
export const GAME_SCREEN = {
  dungeon: 'dungeon',
  gameOver: 'game-over',
  /** A closed room where the hero raises her physical or magic attack before the exit opens. */
  upgrade: 'upgrade',
  /** The run is won: the hero has left the final level. */
  victory: 'victory',
} as const;

export type GameScreen = (typeof GAME_SCREEN)[keyof typeof GAME_SCREEN];

/** Screen the game opens on. The upgrade room for now, to try it out; later the dungeon. */
export const START_SCREEN: GameScreen = GAME_SCREEN.upgrade;

interface GameState {
  screen: GameScreen;
  showScreen: (screen: GameScreen) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  screen: START_SCREEN,
  showScreen: (screen) => set({ screen }),
}));
