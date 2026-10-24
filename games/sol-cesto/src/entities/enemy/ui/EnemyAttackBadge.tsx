import { Badge } from '@/shared/ui';

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
    <Badge corner="left" label={`${label}: ${value}`} className="bg-[#5c5f63] text-[#e8e2d4]">
      <span className={color} aria-hidden="true">
        {icon}
      </span>
      <span aria-hidden="true">{value}</span>
    </Badge>
  );
}
