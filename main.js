(() => {
  const qs = s => document.querySelector(s);
  const qsa = s => document.querySelectorAll(s);

  const playerCountEl = qs('#playerCount');
  const startPointsEl = qs('#startPoints');
  const minBetEl = qs('#minBet');
  const newGameBtn = qs('#newGame');
  const startRoundBtn = qs('#startRound');
  const resetBtn = qs('#reset');
  const playersEl = qs('#players');
  const potEl = qs('#pot');

  let state = { players: [], pot: 0, minBet: 10, startPoints: 1000 };

  const STORAGE_KEY = 'bettingautomaker_state_v1';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.players)) {
        state = Object.assign(state, parsed);
        return true;
      }
    } catch (e) {
      console.warn('Failed to load state', e);
    }
    return false;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state', e);
    }
  }

  function render() {
    playersEl.innerHTML = '';
    state.players.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'player';
      row.innerHTML = `
        <input class="pname" data-id="${i}" value="${escapeHtml(p.name)}">
        <div class="ppoints">Points: <strong>${p.points}</strong></div>
        <label>Extra bet: <input type="number" min="0" value="0" data-id="${i}" class="bet-input"></label>
        <button data-id="${i}" class="add">Add</button>
        <button data-id="${i}" class="declare">Declare Winner</button>
      `;
      playersEl.appendChild(row);
    });
    potEl.textContent = state.pot;
    saveState();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  function newGame() {
    const count = parseInt(playerCountEl.value, 10) || 2;
    const start = Math.max(1, parseInt(startPointsEl.value, 10) || 1000);
    state = { players: [], pot: 0, minBet: Math.max(1, parseInt(minBetEl.value, 10) || 10), startPoints: start };
    for (let i = 0; i < count; i++) state.players.push({ id: i, name: `Player ${i + 1}`, points: start });
    render();
  }

  // if saved state exists, load it (keeps local edits)
  loadState();

  function startRound() {
    state.players.forEach(p => {
      if (p.points <= 0) return;
      const bet = Math.min(state.minBet, p.points);
      p.points -= bet;
      state.pot += bet;
    });
    render();
  }

  function addToPot(id) {
    const input = playersEl.querySelector(`.bet-input[data-id="${id}"]`);
    const amt = Math.max(0, Math.floor(Number(input.value) || 0));
    const p = state.players[id];
    if (!p) return;
    const give = Math.min(amt, p.points);
    p.points -= give;
    state.pot += give;
    input.value = 0;
    render();
  }

  function declareWinner(id) {
    const winner = state.players[id];
    if (!winner) return;
    winner.points += state.pot;
    state.pot = 0;
    render();
    // auto-bet next round
    setTimeout(() => startRound(), 250);
  }

  // Event delegation
  playersEl.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.classList.contains('add')) addToPot(id);
    if (btn.classList.contains('declare')) declareWinner(id);
  });

  // name editing and manual bet input handling
  playersEl.addEventListener('input', e => {
    const el = e.target;
    if (el.classList.contains('pname')) {
      const id = Number(el.dataset.id);
      if (state.players[id]) state.players[id].name = el.value || `Player ${id + 1}`;
      saveState();
    }
  });

  // wire up controls
  newGameBtn.addEventListener('click', newGame);
  startRoundBtn.addEventListener('click', () => {
    state.minBet = Math.max(1, parseInt(minBetEl.value, 10) || state.minBet);
    startRound();
  });
  resetBtn.addEventListener('click', () => {
    state = { players: [], pot: 0, minBet: 10, startPoints: 1000 };
    render();
  });

  // init
  newGame();
})();
