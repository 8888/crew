import { Suit } from './shared.js';

export class Card {
  value: number;
  suit: Suit;
  id: string;

  constructor(value: number, suit: Suit) {
    this.value = value;
    this.suit = suit;
    this.id = `${suit.id}${value}`;
  }
}
