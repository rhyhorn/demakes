import { ENEMY_TYPES, getEnemyTraits, useEnemyStore } from '@/entities/enemy';
import { HERO_INFO } from '@/entities/hero';
import { PICKUP_TYPES, usePickupStore } from '@/entities/pickup';
import { HINT_TARGET, HintCard, type HintTarget, useHintStore } from '@/entities/hint';

function HeroHint() {
  return <HintCard title={HERO_INFO.name} details={[HERO_INFO.description]} />;
}

/**
 * A board cell describes what is in it: an enemy or a pickup. The hero's cell stays silent: she
 * lands under the cursor after every move, and her hint would pop up all the time.
 */
function CellHint({ index }: { index: number }) {
  const enemy = useEnemyStore((state) => state.enemies[index]);
  const pickup = usePickupStore((state) => state.pickups[index]);

  if (pickup) {
    const { name, description } = PICKUP_TYPES[pickup];
    return <HintCard title={name} details={[description]} />;
  }
  if (!enemy) return null;
  return <HintCard title={ENEMY_TYPES[enemy.type].name} details={getEnemyTraits(enemy.type)} />;
}

/** One view per kind of target. The `never` check makes TypeScript demand a view for a new kind. */
function HintView({ target }: { target: HintTarget }) {
  switch (target.kind) {
    case HINT_TARGET.cell:
      return <CellHint index={target.index} />;
    case HINT_TARGET.hero:
      return <HeroHint />;
    default: {
      const unknownTarget: never = target;
      return unknownTarget;
    }
  }
}

/** Describes the element under the cursor. Renders nothing when there is nothing to tell. */
export function HintContent() {
  const target = useHintStore((state) => state.target);

  return target && <HintView target={target} />;
}
