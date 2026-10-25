import {
  MAX_MODIFIER,
  MIN_MODIFIER,
  MODIFIER,
  type Modifier,
  MODIFIERS,
} from '../config/modifiers';
import type { ToothProperty } from './toothStore';

/** Percentage of every modifier, from `MIN_MODIFIER` to `MAX_MODIFIER`. */
export type Modifiers = Record<Modifier, number>;

/** Every modifier at 0%: no cell is more or less likely to be landed on. */
export const NO_MODIFIERS: Modifiers = {
  [MODIFIER.attackChance]: 0,
  [MODIFIER.magicChance]: 0,
  [MODIFIER.strawberryChance]: 0,
  [MODIFIER.chestChance]: 0,
};

/** The value kept within `MIN_MODIFIER`..`MAX_MODIFIER`. */
export const clampModifier = (value: number) =>
  Math.min(MAX_MODIFIER, Math.max(MIN_MODIFIER, value));

/** A percentage with its sign, as in the book: +50%, -50%, +0%. */
export const formatModifier = (value: number) => `${value < 0 ? '' : '+'}${value}%`;

/** A tooth property as the hint shows it: the modifier's icon and the percentage, `🗡 +50%`. */
export const describeToothProperty = ({ modifier, value }: ToothProperty) =>
  `${MODIFIERS[modifier].icon} ${formatModifier(value)}`;
