export { TOOTH_SLOT_COUNT, TOOTH_TYPE, type ToothType, TOOTH_TYPES } from './config';
export { MAX_MODIFIER, MIN_MODIFIER, MODIFIER, type Modifier, MODIFIERS } from './config/modifiers';
export { clampModifier, type Modifiers, NO_MODIFIERS } from './model/modifiers';
export { getTeethModifiers } from './model/teethModifiers';
export {
  createStartingSlots,
  TEST_TOOTH,
  type Tooth,
  type ToothProperty,
  type ToothSlot,
  useToothStore,
} from './model/toothStore';
