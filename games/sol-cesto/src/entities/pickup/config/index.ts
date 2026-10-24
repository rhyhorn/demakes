import {
  PICKUP_EFFECT,
  PICKUP_TYPE,
  type PickupSpawnConfig,
  type PickupType,
  type PickupTypeConfig,
} from '../model/types';

export const PICKUP_TYPES: Record<PickupType, PickupTypeConfig> = {
  [PICKUP_TYPE.strawberry]: {
    name: 'Полуниця',
    description: "Лікує вас на 1 здоров'я.",
    effect: { kind: PICKUP_EFFECT.heal, amount: 1 },
  },
  [PICKUP_TYPE.chest]: {
    name: 'Скриня',
    description: 'Містить від 3 до 6 золота.',
    effect: { kind: PICKUP_EFFECT.gold, min: 3, max: 6 },
  },
};

export const PICKUP_SPAWN: PickupSpawnConfig = {
  types: [
    { type: PICKUP_TYPE.strawberry, weight: 3 },
    { type: PICKUP_TYPE.chest, weight: 1 },
  ],
};
