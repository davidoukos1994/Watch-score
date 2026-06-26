const $ = (id) => document.getElementById(id);

let state = {
  teamA: 'Ομάδα Α',
  teamB: 'Ομάδα Β',
  scoreA: 0,
  scoreB: 0,
  goals: []
};

function save() {
  localStorage.setItem('watchScoreState', JSON.stringify(state));
}

function load() {
  const saved = localStorage.getItem('watchScoreState');
  if (saved) {
    try { state = JSON.parse(saved); } catch (_) {}
  }
}

function render() {
  $('teamAName').textContent = state.teamA;
  $('teamBName').textContent = state.teamB;
  $('scoreA').textContent = state.scoreA;
  $('scoreB').textContent = state.scoreB;
  $('log').innerHTML = '';

  state.goals.forEach((g) => {
    const li = document.createElement('li');
    li.textContent = `${g.team}: ${g.scorer || 'Χωρίς όνομα'} (${g.score})`;
    $('log').appendChild(li);
  });

  save();
}

function startGame() {
  state = {
    teamA: $('teamAInput').value.trim() || 'Ομάδα Α',
    teamB: $('teamBInput').value.trim() || 'Ομάδα Β',
    scoreA: 0,
    scoreB: 0,
    goals: []
  };
  $('setup').classList.add('hidden');
  $('game').classList.remove('hidden');
  render();
}

function addGoal(side) {
  if (side === 'A') {
    state.scoreA++;
    state.goals.push({ team: state.teamA, scorer: $('scorerA').value.trim(), score: `${state.scoreA}-${state.scoreB}` });
    $('scorerA').value = '';
  } else {
    state.scoreB++;
    state.goals.push({ team: state.teamB, scorer: $('scorerB').value.trim(), score: `${state.scoreA}-${state.scoreB}` });
    $('scorerB').value = '';
  }
  render();
}

function undo() {
  const last = state.goals.pop();
  if (!last) return;
  if (last.team === state.teamA && state.scoreA > 0) state.scoreA--;
  if (last.team === state.teamB && state.scoreB > 0) state.scoreB--;
  render();
}

function resetAll() {
  localStorage.removeItem('watchScoreState');
  state = { teamA: 'Ομάδα Α', teamB: 'Ομάδα Β', scoreA: 0, scoreB: 0, goals: [] };
  $('teamAInput').value = '';
  $('teamBInput').value = '';
  $('game').classList.add('hidden');
  $('setup').classList.remove('hidden');
}

$('startBtn').addEventListener('click', startGame);
$('goalA').addEventListener('click', () => addGoal('A'));
$('goalB').addEventListener('click', () => addGoal('B'));
$('undoBtn').addEventListener('click', undo);
$('resetBtn').addEventListener('click', resetAll);

load();
if (state.goals.length || state.scoreA || state.scoreB) {
  $('setup').classList.add('hidden');
  $('game').classList.remove('hidden');
  render();
}
