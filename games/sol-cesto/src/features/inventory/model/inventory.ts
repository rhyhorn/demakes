import { useHeroStore } from '@/entities/hero';

/** Throws away the item in inventory slot `index`. A placeholder until items get used. */
export const discardItem = (index: number) => {
  useHeroStore.getState().removeItem(index);
};
