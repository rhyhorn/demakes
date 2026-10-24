import type { CellWeight } from '@/entities/board';
import { type AttackKind, type Enemy, type EnemyMap, getActiveAttack } from '@/entities/enemy';
import { MODIFIER, type Modifier, type Modifiers } from '@/entities/modifier';

/** The modifier that makes enemies with this active attack easier to land on. */
const CHANCE_MODIFIER: Record<AttackKind, Modifier> = {
  attack: MODIFIER.attackChance,
  magic: MODIFIER.magicChance,
};

/**
 * Weight of a cell when picking where the player lands: 1, plus the chance modifier of the enemy's
 * active attack in percent (+50% gives 1.5). The attack shown on the badge counts.
 */
export function getCellWeight(enemy: Enemy | undefined, modifiers: Modifiers): number {
  if (!enemy) return 1;
  return 1 + modifiers[CHANCE_MODIFIER[getActiveAttack(enemy).kind]] / 100;
}

/** Weights of every board cell for these enemies and modifiers. */
export function getCellWeights(enemies: EnemyMap, modifiers: Modifiers): CellWeight {
  return (index) => getCellWeight(enemies[index], modifiers);
}
