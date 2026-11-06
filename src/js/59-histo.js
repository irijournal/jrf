/* Historiography power-section: schools map, historian cards, works timeline, concepts & quotes, hooks, drills. */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;
  var HS = J.historians, SCH = J.hSchools, H = J.H;

  function schoolName(id) { return H.school[id] ? H.school[id].n : ''; }
  function wline(w) { return H.show(w.t) + (w.y !== null ? ' (' + H.yl(w) + ')' : ''); }
  function acc(prefix) {
    var S = J.S(), seen = 0, ok = 0;
    for (var id in S.q) if (id.charAt(0) === 'r' && (!prefix || id.indexOf(prefix) === 0)) { var a = S.q[id]; seen += a[0]; ok += a[1]; }
    return { seen: seen, ok: ok };
  }
  function cardsKnown(pre) { var S = J.S(), n = 0; for (var id in S.cards) if (id.indexOf(pre) === 0 && S.cards[id][2] >= 2) n++; return n; }
  function newCards(ids, n) { var S = J.S(); return ids.filter(function (id) { var c = S.cards[id]; return !(c && c[2] > 0); }).slice(0, n); }
  function drill(kind, n, title, filter) { J.startQuiz({ ids: G.sample(H.ids(kind, filter), n, kind + Date.now()), title: title }); }
  function regFilter(reg) {
    if (reg === 'all') return null;
    return function (id) {
      var p = id.split('|');
      if (p[0] === 'rw' || p[0] === 'ry') { var o = p[0] === 'rw' ? H.works[+p[1]] : null; if (o) return o.h.r === (reg === 'world' ? 'W' : 'I'); }
      if (p[0] === 'ra' || p[0] === 'rs') { var x = H.byId[p[1]]; return x && x.r === (reg === 'world' ? 'W' : 'I'); }
      if (p[0] === 'rc' || p[0] === 'rt') return p[1] === (reg === 'world' ? 'W' : 'I');
      if (p[0] === 'rm') return /W$/.test(p[1]) ? reg === 'world' : /I$/.test(p[1]) ? reg === 'india' : true;
      if (p[0] === 'rn') { var s = H.school[p[1]]; return s && s.r === (reg === 'world' ? 'W' : 'I'); }
      return true;
    };
  }

  J.V.histo = function (root, param) {
    if (param) return detail(root, param);
    var S = J.S(), tab = S.histoTab || 'schools', reg = S.histoReg || 'all';
    var works = H.works.length, nQ = H.ids('all').length;
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'Historiography'), h('a', { class: 'btn ghost small', href: '#learn-h10-meth' }, 'Unit X notes')));
    var a = acc();
    root.appendChild(h('section', { class: 'card hero' },
      h('p', { class: 'eyebrow' }, 'Yaad karne ka tagda section'),
      h('p', null, 'Every school, historian, book (with year), concept and famous line in one place. Learn → recall → drill. Hide the answers, guess, tap to check.'),
      h('div', { class: 'stat-row' }, U.stat(HS.length, 'historians'), U.stat(works, 'works'), U.stat(nQ.toLocaleString('en-IN'), 'questions')),
      h('div', { class: 'stat-row' }, U.stat(cardsKnown('rch|') + '/' + HS.length, 'historian cards known'), U.stat(SCH.length, 'schools & trends'), U.stat(a.seen ? Math.round(100 * a.ok / a.seen) + '%' : '—', 'drill accuracy'))));

    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'Quick drills'),
      h('div', { class: 'togglechips' }, U.seg([['all', 'World + India'], ['world', 'World'], ['india', 'India']], reg, function (v) { S.histoReg = v; J.save(); U.route(); }, 'Region')),
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn primary', onclick: function () { var f = reg === 'all' ? null : function (x) { return x.r === (reg === 'world' ? 'W' : 'I'); }; J.startCardSession(newCards(H.cardIds('hist', f), 15), 'Historian cards'); } }, U.icon('repeat', 18), 'Learn 15 historian cards'),
        h('button', { class: 'btn', onclick: function () { drill('who', 20, 'Who wrote it?', regFilter(reg)); } }, 'Who wrote it? · 20'),
        h('button', { class: 'btn', onclick: function () { drill('year', 15, 'Years & chronology', regFilter(reg)); } }, 'Years & order · 15'),
        h('button', { class: 'btn', onclick: function () { drill('school', 15, 'Schools of history', regFilter(reg)); } }, 'Schools · 15'),
        h('button', { class: 'btn', onclick: function () { drill('concept', 15, 'Concepts & quotes'); } }, 'Concepts & quotes · 15'),
        h('button', { class: 'btn', onclick: function () { drill('match', 10, 'Match & statements', regFilter(reg)); } }, 'Match & statements · 10'),
        h('button', { class: 'btn', onclick: function () { var hand = []; J.topics.forEach(function (t) { if (t.u === 'H10') (t.q || []).forEach(function (q, i) { hand.push('h|' + t.id + '|' + i); }); }); J.startQuiz({ ids: G.sample(hand.concat(G.sample(H.ids('all', regFilter(reg)), 15, 'mx' + Date.now())), 25, 'm' + Date.now()), title: 'Historiography mixed 25' }); } }, 'Mixed exam-style · 25')),
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn small ghost', onclick: function () { J.startCardSession(newCards(H.cardIds('works', reg === 'all' ? null : function (o) { return o.h.r === (reg === 'world' ? 'W' : 'I'); }), 20), 'Book → author cards'); } }, 'Book → author cards · 20'),
        h('button', { class: 'btn small ghost', onclick: function () { J.startCardSession(newCards(H.cardIds('concepts'), 20), 'Concept cards'); } }, 'Concept cards · 20'))));

    root.appendChild(U.seg([['schools', 'Schools map'], ['people', 'Historians'], ['works', 'Works timeline'], ['concepts', 'Concepts & quotes'], ['hooks', 'Memory hooks']], tab, function (v) { S.histoTab = v; J.save(); U.route(); }, 'View'));
    var box = h('div', { class: 'stack' }); root.appendChild(box);
    ({ schools: schools, people: people, works: worksView, concepts: concepts, hooks: hooks })[tab](box, reg);
  };

  /* ---------- schools map ---------- */
  function schools(box, reg) {
    box.appendChild(h('p', { class: 'small muted' }, 'Read top to bottom: schools in the order they appeared. Tap a name for the full card.'));
    [['W', 'World historiography'], ['I', 'Indian historiography']].forEach(function (R) {
      if (reg === 'world' && R[0] === 'I') return; if (reg === 'india' && R[0] === 'W') return;
      box.appendChild(h('h2', null, R[1]));
      var list = h('div', { class: 'sflow' });
      SCH.filter(function (s) { return s.r === R[0]; }).forEach(function (s) {
        list.appendChild(h('div', { class: 'sflow-item' },
          h('div', { class: 'sflow-era mono' }, s.era),
          h('div', { class: 'sflow-card', id: 'sch-' + s.id },
            h('div', { class: 'row between' }, h('b', null, s.n), s.members.length >= 3 ? h('button', { class: 'btn small ghost', onclick: function () { J.startQuiz({ ids: G.sample(H.ids('all', function (id) { var p = id.split('|'); return (p[0] === 'rn' && p[1] === s.id) || ((p[0] === 'rs' || p[0] === 'ra') && s.members.indexOf(H.byId[p[1]]) >= 0); }), 12, s.id + Date.now()), title: s.n }); } }, 'Quiz') : null),
            h('p', { class: 'small' }, s.core),
            h('div', { class: 'mnem small' }, h('b', null, 'Hook: '), h('span', null, s.mn)),
            h('div', { class: 'hs-chips' }, s.members.map(function (x) { return h('a', { class: 'hs-chip', href: '#histo-' + x.id }, x.n); })))));
      });
      box.appendChild(list);
    });
  }

  /* ---------- historian list ---------- */
  function people(box, reg) {
    var S = J.S(), q = S.histoQ || '', sch = S.histoSch || '';
    var inp = h('input', { class: 'input', type: 'search', placeholder: 'Search a historian, book or idea…', value: q, 'aria-label': 'Search historians' });
    var sel = h('select', { class: 'input', 'aria-label': 'Filter by school' }, h('option', { value: '' }, 'All schools'), SCH.filter(function (s) { return reg === 'all' || s.r === (reg === 'world' ? 'W' : 'I'); }).map(function (s) { var o = h('option', { value: s.id }, s.n); if (s.id === sch) o.selected = true; return o; }));
    var out = h('div', { class: 'stack' });
    function draw() {
      out.innerHTML = '';
      var t = inp.value.trim().toLowerCase(), sv = sel.value;
      var list = HS.filter(function (x) {
        if (reg !== 'all' && x.r !== (reg === 'world' ? 'W' : 'I')) return false;
        if (sv && x.s.indexOf(sv) < 0) return false;
        if (!t) return true;
        return (x.n + ' ' + x.w.map(function (w) { return w.t; }).join(' ') + ' ' + x.i.join(' ') + ' ' + x.c.map(function (c) { return c[0]; }).join(' ')).toLowerCase().indexOf(t) >= 0;
      });
      out.appendChild(h('p', { class: 'tiny muted' }, list.length + ' historians'));
      list.slice(0, 120).forEach(function (x) {
        out.appendChild(h('a', { class: 'hs-row', href: '#histo-' + x.id },
          h('div', { class: 'row between' }, h('b', null, x.n), h('span', { class: 'tiny muted mono' }, x.life || '')),
          h('div', { class: 'row wrap' }, x.s.filter(function (z) { return H.school[z]; }).map(function (z) { return h('span', { class: 'pill' }, schoolName(z)); })),
          h('div', { class: 'small muted' }, x.w.slice(0, 2).map(wline).join(' · '))));
      });
      if (list.length > 120) out.appendChild(h('p', { class: 'small muted' }, 'Showing 120 — type to narrow down.'));
    }
    inp.addEventListener('input', function () { S.histoQ = inp.value; draw(); });
    sel.addEventListener('change', function () { S.histoSch = sel.value; J.save(); draw(); });
    box.appendChild(h('div', { class: 'grid2' }, inp, sel));
    box.appendChild(out); draw();
  }

  /* ---------- works timeline with hide/reveal ---------- */
  function worksView(box, reg) {
    var S = J.S(), hide = S.histoHide !== false;
    box.appendChild(h('div', { class: 'row between wrap' },
      h('p', { class: 'small muted' }, hide ? 'Authors are hidden. Say the name, then tap to check.' : 'Tap “Hide authors” to test yourself.'),
      h('button', { class: 'btn small', 'aria-pressed': String(hide), onclick: function () { S.histoHide = !hide; J.save(); U.route(); } }, U.icon('eye', 16), hide ? 'Show authors' : 'Hide authors')));
    var list = H.works.filter(function (o) { return o.w.y !== null && (reg === 'all' || o.h.r === (reg === 'world' ? 'W' : 'I')); }).sort(function (a, b) { return a.w.y - b.w.y; });
    var tl = h('div', { class: 'tl' }), cent = null;
    list.forEach(function (o) {
      var c = o.w.y < 0 ? 'BCE' : o.w.y < 1000 ? 'First millennium CE' : Math.floor(o.w.y / 100) + 1 + 'th century';
      if (c !== cent) { cent = c; tl.appendChild(h('div', { class: 'tl-cent' }, c === '21th century' ? '21st century' : c)); }
      var who = h('span', { class: hide ? 'hidden-name' : '', role: hide ? 'button' : null, tabindex: hide ? '0' : null, onclick: function () { who.classList.remove('hidden-name'); } }, o.h.n);
      tl.appendChild(h('div', { class: 'tl-item' }, h('span', { class: 'y' }, H.yl(o.w)), h('span', { class: 't' }, H.wdisp(o), ' — ', who)));
    });
    box.appendChild(tl);
  }

  /* ---------- concepts & quotes ---------- */
  function concepts(box) {
    var S = J.S(), hide = S.histoHide !== false;
    box.appendChild(h('div', { class: 'row between wrap' },
      h('p', { class: 'small muted' }, 'Concept → meaning → thinker. ' + (hide ? 'Thinkers are hidden: tap to reveal.' : '')),
      h('button', { class: 'btn small', onclick: function () { S.histoHide = !hide; J.save(); U.route(); } }, U.icon('eye', 16), hide ? 'Show thinkers' : 'Hide thinkers')));
    var list = h('div', { class: 'stack' });
    J.hConcepts.slice().sort(function (a, b) { return a.t.localeCompare(b.t); }).forEach(function (c) {
      var who = h('b', { class: hide ? 'hidden-name' : '', onclick: function () { who.classList.remove('hidden-name'); } }, H.byId[c.h].n);
      list.appendChild(h('div', { class: 'hs-row' }, h('div', { class: 'row between wrap' }, h('b', { class: 'accent-text' }, c.t), who), h('div', { class: 'small' }, c.m)));
    });
    box.appendChild(list);
    box.appendChild(h('h2', null, 'Famous lines'));
    var ql = h('div', { class: 'stack' });
    HS.forEach(function (x) { x.q.forEach(function (q) {
      var who = h('b', { class: hide ? 'hidden-name' : '', onclick: function () { who.classList.remove('hidden-name'); } }, x.n);
      ql.appendChild(h('div', { class: 'hs-row' }, h('div', { class: 'fact' }, '“' + q + '”'), h('div', { class: 'small' }, '— ', who)));
    }); });
    box.appendChild(ql);
  }

  /* ---------- hooks ---------- */
  function hooks(box, reg) {
    box.appendChild(h('p', { class: 'small muted' }, 'Silly hooks stick. Read one, close your eyes, say the school and two books.'));
    var g = h('div', { class: 'dyn-grid' });
    SCH.filter(function (s) { return reg === 'all' || s.r === (reg === 'world' ? 'W' : 'I'); }).forEach(function (s) {
      g.appendChild(h('div', { class: 'dyn-card' }, h('b', null, s.n), h('span', { class: 'small' }, s.mn)));
    });
    HS.filter(function (x) { return x.hk && (reg === 'all' || x.r === (reg === 'world' ? 'W' : 'I')); }).forEach(function (x) {
      g.appendChild(h('a', { class: 'dyn-card', href: '#histo-' + x.id }, h('b', null, x.n), h('span', { class: 'small' }, x.hk)));
    });
    box.appendChild(g);
  }

  /* ---------- one historian ---------- */
  function detail(root, id) {
    var x = H.byId[id];
    if (!x) { root.appendChild(h('p', null, 'Not found. ', h('a', { href: '#histo' }, 'Back'))); return; }
    var same = x.s[0] && H.school[x.s[0]] ? H.school[x.s[0]].members : [x], i = same.indexOf(x);
    root.appendChild(h('div', { class: 'row between' }, h('a', { class: 'btn ghost small', href: '#histo' }, U.icon('arrowL', 16), 'All historians'), h('span', { class: 'pill' }, x.r === 'W' ? 'World' : 'India')));
    root.appendChild(h('h1', null, x.n));
    if (x.life) root.appendChild(h('p', { class: 'muted mono' }, x.life));
    root.appendChild(h('div', { class: 'row wrap' }, x.s.filter(function (z) { return H.school[z]; }).map(function (z) { return h('span', { class: 'pill accent' }, schoolName(z)); })));
    if (x.hk) root.appendChild(h('div', { class: 'mnem' }, h('p', { class: 'eyebrow' }, 'Memory hook'), h('b', null, x.hk)));
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Works'), h('ul', { class: 'plist' }, x.w.map(function (w) { return h('li', null, h('b', null, H.show(w.t)), w.y !== null ? ' — ' + H.yl(w) : ''); }))));
    if (x.i.length) root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Key ideas'), h('ul', { class: 'plist' }, x.i.map(function (t) { return h('li', null, t); }))));
    if (x.c.length) root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Concepts'), h('div', { class: 'stack' }, x.c.map(function (c) { return h('div', null, h('b', null, c[0]), ' — ', c[1]); }))));
    if (x.q.length) root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Famous lines'), x.q.map(function (q) { return h('p', { class: 'fact' }, '“' + q + '”'); })));
    x.s.forEach(function (z) { var s = H.school[z]; if (s) root.appendChild(h('section', { class: 'card' }, h('p', { class: 'eyebrow' }, 'School: ' + s.n + ' · ' + s.era), h('p', { class: 'small' }, s.core), h('div', { class: 'hs-chips' }, s.members.map(function (m) { return h('a', { class: 'hs-chip' + (m === x ? ' on' : ''), href: '#histo-' + m.id }, m.n); })))); });
    root.appendChild(h('div', { class: 'row wrap' },
      h('button', { class: 'btn primary', onclick: function () { J.startQuiz({ ids: H.idsFor(x.id), title: x.n }); } }, 'Quiz me on ' + x.n.split(' ').slice(-1)[0]),
      h('button', { class: 'btn', onclick: function () { var ids = ['rch|' + x.id]; H.works.forEach(function (o, k) { if (o.h === x) ids.push('rcw|' + k); }); J.hConcepts.forEach(function (c, k) { if (c.h === x.id) ids.push('rcc|' + k); }); J.cardSession = { ids: ids, title: x.n }; U.go('cards-session'); } }, 'Flashcards')));
    root.appendChild(h('div', { class: 'row between' },
      i > 0 ? h('a', { class: 'btn ghost small', href: '#histo-' + same[i - 1].id }, U.icon('arrowL', 16), same[i - 1].n) : h('span'),
      i < same.length - 1 ? h('a', { class: 'btn ghost small', href: '#histo-' + same[i + 1].id }, same[i + 1].n, U.icon('arrowR', 16)) : h('span')));
  }
})(window.JRF);
