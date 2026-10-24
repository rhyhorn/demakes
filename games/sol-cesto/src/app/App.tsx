import type { ComponentType } from 'react';

import { GAME_SCREEN, type GameScreen, useGameStore } from '@/entities/game';
import { GameOverPage } from '@/pages/game-over';
import { HomePage } from '@/pages/home';

const SCREENS: Record<GameScreen, ComponentType> = {
  [GAME_SCREEN.dungeon]: HomePage,
  [GAME_SCREEN.gameOver]: GameOverPage,
};

export function App() {
  const Screen = SCREENS[useGameStore((state) => state.screen)];
  return <Screen />;
}
