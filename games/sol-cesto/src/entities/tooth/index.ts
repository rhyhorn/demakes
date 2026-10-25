export { TOOTH_SLOT_COUNT, TOOTH_TYPE, type ToothType, TOOTH_TYPES } from './config';
export { MAX_MODIFIER, MIN_MODIFIER, MODIFIER, type Modifier, MODIFIERS } from './config/modifiers';
export {
  clampModifier,
  describeToothProperty,
  formatModifier,
  type Modifiers,
  NO_MODIFIERS,
} from './model/modifiers';
export { getTeethModifiers } from './model/teethModifiers';
export {
  createStartingSlots,
  STARTING_TEETH,
  SWEET_TOOTH,
  TEST_TOOTH,
  type Tooth,
  type ToothProperty,
  type ToothSlot,
  useToothStore,
} from './model/toothStore';
