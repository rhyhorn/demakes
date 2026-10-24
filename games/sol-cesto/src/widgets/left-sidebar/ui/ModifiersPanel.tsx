import { MODIFIER, type Modifier, MODIFIERS, useModifierStore } from '@/entities/modifier';

/** Modifiers on each page of the book, top to bottom, as on the reference. */
const PAGES: readonly (readonly Modifier[])[] = [[MODIFIER.attackChance], [MODIFIER.magicChance]];

function ModifierRow({ modifier }: { modifier: Modifier }) {
  const value = useModifierStore((state) => state.modifiers[modifier]);
  const { name, icon, color } = MODIFIERS[modifier];

  return (
    <li
      className="flex items-center justify-between gap-[calc(8*var(--px))]"
      aria-label={`${name}: +${value}%`}
    >
      <span className={`text-[length:calc(48*var(--px))] leading-none ${color}`} aria-hidden="true">
        {icon}
      </span>
      <span
        className="text-[length:calc(26*var(--px))] font-bold text-[#3b3226]"
        aria-hidden="true"
      >
        +{value}%
      </span>
    </li>
  );
}

/** The book of modifiers: two open pages with an icon and a percentage per row. */
export function ModifiersPanel() {
  return (
    <div
      className="grid h-full w-full grid-cols-2 gap-[calc(4*var(--px))] p-[calc(12*var(--px))]"
      aria-label="Модифікатори"
    >
      {PAGES.map((modifiers, page) => (
        <ul
          // Pages never move, so their position is a stable key.
          // eslint-disable-next-line react/no-array-index-key
          key={page}
          className="flex flex-col gap-[calc(12*var(--px))] rounded-[calc(8*var(--px))] bg-[#e8dcc0] p-[calc(14*var(--px))] shadow-[inset_0_0_calc(12*var(--px))_rgba(90,70,40,0.5)]"
        >
          {modifiers.map((modifier) => (
            <ModifierRow key={modifier} modifier={modifier} />
          ))}
        </ul>
      ))}
    </div>
  );
}
