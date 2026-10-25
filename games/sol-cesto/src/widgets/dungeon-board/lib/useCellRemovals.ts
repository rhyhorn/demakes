import { useState } from 'react';

export interface CellRemoval<T> {
  cell: number;
  /** The thing as it was right before it went away, so its animation shows the same sprite. */
  item: T;
  /** Tells apart removals from the same cell, so each one plays its own animation. */
  id: number;
}

/**
 * Things (enemies, pickups) the hero has done away with and whose animation hasn't played out yet.
 * A thing counts when it leaves a cell that is now visited: the hero walked into it or killed it
 * with an item. Things replaced by a new level's spawn leave unvisited cells, so they don't count.
 */
export function useCellRemovals<T>(items: Partial<Record<number, T>>, visited: readonly number[]) {
  const [previous, setPrevious] = useState(items);
  const [removals, setRemovals] = useState<CellRemoval<T>[]>([]);
  const [lastId, setLastId] = useState(0);

  // Adjusting state during render (not in an effect) avoids one frame with an empty cell.
  if (items !== previous) {
    setPrevious(items);
    const removed = Object.entries(previous).flatMap(([key, item]) => {
      const cell = Number(key);
      return item !== undefined && items[cell] === undefined && visited.includes(cell)
        ? [{ cell, item }]
        : [];
    });
    if (removed.length > 0) {
      setLastId(lastId + removed.length);
      setRemovals([
        ...removals,
        ...removed.map((removal, offset) => ({ ...removal, id: lastId + offset + 1 })),
      ]);
    }
  }

  const finishRemoval = (id: number) =>
    setRemovals((current) => current.filter((removal) => removal.id !== id));

  return { removals, finishRemoval };
}
