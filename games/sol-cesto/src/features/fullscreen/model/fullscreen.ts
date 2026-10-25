import { useSyncExternalStore } from 'react';

/** A phone is a touch screen whose short side is at most this many CSS pixels (tablets are wider). */
export const PHONE_MAX_SHORT_SIDE = 600;

/** A screen used only by touch: no mouse to hover with. */
const TOUCH_ONLY_QUERY = '(hover: none) and (pointer: coarse)';

/** What decides whether the game may be played right now. */
export interface FullscreenEnvironment {
  /** The device has only a touch screen. */
  isTouchOnly: boolean;
  /** The short side of the device screen in CSS pixels. */
  shortSide: number;
  /** The browser can put the page in fullscreen (iPhone Safari cannot). */
  isSupported: boolean;
  isFullscreen: boolean;
}

export function isPhone({
  isTouchOnly,
  shortSide,
}: Pick<FullscreenEnvironment, 'isTouchOnly' | 'shortSide'>): boolean {
  return isTouchOnly && shortSide <= PHONE_MAX_SHORT_SIDE;
}

/**
 * A phone plays only in fullscreen, where the game can lock the landscape orientation.
 * Where fullscreen is unsupported, asking for it would block the game for good, so it is not asked.
 */
export function needsFullscreen(environment: FullscreenEnvironment): boolean {
  return isPhone(environment) && environment.isSupported && !environment.isFullscreen;
}

function readFullscreenEnvironment(): FullscreenEnvironment {
  return {
    isTouchOnly: window.matchMedia(TOUCH_ONLY_QUERY).matches,
    shortSide: Math.min(window.screen.width, window.screen.height),
    isSupported: document.fullscreenEnabled,
    isFullscreen:
      document.fullscreenElement !== null ||
      window.matchMedia('(display-mode: fullscreen)').matches,
  };
}

function subscribe(onChange: () => void): () => void {
  document.addEventListener('fullscreenchange', onChange);
  // Rotating or attaching a mouse changes the screen, not the fullscreen state.
  window.addEventListener('resize', onChange);
  return () => {
    document.removeEventListener('fullscreenchange', onChange);
    window.removeEventListener('resize', onChange);
  };
}

/** Whether the game has to wait until the player switches to fullscreen; follows the browser. */
export function useNeedsFullscreen(): boolean {
  return useSyncExternalStore(subscribe, () => needsFullscreen(readFullscreenEnvironment()));
}

/**
 * Switches the page to fullscreen and turns it landscape. Call it from a tap: browsers allow
 * fullscreen only in response to the user.
 */
export async function enterFullscreen(): Promise<void> {
  await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
  try {
    await window.screen.orientation.lock('landscape');
  } catch {
    // Some browsers cannot lock the orientation; the game still runs in fullscreen.
  }
}
