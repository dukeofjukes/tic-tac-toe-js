/*
  TODO:
  - gameboard obj using module
    - stores game board as array
  - gamemanager obj using module
    - handles game flow
      - player turns
      - game over
      - restart
    - checks win states / tie
  - UI obj using module
    - displays board
    - handles clicks
      - stops players from overriding spots lol
  - player obj using factory
    - start with two identical human players
    - once everything works, make an AI
    - allow user to choose which player(s) are bots
      - so you can watch two bots play lol
  - finally, clean up interface into something pretty
*/

const xMarkHTML = `<i class="fa-solid fa-xmark"></i>`;
const oMarkHTML = `<i class="fa-solid fa-o"></i>`;

const gameBoard = (() => {
  const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  return {
    board,
  };
})();

const gameManager = (() => {
  /**
   * Determines player's turn:
   * {player 1: -1}
   * {player 2: 1}
   */
  const turn = -1;

  const nextTurn = () => {
    // TODO: first, check for winner
    // exit if a win is found
    turn = -turn;
    return turn;
  };

  // const resetGame = () => {};
  return {};
})();

const UI = (() => {
  const board = document.querySelector(".board");
  const tiles = board.querySelectorAll(".tile");

  const clearBoard = () => {
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

  const showWinningLine = (line) => {
    line.forEach((tile) => {
      showWinningColor(tile);
    });
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
    clearBoard,
    mark,
  };
})();

// const player = () => {};

document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    let y = Number(tile.id[0]);
    let x = Number(tile.id[2]);
    UI.mark(y, x, -1);
  });
});
