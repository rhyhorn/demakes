import './style.css';

interface Game {
  id: string;
  title: string;
  description: string;
  /** Cover illustration: a 4×4 board of emoji tiles, row by row. */
  cover: string[];
  /** The tile of the cover where the hero stands. */
  heroTile: number;
}

const games: Game[] = [
  {
    id: 'sol-cesto',
    title: 'Sol Cesto',
    description:
      'Рогалик у підземеллі 4×4: обирай рядок, ризикуй, збирай скрині й полуниці та чарівні зуби.',
    cover: [
      '🐺',
      '🍓',
      '🐺',
      '🦈',
      '👻',
      '🧝‍♀️',
      '🪎',
      '🍓',
      '🍓',
      '🪎',
      '🐺',
      '👹',
      '👻',
      '🐺',
      '🪎',
      '🍓',
    ],
    heroTile: 5,
  },
];

function createElement(tag: string, className: string, text?: string): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createCover({ cover, heroTile }: Game): HTMLElement {
  const board = createElement('div', 'cover');
  board.setAttribute('aria-hidden', 'true');
  cover.forEach((emoji, index) => {
    const tile = createElement('span', index === heroTile ? 'tile tile--hero' : 'tile', emoji);
    // Tiles bob one after another, so the board looks alive.
    tile.style.setProperty('--delay', `${(index % 4) * 0.25 + Math.floor(index / 4) * 0.4}s`);
    board.append(tile);
  });
  return board;
}

function createCard(game: Game): HTMLElement {
  // Relative, so the hub works under any subpath (e.g. GitHub Pages).
  const card = document.createElement('a');
  card.className = 'card';
  card.href = `games/${game.id}/`;

  const body = createElement('div', 'card__body');
  body.append(
    createElement('h2', 'card__title', game.title),
    createElement('p', 'card__description', game.description),
    createElement('span', 'card__play', 'Грати →'),
  );

  card.append(createCover(game), body);
  return card;
}

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const list = createElement('ul', 'games');
  games.forEach((game) => {
    const item = document.createElement('li');
    item.append(createCard(game));
    list.append(item);
  });

  app.append(createElement('h1', 'hub-title', 'Ігри'), list);
}
