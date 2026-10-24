// Usage: npm run game -- <game-id>
// Starts the Vite dev server for a single game from games/<game-id>/.
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

import { listGames } from './games.mjs';

const [id] = process.argv.slice(2);
const games = listGames();

if (!id || !games.includes(id)) {
  console.error(`Usage: npm run game -- <game-id>\nAvailable games: ${games.join(', ')}`);
  process.exit(1);
}

process.env.GAME = id;

const server = await createServer({
  configFile: fileURLToPath(new URL('../vite.config.mjs', import.meta.url)),
});
await server.listen();
server.printUrls();
server.bindCLIShortcuts({ print: true });
