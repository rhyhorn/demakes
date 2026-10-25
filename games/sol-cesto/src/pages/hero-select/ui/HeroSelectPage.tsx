import { HERO_CLASS, HERO_CLASSES, type HeroClass, HeroClassFigure } from '@/entities/hero';
import { chooseHero } from '@/features/choose-hero';
import { SCENE_HEIGHT, SCENE_WIDTH } from '@/shared/config';
import { ScaledStage } from '@/shared/ui';

const HERO_CHOICES = Object.values(HERO_CLASS);

/** A hero to pick: their figure, name, what they are good at and their attack and magic. */
function HeroCard({ heroClass }: { heroClass: HeroClass }) {
  const { name, description, stats } = HERO_CLASSES[heroClass];

  return (
    <button
      type="button"
      className="flex h-full w-[calc(440*var(--px))] cursor-pointer flex-col items-center gap-[calc(24*var(--px))] rounded-[calc(16*var(--px))] border-[length:calc(4*var(--px))] border-[#77776c] bg-[#2b2b28] px-[calc(32*var(--px))] py-[calc(48*var(--px))] text-[#f4e3c1] transition-transform hover:-translate-y-[calc(8*var(--px))] hover:border-[#e8c46a] focus-visible:border-[#e8c46a] focus-visible:outline-none"
      aria-label={`${name}: атака ${stats.attack}, магія ${stats.magic}`}
      onClick={() => chooseHero(heroClass)}
    >
      <HeroClassFigure size={220} heroClass={heroClass} />
      <span className="text-[length:calc(64*var(--px))] leading-none font-bold text-[#e8c46a]">
        {name}
      </span>
      <span className="text-[length:calc(30*var(--px))] leading-tight">{description}</span>
      <span
        className="flex gap-[calc(40*var(--px))] text-[length:calc(56*var(--px))] font-bold"
        aria-hidden="true"
      >
        <span className="text-[#e05a5a]">🗡 {stats.attack}</span>
        <span className="text-[#5a8de0]">🌀 {stats.magic}</span>
      </span>
    </button>
  );
}

/** The start of a run, without sidebars: the player picks the hero whose stats the run starts with. */
export function HeroSelectPage() {
  return (
    <ScaledStage width={SCENE_WIDTH} height={SCENE_HEIGHT}>
      <main className="flex h-full w-full flex-col items-center justify-center gap-[calc(80*var(--px))]">
        <h1 className="m-0 text-[length:calc(96*var(--px))] leading-none font-bold tracking-[0.05em] text-[#f4e3c1] uppercase">
          Оберіть героя
        </h1>
        <ul className="m-0 flex list-none gap-[calc(96*var(--px))] p-0">
          {HERO_CHOICES.map((heroClass) => (
            <li key={heroClass}>
              <HeroCard heroClass={heroClass} />
            </li>
          ))}
        </ul>
      </main>
    </ScaledStage>
  );
}
