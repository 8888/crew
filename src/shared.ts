import { Card } from './card.js';
import { Player } from './player.js';
import { Trick } from './trick.js';
import { Goal } from './goal.js';

export type Suit = {
  name: string;
  char: string;
  trump: boolean;
}

export type GameState = {
  players: Player[];
  currentTrick: Trick;
  goals: Goal[];
  state: string;
  message: string;
  trickResults: TrickResult[];
  level: number
}

export type Play = {
  card: Card;
  player: Player;
}

export type TrickResult = {
  winner: Player;
  cardPlayed: Card;
  cardsCaptured: Card[];
}

export type Level = {
  name: string;
  minValue: number;
  maxValue: number;
  maxTrumpValue: number;
  cards: number;
}

export const config = {
  numberOfPlayers: 4,
  deckMinValue: 1,
  deckMaxValue: 9,
  deckMaxTrumpValue: 4,
  viewType: 'terminal',
  inputType: 'terminal',
}

export const suits: {[key: string]: Suit} = {
  black: {name: 'black', char: 'k', trump: true},
  blue: {name: 'blue', char: 'b', trump: false},
  red: {name: 'red', char: 'r', trump: false},
  green: {name: 'green', char: 'g', trump: false},
  yellow: {name: 'yellow', char: 'y', trump: false},
}

export const levels: Level[] = [
  { name: '1', minValue: 1, maxValue: 9, maxTrumpValue: 0, cards: 1 },
  { name: '2', minValue: 1, maxValue: 9, maxTrumpValue: 0, cards: 2 },
]
