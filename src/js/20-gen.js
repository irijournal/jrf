/* Question bank: hand-written questions + deterministic generators over the fact tables.
   Every question has a stable id, so progress, mistakes and spaced repetition work for all of them. */
(function (J) {
  'use strict';
  var G = (J.G = {});
  var Q = J.Q, rng = J.rng, hash = J.hash, shuffle = J.shuffle;

  function fmtYear(y) { y = +y; if (y < 0) return (-y) + ' BCE'; if (y < 1000) return y + ' CE'; return String(y); }
  G.fmtYear = fmtYear;
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function uniq(a) { var s = {}, o = []; a.forEach(function (x) { if (!s[x]) { s[x] = 1; o.push(x); } }); return o; }
  function pick(arr, n, r) { return shuffle(arr, r).slice(0, n); }

  var pairById = {}; J.pairs.forEach(function (p) { pairById[p.id] = p; });
  var dynById = {}; J.dyn.forEach(function (d) { dynById[d.id] = d; });
  var topicById = {}; J.topics.forEach(function (t, i) { topicById[t.id] = t; t.idx = i; });
  var unitById = {}; J.units.forEach(function (u) { unitById[u.id] = u; });
  G.topic = function (id) { return topicById[id]; };
  G.unit = function (id) { return unitById[id]; };
  G.dynasty = function (id) { return dynById[id]; };
  G.pairCat = function (id) { return pairById[id]; };

  function disp(p, v) { return p.year ? fmtYear(v) : v; }
  var KIND_NAME = { mcq: 'MCQ', mt: 'Match List I–II', ch: 'Chronology', st: 'Multiple statements', s2: 'Statement I/II', ar: 'Assertion–Reason', math: 'Maths', di: 'Data interpretation', cp: 'Comprehension' };
  G.KIND_NAME = KIND_NAME;

  /* ---------------- PAIR GENERATORS ---------------- */
  function yearPool(p, R, r) {
    var yr = +R;
    var others = uniq(p.items.map(function (x) { return x[1]; }).filter(function (x) { return x !== R; }));
    others.sort(function (a, b) { return Math.abs(+a - yr) - Math.abs(+b - yr); });
    var near = others.slice(0, 8);
    // add synthetic near years so options are tight
    [1, 2, 3, 5, 7, 10, -1, -2, -3, -5, -7, -10].forEach(function (d) { var c = String(yr + d); if (near.indexOf(c) < 0) near.push(c); });
    return shuffle(near, r);
  }
  function genPF(cat, i, v) {
    var p = pairById[cat], it = p.items[i], R = it[1];
    var r = rng(hash('pf|' + cat + '|' + i + '|' + v));
    var pool = p.year ? yearPool(p, R, r) : shuffle(uniq(p.items.filter(function (x) { return x[1] !== R; }).map(function (x) { return x[1]; })), r);
    var po = J.placeOptions(disp(p, R), pool.slice(0, 6).map(function (x) { return disp(p, x); }), r);
    return { k: 'mcq', q: p.fq.replace('{L}', it[0]), o: po.o, a: po.a, ex: it[0] + ' — ' + disp(p, R) + '.', u: p.u, src: 'Fact table: ' + p.lh + ' → ' + p.rh };
  }
  function genPR(cat, i, v) {
    var p = pairById[cat], it = p.items[i], R = it[1];
    var r = rng(hash('pr|' + cat + '|' + i + '|' + v));
    var pool = shuffle(uniq(p.items.filter(function (x) { return x[1] !== R; }).map(function (x) { return x[0]; })), r);
    var po = J.placeOptions(it[0], pool.slice(0, 6), r);
    return { k: 'mcq', q: p.rq.replace('{R}', disp(p, R)), o: po.o, a: po.a, ex: it[0] + ' — ' + disp(p, R) + '.', u: p.u, src: 'Fact table: ' + p.rh + ' → ' + p.lh };
  }
  function pick4distinct(p, r) {
    var idx = shuffle(range(p.items.length), r), out = [], L = {}, R = {};
    for (var k = 0; k < idx.length && out.length < 4; k++) {
      var it = p.items[idx[k]];
      if (L[it[0]] || R[it[1]]) continue;
      L[it[0]] = R[it[1]] = 1; out.push(idx[k]);
    }
    return out;
  }
  function genPM(cat, seed) {
    var p = pairById[cat], r = rng(hash('pm|' + cat + '|' + seed));
    var ix = pick4distinct(p, r);
    var left = ix.map(function (i) { return p.items[i][0]; }), right = ix.map(function (i) { return disp(p, p.items[i][1]); });
    var q = Q.mt('Match List I with List II:', left, right, left.map(function (l, k) { return l + ' — ' + right[k]; }).join('; ') + '.', [p.lh, p.rh]);
    q.u = p.u; q.src = 'Fact table: ' + p.lh + ' → ' + p.rh; return q;
  }
  function genPS(cat, seed) {
    var p = pairById[cat], r = rng(hash('ps|' + cat + '|' + seed));
    var ix = pick4distinct(p, r);
    var truth = ix.map(function () { return r() < 0.55; });
    if (truth.every(Boolean)) truth[Math.floor(r() * 4)] = false;
    if (!truth.some(Boolean)) truth[Math.floor(r() * 4)] = true;
    var stm = [], ex = [];
    ix.forEach(function (i, k) {
      var it = p.items[i], R = it[1];
      if (truth[k]) { stm.push(it[0] + ' — ' + disp(p, R)); }
      else {
        var wrong = shuffle(p.items.filter(function (x) {
          return x[1] !== R && !p.items.some(function (y) { return y[0] === it[0] && y[1] === x[1]; });
        }), r)[0];
        if (!wrong) { truth[k] = true; stm.push(it[0] + ' — ' + disp(p, R)); }
        else stm.push(it[0] + ' — ' + disp(p, wrong[1]));
      }
      ex.push(it[0] + ' — ' + disp(p, R));
    });
    var q = Q.st('Which of the following pairs (' + p.lh + ' — ' + p.rh + ') are correctly matched?', stm, truth, 'Correct pairs: ' + ex.join('; ') + '.');
    q.u = p.u; q.src = 'Fact table: ' + p.lh + ' → ' + p.rh; return q;
  }

  function wrongFor(p, it, r) {
    var c = p.items.filter(function (x) {
      return x[1] !== it[1] && !p.items.some(function (y) { return y[0] === it[0] && y[1] === x[1]; });
    });
    if (p.year) { // a plausible wrong year: one of the nearest other years
      var y = +it[1];
      c = uniq(c.map(function (x) { return x[1]; })).sort(function (a, b) { return Math.abs(+a - y) - Math.abs(+b - y); }).slice(0, 5).map(function (v) { return [it[0], v]; });
    }
    return shuffle(c, r)[0];
  }
  /* Single-answer: which ONE pair is NOT correctly matched (even seed) / IS correctly matched (odd seed) */
  function genPN(cat, seed) {
    var p = pairById[cat], r = rng(hash('pn|' + cat + '|' + seed));
    var ix = pick4distinct(p, r), odd = (seed % 2 === 1), k0 = Math.floor(r() * 4), opts = [], ex = [];
    ix.forEach(function (i, k) {
      var it = p.items[i], flip = odd ? (k !== k0) : (k === k0), w = flip ? wrongFor(p, it, r) : null;
      opts.push(it[0] + ' — ' + disp(p, w ? w[1] : it[1]));
      ex.push(it[0] + ' — ' + disp(p, it[1]));
    });
    var q = odd ? 'Which ONE of the following pairs (' + p.lh + ' — ' + p.rh + ') is correctly matched?' : 'Which ONE of the following pairs (' + p.lh + ' — ' + p.rh + ') is NOT correctly matched?';
    return { k: 'mcq', q: q, o: opts, a: k0, ex: 'Correct pairs: ' + ex.join('; ') + '.', u: p.u, src: 'Fact table: ' + p.lh + ' → ' + p.rh };
  }
  /* Statement I / II built from two pairs */
  function pairSentence(p, L, R) { return p.st ? p.st.replace('{L}', L).replace('{R}', disp(p, R)) : L + ' — ' + disp(p, R) + ' (' + p.lh + ' → ' + p.rh + ').'; }
  function genP2(cat, seed) {
    var p = pairById[cat], r = rng(hash('p2|' + cat + '|' + seed));
    var ix = pick4distinct(p, r).slice(0, 2), t = [r() < 0.5, r() < 0.5], st = [], ex = [];
    ix.forEach(function (i, k) {
      var it = p.items[i], w = t[k] ? null : wrongFor(p, it, r);
      if (!t[k] && !w) t[k] = true;
      st.push(pairSentence(p, it[0], w ? w[1] : it[1]));
      ex.push(it[0] + ' — ' + disp(p, it[1]));
    });
    var q = Q.s2(st[0], st[1], t[0], t[1], 'Correct: ' + ex.join('; ') + '.');
    q.u = p.u; q.src = 'Fact table: ' + p.lh + ' → ' + p.rh; return q;
  }

  /* ---------------- DYNASTY GENERATORS ---------------- */
  var ROLE = {
    governorgeneral: { who: 'Governor-General/Viceroy', of: '' },
    primeminister: { who: 'Prime Minister of India', of: '' },
    sikhguru: { who: 'Sikh Guru', of: '' },
    peshwa: { who: 'Peshwa', of: '' },
    chhatrapati: { who: 'Maratha Chhatrapati', of: '' }
  };
  var nameDyn = {};
  J.dyn.forEach(function (d) { d.live = d.kings.map(function (k, i) { return { k: k, i: i }; }).filter(function (x) { return !x.k.skip; }); d.kings.forEach(function (k) { (nameDyn[k.n] = nameDyn[k.n] || []).push(d.id); }); });
  function roleOf(d) { return ROLE[d.id] ? ROLE[d.id].who : 'ruler of the ' + d.name; }
  function genDS(did, k, prev) { // successor / predecessor
    var d = dynById[did], a = d.kings[k], b = d.kings[prev ? k - 1 : k + 1];
    var r = rng(hash((prev ? 'dp|' : 'ds|') + did + '|' + k));
    var others = d.live.filter(function (x) { return x.k.n !== a.n && x.k.n !== b.n; }).map(function (x) { return x.k.n; });
    // traps first: neighbours
    var near = d.live.filter(function (x) { return Math.abs(x.i - k) <= 3 && x.k.n !== a.n && x.k.n !== b.n; }).map(function (x) { return x.k.n; });
    var pool = uniq(shuffle(near, r).concat(shuffle(others, r)));
    if (pool.length < 3) eraPeers(d).forEach(function (x) { x.live.forEach(function (y) { if (y.k.n !== a.n && y.k.n !== b.n) pool.push(y.k.n); }); });
    pool = uniq(pool);
    var po = J.placeOptions(b.n, pool.slice(0, 5), r);
    var q = prev ? 'Who immediately preceded ' + a.n + ' as ' + roleOf(d) + '?' : 'Who immediately succeeded ' + a.n + ' as ' + roleOf(d) + '?';
    return { k: 'mcq', q: q, o: po.o, a: po.a, ex: (prev ? b.n + ' (' + b.r + ') → ' + a.n : a.n + ' → ' + b.n + ' (' + b.r + ')') + '.', u: d.u, src: 'Dynasty: ' + d.name };
  }
  function eraPeers(d) { return J.dyn.filter(function (x) { return x.id !== d.id && x.era === d.era && !ROLE[x.id]; }); }
  function genDM(did, k, v) {
    var d = dynById[did], a = d.kings[k], r = rng(hash('dm|' + did + '|' + k + '|' + v));
    var peers = shuffle(eraPeers(d).map(function (x) { return x.name; }), r);
    var po = J.placeOptions(d.name, peers.slice(0, 5), r);
    return { k: 'mcq', q: a.n + ' (' + a.r + ') belonged to which dynasty?', o: po.o, a: po.a, ex: a.n + ' — ' + d.name + '. ' + a.f, u: d.u, src: 'Dynasty: ' + d.name };
  }
  function genDN(did, seed) {
    var d = dynById[did], r = rng(hash('dn|' + did + '|' + seed));
    var ins = pick(d.live, 3, r).map(function (x) { return x.k.n; });
    var names = {}; d.kings.forEach(function (k) { names[k.n] = 1; });
    var outPool = [];
    eraPeers(d).forEach(function (x) { x.live.forEach(function (y) { if (!names[y.k.n]) outPool.push(y.k.n + '|' + x.name); }); });
    var out = shuffle(outPool, r)[0].split('|');
    var opts = shuffle(ins.concat([out[0]]), r);
    var role = ROLE[d.id] ? ROLE[d.id].who + 's' : 'rulers of the ' + d.name;
    return { k: 'mcq', q: 'Which of the following was NOT among the ' + role + '?', o: opts, a: opts.indexOf(out[0]), ex: out[0] + ' belonged to the ' + out[1] + '.', u: d.u, src: 'Dynasty: ' + d.name };
  }
  function genDC(did, seed) {
    var d = dynById[did], r = rng(hash('dc|' + did + '|' + seed));
    var pool = d.live.filter(function (x) { return x.k.n.indexOf('(2nd') < 0 && x.k.n.indexOf('2nd term') < 0; });
    var ch = pick(pool, 4, r).sort(function (a, b) { return a.i - b.i; });
    var role = ROLE[d.id] ? ROLE[d.id].who + 's' : 'rulers of the ' + d.name;
    var q = Q.ch('Arrange the following ' + role + ' in chronological order:', ch.map(function (x) { return x.k.n; }), ch.map(function (x) { return x.k.n + ' (' + x.k.r + ')'; }).join(' → ') + '.');
    q.u = d.u; q.src = 'Dynasty: ' + d.name; return q;
  }
  var GENERIC = /\b(king|Later [A-Z]\w+|Short reign|Weak|Puppet|Displaced)\b/;
  var dfList = [];
  J.dyn.forEach(function (d) {
    d.live.forEach(function (x) {
      (x.k.f || '').split(';').map(function (s) { return s.trim(); }).forEach(function (f, fi) {
        if (!f || f.length < 6 || GENERIC.test(f)) return;
        var first = x.k.n.split(' ')[0];
        if (f.indexOf(first) >= 0 && first.length > 3) return;
        dfList.push([d.id, x.i, fi, f]);
      });
    });
  });
  function genDF(n) {
    var e = dfList[n], d = dynById[e[0]], a = d.kings[e[1]], f = e[3];
    var r = rng(hash('df|' + n));
    var pool = d.live.filter(function (x) { return x.i !== e[1]; }).map(function (x) { return x.k.n; });
    if (pool.length < 3) eraPeers(d).forEach(function (x) { x.live.forEach(function (y) { pool.push(y.k.n); }); });
    pool = uniq(shuffle(pool, r)).filter(function (n2) { return n2 !== a.n; });
    var po = J.placeOptions(a.n, pool.slice(0, 5), r), q;
    if (/^Founder/.test(f)) q = 'Who founded the ' + d.name + '?';
    else if (/^Last\b/.test(f)) q = 'Who was the last ' + (ROLE[d.id] ? ROLE[d.id].who : 'ruler of the ' + d.name) + '?';
    else if (d.id === 'governorgeneral') q = 'Who was the Governor-General/Viceroy associated with: “' + f + '”?';
    else if (d.id === 'primeminister') q = 'Which Prime Minister is associated with: “' + f + '”?';
    else q = 'Which ruler is associated with: “' + f + '”? (' + d.name + ')';
    return { k: 'mcq', q: q, o: po.o, a: po.a, ex: a.n + ' (' + a.r + '): ' + a.f + '.', u: d.u, src: 'Dynasty: ' + d.name };
  }

  /* ---------------- EVENT GENERATORS ---------------- */
  var evByUnit = {};
  J.events.forEach(function (e, i) { e.i = i; (evByUnit[e.u] = evByUnit[e.u] || []).push(e); });
  function evPool(u) {
    if (u === 'ALL') return J.events;
    var p = evByUnit[u] || [];
    if (p.length >= 8) return p;
    var order = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'], i = order.indexOf(u), out = p.slice();
    [i - 1, i + 1].forEach(function (j) { if (order[j] && order[j] !== 'H10') out = out.concat(evByUnit[order[j]] || []); });
    return out;
  }
  function okSet(set, minGap) {
    for (var a = 0; a < set.length; a++) for (var b = a + 1; b < set.length; b++) {
      var g = Math.abs(set[a].y - set[b].y), need = (set[a].approx || set[b].approx) ? Math.max(minGap, 80) : minGap;
      if (g < need) return false;
    }
    return true;
  }
  function pickEvents(u, n, key, minGap) {
    var pool = evPool(u), r = rng(hash(key));
    for (var t = 0; t < 60; t++) {
      var s = pick(pool, n, r);
      if (s.length === n && okSet(s, minGap)) return s.sort(function (a, b) { return a.y - b.y; });
    }
    var s2 = pool.slice().sort(function (a, b) { return a.y - b.y; });
    var step = Math.floor(s2.length / n), out = [];
    for (var k = 0; k < n; k++) out.push(s2[Math.min(s2.length - 1, k * step + Math.floor(r() * step))]);
    return out;
  }
  function yLabel(e) { return (e.approx ? 'c. ' : '') + fmtYear(e.y); }
  function genEC(u, seed) {
    var s = pickEvents(u, 4, 'ec|' + u + '|' + seed, u === 'ALL' ? 10 : 1);
    var q = Q.ch('Arrange the following events in chronological order:', s.map(function (e) { return e.t; }), s.map(function (e) { return e.t + ' (' + yLabel(e) + ')'; }).join(' → ') + '.');
    q.u = u === 'ALL' ? s[0].u : u; q.src = 'Master timeline'; return q;
  }
  function genEF(u, seed) {
    var s = pickEvents(u, 4, 'ef|' + u + '|' + seed, 1), r = rng(hash('ef2|' + u + '|' + seed));
    var last = seed % 2 === 1, ans = last ? s[3] : s[0];
    var opts = shuffle(s.map(function (e) { return e.t; }), r);
    return { k: 'mcq', q: 'Which of the following happened ' + (last ? 'LAST (most recently)' : 'FIRST (earliest)') + '?', o: opts, a: opts.indexOf(ans.t), ex: s.map(function (e) { return e.t + ' (' + yLabel(e) + ')'; }).join(' → ') + '.', u: u, src: 'Master timeline' };
  }
  function genE2(u, seed) {
    var s = pickEvents(u, 4, 'e2|' + u + '|' + seed, 1), r = rng(hash('e2b|' + u + '|' + seed));
    var sh = shuffle(s, r), a = sh[0], b = sh[1], c = sh[2], d = sh[3];
    var t1 = a.y < b.y, t2 = c.y > d.y;
    var q = Q.s2('“' + a.t + '” took place before “' + b.t + '”.', '“' + c.t + '” took place after “' + d.t + '”.', t1, t2,
      a.t + ' (' + yLabel(a) + '); ' + b.t + ' (' + yLabel(b) + '); ' + c.t + ' (' + yLabel(c) + '); ' + d.t + ' (' + yLabel(d) + ').');
    q.u = u; q.src = 'Master timeline'; return q;
  }
  var exactEv = J.events.filter(function (e) { return !e.approx; });
  function genEY(i, v) {
    var e = exactEv[i], r = rng(hash('ey|' + i + '|' + v));
    var cands = [];
    [1, 2, 3, 4, 5, 6, 8, 10, 12, 15].forEach(function (d) { cands.push(e.y + d, e.y - d); });
    cands = shuffle(cands.filter(function (y) { return y !== e.y && y !== 0; }), r);
    var po = J.placeOptions(fmtYear(e.y), cands.slice(0, 5).map(fmtYear), r);
    return { k: 'mcq', q: 'In which year: “' + e.t + '”?', o: po.o, a: po.a, ex: e.t + ' — ' + fmtYear(e.y) + '.', u: e.u, src: 'Master timeline' };
  }

  /* ---------------- MAP GENERATOR ---------------- */
  var stPlaces = J.places.filter(function (p) { return p.st; });
  var allStates = uniq(stPlaces.map(function (p) { return p.st; }));
  var layerUnit = {}; (J.layers || []).forEach(function (l) { layerUnit[l.id] = l.unit; });
  function genMZ(i, v) {
    var p = stPlaces[i], r = rng(hash('mz|' + i + '|' + v));
    var pool = shuffle(allStates.filter(function (s) { return s !== p.st; }), r);
    var po = J.placeOptions(p.st, pool.slice(0, 5), r);
    return { k: 'mcq', q: '“' + p.n + '” is located in present-day:', o: po.o, a: po.a, ex: p.n + ' — ' + p.st + '. ' + p.note + '.', u: layerUnit[p.layer] || 'H1', src: 'Map data' };
  }

  /* ---------------- PAPER 1 MATHS & REASONING ---------------- */
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function numOpts(ans, r, spread) {
    var c = [], s = spread || Math.max(2, Math.round(Math.abs(ans) * 0.12));
    [1, 2, 3, -1, -2, -3].forEach(function (k) { c.push(ans + k * Math.max(1, Math.round(s / 2))); });
    c = uniq(c.filter(function (x) { return x !== ans; }).map(String));
    return J.placeOptions(String(ans), shuffle(c, r), r);
  }
  var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var WORDS = ['CAT', 'DOG', 'BOOK', 'MILK', 'RIVER', 'STONE', 'HEART', 'PLANT', 'TEACH', 'LEARN', 'WATER', 'LIGHT', 'NOBLE', 'GRACE', 'MIND', 'PEACE', 'FORT', 'COIN', 'KING', 'QUEEN', 'SWORD', 'TEMPLE', 'MAPLE', 'CLOUD'];
  function shiftWord(w, k) { return w.split('').map(function (ch) { return ALPHA[(ALPHA.indexOf(ch) + k + 26) % 26]; }).join(''); }
  var MATH = {
    series: function (r, seed) {
      var t = seed % 8, seq = [], ans, rule;
      if (t === 0) { var a = ri(r, 2, 30), d = ri(r, 3, 15); for (var i = 0; i < 6; i++) seq.push(a + i * d); rule = 'add ' + d + ' each time'; }
      else if (t === 1) { var a1 = ri(r, 1, 5), q1 = ri(r, 2, 4); for (var j = 0; j < 6; j++) seq.push(a1 * Math.pow(q1, j)); rule = 'multiply by ' + q1; }
      else if (t === 2) { var k = ri(r, -3, 5), s0 = ri(r, 1, 6); for (var j2 = 0; j2 < 6; j2++) seq.push((s0 + j2) * (s0 + j2) + k); rule = 'n² ' + (k >= 0 ? '+ ' + k : '− ' + (-k)); }
      else if (t === 3) { var s1 = ri(r, 1, 4); for (var j3 = 0; j3 < 6; j3++) seq.push((s1 + j3) * (s1 + j3) * (s1 + j3) - 1); rule = 'n³ − 1'; }
      else if (t === 4) { var s2 = ri(r, 1, 6); for (var j4 = 0; j4 < 6; j4++) seq.push((s2 + j4) * (s2 + j4 + 1)); rule = 'n(n+1)'; }
      else if (t === 5) { var a5 = ri(r, 1, 9), b5 = ri(r, 1, 9); seq = [a5, b5]; for (var j5 = 2; j5 < 6; j5++) seq.push(seq[j5 - 1] + seq[j5 - 2]); rule = 'each term = sum of previous two'; }
      else if (t === 6) { var a6 = ri(r, 2, 20), d6 = ri(r, 1, 4), dd = ri(r, 1, 3); seq = [a6]; for (var j6 = 1; j6 < 6; j6++) seq.push(seq[j6 - 1] + d6 + (j6 - 1) * dd); rule = 'differences increase by ' + dd; }
      else { var a7 = ri(r, 2, 9), m7 = ri(r, 2, 3), p7 = ri(r, 1, 4); seq = [a7]; for (var j7 = 1; j7 < 6; j7++) seq.push(seq[j7 - 1] * m7 + p7); rule = '×' + m7 + ' + ' + p7; }
      ans = seq.pop();
      var po = numOpts(ans, r);
      return { q: 'Find the next term in the series: ' + seq.join(', ') + ', ?', o: po.o, a: po.a, ex: 'Rule: ' + rule + ' → ' + ans + '.' };
    },
    pct: function (r, seed) {
      var t = seed % 3;
      if (t === 0) { var x = ri(r, 2, 19) * 5, y = ri(r, 2, 40) * 20, ans = x * y / 100; var po = numOpts(ans, r); return { q: 'What is ' + x + '% of ' + y + '?', o: po.o, a: po.a, ex: x + ' × ' + y + ' / 100 = ' + ans + '.' }; }
      if (t === 1) { var a = ri(r, 1, 6) * 5, b = ri(r, 1, 6) * 5, up = r() < 0.5; var net = up ? a - b - a * b / 100 : a + b + a * b / 100; net = Math.round(net * 100) / 100;
        var opts = J.placeOptions(net + '%', uniq([(net + 1) + '%', (net - 1) + '%', (a - b) + '%', (a + b) + '%', (net + 2) + '%']).filter(function (o) { return o !== net + '%'; }), r);
        return { q: 'A price first ' + (up ? 'rises by ' + a + '% and then falls by ' + b + '%' : 'rises by ' + a + '% and then rises again by ' + b + '%') + '. The net change is:', o: opts.o, a: opts.a, ex: 'Successive change = a + b + ab/100 (use −b for a fall) = ' + net + '%.' }; }
      var from = ri(r, 4, 40) * 10, pct = ri(r, 1, 9) * 5, to = from + from * pct / 100; var po2 = numOpts(pct, r, 5);
      return { q: 'A value increases from ' + from + ' to ' + to + '. The percentage increase is:', o: po2.o.map(function (x) { return x + '%'; }), a: po2.a, ex: '(' + to + ' − ' + from + ') / ' + from + ' × 100 = ' + pct + '%.' };
    },
    pl: function (r, seed) {
      var t = seed % 2;
      if (t === 0) { var cp = ri(r, 4, 40) * 25, p = ri(r, 1, 8) * 5, sp = cp + cp * p / 100; var po = numOpts(p, r, 5);
        return { q: 'An article bought for Rs ' + cp + ' is sold for Rs ' + sp + '. Profit percent is:', o: po.o.map(function (x) { return x + '%'; }), a: po.a, ex: '(' + sp + ' − ' + cp + ') / ' + cp + ' × 100 = ' + p + '%.' }; }
      var mp = ri(r, 4, 20) * 100, d = ri(r, 1, 6) * 5, sp2 = mp - mp * d / 100; var po2 = numOpts(sp2, r);
      return { q: 'The marked price is Rs ' + mp + ' and a discount of ' + d + '% is given. Selling price is:', o: po2.o.map(function (x) { return 'Rs ' + x; }), a: po2.a, ex: mp + ' × (100 − ' + d + ') / 100 = Rs ' + sp2 + '.' };
    },
    interest: function (r, seed) {
      var P = ri(r, 2, 20) * 500, R = ri(r, 2, 12), T = ri(r, 2, 5);
      if (seed % 2 === 0) { var si = P * R * T / 100; var po = numOpts(si, r); return { q: 'Simple interest on Rs ' + P + ' at ' + R + '% per annum for ' + T + ' years is:', o: po.o.map(function (x) { return 'Rs ' + x; }), a: po.a, ex: 'SI = PRT/100 = ' + P + ' × ' + R + ' × ' + T + ' / 100 = Rs ' + si + '.' }; }
      var R2 = [5, 10, 20][ri(r, 0, 2)], diff = P * (R2 / 100) * (R2 / 100); diff = Math.round(diff * 100) / 100; var po2 = numOpts(diff, r, Math.max(2, Math.round(diff * 0.3)));
      return { q: 'The difference between compound and simple interest on Rs ' + P + ' for 2 years at ' + R2 + '% per annum is:', o: po2.o.map(function (x) { return 'Rs ' + x; }), a: po2.a, ex: 'CI − SI (2 years) = P(R/100)² = ' + P + ' × (' + R2 + '/100)² = Rs ' + diff + '.' };
    },
    avg: function (r) {
      var n = ri(r, 4, 7), nums = [], s = 0; for (var i = 0; i < n; i++) { var x = ri(r, 10, 99); nums.push(x); s += x; }
      if (Number.isInteger(s / n)) { var po = numOpts(s / n, r); return { q: 'Find the average of: ' + nums.join(', ') + '.', o: po.o, a: po.a, ex: 'Sum ' + s + ' ÷ ' + n + ' = ' + s / n + '.' }; }
      var avg = ri(r, 30, 70), k = ri(r, 4, 9), newV = ri(r, 10, 99), ans = Math.round((avg * k + newV) / (k + 1) * 100) / 100;
      var opts = J.placeOptions(String(ans), uniq([ans + 1, ans - 1, ans + 2, avg, Math.round((avg + newV) / 2)].map(String)).filter(function (x) { return x !== String(ans); }), r);
      return { q: 'The average of ' + k + ' numbers is ' + avg + '. If ' + newV + ' is added, the new average is:', o: opts.o, a: opts.a, ex: '(' + avg + ' × ' + k + ' + ' + newV + ') / ' + (k + 1) + ' = ' + ans + '.' };
    },
    speed: function (r, seed) {
      if (seed % 2 === 0) { var pairs = [[40, 60, 48], [30, 60, 40], [60, 90, 72], [20, 30, 24], [45, 90, 60], [36, 45, 40], [50, 75, 60], [12, 24, 16]], p = pairs[ri(r, 0, pairs.length - 1)];
        var po = numOpts(p[2], r, 4); return { q: 'A person goes at ' + p[0] + ' km/h and returns the same distance at ' + p[1] + ' km/h. Average speed (km/h)?', o: po.o, a: po.a, ex: '2xy/(x+y) = 2 × ' + p[0] + ' × ' + p[1] + ' / ' + (p[0] + p[1]) + ' = ' + p[2] + '.' }; }
      var len = ri(r, 10, 40) * 10, kmh = [36, 54, 72, 90, 108][ri(r, 0, 4)], ms = kmh * 5 / 18, t = len / ms; t = Math.round(t * 10) / 10;
      var po2 = numOpts(t, r, Math.max(2, Math.round(t * 0.3)));
      return { q: 'A train ' + len + ' m long runs at ' + kmh + ' km/h. Time taken to cross a pole (seconds)?', o: po2.o, a: po2.a, ex: kmh + ' km/h = ' + ms + ' m/s; ' + len + ' / ' + ms + ' = ' + t + ' s.' };
    },
    ratio: function (r) {
      var a = ri(r, 1, 7), b = ri(r, 1, 7); if (a === b) b++;
      var tot = (a + b) * ri(r, 5, 60), share = tot * a / (a + b); var po = numOpts(share, r);
      return { q: 'Rs ' + tot + ' is divided between A and B in the ratio ' + a + ':' + b + '. A’s share is:', o: po.o.map(function (x) { return 'Rs ' + x; }), a: po.a, ex: tot + ' × ' + a + '/' + (a + b) + ' = Rs ' + share + '.' };
    },
    work: function (r) {
      var pairs = [[10, 15, 6], [12, 24, 8], [20, 30, 12], [6, 12, 4], [15, 30, 10], [18, 36, 12], [10, 40, 8], [24, 40, 15], [30, 60, 20], [8, 24, 6]], p = pairs[ri(r, 0, pairs.length - 1)];
      var po = numOpts(p[2], r, 3);
      return { q: 'A can finish a work in ' + p[0] + ' days and B in ' + p[1] + ' days. Working together they finish it in (days):', o: po.o, a: po.a, ex: 'ab/(a+b) = ' + p[0] + ' × ' + p[1] + ' / ' + (p[0] + p[1]) + ' = ' + p[2] + '.' };
    },
    code: function (r) {
      var k = [1, 2, 3, -1, -2][ri(r, 0, 4)], w1 = WORDS[ri(r, 0, WORDS.length - 1)], w2 = WORDS[ri(r, 0, WORDS.length - 1)];
      if (w1 === w2) w2 = WORDS[(WORDS.indexOf(w1) + 3) % WORDS.length];
      var ans = shiftWord(w2, k), opts = uniq([shiftWord(w2, k + 1), shiftWord(w2, k - 1), shiftWord(w2, -k), w2.split('').reverse().join('')]).filter(function (x) { return x !== ans; });
      var po = J.placeOptions(ans, opts, r);
      return { q: 'If ' + w1 + ' is written as ' + shiftWord(w1, k) + ', how is ' + w2 + ' written in that code?', o: po.o, a: po.a, ex: 'Each letter is shifted by ' + (k > 0 ? '+' : '') + k + '.' };
    },
    letters: function (r) {
      var start = ri(r, 0, 6), d = ri(r, 1, 4), dd = ri(r, 0, 1), s = [], p = start, step = d;
      for (var i = 0; i < 5; i++) { s.push(ALPHA[p % 26]); p += step; step += dd; }
      var ans = s.pop(), opts = uniq([ALPHA[(ALPHA.indexOf(ans) + 1) % 26], ALPHA[(ALPHA.indexOf(ans) + 25) % 26], ALPHA[(ALPHA.indexOf(ans) + 2) % 26], ALPHA[(ALPHA.indexOf(ans) + 24) % 26]]);
      var po = J.placeOptions(ans, opts, r);
      return { q: 'Find the next letter: ' + s.join(', ') + ', ?', o: po.o, a: po.a, ex: 'Gaps: ' + d + (dd ? ' increasing by 1' : ' each') + ' → ' + ans + '.' };
    }
  };
  var MATH_KINDS = Object.keys(MATH);
  function genMath(kind, seed) {
    var r = rng(hash('m|' + kind + '|' + seed)), x = MATH[kind](r, seed);
    x.k = 'mcq'; x.u = 'P5'; x.src = 'Paper 1 generator (' + kind + ')'; x.math = true; return x;
  }
  var NOUNS = [['students', 'readers'], ['historians', 'writers'], ['kings', 'warriors'], ['coins', 'metals'], ['poets', 'scholars'], ['teachers', 'learners'], ['rivers', 'sacred places'], ['forts', 'monuments'], ['monks', 'travellers'], ['scientists', 'thinkers']];
  var SQ = { A: 'All {S} are {P}', E: 'No {S} are {P}', I: 'Some {S} are {P}', O: 'Some {S} are not {P}' };
  var SQT = { // given [form][truth] → result for others: T, F, U
    A1: { E: 'False', I: 'True', O: 'False' }, A0: { E: 'Undetermined', I: 'Undetermined', O: 'True' },
    E1: { A: 'False', I: 'False', O: 'True' }, E0: { A: 'Undetermined', I: 'True', O: 'Undetermined' },
    I1: { A: 'Undetermined', E: 'False', O: 'Undetermined' }, I0: { A: 'False', E: 'True', O: 'True' },
    O1: { A: 'False', E: 'Undetermined', I: 'Undetermined' }, O0: { A: 'True', E: 'False', I: 'True' }
  };
  function genLogic(seed) {
    var r = rng(hash('lg|' + seed)), forms = ['A', 'E', 'I', 'O'], g = forms[seed % 4], tv = Math.floor(seed / 4) % 2, keyForms = Object.keys(SQT[g + tv]);
    var t = keyForms[Math.floor(seed / 8) % 3], nn = NOUNS[Math.floor(seed / 24) % NOUNS.length];
    var f = function (x) { return SQ[x].replace('{S}', nn[0]).replace('{P}', nn[1]); };
    var ans = SQT[g + tv][t], opts = ['True', 'False', 'Undetermined', 'Both true and false'];
    return { k: 'mcq', q: 'If the proposition “' + f(g) + '” is ' + (tv ? 'TRUE' : 'FALSE') + ', then “' + f(t) + '” is:', o: opts, a: opts.indexOf(ans), ex: 'Square of opposition: ' + g + ' ' + (tv ? 'true' : 'false') + ' → ' + t + ' is ' + ans.toLowerCase() + '.', u: 'P6', src: 'Paper 1 generator (square of opposition)' };
  }
  var DI_CATS = [['Wheat', 'Rice', 'Pulses'], ['Laptops', 'Phones', 'Tablets'], ['Arts', 'Science', 'Commerce'], ['Cotton', 'Jute', 'Silk'], ['Books', 'Journals', 'E-books']];
  function diData(set) {
    var r = rng(hash('di|' + set)), cats = DI_CATS[set % DI_CATS.length], y0 = 2016 + (set % 5), rows = [];
    for (var i = 0; i < 5; i++) rows.push([y0 + i].concat(cats.map(function () { return ri(r, 4, 30) * 10; })));
    return { cats: cats, rows: rows, unit: set % 2 ? 'thousand tonnes' : 'thousand units' };
  }
  function genDI(set, qi) {
    var d = diData(set), r = rng(hash('dq|' + set + '|' + qi)), rows = d.rows, cats = d.cats, ci = qi % 3, q, ans, ex;
    var col = rows.map(function (x) { return x[ci + 1]; });
    if (qi === 0) { ans = col.reduce(function (a, b) { return a + b; }, 0); q = 'What is the total of ' + cats[ci] + ' over the five years?'; ex = col.join(' + ') + ' = ' + ans + '.'; }
    else if (qi === 1) { var a = col[0], b = col[4]; ans = Math.round((b - a) / a * 1000) / 10; q = 'What is the percentage change in ' + cats[ci] + ' from ' + rows[0][0] + ' to ' + rows[4][0] + ' (approx.)?'; ex = '(' + b + ' − ' + a + ') / ' + a + ' × 100 ≈ ' + ans + '%.'; ans = ans + '%'; }
    else if (qi === 2) { ans = Math.round(col.reduce(function (x, y) { return x + y; }, 0) / 5 * 10) / 10; q = 'What is the average annual figure for ' + cats[ci] + '?'; ex = 'Sum ÷ 5 = ' + ans + '.'; }
    else if (qi === 3) { var tots = rows.map(function (x) { return x[1] + x[2] + x[3]; }), mx = Math.max.apply(null, tots); ans = String(rows[tots.indexOf(mx)][0]); q = 'In which year was the combined total of all three categories the highest?'; ex = 'Totals: ' + rows.map(function (x, k) { return x[0] + ': ' + tots[k]; }).join(', ') + '.'; var yrs = rows.map(function (x) { return String(x[0]); }); var po0 = J.placeOptions(ans, yrs.filter(function (y) { return y !== ans; }), r); return diPack(d, q, po0, ex, set); }
    else { var y = ri(r, 0, 4), c1 = rows[y][1], c2 = rows[y][2], gcd = function (a2, b2) { return b2 ? gcd(b2, a2 % b2) : a2; }, g = gcd(c1, c2); ans = (c1 / g) + ':' + (c2 / g); q = 'In ' + rows[y][0] + ', what is the ratio of ' + cats[0] + ' to ' + cats[1] + '?'; ex = c1 + ':' + c2 + ' = ' + ans + '.'; var alt = uniq([(c2 / g) + ':' + (c1 / g), (c1 / g + 1) + ':' + (c2 / g), (c1 / g) + ':' + (c2 / g + 1), (c1 / g + 1) + ':' + (c2 / g + 1)]).filter(function (x) { return x !== ans; }); return diPack(d, q, J.placeOptions(ans, alt, r), ex, set); }
    var po;
    if (typeof ans === 'string' && ans.slice(-1) === '%') { var nv = parseFloat(ans); po = J.placeOptions(ans, uniq([(nv + 5) + '%', (nv - 5) + '%', (Math.round(nv / 2 * 10) / 10) + '%', (nv + 10) + '%']).filter(function (x) { return x !== ans; }), r); }
    else po = numOpts(ans, r);
    return diPack(d, q, po, ex, set);
  }
  function diPack(d, q, po, ex, set) {
    return { k: 'mcq', q: 'Study the table (figures in ' + d.unit + ') and answer: ' + q, o: po.o, a: po.a, ex: ex, u: 'P7', src: 'Paper 1 DI set #' + (set + 1), grid: { head: ['Year'].concat(d.cats), rows: d.rows }, di: true };
  }

  /* ---------------- BANK ---------------- */
  var BANK = null;
  function build() {
    var B = [];
    function add(id, u, k) { B.push([id, u, k]); }
    J.topics.forEach(function (t) { (t.q || []).forEach(function (q, i) { add('h|' + t.id + '|' + i, t.u, q.k); }); });
    (J.extraQ || []).forEach(function (q, i) { add('x|' + i, q.u, q.k); });
    (J.passages || []).forEach(function (p, pi) { p.q.forEach(function (q, qi) { add('cp|' + pi + '|' + qi, 'P3', 'cp'); }); });
    J.pairs.forEach(function (p) {
      var n = p.items.length;
      p.items.forEach(function (it, i) { for (var v = 0; v < 4; v++) { add('pf|' + p.id + '|' + i + '|' + v, p.u, 'mcq'); add('pr|' + p.id + '|' + i + '|' + v, p.u, 'mcq'); } });
      if (n >= 5) { for (var s = 0; s < n * 6; s++) add('pm|' + p.id + '|' + s, p.u, 'mt'); for (var s2 = 0; s2 < n * 2; s2++) add('ps|' + p.id + '|' + s2, p.u, 'st'); for (var s3 = 0; s3 < n * 2; s3++) { add('pn|' + p.id + '|' + s3, p.u, 'mcq'); add('p2|' + p.id + '|' + s3, p.u, 's2'); } }
    });
    J.dyn.forEach(function (d) {
      if (d.full) d.kings.forEach(function (k, i) {
        if (k.skip) return;
        if (i < d.kings.length - 1 && !d.kings[i + 1].skip) add('ds|' + d.id + '|' + i, d.u, 'mcq');
        if (i > 0 && !d.kings[i - 1].skip) add('dp|' + d.id + '|' + i, d.u, 'mcq');
      });
      if (!ROLE[d.id] && eraPeers(d).length >= 3) d.live.forEach(function (x) { if ((nameDyn[x.k.n] || []).length === 1) for (var v = 0; v < 3; v++) add('dm|' + d.id + '|' + x.i + '|' + v, d.u, 'mcq'); });
      if (d.live.length >= 3 && eraPeers(d).length) for (var s = 0; s < Math.min(25, d.live.length * 4); s++) add('dn|' + d.id + '|' + s, d.u, 'mcq');
      if (d.live.length >= 4) for (var c = 0; c < Math.min(40, d.live.length * 5); c++) add('dc|' + d.id + '|' + c, d.u, 'ch');
    });
    dfList.forEach(function (e, n) { add('df|' + n, dynById[e[0]].u, 'mcq'); });
    ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'].forEach(function (u) {
      if (!evPool(u).length) return;
      for (var s = 0; s < 2000; s++) add('ec|' + u + '|' + s, u, 'ch');
      for (var s2 = 0; s2 < 300; s2++) { add('ef|' + u + '|' + s2, u, 'mcq'); add('e2|' + u + '|' + s2, u, 's2'); }
    });
    for (var sa = 0; sa < 1500; sa++) add('ec|ALL|' + sa, 'H9', 'ch');
    exactEv.forEach(function (e, i) { for (var v = 0; v < 3; v++) add('ey|' + i + '|' + v, e.u, 'mcq'); });
    stPlaces.forEach(function (p, i) { for (var v = 0; v < 3; v++) add('mz|' + i + '|' + v, layerUnit[p.layer] || 'H1', 'mcq'); });
    MATH_KINDS.forEach(function (k) { for (var s = 0; s < 600; s++) add('m|' + k + '|' + s, 'P5', 'math'); });
    for (var l = 0; l < 480; l++) add('lg|' + l, 'P6', 'mcq');
    for (var d = 0; d < 800; d++) for (var qi = 0; qi < 5; qi++) add('di|' + d + '|' + qi, 'P7', 'di');
    G.sources.forEach(function (fn) { try { fn(add); } catch (e) { console.error('source failed', e); } });
    BANK = B;
    return B;
  }
  /* Extension points: other files register question sources (add ids to the bank) and generators (by id prefix). */
  G.sources = [];
  G.ext = {};
  G.bank = function () { return BANK || build(); };

  var cache = {};
  G.get = function (id) {
    if (cache[id]) return cache[id];
    var p = id.split('|'), q;
    try {
      switch (p[0]) {
        case 'h': var t = topicById[p[1]], hq = t.q[+p[2]]; q = Object.assign({}, hq, { u: t.u, topic: t.id, src: 'Hand-written · ' + t.t }); break;
        case 'x': q = Object.assign({}, J.extraQ[+p[1]]); q.src = q.src || 'Hand-written'; break;
        case 'cp': var ps = J.passages[+p[1]], pq = ps.q[+p[2]]; q = Object.assign({}, pq, { u: 'P3', passage: ps, src: 'Comprehension passage: ' + ps.t }); break;
        case 'pf': q = genPF(p[1], +p[2], +p[3]); break;
        case 'pr': q = genPR(p[1], +p[2], +p[3]); break;
        case 'pm': q = genPM(p[1], +p[2]); break;
        case 'ps': q = genPS(p[1], +p[2]); break;
        case 'pn': q = genPN(p[1], +p[2]); break;
        case 'p2': q = genP2(p[1], +p[2]); break;
        case 'ds': q = genDS(p[1], +p[2], false); break;
        case 'dp': q = genDS(p[1], +p[2], true); break;
        case 'dm': q = genDM(p[1], +p[2], +p[3]); break;
        case 'dn': q = genDN(p[1], +p[2]); break;
        case 'dc': q = genDC(p[1], +p[2]); break;
        case 'df': q = genDF(+p[1]); break;
        case 'ec': q = genEC(p[1], +p[2]); break;
        case 'ef': q = genEF(p[1], +p[2]); break;
        case 'e2': q = genE2(p[1], +p[2]); break;
        case 'ey': q = genEY(+p[1], +p[2]); break;
        case 'mz': q = genMZ(+p[1], +p[2]); break;
        case 'm': q = genMath(p[1], +p[2]); break;
        case 'lg': q = genLogic(+p[1]); break;
        case 'di': q = genDI(+p[1], +p[2]); break;
        default: if (G.ext[p[0]]) q = G.ext[p[0]](p);
      }
    } catch (e) { console.error('gen failed', id, e); q = null; }
    if (!q) return null;
    q.id = id;
    q.gen = p[0] !== 'h' && p[0] !== 'x' && p[0] !== 'cp';
    cache[id] = q;
    return q;
  };

  /* Filters: {units:[..], kinds:[..], src:'all'|'unseen'|'mistakes'|'hand'|'learned'} */
  G.pool = function (f) {
    var S = J.S(), B = G.bank(), out = [];
    var us = f.units && f.units.length ? f.units : null, ks = f.kinds && f.kinds.length ? f.kinds : null;
    var learnedUnits = null;
    if (f.src === 'learned') { learnedUnits = {}; J.topics.forEach(function (t) { if ((S.topics[t.id] || {}).st >= 2) learnedUnits[t.u] = 1; }); }
    for (var i = 0; i < B.length; i++) {
      var b = B[i];
      if (us && us.indexOf(b[1]) < 0) continue;
      if (ks && ks.indexOf(b[2]) < 0) continue;
      if (f.src === 'hand' && !(b[0].charAt(0) === 'h' || b[0].charAt(0) === 'x' || b[0].slice(0, 2) === 'cp')) continue;
      if (f.src === 'unseen' && S.q[b[0]]) continue;
      if (f.src === 'mistakes' && !(S.q[b[0]] && S.q[b[0]][0] > S.q[b[0]][1])) continue;
      if (learnedUnits && !learnedUnits[b[1]]) continue;
      out.push(b[0]);
    }
    return out;
  };
  G.unitOf = function (id) { var B = G.bank(); for (var i = 0; i < B.length; i++) if (B[i][0] === id) return B[i][1]; return null; };
  /* Balanced sample: spread over units and kinds, hand-written questions first for learned topics */
  G.sample = function (ids, n, seed) {
    var r = rng(hash('sample|' + (seed || Date.now())));
    if (ids.length <= n) return shuffle(ids, r);
    var byU = {};
    ids.forEach(function (id) { var k = id.split('|')[0]; (byU[k] = byU[k] || []).push(id); });
    var keys = shuffle(Object.keys(byU), r), out = [], guard = 0;
    keys.forEach(function (k) { byU[k] = shuffle(byU[k], r); });
    while (out.length < n && guard++ < n * 20) {
      var k = keys[guard % keys.length], arr = byU[k];
      if (arr.length) out.push(arr.pop());
    }
    return shuffle(out, r);
  };
  G.countBy = function () {
    var B = G.bank(), u = {}, k = {}, hand = 0;
    B.forEach(function (b) { u[b[1]] = (u[b[1]] || 0) + 1; k[b[2]] = (k[b[2]] || 0) + 1; if (b[0].charAt(0) === 'h' || b[0].charAt(0) === 'x' || b[0].slice(0, 2) === 'cp') hand++; });
    return { total: B.length, units: u, kinds: k, hand: hand };
  };
  G.topicQuestions = function (tid, extra) {
    var t = topicById[tid], ids = (t.q || []).map(function (q, i) { return 'h|' + tid + '|' + i; });
    if (extra) ids = ids.concat(G.sample(G.pool({ units: [t.u] }).filter(function (id) { return id.charAt(0) !== 'h'; }), extra, tid + J.date.today()));
    return ids;
  };

  /* ---------------- FLASHCARDS ---------------- */
  function cloze(text, idx) {
    var n = -1, ans = '';
    var front = text.replace(/\*\*(.+?)\*\*/g, function (m, g) { n++; if (n === idx) { ans = g; return '▢▢▢'; } return g; });
    return { front: front, back: ans };
  }
  J.cardsForTopic = function (tid) {
    var t = topicById[tid], out = [];
    if (!t) return out;
    (t.p || []).forEach(function (pt, pi) {
      var m = pt.match(/\*\*(.+?)\*\*/g) || [];
      m.forEach(function (seg, bi) { if (seg.length > 6 && bi < 3) out.push({ id: 'c|' + tid + '|' + pi + '|' + bi }); });
    });
    (t.m || []).forEach(function (mm, mi) { out.push({ id: 'n|' + tid + '|' + mi }); });
    return out;
  };
  J.cardsForUnit = function (u) {
    var out = [];
    J.pairs.forEach(function (p) { if (p.u === u) p.items.forEach(function (it, i) { out.push({ id: 'p|' + p.id + '|' + i }); }); });
    J.dyn.forEach(function (d) { if (d.u === u) d.live.forEach(function (x) { out.push({ id: 'k|' + d.id + '|' + x.i }); }); });
    return out;
  };
  J.getCard = function (id) {
    var p = id.split('|');
    try {
      if (p[0] === 'c') { var t = topicById[p[1]], c = cloze(t.p[+p[2]], +p[3]); return { front: c.front, back: c.back, src: t.t, u: t.u, tid: t.id }; }
      if (p[0] === 'n') { var t2 = topicById[p[1]], mm = t2.m[+p[2]]; return { front: 'Mnemonic: ' + mm[0], back: mm[1], src: t2.t, u: t2.u, tid: t2.id }; }
      if (p[0] === 'p') { var pc = pairById[p[1]], it = pc.items[+p[2]]; return { front: it[0] + '\n→ ' + pc.rh + '?', back: disp(pc, it[1]), src: pc.lh + ' → ' + pc.rh, u: pc.u }; }
      if (p[0] === 'k') { var d = dynById[p[1]], k = d.kings[+p[2]]; return { front: d.name + ': who ruled ' + k.r + '?\nHint: ' + (k.f.split(';')[0] || ''), back: k.n + ' — ' + k.f, src: d.name, u: d.u }; }
    } catch (e) { return null; }
    return null;
  };
})(window.JRF);
