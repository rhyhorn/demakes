/** Slots in the mouth on the left panel, as on the reference: two jaws of six. */
export const TOOTH_SLOT_COUNT = 12;

/** Kinds of teeth. There are only examples for now: real teeth will replace them. */
export const TOOTH_TYPE = {
  test: 'test',
  sweet: 'sweet',
} as const;

export type ToothType = (typeof TOOTH_TYPE)[keyof typeof TOOTH_TYPE];

/** How each kind of tooth is called. */
export const TOOTH_TYPES: Record<ToothType, { name: string }> = {
  [TOOTH_TYPE.test]: { name: 'Тестовий зуб' },
  [TOOTH_TYPE.sweet]: { name: 'Солодкий зуб' },
};
