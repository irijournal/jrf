import { getState, save, fmtMin, todayKey, INTENTS } from "./common.js";

const $ = (id) => document.getElementById(id);
const esc = (t) => { const d = document.createElement("div"); d.textContent = t ?? ""; return d.innerHTML; };
let st = await getState();

function bars(entries, el, limit = 12) {
  const rows = entries.sort((a, b) => b[1] - a[1]).slice(0, limit);
  const max = rows[0]?.[1] || 1;
  el.innerHTML = rows.length ? rows.map(([k, v]) => `
    <div class="row small" style="justify-content:space-between"><span>${esc(k)}</span><span>${fmtMin(v)}</span></div>
    <div class="bar" style="margin:2px 0 8px"><span style="width:${(v / max) * 100}%"></span></div>`).join("")
    : `<p class="muted small">Nothing yet.</p>`;
}

function render() {
  const t = st.usage[todayKey()] || { domains: {}, goals: {}, blocked: {} };
  const total = Object.values(t.domains).reduce((a, b) => a + b, 0);
  const outside = t.goals["(outside a session)"] || 0;
  const blocked = Object.values(t.blocked || {}).reduce((a, b) => a + b, 0);
  $("t-focus").textContent = fmtMin(total - outside);
  $("t-total").textContent = fmtMin(total);
  $("t-blocked").textContent = blocked;
  bars(Object.entries(t.domains), $("sites"));
  bars(Object.entries(t.goals), $("goals"));

  const chat = ["chatgpt.com", "chat.openai.com", "gemini.google.com", "claude.ai", "perplexity.ai"]
    .reduce((a, h) => a + (t.domains[h] || 0), 0);
  const top = Object.entries(t.blocked || {}).sort((a, b) => b[1] - a[1])[0];
  const notes = [];
  if (chat > 30 * 60) notes.push(`${fmtMin(chat)} on AI chat today. If it was opportunity-hunting, it belongs in tomorrow's boxed hunt.`);
  if (top && top[1] >= 3) notes.push(`You tried to open ${top[0]} ${top[1]} times. That's a habit loop — notice the moment you reach for it.`);
  if (notes.length) { $("insight").innerHTML = notes.map(esc).join("<br>"); $("insight").classList.remove("hidden"); }

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const u = st.usage[todayKey(d)];
    const tot = u ? Object.values(u.domains).reduce((a, b) => a + b, 0) : 0;
    const out = u?.goals["(outside a session)"] || 0;
    days.push([d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" }), tot - out, tot]);
  }
  const max = Math.max(1, ...days.map((d) => d[2]));
  $("week").innerHTML = days.map(([label, f, tot]) => `
    <div class="row small" style="justify-content:space-between"><span>${label}</span><span>${fmtMin(f)} focused / ${fmtMin(tot)}</span></div>
    <div class="bar" style="margin:2px 0 8px"><span style="width:${(f / max) * 100}%"></span></div>`).join("");

  $("opps").innerHTML = st.opportunities.map((o, i) => `<tr>
    <td>${o.link ? `<a href="${esc(o.link)}" target="_blank" rel="noopener">${esc(o.name)}</a>` : esc(o.name)}</td>
    <td><input type="text" data-i="${i}" data-f="deadline" value="${esc(o.deadline)}" placeholder="add"></td>
    <td><select data-i="${i}" data-f="status">${["to check", "to apply", "applied", "skip"].map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
    <td><button class="btn ghost small" data-del="${i}">✕</button></td></tr>`).join("") || `<tr><td colspan="4" class="muted small">Empty.</td></tr>`;

  $("parking").innerHTML = st.parking.map((p, i) => `<li class="row" style="justify-content:space-between"><span>${esc(p.text)} <span class="muted">· ${new Date(p.at).toLocaleString()}</span></span><button class="btn ghost small" data-unpark="${i}">done</button></li>`).join("") || `<li class="muted">Nothing parked.</li>`;

  $("history").innerHTML = st.history.slice(0, 40).map((h) => {
    const mins = Math.round((h.endedAt - h.startedAt) / 60000);
    return `<tr><td>${new Date(h.startedAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</td>
      <td>${INTENTS[h.intent]?.emoji || ""} ${esc(h.goal)}</td><td>${mins} min</td><td>${esc(h.note)}</td></tr>`;
  }).join("") || `<tr><td colspan="4" class="muted small">No sessions yet.</td></tr>`;

  $("requests").innerHTML = st.requests.slice(-20).reverse().map((r) =>
    `<li>${r.allowed ? "✅" : "⛔"} <b>${esc(r.host)}</b> — “${esc(r.reason)}” <span class="muted">(${esc(r.goal)})</span></li>`).join("") || `<li class="muted">None.</li>`;
}

document.addEventListener("change", async (e) => {
  const i = e.target.dataset.i;
  if (i === undefined) return;
  st.opportunities[i][e.target.dataset.f] = e.target.value;
  await save({ opportunities: st.opportunities });
});
document.addEventListener("click", async (e) => {
  if (e.target.dataset.del !== undefined) { st.opportunities.splice(+e.target.dataset.del, 1); await save({ opportunities: st.opportunities }); render(); }
  if (e.target.dataset.unpark !== undefined) { st.parking.splice(+e.target.dataset.unpark, 1); await save({ parking: st.parking }); render(); }
});
render();
