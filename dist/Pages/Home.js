import React from "../../_snowpack/pkg/react.js";
import {Button} from "../Components/index.js";
import {store} from "../Store.js";
import {observer} from "../../_snowpack/pkg/mobx-react-lite.js";
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
  let board = [[]];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        row: i,
        col: j,
        adjacentMines: 0,
        isMine: false,
        isRevealed: false,
        isFlagged: false
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
  return /* @__PURE__ */ React.createElement("div", {
    className: "absolute left-1/2 -translate-x-1/2"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col items-center bg-white rounded-lg p-4 shadow-black drop-shadow-lg shadow"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-medium text-center"
  }, "Select a difficulty"), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-row items-center space-x-4 mt-8"
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => {
      store.gameStarted = true;
      store.difficulty = 0;
      generateBoard();
    }
  }, "Easy"), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => {
      store.gameStarted = true;
      store.difficulty = 1;
      generateBoard();
    }
  }, "Medium"), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => {
      store.gameStarted = true;
      store.difficulty = 2;
      generateBoard();
    }
  }, "Hard"))));
});
const GameOver = observer(() => {
  if (store.gameOver === false) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "absolute left-1/2 -translate-x-1/2 z-50"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col items-center bg-white rounded-lg p-4 shadow-black drop-shadow-lg shadow"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-medium text-center"
  }, "Game Over"), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-row items-center space-x-4 mt-8"
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => {
      store.gameOver = false;
      store.gameStarted = false;
      store.board = [];
    }
  }, "Play Again")))));
});
const GameWon = observer(() => {
  if (store.gameWon === false) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "Test"), /* @__PURE__ */ React.createElement("div", {
    className: "absolute left-1/2 -translate-x-1/2 z-50"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col items-center bg-white rounded-lg p-4 shadow-black drop-shadow-lg shadow"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-medium text-center"
  }, "You Win!"), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-row items-center space-x-4 mt-8"
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => {
      store.gameOver = false;
      store.gameWon = false;
      store.gameStarted = false;
      store.board = [];
    }
  }, "Play Again")))));
});
function cascadeReveal(col) {
  if (col.isRevealed) {
    if (col.adjacentMines === 0) {
      for (let i = col.row - 1; i <= col.row + 1; i++) {
        for (let j = col.col - 1; j <= col.col + 1; j++) {
          if (i >= 0 && i < store.board.length && j >= 0 && j < store.board[0].length) {
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
  console.log("checkWin");
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
const Tile = observer((props) => {
  if (props.col.isRevealed) {
    if (props.col.isMine) {
      return /* @__PURE__ */ React.createElement("div", null, "💣");
    } else {
      if (props.col.adjacentMines === 0) {
        return /* @__PURE__ */ React.createElement("div", null);
      } else if (props.col.adjacentMines === 1) {
        return /* @__PURE__ */ React.createElement("div", {
          className: "text-blue-500"
        }, "1");
      } else if (props.col.adjacentMines === 2) {
        return /* @__PURE__ */ React.createElement("div", {
          className: "text-green-500"
        }, "2");
      } else if (props.col.adjacentMines === 3) {
        return /* @__PURE__ */ React.createElement("div", {
          className: "text-orange-500"
        }, "3");
      } else if (props.col.adjacentMines === 4) {
        return /* @__PURE__ */ React.createElement("div", {
          className: "text-red-500"
        }, "4");
      } else if (props.col.adjacentMines === 5) {
        return /* @__PURE__ */ React.createElement("div", {
          className: "text-purple-500"
        }, "5");
      } else if (props.col.adjacentMines === 6) {
        return /* @__PURE__ */ React.createElement("div", {
          className: "text-violet-500"
        }, "6");
      }
    }
  }
  if (props.col.isFlagged) {
    return /* @__PURE__ */ React.createElement("div", null, "🚩");
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "text-white"
  }, "🪨");
});
const Board = observer(() => {
  if (store.gameStarted === false) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 select-none text-xl text-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "rounded-xl bg-gray-800 shadow-black drop-shadow-lg shadow p-2"
  }, store.board.map((row, rowIndex) => /* @__PURE__ */ React.createElement("div", {
    key: rowIndex,
    className: "flex flex-row"
  }, row.map((col, colIndex) => /* @__PURE__ */ React.createElement("div", {
    key: colIndex,
    onContextMenu: (e) => {
      checkWin();
      console.log("right click");
      e.preventDefault();
      if (store.gameStarted === true) {
        if (!store.gameOver && !store.gameWon) {
          store.board[col.row][col.col].isFlagged = !store.board[col.row][col.col].isFlagged;
        }
      }
    },
    onClick: () => {
      if (!store.gameOver && !store.gameWon) {
        store.board[rowIndex][colIndex].isRevealed = true;
        cascadeReveal(store.board[rowIndex][colIndex]);
        if (store.board[rowIndex][colIndex].isMine) {
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
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "w-8 h-8 bg-slate-700 rounded-xl m-1 p-1 flex justify-center flex-col align-middle drop-shadow shadow-black"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-row justify-center"
  }, /* @__PURE__ */ React.createElement(Tile, {
    col
  })))))))));
});
const Home = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "mb-8"
  }, /* @__PURE__ */ React.createElement(DifficultySelector, null), /* @__PURE__ */ React.createElement(GameWon, null), /* @__PURE__ */ React.createElement(GameOver, null), /* @__PURE__ */ React.createElement(Board, null));
};
export default Home;
