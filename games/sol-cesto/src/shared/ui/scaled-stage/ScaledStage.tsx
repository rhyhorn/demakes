import type { CSSProperties, ReactNode } from 'react';

import styles from './ScaledStage.module.css';

interface ScaledStageProps {
  /** Design width in pixels; the stage keeps width / height as its aspect ratio. */
  width: number;
  height: number;
  children: ReactNode;
}

/**
 * Centers its content and scales it to fit the screen while keeping the aspect ratio.
 * Inside, 1 design pixel equals `var(--px)`.
 */
export function ScaledStage({ width, height, children }: ScaledStageProps) {
  const style = {
    '--stage-ratio': `${width} / ${height}`,
    '--px': `calc(100cqw / ${width})`,
  } as CSSProperties;

  return (
    <div className={styles.viewport}>
      <div className={styles.stage} style={style}>
        {children}
      </div>
    </div>
  );
}
