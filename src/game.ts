import { Trick } from './trick.js';
import { GameState, Play, TrickResult, config, levels } from './shared.js';
import { Deck } from './deck.js';
import { Player } from './player.js';
import { Card } from './card.js';
import { Goal } from './goal.js';

export class Game {
  states = {
    deal: 'deal',
    pickGoals: 'pickGoals',
    startNewTrick: 'startNewTrick',
    playTrick: 'playTrick',
    evaluateTrick: 'evaluateTrick',
  } as const;

  // current trick
  currentTrick: Trick = null;
  trickLead: Player = null;
  trickResults: TrickResult[] = [];
  message: string;

  // current game
  players: Player[];
  deck: Deck = null;
  commander: Player = null;
  currentPlayerIdToPickGoals: number;
  unassignedGoals: Goal[] = [];
  level = 0;
  state: typeof this.states[keyof typeof this.states];

  constructor(players: Player[]) {
    this.players = players;
    this.state = this.states.deal;
  }

  update(userInput: string = ''): void {
    this.message = '';
    if (this.state === this.states.deal) {
      this.startNewHand();
    } else if (this.state === this.states.pickGoals) {
      this.pickGoals(userInput);
    } else if (this.state === this.states.startNewTrick) {
      this.startNewTrick();
    } else if (this.state === this.states.playTrick) {
      this.playTrick(userInput);
    } else if (this.state === this.states.evaluateTrick) {
      this.evaluateTrick();
    }
  }

  startNewHand(): void {
    this.deck = this.buildDeck();
    this.buildDeck();
    this.deal();
    this.drawGoals();
    this.state = this.states.pickGoals;
  }

  buildDeck(): Deck {
    return new Deck(
      config.deckMinValue,
      config.deckMaxValue,
      config.deckMaxTrumpValue
    );
  }

  deal(): void {
    while (this.deck.cards.length > 0) {
      this.players.forEach(player => {
        if (this.deck.cards.length === 0) return;
        const card = this.deck.cards.pop();
        player.draw(card);
        if (card.suit.trump && card.value === config.deckMaxTrumpValue) this.setCommander(player.id);
      });
    }
  }

  setCommander(id: number) {
    this.players[id].commander = true;
    this.commander = this.players[id];
    this.trickLead = this.commander;
    this.currentPlayerIdToPickGoals = id;
  }

  createState(): GameState {
    return {
      players: this.players,
      currentTrick: this.currentTrick,
      unassignedGoals: this.unassignedGoals,
      state: this.state,
      message: this.message,
      trickResults: this.trickResults,
    };
  }

  drawGoals(): void {
    const levelConfig = levels[this.level];
    const goalsDeck = new Deck(
      levelConfig.minValue,
      levelConfig.maxValue,
      levelConfig.maxTrumpValue
    );
    for (let i = 0; i < levelConfig.cards; i++) {
      this.unassignedGoals.push(new Goal(goalsDeck.cards.pop()));
    }
    this.setGoalMessage();
  }

  pickGoals(userInput: string): void {
    const i = this.unassignedGoals.findIndex(goal => goal.card.id === userInput);
    if (i >= 0) {
      const goal = this.unassignedGoals.splice(i, 1)[0];
      this.players[this.currentPlayerIdToPickGoals].goals.push(goal);

      if (this.unassignedGoals.length === 0) {
        this.state = this.states.startNewTrick;
        this.message = "Ready to start the game!"
      } else {
        this.currentPlayerIdToPickGoals < config.numberOfPlayers - 1 ?
          this.currentPlayerIdToPickGoals++ :
          this.currentPlayerIdToPickGoals = 0;
        this.setGoalMessage();
      }
    } else {
      this.setGoalMessage();
    }
  }

  setGoalMessage(): void {
    this.message = `P${this.currentPlayerIdToPickGoals}, pick a goal:`;
  }

  setCardMessage(): void {
    this.message = `P${this.currentTrick.currentPlayer.id}, play a card:`;
  }

  startNewTrick(): void {
    this.currentTrick = new Trick(this.trickLead);
    this.state = this.states.playTrick;
    this.setCardMessage();
    console.log(this.message)
  }

  playTrick(userInput: string): void {
    const trick = this.currentTrick;
    const validCard = trick.currentPlayer.hand.find(c => c.id === userInput);
    if (
      validCard && (
        (validCard.suit.trump || validCard.suit === trick.leadSuit) ||
        !trick.currentPlayer.hasSuit(trick.leadSuit)
      )
    ) {
      trick.currentPlayer.playCard(validCard);
      trick.playCard(validCard);
      this.setNextPlayer();
    } else {
      this.setCardMessage();
    }
  }

  setNextPlayer(): void {
    if (this.currentTrick.plays.length === config.numberOfPlayers) {
      this.state = this.states.evaluateTrick;
      this.message = 'All cards played, evaluate winner'
    } else {
      let current = this.currentTrick.currentPlayer.id + 1;
      if (current === config.numberOfPlayers) current = 0;
      this.currentTrick.currentPlayer = this.players[current];
      this.setCardMessage();
    }
  }

  evaluateTrick(): void {
    const winner: Play = this.currentTrick.determineWinner();
    this.trickResults.push({
      winner: winner.player,
      cardPlayed: winner.card,
      cardsCaptured: [...this.currentTrick.plays.map(play => play.card)],
    });
    this.trickLead = winner.player;
    this.state = this.states.startNewTrick;
    this.setTrickWonMessage();
  }

  setTrickWonMessage(): void {
    const trick = this.trickResults[this.trickResults.length-1];
    this.message = `P${trick.winner.id} won the trick!`;
  }
}
