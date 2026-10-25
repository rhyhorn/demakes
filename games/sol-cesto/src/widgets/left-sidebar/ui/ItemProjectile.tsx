import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { getBoardCellRect } from '@/entities/board';

const FLIGHT: KeyframeAnimationOptions = { duration: 550, easing: 'ease-in' };

const center = (rect: DOMRect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

interface ItemProjectileProps {
  icon: string;
  /** Where the item's icon is in the inventory on the screen: it flies out from there. */
  from: DOMRect;
  /** Board cell it flies into. */
  target: number;
  /** Called once it gets there, or at once when there is nothing to animate. */
  onHit: () => void;
}

/**
 * An item thrown from the inventory at a board cell, turned to point where it flies. Drawn over
 * the whole page, since it crosses from the sidebar into the board.
 */
export function ItemProjectile({ icon, from, target, onHit }: ItemProjectileProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const onHitRef = useRef(onHit);
  useLayoutEffect(() => {
    onHitRef.current = onHit;
  });

  useLayoutEffect(() => {
    const element = ref.current;
    const to = getBoardCellRect(target);
    if (!element || !to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onHitRef.current();
      return undefined;
    }

    const start = center(from);
    const end = center(to);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    // The icon points up, so turn it a quarter more than the flight direction.
    const turn = `rotate(${Math.atan2(dy, dx) + Math.PI / 2}rad)`;
    const animation = element.animate(
      [
        { transform: 'translate(0, 0) rotate(0rad) scale(1)' },
        { transform: `translate(0, 0) ${turn} scale(1.3)`, offset: 0.2 },
        { transform: `translate(${dx}px, ${dy}px) ${turn} scale(1.3)` },
      ],
      FLIGHT,
    );
    animation.onfinish = () => onHitRef.current();
    return () => animation.cancel();
  }, [from, target]);

  return createPortal(
    <span
      ref={ref}
      className="pointer-events-none fixed z-50 flex items-center justify-center leading-none"
      style={{
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        fontSize: from.height,
      }}
      aria-hidden="true"
    >
      {icon}
    </span>,
    document.body,
  );
}
