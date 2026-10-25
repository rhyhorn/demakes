/**
 * Item icons in the inventory slots on the screen. An item the player aims on the board flies out
 * of its slot once fired, so the board side needs to know where the slot is.
 */
const icons = new Map<number, HTMLElement>();

/** Remembers the icon of the item in the slot, or forgets it when `element` is null. */
export function registerInventoryIcon(slot: number, element: HTMLElement | null) {
  if (element) icons.set(slot, element);
  else icons.delete(slot);
}

/** Where the item icon in the slot is on the screen, or null while it isn't shown. */
export function getInventoryIconRect(slot: number): DOMRect | null {
  return icons.get(slot)?.getBoundingClientRect() ?? null;
}
