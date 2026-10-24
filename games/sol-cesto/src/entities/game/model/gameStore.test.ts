import { beforeEach, describe, expect, it } from 'vitest';

import { GAME_SCREEN, useGameStore } from './gameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('starts on the dungeon screen', () => {
    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.dungeon);
  });

  it('switches to another screen', () => {
    useGameStore.getState().showScreen(GAME_SCREEN.gameOver);

    expect(useGameStore.getState().screen).toBe(GAME_SCREEN.gameOver);
  });
});
