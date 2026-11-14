import {
  INTENTS, getState, save, hostOf, matchesAny, searchQuery, todayKey, sessionActive, fmtMin,
  isYoutubeFeed, sitesFor, streak, focusedToday, sessionsToday
} from "./common.js";
import { aiJudge } from "./ai.js";
import { CHEERS, NUDGES, HYDRATE, pick, fill } from "./motivation.js";

const GATE = chrome.runtime.getURL("gate.html");
const MAX_FLUSH_SEC = 120;      // never credit more than 2 minutes between ticks (sleep, crashes)
const DAILY_SITE_WARN_MIN = 60; // warn once per site per day after this much time

// Serialise every read-modify-write of storage so events never overwrite each other.
let chain = Promise.resolve();
const serial = (fn) => (chain = chain.then(fn, fn));

// ---------- decisions ----------

function decide(url, st, now = Date.now()) {
  if (!url || !/^https?:/.test(url)) return { allow: true };
  const { settings, session, breakState, pauseState } = st;
  if (pauseState?.until > now) return { allow: true };
  if (breakState?.endsAt > now) return { allow: true };
  if (matchesAny(url, settings.alwaysAllowed)) return { allow: true };
  if (!sessionActive(session, now)) return { allow: false, mode: session?.ended ? "checkin" : "nosession" };

  const allowed = [...session.sites, ...(session.extra || [])];
  if (matchesAny(url, allowed)) {
    if (settings.youtubeStudyMode && session.intent !== "custom" && isYoutubeFeed(url)) {
      return { allow: false, mode: "youtube" };
    }
    const isChat = matchesAny(url, settings.aiChatSites);
    if (isChat && session.intent !== "opportunity" && (session.aiChatSec || 0) >= settings.aiChatCapMin * 60) {
      return { allow: false, mode: "aicap" };
    }
    return { allow: true };
  }
  if (searchQuery(url)) return { allow: true }; // searches are checked by AI separately (if on)
  return { allow: false, mode: "blocked" };
}

const gateUrl = (mode, extra = {}) => `${GATE}?${new URLSearchParams({ mode, ...extra })}`;

async function redirect(tabId, mode, url, extra = {}) {
  try { await chrome.tabs.update(tabId, { url: gateUrl(mode, { url, ...extra }) }); } catch {}
}

// ---------- navigation guard ----------

chrome.webNavigation.onBeforeNavigate.addListener((d) => {
  if (d.frameId !== 0) return;
  serial(async () => {
    const st = await getState();
    const verdict = decide(d.url, st);
    if (!verdict.allow) {
      await redirect(d.tabId, verdict.mode, d.url);
      if (verdict.mode === "blocked") await logBlocked(st, d.url);
      return;
    }
    await checkSearch(d.tabId, d.url, st);
  });
});

async function logBlocked(st, url) {
  const day = todayKey();
  st.usage[day] ||= { domains: {}, goals: {}, blocked: {}, warned: {} };
  st.usage[day].blocked ||= {};
  const h = hostOf(url);
  if (h) st.usage[day].blocked[h] = (st.usage[day].blocked[h] || 0) + 1;
  await save({ usage: st.usage });
}

async function checkSearch(tabId, url, st) {
  const q = searchQuery(url);
  const { session, settings } = st;
  if (!q || !settings.checkSearches || !settings.aiEnabled || !sessionActive(session)) return;
  if (session.intent === "opportunity") return;
  if (st.breakState?.endsAt > Date.now() || st.pauseState?.until > Date.now()) return;
  session.searches ||= {};
  let verdict = session.searches[q];
  if (!verdict) {
    const r = await aiJudge(settings, { goal: session.goal, intent: INTENTS[session.intent]?.label, query: q });
    if (!r || r.error) return; // fail open on errors
    verdict = r;
    session.searches[q] = r;
    await save({ session });
  }
  if (!verdict.allow) await redirect(tabId, "search", url, { q, msg: verdict.message });
}

// ---------- time tracking ----------

async function currentTab() {
  const win = await chrome.windows.getLastFocused({ populate: false }).catch(() => null);
  if (!win || !win.focused) return null;
  const [tab] = await chrome.tabs.query({ active: true, windowId: win.id });
  return tab || null;
}

