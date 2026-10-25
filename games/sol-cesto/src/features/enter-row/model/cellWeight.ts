import type { CellWeight } from '@/entities/board';
import { type AttackKind, type Enemy, type EnemyMap, getActiveAttack } from '@/entities/enemy';
import { MODIFIER, type Modifier, type Modifiers } from '@/entities/tooth';
import { PICKUP_TYPE, type PickupMap, type PickupType } from '@/entities/pickup';
import { TRAP_TYPE, type TrapMap, type TrapType } from '@/entities/trap';

/** The modifier that makes enemies with this active attack easier or harder to land on. */
const ENEMY_CHANCE_MODIFIER: Record<AttackKind, Modifier> = {
  attack: MODIFIER.attackChance,
  magic: MODIFIER.magicChance,
};

/** The modifier that makes pickups of this type easier or harder to land on. */
const PICKUP_CHANCE_MODIFIER: Record<PickupType, Modifier> = {
  [PICKUP_TYPE.strawberry]: MODIFIER.strawberryChance,
  [PICKUP_TYPE.chest]: MODIFIER.chestChance,
};

/** The modifier that makes traps of this type easier or harder to land on. */
const TRAP_CHANCE_MODIFIER: Record<TrapType, Modifier> = {
  [TRAP_TYPE.spikes]: MODIFIER.spikesChance,
};

/** What lies on a cell: an enemy, a pickup, a trap or nothing. */
interface CellContent {
  enemy?: Enemy;
  pickup?: PickupType;
  trap?: TrapType;
}

function getChanceModifier({ enemy, pickup, trap }: CellContent): Modifier | undefined {
  if (enemy) return ENEMY_CHANCE_MODIFIER[getActiveAttack(enemy).kind];
  if (pickup) return PICKUP_CHANCE_MODIFIER[pickup];
  return trap && TRAP_CHANCE_MODIFIER[trap];
}

/**
 * Weight of a cell when picking where the player lands: 1, plus the chance modifier of what lies
 * there in percent (+50% gives 1.5, -50% gives 0.5). For an enemy the attack shown on the badge
 * counts. An empty cell weighs 1.
 */
export function getCellWeight(content: CellContent, modifiers: Modifiers): number {
  const modifier = getChanceModifier(content);
  return modifier ? 1 + modifiers[modifier] / 100 : 1;
}

/** Weights of every board cell for these enemies, pickups, traps and modifiers. */
export function getCellWeights(
  enemies: EnemyMap,
  pickups: PickupMap,
  traps: TrapMap,
  modifiers: Modifiers,
): CellWeight {
  return (index) =>
    getCellWeight({ enemy: enemies[index], pickup: pickups[index], trap: traps[index] }, modifiers);
}
