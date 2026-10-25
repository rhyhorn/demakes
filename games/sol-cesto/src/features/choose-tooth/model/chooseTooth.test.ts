import { beforeEach, describe, expect, it } from 'vitest';

import { TOOTH_POOL, TOOTH_SLOT_COUNT, type ToothSlot, useToothStore } from '@/entities/tooth';

import { TOOTH_OFFER_COUNT } from '../config';
import {
  chooseTooth,
  createToothOffers,
  isToothRoomOpen,
  landTooth,
  leaveToothRoom,
  useToothChoiceStore,
} from './chooseTooth';

describe('createToothOffers', () => {
  it('offers different teeth from the pool', () => {
    const offers = createToothOffers(() => 0);

    expect(offers).toEqual(TOOTH_POOL.slice(0, TOOTH_OFFER_COUNT));
    expect(new Set(createToothOffers(() => 0.5)).size).toBe(TOOTH_OFFER_COUNT);
  });

  it('picks from a pool of different teeth', () => {
    expect(TOOTH_POOL).toHaveLength(11);
    expect(new Set(TOOTH_POOL.map(({ type }) => type)).size).toBe(TOOTH_POOL.length);
  });
});

/** A mouth with the first two teeth of the pool in slots 0 and 1 and the rest empty. */
const TWO_TEETH: readonly ToothSlot[] = Array.from(
  { length: TOOTH_SLOT_COUNT },
  (_, slot) => TOOTH_POOL.slice(0, 2)[slot] ?? null,
);

describe('tooth room', () => {
  beforeEach(() => {
    useToothStore.setState({ slots: TWO_TEETH });
    useToothChoiceStore.setState({
      offers: createToothOffers(() => 0),
      chosen: null,
      flight: null,
    });
  });

  it('is closed until a tooth is taken', () => {
    expect(isToothRoomOpen(useToothChoiceStore.getState())).toBe(false);
  });

  it('puts the taken tooth into a random empty slot and opens the room', () => {
    chooseTooth(2, () => 0);

    // Slots 0 and 1 already hold teeth.
    expect(useToothStore.getState().slots[2]).toBe(TOOTH_POOL[2]);
    expect(useToothChoiceStore.getState().chosen).toBe(2);
    expect(isToothRoomOpen(useToothChoiceStore.getState())).toBe(true);
  });

  it('sends the tooth flying into its slot over what the slot held before', () => {
    const from = { left: 10, top: 20, width: 150, height: 190 } as DOMRect;
    chooseTooth(2, () => 0, from);

    expect(useToothChoiceStore.getState().flight).toEqual({ from, slot: 2, previous: null });
    landTooth();
    expect(useToothChoiceStore.getState().flight).toBeNull();
  });

  it('flies nowhere without a place to fly from', () => {
    chooseTooth(2, () => 0);

    expect(useToothChoiceStore.getState().flight).toBeNull();
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
    expect(useToothChoiceStore.getState().flight).toBeNull();
    expect(useToothChoiceStore.getState().offers).toEqual(createToothOffers(() => 0.999));
  });

  it('keeps the whole pool for the next room, so the same tooth may be taken twice', () => {
    chooseTooth(0, () => 0);
    leaveToothRoom(() => 0);
    chooseTooth(0, () => 0);

    expect(useToothChoiceStore.getState().offers[0]).toBe(TOOTH_POOL[0]);
    // The mouth already holds this tooth in slot 0.
    expect(useToothStore.getState().slots.filter((slot) => slot === TOOTH_POOL[0])).toHaveLength(3);
  });
});
