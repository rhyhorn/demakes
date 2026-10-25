/** Heroes the player picks from at the start of a run. */
export const HERO_CLASS = {
  warrior: 'warrior',
  sorceress: 'sorceress',
} as const;

export type HeroClass = (typeof HERO_CLASS)[keyof typeof HERO_CLASS];

export interface HeroClassConfig {
  /** How the hero is called on the choice screen and in the hint panel. */
  name: string;
  description: string;
  /** Placeholder art until the game gets hero sprites. */
  figure: string;
  /** What the hero starts the run with; health starts full. */
  stats: { maxHealth: number; attack: number; magic: number };
}

/** How each hero looks, is described and what stats they start the run with. */
export const HERO_CLASSES: Record<HeroClass, HeroClassConfig> = {
  [HERO_CLASS.warrior]: {
    name: 'Воїн',
    description: 'Сильніший у фізичній атаці.',
    figure: '🤺',
    stats: { maxHealth: 5, attack: 2, magic: 1 },
  },
  [HERO_CLASS.sorceress]: {
    name: 'Чарівниця',
    description: 'Сильніша в магічній атаці.',
    figure: '🧙‍♀️',
    stats: { maxHealth: 5, attack: 1, magic: 2 },
  },
};

/** The hero the stores hold until the player picks one. */
export const DEFAULT_HERO_CLASS: HeroClass = HERO_CLASS.warrior;

/** How the gold in the piggy bank is described to the player in the hint panel. */
export const GOLD_INFO = {
  name: 'Золото',
  description: 'Його можна залишити в торговця.',
} as const;

/** The hero's two kinds of attack: physical and magic. */
export const HERO_ATTACK_KIND = {
  attack: 'attack',
  magic: 'magic',
} as const;

export type HeroAttackKind = (typeof HERO_ATTACK_KIND)[keyof typeof HERO_ATTACK_KIND];

/** The most inventory slots the hero can ever have. */
export const MAX_INVENTORY_SIZE = 6;

/** Items the hero can carry. Placeholders until the game gets real items. */
export const INVENTORY_ITEM = {
  potion: 'potion',
  spear: 'spear',
  bomb: 'bomb',
  whirlwind: 'whirlwind',
} as const;

export type InventoryItem = (typeof INVENTORY_ITEM)[keyof typeof INVENTORY_ITEM];

/** Kinds of effect an item has when the hero uses it. */
export const ITEM_EFFECT = {
  /** Restores `amount` health, but only while the hero is hurt. */
  heal: 'heal',
  /** Kills a random enemy on the board; with no enemies the item is simply used up. */
  killEnemy: 'kill-enemy',
  /**
   * Kills a random enemy in every row that has one. Using it counts as one move towards opening
   * the exit door, not one per kill.
   */
  killEnemyPerRow: 'kill-enemy-per-row',
  /**
   * Kills every enemy in the row the player picks on the board. Using it counts as one move towards
   * opening the exit door, not one per kill.
   */
  killRowEnemies: 'kill-row-enemies',
} as const;

export type ItemEffectKind = (typeof ITEM_EFFECT)[keyof typeof ITEM_EFFECT];

export type ItemEffect =
  | { kind: typeof ITEM_EFFECT.heal; amount: number }
  | { kind: typeof ITEM_EFFECT.killEnemy }
  | { kind: typeof ITEM_EFFECT.killEnemyPerRow }
  | { kind: typeof ITEM_EFFECT.killRowEnemies };

export interface InventoryItemConfig {
  name: string;
  icon: string;
  /** What the item does, for the player. */
  description: string;
  /** What using the item does; `null` if it cannot be used yet. A used item is gone. */
  effect: ItemEffect | null;
  /** How much gold the item costs in the shop. */
  price: number;
}

/** How each item looks, is called and works in the inventory. */
export const INVENTORY_ITEMS: Record<InventoryItem, InventoryItemConfig> = {
  [INVENTORY_ITEM.potion]: {
    name: 'Зілля',
    icon: '🧪',
    description: "Лікує вас на 1 здоров'я",
    effect: { kind: ITEM_EFFECT.heal, amount: 1 },
    price: 3,
  },
  [INVENTORY_ITEM.spear]: {
    name: 'Спис',
    icon: '🔱',
    description: 'Убиває випадкового ворога на полі',
    effect: { kind: ITEM_EFFECT.killEnemy },
    price: 5,
  },
  [INVENTORY_ITEM.bomb]: {
    name: 'Бомба',
    icon: '💣',
    description: 'Убиває по одному ворогу в кожному рядку',
    effect: { kind: ITEM_EFFECT.killEnemyPerRow },
    price: 7,
  },
  [INVENTORY_ITEM.whirlwind]: {
    name: 'Вихор',
    icon: '🌪️',
    description: 'Змітає всіх ворогів в обраному рядку',
    effect: { kind: ITEM_EFFECT.killRowEnemies },
    price: 6,
  },
};
