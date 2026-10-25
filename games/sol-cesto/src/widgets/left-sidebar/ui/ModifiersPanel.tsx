import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import {
  getTeethModifiers,
  MODIFIER,
  type Modifier,
  formatModifier,
  MODIFIERS,
  useToothStore,
} from '@/entities/tooth';

/** Modifiers on each page of the book, top to bottom, as on the reference. */
const PAGES: readonly (readonly Modifier[])[] = [
  [MODIFIER.attackChance, MODIFIER.strawberryChance],
  [MODIFIER.magicChance, MODIFIER.chestChance],
];

function ModifierRow({ modifier, value }: { modifier: Modifier; value: number }) {
  const { name, icon, color } = MODIFIERS[modifier];

  return (
    <li
      className="flex items-center justify-between gap-[calc(8*var(--px))]"
      aria-label={`${name}: ${formatModifier(value)}`}
      {...getHintHandlers({ kind: HINT_TARGET.modifier, modifier })}
    >
      <span className={`text-[length:calc(48*var(--px))] leading-none ${color}`} aria-hidden="true">
        {icon}
      </span>
      <span
        className="text-[length:calc(26*var(--px))] font-bold text-[#3b3226]"
        aria-hidden="true"
      >
        {formatModifier(value)}
      </span>
    </li>
  );
}

/**
 * The book of modifiers: two open pages with an icon and a percentage per row. The percentages are
 * the properties of the teeth in the mouth added up.
 */
export function ModifiersPanel() {
  const teeth = useToothStore((state) => state.slots);
  const total = getTeethModifiers(teeth);

  return (
    <div
      className="grid h-full w-full grid-cols-2 gap-[calc(4*var(--px))] p-[calc(12*var(--px))]"
      aria-label="Модифікатори"
    >
      {PAGES.map((page, pageIndex) => (
        <ul
          // Pages never move, so their position is a stable key.
          // eslint-disable-next-line react/no-array-index-key
          key={pageIndex}
          className="flex flex-col gap-[calc(12*var(--px))] rounded-[calc(8*var(--px))] bg-[#e8dcc0] p-[calc(14*var(--px))] shadow-[inset_0_0_calc(12*var(--px))_rgba(90,70,40,0.5)]"
        >
          {page.map((modifier) => (
            <ModifierRow key={modifier} modifier={modifier} value={total[modifier]} />
          ))}
        </ul>
      ))}
    </div>
  );
}
