import { beforeEach, describe, expect, it } from 'vitest';

import { useTrapStore } from './trapStore';
import { TRAP_TYPE } from './types';

describe('useTrapStore', () => {
  beforeEach(() => {
    useTrapStore.setState(useTrapStore.getInitialState());
  });

  it('starts with no traps', () => {
    expect(useTrapStore.getState().traps).toEqual({});
  });

  it('replaces all traps', () => {
    useTrapStore.setState({ traps: { 1: TRAP_TYPE.spikes } });

    useTrapStore.getState().setTraps({ 5: TRAP_TYPE.spikes });

    expect(useTrapStore.getState().traps).toEqual({ 5: TRAP_TYPE.spikes });
  });
});
