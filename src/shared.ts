import { Card } from './card.js';
import { Player } from './player.js';
import { Trick } from './trick.js';
import { Goal } from './goal.js';

export type Suit = {
  name: string;
  id: string;
  trump: boolean;
}

export type GameState = {
  players: Player[];
  currentTrick: Trick;
  unassignedGoals: Goal[];
  state: string;
  message: string;
  trickResults: TrickResult[];
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
  black: {name: 'black', id: 'k', trump: true},
  blue: {name: 'blue', id: 'b', trump: false},
  red: {name: 'red', id: 'r', trump: false},
  green: {name: 'green', id: 'g', trump: false},
  yellow: {name: 'yellow', id: 'y', trump: false},
}

export const levels: Level[] = [
  { name: '1', minValue: 7, maxValue: 9, maxTrumpValue: 0, cards: 1 },
]
