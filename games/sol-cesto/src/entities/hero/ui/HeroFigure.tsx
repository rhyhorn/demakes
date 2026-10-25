import { type HeroClass, HERO_CLASSES } from '../config';
import { useHeroStore } from '../model/heroStore';

/**
 * Placeholder art of the hero of the class until the game gets hero sprites. `size` is its height
 * in design pixels.
 */
export function HeroClassFigure({ size, heroClass }: { size: number; heroClass: HeroClass }) {
  const { name, figure } = HERO_CLASSES[heroClass];

  return (
    <span
      className="leading-none"
      style={{ fontSize: `calc(${size} * var(--px))` }}
      role="img"
      aria-label={name}
    >
      {figure}
    </span>
  );
}

/** The hero the player picked. `size` is its height in design pixels. */
export function HeroFigure({ size }: { size: number }) {
  const heroClass = useHeroStore((state) => state.heroClass);

  return <HeroClassFigure size={size} heroClass={heroClass} />;
}
