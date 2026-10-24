import { create } from 'zustand';

/** Screens of the game. Only one is shown at a time, instead of the whole scene. */
export const GAME_SCREEN = {
  dungeon: 'dungeon',
  gameOver: 'game-over',
} as const;

export type GameScreen = (typeof GAME_SCREEN)[keyof typeof GAME_SCREEN];

interface GameState {
  screen: GameScreen;
  showScreen: (screen: GameScreen) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  screen: GAME_SCREEN.dungeon,
  showScreen: (screen) => set({ screen }),
}));
