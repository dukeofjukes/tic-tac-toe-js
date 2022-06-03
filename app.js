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

  const mark = (r, c, player) => {
    if (r < 0 || r > 2 || c < 0 || c > 2) {
      return;
    }
    board[r][c] = Number(player);
  };

  const checkWin = () => {
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

  const mark = (r, c, player) => {
    let tile = board.querySelector("#" + CSS.escape(r) + "-" + CSS.escape(c));
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
  let winner = 0;

  const getWinner = () => winner;

  const getCurrentPlayer = () => {
    return turn;
  };

  const nextTurn = () => {
    let wins = gameBoard.checkWin();

    if (wins.length > 0) {
      winner = getCurrentPlayer();
      wins.forEach((line) => {
        line.forEach((tileCoord) => {
          let tile = document.querySelector(
            "#" + CSS.escape(tileCoord[0]) + "-" + CSS.escape(tileCoord[1])
          );
          UI.showWinningColor(tile);
        });
      });
      return; // exit if a winner is found
    }

    turn = -turn;
  };

  const reset = () => {
    turn = -1;
    winner = 0;
    gameBoard.reset();
    UI.reset();
  };

  return {
    getCurrentPlayer,
    getWinner,
    nextTurn,
    reset,
  };
})();

// const player = () => {};

document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    if (gameManager.getWinner() === 0) {
      let r = Number(tile.id[0]);
      let c = Number(tile.id[2]);
      if (tile.innerHTML === "") {
        let player = gameManager.getCurrentPlayer();
        gameBoard.mark(r, c, player);
        UI.mark(r, c, player);
        gameManager.nextTurn();
      }
    }
  });
});

// document.querySelector("#reset-btn").addEventListener("click", () => {
//   gameManager.reset();
// });
