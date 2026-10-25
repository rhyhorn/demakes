import { TRAP_TYPES } from '../config';
import type { TrapType } from '../model/types';
import { SpikesIcon } from './SpikesIcon';

export function TrapFigure({ type }: { type: TrapType }) {
  return (
    <span role="img" aria-label={TRAP_TYPES[type].name}>
      <SpikesIcon size={150} />
    </span>
  );
}
