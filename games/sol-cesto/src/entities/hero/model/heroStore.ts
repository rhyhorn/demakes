import { create } from 'zustand';

import { type HeroAttackKind, INVENTORY_ITEM, type InventoryItem } from '../config';

/** Hero stats at the start of a run, as on the reference screenshot. */
export const INITIAL_HERO_STATS = {
  health: 5,
  maxHealth: 5,
  attack: 2,
  magic: 1,
  gold: 0,
  /** Every gold income is multiplied by this plus the bonus of the teeth; 1 keeps it as is. */
  goldMultiplier: 1,
  /** How many inventory slots are available (0 to `MAX_INVENTORY_SIZE`). */
  inventorySize: 3,
  /** Placeholder items, as on the reference: a potion and a spear. */
  inventory: [INVENTORY_ITEM.potion, INVENTORY_ITEM.spear] as readonly InventoryItem[],
} as const;

interface HeroState {
  /** Current health, from 0 up to `maxHealth`. */
  health: number;
  maxHealth: number;
  /** Physical attack. */
  attack: number;
  /** Magic attack. */
  magic: number;
  /** Gold in the piggy bank. */
  gold: number;
  /** The base gold multiplier: every gold income (`addGold`) is multiplied by it plus the bonus. */
  goldMultiplier: number;
  /** How many inventory slots are available, from 0 up to `MAX_INVENTORY_SIZE`. */
  inventorySize: number;
  /** Carried items, at most `inventorySize` of them. */
  inventory: readonly InventoryItem[];
  /** Lowers health by `amount`, but never below 0. Does nothing for 0 or less. */
  takeDamage: (amount: number) => void;
  /** Raises health by `amount`, but never above `maxHealth`. Does nothing for 0 or less. */
  heal: (amount: number) => void;
  /** Raises the attack of the kind (physical or magic) by `amount`. Does nothing for 0 or less. */
  raiseAttack: (kind: HeroAttackKind, amount: number) => void;
  /**
   * Puts `amount` × (`goldMultiplier` + `multiplierBonus`) gold into the piggy bank, e.g. with the
   * bonus of the teeth in the mouth. Does nothing for 0 or less.
   */
  addGold: (amount: number, multiplierBonus?: number) => void;
  /** Takes `amount` gold out of the piggy bank. Does nothing for 0 or less, or if there is not enough. */
  spendGold: (amount: number) => void;
  /** Puts the item into the first free inventory slot. Does nothing when the inventory is full. */
  addItem: (item: InventoryItem) => void;
  /** Takes the item out of inventory slot `index`; later items shift down. Ignores empty slots. */
  removeItem: (index: number) => void;
  /** Brings back the stats the hero starts a run with. */
  reset: () => void;
}

export const useHeroStore = create<HeroState>()((set) => ({
  ...INITIAL_HERO_STATS,
  takeDamage: (amount) =>
    set((state) => (amount > 0 ? { health: Math.max(0, state.health - amount) } : state)),
  heal: (amount) =>
    set((state) =>
      amount > 0 ? { health: Math.min(state.maxHealth, state.health + amount) } : state,
    ),
  raiseAttack: (kind, amount) =>
    set((state) => (amount > 0 ? { [kind]: state[kind] + amount } : state)),
  addGold: (amount, multiplierBonus = 0) =>
    set((state) =>
      amount > 0
        ? { gold: state.gold + amount * Math.max(0, state.goldMultiplier + multiplierBonus) }
        : state,
    ),
  spendGold: (amount) =>
    set((state) => (amount > 0 && amount <= state.gold ? { gold: state.gold - amount } : state)),
  addItem: (item) =>
    set((state) =>
      state.inventory.length < state.inventorySize
        ? { inventory: [...state.inventory, item] }
        : state,
    ),
  removeItem: (index) =>
    set((state) =>
      index >= 0 && index < state.inventory.length
        ? { inventory: state.inventory.filter((_, slot) => slot !== index) }
        : state,
    ),
  reset: () => set(INITIAL_HERO_STATS),
}));
