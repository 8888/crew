import { GameState, suits } from './shared.js';
import { Card } from './card.js';

export class TerminalView {
  render(state: GameState) {
    console.log(`----------------Level ${state.level+1}----------------`)
    this.displayHands(state);
    this.displayUnassignedGoals(state);
    this.displayPlayerGoals(state);
    this.displayCompletedGoals(state);
    this.displayLastTrickResult(state);
    this.displayCurrentTrick(state);
  }

  displayHands(state: GameState): void {
    state.players.forEach(player => {
      const commander = player.commander ? 'c' : ' ';
      const playerName = `[${commander}]P${player.id}`;

      const cards = this.organizeCards(player.hand);
      let cardsString = '';
      for (let suit in cards) {
        const cardsInSuit = cards[suit].map(card => card.value).join(',');
        const suitString = `${suit}: ${cardsInSuit}`
        const displayLength = 20;
        const diff = displayLength - suitString.length || 0;
        cardsString += ` ${suitString}`;
        cardsString += ' '.repeat(diff);
      }

      console.log(`${playerName} ${cardsString}`);
    });
  }

  organizeCards(cards: Card[]): {[key: string]: Card[]}{
    const organizedCards: {[key: string]: Card[]} = {};
    for (let suit in suits) organizedCards[suit] = [];
    cards.forEach(card => organizedCards[card.suit.name].push(card));
    for (let suit in organizedCards) organizedCards[suit].sort((a, b) => a.value - b.value);
    return organizedCards;
  }

  displayUnassignedGoals(state: GameState): void {
    const unassignedGoals = state.goals.filter(goal => !goal.assignedPlayer);
    if (unassignedGoals.length) {
      const goalsString = unassignedGoals.map(goal => `${goal.card.suit.id}${goal.card.value}`).join(', ');
      console.log('*Available goals*');
      console.log(goalsString);
    }
  }

  displayPlayerGoals(state: GameState): void {
    let goalsString = '';
    state.players.forEach(player => {
      const aciveGoals = player.goals.filter(goal => goal.state === 'active');
      if (aciveGoals.length) {
        goalsString += `P${player.id}: `;
        aciveGoals.forEach(goal => {
          goalsString += `${goal.card.id} `
        });
        goalsString += ' '.repeat(3);
      }
    });
    if (goalsString) console.log(`*Active goals*: ${goalsString}`);
  }

  displayCompletedGoals(state: GameState): void {
    let goalsString = '';
    state.players.forEach(player => {
      const completedGoals = player.goals.filter(goal => goal.state === 'complete');
      if (completedGoals.length) {
        goalsString += `P${player.id}: `;
        completedGoals.forEach(goal => {
          goalsString += `${goal.card.id} `
        });
        goalsString += ' '.repeat(3);
      }
    });
    if (goalsString) console.log(`*Completed goals*: ${goalsString}`);
  }

  displayLastTrickResult(state: GameState): void {
    if (state.trickResults.length) {
      const trick = state.trickResults[state.trickResults.length - 1];
      let cardsString = '';
      trick.cardsCaptured.forEach(card => {
        cardsString += `${card.suit.id}${card.value} `
      });
      console.log('*Results of the last trick*');
      console.log(`P${trick.winner.id} played ${trick.cardPlayed.suit.id}${trick.cardPlayed.value} to capture ${cardsString}`);
    }
  }

  displayCurrentTrick(state: GameState): void {
    if (!state.currentTrick) return;
    const lead = state.currentTrick.leadSuit ? state.currentTrick.leadSuit.name : 'none';
    let cardsString = '';
    state.currentTrick?.plays.forEach(card => {
      cardsString += `(P${card.player.id}: ${card.card.suit.id}${card.card.value}), `
    })
    console.log(`*Current trick*`);
    console.log(`Lead suit: ${lead}`);
    console.log(`Cards: ${cardsString}`);
  }
}
