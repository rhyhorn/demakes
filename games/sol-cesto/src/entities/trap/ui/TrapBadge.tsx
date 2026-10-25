import { Badge } from '@/shared/ui';

import { TRAP_TYPES } from '../config';
import type { TrapType } from '../model/types';
import { SpikesIcon } from './SpikesIcon';

/** The damage of the trap, shown in the top left corner of its cell where an enemy shows its attack. */
export function TrapBadge({ type }: { type: TrapType }) {
  const { name, damage } = TRAP_TYPES[type];

  return (
    <Badge corner="left" label={`${name}: ${damage}`} className="bg-[#5c5f63] text-[#e8e2d4]">
      <SpikesIcon size={36} />
      <span aria-hidden="true">{damage}</span>
    </Badge>
  );
}
