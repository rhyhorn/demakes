/** Every trap the game knows. Add a type here and describe it in `TRAP_TYPES`. */
export const TRAP_TYPE = {
  spikes: 'spikes',
} as const;

export type TrapType = (typeof TRAP_TYPE)[keyof typeof TRAP_TYPE];

export interface TrapTypeConfig {
  /** Name shown to the player. */
  name: string;
  /** What the trap does, in the words shown to the player in the hint panel. */
  description: string;
  /** Health the hero loses every time she lands on the trap, whatever her attack. */
  damage: number;
}

export interface TrapSpawnConfig {
  /**
   * Which traps appear and how often. They share one pool with the enemy types (`ENEMY_SPAWN`),
   * so the weights are relative to the enemies' ones.
   */
  types: readonly { type: TrapType; weight: number }[];
}
