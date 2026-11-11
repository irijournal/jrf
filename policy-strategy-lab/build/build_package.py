"""Generate the Word/PDF course documents that come from the day content.

Usage: python3 build_package.py [guide] [workbooks] [curriculum] [calendar] [activities] [spine] [md]
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
WEEKS = {1: "Define and structure", 2: "Situate and prioritise", 3: "Investigate and synthesise", 4: "Decide, deliver, defend"}
GATES = {5: 1, 10: 2, 15: 3, 19: 4}
WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
WORKBOOKS = [
    (1, "Problem Framing", [1, 2], None),
    (2, "Structure and Causes", [3, 4, 5], 1),
    (3, "Institutions and Actors", [6, 7], None),
    (4, "Priorities, Hypotheses and Workplan", [8, 9, 10], 2),
    (5, "Evidence", [11, 12, 13], None),
    (6, "Testing and Synthesis", [14, 15], 3),
    (7, "Options and Choice", [16, 17], None),
    (8, "Delivery Design", [18], None),
    (9, "Measurement and Pitch", [19], 4),
    (10, "Capstone", [20], None),
]


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
    """The deck's slide sequence, with notes, as the instructor sees it."""
    seq = [("Title slide", d.get("cover_notes", "")), ("Today", f"Session outcome: by the end of the session each participant has {d['outcome']}.")]
    for s in d["slides"]:
        t = s["type"]
        if t == "theory" and d["theory"]:
            who, work, q, gloss = d["theory"]
            seq.append(("A thinker for your case", f"{who}, {work}. {gloss} Put the question to the room: {q} Then ask each participant to answer it for their own case in one sentence."))
        elif t == "activity":
            a = d["activity"]
            seq.append((f"Activity: {a['name']}", a["facilitation"]))
        elif t == "workbook":
            w = d["worksheet"]
            seq.append((f"Your case: Worksheet {w['id']}", f"Individual application, about 20 minutes. Circulate and check that every participant is working on their own case. {w.get('guidance', '')}"))
        elif "title" in s:
            seq.append((s["title"], s.get("notes", "")))
    seq.append(("What to take away", "Ask two participants to state the takeaway they found least obvious, then close with the exit task: " + d["exit"]))
    seq.append(("Before the next session", d["independent"]))
    return seq


