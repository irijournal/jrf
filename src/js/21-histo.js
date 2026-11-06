/* Historiography question generators + flashcards (Unit X).
   Ids start with "r" so they never clash with hand-written ("h"/"x") questions. */
(function (J) {
  'use strict';
  var G = J.G, Q = J.Q, rng = J.rng, hash = J.hash, shuffle = J.shuffle;
  var HS = J.historians || [], SCH = J.hSchools || [];
  var hById = {}, sById = {};
  HS.forEach(function (x, i) { hById[x.id] = x; x.ix = i; });
  SCH.forEach(function (s) { sById[s.id] = s; s.members = HS.filter(function (x) { return x.s.indexOf(s.id) >= 0; }); });
  J.H = { byId: hById, school: sById };

  function uniq(a) { var s = {}, o = []; a.forEach(function (x) { if (!s[x]) { s[x] = 1; o.push(x); } }); return o; }
  function fy(y) { return G.fmtYear(y); }
  function yl(w) { return w.y === null ? '' : (w.approx ? 'c. ' : '') + fy(w.y); }
  var TAG = /\s*\((Majumdar|Tara Chand|Afif|Tacitus|Niebuhr|Eusebius)\)$/;
  function show(t) { return t.replace(TAG, ''); }
  function norm(t) { return t.replace(/\s*\([^)]*\)/g, '').replace(/^(The|A|An)\s+/i, '').trim().toLowerCase(); }
  function surname(n) { var p = n.replace(/\s+and\s+.*/, '').split(' '); return p[p.length - 1]; }
  function names(x) { return x.n.split(/\s+and\s+/).map(function (s) { var p = s.trim().split(' '); return p[p.length - 1]; }); }

  /* Works */
  var WORKS = [];
  HS.forEach(function (x) { x.w.forEach(function (w) { WORKS.push({ h: x, w: w, base: norm(w.t) }); }); });
  var baseOwners = {};
  // titles that are the same or one is the start of the other (e.g. "Ecclesiastical History" / "... of the English People") count as one
  WORKS.forEach(function (o) {
    var own = baseOwners[o.base] = baseOwners[o.base] || [];
    WORKS.forEach(function (z) { if (z.h !== o.h && z.base.length >= 8 && o.base.length >= 8 && (z.base.indexOf(o.base) === 0 || o.base.indexOf(z.base) === 0) && own.indexOf(z.h.id) < 0) own.push(z.h.id); });
    if (own.indexOf(o.h.id) < 0) own.push(o.h.id);
  });
  var EXACT = WORKS.filter(function (o) { return o.w.y !== null && !o.w.approx; });
  J.H.works = WORKS;

  function verb(t) {
    if (/^Decipherment of /.test(t)) return { v: 'deciphered', t: t.replace(/^Decipherment of /, ''), plain: true, bare: true };
    if (/\((journal )?founded\)/.test(t)) return { v: 'founded', t: t.replace(/\s*\((journal )?founded\)/, ''), plain: true };
    if (/\(founded with ([^)]+)\)/.test(t)) return { v: 'co-founded', t: t.replace(/\s*\(founded with [^)]+\)/, '') + ' (with ' + t.match(/\(founded with ([^)]+)\)/)[1] + ')', plain: true };
    if (/\((general )?editor\)|\(ed\.\)/.test(t)) return { v: 'edited', t: t.replace(/\s*\((general )?editor\)|\s*\(ed\.\)/, '') };
    if (/\(ed\. with ([^)]+)\)/.test(t)) return { v: 'edited', t: t.replace(/\s*\(ed\. with [^)]+\)/, '') + ' (with ' + t.match(/\(ed\. with ([^)]+)\)/)[1] + ')' };
    if (/\(director\)/.test(t)) return { v: 'directed', t: t.replace(/\s*\(director\)/, ''), plain: true };
    if (/\(planned\)/.test(t)) return { v: 'planned', t: t.replace(/\s*\(planned\)/, ''), plain: true };
    if (/\(English translation\)/.test(t)) return { v: 'translated', t: t.replace(/\s*\(English translation\)/, '') + ' into English', plain: true };
    return { v: 'wrote', t: show(t) };
  }
  function quoteT(t) { var m = t.match(/^(.*) (\(with [^)]+\))$/); return m ? '“' + m[1] + '” ' + m[2] : '“' + t + '”'; }
  function wq(o) { var vb = verb(o.w.t); return (vb.plain ? (vb.bare ? '' : 'the ') + vb.t : quoteT(vb.t)) + (o.w.y !== null ? ' (' + yl(o.w) + ')' : ''); }
  function wdisp(o) { var vb = verb(o.w.t); return (vb.v === 'wrote' ? '' : vb.v.charAt(0).toUpperCase() + vb.v.slice(1) + ': ') + vb.t; }
  function phrase(o) { var vb = verb(o.w.t); return o.h.n + ' ' + vb.v + ' ' + (vb.plain ? (vb.bare ? '' : 'the ') + vb.t : quoteT(vb.t)); }

  /* Distractor historians.
     mode 'near': same region, same school first (good for "who wrote" — work titles are unique);
     mode 'far' : same region, NO shared school (for concepts/quotes, to avoid two right answers). */
  var REL = { 'marxist-i': ['aligarh'], aligarh: ['marxist-i'], subaltern: ['postcolonial'], postcolonial: ['subaltern', 'postmodern'], annales: ['cultural', 'micro'], cultural: ['annales', 'micro'], micro: ['cultural', 'annales'], marxist: ['global'], global: ['marxist'], speculative: ['romantic', 'idealist'], romantic: ['speculative', 'whig'], whig: ['romantic'], idealist: ['speculative', 'analytic', 'relativist'], analytic: ['idealist'], relativist: ['idealist'], rankean: ['positivist'], positivist: ['rankean'], postmodern: ['postcolonial', 'cultural'], gender: ['postmodern'] };
  function related(sid) { return [sid].concat(REL[sid] || []); }
  function isClose(x, y) { // y shares or is close to one of x's schools
    return y.s.some(function (s) { return s !== 'other' && x.s.some(function (t) { return related(t).indexOf(s) >= 0; }); });
  }
  J.H.related = related;
  function blocked(x, cand, extra) {
    if (cand === x) return true;
    if (extra && extra.some(function (e) { return e && cand.n.indexOf(e) >= 0; })) return true;
    return false;
  }
  function peers(x, r, mode, o) {
    o = o || {};
    var reg = HS.filter(function (y) { return y.r === x.r && !blocked(x, y, o.ban); });
    if (o.excludeIds) reg = reg.filter(function (y) { return o.excludeIds.indexOf(y.id) < 0; });
    if (o.test) reg = reg.filter(function (y) { return !o.test(y); });
    var share = function (y) { return y.s.some(function (s) { return s !== 'other' && x.s.indexOf(s) >= 0; }); };
    var out;
    if (mode === 'far') out = shuffle(reg.filter(function (y) { return !isClose(x, y); }), r);
    else {
      var same = shuffle(reg.filter(share), r), near = shuffle(reg.filter(function (y) { return !share(y) && Math.abs(y.ix - x.ix) <= 30; }), r), rest = shuffle(reg, r);
      out = same.slice(0, 2).concat(near.slice(0, 3)).concat(rest);
    }
    var seen = {}, res = [];
    out.forEach(function (y) { if (!seen[y.n]) { seen[y.n] = 1; res.push(y); } });
    return res;
  }
  function banFor(o) {
    // never offer co-authors / people named in the title, or owners of a work with the same base title
    var ban = [], t = o.w.t;
    HS.forEach(function (y) { if (y !== o.h && names(y).some(function (s) { return s.length > 2 && new RegExp('\\b' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(t); })) ban.push(y.id); });
    (baseOwners[o.base] || []).forEach(function (id) { if (id !== o.h.id) ban.push(id); });
    return ban;
  }
  function exH(x) {
    var s = x.s.filter(function (id) { return sById[id]; }).map(function (id) { return sById[id].n; });
    return x.n + (x.life ? ' (' + x.life + ')' : '') + (s.length ? ' — ' + s.join(' / ') : '') + '. ' + (x.w.slice(0, 3).map(function (w) { return show(w.t) + (w.y !== null ? ' (' + yl(w) + ')' : ''); }).join('; ')) + '.' + (x.i[0] ? ' ' + x.i[0] : '');
  }
  var SRC = 'Historiography bank';
  function mk(k, q, o, a, ex) { return { k: k, q: q, o: o, a: a, ex: ex, u: 'H10', src: SRC }; }

  /* rw: work → author */
  function genRW(k, v) {
    var o = WORKS[k], r = rng(hash('rw|' + k + '|' + v)), vb = verb(o.w.t);
    var d = peers(o.h, r, 'near', { excludeIds: banFor(o) }).map(function (y) { return y.n; });
    var po = J.placeOptions(o.h.n, d.slice(0, 6), r);
    var q = 'Who ' + vb.v + ' ' + wq(o) + '?';
    return mk('mcq', q, po.o, po.a, exH(o.h));
  }
  /* ra: author → which work */
  function genRA(hid, v) {
    var x = hById[hid], r = rng(hash('ra|' + hid + '|' + v)), mine = x.w[v % x.w.length];
    var myBases = x.w.map(function (w) { return norm(w.t); }), sn = names(x);
    var pool = shuffle(WORKS.filter(function (o) {
      return o.h !== x && o.h.r === x.r && myBases.indexOf(o.base) < 0 && !sn.some(function (s) { return s.length > 2 && o.w.t.indexOf(s) >= 0; });
    }), r);
    var share = pool.filter(function (o) { return o.h.s.some(function (s) { return s !== 'other' && x.s.indexOf(s) >= 0; }); });
    var cands = uniq(share.slice(0, 2).concat(pool).map(function (o) { return wdisp(o); }));
    var right = wdisp({ h: x, w: mine });
    var po = J.placeOptions(right, cands.slice(0, 6), r);
    return mk('mcq', 'Which of the following is associated with ' + x.n + '?', po.o, po.a, exH(x));
  }
  /* ry: work → year */
  function genRY(k, v) {
    var o = EXACT[k], r = rng(hash('ry|' + k + '|' + v)), y = o.w.y, c = [];
    [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].forEach(function (d) { c.push(y + d, y - d); });
    c = shuffle(c.filter(function (z) { return z !== 0 && z !== y; }), r);
    var po = J.placeOptions(fy(y), c.slice(0, 5).map(fy), r);
    return mk('mcq', 'In which year: ' + phrase(o) + '?', po.o, po.a, phrase(o) + ' in ' + fy(y) + '.');
  }
  /* rc: chronology of four works */
  var POOLS = { W: EXACT.filter(function (o) { return o.h.r === 'W'; }), I: EXACT.filter(function (o) { return o.h.r === 'I'; }), ALL: EXACT };
  function genRC(R, seed) {
    var pool = POOLS[R], gap = R === 'I' ? 5 : R === 'W' ? 8 : 12, r = rng(hash('rc|' + R + '|' + seed)), pickd = null;
    for (var t = 0; t < 80 && !pickd; t++) {
      var s = shuffle(pool, r).slice(0, 4).sort(function (a, b) { return a.w.y - b.w.y; }), ok = true;
      for (var i = 1; i < 4; i++) if (s[i].w.y - s[i - 1].w.y < gap || s[i].h === s[i - 1].h) ok = false;
      if (ok) pickd = s;
    }
    if (!pickd) { var srt = pool.slice().sort(function (a, b) { return a.w.y - b.w.y; }), st = Math.floor(srt.length / 4); pickd = [0, 1, 2, 3].map(function (k) { return srt[k * st + Math.floor(r() * st)]; }); }
    var q = Q.ch('Arrange the following works of history in chronological order:', pickd.map(function (o) { return wdisp(o) + ' — ' + o.h.n; }), pickd.map(function (o) { return show(o.w.t) + ' (' + fy(o.w.y) + ')'; }).join(' → ') + '.');
    q.u = 'H10'; q.src = SRC; return q;
  }
  /* rs: historian → school */
  var SCHOOLED = HS.filter(function (x) { return x.s[0] !== 'other' && sById[x.s[0]]; });
  function genRS(hid, v) {
    var x = hById[hid], r = rng(hash('rs|' + hid + '|' + v)), right = sById[x.s[v % x.s.length]] || sById[x.s[0]];
    var bad = []; x.s.forEach(function (z) { bad = bad.concat(related(z)); });
    var other = shuffle(SCH.filter(function (s) { return s.r === x.r && bad.indexOf(s.id) < 0; }), r).map(function (s) { return s.n; });
    var po = J.placeOptions(right.n, other.slice(0, 5), r);
    return mk('mcq', 'With which school or trend of historiography is ' + x.n + ' associated?', po.o, po.a, exH(x));
  }
  /* rn: school membership (NOT / IS) */
  var BIG = SCH.filter(function (s) { return s.members.length >= 3; });
  function genRN(sid, seed) {
    var s = sById[sid], r = rng(hash('rn|' + sid + '|' + seed)), odd = seed % 2 === 1;
    var rel = related(sid);
    var ins = shuffle(s.members, r), outs = shuffle(HS.filter(function (x) { return x.r === s.r && x.s[0] !== 'other' && !x.s.some(function (z) { return rel.indexOf(z) >= 0; }); }), r);
    var pickIn = odd ? ins.slice(0, 1) : ins.slice(0, 3), pickOut = odd ? outs.slice(0, 3) : outs.slice(0, 1);
    var right = odd ? pickIn[0] : pickOut[0];
    var opts = shuffle(pickIn.concat(pickOut), r).map(function (x) { return x.n; });
    var q = odd ? 'Which of the following historians belonged to the ' + s.n + '?' : 'Which of the following historians did NOT belong to the ' + s.n + '?';
    return mk('mcq', q, opts, opts.indexOf(right.n), s.n + ': ' + s.members.map(function (x) { return x.n; }).join(', ') + '. ' + right.n + ' — ' + (right.s.filter(function (z) { return sById[z]; }).map(function (z) { return sById[z].n; }).join(' / ') || 'not part of this school') + '.');
  }
  /* rk: concept → historian; rkm: meaning → concept */
  var CON = J.hConcepts || [];
  function mentions(y, term) { var t = term.toLowerCase(); return (y.i.join(' ') + ' ' + y.c.map(function (c) { return c[0]; }).join(' ') + ' ' + y.q.join(' ')).toLowerCase().indexOf(t) >= 0; }
  function genRK(ci, v) {
    var c = CON[ci], x = hById[c.h], r = rng(hash('rk|' + ci + '|' + v));
    var d = peers(x, r, 'far', { test: function (y) { return mentions(y, c.t); } }).map(function (y) { return y.n; });
    var po = J.placeOptions(x.n, d.slice(0, 6), r);
    return mk('mcq', 'The concept “' + c.t + '” is associated with:', po.o, po.a, '“' + c.t + '” — ' + c.m + ' (' + x.n + ').');
  }
  function genRKM(ci, v) {
    var c = CON[ci], r = rng(hash('rkm|' + ci + '|' + v));
    var d = shuffle(CON.filter(function (z) { return z.h !== c.h; }), r).map(function (z) { return z.t; });
    var po = J.placeOptions(c.t, d.slice(0, 6), r);
    return mk('mcq', 'Which concept means: “' + c.m + '”?', po.o, po.a, '“' + c.t + '” — ' + hById[c.h].n + '.');
  }
  /* rq: phrase → historian */
  var QUO = []; HS.forEach(function (x) { x.q.forEach(function (q) { QUO.push({ h: x, q: q }); }); });
  function genRQ(qi, v) {
    var o = QUO[qi], r = rng(hash('rq|' + qi + '|' + v));
    var d = peers(o.h, r, 'far').map(function (y) { return y.n; });
    var po = J.placeOptions(o.h.n, d.slice(0, 6), r);
    return mk('mcq', 'Who is known for the words: “' + o.q + '”?', po.o, po.a, '“' + o.q + '” — ' + o.h.n + '.');
  }
  /* rm: matching lists */
  function four(list, keyL, keyR, r) {
    var out = [], L = {}, R = {};
    shuffle(list, r).forEach(function (o) { var a = keyL(o), b = keyR(o); if (out.length < 4 && !L[a] && !R[b]) { L[a] = R[b] = 1; out.push(o); } });
    return out;
  }
  function genRM(type, seed) {
    var r = rng(hash('rm|' + type + '|' + seed)), rows, left, right, heads;
    if (type === 'waW' || type === 'waI') {
      var reg = type === 'waW' ? 'W' : 'I';
      rows = four(WORKS.filter(function (o) { return o.h.r === reg && verb(o.w.t).v === 'wrote' && !/\(with /.test(o.w.t); }), function (o) { return o.base; }, function (o) { return o.h.n; }, r);
      // the same author cannot also own another listed base title
      left = rows.map(function (o) { return show(o.w.t); }); right = rows.map(function (o) { return o.h.n; }); heads = ['Work', 'Author'];
    } else if (type === 'hsW' || type === 'hsI') {
      var rg = type === 'hsW' ? 'W' : 'I';
      rows = four(SCHOOLED.filter(function (x) { return x.r === rg && x.s.length === 1; }), function (x) { return x.n; }, function (x) { return x.s[0]; }, r);
      left = rows.map(function (x) { return x.n; }); right = rows.map(function (x) { return sById[x.s[0]].n; }); heads = ['Historian', 'School / trend'];
    } else if (type === 'ck') {
      rows = four(CON, function (c) { return c.t; }, function (c) { var s0 = hById[c.h].s[0]; return s0 === 'other' ? c.h : s0; }, r);
      left = rows.map(function (c) { return c.t; }); right = rows.map(function (c) { return hById[c.h].n; }); heads = ['Concept', 'Thinker'];
    } else {
      rows = four(EXACT.filter(function (o) { return verb(o.w.t).v === 'wrote'; }), function (o) { return o.base; }, function (o) { return String(o.w.y); }, r);
      left = rows.map(function (o) { return show(o.w.t) + ' — ' + o.h.n; }); right = rows.map(function (o) { return fy(o.w.y); }); heads = ['Work', 'Year'];
    }
    var q = Q.mt('Match List I with List II:', left, right, left.map(function (l, k) { return l + ' — ' + right[k]; }).join('; ') + '.', heads);
    q.u = 'H10'; q.src = SRC; return q;
  }
  /* rt: multiple statements (who wrote what) */
  function genRT(R, seed) {
    var r = rng(hash('rt|' + R + '|' + seed));
    var pool = WORKS.filter(function (o) { return o.h.r === R && verb(o.w.t).v === 'wrote' && !/\(with /.test(o.w.t); });
    var pickd = four(pool, function (o) { return o.base; }, function (o) { return o.h.id; }, r), truth = [], st = [], ex = [];
    pickd.forEach(function (o, k) {
      var t = r() < 0.55;
      if (!t) {
        var ban = banFor(o), alt = shuffle(peers(o.h, r, 'near', { excludeIds: ban }), r)[0];
        if (!alt) t = true; else { st.push(alt.n + ' wrote “' + show(o.w.t) + '”.'); }
      }
      if (t) st.push(o.h.n + ' wrote “' + show(o.w.t) + '”.');
      truth.push(t); ex.push('“' + show(o.w.t) + '” — ' + o.h.n);
    });
    if (truth.every(Boolean)) { /* keep: "all four" is a valid key */ }
    var q = Q.st('Which of the following statements are correct?', st, truth, ex.join('; ') + '.');
    q.u = 'H10'; q.src = SRC; return q;
  }
  /* r2: Statement I / II (school + concept) */
  function stmt(r) {
    if (r() < 0.5) {
      var x = shuffle(SCHOOLED, r)[0], t = r() < 0.5, s = sById[x.s[0]];
      if (!t) { var bad = []; x.s.forEach(function (z) { bad = bad.concat(related(z)); }); var wrong = shuffle(SCH.filter(function (z) { return z.r === x.r && bad.indexOf(z.id) < 0; }), r)[0]; if (wrong) s = wrong; else t = true; }
      return { s: x.n + (/ and /.test(x.n) ? ' are' : ' is') + ' associated with “' + s.n + '”.', t: t, ex: x.n + ' — ' + x.s.filter(function (z) { return sById[z]; }).map(function (z) { return sById[z].n; }).join(' / ') };
    }
    var c = shuffle(CON, r)[0], hx = hById[c.h], tt = r() < 0.5, who = hx;
    if (!tt) { var alt = peers(hx, r, 'far', { test: function (y) { return mentions(y, c.t); } })[0]; if (alt) who = alt; else tt = true; }
    return { s: 'The concept of “' + c.t + '” is associated with ' + who.n + '.', t: tt, ex: '“' + c.t + '” — ' + hx.n };
  }
  function genR2(seed) {
    var r = rng(hash('r2|' + seed)), a = stmt(r), b = stmt(r);
    if (a.s === b.s) b = stmt(r);
    var q = Q.s2(a.s, b.s, a.t, b.t, a.ex + '; ' + b.ex + '.');
    q.u = 'H10'; q.src = SRC; return q;
  }

  /* Register with the bank */
  G.sources.push(function (add) {
    WORKS.forEach(function (o, k) { for (var v = 0; v < 3; v++) add('rw|' + k + '|' + v, 'H10', 'mcq'); });
    HS.forEach(function (x) { var n = Math.min(3, Math.max(1, x.w.length)); for (var v = 0; v < n; v++) add('ra|' + x.id + '|' + v, 'H10', 'mcq'); });
    EXACT.forEach(function (o, k) { for (var v = 0; v < 2; v++) add('ry|' + k + '|' + v, 'H10', 'mcq'); });
    for (var s = 0; s < 1200; s++) { add('rc|W|' + s, 'H10', 'ch'); add('rc|I|' + s, 'H10', 'ch'); }
    for (var s2 = 0; s2 < 400; s2++) add('rc|ALL|' + s2, 'H10', 'ch');
    SCHOOLED.forEach(function (x) { for (var v = 0; v < 2; v++) add('rs|' + x.id + '|' + v, 'H10', 'mcq'); });
    BIG.forEach(function (sc) { var n = Math.min(40, sc.members.length * 6); for (var v = 0; v < n; v++) add('rn|' + sc.id + '|' + v, 'H10', 'mcq'); });
    CON.forEach(function (c, i) { for (var v = 0; v < 3; v++) add('rk|' + i + '|' + v, 'H10', 'mcq'); for (var v2 = 0; v2 < 2; v2++) add('rkm|' + i + '|' + v2, 'H10', 'mcq'); });
    QUO.forEach(function (o, i) { for (var v = 0; v < 3; v++) add('rq|' + i + '|' + v, 'H10', 'mcq'); });
    [['waW', 600], ['waI', 600], ['hsW', 300], ['hsI', 300], ['ck', 300], ['wy', 400]].forEach(function (t) { for (var v = 0; v < t[1]; v++) add('rm|' + t[0] + '|' + v, 'H10', 'mt'); });
    for (var t = 0; t < 500; t++) { add('rt|W|' + t, 'H10', 'st'); add('rt|I|' + t, 'H10', 'st'); }
    for (var t2 = 0; t2 < 800; t2++) add('r2|' + t2, 'H10', 's2');
  });
  G.ext.rw = function (p) { return genRW(+p[1], +p[2]); };
  G.ext.ra = function (p) { return genRA(p[1], +p[2]); };
  G.ext.ry = function (p) { return genRY(+p[1], +p[2]); };
  G.ext.rc = function (p) { return genRC(p[1], +p[2]); };
  G.ext.rs = function (p) { return genRS(p[1], +p[2]); };
  G.ext.rn = function (p) { return genRN(p[1], +p[2]); };
  G.ext.rk = function (p) { return genRK(+p[1], +p[2]); };
  G.ext.rkm = function (p) { return genRKM(+p[1], +p[2]); };
  G.ext.rq = function (p) { return genRQ(+p[1], +p[2]); };
  G.ext.rm = function (p) { return genRM(p[1], +p[2]); };
  G.ext.rt = function (p) { return genRT(p[1], +p[2]); };
  G.ext.r2 = function (p) { return genR2(+p[1]); };

  /* Question sets for the drills on the historiography page */
  J.H.ids = function (kind, filter) {
    var B = G.bank(), pre = { who: ['rw|', 'ra|'], year: ['ry|', 'rc|'], school: ['rs|', 'rn|'], concept: ['rk|', 'rkm|', 'rq|'], match: ['rm|', 'rt|', 'r2|'], all: ['r'] }[kind] || ['r'];
    var out = [];
    for (var i = 0; i < B.length; i++) { var id = B[i][0]; if (pre.some(function (p) { return id.indexOf(p) === 0; }) && (!filter || filter(id))) out.push(id); }
    return out;
  };
  J.H.idsFor = function (hid) {
    var x = hById[hid], ids = [];
    WORKS.forEach(function (o, k) { if (o.h === x) ids.push('rw|' + k + '|0'); });
    EXACT.forEach(function (o, k) { if (o.h === x) ids.push('ry|' + k + '|0'); });
    for (var v = 0; v < Math.min(3, Math.max(1, x.w.length)); v++) ids.push('ra|' + hid + '|' + v);
    if (SCHOOLED.indexOf(x) >= 0) ids.push('rs|' + hid + '|0');
    CON.forEach(function (c, i) { if (c.h === hid) ids.push('rk|' + i + '|0', 'rkm|' + i + '|0'); });
    QUO.forEach(function (o, i) { if (o.h === x) ids.push('rq|' + i + '|0'); });
    return ids;
  };

  /* Flashcards: rh|id (historian), rw|k (work → author), rk|i (concept) */
  var baseCard = J.getCard;
  J.getCard = function (id) {
    var p = id.split('|');
    if (p[0] === 'rch') {
      var x = hById[p[1]]; if (!x) return null;
      var sc = x.s.filter(function (z) { return sById[z]; }).map(function (z) { return sById[z].n; }).join(' / ');
      return { front: x.n + (x.life ? ' (' + x.life + ')' : '') + '\n→ school, main works, key idea?', back: (sc ? sc + '\n' : '') + x.w.slice(0, 4).map(function (w) { return '• ' + show(w.t) + (w.y !== null ? ' (' + yl(w) + ')' : ''); }).join('\n') + (x.i[0] ? '\n' + x.i[0] : '') + (x.hk ? '\nHook: ' + x.hk : ''), src: 'Historiography', u: 'H10' };
    }
    if (p[0] === 'rcw') {
      var o = WORKS[+p[1]]; if (!o) return null;
      return { front: wdisp(o) + (o.w.y !== null ? ' (' + yl(o.w) + ')' : '') + '\n→ by whom?', back: o.h.n + (o.h.s[0] && sById[o.h.s[0]] ? ' — ' + sById[o.h.s[0]].n : ''), src: 'Historiography · works', u: 'H10' };
    }
    if (p[0] === 'rcc') {
      var c = CON[+p[1]]; if (!c) return null;
      return { front: '“' + c.t + '”\n→ meaning and thinker?', back: c.m + '\n— ' + hById[c.h].n, src: 'Historiography · concepts', u: 'H10' };
    }
    return baseCard(id);
  };
  J.H.cardIds = function (what, filter) {
    if (what === 'hist') return HS.filter(filter || function () { return true; }).map(function (x) { return 'rch|' + x.id; });
    if (what === 'works') return WORKS.map(function (o, k) { return { o: o, id: 'rcw|' + k }; }).filter(function (z) { return !filter || filter(z.o); }).map(function (z) { return z.id; });
    return CON.map(function (c, i) { return 'rcc|' + i; });
  };
  J.H.show = show; J.H.yl = yl; J.H.wdisp = wdisp;
})(window.JRF);
