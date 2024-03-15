import { Trick } from './trick.js';
import { config } from './shared.js';

export class Game {
  commander = null;
  trickLead = null;
  currentTrick = null;
  trickResults = [];
  states = {
    setGoals: 'setGoals',
    pickGoals: 'pickGoals',
    deal: 'deal',
    startNewTrick: 'startNewTrick',
    playTrick: 'playTrick',
    evaluateTrick: 'evaluateTrick',
  };
  goals = [];
  level = 0;

  constructor(players, deck, input) {
    this.players = players;
    this.deck = deck;
    this.input = input
    this.playing = true;
    this.state = this.states.deal;
  }

  async play() {
    if (this.state === this.states.deal) {
      this.deal();
      this.trickLead = this.commander
      this.state = this.states.pickGoals;
    } else if (this.state === this.states.pickGoals) {
      await this.pickGoals();
      this.state = this.states.startNewTrick;
    } else if (this.state === this.states.setGoals) {
      this.drawGoals();
      this.state = this.states.startNewTrick;
    } else if (this.state === this.states.startNewTrick) {
      this.startNewTrick();
      this.state = this.states.playTrick;
    } else if (this.state === this.states.playTrick) {
      await this.playTrick();
      this.setNextPlayer();
    } else if (this.state === this.states.evaluateTrick) {
      this.evaluateTrick();
      this.state = this.states.startNewTrick;
      // this.playing = false;
    }
  }

  drawGoals() {
    const levelConfig = config.levels[this.level];
    const goalsDeck = new Deck(
      levelConfig.minValue,
      levelConfig.maxValue,
      levelConfig.maxTrumpValue
    );
    for (let i = 0; i < levelConfig.cards; i++) {
      this.goals.push(goalsDeck.cards.pop());
    }
  }

  async pickGoals() {
    const { suit, value } = await this.input.chooseCard(`P${trick.currentPlayer.id}: `);
  }

  deal() {
    while (this.deck.cards.length > 0) {
      this.players.forEach(player => {
        if (this.deck.cards.length === 0) return;
        const card = this.deck.cards.pop();
        player.draw(card);
        if (card.suit.trump && card.value === config.deckMaxTrumpValue) this.setCommander(player.id);
      });
    }
  }

  setCommander(id) {
    this.players[id].commander = true;
    this.commander = this.players[id];
  }

  startNewTrick() {
    this.currentTrick = new Trick(this.trickLead);
  }

  async playTrick() {
    const trick = this.currentTrick;
    let validCard = null;
    while (!validCard) {
      const { suit, value } = await this.input.chooseCard(`P${trick.currentPlayer.id}: `);
      validCard = trick.currentPlayer.hand
        .find(c => c.suit.id === suit && c.value === value);

      if (validCard) { // card found in hand
        if (validCard.suit.trump || validCard.suit === trick.leadSuit) {
          // can always play trump and lead
          break;
        } else if (!trick.currentPlayer.hasSuit(trick.leadSuit)) {
          // can only play a different color if you don't have the lead suit
          break;
        } else {
          // must play the lead suit since the player has it
          validCard = null;
        }
      }
    }
    trick.currentPlayer.playCard(validCard);
    trick.playCard(validCard);
  }

  setNextPlayer() {
    if (this.currentTrick.plays.length === config.numberOfPlayers) {
      this.state = this.states.evaluateTrick;
    } else {
      let current = this.currentTrick.currentPlayer.id + 1;
      if (current === config.numberOfPlayers) current = 0;
      this.currentTrick.currentPlayer = this.players[current];
    }
  }

  evaluateTrick() {
    const winner = this.currentTrick.determineWinner(); // {card, player}
    this.trickResults.push({
      winner: winner.player,
      cardPlayed: winner.card,
      cardsCaptured: [...this.currentTrick.plays.map(play => play.card)],
    });
    this.trickLead = winner.player;
  }
}
