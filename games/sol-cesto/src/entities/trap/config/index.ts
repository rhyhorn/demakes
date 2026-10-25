import {
  TRAP_TYPE,
  type TrapSpawnConfig,
  type TrapType,
  type TrapTypeConfig,
} from '../model/types';

export const TRAP_TYPES: Record<TrapType, TrapTypeConfig> = {
  /** Spikes in the floor: always hurt, never go away, so the hero can land on them again. */
  [TRAP_TYPE.spikes]: {
    name: 'Шипи',
    description: "−1 здоров'я. Не зникають: можна потрапити знову.",
    damage: 1,
  },
};

/** Rarer than any enemy type: the enemies' weights add up to 6. */
export const TRAP_SPAWN: TrapSpawnConfig = {
  types: [{ type: TRAP_TYPE.spikes, weight: 1 }],
};
