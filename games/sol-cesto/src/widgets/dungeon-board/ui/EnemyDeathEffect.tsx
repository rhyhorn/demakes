import { type Enemy, EnemyFigure } from '@/entities/enemy';

import styles from './EnemyDeathEffect.module.css';

/**
 * Plays over the cell where an enemy died: the enemy flashes white and shrinks away, a ring bursts
 * out of it under the hero who may stand there, and a skull floats up over her. Calls `onFinish`
 * once the skull, the longest part, is gone.
 */
export function EnemyDeathEffect({ enemy, onFinish }: { enemy: Enemy; onFinish: () => void }) {
  return (
    <span
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <span className={styles.ring} />
      <span className={styles.figure}>
        <EnemyFigure enemy={enemy} />
      </span>
      <span className={styles.skull} onAnimationEnd={onFinish}>
        💀
      </span>
    </span>
  );
}
