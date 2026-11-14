import { INTENTS, getState, sessionActive, fmtMin, todayKey } from "./common.js";

const st = await getState();
const s = st.session;
const box = document.getElementById("state");
const today = st.usage[todayKey()];
const total = today ? Object.values(today.domains).reduce((a, b) => a + b, 0) : 0;
const focused = today ? Object.entries(today.goals).filter(([g]) => g !== "(outside a session)").reduce((a, [, v]) => a + v, 0) : 0;

const esc = (t) => { const d = document.createElement("div"); d.textContent = t ?? ""; return d.innerHTML; };
if (sessionActive(s)) {
  const it = INTENTS[s.intent] || INTENTS.custom;
  box.innerHTML = `<div class="muted small">${it.emoji} ${esc(it.label)}</div><h1>${esc(s.goal)}</h1>
    <div class="big-time" style="font-size:1.8rem">${Math.ceil((s.endsAt - Date.now()) / 60000)} min left</div>`;
} else {
  box.innerHTML = `<h1>No session running</h1><p class="muted small">Open a new tab to tell Focus Gate what you're here for.</p>`;
}
box.insertAdjacentHTML("beforeend", `<div class="card small">Today: <b>${fmtMin(focused)}</b> focused of ${fmtMin(total)} in Chrome</div>`);

chrome.extension.isAllowedIncognitoAccess((ok) => {
  if (!ok) document.getElementById("incog").classList.remove("hidden");
});

document.getElementById("panel").onclick = async () => {
  const win = await chrome.windows.getCurrent();
  await chrome.sidePanel.open({ windowId: win.id });
  window.close();
};
