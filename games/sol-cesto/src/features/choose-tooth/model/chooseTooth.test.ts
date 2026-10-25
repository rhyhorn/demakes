import { beforeEach, describe, expect, it } from 'vitest';

import { createStartingSlots, TOOTH_POOL, useToothStore } from '@/entities/tooth';

import { TOOTH_OFFER_COUNT } from '../config';
import {
  chooseTooth,
  createToothOffers,
  isToothRoomOpen,
  leaveToothRoom,
  useToothChoiceStore,
} from './chooseTooth';

describe('createToothOffers', () => {
  it('offers different teeth from the pool', () => {
    const offers = createToothOffers(() => 0);

    expect(offers).toEqual(TOOTH_POOL.slice(0, TOOTH_OFFER_COUNT));
    expect(new Set(createToothOffers(() => 0.5)).size).toBe(TOOTH_OFFER_COUNT);
  });

  it('picks from a pool of ten different teeth', () => {
    expect(TOOTH_POOL).toHaveLength(10);
    expect(new Set(TOOTH_POOL.map(({ type }) => type)).size).toBe(TOOTH_POOL.length);
  });
});

describe('tooth room', () => {
  beforeEach(() => {
    useToothStore.setState({ slots: createStartingSlots(() => 0) });
    useToothChoiceStore.setState({ offers: createToothOffers(() => 0), chosen: null });
  });

  it('is closed until a tooth is taken', () => {
    expect(isToothRoomOpen(useToothChoiceStore.getState())).toBe(false);
  });

  it('puts the taken tooth into a random empty slot and opens the room', () => {
    chooseTooth(2, () => 0);

    // Slots 0 and 1 hold the starting teeth.
    expect(useToothStore.getState().slots[2]).toBe(TOOTH_POOL[2]);
    expect(useToothChoiceStore.getState().chosen).toBe(2);
    expect(isToothRoomOpen(useToothChoiceStore.getState())).toBe(true);
  });

  it('counts only the first choice', () => {
    chooseTooth(2, () => 0);
    chooseTooth(3, () => 0);

    expect(useToothStore.getState().slots.filter((slot) => slot !== null)).toHaveLength(3);
    expect(useToothChoiceStore.getState().chosen).toBe(2);
  });

  it('ignores offers out of range', () => {
    chooseTooth(TOOTH_OFFER_COUNT);

    expect(isToothRoomOpen(useToothChoiceStore.getState())).toBe(false);
  });

  it('cannot be left while closed', () => {
    expect(leaveToothRoom()).toBe(false);
  });

  it('can be left once open and closes behind the hero with new offers', () => {
    chooseTooth(0, () => 0);

    expect(leaveToothRoom(() => 0.999)).toBe(true);
    expect(useToothChoiceStore.getState().chosen).toBeNull();
    expect(useToothChoiceStore.getState().offers).toEqual(createToothOffers(() => 0.999));
  });

  it('keeps the whole pool for the next room, so the same tooth may be taken twice', () => {
    chooseTooth(0, () => 0);
    leaveToothRoom(() => 0);
    chooseTooth(0, () => 0);

    expect(useToothChoiceStore.getState().offers[0]).toBe(TOOTH_POOL[0]);
    // The mouth already starts with this tooth in slot 0.
    expect(useToothStore.getState().slots.filter((slot) => slot === TOOTH_POOL[0])).toHaveLength(3);
  });
});
