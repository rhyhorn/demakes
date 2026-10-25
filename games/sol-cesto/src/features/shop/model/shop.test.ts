import { beforeEach, describe, expect, it } from 'vitest';

import { INVENTORY_ITEM, INVENTORY_ITEMS, useHeroStore } from '@/entities/hero';

import { SHOP_OFFER_COUNT } from '../config';
import {
  buyItem,
  createShopOffers,
  getShopOfferStatus,
  leaveShop,
  SHOP_OFFER_STATUS,
  useShopStore,
} from './shop';

const { potion, spear, arrow } = INVENTORY_ITEM;

describe('shop', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
    useShopStore.setState({ offers: [potion, spear, potion, potion, spear], sold: [] });
  });

  it('offers SHOP_OFFER_COUNT items, which may repeat', () => {
    expect(createShopOffers(() => 0)).toEqual(
      Array.from({ length: SHOP_OFFER_COUNT }, () => potion),
    );
  });

  it('sells an item for its price and puts it into the inventory', () => {
    useHeroStore.setState({ gold: 10, inventory: [potion, spear] });

    expect(buyItem(1)).toBe(true);

    expect(useHeroStore.getState().gold).toBe(10 - INVENTORY_ITEMS.spear.price);
    expect(useHeroStore.getState().inventory).toEqual([potion, spear, spear]);
    expect(getShopOfferStatus(1, useShopStore.getState(), useHeroStore.getState())).toBe(
      SHOP_OFFER_STATUS.sold,
    );
  });

  it('sells each offer only once', () => {
    useHeroStore.setState({ gold: 10, inventory: [] });

    buyItem(0);
    expect(buyItem(0)).toBe(false);

    expect(useHeroStore.getState().inventory).toEqual([potion]);
  });

  it('does not sell an item the hero cannot afford', () => {
    useHeroStore.setState({ gold: INVENTORY_ITEMS.spear.price - 1 });
    const before = useHeroStore.getState();

    expect(buyItem(1)).toBe(false);

    expect(useHeroStore.getState()).toBe(before);
    expect(getShopOfferStatus(1, useShopStore.getState(), before)).toBe(
      SHOP_OFFER_STATUS.tooExpensive,
    );
  });

  it('does not sell an item when the inventory is full', () => {
    useHeroStore.setState({ gold: 10, inventorySize: 2 });
    const before = useHeroStore.getState();

    expect(buyItem(0)).toBe(false);

    expect(useHeroStore.getState()).toBe(before);
    expect(getShopOfferStatus(0, useShopStore.getState(), before)).toBe(SHOP_OFFER_STATUS.noRoom);
  });

  it('restocks when the hero leaves', () => {
    useHeroStore.setState({ gold: 10 });
    buyItem(0);

    expect(leaveShop(() => 0.999)).toBe(true);

    expect(useShopStore.getState()).toMatchObject({
      offers: Array.from({ length: SHOP_OFFER_COUNT }, () => arrow),
      sold: [],
    });
  });
});
