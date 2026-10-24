import { useHeroStore } from '@/entities/hero';

export function HeroPanel() {
  const health = useHeroStore((state) => state.health);
  const maxHealth = useHeroStore((state) => state.maxHealth);
  const attack = useHeroStore((state) => state.attack);
  const magic = useHeroStore((state) => state.magic);

  return (
    <div className="flex h-full w-full flex-col items-center justify-between p-[calc(24*var(--px))]">
      <div
        className="relative flex size-[calc(200*var(--px))] items-center justify-center"
        aria-label={`Здоров'я: ${health} з ${maxHealth}`}
      >
        <span
          className="absolute inset-0 flex items-center justify-center text-[length:calc(220*var(--px))] leading-none text-[#c8323c]"
          aria-hidden="true"
        >
          ♥
        </span>
        <span
          className="relative text-[length:calc(56*var(--px))] font-bold text-[#f4e3c1]"
          aria-hidden="true"
        >
          {health}/{maxHealth}
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
