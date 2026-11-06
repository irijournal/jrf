/* Search everything: topics, historians, concepts, dynasties & rulers, events, fact tables, places, diagrams. Press "/" anywhere. */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G, IDX = null;
  function strip(s) { return String(s || '').replace(/\*\*/g, ''); }
  function build() {
    var I = [];
    function add(k, t, s, href, body) { I.push({ k: k, t: t, s: s || '', href: href || '', b: (t + ' ' + (s || '') + ' ' + (body || '')).toLowerCase(), tl: t.toLowerCase() }); }
    J.units.forEach(function (u) { add('Unit', (u.paper === 1 ? 'Paper 1 · ' : 'Unit ') + u.n + ' — ' + u.name, u.syl, '#unit-' + u.id); });
    J.topics.forEach(function (t) { add('Topic', t.t, (G.unit(t.u) || {}).name, '#learn-' + t.id, strip((t.p || []).join(' ')) + ' ' + (t.m || []).map(function (m) { return m.join(' '); }).join(' ')); });
    (J.historians || []).forEach(function (x) { add('Historian', x.n, x.w.slice(0, 3).map(function (w) { return J.H.show(w.t) + (w.y !== null ? ' (' + J.H.yl(w) + ')' : ''); }).join(' · '), '#histo-' + x.id, x.w.map(function (w) { return w.t; }).join(' ') + ' ' + x.i.join(' ')); });
    (J.hConcepts || []).forEach(function (c) { add('Concept', c.t, c.m + ' — ' + J.H.byId[c.h].n, '#histo-' + c.h); });
    (J.hSchools || []).forEach(function (s) { add('School', s.n, s.core, '#histo'); });
    J.dyn.forEach(function (d) {
      add('Dynasty', d.name, d.region + ' · ' + d.span + (d.capital ? ' · capital ' + d.capital : ''), '#dyn-' + d.id);
      d.kings.forEach(function (k) { if (!k.skip) add('Ruler', k.n, d.name + ' · ' + k.r + (k.f ? ' — ' + k.f : ''), '#dyn-' + d.id); });
    });
    J.events.forEach(function (e) { add('Event', e.t, (e.approx ? 'c. ' : '') + G.fmtYear(e.y), '#timeline'); });
    J.pairs.forEach(function (p) { p.items.forEach(function (it) { add('Fact', it[0] + ' → ' + (p.year ? G.fmtYear(it[1]) : it[1]), p.lh + ' → ' + p.rh, ''); }); });
    (J.places || []).forEach(function (pl) { add('Place', pl.n, (pl.note || '') + (pl.st ? ' · ' + pl.st : ''), '#maps'); });
    (J.diagrams || []).forEach(function (d) { add('Diagram', d.t, (G.unit(d.u) || {}).name, '#diag-' + d.id, d.body); });
    return I;
  }
  J.search = function (q, limit) {
    IDX = IDX || build();
    var words = String(q || '').toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!words.length) return [];
    var out = [];
    IDX.forEach(function (e) {
      if (!words.every(function (w) { return e.b.indexOf(w) >= 0; })) return;
      var sc = 0, ql = words.join(' ');
      if (e.tl === ql) sc += 100; else if (e.tl.indexOf(ql) === 0) sc += 60; else if (e.tl.indexOf(ql) >= 0) sc += 40;
      words.forEach(function (w) { if (e.tl.indexOf(w) >= 0) sc += 10; });
      sc += { Topic: 6, Historian: 5, Dynasty: 5, Ruler: 4, Concept: 4, Diagram: 4, Unit: 3, School: 3, Event: 2, Fact: 1, Place: 1 }[e.k] || 0;
      out.push({ e: e, sc: sc });
    });
    out.sort(function (a, b) { return b.sc - a.sc; });
    return out.slice(0, limit || 80).map(function (x) { return x.e; });
  };

  J.V.search = function (root) {
    var S = J.S();
    root.appendChild(h('h1', null, 'Search everything'));
    var inp = h('input', { class: 'input big-input', type: 'search', placeholder: 'Try: Ashoka edict, Ranke, iqta, 1857 Kanpur, Chola…', value: J.searchQ || '', 'aria-label': 'Search', autocomplete: 'off' });
    var out = h('div', { class: 'stack' }), tmr = null;
    root.appendChild(inp); root.appendChild(out);
    function draw() {
      out.innerHTML = ''; J.searchQ = inp.value;
      var q = inp.value.trim();
      if (q.length < 2) { out.appendChild(h('p', { class: 'small muted' }, 'Topics, historians, books, concepts, dynasties, rulers, dated events, fact tables, map places and diagrams. Tip: press / anywhere to come here.')); return; }
      var res = J.search(q, 80);
      out.appendChild(h('p', { class: 'tiny muted' }, res.length ? res.length + (res.length === 80 ? '+' : '') + ' results' : 'Nothing found. Try fewer or shorter words.'));
      res.forEach(function (e) {
        var inner = [h('div', { class: 'row between' }, h('b', null, e.t), h('span', { class: 'pill' }, e.k)), e.s ? h('div', { class: 'small muted' }, e.s.length > 220 ? e.s.slice(0, 220) + '…' : e.s) : null];
        out.appendChild(e.href ? h('a', { class: 'hs-row', href: e.href }, inner) : h('div', { class: 'hs-row' }, inner));
      });
    }
    inp.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(draw, 120); });
    draw(); setTimeout(function () { inp.focus(); }, 30);
  };

  /* "/" opens search from anywhere (not while typing) */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target; if (t && (t.closest && t.closest('input, textarea, select, [contenteditable]'))) return;
    e.preventDefault(); U.go('search');
  });

  /* search bar on the More page and on Learn */
  function bar() {
    return h('form', { class: 'searchbar', role: 'search', onsubmit: function (e) { e.preventDefault(); J.searchQ = e.target.querySelector('input').value; U.go('search'); } },
      U.icon('search', 18), h('input', { class: 'input', type: 'search', placeholder: 'Search topics, kings, historians, facts…', 'aria-label': 'Search', onfocus: function (e) { J.searchQ = ''; U.go('search'); } }));
  }
  ['more', 'learn'].forEach(function (v) {
    var base = J.V[v];
    J.V[v] = function (root, param) { if (v === 'learn' && param) return base(root, param); root.appendChild(bar()); base(root, param); };
  });
})(window.JRF);
