const games = [{ id: 'sol-cesto', title: 'Sol Cesto' }];

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const list = document.createElement('ul');

  games.forEach(({ id, title }) => {
    const link = document.createElement('a');
    // Relative, so the hub works under any subpath (e.g. GitHub Pages).
    link.href = `games/${id}/`;
    link.textContent = title;

    const item = document.createElement('li');
    item.append(link);
    list.append(item);
  });

  app.append(list);
}
