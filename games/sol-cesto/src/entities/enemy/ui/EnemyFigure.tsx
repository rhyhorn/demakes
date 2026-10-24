import { ENEMY_TYPES } from '../config';
import type { AttackKind, Enemy, EnemyType } from '../model/types';

/**
 * Placeholder art until the game gets enemy sprites. `tintByAttack` colors the sprite like the
 * hero's stat of the active attack, so an enemy that changes attacks shows its form at a glance.
 */
const ENEMY_SPRITES: Record<EnemyType, { emoji: string; tintByAttack: boolean }> = {
  beast: { emoji: '🐺', tintByAttack: false },
  shifter: { emoji: '👻', tintByAttack: true },
  ogre: { emoji: '👹', tintByAttack: false },
};

/** Recolors a white emoji: red for the physical attack, blue for the magic one. */
const ATTACK_TINTS: Record<AttackKind, string> = {
  attack: '[filter:brightness(0.65)_sepia(1)_saturate(25)_hue-rotate(-38deg)]',
  magic: '[filter:brightness(0.8)_sepia(1)_saturate(12)_hue-rotate(185deg)]',
};

export function EnemyFigure({ enemy }: { enemy: Enemy }) {
  const { emoji, tintByAttack } = ENEMY_SPRITES[enemy.type];

  return (
    <span
      className={`text-[length:calc(120*var(--px))] leading-none ${
        tintByAttack ? ATTACK_TINTS[enemy.activeAttack] : ''
      }`}
      role="img"
      aria-label={ENEMY_TYPES[enemy.type].name}
    >
      {emoji}
    </span>
  );
}
