import { INTENTS, getState, save, hostOf, matchesAny, sessionActive, fmtMin, send, sitesFor, focusedToday, streak } from "./common.js";
import { CHEERS, COMEBACK, CELEBRATE, pick as any, fill } from "./motivation.js";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const mode = params.get("mode");
const targetUrl = params.get("url");
let st;

function show(id) {
  for (const s of ["ask", "running", "blocked", "checkin"]) $(s).classList.toggle("hidden", s !== id);
}

function esc(s) { const d = document.createElement("div"); d.textContent = s ?? ""; return d.innerHTML; }

async function init() {
  st = await getState();
  const s = st.session;
  const now = Date.now();

  if (st.pauseState?.until > now) $("footer").textContent = `Blocking is paused until ${new Date(st.pauseState.until).toLocaleTimeString()}.`;
  else if (st.breakState?.endsAt > now) $("footer").textContent = `On a break until ${new Date(st.breakState.endsAt).toLocaleTimeString()}.`;

  if (s && !s.archived && (s.ended || s.endsAt <= now)) return renderCheckin();
  if (["blocked", "aicap", "search", "youtube"].includes(mode)) {
    if (sessionActive(s)) return renderBlocked();
  }
  if (sessionActive(s)) return renderRunning();
  renderAsk();
}

// ---------- ask ----------

let chosen = "jrf";
let sites = [];

function renderAsk() {
  show("ask");
  if (targetUrl && mode === "nosession") {
    $("was-going").textContent = `You were heading to ${hostOf(targetUrl) || targetUrl}. Start a session first — if it fits, it'll open.`;
    $("was-going").classList.remove("hidden");
  }
  const box = $("intents");
  box.innerHTML = "";
  for (const [key, it] of Object.entries(INTENTS)) {
    const b = document.createElement("button");
    b.className = "intent";
    b.innerHTML = `<b>${it.emoji} ${esc(it.label)}</b><span class="muted small">${it.minutes} min</span>`;
    b.onclick = () => pick(key);
    b.dataset.key = key;
    box.appendChild(b);
  }
  pick(chosen);
  $("add-site-btn").onclick = addSiteChip;
  $("reset-sites").onclick = async () => {
    delete st.settings.intentSites[chosen];
    await save({ settings: st.settings });
    pick(chosen);
  };
  $("add-site").onkeydown = (e) => { if (e.key === "Enter") addSiteChip(); };
  $("start").onclick = start;
  $("goal").onkeydown = (e) => { if (e.key === "Enter") start(); };
  $("break-btn-ask").onclick = takeBreak;
  $("goal").focus();
}

function pick(key) {
  chosen = key;
  for (const b of $("intents").children) b.setAttribute("aria-pressed", String(b.dataset.key === key));
  $("minutes").value = INTENTS[key].minutes;
  sites = [...sitesFor(st.settings, key)];
  $("reset-sites").classList.toggle("hidden", !st.settings.intentSites?.[key]);
  if (targetUrl && key !== "opportunity") {
    const h = hostOf(targetUrl);
    if (h && key === "custom") sites.push(h);
  }
  const hints = {
    jrf: "e.g. Unit 6 Delhi Sultanate: 1 topic + 30 MCQs",
    assignment: "e.g. Write 500 words of the Mughal economy essay",
    submit: "e.g. Upload the HIST-201 essay on Classroom",
    form: "e.g. Fill the UGC-NET December application",
    opportunity: "e.g. Find 3 fellowships for MA History with deadlines",
    custom: "Say exactly what you'll do"
  };
  $("goal").placeholder = hints[key];
  $("ask-sub").textContent = key === "opportunity"
    ? "Opportunity hunt is boxed: 20 minutes, once a day, and you'll save what you find with its deadline."
    : "Pick one thing. Only the sites for that thing will open.";
  renderSiteChips();
}

function renderSiteChips() {
  const box = $("sites");
  box.innerHTML = "";
  for (const s of sites) {
    const c = document.createElement("span");
    c.className = "chip";
    c.innerHTML = `${esc(s)} <button title="remove">✕</button>`;
    c.querySelector("button").onclick = () => { sites = sites.filter((x) => x !== s); renderSiteChips(); };
    box.appendChild(c);
  }
}

function addSiteChip() {
  const v = $("add-site").value.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (v && !sites.includes(v)) sites.push(v);
  $("add-site").value = "";
  renderSiteChips();
}

