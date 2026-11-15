"""Generate the Word/PDF course documents for Spirit and Form from the day content.

Usage: python3 build_package.py [guide] [workbooks] [curriculum] [calendar] [activities] [companion] [md] [readings] [programme]
With no arguments, builds everything.
"""
import sys
from pathlib import Path

from docx_style import md_to_docx
from export_days import load_days

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "course-package"
DOCS = ROOT / "content" / "docs"
DAYS = load_days()
BY = {d["day"]: d for d in DAYS}
COURSE = "Spirit and Form"
NDAYS = 30
WEEKS = {1: "Foundations", 2: "The Renaissance in India", 3: "The Defence: the controversy and the spirit",
         4: "The Defence: art, literature, polity", 5: "Judgement and the first plays", 6: "The plays and the capstone"}
GATES = {5: 1, 10: 2, 15: 3, 20: 4, 25: 5}
WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
WORKBOOKS = [
    (1, "Foundations", [1, 2, 3, 4, 5], 1),
    (2, "The Renaissance in India", [6, 7, 8, 9, 10], 2),
    (3, "The Controversy and the Spirit", [11, 12, 13, 14, 15], 3),
    (4, "Art, Literature and Polity", [16, 17, 18, 19, 20], 4),
    (5, "Judgement and the First Plays", [21, 22, 23, 24, 25], 5),
    (6, "The Plays and the Capstone", [26, 27, 28, 29, 30], None),
]
TEXTS = "Texts are cited from The Complete Works of Sri Aurobindo (CWSA), Sri Aurobindo Ashram, Pondicherry: Volume 20 (The Renaissance in India with A Defence of Indian Culture) and Volumes 3 and 4 (Collected Plays and Stories). Page numbers vary between editions; cite essay or act and scene as well as page."


def esc(s):
    return str(s).replace("|", "/").replace("\n", " ")


def table(header, rows):
    out = ["| " + " | ".join(esc(h) for h in header) + " |", "|" + "---|" * len(header)]
    for r in rows:
        out.append("| " + " | ".join(esc(c) if str(c).strip() else " " for c in r) + " |")
    return "\n".join(out) + "\n"


def template_rows(t):
    if isinstance(t["rows"], int):
        return [[""] * len(t["header"]) for _ in range(t["rows"])]
    return t["rows"]


def slide_titles(d):
    seq = [("Title slide", d.get("cover_notes", "")), ("Today", f"Session outcome: by the end of the session each participant has {d['outcome']}.")]
    for s in d["slides"]:
        t = s["type"]
        if t == "theory" and d["theory"]:
            who, work, q, gloss = d["theory"]
            seq.append(("In conversation", f"{who}, {work}. {gloss} Put the question to the room: {q} Then ask each participant to answer it in one sentence, citing the text."))
        elif t == "activity":
            a = d["activity"]
            seq.append((f"Activity: {a['name']}", a["facilitation"]))
        elif t == "workbook":
            w = d["worksheet"]
            seq.append((f"Your reading: Worksheet {w['id']}", f"Individual application, about 20 minutes. Check that every participant works from the text, with references. {w.get('guidance', '')}"))
        elif "title" in s:
            seq.append((s["title"], s.get("notes", "")))
    seq.append(("What to take away", "Ask two participants to state the takeaway they found least obvious, then close with the exit task: " + d["exit"]))
    seq.append(("Before the next session", d["independent"]))
    return seq


def gate_text(day):
    return f"Gate {GATES[day]} is due today." if day in GATES else ("Capstone presentations and defence today." if day == NDAYS else "No gate today.")


