export class Goal {
  states = {
    active: 'active',
    complete: 'complete',
    failed: 'failed',
  }

  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
    this.state = this.states.active;
  }
}
