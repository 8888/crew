import { Card } from './card.js';
import { Goal } from './goal.js';
import { Suit } from './shared.js';

export class Player {
  id: number;
  hand: Card[];
  commander = false;
  goals: Goal[] = [];

  constructor(id: number) {
    this.id = id;
    this.hand = [];
  }

  draw(card: Card): void {
    this.hand.push(card);
  }

  playCard(card: Card): void {
    this.hand = this.hand.filter(c => c != card);
  }

  hasSuit(suit: Suit): boolean {
    return !!this.hand.find(card => card.suit === suit);
  }
}
