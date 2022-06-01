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

const gameManager = () => {
  /**
   * Determines player's turn:
   * {player 1: -1}
   * {player 2: 1}
   */
  const turn = -1;

  // const nextTurn = () => {
  //   // check for winner
  //   turn = -turn;
  // };

  // const resetGame = () => {};
};

// const player = () => {};
