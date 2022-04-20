import {makeAutoObservable} from "../_snowpack/pkg/mobx.js";
class Store {
  constructor() {
    this.board = [
      [
        {
          row: 0,
          col: 0,
          adjacentMines: 0,
          isMine: false,
          isRevealed: false,
          isFlagged: false
        }
      ]
    ];
    this.gameStarted = false;
    this.gameOver = false;
    this.difficulty = 0;
    makeAutoObservable(this);
  }
}
export const store = new Store();
