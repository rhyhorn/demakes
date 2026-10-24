import type { CSSProperties } from 'react';

import { BOARD_SIZE } from '../config';
import styles from './DungeonBoard.module.css';

const CELL_IDS = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  return `${row}-${col}`;
});

const boardStyle = { '--board-size': BOARD_SIZE } as CSSProperties;

export function DungeonBoard() {
  return (
    <main className={styles.area}>
      <div className={styles.board} style={boardStyle} aria-label="Поле підземелля">
        {CELL_IDS.map((id) => (
          <div key={id} className={styles.cell} />
        ))}
      </div>
    </main>
  );
}
