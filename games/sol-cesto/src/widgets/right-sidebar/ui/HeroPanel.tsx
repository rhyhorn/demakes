import { HeroFigure, heroPortraitRef, useHeroStore } from '@/entities/hero';
import { getHintHandlers, HINT_TARGET } from '@/entities/hint';

import { HEALTH_CHANGE, useHealthChange } from '../lib/useHealthChange';
import styles from './HeroPanel.module.css';

const PANEL_EFFECT = {
  [HEALTH_CHANGE.damage]: styles.panelDamage,
  [HEALTH_CHANGE.heal]: styles.panelHeal,
};

const HEART_EFFECT = {
  [HEALTH_CHANGE.damage]: styles.heartDamage,
  [HEALTH_CHANGE.heal]: styles.heartHeal,
};

const DELTA_EFFECT = {
  [HEALTH_CHANGE.damage]: styles.deltaDamage,
  [HEALTH_CHANGE.heal]: styles.deltaHeal,
};

export function HeroPanel() {
  const health = useHeroStore((state) => state.health);
  const maxHealth = useHeroStore((state) => state.maxHealth);
  const attack = useHeroStore((state) => state.attack);
  const magic = useHeroStore((state) => state.magic);
  const { change, clearChange } = useHealthChange(health);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between p-[calc(16*var(--px))]"
      {...getHintHandlers({ kind: HINT_TARGET.hero })}
    >
      {change && <div key={change.id} className={PANEL_EFFECT[change.kind]} aria-hidden="true" />}
      <div className="flex w-full items-center justify-between">
        <div
          className="relative flex size-[calc(150*var(--px))] items-center justify-center"
          aria-label={`Здоров'я: ${health} з ${maxHealth}`}
        >
          <span
            key={`heart-${change?.id ?? 0}`}
            className={`${change ? HEART_EFFECT[change.kind] : ''} absolute inset-0 flex items-center justify-center text-[length:calc(170*var(--px))] leading-none text-[#c8323c]`}
            aria-hidden="true"
          >
            ♥
          </span>
          <span
            className="relative text-[length:calc(48*var(--px))] font-bold text-[#f4e3c1]"
            aria-hidden="true"
          >
            {health}/{maxHealth}
          </span>
          {change && (
            <span
              key={`delta-${change.id}`}
              className={`${styles.delta} ${DELTA_EFFECT[change.kind]}`}
              aria-hidden="true"
              onAnimationEnd={clearChange}
            >
              {change.kind === HEALTH_CHANGE.damage ? '−' : '+'}
              {change.amount}
            </span>
          )}
        </div>
        <span ref={heroPortraitRef} className="inline-flex">
          <HeroFigure size={120} />
        </span>
      </div>
      <div className="flex gap-[calc(40*var(--px))] text-[length:calc(48*var(--px))] font-bold">
        <span className="text-[#e05a5a]" aria-label={`Атака: ${attack}`}>
          <span aria-hidden="true">🗡 {attack}</span>
        </span>
        <span className="text-[#5a8de0]" aria-label={`Магія: ${magic}`}>
          <span aria-hidden="true">🌀 {magic}</span>
        </span>
      </div>
    </div>
  );
}