# ------------------------------------------------------------------ instructor guide
def instructor_week(week):
    days = [d for d in DAYS if d["week"] == week]
    md = [f"# Policy & Strategy Lab", f"## Instructor Guide, Week {week}: {WEEKS[week]}", ""]
    md.append(f"This guide covers Days {days[0]['day']} to {days[-1]['day']}. Each day follows the same pattern: an overview, the session plan, preparation, a slide-by-slide teaching narrative that matches the day's PowerPoint, likely misconceptions, discussion questions with what strong answers include, full facilitation notes for the activity, the workbook application, assessment, readings and the transition to the next day.")
    md.append("")
    md.append("The running case in every demonstration is Madhyapur, a stylised city. Its figures are illustrative and must never be presented as real data. Rules, schemes and institutions named alongside it (the Solid Waste Management Rules, 2016, Swachh Bharat Mission (Urban) 2.0, the Seventh and Twelfth Schedules) are real; check current details before teaching.")
    for d in days:
        md.append("\\newpage")
        md.append(f"## Day {d['day']}: {d['title']}")
        gate = f"Gate {GATES[d['day']]} is due today." if d["day"] in GATES else "No gate today."
        theory = f"{d['theory'][0]}: {d['theory'][2]}" if d["theory"] else "None today."
        md.append(table(["Item", "Detail"], [
            ["Week", f"{d['week']}: {WEEKS[d['week']]} ({WEEKDAYS[(d['day'] - 1) % 5]})"],
            ["Central question", d["question"]],
            ["Session outcome", f"Each participant has {d['outcome']}."],
            ["Competencies", ", ".join(d["competencies"])],
            ["Anchor tool", d["anchor"]],
            ["Supporting tools (demonstrated only)", "; ".join(d["supporting"])],
            ["Theory link", theory],
            ["Gate", gate],
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
        md.append("### Indian policy context")
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
    md = ["# Policy & Strategy Lab", f"## Workbook {num}: {title}", ""]
    md.append(table(["Participant", ""], [["Name", ""], ["Case (problem statement)", ""], ["Decision-making role and decision", ""], ["Pod", ""]]))
    md.append("### How to use this workbook")
    md.append("Each worksheet applies one day's anchor tool to your own case. Complete it during the session and finish it in your independent time. Keep earlier versions: revision is credited, so record what changed and why in the feedback box at the end of each worksheet. Tag every substantive claim in your Analyst's Ledger as fact, inference, assumption or hypothesis.")
    md.append("")
    comps = sorted({c for dn in days for c in BY[dn]["competencies"]})
    md.append(f"**Competencies practised in this workbook:** {', '.join(comps)}.")
    md.append("")
    if gate:
        md.append(f"**Gate {gate}.** This workbook ends with Gate {gate}. Submit the revised worksheets listed on the final worksheet, with a revision note and an AI-use disclosure.")
        md.append("")
    md.append("**Using AI tools.** You may use AI tools to suggest structures, rival explanations or improvements to your writing. You may not use AI output as evidence. Every fact, figure, citation and description of an institution must come from a source you have checked.")
    md.append("")
    for dn in days:
        d = BY[dn]
        w = d["worksheet"]
        md.append("\\newpage")
        md.append(f"### Worksheet {w['id']}: {w['title']}")
        md.append(f"*Day {dn}: {d['title']}. Anchor tool: {d['anchor']}.*")
        md.append("")
        md.append(f"**Purpose.** {w['purpose']}")
        md.append("")
        md.append("**In brief.**")
        md += [f"- {t}" for t in d["takeaways"]] + [""]
        md.append(f"**Worked example: Madhyapur (a stylised city; figures are illustrative).** {w['example']}")
        md.append("")
        md.append("**Instructions.**")
        md += [f"{i}. {s}" for i, s in enumerate(w["instructions"], 1)] + [""]
        for t in w["templates"]:
            md.append(f"#### {t['title']}")
            md.append(table(t["header"], template_rows(t)))
        if d["theory"]:
            md.append(f"**A thinker for your case: {d['theory'][0]}.** {d['theory'][2]}")
            md.append("")
            md.append("[[box: My answer, in one sentence | 1]]")
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
    md = ["# Policy & Strategy Lab", "## Detailed 20-Day Curriculum", ""]
    md.append("**Stage 4 of 12** · Version 1.0 · 10 November 2026")
    md.append("")
    md.append("This is the full teaching sequence. It follows the architecture approved in principle in the Course Concept Note: one anchor tool per day, learned to independent use; at most two or three supporting tools, demonstrated only; one theory link where it changes the analysis; one group activity; and one worksheet applied to each participant's own case. The seven-step process governs Weeks 1 to 3. Bardach and Patashnik's eightfold path, with Moore's strategic triangle, governs Week 4.")
    md.append("")
    md.append("## The programme at a glance")
    rows = []
    for d in DAYS:
        g = f" (Gate {GATES[d['day']]})" if d["day"] in GATES else ""
        rows.append([str(d["day"]), WEEKDAYS[(d["day"] - 1) % 5][:3], d["title"] + g, d["anchor"], d["worksheet"]["id"]])
    md.append(table(["Day", "Weekday", "Theme", "Anchor tool", "Worksheet"], rows))
    md.append("## Weekly rhythm")
    md.append(table(["Days", "Purpose"], [["Monday to Wednesday", "Learn and apply"], ["Thursday (Days 4, 9, 14, 19)", "Challenge: a longer simulation, battle or red team"], ["Friday (Days 5, 10, 15) and Day 19", "Gate submission and pod peer review"]]))
    md.append("## The default two-hour session")
    md.append(table(["Minutes", "Activity"], [["0 to 10", "Opening problem or retrieval question"], ["10 to 35", "Concept"], ["35 to 55", "Demonstration on the Madhyapur spine case"], ["55 to 90", "Group activity"], ["90 to 110", "Individual workbook application to own case"], ["110 to 120", "Debrief and exit task"]]))
    md.append("Gate days shorten the concept block to make room for 40 minutes of pod peer review. Days 11 to 13 run as research studios. Day 20 is given over to presentations and defence. Each day's exact plan is in its section below and in the Instructor Guide.")
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
            ["Anchor tool", d["anchor"]],
            ["Supporting tools", "; ".join(d["supporting"])],
            ["Theory link", theory],
            ["Indian policy example", d["india"]],
            ["Worked example (Madhyapur)", d["worksheet"]["example"]],
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
    md = ["# Policy & Strategy Lab", "## Course Calendar", ""]
    md.append("Four weeks, Monday to Friday, two hours of live teaching a day. Dates are left blank so that the calendar can be used for any start date. Independent work averages about 45 minutes on most days.")
    md.append("")
    md.append("## Before Day 1")
    md.append(table(["When", "Task", "Time"], [
        ["Seven days before Day 1", "Submit three candidate problems, one paragraph each", "1 hour"],
        ["Five days before Day 1", "Complete the entry diagnostic (Assessment Handbook)", "45 minutes"],
        ["Before Day 1", "Spreadsheet primer: sorting, filtering, a pivot table, a simple chart", "60 to 90 minutes"],
        ["Three days before Day 1", "Receive comments on candidate problems", ""],
    ]))
    for wk in range(1, 5):
        md.append(f"## Week {wk}: {WEEKS[wk]}")
        rows = []
        for d in [x for x in DAYS if x["week"] == wk]:
            sub = f"Gate {GATES[d['day']]}" if d["day"] in GATES else ("Case Approval Form" if d["day"] == 2 else "")
            if d["day"] == 20:
                sub = "Presentation and defence"
            rows.append([f"Day {d['day']}", WEEKDAYS[(d["day"] - 1) % 5], "", d["title"], d["outcome"][0].upper() + d["outcome"][1:], d["independent"], sub])
        md.append(table(["Day", "Weekday", "Date", "Topic", "In-session output", "Independent work (due next session)", "Submission"], rows))
    md.append("## After Day 20")
    md.append(table(["When", "Task"], [
        ["Within 72 hours of Day 20", "Client report, final deck, evidence register, reflection on the sealed answer, AI-use disclosure"],
        ["Final week", "Exit diagnostic (parallel version of the entry task)"],
        ["About two weeks after Day 20", "Final feedback and certificate decisions"],
    ]))
    md.append("## Gates at a glance")
    md.append(table(["Gate", "Day", "What is submitted", "Feedback returned"], [
        ["1", "Day 5", "Problem diagnostic: Worksheets 1.2, 2.1, 2.2, 2.3, revised", "By Day 7"],
        ["2", "Day 10", "Institutions, priorities, hypotheses and workplan: Worksheets 3.1 to 4.3", "By Day 12"],
        ["3", "Day 15", "Evidence, testing and the diagnostic memo: Worksheets 5.1 to 6.2", "By Day 17"],
        ["4", "Day 19", "Options, delivery, indicators and the draft deck: Worksheets 7.1 to 9.1", "Before Day 20"],
    ]))
    return "\n".join(md)


# ------------------------------------------------------------------ activity bank
def activities():
    md = ["# Policy & Strategy Lab", "## Activity and Simulation Bank", ""]
    md.append("Twenty activities, one per teaching day. The four Thursday challenges (Days 4, 9, 14 and 19) are longer simulations. Every activity uses a common case rather than participants' own cases, so that the whole room works on the same material and can compare. The case materials referred to here are in the Case Bank.")
    md.append("")
    md.append(table(["Day", "Activity", "Purpose", "Time", "Groups"], [[str(d["day"]), d["activity"]["name"], d["activity"]["purpose"], d["activity"]["time"], d["activity"]["group"]] for d in DAYS]))
    for d in DAYS:
        a = d["activity"]
        md.append("\\newpage")
        md.append(f"## Day {d['day']}. {a['name']}")
        md.append(table(["Element", "Detail"], [
            ["Purpose", a["purpose"]], ["Learning objective", f"Practises {d['anchor'].lower()} (competencies {', '.join(d['competencies'])})."],
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


# ------------------------------------------------------------------ spine case
def spine():
    intro = (DOCS / "spine-case-intro.md").read_text()
    md = [intro, "", "## The case, day by day", "", "These are the worked examples used in each worksheet. Together they form the exemplar portfolio participants can consult: one complete project, from a vague concern to a defended recommendation.", ""]
    for d in DAYS:
        md.append(f"### Day {d['day']}: {d['title']}")
        md.append(f"*Worksheet {d['worksheet']['id']}, {d['worksheet']['title']}. Anchor tool: {d['anchor']}.*")
        md.append("")
        md.append(d["worksheet"]["example"])
        md.append("")
    return "\n".join(md)


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
    want = set(sys.argv[1:]) or {"guide", "workbooks", "curriculum", "calendar", "activities", "spine", "md"}
    if "guide" in want:
        for wk in range(1, 5):
            md_to_docx(instructor_week(wk), PKG / "04 Instructor Guide" / f"Instructor Guide - Week {wk}.docx", f"Instructor Guide · Week {wk}")
            print("built instructor guide week", wk)
    if "workbooks" in want:
        for num, title, days, gate in WORKBOOKS:
            md_to_docx(workbook(num, title, days, gate), PKG / "05 Workbooks" / f"Workbook {num:02d} - {title}.docx", f"Workbook {num}: {title}")
            print("built workbook", num)
    if "curriculum" in want:
        md_to_docx(curriculum(), PKG / "02 Curriculum and Calendar" / "Detailed 20-Day Curriculum.docx", "Detailed 20-Day Curriculum")
        print("built curriculum")
    if "calendar" in want:
        md_to_docx(calendar(), PKG / "02 Curriculum and Calendar" / "Course Calendar.docx", "Course Calendar", landscape=True)
        print("built calendar")
    if "activities" in want:
        md_to_docx(activities(), PKG / "06 Activities and Cases" / "Activity and Simulation Bank.docx", "Activity and Simulation Bank")
        print("built activities")
    if "spine" in want and (DOCS / "spine-case-intro.md").exists():
        md_to_docx(spine(), PKG / "06 Activities and Cases" / "Spine Case - Madhyapur.docx", "Spine Case: Madhyapur")
        print("built spine case")
    if "md" in want:
        build_md_docs()


if __name__ == "__main__":
    main()
