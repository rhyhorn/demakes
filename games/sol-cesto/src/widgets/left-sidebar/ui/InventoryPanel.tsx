import {
  getInventorySlots,
  INVENTORY_ITEMS,
  INVENTORY_SLOT,
  type InventorySlot,
  useHeroStore,
} from '@/entities/hero';
import { discardItem } from '@/features/inventory';

const handIcon = (
  <span className="text-[length:calc(48*var(--px))]" aria-hidden="true">
    🫴
  </span>
);

/**
 * One slot: available ones rest on a hand, locked ones are dark.
 * Clicking an item throws it away for now.
 */
function InventorySlotView({ slot, index }: { slot: InventorySlot; index: number }) {
  const base =
    'flex h-full w-full flex-col items-center justify-end rounded-[calc(12*var(--px))] pb-[calc(4*var(--px))] leading-none';

  switch (slot.state) {
    case INVENTORY_SLOT.filled:
      return (
        <button
          type="button"
          className={`${base} cursor-pointer bg-[#2b3036] hover:bg-[#3a4048]`}
          aria-label={`Викинути: ${INVENTORY_ITEMS[slot.item].name}`}
          onClick={() => discardItem(index)}
        >
          <span className="text-[length:calc(56*var(--px))]" aria-hidden="true">
            {INVENTORY_ITEMS[slot.item].icon}
          </span>
          {handIcon}
        </button>
      );
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

  return (
    <ul
      className="grid h-full w-full grid-cols-2 grid-rows-3 gap-[calc(10*var(--px))] p-[calc(14*var(--px))]"
      aria-label={`Інвентар: зайнято ${inventory.length} з ${inventorySize}`}
    >
      {slots.map((slot, index) => (
        // Slots never move, so their position is a stable key.
        // eslint-disable-next-line react/no-array-index-key
        <li key={index} className="min-h-0">
          <InventorySlotView slot={slot} index={index} />
        </li>
      ))}
    </ul>
  );
}
