import { beforeEach, describe, expect, it } from 'vitest';

import { getHintHandlers, HINT_TARGET, isSameHintTarget, useHintStore } from './hintStore';

const cell = (index: number) => ({ kind: HINT_TARGET.cell, index });
const hero = { kind: HINT_TARGET.hero };

describe('useHintStore', () => {
  beforeEach(() => {
    useHintStore.setState(useHintStore.getInitialState());
  });

  it('starts with nothing to describe', () => {
    expect(useHintStore.getState().target).toBeNull();
  });

  it('describes the element under the cursor', () => {
    useHintStore.getState().showHint(cell(5));

    expect(useHintStore.getState().target).toEqual(cell(5));
  });

  it('clears the hint when the cursor leaves the element', () => {
    useHintStore.getState().showHint(cell(5));

    useHintStore.getState().hideHint(cell(5));

    expect(useHintStore.getState().target).toBeNull();
  });

  it('keeps a newer hint when an older element is left', () => {
    useHintStore.getState().showHint(cell(6));

    useHintStore.getState().hideHint(cell(5));

    expect(useHintStore.getState().target).toEqual(cell(6));
  });

  it('keeps the hint of another kind of element', () => {
    useHintStore.getState().showHint(hero);

    useHintStore.getState().hideHint(cell(5));

    expect(useHintStore.getState().target).toEqual(hero);
  });

  it('gives mouse handlers that show and hide the hint', () => {
    const { onMouseEnter, onMouseLeave } = getHintHandlers(hero);

    onMouseEnter();
    expect(useHintStore.getState().target).toEqual(hero);

    onMouseLeave();
    expect(useHintStore.getState().target).toBeNull();
  });
});

describe('isSameHintTarget', () => {
  it('compares targets by their fields', () => {
    expect(isSameHintTarget(cell(3), cell(3))).toBe(true);
    expect(isSameHintTarget(cell(3), cell(4))).toBe(false);
    expect(isSameHintTarget(hero, { kind: HINT_TARGET.hero })).toBe(true);
    expect(isSameHintTarget(hero, cell(3))).toBe(false);
  });
});
