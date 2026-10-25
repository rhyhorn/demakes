/** How the hero is described to the player in the hint panel. */
export const HERO_INFO = {
  name: 'Героїня',
  description: 'Ваша героїня.',
} as const;

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
} as const;

export type InventoryItem = (typeof INVENTORY_ITEM)[keyof typeof INVENTORY_ITEM];

/** Kinds of effect an item has when the hero uses it. */
export const ITEM_EFFECT = {
  /** Restores `amount` health, but only while the hero is hurt. */
  heal: 'heal',
  /** Kills a random enemy on the board; with no enemies the item is simply used up. */
  killEnemy: 'kill-enemy',
} as const;

export type ItemEffectKind = (typeof ITEM_EFFECT)[keyof typeof ITEM_EFFECT];

export type ItemEffect =
  { kind: typeof ITEM_EFFECT.heal; amount: number } | { kind: typeof ITEM_EFFECT.killEnemy };

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
};
