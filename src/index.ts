import { GameManager } from './gameManager.js';

const gm = new GameManager();

(async () => {
  while (gm.playing) {
    gm.update();
    gm.createState();
    gm.renderView();
    await gm.handleInput();
  }
})();
