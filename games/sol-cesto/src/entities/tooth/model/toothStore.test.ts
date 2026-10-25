import { beforeEach, describe, expect, it } from 'vitest';

import { TOOTH_SLOT_COUNT } from '../config';
import { createStartingSlots, SWEET_TOOTH, TEST_TOOTH, useToothStore } from './toothStore';

const tooth = TEST_TOOTH;

describe('createStartingSlots', () => {
  it('puts every starting tooth into its own random slot and leaves the rest empty', () => {
    // Slot 6 of 12 goes first, then slot 5 of the 11 left.
    const slots = createStartingSlots(() => 0.5);

    expect(slots).toHaveLength(TOOTH_SLOT_COUNT);
    expect(slots[6]).toBe(TEST_TOOTH);
    expect(slots[5]).toBe(SWEET_TOOTH);
    expect(slots.filter((slot) => slot !== null)).toHaveLength(2);
  });

  it('can use the first and the last slots', () => {
    expect(createStartingSlots(() => 0).slice(0, 2)).toEqual([TEST_TOOTH, SWEET_TOOTH]);
    expect(createStartingSlots(() => 0.999).slice(-2)).toEqual([SWEET_TOOTH, TEST_TOOTH]);
  });
});

describe('useToothStore', () => {
  beforeEach(() => {
    useToothStore.setState({ slots: createStartingSlots(() => 0) });
  });

  it('puts a tooth into an empty slot', () => {
    useToothStore.getState().placeTooth(5, tooth);

    expect(useToothStore.getState().slots[5]).toEqual(tooth);
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

    expect(useToothStore.getState().slots).toEqual(createStartingSlots(() => 0));
  });

  it('brings back the starting slots on reset', () => {
    useToothStore.getState().removeTooth(0);
    useToothStore.getState().placeTooth(7, tooth);

    useToothStore.getState().reset(() => 0.5);

    expect(useToothStore.getState().slots).toEqual(createStartingSlots(() => 0.5));
  });
});
