import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export class TerminalInput {
  async chooseCard(message: string = ''): Promise<string>{
    const input = await this.getInput(message);
    return /^[a-z][1-9]$/.test(input) ? input : '';
  }

  async getInput(message: string): Promise<string> {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(message);
    rl.close();
    return answer;
  }
}
