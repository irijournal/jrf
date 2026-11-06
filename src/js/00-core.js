/* JRF Sadhana — core namespace + question helpers.
   Every data file pushes into window.JRF. Helpers below build NTA-style questions
   (MCQ, Assertion–Reason, Statement I/II, multi-statement, List matching, chronology). */
(function () {
  'use strict';
  var J = (window.JRF = window.JRF || {});
  J.units = J.units || [];
  J.topics = J.topics || [];
  J.dyn = J.dyn || [];
  J.events = J.events || [];
  J.pairs = J.pairs || [];
  J.places = J.places || [];
  J.glossary = J.glossary || [];
  J.stories = J.stories || [];
  J.extraQ = J.extraQ || [];

  /* ---------- deterministic randomness ---------- */
  function hash(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, r) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  J.hash = hash; J.rng = rng; J.shuffle = shuffle;

  var L = ['A', 'B', 'C', 'D', 'E', 'F'];
  var R = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  J.LETTERS = L; J.ROMAN = R;

  /* Build 4 options with the correct one placed at a seeded position. */
  function placeOptions(correct, distractors, r) {
    var uniq = [];
    distractors.forEach(function (d) { if (d !== correct && uniq.indexOf(d) < 0) uniq.push(d); });
    var opts = shuffle(uniq, r).slice(0, 3);
    var pos = Math.floor(r() * (opts.length + 1));
    opts.splice(pos, 0, correct);
    return { o: opts, a: pos };
  }
  J.placeOptions = placeOptions;

  /* Permutation helpers for chronology / matching codes */
  function permute(n, r) {
    var p = []; for (var i = 0; i < n; i++) p.push(i);
    return shuffle(p, r);
  }
  function samePerm(a, b) { for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
  function distinctPerms(correct, count, r) {
    var out = [correct];
    var guard = 0;
    while (out.length < count && guard++ < 200) {
      var p;
      if (r() < 0.6) { // near-miss: swap two positions (exam-style traps)
        p = correct.slice();
        var i = Math.floor(r() * p.length), j = Math.floor(r() * p.length);
        if (i === j) continue;
        var t = p[i]; p[i] = p[j]; p[j] = t;
      } else p = permute(correct.length, r);
      if (!out.some(function (x) { return samePerm(x, p); })) out.push(p);
    }
    return out;
  }
  J.distinctPerms = distinctPerms;

  var Q = (J.Q = {});

  /* Plain MCQ: options array, index of correct answer */
  Q.mcq = function (q, o, a, ex) { return { k: 'mcq', q: q, o: o, a: a, ex: ex || '' }; };

  /* Assertion–Reason. key: 0 both true & R explains A; 1 both true, R not explanation; 2 A true R false; 3 A false R true; 4 both false */
  Q.ar = function (A, Rr, key, ex) {
    var o = [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      '(A) is false but (R) is true'
    ];
    var q = 'Given below are two statements: one is labelled as Assertion (A) and the other as Reason (R).\nAssertion (A): ' + A + '\nReason (R): ' + Rr + '\nIn the light of the above statements, choose the correct answer.';
    if (key === 4) { o[3] = 'Both (A) and (R) are false'; return { k: 'ar', q: q, o: o, a: 3, ex: ex || '' }; }
    return { k: 'ar', q: q, o: o, a: key, ex: ex || '' };
  };

  /* Statement I / Statement II. t1, t2 booleans */
  Q.s2 = function (s1, s2, t1, t2, ex) {
    var o = [
      'Both Statement I and Statement II are true',
      'Both Statement I and Statement II are false',
      'Statement I is true but Statement II is false',
      'Statement I is false but Statement II is true'
    ];
    var a = t1 && t2 ? 0 : !t1 && !t2 ? 1 : t1 ? 2 : 3;
    return { k: 's2', q: 'Given below are two statements:\nStatement I: ' + s1 + '\nStatement II: ' + s2 + '\nIn the light of the above statements, choose the most appropriate answer.', o: o, a: a, ex: ex || '' };
  };

  /* Multi-statement: stmts array, truth array of booleans. Options = letter combos. */
  Q.st = function (stem, stmts, truth, ex) {
    var r = rng(hash(stem + stmts.join('|')));
    var correct = [];
    truth.forEach(function (t, i) { if (t) correct.push(L[i]); });
    var label = function (arr) { return arr.length ? (arr.length === 1 ? arr[0] + ' only' : arr.join(', ') + ' only') : 'None of the above'; };
    var key = label(correct);
    var pool = [];
    var n = stmts.length;
    for (var mask = 1; mask < (1 << n); mask++) {
      var c = []; for (var i = 0; i < n; i++) if (mask & (1 << i)) c.push(L[i]);
      if (c.length >= 2 || n <= 3) pool.push(label(c));
    }
    if (pool.indexOf(key) < 0) pool.push(key);
    var po = placeOptions(key, pool, r);
    var body = stmts.map(function (s, i) { return L[i] + '. ' + s; }).join('\n');
    return { k: 'st', q: stem + '\n' + body + '\nChoose the correct answer from the options given below:', o: po.o, a: po.a, ex: ex || '' };
  };

  /* List matching. left[i] matches right[i]. Display right side shuffled; options are codes. */
  Q.mt = function (stem, left, right, ex, heads) {
    var r = rng(hash(stem + left.join('|')));
    var n = left.length;
    var disp = permute(n, r); // disp[k] = index of right item shown at position k (roman k)
    var where = []; // for each left i, roman position
    for (var k = 0; k < n; k++) where[disp[k]] = k;
    var perms = distinctPerms(where, 4, r);
    var fmt = function (p) { return p.map(function (rp, i) { return L[i] + '-' + R[rp]; }).join(', '); };
    var correct = fmt(where);
    var opts = shuffle(perms.map(fmt), r);
    var h = heads || ['List I', 'List II'];
    return {
      k: 'mt', q: stem, o: opts, a: opts.indexOf(correct), ex: ex || '',
      table: { h: h, l: left.map(function (x, i) { return L[i] + '. ' + x; }), r: disp.map(function (d, k) { return R[k] + '. ' + right[d]; }) }
    };
  };

  /* Chronology: items given in the CORRECT order. */
  Q.ch = function (stem, items, ex) {
    var r = rng(hash(stem + items.join('|')));
    var n = items.length;
    var disp = permute(n, r); // disp[k] = true-order index shown with letter k
    var order = []; // letters in true order
    for (var t = 0; t < n; t++) order.push(disp.indexOf(t));
    var perms = distinctPerms(order, 4, r);
    var fmt = function (p) { return p.map(function (k) { return L[k]; }).join(', '); };
    var correct = fmt(order);
    var opts = shuffle(perms.map(fmt), r);
    var body = disp.map(function (d, k) { return L[k] + '. ' + items[d]; }).join('\n');
    return { k: 'ch', q: (stem || 'Arrange the following in chronological order:') + '\n' + body + '\nChoose the correct answer from the options given below:', o: opts, a: opts.indexOf(correct), ex: ex || '' };
  };

  /* Topic registration */
  J.T = function (t) { J.topics.push(t); return t; };
  J.U = function (u) { J.units.push(u); return u; };
})();
