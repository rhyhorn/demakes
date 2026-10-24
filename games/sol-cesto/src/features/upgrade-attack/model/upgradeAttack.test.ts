import { beforeEach, describe, expect, it } from 'vitest';

import { HERO_ATTACK_KIND, INITIAL_HERO_STATS, useHeroStore } from '@/entities/hero';

import { UPGRADE_AMOUNT } from '../config';
import {
  chooseUpgrade,
  isUpgradeRoomOpen,
  leaveUpgradeRoom,
  useUpgradeStore,
} from './upgradeAttack';

describe('upgrade room', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
    useUpgradeStore.setState(useUpgradeStore.getInitialState());
  });

  it('is closed until a choice is made', () => {
    expect(isUpgradeRoomOpen(useUpgradeStore.getState())).toBe(false);
  });

  it('raises the physical attack and opens the room', () => {
    chooseUpgrade(HERO_ATTACK_KIND.attack);

    expect(useHeroStore.getState().attack).toBe(INITIAL_HERO_STATS.attack + UPGRADE_AMOUNT);
    expect(useHeroStore.getState().magic).toBe(INITIAL_HERO_STATS.magic);
    expect(isUpgradeRoomOpen(useUpgradeStore.getState())).toBe(true);
  });

  it('raises the magic attack', () => {
    chooseUpgrade(HERO_ATTACK_KIND.magic);

    expect(useHeroStore.getState().magic).toBe(INITIAL_HERO_STATS.magic + UPGRADE_AMOUNT);
    expect(useHeroStore.getState().attack).toBe(INITIAL_HERO_STATS.attack);
  });

  it('counts only the first choice', () => {
    chooseUpgrade(HERO_ATTACK_KIND.attack);
    chooseUpgrade(HERO_ATTACK_KIND.magic);

    expect(useHeroStore.getState().magic).toBe(INITIAL_HERO_STATS.magic);
    expect(useUpgradeStore.getState().chosen).toBe(HERO_ATTACK_KIND.attack);
  });

  it('cannot be left while closed', () => {
    expect(leaveUpgradeRoom()).toBe(false);
  });

  it('can be left once open and closes behind the hero', () => {
    chooseUpgrade(HERO_ATTACK_KIND.attack);

    expect(leaveUpgradeRoom()).toBe(true);
    expect(useUpgradeStore.getState().chosen).toBeNull();
  });
});
