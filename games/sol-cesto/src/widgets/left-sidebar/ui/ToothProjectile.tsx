import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FLIGHT: KeyframeAnimationOptions = { duration: 700, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' };

const center = (rect: DOMRect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

interface ToothProjectileProps {
  /** Where the taken offer is on the screen: the tooth flies out from there. */
  from: DOMRect;
  /** The slot of the mouth it lands in; read once the flight starts. */
  getTarget: () => HTMLElement | null;
  /** Called once it gets there, or at once when there is nothing to animate. */
  onLand: () => void;
}

/**
 * The taken tooth flying from the tooth room into its slot of the mouth, shrinking to the slot's
 * size on the way. Drawn over the whole page, since it crosses from the room into the sidebar.
 */
export function ToothProjectile({ from, getTarget, onLand }: ToothProjectileProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const onLandRef = useRef(onLand);
  const getTargetRef = useRef(getTarget);
  useLayoutEffect(() => {
    onLandRef.current = onLand;
    getTargetRef.current = getTarget;
  });

  useLayoutEffect(() => {
    const element = ref.current;
    const target = getTargetRef.current();
    if (!element || !target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onLandRef.current();
      return undefined;
    }

    const to = target.getBoundingClientRect();
    const start = center(from);
    const end = center(to);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const scale = `scale(${to.width / from.width}, ${to.height / from.height})`;
    // It first jumps up out of the row, as if plucked, and then dives into the mouth.
    const lift = from.height * 0.4;
    const animation = element.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
        { transform: `translate(0, ${-lift}px) rotate(-12deg) scale(1.1)`, offset: 0.25 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) ${scale}` },
      ],
      FLIGHT,
    );
    animation.onfinish = () => onLandRef.current();
    return () => animation.cancel();
  }, [from]);

  // Shaped like the offered tooth in the room, in proportion to its width.
  const { width } = from;
  return createPortal(
    <span
      ref={ref}
      className="pointer-events-none fixed z-50 border-solid border-[#c9bb98] bg-[#f4ecd6] shadow-[0_0_24px_#e8c46a]"
      style={{
        left: from.left,
        top: from.top,
        width,
        height: from.height,
        borderWidth: width * 0.027,
        borderRadius: `${width * 0.12}px ${width * 0.12}px ${width * 0.4}px ${width * 0.4}px`,
      }}
      aria-hidden="true"
    />,
    document.body,
  );
}
