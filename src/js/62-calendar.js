/* Google Calendar: one-tap "add" links (no sign-in needed), whole-plan .ics file, repeating reminders. */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, D = J.date;
  function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'; } catch (e) { return 'Asia/Kolkata'; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function appLink() { return (window.claude && window.claude.use) ? J.appLinks.artifact : J.appLinks.pages; }
  function prefs() { var p = J.S().prefs; return { time: p.calTime || '07:00', mins: +p.calMins || 120, remind: p.calRemind == null ? 15 : +p.calRemind }; }
  function localStamp(date, time, addMin) {
    var d = D.parse(date), t = time.split(':'); d.setHours(+t[0], +t[1] + (addMin || 0), 0, 0);
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00';
  }
  function utcStamp(date, time, addMin) {
    var d = D.parse(date), t = time.split(':'); d.setHours(+t[0], +t[1] + (addMin || 0), 0, 0);
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  /* Google Calendar "add event" link — opens Google Calendar with everything filled in; one tap on Save. */
  function gcalUrl(ev) {
    var q = ['action=TEMPLATE', 'text=' + encodeURIComponent(ev.title),
      'dates=' + localStamp(ev.date, ev.time, 0) + '/' + localStamp(ev.date, ev.time, ev.mins),
      'ctz=' + encodeURIComponent(tz()), 'details=' + encodeURIComponent(ev.details || '')];
    if (ev.recur) q.push('recur=' + encodeURIComponent('RRULE:' + ev.recur));
    return 'https://calendar.google.com/calendar/render?' + q.join('&');
  }
  function dayEvent(day) {
    var p = prefs(), labels = day.tasks.map(function (x) { return '• ' + J.taskLabel(x); });
    return { title: 'JRF Day ' + (day.d + 1) + ' · ' + J.phaseName(day.phase) + ' — ' + (labels[0] || '').replace('• ', '').slice(0, 60), date: day.date, time: p.time, mins: p.mins,
      details: 'Today’s plan:\n' + labels.join('\n') + '\n\nOpen JRF Sadhana: ' + appLink() };
  }
  /* .ics for the whole plan (Google Calendar → Settings → Import) */
  function esc(t) { return String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function fold(line) { // fold at 73 UTF-8 bytes, never inside a character
    var out = [], cur = '', n = 0;
    Array.from(line).forEach(function (ch) {
      var b = unescape(encodeURIComponent(ch)).length;
      if (n + b > 73) { out.push(cur); cur = ' '; n = 1; }
      cur += ch; n += b;
    });
    out.push(cur); return out.join('\r\n');
  }
  function ics(events) {
    var now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''), p = prefs();
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JRF Sadhana//Study plan//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:JRF Sadhana plan'];
    events.forEach(function (ev, i) {
      L.push('BEGIN:VEVENT', 'UID:jrf-' + ev.date + '-' + i + '@jrf-sadhana', 'DTSTAMP:' + now,
        'DTSTART:' + utcStamp(ev.date, ev.time, 0), 'DTEND:' + utcStamp(ev.date, ev.time, ev.mins),
        'SUMMARY:' + esc(ev.title), 'DESCRIPTION:' + esc(ev.details || ''));
      if (p.remind > 0) L.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(ev.title), 'TRIGGER:-PT' + p.remind + 'M', 'END:VALARM');
      L.push('END:VEVENT');
    });
    L.push('END:VCALENDAR');
    return L.map(fold).join('\r\n') + '\r\n';
  }
  /* CSV in Google Calendar's import format (used where .ics files cannot be saved, e.g. inside claude.ai) */
  function csv(events) {
    function q(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }
    function md(date) { var p = date.split('-'); return p[1] + '/' + p[2] + '/' + p[0]; }
    function hm(time, add) { var t = time.split(':'), m = (+t[0]) * 60 + (+t[1]) + (add || 0); m = Math.min(m, 23 * 60 + 59); var hh = Math.floor(m / 60), mm = m % 60, ap = hh < 12 ? 'AM' : 'PM', h12 = hh % 12 || 12; return h12 + ':' + pad(mm) + ' ' + ap; }
    var rows = ['Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Private'];
    events.forEach(function (ev) { rows.push([q(ev.title), md(ev.date), hm(ev.time), md(ev.date), hm(ev.time, ev.mins), 'False', q(ev.details || ''), 'True'].join(',')); });
    return rows.join('\r\n') + '\r\n';
  }
  function planEnd() { var S = J.S(); return D.add(S.profile.start, S.profile.days - 1); }
  function untilStamp() { return planEnd().replace(/-/g, ''); }
  J.gcal = { url: gcalUrl, dayEvent: dayEvent, ics: ics, csv: csv };

  function addLink(ev, label, cls) { return h('a', { class: cls || 'btn small', href: gcalUrl(ev), target: '_blank', rel: 'noopener' }, U.icon('clock', 16), label || 'Add to Google Calendar'); }
  J.gcal.addLink = addLink;

  /* ---------- calendar page ---------- */
  J.V.calendar = function (root) {
    var S = J.S(), p = prefs(), plan = J.planEnsure(), t = D.today();
    root.appendChild(h('h1', null, 'Google Calendar'));
    root.appendChild(h('p', { class: 'muted' }, 'Put your plan where you already look. Each button opens Google Calendar with the event filled in — check it and tap Save. Nothing is shared and no sign-in to this app is needed.'));

    var time = h('input', { class: 'input', type: 'time', value: p.time, 'aria-label': 'Study start time' });
    var mins = h('select', { class: 'input', 'aria-label': 'Study block length' }, [60, 90, 120, 150, 180, 240].map(function (m) { var o = h('option', { value: String(m) }, m / 60 + ' h'); if (m === p.mins) o.selected = true; return o; }));
    var rem = h('select', { class: 'input', 'aria-label': 'Reminder before' }, [[0, 'No reminder'], [10, '10 min before'], [15, '15 min before'], [30, '30 min before'], [60, '1 h before']].map(function (r) { var o = h('option', { value: String(r[0]) }, r[1]); if (r[0] === p.remind) o.selected = true; return o; }));
    function savePrefs() { S.prefs.calTime = time.value || '07:00'; S.prefs.calMins = +mins.value; S.prefs.calRemind = +rem.value; J.save(); U.route(); }
    [time, mins, rem].forEach(function (el) { el.addEventListener('change', savePrefs); });
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'My study time'),
      h('div', { class: 'grid3' }, h('label', { class: 'stack' }, h('span', { class: 'small' }, 'Start'), time), h('label', { class: 'stack' }, h('span', { class: 'small' }, 'Length'), mins), h('label', { class: 'stack' }, h('span', { class: 'small' }, 'Reminder (in the plan file)'), rem))));

    var upcoming = plan.days.filter(function (d) { return d.date >= t; }).slice(0, 7);
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Next 7 days'),
      upcoming.length ? h('div', { class: 'stack' }, upcoming.map(function (d) {
        return h('div', { class: 'row between cal-row' }, h('div', null, h('b', null, (d.date === t ? 'Today' : d.date === D.add(t, 1) ? 'Tomorrow' : d.date) + ' · Day ' + (d.d + 1)), h('div', { class: 'small muted' }, d.tasks.map(J.taskLabel).join(' · '))), addLink(dayEvent(d), 'Add'));
      })) : h('p', { class: 'small muted' }, 'Your plan has finished. Use the repeating reminders below.')));

    var left = plan.days.filter(function (d) { return d.date >= t; }), cloud = !!(window.claude && window.claude.use);
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Whole plan at once'),
      h('p', null, left.length + ' study days from today to ' + planEnd() + ', each with its tasks and a reminder.'),
      cloud ? h('button', { class: 'btn primary', onclick: function () { J.download('jrf-plan-' + t + '.csv', csv(left.map(dayEvent)), 'text/csv'); } }, 'Download plan file (CSV)')
        : h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: function () { J.download('jrf-plan-' + t + '.ics', ics(left.map(dayEvent)), 'text/calendar'); } }, 'Download plan file (.ics, with reminders)'),
          h('button', { class: 'btn ghost', onclick: function () { J.download('jrf-plan-' + t + '.csv', csv(left.map(dayEvent)), 'text/csv'); } }, 'CSV instead')),
      cloud ? h('p', { class: 'tiny muted' }, 'Inside claude.ai the plan comes as a CSV file (Google Calendar imports it the same way; add reminders with the repeating events below).') : null,
      h('details', { class: 'fold' }, h('summary', null, 'How to put the file into Google Calendar'), h('div', { class: 'in' }, h('ol', { class: 'plist' },
        h('li', null, 'Open calendar.google.com on a computer (or “Desktop site” in the phone browser).'),
        h('li', null, 'Settings (gear) → Import & export → Import.'),
        h('li', null, 'Choose the downloaded jrf-plan file and your calendar → Import.'),
        h('li', null, 'Re-planned later? Download again and import; old copies can be deleted from the calendar.'))))));

    var end = untilStamp(), link = appLink();
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Repeating reminders'),
      h('p', { class: 'small muted' }, 'Each repeats until your plan ends (' + planEnd() + ').'),
      h('div', { class: 'stack' },
        h('div', { class: 'row between cal-row' }, h('div', null, h('b', null, 'Daily study block'), h('div', { class: 'small muted' }, p.time + ' · ' + p.mins / 60 + ' h, every day')),
          addLink({ title: 'JRF study — open Today', date: t, time: p.time, mins: p.mins, recur: 'FREQ=DAILY;UNTIL=' + end, details: 'Open Today and do the next task: ' + link }, 'Add')),
        h('div', { class: 'row between cal-row' }, h('div', null, h('b', null, 'Night revision (10 min)'), h('div', { class: 'small muted' }, '21:30 every day — clear due cards and mistakes')),
          addLink({ title: 'JRF revision: due cards + mistakes', date: t, time: '21:30', mins: 10, recur: 'FREQ=DAILY;UNTIL=' + end, details: 'Revise page: ' + link }, 'Add')),
        h('div', { class: 'row between cal-row' }, h('div', null, h('b', null, 'Sunday mock test'), h('div', { class: 'small muted' }, '3 hours every Sunday, ' + p.time)),
          addLink({ title: 'JRF full mock test (3 h)', date: nextSunday(t), time: p.time, mins: 180, recur: 'FREQ=WEEKLY;BYDAY=SU;UNTIL=' + end, details: 'Full mock: ' + link }, 'Add')),
        h('div', { class: 'row between cal-row' }, h('div', null, h('b', null, 'Plan finish line'), h('div', { class: 'small muted' }, planEnd())),
          addLink({ title: 'JRF plan ends — exam ready', date: planEnd(), time: p.time, mins: 60, details: 'Last light revision day. ' + link }, 'Add')))));
  };
  function nextSunday(t) { var d = D.parse(t), add = (7 - d.getDay()) % 7; return D.add(t, add); }

  /* ---------- add buttons to Today and the Plan ---------- */
  var baseToday = J.V.today;
  J.V.today = function (root, param) {
    baseToday(root, param);
    var day = J.planToday(), nx = root.querySelector('.next');
    var row = h('div', { class: 'row cal-inline' },
      day ? addLink(dayEvent(day), 'Add today to Google Calendar', 'btn small ghost') : null,
      h('a', { class: 'btn small ghost', href: '#calendar' }, 'Calendar options'));
    if (nx && nx.parentNode) nx.parentNode.insertBefore(row, nx.nextSibling); else root.appendChild(row);
  };
  var basePlan = J.V.plan;
  J.V.plan = function (root, param) {
    basePlan(root, param);
    var plan = J.planEnsure(), rows = root.querySelectorAll('.plan-day');
    plan.days.forEach(function (d, i) { var el = rows[i]; if (el) el.appendChild(h('a', { class: 'cal-mini', href: gcalUrl(dayEvent(d)), target: '_blank', rel: 'noopener', title: 'Add Day ' + (d.d + 1) + ' to Google Calendar', 'aria-label': 'Add Day ' + (d.d + 1) + ' to Google Calendar' }, U.icon('clock', 16))); });
    var first = root.querySelector('.card .row');
    if (first) first.appendChild(h('a', { class: 'btn', href: '#calendar' }, U.icon('clock', 18), 'Google Calendar'));
  };
})(window.JRF);
