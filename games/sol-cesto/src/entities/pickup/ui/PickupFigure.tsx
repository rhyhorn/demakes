import { PICKUP_TYPES } from '../config';
import { PICKUP_TYPE, type PickupType } from '../model/types';

/** Placeholder art until the game gets pickup sprites. */
const PICKUP_SPRITES: Record<PickupType, string> = {
  [PICKUP_TYPE.strawberry]: '🍓',
  [PICKUP_TYPE.chest]: '🪎',
};

export function PickupFigure({ type }: { type: PickupType }) {
  return (
    <span
      className="text-[length:calc(120*var(--px))] leading-none"
      role="img"
      aria-label={PICKUP_TYPES[type].name}
    >
      {PICKUP_SPRITES[type]}
    </span>
  );
}
