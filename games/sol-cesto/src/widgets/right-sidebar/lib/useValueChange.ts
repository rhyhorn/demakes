import { useState } from 'react';

export const VALUE_CHANGE = { decrease: 'decrease', increase: 'increase' } as const;
export type ValueChangeKind = (typeof VALUE_CHANGE)[keyof typeof VALUE_CHANGE];

export interface ValueChange {
  kind: ValueChangeKind;
  /** How much the value changed, always positive. */
  amount: number;
  /** Grows with every change, so the same effect twice in a row restarts its animation. */
  id: number;
}

/**
 * The latest change of a hero's stat (health, gold) while its panel is on screen, or `null` once
 * its effect has played. The value the panel mounts with is not a change, so moving to another
 * room does not replay the effect.
 */
export function useValueChange(value: number) {
  const [previous, setPrevious] = useState(value);
  const [change, setChange] = useState<ValueChange | null>(null);
  const [lastId, setLastId] = useState(0);

  // Adjusting state during render (not in an effect) avoids one frame without the effect.
  if (value !== previous) {
    const id = lastId + 1;
    setPrevious(value);
    setLastId(id);
    setChange({
      kind: value < previous ? VALUE_CHANGE.decrease : VALUE_CHANGE.increase,
      amount: Math.abs(value - previous),
      id,
    });
  }

  return { change, clearChange: () => setChange(null) };
}
