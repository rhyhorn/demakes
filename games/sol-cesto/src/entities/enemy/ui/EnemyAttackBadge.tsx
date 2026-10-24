import { getActiveAttack } from '../model/enemy';
import type { AttackKind, Enemy } from '../model/types';

const ATTACK_VIEW: Record<AttackKind, { icon: string; label: string; color: string }> = {
  attack: { icon: '🗡', label: 'Атака', color: 'text-[#e05a5a]' },
  magic: { icon: '🌀', label: 'Магія', color: 'text-[#5a8de0]' },
};

/** The enemy's active attack, shown in the top left corner of its cell as on the reference. */
export function EnemyAttackBadge({ enemy }: { enemy: Enemy }) {
  const { kind, value } = getActiveAttack(enemy);
  const { icon, label, color } = ATTACK_VIEW[kind];

  return (
    <span
      className="absolute top-[calc(16*var(--px))] left-[calc(20*var(--px))] flex items-center gap-[calc(8*var(--px))] rounded-full bg-[#5c5f63] px-[calc(16*var(--px))] text-[length:calc(40*var(--px))] font-bold text-[#e8e2d4]"
      aria-label={`${label}: ${value}`}
    >
      <span className={color} aria-hidden="true">
        {icon}
      </span>
      <span aria-hidden="true">{value}</span>
    </span>
  );
}
