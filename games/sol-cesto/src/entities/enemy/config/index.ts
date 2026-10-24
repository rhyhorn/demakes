import {
  type EnemyBehaviorId,
  type EnemySpawnConfig,
  type EnemyType,
  type EnemyTypeConfig,
  RANDOM_ATTACK,
} from '../model/types';

export const ENEMY_TYPES: Record<EnemyType, EnemyTypeConfig> = {
  /** Static: always hits with its physical attack. */
  beast: {
    name: 'Звір',
    stats: { attack: 3, magic: 0, activeAttack: 'attack' },
    behaviors: [],
  },
  /** Dynamic: starts with a random attack and swaps physical and magic after every player move. */
  shifter: {
    name: 'Перевертень',
    stats: { attack: 3, magic: 1, activeAttack: RANDOM_ATTACK },
    behaviors: ['switchAttackEachTurn'],
  },
  /** Static and strong: always hits with a heavy physical attack, but appears less often. */
  ogre: {
    name: 'Огр',
    stats: { attack: 4, magic: 0, activeAttack: 'attack' },
    behaviors: [],
  },
  /** Static and deadly: its physical attack kills a fresh hero in one hit, appears rarely. */
  shark: {
    name: 'Акула',
    stats: { attack: 7, magic: 0, activeAttack: 'attack' },
    behaviors: [],
  },
};

/** What every behavior does, in the words shown to the player in the hint panel. */
export const ENEMY_BEHAVIOR_DESCRIPTIONS: Record<EnemyBehaviorId, string> = {
  switchAttackEachTurn: 'Щоходу змінює тип атаки: фізична ⇄ магічна.',
};

export const ENEMY_SPAWN: EnemySpawnConfig = {
  perRow: { min: 1, max: 3 },
  types: [
    { type: 'beast', weight: 2 },
    { type: 'shifter', weight: 2 },
    { type: 'ogre', weight: 1 },
    { type: 'shark', weight: 1 },
  ],
};