async function flushAndRetarget() {
  const st = await getState();
  const { tracking } = await chrome.storage.local.get("tracking");
  const now = Date.now();

  if (tracking?.host && tracking.since) {
    const sec = Math.min(MAX_FLUSH_SEC, Math.max(0, Math.round((now - tracking.since) / 1000)));
    if (sec > 0) credit(st, tracking.host, tracking.url, sec);
  }

  const idle = await chrome.idle.queryState(120);
  const tab = idle === "active" ? await currentTab() : null;
  const host = tab?.url ? hostOf(tab.url) : null;
  await save({
    usage: st.usage,
    session: st.session ?? null,
    tracking: host ? { host, url: tab.url, since: now, tabId: tab.id } : null
  });
  return { st, tab };
}

function credit(st, host, url, sec) {
  const day = todayKey();
  const u = (st.usage[day] ||= { domains: {}, goals: {}, blocked: {}, warned: {} });
  u.domains[host] = (u.domains[host] || 0) + sec;
  const s = st.session;
  if (sessionActive(s)) {
    const g = s.goal || "(no goal)";
    u.goals[g] = (u.goals[g] || 0) + sec;
    s.siteSec ||= {};
    s.siteSec[host] = (s.siteSec[host] || 0) + sec;
    if (matchesAny(url, st.settings.aiChatSites)) s.aiChatSec = (s.aiChatSec || 0) + sec;
  } else {
    u.goals["(outside a session)"] = (u.goals["(outside a session)"] || 0) + sec;
  }
}

const retarget = () => serial(flushAndRetarget);
chrome.tabs.onActivated.addListener(retarget);
chrome.tabs.onUpdated.addListener((_, info, tab) => { if (tab.active && (info.url || info.status === "complete")) retarget(); });
chrome.windows.onFocusChanged.addListener(retarget);
chrome.idle.setDetectionInterval(120);
chrome.idle.onStateChanged.addListener(retarget);

// ---------- the minute tick: warnings, session end, enforcement ----------

chrome.alarms.create("tick", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === "tick" || a.name === "sessionEnd") serial(tick); });
chrome.runtime.onStartup.addListener(() => serial(tick));
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  chrome.alarms.create("tick", { periodInMinutes: 1 });
  if (reason === "install") chrome.tabs.create({ url: chrome.runtime.getURL("options.html?welcome=1") });
});

chrome.notifications.onClicked.addListener((id) => {
  chrome.tabs.create({ url: id.startsWith("done") ? chrome.runtime.getURL("dashboard.html") : GATE });
  chrome.notifications.clear(id);
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "open-brain-dump" && tab) chrome.sidePanel.open({ windowId: tab.windowId });
});

function notify(id, title, message) {
  chrome.notifications.create(id + ":" + Date.now(), {
    type: "basic", iconUrl: "icons/128.png", title, message, priority: 2
  });
}

