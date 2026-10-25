import { beforeEach, describe, expect, it } from 'vitest';

import { TOOTH_SLOT_COUNT, TOOTH_TYPE } from '../config';
import { INITIAL_TOOTH_SLOTS, useToothStore } from './toothStore';

const tooth = { type: TOOTH_TYPE.placeholder };

describe('useToothStore', () => {
  beforeEach(() => {
    useToothStore.setState(useToothStore.getInitialState());
  });

  it('starts with three placeholder teeth and the rest of the slots empty', () => {
    const { slots } = useToothStore.getState();

    expect(slots).toHaveLength(TOOTH_SLOT_COUNT);
    expect(slots.slice(0, 3)).toEqual([tooth, tooth, tooth]);
    expect(slots.slice(3).every((slot) => slot === null)).toBe(true);
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

    expect(useToothStore.getState().slots).toEqual(INITIAL_TOOTH_SLOTS);
  });

  it('brings back the starting slots on reset', () => {
    useToothStore.getState().removeTooth(0);
    useToothStore.getState().placeTooth(7, tooth);

    useToothStore.getState().reset();

    expect(useToothStore.getState().slots).toEqual(INITIAL_TOOTH_SLOTS);
  });
});
