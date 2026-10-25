import { type CSSProperties, useEffect, useState } from 'react';

import { useEnemyStore } from '@/entities/enemy';
import { useHeroStore } from '@/entities/hero';
import { usePickupStore } from '@/entities/pickup';
import { clearRoom, isRoomCleared, leaveClearedRoom, useRoomClearStore } from '@/features/level';

import styles from './RoomClearedOverlay.module.css';

/** Pause after the last enemy or pickup goes, so its vanishing plays out before the overlay. */
const SETTLE_DELAY = 700;
/** How long the overlay stays before the hero moves on to the next room. */
const SHOW_DURATION = 2800;

const overlayStyle = { '--show-duration': `${SHOW_DURATION}ms` } as CSSProperties;

/**
 * The overlay of a cleared room with its `reward`. Once it has faded out it is taken off the page,
 * and only then the hero moves on: the screen change keeps a frozen copy of the old screen for its
 * slide, and the overlay must not be in it (a copy would replay its animation).
 */
function ClearedRoom({ reward }: { reward: number }) {
  const [isOver, setOver] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOver(true), SHOW_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOver) leaveClearedRoom();
  }, [isOver]);

  if (isOver) return null;

  return (
    <div className={styles.overlay} style={overlayStyle} role="status">
      <div className={styles.glow} aria-hidden="true" />
      <h2 className={styles.title}>Кімнату зачищено</h2>
      <p className={styles.reward} aria-label={`Нагорода: ${reward} золота`}>
        +{reward} <span className={styles.coin}>🪙</span>
      </p>
    </div>
  );
}

/**
 * Once the hero has killed every enemy and taken every pickup (spikes don't count), she gets the
 * room's gold, the whole scene says the room is cleared, and a few seconds later she is in the next
 * room. The overlay covers the scene, so nothing else can be clicked meanwhile.
 */
export function RoomClearedOverlay() {
  const enemies = useEnemyStore((state) => state.enemies);
  const pickups = usePickupStore((state) => state.pickups);
  const isAlive = useHeroStore((state) => state.health > 0);
  const reward = useRoomClearStore((state) => state.reward);
  const isCleared = isAlive && isRoomCleared({ enemies, pickups });

  useEffect(() => {
    if (!isCleared) return undefined;
    const timer = setTimeout(clearRoom, SETTLE_DELAY);
    return () => clearTimeout(timer);
  }, [isCleared]);

  return reward === null ? null : <ClearedRoom reward={reward} />;
}
