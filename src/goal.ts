import { Card } from './card.js';
import { Player } from './player.js';

export class Goal {
  states = {
    active: 'active',
    complete: 'complete',
    failed: 'failed',
  } as const;

  state: typeof this.states[keyof typeof this.states];

  card: Card;
  assignedPlayer: Player = null;

  constructor(card: Card) {
    this.card = card;
    this.state = this.states.active;
  }
}
