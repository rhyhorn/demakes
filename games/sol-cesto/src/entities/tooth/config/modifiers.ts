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
  /** Chance to land on spikes. */
  spikesChance: 'spikesChance',
} as const;

export type Modifier = (typeof MODIFIER)[keyof typeof MODIFIER];

/**
 * The gold multiplier is not a chance and not a percentage: every gold income is multiplied by it.
 * Some teeth add to it; how it looks in the hints and the tooth room.
 */
export const GOLD_MULTIPLIER_INFO = {
  name: 'Множник золота',
  /** What the multiplier does, for the player. */
  describe: (multiplier: number) => `Кількість отриманого золота збільшується на ×${multiplier}`,
  icon: '🪙',
} as const;

/** At -100% the cells of a modifier can't be landed on while the row has others. */
export const MIN_MODIFIER = -100;
export const MAX_MODIFIER = 100;

/**
 * How each modifier looks, is called and described in the book. `helpsWhenRaised` tells whether raising it is
 * good for the hero: more strawberries help her, more enemies hurt her.
 */
export const MODIFIERS: Record<
  Modifier,
  { name: string; description: string; icon: string; color: string; helpsWhenRaised: boolean }
> = {
  [MODIFIER.attackChance]: {
    name: 'Шанс фізичного ворога',
    description: 'Шанс потрапити на фізичного ворога.',
    icon: '🗡',
    color: 'text-[#e05a5a]',
    helpsWhenRaised: false,
  },
  [MODIFIER.magicChance]: {
    name: 'Шанс магічного ворога',
    description: 'Шанс потрапити на магічного ворога.',
    icon: '🌀',
    color: 'text-[#5a8de0]',
    helpsWhenRaised: false,
  },
  [MODIFIER.strawberryChance]: {
    name: 'Шанс полуниці',
    description: 'Шанс потрапити на полуницю.',
    icon: '🍓',
    color: '',
    helpsWhenRaised: true,
  },
  [MODIFIER.chestChance]: {
    name: 'Шанс скрині',
    description: 'Шанс потрапити на скриню.',
    icon: '🪎',
    color: '',
    helpsWhenRaised: true,
  },
  [MODIFIER.spikesChance]: {
    name: 'Шанс шипів',
    description: 'Шанс потрапити на шипи.',
    icon: '▲',
    color: 'text-[#8b8b84]',
    helpsWhenRaised: false,
  },
};
