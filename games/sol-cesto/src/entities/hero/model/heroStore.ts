import { create } from 'zustand';

import {
  DEFAULT_HERO_CLASS,
  type HeroAttackKind,
  type HeroClass,
  HERO_CLASSES,
  INVENTORY_ITEM,
  type InventoryItem,
} from '../config';

/** Stats a hero of the class starts a run with: full health, their own attack and magic. */
const getClassStats = (heroClass: HeroClass) => {
  const { maxHealth, attack, magic } = HERO_CLASSES[heroClass].stats;
  return { heroClass, health: maxHealth, maxHealth, attack, magic };
};

/** Hero stats at the start of a run, before the player picks a hero (`chooseHero`). */
export const INITIAL_HERO_STATS = {
  ...getClassStats(DEFAULT_HERO_CLASS),
  gold: 0,
  /** Every gold income is multiplied by this plus the bonus of the teeth; 1 keeps it as is. */
  goldMultiplier: 1,
  /** How many inventory slots are available (0 to `MAX_INVENTORY_SIZE`). */
  inventorySize: 4,
  /**
   * Placeholder items, as on the reference: a potion and a spear, plus a whirlwind and an arrow to
   * try out.
   */
  inventory: [
    INVENTORY_ITEM.potion,
    INVENTORY_ITEM.spear,
    INVENTORY_ITEM.whirlwind,
    INVENTORY_ITEM.arrow,
  ] as readonly InventoryItem[],
} as const;

interface HeroState {
  /** Which hero the player picked: the stats a run starts with come from `HERO_CLASSES`. */
  heroClass: HeroClass;
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
  /** Makes the hero of the class: their stats as `HERO_CLASSES` says, health full. */
  chooseHero: (heroClass: HeroClass) => void;
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
  chooseHero: (heroClass) => set(getClassStats(heroClass)),
  reset: () => set(INITIAL_HERO_STATS),
}));
