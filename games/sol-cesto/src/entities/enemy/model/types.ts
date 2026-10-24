/** Physical (`attack`) or magic (`magic`) attack. */
export type AttackKind = 'attack' | 'magic';

/** Every enemy type the game knows. Add a type here and describe it in `ENEMY_TYPES`. */
export type EnemyType = 'beast' | 'shifter';

/** Names of the turn behaviors from `ENEMY_BEHAVIORS`. */
export type EnemyBehaviorId = 'switchAttackEachTurn';

export interface Enemy {
  type: EnemyType;
  /** Physical attack power. */
  attack: number;
  /** Magic attack power. */
  magic: number;
  /** The only attack the enemy uses right now. It can change during the game. */
  activeAttack: AttackKind;
}

export interface EnemyTypeConfig {
  /** Name shown to the player. */
  name: string;
  /** Stats an enemy of this type spawns with. */
  stats: Pick<Enemy, 'attack' | 'magic' | 'activeAttack'>;
  /** Applied in order after every player move. */
  behaviors: readonly EnemyBehaviorId[];
}

export interface EnemySpawnConfig {
  /** How many enemies appear in each row of a new level, inclusive. */
  perRow: { min: number; max: number };
  /** Which types appear and how often, relative to each other. */
  types: readonly { type: EnemyType; weight: number }[];
}
