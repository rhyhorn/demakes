import type { EnemySpawnConfig, EnemyType, EnemyTypeConfig } from '../model/types';

export const ENEMY_TYPES: Record<EnemyType, EnemyTypeConfig> = {
  /** Static: always hits with its physical attack. */
  beast: {
    name: 'Звір',
    stats: { attack: 3, magic: 0, activeAttack: 'attack' },
    behaviors: [],
  },
  /** Dynamic: swaps physical and magic attack after every player move. */
  shifter: {
    name: 'Перевертень',
    stats: { attack: 2, magic: 1, activeAttack: 'magic' },
    behaviors: ['switchAttackEachTurn'],
  },
};

export const ENEMY_SPAWN: EnemySpawnConfig = {
  perRow: { min: 1, max: 2 },
  types: [
    { type: 'beast', weight: 1 },
    { type: 'shifter', weight: 1 },
  ],
};
