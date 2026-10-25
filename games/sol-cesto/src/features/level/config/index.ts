/** Every this many levels the room is an upgrade room instead of a dungeon with enemies. */
export const UPGRADE_ROOM_EVERY = 2;

/** Every this many levels the upgrade room is replaced by a tooth room. */
export const TOOTH_ROOM_EVERY = 4;

/** Levels whose room is a shop. For now the second one, to try the shop out early. */
export const SHOP_ROOM_LEVELS: readonly number[] = [2];

/**
 * Gold the hero gets for clearing a dungeon room: killing every enemy and taking every pickup, so
 * only spikes (or nothing) are left. Multiplied like any other gold.
 */
export const ROOM_CLEAR_GOLD = 2;
