/** Slots in the mouth on the left panel, as on the reference: two jaws of six. */
export const TOOTH_SLOT_COUNT = 12;

/**
 * Kinds of teeth. There is only a placeholder for now: real teeth with their own effects will
 * replace it.
 */
export const TOOTH_TYPE = {
  placeholder: 'placeholder',
} as const;

export type ToothType = (typeof TOOTH_TYPE)[keyof typeof TOOTH_TYPE];

/** How each kind of tooth is called. */
export const TOOTH_TYPES: Record<ToothType, { name: string }> = {
  [TOOTH_TYPE.placeholder]: { name: 'Зуб' },
};
