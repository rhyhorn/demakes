/** `random` returns a number in [0, 1), like Math.random. */
export function pickWeighted<T extends { weight: number }>(
  entries: readonly T[],
  random: () => number,
): T | undefined {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = random() * total;
  return (
    entries.find((entry) => {
      roll -= entry.weight;
      return roll < 0;
    }) ?? entries.at(-1)
  );
}

/** Picks `count` different cells in random order. */
export function pickCells(cells: readonly number[], count: number, random: () => number): number[] {
  const pool = [...cells];
  return Array.from(
    { length: Math.min(count, pool.length) },
    () => pool.splice(Math.floor(random() * pool.length), 1)[0],
  );
}

/** A whole number from `min` to `max`, inclusive. */
export function pickCount({ min, max }: { min: number; max: number }, random: () => number) {
  return min + Math.floor(random() * (max - min + 1));
}
