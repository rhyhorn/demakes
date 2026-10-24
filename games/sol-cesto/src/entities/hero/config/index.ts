/** How the hero is described to the player in the hint panel. */
export const HERO_INFO = {
  name: 'Героїня',
  description: 'Ваша героїня.',
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

/** How each item looks and is called in the inventory. */
export const INVENTORY_ITEMS: Record<InventoryItem, { name: string; icon: string }> = {
  [INVENTORY_ITEM.potion]: { name: 'Зілля', icon: '🧪' },
  [INVENTORY_ITEM.spear]: { name: 'Спис', icon: '🔱' },
};
