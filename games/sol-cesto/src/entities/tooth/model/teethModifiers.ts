import { clampModifier, type Modifiers, NO_MODIFIERS } from './modifiers';
import { isModifierProperty, type ToothSlot } from './toothStore';

/**
 * The global modifiers: the properties of every tooth in the mouth added up, each kept within
 * `MIN_MODIFIER`..`MAX_MODIFIER`. Teeth are the only source of modifiers, so they are not stored.
 */
export function getTeethModifiers(slots: readonly ToothSlot[]): Modifiers {
  const total = { ...NO_MODIFIERS };
  slots.forEach((tooth) =>
    tooth?.properties.forEach((property) => {
      if (isModifierProperty(property)) total[property.modifier] += property.value;
    }),
  );
  (Object.keys(total) as (keyof Modifiers)[]).forEach((modifier) => {
    total[modifier] = clampModifier(total[modifier]);
  });
  return total;
}

/** How much the teeth in the mouth add to the hero's gold multiplier altogether. */
export function getTeethGoldMultiplier(slots: readonly ToothSlot[]): number {
  return slots.reduce(
    (total, tooth) =>
      total +
      (tooth?.properties ?? []).reduce(
        (sum, property) => (isModifierProperty(property) ? sum : sum + property.goldMultiplier),
        0,
      ),
    0,
  );
}
