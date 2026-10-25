import { describeMovesLeft, DOOR_INFO, isExitOpen, useBoardStore } from '@/entities/board';
import { ENEMY_TYPES, getEnemyTraits, useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import { GOLD_INFO, HERO_INFO, INVENTORY_ITEMS, useHeroStore } from '@/entities/hero';
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
import { isToothRoomOpen, useToothChoiceStore } from '@/features/choose-tooth';
import { isUpgradeRoomOpen, useUpgradeStore } from '@/features/upgrade-attack';

function HeroHint() {
  return <HintCard title={HERO_INFO.name} details={[HERO_INFO.description]} />;
}

function GoldHint() {
  return <HintCard title={GOLD_INFO.name} details={[GOLD_INFO.description]} />;
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

/**
 * The door tells what it takes to open it, or that it leads on. Open as in `ExitPanel`: on a level
 * after the required moves, in the upgrade and tooth rooms after the choice, in the shop at once.
 */
function DoorHint() {
  const screen = useGameStore((state) => state.screen);
  const moves = useBoardStore((state) => state.moves);
  const requiredMoves = useBoardStore((state) => state.requiredMoves);
  const upgradeChosen = useUpgradeStore((state) => state.chosen);
  const toothChosen = useToothChoiceStore((state) => state.chosen);

  const getDetail = () => {
    if (screen === GAME_SCREEN.upgrade) {
      return isUpgradeRoomOpen({ chosen: upgradeChosen }) ? DOOR_INFO.open : DOOR_INFO.choiceNeeded;
    }
    if (screen === GAME_SCREEN.tooth) {
      return isToothRoomOpen({ chosen: toothChosen }) ? DOOR_INFO.open : DOOR_INFO.choiceNeeded;
    }
    if (screen === GAME_SCREEN.shop || isExitOpen({ moves, requiredMoves })) return DOOR_INFO.open;
    return describeMovesLeft(requiredMoves - moves);
  };

  return <HintCard title={DOOR_INFO.name} details={[getDetail()]} />;
}

/** One view per kind of target. The `never` check makes TypeScript demand a view for a new kind. */
function HintView({ target }: { target: HintTarget }) {
  switch (target.kind) {
    case HINT_TARGET.cell:
      return <CellHint index={target.index} />;
    case HINT_TARGET.hero:
      return <HeroHint />;
    case HINT_TARGET.door:
      return <DoorHint />;
    case HINT_TARGET.gold:
      return <GoldHint />;
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
