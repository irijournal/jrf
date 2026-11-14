// Shared data and helpers for the background worker and the extension pages.

export const INTENTS = {
  jrf: {
    label: "JRF prep",
    emoji: "📚",
    minutes: 50,
    // Any source you add on the gate page is remembered for next time.
    sites: [
      // official + syllabus
      "ugcnet.nta.ac.in", "nta.ac.in", "ugc.gov.in", "ugc.ac.in",
      // free study material
      "egyankosh.ac.in", "ignou.ac.in", "swayam.gov.in", "onlinecourses.swayam2.ac.in",
      "epgp.inflibnet.ac.in", "inflibnet.ac.in", "shodhganga.inflibnet.ac.in", "nptel.ac.in",
      "ncert.nic.in", "epathshala.nic.in", "archive.org", "books.google.com",
      // reading + reference
      "wikipedia.org", "britannica.com", "worldhistory.org", "jstor.org", "scholar.google.com",
      "khanacademy.org",
      // mock tests + coaching (add yours)
      "testbook.com", "unacademy.com", "adda247.com", "studyiq.com", "jagranjosh.com",
      // lectures: YouTube opens in study mode (no Shorts, no home feed)
      "youtube.com",
      // your own notes + apps
      "irijournal.github.io", "docs.google.com", "drive.google.com", "notion.so", "quizlet.com"
    ]
  },
  assignment: {
    label: "Do an assignment",
    emoji: "✍️",
    minutes: 50,
    sites: [
      "docs.google.com", "drive.google.com", "classroom.google.com", "scholar.google.com",
      "wikipedia.org", "jstor.org", "archive.org", "researchgate.net", "academia.edu",
      "overleaf.com", "office.com", "onedrive.live.com", "zotero.org", "grammarly.com"
    ]
  },
  submit: {
    label: "Submit an assignment",
    emoji: "📤",
    minutes: 20,
    sites: [
      "classroom.google.com", "drive.google.com", "docs.google.com", "mail.google.com",
      "outlook.live.com", "outlook.office.com", "office.com"
    ]
  },
  form: {
    label: "Fill a form",
    emoji: "📝",
    minutes: 30,
    sites: [
      "docs.google.com/forms", "forms.gle", "forms.office.com", "nta.ac.in", "ugcnet.nta.ac.in",
      "mail.google.com", "drive.google.com", "digilocker.gov.in"
    ]
  },
  opportunity: {
    label: "Opportunity hunt (boxed)",
    emoji: "🎯",
    minutes: 20,
    sites: [
      "chatgpt.com", "chat.openai.com", "claude.ai", "gemini.google.com", "perplexity.ai",
      "linkedin.com", "internshala.com", "ugc.gov.in", "nta.ac.in", "csir.res.in",
      "ichr.ac.in", "icssr.org", "mail.google.com"
    ]
  },
  custom: { label: "Something else", emoji: "➕", minutes: 30, sites: [] }
};

// Sites that open freely during any session (you can edit this list in Settings).
export const DEFAULT_ALWAYS = ["accounts.google.com", "calendar.google.com"];

// AI chat sites get a time cap even when allowed – this is where opportunity-hunting eats hours.
export const DEFAULT_AI_CHAT = [
  "chatgpt.com", "chat.openai.com", "claude.ai", "gemini.google.com", "perplexity.ai",
  "copilot.microsoft.com", "chat.deepseek.com"
];

export const SEARCH_ENGINES = [
  { host: "google.", path: "/search", param: "q" },
  { host: "bing.com", path: "/search", param: "q" },
  { host: "duckduckgo.com", path: "/", param: "q" },
  { host: "youtube.com", path: "/results", param: "search_query" }
];

export const DEFAULT_SETTINGS = {
  aiEnabled: false,
  apiKey: "",
  model: "claude-opus-5-5",
  alwaysAllowed: DEFAULT_ALWAYS,
  aiChatSites: DEFAULT_AI_CHAT,
  aiChatCapMin: 15,           // per session, outside an opportunity hunt
  opportunityPerDay: 1,       // boxed opportunity hunts per day
  breaksPerDay: 3,
  breakMin: 10,
  unlockWaitSec: 30,          // wait before "I need this site" opens it (without AI)
  pauseWaitSec: 300,          // wait before blocking can be paused at all
  checkSearches: true,        // with AI on, check search queries against your goal
  youtubeStudyMode: true,     // block YouTube home feed and Shorts during sessions
  intentSites: {}             // your saved site lists per session type
};

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function hostOf(url) {
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return null;
    return u.hostname.replace(/^www\./, "");
  } catch { return null; }
}

// "docs.google.com/forms" matches docs.google.com/forms/...; "wikipedia.org" matches en.wikipedia.org.
export function matches(url, pattern) {
  let u;
  try { u = new URL(url); } catch { return false; }
  const host = u.hostname.replace(/^www\./, "");
  const p = pattern.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  if (!p) return false;
  const [pHost, ...rest] = p.split("/");
  const pPath = rest.length ? "/" + rest.join("/") : "";
  const hostOk = host === pHost || host.endsWith("." + pHost);
  return hostOk && (!pPath || u.pathname.startsWith(pPath));
}

export const matchesAny = (url, list = []) => list.some((p) => matches(url, p));

export function searchQuery(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  const host = u.hostname.replace(/^www\./, "");
  for (const s of SEARCH_ENGINES) {
    if ((host.startsWith(s.host) || host.includes("." + s.host) || host === s.host) && u.pathname.startsWith(s.path)) {
      const q = u.searchParams.get(s.param);
      if (q) return q;
    }
  }
  return null;
}

export async function getState() {
  const s = await chrome.storage.local.get([
    "settings", "session", "usage", "parking", "opportunities", "history",
    "breakState", "pauseState", "oppState", "requests"
  ]);
  s.settings = { ...DEFAULT_SETTINGS, ...(s.settings || {}) };
  s.usage ||= {};
  s.parking ||= [];
  s.opportunities ||= [];
  s.history ||= [];
  s.requests ||= [];
  return s;
}

export const save = (obj) => chrome.storage.local.set(obj);

export function fmtMin(sec) {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

export function sessionActive(session, now = Date.now()) {
  return !!session && !session.ended && session.endsAt > now;
}

export const send = (msg) => chrome.runtime.sendMessage(msg);

// The sites a session type opens: your saved list if you changed it, else the preset.
export const sitesFor = (settings, key) =>
  settings.intentSites?.[key] || INTENTS[key]?.sites || [];

// YouTube is allowed for lectures, but its feed and Shorts are where an hour disappears.
export function isYoutubeFeed(url) {
  let u;
  try { u = new URL(url); } catch { return false; }
  const h = u.hostname.replace(/^(www|m)\./, "");
  if (h !== "youtube.com") return false;
  return u.pathname === "/" || u.pathname.startsWith("/shorts") || u.pathname.startsWith("/feed");
}
