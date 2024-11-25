const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const twoPlayerButton = document.getElementById('two-player');
const botModeButton = document.getElementById('bot-mode');
const gameContainer = document.getElementById('game');
const modeSelection = document.getElementById('mode-selection');

let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'twoPlayer';
const boardState = Array(9).fill(null);

function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = parseInt(cell.getAttribute('data-index'));

  if (boardState[cellIndex] || !gameActive) return;

  boardState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWin()) {
    statusDisplay.textContent = `${currentPlayer} nyert!`;
    gameActive = false;
    return;
  }

  if (boardState.every(cell => cell)) {
    statusDisplay.textContent = 'Döntetlen!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `${currentPlayer} következik`;

  if (gameMode === 'bot' && currentPlayer === 'O') {
    botMove();
  }
}

function botMove() {
  const emptyCells = boardState.map((cell, index) => (cell === null ? index : null)).filter(index => index !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  boardState[randomIndex] = 'O';
  const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
  cell.textContent = 'O';
  cell.classList.add('taken');

  if (checkWin()) {
    statusDisplay.textContent = `O nyert!`;
    gameActive = false;
    return;
  }

  if (boardState.every(cell => cell)) {
    statusDisplay.textContent = 'Döntetlen!';
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusDisplay.textContent = `${currentPlayer} következik`;
}

function checkWin() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winConditions.some(condition => 
    condition.every(index => boardState[index] === currentPlayer)
  );
}

function restartGame() {
  boardState.fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = `${currentPlayer} következik`;
}

function startGame(mode) {
  gameMode = mode;
  modeSelection.style.display = 'none';
  gameContainer.style.display = 'block';
  restartGame();
}

twoPlayerButton.addEventListener('click', () => startGame('twoPlayer'));
botModeButton.addEventListener('click', () => startGame('bot'));
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
