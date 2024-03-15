import { Deck } from './deck.js';
import { config } from './shared.js';
import { Player } from './player.js';
import { Game } from './game.js';
import { TerminalInput } from './terminal-input.js';
import { TerminalView } from './terminal-view.js';

const createPlayers = (n) => {
  const players = [];
  for (let i = 0; i < n; i++) {
    players.push(new Player(i))
  }
  return players;
}

(async () => {
  const deck = new Deck(config.deckMinValue, config.deckMaxValue, config.deckMaxTrumpValue);
  const players = createPlayers(config.numberOfPlayers);
  const input = new TerminalInput();
  const game = new Game(players, deck, input);
  const view = new TerminalView(game);
  while (game.playing) {
    await game.play();
    view.render();
  }
})();
