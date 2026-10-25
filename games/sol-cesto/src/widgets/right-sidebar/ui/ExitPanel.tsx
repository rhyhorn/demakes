import { isExitOpen, useBoardStore } from '@/entities/board';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import { isToothRoomOpen, leaveToothRoom, useToothChoiceStore } from '@/features/choose-tooth';
import { enterNextRoom, exitLevel } from '@/features/level';
import { leaveShop } from '@/features/shop';
import { isUpgradeRoomOpen, leaveUpgradeRoom, useUpgradeStore } from '@/features/upgrade-attack';

import { useValueChange, VALUE_CHANGE } from '../lib/useValueChange';
import styles from './ExitPanel.module.css';
import { ValueChangeFlash } from './ValueChangeEffect';

/** A room that opens after a single choice: the counter shows `0/1` until it is made. */
function getChoiceExit(open: boolean, leaveRoom: () => boolean) {
  const leave = () => {
    if (leaveRoom()) enterNextRoom();
  };
  return { open, moves: open ? 1 : 0, requiredMoves: 1, leave };
}

/**
 * State of the exit door on the current screen: on a level it opens after the required moves, in
 * the upgrade and tooth rooms after the one choice, in the shop at once.
 */
function useExit() {
  const screen = useGameStore((state) => state.screen);
  const moves = useBoardStore((state) => state.moves);
  const requiredMoves = useBoardStore((state) => state.requiredMoves);
  const upgradeChosen = useUpgradeStore((state) => state.chosen);
  const toothChosen = useToothChoiceStore((state) => state.chosen);

  if (screen === GAME_SCREEN.upgrade) {
    return getChoiceExit(isUpgradeRoomOpen({ chosen: upgradeChosen }), leaveUpgradeRoom);
  }
  if (screen === GAME_SCREEN.tooth) {
    return getChoiceExit(isToothRoomOpen({ chosen: toothChosen }), () => leaveToothRoom());
  }
  if (screen === GAME_SCREEN.shop) {
    return getChoiceExit(true, () => leaveShop());
  }
  return {
    open: isExitOpen({ moves, requiredMoves }),
    moves,
    requiredMoves,
    leave: () => exitLevel(),
  };
}

const DOOR_HINT = { kind: HINT_TARGET.door } as const;

export function ExitPanel() {
  const { open: exitOpen, moves, requiredMoves, leave } = useExit();
  // The door opening is a gain (0 → 1), so the panel flashes like health or gold. Closing is not
  // shown: it only happens on the way to the next room.
  const { change } = useValueChange(exitOpen ? 1 : 0);
  const opened = change?.kind === VALUE_CHANGE.increase ? change : null;

  // The hint is on a wrapper: React gives no mouse events to the locked door, a disabled button.
  return (
    <div className="h-full w-full" {...getHintHandlers(DOOR_HINT)}>
      <button
        type="button"
        className={`${styles.panel} relative flex h-full w-full items-center justify-center p-[calc(16*var(--px))] [--gain-color:#ffd27a]`}
        disabled={!exitOpen}
        aria-label={
          exitOpen ? 'Вийти: двері відчинено' : `Двері зачинено. Ходи: ${moves} з ${requiredMoves}`
        }
        onClick={leave}
      >
        {opened && <ValueChangeFlash key={opened.id} change={opened} />}
        <div
          className={`relative flex items-center justify-center ${exitOpen ? styles.shaking : ''}`}
          aria-hidden="true"
        >
          <span
            className={`text-[length:calc(200*var(--px))] leading-none ${exitOpen ? '' : 'brightness-50'}`}
          >
            🚪
          </span>
          {/* The lock and the move counter go away with the lock: an open door needs neither. */}
          {!exitOpen && (
            <span className="absolute flex flex-col items-center gap-[calc(8*var(--px))] leading-none">
              <span className="text-[length:calc(64*var(--px))]">🔒</span>
              <span className="text-[length:calc(44*var(--px))] font-bold text-[#e8e2d4] [text-shadow:0_calc(3*var(--px))_0_#000]">
                {moves}/{requiredMoves}
              </span>
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
