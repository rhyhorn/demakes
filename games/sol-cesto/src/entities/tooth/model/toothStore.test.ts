import { beforeEach, describe, expect, it } from 'vitest';

import { TOOTH_SLOT_COUNT } from '../config';
import { STARTING_TEETH, SWEET_TOOTH, TEST_TOOTH } from '../config/teeth';
import { createStartingSlots, type ToothSlot, useToothStore } from './toothStore';

const tooth = TEST_TOOTH;

/** A mouth with two teeth in slots 0 and 1 and the rest empty. */
const TWO_TEETH: readonly ToothSlot[] = Array.from(
  { length: TOOTH_SLOT_COUNT },
  (_, slot) => [TEST_TOOTH, SWEET_TOOTH][slot] ?? null,
);

describe('createStartingSlots', () => {
  it('puts every starting tooth into its own random slot and leaves the rest empty', () => {
    // Slot 6 of 12 goes first, then slot 5 of the 11 left.
    const slots = createStartingSlots(() => 0.5);

    expect(slots).toHaveLength(TOOTH_SLOT_COUNT);
    expect(slots[6]).toBe(TEST_TOOTH);
    expect(slots[5]).toBe(SWEET_TOOTH);
    expect(slots.filter((slot) => slot !== null)).toEqual(
      expect.arrayContaining([...STARTING_TEETH]),
    );
    expect(slots.filter((slot) => slot !== null)).toHaveLength(STARTING_TEETH.length);
  });

  it('can use the first and the last slots', () => {
    const count = STARTING_TEETH.length;

    expect(createStartingSlots(() => 0).slice(0, count)).toEqual(STARTING_TEETH);
    expect(createStartingSlots(() => 0.999).slice(-count)).toEqual([...STARTING_TEETH].reverse());
  });
});

describe('useToothStore', () => {
  beforeEach(() => {
    useToothStore.setState({ slots: TWO_TEETH });
  });

  it('puts a tooth into an empty slot', () => {
    useToothStore.getState().placeTooth(5, tooth);

    expect(useToothStore.getState().slots[5]).toEqual(tooth);
  });

  it('adds a tooth into a random empty slot', () => {
    // Slots 0 and 1 hold teeth, so the first empty one is 2.
    expect(useToothStore.getState().addTooth(tooth, () => 0)).toBe(2);
    expect(useToothStore.getState().slots[2]).toBe(tooth);
    expect(useToothStore.getState().addTooth(tooth, () => 0.999)).toBe(TOOTH_SLOT_COUNT - 1);
  });

  it('replaces a random tooth when the mouth is full', () => {
    useToothStore.setState({ slots: Array.from({ length: TOOTH_SLOT_COUNT }, () => SWEET_TOOTH) });

    expect(useToothStore.getState().addTooth(tooth, () => 0)).toBe(0);
    expect(useToothStore.getState().slots[0]).toBe(tooth);
    expect(useToothStore.getState().slots.filter((slot) => slot === tooth)).toHaveLength(1);
  });

  it('empties a slot', () => {
    useToothStore.getState().removeTooth(0);

    expect(useToothStore.getState().slots[0]).toBeNull();
  });

  it('ignores slots out of range', () => {
    const { placeTooth, removeTooth } = useToothStore.getState();

    placeTooth(TOOTH_SLOT_COUNT, tooth);
    placeTooth(-1, tooth);
    removeTooth(TOOTH_SLOT_COUNT);

    expect(useToothStore.getState().slots).toEqual(TWO_TEETH);
  });

  it('brings back the starting slots on reset', () => {
    useToothStore.getState().removeTooth(0);
    useToothStore.getState().placeTooth(7, tooth);

    useToothStore.getState().reset(() => 0.5);

    expect(useToothStore.getState().slots).toEqual(createStartingSlots(() => 0.5));
  });
});
