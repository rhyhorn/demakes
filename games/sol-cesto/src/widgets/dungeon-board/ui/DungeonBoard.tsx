import { type CSSProperties, useEffect, useRef, useState } from 'react';

import {
  BOARD_SIZE,
  getAvailableCells,
  getCellChance,
  getRowCells,
  registerBoardCell,
  useBoardStore,
} from '@/entities/board';
import { ENEMY_TYPES, EnemyAttackBadge, EnemyFigure, useEnemyStore } from '@/entities/enemy';
import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import { HeroFigure, useHeroStore } from '@/entities/hero';
import {
  PICKUP_TYPE,
  PickupBadge,
  PickupFigure,
  type PickupType,
  usePickupStore,
} from '@/entities/pickup';
import { getTeethModifiers, useToothStore } from '@/entities/tooth';
import { TrapBadge, TrapFigure, useTrapStore } from '@/entities/trap';
import {
  CellOutcomeBadge,
  enterCell,
  finishDeath,
  getCellOutcome,
  getCellWeights,
  pickEntryCell,
} from '@/features/enter-row';
import {
  applyAimedItem,
  cancelItemAim,
  fireAimedItem,
  getRowItemTargets,
  ITEM_AIM,
  useItemAimStore,
} from '@/features/inventory';
import { Badge } from '@/shared/ui';

import { useCellRemovals } from '../lib/useCellRemovals';
import { useHeroHit } from '../lib/useHeroHit';
import { useHeroMoveAnimation } from '../lib/useHeroMoveAnimation';
import { CellVanishEffect, VANISH_TONE } from './CellVanishEffect';
import styles from './DungeonBoard.module.css';

const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => ({
  row,
  cellIndices: getRowCells(row),
}));

/** What floats up from a taken pickup: what it gave the hero. */
const PICKUP_VANISH_ICONS: Record<PickupType, string> = {
  [PICKUP_TYPE.strawberry]: '❤️',
  [PICKUP_TYPE.chest]: '🪙',
};

const boardStyle = { '--board-size': BOARD_SIZE } as CSSProperties;

/**
 * While the player hovers (or focuses) a row, its cells swap the enemy attack or the pickup effect for
 * the outcome of a move and show the chance, as on `design/reference2.png`.
 */
const SHOW_ON_HOVER = 'hidden group-enabled:group-hover:contents group-focus-visible:contents';
const HIDE_ON_HOVER = 'group-enabled:group-hover:hidden group-focus-visible:hidden';
/** A hovered row the hero would walk into turns grey. */
const WALK_HOVER =
  'group-enabled:group-hover:border-[#77776c] group-enabled:group-hover:bg-[#3a3a36]';
/**
 * While an item is aimed, every enemy it can hit has a dim red frame, so the player sees the targets
 * at once, and what it would hit now lights up bright red: the enemy under the cursor (or focused)
 * for an arrow, every enemy of the hovered row for a whirlwind. The hovered row itself turns grey,
 * as when the hero would walk into it.
 */
const AIM_FRAME =
  'absolute inset-0 z-20 rounded-[calc(4*var(--px))] border-[calc(2*var(--px))] border-transparent';
const ROW_ENEMY_AIM =
  'group-enabled:border-[#e0533d]/50 group-enabled:bg-[#e0533d]/10 group-enabled:group-hover:border-[#ff6a4d] group-enabled:group-hover:bg-[#e0533d]/35 group-focus-visible:border-[#ff6a4d] group-focus-visible:bg-[#e0533d]/35';
const ENEMY_AIM =
  'enabled:border-[#e0533d]/50 enabled:bg-[#e0533d]/10 enabled:hover:border-[#ff6a4d] enabled:hover:bg-[#e0533d]/35 focus-visible:border-[#ff6a4d] focus-visible:bg-[#e0533d]/35';