# ------------------------------------------------------------------ instructor guide
def instructor_week(week):
    days = [d for d in DAYS if d["week"] == week]
    md = [f"# {COURSE}", f"## Instructor Guide, Week {week}: {WEEKS[week]}", ""]
    md.append(f"This guide covers Days {days[0]['day']} to {days[-1]['day']}. Each day follows the same pattern: an overview, the session plan, preparation, a slide-by-slide teaching narrative that matches the day's PowerPoint, likely misconceptions, discussion questions with what strong answers include, full facilitation notes for the activity, the workbook application, assessment, readings and the transition to the next day.")
    md.append("")
    md.append(TEXTS + " Each day names a passage of the day for close reading: choose the exact paragraphs in your edition before class, and check every quotation you put on a slide against the printed text.")
    for d in days:
        md.append("\\newpage")
        md.append(f"## Day {d['day']}: {d['title']}")
        theory = f"{d['theory'][0]}: {d['theory'][2]}" if d["theory"] else "None today."
        md.append(table(["Item", "Detail"], [
            ["Week", f"{d['week']}: {WEEKS[d['week']]} ({WEEKDAYS[(d['day'] - 1) % 5]})"],
            ["Central question", d["question"]],
            ["Session outcome", f"Each participant has {d['outcome']}."],
            ["Competencies", ", ".join(d["competencies"])],
            ["Anchor method", d["anchor"]],
            ["Supporting methods", "; ".join(d["supporting"])],
            ["In conversation", theory],
            ["Gate", gate_text(d["day"])],
        ]))
        md.append("### Learning objectives")
        md += [f"{i}. {o}" for i, o in enumerate(d["objectives"], 1)] + [""]
        md.append("### Session plan")
        start, rows = 0, []
        for label, mins in d["timing"]:
            rows.append([f"{start} to {start + mins}", label, f"{mins} minutes"])
            start += mins
        md.append(table(["Minutes", "Block", "Length"], rows))
        md.append("### Preparation and materials")
        mats = [f"The Day {d['day']} slide deck (03 Slides)", f"Worksheet {d['worksheet']['id']} in Workbook {d['worksheet']['id'].split('.')[0]}"] + d["activity"]["materials"]
        md += [f"- {m}" for m in mats] + [""]
        md.append("### Context")
        md.append(d["india"])
        md.append("")
        md.append("### Teaching narrative, slide by slide")
        for i, (title, notes) in enumerate(slide_titles(d), 1):
            md.append(f"**Slide {i}. {title}.** {notes}")
            md.append("")
        md.append("### Likely misconceptions")
        md.append(table(["Misconception", "How to respond"], d["misconceptions"]))
        md.append("### Discussion questions")
        md.append(table(["Question", "What strong answers include"], d["discussion"]))
        a = d["activity"]
        md.append(f"### Activity: {a['name']}")
        md.append(table(["Element", "Detail"], [
            ["Purpose", a["purpose"]], ["Scenario", a["scenario"]], ["Group size", a["group"]], ["Time", a["time"]],
            ["Materials", "; ".join(a["materials"])], ["Expected output", a["output"]],
        ]))
        md.append("**Steps.**")
        md += [f"{i}. {s}" for i, s in enumerate(a["steps"], 1)] + [""]
        md.append(f"**Facilitation.** {a['facilitation']}")
        md.append("")
        md.append("**Debrief questions.**")
        md += [f"- {q}" for q in a["debrief"]] + [""]
        md.append(table(["Evaluation criteria", "Common errors"], [[c, e] for c, e in zip(a["criteria"], a["errors"])]))
        md.append(f"**Extension for strong groups.** {a['extension']}")
        md.append("")
        w = d["worksheet"]
        md.append(f"### Workbook application: Worksheet {w['id']}, {w['title']}")
        md.append(f"{w['purpose']} {w.get('guidance', '')}")
        md.append("")
        md.append(f"**Hand in.** {w['submit']}")
        md.append("")
        md.append("### Independent work")
        md.append(d["independent"])
        md.append("")
        md.append("### Assessment")
        md.append(d["assess"])
        md.append("")
        md.append("### Readings")
        if d["readings"]["essential"]:
            md += [f"- Essential: {r}" for r in d["readings"]["essential"]]
        md += [f"- Optional: {r}" for r in d["readings"]["optional"]] + [""]
        md.append("### Close and transition")
        md.append(f"Exit task: {d['exit']} Transition: {d['next']}")
        md.append("")
    return "\n".join(md)


