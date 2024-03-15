export class Player {
  commander = false;

  constructor(id) {
    this.id = id;
    this.hand = [];
  }

  draw(card) {
    this.hand.push(card);
  }

  playCard(card) {
    this.hand = this.hand.filter(c => c != card);
  }

  hasSuit(suit) {
    return !!this.hand.find(card => card.suit === suit);
  }
}
