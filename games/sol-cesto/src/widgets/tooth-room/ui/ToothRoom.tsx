import { useState } from 'react';

import {
  formatModifier,
  isToothPropertyHelpful,
  MODIFIERS,
  type Tooth,
  TOOTH_TYPES,
  type ToothProperty,
} from '@/entities/tooth';
import { chooseTooth, useToothChoiceStore } from '@/features/choose-tooth';

/** Frames of the preview, as on `design/reference4.png`: gold for buffs, red for debuffs. */
const PREVIEW_FRAMES = [
  { helpful: true, label: 'Посилення', frame: 'border-[#e8c46a]', text: 'text-[#e8c46a]' },
  { helpful: false, label: 'Послаблення', frame: 'border-[#c8323c]', text: 'text-[#e05a5a]' },
] as const;

/** What the tooth would change: its buffs in one frame, its debuffs in the other. */
function ToothPreview({ tooth }: { tooth: Tooth }) {
  return (
    <div className="flex w-[calc(600*var(--px))] flex-col gap-[calc(24*var(--px))]">
      {PREVIEW_FRAMES.map(({ helpful, label, frame, text }) => {
        const properties = tooth.properties.filter(
          (property: ToothProperty) => isToothPropertyHelpful(property) === helpful,
        );
        if (properties.length === 0) return null;
        return (
          <ul
            key={label}
            className={`flex flex-col gap-[calc(20*var(--px))] border-[length:calc(10*var(--px))] border-dotted bg-black px-[calc(24*var(--px))] py-[calc(28*var(--px))] text-center ${frame}`}
            aria-label={label}
          >
            {properties.map(({ modifier, value }) => (
              <li key={modifier} className="flex flex-col gap-[calc(6*var(--px))]">
                <span className={`text-[length:calc(26*var(--px))] leading-none ${text}`}>
                  {MODIFIERS[modifier].name}
                </span>
                <span className="text-[length:calc(36*var(--px))] leading-none font-bold text-[#f4ecd6]">
                  {formatModifier(value)}
                </span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

/**
 * The tooth room, as on `design/reference4.png`: a row of offered teeth. The tooth under the cursor
 * (or the taken one) shows its buffs and debuffs below; a click puts it into a random slot of the
 * mouth and opens the exit.
 */
export function ToothRoom() {
  const offers = useToothChoiceStore((state) => state.offers);
  const chosen = useToothChoiceStore((state) => state.chosen);
  const [hovered, setHovered] = useState<number | null>(null);
  const previewed = offers[hovered ?? chosen ?? -1];

  return (
    <main className="flex h-full flex-col items-center justify-center gap-[calc(60*var(--px))] bg-[#0b0b0b]">
      <h1 className="m-0 text-[length:calc(56*var(--px))] leading-none font-bold text-[#e8e2d4]">
        {chosen === null ? 'Оберіть зуб' : 'Двері відчинено'}
      </h1>
      <ul className="flex gap-[calc(48*var(--px))]">
        {offers.map((tooth, offer) => {
          const isChosen = chosen === offer;
          const { name } = TOOTH_TYPES[tooth.type];
          return (
            // Offers never move while the room is shown, so their position is a stable key.
            // eslint-disable-next-line react/no-array-index-key
            <li key={offer} className="flex flex-col items-center gap-[calc(16*var(--px))]">
              <button
                type="button"
                className={`h-[calc(190*var(--px))] w-[calc(150*var(--px))] cursor-pointer rounded-t-[calc(18*var(--px))] rounded-b-[calc(60*var(--px))] border-[length:calc(4*var(--px))] transition-[transform,box-shadow,opacity] focus-visible:outline-none enabled:hover:-translate-y-[calc(12*var(--px))] enabled:hover:shadow-[0_0_calc(48*var(--px))_#e8c46a] enabled:focus-visible:-translate-y-[calc(12*var(--px))] enabled:focus-visible:shadow-[0_0_calc(48*var(--px))_#e8c46a] disabled:cursor-default ${
                  // The taken tooth has flown into the mouth: only its outline is left.
                  isChosen
                    ? 'border-dashed border-[#e8c46a] bg-transparent'
                    : 'border-[#c9bb98] bg-[#f4ecd6] shadow-[inset_0_calc(-12*var(--px))_calc(16*var(--px))_rgba(150,130,90,0.45)]'
                } ${chosen !== null && !isChosen ? 'opacity-30' : ''}`}
                disabled={chosen !== null}
                aria-pressed={isChosen}
                aria-label={name}
                onClick={(event) =>
                  chooseTooth(offer, undefined, event.currentTarget.getBoundingClientRect())
                }
                onMouseEnter={() => setHovered(offer)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(offer)}
                onBlur={() => setHovered(null)}
              />
              <span className="text-[length:calc(26*var(--px))] leading-none text-[#c9c3b4]">
                {name}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="flex h-[calc(420*var(--px))] items-start">
        {previewed && <ToothPreview tooth={previewed} />}
      </div>
    </main>
  );
}
