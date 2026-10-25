import { type MouseEvent, useState } from 'react';

import {
  getInventorySlots,
  INVENTORY_ITEMS,
  INVENTORY_SLOT,
  type InventorySlot,
  useHeroStore,
} from '@/entities/hero';
import { getHintHandlers, HINT_TARGET } from '@/entities/hint';
import { applyItem, canUseItem, pickItemTarget } from '@/features/inventory';

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
  slot: InventorySlot;
  /** Whether items can be used now: not while one is flying. */
  enabled: boolean;
  /** Whether this slot's item is the one flying: the slot looks empty meanwhile. */
  flying: boolean;
  onUse: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * One slot: available ones rest on a hand, locked ones are dark.
 * Clicking an item uses it; an item that would do nothing now is dimmed and cannot be clicked.
 */
function InventorySlotView({ slot, enabled, flying, onUse }: InventorySlotViewProps) {
  const health = useHeroStore((state) => state.health);
  const maxHealth = useHeroStore((state) => state.maxHealth);
  const base =
    'flex h-full w-full flex-col items-center justify-end rounded-[calc(12*var(--px))] pb-[calc(4*var(--px))] leading-none';

  switch (slot.state) {
    case INVENTORY_SLOT.filled: {
      const usable = canUseItem(slot.item, { health, maxHealth });
      return (
        <button
          type="button"
          className={`${base} bg-[#2b3036] enabled:cursor-pointer enabled:hover:bg-[#3a4048]`}
          aria-label={`Використати: ${INVENTORY_ITEMS[slot.item].name}`}
          disabled={!usable || !enabled}
          onClick={onUse}
        >
          <span
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

  const throwItem = (slot: number, icon: string, event: MouseEvent<HTMLButtonElement>) => {
    const target = pickItemTarget(slot);
    const iconElement = event.currentTarget.firstElementChild;
    if (target === undefined || !iconElement) {
      applyItem(slot);
      return;
    }
    setThrown({ slot, target, icon, from: iconElement.getBoundingClientRect() });
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
            slot={slot}
            enabled={thrown === null}
            flying={thrown?.slot === index}
            onUse={(event) =>
              slot.state === INVENTORY_SLOT.filled &&
              throwItem(index, INVENTORY_ITEMS[slot.item].icon, event)
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
    </ul>
  );
}
