import { useBoardStore } from '@/entities/board';
import { useEnemyStore } from '@/entities/enemy';

/**
 * Moves the player into the row. If the move happened, an enemy on the player's new cell
 * disappears and the rest of the enemies take their turn.
 */
export function enterRow(row: number, random?: () => number) {
  const { visited } = useBoardStore.getState();
  useBoardStore.getState().enterRow(row, random);
  const { visited: visitedNow, playerIndex } = useBoardStore.getState();
  if (visitedNow === visited || playerIndex === null) return;

  const { removeEnemy, advanceTurn } = useEnemyStore.getState();
  removeEnemy(playerIndex);
  advanceTurn();
}
