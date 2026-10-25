import { type CellDanger, getCellDamage } from './enterRow';

/**
 * What happens to the hero on entering a cell: nothing bad (`safe`), she loses `damage` health
 * (`damage`), or that damage takes her health to 0 or below (`death`).
 */
export type CellOutcome =
  { kind: 'safe' } | { kind: 'damage'; damage: number } | { kind: 'death'; damage: number };

export function getCellOutcome(
  danger: CellDanger,
  hero: { health: number; attack: number; magic: number },
): CellOutcome {
  const damage = getCellDamage(danger, hero);
  if (damage === 0) return { kind: 'safe' };
  return { kind: hero.health - damage <= 0 ? 'death' : 'damage', damage };
}
