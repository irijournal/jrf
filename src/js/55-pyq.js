/* PYQs: import, auto-tagging to units, repeat detection across years, theme frequency, PYQ practice.
   No official papers are bundled — the user adds them, so every year label shown here comes from the user's own data. */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;
  var STOP = {}; ('the a an of in on at to for and or is are was were be by with as from which who whom what when where why how this that these those it its into than then their there his her he she they them following given below above choose correct answer options statement statements list match among not true false only both neither nor all none of about between during after before under over also other such can could would should may might must will shall been being has have had do does did i ii iii iv v vi a b c d e 1 2 3 4').split(' ').forEach(function (w) { STOP[w] = 1; });
  function toks(s) { return (String(s).toLowerCase().match(/[a-zÀ-ɏ][a-zÀ-ɏ\-']{2,}|\d{3,4}/g) || []).filter(function (w) { return !STOP[w]; }); }
  function tset(s) { var o = {}; toks(s).forEach(function (w) { o[w] = 1; }); return o; }
  function jac(a, b) { var i = 0, n = 0, k; for (k in a) { n++; if (b[k]) i++; } for (k in b) if (!a[k]) n++; return n ? i / n : 0; }

  /* ---------- vocabulary for tagging & themes ---------- */
  var VOC = null, ENT = null;
  function buildVocab() {
    VOC = {}; ENT = {};
    function addW(text, u, w) { toks(text).forEach(function (t) { var m = VOC[t] || (VOC[t] = {}); m[u] = (m[u] || 0) + w; }); }
    function addE(name, u) { var k = name.toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').trim(); if (k.length > 3) ENT[k] = u; }
    J.topics.forEach(function (t) {
      addW(t.t, t.u, 2);
      (t.p || []).forEach(function (p) { (p.match(/\*\*(.+?)\*\*/g) || []).forEach(function (b) { addW(b, t.u, 3); addE(b.replace(/\*\*/g, ''), t.u); }); addW(p, t.u, 0.4); });
    });
    J.pairs.forEach(function (p) { p.items.forEach(function (it) { addW(it[0], p.u, 2); if (!p.year) addW(it[1], p.u, 1); addE(it[0], p.u); if (!p.year && it[1].length < 40) addE(it[1], p.u); }); });
    J.dyn.forEach(function (d) { addE(d.name, d.u); d.kings.forEach(function (k) { addW(k.n, d.u, 2); addE(k.n, d.u); }); });
    J.events.forEach(function (e) { addW(e.t, e.u, 1); });
    J.places.forEach(function (p) { addE(p.n, (J.layers.filter(function (l) { return l.id === p.layer; })[0] || {}).unit || 'H1'); });
  }
  J.pyqTag = function (text) {
    if (!VOC) buildVocab();
    var sc = {};
    toks(text).forEach(function (t) { var m = VOC[t]; if (!m) return; var tot = 0, k; for (k in m) tot += m[k]; for (k in m) sc[k] = (sc[k] || 0) + m[k] / Math.sqrt(tot); });
    var best = null, bv = 0; for (var u in sc) if (sc[u] > bv) { bv = sc[u]; best = u; }
    return bv >= 0.8 ? best : '';
  };
  function entities(text) {
    if (!ENT) buildVocab();
    var low = ' ' + String(text).toLowerCase().replace(/[^a-z0-9À-ɏ\s\-']/g, ' ').replace(/\s+/g, ' ') + ' ', out = [];
    for (var e in ENT) if (low.indexOf(' ' + e + ' ') >= 0) out.push(e);
    return out;
  }
  J.pyqEntities = entities;

  /* ---------- parser ---------- */
  J.pyqParse = function (raw) {
    raw = String(raw || '').trim();
    if (!raw) return [];
    if (raw.charAt(0) === '[') { try { return JSON.parse(raw).map(norm); } catch (e) { /* fall through */ } }
    var year = '', out = [], cur = null;
    function flush() { if (cur && cur.q.trim()) out.push(norm(cur)); cur = null; }
    raw.split(/\r?\n/).forEach(function (line) {
      var l = line.trim();
      if (!l) return;
      var ym = l.match(/^#+\s*(.+)$/); if (ym) { flush(); year = ym[1].trim(); return; }
      var am = l.match(/^(ans(wer)?|key|correct)\s*[:\-.]?\s*\(?([1-4a-dA-D])\)?/i); if (am && cur) { var c = am[3].toUpperCase(); cur.a = /[A-D]/.test(c) ? 'ABCD'.indexOf(c) : +c - 1; return; }
      var om = l.match(/^\(?([1-4]|[A-Da-d])[\).:]\s+(.+)$/);
      if (om && cur && !/^\d+\.\s/.test(l)) {
        var style = /[1-4]/.test(om[1]) ? 'N' : 'L';
        if (style === 'N' && cur.ostyle === 'L') { cur.q += '\n' + cur.o.map(function (o, k) { return 'ABCDEF'.charAt(k) + '. ' + o; }).join('\n'); cur.o = []; }
        if (cur.o.length >= 4 && style === cur.ostyle) { cur.o[3] += ' ' + l; return; }
        cur.ostyle = style;
        var inline = om[2].split(/\s+\(([2-4]|[B-Db-d])\)\s+/);
        if (inline.length > 1) { cur.o.push(inline[0]); for (var i = 2; i < inline.length; i += 2) cur.o.push(inline[i]); }
        else cur.o.push(om[2]);
        return;
      }
      var inl = l.match(/^\(1\)\s+(.+?)\s+\(2\)\s+(.+?)\s+\(3\)\s+(.+?)\s+\(4\)\s+(.+)$/);
      if (inl && cur) { cur.o = [inl[1], inl[2], inl[3], inl[4]]; return; }
      var qm = l.match(/^(q\.?\s*)?(\d{1,3})[\).:]\s+(.+)$/i);
      if (qm) { flush(); cur = { y: year, q: qm[3], o: [], a: null }; return; }
      if (!cur) cur = { y: year, q: l, o: [], a: null };
      else if (cur.o.length) cur.o[cur.o.length - 1] += ' ' + l;
      else cur.q += '\n' + l;
    });
    flush();
    return out;
  };
  function norm(x) {
    var y = String(x.y || x.year || '').trim(), yr = (y.match(/(19|20)\d{2}/) || [''])[0];
    return { y: y || 'Undated', yr: yr ? +yr : 0, q: String(x.q || x.question || '').trim(), o: (x.o || x.options || []).map(String), a: x.a != null ? +x.a : (x.answer != null ? +x.answer : null), u: x.u || x.unit || '' };
  }

  /* ---------- repeats ---------- */
  function analyse() {
    var S = J.S(), P = S.pyq, sets = P.map(function (p) { return tset(p.q + ' ' + p.o.join(' ')); });
    var parent = P.map(function (_, i) { return i; });
    function find(i) { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; }
    for (var i = 0; i < P.length; i++) for (var j = i + 1; j < P.length; j++) {
      if (P[i].y === P[j].y) continue;
      if (jac(sets[i], sets[j]) >= 0.5) parent[find(j)] = find(i);
    }
    var groups = {};
    P.forEach(function (p, i) { var r = find(i); (groups[r] = groups[r] || []).push(i); });
    var repeats = Object.keys(groups).map(function (k) { return groups[k]; }).filter(function (g) { return g.length > 1; })
      .sort(function (a, b) { return b.length - a.length; });
    var theme = {};
    P.forEach(function (p, i) { entities(p.q + ' ' + p.o.join(' ')).forEach(function (e) { var t = theme[e] || (theme[e] = { years: {}, n: 0, idx: [] }); t.years[p.y] = 1; t.n++; t.idx.push(i); }); });
    var themes = Object.keys(theme).map(function (e) { return { e: e, years: Object.keys(theme[e].years), n: theme[e].n, idx: theme[e].idx }; })
      .filter(function (t) { return t.years.length > 1; }).sort(function (a, b) { return b.years.length - a.years.length || b.n - a.n; });
    return { repeats: repeats, themes: themes };
  }
  var matchCache = {};
  J.pyqMatches = function (q) {
    var S = J.S(); if (!S.pyq.length || !q) return null;
    var key = q.id + '|' + S.pyq.length;
    if (matchCache[key]) return matchCache[key];
    var a = tset(q.q + ' ' + q.o.join(' ')), ea = entities(q.q + ' ' + q.o.join(' ')), out = [];
    S.pyq.forEach(function (p) {
      var s = jac(a, tset(p.q + ' ' + p.o.join(' ')));
      var shared = ea.length ? entities(p.q + ' ' + p.o.join(' ')).filter(function (e) { return ea.indexOf(e) >= 0; }).length : 0;
      if (s >= 0.4 || shared >= 2) out.push({ year: p.y, s: s });
    });
    var seen = {}, res = out.filter(function (x) { if (seen[x.year]) return false; seen[x.year] = 1; return true; });
    matchCache[key] = res;
    return res;
  };

  /* PYQ ids for the quiz engine */
  var baseGet = G.get;
  G.get = function (id) {
    if (id.indexOf('y|') === 0) {
      var p = J.S().pyq[+id.split('|')[1]];
      if (!p || p.o.length < 2) return null;
      return { id: id, k: 'mcq', q: p.q, o: p.o, a: p.a != null && p.a >= 0 && p.a < p.o.length ? p.a : 0, ex: p.a == null ? 'No answer key was saved for this question — check the official key.' : 'PYQ ' + p.y + '.', u: p.u || J.pyqTag(p.q + ' ' + p.o.join(' ')) || 'H1', src: 'Your PYQ · ' + p.y, gen: false };
    }
    return baseGet(id);
  };

  J.V.pyq = function (root) {
    var S = J.S(), P = S.pyq;
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'PYQs & repeats'), h('span', { class: 'pill' }, P.length + ' saved')));
    root.appendChild(h('div', { class: 'card' },
      h('p', null, 'Add the previous-year papers you have. The app then tags each question to a unit, shows which questions and themes were repeated across years, and marks practice questions that look like a PYQ.'),
      h('p', { class: 'small muted' }, 'No official papers come pre-loaded, and no years are guessed: every year you see here is the label you gave when adding the paper. Official papers: ugcnet.nta.ac.in (History, subject code 06).')));

    var ta = h('textarea', { class: 'input', id: 'pyq-input', placeholder: '# 2023 June\n1. Who wrote Tabaqat-i-Nasiri?\n(1) Minhaj-us-Siraj\n(2) Ziauddin Barani\n(3) Isami\n(4) Afif\nAnswer: 1\n\n2. Next question…', style: { minHeight: '180px', fontFamily: 'var(--f-mono)', fontSize: '.85rem' } });
    var preview = h('p', { class: 'small muted' });
    ta.addEventListener('input', function () { var n = J.pyqParse(ta.value); preview.textContent = n.length ? n.length + ' question(s) detected · ' + n.filter(function (x) { return x.o.length >= 2; }).length + ' with options · ' + n.filter(function (x) { return x.a != null; }).length + ' with answers' : ''; });
    var file = h('input', { type: 'file', id: 'pyq-file', accept: '.txt,.json,.md,text/plain,application/json', onchange: function (e) { var f = e.target.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { ta.value = rd.result; ta.dispatchEvent(new Event('input')); }; rd.readAsText(f); } });
    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'Add questions'),
      h('details', { class: 'fold' }, h('summary', null, 'Format (plain text or JSON)'), h('div', { class: 'in small' },
        h('p', null, 'Start each paper with a heading line like ', h('code', null, '# 2019 December'), ' or ', h('code', null, '# 2023 June Shift 1'), '. Number each question (1., 2. …). Options as (1)…(4) or A)…D), one per line or all on one line. Optional answer line: ', h('code', null, 'Answer: 3'), '.'),
        h('p', null, 'JSON also works: ', h('code', null, '[{"y":"2022 December","q":"…","o":["…","…","…","…"],"a":2}]'), ' (a = 0-based index).'),
        h('p', { class: 'muted' }, 'Tip: if your paper is a scanned PDF, ask Claude to convert it into this format.'))),
      ta, preview,
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: function () {
        var items = J.pyqParse(ta.value);
        if (!items.length) { U.toast('No questions found. Check the format.'); return; }
        items.forEach(function (x) { if (!x.u) x.u = J.pyqTag(x.q + ' ' + x.o.join(' ')); S.pyq.push(x); });
        J.save(true); ta.value = ''; U.toast(items.length + ' PYQs added'); U.route();
      } }, 'Add to my PYQs'), file)));

    if (!P.length) { root.appendChild(h('div', { class: 'empty' }, U.icon('scroll', 36), h('p', null, 'No PYQs yet. Paste one paper above to see repeats and unit weightage.'))); return; }

    var A = analyse();
    var years = {}; P.forEach(function (p) { years[p.y] = (years[p.y] || 0) + 1; });
    var ylist = Object.keys(years).sort();
    var units = J.units.filter(function (u) { return true; }).map(function (u) { return u.id; });
    var grid = {}; P.forEach(function (p) { var u = p.u || '?'; (grid[u] = grid[u] || {})[p.y] = (grid[u][p.y] || 0) + 1; });
    var tbl = h('table', { class: 'tbl' }, h('thead', null, h('tr', null, h('th', null, 'Unit'), ylist.map(function (y) { return h('th', null, y); }), h('th', null, 'Total'))),
      h('tbody', null, units.concat(['?']).filter(function (u) { return grid[u]; }).map(function (u) {
        var tot = 0; return h('tr', null, h('td', null, u === '?' ? 'Untagged' : ((G.unit(u).paper === 1 ? 'P1 ' : 'Unit ') + G.unit(u).n + ' · ' + G.unit(u).name)), ylist.map(function (y) { var v = grid[u][y] || 0; tot += v; return h('td', { class: 'num' }, v ? String(v) : '·'); }), h('td', { class: 'num' }, h('b', null, String(tot))));
      })));
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Unit weightage by year'), h('p', { class: 'small muted' }, 'Units are tagged automatically from the question wording; open a question below to correct it.'), h('div', { class: 'scrollx' }, tbl)));

    var rp = h('section', { class: 'card' }, h('div', { class: 'row between' }, h('h2', null, 'Repeated questions'), h('span', { class: 'pill warn' }, A.repeats.length + ' groups')));
    if (!A.repeats.length) rp.appendChild(h('p', { class: 'muted small' }, ylist.length < 2 ? 'Add at least two different years to find repeats.' : 'No near-identical questions across your years yet. Check repeated themes below.'));
    A.repeats.slice(0, 40).forEach(function (g) {
      var yrs = g.map(function (i) { return P[i].y; });
      rp.appendChild(h('details', { class: 'fold' }, h('summary', null, h('span', null, P[g[0]].q.split('\n')[0].slice(0, 100)), h('span', { class: 'pill warn' }, 'Asked ' + g.length + '×: ' + yrs.join(', '))),
        h('div', { class: 'in' }, g.map(function (i) { return h('div', { class: 'stack' }, h('b', { class: 'small' }, P[i].y), h('p', { class: 'small' }, P[i].q), P[i].o.length ? h('p', { class: 'small muted' }, P[i].o.map(function (o, k) { return '(' + (k + 1) + ') ' + o; }).join('  ')) : null); }))));
    });
    root.appendChild(rp);

    var th = h('section', { class: 'card' }, h('h2', null, 'Repeated themes'), h('p', { class: 'small muted' }, 'Names and terms that appear in questions from more than one year — a strong hint of what NTA likes to ask.'));
    if (!A.themes.length) th.appendChild(h('p', { class: 'muted small' }, 'Needs at least two years of papers.'));
    th.appendChild(h('div', { class: 'scrollx' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, h('th', null, 'Theme'), h('th', null, 'Years'), h('th', null, 'Questions'))), h('tbody', null, A.themes.slice(0, 60).map(function (t) {
      return h('tr', null, h('td', null, t.e.replace(/\b\w/g, function (c) { return c.toUpperCase(); })), h('td', null, t.years.join(', ')), h('td', { class: 'num' }, String(t.n)));
    })))));
    root.appendChild(th);

    var playable = P.map(function (p, i) { return p.o.length >= 2 ? 'y|' + i : null; }).filter(Boolean);
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Practise your PYQs'),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', disabled: !playable.length, onclick: function () { J.startQuiz({ ids: J.shuffle(playable, J.rng(Date.now())).slice(0, 50), title: 'PYQ practice' }); } }, 'Random 50 PYQs'),
        ylist.map(function (y) { var ids = P.map(function (p, i) { return p.y === y && p.o.length >= 2 ? 'y|' + i : null; }).filter(Boolean); return ids.length ? h('button', { class: 'btn small', onclick: function () { J.startQuiz({ ids: ids, title: 'PYQ ' + y, mode: 'test' }); } }, y + ' (' + ids.length + ')') : null; })),
      h('details', { class: 'fold' }, h('summary', null, 'All saved PYQs (' + P.length + ')'), h('div', { class: 'in' }, P.map(function (p, i) {
        var sel = h('select', { class: 'input', 'aria-label': 'Unit for this question', style: { maxWidth: '12rem', minHeight: '34px', padding: '4px 8px' }, onchange: function (e) { p.u = e.target.value; J.save(); } }, h('option', { value: '' }, 'Untagged'), J.units.map(function (u) { return h('option', { value: u.id, selected: p.u === u.id ? true : null }, (u.paper === 1 ? 'P1 ' : 'Unit ') + u.n); }));
        return h('div', { class: 'topic-row' }, h('span', { class: 'pill' }, p.y), h('span', { class: 'nm small' }, p.q.slice(0, 140)), sel, h('button', { class: 'btn ghost small', 'aria-label': 'Delete', onclick: function () { S.pyq.splice(i, 1); J.save(); U.route(); } }, U.icon('x', 16)));
      }))),
      h('button', { class: 'btn ghost small', onclick: function () { U.confirm('Delete all saved PYQs?', 'This cannot be undone. Your progress elsewhere is not affected.', 'Delete all', function () { S.pyq = []; J.save(true); U.route(); }, true); } }, 'Delete all PYQs')));
  };
})(window.JRF);
