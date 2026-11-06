# JRF Sadhana

An ADHD-friendly study app for **UGC-NET JRF — History (code 06)**, Paper 1 + Paper 2, built around a 4-month plan.
Everything runs in the browser; progress is saved on your device (and, in the hosted claude.ai version, to your private account storage).

## Open it

- **Offline / phone:** open `dist/index.html` (one self-contained file; fonts load when online).
- **Public link:** https://irijournal.github.io/jrf/ (GitHub Pages, served from the repo root; `.nojekyll` skips Jekyll). Progress there is saved per account in that browser — use Account → Move progress to carry it to another device.
- **From this repo:** open `index.html` (loads the source files directly) or serve the folder with any static server.

## What is inside

| Area | What you get |
|---|---|
| Today | One “do this next” action, today’s checklist from the plan, daily quests, streak, rank, fun fact |
| 4-month plan | 120 days: Build (≈12 weeks, weekly review days) → Revise (unit sprints + unit tests) → Mock (full mocks on alternate days). Re-plan if you fall behind |
| Learn | 89 topics (Paper 2 Units I–X + Paper 1 Units 1–10): pointers, diagram, mnemonics, fun facts, teach-back prompts, book & IGNOU references. Card mode (one point at a time), full page, recall (fill-the-blank) |
| Practice | 87,690 questions: 506 hand-written (incl. comprehension passages) + generated ones from checked fact tables (60 tables, ~1,600 rows) and the historiography bank. NTA formats: MCQ, List I–II matching, chronology, multi-statement, Statement I/II, Assertion–Reason, maths, DI. Practice mode or timed test with question palette |
| Mock | 150 questions / 3 hours (Paper 1: 50 incl. one passage and one DI set; History: 100) |
| Revise | Spaced repetition for topics (1, 3, 7, 16, 35, 60 days), flashcards (Leitner, 25 new/day), mistakes that come back |
| Your books | Load your own textbook PDFs (More → Your books). Every sentence with a date or a name becomes a fact card and a question, tagged to unit and topic, with coverage per book and chapter. Book text stays on your device (IndexedDB) and is never uploaded or bundled. |
| Historiography | 256 historians, 357 works (310 dated), 39 schools/trends, 66 concepts, famous lines and memory hooks. Schools map, searchable historian cards, works timeline with hide-the-author recall, ~11,000 drill questions (who wrote it, year, chronology, school, concept, quote, matching, statements) |
| Diagrams | 42 curated diagrams (trees, flows, cycles, comparison tables, cause → event → result) + all 89 topic diagrams; “Test me” blurs the details for recall |
| Accounts | Login with your name (and an optional 4–6 digit PIN). Each person gets separate progress on the device; switch from the avatar chip. On the claude.ai link progress also follows your claude.ai login. Elsewhere: Account → Move progress (file or code) |
| Google Calendar | One tap to add today / any plan day to Google Calendar (prefilled, no sign-in); whole plan as an .ics file; repeating daily study, night revision and Sunday mock reminders |
| Search | Press “/” anywhere: topics, historians, books, concepts, dynasties, rulers, events, fact tables, map places, diagrams |
| Dynasties | 64 dynasties / 397 rulers in order of reign, hide-the-names recall, order game, dynasty quiz |
| Timeline | ~330 dated events: list, story mode, chronology game |
| Maps | ~250 places in 13 layers + approximate rivers, map quiz |
| PYQs | Paste/upload papers → auto unit tagging, repeated questions & themes across years, unit weightage by year, PYQ practice, “PYQ match” badges on practice questions |
| Reports | Daily, weekly, monthly, overall: accuracy by unit and type, activity calendar, plan adherence, weak areas, finish-date projection, shareable summary |
| Tweaks | Theme (incl. sepia & high contrast), reading font (Lexend / Atkinson Hyperlegible / system / serif), size, spacing, reduce motion, focus mode, sounds, Hinglish/English, timer lengths, backup & restore |

Also: focus timer (logs minutes), brain-dump drawer, glossary of the ~90 syllabus terms, mnemonic library, exam guide, books/IGNOU/Drive map.

## About the questions

- Hand-written questions are tied to topics and include explanations.
- Generated questions come from the fact tables in `src/data/` (dynasties, events, pairs, places) and Paper 1 generators. Each has a stable id, so mistakes and spaced repetition work for all of them.
- `src/data/bookfacts.js` adds facts that a check of the textbooks found missing from the notes, written in our own words and marked “(from the books)”.
- **No PYQs are bundled and no years are invented.** Add official papers in the PYQ section; every year shown there is the label you typed.

## Develop

```
node tools/build.mjs     # writes dist/index.html and dist/artifact.html
```

Source layout: `src/data/*` (content), `src/js/*` (engine & views, loaded in numeric order), `src/css/app.css`.
Map outline: Natural Earth 1:50m land (public domain) via `world-atlas`, clipped and simplified, without modern borders.
