import { create } from 'zustand';

import { type Tooth, TOOTH_POOL, useToothStore } from '@/entities/tooth';
import { pickCells } from '@/shared/lib';

import { TOOTH_OFFER_COUNT } from '../config';

const POOL_INDICES = TOOTH_POOL.map((_, index) => index);

/** `TOOTH_OFFER_COUNT` different random teeth from `TOOTH_POOL`. */
export function createToothOffers(random: () => number = Math.random): readonly Tooth[] {
  return pickCells(POOL_INDICES, TOOTH_OFFER_COUNT, random).map((index) => TOOTH_POOL[index]);
}

interface ToothChoiceState {
  /** Teeth the room offers, left to right. */
  offers: readonly Tooth[];
  /** Index of the offer the hero has taken; null while the choice is not made and the room is closed. */
  chosen: number | null;
}

export const useToothChoiceStore = create<ToothChoiceState>()(() => ({
  offers: createToothOffers(),
  chosen: null,
}));

/** The tooth room opens once the hero has taken a tooth. */
export function isToothRoomOpen({ chosen }: Pick<ToothChoiceState, 'chosen'>) {
  return chosen !== null;
}

/**
 * Puts the offered tooth into a random slot of the mouth (`addTooth`) and opens the room. Only the
 * first choice counts; offers out of range are ignored.
 */
export function chooseTooth(offer: number, random?: () => number) {
  const state = useToothChoiceStore.getState();
  const tooth = state.offers[offer];
  if (isToothRoomOpen(state) || !tooth) return;
  useToothStore.getState().addTooth(tooth, random);
  useToothChoiceStore.setState({ chosen: offer });
}

/**
 * Leaves the open tooth room and closes it behind the hero with new offers for the next time. Does
 * nothing while the room is closed. Returns whether the hero has left; where she goes next is up
 * to the caller (`enterNextRoom`).
 */
export function leaveToothRoom(random?: () => number) {
  if (!isToothRoomOpen(useToothChoiceStore.getState())) return false;
  useToothChoiceStore.setState({ offers: createToothOffers(random), chosen: null });
  return true;
}
