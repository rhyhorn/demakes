import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import { TOOTH_TYPES, type ToothSlot, useToothStore } from '@/entities/tooth';

/** The top jaw holds the first half of the slots, the bottom one the rest. */
const JAWS = [
  { name: 'Верхня щелепа', shape: 'rounded-b-[calc(22*var(--px))] rounded-t-[calc(6*var(--px))]' },
  { name: 'Нижня щелепа', shape: 'rounded-t-[calc(22*var(--px))] rounded-b-[calc(6*var(--px))]' },
] as const;

interface ToothSlotViewProps {
  /** Position of the slot in the mouth. */
  index: number;
  slot: ToothSlot;
  shape: string;
}

/**
 * A slot: an ivory tooth when it holds one, a dark socket when it's empty. A tooth shows its
 * properties in the hint panel under the cursor.
 */
function ToothSlotView({ index, slot, shape }: ToothSlotViewProps) {
  const base = `h-full flex-1 border-[length:calc(2*var(--px))] ${shape}`;

  if (slot === null) {
    return (
      <li
        className={`${base} border-[#5a2a31] bg-[#4a1f26] shadow-[inset_0_calc(4*var(--px))_calc(8*var(--px))_rgba(20,0,5,0.7)]`}
        aria-label="Порожнє місце"
      />
    );
  }

  return (
    <li
      className={`${base} border-[#c9bb98] bg-[#f4ecd6] shadow-[inset_0_calc(-6*var(--px))_calc(8*var(--px))_rgba(150,130,90,0.45)]`}
      aria-label={TOOTH_TYPES[slot.type].name}
      {...getHintHandlers({ kind: HINT_TARGET.tooth, slot: index })}
    />
  );
}

/** The mouth: every slot may hold a tooth or stay empty. */
export function TeethPanel() {
  const slots = useToothStore((state) => state.slots);
  const perJaw = Math.ceil(slots.length / JAWS.length);
  const filled = slots.filter((slot) => slot !== null).length;

  return (
    <div
      className="flex h-full w-full flex-col justify-center gap-[calc(4*var(--px))] rounded-[calc(9*var(--px))] bg-[#7a3b44] px-[calc(10*var(--px))] py-[calc(8*var(--px))] shadow-[inset_0_0_calc(14*var(--px))_rgba(30,5,10,0.7)]"
      aria-label={`Зуби: ${filled} з ${slots.length}`}
    >
      {JAWS.map(({ name, shape }, jaw) => {
        const start = jaw * perJaw;

        return (
          <ul key={name} className="flex min-h-0 flex-1 gap-[calc(4*var(--px))]" aria-label={name}>
            {slots.slice(start, start + perJaw).map((slot, index) => (
              // Slots never move, so their position is a stable key.
              // eslint-disable-next-line react/no-array-index-key
              <ToothSlotView key={start + index} index={start + index} slot={slot} shape={shape} />
            ))}
          </ul>
        );
      })}
    </div>
  );
}
