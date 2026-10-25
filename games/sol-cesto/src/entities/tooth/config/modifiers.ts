/**
 * Global modifiers from the book in the bottom left corner. Each one is a percentage from
 * `MIN_MODIFIER` to `MAX_MODIFIER` that makes some cells more (above 0) or less (below 0) likely to
 * be landed on. Add a modifier here and describe it in `MODIFIERS`.
 */
export const MODIFIER = {
  /** Chance to land on an enemy whose active attack is physical. */
  attackChance: 'attackChance',
  /** Chance to land on an enemy whose active attack is magic. */
  magicChance: 'magicChance',
  /** Chance to land on a strawberry. */
  strawberryChance: 'strawberryChance',
  /** Chance to land on a chest. */
  chestChance: 'chestChance',
} as const;

export type Modifier = (typeof MODIFIER)[keyof typeof MODIFIER];

/** At -100% the cells of a modifier can't be landed on while the row has others. */
export const MIN_MODIFIER = -100;
export const MAX_MODIFIER = 100;

/** How each modifier looks and is called in the book. */
export const MODIFIERS: Record<Modifier, { name: string; icon: string; color: string }> = {
  [MODIFIER.attackChance]: {
    name: 'Шанс фізичного ворога',
    icon: '🗡',
    color: 'text-[#e05a5a]',
  },
  [MODIFIER.magicChance]: {
    name: 'Шанс магічного ворога',
    icon: '🌀',
    color: 'text-[#5a8de0]',
  },
  [MODIFIER.strawberryChance]: {
    name: 'Шанс полуниці',
    icon: '🍓',
    color: '',
  },
  [MODIFIER.chestChance]: {
    name: 'Шанс скрині',
    icon: '🪎',
    color: '',
  },
};
