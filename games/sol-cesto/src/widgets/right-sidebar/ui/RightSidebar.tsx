import { isExitOpen, useBoardStore } from '@/entities/board';
import { exitLevel } from '@/features/level';

import { HeroPanel } from './HeroPanel';
import styles from './RightSidebar.module.css';

export function RightSidebar() {
  const moves = useBoardStore((state) => state.moves);
  const requiredMoves = useBoardStore((state) => state.requiredMoves);
  const exitOpen = isExitOpen({ moves, requiredMoves });

  return (
    <aside className={styles.sidebar} aria-label="Права панель">
      <section className={styles.slot} aria-label="Героїня">
        <HeroPanel />
      </section>
      <section className={`${styles.slot} flex-col gap-[calc(24*var(--px))]`} aria-label="Двері">
        <span
          className="text-[length:calc(64*var(--px))] font-bold text-[#e8e2d4]"
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
      </section>
      <section className={styles.slot}>Скарбничка</section>
    </aside>
  );
}
