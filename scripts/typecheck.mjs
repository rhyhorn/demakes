// Type-checks the hub (tsconfig.json) and every game (games/<id>/tsconfig.json).
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { gamesDir, listGames, projectRoot } from './games.mjs';

const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
const projects = [projectRoot, ...listGames().map((id) => resolve(gamesDir, id))];

let failed = false;
projects.forEach((project) => {
  const { status } = spawnSync(process.execPath, [tsc, '--noEmit', '-p', project], {
    stdio: 'inherit',
  });
  if (status !== 0) failed = true;
});

process.exit(failed ? 1 : 0);
