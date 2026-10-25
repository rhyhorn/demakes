import {
  MAX_MODIFIER,
  MIN_MODIFIER,
  MODIFIER,
  type Modifier,
  MODIFIERS,
} from '../config/modifiers';
import { GOLD_MULTIPLIER_INFO } from '../config/modifiers';
import { isModifierProperty, type ToothProperty } from './toothStore';

/** Percentage of every modifier, from `MIN_MODIFIER` to `MAX_MODIFIER`. */
export type Modifiers = Record<Modifier, number>;

/** Every modifier at 0%: no cell is more or less likely to be landed on. */
export const NO_MODIFIERS: Modifiers = {
  [MODIFIER.attackChance]: 0,
  [MODIFIER.magicChance]: 0,
  [MODIFIER.strawberryChance]: 0,
  [MODIFIER.chestChance]: 0,
  [MODIFIER.spikesChance]: 0,
};

/** The value kept within `MIN_MODIFIER`..`MAX_MODIFIER`. */
export const clampModifier = (value: number) =>
  Math.min(MAX_MODIFIER, Math.max(MIN_MODIFIER, value));

/** A percentage with its sign, as in the book: +50%, -50%, +0%. */
export const formatModifier = (value: number) => `${value < 0 ? '' : '+'}${value}%`;

/** A bonus to the gold multiplier with its sign: ×+1, ×-1. */
export const formatGoldMultiplierBonus = (value: number) => `×${value < 0 ? '' : '+'}${value}`;

/** Whether the property is good for the hero (a buff) rather than bad (a debuff). */
export const isToothPropertyHelpful = (property: ToothProperty) =>
  isModifierProperty(property)
    ? property.value > 0 === MODIFIERS[property.modifier].helpsWhenRaised
    : property.goldMultiplier > 0;

/**
 * A tooth property as the hint shows it: the modifier's icon and the percentage, `🗡 +50%`, or the
 * coin and the bonus to the gold multiplier, `🪙 ×+1`.
 */
export const describeToothProperty = (property: ToothProperty) =>
  isModifierProperty(property)
    ? `${MODIFIERS[property.modifier].icon} ${formatModifier(property.value)}`
    : `${GOLD_MULTIPLIER_INFO.icon} ${formatGoldMultiplierBonus(property.goldMultiplier)}`;
