/** Every pickup the game knows. Add a type here and describe it in `PICKUP_TYPES`. */
export const PICKUP_TYPE = {
  strawberry: 'strawberry',
  chest: 'chest',
} as const;

export type PickupType = (typeof PICKUP_TYPE)[keyof typeof PICKUP_TYPE];

/** What a pickup can do to the hero on entering its cell. */
export const PICKUP_EFFECT = {
  heal: 'heal',
  gold: 'gold',
} as const;

export type PickupEffect =
  /** Gives the hero `amount` health back. */
  | { kind: typeof PICKUP_EFFECT.heal; amount: number }
  /** Gives the hero a random amount of gold, from `min` to `max` inclusive. */
  | { kind: typeof PICKUP_EFFECT.gold; min: number; max: number };

export interface PickupTypeConfig {
  /** Name shown to the player. */
  name: string;
  /** What the pickup does, in the words shown to the player in the hint panel. */
  description: string;
  effect: PickupEffect;
}

export interface PickupSpawnConfig {
  /** Which types fill the free cells and how often, relative to each other. */
  types: readonly { type: PickupType; weight: number }[];
}
