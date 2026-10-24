import { Badge } from '@/shared/ui';

import type { CellOutcome } from '../model/cellOutcome';

const OUTCOME_VIEW: Record<CellOutcome['kind'], { icon: string; color: string }> = {
  safe: { icon: '❤', color: 'bg-[#e8e2d4] text-[#1a1d21]' },
  damage: { icon: '💔', color: 'bg-[#e8e2d4] text-[#1a1d21]' },
  death: { icon: '💀', color: 'bg-[#141414] text-[#e8e2d4]' },
};

function getLabel(outcome: CellOutcome): string {
  if (outcome.kind === 'safe') return 'Безпечно';
  if (outcome.kind === 'damage') return `Шкода: ${outcome.damage}`;
  return `Смерть, шкода: ${outcome.damage}`;
}

/**
 * What the hero gets on entering the cell. On the reference it takes the place of the enemy's
 * attack in the top left corner while the player hovers the row.
 */
export function CellOutcomeBadge({ outcome }: { outcome: CellOutcome }) {
  const { icon, color } = OUTCOME_VIEW[outcome.kind];

  return (
    <Badge corner="left" label={getLabel(outcome)} className={color}>
      <span className={outcome.kind === 'safe' ? 'text-[#c8323c]' : ''} aria-hidden="true">
        {icon}
      </span>
      <span aria-hidden="true">{outcome.kind === 'safe' ? 'ok' : `-${outcome.damage}`}</span>
    </Badge>
  );
}
