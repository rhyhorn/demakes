const pluralRules = new Intl.PluralRules('uk');

/** Ukrainian forms of «хід» by plural category: 1 хід, 2 ходи, 5 ходів. */
const MOVE_WORDS: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: 'хід',
  few: 'ходи',
  many: 'ходів',
};

/** Tells the player how many moves are left before the locked door of a level opens. */
export function describeMovesLeft(movesLeft: number) {
  const word = MOVE_WORDS[pluralRules.select(movesLeft)] ?? MOVE_WORDS.many;
  return `Зроби ще ${movesLeft} ${word}`;
}
