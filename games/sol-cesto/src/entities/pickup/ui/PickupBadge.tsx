import { Badge } from '@/shared/ui';

import { PICKUP_TYPES } from '../config';
import type { PickupType } from '../model/types';

/** What the pickup gives, shown in the top left corner of its cell where an enemy shows its attack. */
export function PickupBadge({ type }: { type: PickupType }) {
  const { heal } = PICKUP_TYPES[type];

  return (
    <Badge corner="left" label={`Лікування: +${heal}`} className="bg-[#e8e2d4] text-[#1a1d21]">
      <span className="text-[#c8323c]" aria-hidden="true">
        ❤
      </span>
      <span aria-hidden="true">+{heal}</span>
    </Badge>
  );
}