# ------------------------------------------------------------------ workbooks
def workbook(num, title, days, gate):
    md = [f"# {COURSE}", f"## Workbook {num}: {title}", ""]
    md.append(table(["Participant", ""], [["Name", ""], ["My capstone question (draft)", ""], ["Seminar group", ""], ["Edition of the texts I am using", ""]]))
    md.append("### How to use this workbook")
    md.append("Each worksheet applies one day's method to the text of the day, and links it to your own capstone question. Complete it in the session and finish it in your independent time. Keep earlier versions: revision is credited, so record what changed and why in the feedback box at the end of each worksheet. Tag every entry in your Reader's Ledger as text (what the passage says, with a reference), inference (what it implies), judgement (what you think, with a reason) or question.")
    md.append("")
    comps = sorted({c for dn in days for c in BY[dn]["competencies"]})
    md.append(f"**Competencies practised in this workbook:** {', '.join(comps)}.")
    md.append("")
    if gate:
        md.append(f"**Gate {gate}.** This workbook ends with Gate {gate}. Submit the piece named on the final worksheet, with a revision note and an AI-use disclosure.")
        md.append("")
    md.append("**Using AI tools.** You may use AI tools to test your structure or improve your prose. You may not use AI output as evidence of what Sri Aurobindo wrote: AI tools invent quotations and page numbers. Every quotation must be checked against the printed text, with essay or act and scene, and page.")
    md.append("")
    md.append(f"*{TEXTS}*")
    md.append("")
    for dn in days:
        d = BY[dn]
        w = d["worksheet"]
        md.append("\\newpage")
        md.append(f"### Worksheet {w['id']}: {w['title']}")
        md.append(f"*Day {dn}: {d['title']}. Method: {d['anchor']}.*")
        md.append("")
        md.append(f"**Purpose.** {w['purpose']}")
        md.append("")
        md.append("**In brief.**")
        md += [f"- {t}" for t in d["takeaways"]] + [""]
        md.append(f"**Model reading.** {w['example']}")
        md.append("")
        md.append("**Instructions.**")
        md += [f"{i}. {s}" for i, s in enumerate(w["instructions"], 1)] + [""]
        for t in w["templates"]:
            md.append(f"#### {t['title']}")
            md.append(table(t["header"], template_rows(t)))
        if d["theory"]:
            md.append(f"**In conversation: {d['theory'][0]}.** {d['theory'][2]}")
            md.append("")
            md.append("[[box: My answer, in one sentence, with a reference | 1]]")
        md.append("**Reflection.**")
        md += [f"{i}. {q}" for i, q in enumerate(w["reflection"], 1)] + [""]
        md.append("[[box: My reflections | 3]]")
        md.append("**Quality checklist.**")
        md += [f"- ☐ {c}" for c in w["checklist"]] + [""]
        md.append(f"**Hand in.** {w['submit']}")
        md.append("")
        md.append(f"**Before the next session.** {d['independent']}")
        md.append("")
        md.append("#### Feedback and revision")
        md.append(table(["Feedback received (peer or instructor)", "What I changed, and why"], [["", ""], ["", ""]]))
    return "\n".join(md)


