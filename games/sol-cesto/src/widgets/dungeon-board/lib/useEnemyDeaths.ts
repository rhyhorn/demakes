import { useState } from 'react';

import type { Enemy, EnemyMap } from '@/entities/enemy';

export interface EnemyDeath {
  cell: number;
  /** The enemy as it was right before it died, so its death shows the same sprite. */
  enemy: Enemy;
  /** Tells apart deaths on the same cell, so each one plays its own animation. */
  id: number;
}

/**
 * Enemies that died on the board and whose death animation hasn't played out yet. An enemy dies
 * when it leaves a cell that is now visited: the hero walked into it or killed it with an item.
 * Enemies replaced by a new level's spawn leave unvisited cells, so they don't die.
 */
export function useEnemyDeaths(enemies: EnemyMap, visited: readonly number[]) {
  const [previous, setPrevious] = useState(enemies);
  const [deaths, setDeaths] = useState<EnemyDeath[]>([]);
  const [lastId, setLastId] = useState(0);

  // Adjusting state during render (not in an effect) avoids one frame with an empty cell.
  if (enemies !== previous) {
    setPrevious(enemies);
    const died = Object.entries(previous).flatMap(([key, enemy]) => {
      const cell = Number(key);
      return enemy && enemies[cell] === undefined && visited.includes(cell)
        ? [{ cell, enemy }]
        : [];
    });
    if (died.length > 0) {
      setLastId(lastId + died.length);
      setDeaths([
        ...deaths,
        ...died.map((death, offset) => ({ ...death, id: lastId + offset + 1 })),
      ]);
    }
  }

  const finishDeath = (id: number) => setDeaths((current) => current.filter((d) => d.id !== id));

  return { deaths, finishDeath };
}
