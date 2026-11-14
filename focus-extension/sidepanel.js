import { INTENTS, getState, save, sessionActive, fmtMin, focusedToday, sessionsToday, streak, todayKey } from "./common.js";
import { CHEERS, CELEBRATE, STUCK_TIPS, pick, fill } from "./motivation.js";
import { aiCoach } from "./ai.js";

const $ = (id) => document.getElementById(id);
const esc = (t) => { const d = document.createElement("div"); d.textContent = t ?? ""; return d.innerHTML; };
let st = await getState();
let tab = "inbox";

// ---------- header: current goal + a kind line ----------
function drawNow() {
  const s = st.session;
  if (sessionActive(s)) {
    const it = INTENTS[s.intent] || INTENTS.custom;
    $("now-label").textContent = `${it.emoji} ${it.label}`;
    $("now-goal").textContent = s.goal;
    $("now-left").textContent = `${Math.ceil((s.endsAt - Date.now()) / 60000)} min left`;
  } else {
    $("now-label").textContent = "No session running";
    $("now-goal").textContent = "What's one small thing you could do now?";
    $("now-left").textContent = "Open a new tab to start a session.";
  }
}
function newCheer() {
  const s = st.session;
  $("cheer").textContent = fill(pick(CHEERS), {
    goal: s?.goal || "your goal", focused: fmtMin(focusedToday(st.usage)),
    left: s ? fmtMin(Math.max(0, s.endsAt - Date.now()) / 1000) : "a few minutes"
  });
}
$("cheer").onclick = newCheer;

// ---------- brain dump ----------
$("dump").onkeydown = async (e) => {
  if (e.key !== "Enter" || e.shiftKey) return;
  e.preventDefault();
  const text = $("dump").value.trim();
  if (!text) return;
  const f = await getState();
  f.parking.unshift({ text, at: Date.now(), goal: f.session?.goal || "", bucket: "inbox" });
  await save({ parking: f.parking.slice(0, 500) });
  $("dump").value = "";
  $("dump-ok").classList.remove("hidden");
  setTimeout(() => $("dump-ok").classList.add("hidden"), 2000);
};
for (const t of ["inbox", "later"]) {
  $(`tab-${t}`).onclick = () => { tab = t; drawDumps(); };
}

function drawDumps() {
  $("tab-inbox").setAttribute("aria-pressed", String(tab === "inbox"));
  $("tab-later").setAttribute("aria-pressed", String(tab === "later"));
  const bucket = (p) => p.bucket || "inbox";
  $("n-inbox").textContent = `(${st.parking.filter((p) => bucket(p) === "inbox").length})`;
  $("n-later").textContent = `(${st.parking.filter((p) => bucket(p) === "later").length})`;
  const ul = $("dumps");
  ul.innerHTML = "";
  const items = st.parking.map((p, i) => [p, i]).filter(([p]) => bucket(p) === tab);
  if (!items.length) ul.innerHTML = `<li class="muted">${tab === "inbox" ? "Head's clear ✨" : "Nothing for later."}</li>`;
  for (const [p, i] of items.slice(0, 60)) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${esc(p.text)}</span><span class="item-actions">
      <button data-a="done" title="Done">✔</button><button data-a="step" title="Make it a step">➜</button>
      <button data-a="opp" title="Opportunity list">🎯</button>
      <button data-a="move" title="${tab === "inbox" ? "Later" : "Back to inbox"}">${tab === "inbox" ? "⏭" : "↩"}</button>
      <button data-a="del" title="Delete">✕</button></span>`;
    li.querySelectorAll("button").forEach((b) => (b.onclick = () => act(b.dataset.a, i)));
    ul.appendChild(li);
  }
}

async function act(a, i) {
  const f = await getState();
  const p = f.parking[i];
  if (!p) return;
  const out = {};
  if (a === "move") p.bucket = (p.bucket || "inbox") === "inbox" ? "later" : "inbox";
  else f.parking.splice(i, 1);
  if (a === "step") { f.steps.items.push({ text: p.text, done: false }); out.steps = f.steps; }
  if (a === "opp") { f.opportunities.unshift({ name: p.text, link: "", deadline: "", at: Date.now(), status: "to check" }); out.opportunities = f.opportunities; }
  if (a === "done") celebrate();
  await save({ parking: f.parking, ...out });
}

// ---------- steps ----------
function drawSteps() {
  const ul = $("steps");
  ul.innerHTML = st.steps.items.length ? "" : `<li class="muted">Break your task into pieces so small they feel silly.</li>`;
  st.steps.items.forEach((it, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label class="step ${it.done ? "done" : ""}" style="font-weight:400;margin:0;flex:1"><input type="checkbox" ${it.done ? "checked" : ""}> ${esc(it.text)}</label>
      <span class="item-actions"><button title="Delete">✕</button></span>`;
    li.querySelector("input").onchange = async (e) => {
      const f = await getState();
      f.steps.items[i].done = e.target.checked;
      await save({ steps: f.steps });
      if (e.target.checked) celebrate();
    };
    li.querySelector("button").onclick = async () => {
      const f = await getState();
      f.steps.items.splice(i, 1);
      await save({ steps: f.steps });
    };
    ul.appendChild(li);
  });
}
$("step-in").onkeydown = async (e) => {
  if (e.key !== "Enter") return;
  const text = $("step-in").value.trim();
  if (!text) return;
  const f = await getState();
  f.steps.items.push({ text, done: false });
  await save({ steps: f.steps });
  $("step-in").value = "";
};

