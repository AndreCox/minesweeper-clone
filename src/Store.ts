import { action, makeAutoObservable, observable } from 'mobx';

//define store class which will be used to store data, add extra states here

class Store {
  //define your data here
  board = [
    [
      {
        row: 0,
        col: 0,
        adjacentMines: 0,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
      },
    ],
  ];
  gameStarted = false;
  gameOver = false;
  gameWon = false;
  difficulty = 0;

  constructor() {
    makeAutoObservable(this);
  }
  //you can add functions to manipulate data here
}

export const store = new Store();
