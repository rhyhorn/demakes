import { useBoardStore } from '@/entities/board';
import { ENEMY_TYPES, getEnemyTraits, useEnemyStore } from '@/entities/enemy';
import { HERO_INFO, INVENTORY_ITEMS, useHeroStore } from '@/entities/hero';
import { PICKUP_TYPES, usePickupStore } from '@/entities/pickup';
import { HINT_TARGET, HintCard, type HintTarget, useHintStore } from '@/entities/hint';
import {
  describeToothProperty,
  formatModifier,
  getTeethModifiers,
  type Modifier,
  MODIFIERS,
  TOOTH_TYPES,
  useToothStore,
} from '@/entities/tooth';

function HeroHint() {
  return <HintCard title={HERO_INFO.name} details={[HERO_INFO.description]} />;
}

/** A board cell describes what is in it: the hero standing there, an enemy or a pickup. */
function CellHint({ index }: { index: number }) {
  const hasPlayer = useBoardStore((state) => state.playerIndex === index);
  const enemy = useEnemyStore((state) => state.enemies[index]);
  const pickup = usePickupStore((state) => state.pickups[index]);

  if (hasPlayer) return <HeroHint />;
  if (pickup) {
    const { name, description } = PICKUP_TYPES[pickup];
    return <HintCard title={name} details={[description]} />;
  }
  if (!enemy) return null;
  return <HintCard title={ENEMY_TYPES[enemy.type].name} details={getEnemyTraits(enemy.type)} />;
}

/** A tooth lists its properties: which modifiers it changes and by how much. */
function ToothHint({ slot }: { slot: number }) {
  const tooth = useToothStore((state) => state.slots[slot]);

  if (!tooth) return null;
  return (
    <HintCard
      title={TOOTH_TYPES[tooth.type].name}
      details={tooth.properties.map(describeToothProperty)}
    />
  );
}

/** An inventory item tells what it does, as in the shop. */
function ItemHint({ slot }: { slot: number }) {
  const item = useHeroStore((state) => state.inventory[slot]);

  if (item === undefined) return null;
  const { name, description } = INVENTORY_ITEMS[item];
  return <HintCard title={name} details={[description]} />;
}

const isModifier = (value: string): value is Modifier => value in MODIFIERS;

/**
 * A modifier of the book shows its icon and current value from the teeth, as in the book, and
 * tells what it changes.
 */
function ModifierHint({ modifier }: { modifier: string }) {
  const teeth = useToothStore((state) => state.slots);

  if (!isModifier(modifier)) return null;
  const { icon, description } = MODIFIERS[modifier];
  return (
    <HintCard
      title={`${icon} ${formatModifier(getTeethModifiers(teeth)[modifier])}`}
      details={[description]}
    />
  );
}

/** One view per kind of target. The `never` check makes TypeScript demand a view for a new kind. */
function HintView({ target }: { target: HintTarget }) {
  switch (target.kind) {
    case HINT_TARGET.cell:
      return <CellHint index={target.index} />;
    case HINT_TARGET.hero:
      return <HeroHint />;
    case HINT_TARGET.tooth:
      return <ToothHint slot={target.slot} />;
    case HINT_TARGET.item:
      return <ItemHint slot={target.slot} />;
    case HINT_TARGET.modifier:
      return <ModifierHint modifier={target.modifier} />;
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
