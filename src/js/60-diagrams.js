/* Diagrams hub: curated diagrams (tree, flow, cycle, table, cause→event→result) + every topic diagram,
   with a "test me" mode that hides the details until tapped. */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;
  var byId = {}; (J.diagrams || []).forEach(function (d) { byId[d.id] = d; });
  J.diagramsFor = function (tid) { return (J.diagrams || []).filter(function (d) { return d.topics.indexOf(tid) >= 0; }); };

  var hideOn = false;
  function secret(text) {
    if (!hideOn || !text) return h('span', null, text);
    var el = h('span', { class: 'hidden-name', role: 'button', tabindex: '0', title: 'Tap to reveal' }, text);
    function show() { el.classList.remove('hidden-name'); el.removeAttribute('role'); }
    el.addEventListener('click', show); el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    return el;
  }
  function split(line, sep) { var i = line.indexOf(sep); return i < 0 ? [line.trim(), ''] : [line.slice(0, i).trim(), line.slice(i + sep.length).trim()]; }
  function labelled(line) { var p = split(line, ' — '); return [h('b', null, p[0]), p[1] ? ' ' : null, p[1] ? secret(p[1]) : null]; }

  function parseTree(text) {
    var lines = text.split('\n').filter(function (l) { return l.trim(); });
    var root = { kids: [], lvl: -1 }, stack = [root];
    lines.forEach(function (l) {
      var lvl = l.match(/^ */)[0].length, node = { t: l.trim(), lvl: lvl, kids: [] };
      while (stack.length > 1 && stack[stack.length - 1].lvl >= lvl) stack.pop();
      stack[stack.length - 1].kids.push(node); stack.push(node);
    });
    return root.kids;
  }
  function renderTree(text) {
    var tops = parseTree(text), out = h('div', { class: 'dg-tree' });
    function list(nodes) { return h('ul', { class: 'dg-list' }, nodes.map(function (n) { return h('li', null, labelled(n.t), n.kids.length ? list(n.kids) : null); })); }
    tops.forEach(function (top) {
      out.appendChild(h('div', { class: 'dg-root' }, labelled(top.t)));
      if (!top.kids.length) return;
      // a single chain (each node has one child) reads better as a vertical list
      var deepChain = top.kids.length === 1;
      if (deepChain) { out.appendChild(h('div', { class: 'dg-chain' }, list(top.kids))); return; }
      out.appendChild(h('div', { class: 'dg-kids' }, top.kids.map(function (k, i) {
        return h('div', { class: 'dg-node c' + (i % 6) }, h('div', { class: 'dg-head' }, labelled(k.t)), k.kids.length ? list(k.kids) : null);
      })));
    });
    return out;
  }
  function renderFlow(text, cycle) {
    var steps = text.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return split(l, ' | '); });
    var ol = h('ol', { class: 'dg-flow' + (cycle ? ' cycle' : '') }, steps.map(function (s, i) {
      return h('li', { class: 'dg-step c' + (i % 6) }, h('span', { class: 'dg-n mono' }, String(i + 1)), h('b', null, s[0]), s[1] ? h('span', { class: 'small' }, secret(s[1])) : null);
    }));
    var wrap = h('div', { class: 'stack' }, ol);
    if (cycle) wrap.appendChild(h('p', { class: 'dg-loop small' }, '↺ back to step 1: ', h('b', null, steps[0][0])));
    return wrap;
  }
  function renderTable(text) {
    var rows = text.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return l.split('|').map(function (c) { return c.trim(); }); });
    var head = rows.shift();
    var cards = h('div', { class: 'dg-tcards' }, head.slice(1).map(function (col, j) {
      return h('div', { class: 'dg-node c' + (j % 6) }, h('div', { class: 'dg-head' }, h('b', null, col)), h('dl', { class: 'dg-dl' }, rows.map(function (r) { return [h('dt', null, r[0]), h('dd', null, secret(r[j + 1] || ''))]; })));
    }));
    return h('div', null, cards, h('div', { class: 'scrollx dg-twrap' }, h('table', { class: 'dg-table' },
      h('thead', null, h('tr', null, head.map(function (c) { return h('th', { scope: 'col' }, c); }))),
      h('tbody', null, rows.map(function (r) { return h('tr', null, r.map(function (c, i) { return i === 0 ? h('th', { scope: 'row' }, c) : h('td', null, secret(c)); })); })))));
  }
  function renderCER(text) {
    var C = [], E = [], R = [];
    text.split('\n').forEach(function (l) { l = l.trim(); var k = l.slice(0, 2), v = l.slice(2).trim(); if (k === 'C:') C.push(v); else if (k === 'E:') E.push(v); else if (k === 'R:') R.push(v); });
    function item(t) { return t.indexOf(' — ') >= 0 ? labelled(t) : secret(t); }
    function col(title, items, cls) { return h('div', { class: 'dg-col ' + cls }, h('p', { class: 'eyebrow' }, title), h('ul', { class: 'dg-list' }, items.map(function (t) { return h('li', null, item(t)); }))); }
    return h('div', { class: 'dg-cer' }, col('Causes', C, 'cause'), h('div', { class: 'dg-arrow', 'aria-hidden': 'true' }, '→'), h('div', { class: 'dg-col event' }, h('p', { class: 'eyebrow' }, 'Event'), E.map(function (t) { return h('p', { class: 'dg-event' }, labelled(t)); })), h('div', { class: 'dg-arrow', 'aria-hidden': 'true' }, '→'), col('Results', R, 'result'));
  }
  J.renderDiagram = function (d, hide) {
    hideOn = !!hide;
    var el = d.type === 'tree' ? renderTree(d.body) : d.type === 'flow' ? renderFlow(d.body) : d.type === 'cycle' ? renderFlow(d.body, true) : d.type === 'table' ? renderTable(d.body) : renderCER(d.body);
    hideOn = false; return el;
  };

  var TYPE = { tree: 'Tree', flow: 'Flow', cycle: 'Cycle', table: 'Comparison', cer: 'Cause → result' };
  function unitLabel(u) { var x = G.unit(u); return x ? (x.paper === 1 ? 'Paper 1 · ' : 'Unit ') + x.n : u; }
  function topicDiagram(tid) { var t = G.topic(tid); return t && t.d ? { id: 't-' + tid, t: t.t, u: t.u, topics: [tid], type: 'tree', body: t.d, note: '', fromTopic: true } : null; }
  function all() { return (J.diagrams || []).concat(J.topics.map(function (t) { return topicDiagram(t.id); }).filter(Boolean)); }

  J.V.diagrams = function (root) {
    var S = J.S(), uf = S.diagUnit || '';
    root.appendChild(h('h1', null, 'Diagrams & flowcharts'));
    root.appendChild(h('p', { class: 'muted' }, 'See the whole shape first, then test yourself: “Test me” blurs the details — say them aloud, tap to check.'));
    var units = J.units.map(function (u) { return u.id; });
    root.appendChild(h('div', { class: 'togglechips' }, [['', 'All']].concat(units.filter(function (u) { return all().some(function (d) { return d.u === u; }); }).map(function (u) { return [u, unitLabel(u)]; })).map(function (o) {
      return h('button', { 'aria-pressed': String(uf === o[0]), onclick: function () { S.diagUnit = o[0]; J.save(); U.route(); } }, o[1]);
    })));
    var cur = (J.diagrams || []).filter(function (d) { return !uf || d.u === uf; });
    if (cur.length) {
      root.appendChild(h('h2', null, 'Curated diagrams (' + cur.length + ')'));
      root.appendChild(h('div', { class: 'dyn-grid' }, cur.map(function (d) {
        return h('a', { class: 'dyn-card', href: '#diag-' + d.id }, h('div', { class: 'row between' }, h('span', { class: 'pill accent' }, unitLabel(d.u)), h('span', { class: 'pill' }, TYPE[d.type])), h('b', null, d.t));
      })));
    }
    var tds = J.topics.filter(function (t) { return t.d && (!uf || t.u === uf); });
    root.appendChild(h('h2', null, 'Diagrams from your topic notes (' + tds.length + ')'));
    root.appendChild(h('div', { class: 'dyn-grid' }, tds.map(function (t) {
      return h('a', { class: 'dyn-card', href: '#diag-t-' + t.id }, h('span', { class: 'pill' }, unitLabel(t.u)), h('b', null, t.d.split('\n')[0]), h('span', { class: 'small muted' }, t.t));
    })));
  };

  J.V.diag = function (root, id) {
    var S = J.S(), d = id.indexOf('t-') === 0 ? topicDiagram(id.slice(2)) : byId[id];
    if (!d) { root.appendChild(h('p', null, 'Diagram not found. ', h('a', { href: '#diagrams' }, 'All diagrams'))); return; }
    var hide = !!S.diagHide, list = all(), i = list.map(function (x) { return x.id; }).indexOf(d.id);
    root.appendChild(h('div', { class: 'row between' }, h('a', { class: 'btn ghost small', href: '#diagrams' }, U.icon('arrowL', 16), 'All diagrams'), h('span', { class: 'pill accent' }, unitLabel(d.u))));
    root.appendChild(h('h1', null, d.t));
    var holder = h('div', { class: 'card dg-card' });
    function draw() { holder.innerHTML = ''; holder.appendChild(J.renderDiagram(d, hide)); }
    root.appendChild(h('div', { class: 'row wrap' },
      h('button', { class: 'btn ' + (hide ? 'primary' : ''), 'aria-pressed': String(hide), onclick: function () { hide = !hide; S.diagHide = hide; J.save(); draw(); } }, U.icon('eye', 18), hide ? 'Test me: ON' : 'Test me'),
      hide ? h('button', { class: 'btn ghost', onclick: function () { holder.querySelectorAll('.hidden-name').forEach(function (e) { e.classList.remove('hidden-name'); }); } }, 'Reveal all') : null));
    root.appendChild(holder); draw();
    if (d.note) root.appendChild(h('div', { class: 'mnem' }, h('p', { class: 'eyebrow' }, 'Remember'), h('span', null, d.note)));
    var links = d.topics.map(function (tid) { var t = G.topic(tid); return t ? h('a', { class: 'btn small', href: '#learn-' + tid }, U.icon('book', 16), t.t) : null; }).filter(Boolean);
    if (links.length) root.appendChild(h('section', { class: 'card' }, h('p', { class: 'eyebrow' }, 'Topic notes'), h('div', { class: 'row wrap' }, links)));
    root.appendChild(h('div', { class: 'row between' },
      i > 0 ? h('a', { class: 'btn ghost small', href: '#diag-' + list[i - 1].id }, U.icon('arrowL', 16), 'Previous') : h('span'),
      i < list.length - 1 ? h('a', { class: 'btn ghost small', href: '#diag-' + list[i + 1].id }, 'Next', U.icon('arrowR', 16)) : h('span')));
  };
})(window.JRF);
