import type { Tooth } from '../model/toothStore';
import { TOOTH_TYPE } from '.';
import { MODIFIER } from './modifiers';

const { attackChance, magicChance, strawberryChance, chestChance } = MODIFIER;

/** A tooth for testing: +50% to physical enemies and -50% to strawberries. */
export const TEST_TOOTH: Tooth = {
  type: TOOTH_TYPE.test,
  properties: [
    { modifier: attackChance, value: 50 },
    { modifier: strawberryChance, value: -50 },
  ],
};

/** A tooth for testing with a single property: +25% to strawberries. */
export const SWEET_TOOTH: Tooth = {
  type: TOOTH_TYPE.sweet,
  properties: [{ modifier: strawberryChance, value: 25 }],
};

/**
 * Every tooth the hero may be offered during a run, e.g. in the tooth room. The pool is fixed:
 * edit it here to balance the buffs against the debuffs. Taking a tooth doesn't remove it from
 * the pool, so the mouth may hold the same tooth twice. Test values for now.
 */
export const TOOTH_POOL: readonly Tooth[] = [
  TEST_TOOTH,
  SWEET_TOOTH,
  {
    type: TOOTH_TYPE.fang,
    properties: [
      { modifier: attackChance, value: 25 },
      { modifier: magicChance, value: -25 },
    ],
  },
  {
    type: TOOTH_TYPE.golden,
    properties: [
      { modifier: chestChance, value: 50 },
      { modifier: strawberryChance, value: -25 },
    ],
  },
  {
    type: TOOTH_TYPE.moon,
    properties: [{ modifier: magicChance, value: -50 }],
  },
  {
    type: TOOTH_TYPE.rotten,
    properties: [
      { modifier: strawberryChance, value: 42 },
      { modifier: magicChance, value: 25 },
    ],
  },
  {
    type: TOOTH_TYPE.iron,
    properties: [
      { modifier: attackChance, value: -30 },
      { modifier: chestChance, value: -20 },
    ],
  },
  {
    type: TOOTH_TYPE.bone,
    properties: [{ modifier: chestChance, value: 25 }],
  },
  {
    type: TOOTH_TYPE.crystal,
    properties: [
      { modifier: magicChance, value: 40 },
      { modifier: chestChance, value: 40 },
    ],
  },
  {
    type: TOOTH_TYPE.wisdom,
    properties: [
      { modifier: strawberryChance, value: 30 },
      { modifier: attackChance, value: 20 },
    ],
  },
];

/** Teeth a run starts with. */
export const STARTING_TEETH: readonly Tooth[] = [TEST_TOOTH, SWEET_TOOTH];
