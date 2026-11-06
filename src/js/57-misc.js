/* Exam guide, Library (books, IGNOU, Drive, platforms), Tweaks (settings & data) */
(function (J) {
  'use strict';
  var U = J.UI, h = U.h, G = J.G;

  /* ---------------- Exam guide ---------------- */
  J.V.exam = function (root) {
    root.appendChild(h('h1', null, 'Understand the exam'));
    root.appendChild(h('p', { class: 'muted small' }, 'UGC-NET History (subject code 06), conducted by NTA in computer-based mode, usually in June and December cycles. Always confirm details in the latest NTA information bulletin.'));
    root.appendChild(h('section', { class: 'card hero' },
      h('h2', null, 'Pattern at a glance'),
      h('div', { class: 'scrollx' }, h('table', { class: 'tbl' },
        h('thead', null, h('tr', null, h('th', null, 'Paper'), h('th', null, 'Questions'), h('th', null, 'Marks'), h('th', null, 'What it tests'))),
        h('tbody', null,
          h('tr', null, h('td', null, 'Paper 1 (General)'), h('td', { class: 'num' }, '50'), h('td', { class: 'num' }, '100'), h('td', null, 'Teaching & research aptitude, reasoning, comprehension, ICT, environment, higher education')),
          h('tr', null, h('td', null, 'Paper 2 (History)'), h('td', { class: 'num' }, '100'), h('td', { class: 'num' }, '200'), h('td', null, 'Ten units: ancient to post-1947 + historiography & research method')),
          h('tr', null, h('td', null, h('b', null, 'Total')), h('td', { class: 'num' }, h('b', null, '150')), h('td', { class: 'num' }, h('b', null, '300')), h('td', null, '3 hours in one sitting, no break between papers'))))),
      h('ul', { class: 'plist' },
        h('li', null, 'Every question carries ', h('b', null, '2 marks'), '; there is ', h('b', null, 'no negative marking'), ' — never leave a question blank.'),
        h('li', null, 'All questions are compulsory MCQs with four options; you can move between the two papers within the 3 hours.'),
        h('li', null, 'About ', h('b', null, '72 seconds per question'), ' on average. Paper 1 maths/DI may need more; one-line factual questions much less.'))));

    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'JRF, Assistant Professor & PhD'),
      h('ul', { class: 'plist' },
        h('li', null, 'Results are declared in three categories (from the June 2024 cycle): ', h('b', null, 'JRF + Assistant Professor + PhD admission'), ', ', h('b', null, 'Assistant Professor + PhD admission'), ', and ', h('b', null, 'PhD admission only'), '.'),
        h('li', null, 'To be considered, a candidate must cross minimum aggregate marks across both papers (40% for General/EWS, 35% for reserved categories); qualifiers are then drawn from the top performers subject- and category-wise, and JRF is the highest cut-off within that.'),
        h('li', null, 'Eligibility: master’s degree with at least 55% (50% for SC/ST/OBC-NCL/PwD/third gender); final-year master’s students can apply.'),
        h('li', null, 'JRF has an upper age limit (30 years, with relaxation for reserved categories, women and some others); Assistant Professor has no upper age limit.'),
        h('li', null, 'Target for safety: aim for 70%+ in full mocks (≈ 210/300) and check the official cut-off PDF of your cycle.')),
      h('p', { class: 'small muted' }, 'Numbers like age limits and cut-offs change; verify on ugcnet.nta.ac.in before applying.')));

    var ex = [
      ['Simple MCQ', 'h|h4-src|2'], ['Match List I with List II', 'h|h1-hrp|0'], ['Chronological order', 'h|h4-mug1|5'],
      ['Multiple statements', 'h|h2-ash|4'], ['Assertion (A) – Reason (R)', 'h|h1-hrp2|3'], ['Statement I / Statement II', 'h|h1-lit|4']
    ];
    var exBox = h('section', { class: 'card' }, h('h2', null, 'The six question types (with live examples)'), h('p', { class: 'small muted' }, 'NTA uses these formats heavily; matching and chronology are especially common in History. Each example shows the answer and why.'));
    ex.forEach(function (e) { var q = G.get(e[1]); if (q) exBox.appendChild(h('details', { class: 'fold' }, h('summary', null, e[0]), h('div', { class: 'in' }, J.renderQ(q, { reveal: true, picked: q.a })))); });
    exBox.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: function () { J.startQuiz({ ids: G.sample(G.pool({ kinds: ['mt', 'ch', 'st', 's2', 'ar'] }), 15), title: 'Format drill' }); } }, 'Drill all formats (15)')));
    root.appendChild(exBox);

    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'How to read the tricky formats'),
      h('ul', { class: 'plist' },
        h('li', null, h('b', null, 'Matching:'), ' fix the one pair you are surest of, then eliminate options that disagree. Usually one sure pair removes two options.'),
        h('li', null, h('b', null, 'Chronology:'), ' find the earliest and the latest item first; options that do not start/end with them are out.'),
        h('li', null, h('b', null, 'Assertion–Reason:'), ' judge A and R separately first. Only then ask “does R explain why A is true?”'),
        h('li', null, h('b', null, 'Statements:'), ' mark each statement T/F on the rough sheet; watch for NOT, only, all, first.'),
        h('li', null, h('b', null, 'Paper 1 DI & comprehension:'), ' read the questions before the passage/table; approximate when options are far apart.'))));

    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'Your 4-month strategy (built into the plan)'),
      h('ol', { class: 'plist' },
        h('li', null, h('b', null, 'Build (≈ 12 weeks):'), ' one History topic a day in cards → mark learned → spaced revision starts automatically. Paper 1 topic every week; Paper 1 drill on other days. Every 7th day is a lighter review day.'),
        h('li', null, h('b', null, 'Revise (≈ 3 weeks):'), ' unit sprints — recall mode for each topic, unit flashcards, 50-question unit test.'),
        h('li', null, h('b', null, 'Mock (≈ 2 weeks):'), ' full 3-hour mocks on alternate days; between mocks fix the weakest units; last two days light.'),
        h('li', null, h('b', null, 'Daily non-negotiables:'), ' clear due revisions, answer your question goal, one focus session minimum.')),
      h('a', { class: 'btn small', href: '#plan' }, 'See the day-by-day plan')));

    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'ADHD-friendly study habits'),
      h('ul', { class: 'plist' },
        h('li', null, 'Start tiny: open the app and do 3 questions. Starting is the hardest part; momentum does the rest.'),
        h('li', null, 'Use the 25-minute timer and the brain-dump button for stray thoughts.'),
        h('li', null, 'Switch modes when bored: cards → map game → timeline story → quiz. Variety is allowed; skipping revision is not.'),
        h('li', null, 'Turn on Focus mode in Tweaks to hide quests and stats when they distract you.'),
        h('li', null, 'Body doubling helps: study on a video call with a friend, both silent.'),
        h('li', null, 'Sleep is part of memory. Spaced repetition only works if you sleep between sessions.'))));
  };

  /* ---------------- Library ---------------- */
  var DRIVE = [
    ['Upinder Singh — A History of Ancient and Early Medieval India (PDF)', 'https://drive.google.com/file/d/1uKtTLDAPaPUaZ81Qx2VWZC9dr8Ovbs-8/view'],
    ['Sekhar Bandyopadhyay — From Plassey to Partition (PDF)', 'https://drive.google.com/file/d/1hv1UeMS4nCiE-R5UTSfyAGsTrWUBX_rK/view'],
    ['E.H. Carr — What is History? (PDF)', 'https://drive.google.com/file/d/14vIzQqwSQcs8zpxkrNgio6ln-Z0cQ6tM/view'],
    ['Medieval India — Vision IAS handwritten notes (PDF)', 'https://drive.google.com/file/d/1zJVcjZw4djK8dUKtBYIKm8WjeGWFFSiq/view'],
    ['YCT — 1 Lakh History (question book, PDF)', 'https://drive.google.com/file/d/1UQmEvGthCWYJclsDE5-7cGz12djVtUJ_/view'],
    ['UGC-NET History, 28 June 2025 Shift 1 — question paper (PDF)', 'https://drive.google.com/file/d/1X1OAlHBfXX7CQsBjXvutFhsRJhHsEg6h/view'],
    ['IGNOU — Debates on feudalism (PDF)', 'https://drive.google.com/file/d/1G1pJxo2m1ny4mqmJmFwBKQmVO0VVfN7f/view'],
    ['IGNOU — Block 1: Reconstructing Ancient Indian History (zip)', 'https://drive.google.com/file/d/1C2spsbkcg8J-LVzSOfrZpYHapdHa2-hy/view'],
    ['IGNOU BA History folder', 'https://drive.google.com/drive/folders/0B882SNTMpjcUTlowZ2llMFJnUnM'],
    ['CUET PG History folder (JNU students’ initiative)', 'https://drive.google.com/drive/folders/1FBVUmNRHUaT6ryGwHSYn0JwQGCpK6d_d'],
    ['Women and Indian History (PDF)', 'https://drive.google.com/file/d/1OLfWJkQ8zQbPPNycWw1GChbqXbquydd4/view']
  ];
  var BOOKS = [
    ['Upinder Singh, A History of Ancient and Early Medieval India', 'Units I–III', 'ch. 1 Sources · 2 Palaeolithic–Mesolithic · 3 Neolithic–Chalcolithic · 4 Harappa · 5 Vedic & megaliths · 6 Mahajanapadas & heterodox sects · 7 Mauryas · 8 Post-Mauryan (200 BCE–300 CE) · 9 Guptas & after · 10 Regional kingdoms (600–1200)'],
    ['Satish Chandra, History of Medieval India', 'Units III–VI', 'ch. 2 Three empires (Pala, Pratihara, Rashtrakuta) · 3 Cholas · 4 Society & economy 800–1200 · 5 Age of conflict · 6–8 Delhi Sultanate & government · 9 Vijayanagara–Bahmani · 10 Regional kingdoms · 11 Culture 1200–1500 · 12–15 Mughals & Deccan · 16 Economy · 17 Culture · 18–19 Climax & disintegration · 20 Assessment'],
    ['V.D. Mahajan, History of Medieval India (Sultanate & Mughal)', 'Units IV–VI', 'Sources; Arabs & Ghaznavids; dynasty chapters (Slave → Lodi); Bahmani; Vijayanagar; Sultanate administration; architecture & literature; Bhakti; Sufism; Mughal emperors one by one'],
    ['Spectrum (Rajiv Ahir), A Brief History of Modern India', 'Units VII–IX', 'Sources & approaches; Europeans; expansion; 1857; socio-religious reform; peasant & tribal movements; INC phases; Gandhian era; Left; communalism; independence & after; constitutional, administrative and economic chapters'],
    ['E. Sreedharan, A Textbook of Historiography (500 BC–AD 2000)', 'Unit X', 'Greek–Roman–Chinese; Christian & Islamic; Renaissance & Scientific Revolution; Vico; Enlightenment; Romanticism; Hegel, Ranke, positivism, Marx; 20th-century schools; Indian historiography']
  ];
  var IGNOU = [
    ['MHI-101', 'Ancient and Medieval Societies', 'World context for Units I–IV'],
    ['MHI-102', 'Modern World', 'Context for Units VII–IX'],
    ['MHI-103', 'Historiography and Research Methods', 'Unit X (core)'],
    ['MHI-104', 'Political Structures in India', 'Units I–V, VII (state formation, Sultanate, Mughal, colonial state)'],
    ['MHI-105', 'History of Indian Economy-1 (to c. 1700)', 'Units I–V (agrarian economy, trade, land grants)'],
    ['MHI-106', 'Social Structures in India', 'Units I, III, VI, VIII (varna-jati, gender, religion)'],
    ['MHI-107', 'History of Indian Economy-2 (c. 1700–2000)', 'Units VIII–IX'],
    ['MHI-108', 'Environmental History', 'Units VIII–IX (forests, displacement); Paper 1 Unit 9'],
    ['MHI-109', 'Indian National Movement', 'Units VII–IX'],
    ['MHI-110', 'Urbanization in India', 'Units I (Harappa, second urbanization), V, VIII']
  ];
  var PLAT = [
    ['Anki', 'Spaced-repetition flashcards → Revise tab (Leitner boxes, daily new-card cap)'],
    ['Testbook / NTA mock interface', 'Timed tests with question palette, mark for review, no negative marking'],
    ['Duolingo', 'Streaks, freezes, daily quests, XP and ranks'],
    ['Quizlet', 'Match and order games (dynasties, timeline)'],
    ['Khan Academy', 'Mastery levels: new → learned → mastered'],
    ['Forest / Pomodoro apps', 'Focus timer that logs your study minutes']
  ];
  J.V.library = function (root) {
    root.appendChild(h('h1', null, 'Books & IGNOU map'));
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Your uploaded books → units'), BOOKS.map(function (b) { return h('div', { class: 'stack', style: { gap: '4px', paddingBottom: '10px', borderBottom: '1px solid var(--line)' } }, h('div', { class: 'row between' }, h('b', null, b[0]), h('span', { class: 'pill accent' }, b[1])), h('p', { class: 'small muted' }, b[2])); })));
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'IGNOU MA History (MAH) courses'), h('p', { class: 'small muted' }, 'Free on egyankosh.ac.in. Course codes follow the revised MAH structure; titles can differ slightly between sources.'),
      h('div', { class: 'scrollx' }, h('table', { class: 'tbl' }, h('tbody', null, IGNOU.map(function (r) { return h('tr', null, h('td', { class: 'mono' }, r[0]), h('td', null, r[1]), h('td', { class: 'small muted' }, r[2])); })))),
      h('a', { class: 'btn small', href: 'https://egyankosh.ac.in', target: '_blank', rel: 'noopener' }, 'Open eGyanKosh')));
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'From your Google Drive'), h('p', { class: 'small muted' }, 'Links open in Drive (only you and people you shared with can see them).'), h('ul', { class: 'plist' }, DRIVE.map(function (d) { return h('li', null, h('a', { href: d[1], target: '_blank', rel: 'noopener' }, d[0])); }))));
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Official links'), h('ul', { class: 'plist' },
      h('li', null, h('a', { href: 'https://ugcnet.nta.ac.in', target: '_blank', rel: 'noopener' }, 'NTA UGC-NET'), ' — information bulletin, question papers, answer keys, cut-offs'),
      h('li', null, h('a', { href: 'https://www.ugc.gov.in', target: '_blank', rel: 'noopener' }, 'UGC'), ' — syllabus, fellowship notices'),
      h('li', null, h('a', { href: 'https://shodhganga.inflibnet.ac.in', target: '_blank', rel: 'noopener' }, 'Shodhganga'), ' — Indian PhD theses (great for Unit X examples)'))));
    root.appendChild(h('section', { class: 'card' }, h('h2', null, 'Ideas borrowed from other platforms'), h('div', { class: 'scrollx' }, h('table', { class: 'tbl' }, h('tbody', null, PLAT.map(function (p) { return h('tr', null, h('td', null, h('b', null, p[0])), h('td', { class: 'small' }, p[1])); }))))));
  };

  /* ---------------- Tweaks ---------------- */
  J.V.tweaks = function (root) {
    var S = J.S(), p = S.prefs;
    function set(k, v) { p[k] = v; J.save(); U.applyPrefs(); U.route(); }
    root.appendChild(h('h1', null, 'Tweaks'));
    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'Look & feel'),
      h('p', { class: 'eyebrow' }, 'Theme'), U.seg([['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark'], ['sepia', 'Sepia'], ['contrast', 'High contrast']], p.skin, function (v) { set('skin', v); }, 'Theme'),
      h('p', { class: 'eyebrow' }, 'Reading font'), U.seg([['lexend', 'Lexend'], ['atkinson', 'Atkinson Hyperlegible'], ['system', 'System'], ['serif', 'Serif']], p.font, function (v) { set('font', v); }, 'Font'),
      h('p', { class: 'eyebrow' }, 'Text size: ' + p.size + ' px (small labels never go below 12 px)'),
      (function () {
        var r = h('input', { type: 'range', id: 'tweak-size', min: String(U.SIZE_MIN), max: String(U.SIZE_MAX), step: '1', value: String(p.size), 'aria-label': 'Text size in pixels', style: { width: '100%', accentColor: 'var(--accent)' } });
        r.addEventListener('input', function () { p.size = +r.value; J.save(); U.applyPrefs(); });
        r.addEventListener('change', function () { U.route(); });
        return h('div', { class: 'size-row' },
          h('button', { 'aria-label': 'Smaller text', onclick: function () { set('size', Math.max(U.SIZE_MIN, p.size - 1)); } }, 'A−'), r,
          h('button', { 'aria-label': 'Bigger text', onclick: function () { set('size', Math.min(U.SIZE_MAX, p.size + 1)); } }, 'A+'));
      })(),
      U.seg([[16, 'Normal'], [19, 'Large'], [22, 'Extra large'], [26, 'Huge']], p.size, function (v) { set('size', v); }, 'Text size presets'),
      h('p', { class: 'eyebrow' }, 'Line spacing'), U.seg([[1.5, 'Snug'], [1.65, 'Normal'], [1.85, 'Airy'], [2.05, 'Extra']], p.lh, function (v) { set('lh', v); }, 'Line spacing'),
      h('p', { class: 'eyebrow' }, 'Letter spacing'), U.seg([[0, 'Normal'], [0.02, 'Wide'], [0.05, 'Wider']], p.ls, function (v) { set('ls', v); }, 'Letter spacing'),
      h('p', { class: 'eyebrow' }, 'Motion'), U.seg([['auto', 'Follow system'], ['reduce', 'Reduce motion']], p.motion, function (v) { set('motion', v); }, 'Motion')));
    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'Focus'),
      toggle('Focus mode — hide streak, rank, quests and extra cards', p.focus, function (v) { set('focus', v); }),
      toggle('Open topics as one-card-at-a-time (recommended)', p.cardMode, function (v) { S.learnMode = v ? 'cards' : 'page'; set('cardMode', v); }),
      toggle('Sound effects for right/wrong answers', p.sound, function (v) { set('sound', v); }),
      h('p', { class: 'eyebrow' }, 'Encouragement language'), U.seg([['hinglish', 'Hinglish'], ['english', 'English']], p.voice, function (v) { set('voice', v); }, 'Language'),
      h('p', { class: 'eyebrow' }, 'Focus timer'), U.seg([[15, '15 min'], [25, '25 min'], [35, '35 min'], [45, '45 min'], [50, '50 min']], p.tFocus, function (v) { set('tFocus', v); }, 'Focus length'),
      h('p', { class: 'eyebrow' }, 'Break'), U.seg([[3, '3 min'], [5, '5 min'], [10, '10 min'], [15, '15 min']], p.tBreak, function (v) { set('tBreak', v); }, 'Break length')));
    var startIn = h('input', { class: 'input', type: 'date', id: 'start-date', value: S.profile.start });
    var daysIn = h('input', { class: 'input', type: 'number', id: 'plan-days', min: '30', max: '365', value: String(S.profile.days) });
    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'Plan & goals'),
      h('div', { class: 'grid2' }, h('label', { class: 'field', for: 'start-date' }, 'Plan start date', startIn), h('label', { class: 'field', for: 'plan-days' }, 'Plan length (days)', daysIn)),
      h('button', { class: 'btn primary', onclick: function () { if (!startIn.value) return; S.profile.start = startIn.value; S.profile.days = Math.max(30, Math.min(365, +daysIn.value || 120)); J.planRebuild(); J.save(true); U.toast('Plan rebuilt from ' + S.profile.start); U.route(); } }, 'Save & rebuild plan'),
      h('p', { class: 'eyebrow' }, 'New flashcards per day'), U.seg([[15, '15'], [25, '25'], [50, '50'], [100, '100'], [200, '200']], p.newCards || 25, function (v) { set('newCards', v); }, 'New cards per day'),
      h('p', { class: 'eyebrow' }, 'Daily question goal'), U.seg([[20, '20'], [40, '40'], [60, '60'], [100, '100'], [150, '150']], S.profile.goalQ, function (v) { S.profile.goalQ = v; J.save(); U.route(); }, 'Daily goal')));
    var exportTa = h('textarea', { class: 'input mono', id: 'export-data', readonly: true, style: { minHeight: '80px', fontSize: 'max(12px, .75rem)' } });
    var importTa = h('textarea', { class: 'input mono', id: 'import-data', placeholder: 'Paste a backup here', style: { minHeight: '80px', fontSize: 'max(12px, .75rem)' } });
    root.appendChild(h('section', { class: 'card' },
      h('h2', null, 'Your data'),
      h('p', { class: 'small muted' }, J.syncStatus ? 'Progress is saved in this browser and copied to your private claude.ai account storage (' + J.syncStatus + '). A manual backup is still a good idea.' : 'Progress is stored in this browser. Copy a backup now and then (e.g. into a note or email to yourself) — especially before clearing browser data or switching phones.'),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: function () { exportTa.value = J.exportData(); U.copy(exportTa.value); } }, 'Copy backup'), h('span', { class: 'small muted' }, Math.round(J.exportData().length / 1024) + ' KB')),
      exportTa,
      importTa,
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: function () { try { J.importData(importTa.value); U.applyPrefs(); U.toast('Backup restored'); U.go('today'); } catch (e) { U.toast(e.message || 'Could not read that backup.'); } } }, 'Restore backup'),
        h('input', { type: 'file', id: 'import-file', accept: '.json,.txt,application/json', 'aria-label': 'Restore from file', onchange: function (e) { var f = e.target.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { importTa.value = rd.result; }; rd.readAsText(f); } })),
      h('hr', { class: 'soft' }),
      h('button', { class: 'btn bad', onclick: function () { U.confirm('Reset everything?', 'All progress, XP, streaks, notes and PYQs in this browser will be deleted. Copy a backup first if unsure.', 'Delete all progress', function () { J.resetAll(); U.applyPrefs(); U.go('today'); }, true); } }, 'Reset all progress')));
  };
  function toggle(label, val, on) {
    return h('button', { class: 'check' + (val ? ' done' : ''), 'aria-pressed': String(!!val), onclick: function () { on(!val); }, style: { textDecoration: 'none' } }, h('span', { class: 'box' }, val ? U.icon('check', 16) : ''), h('span', { class: 'lbl', style: { textDecoration: 'none', color: 'var(--ink)' } }, label));
  }
})(window.JRF);
