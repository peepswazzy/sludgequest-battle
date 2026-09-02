
import { DurableObject } from "cloudflare:workers";

const INDEX_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#071713">
<title>SludgeQuest</title>
<style>
:root{--bg:#071713;--card:#10241e;--card2:#0b1d17;--text:#f5f8f6;--muted:#a9bbb4;--accent:#39d39f;--red:#ff765e;--line:#29463c}
*{box-sizing:border-box}body{margin:0;background:linear-gradient(#071713,#0d201a);color:var(--text);font-family:system-ui,-apple-system,sans-serif}.app{max-width:760px;margin:auto;padding:22px 16px 42px}
.eyebrow{color:var(--accent);font-size:.73rem;letter-spacing:.16em;font-weight:800;margin:0 0 6px}h1{font-size:1.7rem;margin:0 0 18px;line-height:1.08}h2{line-height:1.25}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;margin:14px 0}.profile,.players,.scoreboard{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center}.players,.scoreboard{grid-template-columns:1fr 1fr}
.profile span,.players span,.scoreboard span{display:block;color:var(--muted);font-size:.75rem}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.grid button,.battle{background:var(--card);color:var(--text);border:1px solid var(--line);border-radius:18px;padding:16px;min-height:112px;text-align:left}
.grid button{display:flex;flex-direction:column;gap:7px}.grid small,.battle small{color:var(--muted)}.battle-kicker{margin-top:18px}.battle{width:100%;display:flex;gap:12px;align-items:center;font-size:1.15rem}.battle span{display:flex;flex-direction:column;gap:4px}
.badges{display:flex;gap:8px;flex-wrap:wrap}.badge{border:1px solid var(--line);padding:7px 10px;border-radius:999px;font-size:.78rem}.top,.actions{display:flex;justify-content:space-between;gap:10px;align-items:center}
.pill{font-size:.72rem;font-weight:800;border-radius:999px;padding:6px 9px;background:var(--accent);color:#052018}.pill.alt{background:var(--card2);border:1px solid var(--line);color:var(--text)}.topic{color:var(--accent);font-size:.8rem;font-weight:800}
.answers{display:grid;gap:10px}.answer{background:var(--card2);color:var(--text);border:1px solid var(--line);padding:14px;border-radius:14px;text-align:left;font-size:1rem;min-height:52px}.correct{outline:2px solid var(--accent)}.wrong{outline:2px solid var(--red)}
.status,footer{color:var(--muted);line-height:1.4}.primary,.secondary,.tabs button{min-height:44px;border-radius:12px;font-weight:800;padding:10px 13px}.primary{background:var(--accent);color:#052018;border:0}.primary:disabled{opacity:.4;cursor:not-allowed}.secondary,.tabs button{background:transparent;color:var(--text);border:1px solid var(--line)}
.tabs{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:16px 0}.tabs .active{outline:2px solid var(--accent)}label{display:block;color:var(--muted);font-size:.82rem;font-weight:700;margin:12px 0}input,select{width:100%;font-size:16px;padding:12px;margin-top:6px;border-radius:12px;border:1px solid var(--line);background:var(--card2);color:var(--text)}
.room{text-align:center;font-size:2.1rem;font-weight:900;background:var(--card2);border:1px dashed var(--accent);border-radius:16px;padding:18px}.alarm,.warning{padding:11px;border-radius:12px;margin:14px 0}.timer{height:9px;background:var(--card2);border:1px solid var(--line);border-radius:999px;overflow:hidden;margin:12px 0}.timer>div{height:100%;width:100%;background:var(--accent);transition:width .1s linear}.round-result{background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:12px;margin:12px 0}.round-result b{color:var(--accent)}.plant-card{background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:12px;margin:10px 0}.record{font-size:1.2rem;font-weight:900}.leader-row{display:grid;grid-template-columns:36px 1fr auto;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}.leader-row:last-child{border-bottom:0}.leader-rank{font-weight:900;color:var(--accent)}.leader-meta{color:var(--muted);font-size:.78rem}.mini{min-height:38px;padding:8px 11px;border-radius:10px}.weak{color:#ffd08a}.boss{border:1px solid #8d6d2d;background:#2c2412;color:#ffe3a0;padding:11px;border-radius:12px;margin:12px 0;font-weight:900}.alarm{background:#371b18;border:1px solid #82463e;color:#ffd7d0;font-weight:900}.warning{background:#2b2613;border:1px solid #806f32}.quest-grid{display:grid;gap:10px}.quest-card{background:var(--card2);border:1px solid var(--line);border-radius:16px;padding:14px;text-align:left;color:var(--text)}.quest-card.locked{opacity:.45}.quest-card b{display:block;font-size:1rem}.quest-card small{color:var(--muted)}.mastery{height:7px;background:#071713;border-radius:999px;overflow:hidden;margin-top:9px}.mastery>div{height:100%;background:var(--accent)}.quest-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.hidden{display:none!important}
footer{font-size:.72rem;margin-top:20px}@media(max-width:520px){.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<main class="app">
<header><p class="eyebrow">SLUDGEQUEST</p><h1>Run da plant. Learn da process. Beat da boss.</h1></header>

<section id="home">
<div class="profile card"><div><span>Game Rank</span><b id="rank">OIT</b></div><div><span>XP</span><b id="xp">0</b></div><div><span>Battle W-L</span><b id="battleRecord">0-0</b></div></div>
<div class="card"><div class="top"><div><p class="eyebrow">SEASON 1 — WHO STAY ON SHIFT?</p><b>Season Rating</b></div><b id="seasonRating" class="record">0</b></div><div class="leader-meta">Season W-L <b id="seasonRecord">0-0</b> • Boss Wins <b id="seasonBossWins">0</b> • Season XP <b id="seasonXp">0</b></div></div>
<div class="card"><div class="top"><div><p class="eyebrow">OPERATOR PROFILE</p><b id="profileLine">Operator • Plant</b></div><button id="editProfileBtn" class="secondary mini">Edit</button></div><div id="profileEdit" class="hidden"><label>Operator name<input id="profileName" placeholder="Operator"></label><label>Plant / Team<input id="profilePlant" placeholder="Plant / Team"></label><label>Certification level<select id="profileGrade"><option value="1">Grade 1</option><option value="2">Grade 2</option><option value="3">Grade 3</option><option value="4">Grade 4</option></select></label><button id="saveProfileBtn" class="primary">Save Profile</button></div></div>
<button id="leaderBtn" class="battle">🏆 <span><b>SludgeMatch Leaderboard</b><small>Operators + Plant Championship standings.</small></span></button>
<p class="eyebrow">SELF PLAY</p>
<div class="grid">
<button data-mode="adaptive">🔥 <b>Adaptive Training</b><small>Gets harder as you heat up.</small></button>
<button data-mode="exam">📝 <b>Exam Mode</b><small>Certification-aligned practice.</small></button>
<button id="questBtn">🗺️ <b>Quest Mode 3.0</b><small>Choose a process. Build mastery. Beat da boss.</small></button>
<button data-mode="alarm">🚨 <b>BRAH… ALARM!</b><small>Operating scenarios.</small></button>
<button data-mode="boss">👑 <b>DRC Boss Shift</b><small>Five mean best-FIRST-action emergencies.</small></button>
</div>
<p class="eyebrow battle-kicker">BATTLE</p>
<button id="liveBtn" class="battle">⚔️ <span><b>Live Operator Battle</b><small>Two phones. Same room. Same questions.</small></span></button>
<div class="card"><h2>Operator Report Card</h2><div id="stats"></div></div>
<div class="card"><h2>Achievement Locker</h2><div id="badges" class="badges"></div></div>
</section>

<section id="questHub" class="card hidden">
<div class="quest-head"><div><p class="eyebrow">QUEST MODE 3.1</p><h2>Choose Your Process</h2></div><button id="questHome" class="secondary">Home</button></div>
<p class="status">Each train gets harder: Know It → Read the Plant → Troubleshoot → Best FIRST Action → 👹 Process Boss.</p>
<div id="questList" class="quest-grid"></div>
<p id="questUnlock" class="status"></p>
</section>

<section id="solo" class="card hidden">
<div class="top"><span id="soloMode" class="pill"></span><span id="soloCount" class="pill alt"></span></div>
<div id="soloAlarm" class="alarm hidden">🚨 BRAH… ALARM!</div>
<p id="soloTopic" class="topic"></p><h2 id="soloQ"></h2><div id="soloA" class="answers"></div>
<p id="soloFeedback" class="status">Choose the best answer.</p>
<div class="actions"><button id="soloNext" class="primary" disabled>Next</button><button id="soloHome" class="secondary">Home</button></div>
</section>

<section id="lobby" class="card hidden">
<div class="top"><div><p class="eyebrow">LIVE BATTLE</p><h2>Operator vs. Operator</h2></div><button id="battleHome" class="secondary">Home</button></div>
<div class="tabs"><button id="createTab" class="active">Create Room</button><button id="joinTab">Join Room</button></div>
<div id="createPanel"><label>Operator name<input id="hostName" value="Operator 1"></label><label>Plant / Team<input id="hostPlant" value="Waianae WWTP"></label><label>Battle difficulty<select id="battleGrade"><option value="1">Grade 1</option><option value="2">Grade 2</option><option value="3">Grade 3</option><option value="4" selected>Grade 4</option></select></label><label>Questions<select id="battleCount"><option>6</option><option selected>10</option><option>14</option></select></label><button id="createBtn" class="primary">Create Battle Room</button></div>
<div id="joinPanel" class="hidden"><label>Operator name<input id="guestName" value="Operator 2"></label><label>Plant / Team<input id="guestPlant" value="Honouliuli WWTP"></label><label>Room code<input id="roomInput" placeholder="WW-123456"></label><button id="joinBtn" class="primary">Join Battle</button></div>
<p id="battleStatus" class="status">Battle rooms are coordinated by the SludgeQuest server.</p>
</section>

<section id="waiting" class="card hidden"><p class="eyebrow">ROOM READY</p><div id="roomCode" class="room">WW-000000</div><p id="waitingText" class="status"></p>
<div class="players"><div><span>Host</span><b id="hostDisplay"></b><span id="hostPlantDisplay"></span></div><div><span>Challenger</span><b id="guestDisplay">Waiting…</b><span id="guestPlantDisplay"></span></div></div>
<button id="startBtn" class="primary hidden">Start Battle</button></section>

<section id="battleGame" class="card hidden"><div class="top"><span id="round" class="pill"></span><span id="battleTopic" class="pill alt"></span></div>
<div class="scoreboard"><div><span id="p1"></span><b id="n1"></b><strong id="s1">0</strong></div><div><span id="p2"></span><b id="n2"></b><strong id="s2">0</strong></div></div><div id="bossBanner" class="boss hidden">👑 GRADE 4 BOSS ROUND — DOUBLE BASE POINTS</div>
<div id="battleAlarm" class="alarm hidden">🚨 BRAH… ALARM! 150 POINTS</div><div class="timer"><div id="timerBar"></div></div><p id="timerText" class="status">20 seconds</p><h2 id="battleQ"></h2><div id="battleA" class="answers"></div><div id="roundResult" class="round-result hidden"></div><p id="gameStatus" class="status"></p></section>

<section id="leaderboard" class="card hidden"><div class="top"><div><p class="eyebrow">SLUDGEMATCH V11.4 • QUEST 3.0</p><h2>Season 1 — WHO STAY ON SHIFT? 🏆</h2></div><button id="leaderHome" class="secondary">Home</button></div><div class="tabs"><button id="seasonOpTab" class="active">Season Operators</button><button id="seasonPlantTab">🏭 Season Plants</button><button id="opTab">Lifetime Operators</button><button id="plantTab">🏭 Lifetime Plants</button></div><p id="leaderStatus" class="status">Loading rankings…</p><div id="leaderList"></div></section>

<section id="results" class="card hidden"><p class="eyebrow">BATTLE COMPLETE</p><h2 id="winner"></h2><p id="finalScore" class="status"></p><div id="battleReport" class="plant-card"></div><button id="doneBtn" class="primary">Back Home</button></section>

<footer>Original educational practice only. Not official ABC/WPI exam content.</footer>
</main>

<script>
const bank=[
{t:"Safety",y:"exam",d:1,q:"Before entering a permit-required confined space, what is required?",a:["Atmospheric testing and approved entry procedures","Increase RAS flow","Enter quickly","Turn off all alarms"],c:0},
{t:"Clarifiers",y:"exam",d:1,q:"The main purpose of a secondary clarifier is to:",a:["Separate biological solids from treated wastewater","Remove influent grit","Add oxygen","Digest sludge"],c:0},
{t:"Activated Sludge",y:"exam",d:2,q:"Reducing wasting while other conditions remain similar will generally cause SRT to:",a:["Increase","Decrease","Become zero","Equal DO"],c:0},
{t:"Nitrification",y:"exam",d:2,q:"Nitrification generally requires:",a:["Adequate dissolved oxygen","Zero alkalinity","Anaerobic conditions","High chlorine residual"],c:0},
{t:"Equipment",y:"scenario",d:3,q:"Pump amperage is rising while measured flow is falling. What should the operator investigate?",a:["Possible blockage, restriction, or mechanical loading","Improved pump efficiency","Excess nitrification","High UV intensity"],c:0},
{t:"Clarifiers",y:"scenario",d:3,q:"Sludge settles normally but begins floating several hours later. What process should be considered?",a:["Denitrification producing nitrogen gas","UV disinfection","Screen blinding","Grit abrasion"],c:0},
{t:"Math",y:"exam",d:3,q:"Flow is 2.0 MGD and BOD is 180 mg/L. Approximate BOD load is:",a:["300 lb/day","1,501 lb/day","3,002 lb/day","30,020 lb/day"],c:2},
{t:"Activated Sludge",y:"exam",d:4,q:"The F:M ratio compares:",a:["Organic food loading with microorganism mass","RAS flow with chlorine residual","Pump head with flow","DO with alkalinity only"],c:0},
{t:"Clarifiers",y:"scenario",d:4,q:"Clarifier blanket is rising, RAS flow is below target, and effluent TSS is increasing. What is the best FIRST action?",a:["Verify actual RAS flow/pump condition and blanket depth before controlled adjustment","Immediately double WAS","Shut off aeration","Add disinfectant to aeration"],c:0},
{t:"Nitrification",y:"scenario",d:4,q:"Effluent ammonia rises while aeration DO is below normal. What should be investigated first?",a:["Potential oxygen limitation plus aeration/loading conditions","Grit removal efficiency","UV intensity","Screen spacing"],c:0},
{t:"Digestion",y:"scenario",d:5,q:"Volatile acids rise rapidly after an organic loading increase to an anaerobic digester. What is the main concern?",a:["Acid production may be exceeding methanogen capacity","Too much dissolved oxygen","Excess UV intensity","Too much grit removal"],c:0},
{t:"Safety",y:"scenario",d:5,q:"Heavy rain produces multiple alarms and an abnormal compliance-related process value. What should be prioritized first?",a:["Safety/compliance risk, verify actual conditions, then coordinate response","Reset every alarm","Change several processes at once","Assume the value is wrong"],c:0},
{t:"Pumps",y:"exam",d:2,q:"Cavitation in a centrifugal pump is commonly associated with:",a:["Insufficient suction head or restricted suction","Excessive chlorine residual","High sludge age","Low clarifier blanket"],c:0},
{t:"Process Control",y:"exam",d:3,q:"A rising SVI generally indicates sludge is:",a:["Settling more poorly","Settling faster","Becoming grit","Increasing chlorine demand only"],c:0},
{t:"Disinfection",y:"exam",d:2,q:"Increasing disinfectant demand can result from:",a:["Higher organic or solids loading","Lower influent flow only","Higher pump efficiency","More grit removal"],c:0},
{t:"Activated Sludge",y:"scenario",d:4,q:"Effluent TSS increases while the secondary clarifier blanket rises. What should be verified early in troubleshooting?",a:["RAS operation, blanket depth, loading, and settleability","Only influent pH","Only chlorine residual","Digester gas pressure"],c:0},
{t:"Nitrification",y:"exam",d:3,q:"Nitrification consumes which important wastewater treatment resource?",a:["Alkalinity","Grit","Chlorine residual","Polymer only"],c:0},
{t:"Math",y:"exam",d:3,q:"A tank holds 1.0 MG and flow is 2.0 MGD. Approximate hydraulic detention time is:",a:["6 hours","12 hours","24 hours","48 hours"],c:1},
{t:"Solids",y:"scenario",d:4,q:"A digester feed pump repeatedly plugs with rags. What is the best operational response?",a:["Safely isolate and investigate the blockage/source while protecting equipment","Increase speed until it clears","Disable overload protection","Ignore it if flow continues"],c:0},
{t:"Equipment",y:"scenario",d:4,q:"A standby pump fails to start during a wet-weather event. What should the operator do first?",a:["Verify safe conditions, power/control status, alarms, and available backup capacity","Keep resetting indefinitely","Shut down all treatment","Increase wasting"],c:0},
{t:"Clarifiers",y:"exam",d:3,q:"A high sludge blanket in a secondary clarifier can increase the risk of:",a:["Solids carryover in the effluent","Improved disinfection automatically","Lower influent BOD","More grit capture"],c:0},
{t:"Process Control",y:"scenario",d:5,q:"Several process indicators change at the same time after a major flow increase. What is the best approach?",a:["Verify data, identify the limiting process, and make controlled changes","Change every control at once","Ignore trends until the next shift","Only reset alarms"],c:0}
];

const questTrains=[
{key:"headworks",name:"Headworks Quest",icon:"🗑️",badge:"🗑️ Headworks Handler",questions:[
{t:"Equipment",d:1,q:"What is the primary purpose of screening at the headworks?",a:["Remove large debris before it reaches downstream equipment","Increase dissolved oxygen","Return activated sludge","Disinfect final effluent"],c:0},
{t:"Process Control",d:2,q:"Influent flow rises and the level difference across a mechanical screen increases. What does this most strongly suggest?",a:["The screen may be blinding or overloaded","The digester is underloaded","RAS is too concentrated","Disinfection demand is falling"],c:0},
{t:"Equipment",d:3,q:"A mechanical screen is running but upstream level continues to rise. What should be investigated?",a:["Screenings removal, screen condition, channel hydraulics, and actual equipment movement","Only secondary clarifier blanket","Only digester temperature","Increase WAS immediately"],c:0},
{t:"Process Control",d:4,q:"Grit carryover increases even though influent flow appears normal. What should the operator check FIRST?",a:["Hydraulic conditions and grit-removal equipment performance","Final effluent residual","RAS concentration only","Digester gas production"],c:0},
{t:"Safety",d:5,q:"👹 PROCESS BOSS: Wet weather drives influent channel level upward while one screen is unavailable. What is the best FIRST response?",a:["Verify available screening capacity, safe flow paths, bypass risk, and downstream loading","Shut down all influent pumping","Increase WAS to create capacity","Ignore the level until the storm passes"],c:0}]},
{key:"primary",name:"Primary Treatment Quest",icon:"🌀",badge:"🌀 Primary Pro",questions:[
{t:"Process Control",d:1,q:"The main purpose of a primary clarifier is to:",a:["Remove settleable and floatable solids before biological treatment","Nitrify ammonia","Disinfect wastewater","Return activated sludge"],c:0},
{t:"Process Control",d:2,q:"Primary sludge blanket rises while sludge withdrawal has not changed. What should the operator review?",a:["Withdrawal operation, solids loading, and blanket trend","Only aeration DO","Only chlorine residual","Digester gas pressure"],c:0},
{t:"Math",d:3,q:"Peak flow through a primary clarifier increases substantially. What happens to hydraulic detention time?",a:["It generally decreases","It always doubles","It becomes unrelated to flow","It becomes equal to SRT"],c:0},
{t:"Process Control",d:4,q:"Primary effluent TSS rises with a high sludge blanket. What should be checked FIRST?",a:["Sludge withdrawal, blanket depth, and hydraulic loading","RAS concentration only","Disinfectant residual","Aeration basin pH only"],c:0},
{t:"Process Control",d:5,q:"👹 PROCESS BOSS: One primary clarifier must be removed during high flow. What should be evaluated FIRST?",a:["Remaining clarifier capacity, hydraulic loading, sludge withdrawal, and downstream impact","Only digester temperature","Stop RAS","Increase disinfectant regardless of demand"],c:0}]},
{key:"activated",name:"Activated Sludge Deep Quest",icon:"🦠",badge:"🦠 Bug Farmer",deep:true,sessionSize:10,passPct:80,questions:[
{level:0,t:"Activated Sludge",d:1,q:"What is the primary role of microorganisms in the activated sludge process?",a:["Convert biodegradable pollutants into new cells, stable end products, and settleable biological solids","Remove grit by abrasion","Provide final disinfection","Increase primary sludge pumping"],c:0},
{level:0,t:"Activated Sludge",d:1,q:"RAS is returned from the secondary clarifier primarily to:",a:["Maintain enough active biological solids in the aeration process","Increase final effluent flow","Remove influent screenings","Lower chlorine demand directly"],c:0},
{level:0,t:"Activated Sludge",d:2,q:"WAS is adjusted primarily to control which operating parameter?",a:["Solids inventory and sludge age/SRT","Influent grit concentration","Disinfection contact time","Primary clarifier surface area"],c:0},
{level:0,t:"Activated Sludge",d:2,q:"If wasting is reduced for several days while loading stays similar, what will generally happen?",a:["SRT and biological solids inventory tend to increase","SRT immediately decreases","RAS becomes unnecessary","Influent BOD becomes zero"],c:0},
{level:0,t:"Process Control",d:2,q:"The F:M ratio compares:",a:["Organic food loading to the mass of microorganisms available to treat it","RAS flow to WAS flow only","DO to alkalinity","Clarifier depth to detention time"],c:0},
{level:0,t:"Nitrification",d:2,q:"Nitrifying organisms are especially sensitive to loss of adequate:",a:["SRT, oxygen, alkalinity/pH, and suitable temperature","Screenings storage","Primary scum pumping only","Final effluent chlorine residual"],c:0},

{level:1,t:"Activated Sludge",d:2,q:"MLSS is steady, but the 30-minute settleometer volume is increasing each day. What does this trend suggest?",a:["Settling characteristics are worsening even though solids concentration is similar","The sludge is automatically healthier","Influent grit has disappeared","SRT must be zero"],c:0},
{level:1,t:"Process Control",d:3,q:"A settleometer reads 300 mL/L at 30 minutes and MLSS is 3,000 mg/L. What is the approximate SVI?",a:["100 mL/g","10 mL/g","300 mL/g","1,000 mL/g"],c:0},
{level:1,t:"Activated Sludge",d:3,q:"The 5-minute settleability is rapid, the 30-minute volume is low, and the supernatant is clear. What does this most strongly indicate?",a:["Good settling and compaction under the test conditions","Severe bulking","Complete nitrification failure","A plugged influent screen"],c:0},
{level:1,t:"Nitrification",d:3,q:"Effluent ammonia rises while aeration DO remains near the normal operating range. Which additional data are most useful?",a:["SRT, temperature, pH/alkalinity, loading, and ammonia trend by process location","Only final effluent turbidity","Only primary sludge depth","Only disinfectant residual"],c:0},
{level:1,t:"Activated Sludge",d:3,q:"RAS concentration is falling while clarifier blanket depth is increasing. What should the operator suspect first?",a:["A clarifier/RAS solids-return problem or poor settling that requires verification","Too much grit removal","Excess digester gas production","Low disinfection demand"],c:0},
{level:1,t:"Process Control",d:3,q:"In a step-feed basin, MLSS decreases from the first pass toward the final pass. Before calling it abnormal, what should be considered?",a:["The configured feed split, RAS entry point, hydraulics, and expected solids distribution","Only chlorine residual","Only digester temperature","Screen bar spacing"],c:0},

{level:2,t:"Activated Sludge",d:3,q:"SVI rises from 90 to 170 mL/g over several days and the blanket begins climbing. What should be investigated?",a:["Settleability/filaments, SRT, loading, DO distribution, and clarifier conditions","Only influent grit","Only disinfection dose","Increase WAS to maximum immediately"],c:0},
{level:2,t:"Nitrification",d:4,q:"Effluent ammonia increased two days after a large increase in wasting. DO remains adequate. What is a likely process concern?",a:["SRT may have fallen enough to reduce nitrifier inventory","The primary clarifier is over-disinfecting","Grit removal is too efficient","RAS contains too much chlorine residual"],c:0},
{level:2,t:"Activated Sludge",d:4,q:"Aeration basin DO is high while ammonia removal is poor and MLSS has been declining. What should be evaluated?",a:["Biomass/SRT loss and loading rather than assuming more air will solve the problem","Increase air to maximum solely because ammonia is high","Stop all RAS","Reduce screening"],c:0},
{level:2,t:"Clarifiers",d:4,q:"Sludge settles normally for 30 minutes but rises after several hours with small gas bubbles attached. What process is likely?",a:["Denitrification producing nitrogen gas in the settled sludge","Immediate filamentous bulking","Grit flotation","Excess dissolved oxygen production"],c:0},
{level:2,t:"Activated Sludge",d:4,q:"Foam becomes persistent and the sludge age has been running much longer than normal. What should be part of the investigation?",a:["SRT, filamentous organisms, F:M/loading, wasting history, and aeration conditions","Only final disinfectant residual","Only grit classifier speed","Stop RAS without checking the clarifier"],c:0},
{level:2,t:"Process Control",d:4,q:"One aeration zone has low DO while the blower header pressure and total airflow look normal. What should be checked?",a:["Air distribution to that zone, valves/diffusers, fouling, and local oxygen demand","Only total plant flow","Only WAS concentration","Digester alkalinity"],c:0},

{level:3,t:"Process Control",d:4,q:"Effluent TSS is rising and the secondary blanket is climbing. What should the operator verify FIRST?",a:["Actual RAS flow, blanket depth, settleability, hydraulic/solids loading, and equipment condition","Immediately double WAS","Shut off aeration","Increase disinfectant dose"],c:0},
{level:3,t:"Nitrification",d:4,q:"Final-pass ammonia is increasing in a step-feed system. DO at one upstream probe reads normal. What is the best FIRST action?",a:["Verify the ammonia/DO data and check actual air distribution, feed split, alkalinity/pH, SRT, and loading","Assume the DO probe proves oxygen is adequate everywhere","Double WAS immediately","Increase RAS without checking clarifiers"],c:0},
{level:3,t:"Activated Sludge",d:4,q:"SVI is high, blanket depth is rising, and effluent remains within permit limits. What is the best FIRST operational approach?",a:["Verify the trend and likely cause, protect clarifier capacity, then make controlled process adjustments","Make several large changes at once","Wait for a permit violation","Stop all wasting indefinitely"],c:0},
{level:3,t:"Activated Sludge",d:5,q:"MLSS is above target, SRT is high, DO is difficult to maintain, and settleability is slowly worsening. What should be evaluated FIRST before increasing wasting?",a:["Confirm solids inventory/SRT calculations, loading, settleability, clarifier capacity, and current WAS performance","Increase WAS to maximum immediately","Turn off RAS","Increase disinfectant dose"],c:0},
{level:3,t:"Process Control",d:5,q:"A process change was made two hours ago and the operator wants to make another large change because the numbers have not recovered. What is the best FIRST decision?",a:["Consider process response time, verify trends and risk, and avoid stacking changes unless conditions require immediate action","Always make a second large change","Reset the trend display","Ignore all compliance indicators"],c:0},
{level:3,t:"Activated Sludge",d:5,q:"RAS flow indication says 40%, but the blanket continues rising and the return line sounds abnormal. What should be done FIRST?",a:["Verify actual RAS delivery and pump/valve condition rather than trusting the indicated setpoint alone","Increase the indicated setpoint without inspection","Stop aeration","Waste directly from the clarifier"],c:0},

{level:4,t:"Process Control",d:5,q:"👹 BUG FARMER BOSS: DO is 0.7 mg/L, SVI is 165 mL/g, effluent ammonia is rising, and the clarifier blanket is climbing. What is the best FIRST response?",a:["Verify critical measurements and aeration/RAS performance, assess loading and solids inventory, then stabilize the limiting condition with controlled adjustments","Immediately double WAS and RAS together","Increase disinfectant dose to correct the biology","Ignore the blanket and focus only on ammonia"],c:0},
{level:4,t:"Nitrification",d:5,q:"👹 BUG FARMER BOSS: A wet-weather flow increase is followed by lower basin DO, rising final ammonia, and shorter apparent contact time. What should the operator prioritize FIRST?",a:["Confirm hydraulic/loading conditions and available aeration capacity while protecting biomass/SRT and clarifier performance","Waste heavily to lower MLSS immediately","Shut off RAS","Treat the ammonia reading as an analyzer problem"],c:0},
{level:4,t:"Activated Sludge",d:5,q:"👹 BUG FARMER BOSS: Settling is poor, SVI is high, DO varies widely between zones, and operators recently changed both wasting and the step-feed split. What is the strongest supervisory approach?",a:["Verify current conditions and recent changes, identify the likely limiting mechanism, then make prioritized controlled adjustments and trend the response","Change the feed split, WAS, RAS, and air again at the same time","Return every control to maximum","Wait until effluent quality fails"],c:0},
{level:4,t:"Clarifiers",d:5,q:"👹 BUG FARMER BOSS: The blanket is near the upper operating limit, RAS concentration is low, effluent TSS is beginning to rise, and settleometer sludge compacts poorly. What is the best FIRST action?",a:["Protect solids capture by verifying RAS/clarifier hydraulics and actual return capacity while evaluating the poor-settling cause","Increase WAS aggressively before checking RAS","Stop influent flow","Increase disinfectant dose"],c:0},
{level:4,t:"Process Control",d:5,q:"👹 BUG FARMER BOSS: Morning data show ammonia rising, MLSS falling, WAS flow higher than expected, and DO higher than yesterday. What should be checked FIRST?",a:["Verify actual WAS rate and solids loss/SRT because biomass may be leaving the process","Increase blower output because ammonia is high","Increase wasting further","Reduce RAS without checking the blanket"],c:0},
{level:4,t:"Activated Sludge",d:5,q:"👹 BUG FARMER BOSS: A plant remains within permit but ammonia, SVI, and blanket depth are all trending worse. Which response best demonstrates Grade 4 process control?",a:["Act on verified trends before failure: prioritize risk, identify the limiting process, make controlled changes, document them, and monitor response","Wait for a permit exceedance before adjusting","Change every available setpoint at once","Use one grab sample to override all trend data"],c:0}
]},
{key:"clarifiers",name:"Secondary Clarifier Quest",icon:"🌊",badge:"🌊 Clarifier Killa",questions:[
{t:"Clarifiers",d:1,q:"The main purpose of a secondary clarifier is to:",a:["Separate biological solids from treated wastewater","Remove influent grit","Add oxygen","Digest sludge"],c:0},
{t:"Clarifiers",d:2,q:"A rising secondary clarifier blanket increases the risk of:",a:["Solids carryover in the effluent","Better disinfection automatically","Lower influent BOD","More grit capture"],c:0},
{t:"Clarifiers",d:3,q:"Sludge settles well initially but floats several hours later. What process should be considered?",a:["Denitrification producing nitrogen gas","UV disinfection","Screen blinding","Grit abrasion"],c:0},
{t:"Clarifiers",d:4,q:"Blanket depth rises while the RAS flow indication remains at target. What should be verified before increasing the setpoint?",a:["Actual RAS flow and pump/valve condition","Influent screen speed","Digester gas pressure","Disinfectant residual"],c:0},
{t:"Clarifiers",d:5,q:"👹 PROCESS BOSS: Effluent TSS rises, blanket depth increases, and RAS concentration is unusually low. What is the best FIRST response?",a:["Verify clarifier/RAS hydraulics, actual return flow, settleability, and solids inventory","Double WAS immediately","Stop aeration","Increase disinfection"],c:0}]},
{key:"disinfection",name:"Disinfection Quest",icon:"🧪",badge:"🧪 Disinfection Defender",questions:[
{t:"Disinfection",d:1,q:"The purpose of final disinfection is to:",a:["Reduce pathogenic organisms before discharge or reuse","Increase MLSS","Remove grit","Increase digester gas"],c:0},
{t:"Disinfection",d:2,q:"Disinfectant demand can increase when:",a:["Organic matter or suspended solids increase","Grit removal improves","Pump efficiency increases","Clarifier detention time alone increases"],c:0},
{t:"Disinfection",d:3,q:"Plant flow increases while chemical feed remains fixed. What should be evaluated?",a:["Whether dose and contact conditions remain adequate","Whether SRT automatically increased","Whether grit production stopped","Whether RAS can be shut off"],c:0},
{t:"Disinfection",d:4,q:"Effluent residual falls although the feed setting has not changed. What should be checked FIRST?",a:["Chemical delivery, actual flow, demand, and analyzer/sample validity","Digester mixing only","Screen spacing only","RAS blanket only"],c:0},
{t:"Disinfection",d:5,q:"👹 PROCESS BOSS: A compliance-related disinfection reading becomes abnormal during an upset. What is the best FIRST approach?",a:["Verify the reading and actual conditions while protecting compliance and checking feed/contact performance","Assume the analyzer is bad","Change wasting immediately","Shut off influent pumps"],c:0}]},
{key:"solids",name:"Solids & Digestion Quest",icon:"💩",badge:"💩 Digester Doctor",questions:[
{t:"Digestion",d:1,q:"Anaerobic digestion is used primarily to:",a:["Stabilize sludge and reduce volatile organic solids","Nitrify final effluent","Remove influent grit","Increase clarifier overflow rate"],c:0},
{t:"Digestion",d:2,q:"A rising volatile-acids trend with falling alkalinity suggests:",a:["Potential digester instability","Improved nitrification","Better screening","Lower organic loading automatically"],c:0},
{t:"Solids",d:3,q:"A sludge pump repeatedly plugs with rags. What is the proper operational response?",a:["Safely isolate and investigate the blockage and its source while protecting equipment","Increase speed until it clears","Disable overload protection","Ignore it if some flow remains"],c:0},
{t:"Digestion",d:4,q:"After a sudden organic loading increase, which digester trends deserve close attention?",a:["VA/alkalinity relationship, pH, gas production, and mixing","Disinfection intensity only","Screen differential only","Secondary clarifier blanket only"],c:0},
{t:"Digestion",d:5,q:"👹 PROCESS BOSS: Digester mixing capacity is reduced while feed remains unchanged. What is the strongest concern?",a:["Effective contact volume may decrease, creating localized loading and instability risk","Disinfection automatically improves","Grit removal doubles","RAS concentration must decrease"],c:0}]},
{key:"equipment",name:"Pumps & Equipment Quest",icon:"⚙️",badge:"⚙️ Pump Whisperer",questions:[
{t:"Pumps",d:1,q:"Cavitation in a centrifugal pump is commonly associated with:",a:["Insufficient suction head or a restricted suction condition","High chlorine residual","High sludge age","Low clarifier blanket"],c:0},
{t:"Equipment",d:2,q:"A motor is running but the driven equipment is not turning. What should be checked?",a:["The mechanical connection, coupling, belt, shear device, or gearbox","Only effluent pH","Only RAS concentration","Disinfection contact time"],c:0},
{t:"Equipment",d:3,q:"Pump amperage rises while measured flow falls. What should be investigated?",a:["Blockage, restriction, mechanical loading, or pump condition","Improved efficiency","Excess nitrification","High UV intensity"],c:0},
{t:"Equipment",d:4,q:"A standby pump fails to start during wet weather. What should the operator do FIRST?",a:["Verify safe conditions, power/control status, alarms, and available backup capacity","Keep resetting indefinitely","Shut down all treatment","Increase wasting"],c:0},
{t:"Equipment",d:5,q:"👹 PROCESS BOSS: A duty pump shows falling flow, rising amps, vibration, and abnormal noise. What is the best FIRST action?",a:["Protect personnel/equipment, verify operating condition and system restrictions, and transition to available backup if needed","Increase speed to maximum","Disable protective trips","Ignore it until flow reaches zero"],c:0}]},
{key:"lab",name:"Laboratory Quest",icon:"🧫",badge:"🧫 Lab Legend",questions:[
{t:"Process Control",d:1,q:"Why should process-control samples be collected consistently from representative locations?",a:["So trends reflect actual process conditions and can be compared meaningfully","To make every result identical","To eliminate calibration needs","To replace operational observations"],c:0},
{t:"Process Control",d:2,q:"SVI combines 30-minute settleability with which measurement?",a:["MLSS concentration","Chlorine residual","Influent flow only","Digester temperature"],c:0},
{t:"Math",d:3,q:"A 30-minute settled sludge volume is 230 mL/L and MLSS is 2,300 mg/L. Approximate SVI is:",a:["100 mL/g","10 mL/g","230 mL/g","1,000 mL/g"],c:0},
{t:"Process Control",d:4,q:"A process result suddenly differs greatly from the established trend. What should be done before making a major adjustment?",a:["Verify sampling, test method/instrument, and actual plant conditions","Assume the new result is correct","Change several controls at once","Delete the previous trend"],c:0},
{t:"Process Control",d:5,q:"👹 PROCESS BOSS: Lab ammonia rises, online data looks normal, and the plant appears stable. What is the best FIRST response?",a:["Verify the result and sampling while checking independent process indicators before a controlled response","Immediately double wasting","Ignore the lab result","Shut off aeration"],c:0}]},
{key:"control",name:"Process Control Quest",icon:"📈",badge:"📈 Process Controller",questions:[
{t:"Process Control",d:1,q:"Process trends are most useful because they help operators:",a:["See changes over time instead of relying on one isolated value","Eliminate field observations","Avoid sampling","Keep all setpoints fixed"],c:0},
{t:"Process Control",d:2,q:"A rising SVI generally indicates sludge is:",a:["Settling more poorly","Settling faster","Becoming grit","Increasing chlorine demand only"],c:0},
{t:"Process Control",d:3,q:"Several indicators change after a major hydraulic increase. What is the best general approach?",a:["Verify data and identify the limiting process before controlled adjustments","Change every setpoint at once","Ignore trends until next shift","Reset all alarms"],c:0},
{t:"Process Control",d:4,q:"Effluent ammonia rises, clarifier blanket climbs, and influent loading increased. What gives the best troubleshooting picture?",a:["Evaluate loading, SRT, aeration, settleability, RAS/blanket behavior, and trends together","Evaluate only DO","Evaluate only RAS","Increase chemical dose without verification"],c:0},
{t:"Process Control",d:5,q:"👹 PROCESS BOSS: Two process changes could both help, but making both together would hide which worked. What is the better approach?",a:["Make controlled prioritized changes and observe response when conditions allow","Make both maximum changes immediately","Ignore the upset","Reset SCADA trends"],c:0}]},
{key:"drc",name:"Grade 4 / DRC Quest",icon:"👑",badge:"👑 DRC Quest Cleared",locked:true,questions:[
{t:"Safety",d:5,q:"Wet weather causes high influent flow, one critical pump is unavailable, clarifier blankets are rising, and a compliance parameter approaches its limit. What is the best FIRST priority?",a:["Protect personnel and compliance, verify critical equipment/capacity, stabilize the limiting process, then coordinate controlled response","Increase WAS as much as possible","Reset alarms until they clear","Wait for lab confirmation before acting"],c:0},
{t:"Process Control",d:5,q:"Operators report conflicting instrument readings during a developing upset. What should the supervisor direct FIRST?",a:["Verify critical readings with independent or field checks while maintaining safe stable operation","Use whichever reading looks best","Change all controls to maximum","Use yesterday's settings"],c:0},
{t:"Safety",d:5,q:"A process upset has several possible causes and the plant remains within permit limits for now. What is the strongest supervisory response?",a:["Verify conditions, prioritize risk, preserve treatment capacity, make controlled changes, document actions, and monitor response","Make several aggressive changes at once","Silence alarms and continue normally","Focus only on the easiest equipment to inspect"],c:0},
{t:"Process Control",d:5,q:"A major flow increase coincides with low DO, rising ammonia, and increasing clarifier blankets. What is the best FIRST supervisory approach?",a:["Confirm critical data and capacity, identify the limiting process, protect solids inventory, and make prioritized controlled adjustments","Maximize every pump and blower","Stop all wasting indefinitely","Focus only on disinfection"],c:0},
{t:"Safety",d:5,q:"👹 DRC BOSS: Multiple alarms occur during a power-quality event and equipment status is uncertain. What should the DRC prioritize?",a:["Personnel safety, verification of actual equipment/process status, treatment/compliance risk, backup capacity, communication, and documented controlled response","Reset all alarms first","Assume SCADA is accurate","Change all process setpoints before field verification"],c:0}]}
];

const $=x=>document.getElementById(x), topics=[...new Set(bank.map(q=>q.t))];
let st=JSON.parse(localStorage.getItem("sludgequest")||"null")||{xp:0,streak:0,badges:[],stats:{}};st.battleWins=st.battleWins||0;st.battleLosses=st.battleLosses||0;st.battleTopics=st.battleTopics||{};st.seasonXp=st.seasonXp||0;st.seasonWins=st.seasonWins||0;st.seasonLosses=st.seasonLosses||0;st.seasonBossWins=st.seasonBossWins||0;st.seasonId=st.seasonId||"S1";st.operatorId=st.operatorId||("OP-"+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4));st.operatorName=st.operatorName||"Operator";st.operatorPlant=st.operatorPlant||"Unassigned Plant";st.operatorGrade=st.operatorGrade||4;st.questProgress=st.questProgress||{};topics.forEach(t=>{st.stats[t]||={c:0,n:0};st.battleTopics[t]||={c:0,n:0}});
const save=()=>localStorage.setItem("sludgequest",JSON.stringify(st)),shuffle=a=>[...a].sort(()=>Math.random()-.5);
function rank(){let r="OIT";[[0,"OIT"],[250,"Grade 1"],[500,"Grade 2"],[750,"Grade 3"],[1000,"Grade 4"],[1500,"DRC"]].forEach(x=>{if(st.xp>=x[0])r=x[1]});return r}
function seasonRating(){return (Number(st.seasonXp)||0)+(Number(st.seasonWins)||0)*300+(Number(st.seasonBossWins)||0)*500}function profile(){$("rank").textContent=rank();$("xp").textContent=st.xp;$("battleRecord").textContent=String(st.battleWins)+"-"+String(st.battleLosses);$("seasonRating").textContent=seasonRating().toLocaleString();$("seasonRecord").textContent=String(st.seasonWins)+"-"+String(st.seasonLosses);$("seasonBossWins").textContent=String(st.seasonBossWins);$("seasonXp").textContent=Number(st.seasonXp||0).toLocaleString();$("profileLine").textContent=st.operatorName+" • "+st.operatorPlant+" • Certification Level: Grade "+st.operatorGrade;$("stats").innerHTML=topics.map(t=>{let s=st.stats[t];return \`<p>\${t}: \${s.n?Math.round(s.c/s.n*100)+"%":"No data"}</p>\`}).join("");$("badges").innerHTML=st.badges.length?st.badges.map(x=>\`<span class="badge">\${x}</span>\`).join(""):"No achievements yet. 🤙"}
function show(id){["home","questHub","solo","lobby","waiting","battleGame","results","leaderboard"].forEach(x=>$(x).classList.toggle("hidden",x!==id))}
function badge(b){if(!st.badges.includes(b))st.badges.push(b)}
async function syncProfile(){try{await fetch("/api/profile",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:st.operatorId,name:st.operatorName,plant:st.operatorPlant,grade:st.operatorGrade,xp:st.xp,wins:st.battleWins,losses:st.battleLosses,rank:rank(),seasonId:st.seasonId,seasonXp:st.seasonXp,seasonWins:st.seasonWins,seasonLosses:st.seasonLosses,seasonBossWins:st.seasonBossWins})})}catch(e){}}
$("editProfileBtn").onclick=()=>{$("profileEdit").classList.toggle("hidden");$("profileName").value=st.operatorName;$("profilePlant").value=st.operatorPlant;$("profileGrade").value=String(st.operatorGrade)};
$("saveProfileBtn").onclick=async()=>{st.operatorName=$("profileName").value.trim().slice(0,24)||"Operator";st.operatorPlant=$("profilePlant").value.trim().slice(0,40)||"Unassigned Plant";st.operatorGrade=Math.max(1,Math.min(4,+$("profileGrade").value||4));save();profile();$("profileEdit").classList.add("hidden");await syncProfile()};
let leaderMode="season-operators";async function loadLeaderboard(mode){leaderMode=mode;$("leaderStatus").textContent="Loading live rankings…";$("leaderList").innerHTML="";try{let r=await fetch("/api/leaderboard?mode="+encodeURIComponent(mode),{cache:"no-store"});if(!r.ok)throw new Error("bad");let data=await r.json();let rows=data.rows||[];let season=mode.indexOf("season-")===0,plants=mode.indexOf("plants")>=0;$("leaderStatus").textContent=rows.length?(season?(plants?"🏭 Season 1 Plant Championship — every operator helps the plant.":"Season 1 operator standings — WHO STAY ON SHIFT?"):(plants?"🏭 Lifetime Plant Championship":"Lifetime SludgeMatch operator rankings")):"No rankings yet — finish a battle, Boss Shift, or save your profile.";$("leaderList").innerHTML=rows.map((x,i)=>{let crown=plants&&i===0?" 🏆":"";let extra=plants&&x.topOperator?"<div class='leader-meta'>Top Operator: "+escapeHtml(x.topOperator)+(season?" • Season XP: ":" • Team XP: ")+Number(x.xp||0).toLocaleString()+"</div>":"";return "<div class='leader-row'><div class='leader-rank'>#"+(i+1)+"</div><div><b>"+escapeHtml(x.name)+crown+"</b><div class='leader-meta'>"+escapeHtml(x.meta||"")+"</div>"+extra+"</div><b>"+Number(x.score||0).toLocaleString()+" <span class='leader-meta'>Rating</span></b></div>"}).join("")}catch(e){$("leaderStatus").textContent="Leaderboard unavailable right now. Your local progress is still safe."}}
function escapeHtml(v){return String(v||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function setLeaderTab(id,mode){["seasonOpTab","seasonPlantTab","opTab","plantTab"].forEach(x=>$(x).classList.toggle("active",x===id));loadLeaderboard(mode)}
$("leaderBtn").onclick=()=>{show("leaderboard");setLeaderTab("seasonOpTab","season-operators")};$("leaderHome").onclick=()=>show("home");$("seasonOpTab").onclick=()=>setLeaderTab("seasonOpTab","season-operators");$("seasonPlantTab").onclick=()=>setLeaderTab("seasonPlantTab","season-plants");$("opTab").onclick=()=>setLeaderTab("opTab","operators");$("plantTab").onclick=()=>setLeaderTab("plantTab","plants");
let mode,deck=[],i=0,current,answered=false,correct=0,soloTotal=10,activeQuest=null;
const questLevels=["Know It","Read the Plant","Troubleshoot","Best FIRST Action","👹 Process Boss"];
function questDoneCount(){return questTrains.filter(q=>q.key!=="drc"&&(st.questProgress[q.key]?.completed)).length}
function drcUnlocked(){return questDoneCount()>=6}
function questSessionSize(q){return q.deep?(q.sessionSize||10):q.questions.length}
function questPassScore(q){return Math.ceil(questSessionSize(q)*(q.passPct||80)/100)}
function renderQuestHub(){let done=questDoneCount();$("questUnlock").textContent=drcUnlocked()?"👑 Grade 4 / DRC Quest UNLOCKED — go run da boss shift.":"🔒 Complete 6 process trains to unlock Grade 4 / DRC Quest. Progress: "+done+"/6";$("questList").innerHTML="";questTrains.forEach(q=>{let locked=q.key==="drc"&&!drcUnlocked(),p=st.questProgress[q.key]||{},best=Number(p.best||0),total=questSessionSize(q),pct=Math.min(100,Math.round(best/total*100));let b=document.createElement("button");b.className="quest-card"+(locked?" locked":"");b.disabled=locked;b.innerHTML="<b>"+q.icon+" "+q.name+(p.completed?" ✅":"")+"</b><small>Mastery "+pct+"% • Best "+best+"/"+total+(q.deep?" • 30-question pool":"")+(locked?" • LOCKED":"")+"</small><div class='mastery'><div style='width:"+pct+"%'></div></div>";b.onclick=()=>startQuest(q.key);$("questList").appendChild(b)})}
$("questBtn").onclick=()=>{renderQuestHub();show("questHub")};$("questHome").onclick=()=>show("home");
document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>startSolo(b.dataset.mode));
function startQuest(key){activeQuest=questTrains.find(q=>q.key===key);if(!activeQuest)return;if(key==="drc"&&!drcUnlocked()){renderQuestHub();return}mode="quest";i=0;correct=0;if(activeQuest.deep){deck=[];for(let lv=0;lv<5;lv++){let pool=shuffle(activeQuest.questions.filter(q=>q.level===lv));pool.slice(0,2).forEach(q=>deck.push({...q,stage:activeQuest.name,stageIcon:activeQuest.icon,level:questLevels[lv]}))}}else{deck=activeQuest.questions.map((q,idx)=>({...q,stage:activeQuest.name,stageIcon:activeQuest.icon,level:questLevels[idx]}))}soloTotal=deck.length;show("solo");renderSolo()}
function startSolo(m){mode=m;activeQuest=null;i=0;correct=0;soloTotal=m==="boss"?5:10;let p=[...bank];if(m==="exam")p=p.filter(q=>q.y==="exam");if(m==="alarm")p=p.filter(q=>q.y==="scenario");if(m==="boss")p=p.filter(q=>q.y==="scenario"&&q.d>=4);while(p.length<soloTotal)p=[...p,...p];deck=shuffle(p).slice(0,soloTotal);show("solo");renderSolo()}
function renderSolo(){answered=false;$("soloNext").disabled=true;$("soloNext").textContent=(i===soloTotal-1?(mode==="boss"?"Finish Boss Shift":mode==="quest"?"Finish Process Quest":"Finish Session"):"Next");current=deck[i];let surprise=mode!=="exam"&&mode!=="alarm"&&mode!=="quest"&&mode!=="boss"&&Math.random()<.15;if(surprise)current=shuffle(bank.filter(q=>q.y==="scenario"))[0];$("soloAlarm").classList.toggle("hidden",!surprise);$("soloMode").textContent=mode==="quest"?(current.stageIcon+" "+current.stage):(surprise?"BRAH… ALARM!":mode.toUpperCase());$("soloCount").textContent=mode==="quest"?((i+1)+"/"+soloTotal+" • "+current.level):((i+1)+"/"+soloTotal);$("soloTopic").textContent=mode==="quest"?(current.t+" • Difficulty "+current.d):current.t;$("soloQ").textContent=current.q;$("soloFeedback").textContent=mode==="quest"?"Run da process — choose the BEST or FIRST operational answer.":"Choose the best answer.";$("soloA").innerHTML="";let order=current.a.map((_,x)=>x);if(mode==="quest"){let pattern=[2,0,3,1,1],target=pattern[i%pattern.length],ci=order.indexOf(current.c);[order[ci],order[target]]=[order[target],order[ci]]}order.forEach((orig,j)=>{let b=document.createElement("button");b.className="answer";b.textContent=String.fromCharCode(65+j)+". "+current.a[orig];b.dataset.orig=String(orig);b.onclick=()=>answerSolo(orig);$("soloA").appendChild(b)})}
function answerSolo(ch){if(answered)return;answered=true;let ok=ch===current.c;st.stats[current.t]??={c:0,n:0};let s=st.stats[current.t];s.n++;[...$("soloA").children].forEach((b,j)=>{b.disabled=true;let orig=b.dataset.orig!==undefined?Number(b.dataset.orig):j;if(orig===current.c)b.classList.add("correct");if(orig===ch&&!ok)b.classList.add("wrong")});if(ok){s.c++;correct++;st.streak++;let gain=50+current.d*10;if(mode==="boss")gain*=2;st.xp+=gain;st.seasonXp+=gain;$("soloFeedback").textContent="Correct. Nice work.";if(st.streak>=3)badge("🔥 Chee Hoo!")}else{st.streak=0;badge("💩 Das Not Good");$("soloFeedback").textContent="Das Not Good 💩 Correct answer: "+current.a[current.c]};save();profile();$("soloNext").disabled=false}
$("soloNext").onclick=()=>{if(!answered)return;if(i===soloTotal-1){if(mode==="quest"&&activeQuest){let p=st.questProgress[activeQuest.key]||{};p.best=Math.max(Number(p.best||0),correct);let pass=questPassScore(activeQuest);p.completed=p.completed||correct>=pass;p.runs=Number(p.runs||0)+1;st.questProgress[activeQuest.key]=p;if(correct>=pass)badge(activeQuest.badge);save();profile();$("soloQ").textContent=activeQuest.icon+" "+activeQuest.name+" complete — "+correct+"/"+soloTotal;$("soloA").innerHTML="";$("soloFeedback").textContent=correct>=pass?(activeQuest.key==="drc"?"👑 DRC QUEST CLEARED — You no guess. You knew ’em.":activeQuest.deep?"🦠 BUG FARMER CLEARED — 80%+ mastery. Badge earned.":"✅ Process Boss cleared. Mastery saved."):(activeQuest.deep?"Deep Quest complete. Score 8/10 or better to earn Bug Farmer.":"Quest complete. Score 4/5 or better to clear this Process Boss.");$("soloNext").disabled=true;$("soloNext").textContent="Quest Complete";syncProfile();return}$("soloQ").textContent="Session complete — "+correct+"/"+soloTotal;$("soloA").innerHTML="";if(mode==="boss"&&correct>=4){st.seasonBossWins++;badge("👑 DRC LIFE");$("soloFeedback").textContent="👑 DRC BOSS CLEARED — Boss Win +1. Everybody get your number.";save();profile()}else if(mode==="boss"){$("soloFeedback").textContent="Boss shift complete. Score 4/5 or better to earn a Boss Win."}else{$("soloFeedback").textContent="Progress saved on this device."}$("soloNext").disabled=true;$("soloNext").textContent=(mode==="boss"?"Boss Shift Complete":"Session Complete");syncProfile()}else{i++;renderSolo()}};
$("soloHome").onclick=()=>{if(mode==="quest"){renderQuestHub();show("questHub")}else show("home")};

let ws=null,room="",role="",host="",guest="",hostPlant="",guestPlant="",battleGrade=4,bc=10,br=0,bdeck=[],scores={host:0,guest:0},ans={host:false,guest:false},choices={host:null,guest:null},answerMs={host:null,guest:null},roundStarted=0,timerId=null,battlePerf={host:{},guest:{}};
$("liveBtn").onclick=()=>{$("hostName").value=st.operatorName;$("guestName").value=st.operatorName;$("hostPlant").value=st.operatorPlant;$("guestPlant").value=st.operatorPlant;$("battleGrade").value=String(st.operatorGrade);show("lobby");$("battleStatus").textContent="Plant vs. Plant ready — rooms are coordinated online."};$("battleHome").onclick=()=>{closeWs();show("home")};
$("createTab").onclick=()=>{$("createPanel").classList.remove("hidden");$("joinPanel").classList.add("hidden");$("createTab").classList.add("active");$("joinTab").classList.remove("active")};
$("joinTab").onclick=()=>{$("joinPanel").classList.remove("hidden");$("createPanel").classList.add("hidden");$("joinTab").classList.add("active");$("createTab").classList.remove("active")};
function closeWs(){clearInterval(timerId);try{if(ws)ws.close()}catch(e){}ws=null}
function randomRoom(){return "WW-"+String(Math.floor(100000+Math.random()*900000))}
function wsUrl(code,action,name,plant){const u=new URL(location.origin.replace(/^http/,"ws")+"/battle");u.searchParams.set("room",code);u.searchParams.set("action",action);u.searchParams.set("name",name);u.searchParams.set("plant",plant);return u.toString()}
function send(type,payload={}){if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type,payload}))}
function connectSocket(code,action,name,plant){return new Promise((resolve,reject)=>{closeWs();let opened=false;ws=new WebSocket(wsUrl(code,action,name,plant));ws.onopen=()=>{opened=true;resolve(true)};ws.onerror=()=>{if(!opened)reject(new Error("socket-error"))};ws.onclose=()=>{};ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}const p=m.payload||{};if(m.type==="room_state"){host=p.host||host;guest=p.guest||guest;hostPlant=p.hostPlant||hostPlant;guestPlant=p.guestPlant||guestPlant;battleGrade=p.grade||battleGrade;bc=p.count||bc;$("hostDisplay").textContent=host||"Host";$("guestDisplay").textContent=guest||"Waiting…";$("hostPlantDisplay").textContent=hostPlant;$("guestPlantDisplay").textContent=guestPlant;if(role==="host"&&guest)$("startBtn").classList.remove("hidden");if(role==="guest"&&guest)$("waitingText").textContent="Connected — Grade "+battleGrade+" battle. Waiting for host…"}if(m.type==="start"){host=p.host;guest=p.guest;hostPlant=p.hostPlant;guestPlant=p.guestPlant;battleGrade=p.grade;bdeck=p.deck;scores=p.scores;br=0;battlePerf={host:{},guest:{}};ans={host:false,guest:false};choices={host:null,guest:null};answerMs={host:null,guest:null};show("battleGame");renderBattle()}if(m.type==="answer"){choices[p.role]=p.choice;answerMs[p.role]=p.ms;ans[p.role]=true;if(role==="host"&&ans.host&&ans.guest)resolveRound()}if(m.type==="result"){scores=p.scores;reveal(p.correct,p.detail)}if(m.type==="next"){br=p.br;ans={host:false,guest:false};choices={host:null,guest:null};answerMs={host:null,guest:null};renderBattle()}if(m.type==="finish"){scores=p.scores;finishBattle()}if(m.type==="peer_left"){$("gameStatus").textContent=(p.name||"Other operator")+" disconnected. They can rejoin with the room code."}}})}
$("createBtn").onclick=async()=>{room=randomRoom();role="host";host=$("hostName").value.trim()||"Operator 1";hostPlant=$("hostPlant").value.trim()||"Plant 1";guest="";guestPlant="";battleGrade=+$("battleGrade").value||4;bc=+$("battleCount").value||10;$("battleStatus").textContent="Creating plant battle…";try{await connectSocket(room,"create",host,hostPlant);$("roomCode").textContent=room;$("hostDisplay").textContent=host;$("hostPlantDisplay").textContent=hostPlant;$("guestDisplay").textContent="Waiting…";$("waitingText").textContent="Grade "+battleGrade+" Plant vs. Plant — give this code to the challenger.";$("startBtn").classList.add("hidden");show("waiting");send("configure",{count:bc,grade:battleGrade,plant:hostPlant})}catch(e){$("battleStatus").textContent="Could not reach Battle server."}};
$("joinBtn").onclick=async()=>{room=$("roomInput").value.trim().toUpperCase();role="guest";guest=$("guestName").value.trim()||"Operator 2";guestPlant=$("guestPlant").value.trim()||"Plant 2";if(!/^WW-[0-9]{6}$/.test(room)){$("battleStatus").textContent="Room code should look like WW-123456.";return}$("battleStatus").textContent="Finding plant battle…";try{await connectSocket(room,"join",guest,guestPlant);$("roomCode").textContent=room;$("guestDisplay").textContent=guest;$("guestPlantDisplay").textContent=guestPlant;$("waitingText").textContent="Connected. Waiting for host to start…";show("waiting")}catch(e){$("battleStatus").textContent="Room not found or Battle server unavailable."}};
$("startBtn").onclick=()=>{if(role!=="host"||!ws||ws.readyState!==WebSocket.OPEN)return;let eligible=bank.filter(q=>q.d<=battleGrade+1);let p=[];while(p.length<bc)p.push(...shuffle(eligible));bdeck=p.slice(0,bc).map((q,idx)=>{let order=shuffle(q.a.map((_,i)=>i));return {...q,a:order.map(i=>q.a[i]),c:order.indexOf(q.c),alarm:Math.random()<.2,boss:(battleGrade===4&&idx===bc-1)}});scores={host:0,guest:0};send("start",{host,guest,hostPlant,guestPlant,grade:battleGrade,deck:bdeck,scores})};
function startTimer(){clearInterval(timerId);roundStarted=Date.now();let limit=20000;timerId=setInterval(()=>{let left=Math.max(0,limit-(Date.now()-roundStarted));$("timerText").textContent=(left/1000).toFixed(1)+" seconds";$("timerBar").style.width=(left/limit*100)+"%";if(left<=0){clearInterval(timerId);if(!ans[role])submit(-1)}},100)}
function renderBattle(){let q=bdeck[br];$("round").textContent="Round "+(br+1)+"/"+bdeck.length;$("battleTopic").textContent="Grade "+battleGrade+" • "+q.t;$("p1").textContent=hostPlant;$("p2").textContent=guestPlant;$("n1").textContent=host;$("n2").textContent=guest;$("s1").textContent=scores.host;$("s2").textContent=scores.guest;$("battleAlarm").classList.toggle("hidden",!q.alarm);$("bossBanner").classList.toggle("hidden",!q.boss);$("roundResult").classList.add("hidden");$("battleQ").textContent=q.q;$("battleA").innerHTML="";$("gameStatus").textContent="20 seconds — choose the best answer.";q.a.forEach((a,j)=>{let b=document.createElement("button");b.className="answer";b.textContent=String.fromCharCode(65+j)+". "+a;b.onclick=()=>submit(j);$("battleA").appendChild(b)});startTimer()}
function submit(choice){if(ans[role])return;ans[role]=true;choices[role]=choice;let ms=Math.min(20000,Date.now()-roundStarted);answerMs[role]=ms;clearInterval(timerId);[...$("battleA").children].forEach(b=>b.disabled=true);$("gameStatus").textContent=choice<0?"Time! Waiting for other operator…":"Answer locked. Waiting for other operator…";send("answer",{role,choice,ms})}
function resolveRound(){let q=bdeck[br],base=q.boss?300:(q.alarm?150:100),detail={};["host","guest"].forEach(r=>{let ok=choices[r]===q.c;let speed=ok?Math.max(0,Math.round((20000-(answerMs[r]||20000))/1000)*5):0;let earned=ok?base+speed:0;scores[r]+=earned;detail[r]={ok,earned,speed,ms:answerMs[r]};battlePerf[r][q.t]??={c:0,n:0};battlePerf[r][q.t].n++;if(ok)battlePerf[r][q.t].c++});send("result",{correct:q.c,scores,detail})}
function reveal(c,detail={}){clearInterval(timerId);[...$("battleA").children].forEach((b,j)=>{b.disabled=true;if(j===c)b.classList.add("correct");if(j===choices[role]&&j!==c&&choices[role]>=0)b.classList.add("wrong")});$("s1").textContent=scores.host;$("s2").textContent=scores.guest;let h=detail.host||{},g=detail.guest||{};$("roundResult").innerHTML="<b>"+(bdeck[br].boss?"👑 BOSS RESULT":"Round result")+"</b><br>"+hostPlant+": "+(h.ok?"✅":"❌")+" +"+(h.earned||0)+" • "+guestPlant+": "+(g.ok?"✅":"❌")+" +"+(g.earned||0);$("roundResult").classList.remove("hidden");$("gameStatus").textContent="Correct answer: "+bdeck[br].a[c];if(role==="host")setTimeout(()=>{if(br===bdeck.length-1)send("finish",{scores});else send("next",{br:br+1})},2700)}
function finishBattle(){clearInterval(timerId);show("results");let mine=role==="host"?scores.host:scores.guest,theirs=role==="host"?scores.guest:scores.host;if(mine>theirs){st.battleWins++;st.seasonWins++;}else if(mine<theirs){st.battleLosses++;st.seasonLosses++;}let perf=battlePerf[role]||{};Object.entries(perf).forEach(([t,v])=>{st.battleTopics[t]??={c:0,n:0};st.battleTopics[t].c+=v.c;st.battleTopics[t].n+=v.n});save();profile();syncProfile();const w=scores.host===scores.guest?"Tie game 😂":(scores.host>scores.guest?hostPlant:guestPlant)+" wins da shift! 👑";$("winner").textContent=w;$("finalScore").textContent=hostPlant+" ("+host+"): "+scores.host+" — "+guestPlant+" ("+guest+"): "+scores.guest;let weak=Object.entries(perf).filter(([t,v])=>v.n).sort((a,b)=>(a[1].c/a[1].n)-(b[1].c/b[1].n)).slice(0,2);$("battleReport").innerHTML="<b>Post-Battle Report</b><p>Difficulty: Grade "+battleGrade+"</p><p class='weak'>Study next: "+(weak.length?weak.map(x=>x[0]).join(" + "):"Keep running rounds to build topic data.")+"</p>"}
$("doneBtn").onclick=()=>{closeWs();show("home")};profile();syncProfile();
</script>
</body></html>`;

export class BattleRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.hostName = null;
    this.guestName = null;
    this.count = 10;
    this.sockets = new Map();

    for (const ws of this.ctx.getWebSockets()) {
      const meta = ws.deserializeAttachment() || {};
      if (meta.role) this.sockets.set(meta.role, ws);
      if (meta.role === "host") this.hostName = meta.name || "Operator 1";
      if (meta.role === "guest") this.guestName = meta.name || "Operator 2";
    }
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") !== "websocket") {
      if (url.pathname === "/internal/profile" && request.method === "POST") {
        let p; try { p = await request.json(); } catch { return new Response("Bad JSON", {status:400}); }
        const id=String(p.id||"").slice(0,64); if(!id) return new Response("Missing id",{status:400});
        const row={id,name:String(p.name||"Operator").slice(0,24),plant:String(p.plant||"Unassigned Plant").slice(0,40),grade:Math.max(1,Math.min(4,Number(p.grade)||4)),xp:Math.max(0,Number(p.xp)||0),wins:Math.max(0,Number(p.wins)||0),losses:Math.max(0,Number(p.losses)||0),rank:String(p.rank||"OIT").slice(0,20),seasonId:String(p.seasonId||"S1").slice(0,12),seasonXp:Math.max(0,Number(p.seasonXp)||0),seasonWins:Math.max(0,Number(p.seasonWins)||0),seasonLosses:Math.max(0,Number(p.seasonLosses)||0),seasonBossWins:Math.max(0,Number(p.seasonBossWins)||0),updated:Date.now()};
        await this.ctx.storage.put("profile:"+id,row); return Response.json({ok:true});
      }
      if (url.pathname === "/internal/leaderboard") {
        const rawMode=url.searchParams.get("mode")||"operators";
        const season=rawMode.startsWith("season-");
        const mode=rawMode.endsWith("plants")?"plants":"operators";
        const list=await this.ctx.storage.list({prefix:"profile:"}); const profiles=[...list.values()];
        const eligible=profiles.filter(p=>{const n=String(p.name||"").trim(),pl=String(p.plant||"").trim();const valid=n&&pl&&n.toLowerCase()!=="operator"&&pl.toLowerCase()!=="unassigned plant";if(!valid)return false;if(season)return (Number(p.seasonXp)||0)>0||(Number(p.seasonWins)||0)>0||(Number(p.seasonBossWins)||0)>0;return (Number(p.xp)||0)>0||(Number(p.wins)||0)>0});
        const scoreFor=p=>season?((Number(p.seasonXp)||0)+(Number(p.seasonWins)||0)*300+(Number(p.seasonBossWins)||0)*500):((Number(p.xp)||0)+(Number(p.wins)||0)*250);
        if(mode==="operators"){const rows=eligible.map(p=>({name:p.name,meta:p.plant+" • Grade "+p.grade+" • "+(season?"Season "+(p.seasonWins||0)+"-"+(p.seasonLosses||0)+" • Boss "+(p.seasonBossWins||0):p.wins+"-"+p.losses),score:scoreFor(p)})).sort((a,b)=>b.score-a.score).slice(0,25);return Response.json({rows})}
        const plants={}; for(const p of eligible){let k=p.plant;plants[k]??={name:k,xp:0,wins:0,losses:0,bossWins:0,operators:0,topOperator:"",topScore:-1};let opScore=scoreFor(p);plants[k].xp+=season?(Number(p.seasonXp)||0):(Number(p.xp)||0);plants[k].wins+=season?(Number(p.seasonWins)||0):(Number(p.wins)||0);plants[k].losses+=season?(Number(p.seasonLosses)||0):(Number(p.losses)||0);plants[k].bossWins+=Number(p.seasonBossWins)||0;plants[k].operators++;if(opScore>plants[k].topScore){plants[k].topScore=opScore;plants[k].topOperator=p.name}}
        const rows=Object.values(plants).map(p=>({name:p.name,meta:p.operators+" operator"+(p.operators===1?"":"s")+" • "+(season?"Season W-L ":"Battle W-L ")+p.wins+"-"+p.losses+(season?" • Boss "+p.bossWins:""),xp:p.xp,wins:p.wins,losses:p.losses,operators:p.operators,topOperator:p.topOperator,score:season?(p.xp+p.wins*300+p.bossWins*500):(p.xp+p.wins*250)})).sort((a,b)=>b.score-a.score).slice(0,25);return Response.json({rows})
      }
      return new Response("SludgeQuest Battle Room", { status: 200 });
    }

    const action = url.searchParams.get("action");
    const name = (url.searchParams.get("name") || "").slice(0, 24) || "Operator";
    const plant = (url.searchParams.get("plant") || "").slice(0, 40) || "Plant";
    if (!["create", "join"].includes(action)) {
      return new Response("Bad action", { status: 400 });
    }

    // Use persisted flags to distinguish "never created" from hibernated room.
    const exists = (await this.ctx.storage.get("exists")) === true;

    if (action === "join" && !exists) {
      return new Response("Room not found", { status: 404 });
    }

    const role = action === "create" ? "host" : "guest";
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ role, name, plant });
    this.sockets.set(role, server);

    if (role === "host") {
      this.hostName = name;
      await this.ctx.storage.put({ exists: true, hostName: name, hostPlant: plant });
    } else {
      this.guestName = name;
      await this.ctx.storage.put({ guestName: name, guestPlant: plant });
    }

    this.broadcast("room_state", {
      host: this.hostName || (await this.ctx.storage.get("hostName")) || "Host",
      guest: this.guestName || (await this.ctx.storage.get("guestName")) || "",
      hostPlant: (await this.ctx.storage.get("hostPlant")) || "",
      guestPlant: (await this.ctx.storage.get("guestPlant")) || "",
      grade: (await this.ctx.storage.get("grade")) || 4,
      count: (await this.ctx.storage.get("count")) || this.count
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    let data;
    try { data = JSON.parse(message); } catch { return; }
    const meta = ws.deserializeAttachment() || {};
    const type = data.type;
    const payload = data.payload || {};

    if (type === "configure" && meta.role === "host") {
      this.count = Math.max(1, Math.min(50, Number(payload.count) || 10));
      await this.ctx.storage.put({ count: this.count, grade: Math.max(1, Math.min(4, Number(payload.grade) || 4)), hostPlant: String(payload.plant || await this.ctx.storage.get("hostPlant") || "").slice(0,40) });
      this.broadcast("room_state", {
        host: this.hostName || await this.ctx.storage.get("hostName") || "Host",
        guest: this.guestName || await this.ctx.storage.get("guestName") || "",
        hostPlant: await this.ctx.storage.get("hostPlant") || "",
        guestPlant: await this.ctx.storage.get("guestPlant") || "",
        grade: await this.ctx.storage.get("grade") || 4,
        count: this.count
      });
      return;
    }

    // Host starts and resolves rounds; server is authoritative for room membership/relay.
    if (["start","answer","result","next","finish"].includes(type)) {
      this.broadcast(type, payload);
    }
  }

  async webSocketClose(ws) {
    const meta = ws.deserializeAttachment() || {};
    if (meta.role) this.sockets.delete(meta.role);
    this.broadcast("peer_left", { role: meta.role, name: meta.name });
  }

  async webSocketError(ws) {
    const meta = ws.deserializeAttachment() || {};
    if (meta.role) this.sockets.delete(meta.role);
  }

  broadcast(type, payload) {
    const message = JSON.stringify({ type, payload });
    for (const ws of this.ctx.getWebSockets()) {
      try { ws.send(message); } catch {}
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(INDEX_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    }

    if (url.pathname === "/api/profile" || url.pathname === "/api/leaderboard") {
      const id = env.BATTLE_ROOM.idFromName("__SLUDGEMATCH_GLOBAL_V9__"); const stub = env.BATTLE_ROOM.get(id);
      const target = new URL(request.url); target.pathname = url.pathname === "/api/profile" ? "/internal/profile" : "/internal/leaderboard";
      return stub.fetch(new Request(target.toString(), request));
    }

    if (url.pathname !== "/battle") return new Response("Not found", { status: 404 });

    const room = (url.searchParams.get("room") || "").toUpperCase();
    if (!/^WW-\d{6}$/.test(room)) return new Response("Bad room code", { status: 400 });

    const id = env.BATTLE_ROOM.idFromName(room);
    const stub = env.BATTLE_ROOM.get(id);
    return stub.fetch(request);
  }
};
