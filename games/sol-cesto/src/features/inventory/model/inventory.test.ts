import { beforeEach, describe, expect, it } from 'vitest';

import { INVENTORY_ITEM, useHeroStore } from '@/entities/hero';

import { discardItem } from './inventory';

describe('discardItem', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
  });

  it('takes the item out of the inventory', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.potion, INVENTORY_ITEM.spear] });

    discardItem(1);

    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.potion]);
  });
});
