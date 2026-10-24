import { HERO_ATTACK_KIND, type HeroAttackKind } from '@/entities/hero';
import {
  chooseUpgrade,
  UPGRADE_AMOUNT,
  UPGRADE_OPTIONS,
  useUpgradeStore,
} from '@/features/upgrade-attack';

/** Colours of the altars, as on `design/reference3.png`: red for physical attack, blue for magic. */
const ALTAR_STYLES: Record<HeroAttackKind, string> = {
  [HERO_ATTACK_KIND.attack]:
    'border-[#8a3a34] bg-[#3a1c1a] text-[#e05a5a] enabled:hover:border-[#e05a5a] enabled:hover:shadow-[0_0_calc(60*var(--px))_#c8323c] focus-visible:border-[#e05a5a]',
  [HERO_ATTACK_KIND.magic]:
    'border-[#34508a] bg-[#1a243a] text-[#5a8de0] enabled:hover:border-[#5a8de0] enabled:hover:shadow-[0_0_calc(60*var(--px))_#3260c8] focus-visible:border-[#5a8de0]',
};

const CHOSEN_STYLES: Record<HeroAttackKind, string> = {
  [HERO_ATTACK_KIND.attack]: 'border-[#e05a5a] shadow-[0_0_calc(80*var(--px))_#c8323c]',
  [HERO_ATTACK_KIND.magic]: 'border-[#5a8de0] shadow-[0_0_calc(80*var(--px))_#3260c8]',
};

export function UpgradeRoom() {
  const chosen = useUpgradeStore((state) => state.chosen);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-[calc(80*var(--px))] bg-[#0b0b0b]">
      <h1 className="m-0 text-[length:calc(56*var(--px))] leading-none font-bold text-[#e8e2d4]">
        {chosen === null ? 'Оберіть дар' : 'Двері відчинено'}
      </h1>
      <div className="flex gap-[calc(140*var(--px))]">
        {UPGRADE_OPTIONS.map(({ kind, name, icon }) => {
          const isChosen = chosen === kind;
          return (
            <button
              key={kind}
              type="button"
              className={`flex h-[calc(560*var(--px))] w-[calc(320*var(--px))] cursor-pointer flex-col items-center justify-center gap-[calc(32*var(--px))] rounded-t-full rounded-b-[calc(24*var(--px))] border-[length:calc(6*var(--px))] font-bold transition-[border-color,box-shadow,opacity] focus-visible:outline-none disabled:cursor-default ${ALTAR_STYLES[kind]} ${
                isChosen ? CHOSEN_STYLES[kind] : ''
              } ${chosen !== null && !isChosen ? 'opacity-30' : ''}`}
              disabled={chosen !== null}
              aria-pressed={isChosen}
              aria-label={`${name} +${UPGRADE_AMOUNT}`}
              onClick={() => chooseUpgrade(kind)}
            >
              <span className="text-[length:calc(180*var(--px))] leading-none" aria-hidden="true">
                {icon}
              </span>
              <span className="text-[length:calc(64*var(--px))] leading-none" aria-hidden="true">
                +{UPGRADE_AMOUNT}
              </span>
              <span className="text-[length:calc(40*var(--px))] leading-none" aria-hidden="true">
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
