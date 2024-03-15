export const config = {
  numberOfPlayers: 4,
  deckMinValue: 1,
  deckMaxValue: 9,
  deckMaxTrumpValue: 4,
}

export const suits = {
  black: {name: 'black', id: 'k', trump: true},
  blue: {name: 'blue', id: 'b', trump: false},
  red: {name: 'red', id: 'r', trump: false},
  green: {name: 'green', id: 'g', trump: false},
  yellow: {name: 'yellow', id: 'y', trump: false},
}

export const levels = [
  { name: '1', minValue: 7, maxValue: 9, maxTrumpValue: 0, cards: 1 },
];
