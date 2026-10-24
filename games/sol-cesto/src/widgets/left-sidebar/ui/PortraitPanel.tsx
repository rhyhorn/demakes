import { useBoardStore } from '@/entities/board';

import { HintContent } from './HintContent';

/** Level number as on the reference: always at least two digits (01, 02, …). */
const formatLevel = (level: number) => String(level).padStart(2, '0');

export function PortraitPanel() {
  const level = useBoardStore((state) => state.level);

  return (
    <div className="flex h-full w-full flex-col gap-[calc(8*var(--px))] p-[calc(12*var(--px))]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex size-[calc(56*var(--px))] cursor-pointer items-center justify-center rounded-[calc(8*var(--px))] text-[length:calc(44*var(--px))] leading-none text-[#e8e2d4] hover:bg-[#2b3036]"
          aria-label="Налаштування"
        >
          <span aria-hidden="true">⚙</span>
        </button>
        <span
          className="text-[length:calc(48*var(--px))] leading-none font-bold text-[#e8e2d4]"
          aria-label={`Рівень ${level}`}
        >
          <span aria-hidden="true">{formatLevel(level)}</span>
        </span>
      </div>
      {/* Hint area: describes whatever the player hovers on the screen. */}
      <div
        className="flex min-h-0 flex-1 items-center justify-center p-[calc(16*var(--px))] rounded-[calc(16*var(--px))] border-[length:calc(6*var(--px))] border-[#c9a24a] bg-[#111316] shadow-[inset_0_0_calc(24*var(--px))_rgba(0,0,0,0.8)]"
        aria-label="Підказка"
        aria-live="polite"
      >
        <HintContent />
      </div>
    </div>
  );
}
