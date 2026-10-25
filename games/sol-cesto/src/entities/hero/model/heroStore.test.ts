import { beforeEach, describe, expect, it } from 'vitest';

import { HERO_ATTACK_KIND, HERO_CLASS, HERO_CLASSES, INVENTORY_ITEM } from '../config';
import { INITIAL_HERO_STATS, useHeroStore } from './heroStore';

describe('useHeroStore', () => {
  beforeEach(() => {
    useHeroStore.setState(useHeroStore.getInitialState());
  });

  it('starts with full health, base attack and magic and no gold', () => {
    const { health, maxHealth, gold } = useHeroStore.getState();

    expect(useHeroStore.getState()).toMatchObject(INITIAL_HERO_STATS);
    expect(health).toBe(maxHealth);
    expect(gold).toBe(0);
  });

  it('loses health from damage', () => {
    useHeroStore.getState().takeDamage(2);

    expect(useHeroStore.getState().health).toBe(3);
  });

  it('never drops health below 0', () => {
    useHeroStore.getState().takeDamage(99);

    expect(useHeroStore.getState().health).toBe(0);
  });

  it('ignores damage of 0 or less', () => {
    const before = useHeroStore.getState();

    useHeroStore.getState().takeDamage(0);
    useHeroStore.getState().takeDamage(-1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('gets health back from healing', () => {
    useHeroStore.setState({ health: 3 });

    useHeroStore.getState().heal(1);

    expect(useHeroStore.getState().health).toBe(4);
  });

  it('never heals above max health', () => {
    useHeroStore.setState({ health: 4 });

    useHeroStore.getState().heal(9);

    expect(useHeroStore.getState().health).toBe(INITIAL_HERO_STATS.maxHealth);
  });

  it('ignores healing of 0 or less', () => {
    const before = useHeroStore.getState();

    useHeroStore.getState().heal(0);
    useHeroStore.getState().heal(-1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('raises the attack of the given kind only', () => {
    useHeroStore.getState().raiseAttack(HERO_ATTACK_KIND.magic, 2);

    expect(useHeroStore.getState().magic).toBe(INITIAL_HERO_STATS.magic + 2);
    expect(useHeroStore.getState().attack).toBe(INITIAL_HERO_STATS.attack);
  });

  it('ignores an attack raise of 0 or less', () => {
    const before = useHeroStore.getState();

    useHeroStore.getState().raiseAttack(HERO_ATTACK_KIND.attack, 0);
    useHeroStore.getState().raiseAttack(HERO_ATTACK_KIND.attack, -1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('adds gold to the piggy bank multiplied by the gold multiplier', () => {
    useHeroStore.setState({ gold: 2, goldMultiplier: 3 });

    useHeroStore.getState().addGold(4);

    expect(useHeroStore.getState().gold).toBe(14);
  });

  it('adds the bonus to the gold multiplier', () => {
    useHeroStore.setState({ gold: 0, goldMultiplier: 1 });

    useHeroStore.getState().addGold(2, 1);

    expect(useHeroStore.getState().gold).toBe(4);
  });

  it('adds gold as is with a multiplier of 1', () => {
    useHeroStore.setState({ gold: 2, goldMultiplier: 1 });

    useHeroStore.getState().addGold(4);

    expect(useHeroStore.getState().gold).toBe(6);
  });

  it('ignores gold of 0 or less', () => {
    const before = useHeroStore.getState();

    useHeroStore.getState().addGold(0);
    useHeroStore.getState().addGold(-1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('removes an item and shifts the next ones down', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.potion, INVENTORY_ITEM.spear] });

    useHeroStore.getState().removeItem(0);

    expect(useHeroStore.getState().inventory).toEqual([INVENTORY_ITEM.spear]);
  });

  it('ignores removing from an empty slot', () => {
    useHeroStore.setState({ inventory: [INVENTORY_ITEM.potion] });
    const before = useHeroStore.getState();

    useHeroStore.getState().removeItem(1);
    useHeroStore.getState().removeItem(-1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('spends gold from the piggy bank', () => {
    useHeroStore.setState({ gold: 5 });

    useHeroStore.getState().spendGold(3);

    expect(useHeroStore.getState().gold).toBe(2);
  });

  it('ignores spending more gold than there is, or 0 or less', () => {
    useHeroStore.setState({ gold: 2 });
    const before = useHeroStore.getState();

    useHeroStore.getState().spendGold(3);
    useHeroStore.getState().spendGold(0);
    useHeroStore.getState().spendGold(-1);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('adds an item after the carried ones', () => {
    useHeroStore.getState().addItem(INVENTORY_ITEM.potion);

    expect(useHeroStore.getState().inventory).toEqual([
      INVENTORY_ITEM.potion,
      INVENTORY_ITEM.spear,
      INVENTORY_ITEM.potion,
    ]);
  });

  it('ignores adding an item to a full inventory', () => {
    useHeroStore.setState({ inventorySize: 2 });
    const before = useHeroStore.getState();

    useHeroStore.getState().addItem(INVENTORY_ITEM.potion);

    expect(useHeroStore.getState()).toBe(before);
  });

  it('becomes the chosen hero with their stats and full health', () => {
    useHeroStore.setState({ health: 2 });

    useHeroStore.getState().chooseHero(HERO_CLASS.sorceress);
    const { heroClass, health, maxHealth, attack, magic } = useHeroStore.getState();

    expect({ heroClass, health, maxHealth, attack, magic }).toEqual({
      heroClass: HERO_CLASS.sorceress,
      health: HERO_CLASSES.sorceress.stats.maxHealth,
      ...HERO_CLASSES.sorceress.stats,
    });
  });

  it('gives the warrior more attack and the sorceress more magic', () => {
    expect(HERO_CLASSES.warrior.stats).toMatchObject({ attack: 2, magic: 1 });
    expect(HERO_CLASSES.sorceress.stats).toMatchObject({ attack: 1, magic: 2 });
  });

  it('brings back the starting stats on reset', () => {
    useHeroStore.getState().chooseHero(HERO_CLASS.sorceress);
    useHeroStore.getState().takeDamage(3);
    useHeroStore.getState().addGold(5);
    useHeroStore.setState({ goldMultiplier: 2 });

    useHeroStore.getState().reset();

    expect(useHeroStore.getState()).toMatchObject(INITIAL_HERO_STATS);
  });
});
