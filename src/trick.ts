import { Player } from './player.js';
import { Card } from './card.js';
import { Suit, Play } from './shared.js'

export class Trick {
  leadSuit: Suit | null;
  plays: {card: Card, player: Player}[];
  currentPlayer: Player;

  constructor(currentPlayer: Player) {
    this.leadSuit = null;
    this.plays = [];
    this.currentPlayer = currentPlayer;
  }

  playCard(card: Card): void {
    this.plays.push({player: this.currentPlayer, card});
    this.leadSuit = this.leadSuit || card.suit;
  }

  determineWinner(): Play {
    let winner: Play;
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
