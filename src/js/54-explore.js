/* Dynasties, Timeline, Maps, Glossary & mnemonics */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;
  function yl(e) { return (e.approx ? 'c. ' : '') + G.fmtYear(e.y); }
  function ord(n) { var t = n % 100; if (t >= 11 && t <= 13) return n + 'th'; return n + (['th', 'st', 'nd', 'rd'][n % 10] || 'th'); }

  /* ---------------- Dynasties ---------------- */
  J.V.dynasties = function (root) {
    var S = J.S(), era = S.dynEra || 'all', q = '';
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'Dynasties & rulers'), h('span', { class: 'pill' }, J.dyn.length + ' lists · ' + J.dyn.reduce(function (s, d) { return s + d.kings.length; }, 0) + ' rulers')));
    root.appendChild(h('p', { class: 'muted small' }, 'Open a dynasty, read the story once, then switch on “Hide names” and recall each ruler from the clues. Finish with the order game.'));
    var eras = [['all', 'All'], ['Ancient', 'Ancient'], ['Early Medieval', 'Early medieval'], ['Medieval', 'Medieval'], ['Modern', 'Modern'], ['Post-1947', 'After 1947']];
    root.appendChild(U.seg(eras, era, function (v) { S.dynEra = v; J.save(); U.route(); }, 'Era'));
    var search = h('input', { class: 'input', type: 'search', id: 'dyn-search', placeholder: 'Search a ruler or dynasty (e.g. Pulakeshin, Lodi)', 'aria-label': 'Search dynasties' });
    root.appendChild(search);
    var grid = h('div', { class: 'dyn-grid' });
    root.appendChild(grid);
    function draw() {
      grid.innerHTML = '';
      var qq = q.toLowerCase();
      J.dyn.filter(function (d) { return era === 'all' || d.era === era; }).forEach(function (d) {
        var hit = !qq || d.name.toLowerCase().indexOf(qq) >= 0 || d.kings.some(function (k) { return k.n.toLowerCase().indexOf(qq) >= 0; });
        if (!hit) return;
        var match = qq ? d.kings.filter(function (k) { return k.n.toLowerCase().indexOf(qq) >= 0; }).map(function (k) { return k.n; }).slice(0, 3).join(', ') : '';
        grid.appendChild(h('a', { class: 'dyn-card', href: '#dyn-' + d.id },
          h('div', { class: 'row between' }, h('b', null, d.name), S.seen.dyn[d.id] ? h('span', { class: 'pill good' }, 'opened') : null),
          h('span', { class: 'small mono', style: { color: 'var(--copper)' } }, d.span),
          h('span', { class: 'small muted' }, d.capital + ' · ' + d.kings.length + ' listed'),
          match ? h('span', { class: 'small' }, 'Match: ' + match) : null));
      });
      if (!grid.children.length) grid.appendChild(h('p', { class: 'muted' }, 'No match. Try another spelling.'));
    }
    search.addEventListener('input', function () { q = search.value.trim(); draw(); });
    draw();
  };

  J.V.dyn = function (root, id) {
    var d = G.dynasty(id), S = J.S();
    if (!d) { U.go('dynasties'); return; }
    S.seen.dyn[id] = J.date.today(); J.save(); J.checkBadges();
    var mode = S.dynMode || 'story';
    root.appendChild(h('a', { class: 'eyebrow', href: '#dynasties', style: { textDecoration: 'none' } }, '← All dynasties'));
    root.appendChild(h('h1', null, d.name));
    root.appendChild(h('div', { class: 'row' }, h('span', { class: 'pill copper mono' }, d.span), h('span', { class: 'pill' }, d.region), h('span', { class: 'pill' }, 'Capital: ' + d.capital), h('a', { class: 'pill accent', href: '#unit-' + d.u, style: { textDecoration: 'none' } }, 'Unit ' + (G.unit(d.u) || {}).n)));
    if (d.mn) root.appendChild(h('div', { class: 'mnem' }, h('p', { class: 'eyebrow' }, 'Memory trick'), h('b', null, d.mn)));
    if (!d.full) root.appendChild(h('p', { class: 'small muted' }, 'Selected rulers only (the most examined names). Order shown is the order of rule.'));
    root.appendChild(U.seg([['story', 'Story'], ['hide', 'Hide names'], ['order', 'Order game']], mode, function (m) { S.dynMode = m; J.save(); U.route(); }, 'Mode'));
    var box = h('div', { class: 'card' });
    root.appendChild(box);
    var live = d.kings.filter(function (k) { return !k.skip; });
    if (mode === 'order') {
      var r = J.rng(Date.now()), pickN = Math.min(6, live.length), chosen = J.shuffle(live, r).slice(0, pickN);
      var correct = chosen.slice().sort(function (a, b) { return d.kings.indexOf(a) - d.kings.indexOf(b); });
      var shown = J.shuffle(chosen, r), picked = [];
      var list = h('div', { class: 'order-list' }), msg = h('div');
      box.appendChild(h('h2', null, 'Tap the rulers in order of reign'));
      box.appendChild(list); box.appendChild(msg);
      var drawO = function () {
        list.innerHTML = '';
        shown.forEach(function (k) {
          var pos = picked.indexOf(k), checked = picked.length === shown.length;
          var cls = 'order-item' + (pos >= 0 ? ' picked' : '') + (checked ? (correct[pos] === k ? ' okk' : ' nok') : '');
          list.appendChild(h('button', { class: cls, onclick: function () { if (checked) return; if (pos >= 0) picked.splice(pos, 1); else picked.push(k); drawO(); } }, h('span', { class: 'n' }, pos >= 0 ? String(pos + 1) : '·'), h('span', null, k.n, checked ? h('span', { class: 'tiny muted' }, ' — ' + k.r) : null)));
        });
        msg.innerHTML = '';
        if (picked.length === shown.length) {
          var ok = picked.every(function (k, i) { return correct[i] === k; });
          if (ok) { J.addXP(20, 'order'); U.sound('good'); }
          msg.appendChild(h('div', { class: 'explain ' + (ok ? 'ok' : 'no') }, h('b', null, ok ? U.line('good') + ' +20 XP' : 'Correct order:'), ok ? null : h('span', null, correct.map(function (k) { return k.n; }).join(' → '))));
          msg.appendChild(h('button', { class: 'btn primary', onclick: function () { U.route(); } }, 'Another round'));
        }
      };
      drawO();
    } else {
      live.forEach(function (k, i) {
        var nm = h('span', { class: 'nm' + (mode === 'hide' ? ' hidden-name' : ''), role: mode === 'hide' ? 'button' : null, tabindex: mode === 'hide' ? '0' : null, title: mode === 'hide' ? 'Tap to reveal' : null }, k.n);
        if (mode === 'hide') { var rv = function () { nm.classList.remove('hidden-name'); }; nm.addEventListener('click', rv); nm.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') rv(); }); }
        box.appendChild(h('div', { class: 'king' }, h('span', { class: 'no' }, String(i + 1)), h('div', { class: 'stack', style: { gap: '2px' } }, nm, h('span', { class: 'rg' }, k.r), h('span', { class: 'small' }, k.f))));
      });
    }
    var qids = G.bank().filter(function (b) { return /^(ds|dp|dm|dn|dc)$/.test(b[0].split('|')[0]) && b[0].split('|')[1] === id; }).map(function (b) { return b[0]; });
    G.bank().forEach(function (b) { if (b[0].indexOf('df|') === 0) { var q = G.get(b[0]); if (q && q.src === 'Dynasty: ' + d.name) qids.push(b[0]); } });
    root.appendChild(h('div', { class: 'row' },
      qids.length ? h('button', { class: 'btn primary', onclick: function () { J.startQuiz({ ids: G.sample(qids, Math.min(12, qids.length)), title: 'Quiz — ' + d.name }); } }, 'Quiz this dynasty (' + qids.length + ' questions)') : null,
      h('button', { class: 'btn', onclick: function () { var dn = J.date.num(), n = 0; live.forEach(function (k) { var cid = 'k|' + d.id + '|' + d.kings.indexOf(k); if (!S.cards[cid]) { S.cards[cid] = [0, dn, 0, 0]; n++; } }); J.save(); U.toast(n ? n + ' ruler cards added' : 'Already in your deck'); } }, 'Add to flashcards')));
  };

  /* ---------------- Timeline ---------------- */
  J.V.timeline = function (root) {
    var S = J.S(), mode = S.tlMode || 'list', units = S.tlUnits || [];
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'Timeline'), h('span', { class: 'pill' }, J.events.length + ' dated events')));
    root.appendChild(U.seg([['list', 'List'], ['story', 'Story mode'], ['order', 'Chronology game']], mode, function (m) { S.tlMode = m; J.save(); U.route(); }, 'Mode'));
    var hist = J.units.filter(function (u) { return u.paper === 2; });
    root.appendChild(h('div', { class: 'togglechips' }, hist.map(function (u) {
      var on = units.indexOf(u.id) >= 0;
      return h('button', { 'aria-pressed': String(on), onclick: function () { var i = units.indexOf(u.id); if (i >= 0) units.splice(i, 1); else units.push(u.id); S.tlUnits = units; J.save(); U.route(); } }, 'Unit ' + u.n);
    })));
    var evs = J.events.filter(function (e) { return !units.length || units.indexOf(e.u) >= 0; });
    var box = h('div', { class: 'stack' }); root.appendChild(box);

    if (mode === 'list') {
      var search = h('input', { class: 'input', type: 'search', id: 'tl-search', placeholder: 'Search events or a year (e.g. 1857, Plassey)', 'aria-label': 'Search timeline' });
      box.appendChild(search);
      var list = h('div', { class: 'card tl' }); box.appendChild(list);
      var draw = function (q) {
        list.innerHTML = ''; var cent = null, n = 0;
        evs.forEach(function (e) {
          if (q && (e.t.toLowerCase().indexOf(q) < 0 && String(Math.abs(e.y)).indexOf(q) < 0)) return;
          var c = e.y < -1000 ? 'Before 1000 BCE' : e.y < 0 ? ord(Math.ceil(-e.y / 100)) + ' century BCE' : ord(Math.floor(e.y / 100) + 1) + ' century CE';
          if (c !== cent) { cent = c; list.appendChild(h('div', { class: 'tl-cent' }, c)); }
          list.appendChild(h('div', { class: 'tl-item' }, h('span', { class: 'y' }, yl(e)), h('span', { class: 't' }, e.t, ' ', h('span', { class: 'tiny muted' }, 'Unit ' + (G.unit(e.u) || {}).n))));
          n++;
        });
        if (!n) list.appendChild(h('p', { class: 'muted' }, 'No events match.'));
      };
      search.addEventListener('input', function () { draw(search.value.trim().toLowerCase()); });
      draw('');
    } else if (mode === 'story') {
      var i = Math.min(S.tlPos || 0, Math.max(0, evs.length - 1));
      var drawS = function () {
        box.innerHTML = '';
        if (!evs.length) { box.appendChild(h('p', null, 'No events for this filter.')); return; }
        S.tlPos = i; J.save();
        var e = evs[i], prev = evs[i - 1], next = evs[i + 1];
        box.appendChild(U.bar(U.pct(i + 1, evs.length)));
        box.appendChild(h('div', { class: 'story', 'aria-live': 'polite' },
          h('p', { class: 'eyebrow' }, 'Unit ' + (G.unit(e.u) || {}).n + ' · ' + (i + 1) + ' of ' + evs.length),
          h('div', { class: 'y' }, yl(e)), h('div', { class: 't' }, e.t),
          h('p', { class: 'small muted' }, prev ? 'Before this: ' + prev.t + ' (' + yl(prev) + ')' : 'This is where the story starts.'),
          next ? h('p', { class: 'small muted' }, 'Next: guess what comes after…') : h('p', { class: 'small muted' }, 'End of this story.')));
        box.appendChild(h('div', { class: 'row between' },
          h('button', { class: 'btn', disabled: i === 0, onclick: function () { i--; drawS(); } }, U.icon('arrowL', 18), 'Back'),
          h('button', { class: 'btn primary', disabled: i >= evs.length - 1, onclick: function () { i++; drawS(); } }, 'Next', U.icon('arrowR', 18))));
      };
      var key = function (e) { if (e.key === 'ArrowRight' && i < evs.length - 1) { i++; drawS(); } else if (e.key === 'ArrowLeft' && i > 0) { i--; drawS(); } };
      document.addEventListener('keydown', key); U.cleanup = function () { document.removeEventListener('keydown', key); };
      drawS();
    } else {
      var round = function () {
        box.innerHTML = '';
        var r = J.rng(Date.now()), pool = evs.slice(), set = [];
        for (var t = 0; t < 80 && set.length < 5; t++) {
          var e = pool[Math.floor(r() * pool.length)];
          if (set.indexOf(e) >= 0) continue;
          if (set.every(function (x) { var g = Math.abs(x.y - e.y); return g >= ((x.approx || e.approx) ? 80 : 1); })) set.push(e);
        }
        var correct = set.slice().sort(function (a, b) { return a.y - b.y; }), shown = J.shuffle(set, r), picked = [];
        var list = h('div', { class: 'order-list' }), msg = h('div');
        box.appendChild(h('div', { class: 'card' }, h('h2', null, 'Tap the events from earliest to latest'), list, msg));
        var drawO = function () {
          list.innerHTML = ''; var checked = picked.length === shown.length;
          shown.forEach(function (e) {
            var pos = picked.indexOf(e);
            list.appendChild(h('button', { class: 'order-item' + (pos >= 0 ? ' picked' : '') + (checked ? (correct[pos] === e ? ' okk' : ' nok') : ''), onclick: function () { if (checked) return; if (pos >= 0) picked.splice(pos, 1); else picked.push(e); drawO(); } },
              h('span', { class: 'n' }, pos >= 0 ? String(pos + 1) : '·'), h('span', null, e.t, checked ? h('span', { class: 'mono small', style: { color: 'var(--copper)' } }, '  ' + yl(e)) : null)));
          });
          msg.innerHTML = '';
          if (checked) {
            var ok = picked.every(function (e, i) { return correct[i] === e; });
            if (ok) { J.addXP(25, 'chrono'); S.chrono++; U.sound('good'); } else U.sound('bad');
            msg.appendChild(h('div', { class: 'explain ' + (ok ? 'ok' : 'no') }, h('b', null, ok ? U.line('good') + ' +25 XP' : 'Correct order:'), ok ? null : h('span', null, correct.map(function (e) { return e.t + ' (' + yl(e) + ')'; }).join(' → '))));
            msg.appendChild(h('button', { class: 'btn primary', onclick: round }, 'Next round'));
          }
        };
        drawO();
      };
      round();
    }
  };

  /* ---------------- Maps ---------------- */
  var LAYER_COLOR = { pre: 'var(--muted)', hrp: 'var(--copper)', mjp: 'var(--accent)', ash: 'var(--good)', bud: 'var(--warn)', port: 'var(--bad)', emed: 'var(--accent)', med: 'var(--copper)', bat: 'var(--bad)', eur: 'var(--good)', r57: 'var(--bad)', move: 'var(--warn)', nat: 'var(--accent)' };
  var KX = 0.93;
  function px(lon) { return (lon - 56) * KX; } function py(lat) { return 42 - lat; }
  J.V.maps = function (root) {
    var S = J.S(), on = S.mapLayers || ['hrp'], quiz = null;
    var vb = { x: px(60), y: py(38), w: 38 * KX, h: 33 };
    root.classList.add('wide');
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'Maps'), h('span', { class: 'small muted' }, 'Approximate locations; land outline without modern borders')));
    var legend = h('div', { class: 'legend' }, J.layers.map(function (l) {
      return h('button', { 'aria-pressed': String(on.indexOf(l.id) >= 0), onclick: function () { var i = on.indexOf(l.id); if (i >= 0) on.splice(i, 1); else on.push(l.id); S.mapLayers = on; J.save(); quiz = null; draw(); legendSync(); } }, h('i', { style: { background: LAYER_COLOR[l.id] } }), l.name);
    }));
    function legendSync() { Array.prototype.forEach.call(legend.children, function (b, i) { b.setAttribute('aria-pressed', String(on.indexOf(J.layers[i].id) >= 0)); }); }
    root.appendChild(h('details', { class: 'fold', open: window.innerWidth > 760 ? true : null }, h('summary', null, 'Layers', h('span', { class: 'small muted' }, 'pick one or more')), h('div', { class: 'in' }, legend)));
    var info = h('div', { class: 'card', 'aria-live': 'polite' }, h('p', { class: 'muted small' }, 'Tap a dot to see what happened there. Turn on one layer at a time to keep it calm.'));
    var svgNS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Map of the Indian subcontinent with historical places');
    var mapbox = h('div', { class: 'mapbox' }, svg, h('div', { class: 'map-tools' },
      h('button', { 'aria-label': 'Zoom in', onclick: function () { zoom(0.75); } }, '+'),
      h('button', { 'aria-label': 'Zoom out', onclick: function () { zoom(1 / 0.75); } }, '−'),
      h('button', { 'aria-label': 'Reset view', onclick: function () { vb = { x: px(60), y: py(38), w: 38 * KX, h: 33 }; draw(); } }, '⟲')));
    svg.addEventListener('wheel', function (e) { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15); }, { passive: false });
    root.appendChild(mapbox);
    var controls = h('div', { class: 'row' },
      h('button', { class: 'btn primary', onclick: startQuiz }, U.icon('target', 18), 'Map quiz (10 rounds)'),
      h('label', { class: 'row small' }, h('input', { type: 'checkbox', id: 'map-labels', checked: S.mapLabels !== false ? true : null, onchange: function (e) { S.mapLabels = e.target.checked; J.save(); draw(); } }), 'Show labels'),
      h('label', { class: 'row small' }, h('input', { type: 'checkbox', id: 'map-rivers', checked: S.mapRivers !== false ? true : null, onchange: function (e) { S.mapRivers = e.target.checked; J.save(); draw(); } }), 'Rivers'));
    root.appendChild(controls);
    root.appendChild(info);
    function zoom(f) { var cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2; vb.w = Math.max(4, Math.min(60 * KX, vb.w * f)); vb.h = vb.h * f; vb.x = cx - vb.w / 2; vb.y = cy - vb.h / 2; draw(); }
    var drag = null;
    svg.addEventListener('pointerdown', function (e) { if (e.target.classList && e.target.classList.contains('map-dot')) return; drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y }; svg.setPointerCapture(e.pointerId); });
    svg.addEventListener('pointermove', function (e) { if (!drag) return; var rect = svg.getBoundingClientRect(), s = vb.w / rect.width; vb.x = drag.vx - (e.clientX - drag.x) * s; vb.y = drag.vy - (e.clientY - drag.y) * s; svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h); });
    svg.addEventListener('pointerup', function () { drag = null; });
    function visible() { return J.places.filter(function (p) { return on.indexOf(p.layer) >= 0; }); }
    var ppu = 20;
    function fit() {
      var rc = svg.getBoundingClientRect();
      if (!(rc.width > 0 && rc.height > 0)) return;
      var A = rc.width / rc.height, a = vb.w / vb.h, cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2;
      if (Math.abs(A - a) > 0.01) {
        if (A > a) { vb.w = vb.h * A; vb.x = cx - vb.w / 2; } else { vb.h = vb.w / A; vb.y = cy - vb.h / 2; }
      }
      ppu = rc.width / vb.w;
    }
    function draw() {
      fit();
      svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
      var s = '', scale = 20 / ppu, fs = 11.5 / ppu, r = 5.5 / ppu;
      (J.outline || []).forEach(function (poly) { s += '<path class="map-land" d="M' + poly.map(function (p) { return px(p[0]).toFixed(2) + ' ' + py(p[1]).toFixed(2); }).join('L') + 'Z"/>'; });
      if (S.mapRivers !== false) Object.keys(J.rivers).forEach(function (n) { var pts = J.rivers[n]; s += '<path class="map-river" d="M' + pts.map(function (p) { return px(p[1]).toFixed(2) + ' ' + py(p[0]).toFixed(2); }).join('L') + '"><title>' + U.esc(n) + '</title></path>'; });
      if (S.mapRivers !== false && scale < 1.6) Object.keys(J.rivers).forEach(function (n) { var p = J.rivers[n][Math.floor(J.rivers[n].length / 2)]; s += '<text class="map-label" style="font-size:' + (fs * 0.85) + 'px;fill:var(--accent);font-style:italic" x="' + px(p[1]) + '" y="' + py(p[0]) + '">' + U.esc(n) + '</text>'; });
      visible().forEach(function (p, i) {
        var hl = quiz && quiz.reveal === p ? ' style="stroke:var(--ink);stroke-width:' + (r * 0.5) + '"' : '';
        s += '<circle class="map-dot" data-i="' + J.places.indexOf(p) + '" cx="' + px(p.lon).toFixed(2) + '" cy="' + py(p.lat).toFixed(2) + '" r="' + (quiz && quiz.reveal === p ? r * 1.8 : r) + '" fill="' + LAYER_COLOR[p.layer] + '"' + hl + '><title>' + U.esc(quiz ? '?' : p.n) + '</title></circle>';
        if (!quiz && S.mapLabels !== false) s += '<text class="map-label" style="font-size:' + fs + 'px" x="' + (px(p.lon) + r * 1.4).toFixed(2) + '" y="' + (py(p.lat) + fs * 0.35).toFixed(2) + '">' + U.esc(p.n) + '</text>';
      });
      svg.innerHTML = s;
    }
    svg.addEventListener('click', function (e) {
      var t = e.target; if (!t.classList || !t.classList.contains('map-dot')) return;
      var p = J.places[+t.getAttribute('data-i')];
      if (quiz) { answer(p); return; }
      info.innerHTML = '';
      info.appendChild(h('div', { class: 'row between' }, h('h3', null, p.n), h('span', { class: 'pill' }, J.layers.filter(function (l) { return l.id === p.layer; })[0].name)));
      info.appendChild(h('p', null, p.note));
      if (p.st) info.appendChild(h('p', { class: 'small muted' }, 'Present-day: ' + p.st + ' · ' + p.lat.toFixed(2) + '°N, ' + p.lon.toFixed(2) + '°E'));
    });
    function startQuiz() {
      var pool = visible();
      if (pool.length < 4) { U.toast('Turn on a layer with at least 4 places first.'); return; }
      var r = J.rng(Date.now());
      quiz = { list: J.shuffle(pool, r).slice(0, Math.min(10, pool.length)), i: 0, score: 0, reveal: null };
      ask();
    }
    function ask() {
      quiz.reveal = null; draw();
      info.innerHTML = '';
      if (quiz.i >= quiz.list.length) { info.appendChild(h('h3', null, 'Score: ' + quiz.score + ' / ' + quiz.list.length)); info.appendChild(h('p', null, quiz.score >= quiz.list.length * 0.7 ? U.line('good') : 'Turn labels on, study the layer for 2 minutes, and try again.')); quiz = null; draw(); return; }
      var p = quiz.list[quiz.i];
      info.appendChild(h('p', { class: 'eyebrow' }, 'Round ' + (quiz.i + 1) + ' of ' + quiz.list.length));
      info.appendChild(h('h3', null, 'Find: ' + p.n));
      info.appendChild(h('p', { class: 'small muted' }, 'Clue: ' + p.note.replace(new RegExp(p.n.split(' ')[0], 'g'), '…')));
    }
    function answer(p) {
      var want = quiz.list[quiz.i];
      if (quiz.reveal) return;
      var ok = p === want;
      if (ok) { quiz.score++; S.mapHits++; J.addXP(8, 'map'); J.questTick('map'); U.sound('good'); } else U.sound('bad');
      quiz.reveal = want; draw();
      info.appendChild(h('div', { class: 'explain ' + (ok ? 'ok' : 'no') }, h('b', null, ok ? U.line('good') : 'That was ' + p.n + '. The highlighted dot is ' + want.n + '.'), h('span', { class: 'small' }, want.note)));
      info.appendChild(h('button', { class: 'btn primary', onclick: function () { quiz.i++; ask(); } }, 'Next'));
    }
    draw();
    var onResize = function () { draw(); };
    window.addEventListener('resize', onResize);
    U.cleanup = function () { window.removeEventListener('resize', onResize); };
  };

  /* ---------------- Glossary & mnemonics ---------------- */
  J.V.glossary = function (root) {
    var S = J.S(), tab = S.gTab || 'terms';
    root.appendChild(h('h1', null, 'Glossary & mnemonics'));
    root.appendChild(U.seg([['terms', 'Syllabus terms'], ['mn', 'All memory tricks']], tab, function (v) { S.gTab = v; J.save(); U.route(); }, 'Tab'));
    var search = h('input', { class: 'input', type: 'search', id: 'g-search', placeholder: 'Search…', 'aria-label': 'Search glossary' });
    root.appendChild(search);
    var list = h('div', { class: 'card' }); root.appendChild(list);
    var cat = G.pairCat('concepts');
    if (tab === 'terms') {
      root.insertBefore(h('div', { class: 'row' },
        h('button', { class: 'btn primary', onclick: function () { J.startQuiz({ ids: G.sample(G.pool({}).filter(function (id) { return /^(pf|pr|pm|ps)\|concepts\|/.test(id); }), 20), title: 'Syllabus terms quiz' }); } }, 'Quiz me on terms'),
        h('button', { class: 'btn', onclick: function () { var dn = J.date.num(), n = 0; cat.items.forEach(function (it, i) { var id = 'p|concepts|' + i; if (!S.cards[id]) { S.cards[id] = [0, dn, 0, 0]; n++; } }); J.save(); U.toast(n ? n + ' term cards added' : 'Already added'); } }, 'Add all as flashcards')), list);
    }
    function draw(q) {
      list.innerHTML = ''; q = (q || '').toLowerCase(); var n = 0;
      if (tab === 'terms') {
        cat.items.forEach(function (it) {
          if (q && (it[0] + ' ' + it[1]).toLowerCase().indexOf(q) < 0) return; n++;
          list.appendChild(h('div', { class: 'topic-row' }, h('b', { style: { minWidth: '11rem' } }, it[0]), h('span', { class: 'nm' }, it[1])));
        });
      } else {
        J.topics.forEach(function (t) { (t.m || []).forEach(function (m) {
          if (q && (m[0] + m[1] + t.t).toLowerCase().indexOf(q) < 0) return; n++;
          list.appendChild(h('div', { class: 'mnem' }, h('b', null, m[0]), h('span', null, m[1]), h('a', { class: 'tiny', href: '#learn-' + t.id }, t.t)));
        }); });
        J.dyn.forEach(function (d) { if (!d.mn) return; if (q && (d.mn + d.name).toLowerCase().indexOf(q) < 0) return; n++; list.appendChild(h('div', { class: 'mnem' }, h('b', null, d.mn), h('a', { class: 'tiny', href: '#dyn-' + d.id }, d.name))); });
      }
      if (!n) list.appendChild(h('p', { class: 'muted' }, 'Nothing found.'));
    }
    search.addEventListener('input', function () { draw(search.value.trim()); });
    draw('');
  };
})(window.JRF);
