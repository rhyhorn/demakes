import { HERO_ATTACK_KIND, type HeroAttackKind } from '@/entities/hero';

/** How much the chosen attack grows in the upgrade room. */
export const UPGRADE_AMOUNT = 1;

/** The choices of the upgrade room, left to right: physical attack, then magic. */
export const UPGRADE_OPTIONS: readonly { kind: HeroAttackKind; name: string; icon: string }[] = [
  { kind: HERO_ATTACK_KIND.attack, name: 'Атака', icon: '🗡' },
  { kind: HERO_ATTACK_KIND.magic, name: 'Магія', icon: '🌀' },
];
