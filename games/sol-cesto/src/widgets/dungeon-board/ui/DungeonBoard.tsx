import { type CSSProperties, useRef, useState } from 'react';

import {
  BOARD_SIZE,
  getAvailableCells,
  getCellChance,
  getRowCells,
  registerBoardCell,
  useBoardStore,
} from '@/entities/board';
import { EnemyAttackBadge, EnemyFigure, useEnemyStore } from '@/entities/enemy';
import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import { HeroFigure, useHeroStore } from '@/entities/hero';
import { PickupBadge, PickupFigure, usePickupStore } from '@/entities/pickup';
import { getTeethModifiers, useToothStore } from '@/entities/tooth';
import {
  CellOutcomeBadge,
  enterCell,
  getCellOutcome,
  getCellWeights,
  pickEntryCell,
} from '@/features/enter-row';
import { Badge } from '@/shared/ui';

import { useEnemyDeaths } from '../lib/useEnemyDeaths';
import { useHeroMoveAnimation } from '../lib/useHeroMoveAnimation';
import styles from './DungeonBoard.module.css';
import { EnemyDeathEffect } from './EnemyDeathEffect';

const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => ({
  row,
  cellIndices: getRowCells(row),
}));

const boardStyle = { '--board-size': BOARD_SIZE } as CSSProperties;

/**
 * While the player hovers (or focuses) a row, its cells swap the enemy attack or the pickup effect for
 * the outcome of a move and show the chance, as on `design/reference2.png`.
 */
const SHOW_ON_HOVER = 'hidden group-enabled:group-hover:contents group-focus-visible:contents';
const HIDE_ON_HOVER = 'group-enabled:group-hover:hidden group-focus-visible:hidden';

export function DungeonBoard() {
  const playerIndex = useBoardStore((state) => state.playerIndex);
  const visited = useBoardStore((state) => state.visited);
  const enemies = useEnemyStore((state) => state.enemies);
  const pickups = usePickupStore((state) => state.pickups);
  const health = useHeroStore((state) => state.health);
  const attack = useHeroStore((state) => state.attack);
  const magic = useHeroStore((state) => state.magic);
  const teeth = useToothStore((state) => state.slots);
  const { deaths, finishDeath } = useEnemyDeaths(enemies, visited);
  const weightOf = getCellWeights(enemies, pickups, getTeethModifiers(teeth));
  const heroRef = useRef<HTMLSpanElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Cell the hero is walking to. The move itself happens once she gets there.
  const [destination, setDestination] = useState<number | null>(null);
  const heroIndex = destination ?? playerIndex;
  useHeroMoveAnimation(heroIndex, heroRef, cellRefs, () => {
    if (destination === null) return;
    enterCell(destination);
    setDestination(null);
  });

  return (
    <main className={styles.area}>
      <div className={styles.board} style={boardStyle} aria-label="Поле підземелля">
        {ROWS.map(({ row, cellIndices }) => (
          <button
            key={row}
            type="button"
            className="group col-span-full grid cursor-pointer grid-cols-subgrid disabled:cursor-default"
            disabled={destination !== null || getAvailableCells(row, visited).length === 0}
            aria-label={`Рядок ${row + 1}`}
            onClick={() => setDestination(pickEntryCell(row) ?? null)}
          >
            {cellIndices.map((index) => {
              const chance = getCellChance(index, visited, weightOf);
              const enemy = enemies[index];
              const pickup = pickups[index];
              const canEnter = chance > 0;

              return (
                <div
                  key={index}
                  ref={(element) => {
                    cellRefs.current[index] = element;
                    registerBoardCell(index, element);
                  }}
                  className={`relative flex items-center justify-center rounded-[calc(4*var(--px))] border-[calc(2*var(--px))] border-[#3a3a36] bg-[#2b2b28] group-enabled:group-hover:border-[#77776c] group-enabled:group-hover:bg-[#3a3a36] ${
                    visited.includes(index) && index !== playerIndex ? 'opacity-40' : ''
                  }`}
                  {...getHintHandlers({ kind: HINT_TARGET.cell, index })}
                >
                  <span className={canEnter ? HIDE_ON_HOVER : ''}>
                    {enemy && <EnemyAttackBadge enemy={enemy} />}
                    {pickup && <PickupBadge type={pickup} />}
                  </span>
                  {enemy && <EnemyFigure enemy={enemy} />}
                  {pickup && <PickupFigure type={pickup} />}
                  {canEnter && (
                    <span className={SHOW_ON_HOVER}>
                      <CellOutcomeBadge
                        outcome={getCellOutcome(enemy, {
                          health,
                          attack,
                          magic,
                        })}
                      />
                      <Badge
                        corner="right"
                        label={`Шанс: ${Math.round(chance * 100)}%`}
                        className="bg-[#1a1d21] text-[#e8e2d4]"
                      >
                        <span aria-hidden="true">{Math.round(chance * 100)}%</span>
                      </Badge>
                    </span>
                  )}
                  {deaths
                    .filter((death) => death.cell === index)
                    .map((death) => (
                      <EnemyDeathEffect
                        key={death.id}
                        enemy={death.enemy}
                        onFinish={() => finishDeath(death.id)}
                      />
                    ))}
                  {index === heroIndex && (
                    // Over whatever is in the cell she walks to, above the other cells she walks
                    // over, and doesn't steal their hover.
                    <span
                      ref={heroRef}
                      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                    >
                      <HeroFigure size={90} />
                    </span>
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
