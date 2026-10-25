import { describe, expect, it } from 'vitest';

import { type FullscreenEnvironment, needsFullscreen, PHONE_MAX_SHORT_SIDE } from './fullscreen';

const PHONE_OUTSIDE_FULLSCREEN: FullscreenEnvironment = {
  isTouchOnly: true,
  shortSide: 390,
  isSupported: true,
  isFullscreen: false,
};

describe('needsFullscreen', () => {
  it('asks a phone outside fullscreen to switch to it', () => {
    expect(needsFullscreen(PHONE_OUTSIDE_FULLSCREEN)).toBe(true);
  });

  it('lets a phone in fullscreen play', () => {
    expect(needsFullscreen({ ...PHONE_OUTSIDE_FULLSCREEN, isFullscreen: true })).toBe(false);
  });

  it('does not block a phone whose browser has no fullscreen', () => {
    expect(needsFullscreen({ ...PHONE_OUTSIDE_FULLSCREEN, isSupported: false })).toBe(false);
  });

  it('counts a touch screen up to the phone size as a phone', () => {
    expect(needsFullscreen({ ...PHONE_OUTSIDE_FULLSCREEN, shortSide: PHONE_MAX_SHORT_SIDE })).toBe(
      true,
    );
  });

  it('lets a tablet play outside fullscreen', () => {
    expect(
      needsFullscreen({ ...PHONE_OUTSIDE_FULLSCREEN, shortSide: PHONE_MAX_SHORT_SIDE + 1 }),
    ).toBe(false);
  });

  it('lets a device with a mouse play outside fullscreen', () => {
    expect(needsFullscreen({ ...PHONE_OUTSIDE_FULLSCREEN, isTouchOnly: false })).toBe(false);
  });
});
