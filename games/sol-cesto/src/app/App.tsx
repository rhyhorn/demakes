import { type ComponentType, useEffect, useLayoutEffect, useRef } from 'react';

import { GAME_SCREEN, type GameScreen, useGameStore } from '@/entities/game';
import { GameOverPage } from '@/pages/game-over';
import { HomePage } from '@/pages/home';
import { UpgradePage } from '@/pages/upgrade';
import { VictoryPage } from '@/pages/victory';

const SCREENS: Record<GameScreen, ComponentType> = {
  [GAME_SCREEN.dungeon]: HomePage,
  [GAME_SCREEN.gameOver]: GameOverPage,
  [GAME_SCREEN.upgrade]: UpgradePage,
  [GAME_SCREEN.victory]: VictoryPage,
};

/** Screen change: the old screen leaves to the left while the new one pushes it from the right. */
const SLIDE: KeyframeAnimationOptions = { duration: 500, easing: 'ease-in-out' };

export function App() {
  const screen = useGameStore((state) => state.screen);
  const Screen = SCREENS[screen];
  const currentRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef<HTMLDivElement>(null);

  // The old screen leaves as a frozen copy of its DOM: its live components would already show
  // the state of the next room (level, exit, board). The store notifies synchronously, before
  // React commits the action that changed the screen, so the DOM still shows the old screen.
  useEffect(
    () =>
      useGameStore.subscribe((state, prev) => {
        const { current } = currentRef;
        const leaving = leavingRef.current;
        if (state.screen === prev.screen || !current || !leaving) {
          return;
        }
        leaving.getAnimations().forEach((animation) => animation.cancel());
        leaving.replaceChildren(...Array.from(current.childNodes, (node) => node.cloneNode(true)));
      }),
    [],
  );

  useLayoutEffect(() => {
    const { current } = currentRef;
    const leaving = leavingRef.current;
    if (!current || !leaving?.hasChildNodes()) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      leaving.replaceChildren();
      return;
    }
    current.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], SLIDE);
    const animation = leaving.animate(
      [{ transform: 'none' }, { transform: 'translateX(-100%)' }],
      SLIDE,
    );
    animation.onfinish = () => leaving.replaceChildren();
  }, [screen]);

  return (
    <div className="relative h-full overflow-hidden">
      <div ref={currentRef} className="absolute inset-0">
        <Screen />
      </div>
      <div ref={leavingRef} className="absolute inset-0" inert />
    </div>
  );
}
