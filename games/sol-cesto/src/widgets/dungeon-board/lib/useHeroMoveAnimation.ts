import { type RefObject, useLayoutEffect, useRef } from 'react';

import { getHeroPortraitRect } from '@/entities/hero';

/** The hero's first move on a level: she flies from the portrait in the right sidebar. */
const APPEAR: KeyframeAnimationOptions = { duration: 700, easing: 'ease-in-out' };
/** Every next move: she walks from the cell she stood on. */
const MOVE: KeyframeAnimationOptions = { duration: 450, easing: 'ease-in-out' };

const center = (rect: DOMRect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

/**
 * Animates the hero on the board into the cell she is shown in: from the portrait when she appears
 * on the level, otherwise from the previous cell (she stands in the middle of it). `onArrive` is
 * called once she is there, or at once when there is nothing to animate.
 */
export function useHeroMoveAnimation(
  heroIndex: number | null,
  heroRef: RefObject<HTMLElement | null>,
  cellRefs: RefObject<(HTMLElement | null)[]>,
  onArrive: () => void,
) {
  const previousIndex = useRef<number | null>(null);
  const onArriveRef = useRef(onArrive);
  useLayoutEffect(() => {
    onArriveRef.current = onArrive;
  });

  useLayoutEffect(() => {
    const from = previousIndex.current;
    previousIndex.current = heroIndex;
    const hero = heroRef.current;
    if (heroIndex === null || from === heroIndex) return undefined;

    const origin =
      from === null ? getHeroPortraitRect() : cellRefs.current[from]?.getBoundingClientRect();
    if (!hero || !origin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onArriveRef.current();
      return undefined;
    }

    const target = hero.getBoundingClientRect();
    const start = center(origin);
    const end = center(target);
    const offset = `translate(${start.x - end.x}px, ${start.y - end.y}px)`;

    let animation: Animation;
    if (from === null) {
      // The portrait figure is bigger than the one on the board.
      const figure = hero.firstElementChild ?? hero;
      const scale = origin.height / figure.getBoundingClientRect().height;
      animation = hero.animate(
        [
          { transform: `${offset} scale(${scale})`, opacity: 0 },
          { transform: `${offset} scale(${scale})`, opacity: 1, offset: 0.15 },
          { transform: 'none', opacity: 1 },
        ],
        APPEAR,
      );
    } else {
      animation = hero.animate([{ transform: offset }, { transform: 'none' }], MOVE);
    }
    animation.onfinish = () => onArriveRef.current();
    return () => animation.cancel();
  }, [heroIndex, heroRef, cellRefs]);
}
