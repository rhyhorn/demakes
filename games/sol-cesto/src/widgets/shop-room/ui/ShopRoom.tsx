import { useState } from 'react';

import { INVENTORY_ITEMS, type InventoryItem, useHeroStore } from '@/entities/hero';
import {
  buyItem,
  getShopOfferStatus,
  SHOP_OFFER_STATUS,
  type ShopOfferStatus,
  useShopStore,
} from '@/features/shop';

/** Why an offer cannot be bought, shown under its price. */
const STATUS_NOTES: Record<ShopOfferStatus, string | null> = {
  [SHOP_OFFER_STATUS.available]: null,
  [SHOP_OFFER_STATUS.sold]: 'Продано',
  [SHOP_OFFER_STATUS.tooExpensive]: 'Бракує золота',
  [SHOP_OFFER_STATUS.noRoom]: 'Інвентар повний',
};

/** What the item does, in a gold frame like the buffs of the tooth room. */
function ItemPreview({ item }: { item: InventoryItem }) {
  const { name, description } = INVENTORY_ITEMS[item];
  return (
    <div className="flex w-[calc(600*var(--px))] flex-col gap-[calc(16*var(--px))] border-[length:calc(10*var(--px))] border-dotted border-[#e8c46a] bg-black px-[calc(24*var(--px))] py-[calc(28*var(--px))] text-center">
      <span className="text-[length:calc(36*var(--px))] leading-none font-bold text-[#e8c46a]">
        {name}
      </span>
      <span className="text-[length:calc(28*var(--px))] leading-snug text-[#f4ecd6]">
        {description}
      </span>
    </div>
  );
}

/**
 * The shop: a row of offered items with their prices. The item under the cursor shows what it
 * does below. A click buys the item for gold and puts it
 * into the inventory. The exit is open from the start, so the hero may leave without buying.
 */
export function ShopRoom() {
  const offers = useShopStore((state) => state.offers);
  const sold = useShopStore((state) => state.sold);
  const gold = useHeroStore((state) => state.gold);
  const inventory = useHeroStore((state) => state.inventory);
  const inventorySize = useHeroStore((state) => state.inventorySize);
  const [hovered, setHovered] = useState<number | null>(null);
  const previewed = offers[hovered ?? -1];

  return (
    <main className="flex h-full flex-col items-center justify-center gap-[calc(60*var(--px))] bg-[#0b0b0b]">
      <h1 className="m-0 text-[length:calc(56*var(--px))] leading-none font-bold text-[#e8e2d4]">
        Магазин
      </h1>
      <ul className="flex gap-[calc(32*var(--px))]">
        {offers.map((item, offer) => {
          const { name, icon, price } = INVENTORY_ITEMS[item];
          const status = getShopOfferStatus(
            offer,
            { offers, sold },
            { gold, inventory, inventorySize },
          );
          const isSold = status === SHOP_OFFER_STATUS.sold;
          const note = STATUS_NOTES[status];
          return (
            // Offers never move while the shop is shown, so their position is a stable key.
            // The mouse handlers are on the item, not the button: React gives no mouse events to a
            // disabled button, and an item the hero cannot buy should still describe itself.
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={offer}
              onMouseEnter={() => setHovered(offer)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                type="button"
                className={`flex h-[calc(360*var(--px))] w-[calc(190*var(--px))] cursor-pointer flex-col items-center justify-center gap-[calc(20*var(--px))] rounded-[calc(18*var(--px))] border-[length:calc(4*var(--px))] border-[#5c5440] bg-[#1c1a14] transition-[transform,border-color,box-shadow,opacity] focus-visible:outline-none enabled:hover:-translate-y-[calc(12*var(--px))] enabled:hover:border-[#e8c46a] enabled:hover:shadow-[0_0_calc(48*var(--px))_#e8c46a] enabled:focus-visible:-translate-y-[calc(12*var(--px))] enabled:focus-visible:border-[#e8c46a] disabled:cursor-default ${
                  isSold ? 'opacity-20' : ''
                } ${note !== null && !isSold ? 'opacity-50' : ''}`}
                disabled={status !== SHOP_OFFER_STATUS.available}
                aria-label={`${name}, ціна ${price}${note === null ? '' : `: ${note}`}`}
                onClick={() => buyItem(offer)}
                onFocus={() => setHovered(offer)}
                onBlur={() => setHovered(null)}
              >
                <span className="text-[length:calc(110*var(--px))] leading-none" aria-hidden="true">
                  {icon}
                </span>
                <span
                  className="text-[length:calc(30*var(--px))] leading-none text-[#c9c3b4]"
                  aria-hidden="true"
                >
                  {name}
                </span>
                <span
                  className="text-[length:calc(40*var(--px))] leading-none font-bold text-[#e8c46a]"
                  aria-hidden="true"
                >
                  🪙 {price}
                </span>
                <span
                  className="h-[calc(22*var(--px))] text-[length:calc(22*var(--px))] leading-none text-[#e05a5a]"
                  aria-hidden="true"
                >
                  {note}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex h-[calc(260*var(--px))] items-start">
        {previewed && <ItemPreview item={previewed} />}
      </div>
    </main>
  );
}
