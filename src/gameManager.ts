import { config, GameState } from './shared.js';
import { Player } from './player.js';
import { Game } from './game.js';
import { TerminalInput } from './terminal-input.js';
import { TerminalView } from './terminal-view.js';

export class GameManager {
  playing = true;
  game: Game;
  view: TerminalView | null;
  input: TerminalInput;
  gameState: GameState;

  lastInput: string; // 2 char string suit and value r1 b2 k3 etc

  constructor() {
    const players = this.createPlayers(config.numberOfPlayers);
    this.game = new Game(players);

    if (config.viewType === 'terminal') {
      this.view = new TerminalView();
    }

    if (config.inputType === 'terminal') {
      this.input = new TerminalInput();
    }
  }

  update(): void {
    this.game.update(this.lastInput);
    this.lastInput = '';
  }

  createState(): void {
    this.gameState = this.game.createState();
  }

  renderView(): void {
    if (!this.view) return;
    this.view.render(this.gameState);
  }

  async handleInput(): Promise<void> {
    this.lastInput = await this.input.chooseCard(this.gameState.message);
  }

  createPlayers(n: number): Player[] {
    const players = [];
    for (let i = 0; i < n; i++) {
      players.push(new Player(i));
    }
    return players;
  }
}
