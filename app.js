/*
  TODO:
  - gamemanager obj using module
    - handles game flow
      - game over
      - restart
    - checks win states / tie
  - player obj using factory
    - start with two identical human players
    - once everything works, make an AI
    - allow user to choose which player(s) are bots
      - so you can watch two bots play lol
  - finally, clean up interface into something pretty
*/

const gameBoard = (() => {
  const numRows = 3;
  const numCols = 3;
  let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const reset = () => {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell = 0;
      });
    });
  };

  const mark = (y, x, player) => {
    if (y < 0 || y > 2 || x < 0 || x > 2) {
      return;
    }
    board[y][x] = Number(player);
  };

  const checkWin = () => {
    console.log(board);
    let wins = [];

    // check rows
    for (let r = 0; r < numRows; r++) {
      if (
        board[r][0] != 0 &&
        board[r][0] === board[r][1] &&
        board[r][0] === board[r][2]
      ) {
        wins.push([
          [r, 0],
          [r, 1],
          [r, 2],
        ]);
      }
    }

    // check cols
    for (let c = 0; c < numCols; c++) {
      if (
        board[0][c] != 0 &&
        board[0][c] === board[1][c] &&
        board[0][c] === board[2][c]
      ) {
        wins.push([
          [0, c],
          [1, c],
          [2, c],
        ]);
      }
    }

    // check diagonals
    if (
      board[0][0] != 0 &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      wins.push([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);
    }
    if (
      board[0][2] != 0 &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      wins.push([
        [0, 2],
        [1, 1],
        [2, 0],
      ]);
    }

    return wins;
  };

  return {
    reset,
    mark,
    checkWin,
  };
})();

/**
 * Handles game logic and mediates between the game board data and the UI.
 */
const gameManager = (() => {
  /**
   * Determines player's turn:
   * {player 1: -1}
   * {player 2: 1}
   */
  let turn = -1;

  const getCurrentPlayer = () => {
    return turn;
  };

  const nextTurn = () => {
    // check for win and update UI.
    let wins = gameBoard.checkWin();
    console.log("wins: ", wins);
    if (wins.length > 0) {
      wins.forEach((line) => {
        line.forEach((tileCoord) => {
          console.log(tileCoord);
          let tile = document.querySelector(
            "#" + CSS.escape(tileCoord[0]) + "-" + CSS.escape(tileCoord[1])
          );
          UI.showWinningColor(tile);
        });
      });
    }

    // exit if a win is found
    turn = -turn;
    return turn;
  };

  // const resetGame = () => {};

  return {
    getCurrentPlayer,
    nextTurn,
  };
})();

const UI = (() => {
  const board = document.querySelector(".board");
  const tiles = board.querySelectorAll(".tile");
  const xMarkHTML = `<i class="fa-solid fa-xmark"></i>`;
  const oMarkHTML = `<i class="fa-solid fa-o"></i>`;

  const reset = () => {
    tiles.forEach((tile) => {
      hideWinningColor(tile);
      tile.innerHTML = "";
    });
  };

  const mark = (y, x, player) => {
    let tile = board.querySelector("#" + CSS.escape(y) + "-" + CSS.escape(x));
    if (player > 0) {
      tile.innerHTML = oMarkHTML;
    } else if (player < 0) {
      tile.innerHTML = xMarkHTML;
    }
  };

  const showWinningColor = (tile) => {
    if (!tile.classList.contains("winner")) {
      tile.classList.add("winner");
    }
  };

  const hideWinningColor = (tile) => {
    if (tile.classList.contains("winner")) {
      tile.classList.remove("winner");
    }
  };

  return {
    reset,
    mark,
    showWinningColor,
  };
})();

// const player = () => {};

document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    let y = Number(tile.id[0]);
    let x = Number(tile.id[2]);
    if (tile.innerHTML === "") {
      gameBoard.mark(y, x, gameManager.getCurrentPlayer());
      UI.mark(y, x, gameManager.getCurrentPlayer());
      gameManager.nextTurn();
    }
  });
});
