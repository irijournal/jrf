# Policy & Strategy Lab: course development

Working files for a 20-teaching-day intensive in structured problem-solving for Indian public policy. This folder is separate from the JRF study app in the rest of the repository.

## Structure

| Folder | Contents | Stage |
|---|---|---|
| `00-course-bible/` | Concept note, learning outcomes, framework library, curriculum, assessment architecture, visual style guide, decision log | 1 to 4, 8 |
| `01-teaching-repository/` | PPT blueprints and decks, instructor notes, readings, worked examples, activity facilitation guides, source register | 7, 9, 10 |
| `02-student-repository/` | Calendar, workbooks, templates, Case Approval Form, activity briefs, rubrics, capstone guidelines | 5, 6, 11 |

Folders are created when their first file is written.

## Production stages

All twelve stages have a first complete version. The finished course is in `course-package/`, as Word, PDF and PowerPoint files.

| Stage | Deliverable | Where |
|---|---|---|
| 1 | Course Concept Note | course-package/00 Programme Documents |
| 2 | Learning Outcomes and Competency Framework | course-package/00 Programme Documents |
| 3 | Framework Library (44 tool cards) | course-package/01 Framework Library |
| 4 | Detailed 20-day curriculum | course-package/02 Curriculum and Calendar |
| 5 | Course calendar | course-package/02 Curriculum and Calendar |
| 6 | Ten workbooks | course-package/05 Workbooks |
| 7 | Activity bank, case bank, spine case | course-package/06 Activities and Cases |
| 8 | Assessment Handbook | course-package/07 Assessment |
| 9 | Twenty day-wise slide decks | course-package/03 Slides |
| 10 | Instructor Guide (four weeks) and reading list | course-package/04 Instructor Guide; 09 Participant Handbook and Readings |
| 11 | Capstone Guide | course-package/08 Capstone |
| 12 | Participant Handbook; quality checks | course-package/09 Participant Handbook and Readings |

## How the package is built

Day content lives in `content/days/dayNN.py`, one file per day: slides, teaching notes, activity and worksheet. Hand-written documents live in `content/docs/`. The scripts in `build/` turn them into files, so the slides, instructor guide, workbooks and curriculum always agree.

- `python3 build/build_package.py`: all Word and PDF documents
- `NODE_PATH=build/node_modules node build/day_decks.js build/out/days.json "course-package/03 Slides"`: all twenty decks (run `python3 build/export_days.py` first)

All decisions are recorded in `00-course-bible/decision-log.md`.
