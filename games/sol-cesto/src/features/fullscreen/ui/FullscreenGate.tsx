import type { ReactNode } from 'react';

import { enterFullscreen, useNeedsFullscreen } from '../model/fullscreen';

/**
 * On a phone outside fullscreen covers the whole game with one button that switches to fullscreen;
 * until then the game underneath cannot be touched.
 */
export function FullscreenGate({ children }: { children: ReactNode }) {
  const blocked = useNeedsFullscreen();

  return (
    <>
      <div className="h-full" inert={blocked}>
        {children}
      </div>
      {blocked && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-[4vmin] border-0 bg-[#050505] p-[6vmin] text-[#f4e3c1]"
          onClick={() => {
            enterFullscreen().catch(() => {
              // The browser refused; the button stays for another try.
            });
          }}
        >
          <span aria-hidden className="text-[18vmin] leading-none">
            ⛶
          </span>
          <span className="text-[7vmin] font-bold">Грати на весь екран</span>
          <span className="text-[4vmin] text-[#9d9a8c]">Телефон повернеться горизонтально</span>
        </button>
      )}
    </>
  );
}
