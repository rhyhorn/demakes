/**
 * Global modifiers from the book in the bottom left corner. Each one is a percentage from
 * `MIN_MODIFIER` to `MAX_MODIFIER`. Add a modifier here and describe it in `MODIFIERS`.
 */
export const MODIFIER = {
  /** Raises the chance to land on an enemy whose active attack is physical. */
  attackChance: 'attackChance',
  /** Raises the chance to land on an enemy whose active attack is magic. */
  magicChance: 'magicChance',
} as const;

export type Modifier = (typeof MODIFIER)[keyof typeof MODIFIER];

export const MIN_MODIFIER = 0;
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
};