# ------------------------------------------------------------------ curriculum
def curriculum():
    md = [f"# {COURSE}", "## Detailed 30-Day Curriculum", ""]
    md.append("Version 1.0 · November 2026")
    md.append("")
    md.append("This is the full teaching sequence for a six-week seminar on Sri Aurobindo's The Renaissance in India, A Defence of Indian Culture and his five complete plays. Each day has one anchor method, learned to independent use; one passage of the day read closely together; a voice in conversation with the text; one group activity; and one worksheet that links the day's reading to each participant's own capstone question.")
    md.append("")
    md.append("## The programme at a glance")
    rows = []
    for d in DAYS:
        g = f" (Gate {GATES[d['day']]})" if d["day"] in GATES else (" (Capstone)" if d["day"] == NDAYS else "")
        rows.append([str(d["day"]), WEEKDAYS[(d["day"] - 1) % 5][:3], d["title"] + g, d["anchor"], d["worksheet"]["id"]])
    md.append(table(["Day", "Weekday", "Theme", "Anchor method", "Worksheet"], rows))
    md.append("## Weekly rhythm")
    md.append(table(["Days", "Purpose"], [["Monday to Thursday", "Read, discuss and apply"], ["Friday (Days 5, 10, 15, 20, 25)", "Gate submission and peer review in seminar groups"], ["Days 28 to 30", "Performance studio, capstone studio, and presentations with staged readings"]]))
    md.append("## The default two-hour session")
    md.append(table(["Minutes", "Activity"], [["0 to 10", "Opening question"], ["10 to 35", "Concept and context"], ["35 to 55", "Close reading: the passage of the day"], ["55 to 90", "Group activity"], ["90 to 110", "Reader's Ledger: worksheet linked to own capstone question"], ["110 to 120", "Debrief and exit task"]]))
    md.append("Gate days shorten the concept block to make room for 40 minutes of peer review. Days 23 to 28 include read-throughs of scenes from the plays. Day 30 is given over to presentations, defence and staged readings.")
    md.append("")
    for d in DAYS:
        md.append("\\newpage")
        md.append(f"## Day {d['day']}: {d['title']}")
        md.append(f"*Week {d['week']}, {WEEKS[d['week']]} · {WEEKDAYS[(d['day'] - 1) % 5]}*")
        md.append("")
        md.append(f"**Central question.** {d['question']}")
        md.append("")
        md.append(f"**Expected learning output.** By the end of the session, each participant has {d['outcome']}.")
        md.append("")
        md.append("**Learning objectives.**")
        md += [f"{i}. {o}" for i, o in enumerate(d["objectives"], 1)] + [""]
        theory = f"{d['theory'][0]} ({d['theory'][1]}): {d['theory'][2]}" if d["theory"] else "None today."
        md.append(table(["Element", "Content"], [
            ["Competencies", ", ".join(d["competencies"])],
            ["Key concepts", "; ".join(d["concepts"])],
            ["Anchor method", d["anchor"]],
            ["Supporting methods", "; ".join(d["supporting"])],
            ["In conversation", theory],
            ["Context", d["india"]],
            ["Model reading", d["worksheet"]["example"]],
            ["Live group activity", f"{d['activity']['name']}: {d['activity']['purpose']} ({d['activity']['time']})"],
            ["Individual workbook exercise", f"Worksheet {d['worksheet']['id']}, {d['worksheet']['title']}"],
            ["Submission", d["worksheet"]["submit"]],
            ["Assessment", d["assess"]],
            ["Independent work", d["independent"]],
            ["Essential reading", "; ".join(d["readings"]["essential"]) or "None set."],
            ["Optional reading", "; ".join(d["readings"]["optional"]) or "None."],
        ]))
        start, rows = 0, []
        for label, mins in d["timing"]:
            rows.append([f"{start} to {start + mins}", label])
            start += mins
        md.append("**Session plan.**")
        md.append(table(["Minutes", "Block"], rows))
    return "\n".join(md)


