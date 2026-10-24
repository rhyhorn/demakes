export { ENEMY_BEHAVIOR_DESCRIPTIONS, ENEMY_SPAWN, ENEMY_TYPES } from './config';
export {
  advanceEnemy,
  createEnemy,
  ENEMY_BEHAVIORS,
  getActiveAttack,
  getEnemyTraits,
} from './model/enemy';
export { useEnemyStore } from './model/enemyStore';
export { type EnemyMap, spawnEnemies } from './model/spawn';
export type {
  AttackKind,
  Enemy,
  EnemyBehaviorId,
  EnemySpawnConfig,
  EnemyType,
  EnemyTypeConfig,
} from './model/types';
export { EnemyAttackBadge } from './ui/EnemyAttackBadge';
export { EnemyFigure } from './ui/EnemyFigure';