async function tick() {
  const { st, tab } = await flushAndRetarget();
  const { session, settings } = st;
  const now = Date.now();
  let dirty = false;

  if (session && !session.ended) {
    const left = session.endsAt - now;
    if (left <= 0) {
      session.ended = true;
      session.endedAt = now;
      dirty = true;
      notify("end", "Time's up ⏰", `"${session.goal}" — take 30 seconds to note what you finished.`);
    } else if (left <= 5 * 60e3 && !session.warned5) {
      session.warned5 = true;
      dirty = true;
      notify("5min", "5 minutes left", `Wrap up: ${session.goal}`);
    }
    if (session.intent !== "opportunity") {
      const capSec = settings.aiChatCapMin * 60;
      if ((session.aiChatSec || 0) >= capSec - 180 && !session.warnedChat) {
        session.warnedChat = true;
        dirty = true;
        notify("chat", "AI chat time almost used", `About ${Math.max(0, Math.round((capSec - session.aiChatSec) / 60))} min of AI chat left this session. Ask your one question, then go do it.`);
      }
    }
  }

  // ----- ADHD manager: kind check-ins, soft nudges, hyperfocus care -----
  const vars = {
    goal: session?.goal || "", focused: fmtMin(focusedToday(st.usage)),
    left: session ? fmtMin(Math.max(0, session.endsAt - now) / 1000) : ""
  };
  const coach = st.coach;
  if (sessionActive(session, now)) {
    const since = Math.max(session.startedAt, coach.lastCheer || 0);
    if (settings.cheersOn && now - since >= settings.cheerEveryMin * 60e3 && session.endsAt - now > 4 * 60e3) {
      coach.lastCheer = now;
      notify("cheer", "You're doing great 💚", fill(pick(CHEERS), vars));
      dirty = true;
    }
    if (now - session.startedAt >= settings.hydrateAfterMin * 60e3 && !session.hydrated) {
      session.hydrated = true;
      notify("water", "Hyperfocus check 💧", pick(HYDRATE));
      dirty = true;
    }
  } else if (settings.nudgesOn && !(st.breakState?.endsAt > now) && !(st.pauseState?.until > now)
             && tab?.url && /^https?:/.test(tab.url) && now - (coach.lastNudge || 0) >= settings.nudgeEveryMin * 60e3) {
    coach.lastNudge = now;
    notify("nudge", "Soft check-in 🌱", pick(NUDGES));
    dirty = true;
  }

  const day = todayKey();
  const u = st.usage[day];
  if (u) {
    u.warned ||= {};
    for (const [h, sec] of Object.entries(u.domains)) {
      if (sec >= DAILY_SITE_WARN_MIN * 60 && !u.warned[h] && !matchesAny("https://" + h, session?.sites || [])) {
        u.warned[h] = true;
        dirty = true;
        notify("site", `${fmtMin(sec)} on ${h} today`, "Is this what you planned? Open Focus Gate to check your goal.");
      }
    }
  }
  if (dirty) await save({ session, usage: st.usage, coach });

  // Re-check the tab you're looking at: catches the end of a break, a pause or a session.
  if (tab?.url && /^https?:/.test(tab.url)) {
    const verdict = decide(tab.url, st);
    if (!verdict.allow) await redirect(tab.id, verdict.mode, tab.url);
  }
}

// ---------- messages from the pages ----------

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  serial(() => handle(msg)).then(reply, (e) => reply({ error: e.message }));
  return true;
});

