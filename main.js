let balance = 0;
const ROWS = 3, COLS = 3;
const MAX_LINES = 3;
const symbolMap = {
  '💎': { count: 2, value: 5 },
  '🍀': { count: 4, value: 4 },
  '🍋': { count: 6, value: 3 },
  '🍒': { count: 8, value: 2 },
};

function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function startGame() {
  const deposit = document.getElementById('deposit').value;
  if (deposit && parseInt(deposit) > 0) {
    balance = parseInt(deposit);
    document.getElementById('controls').style.display = 'block';
    document.getElementById('balance').innerText = `Balance: ₹${balance}`;
    document.getElementById('warning').innerText = '';
  }
}

function getSlotMachineSpin() {
  const allSymbols = [];
  for (let sym in symbolMap) {
    for (let i = 0; i < symbolMap[sym].count; i++) allSymbols.push(sym);
  }
  const reels = [];
  for (let c = 0; c < COLS; c++) {
    const current = [...allSymbols];
    const column = [];
    for (let r = 0; r < ROWS; r++) {
      const rand = Math.floor(Math.random() * current.length);
      column.push(current.splice(rand, 1)[0]);
    }
    reels.push(column);
  }
  return reels;
}

function transpose(columns) {
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(columns[c][r]);
    }
    rows.push(row);
  }
  return rows;
}

function checkWinnings(reels, lines, bet) {
  let winnings = 0, winningLines = [];
  for (let l = 0; l < lines; l++) {
    const symbol = reels[0][l];
    let won = true;
    for (let c = 1; c < COLS; c++) {
      if (reels[c][l] !== symbol) {
        won = false;
        break;
      }
    }
    if (won) {
      winnings += symbolMap[symbol].value * bet;
      winningLines.push(l + 1);
    }
  }
  return [winnings, winningLines];
}

function displaySlots(reels) {
  const rows = transpose(reels);
  const display = document.getElementById('slot-display');
  display.innerHTML = '';
  rows.forEach(row => {
    row.forEach(symbol => {
      const div = document.createElement('div');
      div.className = 'slot';
      div.innerText = symbol;
      display.appendChild(div);
    });
  });
}

function spin() {
  const bet = parseInt(document.getElementById('bet').value);
  const lines = parseInt(document.getElementById('lines').value);
  const totalBet = bet * lines;

  if (!bet || bet < 1 || bet > 100) {
    alert('Invalid bet amount.');
    return;
  }
  if (totalBet > balance) {
    document.getElementById('warning').innerText = "⚠️ You can't spin with the amount. Please lower your bet or deposit more.";
    playSound('empty-sound');
    return;
  }

  playSound('spin-sound');
  balance -= totalBet;
  const reels = getSlotMachineSpin();
  displaySlots(reels);
  const [winnings, winningLines] = checkWinnings(reels, lines, bet);
  balance += winnings;

  document.getElementById('balance').innerText = `Balance: ₹${balance}`;
  document.getElementById('result').innerText = winnings > 0
    ? `🎉 You won ₹${winnings} on line(s): ${winningLines.join(', ')}`
    : `😢 No win this time.`;
  playSound(winnings > 0 ? 'win-sound' : 'lose-sound');

  if (balance <= 0) {
    playSound('empty-sound');
    document.getElementById('controls').style.display = 'none';
    document.getElementById('warning').innerText = `🚫 You can't spin, your account is empty! Please refresh and deposit again.`;
  }
}
