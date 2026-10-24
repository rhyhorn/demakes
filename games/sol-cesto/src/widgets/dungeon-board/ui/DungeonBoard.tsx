import type { CSSProperties } from 'react';

import { BOARD_SIZE, CELL_COUNT, useBoardStore } from '@/entities/board';

import styles from './DungeonBoard.module.css';

const CELL_IDS = Array.from({ length: CELL_COUNT }, (_, index) => {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  return `${row}-${col}`;
});

const boardStyle = { '--board-size': BOARD_SIZE } as CSSProperties;

export function DungeonBoard() {
  const cells = useBoardStore((state) => state.cells);

  return (
    <main className={styles.area}>
      <div className={styles.board} style={boardStyle} aria-label="Поле підземелля">
        {CELL_IDS.map((id, index) => (
          <div
            key={id}
            className="flex items-center justify-center rounded-[calc(4*var(--px))] border-[length:calc(2*var(--px))] border-[#3a3a36] bg-[#2b2b28] text-[length:calc(72*var(--px))] font-bold text-[#8a8f96]"
          >
            {cells[index]}
          </div>
        ))}
      </div>
    </main>
  );
}
