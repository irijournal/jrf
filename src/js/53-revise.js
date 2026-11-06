/* Revise: due topics (spaced), flashcards (Leitner), mistakes */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;
  function newCap() { return (J.S().prefs.newCards || 25); }

  function newToday() { var S = J.S(), l = J.dayLog(); return l.newCards || 0; }
  function dueQueue(unit) {
    var S = J.S(), dn = J.date.num(), rev = [], fresh = [];
    for (var id in S.cards) {
      var c = S.cards[id];
      if (c[1] > dn) continue;
      if (unit) { var cd = J.getCard(id); if (!cd || cd.u !== unit) continue; }
      if (c[2] > 0) rev.push(id); else fresh.push(id);
    }
    var cap = unit ? 60 : Math.max(0, newCap() - newToday());
    return J.shuffle(rev, J.rng(dn)).concat(fresh.slice(0, cap));
  }
  J.dueQueue = dueQueue;

  J.V.revise = function (root) {
    var S = J.S(), topics = J.topicsDue(), queue = dueQueue(), mist = J.mistakesDue();
    root.appendChild(h('h1', null, 'Revise'));
    root.appendChild(h('p', { class: 'muted' }, 'Spaced repetition: things come back just before you would forget them. Clear this page daily and you will not lose what you learned.'));
    root.appendChild(h('div', { class: 'grid3' },
      h('div', { class: 'card' }, U.stat(topics.length, 'topics due')),
      h('div', { class: 'card' }, U.stat(queue.length, 'cards due')),
      h('div', { class: 'card' }, U.stat(mist.length, 'mistakes due'))));

    // topics
    var tc = h('section', { class: 'card' }, h('h2', null, 'Topics due'));
    if (!topics.length) tc.appendChild(h('p', { class: 'muted small' }, J.learnedCount() ? 'No topic is due today. Nice.' : 'Learn your first topic and its revisions will appear here (after 1, 3, 7, 16, 35, 60 days).'));
    topics.forEach(function (id) {
      var t = G.topic(id), st = S.topics[id];
      tc.appendChild(h('div', { class: 'topic-row' }, h('span', { class: 'status-dot s' + st.st }), h('span', { class: 'nm' }, t.t, h('br'), h('span', { class: 'tiny muted' }, 'Revision ' + (st.revs + 1) + ' · due ' + st.next)),
        h('button', { class: 'btn small primary', onclick: function () { S.learnMode = 'recall'; J.save(); U.go('learn-' + id); } }, 'Recall')));
    });
    root.appendChild(tc);

    // cards
    var cc = h('section', { class: 'card' }, h('div', { class: 'row between' }, h('h2', null, 'Flashcards'), h('span', { class: 'pill' }, Object.keys(S.cards).length + ' in your deck')));
    if (queue.length) cc.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn primary big', onclick: function () { U.go('cards'); } }, 'Review ' + queue.length + ' cards', U.icon('arrowR', 20)), h('span', { class: 'small muted' }, 'About ' + Math.max(1, Math.round(queue.length * 8 / 60)) + ' min')));
    else cc.appendChild(h('p', { class: 'muted small' }, Object.keys(S.cards).length ? 'All caught up. New cards unlock as you learn topics (max ' + newCap() + ' new per day; change it in Tweaks).' : 'Cards appear when you mark topics as learned. You can also add whole unit decks below.'));
    var unitBtns = h('div', { class: 'togglechips' }, J.units.map(function (u) {
      return h('button', { onclick: function () { var n = J.unlockUnitCards(u.id); U.toast(n ? n + ' cards added from ' + u.name : 'That deck is already in.'); U.route(); } }, (u.paper === 1 ? 'P1 ' : 'Unit ') + u.n);
    }));
    cc.appendChild(h('details', { class: 'fold' }, h('summary', null, 'Add a unit deck (facts, rulers, dates)'), h('div', { class: 'in' }, h('p', { class: 'small muted' }, 'Adds fact-pair cards (books→authors, sites→rivers, Acts→years…) and ruler cards for that unit. New cards are introduced gradually.'), unitBtns)));
    root.appendChild(cc);
    if (J.books && J.books.length) root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Your books'), h('p', { class: 'small muted' }, 'Study the next unrevised facts from your books; coverage is tracked per chapter.'), h('a', { class: 'btn', href: '#books' }, 'Open book coverage')));

    // mistakes
    var mc = h('section', { class: 'card' }, h('h2', null, 'Mistakes to re-try'));
    var allM = J.mistakesAll();
    if (mist.length) mc.appendChild(h('button', { class: 'btn primary', onclick: function () { J.startQuiz({ ids: J.shuffle(mist, J.rng(Date.now())).slice(0, 40), title: 'Mistakes due' }); } }, 'Re-try ' + Math.min(40, mist.length) + ' due mistakes'));
    else mc.appendChild(h('p', { class: 'muted small' }, 'Questions you get wrong come back the next day, then at growing gaps once you get them right twice.'));
    if (allM.length) mc.appendChild(h('button', { class: 'btn ghost small', onclick: function () { J.startQuiz({ ids: J.shuffle(allM, J.rng(Date.now())).slice(0, 30), title: 'All past mistakes' }); } }, 'Practise from all ' + allM.length + ' past mistakes'));
    root.appendChild(mc);
  };

  /* ---------- flashcard session ---------- */
  J.V.cards = function (root, unit) {
    var S = J.S(), sess = unit === 'session' ? J.cardSession : null, q = sess ? sess.ids.slice() : dueQueue(unit || ''), i = 0, flipped = false, done = 0;
    var box = h('div', { class: 'stack' });
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, sess ? sess.title : unit ? (G.unit(unit) ? 'Cards — ' + G.unit(unit).name : 'Cards') : 'Flashcards'), h('a', { class: 'btn ghost small', href: '#revise' }, 'Back')));
    root.appendChild(box);
    function draw() {
      box.innerHTML = '';
      if (i >= q.length) {
        box.appendChild(h('div', { class: 'card hero' }, h('h2', null, done ? U.line('good') + ' ' + done + ' cards reviewed.' : 'No cards due.'), h('p', { class: 'muted' }, 'Come back tomorrow — the next batch will be waiting.'), h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#today' }, 'Back to Today'), h('button', { class: 'btn', onclick: J.quickSprint }, '10-question sprint'))));
        return;
      }
      var id = q[i], c = J.getCard(id);
      if (!c) { i++; draw(); return; }
      box.appendChild(U.bar(U.pct(i, q.length)));
      var fl = h('div', { class: 'flash', role: 'button', tabindex: '0', 'aria-label': flipped ? 'Answer shown' : 'Card: press space to flip', onclick: flip },
        h('p', { class: 'eyebrow' }, c.src + (!S.cards[id] || S.cards[id][2] === 0 ? ' · new' : '')),
        h('div', null, c.front),
        flipped ? h('div', { class: 'back' }, c.back) : h('p', { class: 'small muted' }, 'Think of the answer, then tap or press Space'));
      box.appendChild(fl);
      if (flipped) {
        box.appendChild(h('div', { class: 'rate' }, [['Again', 0, 'bad'], ['Hard', 1, ''], ['Good', 2, 'good'], ['Easy', 3, 'primary']].map(function (r) {
          return h('button', { class: 'btn ' + r[2], onclick: function () { rate(r[1]); } }, r[0], h('span', { class: 'kbd' }, String(r[1] + 1)));
        })));
      }
      box.appendChild(h('p', { class: 'tiny muted' }, 'Card ' + (i + 1) + ' of ' + q.length + ' · keys: Space flip, 1–4 rate'));
      if (c.tid) box.appendChild(h('a', { class: 'small', href: '#learn-' + c.tid }, 'Open topic'));
    }
    function flip() { flipped = !flipped; draw(); }
    function rate(r) {
      var id = q[i];
      if (!sess && S.cards[id] && S.cards[id][2] === 0) { var l = J.dayLog(); l.newCards = (l.newCards || 0) + 1; }
      J.rateCard(id, r); U.sound(r === 0 ? 'bad' : 'good');
      if (r === 0) q.push(id); // see it again this session
      done++; i++; flipped = false; draw();
    }
    function key(e) {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      else if (flipped && /^[1-4]$/.test(e.key)) rate(+e.key - 1);
    }
    document.addEventListener('keydown', key);
    U.cleanup = function () { document.removeEventListener('keydown', key); };
    draw();
  };
})(window.JRF);
