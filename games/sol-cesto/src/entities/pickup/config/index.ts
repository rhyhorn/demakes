import {
  PICKUP_TYPE,
  type PickupSpawnConfig,
  type PickupType,
  type PickupTypeConfig,
} from '../model/types';

export const PICKUP_TYPES: Record<PickupType, PickupTypeConfig> = {
  [PICKUP_TYPE.strawberry]: {
    name: 'Полуниця',
    description: "Лікує вас на 1 здоров'я.",
    heal: 1,
  },
};

export const PICKUP_SPAWN: PickupSpawnConfig = {
  types: [{ type: PICKUP_TYPE.strawberry, weight: 1 }],
};
