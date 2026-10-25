/** Cones of the spikes, left to right: x of the tip, height and half the width of the base. */
const CONES = [
  { x: 14, height: 22, halfWidth: 7 },
  { x: 30, height: 34, halfWidth: 9 },
  { x: 46, height: 26, halfWidth: 8 },
  { x: 60, height: 18, halfWidth: 6 },
] as const;

const BASE = 40;

/**
 * Grey spikes coming out of the floor, as on `design/reference5.png`. Placeholder art until the
 * game gets a sprite. `size` is the width in design pixels.
 */
export function SpikesIcon({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 72 44"
      style={{ width: `calc(${size} * var(--px))` }}
      aria-hidden="true"
      className="block h-auto"
    >
      {CONES.map(({ x, height, halfWidth }) => (
        <g key={x}>
          <polygon
            points={`${x},${BASE - height} ${x - halfWidth},${BASE} ${x + halfWidth},${BASE}`}
            fill="#c9c9c2"
            stroke="#1a1d21"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            points={`${x},${BASE - height} ${x},${BASE} ${x + halfWidth},${BASE}`}
            fill="#8b8b84"
          />
        </g>
      ))}
    </svg>
  );
}
