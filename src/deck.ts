import { Card } from './card.js'
import { suits } from './shared.js';

export class Deck {
  minValue: number;
  maxValue: number;
  maxTrumpValue: number;
  cards: Card[];

  constructor(minValue: number, maxValue: number, maxTrumpValue: number) {
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.maxTrumpValue = maxTrumpValue;
    this.cards = [];
    this.build();
    this.shuffle();
  }

  build(): void {
    let deck = [];
    for (let i = this.minValue; i <= this.maxValue; i++) {
      for (let suit in suits) {
        if (suits[suit].trump && i > this.maxTrumpValue) continue;
        deck.push(new Card(i, suits[suit]));
      }
    }
    this.cards = deck;
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }
}
