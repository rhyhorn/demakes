import { Badge } from '@/shared/ui';

import { PICKUP_TYPES } from '../config';
import { PICKUP_EFFECT, type PickupEffect, type PickupType } from '../model/types';

function getLabel(effect: PickupEffect): string {
  if (effect.kind === PICKUP_EFFECT.heal) return `Лікування: +${effect.amount}`;
  return 'Золото: невідомо скільки';
}

/** What the pickup gives, shown in the top left corner of its cell where an enemy shows its attack. */
export function PickupBadge({ type }: { type: PickupType }) {
  const { effect } = PICKUP_TYPES[type];

  return (
    <Badge corner="left" label={getLabel(effect)} className="bg-[#e8e2d4] text-[#1a1d21]">
      {effect.kind === PICKUP_EFFECT.heal ? (
        <>
          <span className="text-[#c8323c]" aria-hidden="true">
            ❤
          </span>
          <span aria-hidden="true">+{effect.amount}</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">🪙</span>
          <span aria-hidden="true">?</span>
        </>
      )}
    </Badge>
  );
}