function celebrate() {
  $("celebrate").textContent = pick(CELEBRATE);
  $("celebrate").classList.remove("hidden");
  setTimeout(() => $("celebrate").classList.add("hidden"), 4000);
}

// ---------- I'm stuck ----------
$("stuck-btn").onclick = async () => {
  const out = $("stuck-out");
  out.classList.remove("hidden");
  out.innerHTML = `<p class="muted small">Thinking…</p>`;
  let steps, line;
  const r = await aiCoach(st.settings, { goal: st.session?.goal, stuck: $("stuck-in").value.trim() });
  if (r && !r.error && r.steps.length) {
    steps = r.steps; line = r.encouragement;
  } else {
    const shuffled = [...STUCK_TIPS].sort(() => Math.random() - 0.5);
    steps = shuffled.slice(0, 3); line = r?.error ? `(${r.error}) Being stuck is normal — pick just one.` : "Being stuck is normal. Pick just one of these.";
  }
  out.innerHTML = `<ol class="small" style="padding-left:18px;margin:0 0 8px">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <p class="cheer small">${esc(line)}</p><button class="btn ghost small" id="as-steps">Add these as steps</button>`;
  $("as-steps").onclick = async () => {
    const f = await getState();
    f.steps.items.push(...steps.map((text) => ({ text, done: false })));
    await save({ steps: f.steps });
    $("as-steps").textContent = "Added ✓";
  };
};

// ---------- top 3 + wins ----------
function drawTop3() {
  const ul = $("top3");
  ul.innerHTML = "";
  st.dayPlan.top3.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" ${t.done ? "checked" : ""} style="margin-top:12px">
      <input type="text" value="${esc(t.text)}" placeholder="${["Most important thing today", "Second thing", "Third thing"][i]}" class="${t.done ? "step done" : ""}">`;
    const [box, input] = li.querySelectorAll("input");
    box.onchange = async () => {
      const f = await getState();
      f.dayPlan.top3[i].done = box.checked;
      await save({ dayPlan: f.dayPlan });
      if (box.checked) celebrate();
    };
    input.onchange = async () => {
      const f = await getState();
      f.dayPlan.top3[i].text = input.value.trim();
      await save({ dayPlan: f.dayPlan });
    };
    ul.appendChild(li);
  });
}

function drawWins() {
  $("w-focus").textContent = fmtMin(focusedToday(st.usage));
  $("w-sessions").textContent = sessionsToday(st.history);
  $("w-streak").textContent = `${streak(st.history)} 🔥`;
  const today = todayKey();
  const wins = [
    ...st.dayPlan.top3.filter((t) => t.done && t.text).map((t) => `⭐ ${t.text}`),
    ...st.steps.items.filter((i) => i.done).map((i) => `👣 ${i.text}`),
    ...st.history.filter((h) => todayKey(new Date(h.startedAt)) === today).flatMap((h) => [
      `✅ ${h.goal}${h.note ? ` — ${h.note}` : ""}`, ...(h.steps || []).map((x) => `👣 ${x}`)
    ])
  ];
  $("wins").innerHTML = wins.length ? wins.map((w) => `<li>${esc(w)}</li>`).join("")
    : `<li class="muted">Your wins will show up here. Showing up counts as the first one.</li>`;
}

function drawAll() { drawNow(); drawDumps(); drawSteps(); drawTop3(); drawWins(); }

chrome.storage.onChanged.addListener(async (changes) => {
  st = await getState();
  if (changes.session || changes.usage) drawNow();
  if (changes.parking) drawDumps();
  if (changes.steps) { drawSteps(); drawWins(); }
  if (changes.dayPlan && document.activeElement?.closest?.("#top3") == null) drawTop3();
  if (changes.history || changes.dayPlan) drawWins();
  if (changes.session && !changes.session.oldValue !== !changes.session.newValue) newCheer();
});
setInterval(drawNow, 30e3);
setInterval(newCheer, 5 * 60e3);
drawAll();
newCheer();
$("dump").focus();