async function start() {
  const goal = $("goal").value.trim();
  const err = $("start-err");
  if (goal.length < 6) {
    err.textContent = "Write what you'll actually do — a vague goal makes it easy to drift.";
    err.classList.remove("hidden");
    $("goal").focus();
    return;
  }
  const r = await send({ type: "startSession", intent: chosen, goal, minutes: $("minutes").value, sites, firstStep: $("first-step").value.trim() });
  if (r?.error) { err.textContent = r.error; err.classList.remove("hidden"); return; }
  if (targetUrl && matchesAny(targetUrl, r.session.sites)) location.href = targetUrl;
  else { st = await getState(); renderRunning(); }
}

async function takeBreak() {
  const r = await send({ type: "startBreak" });
  if (r?.error) return alert(r.error);
  $("footer").textContent = `Break until ${new Date(r.breakState.endsAt).toLocaleTimeString()} (${r.breakState.used}/${st.settings.breaksPerDay} today). Everything opens; at the end the gate comes back.`;
  if (targetUrl) location.href = targetUrl;
}

// ---------- running ----------

let timer;
function renderRunning() {
  show("running");
  const s = st.session;
  const it = INTENTS[s.intent] || INTENTS.custom;
  $("run-intent").textContent = `${it.emoji} ${it.label}`;
  $("run-goal").textContent = s.goal;
  const tickTime = () => {
    const left = Math.max(0, s.endsAt - Date.now());
    $("run-left").textContent = `${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")} left`;
    if (left <= 0) { clearInterval(timer); function toast(text) {
  $("toast").textContent = text;
  $("toast").classList.remove("hidden");
  setTimeout(() => $("toast").classList.add("hidden"), 6000);
}

async function openPanel() {
  const win = await chrome.windows.getCurrent();
  chrome.sidePanel.open({ windowId: win.id });
}

function drawSteps() {
  const ul = $("run-steps");
  const items = st.steps.items;
  ul.innerHTML = items.length ? "" : `<li class="muted small">No steps yet. Break the task into tiny pieces in the side panel.</li>`;
  items.forEach((it, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label class="step ${it.done ? "done" : ""}" style="font-weight:400;margin:0"><input type="checkbox" ${it.done ? "checked" : ""}> ${esc(it.text)}</label>`;
    li.querySelector("input").onchange = async (e) => {
      const fresh = await getState();
      fresh.steps.items[i].done = e.target.checked;
      await save({ steps: fresh.steps });
      st = fresh;
      drawSteps();
      if (e.target.checked) toast(any(CELEBRATE));
    };
    ul.appendChild(li);
  });
}

chrome.storage.onChanged.addListener((c) => {
  if (c.steps && !$("running").classList.contains("hidden")) getState().then((f) => { st = f; drawSteps(); });
});

init(); }
  };
  tickTime();
  clearInterval(timer);
  timer = setInterval(tickTime, 1000);

  $("run-cheer").textContent = fill(any(CHEERS), {
    goal: s.goal, focused: fmtMin(focusedToday(st.usage)), left: fmtMin(Math.max(0, s.endsAt - Date.now()) / 1000)
  });
  $("open-panel").onclick = openPanel;
  drawSteps();

  const links = $("run-links");
  links.innerHTML = "";
  for (const site of [...s.sites, ...(s.extra || [])]) {
    const a = document.createElement("a");
    a.className = "chip";
    a.href = "https://" + site;
    a.textContent = site;
    links.appendChild(a);
  }
  $("park-btn").onclick = () => park("thought");
  $("opp-btn").onclick = () => park("opportunity");
  $("park-text").onkeydown = (e) => { if (e.key === "Enter") park("thought"); };
  $("extend-btn").onclick = async () => { await send({ type: "extendSession", minutes: 15 }); st = await getState(); renderRunning(); };
  $("break-btn").onclick = takeBreak;
  $("end-btn").onclick = async () => {
    await save({ session: { ...s, ended: true, endedAt: Date.now() } });
    st = await getState();
    renderCheckin();
  };
}

async function park(kind, text = $("park-text").value.trim()) {
  if (!text) return;
  const fresh = await getState();
  if (kind === "opportunity") {
    fresh.opportunities.unshift({ name: text, link: "", deadline: "", at: Date.now(), status: "to check" });
    await save({ opportunities: fresh.opportunities });
  } else {
    fresh.parking.unshift({ text, at: Date.now(), goal: fresh.session?.goal || "" });
    await save({ parking: fresh.parking.slice(0, 300) });
  }
  $("park-text").value = "";
  $("park-ok").classList.remove("hidden");
  setTimeout(() => $("park-ok").classList.add("hidden"), 2500);
}

// ---------- blocked ----------

function renderBlocked() {
  show("blocked");
  const s = st.session;
  const host = hostOf(targetUrl) || "this page";
  $("blk-goal").innerHTML = `<span class="muted small">You're here for</span><br><b>${esc(s.goal)}</b>
    <div class="muted small">${fmtMin(Math.max(0, s.endsAt - Date.now()) / 1000)} left</div>`;
  $("need-goal").textContent = s.goal;
  const it = INTENTS[s.intent];
  $("remember-label").textContent = `Always allow ${hostOf(targetUrl) || "this site"} for “${it?.label}” (it's one of my study sources)`;
  $("remember-row").classList.toggle("hidden", s.intent === "custom" || mode === "search");

  if (mode === "aicap") {
    $("blk-title").textContent = "AI chat time is used up for this session";
    $("blk-sub").textContent = `You've had ${st.settings.aiChatCapMin} minutes of ${host}. Chatting about the work feels like work — doing it is the work.`;
    $("need-btn").classList.add("hidden");
  } else if (mode === "youtube") {
    $("blk-title").textContent = "YouTube is in study mode";
    $("blk-sub").textContent = "Lectures, playlists and search work. The home feed and Shorts stay closed during a session — search for the exact lecture you need.";
    $("need-btn").classList.add("hidden");
  } else if (mode === "search") {
    $("blk-title").textContent = "That search drifts from your goal";
    $("blk-sub").textContent = `"${params.get("q")}" — ${params.get("msg") || ""}`;
  } else {
    $("blk-sub").textContent = `${host} isn't on this session's list.`;
  }

  const count = (s.requests || []).length;
  if (count >= 3) {
    $("drift").textContent = `This is detour #${count + 1} this session. That's usually a sign your brain wants a break, not a new tab. Try a 10-minute break with no screen?`;
    $("drift").classList.remove("hidden");
  }

  $("back-btn").onclick = () => { history.replaceState(null, "", "gate.html"); renderRunning(); toast(any(COMEBACK)); };
  $("park-blk-btn").onclick = async () => {
    await park("thought", `Look at later: ${targetUrl}`);
    history.replaceState(null, "", "gate.html");
    renderRunning();
  };
  $("need-btn").onclick = () => {
    $("need-card").classList.remove("hidden");
    $("reason-hint").textContent = st.settings.aiEnabled ? "AI will check it against your goal." : `It opens after a ${st.settings.unlockWaitSec}-second pause.`;
    $("reason").focus();
  };
  $("reason-btn").onclick = askForSite;
}

async function askForSite() {
  const reason = $("reason").value.trim();
  const v = $("verdict");
  if (reason.length < 15) {
    v.textContent = "Give a real reason (at least a sentence). If you can't, you probably don't need it.";
    v.classList.remove("hidden");
    return;
  }
  $("reason-btn").disabled = true;
  v.textContent = st.settings.aiEnabled ? "Checking…" : "";
  v.classList.toggle("hidden", !st.settings.aiEnabled);
  const r = await send({ type: "requestSite", url: targetUrl, reason });
  $("reason-btn").disabled = false;
  if (r?.error) { v.textContent = r.error; v.classList.remove("hidden"); return; }

  if (r.allow) {
    v.textContent = r.message || "Okay. Do the one thing, then come back.";
    v.classList.toggle("hidden", !v.textContent);
    countdown(r.waitSec || 0, false);
  } else {
    v.innerHTML = `${esc(r.message)}<br><button class="btn ghost" id="override" style="margin-top:8px">Override anyway (${r.overrideWaitSec}s wait, logged)</button>`;
    v.classList.remove("hidden");
    $("override").onclick = () => { $("override").remove(); countdown(r.overrideWaitSec, true); };
  }
}

function countdown(sec, override) {
  const row = $("countdown-row");
  const btn = $("open-btn");
  row.classList.remove("hidden");
  btn.disabled = sec > 0;
  let left = sec;
  const draw = () => { $("countdown").textContent = left > 0 ? `Opens in ${left}s — still sure?` : ""; };
  draw();
  if (sec > 0) {
    const t = setInterval(() => { left -= 1; draw(); if (left <= 0) { clearInterval(t); btn.disabled = false; } }, 1000);
  }
  btn.onclick = async () => {
    if (mode === "search") await send({ type: "allowSearch", q: params.get("q") });
    else {
      await send({ type: "addSite", url: targetUrl, override });
      if ($("remember").checked) await send({ type: "rememberSite", url: targetUrl });
    }
    location.href = targetUrl;
  };
}

// ---------- check-in ----------

function renderCheckin() {
  show("checkin");
  const s = st.session;
  $("ci-goal").textContent = `Goal: ${s.goal}`;
  const doneSteps = st.steps.items.filter((i) => i.done).length;
  const days = streak(st.history);
  $("ci-cheer").textContent = `You showed up and stayed with it. ${doneSteps ? `${doneSteps} step${doneSteps === 1 ? "" : "s"} done. ` : ""}${days ? `Streak: ${days} day${days === 1 ? "" : "s"} 🔥` : "This could be day 1 of a streak 🔥"}`;
  const rows = Object.entries(s.siteSec || {}).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((a, [, v]) => a + v, 0) || 1;
  $("ci-sites").innerHTML = `<h2>Where the time went</h2>` + (rows.length
    ? rows.slice(0, 8).map(([h, v]) => `<div class="small">${esc(h)} — ${fmtMin(v)}</div><div class="bar" style="margin-bottom:8px"><span style="width:${(v / total) * 100}%"></span></div>`).join("")
    : `<p class="muted small">No browsing time recorded.</p>`) +
    ((s.requests || []).length ? `<p class="muted small">Detours asked for: ${s.requests.length}${s.overrides ? `, overrides: ${s.overrides}` : ""}</p>` : "");

  if (s.intent === "opportunity") {
    $("ci-opp").classList.remove("hidden");
    $("opp-save").onclick = async () => {
      const name = $("opp-name").value.trim();
      if (!name) return;
      const fresh = await getState();
      fresh.opportunities.unshift({ name, link: $("opp-link").value.trim(), deadline: $("opp-deadline").value.trim(), at: Date.now(), status: "to apply" });
      await save({ opportunities: fresh.opportunities });
      $("opp-saved").insertAdjacentHTML("beforeend", `<li>✓ ${esc(name)} ${$("opp-deadline").value ? "— " + esc($("opp-deadline").value) : ""}</li>`);
      for (const id of ["opp-name", "opp-link", "opp-deadline"]) $(id).value = "";
    };
  }

  const note = () => $("ci-note").value.trim();
  $("ci-new").onclick = async () => { await send({ type: "endSession", note: note() }); location.href = "gate.html"; };
  $("ci-done").onclick = async () => { await send({ type: "endSession", note: note() }); location.href = "dashboard.html"; };
  $("ci-extend").onclick = async () => {
    const fresh = await getState();
    fresh.session.note = note();
    await save({ session: fresh.session });
    await send({ type: "extendSession", minutes: 15 });
    location.href = "gate.html";
  };
}

function toast(text) {
  $("toast").textContent = text;
  $("toast").classList.remove("hidden");
  setTimeout(() => $("toast").classList.add("hidden"), 6000);
}

async function openPanel() {
  const win = await chrome.windows.getCurrent();
  chrome.sidePanel.open({ windowId: win.id });
}

function drawSteps() {
  const ul = $("run-steps");
  const items = st.steps.items;
  ul.innerHTML = items.length ? "" : `<li class="muted small">No steps yet. Break the task into tiny pieces in the side panel.</li>`;
  items.forEach((it, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label class="step ${it.done ? "done" : ""}" style="font-weight:400;margin:0"><input type="checkbox" ${it.done ? "checked" : ""}> ${esc(it.text)}</label>`;
    li.querySelector("input").onchange = async (e) => {
      const fresh = await getState();
      fresh.steps.items[i].done = e.target.checked;
      await save({ steps: fresh.steps });
      st = fresh;
      drawSteps();
      if (e.target.checked) toast(any(CELEBRATE));
    };
    ul.appendChild(li);
  });
}

chrome.storage.onChanged.addListener((c) => {
  if (c.steps && !$("running").classList.contains("hidden")) getState().then((f) => { st = f; drawSteps(); });
});

init();
