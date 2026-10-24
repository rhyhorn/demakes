/** Every pickup the game knows. Add a type here and describe it in `PICKUP_TYPES`. */
export const PICKUP_TYPE = {
  strawberry: 'strawberry',
} as const;

export type PickupType = (typeof PICKUP_TYPE)[keyof typeof PICKUP_TYPE];

export interface PickupTypeConfig {
  /** Name shown to the player. */
  name: string;
  /** What the pickup does, in the words shown to the player in the hint panel. */
  description: string;
  /** Health the hero gets back on entering the cell. */
  heal: number;
}

export interface PickupSpawnConfig {
  /** Which types fill the free cells and how often, relative to each other. */
  types: readonly { type: PickupType; weight: number }[];
}
