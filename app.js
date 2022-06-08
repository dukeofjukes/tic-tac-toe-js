/*
  TODO:
  - player obj using factory
    - start with two identical human players
    - once everything works, make an AI
    - allow user to choose which player(s) are bots
      - so you can watch two bots play lol
*/

const gameBoard = (() => {
  const numRows = 3;
  const numCols = 3;
  let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const getTileValue = (r, c) => board[r][c];

  const reset = () => {
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
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

  const checkTie = () => {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (board[r][c] === 0) {
          return false;
        }
      }
    }

    return true;
  };

  return {
    getTileValue,
    reset,
    mark,
    checkWin,
    checkTie,
  };
})();

const UI = (() => {
  const modalEl = document.querySelector(".modal");
  const board = document.querySelector(".board");
  const tiles = board.querySelectorAll(".tile");
  const currentPlayerEl = document.querySelector("#current-player");
  const statusEl = document.querySelector("#status");
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
    tile.innerHTML = player < 0 ? xMarkHTML : oMarkHTML;
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

  const showCurrentPlayer = (player) => {
    currentPlayerEl.innerHTML = player < 0 ? xMarkHTML : oMarkHTML;
    statusEl.innerHTML = `'s turn.`;
  };

  const showWinner = (player) => {
    currentPlayerEl.innerHTML = player < 0 ? xMarkHTML : oMarkHTML;
    statusEl.innerHTML = `wins!`;
  };

  const showTie = () => {
    currentPlayerEl.innerHTML = "";
    statusEl.innerHTML = "Tie. Play again?";
  };

  const showModal = () => {
    modalEl.style.display = "block";
  };

  const hideModal = () => {
    modalEl.style.display = "none";
  };

  return {
    reset,
    mark,
    showWinningColor,
    showCurrentPlayer,
    showWinner,
    showTie,
    showModal,
    hideModal,
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
  let currentPlayer = -1;
  let winner = 0;

  const getWinner = () => winner;

  const getCurrentPlayer = () => {
    return currentPlayer;
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
      UI.showWinner(winner);
      return; // exit if a winner is found
    } else {
      let tie = gameBoard.checkTie();
      if (tie) {
        UI.showTie();
        return; // exit if tie
      }
    }

    // switch player
    currentPlayer = -currentPlayer;
    UI.showCurrentPlayer(currentPlayer);

    let player;
    if (currentPlayer === -1) {
      player = player1;
    } else {
      player = player2;
    }

    // call computer logic if the current player is a computer
    if (player.isComputer()) {
      console.log("is computer");
      player.computeMove();
    }
  };

  const reset = () => {
    currentPlayer = -1;
    winner = 0;
    gameBoard.reset();
    UI.reset();
    UI.showCurrentPlayer(currentPlayer);
  };

  const handleClick = (r, c) => {
    if (player1.getValue() === currentPlayer) {
      if (!player1.isComputer()) {
        gameBoard.mark(r, c, currentPlayer);
        UI.mark(r, c, currentPlayer);
        nextTurn();
        return;
      }
    }
    if (player2.getValue() === currentPlayer) {
      if (!player2.isComputer()) {
        gameBoard.mark(r, c, currentPlayer);
        UI.mark(r, c, currentPlayer);
        nextTurn();
        return;
      }
    }
  };

  return {
    getCurrentPlayer,
    getWinner,
    reset,
    nextTurn,
    handleClick,
  };
})();

const player = (value, computer = false) => {
  const getValue = () => value;
  const setIsComputer = (comp) => (computer = comp);
  const isComputer = () => computer;

  const computeMove = () => {
    // NOTE: placeholder logic until I write minimax
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (gameBoard.getTileValue(r, c) === 0) {
          gameBoard.mark(r, c, gameManager.getCurrentPlayer());
          UI.mark(r, c, gameManager.getCurrentPlayer());
          gameManager.nextTurn();
          return;
        }
      }
    }
  };

  return {
    getValue,
    setIsComputer,
    isComputer,
    computeMove,
  };
};

let player1 = player(-1);
let player2 = player(1);

document.addEventListener("DOMContentLoaded", () => {
  UI.showModal();
  UI.showCurrentPlayer(gameManager.getCurrentPlayer());
});

document.querySelector("#confirm-btn").addEventListener("click", () => {
  if (document.querySelector("#player-1-comp").classList.contains("selected")) {
    player1.setIsComputer(true);
  } else {
    player1.setIsComputer(false);
  }

  if (document.querySelector("#player-2-comp").classList.contains("selected")) {
    player2.setIsComputer(true);
  } else {
    player2.setIsComputer(false);
  }

  UI.hideModal();

  // kickstart logic if player1 is a computer
  if (player1.isComputer()) {
    player1.computeMove();
  }
});

document.querySelector("#player-1-human").addEventListener("click", (e) => {
  if (e.target.classList.contains("selected")) {
    return;
  } else {
    e.target.classList.add("selected");
    document.querySelector("#player-1-comp").classList.remove("selected");
  }
});

document.querySelector("#player-1-comp").addEventListener("click", (e) => {
  if (e.target.classList.contains("selected")) {
    return;
  } else {
    e.target.classList.add("selected");
    document.querySelector("#player-1-human").classList.remove("selected");
  }
});

document.querySelector("#player-2-human").addEventListener("click", (e) => {
  if (e.target.classList.contains("selected")) {
    return;
  } else {
    e.target.classList.add("selected");
    document.querySelector("#player-2-comp").classList.remove("selected");
  }
});

document.querySelector("#player-2-comp").addEventListener("click", (e) => {
  if (e.target.classList.contains("selected")) {
    return;
  } else {
    e.target.classList.add("selected");
    document.querySelector("#player-2-human").classList.remove("selected");
  }
});

document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    if (gameManager.getWinner() === 0) {
      let r = Number(tile.id[0]);
      let c = Number(tile.id[2]);
      if (tile.innerHTML === "") {
        gameManager.handleClick(r, c);
      }
    }
  });
});

document.querySelector("#reset-btn").addEventListener("click", () => {
  gameManager.reset();

  // kickstart logic if player1 is a computer
  if (player1.isComputer()) {
    player1.computeMove();
  }
});

document.querySelector("#new-game-btn").addEventListener("click", () => {
  gameManager.reset();
  UI.showModal();
});
