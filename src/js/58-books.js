/* Book Mode: load your own PDFs/text, pull out every fact-bearing sentence, map it to units/topics,
   and turn it into fill-the-blank cards + quiz questions with chapter-by-chapter coverage.
   Book text stays in this browser (IndexedDB). Nothing is uploaded or published. */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  J.books = [];

  /* ---------------- IndexedDB ---------------- */
  var dbp = null;
  function idb() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      try {
        var r = indexedDB.open('jrf-books', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('books', { keyPath: 'id' }); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      } catch (e) { rej(e); }
    });
    return dbp;
  }
  function tx(mode, fn) { return idb().then(function (db) { return new Promise(function (res, rej) { var t = db.transaction('books', mode), st = t.objectStore('books'), out = fn(st); t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); }; t.onerror = function () { rej(t.error); }; }); }); }
  function idbAll() { return tx('readonly', function (st) { return st.getAll(); }); }
  function idbPut(b) { return tx('readwrite', function (st) { st.put(b); }); }
  function idbDel(id) { return tx('readwrite', function (st) { st.delete(id); }); }
  J.booksReady = idbAll().then(function (all) { J.books = (all || []).sort(function (a, b) { return a.added < b.added ? -1 : 1; }); J.emit('books'); return J.books; }, function () { J.books = []; return []; });

  /* ---------------- PDF text ---------------- */
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Could not load the PDF reader. Connect to the internet once and try again.')); }; document.head.appendChild(s); }); }
  J.loadPdfJs = function () {
    if (window.pdfjsLib && window.pdfjsWorker) return Promise.resolve(window.pdfjsLib);
    return loadScript(PDFJS + 'pdf.min.js').then(function () { return loadScript(PDFJS + 'pdf.worker.min.js'); })
      .then(function () { var lib = window.pdfjsLib; try { lib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; } catch (e) {} return lib; });
  };
  J.extractPdf = function (file, onProg) {
    var lib, pdf;
    return J.loadPdfJs().then(function (l) { lib = l; return file.arrayBuffer(); })
      .then(function (buf) { return lib.getDocument({ data: buf, disableFontFace: true, isEvalSupported: false }).promise; })
      .then(function (p) {
        pdf = p;
        var n = pdf.numPages, pages = [], i = 0;
        function next() {
          i++;
          if (i > n) return Promise.resolve(pages);
          return pdf.getPage(i).then(function (pg) { return pg.getTextContent().then(function (tc) {
            var s = '';
            tc.items.forEach(function (it) { if (it.str === undefined) return; s += it.str; s += it.hasEOL ? '\n' : (it.str && !/\s$/.test(it.str) ? ' ' : ''); });
            pages.push(s); pg.cleanup();
            if (onProg) onProg(i, n);
            return new Promise(function (r) { setTimeout(r, 0); }).then(next);
          }); });
        }
        return next();
      })
      .then(function (pages) {
        return pdf.getOutline().then(function (ol) {
          ol = ol || [];
          var items = ol.length >= 3 ? ol : ol.reduce(function (a, o) { return a.concat([o], o.items || []); }, []);
          return Promise.all(items.map(function (o) {
            var d = typeof o.dest === 'string' ? pdf.getDestination(o.dest) : Promise.resolve(o.dest);
            return d.then(function (dest) { return dest && dest[0] ? pdf.getPageIndex(dest[0]) : -1; }).then(function (pi) { return { t: String(o.title || '').trim(), p: pi }; }, function () { return { t: o.title, p: -1 }; });
          }));
        }, function () { return []; }).then(function (outline) { pdf.destroy(); return { pages: pages, outline: outline.filter(function (o) { return o.p >= 0 && o.t; }) }; });
      });
  };

  /* ---------------- fact extraction (pure) ---------------- */
  var COMMON = {}; ('The This These Those That It Its In On At As However Although According During After Before While When Where Though There Their They He She His Her We Our A An But And Or If Thus Hence Also Such Some Many Most Several Both Each Other Another Since Because For From By With Under Over Between Among Further Moreover Furthermore Similarly Again Yet Still Even Only Not No One Two Three First Second Third Later Early Earlier Here What Which Who Whom Whose Why How All Any Every Its Chapter Fig Figure Table Map Plate Source See Ibid Vol Part Section Unit Box Summary Note Notes Introduction Conclusion Thereafter Meanwhile Instead Therefore Nevertheless Besides Apart Like Unlike Among Upon Within Without Towards Toward Around About Above Below I II III IV V VI VII VIII IX X').split(' ').forEach(function (w) { COMMON[w] = 1; });
  var ABBR = /\b(c|ca|i\.e|e\.g|viz|Dr|Mr|Mrs|Ms|St|Sr|Jr|vol|Vol|ed|eds|no|No|pp|p|cf|fig|Fig|op|cit|Prof|Gen|Col|Capt|Lt|Sir|Mt|Ft|etc|al|vs)\./g;
  function cleanPages(pages) {
    var n = pages.length, edge = {};
    var lines = pages.map(function (p) { return p.split('\n').map(function (l) { return l.trim(); }).filter(Boolean); });
    lines.forEach(function (ls) { ls.slice(0, 2).concat(ls.slice(-2)).forEach(function (l) { var k = l.replace(/\d+/g, '#').toLowerCase(); edge[k] = (edge[k] || 0) + 1; }); });
    var cut = Math.max(3, Math.round(n * 0.12));
    return lines.map(function (ls) {
      var keep = ls.filter(function (l, i) {
        var isEdge = i < 2 || i >= ls.length - 2;
        if (isEdge && edge[l.replace(/\d+/g, '#').toLowerCase()] >= cut) return false;
        if (isEdge && /^\d{1,4}$/.test(l)) return false;
        return true;
      });
      return keep.join('\n').replace(/(\w)-\n(\w)/g, '$1$2').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
    });
  }
  function sentences(text) {
    var t = text.replace(ABBR, function (m) { return m.replace(/\./g, '․'); }).replace(/\b([A-Z])\.(?=\s?[A-Z][a-z.])/g, '$1․');
    return t.replace(/([.?!][”"’)]?)\s+(?=[A-Z“"(‘])/g, '$1\u0001').split('\u0001').map(function (s) { return s.replace(/․/g, '.').trim(); });
  }
  var YEAR = /\b(?:c\.\s?)?(\d{3,4})(?:\s?(?:BCE|BC|CE|AD|B\.C\.|A\.D\.))?(?![\d\-–]*\s?(?:km|kg|metres|meters|feet|miles|sq|per|%))/g;
  function findYear(s) {
    var m, best = null;
    YEAR.lastIndex = 0;
    while ((m = YEAR.exec(s))) {
      var full = m[0], n = +m[1], pre = s.slice(Math.max(0, m.index - 6), m.index);
      var era = /BCE|BC|CE|AD|B\.C|A\.D/.test(full), circa = /^c\./.test(full);
      if (/pp?\.\s?$|vol\.?\s?$|no\.\s?$|\b(page|pages|fig\.?)\s?$/i.test(pre)) continue;
      if (m[1].length === 4 && n >= 1000 && n <= 2030) { best = full; break; }
      if (m[1].length === 3 && (era || circa || /\b(in|of|by|from|to|until|till)\s$/.test(pre))) { best = full; break; }
    }
    return best ? best.trim() : null;
  }
  function candidatePhrases(s) {
    var out = [], re = /([A-Z][A-Za-zāīūṛṣṭḍṇñśṅçéèü'’\-]+(?:\s+(?:of|the|ud|ul|al|i|bin|ibn|de|da|du|von|van|[A-Z][A-Za-zāīūṛṣṭḍṇñśṅçéèü'’\-]+))*)/g, m;
    while ((m = re.exec(s))) {
      if (m.index === 0) continue;
      var p = m[1].replace(/\s+(of|the|ud|ul|al|i|bin|ibn|de|da|du|von|van)$/, '');
      var first = p.split(/\s+/)[0];
      if (COMMON[first] && p.indexOf(' ') < 0) continue;
      if (p.length < 4) continue;
      out.push(p);
    }
    return out;
  }
  /* entity index: first word → entities (from the app's fact tables, dynasties, places, bold terms) */
  var EIDX = null;
  function entIndex() {
    if (EIDX) return EIDX;
    EIDX = {}; var E = J.entityMap ? J.entityMap() : {};
    Object.keys(E).forEach(function (k) { var fw = (k.match(/[a-z0-9À-ɏ'\-]+/) || [''])[0]; if (fw.length < 3) return; (EIDX[fw] = EIDX[fw] || []).push({ k: k, u: E[k] }); });
    return EIDX;
  }
  function entHits(lower) {
    var idx = entIndex(), seen = {}, out = [];
    (lower.match(/[a-z0-9À-ɏ'\-]+/g) || []).forEach(function (w) {
      (idx[w] || []).forEach(function (c) { if (seen[c.k]) return; if (c.k.length < 4) return; var i = lower.indexOf(c.k); if (i < 0) return; var bef = lower.charAt(i - 1), aft = lower.charAt(i + c.k.length); if (/[a-z]/.test(bef) || /[a-z]/.test(aft)) return; seen[c.k] = 1; out.push({ k: c.k, u: c.u, i: i }); });
    });
    return out;
  }
  J.processBookText = function (title, pages, outline, opts) {
    opts = opts || {};
    var clean = cleanPages(pages);
    var chapters = [];
    if (outline && outline.length >= 3) {
      outline.slice().sort(function (a, b) { return a.p - b.p; }).forEach(function (o) { if (!chapters.length || chapters[chapters.length - 1].p !== o.p) chapters.push({ t: o.t.slice(0, 120), p: o.p }); });
    } else {
      clean.forEach(function (pg, i) { var m = pg.slice(0, 200).match(/(?:^|\s)(?:CHAPTER|Chapter|UNIT|Unit)\s+([0-9IVXL]+)\b[\s:.\-–]*([A-Z][^.]{3,80})?/); if (m && pg.slice(0, 200).indexOf(m[0].trim()) < 60) chapters.push({ t: ('Chapter ' + m[1] + (m[2] ? ' · ' + m[2] : '')).replace(/\s+/g, ' ').trim().slice(0, 100), p: i }); });
      var uniq = []; chapters.forEach(function (c) { if (!uniq.length || uniq[uniq.length - 1].t.split(' · ')[0] !== c.t.split(' · ')[0]) uniq.push(c); }); chapters = uniq;
      if (chapters.length < 3) { chapters = []; for (var b = 0; b < clean.length; b += 20) chapters.push({ t: 'Pages ' + (b + 1) + '–' + Math.min(clean.length, b + 20), p: b }); }
    }
    if (!chapters.length || chapters[0].p > 0) chapters.unshift({ t: 'Front matter', p: 0 });
    function chapOf(pi) { var c = 0; for (var i = 0; i < chapters.length; i++) if (chapters[i].p <= pi) c = i; return c; }
    var sents = [], freq = {}, wfreq = {};
    var chTitles = chapters.map(function (c) { return c.t.replace(/^\d+[.)]?\s*/, '').trim(); }).filter(function (t) { return t.length > 8; });
    clean.forEach(function (pg, pi) {
      pg = pg.replace(/\b([A-Z]) ([A-Z]{2,})\b/g, '$1$2');
      chTitles.forEach(function (t) { var i = pg.indexOf(t); if (i >= 0 && i < 400) pg = pg.slice(0, i) + ' ' + pg.slice(i + t.length); });
      sentences(pg).forEach(function (s) { s = s.replace(/^(?:[A-Z][A-Z'’\-]+\s+){2,}(?=[A-Z][a-z])/, '').replace(/^(?:ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE|[A-Z]{3,}TEEN|TWENTY)\s+/, ''); sents.push({ s: s, p: pi }); });
    });
    sents.forEach(function (x) {
      candidatePhrases(x.s).forEach(function (p) { freq[p] = (freq[p] || 0) + 1; });
      (x.s.toLowerCase().match(/[a-zÀ-ɏ\-]{4,}/g) || []).forEach(function (w) { wfreq[w] = (wfreq[w] || 0) + 1; });
    });
    var tooCommon = Math.max(20, sents.length * 0.003);
    function okEntity(txt) {
      if (/['’]s$/.test(txt)) return false;
      if (/^[a-z]/.test(txt) && txt.indexOf(' ') < 0) return txt.length >= 4 && !/(al|ive|ous|ic|ary|ing|ed|ly|ion|ity|ism|ment|ence|ance|ful|less|ness|ical|able|ible)$/.test(txt) && (wfreq[txt.toLowerCase()] || 0) <= 12; // rare technical term (e.g. chachar, iqta)
      return (freq[txt] || 0) < tooCommon;
    }
    var facts = [], unitHist = {};
    var SKIPCH = /^(cover|title|half title|copyright|contents|brief contents|list of|preface|foreword|acknowledg|about the author|dedication|index|bibliograph|glossary|references|notes|further read|select bibliography|abbreviations|a note on|a reader|credits|photographs, maps)/i;
    sents.forEach(function (x) {
      var s = x.s;
      if (SKIPCH.test((chapters[chapOf(x.p)] || {}).t || '')) return;
      if (s.length < 50 || s.length > 340) return;
      if (/https?:|www\.|ISBN|©|\bpp?\.\s?\d|\bIbid|\bop\.? cit|^(Figure|Fig\.|Table|Map|Plate|Source|Box)\b/i.test(s)) return;
      var letters = (s.match(/[A-Za-z]/g) || []).length; if (letters < s.length * 0.6) return;
      if ((s.match(/[A-Z]/g) || []).length > letters * 0.5) return;
      if (/\b(I|we|our|my|you)\b/.test(s) && !/[“"]/.test(s)) return;
      var lower = s.toLowerCase(), hits = entHits(lower);
      var ans = [], y = findYear(s); if (y) ans.push(y);
      var ent = null;
      hits.slice().sort(function (a, b) { return b.k.length - a.k.length; }).some(function (hh) { var txt = s.substr(hh.i, hh.k.length); if (hh.i > 0 && okEntity(txt) && (!y || txt.indexOf(y) < 0)) { ent = txt; return true; } return false; });
      if (!ent) { var cps = candidatePhrases(s).filter(function (p) { return (freq[p] || 0) >= 2 && okEntity(p) && (!y || p.indexOf(y) < 0); }).sort(function (a, b) { return (b.split(' ').length - a.split(' ').length) || (freq[a] - freq[b]); }); ent = cps[0] || null; }
      if (ent) ans.push(ent);
      if (!ans.length) return;
      var us = {}; hits.forEach(function (hh) { us[hh.u] = (us[hh.u] || 0) + 1; });
      hits.forEach(function (hh) { unitHist[hh.u] = (unitHist[hh.u] || 0) + 1; });
      facts.push({ s: s, a: ans, p: x.p + 1, c: chapOf(x.p), us: us });
    });
    // which units does this book cover? user choice wins; else entity evidence
    var keepU = (opts.units && opts.units.length) ? opts.units.slice() : null;
    if (!keepU) {
      var tot = 0, k; for (k in unitHist) tot += unitHist[k];
      var ORD = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'];
      keepU = Object.keys(unitHist).filter(function (u) { return unitHist[u] >= tot * 0.08; });
      Object.keys(unitHist).forEach(function (u) { var i = ORD.indexOf(u); if (keepU.indexOf(u) < 0 && unitHist[u] >= tot * 0.03 && keepU.some(function (k) { return Math.abs(ORD.indexOf(k) - i) === 1; })) keepU.push(u); });
      keepU.sort(function (a, b) { return unitHist[b] - unitHist[a]; });
    }
    facts.forEach(function (f) {
      var tag = J.topicTag(f.s, keepU, f.us);
      f.u = tag.u || keepU[0] || ''; f.t = tag.t; delete f.us;
    });
    return { title: title, chapters: chapters, facts: facts, pages: pages.length, units: keepU };
  };

  /* ---------------- topic tagger ---------------- */
  var TV = null;
  function tok(s) { return (String(s).toLowerCase().match(/[a-zÀ-ɏ][a-zÀ-ɏ\-']{3,}/g) || []); }
  var GENERIC = {}; ('also which their there these those other with from that this were been have into than then upon only more most such some many over under after before during between among about against without within through while where when what india indian british empire state king kings rule ruler rulers period century early later great power trade first second people time also').split(' ').forEach(function (w) { GENERIC[w] = 1; });
  function buildTV() {
    TV = {};
    function add(w, tid, wt) { if (GENERIC[w]) return; var m = TV[w] || (TV[w] = {}); m[tid] = (m[tid] || 0) + wt; }
    J.topics.forEach(function (t) {
      tok(t.t).forEach(function (w) { add(w, t.id, 1.5); });
      (t.p || []).forEach(function (p) { (p.match(/\*\*(.+?)\*\*/g) || []).forEach(function (b) { tok(b).forEach(function (w) { add(w, t.id, 3); }); }); });
    });
  }
  var topicUnit = {}; J.topics.forEach(function (t) { topicUnit[t.id] = t.u; });
  J.topicTag = function (s, onlyUnits, unitHits) {
    if (!TV) buildTV();
    var tsc = {}, usc = {};
    tok(s).forEach(function (w) { var m = TV[w]; if (!m) return; var n = 0, k; for (k in m) n++; for (k in m) { var v = m[k] / Math.sqrt(n); tsc[k] = (tsc[k] || 0) + v; usc[topicUnit[k]] = (usc[topicUnit[k]] || 0) + v; } });
    if (!unitHits) { unitHits = {}; if (J.entityMap) entHits(String(s).toLowerCase()).forEach(function (hh) { unitHits[hh.u] = (unitHits[hh.u] || 0) + 1; }); }
    for (var u in unitHits) usc[u] = (usc[u] || 0) + unitHits[u] * 2.5;
    var bu = '', bv = 0;
    for (var u2 in usc) { if (onlyUnits && onlyUnits.length && onlyUnits.indexOf(u2) < 0) continue; if (usc[u2] > bv) { bv = usc[u2]; bu = u2; } }
    if (!bu) return { u: '', t: '' };
    var bt = '', btv = 0;
    for (var t in tsc) if (topicUnit[t] === bu && tsc[t] > btv) { btv = tsc[t]; bt = t; }
    return { u: bu, t: btv >= 3 ? bt : '' };
  };

  /* ---------------- add / remove ---------------- */
  J.addBook = function (title, pages, outline, units) {
    var r = J.processBookText(title, pages, outline, { units: units });
    var id = 'b' + (J.hash(title + '|' + pages.length + '|' + (pages[10] || '').slice(0, 200)) % 1e9).toString(36);
    var book = { id: id, title: title, added: J.date.today(), pages: r.pages, chapters: r.chapters, facts: r.facts, units: r.units };
    J.books = J.books.filter(function (b) { return b.id !== id; }).concat([book]);
    return idbPut(book).then(function () { try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {} J.emit('books'); return book; });
  };
  J.removeBook = function (id) { J.books = J.books.filter(function (b) { return b.id !== id; }); return idbDel(id).then(function () { J.emit('books'); }); };
  function bookById(id) { return J.books.filter(function (b) { return b.id === id; })[0]; }

  /* ---------------- cards & questions ---------------- */
  function clozeOf(f, k) { var a = f.a[k], i = f.s.indexOf(a); return i < 0 ? null : f.s.slice(0, i) + '▢▢▢' + f.s.slice(i + a.length); }
  var baseCard = J.getCard;
  J.getCard = function (id) {
    if (id.indexOf('f|') !== 0) return baseCard(id);
    var p = id.split('|'), b = bookById(p[1]); if (!b) return null;
    var f = b.facts[+p[2]]; if (!f) return null; var k = +p[3] || 0, front = clozeOf(f, k); if (!front) return null;
    return { front: front, back: f.a[k], src: b.title + ' · ' + b.chapters[f.c].t + ' · p. ' + f.p, u: f.u, tid: f.t || null };
  };
  function isYear(a) { return /\d{3,4}/.test(a); }
  var baseGet = G.get;
  G.get = function (id) {
    if (id.indexOf('b|') !== 0) return baseGet(id);
    var p = id.split('|'), b = bookById(p[1]); if (!b) return null;
    var fi = +p[2], f = b.facts[fi], k = +p[3] || 0; if (!f) return null;
    var a = f.a[k], front = clozeOf(f, k); if (!front) return null;
    var r = J.rng(J.hash(id)), pool = [];
    if (isYear(a)) {
      var n = +(a.match(/\d{3,4}/)[0]);
      [1, 2, 3, 5, 7, 10, 12, 15, 20, 25].forEach(function (d) { [n + d, n - d].forEach(function (x) { if (x > 0) pool.push(a.replace(/\d{3,4}/, String(x))); }); });
    } else {
      var lo = Math.max(0, fi - 400), hi = Math.min(b.facts.length, fi + 400);
      for (var i = lo; i < hi; i++) { var g = b.facts[i]; g.a.forEach(function (x) { if (!isYear(x) && x !== a && f.s.indexOf(x) < 0 && Math.abs(x.length - a.length) < 18 && /^[A-Z]/.test(x) === /^[A-Z]/.test(a)) pool.push(x); }); }
    }
    pool = J.shuffle(pool.filter(function (x, i2, arr) { return arr.indexOf(x) === i2; }), r);
    if (pool.length < 3) return null;
    var po = J.placeOptions(a, pool.slice(0, 6), r);
    return { id: id, k: 'mcq', q: 'Fill in the blank (' + b.title + ', p. ' + f.p + '):\n' + front, o: po.o, a: po.a, ex: f.s, u: f.u || 'H1', topic: f.t || null, src: 'Your book · ' + b.title + ' · ' + b.chapters[f.c].t + ' (auto-extracted)', gen: true, book: true };
  };
  J.bookQuestionIds = function (filter) {
    var out = [];
    J.books.forEach(function (b) { b.facts.forEach(function (f, i) { if (filter && !filter(f, b)) return; f.a.forEach(function (_, k) { out.push('b|' + b.id + '|' + i + '|' + k); }); }); });
    return out;
  };
  var basePool = G.pool;
  G.pool = function (f) {
    var out = basePool(f);
    if (!J.books.length) return out;
    var kinds = f.kinds && f.kinds.length ? f.kinds : null;
    if (kinds && kinds.indexOf('bk') < 0 && kinds.indexOf('mcq') < 0) return out;
    if (f.src === 'hand') return out;
    var S = J.S(), us = f.units && f.units.length ? f.units : null;
    var extra = J.bookQuestionIds(function (fa) { return !us || us.indexOf(fa.u) >= 0; }).filter(function (id) {
      if (f.src === 'unseen') return !S.q[id];
      if (f.src === 'mistakes') return S.q[id] && S.q[id][0] > S.q[id][1];
      return true;
    });
    if (kinds && kinds.indexOf('bk') >= 0 && kinds.length === 1) return extra;
    return out.concat(extra);
  };
  var baseCount = G.countBy;
  G.countBy = function () { var c = baseCount(); var n = J.bookQuestionIds().length; c.book = n; c.total += n; return c; };

  /* ---------------- coverage ---------------- */
  function coverage(b, chap) {
    var S = J.S(), tot = 0, done = 0;
    b.facts.forEach(function (f, i) {
      if (chap != null && f.c !== chap) return;
      f.a.forEach(function (_, k) { tot++; var cid = 'f|' + b.id + '|' + i + '|' + k, qid = 'b|' + b.id + '|' + i + '|' + k; if ((S.cards[cid] && S.cards[cid][2] > 0) || S.q[qid]) done++; });
    });
    return { tot: tot, done: done, pct: U.pct(done, tot) };
  }
  J.bookCoverage = coverage;
  function sprintIds(b, filter, n) {
    var S = J.S(), ids = [];
    b.facts.forEach(function (f, i) { if (!filter(f)) return; f.a.forEach(function (_, k) { var cid = 'f|' + b.id + '|' + i + '|' + k; if (!(S.cards[cid] && S.cards[cid][2] > 0)) ids.push(cid); }); });
    return ids.slice(0, n);
  }
  J.startCardSession = function (ids, title) { if (!ids.length) { U.toast('All facts here are already reviewed. Nice.'); return; } J.cardSession = { ids: ids, title: title }; U.go('cards-session'); };
  J.topicBookFacts = function (tid) {
    var out = []; J.books.forEach(function (b) { b.facts.forEach(function (f, i) { if (f.t === tid) out.push({ b: b, f: f, i: i }); }); }); return out;
  };

  /* ---------------- views ---------------- */
  function cleanName(n) { return n.replace(/\.(pdf|txt)$/i, '').replace(/^[0-9a-f]{8}[\s_\-]+/i, '').replace(/^AR[_\s\-]+/, '').replace(/[_\-]+/g, ' ').replace(/\s+(copy|compressed|compress)\b/gi, '').replace(/\s+/g, ' ').trim(); }
  J.V.books = function (root) {
    var S = J.S();
    root.appendChild(h('div', { class: 'row between' }, h('h1', null, 'Your books'), h('span', { class: 'pill' }, J.books.length + ' loaded')));
    root.appendChild(h('div', { class: 'card' },
      h('p', null, 'Load the PDFs of your textbooks. The app reads every page, keeps each sentence that carries a fact (a date, a name, a place, a term), links it to the right unit and topic, and turns it into fill-the-blank cards and quiz questions. The coverage bars show how much of each book and chapter you have actually revised, so nothing slips through.'),
      h('p', { class: 'small muted' }, 'Your books stay in this browser only — nothing is uploaded. Load them once on each device you use. Big books take a minute or two.')));
    var title = h('input', { class: 'input', id: 'book-title', placeholder: 'Book title (e.g. Upinder Singh — Ancient & Early Medieval India)' });
    var chosen = [];
    var chipBox = h('div', { class: 'togglechips' });
    function drawChips() {
      chipBox.innerHTML = '';
      J.units.forEach(function (u) { var on = chosen.indexOf(u.id) >= 0; chipBox.appendChild(h('button', { 'aria-pressed': String(on), onclick: function () { var i = chosen.indexOf(u.id); if (i >= 0) chosen.splice(i, 1); else chosen.push(u.id); drawChips(); } }, (u.paper === 1 ? 'P1 ' : 'Unit ') + u.n)); });
    }
    function guess(name) {
      var n = name.toLowerCase(), g = [];
      if (/upinder|ancient/.test(n)) g = ['H1', 'H2', 'H3'];
      else if (/satish/.test(n)) g = ['H3', 'H4', 'H5', 'H6'];
      else if (/mahajan|sultanate|mughal|medieval/.test(n)) g = ['H4', 'H5', 'H6'];
      else if (/spectrum|modern|plassey|bipan|freedom|national/.test(n)) g = ['H7', 'H8', 'H9'];
      else if (/historiograph|what is history|carr|method/.test(n)) g = ['H10'];
      if (g.length) { chosen = g; drawChips(); }
    }
    title.addEventListener('change', function () { guess(title.value); });
    drawChips();
    var status = h('div', { class: 'stack' });
    var file = h('input', { type: 'file', id: 'book-file', accept: 'application/pdf,.pdf,.txt,text/plain', 'aria-label': 'Choose a PDF or text file', onchange: function () { if (file.files[0]) { if (!title.value.trim()) title.value = cleanName(file.files[0].name); guess(title.value + ' ' + file.files[0].name); } } });
    var go = h('button', { class: 'btn primary', onclick: function () {
      var fl = file.files[0]; if (!fl) { U.toast('Choose a PDF or .txt file first.'); return; }
      var t = title.value.trim() || cleanName(fl.name);
      go.disabled = true;
      var bar = U.bar(0), msg = h('p', { class: 'small' }, 'Reading…');
      status.innerHTML = ''; status.appendChild(msg); status.appendChild(bar);
      var setP = function (txt, pct) { msg.textContent = txt; bar.firstChild.style.width = pct + '%'; };
      var pagesP = /\.txt$/i.test(fl.name) ? fl.text().then(function (txt) { var pg = txt.split('\f'); if (pg.length < 3) { pg = []; for (var i = 0; i < txt.length; i += 3000) pg.push(txt.slice(i, i + 3000)); } return { pages: pg, outline: [] }; })
        : J.extractPdf(fl, function (i, n) { setP('Reading page ' + i + ' of ' + n + '…', Math.round(i / n * 80)); });
      pagesP.then(function (r) {
        setP('Finding facts and linking them to topics…', 85);
        return new Promise(function (res) { setTimeout(res, 30); }).then(function () { return J.addBook(t, r.pages, r.outline, chosen.slice()); });
      }).then(function (b) {
        setP('Done: ' + b.facts.length.toLocaleString('en-IN') + ' fact sentences from ' + b.pages + ' pages.', 100);
        U.toast('Book added'); go.disabled = false; setTimeout(function () { U.go('book-' + b.id); }, 700);
      }).catch(function (e) { msg.textContent = (e && e.message) || 'Could not read this file.'; go.disabled = false; });
    } }, 'Add book');
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Add a book'), file, title,
      h('p', { class: 'eyebrow' }, 'This book covers (leave empty to detect automatically)'), chipBox,
      h('div', { class: 'row' }, go), status));

    if (!J.books.length) { root.appendChild(h('div', { class: 'empty' }, U.icon('book', 36), h('p', null, 'No books yet. Start with the one for the unit you are studying now.'))); return; }
    var list = h('section', { class: 'card' }, h('h2', null, 'Coverage'));
    J.books.forEach(function (b) {
      var cv = coverage(b);
      list.appendChild(h('div', { class: 'stack', style: { gap: '6px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' } },
        h('div', { class: 'row between' }, h('a', { href: '#book-' + b.id }, h('b', null, b.title)), h('span', { class: 'pill ' + (cv.pct >= 80 ? 'good' : cv.pct >= 30 ? 'accent' : '') }, cv.pct + '% revised')),
        U.bar(cv.pct, 'good'),
        h('p', { class: 'small muted' }, b.facts.length.toLocaleString('en-IN') + ' fact sentences · ' + cv.tot.toLocaleString('en-IN') + ' cards · ' + b.chapters.length + ' chapters · ' + b.pages + ' pages · units ' + (b.units || []).map(function (u) { var x = G.unit(u); return x ? (x.paper === 1 ? 'P1 ' : '') + x.n : u; }).join(', ')),
        h('div', { class: 'row' }, h('a', { class: 'btn small primary', href: '#book-' + b.id }, 'Open'), h('button', { class: 'btn small', onclick: function () { J.startCardSession(sprintIds(b, function () { return true; }, 20), b.title); } }, 'Next 20 facts'),
          h('button', { class: 'btn small ghost', onclick: function () { U.confirm('Remove this book?', 'Its facts are removed from this device. Your answers and card history stay.', 'Remove', function () { J.removeBook(b.id).then(function () { U.route(); }); }, true); } }, 'Remove'))));
    });
    root.appendChild(list);
    var q = h('input', { class: 'input', type: 'search', id: 'book-search', placeholder: 'Search all your books (e.g. Kanauj, 1192, ryotwari)', 'aria-label': 'Search books' });
    var res = h('div', { class: 'stack' });
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase(); res.innerHTML = ''; if (v.length < 3) return; var n = 0;
      J.books.forEach(function (b) { b.facts.forEach(function (f) { if (n >= 60 || f.s.toLowerCase().indexOf(v) < 0) return; n++; res.appendChild(h('div', { class: 'fact small' }, f.s, h('br'), h('span', { class: 'tiny muted' }, b.title + ' · p. ' + f.p))); }); });
      if (!n) res.appendChild(h('p', { class: 'muted small' }, 'Not found in your books.'));
    });
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Search your books'), q, res));
  };

  J.V.book = function (root, id) {
    var b = bookById(id);
    if (!b) { root.appendChild(h('p', { class: 'muted' }, 'Loading your book…')); J.booksReady.then(function () { if (bookById(id)) U.route(); else U.go('books'); }); return; }
    var cv = coverage(b);
    root.appendChild(h('a', { class: 'eyebrow', href: '#books', style: { textDecoration: 'none' } }, '← Your books'));
    root.appendChild(h('h1', null, b.title));
    root.appendChild(h('div', { class: 'card hero' }, h('div', { class: 'grid3' }, U.stat(b.facts.length.toLocaleString('en-IN'), 'fact sentences'), U.stat(cv.done.toLocaleString('en-IN') + ' / ' + cv.tot.toLocaleString('en-IN'), 'cards revised'), U.stat(cv.pct + '%', 'coverage')), U.bar(cv.pct, 'good'),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: function () { J.startCardSession(sprintIds(b, function () { return true; }, 20), b.title); } }, 'Next 20 unrevised facts'),
        h('button', { class: 'btn', onclick: function () { J.startQuiz({ ids: G.sample(J.bookQuestionIds(function (f, bb) { return bb.id === b.id; }), 20), title: b.title }); } }, 'Quiz 20 from this book'))));
    var list = h('section', { class: 'card' }, h('h2', null, 'Chapters'));
    b.chapters.forEach(function (c, ci) {
      var n = b.facts.filter(function (f) { return f.c === ci; }).length; if (!n) return;
      var cc = coverage(b, ci);
      var facts = h('div', { class: 'stack' });
      var det = h('details', { class: 'fold' }, h('summary', null, h('span', null, c.t), h('span', { class: 'pill ' + (cc.pct >= 80 ? 'good' : '') }, cc.pct + '% · ' + n + ' facts')),
        h('div', { class: 'in' }, U.bar(cc.pct, 'good'),
          h('div', { class: 'row' }, h('button', { class: 'btn small primary', onclick: function () { J.startCardSession(sprintIds(b, function (f) { return f.c === ci; }, 25), c.t); } }, 'Study 25 cards'),
            h('button', { class: 'btn small', onclick: function () { J.startQuiz({ ids: G.sample(J.bookQuestionIds(function (f, bb) { return bb.id === b.id && f.c === ci; }), 15), title: c.t }); } }, 'Quiz 15'),
            h('button', { class: 'btn small ghost', onclick: function () { if (facts.childNodes.length) return; b.facts.forEach(function (f) { if (f.c !== ci) return; var e = h('p', { class: 'small' }); e.innerHTML = U.esc(f.s).replace(U.esc(f.a[0]), '<b>' + U.esc(f.a[0]) + '</b>') + ' <span class="tiny muted">p. ' + f.p + (f.t ? ' · ' + U.esc(G.topic(f.t).t.slice(0, 40)) : '') + '</span>'; facts.appendChild(e); }); } }, 'Read all facts')), facts));
      list.appendChild(det);
    });
    root.appendChild(list);
  };
})(window.JRF);
