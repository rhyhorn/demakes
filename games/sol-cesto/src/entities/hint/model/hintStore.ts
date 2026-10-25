import { create } from 'zustand';

/** Kinds of screen elements the hint panel can describe. Add a kind here and in `HintTarget`. */
export const HINT_TARGET = {
  cell: 'cell',
  door: 'door',
  gold: 'gold',
  hero: 'hero',
  tooth: 'tooth',
  item: 'item',
  modifier: 'modifier',
} as const;

export type HintTargetKind = (typeof HINT_TARGET)[keyof typeof HINT_TARGET];

/**
 * What the player points at. Only a reference is stored, not the text: the panel reads the
 * element's current state, so the hint stays right when it changes under the cursor.
 */
export type HintTarget =
  | {
      kind: typeof HINT_TARGET.cell;
      /** Index of the board cell. */
      index: number;
    }
  | { kind: typeof HINT_TARGET.door }
  | { kind: typeof HINT_TARGET.gold }
  | { kind: typeof HINT_TARGET.hero }
  | {
      kind: typeof HINT_TARGET.tooth;
      /** Slot in the mouth. */
      slot: number;
    }
  | {
      kind: typeof HINT_TARGET.item;
      /** Slot in the hero's inventory. */
      slot: number;
    }
  | {
      kind: typeof HINT_TARGET.modifier;
      /** Modifier in the book, one of `MODIFIER` from `entities/tooth`. */
      modifier: string;
    };

/** Targets are plain objects of primitives, so equal fields mean the same element. */
export function isSameHintTarget(a: HintTarget, b: HintTarget) {
  const aEntries = Object.entries(a);
  return (
    aEntries.length === Object.keys(b).length &&
    aEntries.every(([key, value]) => (b as Record<string, unknown>)[key] === value)
  );
}

interface HintState {
  /** Element under the cursor; null when there is nothing to describe. */
  target: HintTarget | null;
  showHint: (target: HintTarget) => void;
  /** Clears the hint, but only if it still describes `target`, so a late leave can't erase a newer one. */
  hideHint: (target: HintTarget) => void;
}

export const useHintStore = create<HintState>()((set) => ({
  target: null,
  showHint: (target) => set({ target }),
  hideHint: (target) =>
    set((state) =>
      state.target && isSameHintTarget(state.target, target) ? { target: null } : state,
    ),
}));

/**
 * Mouse handlers that make an element describe itself in the hint panel:
 * `<div {...getHintHandlers({ kind: HINT_TARGET.hero })}>`. Not a hook, so it works inside loops.
 */
export function getHintHandlers(target: HintTarget) {
  return {
    onMouseEnter: () => useHintStore.getState().showHint(target),
    onMouseLeave: () => useHintStore.getState().hideHint(target),
  };
}
