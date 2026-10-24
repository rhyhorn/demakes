import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { startLevel } from '@/features/level';

import { App } from './App';
import './styles/index.css';

startLevel();

const root = document.querySelector<HTMLDivElement>('#app');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
