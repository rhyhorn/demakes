import { pickRowCell, useBoardStore } from '@/entities/board';
import { type Enemy, getActiveAttack, useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { useHeroStore } from '@/entities/hero';
import { PICKUP_EFFECT, type PickupEffect, PICKUP_TYPES, usePickupStore } from '@/entities/pickup';
import { getTeethGoldMultiplier, getTeethModifiers, useToothStore } from '@/entities/tooth';
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

/**
 * Gives the hero what the pickup holds: health back or a random amount of gold, multiplied by her
 * gold multiplier with the bonus of the teeth in the mouth.
 */
function applyPickupEffect(effect: PickupEffect, random: () => number) {
  const hero = useHeroStore.getState();
  if (effect.kind === PICKUP_EFFECT.heal) hero.heal(effect.amount);
  else
    hero.addGold(pickCount(effect, random), getTeethGoldMultiplier(useToothStore.getState().slots));
}

/**
 * Cell of the row the player is going to land on, or undefined if the row has no cells left. Cells
 * with enemies and pickups are more or less likely to be picked as the chance modifiers of the teeth say.
 * Nothing changes yet: the board shows the hero walking there first and then calls `enterCell`.
 */
export function pickEntryCell(row: number, random: () => number = Math.random): number | undefined {
  const weightOf = getCellWeights(
    useEnemyStore.getState().enemies,
    usePickupStore.getState().pickups,
    getTeethModifiers(useToothStore.getState().slots),
  );
  return pickRowCell(row, useBoardStore.getState().visited, random, weightOf);
}

/**
 * Moves the player into the cell. If she hasn't been there yet, an enemy on it hits the hero and
 * disappears, and a pickup there gives her what it holds (health or gold) and disappears too. Then
 * the rest of the enemies take their turn. When the hit takes the hero's health to 0 she dies, but
 * the game isn't over yet: the board plays her death first and then calls `finishDeath`.
 */
export function enterCell(index: number, random: () => number = Math.random) {
  const { visited } = useBoardStore.getState();
  useBoardStore.getState().enterCell(index);
  const { visited: visitedNow, playerIndex } = useBoardStore.getState();
  if (visitedNow === visited || playerIndex === null) return;

  const { enemies, removeEnemy, advanceTurn } = useEnemyStore.getState();
  const enemy = enemies[playerIndex];
  if (enemy) {
    const hero = useHeroStore.getState();
    hero.takeDamage(getEnemyDamage(enemy, hero));
  }
  removeEnemy(playerIndex);

  const { pickups, removePickup } = usePickupStore.getState();
  const pickup = pickups[playerIndex];
  if (pickup) applyPickupEffect(PICKUP_TYPES[pickup].effect, random);
  removePickup(playerIndex);

  advanceTurn();
}

/** Whether the hero has no health left, so her death plays instead of the next move. */
function isHeroDead(): boolean {
  return useHeroStore.getState().health === 0;
}

/** Ends the game with the Game Over screen once the hero's death has played out. */
export function finishDeath() {
  if (isHeroDead()) useGameStore.getState().showScreen(GAME_SCREEN.gameOver);
}

/**
 * Moves the player into the row at once, with no animations: `pickEntryCell`, `enterCell`, and
 * `finishDeath` if she died there.
 */
export function enterRow(row: number, random: () => number = Math.random) {
  const index = pickEntryCell(row, random);
  if (index === undefined) return;
  enterCell(index, random);
  finishDeath();
}
