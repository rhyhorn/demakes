export const BOARD_SIZE = 4;

/** How the exit door is described to the player in the hint panel. */
export const DOOR_INFO = {
  name: 'Двері',
  open: 'Натисни, щоб перейти на наступний рівень.',
  /** The upgrade and tooth rooms open after the one choice. */
  choiceNeeded: 'Зроби вибір, щоб відчинити двері.',
} as const;
