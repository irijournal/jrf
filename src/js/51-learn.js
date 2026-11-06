/* Learn (topic lessons), Syllabus tracker, Plan view */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;

  /* indented text → tree */
  U.tree = function (text) {
    var lines = text.split('\n').filter(function (l) { return l.trim(); });
    var root = { kids: [], lvl: -1 }, stack = [root];
    lines.forEach(function (l) {
      var lvl = l.match(/^ */)[0].length, node = { t: l.trim(), lvl: lvl, kids: [] };
      while (stack.length > 1 && stack[stack.length - 1].lvl >= lvl) stack.pop();
      stack[stack.length - 1].kids.push(node); stack.push(node);
    });
    function render(n, depth) {
      var el = h('div', { class: 'stack', style: { gap: '4px' } }, h('div', { class: 'node l' + Math.min(depth, 4) }, h('span', { class: 'dot' }), h('span', null, n.t)));
      if (n.kids.length) el.appendChild(h('div', { class: 'kids' }, n.kids.map(function (k) { return render(k, depth + 1); })));
      return el;
    }
    return h('div', { class: 'tree' }, root.kids.map(function (k) { return render(k, 0); }));
  };

  function topicNav(t) {
    var all = J.topics, i = all.indexOf(t), prev = all[i - 1], next = all[i + 1];
    return h('div', { class: 'row between' },
      prev ? h('a', { class: 'btn ghost small', href: '#learn-' + prev.id }, U.icon('arrowL', 16), 'Previous') : h('span'),
      next ? h('a', { class: 'btn ghost small', href: '#learn-' + next.id }, 'Next topic', U.icon('arrowR', 16)) : h('span'));
  }

  function sections(t) {
    var out = [];
    (t.p || []).forEach(function (p, i) { out.push({ k: 'p', i: i, body: U.mdEl('div', p) }); });
    if (t.d) out.push({ k: 'd', body: h('div', { class: 'stack' }, h('p', { class: 'eyebrow' }, 'Diagram'), U.tree(t.d)) });
    (t.m || []).forEach(function (m) { out.push({ k: 'm', body: h('div', { class: 'mnem' }, h('p', { class: 'eyebrow' }, 'Memory trick'), h('b', null, m[0]), h('span', null, m[1])) }); });
    (t.f || []).forEach(function (f) { out.push({ k: 'f', body: h('div', { class: 'stack' }, h('p', { class: 'eyebrow' }, 'Fun fact'), h('p', { class: 'fact' }, f)) }); });
    (t.k || []).forEach(function (k) { out.push({ k: 'k', body: h('div', { class: 'stack' }, h('p', { class: 'eyebrow' }, 'Teach it back (say it aloud)'), h('p', null, k)) }); });
    return out;
  }

  function finishBlock(t) {
    var S = J.S(), st = (S.topics[t.id] || {}).st || 0;
    return h('div', { class: 'card hero' },
      h('h2', null, st >= 2 ? 'Topic learned — quiz yourself' : 'Ready to lock it in?'),
      h('p', { class: 'muted small' }, st >= 2 ? 'Revision is scheduled automatically (1, 3, 7, 16, 35, 60 days).' : 'Marking it learned adds its flashcards and schedules revision at 1, 3, 7, 16, 35 and 60 days.'),
      h('div', { class: 'row' },
        st >= 2 ? null : h('button', { class: 'btn primary big', onclick: function () { J.markLearned(t.id); U.toast(U.line('good') + ' +60 XP'); U.sound('level'); U.burst(); U.route(); } }, U.icon('check', 20), 'Mark as learned'),
        h('button', { class: 'btn' + (st >= 2 ? ' primary big' : ''), onclick: function () { J.startQuiz({ ids: G.topicQuestions(t.id, 8), title: 'Quiz — ' + t.t, topic: t.id }); } }, 'Quiz me (' + ((t.q || []).length + 8) + ')')));
  }

  J.V.learn = function (root, id) {
    if (!id) { J.V.syllabus(root); return; }
    var t = G.topic(id), S = J.S();
    if (!t) { root.appendChild(h('p', null, 'Topic not found.')); return; }
    J.markStarted(id);
    var u = G.unit(t.u), st = (S.topics[id] || {}).st || 0;
    var unitTopics = J.topics.filter(function (x) { return x.u === t.u; });
    var mode = S.learnMode || (S.prefs.cardMode ? 'cards' : 'page');
    if (st >= 2 && !S.learnModeForced) mode = mode === 'cards' ? 'cards' : mode;

    root.appendChild(h('div', { class: 'stack' },
      h('a', { class: 'eyebrow', href: '#unit-' + t.u, style: { textDecoration: 'none' } }, (u.paper === 1 ? 'Paper 1 · ' : 'History · ') + 'Unit ' + u.n + ' — ' + u.name),
      h('h1', null, t.t),
      h('div', { class: 'row' },
        h('span', { class: 'pill' }, '≈ ' + t.h + ' h'),
        h('span', { class: 'pill' }, 'Topic ' + (unitTopics.indexOf(t) + 1) + ' of ' + unitTopics.length),
        h('span', { class: 'pill ' + (st >= 3 ? 'good' : st >= 2 ? 'accent' : 'warn') }, ['New', 'In progress', 'Learned', 'Mastered'][st]),
        (S.topics[id] || {}).next ? h('span', { class: 'pill copper' }, 'Next revision ' + S.topics[id].next) : null)));

    root.appendChild(U.seg([['cards', 'Cards'], ['page', 'Full page'], ['recall', 'Recall'], ['quiz', 'Quiz']], mode, function (m) {
      if (m === 'quiz') { J.startQuiz({ ids: G.topicQuestions(t.id, 8), title: 'Quiz — ' + t.t, topic: t.id }); return; }
      S.learnMode = m; J.save(); U.route();
    }, 'Study mode'));

    var body = h('div', { class: 'lesson' });
    root.appendChild(body);
    var secs = sections(t);

    if (mode === 'cards') {
      var idx = Math.min(S.cardPos && S.cardPos[id] || 0, secs.length);
      var cardEl = h('div'), prog = h('div'), ctr = h('div', { class: 'row between' });
      body.appendChild(prog); body.appendChild(cardEl); body.appendChild(ctr);
      var draw = function () {
        S.cardPos = S.cardPos || {}; S.cardPos[id] = idx; J.save();
        prog.innerHTML = ''; prog.appendChild(U.bar(U.pct(idx, secs.length)));
        cardEl.innerHTML = '';
        if (idx >= secs.length) { cardEl.appendChild(finishBlock(t)); }
        else {
          var s = secs[idx];
          cardEl.appendChild(h('div', { class: 'pointer-card', 'aria-live': 'polite' }, s.k === 'p' ? h('p', { class: 'eyebrow' }, 'Point ' + (s.i + 1) + ' of ' + (t.p || []).length) : null, s.body));
        }
        ctr.innerHTML = '';
        ctr.appendChild(h('button', { class: 'btn', disabled: idx === 0, onclick: function () { idx = Math.max(0, idx - 1); draw(); } }, U.icon('arrowL', 18), 'Back'));
        ctr.appendChild(h('span', { class: 'small muted mono' }, Math.min(idx + 1, secs.length) + ' / ' + secs.length));
        ctr.appendChild(idx >= secs.length ? h('button', { class: 'btn ghost', onclick: function () { idx = 0; draw(); } }, 'Start over') : h('button', { class: 'btn primary', onclick: function () { idx++; draw(); } }, 'Next', U.icon('arrowR', 18)));
      };
      draw();
      var key = function (e) {
        if (e.target.closest && e.target.closest('input, textarea, select')) return;
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { if (idx < secs.length) { e.preventDefault(); idx++; draw(); } }
        else if (e.key === 'ArrowLeft') { idx = Math.max(0, idx - 1); draw(); }
      };
      document.addEventListener('keydown', key);
      U.cleanup = function () { document.removeEventListener('keydown', key); };
      body.appendChild(h('p', { class: 'tiny muted' }, 'Keys: ', h('span', { class: 'kbd' }, '→'), ' / ', h('span', { class: 'kbd' }, 'Space'), ' next · ', h('span', { class: 'kbd' }, '←'), ' back'));
    } else if (mode === 'page') {
      body.appendChild(h('section', { class: 'card' }, h('h2', null, 'Key pointers'), h('ul', { class: 'plist' }, (t.p || []).map(function (p) { return U.mdEl('li', p); }))));
      if (t.d) body.appendChild(h('section', { class: 'card' }, h('h2', null, 'Diagram'), U.tree(t.d)));
      if ((t.m || []).length) body.appendChild(h('section', { class: 'card' }, h('h2', null, 'Memory tricks'), t.m.map(function (m) { return h('div', { class: 'mnem' }, h('b', null, m[0]), h('span', null, m[1])); })));
      if ((t.f || []).length) body.appendChild(h('section', { class: 'card' }, h('h2', null, 'Fun facts'), t.f.map(function (f) { return h('p', { class: 'fact' }, f); })));
      if ((t.k || []).length) body.appendChild(h('section', { class: 'card' }, h('h2', null, 'Teach it back'), h('ul', { class: 'plist' }, t.k.map(function (k) { return h('li', null, k); }))));
      body.appendChild(finishBlock(t));
    } else { // recall
      var shown = 0, totalBlanks = 0;
      var list = h('ul', { class: 'plist' });
      (t.p || []).forEach(function (p) {
        var li = h('li');
        var parts = p.split(/(\*\*.+?\*\*)/g);
        parts.forEach(function (part) {
          var m = part.match(/^\*\*(.+)\*\*$/);
          if (m) {
            totalBlanks++;
            var c = h('span', { class: 'cloze', role: 'button', tabindex: '0', 'aria-label': 'Hidden term, press to reveal' }, m[1]);
            var reveal = function () { if (!c.classList.contains('shown')) { c.classList.add('shown'); c.removeAttribute('aria-label'); shown++; counter.textContent = shown + ' / ' + totalBlanks + ' revealed'; } };
            c.addEventListener('click', reveal); c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
            li.appendChild(c);
          } else li.appendChild(document.createTextNode(part));
        });
        list.appendChild(li);
      });
      var counter = h('span', { class: 'pill' }, '0 / ' + totalBlanks + ' revealed');
      body.appendChild(h('section', { class: 'card' },
        h('div', { class: 'row between' }, h('h2', null, 'Recall: say the hidden word, then tap'), counter),
        h('p', { class: 'muted small' }, 'Retrieval beats re-reading. Try to recall each blank before revealing it.'),
        list,
        h('button', { class: 'btn ghost small', onclick: function () { list.querySelectorAll('.cloze').forEach(function (c) { c.click(); }); } }, 'Reveal all')));
      if (st >= 2) {
        body.appendChild(h('section', { class: 'card hero' }, h('h2', null, 'How well did you remember?'), h('p', { class: 'muted small' }, 'This sets the next revision date.'),
          h('div', { class: 'row' }, [['Hard', 0, 'bad'], ['Okay', 1, ''], ['Easy', 2, 'good']].map(function (r) {
            return h('button', { class: 'btn ' + r[2], onclick: function () { J.reviseTopic(id, r[1]); U.toast('Next revision: ' + J.S().topics[id].next); U.sound('good'); U.go('revise'); } }, r[0]);
          }))));
      } else body.appendChild(finishBlock(t));
    }

    // notes
    var ta = h('textarea', { class: 'input', id: 'note-' + id, placeholder: 'Your own notes, examples, doubts… (saved automatically)' });
    ta.value = (S.notes || {})[id] || '';
    ta.addEventListener('input', function () { S.notes = S.notes || {}; S.notes[id] = ta.value; J.save(); });
    root.appendChild(h('details', { class: 'fold' }, h('summary', null, 'My notes', h('span', { class: 'muted small' }, ta.value ? 'saved' : 'empty')), h('div', { class: 'in' }, ta)));
    var bf = h('div', { class: 'stack' }), bsum = h('span', { class: 'small muted' }, 'load your books to see them');
    var bfold = h('details', { class: 'fold' }, h('summary', null, 'From your books', bsum), h('div', { class: 'in' }, bf));
    root.appendChild(bfold);
    (J.booksReady || Promise.resolve()).then(function () {
      var list = J.topicBookFacts ? J.topicBookFacts(id) : [];
      bsum.textContent = J.books && J.books.length ? list.length + ' facts' : 'no books loaded';
      if (!J.books || !J.books.length) { bf.appendChild(h('p', { class: 'small muted' }, 'Load your textbooks once and every fact they contain about this topic shows up here as cards.')); bf.appendChild(h('a', { class: 'btn small', href: '#books' }, 'Add books')); return; }
      if (!list.length) { bf.appendChild(h('p', { class: 'small muted' }, 'No sentences from your books were linked to this topic.')); return; }
      bf.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn small primary', onclick: function () { var ids = []; list.forEach(function (x) { x.f.a.forEach(function (_, k) { ids.push('f|' + x.b.id + '|' + x.i + '|' + k); }); }); J.startCardSession(ids.filter(function (cid) { var c = J.S().cards[cid]; return !(c && c[2] > 0); }).slice(0, 30), 'Book facts — ' + t.t); } }, 'Study as cards'),
        h('button', { class: 'btn small', onclick: function () { var ids = []; list.forEach(function (x) { x.f.a.forEach(function (_, k) { ids.push('b|' + x.b.id + '|' + x.i + '|' + k); }); }); J.startQuiz({ ids: G.sample(ids, 15), title: 'Book quiz — ' + t.t }); } }, 'Quiz 15')));
      list.slice(0, 80).forEach(function (x) { var e = h('p', { class: 'small' }); e.innerHTML = U.esc(x.f.s).replace(U.esc(x.f.a[0]), '<b>' + U.esc(x.f.a[0]) + '</b>') + ' <span class="tiny muted">' + U.esc(x.b.title) + ', p. ' + x.f.p + '</span>'; bf.appendChild(e); });
      if (list.length > 80) bf.appendChild(h('p', { class: 'small muted' }, '+ ' + (list.length - 80) + ' more — open the book page to see all.'));
    });
    root.appendChild(h('details', { class: 'fold' }, h('summary', null, 'Read more (books & IGNOU)'), h('div', { class: 'in' },
      h('ul', { class: 'plist' }, (t.r || []).concat(u.books || []).map(function (r) { return h('li', null, r); })),
      (u.ignou || []).length ? h('p', { class: 'small muted' }, 'IGNOU MA History (MAH): ' + u.ignou.join(' · ') + ' — on egyankosh.ac.in') : null)));
    root.appendChild(topicNav(t));
  };

  /* ---------------- Syllabus ---------------- */
  J.V.syllabus = function (root) {
    var S = J.S(), paper = S.sylPaper || 2;
    var all = J.topics.length, learned = J.learnedCount();
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'Syllabus'), h('span', { class: 'pill accent' }, learned + ' / ' + all + ' topics learned')));
    root.appendChild(U.bar(U.pct(learned, all)));
    root.appendChild(U.seg([[2, 'Paper 2 · History'], [1, 'Paper 1 · General']], paper, function (p) { S.sylPaper = p; J.save(); U.route(); }, 'Paper'));
    J.units.filter(function (u) { return u.paper === paper; }).forEach(function (u) {
      var ts = J.topics.filter(function (t) { return t.u === u.id; });
      var ln = ts.filter(function (t) { return (S.topics[t.id] || {}).st >= 2; }).length;
      var det = h('details', { class: 'fold' },
        h('summary', null, h('span', null, 'Unit ' + u.n + ' · ' + u.name), h('span', { class: 'pill ' + (ln === ts.length && ts.length ? 'good' : '') }, ln + '/' + ts.length)),
        h('div', { class: 'in' },
          U.bar(U.pct(ln, ts.length)),
          h('p', { class: 'small muted' }, u.syl),
          ts.map(function (t) {
            var st = (S.topics[t.id] || {}).st || 0;
            return h('div', { class: 'topic-row' }, h('span', { class: 'status-dot s' + st }), h('a', { class: 'nm', href: '#learn-' + t.id }, t.t), h('span', { class: 'pill' }, t.h + ' h'));
          }),
          h('div', { class: 'row' }, h('a', { class: 'btn small', href: '#unit-' + u.id }, 'Unit page'), h('button', { class: 'btn small ghost', onclick: function () { J.startQuiz({ ids: G.sample(G.pool({ units: [u.id] }), 20), title: 'Unit ' + u.n + ' practice' }); } }, 'Practice 20'))));
      root.appendChild(det);
    });
    root.appendChild(h('p', { class: 'small muted' }, 'Dots: ', h('span', { class: 'status-dot s0' }), ' new · ', h('span', { class: 'status-dot s1' }), ' started · ', h('span', { class: 'status-dot s2' }), ' learned · ', h('span', { class: 'status-dot s3' }), ' mastered (3+ good revisions).'));
    if (paper === 2) root.appendChild(h('div', { class: 'card' }, h('h3', null, 'Concepts, ideas & terms'), h('p', { class: 'small muted' }, 'The official syllabus lists ~90 key terms (Saptanga, Iqta, Dyarchy, Drain…). All of them are in the glossary with flashcards and questions.'), h('a', { class: 'btn small', href: '#glossary' }, 'Open glossary')));
  };

  /* ---------------- Plan ---------------- */
  J.V.plan = function (root) {
    var S = J.S(), p = J.planEnsure(), t = J.date.today();
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, '4-month plan'), h('span', { class: 'pill' }, p.days.length + ' days')));
    var ph = [1, 2, 3].map(function (n) { var d = p.days.filter(function (x) { return x.phase === n; }); return d.length ? [n, d[0].date, d[d.length - 1].date, d.length] : null; }).filter(Boolean);
    root.appendChild(h('div', { class: 'card' },
      h('div', { class: 'grid3' }, ph.map(function (x) { return h('div', { class: 'stat' }, h('b', null, J.phaseName(x[0])), h('span', null, x[3] + ' days · ' + x[1] + ' → ' + x[2])); })),
      h('p', { class: 'small muted' }, 'Build: learn every topic (one review day each week). Revise: unit-by-unit sprints with unit tests. Mock: full mocks on alternate days, fix weak areas, light last days.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: function () { var el = document.getElementById('plan-today'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }, 'Jump to today'),
        h('button', { class: 'btn ghost', onclick: function () { U.confirm('Re-plan from today?', 'Unfinished topics are spread over the remaining days; the end date stays. Your progress is not touched.', 'Re-plan', function () { J.planReplan(); U.route(); }); } }, 'Re-plan from today'),
        h('a', { class: 'btn ghost', href: '#tweaks' }, 'Change start date'))));
    var list = h('div', { class: 'card' });
    var week = -1;
    p.days.forEach(function (d) {
      var w = Math.floor(d.d / 7);
      if (w !== week) { week = w; list.appendChild(h('h3', { style: { marginTop: '8px' } }, 'Week ' + (w + 1) + ' · ' + J.phaseName(d.phase))); }
      var isToday = d.date === t;
      list.appendChild(h('div', { class: 'plan-day' + (isToday ? ' today' : ''), id: isToday ? 'plan-today' : null },
        h('div', null, h('div', { class: 'dn' }, 'Day ' + (d.d + 1)), h('div', { class: 'tiny muted mono' }, d.date.slice(5))),
        h('ul', null, d.tasks.map(function (x, i) {
          var done = J.taskDone(d, x, i);
          return h('li', { class: done ? 'muted' : '' }, done ? '✓ ' : '', J.taskLabel(x));
        }))));
    });
    root.appendChild(list);
  };
})(window.JRF);
