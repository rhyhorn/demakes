import { create } from 'zustand';

import { INVENTORY_ITEM, INVENTORY_ITEMS, type InventoryItem, useHeroStore } from '@/entities/hero';

import { SHOP_OFFER_COUNT } from '../config';

const ITEMS = Object.values(INVENTORY_ITEM);

/** `SHOP_OFFER_COUNT` random items; the same item may be offered more than once. */
export function createShopOffers(random: () => number = Math.random): readonly InventoryItem[] {
  return Array.from({ length: SHOP_OFFER_COUNT }, () => ITEMS[Math.floor(random() * ITEMS.length)]);
}

interface ShopState {
  /** Items the shop offers, left to right. */
  offers: readonly InventoryItem[];
  /** Indices of the offers the hero has bought. */
  sold: readonly number[];
}

export const useShopStore = create<ShopState>()(() => ({
  offers: createShopOffers(),
  sold: [],
}));

/** Whether the hero can buy an offer, and if not, why. */
export const SHOP_OFFER_STATUS = {
  available: 'available',
  sold: 'sold',
  /** The hero has less gold than the item costs. */
  tooExpensive: 'too-expensive',
  /** The hero's inventory is full. */
  noRoom: 'no-room',
} as const;

export type ShopOfferStatus = (typeof SHOP_OFFER_STATUS)[keyof typeof SHOP_OFFER_STATUS];

/** What of the hero decides whether she can buy: her gold and free inventory slots. */
interface HeroWallet {
  gold: number;
  inventory: readonly unknown[];
  inventorySize: number;
}

export function getShopOfferStatus(
  offer: number,
  { offers, sold }: ShopState,
  hero: HeroWallet,
): ShopOfferStatus {
  const item = offers[offer];
  if (item === undefined || sold.includes(offer)) return SHOP_OFFER_STATUS.sold;
  if (hero.gold < INVENTORY_ITEMS[item].price) return SHOP_OFFER_STATUS.tooExpensive;
  if (hero.inventory.length >= hero.inventorySize) return SHOP_OFFER_STATUS.noRoom;
  return SHOP_OFFER_STATUS.available;
}

/**
 * Buys the offer: takes its price out of the piggy bank and puts the item into the inventory.
 * Does nothing unless the offer is available. Returns whether it was bought.
 */
export function buyItem(offer: number) {
  const shop = useShopStore.getState();
  const hero = useHeroStore.getState();
  if (getShopOfferStatus(offer, shop, hero) !== SHOP_OFFER_STATUS.available) return false;
  const item = shop.offers[offer];
  hero.spendGold(INVENTORY_ITEMS[item].price);
  hero.addItem(item);
  useShopStore.setState({ sold: [...shop.sold, offer] });
  return true;
}

/**
 * Leaves the shop and restocks it for the next time. The shop is always open, so the hero can
 * leave without buying. Returns `true`; where she goes next is up to the caller (`enterNextRoom`).
 */
export function leaveShop(random?: () => number) {
  useShopStore.setState({ offers: createShopOffers(random), sold: [] });
  return true;
}
