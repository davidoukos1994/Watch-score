const $ = (id) => document.getElementById(id);

let scoreA = 0, scoreB = 0;
let seconds = 0, running = false, timer = null;
let pendingTeam = null;
let logItems = [];

function saveState(){
  localStorage.setItem("watchScoreV2", JSON.stringify({
    scoreA, scoreB, seconds, running:false, logItems,
    teamA:$("teamAName").value, teamB:$("teamBName").value
  }));
}

function loadState(){
  const raw = localStorage.getItem("watchScoreV2");
  if(!raw) return;
  try{
    const s = JSON.parse(raw);
    scoreA=s.scoreA||0; scoreB=s.scoreB||0; seconds=s.seconds||0;
    logItems=s.logItems||[];
    $("teamAName").value=s.teamA||"Ομάδα Α";
    $("teamBName").value=s.teamB||"Ομάδα Β";
    $("teamAInput").value=$("teamAName").value;
    $("teamBInput").value=$("teamBName").value;
  }catch(e){}
}

function render(){
  $("scoreA").textContent = scoreA;
  $("scoreB").textContent = scoreB;
  const m = String(Math.floor(seconds/60)).padStart(2,"0");
  const s = String(seconds%60).padStart(2,"0");
  $("clock").textContent = `${m}:${s}`;
  $("timerBtn").textContent = running ? "⏸" : "▶";
  $("log").innerHTML = logItems.map(x => `<div class="entry">${x}</div>`).join("");
  saveState();
}

function tick(){
  seconds++;
  render();
}

function toggleTimer(){
  running = !running;
  if(running){
    timer = setInterval(tick, 1000);
  } else {
    clearInterval(timer);
  }
  render();
}

function minute(){
  return Math.max(1, Math.floor(seconds/60) + 1);
}

function addGoal(team){
  pendingTeam = team;
  const name = team === "A" ? $("teamAName").value : $("teamBName").value;
  $("modalTitle").textContent = `Σκόρερ: ${name}`;
  $("scorerInput").value = "";
  $("modal").classList.remove("hidden");
  setTimeout(()=>$("scorerInput").focus(),100);
}

function saveGoal(){
  const scorer = $("scorerInput").value.trim() || "Άγνωστος";
  const teamName = pendingTeam === "A" ? $("teamAName").value : $("teamBName").value;
  if(pendingTeam === "A") scoreA++; else scoreB++;
  logItems.unshift(`⚽ ${minute()}' ${teamName}: ${scorer} (${scoreA}-${scoreB})`);
  $("modal").classList.add("hidden");
  pendingTeam = null;
  render();
}

function addCard(team, type){
  const teamName = team === "A" ? $("teamAName").value : $("teamBName").value;
  const label = type === "yellow" ? "🟨 Κίτρινη" : "🟥 Κόκκινη";
  const player = prompt(`${label} - παίκτης ${teamName}:`) || "Άγνωστος";
  logItems.unshift(`${label} ${minute()}' ${teamName}: ${player}`);
  render();
}

function resetMatch(){
  if(!confirm("Νέος αγώνας; Θα μηδενιστούν όλα.")) return;
  scoreA=0; scoreB=0; seconds=0; logItems=[];
  running=false; clearInterval(timer);
  render();
}

$("startBtn").onclick = () => {
  $("teamAName").value = $("teamAInput").value || "Ομάδα Α";
  $("teamBName").value = $("teamBInput").value || "Ομάδα Β";
  $("setup").style.display = "none";
  render();
};

$("teamAName").onchange = render;
$("teamBName").onchange = render;
$("timerBtn").onclick = toggleTimer;
$("resetBtn").onclick = resetMatch;
$("goalA").onclick = () => addGoal("A");
$("goalB").onclick = () => addGoal("B");
$("saveScorer").onclick = saveGoal;
$("cancelScorer").onclick = () => $("modal").classList.add("hidden");
$("yellowA").onclick = () => addCard("A","yellow");
$("yellowB").onclick = () => addCard("B","yellow");
$("redA").onclick = () => addCard("A","red");
$("redB").onclick = () => addCard("B","red");

loadState();
render();
