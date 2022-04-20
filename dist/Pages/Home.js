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
    className: "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
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
          }
        }
      }
    }
  }
}
const Tile = observer((props) => {
  if (props.col.isRevealed) {
    if (props.col.isMine) {
      return /* @__PURE__ */ React.createElement("div", null, "💣");
    } else {
      return /* @__PURE__ */ React.createElement("div", {
        className: "text-white"
      }, props.col.adjacentMines);
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
      e.preventDefault();
      store.board[col.row][col.col].isFlagged = !store.board[col.row][col.col].isFlagged;
    },
    onClick: () => {
      store.board[rowIndex][colIndex].isRevealed = true;
      cascadeReveal(store.board[rowIndex][colIndex]);
      console.log([rowIndex, colIndex]);
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "w-8 h-8"
  }, /* @__PURE__ */ React.createElement(Tile, {
    col
  }))))))));
});
const Home = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "mb-8"
  }, /* @__PURE__ */ React.createElement(DifficultySelector, null), /* @__PURE__ */ React.createElement(Board, null));
};
export default Home;