# ------------------------------------------------------------------ calendar
def calendar():
    md = [f"# {COURSE}", "## Course Calendar", ""]
    md.append("Six weeks, Monday to Friday, two hours of live teaching a day. Dates are left blank so that the calendar can be used for any start date. Independent reading averages about 60 minutes on most days.")
    md.append("")
    md.append("## Before Day 1")
    md.append(table(["When", "Task", "Time"], [
        ["Seven days before Day 1", "Obtain the texts: CWSA Volume 20 and Volumes 3 and 4, or the free editions on the Sri Aurobindo Ashram website", "30 minutes"],
        ["Five days before Day 1", "Complete the entry diagnostic: a short passage with three questions (Assessment Handbook)", "45 minutes"],
        ["Before Day 1", "Read 'The Renaissance in India', essay I, once through, without notes", "45 minutes"],
    ]))
    for wk in range(1, 7):
        md.append(f"## Week {wk}: {WEEKS[wk]}")
        rows = []
        for d in [x for x in DAYS if x["week"] == wk]:
            sub = f"Gate {GATES[d['day']]}" if d["day"] in GATES else ("Presentation, defence and staged reading" if d["day"] == NDAYS else "")
            rows.append([f"Day {d['day']}", WEEKDAYS[(d["day"] - 1) % 5], "", d["title"], d["outcome"][0].upper() + d["outcome"][1:], d["independent"], sub])
        md.append(table(["Day", "Weekday", "Date", "Topic", "In-session output", "Independent work (due next session)", "Submission"], rows))
    md.append("## After Day 30")
    md.append(table(["When", "Task"], [
        ["Within 72 hours of Day 30", "Final capstone essay, revised after the defence, with a reflection and an AI-use disclosure"],
        ["Final week", "Exit diagnostic (parallel version of the entry task)"],
        ["About two weeks after Day 30", "Final feedback and certificate decisions"],
    ]))
    md.append("## Gates at a glance")
    md.append(table(["Gate", "Day", "What is submitted", "Feedback returned"], [
        ["1", "Day 5", "Reading journal, Week 1, and a first capstone question with a concept card set (Worksheets 1.1 to 1.5)", "By Day 7"],
        ["2", "Day 10", "Short essay, 1,200 words: reconstruct and assess one argument from The Renaissance in India", "By Day 12"],
        ["3", "Day 15", "Argument map and response: one charge by Archer, Sri Aurobindo's reply, and a critic's counter-argument", "By Day 17"],
        ["4", "Day 20", "Comparative essay, 1,500 words, on art, literature or polity in the Defence", "By Day 22"],
        ["5", "Day 25", "Close analysis of one scene from Perseus the Deliverer, Vasavadutta or Rodogune, 1,200 words", "By Day 27"],
        ["Capstone", "Day 30", "Capstone essay draft, presentation, defence and staged reading", "Final within 72 hours"],
    ]))
    return "\n".join(md)


# ------------------------------------------------------------------ activity bank
def activities():
    md = [f"# {COURSE}", "## Activity and Seminar Bank", ""]
    md.append("Thirty activities, one per teaching day. Every activity works on a shared passage or scene, so that the whole room reads the same text and can compare readings. Passages are named by essay or act and scene; the instructor chooses the exact paragraphs in the edition used.")
    md.append("")
    md.append(table(["Day", "Activity", "Purpose", "Time", "Groups"], [[str(d["day"]), d["activity"]["name"], d["activity"]["purpose"], d["activity"]["time"], d["activity"]["group"]] for d in DAYS]))
    for d in DAYS:
        a = d["activity"]
        md.append("\\newpage")
        md.append(f"## Day {d['day']}. {a['name']}")
        md.append(table(["Element", "Detail"], [
            ["Purpose", a["purpose"]], ["Learning objective", f"Practises {d['anchor'][0].lower() + d['anchor'][1:]} (competencies {', '.join(d['competencies'])})."],
            ["Scenario", a["scenario"]], ["Group size", a["group"]], ["Time", a["time"]],
            ["Materials", "; ".join(a["materials"])], ["Expected output", a["output"]],
        ]))
        md.append("**Instructions.**")
        md += [f"{i}. {s}" for i, s in enumerate(a["steps"], 1)] + [""]
        md.append(f"**Facilitator notes.** {a['facilitation']}")
        md.append("")
        md.append("**Debrief questions.**")
        md += [f"- {q}" for q in a["debrief"]] + [""]
        md.append("**Evaluation criteria.**")
        md += [f"- {c}" for c in a["criteria"]] + [""]
        md.append("**Common errors.**")
        md += [f"- {e}" for e in a["errors"]] + [""]
        md.append(f"**Suggested extension.** {a['extension']}")
        md.append("")
    return "\n".join(md)


# ------------------------------------------------------------------ text companion (model readings)
def companion():
    intro = (DOCS / "companion-intro.md").read_text()
    md = [intro, "", "## Model readings, day by day", "", "These are the model readings used in each worksheet: how a careful reader works through the day's text. Together they form an exemplar reading journal participants can consult.", ""]
    for d in DAYS:
        md.append(f"### Day {d['day']}: {d['title']}")
        md.append(f"*Worksheet {d['worksheet']['id']}, {d['worksheet']['title']}. Method: {d['anchor']}.*")
        md.append("")
        md.append(d["worksheet"]["example"])
        md.append("")
    return "\n".join(md)