export function DungeonBoard() {
  const playerIndex = useBoardStore((state) => state.playerIndex);
  const visited = useBoardStore((state) => state.visited);
  const enemies = useEnemyStore((state) => state.enemies);
  const pickups = usePickupStore((state) => state.pickups);
  const traps = useTrapStore((state) => state.traps);
  const health = useHeroStore((state) => state.health);
  const attack = useHeroStore((state) => state.attack);
  const magic = useHeroStore((state) => state.magic);
  const teeth = useToothStore((state) => state.slots);
  const deaths = useCellRemovals(enemies, visited);
  const takenPickups = useCellRemovals(pickups, visited);
  const weightOf = getCellWeights(enemies, pickups, traps, getTeethModifiers(teeth));
  const heroRef = useRef<HTMLSpanElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Cell the hero is walking to. The move itself happens once she gets there.
  const [destination, setDestination] = useState<number | null>(null);
  const heroIndex = destination ?? playerIndex;
  // Her health has run out: the board plays her death, then the game is over.
  const isDead = health === 0;
  // An item is aimed: clicking a row with enemies (a whirlwind) or an enemy (an arrow) uses it
  // there instead of moving the hero.
  const aim = useItemAimStore((state) => state.aiming?.aim ?? null);
  const isAiming = aim !== null;
  const isShooting = useItemAimStore((state) => state.shot !== null);
  const aimTargets = getRowItemTargets(enemies);
  // A hit that doesn't kill her makes her flash red; a deadly one plays her death instead.
  const { hitId, finishHit } = useHeroHit(health);
  let heroAnimationClass: string | undefined;
  if (isDead) heroAnimationClass = styles.heroDeath;
  else if (hitId !== null) heroAnimationClass = styles.heroHit;
  // Escape puts the aimed item back, and so does leaving the board.
  useEffect(() => {
    if (!isAiming) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancelItemAim();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAiming]);
  useEffect(() => cancelItemAim, []);

  useHeroMoveAnimation(heroIndex, heroRef, cellRefs, () => {
    if (destination === null) return;
    enterCell(destination);
    setDestination(null);
  });

  const renderCell = (index: number) => {
    const chance = getCellChance(index, visited, weightOf);
    const enemy = enemies[index];
    const pickup = pickups[index];
    const trap = traps[index];
    // While aiming there is no move to preview.
    const canEnter = chance > 0 && !isAiming;
    const isEnemyTarget = aim === ITEM_AIM.enemy && enemy !== undefined;
    const isRowEnemyTarget = aim === ITEM_AIM.row && enemy !== undefined;

    return (
      <div
        key={index}
        ref={(element) => {
          cellRefs.current[index] = element;
          registerBoardCell(index, element);
        }}
        className={`relative flex items-center justify-center rounded-[calc(4*var(--px))] border-[calc(2*var(--px))] border-[#3a3a36] bg-[#2b2b28] ${WALK_HOVER} ${visited.includes(index) && index !== playerIndex ? 'opacity-40' : ''}`}
        {...getHintHandlers({ kind: HINT_TARGET.cell, index })}
      >
        <span className={canEnter ? HIDE_ON_HOVER : ''}>
          {enemy && <EnemyAttackBadge enemy={enemy} />}
          {pickup && <PickupBadge type={pickup} />}
          {trap && <TrapBadge type={trap} />}
        </span>
        {enemy && <EnemyFigure enemy={enemy} />}
        {isEnemyTarget && (
          // The rows are plain while an arrow is aimed, so each enemy is a target of its own.
          <button
            type="button"
            className={`${AIM_FRAME} cursor-crosshair outline-none disabled:cursor-default ${ENEMY_AIM}`}
            disabled={isDead || destination !== null || isShooting}
            aria-label={`Вистрілити: ${ENEMY_TYPES[enemy.type].name}`}
            onClick={() => fireAimedItem(index)}
          />
        )}
        {isRowEnemyTarget && (
          // The whole row is the button, so the frame only shows what the whirlwind sweeps away.
          <span
            className={`pointer-events-none ${AIM_FRAME} ${ROW_ENEMY_AIM}`}
            aria-hidden="true"
          />
        )}
        {pickup && <PickupFigure type={pickup} />}
        {trap && <TrapFigure type={trap} />}
        {canEnter && (
          <span className={SHOW_ON_HOVER}>
            <CellOutcomeBadge
              outcome={getCellOutcome({ enemy, trap }, { health, attack, magic })}
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
        {deaths.removals
          .filter((death) => death.cell === index)
          .map((death) => (
            <CellVanishEffect
              key={`enemy-${death.id}`}
              tone={VANISH_TONE.negative}
              icon="💀"
              onFinish={() => deaths.finishRemoval(death.id)}
            >
              <EnemyFigure enemy={death.item} />
            </CellVanishEffect>
          ))}
        {takenPickups.removals
          .filter((taken) => taken.cell === index)
          .map((taken) => (
            <CellVanishEffect
              key={`pickup-${taken.id}`}
              tone={VANISH_TONE.positive}
              icon={PICKUP_VANISH_ICONS[taken.item]}
              onFinish={() => takenPickups.finishRemoval(taken.id)}
            >
              <PickupFigure type={taken.item} />
            </CellVanishEffect>
          ))}
        {index === heroIndex && (
          // Over whatever is in the cell she walks to, above the other cells she walks
          // over, and doesn't steal their hover.
          <span
            ref={heroRef}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <span
              // A new key restarts the hit animation when she is hit again.
              key={hitId ?? 'idle'}
              className={heroAnimationClass}
              onAnimationEnd={(event) => {
                if (event.target !== event.currentTarget) return;
                if (isDead) finishDeath();
                else finishHit();
              }}
            >
              <HeroFigure size={90} />
            </span>
          </span>
        )}
      </div>
    );
  };

  return (
    <main className={styles.area}>
      {isDead && <div className={styles.deathShade} aria-hidden="true" />}
      <div className={styles.board} style={boardStyle} aria-label="Поле підземелля">
        {ROWS.map(({ row, cellIndices }) =>
          aim === ITEM_AIM.enemy ? (
            <div key={row} className="col-span-full grid grid-cols-subgrid">
              {cellIndices.map(renderCell)}
            </div>
          ) : (
            <button
              key={row}
              type="button"
              className={`group col-span-full grid grid-cols-subgrid disabled:cursor-default ${
                aim === ITEM_AIM.row ? 'cursor-crosshair' : 'cursor-pointer'
              }`}
              disabled={
                isDead ||
                destination !== null ||
                isShooting ||
                (isAiming
                  ? !aimTargets.includes(row)
                  : getAvailableCells(row, visited).length === 0)
              }
              aria-label={isAiming ? `Змести ворогів у рядку ${row + 1}` : `Рядок ${row + 1}`}
              onClick={() => {
                if (isAiming) applyAimedItem(row);
                else setDestination(pickEntryCell(row) ?? null);
              }}
            >
              {cellIndices.map(renderCell)}
            </button>
          ),
        )}
      </div>
    </main>
  );
}
