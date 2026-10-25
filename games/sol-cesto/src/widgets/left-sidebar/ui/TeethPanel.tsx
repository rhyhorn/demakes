import { type Ref, useRef } from 'react';

import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import { TOOTH_TYPES, type ToothSlot, useToothStore } from '@/entities/tooth';
import { landTooth, useToothChoiceStore } from '@/features/choose-tooth';

import { ToothProjectile } from './ToothProjectile';

/** The slot glows for a moment when a tooth from the tooth room lands in it. */
const LANDING_GLOW: Keyframe[] = [
  { boxShadow: '0 0 calc(28 * var(--px)) calc(6 * var(--px)) #e8c46a', transform: 'scale(1.15)' },
  { boxShadow: '0 0 0 0 transparent', transform: 'scale(1)' },
];

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
  ref: Ref<HTMLLIElement>;
}

/**
 * A slot: an ivory tooth when it holds one, a dark socket when it's empty. A tooth shows its
 * properties in the hint panel under the cursor.
 */
function ToothSlotView({ index, slot, shape, ref }: ToothSlotViewProps) {
  const base = `h-full flex-1 border-[length:calc(2*var(--px))] ${shape}`;

  if (slot === null) {
    return (
      <li
        ref={ref}
        className={`${base} border-[#5a2a31] bg-[#4a1f26] shadow-[inset_0_calc(4*var(--px))_calc(8*var(--px))_rgba(20,0,5,0.7)]`}
        aria-label="Порожнє місце"
      />
    );
  }

  return (
    <li
      ref={ref}
      className={`${base} border-[#c9bb98] bg-[#f4ecd6] shadow-[inset_0_calc(-6*var(--px))_calc(8*var(--px))_rgba(150,130,90,0.45)]`}
      aria-label={TOOTH_TYPES[slot.type].name}
      {...getHintHandlers({ kind: HINT_TARGET.tooth, slot: index })}
    />
  );
}

/**
 * The mouth: every slot may hold a tooth or stay empty. A tooth taken in the tooth room flies into
 * its slot, and the slot shows what it held before until the tooth lands.
 */
export function TeethPanel() {
  const slots = useToothStore((state) => state.slots);
  const flight = useToothChoiceStore((state) => state.flight);
  const slotElements = useRef<(HTMLLIElement | null)[]>([]);
  const shown = flight
    ? slots.map((slot, index) => (index === flight.slot ? flight.previous : slot))
    : slots;

  const land = () => {
    const element = flight && slotElements.current[flight.slot];
    landTooth();
    element?.animate(LANDING_GLOW, { duration: 450, easing: 'ease-out' });
  };
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
            {shown.slice(start, start + perJaw).map((slot, index) => (
              <ToothSlotView
                // Slots never move, so their position is a stable key.
                // eslint-disable-next-line react/no-array-index-key
                key={start + index}
                ref={(element) => {
                  slotElements.current[start + index] = element;
                }}
                index={start + index}
                slot={slot}
                shape={shape}
              />
            ))}
          </ul>
        );
      })}
      {flight && (
        <ToothProjectile
          from={flight.from}
          getTarget={() => slotElements.current[flight.slot] ?? null}
          onLand={land}
        />
      )}
    </div>
  );
}
