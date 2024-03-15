import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export class TerminalInput {
  /**
   *
   * @param {string} [message] Optional message to show the user in terminal views
   */
  async chooseCard(message) {
    const input = await this.getInput(message);
    console.log(input);
    if (input.length === 2) {
      return { suit: input[0], value: parseInt(input[1]) };
    } else {
      return { suit: '', value: '' };
    }
  }

  async getInput(message) {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(message);
    rl.close();
    return answer;
  }
}
