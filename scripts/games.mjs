import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('..', import.meta.url));
export const gamesDir = fileURLToPath(new URL('../games', import.meta.url));

/** Game ids: every games/<id>/ folder that has its own index.html. */
export function listGames() {
  return readdirSync(gamesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => existsSync(`${gamesDir}/${id}/index.html`));
}
