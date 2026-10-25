import type { ReactNode } from 'react';

import styles from './CellVanishEffect.module.css';

/** Whether what vanished was bad for the hero (an enemy) or good (a pickup). */
export const VANISH_TONE = { negative: 'negative', positive: 'positive' } as const;
export type VanishTone = (typeof VANISH_TONE)[keyof typeof VANISH_TONE];

/**
 * Plays over the cell where something vanished: the sprite flashes (white for an enemy, green for
 * a pickup) and shrinks away, a ring of the same color bursts out of it under the hero who may
 * stand there, and `icon` floats up over her. Calls `onFinish` once the icon, the longest part, is
 * gone.
 */
export function CellVanishEffect({
  tone,
  icon,
  onFinish,
  children,
}: {
  tone: VanishTone;
  icon: string;
  onFinish: () => void;
  /** The sprite of what vanished. */
  children: ReactNode;
}) {
  return (
    <span
      className={`${styles[tone]} pointer-events-none absolute inset-0 flex items-center justify-center`}
      aria-hidden="true"
    >
      <span className={styles.ring} />
      <span className={styles.figure}>{children}</span>
      <span className={styles.icon} onAnimationEnd={onFinish}>
        {icon}
      </span>
    </span>
  );
}
