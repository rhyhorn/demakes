import { useBoardStore } from '@/entities/board';
import { type Enemy, getActiveAttack, useEnemyStore } from '@/entities/enemy';
import { useHeroStore } from '@/entities/hero';

/**
 * Damage the hero takes from the enemy: by how much the enemy's active attack is stronger than
 * the hero's attack of the same kind, or 0 if the hero's is not weaker.
 */
export function getEnemyDamage(enemy: Enemy, hero: { attack: number; magic: number }): number {
  const { kind, value } = getActiveAttack(enemy);
  return Math.max(0, value - hero[kind]);
}

/**
 * Moves the player into the row. If the move happened, an enemy on the player's new cell hits the
 * hero and disappears, then the rest of the enemies take their turn.
 */
export function enterRow(row: number, random?: () => number) {
  const { visited } = useBoardStore.getState();
  useBoardStore.getState().enterRow(row, random);
  const { visited: visitedNow, playerIndex } = useBoardStore.getState();
  if (visitedNow === visited || playerIndex === null) return;

  const { enemies, removeEnemy, advanceTurn } = useEnemyStore.getState();
  const enemy = enemies[playerIndex];
  if (enemy) {
    const hero = useHeroStore.getState();
    hero.takeDamage(getEnemyDamage(enemy, hero));
  }
  removeEnemy(playerIndex);
  advanceTurn();
}
