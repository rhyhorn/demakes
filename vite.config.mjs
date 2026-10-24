import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { gamesDir, listGames, projectRoot } from './scripts/games.mjs';

// GAME is set by scripts/game.mjs to serve one game on its own.
const game = process.env.GAME;

export default defineConfig({
  plugins: [react()],
  ...(game
    ? { root: resolve(gamesDir, game) }
    : {
        root: projectRoot,
        build: {
          rollupOptions: {
            input: {
              main: resolve(projectRoot, 'index.html'),
              ...Object.fromEntries(
                listGames().map((id) => [id, resolve(gamesDir, id, 'index.html')]),
              ),
            },
          },
        },
      }),
});
