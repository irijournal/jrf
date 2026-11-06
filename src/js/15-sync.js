/* Cloud sync for the hosted (claude.ai Artifact) version.
   Progress is always saved to this browser first. When the page runs inside claude.ai with the
   `db` + `user` capabilities, the whole state is also copied to the viewer's PRIVATE subtree
   (data/users/<id>/…), split into chunks below the 256 KiB document limit. On another device the
   newer copy wins. Anywhere else (local file, GitHub Pages) this file does nothing. */
(function (J) {
  'use strict';
  var CHUNK = 180000, db = null, uid = null, lastSent = {}, timer = null, busy = false, ready = false;
  function status(t) { J.syncStatus = t; J.emit('sync', t); }

  function base() { return 'data/users/' + uid; }
  function pre() { return J.accounts ? J.accounts.cloudPrefix() : 'jrf_'; }
  function push() {
    if (!db || !uid || busy) return;
    busy = true;
    var S = J.S(), txt = JSON.stringify(S), n = Math.ceil(txt.length / CHUNK), jobs = [];
    for (var i = 0; i < n; i++) {
      var part = txt.slice(i * CHUNK, (i + 1) * CHUNK);
      if (lastSent[i] === part) continue;
      (function (i, part) { jobs.push(db.doc(base() + '/' + pre() + i).set({ i: i, s: part }).then(function () { lastSent[i] = part; })); })(i, part);
    }
    Promise.all(jobs).then(function () {
      return db.doc(base() + '/' + pre() + 'meta').set({ n: n, savedAt: S.savedAt || Date.now(), activeAt: S.activeAt || 0, v: 1 });
    }).then(function () {
      if (J.accounts && J.accounts.list().length) return db.doc(base() + '/jrf_accounts').set({ list: J.accounts.list() });
    }).then(function () { status('Saved to your account'); }, function (e) {
      status(e && e.code === 'quota_exceeded' ? 'Cloud copy is full — export a backup in Tweaks' : 'Saved on this device (cloud copy will retry)');
    }).then(function () { busy = false; });
  }
  function schedule() { if (!ready) return; clearTimeout(timer); timer = setTimeout(push, 15000); }

  function pull() {
    return db.doc(base() + '/' + pre() + 'meta').get().then(function (m) {
      if (!m.exists) return false;
      var meta = m.data(), local = J.bootActiveAt || 0, now = J.S().activeAt || 0;
      if (!meta || !((meta.activeAt || 0) > local) || now > local) return false;
      var reads = [];
      for (var i = 0; i < meta.n; i++) reads.push(db.doc(base() + '/' + pre() + i).get());
      return Promise.all(reads).then(function (snaps) {
        var parts = snaps.map(function (s) { return s.exists ? (s.data() || {}).s || '' : ''; });
        if (parts.some(function (p) { return !p; })) return false;
        J.importData(parts.join(''));
        parts.forEach(function (p, i) { lastSent[i] = p; });
        return true;
      });
    });
  }

  J.syncInit = function () {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    var giveUp = setTimeout(function () { status(''); }, 10000);
    Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
      clearTimeout(giveUp);
      db = r[0]; var user = r[1];
      if (!db || !user) return null;
      return user.id();
    }).then(function (id) {
      if (!id) return;
      uid = id;
      db.doc(base() + '/jrf_accounts').get().then(function (a) { if (a.exists && J.accounts) { var n = J.accounts.merge((a.data() || {}).list); if (n) J.UI.toast(n + ' more account' + (n > 1 ? 's' : '') + ' found on your other device'); } }, function () {});
      return pull().then(function (changed) {
        ready = true;
        if (changed) { J.UI.applyPrefs(); J.UI.toast('Loaded your newer progress from your account'); J.UI.route(); }
        else schedule();
        status('Synced');
      });
    }).catch(function () { ready = !!(db && uid); status('Saved on this device'); });
    J.on('saved', schedule);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && ready) { clearTimeout(timer); push(); } });
  };
})(window.JRF);
