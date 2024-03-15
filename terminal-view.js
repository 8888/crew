import { suits } from './shared.js';

export class TerminalView {
  constructor(game) {
    this.game = game;
  }

  render() {
    console.log('--------------------------------')
    // current hands
    this.game.players.forEach(player => {
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

    // goals

    // last trick result
    if (this.game.trickResults.length) {
      const trick = this.game.trickResults[this.game.trickResults.length - 1];
      let cardsString = '';
      trick.cardsCaptured.forEach(card => {
        cardsString += `${card.suit.id}${card.value} `
      });
      console.log('*Results of the last trick*');
      console.log(`P${trick.winner.id} played ${trick.cardPlayed.suit.id}${trick.cardPlayed.value} to capture ${cardsString}`);
    }

    // current trick
    const lead = this.game.currentTrick?.leadSuit ? this.game.currentTrick.leadSuit.name : 'none';
    let cardsString = '';
    this.game.currentTrick?.plays.forEach(card => {
      cardsString += `(P${card.player.id}: ${card.card.suit.id}${card.card.value}), `
    })
    console.log(`*Current trick*`);
    console.log(`Lead suit: ${lead}`);
    console.log(`Cards: ${cardsString}`);
  }

  organizeCards(cards) {
    const organizedCards = {};
    for (let suit in suits) organizedCards[suit] = [];
    cards.forEach(card => organizedCards[card.suit.name].push(card));
    for (let suit in organizedCards) organizedCards[suit].sort((a, b) => a.value - b.value);
    return organizedCards;
  }
}
