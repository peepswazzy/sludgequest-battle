
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
.status,footer{color:var(--muted);line-height:1.4}.primary,.secondary,.tabs button{min-height:44px;border-radius:12px;font-weight:800;padding:10px 13px}.primary{background:var(--accent);color:#052018;border:0}.secondary,.tabs button{background:transparent;color:var(--text);border:1px solid var(--line)}
.tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0}.tabs .active{outline:2px solid var(--accent)}label{display:block;color:var(--muted);font-size:.82rem;font-weight:700;margin:12px 0}input,select{width:100%;font-size:16px;padding:12px;margin-top:6px;border-radius:12px;border:1px solid var(--line);background:var(--card2);color:var(--text)}
.room{text-align:center;font-size:2.1rem;font-weight:900;background:var(--card2);border:1px dashed var(--accent);border-radius:16px;padding:18px}.alarm,.warning{padding:11px;border-radius:12px;margin:14px 0}.alarm{background:#371b18;border:1px solid #82463e;color:#ffd7d0;font-weight:900}.warning{background:#2b2613;border:1px solid #806f32}.hidden{display:none!important}
footer{font-size:.72rem;margin-top:20px}@media(max-width:520px){.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<main class="app">
<header><p class="eyebrow">SLUDGEQUEST</p><h1>Run da plant. Learn da process. Beat da boss.</h1></header>

<section id="home">
<div class="profile card"><div><span>Rank</span><b id="rank">OIT</b></div><div><span>XP</span><b id="xp">0</b></div><div><span>Streak</span><b id="streak">0 🔥</b></div></div>
<p class="eyebrow">SELF PLAY</p>
<div class="grid">
<button data-mode="adaptive">🔥 <b>Adaptive Training</b><small>Gets harder as you heat up.</small></button>
<button data-mode="exam">📝 <b>Exam Mode</b><small>Certification-aligned practice.</small></button>
<button data-mode="quest">🗺️ <b>Quest Mode</b><small>Work your way through the plant.</small></button>
<button data-mode="alarm">🚨 <b>BRAH… ALARM!</b><small>Operating scenarios.</small></button>
</div>
<p class="eyebrow battle-kicker">BATTLE</p>
<button id="liveBtn" class="battle">⚔️ <span><b>Live Operator Battle</b><small>Two phones. Same room. Same questions.</small></span></button>
<div class="card"><h2>Operator Report Card</h2><div id="stats"></div></div>
<div class="card"><h2>Achievement Locker</h2><div id="badges" class="badges"></div></div>
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
<div id="createPanel"><label>Operator name<input id="hostName" value="Operator 1"></label><label>Questions<select id="battleCount"><option>6</option><option selected>10</option><option>14</option></select></label><button id="createBtn" class="primary">Create Battle Room</button></div>
<div id="joinPanel" class="hidden"><label>Operator name<input id="guestName" value="Operator 2"></label><label>Room code<input id="roomInput" placeholder="WW-123456"></label><button id="joinBtn" class="primary">Join Battle</button></div>
<p id="battleStatus" class="status">Battle rooms are coordinated by the SludgeQuest server.</p>
</section>

<section id="waiting" class="card hidden"><p class="eyebrow">ROOM READY</p><div id="roomCode" class="room">WW-000000</div><p id="waitingText" class="status"></p>
<div class="players"><div><span>Host</span><b id="hostDisplay"></b></div><div><span>Challenger</span><b id="guestDisplay">Waiting…</b></div></div>
<button id="startBtn" class="primary hidden">Start Battle</button></section>

<section id="battleGame" class="card hidden"><div class="top"><span id="round" class="pill"></span><span id="battleTopic" class="pill alt"></span></div>
<div class="scoreboard"><div><span id="n1"></span><b id="s1">0</b></div><div><span id="n2"></span><b id="s2">0</b></div></div>
<div id="battleAlarm" class="alarm hidden">🚨 BRAH… ALARM! 150 POINTS</div><h2 id="battleQ"></h2><div id="battleA" class="answers"></div><p id="gameStatus" class="status"></p></section>

<section id="results" class="card hidden"><p class="eyebrow">BATTLE COMPLETE</p><h2 id="winner"></h2><p id="finalScore" class="status"></p><button id="doneBtn" class="primary">Back Home</button></section>

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
{t:"Safety",y:"scenario",d:5,q:"Heavy rain produces multiple alarms and an abnormal compliance-related process value. What should be prioritized first?",a:["Safety/compliance risk, verify actual conditions, then coordinate response","Reset every alarm","Change several processes at once","Assume the value is wrong"],c:0}
];
const $=x=>document.getElementById(x), topics=[...new Set(bank.map(q=>q.t))];
let st=JSON.parse(localStorage.getItem("sludgequest")||"null")||{xp:0,streak:0,badges:[],stats:{}};topics.forEach(t=>st.stats[t]||={c:0,n:0});
const save=()=>localStorage.setItem("sludgequest",JSON.stringify(st)),shuffle=a=>[...a].sort(()=>Math.random()-.5);
function rank(){let r="OIT";[[0,"OIT"],[250,"Grade 1"],[500,"Grade 2"],[750,"Grade 3"],[1000,"Grade 4"],[1500,"DRC"]].forEach(x=>{if(st.xp>=x[0])r=x[1]});return r}
function profile(){$("rank").textContent=rank();$("xp").textContent=st.xp;$("streak").textContent=st.streak+" 🔥";$("stats").innerHTML=topics.map(t=>{let s=st.stats[t];return \`<p>\${t}: \${s.n?Math.round(s.c/s.n*100)+"%":"No data"}</p>\`}).join("");$("badges").innerHTML=st.badges.length?st.badges.map(x=>\`<span class="badge">\${x}</span>\`).join(""):"No achievements yet. 🤙"}
function show(id){["home","solo","lobby","waiting","battleGame","results"].forEach(x=>$(x).classList.toggle("hidden",x!==id))}
function badge(b){if(!st.badges.includes(b))st.badges.push(b)}
let mode,deck=[],i=0,current,answered=false,correct=0;
document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>startSolo(b.dataset.mode));
function startSolo(m){mode=m;i=0;correct=0;let p=[...bank];if(m==="exam")p=p.filter(q=>q.y==="exam");if(m==="alarm")p=p.filter(q=>q.y==="scenario");while(p.length<10)p=[...p,...p];deck=shuffle(p).slice(0,10);show("solo");renderSolo()}
function renderSolo(){answered=false;$("soloNext").disabled=true;current=deck[i];let surprise=mode!=="exam"&&mode!=="alarm"&&Math.random()<.15;if(surprise)current=shuffle(bank.filter(q=>q.y==="scenario"))[0];$("soloAlarm").classList.toggle("hidden",!surprise);$("soloMode").textContent=surprise?"BRAH… ALARM!":mode.toUpperCase();$("soloCount").textContent=\`\${i+1}/10\`;$("soloTopic").textContent=current.t;$("soloQ").textContent=current.q;$("soloFeedback").textContent="Choose the best answer.";$("soloA").innerHTML="";current.a.forEach((a,j)=>{let b=document.createElement("button");b.className="answer";b.textContent=\`\${String.fromCharCode(65+j)}. \${a}\`;b.onclick=()=>answerSolo(j);$("soloA").appendChild(b)})}
function answerSolo(ch){if(answered)return;answered=true;let ok=ch===current.c,s=st.stats[current.t];s.n++;[...$("soloA").children].forEach((b,j)=>{b.disabled=true;if(j===current.c)b.classList.add("correct");if(j===ch&&!ok)b.classList.add("wrong")});if(ok){s.c++;correct++;st.streak++;st.xp+=50+current.d*10;$("soloFeedback").textContent="Correct. Nice work.";if(st.streak>=3)badge("🔥 Chee Hoo!")}else{st.streak=0;badge("💩 Das Not Good");$("soloFeedback").textContent=\`Das Not Good 💩 Correct answer: \${current.a[current.c]}\`};save();profile();$("soloNext").disabled=false}
$("soloNext").onclick=()=>{if(i===9){$("soloQ").textContent=\`Session complete — \${correct}/10\`;$("soloA").innerHTML="";$("soloFeedback").textContent="Progress saved on this device.";$("soloNext").disabled=true}else{i++;renderSolo()}};
$("soloHome").onclick=()=>show("home");

let ws=null,room="",role="",host="",guest="",bc=10,br=0,bdeck=[],scores={host:0,guest:0},ans={host:false,guest:false},choices={host:null,guest:null};
$("liveBtn").onclick=()=>{show("lobby");$("battleStatus").textContent="Server Battle ready — rooms are coordinated online."};$("battleHome").onclick=()=>{closeWs();show("home")};
$("createTab").onclick=()=>{$("createPanel").classList.remove("hidden");$("joinPanel").classList.add("hidden");$("createTab").classList.add("active");$("joinTab").classList.remove("active")};
$("joinTab").onclick=()=>{$("joinPanel").classList.remove("hidden");$("createPanel").classList.add("hidden");$("joinTab").classList.add("active");$("createTab").classList.remove("active")};
function closeWs(){try{if(ws)ws.close()}catch(e){}ws=null}
function randomRoom(){return "WW-"+String(Math.floor(100000+Math.random()*900000))}
function wsUrl(code,action,name){const u=new URL(location.origin.replace(/^http/,"ws")+"/battle");u.searchParams.set("room",code);u.searchParams.set("action",action);u.searchParams.set("name",name);return u.toString()}
function send(type,payload={}){if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type,payload}))}
function connectSocket(code,action,name){return new Promise((resolve,reject)=>{closeWs();let opened=false;ws=new WebSocket(wsUrl(code,action,name));ws.onopen=()=>{opened=true;resolve(true)};ws.onerror=()=>{if(!opened)reject(new Error("socket-error"))};ws.onclose=()=>{};ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}const p=m.payload||{};if(m.type==="room_state"){host=p.host||host;guest=p.guest||guest;bc=p.count||bc;$("hostDisplay").textContent=host||"Host";$("guestDisplay").textContent=guest||"Waiting…";if(role==="host"&&guest)$("startBtn").classList.remove("hidden");if(role==="guest"&&guest)$("waitingText").textContent="Connected. Waiting for host to start…"}if(m.type==="room_error"){$("waitingText").textContent=p.message||"Could not join room."}if(m.type==="start"){host=p.host;guest=p.guest;bdeck=p.deck;scores=p.scores;br=0;ans={host:false,guest:false};choices={host:null,guest:null};show("battleGame");renderBattle()}if(m.type==="answer"){choices[p.role]=p.choice;ans[p.role]=true;if(role==="host"&&ans.host&&ans.guest)resolveRound()}if(m.type==="result"){scores=p.scores;reveal(p.correct)}if(m.type==="next"){br=p.br;ans={host:false,guest:false};choices={host:null,guest:null};renderBattle()}if(m.type==="finish"){scores=p.scores;finishBattle()}if(m.type==="peer_left"){$("gameStatus").textContent=(p.name||"Other operator")+" disconnected."}}})}
$("createBtn").onclick=async()=>{room=randomRoom();role="host";host=$("hostName").value.trim()||"Operator 1";guest="";bc=+$("battleCount").value||10;$("battleStatus").textContent="Creating server room…";try{await connectSocket(room,"create",host);$("roomCode").textContent=room;$("hostDisplay").textContent=host;$("guestDisplay").textContent="Waiting…";$("waitingText").textContent="Give this room code to the other operator.";$("startBtn").classList.add("hidden");show("waiting");send("configure",{count:bc})}catch(e){$("battleStatus").textContent="Could not reach Battle server."}};
$("joinBtn").onclick=async()=>{room=$("roomInput").value.trim().toUpperCase();role="guest";guest=$("guestName").value.trim()||"Operator 2";if(!/^WW-\d{6}$/.test(room)){$("battleStatus").textContent="Room code should look like WW-123456.";return}$("battleStatus").textContent="Finding server room…";try{await connectSocket(room,"join",guest);$("roomCode").textContent=room;$("hostDisplay").textContent="Host";$("guestDisplay").textContent=guest;$("waitingText").textContent="Connected. Waiting for host to start…";show("waiting")}catch(e){$("battleStatus").textContent="Room not found or Battle server unavailable."}};
$("startBtn").onclick=()=>{if(role!=="host"||!ws||ws.readyState!==WebSocket.OPEN)return;let p=[];while(p.length<bc)p.push(...shuffle(bank));bdeck=p.slice(0,bc).map(q=>({...q,alarm:Math.random()<.2}));scores={host:0,guest:0};ans={host:false,guest:false};choices={host:null,guest:null};send("start",{host,guest,deck:bdeck,scores})};
function renderBattle(){let q=bdeck[br];$("round").textContent=\`Round \${br+1}/\${bdeck.length}\`;$("battleTopic").textContent=q.t;$("n1").textContent=host;$("n2").textContent=guest;$("s1").textContent=scores.host;$("s2").textContent=scores.guest;$("battleAlarm").classList.toggle("hidden",!q.alarm);$("battleQ").textContent=q.q;$("battleA").innerHTML="";$("gameStatus").textContent="Choose the best answer.";q.a.forEach((a,j)=>{let b=document.createElement("button");b.className="answer";b.textContent=\`\${String.fromCharCode(65+j)}. \${a}\`;b.onclick=()=>submit(j);$("battleA").appendChild(b)})}
function submit(choice){if(ans[role])return;ans[role]=true;choices[role]=choice;[...$("battleA").children].forEach(b=>b.disabled=true);$("gameStatus").textContent="Answer locked. Waiting for other operator…";send("answer",{role,choice})}
function resolveRound(){let q=bdeck[br],pts=q.alarm?150:100;if(choices.host===q.c)scores.host+=pts;if(choices.guest===q.c)scores.guest+=pts;send("result",{correct:q.c,scores})}
function reveal(c){[...$("battleA").children].forEach((b,j)=>{b.disabled=true;if(j===c)b.classList.add("correct");if(j===choices[role]&&j!==c)b.classList.add("wrong")});$("s1").textContent=scores.host;$("s2").textContent=scores.guest;$("gameStatus").textContent=\`Correct answer: \${bdeck[br].a[c]}\`;if(role==="host")setTimeout(()=>{if(br===bdeck.length-1)send("finish",{scores});else send("next",{br:br+1})},1800)}
function finishBattle(){show("results");const w=scores.host===scores.guest?"Tie game 😂":(scores.host>scores.guest?host:guest)+" wins da shift! 👑";$("winner").textContent=w;$("finalScore").textContent=\`\${host}: \${scores.host} — \${guest}: \${scores.guest}\`}
$("doneBtn").onclick=()=>{closeWs();show("home")};profile();
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
      return new Response("SludgeQuest Battle Room", { status: 200 });
    }

    const action = url.searchParams.get("action");
    const name = (url.searchParams.get("name") || "").slice(0, 24) || "Operator";
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
    server.serializeAttachment({ role, name });
    this.sockets.set(role, server);

    if (role === "host") {
      this.hostName = name;
      await this.ctx.storage.put({ exists: true, hostName: name });
    } else {
      this.guestName = name;
      await this.ctx.storage.put("guestName", name);
    }

    this.broadcast("room_state", {
      host: this.hostName || (await this.ctx.storage.get("hostName")) || "Host",
      guest: this.guestName || (await this.ctx.storage.get("guestName")) || "",
      count: this.count
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
      await this.ctx.storage.put("count", this.count);
      this.broadcast("room_state", {
        host: this.hostName || await this.ctx.storage.get("hostName") || "Host",
        guest: this.guestName || await this.ctx.storage.get("guestName") || "",
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

    if (url.pathname !== "/battle") return new Response("Not found", { status: 404 });

    const room = (url.searchParams.get("room") || "").toUpperCase();
    if (!/^WW-\d{6}$/.test(room)) return new Response("Bad room code", { status: 400 });

    const id = env.BATTLE_ROOM.idFromName(room);
    const stub = env.BATTLE_ROOM.get(id);
    return stub.fetch(request);
  }
};
