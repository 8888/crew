import { Card } from './card.js';

export class Goal {
  states = {
    active: 'active',
    complete: 'complete',
    failed: 'failed',
  } as const;

  state: typeof this.states[keyof typeof this.states];

  card: Card;

  constructor(card: Card) {
    this.card = card;
    this.state = this.states.active;
  }
}
