/* Practice builder, quiz runner (practice / timed test), results, full mock */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;
  var ROMAN_UNIT = function (u) { var x = G.unit(u); return x ? (x.paper === 1 ? 'P1 · ' : 'Unit ') + x.n : u; };
  var KLABEL = { mcq: 'MCQ', mt: 'Matching', ch: 'Chronology', st: 'Statements', s2: 'Statement I/II', ar: 'Assertion–Reason', math: 'Maths', di: 'Data interpretation', cp: 'Comprehension' };

  J.startQuiz = function (o) {
    var ids = (o.ids || []).filter(Boolean);
    if (!ids.length) { U.toast('No questions match these filters yet.'); return; }
    J.session = { ids: ids, title: o.title || 'Practice', mode: o.mode || 'practice', i: 0, ans: {}, marked: {}, start: Date.now(), limit: o.limit || (o.mode === 'test' ? Math.round(ids.length * 72) : 0), topic: o.topic, mock: !!o.mock, xp: 0, recorded: {}, origin: location.hash || '#today' };
    U.go('quiz');
  };

  /* ---------- question renderer ---------- */
  function renderQ(q, opts) {
    opts = opts || {};
    var box = h('div', { class: 'qcard' });
    var meta = h('div', { class: 'qmeta' },
      h('span', { class: 'pill accent' }, ROMAN_UNIT(q.u)),
      h('span', { class: 'pill' }, KLABEL[q.k] || (q.math ? 'Maths' : 'MCQ')),
      h('span', { class: 'pill ' + (q.gen ? '' : 'copper') }, q.gen ? 'Generated' : 'Hand-written'));
    if (J.pyqMatches) { var m = J.pyqMatches(q); if (m && m.length) meta.appendChild(h('span', { class: 'pill warn', title: 'Similar to your saved PYQs' }, 'PYQ match: ' + m.map(function (x) { return x.year; }).join(', '))); }
    box.appendChild(meta);
    if (q.passage) box.appendChild(h('details', { class: 'fold', open: true }, h('summary', null, 'Passage: ' + q.passage.t), h('div', { class: 'in' }, h('div', { class: 'passage' }, q.passage.text))));
    box.appendChild(h('div', { class: 'qtext' }, q.q));
    if (q.table) {
      var mt = h('div', { class: 'match' },
        h('div', { class: 'mcol' }, h('div', { class: 'h' }, 'List I · ' + q.table.h[0]), q.table.l.map(function (x) { return h('div', null, x); })),
        h('div', { class: 'mcol' }, h('div', { class: 'h' }, 'List II · ' + q.table.h[1]), q.table.r.map(function (x) { return h('div', null, x); })));
      box.appendChild(mt);
      box.appendChild(h('p', { class: 'small muted' }, 'Choose the correct answer from the options given below:'));
    }
    if (q.grid) {
      box.appendChild(h('div', { class: 'scrollx' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, q.grid.head.map(function (x) { return h('th', null, x); }))), h('tbody', null, q.grid.rows.map(function (r) { return h('tr', null, r.map(function (c, ci) { return h('td', { class: ci ? 'num' : 'mono' }, String(c)); })); })))));
    }
    var optsEl = h('div', { class: 'opts', role: 'group', 'aria-label': 'Options' });
    q.o.forEach(function (o, k) {
      var cls = 'opt';
      if (opts.picked === k) cls += ' sel';
      if (opts.reveal) { if (k === q.a) cls += ' right'; else if (opts.picked === k) cls += ' wrong'; }
      optsEl.appendChild(h('button', { class: cls, disabled: opts.reveal ? true : null, onclick: function () { if (opts.onPick) opts.onPick(k); } }, h('span', { class: 'k' }, String(k + 1)), h('span', null, o)));
    });
    box.appendChild(optsEl);
    if (opts.reveal) {
      var ok = opts.picked === q.a;
      var ex = h('div', { class: 'explain ' + (ok ? 'ok' : 'no'), role: 'status' },
        h('b', null, opts.picked == null ? 'Answer: (' + (q.a + 1) + ') ' + q.o[q.a] : ok ? U.line('good') : U.line('bad') + ' Correct: (' + (q.a + 1) + ') ' + q.o[q.a]),
        q.ex ? h('span', null, q.ex) : null,
        h('span', { class: 'tiny muted' }, q.src || ''),
        q.topic ? h('a', { class: 'small', href: '#learn-' + q.topic }, 'Open the topic') : null);
      box.appendChild(ex);
    }
    return box;
  }
  J.renderQ = renderQ;

  /* ---------- runner ---------- */
  J.V.quiz = function (root) {
    var s = J.session;
    if (!s) { U.go('practice'); return; }
    var head = h('div', { class: 'row between' }), body = h('div'), foot = h('div', { class: 'row between' });
    root.appendChild(head); root.appendChild(body); root.appendChild(foot);
    var timerEl = h('span', { class: 'pill mono' }), tmr = null;
    function left() { return s.limit ? Math.max(0, s.limit - Math.round((Date.now() - s.start) / 1000)) : 0; }
    function fmt(sec) { var hh = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), ss = sec % 60; return (hh ? hh + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss; }
    if (s.mode !== 'practice' && !s.done) {
      tmr = setInterval(function () { timerEl.textContent = fmt(left()); if (left() <= 0) { clearInterval(tmr); submit(); } }, 1000);
    }
    function onKey(e) {
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      if (s.done) return;
      var q = G.get(s.ids[s.i]);
      if (/^[1-4]$/.test(e.key) && q && +e.key <= q.o.length) { pick(+e.key - 1); }
      else if (e.key === 'Enter' || e.key === 'ArrowRight') { if (s.mode === 'practice' && s.ans[s.i] == null) return; next(); }
      else if (e.key === 'ArrowLeft' && s.mode !== 'practice') { s.i = Math.max(0, s.i - 1); draw(); }
    }
    document.addEventListener('keydown', onKey);
    U.cleanup = function () { clearInterval(tmr); document.removeEventListener('keydown', onKey); };

    function pick(k) {
      var q = G.get(s.ids[s.i]);
      if (s.mode === 'practice') {
        if (s.ans[s.i] != null) return;
        s.ans[s.i] = k;
        var ok = k === q.a;
        s.xp += J.recordAnswer(q.id, ok, q.u, q.k);
        s.recorded[s.i] = 1;
        U.sound(ok ? 'good' : 'bad');
      } else { s.ans[s.i] = k; }
      draw();
    }
    function next() {
      if (s.i < s.ids.length - 1) { s.i++; draw(); }
      else if (s.mode === 'practice') finish(); else submitAsk();
    }
    function submitAsk() {
      var unanswered = s.ids.length - Object.keys(s.ans).length;
      U.confirm('Submit the test?', unanswered ? unanswered + ' question(s) are unanswered. There is no negative marking, so guessing does not cost you.' : 'All questions answered.', 'Submit', submit);
    }
    function submit() {
      if (s.done) return;
      s.ids.forEach(function (id, i) { var q = G.get(id); if (s.ans[i] != null && !s.recorded[i]) { s.xp += J.recordAnswer(id, s.ans[i] === q.a, q.u, q.k); s.recorded[i] = 1; } });
      finish();
    }
    function finish() {
      s.done = true; clearInterval(tmr);
      s.end = Date.now();
      if (s.mock) {
        var r = summarize(s), S = J.S();
        S.mocks.push({ day: J.date.today(), score: r.correct, total: r.total, p1: r.paper[1], p2: r.paper[2], units: r.units, min: Math.round((s.end - s.start) / 60000) });
        J.addXP(200, 'mock'); J.checkBadges();
      }
      J.save(true);
      draw();
    }
    function draw() {
      head.innerHTML = ''; body.innerHTML = ''; foot.innerHTML = '';
      if (s.done) { drawResults(); return; }
      var q = G.get(s.ids[s.i]);
      var answered = Object.keys(s.ans).length;
      head.appendChild(h('div', { class: 'stack', style: { gap: '4px', flex: '1' } },
        h('div', { class: 'row between' }, h('h2', null, s.title), h('div', { class: 'row' }, s.mode === 'practice' && J.S().combo >= 3 ? h('span', { class: 'combo' }, 'Combo ×' + J.S().combo) : null, s.mode !== 'practice' ? timerEl : null, h('span', { class: 'pill mono' }, (s.i + 1) + ' / ' + s.ids.length))),
        U.bar(U.pct(s.mode === 'practice' ? answered : s.i + 1, s.ids.length))));
      if (s.mode !== 'practice') timerEl.textContent = fmt(left());
      if (!q) { body.appendChild(h('p', null, 'This question could not be generated. Skipping.')); next(); return; }
      var picked = s.ans[s.i];
      body.appendChild(renderQ(q, { picked: picked, reveal: s.mode === 'practice' && picked != null, onPick: pick }));
      if (s.mode === 'practice') {
        foot.appendChild(h('button', { class: 'btn ghost', onclick: function () { U.confirm('End this set?', 'Your answers so far are saved.', 'End set', finish); } }, 'End'));
        foot.appendChild(picked == null ? h('button', { class: 'btn', onclick: function () { if (s.i < s.ids.length - 1) { s.i++; draw(); } else finish(); } }, 'Skip') : h('button', { class: 'btn primary', onclick: next, autofocus: true }, s.i < s.ids.length - 1 ? 'Next' : 'See results', U.icon('arrowR', 18)));
      } else {
        foot.appendChild(h('div', { class: 'row' },
          h('button', { class: 'btn', disabled: s.i === 0, onclick: function () { s.i--; draw(); } }, U.icon('arrowL', 18), 'Prev'),
          h('button', { class: 'btn ' + (s.marked[s.i] ? 'bad' : 'ghost'), onclick: function () { s.marked[s.i] = !s.marked[s.i]; draw(); } }, U.icon('flag', 16), s.marked[s.i] ? 'Marked' : 'Mark for review'),
          picked != null ? h('button', { class: 'btn ghost', onclick: function () { delete s.ans[s.i]; draw(); } }, 'Clear') : null));
        foot.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: next }, s.i < s.ids.length - 1 ? 'Save & Next' : 'Submit'), h('button', { class: 'btn ghost', onclick: submitAsk }, 'Submit test')));
        var pal = h('div', { class: 'palette', 'aria-label': 'Question palette' });
        s.ids.forEach(function (id, i) { pal.appendChild(h('button', { class: (s.ans[i] != null ? 'ans ' : '') + (s.marked[i] ? 'mark ' : '') + (i === s.i ? 'cur' : ''), onclick: function () { s.i = i; draw(); }, 'aria-label': 'Question ' + (i + 1) }, String(i + 1))); });
        body.appendChild(h('details', { class: 'fold', open: s.ids.length <= 60 }, h('summary', null, 'Question palette', h('span', { class: 'small muted' }, answered + ' answered · ' + Object.keys(s.marked).filter(function (k) { return s.marked[k]; }).length + ' marked')), h('div', { class: 'in' }, pal)));
      }
      body.appendChild(h('p', { class: 'tiny muted' }, 'Keys: ', h('span', { class: 'kbd' }, '1'), '–', h('span', { class: 'kbd' }, '4'), ' answer · ', h('span', { class: 'kbd' }, 'Enter'), ' next'));
    }
    function drawResults() {
      var r = summarize(s), mins = Math.max(1, Math.round((s.end - s.start) / 60000));
      head.appendChild(h('h1', null, 'Results — ' + s.title));
      body.appendChild(h('div', { class: 'card hero' },
        h('div', { class: 'grid3' }, U.stat(r.correct + ' / ' + r.total, 'correct'), U.stat(r.acc + '%', 'accuracy'), U.stat(mins + ' min', 'time'), U.stat('+' + s.xp, 'XP'), s.mock ? U.stat(r.correct * 2 + ' / ' + r.total * 2, 'marks (2 each)') : null),
        h('p', null, r.acc >= 70 ? U.line('good') + ' That’s JRF-zone accuracy.' : r.acc >= 50 ? 'Good base. The wrong ones are now in your revision queue.' : 'Every wrong answer is now a flashcard-style revision item. That is how you get better.')));
      var ut = h('table', { class: 'tbl' }, h('thead', null, h('tr', null, h('th', null, 'Unit'), h('th', null, 'Correct'), h('th', null, 'Accuracy'))), h('tbody', null, Object.keys(r.units).sort().map(function (u) { var x = r.units[u]; return h('tr', null, h('td', null, ROMAN_UNIT(u) + ' — ' + (G.unit(u) || {}).name), h('td', { class: 'num' }, x[1] + '/' + x[0]), h('td', { class: 'num' }, U.pct(x[1], x[0]) + '%')); })));
      body.appendChild(h('div', { class: 'card' }, h('h3', null, 'By unit'), h('div', { class: 'scrollx' }, ut)));
      var wrong = s.ids.map(function (id, i) { return [id, i]; }).filter(function (x) { var q = G.get(x[0]); return q && s.ans[x[1]] !== q.a; });
      if (wrong.length) {
        var rv = h('div', { class: 'stack' });
        wrong.forEach(function (x) { var q = G.get(x[0]); rv.appendChild(h('details', { class: 'fold' }, h('summary', null, h('span', null, (x[1] + 1) + '. ' + q.q.split('\n')[0].slice(0, 90) + (q.q.length > 90 ? '…' : '')), h('span', { class: 'pill bad' }, s.ans[x[1]] == null ? 'Skipped' : 'Wrong')), h('div', { class: 'in' }, renderQ(q, { picked: s.ans[x[1]], reveal: true })))); });
        body.appendChild(h('div', { class: 'card' }, h('h3', null, 'Review (' + wrong.length + ')'), rv));
      }
      foot.appendChild(h('div', { class: 'row' },
        wrong.length ? h('button', { class: 'btn primary', onclick: function () { J.startQuiz({ ids: wrong.map(function (x) { return x[0]; }), title: 'Retry mistakes' }); } }, 'Retry the ' + wrong.length + ' wrong') : null,
        h('a', { class: 'btn', href: '#practice' }, 'New set'),
        h('a', { class: 'btn ghost', href: '#today' }, 'Back to Today')));
      if (s.correctBurst !== true && r.acc >= 80 && r.total >= 10) { s.correctBurst = true; U.burst(); }
    }
    draw();
  };
  function summarize(s) {
    var units = {}, paper = { 1: [0, 0], 2: [0, 0] }, correct = 0;
    s.ids.forEach(function (id, i) {
      var q = G.get(id); if (!q) return;
      var ok = s.ans[i] === q.a; if (ok) correct++;
      var u = units[q.u] || (units[q.u] = [0, 0]); u[0]++; if (ok) u[1]++;
      var pp = q.u.charAt(0) === 'P' ? 1 : 2; paper[pp][0]++; if (ok) paper[pp][1]++;
    });
    return { units: units, paper: paper, correct: correct, total: s.ids.length, acc: U.pct(correct, s.ids.length) };
  }

  /* ---------- practice builder ---------- */
  J.V.practice = function (root) {
    var S = J.S(), f = S.pf || (S.pf = { units: [], kinds: [], src: 'all', n: 20, mode: 'practice' });
    var cnt = G.countBy();
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'Practice'), h('span', { class: 'pill accent mono' }, cnt.total.toLocaleString('en-IN') + ' questions')));
    var lu = J.learnedUnits();
    root.appendChild(h('section', { class: 'card hero' },
      h('h2', null, 'Quick start'),
      h('div', { class: 'grid2' },
        quick('Mixed from what you’ve learned', 20, function () { return G.pool({ units: lu.length ? lu : ['H1'] }); }),
        quick('My mistakes', 20, function () { return G.pool({ src: 'mistakes' }); }),
        quick('Chronology drill', 10, function () { return G.pool({ kinds: ['ch'], units: lu.length ? lu : null }); }),
        quick('Match List I–II drill', 10, function () { return G.pool({ kinds: ['mt'], units: lu.length ? lu : null }); }),
        quick('Statements & Assertion–Reason', 10, function () { return G.pool({ kinds: ['st', 's2', 'ar'], units: lu.length ? lu : null }); }),
        quick('Paper 1: maths, logic & DI', 15, function () { return G.pool({ units: ['P5', 'P6', 'P7'] }); }))));

    var avail = h('span', { class: 'pill' });
    function refresh() { var n = G.pool(poolFilter()).length; avail.textContent = n.toLocaleString('en-IN') + ' match'; }
    function poolFilter() { return { units: f.units, kinds: f.kinds, src: f.src }; }
    function chips(list, key) {
      return h('div', { class: 'togglechips' }, list.map(function (it) {
        var on = f[key].indexOf(it[0]) >= 0;
        return h('button', { 'aria-pressed': String(on), onclick: function (e) { var i = f[key].indexOf(it[0]); if (i >= 0) f[key].splice(i, 1); else f[key].push(it[0]); e.currentTarget.setAttribute('aria-pressed', String(i < 0)); J.save(); refresh(); } }, it[1]);
      }));
    }
    var hist = J.units.filter(function (u) { return u.paper === 2; }).map(function (u) { return [u.id, 'Unit ' + u.n]; });
    var p1 = J.units.filter(function (u) { return u.paper === 1; }).map(function (u) { return [u.id, u.name.split(' ')[0] + (u.name.split(' ')[1] && u.name.split(' ')[0].length < 6 ? ' ' + u.name.split(' ')[1] : '')]; });
    root.appendChild(h('section', { class: 'card' },
      h('div', { class: 'row between' }, h('h2', null, 'Build your own set'), avail),
      h('p', { class: 'eyebrow' }, 'History units (none selected = all)'), chips(hist, 'units'),
      h('p', { class: 'eyebrow' }, 'Paper 1 units'), chips(p1, 'units'),
      h('p', { class: 'eyebrow' }, 'Question types (none = all)'), chips([['mcq', 'MCQ'], ['mt', 'Match I–II'], ['ch', 'Chronology'], ['st', 'Statements'], ['s2', 'Statement I/II'], ['ar', 'Assertion–Reason'], ['math', 'Maths'], ['di', 'DI'], ['cp', 'Comprehension']], 'kinds'),
      h('p', { class: 'eyebrow' }, 'Source'), U.seg([['all', 'All'], ['unseen', 'Unseen'], ['mistakes', 'Mistakes'], ['learned', 'Learned units'], ['hand', 'Hand-written']], f.src, function (v) { f.src = v; J.save(); U.route(); }, 'Source'),
      h('p', { class: 'eyebrow' }, 'How many'), U.seg([[10, '10'], [20, '20'], [30, '30'], [50, '50'], [100, '100']], f.n, function (v) { f.n = v; J.save(); U.route(); }, 'Count'),
      h('p', { class: 'eyebrow' }, 'Mode'), U.seg([['practice', 'Practice (instant answers)'], ['test', 'Timed test (NTA style)']], f.mode, function (v) { f.mode = v; J.save(); U.route(); }, 'Mode'),
      h('div', { class: 'row' }, h('button', { class: 'btn primary big', onclick: function () { J.startQuiz({ ids: G.sample(G.pool(poolFilter()), f.n), title: 'Custom set', mode: f.mode }); } }, 'Start', U.icon('arrowR', 20)), h('a', { class: 'btn', href: '#mock' }, 'Full mock (150)'))));
    refresh();

    var hand = cnt.hand, gen = cnt.total - hand;
    root.appendChild(h('details', { class: 'fold' }, h('summary', null, 'What is in the question bank?'), h('div', { class: 'in' },
      h('p', { class: 'small' }, hand + ' hand-written questions (including comprehension passages) plus ' + gen.toLocaleString('en-IN') + ' questions generated from checked fact tables: 60 dynasties with 380 rulers, ~330 dated events, ~1,300 fact pairs (books, travellers, sites, inscriptions, battles, Acts, commissions, organisations, newspapers, INC sessions, syllabus terms, historiography), ~250 map places, and Paper 1 maths, logic and DI generators.'),
      h('p', { class: 'small muted' }, 'Every generated question follows NTA formats (MCQ, List I–II matching, chronology, multi-statement, Statement I/II). Each has a fixed ID, so your mistakes come back for revision.'),
      h('div', { class: 'scrollx' }, h('table', { class: 'tbl' }, h('tbody', null, J.units.map(function (u) { return h('tr', null, h('td', null, (u.paper === 1 ? 'Paper 1 · ' : 'Unit ' + u.n + ' · ') + u.name), h('td', { class: 'num' }, (cnt.units[u.id] || 0).toLocaleString('en-IN'))); })))))));
  };
  function quick(label, n, poolFn) {
    return h('button', { class: 'btn', style: { justifyContent: 'space-between' }, onclick: function () { var p = poolFn(); if (!p.length) { U.toast(label === 'My mistakes' ? 'No mistakes yet — nice.' : 'Nothing here yet.'); return; } J.startQuiz({ ids: G.sample(p, n), title: label }); } }, h('span', null, label), h('span', { class: 'pill' }, String(n)));
  }

  /* ---------- full mock ---------- */
  J.buildMock = function (seed) {
    var r = J.rng(J.hash('mock|' + seed)), ids = [];
    // Paper 1: 5 per unit; comprehension = one passage; DI = one set
    ['P1', 'P2', 'P4', 'P5', 'P6', 'P8', 'P9', 'P10'].forEach(function (u) { ids = ids.concat(G.sample(G.pool({ units: [u] }), 5, seed + u)); });
    var pi = Math.floor(r() * J.passages.length); for (var k = 0; k < 5; k++) ids.splice(10 + k, 0, 'cp|' + pi + '|' + k);
    var set = Math.floor(r() * 800); for (var d = 0; d < 5; d++) ids.splice(30 + d, 0, 'di|' + set + '|' + d);
    ids = ids.slice(0, 50);
    ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'].forEach(function (u) {
      var hand = G.pool({ units: [u], src: 'hand' }), gen = G.pool({ units: [u] }).filter(function (x) { return x.charAt(0) !== 'h'; });
      ids = ids.concat(G.sample(hand, 4, seed + u + 'h'), G.sample(gen, 6, seed + u + 'g'));
    });
    return ids;
  };
  J.V.mock = function (root) {
    var S = J.S();
    root.appendChild(h('h1', null, 'Full mock test'));
    root.appendChild(h('div', { class: 'card hero' },
      h('dl', { class: 'kv' },
        h('dt', null, 'Questions'), h('dd', null, '150 (Paper 1: 50 · Paper 2 History: 100)'),
        h('dt', null, 'Time'), h('dd', null, '3 hours, one sitting (as in the NTA CBT)'),
        h('dt', null, 'Marks'), h('dd', null, '2 per correct answer · no negative marking'),
        h('dt', null, 'Mix'), h('dd', null, 'Paper 1: 5 per unit incl. one passage & one DI set. History: 10 per unit (4 hand-written + 6 generated).')),
      h('p', { class: 'small muted' }, 'Tip: answer every question — there is no penalty for guessing. Use “Mark for review” and come back.'),
      h('div', { class: 'row' }, h('button', { class: 'btn primary big', onclick: function () { J.startQuiz({ ids: J.buildMock(Date.now()), title: 'Full mock', mode: 'test', limit: 180 * 60, mock: true }); } }, 'Start the 3-hour mock'),
        h('button', { class: 'btn', onclick: function () { J.startQuiz({ ids: J.buildMock(Date.now()).slice(50), title: 'History-only mock (100)', mode: 'test', limit: 120 * 60, mock: true }); } }, 'History only (100, 2 h)'))));
    if (S.mocks.length) {
      root.appendChild(h('div', { class: 'card' }, h('h2', null, 'Your mocks'),
        U.barChart(S.mocks.slice(-12).map(function (m, i) { return { l: m.day.slice(5), a: m.total, b: m.score }; }), { label: 'Mock scores' }),
        h('div', { class: 'scrollx' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, h('th', null, 'Date'), h('th', null, 'Score'), h('th', null, 'Marks'), h('th', null, 'Paper 1'), h('th', null, 'History'))), h('tbody', null, S.mocks.slice().reverse().map(function (m) { return h('tr', null, h('td', { class: 'mono' }, m.day), h('td', { class: 'num' }, m.score + '/' + m.total), h('td', { class: 'num' }, m.score * 2 + '/' + m.total * 2), h('td', { class: 'num' }, m.p1 ? m.p1[1] + '/' + m.p1[0] : '–'), h('td', { class: 'num' }, m.p2 ? m.p2[1] + '/' + m.p2[0] : '–')); }))))));
    }
  };
})(window.JRF);
