import { ENEMY_BEHAVIOR_DESCRIPTIONS, ENEMY_TYPES } from '../config';
import {
  type AttackKind,
  type Enemy,
  type EnemyBehaviorId,
  type EnemyType,
  RANDOM_ATTACK,
  type StartAttack,
} from './types';

function pickStartAttack(startAttack: StartAttack, random: () => number): AttackKind {
  if (startAttack !== RANDOM_ATTACK) return startAttack;
  return random() < 0.5 ? 'attack' : 'magic';
}

/**
 * A fresh enemy with the stats of its type. `random` picks the starting attack for types that
 * start with a random one, and is not called for the rest.
 */
export function createEnemy(type: EnemyType, random: () => number = Math.random): Enemy {
  const { activeAttack, ...stats } = ENEMY_TYPES[type].stats;
  return { type, ...stats, activeAttack: pickStartAttack(activeAttack, random) };
}

/** The attack the enemy uses right now and its power. */
export function getActiveAttack(enemy: Enemy): { kind: AttackKind; value: number } {
  return { kind: enemy.activeAttack, value: enemy[enemy.activeAttack] };
}

/** A behavior returns the enemy as it is after one player move. */
type EnemyBehavior = (enemy: Enemy) => Enemy;

export const ENEMY_BEHAVIORS: Record<EnemyBehaviorId, EnemyBehavior> = {
  switchAttackEachTurn: (enemy) => ({
    ...enemy,
    activeAttack: enemy.activeAttack === 'attack' ? 'magic' : 'attack',
  }),
};

/** Applies every behavior of the enemy's type, in the order the config lists them. */
export function advanceEnemy(enemy: Enemy): Enemy {
  return ENEMY_TYPES[enemy.type].behaviors.reduce(
    (current, behavior) => ENEMY_BEHAVIORS[behavior](current),
    enemy,
  );
}

/** Descriptions of the type's special behaviors, in config order. Empty for a static enemy. */
export function getEnemyTraits(type: EnemyType): string[] {
  return ENEMY_TYPES[type].behaviors.map((behavior) => ENEMY_BEHAVIOR_DESCRIPTIONS[behavior]);
}
