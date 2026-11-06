/* Accounts: login / sign-up screen, "who is studying?" picker, account page, moving progress between devices. */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, A = J.accounts;
  var ARTIFACT_URL = 'https://claude.ai/artifact/GUjnQpvVgo2QwgUvMNEW5N';
  var PAGES_URL = 'https://irijournal.github.io/jrf/';
  J.appLinks = { artifact: ARTIFACT_URL, pages: PAGES_URL };
  function onCloud() { return !!(window.claude && typeof window.claude.use === 'function'); }

  function avatar(a, size) {
    var n = (a && a.name || '?').trim();
    return h('span', { class: 'avatar', style: { background: A.color(a), width: (size || 40) + 'px', height: (size || 40) + 'px', fontSize: Math.round((size || 40) * 0.45) + 'px' }, 'aria-hidden': 'true' }, n.charAt(0).toUpperCase());
  }
  U.avatar = avatar;
  function pinInput(ph) { return h('input', { class: 'input pin', type: 'password', inputmode: 'numeric', pattern: '[0-9]*', maxlength: '6', autocomplete: 'off', placeholder: ph || 'PIN', 'aria-label': ph || 'PIN' }); }
  function validPin(v) { return !v || /^[0-9]{4,6}$/.test(v); }

  /* ---------- full-screen login ---------- */
  U.loginScreen = function (mode, done) {
    var wrap = h('div', { class: 'login' }), card = h('div', { class: 'login-card' });
    wrap.appendChild(card); document.body.appendChild(wrap);
    function finish(res) {
      if (res && res.reload) { location.reload(); return; }
      wrap.remove(); done();
    }
    function head(t, sub) { card.innerHTML = ''; card.appendChild(h('div', { class: 'brand' }, U.icon('scroll', 26), h('span', null, 'JRF Sadhana'))); card.appendChild(h('h1', null, t)); if (sub) card.appendChild(h('p', { class: 'muted' }, sub)); }
    function createForm(first) {
      var S = J.S(), had = first && (S.xp > 0 || Object.keys(S.log || {}).length > 1);
      head(first ? 'Make your account' : 'New account', first ? 'Your progress will be saved under your name.' : 'For anyone else who wants to study here. Their progress stays separate from yours.');
      var name = h('input', { class: 'input', type: 'text', placeholder: 'Your name', maxlength: '40', autocomplete: 'name', 'aria-label': 'Name', value: first ? (S.profile.name || '') : '' });
      var pin = pinInput('PIN (optional, 4–6 digits)'), err = h('p', { class: 'small bad-text', role: 'alert' });
      var go = h('button', { class: 'btn primary big', type: 'submit' }, first ? 'Start' : 'Create account', U.icon('arrowR', 20));
      var form = h('form', { class: 'stack', onsubmit: function (e) {
        e.preventDefault();
        if (!name.value.trim()) { err.textContent = 'Please type a name.'; name.focus(); return; }
        if (!validPin(pin.value)) { err.textContent = 'PIN must be 4 to 6 digits, or leave it empty.'; return; }
        finish(A.create(name.value, pin.value));
      } }, h('label', { class: 'stack' }, h('span', { class: 'small' }, 'Name'), name), h('label', { class: 'stack' }, h('span', { class: 'small' }, 'PIN — stops others on this device from opening your progress'), pin), err, go);
      card.appendChild(form);
      if (had) card.appendChild(h('p', { class: 'small fact' }, 'The progress already on this device will be kept in this account.'));
      card.appendChild(h('p', { class: 'tiny muted' }, onCloud() ? 'On this claude.ai link your progress is also copied to your claude.ai account, so it follows you to other devices.' : 'Progress is saved in this browser. To continue on another phone or laptop, use Account → Move progress.'));
      if (!first) card.appendChild(h('button', { class: 'btn ghost', type: 'button', onclick: pick }, U.icon('arrowL', 16), 'Back'));
      setTimeout(function () { name.focus(); }, 50);
    }
    function pick() {
      head('Who is studying?', 'Tap your name.');
      var grid = h('div', { class: 'acc-grid' });
      A.list().forEach(function (a) {
        var st = A.peek(a.id) || {};
        var tile = h('button', { class: 'acc-tile', type: 'button', onclick: function () {
          if (!a.pin) { finish(A.login(a.id, '')); return; }
          var p = pinInput('Enter PIN'), e2 = h('p', { class: 'small bad-text', role: 'alert' });
          head('Hi ' + a.name, 'Enter your PIN.');
          card.appendChild(h('form', { class: 'stack', onsubmit: function (ev) { ev.preventDefault(); var r = A.login(a.id, p.value); if (!r) { e2.textContent = 'Wrong PIN. Try again.'; p.value = ''; p.focus(); return; } finish(r); } },
            p, e2, h('button', { class: 'btn primary big', type: 'submit' }, 'Open', U.icon('arrowR', 20)), h('button', { class: 'btn ghost', type: 'button', onclick: pick }, U.icon('arrowL', 16), 'Back')));
          setTimeout(function () { p.focus(); }, 50);
        } }, avatar(a, 52), h('b', null, a.name), h('span', { class: 'tiny muted' }, (st.xp || 0) + ' XP · ' + (st.learned || 0) + ' topics' + (a.pin ? ' · 🔒' : '')));
        grid.appendChild(tile);
      });
      grid.appendChild(h('button', { class: 'acc-tile new', type: 'button', onclick: function () { createForm(false); } }, h('span', { class: 'avatar add' }, '+'), h('b', null, 'New account'), h('span', { class: 'tiny muted' }, 'for someone else')));
      card.appendChild(grid);
    }
    if (mode === 'create') createForm(true); else pick();
  };

  /* ---------- account page ---------- */
  J.V.account = function (root) {
    var a = A.active(), S = J.S();
    if (!a) { root.appendChild(h('p', null, 'Accounts need browser storage, which is turned off here.')); return; }
    root.appendChild(h('div', { class: 'row' }, avatar(a, 56), h('div', null, h('h1', { style: { margin: 0 } }, a.name), h('p', { class: 'small muted', style: { margin: 0 } }, 'Account since ' + a.created + (a.pin ? ' · PIN on' : ' · no PIN')))));
    root.appendChild(h('section', { class: 'card' },
      h('div', { class: 'stat-row' }, U.stat(S.xp, 'XP'), U.stat(S.streak.cur, 'day streak'), U.stat(Object.keys(S.topics).filter(function (k) { return S.topics[k].st >= 2; }).length, 'topics learned')),
      h('p', { class: 'small muted' }, J.syncStatus ? 'Saved on this device and in your claude.ai account (' + J.syncStatus + ').' : 'Saved on this device. Use “Move progress” below to carry it to another device.')));

    // name & PIN
    var name = h('input', { class: 'input', value: a.name, maxlength: '40', 'aria-label': 'Name' });
    var pin = pinInput(a.pin ? 'New PIN (4–6 digits)' : 'Set a PIN (4–6 digits)');
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Name & PIN'),
      h('div', { class: 'grid2' }, name, h('button', { class: 'btn', onclick: function () { A.rename(a.id, name.value); U.toast('Name saved'); U.route(); } }, 'Save name')),
      h('div', { class: 'grid2' }, pin, h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: function () { if (!/^[0-9]{4,6}$/.test(pin.value)) { U.toast('PIN must be 4–6 digits'); return; } A.setPin(a.id, pin.value); U.toast('PIN saved'); U.route(); } }, a.pin ? 'Change PIN' : 'Set PIN'),
        a.pin ? h('button', { class: 'btn ghost', onclick: function () { A.setPin(a.id, ''); U.toast('PIN removed'); U.route(); } }, 'Remove PIN') : null)),
      h('p', { class: 'tiny muted' }, 'The PIN is a simple lock for a shared phone or laptop. Do not reuse a bank PIN.')));

    // people
    var others = A.list().filter(function (x) { return x.id !== a.id; });
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Accounts on this device'),
      others.length ? h('div', { class: 'stack' }, others.map(function (x) {
        var st = A.peek(x.id) || {};
        return h('div', { class: 'row between acc-row' }, h('div', { class: 'row' }, avatar(x, 36), h('div', null, h('b', null, x.name), h('div', { class: 'tiny muted' }, (st.xp || 0) + ' XP · ' + (st.learned || 0) + ' topics learned'))),
          h('div', { class: 'row' },
            h('button', { class: 'btn small', onclick: function () { A.logout(); location.hash = '#today'; location.reload(); } }, 'Switch'),
            h('button', { class: 'btn small ghost', onclick: function () { U.confirm('Delete ' + x.name + '’s account?', 'All of their progress on this device will be removed. This cannot be undone.', 'Delete', function () { A.remove(x.id); U.route(); }, true); } }, 'Delete')));
      })) : h('p', { class: 'small muted' }, 'Only you so far. Someone else can study here with their own account and progress.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', onclick: function () { A.logout(); U.loginScreen('pick', function () {}); } }, '+ Add another person'),
        h('button', { class: 'btn ghost', onclick: function () { A.logout(); location.hash = '#today'; location.reload(); } }, 'Log out'))));

    // move progress
    var ta = h('textarea', { class: 'input', placeholder: 'Paste a progress code here', 'aria-label': 'Progress code' });
    var file = h('input', { type: 'file', accept: '.json,application/json,text/plain', class: 'visually-hidden', onchange: function () {
      var f = file.files[0]; if (!f) return; var rd = new FileReader();
      rd.onload = function () { try { J.importData(rd.result); A.rename(a.id, a.name); U.applyPrefs(); U.toast('Progress loaded'); U.go('today'); } catch (e) { U.toast(e.message || 'Could not read that file.'); } };
      rd.readAsText(f);
    } });
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Move progress to another phone or laptop'),
      h('ol', { class: 'plist' },
        h('li', null, 'On this device: ', h('b', null, 'Download progress file'), ' (or copy the code).'),
        h('li', null, 'Send it to yourself (WhatsApp, email, Drive).'),
        h('li', null, 'On the other device: open the site, make or open your account, then ', h('b', null, 'Load progress file'), '.')),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', onclick: function () { J.download('jrf-progress-' + a.name.replace(/\W+/g, '-').toLowerCase() + '-' + J.date.today() + '.json', J.exportData(), 'application/json'); } }, 'Download progress file'),
        h('button', { class: 'btn', onclick: function () { U.copy(J.exportData()); } }, 'Copy progress code'),
        h('button', { class: 'btn', onclick: function () { file.click(); } }, 'Load progress file'), file),
      h('details', { class: 'fold' }, h('summary', null, 'Paste a code instead'), h('div', { class: 'in stack' }, ta,
        h('button', { class: 'btn', onclick: function () { try { J.importData(ta.value); A.rename(a.id, a.name); U.applyPrefs(); U.toast('Progress loaded'); U.go('today'); } catch (e) { U.toast(e.message || 'Could not read that code.'); } } }, 'Load code'))),
      h('p', { class: 'tiny muted' }, onCloud() ? 'You are on the claude.ai link: your progress already follows your claude.ai login on every device.' : 'Tip: the claude.ai link (' + ARTIFACT_URL + ') saves progress to your claude.ai login automatically.')));
  };

  /* file download helper. Inside claude.ai the page must ask the viewer through the `downloads`
     capability; elsewhere a normal browser download. Falls back to copying the text. */
  J.download = function (name, text, type) {
    if (onCloud()) {
      window.claude.use('downloads').then(function (dl) {
        if (!dl) { U.copy(text); U.toast('Saving files is not available here — copied instead'); return; }
        return dl.save({ filename: name, data: text }).then(function () { U.toast('Saved ' + name); }, function (e) {
          var c = e && e.code;
          if (c === 'declined') U.toast('Not saved');
          else if (c === 'rate_limited') U.toast('A save prompt is already open');
          else { U.copy(text); U.toast('Could not save the file — copied instead'); }
        });
      }, function () { U.copy(text); });
      return;
    }
    try {
      var blob = new Blob([text], { type: type || 'text/plain' }), url = URL.createObjectURL(blob);
      var a = h('a', { href: url, download: name }); document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
      U.toast('Downloading ' + name);
    } catch (e) { U.copy(text); U.toast('Download blocked here — copied instead'); }
  };
})(window.JRF);

/* Greeting on Today with the account name */
(function (J) {
  var U = J.UI, h = U.h, base = J.V.today;
  J.V.today = function (root, param) {
    var a = J.accounts && J.accounts.active();
    if (a) {
      var hr = new Date().getHours(), part = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
      root.appendChild(h('div', { class: 'row between greet' }, h('div', { class: 'row' }, U.avatar(a, 34), h('b', null, (J.S().prefs.voice === 'english' ? part : 'Namaste') + ', ' + a.name.split(' ')[0])),
        J.accounts.list().length > 1 ? h('a', { class: 'small', href: '#account' }, 'Not you? Switch') : h('a', { class: 'small', href: '#account' }, 'Account')));
    }
    base(root, param);
  };
})(window.JRF);
