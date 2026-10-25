import { clampModifier, type Modifiers, NO_MODIFIERS } from './modifiers';
import type { ToothSlot } from './toothStore';

/**
 * The global modifiers: the properties of every tooth in the mouth added up, each kept within
 * `MIN_MODIFIER`..`MAX_MODIFIER`. Teeth are the only source of modifiers, so they are not stored.
 */
export function getTeethModifiers(slots: readonly ToothSlot[]): Modifiers {
  const total = { ...NO_MODIFIERS };
  slots.forEach((tooth) =>
    tooth?.properties.forEach(({ modifier, value }) => {
      total[modifier] += value;
    }),
  );
  (Object.keys(total) as (keyof Modifiers)[]).forEach((modifier) => {
    total[modifier] = clampModifier(total[modifier]);
  });
  return total;
}
