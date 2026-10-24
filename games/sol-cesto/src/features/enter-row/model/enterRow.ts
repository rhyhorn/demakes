import { useBoardStore } from '@/entities/board';
import { type Enemy, getActiveAttack, useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { useHeroStore } from '@/entities/hero';
import { useModifierStore } from '@/entities/modifier';
import { PICKUP_EFFECT, type PickupEffect, PICKUP_TYPES, usePickupStore } from '@/entities/pickup';
import { pickCount } from '@/shared/lib';

import { getCellWeights } from './cellWeight';

/**
 * Damage the hero takes from the enemy: by how much the enemy's active attack is stronger than
 * the hero's attack of the same kind, or 0 if the hero's is not weaker.
 */
export function getEnemyDamage(enemy: Enemy, hero: { attack: number; magic: number }): number {
  const { kind, value } = getActiveAttack(enemy);
  return Math.max(0, value - hero[kind]);
}

/** Gives the hero what the pickup holds: health back or a random amount of gold. */
function applyPickupEffect(effect: PickupEffect, random: () => number) {
  const hero = useHeroStore.getState();
  if (effect.kind === PICKUP_EFFECT.heal) hero.heal(effect.amount);
  else hero.addGold(pickCount(effect, random));
}

/**
 * Moves the player into the row: cells with enemies are more or less likely to be picked as the
 * chance modifiers say. If the move happened, an enemy on the player's new cell hits the
 * hero and disappears, and a pickup there gives her what it holds (health or gold) and disappears
 * too. Then the rest of the enemies take their turn. When the hit takes the hero's health to 0, the
 * game is over.
 */
export function enterRow(row: number, random: () => number = Math.random) {
  const { visited } = useBoardStore.getState();
  const weightOf = getCellWeights(
    useEnemyStore.getState().enemies,
    useModifierStore.getState().modifiers,
  );
  useBoardStore.getState().enterRow(row, random, weightOf);
  const { visited: visitedNow, playerIndex } = useBoardStore.getState();
  if (visitedNow === visited || playerIndex === null) return;

  const { enemies, removeEnemy, advanceTurn } = useEnemyStore.getState();
  const enemy = enemies[playerIndex];
  if (enemy) {
    const hero = useHeroStore.getState();
    hero.takeDamage(getEnemyDamage(enemy, hero));
    if (useHeroStore.getState().health === 0)
      useGameStore.getState().showScreen(GAME_SCREEN.gameOver);
  }
  removeEnemy(playerIndex);

  const { pickups, removePickup } = usePickupStore.getState();
  const pickup = pickups[playerIndex];
  if (pickup) applyPickupEffect(PICKUP_TYPES[pickup].effect, random);
  removePickup(playerIndex);

  advanceTurn();
}
