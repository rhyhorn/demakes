import { isExitOpen, useBoardStore } from '@/entities/board';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { isToothRoomOpen, leaveToothRoom, useToothChoiceStore } from '@/features/choose-tooth';
import { enterNextRoom, exitLevel } from '@/features/level';
import { leaveShop } from '@/features/shop';
import { isUpgradeRoomOpen, leaveUpgradeRoom, useUpgradeStore } from '@/features/upgrade-attack';
import styles from './ExitPanel.module.css';

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

export function ExitPanel() {
  const { open: exitOpen, moves, requiredMoves, leave } = useExit();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[calc(16*var(--px))] p-[calc(16*var(--px))]">
      <div
        className={`relative flex h-[calc(170*var(--px))] items-center justify-center ${exitOpen ? styles.shaking : ''}`}
        role="img"
        aria-label={exitOpen ? 'Двері відчинено' : 'Двері зачинено'}
      >
        <span
          className={`text-[length:calc(150*var(--px))] leading-none ${exitOpen ? '' : 'brightness-50'}`}
          aria-hidden="true"
        >
          🚪
        </span>
        {!exitOpen && (
          <span
            className="absolute text-[length:calc(64*var(--px))] leading-none"
            aria-hidden="true"
          >
            🔒
          </span>
        )}
      </div>
      <span
        className="text-[length:calc(48*var(--px))] leading-none font-bold text-[#e8e2d4]"
        aria-label={`Ходи: ${moves} з ${requiredMoves}`}
      >
        {moves}/{requiredMoves}
      </span>
      <button
        type="button"
        className="cursor-pointer rounded-[calc(8*var(--px))] border-[length:calc(3*var(--px))] border-[#f4e3c1] bg-[#c8323c] px-[calc(40*var(--px))] py-[calc(12*var(--px))] text-[length:calc(32*var(--px))] font-bold text-[#f4e3c1] disabled:cursor-default disabled:border-[#3a3a36] disabled:bg-[#2b2b28] disabled:text-[#5c5f63]"
        disabled={!exitOpen}
        onClick={leave}
      >
        Вийти
      </button>
    </div>
  );
}
