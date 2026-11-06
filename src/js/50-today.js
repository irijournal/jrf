/* Today (home), More hub, Badges, Unit page */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;

  function taskDone(day, x, i) {
    var S = J.S(), tick = (S.planTicks || {})[day.date] || {};
    if (tick[i]) return true;
    var l = S.log[day.date] || { q: 0, u: {} };
    switch (x.k) {
      case 'learn': return x.ids.every(function (id) { return (S.topics[id] || {}).st >= 2; });
      case 'p1': return (S.topics[x.id] || {}).st >= 2;
      case 'p1drill': return ((l.u || {})[x.u] || [0])[0] >= 15;
      case 'practice': return l.q >= x.n;
      case 'unittest': return ((l.u || {})[x.u] || [0])[0] >= x.n;
      case 'revise': return day.date === J.date.today() && J.topicsDue().length === 0 && dueReviews().length === 0 && J.mistakesDue().length === 0 && (l.cards > 0 || l.revised > 0 || l.q > 0);
      case 'mock': return S.mocks.some(function (m) { return m.day === day.date; });
    }
    return false;
  }
  J.taskDone = taskDone;
  function dueReviews() { var S = J.S(); return J.cardsDue().filter(function (id) { return S.cards[id][2] > 0; }); }
  J.dueReviews = dueReviews;
  function toggleTick(day, i) { var S = J.S(); S.planTicks = S.planTicks || {}; var t = S.planTicks[day.date] = S.planTicks[day.date] || {}; t[i] = !t[i]; J.save(); }

  function learnedUnits() { var S = J.S(), u = {}; J.topics.forEach(function (t) { if ((S.topics[t.id] || {}).st >= 2) u[t.u] = 1; }); return Object.keys(u); }
  J.learnedUnits = learnedUnits;

  J.taskAction = function (x) {
    switch (x.k) {
      case 'learn': var first = x.ids.filter(function (id) { return (J.S().topics[id] || {}).st < 2; })[0] || x.ids[0]; return function () { U.go('learn-' + first); };
      case 'p1': return function () { U.go('learn-' + x.id); };
      case 'p1drill': return function () { J.startQuiz({ ids: G.sample(G.pool({ units: [x.u] }), 15), title: 'Paper 1 drill — ' + G.unit(x.u).name }); };
      case 'revise': case 'analyse': return function () { U.go('revise'); };
      case 'practice':
        return function () {
          var units = x.scope === 'week' ? weekUnits() : learnedUnits();
          var src = x.scope === 'mistakes' ? 'mistakes' : 'all';
          var pool = G.pool({ units: units.length ? units : null, src: src });
          if (!pool.length) pool = G.pool({ units: units.length ? units : ['H1'] });
          J.startQuiz({ ids: G.sample(pool, x.n), title: 'Daily practice' });
        };
      case 'weekly': return function () { U.go('revise'); };
      case 'sprint': return function () { U.go('unit-' + x.u); };
      case 'unittest': return function () { J.startQuiz({ ids: G.sample(G.pool({ units: [x.u] }), x.n), title: 'Unit test — Unit ' + G.unit(x.u).n, mode: 'test' }); };
      case 'mock': return function () { U.go('mock'); };
      case 'weak': return function () { U.go('reports'); };
      case 'light': return function () { U.go('timeline'); };
    }
    return function () { U.go('plan'); };
  };
  function weekUnits() {
    var p = J.planEnsure(), t = J.date.today(), u = {};
    p.days.forEach(function (d) { if (d.date <= t && J.date.diff(d.date, t) < 7) d.tasks.forEach(function (x) { if (x.k === 'learn') x.ids.forEach(function (id) { u[G.topic(id).u] = 1; }); }); });
    return Object.keys(u);
  }

  function funFact() {
    var all = []; J.topics.forEach(function (t) { (t.f || []).forEach(function (f) { all.push([f, t]); }); });
    var r = J.rng(J.hash('ff' + J.date.today())); return all[Math.floor(r() * all.length)];
  }

  J.V.today = function (root) {
    var S = J.S(), plan = J.planEnsure(), day = J.planToday(), dn = J.dayNumber(), total = S.profile.days, lv = J.level();
    var l = J.dayLog(), acc = U.pct(l.c, l.q);
    var left = Math.max(0, total - dn);

    if (!S.welcomed) {
      root.appendChild(h('div', { class: 'card hero' },
        h('p', { class: 'eyebrow' }, 'Welcome'),
        h('h1', null, '120 days. One small step at a time.'),
        h('p', null, 'This page always tells you the one thing to do next. Learn a topic in bite-size cards, revise what is due, practise NTA-style questions, and watch your streak grow. Everything is saved in this browser.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn primary', onclick: function () { S.welcomed = true; J.save(); U.route(); } }, 'Got it — let’s go'),
          h('a', { class: 'btn ghost', href: '#exam' }, 'How the exam works'),
          h('a', { class: 'btn ghost', href: '#tweaks' }, 'Set my start date & look'))));
    }

    root.appendChild(h('div', { class: 'dayline' },
      h('span', { class: 'pill accent' }, 'Day ', h('span', { class: 'daycount' }, String(Math.max(1, Math.min(dn, total)))), ' of ' + total),
      day ? h('span', { class: 'pill copper' }, J.phaseName(day.phase) + ' phase') : h('span', { class: 'pill warn' }, dn > total ? 'Plan finished — keep revising' : 'Plan starts ' + S.profile.start),
      h('span', { class: 'pill' }, left + ' days left'),
      S.streak.cur ? h('span', { class: 'pill copper' }, U.icon('flame', 14), S.streak.cur + ' ' + U.line('streak')) : null));

    // NEXT
    var tasks = day ? day.tasks : [{ k: 'revise' }, { k: 'practice', n: 30 }];
    var dayObj = day || { date: J.date.today(), tasks: tasks };
    var nextI = -1;
    for (var i = 0; i < tasks.length; i++) if (!taskDone(dayObj, tasks[i], i)) { nextI = i; break; }
    var nx = h('section', { class: 'next', 'aria-labelledby': 'next-h' });
    if (nextI >= 0) {
      var x = tasks[nextI];
      nx.appendChild(h('p', { class: 'eyebrow', id: 'next-h' }, 'Do this next'));
      nx.appendChild(h('p', { class: 'what' }, J.taskLabel(x)));
      if (x.k === 'learn') {
        var hrs = x.ids.reduce(function (s, id) { return s + G.topic(id).h; }, 0);
        nx.appendChild(h('p', { class: 'muted small' }, 'About ' + hrs + ' h of material in short cards. Do it in 25-minute rounds with the timer.'));
      }
      nx.appendChild(h('div', { class: 'row' },
        h('button', { class: 'btn primary big', onclick: J.taskAction(x) }, 'Start', U.icon('arrowR', 20)),
        h('button', { class: 'btn ghost', onclick: U.openTimer }, U.icon('timer', 18), 'Start a 25-min timer')));
    } else {
      nx.appendChild(h('p', { class: 'eyebrow', id: 'next-h' }, 'All done for today'));
      nx.appendChild(h('p', { class: 'what' }, U.line('good') + ' Today’s plan is complete.'));
      nx.appendChild(h('p', { class: 'muted' }, 'Extra credit if you want it: a 10-question sprint or 5 minutes of flashcards. Or rest — rest is part of the plan.'));
      nx.appendChild(h('div', { class: 'row' },
        h('button', { class: 'btn primary', onclick: quickSprint }, '10-question sprint'),
        h('a', { class: 'btn', href: '#revise' }, 'Flashcards')));
    }
    root.appendChild(nx);

    // behind?
    var behind = J.planBehind();
    if (behind.length) {
      root.appendChild(h('div', { class: 'card' },
        h('div', { class: 'row between' }, h('h3', null, behind.length + ' topic' + (behind.length > 1 ? 's' : '') + ' from earlier days are waiting'), h('span', { class: 'pill warn' }, 'No stress')),
        h('p', { class: 'muted small' }, 'Re-plan spreads the unfinished topics across the days you have left. Your end date stays the same.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn', onclick: function () { U.go('learn-' + behind[0]); } }, 'Learn “' + G.topic(behind[0]).t.slice(0, 40) + (G.topic(behind[0]).t.length > 40 ? '…' : '') + '”'),
          h('button', { class: 'btn ghost', onclick: function () { U.confirm('Re-plan from today?', 'Unfinished topics will be spread over the remaining days. Completed work is kept.', 'Re-plan', function () { J.planReplan(); U.toast('Plan updated'); U.route(); }); } }, 'Re-plan'))));
    }

    // checklist
    if (day) {
      var cl = h('section', { class: 'card', 'aria-labelledby': 'cl-h' }, h('div', { class: 'row between' }, h('h2', { id: 'cl-h' }, 'Today’s list'), h('a', { class: 'small', href: '#plan' }, 'Full plan')));
      tasks.forEach(function (x, i) {
        var done = taskDone(day, x, i);
        cl.appendChild(h('div', { class: 'row', style: { flexWrap: 'nowrap', alignItems: 'stretch' } },
          h('button', { class: 'check' + (done ? ' done' : ''), 'aria-pressed': String(done), onclick: function () { toggleTick(day, i); U.route(); }, title: 'Tick manually' },
            h('span', { class: 'box' }, done ? U.icon('check', 16) : ''), h('span', { class: 'lbl' }, J.taskLabel(x))),
          done ? null : h('button', { class: 'btn small', onclick: J.taskAction(x), 'aria-label': 'Open: ' + J.taskLabel(x) }, U.icon('arrowR', 16))));
      });
      root.appendChild(cl);
    }

    // stats & quests
    var qs = J.questsToday();
    root.appendChild(h('div', { class: 'grid2 hide-in-focus' },
      h('section', { class: 'card' },
        h('h3', null, 'Today so far'),
        h('div', { class: 'grid3' }, U.stat(l.q, 'questions'), U.stat(acc + '%', 'accuracy'), U.stat(l.min, 'focus min'), U.stat(l.xp, 'XP')),
        h('div', { class: 'lv' }, h('div', { class: 'row between small' }, h('span', null, 'Rank: ', h('b', null, lv.title)), h('span', { class: 'mono muted' }, lv.into + ' / ' + lv.step + ' XP')), U.bar(U.pct(lv.into, lv.step), 'copper')),
        h('div', { class: 'small muted' }, 'Daily goal: ' + S.profile.goalQ + ' questions'), U.bar(U.pct(l.q, S.profile.goalQ))),
      h('section', { class: 'card' },
        h('h3', null, 'Daily quests'),
        qs.map(function (x) { return h('div', { class: 'quest' }, h('span', { class: x.done ? 'muted' : '' }, x.q.t), h('span', { class: 'pill ' + (x.done ? 'good' : 'copper') }, x.done ? 'Done' : '+' + x.q.xp + ' XP'), U.bar(U.pct(Math.min(x.n, x.q.goal), x.q.goal), x.done ? 'good' : 'copper')); }))));

    // quick actions
    root.appendChild(h('section', { class: 'card hide-in-focus' },
      h('h3', null, 'Quick wins (5–10 min)'),
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: quickSprint }, U.icon('bolt', 18), '10-question sprint'),
        h('a', { class: 'btn', href: '#revise' }, U.icon('repeat', 18), 'Flashcards due'),
        h('a', { class: 'btn', href: '#timeline' }, U.icon('clock', 18), 'Timeline story'),
        h('a', { class: 'btn', href: '#maps' }, U.icon('map', 18), 'Map game'),
        h('a', { class: 'btn', href: '#dynasties' }, U.icon('crown', 18), 'Dynasties'),
        h('a', { class: 'btn', href: '#books' }, U.icon('book', 18), 'Book facts'))));

    var ff = funFact();
    if (ff) root.appendChild(h('section', { class: 'card hide-in-focus' }, h('p', { class: 'eyebrow' }, 'Fun fact of the day'), h('p', { class: 'fact' }, ff[0]), h('a', { class: 'small', href: '#learn-' + ff[1].id }, 'From: ' + ff[1].t)));
  };

  function quickSprint() {
    var units = learnedUnits();
    var pool = G.pool({ units: units.length ? units : null });
    J.startQuiz({ ids: G.sample(pool, 10), title: '10-question sprint' });
  }
  J.quickSprint = quickSprint;

  /* ---------- More hub ---------- */
  J.V.more = function (root) {
    var items = [
      ['plan', 'calendar', '4-month plan', 'Day-by-day plan with phases'],
      ['syllabus', 'list', 'Syllabus tracker', 'Paper 1 + History units, topic status'],
      ['dynasties', 'crown', 'Dynasties & rulers', '64 dynasties, 397 rulers, recall games'],
      ['timeline', 'clock', 'Timeline', 'Story mode + chronology game'],
      ['maps', 'map', 'Maps', 'Sites, edicts, battles, movements + map quiz'],
      ['books', 'book', 'Your books (every fact)', 'Load your PDFs → fact cards, quizzes, coverage'],
      ['pyq', 'scroll', 'PYQs & repeats', 'Add papers, find repeated questions'],
      ['mock', 'target', 'Full mock test', '150 questions, 3 hours, NTA style'],
      ['reports', 'chart', 'Progress reports', 'Daily, weekly, monthly'],
      ['exam', 'lamp', 'Understand the exam', 'Pattern, question types, strategy'],
      ['glossary', 'book', 'Glossary & mnemonics', 'Syllabus terms + every memory trick'],
      ['library', 'layers', 'Books & IGNOU map', 'Which chapter for which unit'],
      ['badges', 'star', 'Badges & rank', 'Your achievements'],
      ['tweaks', 'sliders', 'Tweaks', 'Theme, font, size, focus mode, timer, data']
    ];
    root.appendChild(h('h1', null, 'More'));
    root.appendChild(h('div', { class: 'dyn-grid' }, items.map(function (it) {
      return h('a', { class: 'dyn-card', href: '#' + it[0] }, h('div', { class: 'row' }, U.icon(it[1] === 'calendar' ? 'list' : it[1], 22), h('b', null, it[2])), h('span', { class: 'small muted' }, it[3]));
    })));
  };

  /* ---------- Badges ---------- */
  J.V.badges = function (root) {
    var S = J.S(), lv = J.level();
    root.appendChild(h('h1', null, 'Badges & rank'));
    root.appendChild(h('div', { class: 'card hero' },
      h('p', { class: 'eyebrow' }, 'Current rank'), h('h2', null, lv.title),
      h('div', { class: 'row between small' }, h('span', null, 'Total XP ', h('b', { class: 'mono' }, String(S.xp))), h('span', { class: 'mono muted' }, lv.into + ' / ' + lv.step + ' to next rank')),
      U.bar(U.pct(lv.into, lv.step), 'copper'),
      h('p', { class: 'small muted' }, 'Ranks: ' + J.TITLES.join(' → ')),
      h('p', { class: 'small muted' }, 'Streak freezes available: ' + S.freeze + ' (you earn one every 7 streak days, max 3). A freeze saves your streak if you miss one day.')));
    root.appendChild(h('div', { class: 'grid3' }, J.BADGES.map(function (b) {
      var got = S.badges[b.id];
      return h('div', { class: 'badge-tile' + (got ? ' got' : '') }, h('div', { class: 'row' }, U.icon(got ? 'star' : 'target', 18), h('b', null, b.t)), h('span', { class: 'small' }, b.d), got ? h('span', { class: 'tiny muted' }, 'Earned ' + got) : null);
    })));
  };

  /* ---------- Unit page (revision sprint) ---------- */
  J.V.unit = function (root, uid) {
    var u = G.unit(uid), S = J.S();
    if (!u) { U.go('syllabus'); return; }
    var ts = J.topics.filter(function (t) { return t.u === uid; });
    var learned = ts.filter(function (t) { return (S.topics[t.id] || {}).st >= 2; }).length;
    root.appendChild(h('div', null, h('p', { class: 'eyebrow' }, (u.paper === 1 ? 'Paper 1 · Unit ' : 'History · Unit ') + u.n), h('h1', null, u.name)));
    root.appendChild(h('div', { class: 'card' },
      h('p', { class: 'small' }, u.syl),
      h('div', { class: 'row between small' }, h('span', null, learned + ' / ' + ts.length + ' topics learned'), h('span', { class: 'mono muted' }, U.pct(learned, ts.length) + '%')), U.bar(U.pct(learned, ts.length)),
      u.books && u.books.length ? h('p', { class: 'small muted' }, 'Books: ' + u.books.join(' · ')) : null,
      u.ignou && u.ignou.length ? h('p', { class: 'small muted' }, 'IGNOU MA (MAH): ' + u.ignou.join(' · ')) : null));
    root.appendChild(h('div', { class: 'card' },
      h('h2', null, 'Revision sprint'),
      h('p', { class: 'muted small' }, '1) Flip through each topic in recall mode. 2) Do this unit’s flashcards. 3) Take a 50-question unit test.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', onclick: function () { var n = J.unlockUnitCards(uid); ts.forEach(function (t) { if ((S.topics[t.id] || {}).st >= 2) J.unlockCards(t.id); }); U.toast(n ? n + ' new cards added for this unit' : 'Unit deck ready'); U.go('cards-' + uid); } }, 'Unit flashcards'),
        h('button', { class: 'btn', onclick: function () { J.startQuiz({ ids: G.sample(G.pool({ units: [uid] }), 50), title: 'Unit test — Unit ' + u.n, mode: 'test' }); } }, 'Unit test (50, timed)'),
        h('button', { class: 'btn ghost', onclick: function () { J.startQuiz({ ids: G.sample(G.pool({ units: [uid], src: 'mistakes' }), 30), title: 'Unit ' + u.n + ' mistakes' }); } }, 'Only my mistakes'))));
    var list = h('div', { class: 'card' }, h('h2', null, 'Topics'));
    ts.forEach(function (t) {
      var st = (S.topics[t.id] || {}).st || 0;
      list.appendChild(h('div', { class: 'topic-row' },
        h('span', { class: 'status-dot s' + st, title: ['Not started', 'Started', 'Learned', 'Mastered'][st] }),
        h('a', { class: 'nm', href: '#learn-' + t.id }, t.t),
        h('span', { class: 'pill' }, t.h + ' h'),
        h('a', { class: 'btn small', href: '#learn-' + t.id + (st >= 2 ? '' : '') }, st >= 2 ? 'Recall' : 'Learn')));
    });
    root.appendChild(list);
  };
})(window.JRF);