async function handle(msg) {
  const st = await getState();
  const now = Date.now();
  const day = todayKey();

  switch (msg.type) {
    case "startSession": {
      const preset = INTENTS[msg.intent] || INTENTS.custom;
      if (msg.intent === "opportunity") {
        const used = st.oppState?.date === day ? st.oppState.count : 0;
        if (used >= st.settings.opportunityPerDay) {
          return { error: "You've already had today's opportunity hunt. Add what you're thinking of to the Opportunity list — it'll be waiting for tomorrow's hunt." };
        }
        await save({ oppState: { date: day, count: used + 1 } });
      }
      if (st.session && !st.session.archived) archive(st, st.session);
      const minutes = Math.max(5, Math.min(180, Number(msg.minutes) || preset.minutes));
      const session = {
        id: now, intent: msg.intent, goal: msg.goal.trim(), startedAt: now,
        endsAt: now + minutes * 60e3, minutes,
        sites: [...new Set([...(msg.sites || sitesFor(st.settings, msg.intent))].map((s) => s.trim()).filter(Boolean))],
        extra: [], siteSec: {}, aiChatSec: 0, requests: []
      };
      chrome.alarms.create("sessionEnd", { when: session.endsAt });
      // Remember the site list you chose for this session type (not for one-off "custom" sessions).
      if (msg.sites && msg.intent !== "custom") {
        st.settings.intentSites = { ...(st.settings.intentSites || {}), [msg.intent]: session.sites };
      }
      // Steps: carry over unfinished steps from the last session, plus the "first tiny step" if given.
      const carried = (st.steps?.items || []).filter((i) => !i.done);
      const items = [...(msg.firstStep ? [{ text: msg.firstStep.trim(), done: false }] : []), ...carried];
      await save({ session, history: st.history, settings: st.settings, steps: { sessionId: session.id, items } });
      return { ok: true, session };
    }

    case "allowSearch": {
      const s = st.session;
      if (!sessionActive(s) || !msg.q) return { error: "No active session" };
      s.searches ||= {};
      s.searches[msg.q] = { allow: true, message: "allowed by you" };
      s.overrides = (s.overrides || 0) + 1;
      await save({ session: s });
      return { ok: true };
    }

    case "rememberSite": {
      // "Always allow for this session type" from the blocked page.
      const s = st.session;
      const host = hostOf(msg.url);
      if (!sessionActive(s) || !host || s.intent === "custom") return { ok: false };
      const list = sitesFor(st.settings, s.intent);
      if (!list.includes(host)) {
        st.settings.intentSites = { ...(st.settings.intentSites || {}), [s.intent]: [...list, host] };
        await save({ settings: st.settings });
      }
      return { ok: true };
    }

    case "extendSession": {
      const s = st.session;
      if (!s) return { error: "No session" };
      s.endsAt = Math.max(now, s.endsAt) + (msg.minutes || 15) * 60e3;
      s.ended = false; s.warned5 = false;
      chrome.alarms.create("sessionEnd", { when: s.endsAt });
      await save({ session: s });
      return { ok: true };
    }

    case "endSession": {
      if (st.session) {
        st.session.note = msg.note || "";
        st.session.endedAt ||= now;
        archive(st, st.session);
      }
      chrome.alarms.clear("sessionEnd");
      await save({ session: null, history: st.history });
      const n = sessionsToday(st.history);
      const days = streak(st.history);
      notify("done", "Session logged 🎉",
        `That's ${n} session${n === 1 ? "" : "s"} today${days > 1 ? ` and a ${days}-day streak 🔥` : ""}. ${fmtMin(focusedToday(st.usage))} of focus — be proud.`);
      return { ok: true };
    }

    case "requestSite": {
      const s = st.session;
      if (!sessionActive(s)) return { error: "No active session" };
      const host = hostOf(msg.url);
      s.requests ||= [];
      s.requests.push({ host, reason: msg.reason, at: now });
      let result;
      const ai = await aiJudge(st.settings, {
        goal: s.goal, intent: INTENTS[s.intent]?.label, url: msg.url, reason: msg.reason
      });
      if (ai && !ai.error) {
        result = ai.allow
          ? { allow: true, message: ai.message, waitSec: 0 }
          : { allow: false, message: ai.message, overrideWaitSec: 90 };
      } else {
        result = { allow: true, waitSec: st.settings.unlockWaitSec, message: ai?.error || "" };
      }
      st.requests.push({ day, host, reason: msg.reason, allowed: result.allow, goal: s.goal });
      await save({ session: s, requests: st.requests.slice(-300) });
      return { ...result, requestCount: s.requests.length };
    }

    case "addSite": {
      const s = st.session;
      const host = hostOf(msg.url);
      if (!sessionActive(s) || !host) return { error: "No active session" };
      if (!s.extra.includes(host)) s.extra.push(host);
      if (msg.override) s.overrides = (s.overrides || 0) + 1;
      await save({ session: s });
      return { ok: true };
    }

    case "startBreak": {
      const b = st.breakState?.date === day ? st.breakState : { date: day, used: 0 };
      if (b.used >= st.settings.breaksPerDay) return { error: `All ${st.settings.breaksPerDay} breaks used today. Stand up, drink water, stretch — no screen.` };
      b.used += 1;
      b.endsAt = now + st.settings.breakMin * 60e3;
      await save({ breakState: b });
      return { ok: true, breakState: b };
    }

    case "requestPause": {
      await save({ pauseState: { requestedAt: now, reason: msg.reason } });
      return { ok: true, waitSec: st.settings.pauseWaitSec };
    }

    case "confirmPause": {
      const p = st.pauseState;
      const waited = p?.requestedAt ? (now - p.requestedAt) / 1000 : 0;
      if (!p?.requestedAt || waited < st.settings.pauseWaitSec) return { error: "Keep waiting — the timer isn't done." };
      if (waited > st.settings.pauseWaitSec + 300) return { error: "That request expired. Start again if you still want it." };
      const minutes = Math.min(120, Math.max(15, Number(msg.minutes) || 60));
      await save({ pauseState: { until: now + minutes * 60e3, reason: p.reason } });
      return { ok: true };
    }

    case "endPause": {
      await save({ pauseState: null });
      return { ok: true };
    }

    default:
      return { error: "Unknown message " + msg.type };
  }
}

function archive(st, s) {
  s.archived = true;
  st.history.unshift({
    intent: s.intent, goal: s.goal, startedAt: s.startedAt, endedAt: s.endedAt || Date.now(),
    minutes: s.minutes, siteSec: s.siteSec, aiChatSec: s.aiChatSec,
    requests: (s.requests || []).length, overrides: s.overrides || 0, note: s.note || "",
    steps: st.steps?.sessionId === s.id ? st.steps.items.filter((i) => i.done).map((i) => i.text) : []
  });
  st.history = st.history.slice(0, 500);
}
