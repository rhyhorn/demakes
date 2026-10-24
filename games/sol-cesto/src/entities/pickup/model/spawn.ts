import { pickWeighted } from '@/shared/lib';

import { PICKUP_SPAWN } from '../config';
import type { PickupSpawnConfig, PickupType } from './types';

/** Pickups by the index of the cell they lie on. */
export type PickupMap = Partial<Record<number, PickupType>>;

/** Fills every one of `cells` with a pickup of a type picked by its weight. */
export function spawnPickups(
  cells: readonly number[],
  random: () => number = Math.random,
  { types }: PickupSpawnConfig = PICKUP_SPAWN,
): PickupMap {
  const pickups: PickupMap = {};
  cells.forEach((cell) => {
    const entry = pickWeighted(types, random);
    if (entry) pickups[cell] = entry.type;
  });
  return pickups;
}
