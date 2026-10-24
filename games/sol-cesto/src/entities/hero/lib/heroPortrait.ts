/**
 * The big hero figure in the right sidebar. The hero on the board first appears from it, so the
 * board needs to know where it is on the screen.
 */
let portrait: HTMLElement | null = null;

/** Ref callback for the figure the hero on the board appears from. */
export function heroPortraitRef(element: HTMLElement | null) {
  portrait = element;
  return () => {
    if (portrait === element) portrait = null;
  };
}

/** Where the hero portrait is on the screen, or null while it isn't shown. */
export function getHeroPortraitRect(): DOMRect | null {
  return portrait?.getBoundingClientRect() ?? null;
}