# ------------------------------------------------------------------ reading list
def readings():
    md = [f"# {COURSE}", "## Reading List", ""]
    md.append("Readings are attached to specific days. The essential reading is always a primary text by Sri Aurobindo, read in full, with a question to bring to class: the question on that day's 'In conversation' slide. Optional readings set the text in conversation with other voices. Instructor background reading is in the bibliography.")
    md.append("")
    md.append(TEXTS)
    md.append("")
    md.append("## Readings by day")
    rows = []
    for d in DAYS:
        ess = "; ".join(d["readings"]["essential"]) or "None set"
        opt = "; ".join(d["readings"]["optional"]) or "None"
        q = d["theory"][2] if d["theory"] else ""
        rows.append([str(d["day"]), d["title"], ess, opt, q])
    md.append(table(["Day", "Theme", "Essential", "Optional", "Question to bring"], rows))
    md.append((DOCS / "reading-sources.md").read_text())
    return "\n".join(md)


def programme():
    bible = ROOT / "00-course-bible"
    out = PKG / "00 Programme Documents"
    md_to_docx((bible / "01-course-concept-note.md").read_text(), out / "01 Course Concept Note.docx", "Course Concept Note")
    md_to_docx((bible / "02-learning-outcomes-and-competencies.md").read_text(), out / "02 Learning Outcomes and Competency Framework.docx", "Learning Outcomes and Competency Framework")


def build_md_docs():
    """Hand-written documents in content/docs, each with a front-matter line: <!-- out: folder/name | footer | landscape -->"""
    for f in sorted(DOCS.glob("*.md")):
        text = f.read_text()
        first = text.splitlines()[0]
        if not first.startswith("<!-- out:"):
            continue
        spec = first[len("<!-- out:"):].rstrip("-> ").strip()
        parts = [p.strip() for p in spec.split("|")]
        out, footer = parts[0], parts[1]
        landscape = len(parts) > 2 and parts[2] == "landscape"
        md_to_docx("\n".join(text.splitlines()[1:]), PKG / f"{out}.docx", footer, landscape=landscape)
        print("built", out)


def main():
    want = set(sys.argv[1:]) or {"guide", "workbooks", "curriculum", "calendar", "activities", "companion", "md", "readings", "programme"}
    if "guide" in want:
        for wk in range(1, 7):
            md_to_docx(instructor_week(wk), PKG / "04 Instructor Guide" / f"Instructor Guide - Week {wk}.docx", f"Instructor Guide · Week {wk}")
            print("built instructor guide week", wk)
    if "workbooks" in want:
        for num, title, days, gate in WORKBOOKS:
            md_to_docx(workbook(num, title, days, gate), PKG / "05 Workbooks" / f"Workbook {num:02d} - {title}.docx", f"Workbook {num}: {title}")
            print("built workbook", num)
    if "curriculum" in want:
        md_to_docx(curriculum(), PKG / "02 Curriculum and Calendar" / "Detailed 30-Day Curriculum.docx", "Detailed 30-Day Curriculum")
        print("built curriculum")
    if "calendar" in want:
        md_to_docx(calendar(), PKG / "02 Curriculum and Calendar" / "Course Calendar.docx", "Course Calendar", landscape=True)
        print("built calendar")
    if "activities" in want:
        md_to_docx(activities(), PKG / "06 Activities and Performance" / "Activity and Seminar Bank.docx", "Activity and Seminar Bank")
        print("built activities")
    if "companion" in want and (DOCS / "companion-intro.md").exists():
        md_to_docx(companion(), PKG / "01 Text Companion" / "Model Readings.docx", "Model Readings")
        print("built model readings")
    if "md" in want:
        build_md_docs()
    if "readings" in want:
        md_to_docx(readings(), PKG / "09 Participant Handbook and Readings" / "Reading List.docx", "Reading List", landscape=True)
        print("built reading list")
    if "programme" in want:
        programme()
        print("built programme documents")


if __name__ == "__main__":
    main()
