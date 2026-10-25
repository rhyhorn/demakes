export { TOOTH_SLOT_COUNT, TOOTH_TYPE, type ToothType, TOOTH_TYPES } from './config';
export { GREEDY_TOOTH, STARTING_TEETH, SWEET_TOOTH, TEST_TOOTH, TOOTH_POOL } from './config/teeth';
export {
  GOLD_MULTIPLIER_INFO,
  MAX_MODIFIER,
  MIN_MODIFIER,
  MODIFIER,
  type Modifier,
  MODIFIERS,
} from './config/modifiers';
export {
  clampModifier,
  describeToothProperty,
  formatGoldMultiplierBonus,
  formatModifier,
  isToothPropertyHelpful,
  type Modifiers,
  NO_MODIFIERS,
} from './model/modifiers';
export { getTeethGoldMultiplier, getTeethModifiers } from './model/teethModifiers';
export {
  createStartingSlots,
  isModifierProperty,
  type Tooth,
  type ToothGoldProperty,
  type ToothModifierProperty,
  type ToothProperty,
  type ToothSlot,
  useToothStore,
} from './model/toothStore';
