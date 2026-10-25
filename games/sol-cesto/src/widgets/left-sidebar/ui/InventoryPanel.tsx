import { type MouseEvent, useState } from 'react';

import { useEnemyStore } from '@/entities/enemy';
import { GAME_SCREEN, useGameStore } from '@/entities/game';
import {
  getInventorySlots,
  INVENTORY_ITEMS,
  INVENTORY_SLOT,
  type InventoryItem,
  type InventorySlot,
  registerInventoryIcon,
  useHeroStore,
} from '@/entities/hero';
import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import {
  applyItem,
  cancelItemAim,
  canUseItem,
  finishShot,
  getItemAim,
  hasItemAimTargets,
  pickItemTarget,
  toggleItemAim,
  useItemAimStore,
} from '@/features/inventory';

import { ItemProjectile } from './ItemProjectile';

const handIcon = (
  <span className="text-[length:calc(48*var(--px))]" aria-hidden="true">
    🫴
  </span>
);

/** An item flying from its slot to the board cell it hits. */
interface Throw {
  slot: number;
  target: number;
  icon: string;
  /** Where the item's icon was in the slot on the screen. */
  from: DOMRect;
}

interface InventorySlotViewProps {
  /** Position of the slot in the inventory. */
  index: number;
  slot: InventorySlot;
  /** Whether items can be used now: not while one is flying. */
  enabled: boolean;
  /** Whether this slot's item is the one flying: the slot looks empty meanwhile. */
  flying: boolean;
  /** Whether the player is picking a target on the board for this slot's item. */
  aiming: boolean;
  onUse: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * One slot: available ones rest on a hand, locked ones are dark.
 * Clicking an item uses it; an item that would do nothing now is dimmed and cannot be clicked.
 * An aimed item (a whirlwind, an arrow) is used only in the dungeon while it has something to hit:
 * clicking it starts aiming (the slot glows), and clicking it again stops.
 */
function InventorySlotView({
  index,
  slot,
  enabled,
  flying,
  aiming,
  onUse,
}: InventorySlotViewProps) {
  const health = useHeroStore((state) => state.health);
  const maxHealth = useHeroStore((state) => state.maxHealth);
  const inDungeon = useGameStore((state) => state.screen === GAME_SCREEN.dungeon);
  const enemies = useEnemyStore((state) => state.enemies);
  const base =
    'flex h-full w-full flex-col items-center justify-end rounded-[calc(12*var(--px))] pb-[calc(4*var(--px))] leading-none';

  switch (slot.state) {
    case INVENTORY_SLOT.filled: {
      const aim = getItemAim(slot.item);
      const usable =
        canUseItem(slot.item, { health, maxHealth }) &&
        (aim === null || (inDungeon && hasItemAimTargets(aim, enemies)));
      return (
        <button
          type="button"
          className={`${base} enabled:cursor-pointer ${
            aiming
              ? 'bg-[#5a2a24] shadow-[0_0_calc(16*var(--px))_#e0533d]'
              : 'bg-[#2b3036] enabled:hover:bg-[#3a4048]'
          }`}
          aria-label={`Використати: ${INVENTORY_ITEMS[slot.item].name}`}
          aria-pressed={aim === null ? undefined : aiming}
          disabled={!usable || !enabled}
          onClick={onUse}
        >
          <span
            ref={(element) => registerInventoryIcon(index, element)}
            className={`text-[length:calc(56*var(--px))] ${usable ? '' : 'opacity-50'} ${
              flying ? 'invisible' : ''
            }`}
            aria-hidden="true"
          >
            {INVENTORY_ITEMS[slot.item].icon}
          </span>
          {handIcon}
        </button>
      );
    }
    case INVENTORY_SLOT.empty:
      return (
        <div className={`${base} bg-[#2b3036]`} aria-label="Вільна комірка">
          {handIcon}
        </div>
      );
    case INVENTORY_SLOT.locked:
      return (
        <div
          className={`${base} justify-center bg-[#111316] text-[#3a4048]`}
          aria-label="Недоступна комірка"
        >
          <span className="text-[length:calc(40*var(--px))]" aria-hidden="true">
            👁
          </span>
        </div>
      );
    default: {
      const unknown: never = slot;
      return unknown;
    }
  }
}

export function InventoryPanel() {
  const inventory = useHeroStore((state) => state.inventory);
  const inventorySize = useHeroStore((state) => state.inventorySize);
  const slots = getInventorySlots(inventory, inventorySize);
  // Item on its way to the enemy it hits. It is used once it gets there.
  const [thrown, setThrown] = useState<Throw | null>(null);
  const aimingSlot = useItemAimStore((state) => state.aiming?.slot ?? null);
  // An aimed item fired at an enemy: it flies there from its slot.
  const shot = useItemAimStore((state) => state.shot);
  const flight = thrown ?? shot;
  const shotItem = shot === null ? undefined : inventory[shot.slot];

  const throwItem = (slot: number, icon: string, event: MouseEvent<HTMLButtonElement>) => {
    const target = pickItemTarget(slot);
    const iconElement = event.currentTarget.firstElementChild;
    if (target === undefined || !iconElement) {
      applyItem(slot);
      return;
    }
    setThrown({ slot, target, icon, from: iconElement.getBoundingClientRect() });
  };

  const clickItem = (slot: number, item: InventoryItem, event: MouseEvent<HTMLButtonElement>) => {
    if (getItemAim(item) !== null) {
      toggleItemAim(slot);
      return;
    }
    // Using another item shifts the slots after it, so the aimed one would be lost.
    cancelItemAim();
    throwItem(slot, INVENTORY_ITEMS[item].icon, event);
  };

  return (
    <ul
      className="grid h-full w-full grid-cols-2 grid-rows-3 gap-[calc(10*var(--px))] p-[calc(14*var(--px))]"
      aria-label={`Інвентар: зайнято ${inventory.length} з ${inventorySize}`}
    >
      {slots.map((slot, index) => (
        // Slots never move, so their position is a stable key.
        // The hint handlers are on the slot, not the button: React gives no mouse events to a
        // disabled button, and an item that cannot be used now should still describe itself.
        <li
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="min-h-0"
          {...getHintHandlers({ kind: HINT_TARGET.item, slot: index })}
        >
          <InventorySlotView
            index={index}
            slot={slot}
            enabled={flight === null}
            flying={flight?.slot === index}
            aiming={aimingSlot === index}
            onUse={(event) =>
              slot.state === INVENTORY_SLOT.filled && clickItem(index, slot.item, event)
            }
          />
        </li>
      ))}
      {thrown && (
        <ItemProjectile
          icon={thrown.icon}
          from={thrown.from}
          target={thrown.target}
          onHit={() => {
            applyItem(thrown.slot, thrown.target);
            setThrown(null);
          }}
        />
      )}
      {shot && shotItem !== undefined && (
        <ItemProjectile
          icon={INVENTORY_ITEMS[shotItem].icon}
          from={shot.from}
          target={shot.target}
          onHit={finishShot}
        />
      )}
    </ul>
  );
}
