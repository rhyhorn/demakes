import type { CSSProperties } from 'react';

import {
  BOARD_SIZE,
  getAvailableCells,
  getCellChance,
  getRowCells,
  useBoardStore,
} from '@/entities/board';
import { EnemyAttackBadge, EnemyFigure, useEnemyStore } from '@/entities/enemy';
import { enterRow } from '@/features/enter-row';

import styles from './DungeonBoard.module.css';

const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => ({
  row,
  cellIndices: getRowCells(row),
}));

const boardStyle = { '--board-size': BOARD_SIZE } as CSSProperties;

export function DungeonBoard() {
  const cells = useBoardStore((state) => state.cells);
  const playerIndex = useBoardStore((state) => state.playerIndex);
  const visited = useBoardStore((state) => state.visited);
  const enemies = useEnemyStore((state) => state.enemies);

  return (
    <main className={styles.area}>
      <div className={styles.board} style={boardStyle} aria-label="Поле підземелля">
        {ROWS.map(({ row, cellIndices }) => (
          <button
            key={row}
            type="button"
            className="group col-span-full grid cursor-pointer grid-cols-subgrid disabled:cursor-default"
            disabled={getAvailableCells(row, visited).length === 0}
            aria-label={`Рядок ${row + 1}`}
            onClick={() => enterRow(row)}
          >
            {cellIndices.map((index) => {
              const chance = getCellChance(index, visited);
              const enemy = enemies[index];

              return (
                <div
                  key={index}
                  className={`relative flex items-center justify-center rounded-[calc(4*var(--px))] border-[length:calc(2*var(--px))] border-[#3a3a36] bg-[#2b2b28] group-enabled:group-hover:border-[#77776c] ${
                    visited.includes(index) && index !== playerIndex ? 'opacity-40' : ''
                  }`}
                >
                  {enemy ? (
                    <>
                      <EnemyAttackBadge enemy={enemy} />
                      <EnemyFigure enemy={enemy} />
                    </>
                  ) : (
                    <span className="absolute top-[calc(16*var(--px))] left-[calc(20*var(--px))] text-[length:calc(40*var(--px))] font-bold text-[#8a8f96]">
                      {cells[index]}
                    </span>
                  )}
                  {chance > 0 && (
                    <span className="absolute top-[calc(16*var(--px))] right-[calc(20*var(--px))] rounded-full bg-[#1a1d21] px-[calc(14*var(--px))] text-[length:calc(32*var(--px))] font-bold text-[#e8e2d4]">
                      {Math.round(chance * 100)}%
                    </span>
                  )}
                  {index === playerIndex && (
                    <span className="absolute size-[calc(110*var(--px))] rounded-full border-[length:calc(6*var(--px))] border-[#f4e3c1] bg-[#c8323c]" />
                  )}
                </div>
              );
            })}
          </button>
        ))}
      </div>
    </main>
  );
}
