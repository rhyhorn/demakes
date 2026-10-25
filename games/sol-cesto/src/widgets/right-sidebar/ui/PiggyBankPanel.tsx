import { useHeroStore } from '@/entities/hero';
import { getHintHandlers, HINT_TARGET } from '@/entities/hint';

import { useValueChange, VALUE_CHANGE } from '../lib/useValueChange';
import styles from './PiggyBankPanel.module.css';
import { ValueChangeDelta, ValueChangeFlash } from './ValueChangeEffect';

const COIN_EFFECT = {
  [VALUE_CHANGE.decrease]: styles.coinDecrease,
  [VALUE_CHANGE.increase]: styles.coinIncrease,
};

const GOLD_HINT = { kind: HINT_TARGET.gold } as const;

export function PiggyBankPanel() {
  const gold = useHeroStore((state) => state.gold);
  const { change, clearChange } = useValueChange(gold);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center gap-[calc(20*var(--px))] text-[length:calc(72*var(--px))] font-bold text-[#f2c14e] [--gain-color:#f2c14e]"
      aria-label={`Золото: ${gold}`}
      {...getHintHandlers(GOLD_HINT)}
    >
      {change && <ValueChangeFlash key={change.id} change={change} />}
      <span
        key={`coin-${change?.id ?? 0}`}
        className={`${change ? COIN_EFFECT[change.kind] : ''} inline-block leading-none`}
        aria-hidden="true"
      >
        🪙
      </span>
      <span className="relative" aria-hidden="true">
        {gold}
        {change && (
          <ValueChangeDelta
            key={`delta-${change.id}`}
            change={change}
            className="bottom-full left-full"
            onFinish={clearChange}
          />
        )}
      </span>
    </div>
  );
}
