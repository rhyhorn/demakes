import { ENEMY_TYPES } from '../config';
import type { Enemy, EnemyType } from '../model/types';

/** Placeholder art until the game gets enemy sprites. */
const ENEMY_SPRITES: Record<EnemyType, string> = {
  beast: '🐺',
  shifter: '👻',
};

export function EnemyFigure({ enemy }: { enemy: Enemy }) {
  return (
    <span
      className="text-[length:calc(120*var(--px))] leading-none"
      role="img"
      aria-label={ENEMY_TYPES[enemy.type].name}
    >
      {ENEMY_SPRITES[enemy.type]}
    </span>
  );
}
