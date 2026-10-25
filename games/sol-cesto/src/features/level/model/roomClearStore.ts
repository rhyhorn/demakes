import { create } from 'zustand';

interface RoomClearState {
  /** Gold the hero got for clearing the room she is in, or `null` while it isn't cleared. */
  reward: number | null;
}

export const useRoomClearStore = create<RoomClearState>()(() => ({ reward: null }));
