import { beforeEach, describe, expect, it } from 'vitest';

import { usePickupStore } from './pickupStore';
import { PICKUP_TYPE } from './types';

describe('usePickupStore', () => {
  beforeEach(() => {
    usePickupStore.setState(usePickupStore.getInitialState());
  });

  it('starts with no pickups', () => {
    expect(usePickupStore.getState().pickups).toEqual({});
  });

  it('fills the given cells with pickups', () => {
    usePickupStore.getState().spawn([7, 9], () => 0);

    expect(usePickupStore.getState().pickups).toEqual({
      7: PICKUP_TYPE.strawberry,
      9: PICKUP_TYPE.strawberry,
    });
  });

  it('removes the pickup from a cell and keeps the others', () => {
    usePickupStore.setState({ pickups: { 1: PICKUP_TYPE.strawberry, 5: PICKUP_TYPE.strawberry } });

    usePickupStore.getState().removePickup(1);

    expect(usePickupStore.getState().pickups).toEqual({ 5: PICKUP_TYPE.strawberry });
  });

  it('does nothing when the cell has no pickup', () => {
    usePickupStore.setState({ pickups: { 1: PICKUP_TYPE.strawberry } });
    const before = usePickupStore.getState();

    usePickupStore.getState().removePickup(2);

    expect(usePickupStore.getState()).toBe(before);
  });
});
