import { VALUE_CHANGE, type ValueChange } from '../lib/useValueChange';
import styles from './ValueChangeEffect.module.css';

const FLASH = {
  [VALUE_CHANGE.decrease]: styles.flashDecrease,
  [VALUE_CHANGE.increase]: styles.flashIncrease,
};

const DELTA = {
  [VALUE_CHANGE.decrease]: styles.deltaDecrease,
  [VALUE_CHANGE.increase]: styles.deltaIncrease,
};

/**
 * Flashes the edges of the panel it sits in, which must be positioned. Give it `key={change.id}`,
 * so every change restarts it.
 */
export function ValueChangeFlash({ change }: { change: ValueChange }) {
  return <div className={FLASH[change.kind]} aria-hidden="true" />;
}

/**
 * The "−N" that falls or the "+N" that rises next to the changed number. `className` places it;
 * `onFinish` runs once it is gone, the last part of the effect. Give it `key={change.id}` too.
 */
export function ValueChangeDelta({
  change,
  className,
  onFinish,
}: {
  change: ValueChange;
  className: string;
  onFinish: () => void;
}) {
  return (
    <span
      className={`${styles.delta} ${DELTA[change.kind]} ${className}`}
      aria-hidden="true"
      onAnimationEnd={onFinish}
    >
      {change.kind === VALUE_CHANGE.decrease ? '−' : '+'}
      {change.amount}
    </span>
  );
}
