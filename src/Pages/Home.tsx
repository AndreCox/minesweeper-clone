import React, { useState, useEffect } from 'react';
import { Button } from './../Components';
import { Link } from 'react-router-dom';
import { store } from '../Store';
import { observer } from 'mobx-react-lite';

interface BoardProps {
  row: number;
  col: number;
  adjacentMines: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
}

function generateBoard() {
  let rows = 0;
  let cols = 0;
  let mines = 0;

  switch (store.difficulty) {
    case 0:
      rows = 9;
      cols = 9;
      mines = 10;
      break;
    case 1:
      rows = 16;
      cols = 16;
      mines = 40;
      break;
    case 2:
      rows = 16;
      cols = 30;
      mines = 99;
      break;
    default:
      rows = 9;
      cols = 9;
      mines = 10;
      break;
  }

  // create a board with the given rows and cols
  let board: Array<Array<BoardProps>> = [[]];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        row: i,
        col: j,
        adjacentMines: 0,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
      };
    }
  }

  let bombsPlaced = 0;
  while (bombsPlaced < mines) {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      bombsPlaced++;

      // check the adjacent cells and add 1 to the adjacentMines property
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && i < rows && j >= 0 && j < cols) {
            if (!board[i][j].isMine) {
              board[i][j].adjacentMines++;
            }
          }
        }
      }
    }
  }
  console.table(board);
  store.board = board;
}

const DifficultySelector = observer(() => {
  if (store.gameStarted === true) {
    return null;
  }
  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-black drop-shadow-lg shadow">
        <h1 className="text-3xl font-medium text-center">
          Select a difficulty
        </h1>
        <div className="flex flex-row items-center space-x-4 mt-8">
          <Button
            onClick={() => {
              store.gameStarted = true;
              store.difficulty = 0;
              generateBoard();
            }}
          >
            Easy
          </Button>
          <Button
            onClick={() => {
              store.gameStarted = true;
              store.difficulty = 1;
              generateBoard();
            }}
          >
            Medium
          </Button>
          <Button
            onClick={() => {
              store.gameStarted = true;
              store.difficulty = 2;
              generateBoard();
            }}
          >
            Hard
          </Button>
        </div>
      </div>
    </div>
  );
});

const GameOver = observer(() => {
  if (store.gameOver === false) {
    return null;
  }
  return (
    <div>
      <div className="absolute left-1/2 -translate-x-1/2 z-50">
        <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-black drop-shadow-lg shadow">
          <h1 className="text-3xl font-medium text-center">Game Over</h1>
          <div className="flex flex-row items-center space-x-4 mt-8">
            <Button
              onClick={() => {
                store.gameOver = false;
                store.gameStarted = false;
                store.board = [];
              }}
            >
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

const GameWon = observer(() => {
  if (store.gameWon === false) {
    return null;
  }
  return (
    <div>
      <h1>Test</h1>
      <div className="absolute left-1/2 -translate-x-1/2 z-50">
        <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-black drop-shadow-lg shadow">
          <h1 className="text-3xl font-medium text-center">You Win!</h1>
          <div className="flex flex-row items-center space-x-4 mt-8">
            <Button
              onClick={() => {
                store.gameOver = false;
                store.gameWon = false;
                store.gameStarted = false;
                store.board = [];
              }}
            >
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

function cascadeReveal(col: BoardProps) {
  if (col.isRevealed) {
    if (col.adjacentMines === 0) {
      for (let i = col.row - 1; i <= col.row + 1; i++) {
        for (let j = col.col - 1; j <= col.col + 1; j++) {
          if (
            i >= 0 &&
            i < store.board.length &&
            j >= 0 &&
            j < store.board[0].length
          ) {
            if (!store.board[i][j].isRevealed) {
              store.board[i][j].isRevealed = true;
              cascadeReveal(store.board[i][j]);
            }
            if (store.board[i][j].isFlagged) {
              store.board[i][j].isFlagged = false;
            }
          }
        }
      }
    }
  }
}

function checkWin() {
  console.log('checkWin');
  let win = true;
  for (let i = 0; i < store.board.length; i++) {
    for (let j = 0; j < store.board[0].length; j++) {
      if (!store.board[i][j].isMine && !store.board[i][j].isRevealed) {
        win = false;
      }
      if (!store.board[i][j].isFlagged && store.board[i][j].isMine) {
        win = false;
      }
    }
  }
  if (win) {
    store.gameWon = true;
  }
}

const Tile = observer((props: { col: any }) => {
  if (props.col.isRevealed) {
    if (props.col.isMine) {
      return <div>💣</div>;
    } else {
      return <div className="text-white">{props.col.adjacentMines}</div>;
    }
  }
  if (props.col.isFlagged) {
    return <div>🚩</div>;
  }
  return <div className="text-white">🪨</div>;
});

const Board = observer(() => {
  if (store.gameStarted === false) {
    return null;
  }
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 select-none text-xl text-center">
      <div className="rounded-xl bg-gray-800 shadow-black drop-shadow-lg shadow p-2">
        {store.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row">
            {row.map((col, colIndex) => (
              <div
                key={colIndex}
                // get right click event
                onContextMenu={(e) => {
                  checkWin();
                  console.log('right click');
                  e.preventDefault();
                  if (store.gameStarted === true) {
                    if (!store.gameOver && !store.gameWon) {
                      store.board[col.row][col.col].isFlagged =
                        !store.board[col.row][col.col].isFlagged;
                    }
                  }
                }}
                onClick={() => {
                  if (!store.gameOver && !store.gameWon) {
                    store.board[rowIndex][colIndex].isRevealed = true;
                    cascadeReveal(store.board[rowIndex][colIndex]);
                    if (store.board[rowIndex][colIndex].isMine) {
                      // reveal all mines
                      for (let i = 0; i < store.board.length; i++) {
                        for (let j = 0; j < store.board[i].length; j++) {
                          if (store.board[i][j].isMine) {
                            store.board[i][j].isRevealed = true;
                          }
                        }
                      }
                      store.gameOver = true;
                    }
                    console.log([rowIndex, colIndex]);
                    checkWin();
                  }
                }}
              >
                <div className="w-8 h-8 bg-slate-700 rounded-xl m-1 p-1 flex justify-center flex-col align-middle drop-shadow shadow-black">
                  <div className="flex flex-row justify-center">
                    <Tile col={col} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

const Home = () => {
  // Return the App component.
  return (
    <div className="mb-8">
      <DifficultySelector />
      <GameWon />
      <GameOver />
      <Board />
    </div>
  );
};

export default Home;
