import { useHeroStore } from '@/entities/hero';

export function PiggyBankPanel() {
  const gold = useHeroStore((state) => state.gold);

  return (
    <div
      className="flex items-center justify-center gap-[calc(20*var(--px))] text-[length:calc(72*var(--px))] font-bold text-[#f2c14e]"
      aria-label={`Золото: ${gold}`}
    >
      <span className="leading-none" aria-hidden="true">
        🪙
      </span>
      <span aria-hidden="true">{gold}</span>
    </div>
  );
}
