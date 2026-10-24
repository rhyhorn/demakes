import { isExitOpen, useBoardStore } from '@/entities/board';
import { exitLevel } from '@/features/level';

export function ExitPanel() {
  const moves = useBoardStore((state) => state.moves);
  const requiredMoves = useBoardStore((state) => state.requiredMoves);
  const exitOpen = isExitOpen({ moves, requiredMoves });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[calc(16*var(--px))] p-[calc(16*var(--px))]">
      <div
        className="relative flex h-[calc(170*var(--px))] items-center justify-center"
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
        onClick={() => exitLevel()}
      >
        Вийти
      </button>
    </div>
  );
}
