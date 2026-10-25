import { useHeroStore } from '@/entities/hero';
import { getTeethGoldMultiplier, useToothStore } from '@/entities/tooth';

/** The gold multiplier now: the hero's base multiplier plus the bonus of the teeth in the mouth. */
export function useGoldMultiplier() {
  const base = useHeroStore((state) => state.goldMultiplier);
  const teeth = useToothStore((state) => state.slots);
  return base + getTeethGoldMultiplier(teeth);
}
