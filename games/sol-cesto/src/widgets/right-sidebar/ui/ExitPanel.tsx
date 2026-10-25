import { isExitOpen, useBoardStore } from '@/entities/board';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { enterNextRoom, exitLevel } from '@/features/level';
import { isUpgradeRoomOpen, leaveUpgradeRoom, useUpgradeStore } from '@/features/upgrade-attack';
import styles from './ExitPanel.module.css';

/**
 * State of the exit door on the current screen: on a level it opens after the required moves, in
 * the upgrade room after the one choice.
 */
function useExit() {
  const inUpgradeRoom = useGameStore((state) => state.screen === GAME_SCREEN.upgrade);
  const moves = useBoardStore((state) => state.moves);
  const requiredMoves = useBoardStore((state) => state.requiredMoves);
  const chosen = useUpgradeStore((state) => state.chosen);

  if (inUpgradeRoom) {
    const open = isUpgradeRoomOpen({ chosen });
    const leave = () => {
      if (leaveUpgradeRoom()) enterNextRoom();
    };
    return { open, moves: open ? 1 : 0, requiredMoves: 1, leave };
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
