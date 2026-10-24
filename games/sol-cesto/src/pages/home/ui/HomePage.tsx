import { useState } from 'react';

import { GAME_TITLE, PLACEHOLDER_LINES } from '../../../shared/config';

function pickPlaceholder() {
  return PLACEHOLDER_LINES[Math.floor(Math.random() * PLACEHOLDER_LINES.length)] ?? '';
}

export function HomePage() {
  const [placeholder] = useState(pickPlaceholder);

  return (
    <main>
      <h1>{GAME_TITLE}</h1>
      <p>{placeholder}</p>
    </main>
  );
}
