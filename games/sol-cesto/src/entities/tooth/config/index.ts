/** Slots in the mouth on the left panel, as on the reference: two jaws of six. */
export const TOOTH_SLOT_COUNT = 12;

/** Kinds of teeth. There are only examples for now: real teeth will replace them. */
export const TOOTH_TYPE = {
  test: 'test',
  sweet: 'sweet',
  fang: 'fang',
  golden: 'golden',
  moon: 'moon',
  rotten: 'rotten',
  iron: 'iron',
  bone: 'bone',
  crystal: 'crystal',
  wisdom: 'wisdom',
} as const;

export type ToothType = (typeof TOOTH_TYPE)[keyof typeof TOOTH_TYPE];

/** How each kind of tooth is called. */
export const TOOTH_TYPES: Record<ToothType, { name: string }> = {
  [TOOTH_TYPE.test]: { name: 'Тестовий зуб' },
  [TOOTH_TYPE.sweet]: { name: 'Солодкий зуб' },
  [TOOTH_TYPE.fang]: { name: 'Ікло' },
  [TOOTH_TYPE.golden]: { name: 'Золотий зуб' },
  [TOOTH_TYPE.moon]: { name: 'Місячний зуб' },
  [TOOTH_TYPE.rotten]: { name: 'Гнилий зуб' },
  [TOOTH_TYPE.iron]: { name: 'Залізний зуб' },
  [TOOTH_TYPE.bone]: { name: 'Кістяний зуб' },
  [TOOTH_TYPE.crystal]: { name: 'Кришталевий зуб' },
  [TOOTH_TYPE.wisdom]: { name: 'Зуб мудрості' },
};
