/* State, persistence, spaced repetition, XP, streaks, logs. All data stays in this browser (localStorage). */
(function (J) {
  'use strict';
  var BASEKEY = 'jrf-sadhana-v1', REG = 'jrf-accounts-v1';
  var DAY = 86400000;

  /* ---------- accounts (one progress store per person on this device) ---------- */
  var storageOK = (function () { try { localStorage.setItem('jrf-t', '1'); localStorage.removeItem('jrf-t'); return true; } catch (e) { return false; } })();
  function readReg() { try { var r = JSON.parse(localStorage.getItem(REG) || 'null'); if (r && r.list && r.list.length) return r; } catch (e) {} return null; }
  function writeReg(r) { try { localStorage.setItem(REG, JSON.stringify(r)); } catch (e) {} }
  function keyFor(id) { return id === 'main' ? BASEKEY : BASEKEY + ':' + id; }
  var reg = readReg();
  var KEY = keyFor(reg ? reg.active : 'main');

  function todayStr(d) {
    d = d || new Date();
    var m = d.getMonth() + 1, dd = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd;
  }
  function parseDay(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dayNum(s) { return Math.round(parseDay(s || todayStr()).getTime() / DAY); }
  function addDays(s, n) { var d = parseDay(s); d.setDate(d.getDate() + n); return todayStr(d); }
  function diffDays(a, b) { return Math.round((parseDay(b) - parseDay(a)) / DAY); }
  J.date = { today: todayStr, parse: parseDay, num: dayNum, add: addDays, diff: diffDays };

  function fresh() {
    var t = todayStr();
    return {
      v: 1,
      created: t,
      profile: { name: '', start: t, days: 120, goalQ: 40, goalMin: 150 },
      prefs: {
        skin: 'auto', font: 'lexend', size: 18, lh: 1.65, ls: 0, motion: 'auto',
        focus: false, sound: false, voice: 'hinglish', cardMode: true,
        tFocus: 25, tBreak: 5, keys: true, newCards: 25, calTime: '07:00', calMins: 120, calRemind: 15
      },
      topics: {}, q: {}, cards: {}, log: {}, xp: 0,
      streak: { cur: 0, best: 0, last: '' }, freeze: 2,
      badges: {}, pyq: [], dump: [], mocks: [], quests: { day: '', list: [] },
      notes: {}, plan: null, seen: { dyn: {} }, combo: 0, bestCombo: 0, chrono: 0, mapHits: 0
    };
  }

  var S;
  function normalize(o) {
    var f = fresh();
    for (var k in f) if (!(k in o)) o[k] = f[k];
    for (var p in f.prefs) if (!(p in o.prefs)) o.prefs[p] = f.prefs[p];
    for (var q in f.profile) if (!(q in o.profile)) o.profile[q] = f.profile[q];
    if (!o.seen || !o.seen.dyn) o.seen = { dyn: {} };
    return o;
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { S = normalize(JSON.parse(raw)); return; }
    } catch (e) { /* storage blocked: run in memory */ }
    S = fresh();
  }
  var saveTimer = null;
  function save(now) {
    S.savedAt = Date.now();
    try { if (sessionStorage.getItem('jrf-in')) sessionStorage.setItem('jrf-in-at', String(S.savedAt)); } catch (e) {}
    if (now) { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} J.emit('saved'); return; }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} J.emit('saved'); }, 250);
  }
  load();
  J.bootActiveAt = S.activeAt || 0;

  function sess(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function pinHash(id, pin) { return J.hash('pin|' + id + '|' + pin).toString(36); }
  function findAcc(id) { return reg ? reg.list.filter(function (a) { return a.id === id; })[0] : null; }
  var COLORS = ['#2f43a8', '#a85a26', '#1f7656', '#8a3ea8', '#b0382d', '#0f6f8a', '#6b5b00'];
  J.accounts = {
    ok: storageOK,
    list: function () { return reg ? reg.list.slice() : []; },
    active: function () { return reg ? findAcc(reg.active) : null; },
    /* '' = go straight in; 'create' = first account; 'pick' = choose / unlock */
    needsLogin: function () {
      if (!storageOK) return '';
      if (!reg) return 'create';
      var a = findAcc(reg.active);
      if (!a) return 'pick';
      if (sess('jrf-in') === a.id) {
        var at = +(sess('jrf-in-at') || 0);
        if (!a.pin || Date.now() - at < 30 * 60000) { sess('jrf-in-at', String(Date.now())); return ''; }
        sess('jrf-in', null); return 'pick';
      }
      if (!a.pin && reg.remember !== false) { sess('jrf-in', a.id); sess('jrf-in-at', String(Date.now())); return ''; }
      return 'pick';
    },
    create: function (name, pin) {
      name = String(name || '').trim().slice(0, 40) || 'Me';
      var first = !reg, id = first ? 'main' : 'a' + Date.now().toString(36);
      if (first) reg = { active: 'main', remember: true, list: [] };
      var acc = { id: id, name: name, pin: pin ? pinHash(id, pin) : '', created: todayStr(), color: COLORS[reg.list.length % COLORS.length] };
      reg.list.push(acc);
      if (first) { S.profile.name = name; save(true); reg.active = id; writeReg(reg); sess('jrf-in', id); sess('jrf-in-at', String(Date.now())); return { reload: false, acc: acc }; }
      var f = fresh(); f.profile.name = name;
      try { localStorage.setItem(keyFor(id), JSON.stringify(f)); } catch (e) {}
      reg.active = id; reg.remember = true; writeReg(reg); sess('jrf-in', id); sess('jrf-in-at', String(Date.now()));
      return { reload: true, acc: acc };
    },
    checkPin: function (id, pin) { var a = findAcc(id); return !!a && (!a.pin || a.pin === pinHash(id, pin)); },
    login: function (id, pin) {
      var a = findAcc(id); if (!a || !J.accounts.checkPin(id, pin)) return false;
      var same = reg.active === id && KEY === keyFor(id);
      if (!same) save(true);
      reg.active = id; reg.remember = true; writeReg(reg); sess('jrf-in', id); sess('jrf-in-at', String(Date.now()));
      return { reload: !same };
    },
    logout: function () { save(true); if (reg) { reg.remember = false; writeReg(reg); } sess('jrf-in', null); },
    rename: function (id, name) { var a = findAcc(id); if (!a) return; a.name = String(name).trim().slice(0, 40) || a.name; writeReg(reg); if (id === reg.active) { S.profile.name = a.name; save(); } },
    setPin: function (id, pin) { var a = findAcc(id); if (!a) return; a.pin = pin ? pinHash(id, pin) : ''; writeReg(reg); },
    remove: function (id) {
      if (!reg || id === reg.active) return false;
      reg.list = reg.list.filter(function (a) { return a.id !== id; }); writeReg(reg);
      try { localStorage.removeItem(keyFor(id)); } catch (e) {}
      return true;
    },
    peek: function (id) { try { var o = JSON.parse(localStorage.getItem(keyFor(id)) || 'null'); return o ? { xp: o.xp || 0, streak: (o.streak || {}).cur || 0, learned: Object.keys(o.topics || {}).filter(function (k) { return o.topics[k].st >= 2; }).length } : null; } catch (e) { return null; } },
    cloudPrefix: function () { return !reg || reg.active === 'main' ? 'jrf_' : 'jrf-' + reg.active + '_'; },
    /* merge accounts known elsewhere (cloud copy) into this device's list */
    merge: function (list) {
      if (!reg || !list || !list.length) return 0;
      var n = 0;
      list.forEach(function (a) { if (a && a.id && !findAcc(a.id)) { reg.list.push({ id: a.id, name: a.name, pin: a.pin || '', created: a.created, color: a.color }); n++; } });
      if (n) writeReg(reg); return n;
    },
    color: function (a) { return (a && a.color) || COLORS[0]; }
  };
  J.S = function () { return S; };
  J.save = save;
  J.resetAll = function () { S = fresh(); save(true); };
  J.exportData = function () { return JSON.stringify(S); };
  J.importData = function (txt) {
    var o = JSON.parse(txt);
    if (!o || o.v !== 1 || !o.profile) throw new Error('This does not look like a JRF Sadhana backup.');
    S = normalize(o); save(true);
  };

  /* ---------- daily log ---------- */
  function L(day) {
    day = day || todayStr();
    var l = S.log[day];
    if (!l) l = S.log[day] = { q: 0, c: 0, xp: 0, min: 0, learned: [], revised: 0, cards: 0, u: {}, types: {} };
    return l;
  }
  J.dayLog = L;

  /* ---------- streak ---------- */
  function touchStreak() {
    var t = todayStr(), st = S.streak;
    if (st.last === t) return;
    if (!st.last) st.cur = 1;
    else {
      var gap = diffDays(st.last, t);
      if (gap === 1) st.cur += 1;
      else if (gap === 2 && S.freeze > 0) { S.freeze -= 1; st.cur += 1; J.emit('toast', { t: 'Streak saved with a freeze. ' + S.freeze + ' left.' }); }
      else st.cur = 1;
    }
    st.last = t;
    if (st.cur > st.best) st.best = st.cur;
    if (st.cur > 0 && st.cur % 7 === 0) S.freeze = Math.min(3, S.freeze + 1);
  }

  /* ---------- XP & levels ---------- */
  var TITLES = ['Shishya', 'Vidyarthi', 'Sabhasad', 'Gramani', 'Senani', 'Amatya', 'Mahamatra', 'Samanta', 'Mahasamanta', 'Mansabdar', 'Amir', 'Wazir', 'Peshwa', 'Chhatrapati', 'Samrat', 'Itihasa Chakravarti'];
  function levelFor(xp) {
    var lv = 0, need = 0;
    while (lv < TITLES.length - 1) {
      var step = 300 + lv * 250;
      if (xp < need + step) return { lv: lv, title: TITLES[lv], into: xp - need, step: step };
      need += step; lv++;
    }
    return { lv: lv, title: TITLES[lv], into: xp - need, step: 999999 };
  }
  J.level = function () { return levelFor(S.xp); };
  J.TITLES = TITLES;
  J.addXP = function (n, why) {
    var before = levelFor(S.xp).lv;
    S.xp += n; L().xp += n; S.activeAt = Date.now(); touchStreak();
    var after = levelFor(S.xp);
    if (after.lv > before) J.emit('levelup', after);
    J.emit('xp', { n: n, why: why });
    checkBadges(); save();
  };

  /* ---------- questions ---------- */
  // S.q[id] = [attempts, correct, lastDayNum, box, dueDayNum]
  var BOX = [0, 1, 3, 7, 16, 35];
  J.recordAnswer = function (id, ok, unit, kind) {
    var r = S.q[id] || [0, 0, 0, 0, 0];
    r[0]++; if (ok) r[1]++;
    var dn = dayNum();
    r[2] = dn;
    if (ok) { r[3] = Math.min(5, r[3] + 1); } else { r[3] = 0; }
    r[4] = ok ? (r[3] >= 2 ? dn + BOX[r[3]] : 0) : dn + 1; // wrong → due tomorrow; right twice → spaced; else not tracked
    S.q[id] = r;
    var l = L(); l.q++; if (ok) l.c++;
    if (unit) { var u = l.u[unit] || (l.u[unit] = [0, 0]); u[0]++; if (ok) u[1]++; }
    if (kind) { var k = l.types[kind] || (l.types[kind] = [0, 0]); k[0]++; if (ok) k[1]++; }
    if (ok) { S.combo++; if (S.combo > S.bestCombo) S.bestCombo = S.combo; } else S.combo = 0;
    if (ok && kind === 'ch') S.chrono++;
    var gain = ok ? 10 + Math.min(10, Math.floor(S.combo / 3) * 2) : 2;
    J.addXP(gain, ok ? 'correct' : 'effort');
    J.questTick(ok ? 'correct' : 'answer', kind);
    if (unit && unit.charAt(0) === 'P') J.questTick(ok ? 'correct' : 'answer', 'p1');
    return gain;
  };
  J.mistakesDue = function () {
    var dn = dayNum(), out = [];
    for (var id in S.q) { var r = S.q[id]; if (r[3] === 0 && r[4] && r[4] <= dn) out.push(id); }
    return out;
  };
  J.mistakesAll = function () { var out = []; for (var id in S.q) if (S.q[id][0] > S.q[id][1]) out.push(id); return out; };

  /* ---------- topics ---------- */
  var TREV = [1, 3, 7, 16, 35, 60];
  function T(id) { return S.topics[id] || (S.topics[id] = { st: 0, stage: 0, next: '', learnedAt: '', revs: 0 }); }
  J.topicState = function (id) { return S.topics[id] || { st: 0, stage: 0, next: '', revs: 0 }; };
  J.markLearned = function (id) {
    var t = T(id);
    if (t.st >= 2) return;
    t.st = 2; t.learnedAt = todayStr(); t.stage = 0; t.next = addDays(todayStr(), TREV[0]);
    L().learned.push(id);
    J.addXP(60, 'topic');
    J.questTick('learn');
    J.unlockCards(id);
    save();
  };
  J.markStarted = function (id) { var t = T(id); if (t.st === 0) { t.st = 1; save(); } };
  J.reviseTopic = function (id, rating) { // rating: 0 hard, 1 ok, 2 easy
    var t = T(id);
    if (rating === 0) t.stage = Math.max(0, t.stage - 1);
    else t.stage = Math.min(TREV.length - 1, t.stage + (rating === 2 ? 2 : 1));
    t.next = addDays(todayStr(), TREV[t.stage]);
    t.revs++;
    if (t.revs >= 3 && t.stage >= 3) t.st = 3; // mastered
    L().revised++;
    J.addXP(30, 'revise');
    J.questTick('revise');
    save();
  };
  J.topicsDue = function () {
    var t = todayStr(), out = [];
    J.topics.forEach(function (tp) { var s = S.topics[tp.id]; if (s && s.st >= 2 && s.next && s.next <= t) out.push(tp.id); });
    return out;
  };

  /* ---------- flashcards (Leitner) ---------- */
  // S.cards[id] = [box, dueDayNum, reps, lapses]
  var CBOX = [0, 1, 3, 7, 15, 30, 60];
  J.unlockCards = function (topicId) {
    var dn = dayNum();
    J.cardsForTopic(topicId).forEach(function (c) { if (!S.cards[c.id]) S.cards[c.id] = [0, dn, 0, 0]; });
  };
  J.unlockUnitCards = function (unit) {
    var dn = dayNum(), n = 0;
    J.cardsForUnit(unit).forEach(function (c) { if (!S.cards[c.id]) { S.cards[c.id] = [0, dn, 0, 0]; n++; } });
    save(); return n;
  };
  J.rateCard = function (id, r) { // r: 0 again, 1 hard, 2 good, 3 easy
    var c = S.cards[id] || [0, 0, 0, 0], dn = dayNum();
    if (r === 0) { c[0] = 0; c[3]++; c[1] = dn; }
    else { c[0] = Math.min(CBOX.length - 1, c[0] + (r === 3 ? 2 : r === 2 ? 1 : 0)); c[1] = dn + Math.max(1, CBOX[c[0]] || 1); }
    c[2]++;
    S.cards[id] = c;
    L().cards++;
    J.addXP(r === 0 ? 1 : 3, 'card');
    J.questTick('card');
  };
  J.cardsDue = function () {
    var dn = dayNum(), out = [];
    for (var id in S.cards) if (S.cards[id][1] <= dn) out.push(id);
    return out;
  };

  /* ---------- minutes ---------- */
  J.addMinutes = function (m) { L().min += m; J.addXP(Math.round(m), 'focus'); J.questTick('focus', null, m); };

  /* ---------- quests ---------- */
  var QUESTS = [
    { id: 'ans30', t: 'Answer 30 questions', goal: 30, ev: 'answer', xp: 40 },
    { id: 'cor20', t: 'Get 20 answers right', goal: 20, ev: 'correct', xp: 40 },
    { id: 'learn1', t: 'Learn 1 topic', goal: 1, ev: 'learn', xp: 50 },
    { id: 'rev1', t: 'Revise 1 due topic', goal: 1, ev: 'revise', xp: 40 },
    { id: 'card20', t: 'Review 20 flashcards', goal: 20, ev: 'card', xp: 40 },
    { id: 'ch5', t: 'Solve 5 chronology questions right', goal: 5, ev: 'correct:ch', xp: 40 },
    { id: 'mt5', t: 'Solve 5 matching questions right', goal: 5, ev: 'correct:mt', xp: 40 },
    { id: 'focus25', t: 'Finish one 25-minute focus session', goal: 25, ev: 'focus', xp: 40 },
    { id: 'map5', t: 'Find 5 places on the map', goal: 5, ev: 'map', xp: 40 },
    { id: 'p1q10', t: 'Answer 10 Paper 1 questions', goal: 10, ev: 'answer:p1', xp: 40 }
  ];
  J.QUESTS = QUESTS;
  J.questsToday = function () {
    var t = todayStr();
    if (S.quests.day !== t) {
      var r = J.rng(J.hash(t)), pool = J.shuffle(QUESTS, r).slice(0, 3);
      S.quests = { day: t, list: pool.map(function (q) { return { id: q.id, n: 0, done: false }; }) };
      save();
    }
    return S.quests.list.map(function (x) { var q = QUESTS.filter(function (y) { return y.id === x.id; })[0]; return { q: q, n: x.n, done: x.done, ref: x }; });
  };
  J.questTick = function (ev, kind, amount) {
    if (S.quests.day !== todayStr()) J.questsToday();
    S.quests.list.forEach(function (x) {
      if (x.done) return;
      var q = QUESTS.filter(function (y) { return y.id === x.id; })[0];
      var m;
      if (kind === 'p1') m = q.ev === 'answer:p1' && (ev === 'answer' || ev === 'correct');
      else m = q.ev === ev || (ev === 'correct' && q.ev === 'answer') || (!!kind && q.ev === ev + ':' + kind);
      if (!m) return;
      x.n += amount || 1;
      if (x.n >= q.goal) { x.done = true; S.xp += q.xp; L().xp += q.xp; J.emit('quest', q); }
    });
  };

  /* ---------- badges ---------- */
  var BADGES = [
    { id: 'first', t: 'First step', d: 'Learned your first topic', test: function () { return learnedCount() >= 1; } },
    { id: 't10', t: 'Ten down', d: 'Learned 10 topics', test: function () { return learnedCount() >= 10; } },
    { id: 't40', t: 'Halfway hero', d: 'Learned 40 topics', test: function () { return learnedCount() >= 40; } },
    { id: 'tall', t: 'Syllabus conquered', d: 'Learned every topic', test: function () { return learnedCount() >= J.topics.length; } },
    { id: 'q100', t: 'Century', d: '100 questions answered', test: function () { return totalQ() >= 100; } },
    { id: 'q1000', t: 'Thousand-strong', d: '1,000 questions answered', test: function () { return totalQ() >= 1000; } },
    { id: 'q5000', t: 'Mansabdar of 5000', d: '5,000 questions answered', test: function () { return totalQ() >= 5000; } },
    { id: 'q10000', t: 'Ten thousand', d: '10,000 questions answered', test: function () { return totalQ() >= 10000; } },
    { id: 's7', t: 'Week warrior', d: '7-day streak', test: function () { return S.streak.best >= 7; } },
    { id: 's30', t: 'Monthly monk', d: '30-day streak', test: function () { return S.streak.best >= 30; } },
    { id: 's100', t: 'Unbreakable', d: '100-day streak', test: function () { return S.streak.best >= 100; } },
    { id: 'c10', t: 'Combo 10', d: '10 correct in a row', test: function () { return S.bestCombo >= 10; } },
    { id: 'c25', t: 'Combo 25', d: '25 correct in a row', test: function () { return S.bestCombo >= 25; } },
    { id: 'ch50', t: 'Time keeper', d: '50 chronology questions right', test: function () { return S.chrono >= 50; } },
    { id: 'map50', t: 'Cartographer', d: '50 places found on the map', test: function () { return S.mapHits >= 50; } },
    { id: 'mock1', t: 'Mock debut', d: 'Finished a full mock test', test: function () { return S.mocks.length >= 1; } },
    { id: 'mock70', t: 'JRF zone', d: 'Scored 70%+ in a full mock', test: function () { return S.mocks.some(function (m) { return m.total && m.score / m.total >= 0.7; }); } },
    { id: 'dyn20', t: 'Dynasty buff', d: 'Opened 20 dynasties', test: function () { return Object.keys(S.seen.dyn).length >= 20; } }
  ];
  J.BADGES = BADGES;
  function learnedCount() { var n = 0; for (var k in S.topics) if (S.topics[k].st >= 2) n++; return n; }
  function totalQ() { var n = 0; for (var d in S.log) n += S.log[d].q; return n; }
  J.learnedCount = learnedCount; J.totalQ = totalQ;
  function checkBadges() {
    BADGES.forEach(function (b) {
      if (!S.badges[b.id] && b.test()) { S.badges[b.id] = todayStr(); J.emit('badge', b); }
    });
  }
  J.checkBadges = checkBadges;

  /* ---------- tiny event bus ---------- */
  var subs = {};
  J.on = function (ev, fn) { (subs[ev] = subs[ev] || []).push(fn); };
  J.emit = function (ev, data) { (subs[ev] || []).forEach(function (fn) { try { fn(data); } catch (e) { console.error(e); } }); };
})(window.JRF);
