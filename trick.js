export class Trick {
  constructor(currentPlayer) {
    this.leadSuit = null;
    this.plays = []; // {card, player}
    this.currentPlayer = currentPlayer;
  }

  playCard(card) {
    this.plays.push({player: this.currentPlayer, card});
    this.leadSuit = this.leadSuit || card.suit;
  }

  determineWinner() {
    let winner; // {card, player}
    this.plays.forEach(play => {
      if (!winner) {
        winner = play;
      } else {
        // Challenger will only win if they play a higher value of same suit, or trump suit if winner didn't
        if (
          (play.card.suit === winner.card.suit && play.card.value > winner.card.value) ||
          (play.card.suit != winner.card.suit && play.card.suit.trump)
        ) {
          winner = play;
        }
      }
    });
    return winner;
  }
}
