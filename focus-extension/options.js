import { INTENTS, DEFAULT_SETTINGS, getState, save, sessionActive, send, sitesFor } from "./common.js";
import { aiJudge } from "./ai.js";

const $ = (id) => document.getElementById(id);
let st = await getState();
const lines = (v) => v.split(/\n|,/).map((s) => s.trim().replace(/^https?:\/\//, "").replace(/\/$/, "")).filter(Boolean);

if (new URLSearchParams(location.search).get("welcome")) $("welcome").classList.remove("hidden");

function fill() {
  const s = st.settings;
  for (const k of ["apiKey", "model", "aiChatCapMin", "opportunityPerDay", "breaksPerDay", "breakMin", "unlockWaitSec", "cheerEveryMin", "nudgeEveryMin", "hydrateAfterMin"]) $(k).value = s[k];
  for (const k of ["aiEnabled", "checkSearches", "youtubeStudyMode", "cheersOn", "nudgesOn"]) $(k).checked = !!s[k];
  $("alwaysAllowed").value = s.alwaysAllowed.join("\n");
  $("aiChatSites").value = s.aiChatSites.join("\n");
  $("intent-lists").innerHTML = "";
  for (const [key, it] of Object.entries(INTENTS)) {
    if (key === "custom") continue;
    $("intent-lists").insertAdjacentHTML("beforeend",
      `<label for="list-${key}">${it.emoji} ${it.label}</label><textarea id="list-${key}" rows="5"></textarea>`);
    $(`list-${key}`).value = sitesFor(s, key).join("\n");
  }
  const locked = sessionActive(st.session);
  $("form").disabled = locked;
  $("locked").classList.toggle("hidden", !locked);
}

$("save").onclick = async () => {
  const s = st.settings;
  s.apiKey = $("apiKey").value.trim();
  s.model = $("model").value;
  for (const k of ["aiChatCapMin", "opportunityPerDay", "breaksPerDay", "breakMin", "unlockWaitSec", "cheerEveryMin", "nudgeEveryMin", "hydrateAfterMin"]) {
    const n = Number($(k).value);
    s[k] = Number.isFinite(n) ? n : DEFAULT_SETTINGS[k];
  }
  s.unlockWaitSec = Math.max(10, s.unlockWaitSec);
  s.cheerEveryMin = Math.max(5, s.cheerEveryMin);
  s.nudgeEveryMin = Math.max(10, s.nudgeEveryMin);
  for (const k of ["aiEnabled", "checkSearches", "youtubeStudyMode", "cheersOn", "nudgesOn"]) s[k] = $(k).checked;
  s.alwaysAllowed = lines($("alwaysAllowed").value);
  s.aiChatSites = lines($("aiChatSites").value);
  s.intentSites = {};
  for (const key of Object.keys(INTENTS)) {
    if (key === "custom") continue;
    const v = lines($(`list-${key}`).value);
    if (v.join() !== INTENTS[key].sites.join()) s.intentSites[key] = v;
  }
  await save({ settings: s });
  $("saved").textContent = "Saved ✓";
  setTimeout(() => ($("saved").textContent = ""), 2000);
};

$("test-ai").onclick = async () => {
  $("test-out").textContent = "Asking…";
  const r = await aiJudge({ ...st.settings, aiEnabled: true, apiKey: $("apiKey").value.trim(), model: $("model").value },
    { goal: "Finish Unit 4 MCQs for UGC-NET History", intent: "JRF prep", url: "https://www.instagram.com/reels/" });
  $("test-out").textContent = !r ? "Add a key first." : r.error ? r.error : `Works ✓ (instagram → ${r.allow ? "allowed" : "blocked"}: “${r.message}”)`;
};

// ----- pause with a cooling-off wait -----
function drawPause() {
  const p = st.pauseState;
  const now = Date.now();
  const wait = st.settings.pauseWaitSec;
  $("pause-go").classList.add("hidden");
  $("pause-end").classList.add("hidden");
  $("pause-req").classList.remove("hidden");
  $("pause-state").textContent = "";
  if (p?.until > now) {
    $("pause-state").textContent = `Paused until ${new Date(p.until).toLocaleTimeString()}.`;
    $("pause-end").classList.remove("hidden");
    $("pause-req").classList.add("hidden");
  } else if (p?.requestedAt && now - p.requestedAt < (wait + 300) * 1000) {
    $("pause-req").classList.add("hidden");
    $("pause-go").classList.remove("hidden");
    const left = Math.ceil(wait - (now - p.requestedAt) / 1000);
    $("pause-go").disabled = left > 0;
    $("pause-count").textContent = left > 0 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} — still want it?` : "";
  } else {
    $("pause-count").textContent = "";
  }
}
$("pause-req").onclick = async () => {
  const reason = $("pause-reason").value.trim();
  if (reason.length < 10) { $("pause-count").textContent = "Write a real reason first."; return; }
  await send({ type: "requestPause", reason });
  st = await getState(); drawPause();
};
$("pause-go").onclick = async () => {
  const r = await send({ type: "confirmPause", minutes: 60 });
  if (r?.error) $("pause-count").textContent = r.error;
  st = await getState(); drawPause();
};
$("pause-end").onclick = async () => { await send({ type: "endPause" }); st = await getState(); drawPause(); };
setInterval(drawPause, 1000);

$("export").onclick = async () => {
  const data = await chrome.storage.local.get(null);
  delete data.settings?.apiKey;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  a.download = `focus-gate-log-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
};

fill();
drawPause();
