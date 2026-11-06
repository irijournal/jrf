/* Progress reports: daily, weekly, monthly, overall (+ weak areas, projection, shareable summary) */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G, D = J.date;

  function sumDays(from, n) {
    var S = J.S(), t = { q: 0, c: 0, min: 0, xp: 0, learned: 0, revised: 0, cards: 0, active: 0, u: {} };
    for (var i = 0; i < n; i++) {
      var d = D.add(from, -i), l = S.log[d]; if (!l) continue;
      t.q += l.q; t.c += l.c; t.min += l.min; t.xp += l.xp; t.learned += l.learned.length; t.revised += l.revised; t.cards += l.cards || 0;
      if (l.q || l.min || l.cards || l.learned.length) t.active++;
      for (var u in l.u) { var x = t.u[u] || (t.u[u] = [0, 0]); x[0] += l.u[u][0]; x[1] += l.u[u][1]; }
    }
    return t;
  }
  function unitTable(uMap) {
    var keys = Object.keys(uMap).sort(function (a, b) { return J.units.findIndex(function (u) { return u.id === a; }) - J.units.findIndex(function (u) { return u.id === b; }); });
    if (!keys.length) return h('p', { class: 'muted small' }, 'No questions answered in this period.');
    return h('div', { class: 'stack' }, keys.map(function (k) {
      var x = uMap[k], u = G.unit(k), p = U.pct(x[1], x[0]);
      return h('div', { class: 'stack', style: { gap: '4px' } }, h('div', { class: 'row between small' }, h('span', null, (u.paper === 1 ? 'P1 · ' : 'Unit ' + u.n + ' · ') + u.name), h('span', { class: 'mono' }, x[1] + '/' + x[0] + ' · ' + p + '%')), U.bar(p, p >= 70 ? 'good' : p >= 50 ? '' : 'copper'));
    }));
  }
  function weakAreas() {
    var S = J.S(), topicAcc = {}, unitAcc = {};
    for (var id in S.q) {
      var r = S.q[id], p = id.split('|');
      if (p[0] === 'h') { var t = topicAcc[p[1]] || (topicAcc[p[1]] = [0, 0]); t[0] += r[0]; t[1] += r[1]; }
    }
    for (var d in S.log) for (var u in S.log[d].u) { var x = unitAcc[u] || (unitAcc[u] = [0, 0]); x[0] += S.log[d].u[u][0]; x[1] += S.log[d].u[u][1]; }
    var tw = Object.keys(topicAcc).filter(function (k) { return topicAcc[k][0] >= 4; }).map(function (k) { return { id: k, a: topicAcc[k][1] / topicAcc[k][0], n: topicAcc[k][0] }; }).sort(function (a, b) { return a.a - b.a; }).slice(0, 6);
    var uw = Object.keys(unitAcc).filter(function (k) { return unitAcc[k][0] >= 10; }).map(function (k) { return { id: k, a: unitAcc[k][1] / unitAcc[k][0], n: unitAcc[k][0] }; }).sort(function (a, b) { return a.a - b.a; }).slice(0, 5);
    return { topics: tw, units: uw };
  }
  J.weakAreas = weakAreas;

  J.V.reports = function (root) {
    var S = J.S(), tab = S.repTab || 'day', today = D.today();
    root.appendChild(h('h1', null, 'Progress reports'));
    root.appendChild(U.seg([['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly'], ['all', 'Overall']], tab, function (v) { S.repTab = v; J.save(); U.route(); }, 'Period'));

    if (tab === 'day') {
      var day = S.repDay || today, l = S.log[day] || { q: 0, c: 0, min: 0, xp: 0, learned: [], revised: 0, cards: 0, u: {}, types: {} };
      root.appendChild(h('div', { class: 'row between' },
        h('button', { class: 'btn small', onclick: function () { S.repDay = D.add(day, -1); J.save(); U.route(); } }, U.icon('arrowL', 16), 'Prev'),
        h('b', { class: 'mono' }, day === today ? 'Today · ' + day : day),
        h('button', { class: 'btn small', disabled: day >= today, onclick: function () { S.repDay = D.add(day, 1); J.save(); U.route(); } }, 'Next', U.icon('arrowR', 16))));
      root.appendChild(h('div', { class: 'card hero' }, h('div', { class: 'grid3' }, U.stat(l.q, 'questions'), U.stat(U.pct(l.c, l.q) + '%', 'accuracy'), U.stat(l.min, 'focus minutes'), U.stat(l.xp, 'XP'), U.stat(l.learned.length, 'topics learned'), U.stat(l.revised + (l.cards || 0), 'revisions + cards'))));
      if (l.learned.length) root.appendChild(h('div', { class: 'card' }, h('h3', null, 'Learned'), h('ul', { class: 'plist' }, l.learned.map(function (id) { return h('li', null, h('a', { href: '#learn-' + id }, G.topic(id).t)); }))));
      root.appendChild(h('div', { class: 'card' }, h('h3', null, 'Accuracy by unit'), unitTable(l.u)));
      var ty = Object.keys(l.types || {});
      if (ty.length) root.appendChild(h('div', { class: 'card' }, h('h3', null, 'By question type'), h('div', { class: 'scrollx' }, h('table', { class: 'tbl' }, h('tbody', null, ty.map(function (k) { var x = l.types[k]; return h('tr', null, h('td', null, G.KIND_NAME[k] || k), h('td', { class: 'num' }, x[1] + '/' + x[0]), h('td', { class: 'num' }, U.pct(x[1], x[0]) + '%')); }))))));
    }

    if (tab === 'week' || tab === 'month') {
      var n = tab === 'week' ? 7 : 30, t = sumDays(today, n), series = [];
      for (var i = n - 1; i >= 0; i--) { var dd = D.add(today, -i), lg = S.log[dd] || { q: 0, c: 0 }; series.push({ l: tab === 'week' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][D.parse(dd).getDay()] : dd.slice(8), a: lg.q, b: lg.c }); }
      root.appendChild(h('div', { class: 'card hero' }, h('div', { class: 'grid3' }, U.stat(t.q, 'questions'), U.stat(U.pct(t.c, t.q) + '%', 'accuracy'), U.stat(Math.round(t.min / 60 * 10) / 10 + ' h', 'focus time'), U.stat(t.learned, 'topics learned'), U.stat(t.active + '/' + n, 'active days'), U.stat(t.xp, 'XP'))));
      root.appendChild(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, 'Questions per day'), h('span', { class: 'small muted' }, 'light = answered · green = correct')), U.barChart(series, { label: 'Questions per day' })));
      if (tab === 'month') {
        var heat = h('div', { class: 'heat', 'aria-label': 'Last 35 days activity' }), start = D.add(today, -34);
        var pad = D.parse(start).getDay();
        for (var p0 = 0; p0 < pad; p0++) heat.appendChild(h('div', { style: { visibility: 'hidden' } }));
        for (var k = 0; k < 35; k++) {
          var d2 = D.add(start, k), q = (S.log[d2] || {}).q || 0, lvl = q === 0 ? '' : q < 20 ? 'h1' : q < 50 ? 'h2' : 'h3';
          heat.appendChild(h('div', { class: lvl + (d2 === today ? ' today' : ''), title: d2 + ': ' + q + ' questions' }, d2.slice(8)));
        }
        root.appendChild(h('div', { class: 'card' }, h('h3', null, 'Activity calendar'), h('div', { class: 'row small muted' }, 'Su Mo Tu We Th Fr Sa →'), heat));
      }
      var plan = J.planEnsure(), doneT = 0, allT = 0;
      plan.days.forEach(function (d) { if (d.date <= today && D.diff(d.date, today) < n) d.tasks.forEach(function (x, i) { allT++; if (J.taskDone(d, x, i)) doneT++; }); });
      root.appendChild(h('div', { class: 'card' }, h('h3', null, 'Plan adherence'), h('p', { class: 'small' }, doneT + ' of ' + allT + ' planned tasks done in this period'), U.bar(U.pct(doneT, allT), 'good')));
      root.appendChild(h('div', { class: 'card' }, h('h3', null, 'Accuracy by unit'), unitTable(t.u)));
    }

    if (tab === 'all') {
      var learned = J.learnedCount(), mastered = Object.keys(S.topics).filter(function (k) { return S.topics[k].st >= 3; }).length;
      var tq = J.totalQ(), tc = 0; for (var d3 in S.log) tc += S.log[d3].c;
      var dn = Math.max(1, J.dayNumber()), rate = learned / dn, leftT = J.topics.length - learned, needDays = rate > 0 ? Math.ceil(leftT / rate) : null;
      var daysLeftBuild = Math.max(0, Math.round(S.profile.days * 0.7) - dn);
      root.appendChild(h('div', { class: 'card hero' },
        h('div', { class: 'grid3' }, U.stat(learned + '/' + J.topics.length, 'topics learned'), U.stat(mastered, 'mastered'), U.stat(tq.toLocaleString('en-IN'), 'questions answered'), U.stat(U.pct(tc, tq) + '%', 'overall accuracy'), U.stat(Object.keys(S.cards).length, 'cards in deck'), U.stat(S.streak.best, 'best streak')),
        h('p', { class: 'small' }, 'Syllabus coverage'), U.bar(U.pct(learned, J.topics.length)),
        h('p', { class: 'small muted' }, needDays == null ? 'Learn your first topic to see a finish-date projection.' : 'At your current pace (' + (Math.round(rate * 10) / 10) + ' topics/day) you need about ' + needDays + ' more days to finish learning; the Build phase has ' + daysLeftBuild + ' days left. ' + (needDays <= daysLeftBuild ? 'You are on track.' : 'Use Re-plan or add one small topic on lighter days.'))));
      var w = weakAreas();
      var wc = h('div', { class: 'card' }, h('h3', null, 'Weak areas (practise these first)'));
      if (!w.units.length && !w.topics.length) wc.appendChild(h('p', { class: 'muted small' }, 'Answer at least 10 questions in a unit to see weak areas.'));
      w.units.forEach(function (x) { var u = G.unit(x.id); wc.appendChild(h('div', { class: 'topic-row' }, h('span', { class: 'nm' }, (u.paper === 1 ? 'P1 · ' : 'Unit ' + u.n + ' · ') + u.name), h('span', { class: 'pill ' + (x.a < 0.5 ? 'bad' : 'warn') }, Math.round(x.a * 100) + '% of ' + x.n), h('button', { class: 'btn small', onclick: function () { J.startQuiz({ ids: G.sample(G.pool({ units: [x.id] }), 20), title: 'Weak unit: ' + u.name }); } }, 'Practise 20'))); });
      w.topics.forEach(function (x) { var t = G.topic(x.id); wc.appendChild(h('div', { class: 'topic-row' }, h('a', { class: 'nm', href: '#learn-' + x.id }, t.t), h('span', { class: 'pill ' + (x.a < 0.5 ? 'bad' : 'warn') }, Math.round(x.a * 100) + '%'), h('button', { class: 'btn small', onclick: function () { S.learnMode = 'recall'; J.save(); U.go('learn-' + x.id); } }, 'Recall'))); });
      root.appendChild(wc);
      var all = sumDays(today, 400);
      root.appendChild(h('div', { class: 'card' }, h('h3', null, 'All-time accuracy by unit'), unitTable(all.u)));
    }

    // shareable summary
    var t7 = sumDays(today, 7);
    var summary = 'JRF Sadhana — progress ' + today + '\nDay ' + J.dayNumber() + ' of ' + S.profile.days + ' · streak ' + S.streak.cur + ' days\nTopics learned: ' + J.learnedCount() + '/' + J.topics.length + '\nLast 7 days: ' + t7.q + ' questions, ' + U.pct(t7.c, t7.q) + '% accuracy, ' + Math.round(t7.min / 60 * 10) / 10 + ' h focus\nRank: ' + J.level().title + ' (' + S.xp + ' XP)';
    root.appendChild(h('details', { class: 'fold' }, h('summary', null, 'Share a summary (copy for WhatsApp / mentor)'), h('div', { class: 'in' }, h('pre', { class: 'small mono', style: { whiteSpace: 'pre-wrap', margin: 0 } }, summary), h('button', { class: 'btn small', onclick: function () { U.copy(summary); } }, 'Copy'))));
  };
})(window.JRF);
