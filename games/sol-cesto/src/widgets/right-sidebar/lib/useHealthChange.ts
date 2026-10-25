import { useState } from 'react';

export const HEALTH_CHANGE = { damage: 'damage', heal: 'heal' } as const;
export type HealthChangeKind = (typeof HEALTH_CHANGE)[keyof typeof HEALTH_CHANGE];

export interface HealthChange {
  kind: HealthChangeKind;
  /** How much health changed, always positive. */
  amount: number;
  /** Grows with every change, so the same effect twice in a row restarts its animation. */
  id: number;
}

/**
 * The latest change of the hero's health while the panel is on screen, or `null` once its effect
 * has played. The health the panel mounts with is not a change, so moving to another room does
 * not replay the effect.
 */
export function useHealthChange(health: number) {
  const [previous, setPrevious] = useState(health);
  const [change, setChange] = useState<HealthChange | null>(null);
  const [lastId, setLastId] = useState(0);

  // Adjusting state during render (not in an effect) avoids one frame without the effect.
  if (health !== previous) {
    const id = lastId + 1;
    setPrevious(health);
    setLastId(id);
    setChange({
      kind: health < previous ? HEALTH_CHANGE.damage : HEALTH_CHANGE.heal,
      amount: Math.abs(health - previous),
      id,
    });
  }

  return { change, clearChange: () => setChange(null) };
}
