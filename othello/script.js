document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const blackScoreDisplay = document.getElementById("black-score");
  const whiteScoreDisplay = document.getElementById("white-score");
  const currentTurnDisplay = document.getElementById("current-turn");
  const restartBtn = document.getElementById("restart-btn");

  let othelloBoard = [];
  let currentPlayer = "black";
  let gameOver = false;

  function newGame() {
    othelloBoard = Array(8)
      .fill()
      .map(() => Array(8).fill(null));
    othelloBoard[3][3] = "white";
    othelloBoard[3][4] = "black";
    othelloBoard[4][3] = "black";
    othelloBoard[4][4] = "white";

    currentPlayer = "black";
    gameOver = false;

    renderBoard();
    updateScores();
    updateTurnDisplay();
  }

  function renderBoard() {
    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (othelloBoard[row][col]) {
          const disc = document.createElement("div");
          disc.classList.add("disc-placed", `disc-${othelloBoard[row][col]}`);
          cell.appendChild(disc);
        } else if (isValidMove(row, col, currentPlayer)) {
          cell.classList.add("valid-move");
        }

        cell.addEventListener("click", () => handleClick(row, col));
        board.appendChild(cell);
      }
    }
  }

  function handleClick(row, col) {
    if (
      gameOver ||
      othelloBoard[row][col] !== null ||
      !isValidMove(row, col, currentPlayer)
    ) {
      console.log("no more moves. restart!");
      return;
    }

    othelloBoard[row][col] = currentPlayer;

    changePlayer(row, col, currentPlayer);

    if (currentPlayer === "black") {
      currentPlayer = "white";
    } else {
      currentPlayer = "black";
    }

    if (!canMove(currentPlayer)) {
      if (currentPlayer === "black") {
        currentPlayer = "white";
      } else {
        currentPlayer = "black";
      }
      if (!canMove(currentPlayer)) {
        console.log("game over!");
        endGame();
      }
    }

    renderBoard();
    updateScores();
    updateTurnDisplay();
  }

  function isValidMove(row, col, player) {
    if (othelloBoard[row][col] !== null) return false;

    const opponent = player === "black" ? "white" : "black";
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      let foundOpponent = false;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (othelloBoard[r][c] === opponent) {
          foundOpponent = true;
        } else if (othelloBoard[r][c] === player && foundOpponent) {
          return true;
        } else {
          break;
        }

        r += dr;
        c += dc;
      }
    }

    return false;
  }

  function changePlayer(row, col, player) {
    const opponent = player === "black" ? "white" : "black";
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      let toFlip = [];

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (othelloBoard[r][c] === opponent) {
          toFlip.push([r, c]);
        } else if (othelloBoard[r][c] === player) {
          for (const [fr, fc] of toFlip) {
            othelloBoard[fr][fc] = player;
          }
          break;
        } else {
          break;
        }

        r += dr;
        c += dc;
      }
    }
  }

  function canMove(player) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (othelloBoard[row][col] === null && isValidMove(row, col, player)) {
          return true;
        }
      }
    }
    return false;
  }

  function updateScores() {
    let blackCount = 0;
    let whiteCount = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (othelloBoard[row][col] === "black") {
          blackCount++;
        } else if (othelloBoard[row][col] === "white") {
          whiteCount++;
        }
      }
    }

    blackScoreDisplay.textContent = blackCount;
    whiteScoreDisplay.textContent = whiteCount;
  }

  function updateTurnDisplay() {
    currentTurnDisplay.textContent =
      currentPlayer === "black" ? "Black" : "White";
    currentTurnDisplay.style.color =
      currentPlayer === "black" ? "black" : "#555";
  }

  function endGame() {
    gameOver = true;

    let blackCount = 0;
    let whiteCount = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (othelloBoard[row][col] === "black") {
          blackCount++;
        } else if (othelloBoard[row][col] === "white") {
          whiteCount++;
        }
      }
    }

    let winner;
    if (blackCount > whiteCount) {
      winner = "black wins!";
    } else if (whiteCount > blackCount) {
      winner = "white wins!";
    } else {
      winner = "tie!";
    }

    currentTurnDisplay.textContent = `Game Over - ${winner}`;
  }

  restartBtn.addEventListener("click", newGame);
  newGame();
});
