import { restartGame } from '@/features/level';
import { SCENE_HEIGHT, SCENE_WIDTH } from '@/shared/config';
import { ScaledStage } from '@/shared/ui';

export function GameOverPage() {
  return (
    <ScaledStage width={SCENE_WIDTH} height={SCENE_HEIGHT}>
      <main className="flex h-full w-full flex-col items-center justify-center gap-[calc(64*var(--px))]">
        <h1 className="m-0 text-[length:calc(160*var(--px))] font-bold leading-none tracking-[0.05em] text-[#c8323c] uppercase">
          Game Over
        </h1>
        <button
          type="button"
          className="cursor-pointer rounded-[calc(8*var(--px))] border-[length:calc(3*var(--px))] border-[#77776c] bg-[#2b2b28] px-[calc(48*var(--px))] py-[calc(20*var(--px))] text-[length:calc(40*var(--px))] font-bold text-[#f4e3c1] hover:border-[#f4e3c1] hover:bg-[#3a3a36] focus-visible:border-[#f4e3c1] focus-visible:outline-none"
          onClick={() => restartGame()}
        >
          Почати спочатку
        </button>
      </main>
    </ScaledStage>
  );
}
