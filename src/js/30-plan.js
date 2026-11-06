/* 120-day plan: Phase 1 Build (learn everything, weekly review days), Phase 2 Revise (unit sprints + unit tests),
   Phase 3 Mock (full mocks + analysis). Re-plan spreads the unfinished topics over the days left. */
(function (J) {
  'use strict';
  var D = J.date;
  var HIST = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'];
  var P1 = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];

  function build(start, totalDays, learned) {
    learned = learned || {};
    var hist = J.topics.filter(function (t) { return t.u.charAt(0) === 'H' && !learned[t.id]; });
    var p1 = J.topics.filter(function (t) { return t.u.charAt(0) === 'P' && !learned[t.id]; });
    var n = Math.max(14, totalDays);
    var buildDays = Math.round(n * 0.70), reviseDays = Math.round(n * 0.175), mockDays = n - buildDays - reviseDays;
    var days = [];
    var studyIdx = []; // indexes of build days that are study days (not weekly review)
    for (var d = 0; d < buildDays; d++) {
      var weekly = (d + 1) % 7 === 0;
      days.push({ d: d, date: D.add(start, d), phase: 1, weekly: weekly, tasks: [] });
      if (!weekly) studyIdx.push(d);
    }
    // History topics by cumulative hours
    var totalH = hist.reduce(function (s, t) { return s + t.h; }, 0) || 1, cum = 0;
    hist.forEach(function (t) {
      var slot = Math.min(studyIdx.length - 1, Math.floor((cum / totalH) * studyIdx.length));
      cum += t.h;
      var day = days[studyIdx[slot]];
      var lt = day.tasks.filter(function (x) { return x.k === 'learn'; })[0];
      if (!lt) { lt = { k: 'learn', ids: [] }; day.tasks.push(lt); }
      lt.ids.push(t.id);
    });
    // Paper 1 topics spread evenly; other study days get a Paper 1 drill
    var every = Math.max(1, Math.floor(studyIdx.length / Math.max(1, p1.length)));
    var p1i = 0, drillU = 0;
    studyIdx.forEach(function (di, k) {
      var day = days[di];
      if (k % every === 0 && p1i < p1.length) { day.tasks.push({ k: 'p1', id: p1[p1i++].id }); }
      else { day.tasks.push({ k: 'p1drill', u: P1[[4, 5, 6, 7, 8, 9, 3, 0, 1][drillU++ % 9]] }); }
      day.tasks.push({ k: 'revise' });
      day.tasks.push({ k: 'practice', n: 30 });
    });
    days.forEach(function (day) {
      if (day.weekly) day.tasks = [{ k: 'weekly' }, { k: 'revise' }, { k: 'practice', n: 50, scope: 'week' }];
    });
    // Phase 2: unit sprints
    var per = Math.max(1, Math.floor((reviseDays - 1) / HIST.length));
    for (var r = 0; r < reviseDays; r++) {
      var dd = buildDays + r, u = HIST[Math.min(HIST.length - 1, Math.floor(r / per))];
      var last = r === reviseDays - 1;
      days.push({ d: dd, date: D.add(start, dd), phase: 2, tasks: last ? [{ k: 'mock' }, { k: 'analyse' }] : [{ k: 'sprint', u: u }, { k: 'revise' }, { k: 'unittest', u: u, n: 50 }, { k: 'p1drill', u: P1[r % 10] }] });
    }
    // Phase 3: mocks on alternate days
    for (var m = 0; m < mockDays; m++) {
      var d3 = buildDays + reviseDays + m, isLast = m >= mockDays - 2;
      var tasks = isLast ? [{ k: 'light' }, { k: 'revise' }] : (m % 2 === 0 ? [{ k: 'mock' }, { k: 'analyse' }] : [{ k: 'weak' }, { k: 'revise' }, { k: 'practice', n: 60, scope: 'mistakes' }]);
      days.push({ d: d3, date: D.add(start, d3), phase: 3, tasks: tasks });
    }
    return { start: start, n: n, made: D.today(), days: days };
  }

  J.planEnsure = function () {
    var S = J.S();
    if (!S.plan || !S.plan.days || S.plan.start !== S.profile.start && !S.plan.replanned) {
      S.plan = build(S.profile.start, S.profile.days);
      J.save();
    }
    return S.plan;
  };
  J.planRebuild = function () {
    var S = J.S();
    S.plan = build(S.profile.start, S.profile.days); J.save(); return S.plan;
  };
  /* Re-plan: keep the end date, spread what is left from today. */
  J.planReplan = function () {
    var S = J.S(), end = D.add(S.profile.start, S.profile.days - 1), today = D.today();
    var left = Math.max(14, D.diff(today, end) + 1), learned = {};
    for (var k in S.topics) if (S.topics[k].st >= 2) learned[k] = 1;
    S.plan = build(today, left, learned); S.plan.replanned = true; J.save(); return S.plan;
  };
  J.planToday = function () {
    var p = J.planEnsure(), t = D.today();
    for (var i = 0; i < p.days.length; i++) if (p.days[i].date === t) return p.days[i];
    return null;
  };
  J.dayNumber = function () { var S = J.S(); return D.diff(S.profile.start, D.today()) + 1; };
  J.phaseName = function (ph) { return ph === 1 ? 'Build' : ph === 2 ? 'Revise' : 'Mock'; };
  /* How far behind: topics scheduled up to yesterday that are not learned */
  J.planBehind = function () {
    var p = J.planEnsure(), t = D.today(), S = J.S(), due = [];
    p.days.forEach(function (day) {
      if (day.date >= t) return;
      day.tasks.forEach(function (x) {
        if (x.k === 'learn') x.ids.forEach(function (id) { if (!(S.topics[id] && S.topics[id].st >= 2)) due.push(id); });
        if (x.k === 'p1' && !(S.topics[x.id] && S.topics[x.id].st >= 2)) due.push(x.id);
      });
    });
    return due;
  };
  J.taskLabel = function (x) {
    var G = J.G;
    switch (x.k) {
      case 'learn': return 'Learn: ' + x.ids.map(function (id) { return G.topic(id).t; }).join(' + ');
      case 'p1': return 'Paper 1: ' + G.topic(x.id).t;
      case 'p1drill': return 'Paper 1 drill: ' + G.unit(x.u).name + ' (15 questions)';
      case 'revise': return 'Revise everything due today';
      case 'practice': return 'Practice ' + x.n + ' questions' + (x.scope === 'mistakes' ? ' from your mistakes' : x.scope === 'week' ? ' from this week’s units' : ' from learned units');
      case 'weekly': return 'Weekly review: flip through this week’s topics and mnemonics';
      case 'sprint': return 'Revision sprint: Unit ' + G.unit(x.u).n + ' — ' + G.unit(x.u).name;
      case 'unittest': return 'Unit test: Unit ' + G.unit(x.u).n + ' (' + x.n + ' questions, timed)';
      case 'mock': return 'Full mock test (150 questions, 3 hours)';
      case 'analyse': return 'Analyse the mock: re-attempt every wrong answer';
      case 'weak': return 'Fix weak topics (lowest accuracy first)';
      case 'light': return 'Light day: mnemonics, timeline story mode, sleep well';
    }
    return x.k;
  };
})(window.JRF);
