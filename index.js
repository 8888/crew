const suits = {
  black: {name: 'black', trump: true},
  blue: {name: 'blue', trump: false},
  red: {name: 'red', trump: false},
  green: {name: 'green', trump: false},
  yellow: {name: 'yellow', trump: false},
}

class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    this.build();
    this.shuffle();
  }

  build() {
    let deck = [];
    for (let i = 1; i <= 9; i++) {
      for (let suit in suits) {
        if (suits[suit].trump && i > 4) continue;
        deck.push(new Card(i, suits[suit]));
      }
    }
    this.cards = deck;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }
}

class Player {
  commander = false;

  constructor(id) {
    this.id = id;
    this.hand = [];
  }

  draw(card) {
    this.hand.push(card);
  }
}

class Game {
  commander = null;

  constructor(players, deck) {
    this.players = players;
    this.deck = deck;
  }

  play() {
    this.deal();
  }

  deal() {
    while (this.deck.cards.length > 0) {
      this.players.forEach(player => {
        if (this.deck.cards.length === 0) return;
        const card = this.deck.cards.pop();
        player.draw(card);
        if (card.suit.trump && card.value === 4) this.setCommander(player.id);
      });
    }
  }

  setCommander(id) {
    this.players[id].commander = true;
    this.commander = this.players[id];
  }
}

class TerminalView {
  constructor(game) {
    this.game = game;
  }

  render() {
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
  }

  organizeCards(cards) {
    const organizedCards = {};
    for (let suit in suits) organizedCards[suit] = [];
    cards.forEach(card => organizedCards[card.suit.name].push(card));
    for (let suit in organizedCards) organizedCards[suit].sort((a, b) => a.value - b.value);
    return organizedCards;
  }
}

(() => {
  const deck = new Deck();
  const players = [
    new Player(0),
    new Player(1),
    new Player(2),
    new Player(3),
  ];
  const game = new Game(players, deck);
  const view = new TerminalView(game);
  game.play();
  view.render();
})();
