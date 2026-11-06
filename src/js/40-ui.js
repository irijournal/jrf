/* UI toolkit: DOM builder, icons, router, shell, toasts, modals, timer, brain dump, sounds, charts. */
(function (J) {
  'use strict';
  var U = (J.UI = {});

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    if (typeof c === 'string' || typeof c === 'number') { el.appendChild(document.createTextNode(String(c))); return; }
    el.appendChild(c);
  }
  U.h = h;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  U.esc = esc;
  U.md = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); };
  U.mdEl = function (tag, s, attrs) { var e = h(tag, attrs); e.innerHTML = U.md(s); return e; };

  /* ---------- icons (inline SVG, stroke = currentColor) ---------- */
  var P = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    flame: '<path d="M12 3c1 4 6 5 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/>',
    note: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/><path d="M8 12h8M8 16h6"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    crownSm: '<path d="M4 9l4 3 4-6 4 6 4-3-1.5 9h-13z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    pause: '<path d="M7 4h4v16H7zM13 4h4v16h-4z"/>',
    reset: '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    lamp: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    scroll: '<path d="M6 4h11a3 3 0 0 1 0 6H8"/><path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a3 3 0 0 0 0-6H8"/>'
  };
  U.icon = function (name, size) {
    var s = size || 20, span = document.createElement('span');
    span.className = 'ic'; span.setAttribute('aria-hidden', 'true'); span.style.display = 'inline-flex';
    span.innerHTML = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (P[name] || '') + '</svg>';
    return span;
  };

  /* ---------- preferences ---------- */
  var FONTS = {
    lexend: "'Lexend', 'Segoe UI', system-ui, sans-serif",
    atkinson: "'Atkinson Hyperlegible', 'Segoe UI', system-ui, sans-serif",
    system: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    serif: "'Literata', Georgia, 'Times New Roman', serif"
  };
  U.applyPrefs = function () {
    var p = J.S().prefs, root = document.documentElement;
    if (p.skin && p.skin !== 'auto') root.setAttribute('data-skin', p.skin); else root.removeAttribute('data-skin');
    root.style.setProperty('--f-body', FONTS[p.font] || FONTS.lexend);
    root.style.setProperty('--fs', p.size + 'px');
    root.style.setProperty('--lh', p.lh);
    root.style.setProperty('--ls', (p.ls || 0) + 'em');
    document.body.classList.toggle('focus-mode', !!p.focus);
    document.body.classList.toggle('reduce-motion', p.motion === 'reduce');
  };

  /* ---------- toasts, modal, confirm ---------- */
  var toastHost;
  U.toast = function (msg, ms) {
    if (!toastHost) { toastHost = h('div', { class: 'toast-host', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(toastHost); }
    var t = h('div', { class: 'toast' }, msg);
    toastHost.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 2600);
  };
  U.modal = function (content, opts) {
    opts = opts || {};
    var scrim = h('div', { class: 'scrim', onclick: function (e) { if (e.target === scrim && !opts.sticky) close(); } });
    var box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' });
    add(box, content);
    scrim.appendChild(box);
    document.body.appendChild(scrim);
    function onKey(e) { if (e.key === 'Escape' && !opts.sticky) close(); }
    document.addEventListener('keydown', onKey);
    function close() { scrim.remove(); document.removeEventListener('keydown', onKey); if (opts.onClose) opts.onClose(); }
    var f = box.querySelector('button, input, textarea, select'); if (f) setTimeout(function () { f.focus(); }, 30);
    return { close: close, box: box };
  };
  U.confirm = function (title, body, yesText, onYes, danger) {
    var m = U.modal([
      h('h2', null, title), h('p', { class: 'muted' }, body),
      h('div', { class: 'row', style: { justifyContent: 'flex-end' } },
        h('button', { class: 'btn ghost', onclick: function () { m.close(); } }, 'Cancel'),
        h('button', { class: 'btn ' + (danger ? 'bad' : 'primary'), onclick: function () { m.close(); onYes(); } }, yesText))
    ]);
  };

  /* ---------- sound & celebration ---------- */
  var actx = null;
  U.sound = function (kind) {
    if (!J.S().prefs.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      var f = kind === 'good' ? [660, 880] : kind === 'bad' ? [300, 220] : kind === 'level' ? [523, 659, 784] : [520];
      o.type = 'sine'; o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      f.forEach(function (fr, i) { o.frequency.setValueAtTime(fr, t + i * 0.09); });
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12 + f.length * 0.09);
      o.start(t); o.stop(t + 0.15 + f.length * 0.09);
    } catch (e) { /* audio unavailable */ }
  };
  U.burst = function () {
    var p = J.S().prefs;
    if (p.motion === 'reduce' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var b = h('div', { class: 'burst' }), cols = ['var(--accent)', 'var(--copper)', 'var(--good)', 'var(--warn)'];
    for (var i = 0; i < 36; i++) {
      var dot = h('i'); var a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 220;
      dot.style.left = '50%'; dot.style.top = '40%'; dot.style.background = cols[i % 4];
      dot.style.setProperty('--dx', Math.cos(a) * d + 'px'); dot.style.setProperty('--dy', Math.sin(a) * d + 200 + 'px');
      b.appendChild(dot);
    }
    document.body.appendChild(b); setTimeout(function () { b.remove(); }, 1300);
  };
  var LINES = {
    hinglish: { good: ['Shabaash!', 'Ekdum sahi!', 'Kya baat hai!', 'Bilkul correct.', 'Mast, aage chalo.'], bad: ['Koi baat nahi — ab yaad rahega.', 'Galti se hi seekhte hain.', 'Dobara aayega, tab pakka.', 'Chalo, explanation padh lo.'], streak: 'din ki streak', start: 'Chalo shuru karein' },
    english: { good: ['Nice!', 'Correct!', 'Well done.', 'Spot on.', 'Keep going.'], bad: ['Not quite — now you know.', 'Mistakes make memories.', 'It will come back; you will be ready.', 'Read the explanation.'], streak: 'day streak', start: 'Let’s start' }
  };
  U.line = function (k) { var v = J.S().prefs.voice === 'english' ? LINES.english : LINES.hinglish, a = v[k]; return Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a; };

  /* ---------- router & shell ---------- */
  J.V = J.V || {};
  var NAV = [
    { id: 'today', t: 'Today', ic: 'home' },
    { id: 'learn', t: 'Learn', ic: 'book', match: ['learn', 'syllabus'] },
    { id: 'practice', t: 'Practice', ic: 'target', match: ['practice', 'quiz', 'mock'] },
    { id: 'revise', t: 'Revise', ic: 'repeat', match: ['revise', 'cards'] },
    { id: 'more', t: 'More', ic: 'grid', match: ['more', 'plan', 'dynasties', 'dyn', 'timeline', 'maps', 'pyq', 'exam', 'reports', 'library', 'glossary', 'tweaks', 'badges', 'books', 'book'] }
  ];
  var shell = {};
  U.buildShell = function () {
    var top = h('header', { class: 'top' }, h('div', { class: 'top-in' },
      h('a', { class: 'brand', href: '#today', 'aria-label': 'JRF Sadhana home' }, U.icon('scroll', 24), h('span', null, 'JRF Sadhana')),
      shell.tabs = h('nav', { class: 'tabs', 'aria-label': 'Main' }, NAV.map(function (n) { return h('a', { class: 'tab', href: '#' + n.id, 'data-id': n.id }, U.icon(n.ic, 18), n.t); })),
      h('div', { class: 'chips' },
        shell.streak = h('button', { class: 'chip-btn hide-in-focus', title: 'Streak', onclick: function () { location.hash = '#reports'; } }),
        shell.lv = h('button', { class: 'chip-btn hide-in-focus', title: 'Level & badges', onclick: function () { location.hash = '#badges'; } }),
        h('button', { class: 'chip-btn', title: 'Text size & font', 'aria-label': 'Adjust text size and font', onclick: function () { U.openSize(); } }, h('span', { style: { fontWeight: '700', fontSize: '1.05em', lineHeight: '1' } }, 'Aa')),
        h('button', { class: 'chip-btn', title: 'Focus timer', 'aria-label': 'Focus timer', onclick: U.openTimer }, U.icon('timer', 18), shell.tmini = h('span', { class: 'mono' }, '')),
        h('button', { class: 'chip-btn', title: 'Brain dump: park a distracting thought', 'aria-label': 'Brain dump', onclick: U.openDump }, U.icon('note', 18))
      )));
    shell.main = h('main', { id: 'main', tabindex: '-1' });
    shell.bottom = h('nav', { class: 'bottom-nav', 'aria-label': 'Main' }, NAV.map(function (n) { return h('a', { href: '#' + n.id, 'data-id': n.id }, U.icon(n.ic, 22), n.t); }));
    document.body.appendChild(top); document.body.appendChild(shell.main); document.body.appendChild(shell.bottom);
    U.refreshChips();
  };
  U.refreshChips = function () {
    var S = J.S(), lv = J.level();
    if (!shell.streak) return;
    shell.streak.innerHTML = ''; add(shell.streak, [U.icon('flame', 16), h('span', { class: 'mono' }, String(S.streak.cur))]);
    shell.lv.innerHTML = ''; add(shell.lv, [U.icon('crownSm', 16), h('span', { class: 'lvname' }, lv.title)]); shell.lv.setAttribute('aria-label', 'Rank: ' + lv.title);
  };
  U.route = function () {
    var hash = (location.hash || '#today').slice(1), name = hash, param = '';
    var known = ['learn', 'dyn', 'quiz', 'cards', 'unit', 'book'];
    known.forEach(function (k) { if (hash.indexOf(k + '-') === 0) { name = k; param = hash.slice(k.length + 1); } });
    if (!J.V[name]) { name = 'today'; param = ''; }
    NAV.forEach(function (n) {
      var on = n.id === name || (n.match && n.match.indexOf(name) >= 0);
      [shell.tabs, shell.bottom].forEach(function (nav) { var a = nav.querySelector('[data-id="' + n.id + '"]'); if (a) { if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); } });
    });
    if (U.cleanup) { try { U.cleanup(); } catch (e) {} U.cleanup = null; }
    shell.main.innerHTML = '';
    var wrap = h('div', { class: 'wrap' });
    shell.main.appendChild(wrap);
    try { J.V[name](wrap, param); } catch (e) { console.error(e); wrap.appendChild(h('div', { class: 'card' }, h('h2', null, 'Something went wrong on this page'), h('p', { class: 'muted' }, String(e && e.message || e)), h('a', { class: 'btn', href: '#today' }, 'Go to Today'))); }
    window.scrollTo(0, 0);
    U.refreshChips();
  };
  U.go = function (hash) { if (location.hash === '#' + hash) U.route(); else location.hash = '#' + hash; };

  /* ---------- focus timer ---------- */
  var T = { mode: 'focus', left: 0, total: 0, running: false, id: null, started: 0 };
  function tick() {
    if (!T.running) return;
    T.left = Math.max(0, T.total - Math.round((Date.now() - T.started) / 1000));
    renderTimerMini();
    if (T.left <= 0) {
      T.running = false; clearInterval(T.id);
      if (T.mode === 'focus') { J.addMinutes(Math.round(T.total / 60)); U.toast('Focus session done: +' + Math.round(T.total / 60) + ' min logged. Take a break.'); U.sound('level'); U.burst(); T.mode = 'break'; }
      else { U.toast('Break over. One more round?'); U.sound('good'); T.mode = 'focus'; }
      resetT(); if (U._timerRender) U._timerRender();
    }
    if (U._timerRender) U._timerRender();
  }
  function resetT() { var p = J.S().prefs; T.total = (T.mode === 'focus' ? p.tFocus : p.tBreak) * 60; T.left = T.total; renderTimerMini(); }
  function fmt(s) { var m = Math.floor(s / 60), ss = s % 60; return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss; }
  function renderTimerMini() { if (shell.tmini) shell.tmini.textContent = T.running ? fmt(T.left) : ''; }
  U.openTimer = function () {
    if (!T.total) resetT();
    var ringC = 2 * Math.PI * 64, svgNS = 'http://www.w3.org/2000/svg';
    var body = h('div', { class: 'stack' });
    var m = U.modal(body, { onClose: function () { U._timerRender = null; } });
    U._timerRender = function () {
      body.innerHTML = '';
      var off = ringC * (1 - (T.total ? T.left / T.total : 1));
      var ring = document.createElementNS(svgNS, 'svg'); ring.setAttribute('viewBox', '0 0 150 150'); ring.setAttribute('class', 'timer-ring');
      ring.innerHTML = '<circle class="track" cx="75" cy="75" r="64"/><circle class="prog" cx="75" cy="75" r="64" stroke-dasharray="' + ringC + '" stroke-dashoffset="' + off + '"/><text x="75" y="84" text-anchor="middle">' + fmt(T.left) + '</text>';
      add(body, [
        h('div', { class: 'row between' }, h('h2', null, T.mode === 'focus' ? 'Focus' : 'Break'), h('button', { class: 'btn ghost small', onclick: m.close, 'aria-label': 'Close' }, U.icon('x', 18))),
        h('p', { class: 'muted small' }, T.mode === 'focus' ? 'One task only. If a thought pops up, park it in Brain dump and come back.' : 'Stand up, drink water, look far away.'),
        ring,
        h('div', { class: 'row', style: { justifyContent: 'center' } },
          h('button', { class: 'btn primary big', onclick: function () { if (T.running) { T.running = false; clearInterval(T.id); T.total = T.left; } else { T.running = true; T.started = Date.now(); T.id = setInterval(tick, 1000); } U._timerRender(); } }, U.icon(T.running ? 'pause' : 'play', 20), T.running ? 'Pause' : 'Start'),
          h('button', { class: 'btn', onclick: function () { T.running = false; clearInterval(T.id); resetT(); U._timerRender(); } }, U.icon('reset', 18), 'Reset')),
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Mode' },
          ['focus', 'break'].map(function (md) { return h('button', { 'aria-pressed': String(T.mode === md), onclick: function () { if (T.running) return; T.mode = md; resetT(); U._timerRender(); } }, md === 'focus' ? 'Focus ' + J.S().prefs.tFocus + ' min' : 'Break ' + J.S().prefs.tBreak + ' min'); }))
      ]);
    };
    U._timerRender();
  };

  /* ---------- text size & font (reachable from every screen) ---------- */
  U.SIZE_MIN = 14; U.SIZE_MAX = 30;
  U.openSize = function () {
    var p = J.S().prefs, body = h('div', { class: 'size-pop' });
    var m = U.modal(body);
    function setSize(v) { p.size = Math.max(U.SIZE_MIN, Math.min(U.SIZE_MAX, Math.round(v))); J.save(); U.applyPrefs(); draw(); }
    function draw() {
      body.innerHTML = '';
      var range = h('input', { type: 'range', id: 'size-range', min: String(U.SIZE_MIN), max: String(U.SIZE_MAX), step: '1', value: String(p.size), 'aria-label': 'Text size in pixels' });
      range.addEventListener('input', function () { p.size = +range.value; J.save(); U.applyPrefs(); lbl.textContent = 'Text size: ' + p.size + ' px'; });
      var lbl = h('b', null, 'Text size: ' + p.size + ' px');
      add(body, [
        h('div', { class: 'row between' }, h('h2', null, 'Text size & font'), h('button', { class: 'btn ghost small', onclick: m.close, 'aria-label': 'Close' }, U.icon('x', 18))),
        lbl,
        h('div', { class: 'size-row' },
          h('button', { 'aria-label': 'Smaller text', onclick: function () { setSize(p.size - 1); } }, h('span', { style: { fontSize: '14px' } }, 'A−')),
          range,
          h('button', { 'aria-label': 'Bigger text', onclick: function () { setSize(p.size + 1); } }, h('span', { style: { fontSize: '22px' } }, 'A+'))),
        h('div', { class: 'row' }, [[16, 'Normal'], [19, 'Large'], [22, 'Extra large'], [26, 'Huge']].map(function (x) { return h('button', { class: 'btn small' + (p.size === x[0] ? ' primary' : ''), onclick: function () { setSize(x[0]); } }, x[1]); })),
        h('p', { class: 'eyebrow' }, 'Font'),
        U.seg([['lexend', 'Lexend'], ['atkinson', 'Atkinson Hyperlegible'], ['system', 'System'], ['serif', 'Serif']], p.font, function (v) { p.font = v; J.save(); U.applyPrefs(); draw(); }, 'Font'),
        h('p', { class: 'eyebrow' }, 'Line spacing'),
        U.seg([[1.5, 'Snug'], [1.65, 'Normal'], [1.85, 'Airy'], [2.05, 'Extra']], p.lh, function (v) { p.lh = v; J.save(); U.applyPrefs(); draw(); }, 'Line spacing'),
        U.mdEl('div', 'Preview: **Bimbisara** (c. 544–492 BCE) annexed **Anga** and made marriage alliances with Kosala, the Licchavis and Madra.', { class: 'size-preview' }),
        h('p', { class: 'small muted' }, 'Small labels never go below 12 px. More options (theme, letter spacing, motion) are in Tweaks.')
      ]);
    }
    draw();
  };

  /* ---------- brain dump ---------- */
  U.openDump = function () {
    var S = J.S();
    var scrim = h('div', { class: 'scrim', style: { placeItems: 'stretch end', padding: 0 }, onclick: function (e) { if (e.target === scrim) scrim.remove(); } });
    var list = h('div', { class: 'stack', style: { overflow: 'auto' } });
    var ta = h('textarea', { class: 'input', id: 'dump-input', placeholder: 'Type the distracting thought here and get back to studying…', style: { minHeight: '90px' } });
    function render() {
      list.innerHTML = '';
      if (!S.dump.length) list.appendChild(h('p', { class: 'muted small' }, 'Nothing parked. Good.'));
      S.dump.slice().reverse().forEach(function (d) {
        list.appendChild(h('div', { class: 'check' + (d.done ? ' done' : ''), onclick: function () { d.done = !d.done; J.save(); render(); } },
          h('span', { class: 'box' }, d.done ? U.icon('check', 16) : ''), h('span', { class: 'lbl' }, d.t, h('br'), h('span', { class: 'tiny muted' }, d.day))));
      });
    }
    var dr = h('aside', { class: 'drawer', 'aria-label': 'Brain dump' },
      h('div', { class: 'stack' },
        h('div', { class: 'row between' }, h('h2', null, 'Brain dump'), h('button', { class: 'btn ghost small', onclick: function () { scrim.remove(); }, 'aria-label': 'Close' }, U.icon('x', 18))),
        h('p', { class: 'muted small' }, 'Park it, don’t chase it. You can deal with it after this session.'),
        ta,
        h('div', { class: 'row' },
          h('button', { class: 'btn primary', onclick: function () { var v = ta.value.trim(); if (!v) return; S.dump.push({ t: v, day: J.date.today(), done: false }); ta.value = ''; J.save(); render(); U.toast('Parked. Back to work.'); } }, 'Park it'),
          h('button', { class: 'btn ghost small', onclick: function () { S.dump = S.dump.filter(function (d) { return !d.done; }); J.save(); render(); } }, 'Clear done'))),
      list);
    scrim.appendChild(dr); document.body.appendChild(scrim); render(); setTimeout(function () { ta.focus(); }, 30);
  };

  /* ---------- small widgets ---------- */
  U.bar = function (pct, cls) { var b = h('div', { class: 'bar ' + (cls || ''), role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(pct)) }), i = h('i'); i.style.width = Math.max(0, Math.min(100, pct)) + '%'; b.appendChild(i); return b; };
  U.stat = function (v, l) { return h('div', { class: 'stat' }, h('b', null, String(v)), h('span', null, l)); };
  U.seg = function (opts, cur, onPick, label) {
    return h('div', { class: 'seg', role: 'group', 'aria-label': label || '' }, opts.map(function (o) {
      return h('button', { type: 'button', 'aria-pressed': String(o[0] === cur), onclick: function () { onPick(o[0]); } }, o[1]);
    }));
  };
  U.pct = function (a, b) { return b ? Math.round(a / b * 100) : 0; };
  U.copy = function (text, btn) {
    function fallback() { var ta = h('textarea', { class: 'input' }); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); }
    try { navigator.clipboard.writeText(text).then(function () { U.toast('Copied'); }, function () { fallback(); U.toast('Copied'); }); } catch (e) { fallback(); U.toast('Copied'); }
  };
  /* Bar chart (SVG) for daily series: data = [{l, a, b}] a = total, b = correct */
  U.barChart = function (data, opts) {
    opts = opts || {};
    var W = 640, H = 220, pad = 30, n = data.length || 1, max = Math.max.apply(null, data.map(function (d) { return d.a; }).concat([opts.min || 10]));
    var step = Math.pow(10, Math.floor(Math.log10(max))), top = Math.ceil(max / step) * step;
    var bw = (W - pad * 2) / n, s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.label || 'chart') + '">';
    for (var g = 0; g <= 4; g++) { var y = H - pad - (H - pad * 2) * g / 4; s += '<line class="grid" x1="' + pad + '" x2="' + (W - 8) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (pad - 6) + '" y="' + (y + 3) + '" text-anchor="end">' + Math.round(top * g / 4) + '</text>'; }
    data.forEach(function (d, i) {
      var x = pad + i * bw + bw * 0.18, w = bw * 0.64, ha = (H - pad * 2) * d.a / top, hb = (H - pad * 2) * (d.b || 0) / top;
      s += '<rect class="barq" opacity="0.28" x="' + x + '" y="' + (H - pad - ha) + '" width="' + w + '" height="' + ha + '" rx="3"/>';
      s += '<rect class="barc" x="' + x + '" y="' + (H - pad - hb) + '" width="' + w + '" height="' + hb + '" rx="3"/>';
      if (n <= 14 || i % Math.ceil(n / 10) === 0) s += '<text x="' + (x + w / 2) + '" y="' + (H - pad + 14) + '" text-anchor="middle">' + esc(d.l) + '</text>';
    });
    s += '</svg>';
    var div = h('div'); div.innerHTML = s; return div.firstChild;
  };
})(window.JRF);
