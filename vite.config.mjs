import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { gamesDir, listGames, projectRoot } from './scripts/games.mjs';

// GAME is set by scripts/game.mjs to serve one game on its own.
const game = process.env.GAME;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset URLs, so the build works under any subpath (e.g. GitHub Pages).
  base: './',
  // Each game maps its own aliases (e.g. `@/`) in games/<id>/tsconfig.json.
  resolve: { tsconfigPaths: true },
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
