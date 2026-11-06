/* Boot */
(function (J) {
  'use strict';
  var U = J.UI;
  var extraFonts = {
    atkinson: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap',
    serif: 'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600&display=swap'
  };
  var loaded = {};
  function ensureFont() {
    var f = J.S().prefs.font;
    if (extraFonts[f] && !loaded[f]) {
      loaded[f] = 1;
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = extraFonts[f]; document.head.appendChild(l);
    }
  }
  function start() {
    var applyPrefs = U.applyPrefs;
    U.applyPrefs = function () { applyPrefs(); ensureFont(); };
    U.applyPrefs();
    var need = J.accounts && J.accounts.needsLogin();
    if (need) { U.loginScreen(need, run); return; }
    run();
  }
  function run() {
    U.buildShell();
    J.on('levelup', function (lv) { U.toast('New rank: ' + lv.title + '!', 3500); U.sound('level'); U.burst(); });
    J.on('badge', function (b) { U.toast('Badge earned: ' + b.t, 3500); });
    J.on('quest', function (q) { U.toast('Quest complete: ' + q.t + ' (+' + q.xp + ' XP)'); U.sound('good'); });
    J.on('toast', function (x) { U.toast(x.t); });
    J.on('xp', function () { U.refreshChips(); });
    window.addEventListener('hashchange', U.route);
    J.checkBadges();
    U.route();
    if (J.syncInit) J.syncInit();
    // Save on hide so nothing is lost when the phone locks
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') J.save(true); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})(window.JRF);
