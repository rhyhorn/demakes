import type { ReactNode } from 'react';

const CORNER_CLASS = {
  left: 'left-[calc(16*var(--px))]',
  right: 'right-[calc(16*var(--px))]',
} as const;

/**
 * A pill in the top corner of a board cell. Every badge on a cell has the same size, so they all
 * fit on it side by side.
 */
export function Badge({
  corner,
  label,
  className,
  children,
}: {
  corner: keyof typeof CORNER_CLASS;
  /** Read by screen readers instead of the badge content. */
  label: string;
  /** Background and text colors. */
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`absolute top-[calc(16*var(--px))] ${CORNER_CLASS[corner]} flex h-[calc(44*var(--px))] items-center gap-[calc(6*var(--px))] rounded-full px-[calc(12*var(--px))] text-[length:calc(28*var(--px))] leading-none font-bold ${className}`}
      aria-label={label}
    >
      {children}
    </span>
  );
}
