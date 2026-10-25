import { useState } from 'react';

/**
 * The latest hit the hero took on the board, or `null` once its animation has played. `hitId`
 * grows with every hit, so two hits in a row restart the animation. Healing is not a hit, and
 * neither is the health the board mounts with.
 */
export function useHeroHit(health: number) {
  const [previous, setPrevious] = useState(health);
  const [hitId, setHitId] = useState<number | null>(null);
  const [lastId, setLastId] = useState(0);

  // Adjusting state during render (not in an effect) avoids one frame without the animation.
  if (health !== previous) {
    setPrevious(health);
    if (health < previous) {
      const id = lastId + 1;
      setLastId(id);
      setHitId(id);
    }
  }

  return { hitId, finishHit: () => setHitId(null) };
}
