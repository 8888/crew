import { Trick } from './trick.js';
import { GameState, Play, TrickResult, config, levels } from './shared.js';
import { Deck } from './deck.js';
import { Player } from './player.js';
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
  currentTrick: Trick;
  trickLead: Player;
  trickResults: TrickResult[];
  message: string;

  // current game
  players: Player[];
  deck: Deck;
  commander: Player;
  currentPlayerIdToPickGoals: number;
  goals: Goal[];
  goalMapByCard: {[key: string]: Goal};
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
    this.players.forEach(player => player.newHand());
    this.trickResults = [];
    this.goals = [];
    this.goalMapByCard = {};
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
      goals: this.goals,
      state: this.state,
      message: this.message,
      trickResults: this.trickResults,
      level: this.level,
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
      const goal = new Goal(goalsDeck.cards.pop());
      this.goals.push(goal);
      this.goalMapByCard[goal.card.id] = goal;
    }
    this.setGoalMessage();
  }

  pickGoals(userInput: string): void {
    const goal = this.goals.find(goal => goal.card.id === userInput);
    if (goal && !goal.assignedPlayer) {
      const player = this.players[this.currentPlayerIdToPickGoals];
      player.goals.push(goal);
      goal.assignedPlayer = player;

      if (this.goals.some(goal => !goal.assignedPlayer)) {
        this.currentPlayerIdToPickGoals < config.numberOfPlayers - 1 ?
          this.currentPlayerIdToPickGoals++ :
          this.currentPlayerIdToPickGoals = 0;
        this.setGoalMessage();
      } else {
        this.state = this.states.startNewTrick;
        this.message = "Ready to start the game!"
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
    const result: TrickResult = {
      winner: winner.player,
      cardPlayed: winner.card,
      cardsCaptured: [...this.currentTrick.plays.map(play => play.card)],
    };
    this.trickResults.push(result);
    this.evaluateGoals(result);
  }

  evaluateGoals(result: TrickResult): boolean {
    result.cardsCaptured.forEach(card => {
      const goal = this.goalMapByCard[card.id];
      if (goal) {
        goal.state = goal.assignedPlayer === result.winner ? 'complete' : 'failed';
      }
    });

    if (this.goals.some(goal => goal.state === 'failed')) {
      this.state = this.states.deal;
      this.message = `Goal failed! Restarting level ${this.level + 1}`;
    } else if (this.goals.every(goal => goal.state === 'complete')) {
      this.state = this.states.deal;
      this.level++;
      this.message = `Level completed! Advancing to level ${this.level + 1}`;
    } else {
      this.trickLead = result.winner;
      this.state = this.states.startNewTrick;
      this.setTrickWonMessage();
    }

    if (this.goals.some(goal => goal.state === 'failed')) return
    return !this.goals.some(goal => goal.state === 'active');
  }

  setTrickWonMessage(): void {
    const trick = this.trickResults[this.trickResults.length-1];
    this.message = `P${trick.winner.id} won the trick!`;
  }
}
