import { HERO_INFO } from '../config';

/** Placeholder art until the game gets a hero sprite. `size` is its height in design pixels. */
export function HeroFigure({ size }: { size: number }) {
  return (
    <span
      className="leading-none"
      style={{ fontSize: `calc(${size} * var(--px))` }}
      role="img"
      aria-label={HERO_INFO.name}
    >
      🧝‍♀️
    </span>
  );
}
