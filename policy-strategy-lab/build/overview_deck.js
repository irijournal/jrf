// Course design overview deck for the Policy & Strategy Lab (Stages 1 and 2)
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/f218a6be-6141-4f23-a687-cb058014c616_1248a252-a28d-4416-8d9c-de5f5eefcbdb/pptx/scripts/apply_theme.js");

const OUT = process.argv[2] || "deck.pptx";

const THEME = {
  name: "Policy and Strategy Lab",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: {
    dk1: "202B36", lt1: "FFFFFF", dk2: "123B63", lt2: "EAF1F7",
    accent1: "2F5F8F", accent2: "4D82B8", accent3: "123B63", accent4: "667482",
    accent5: "D7E0E8", accent6: "9DB9D5", hlink: "2F5F8F", folHlink: "667482",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Policy and Strategy Lab: course design overview";
pres.author = "Policy and Strategy Lab course team";
pres.company = "Policy and Strategy Lab";

const C = pres.SchemeColor;
const NAVY = C.text2, TEXT = C.text1, WHITE = C.background1, PALE = C.background2;
const BLUE = C.accent1, MID = C.accent2, GREY = C.accent4, RULE = C.accent5, LIGHT = C.accent6;
const RULE_HEX = "D7E0E8";

const L = 0.75, R = 12.583, W = R - L; // content frame
const FOOT = "Policy & Strategy Lab · Course design overview · Stages 1 and 2";

// ------------------------------------------------------------------ layouts
pres.defineSlideMaster({
  title: "TITLE",
  background: { color: "FFFFFF" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: L, y: 2.35, w: 11.5, h: 1.1, fontSize: 44, bold: true, color: NAVY, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: L, y: 3.5, w: 11.0, h: 0.9, fontSize: 20, color: BLUE, valign: "top", align: "left", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "SECTION",
  background: { color: "FFFFFF" },
  objects: [
    { placeholder: { options: { name: "number", type: "body", x: L, y: 1.75, w: 4, h: 1.2, fontSize: 72, bold: true, color: MID, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: L, y: 3.1, w: 11.5, h: 0.9, fontSize: 36, bold: true, color: NAVY, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: L, y: 4.05, w: 10.5, h: 0.8, fontSize: 18, color: GREY, valign: "top", align: "left", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: L, y: 6.95, w: 9, h: 0.3, fontSize: 10, color: GREY, margin: 0 } } },
  ],
  slideNumber: { x: 11.983, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: "667482", align: "right", margin: 0 },
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: "FFFFFF" },
  margin: [0.5, 0.75, 0.6, 0.75],
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: L, y: 0.45, w: W, h: 0.95, fontSize: 28, bold: true, color: NAVY, valign: "top", align: "left", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: L, y: 6.95, w: 9, h: 0.3, fontSize: 10, color: GREY, margin: 0 } } },
  ],
  slideNumber: { x: 11.983, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: "667482", align: "right", margin: 0 },
});

// ------------------------------------------------------------------ helpers
let n = 0;
function name(prefix) { n += 1; return `${prefix}-${n}`; }

function txt(slide, text, o) {
  slide.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: "top", color: TEXT, fontSize: 14, objectName: name("text") }, o));
}

function dot(slide, x, y, d, fill, label, o = {}) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: d, h: d, fill: { color: fill },
    line: o.line ? { color: o.line, width: 1 } : { type: "none" },
    objectName: name("dot"),
  });
  if (label !== undefined && label !== null) {
    slide.addText(String(label), {
      x, y, w: d, h: d, align: "center", valign: "middle", margin: 0, isTextBox: true,
      fontSize: o.fontSize || 12, bold: true, color: o.textColor || WHITE, objectName: name("dotlabel"),
    });
  }
}

function rule(slide, x, y, w, h) {
  slide.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: RULE, width: 0.75 }, objectName: name("rule") });
}

function card(slide, x, y, w, h, fill = PALE) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { type: "none" }, objectName: name("card") });
}

const GATES = { 5: "G1", 10: "G2", 15: "G3", 19: "G4" };
function dayDots(slide, xs, y, d, showLabels) {
  // xs: array of 20 x positions
  for (let i = 1; i <= 20; i++) {
    const x = xs[i - 1];
    if (GATES[i]) dot(slide, x, y, d, NAVY);
    else if (i === 20) dot(slide, x, y, d, BLUE);
    else dot(slide, x, y, d, WHITE, null, { line: LIGHT });
    if (showLabels && GATES[i]) {
      const lab = `Day ${i}`;
      txt(slide, lab, { x: x - 0.6, y: y + d + 0.08, w: 1.2 + d, h: 0.3, fontSize: 11, color: GREY, align: "center" });
    }
  }
}

function contentSlide(title, section, notes) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}

const tableBorder = () => [
  { type: "solid", pt: 0.75, color: RULE_HEX }, { type: "none" },
  { type: "solid", pt: 0.75, color: RULE_HEX }, { type: "none" },
];

function table(slide, header, rows, colW, o = {}) {
  const fs = o.fontSize || 14;
  const head = header.map((h) => ({ text: h, options: { bold: true, color: NAVY, fill: { color: PALE }, border: tableBorder(), fontSize: fs } }));
  const body = rows.map((r) => r.cells.map((c, j) => ({
    text: c,
    options: {
      fontSize: fs, color: TEXT, border: tableBorder(),
      bold: (j === 0 && r.strongFirst) || false,
      fill: r.highlight ? { color: PALE } : undefined,
    },
  })));
  slide.addTable([head, ...body], {
    x: L, y: o.y || 1.6, w: W, colW, rowH: o.rowH || 0.42, margin: [0.04, 0.08, 0.04, 0.08],
    valign: "middle", objectName: name("table"),
  });
}

// ================================================================== SLIDES
// 1. Title
pres.addSection({ title: "Opening" });
{
  const s = pres.addSlide({ masterName: "TITLE", sectionTitle: "Opening" });
  txt(s, "Course design overview · Stages 1 and 2", { x: L, y: 1.6, w: 8, h: 0.35, fontSize: 14, color: BLUE, bold: true });
  s.addText("Policy & Strategy Lab", { placeholder: "title" });
  s.addText("A 20-day intensive in structured problem-solving for Indian public policy", { placeholder: "body" });
  const xs = Array.from({ length: 20 }, (_, i) => L + i * 0.42);
  dayDots(s, xs, 5.0, 0.2, false);
  txt(s, "Twenty teaching days. Filled dots mark the four feedback gates; the last is the defence.", { x: L, y: 5.35, w: 9, h: 0.35, fontSize: 12, color: GREY });
  txt(s, "Draft for review · 10 November 2026", { x: L, y: 6.85, w: 6, h: 0.3, fontSize: 12, color: GREY });
  s.addNotes("This deck summarises the Course Concept Note (Stage 1) and the Learning Outcomes and Competency Framework (Stage 2). Full detail is in the Word and PDF documents.");
}

// 2. At a glance
{
  const s = contentSlide("One real problem, from a vague concern to a defended recommendation", "Opening",
    "The core proposition: each participant owns one Indian policy case for twenty days. The cohort shares one method; the cases differ.");
  const stats = [
    ["20", "teaching days, Monday to Friday over four weeks"],
    ["40", "live hours, two a day, mostly spent producing work"],
    ["1", "case per participant, carried from start to finish"],
    ["4", "feedback gates before the final defence"],
  ];
  const cw = (W - 3 * 0.35) / 4;
  stats.forEach(([num, lab], i) => {
    const x = L + i * (cw + 0.35);
    txt(s, num, { x, y: 1.75, w: cw, h: 1.1, fontSize: 60, bold: true, color: NAVY });
    txt(s, lab, { x, y: 2.95, w: cw - 0.2, h: 0.9, fontSize: 15, color: TEXT });
  });
  rule(s, L, 4.3, W, 0);
  txt(s, [
    { text: "Unlike academic policy courses, ", options: { color: TEXT } },
    { text: "it ends in a decision and an implementation plan, not an essay. ", options: { bold: true, color: NAVY } },
    { text: "Unlike consulting bootcamps, ", options: { color: TEXT } },
    { text: "it treats the state as institutions with divided jurisdiction, contested goals and frontline discretion, not as a firm.", options: { bold: true, color: NAVY } },
  ], { x: L, y: 4.6, w: 11.2, h: 1.2, fontSize: 18 });
  txt(s, "The promise is calibrated: a capable junior analyst on a scoped problem, not a consultant or a sector expert.", { x: L, y: 6.0, w: 11.2, h: 0.4, fontSize: 14, color: GREY });
}

// 3. Three gaps
{
  const s = contentSlide("Three gaps the programme exists to close", "Opening",
    "Each gap maps to part of the design: structure (Weeks 1 to 3), state realities (Weeks 2 and 4), and implementation (Week 4).");
  const gaps = [
    ["Description to decision", "Graduates can describe and critique a policy problem but struggle to advise someone who must act: what to do, at what cost, and how anyone would know it worked."],
    ["Consulting transfer", "Consulting tools teach structure but treat the client as a firm. Public problems have contested goals, divided jurisdiction, fixed budgets and frontline discretion."],
    ["Implementation", "Indian policy debate often stops at design. Much failure happens further down the delivery chain, where a capable centre cannot reliably direct its field agencies."],
  ];
  const cw = (W - 2 * 0.5) / 3;
  gaps.forEach(([h, b], i) => {
    const x = L + i * (cw + 0.5);
    dot(s, x, 1.75, 0.5, NAVY, i + 1, { fontSize: 16 });
    txt(s, h, { x, y: 2.45, w: cw, h: 0.45, fontSize: 20, bold: true, color: NAVY });
    txt(s, b, { x, y: 3.0, w: cw - 0.1, h: 2.4, fontSize: 16 });
    if (i > 0) rule(s, x - 0.25, 1.75, 0, 3.6);
  });
  txt(s, "The premise that these skills are under-taught is tested through a paired entry and exit diagnostic, not assumed.", { x: L, y: 5.95, w: 11.2, h: 0.4, fontSize: 13, color: GREY });
}

// 4. Seven principles
{
  const s = contentSlide("Seven principles govern every design decision", "Opening",
    "When a later design choice is contested, these principles are the reference point.");
  const ps = [
    ["Frameworks are instruments of reasoning", "Each tool is taught by the question it answers, its inputs, its output and its misuses."],
    ["One problem, carried all the way", "Every workbook builds part of the final report. Nothing is done once and thrown away."],
    ["An early answer, tested hard", "A working answer is sealed on Day 3. The rest of the programme tries to break it."],
    ["Decisions, not descriptions", "Every case names a decision-making role and the decision it faces."],
    ["The state is not a firm", "Every recommendation is tested for jurisdiction, money and frontline delivery."],
    ["Make, then challenge, then revise", "Every session produces an artefact; every week includes structured peer challenge."],
    ["Distribution is an analytical test", "Who benefits, who pays and who is excluded have their own rows in the templates."],
  ];
  const cw = (W - 0.6) / 2;
  ps.forEach(([h, b], i) => {
    const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
    const x = L + col * (cw + 0.6), y = 1.7 + row * 1.2;
    dot(s, x, y + 0.02, 0.36, NAVY, i + 1, { fontSize: 12 });
    txt(s, h, { x: x + 0.55, y, w: cw - 0.55, h: 0.35, fontSize: 17, bold: true, color: NAVY });
    txt(s, b, { x: x + 0.55, y: y + 0.4, w: cw - 0.55, h: 0.65, fontSize: 14 });
  });
}

// 5. Section divider
pres.addSection({ title: "How the programme is built" });
{
  const s = pres.addSlide({ masterName: "SECTION", sectionTitle: "How the programme is built" });
  s.addText("01", { placeholder: "number" });
  s.addText("How the programme is built", { placeholder: "title" });
  s.addText("One method, four weeks, one case carried from start to finish", { placeholder: "body" });
}

// 6. Seven steps vs eightfold path
{
  const s = contentSlide("Consulting method diagnoses; policy analysis chooses", "How the programme is built",
    "Side by side, the two methods divide the labour. The Lab uses the seven steps for Weeks 1 to 3 and the eightfold path, with Moore's strategic triangle, for Week 4.");
  txt(s, "The Lab uses each where it is strongest: the seven steps govern Weeks 1 to 3, the eightfold path governs Week 4.", { x: L, y: 1.35, w: W, h: 0.4, fontSize: 15, color: GREY });
  const cols = [
    { head: "McKinsey seven steps", sub: "Six of seven steps build the diagnosis", x: L,
      steps: ["Define the problem", "Disaggregate the issues", "Prioritise", "Build a workplan", "Conduct analyses", "Synthesise findings", "Communicate"],
      strong: [1, 2, 3, 4, 5, 6] },
    { head: "Bardach's eightfold path", sub: "Six of eight steps build and choose between options", x: L + W / 2 + 0.3,
      steps: ["Define the problem", "Assemble some evidence", "Construct the alternatives", "Select the criteria", "Project the outcomes", "Confront the trade-offs", "Decide", "Tell your story"],
      strong: [3, 4, 5, 6, 7, 8] },
  ];
  cols.forEach((c) => {
    txt(s, c.head, { x: c.x, y: 1.95, w: 5.5, h: 0.4, fontSize: 20, bold: true, color: NAVY });
    txt(s, c.sub, { x: c.x, y: 2.38, w: 5.5, h: 0.35, fontSize: 14, color: BLUE });
    c.steps.forEach((st, i) => {
      const y = 2.9 + i * 0.47;
      const strong = c.strong.includes(i + 1);
      dot(s, c.x, y, 0.32, strong ? NAVY : WHITE, i + 1, { line: strong ? null : LIGHT, textColor: strong ? WHITE : BLUE, fontSize: 11 });
      txt(s, st, { x: c.x + 0.5, y: y + 0.02, w: 4.8, h: 0.3, fontSize: 15, color: strong ? TEXT : GREY });
    });
  });
  rule(s, L + W / 2, 1.95, 0, 4.7);
}

// 7. Four weeks
{
  const s = contentSlide("Four weeks, one case, carried all the way", "How the programme is built",
    "Each week ends in a gate: a submission that receives detailed feedback. Thursdays carry the main simulation; Fridays carry the gates.");
  const weeks = [
    ["Week 1", "Define and structure", "What exactly is the problem, and for whom?", "Problem diagnostic", "Gate 1 · Day 5"],
    ["Week 2", "Situate and prioritise", "Who can act, with what money, and what should we test?", "Research plan", "Gate 2 · Day 10"],
    ["Week 3", "Investigate and synthesise", "What does the published evidence establish?", "Diagnostic memo", "Gate 3 · Day 15"],
    ["Week 4", "Decide, deliver, defend", "What should be done, by whom, and how will we know?", "Deck and defence", "Gate 4 · Day 19; panel Day 20"],
  ];
  const gap = 0.3, cw = (W - 3 * gap) / 4;
  const xs = [];
  weeks.forEach(([wk, h, q, out, gate], i) => {
    const x = L + i * (cw + gap);
    card(s, x, 1.6, cw, 3.75);
    txt(s, wk, { x: x + 0.2, y: 1.8, w: cw - 0.4, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    txt(s, h, { x: x + 0.2, y: 2.15, w: cw - 0.4, h: 0.75, fontSize: 19, bold: true, color: NAVY });
    txt(s, q, { x: x + 0.2, y: 2.95, w: cw - 0.4, h: 1.0, fontSize: 14, italic: true });
    txt(s, "Output", { x: x + 0.2, y: 4.1, w: cw - 0.4, h: 0.25, fontSize: 11, color: GREY });
    txt(s, out, { x: x + 0.2, y: 4.35, w: cw - 0.4, h: 0.35, fontSize: 15, bold: true, color: TEXT });
    txt(s, gate, { x: x + 0.2, y: 4.75, w: cw - 0.4, h: 0.5, fontSize: 12, color: BLUE });
    const d = 0.22, sp = (cw - 0.4) / 4;
    for (let k = 0; k < 5; k++) xs.push(x + 0.2 + k * sp - d / 2 + (k === 0 ? d / 2 : 0) - (k === 4 ? d / 2 : 0));
  });
  dayDots(s, xs, 5.65, 0.22, true);
}

// 8 & 9. Architecture tables
const days = [
  ["1", "Problems, clients and decisions", "Sorting problem, symptom, cause and solution", "Cases sorted; decision-maker named"],
  ["2", "Defining the problem", "Problem Definition Canvas", "Problem statement; Case Approval Form"],
  ["3", "Structuring", "Issue tree (MECE); sealed working answer", "Issue tree; sealed answer"],
  ["4", "Causes · Thursday challenge", "Problem tree", "Causal diagnosis"],
  ["5", "Systems and scope lock · Gate 1", "Causal loop diagram", "Problem diagnostic"],
  ["6", "Jurisdiction, money and delivery", "Delivery chain map", "Delivery chain and funding map"],
  ["7", "Actors and political economy", "Power-interest map with absent voices", "Stakeholder and incentive matrix"],
  ["8", "Prioritising issues", "Pruning matrix", "Pruned tree with rationale"],
  ["9", "Hypotheses · Thursday challenge", "Hypothesis register", "Register with disconfirming tests"],
  ["10", "Workplan · Gate 2", "Workplan matrix", "Research plan; evidence register"],
  ["11", "Finding and judging evidence · Studio", "Source reliability assessment", "Evidence register entries"],
  ["12", "Quantitative analysis · Studio", "Disaggregation in a spreadsheet", "Three charts with interpretation"],
  ["13", "Qualitative and comparative · Studio", "Comparative case matrix", "Comparative matrix; thematic notes"],
  ["14", "Testing · Thursday challenge", "Hypothesis testing matrix", "Verdict on each hypothesis"],
  ["15", "Synthesis · Gate 3", "Pyramid Principle with SCQA", "Two-page diagnostic memo"],
  ["16", "Generating options", "How Might We with a journey map", "Three or more distinct options"],
  ["17", "Choosing", "Options appraisal matrix", "Appraisal and recommendation"],
  ["18", "Delivery design", "Theory of change", "Implementation plan"],
  ["19", "Measurement and pitch · Gate 4", "Indicator framework", "Indicators; draft deck"],
  ["20", "Defence", "Panel presentation", "Presentation; report due 72 hours later"],
];
[["The 20-day architecture: Weeks 1 and 2", 0], ["The 20-day architecture: Weeks 3 and 4", 10]].forEach(([title, start]) => {
  const s = contentSlide(title, "How the programme is built",
    "One anchor tool per day, learned to independent use. Supporting tools are demonstrated only. Shaded rows are gate days. This architecture is provisional and will be finalised in Stage 4.");
  const rows = days.slice(start, start + 10).map((r) => ({ cells: r, highlight: /Gate/.test(r[1]) || r[0] === "20", strongFirst: true }));
  table(s, ["Day", "Theme", "Anchor tool", "Participant output"], rows, [0.7, 3.75, 3.7, 3.68], { y: 1.55, rowH: 0.45, fontSize: 14 });
});

// 10. Reality tests
{
  const s = contentSlide("Every case must pass three India-specific reality tests", "How the programme is built",
    "Taught on Day 6 and applied again on Day 17. These tests are the programme's answer to the consulting-transfer gap.");
  const tests = [
    ["Jurisdiction", "Who has the authority to act?", "Seventh Schedule lists; 73rd and 74th Amendments; legislative authority, administrative control and funding as separate powers.", "the recommendation is addressed to a body that cannot act on it."],
    ["Money", "Where does the funding come from?", "Budget heads; central sector and centrally sponsored schemes; Union and state cost sharing; Finance Commission transfers.", "nobody can say which budget line would pay for it."],
    ["Frontline", "What will the people who deliver it do?", "The delivery chain from ministry to frontline worker; caseloads, discretion and incentives.", "the plan assumes frontline workers will simply comply."],
  ];
  const gap = 0.35, cw = (W - 2 * gap) / 3;
  tests.forEach(([h, q, learn, fail], i) => {
    const x = L + i * (cw + gap);
    card(s, x, 1.6, cw, 4.95);
    dot(s, x + 0.25, 1.85, 0.45, NAVY, i + 1, { fontSize: 15 });
    txt(s, h, { x: x + 0.25, y: 2.45, w: cw - 0.5, h: 0.45, fontSize: 22, bold: true, color: NAVY });
    txt(s, q, { x: x + 0.25, y: 2.95, w: cw - 0.5, h: 0.65, fontSize: 16, italic: true, color: BLUE });
    txt(s, "Participants learn", { x: x + 0.25, y: 3.7, w: cw - 0.5, h: 0.25, fontSize: 11, color: GREY });
    txt(s, learn, { x: x + 0.25, y: 3.97, w: cw - 0.5, h: 1.3, fontSize: 14 });
    txt(s, "The test fails when", { x: x + 0.25, y: 5.35, w: cw - 0.5, h: 0.25, fontSize: 11, color: GREY });
    txt(s, fail, { x: x + 0.25, y: 5.62, w: cw - 0.5, h: 0.8, fontSize: 14 });
  });
}

// 11. Session format and weekly rhythm
{
  const s = contentSlide("Every session is built for making, not listening", "How the programme is built",
    "Default two-hour format. Gate days shorten the concept block to make room for pod peer review; Days 11 to 13 run as supervised research studios.");
  const segs = [
    [0, 10, "Open", PALE, NAVY], [10, 35, "Concept", BLUE, WHITE], [35, 55, "Demonstration", BLUE, WHITE],
    [55, 90, "Group activity", NAVY, WHITE], [90, 110, "Own case", NAVY, WHITE], [110, 120, "Close", PALE, NAVY],
  ];
  const k = W / 120, y = 1.75;
  segs.forEach(([a, b, lab, fill, tc]) => {
    s.addShape(pres.shapes.RECTANGLE, { x: L + a * k, y, w: (b - a) * k - 0.04, h: 0.6, fill: { color: fill }, line: { type: "none" }, objectName: name("seg") });
    s.addText(lab, { x: L + a * k, y, w: (b - a) * k - 0.04, h: 0.6, align: "center", valign: "middle", fontSize: 13, bold: true, color: tc, margin: 0, isTextBox: true, objectName: name("seglabel") });
  });
  [0, 10, 35, 55, 90, 110, 120].forEach((m) => txt(s, String(m), { x: L + m * k - 0.3, y: y + 0.66, w: 0.6, h: 0.25, fontSize: 11, color: GREY, align: "center" }));
  txt(s, "minutes", { x: R - 1.0, y: y + 0.92, w: 1.0, h: 0.25, fontSize: 11, color: GREY, align: "right" });
  const groups = [
    [PALE, "Frame and close · 20 minutes", "An opening problem or retrieval question; a debrief and an exit task.", true],
    [BLUE, "Teach · 45 minutes", "One concept, then a demonstration of the anchor tool on the instructor's spine case.", false],
    [NAVY, "Make · 55 minutes", "A group activity on a common case, then each participant applies the tool to their own case.", false],
  ];
  const gw = (W - 2 * 0.4) / 3;
  groups.forEach(([fill, h, b, outline], i) => {
    const x = L + i * (gw + 0.4);
    dot(s, x, 3.12, 0.26, fill, null, { line: outline ? LIGHT : null });
    txt(s, h, { x: x + 0.4, y: 3.08, w: gw - 0.4, h: 0.35, fontSize: 16, bold: true, color: NAVY });
    txt(s, b, { x: x + 0.4, y: 3.48, w: gw - 0.4, h: 0.9, fontSize: 14 });
  });
  rule(s, L, 4.65, W, 0);
  txt(s, "The weekly rhythm", { x: L, y: 4.85, w: 5, h: 0.35, fontSize: 16, bold: true, color: NAVY });
  const wk = [
    ["Monday to Wednesday", "Learn and apply"],
    ["Thursday", "Challenge: simulation, hypothesis battle or red team"],
    ["Friday", "Consolidate: gate submission and pod review"],
  ];
  wk.forEach(([d, t], i) => {
    const x = L + i * (gw + 0.4);
    card(s, x, 5.3, gw, 1.15);
    txt(s, d, { x: x + 0.2, y: 5.42, w: gw - 0.4, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    txt(s, t, { x: x + 0.2, y: 5.75, w: gw - 0.4, h: 0.6, fontSize: 14 });
  });
}

// 12. Theory as questions
{
  const s = contentSlide("Theory enters as a question about the participant's own case", "How the programme is built",
    "No stand-alone theory lectures. Each thinker gets five to ten minutes, one short reading and one workbook question. About a dozen readings in total.");
  const rows = [
    ["1", "Rittel and Webber", "Whose definition of the problem are you adopting, and what would count as solved?"],
    ["2", "Sen", "Are you measuring access to a resource, or what people can actually do with it?"],
    ["6", "Pritchett; Kapur", "At which link in the delivery chain does intent at the top stop becoming action?"],
    ["7", "Ostrom; Lipsky", "Which rules actually govern behaviour, and what will frontline workers really do?"],
    ["8", "Simon", "What is good enough to investigate, and what will you knowingly leave out?"],
    ["16", "Hall", "Are you adjusting settings, changing instruments or changing goals?"],
    ["17", "Moore; Lindblom", "Does the option create public value, win support and have the capacity behind it?"],
    ["19", "Kingdon", "Is there a policy window for this recommendation, and which stream is missing?"],
  ].map((r) => ({ cells: r, strongFirst: true }));
  table(s, ["Day", "Thinker", "The question it puts to the participant's case"], rows, [0.7, 2.6, 8.53], { y: 1.6, rowH: 0.52, fontSize: 15 });
}

// 13. Section divider
pres.addSection({ title: "What participants learn" });
{
  const s = pres.addSlide({ masterName: "SECTION", sectionTitle: "What participants learn" });
  s.addText("02", { placeholder: "number" });
  s.addText("What participants learn, and how we know", { placeholder: "title" });
  s.addText("Ten outcomes, fifty competencies and one set of criteria used everywhere", { placeholder: "body" });
}

// 14. Ten domains
{
  const s = contentSlide("Ten outcomes, each anchored in a domain of competence", "What participants learn",
    "Each domain holds four to six competencies with IDs (A1, A2 and so on), fifty in all. Workbooks, feedback and rubrics refer to these IDs.");
  const doms = [
    ["A", "Problem framing", "Write a decision-focused problem statement"],
    ["B", "Structuring", "Build and prune a MECE issue tree"],
    ["C", "Causes and systems", "Separate symptoms from causes; show feedback"],
    ["D", "Institutions", "Map jurisdiction, money, delivery and actors"],
    ["E", "Evidence", "Find, judge and triangulate published evidence"],
    ["F", "Hypotheses", "Test falsifiable hypotheses against rivals"],
    ["G", "Design and appraisal", "Appraise three distinct options explicitly"],
    ["H", "Execution", "Plan owners, risks, indicators and a theory of change"],
    ["I", "Communication", "Write top-down; present and defend"],
    ["J", "Judgement", "Name limits, trade-offs and uncertainty"],
  ];
  const gap = 0.25, cw = (W - 4 * gap) / 5, ch = 2.3;
  doms.forEach(([l, h, b], i) => {
    const col = i % 5, row = Math.floor(i / 5);
    const x = L + col * (cw + gap), y = 1.6 + row * (ch + 0.25);
    card(s, x, y, cw, ch);
    dot(s, x + 0.2, y + 0.2, 0.45, NAVY, l, { fontSize: 15 });
    txt(s, h, { x: x + 0.2, y: y + 0.75, w: cw - 0.35, h: 0.6, fontSize: 15, bold: true, color: NAVY, valign: "bottom" });
    txt(s, b, { x: x + 0.2, y: y + 1.45, w: cw - 0.35, h: 0.8, fontSize: 14 });
  });
}

// 15. Three levels
{
  const s = contentSlide("Three levels describe every domain; Working is the standard", "What participants learn",
    "Indicators are written at the Working level so that any completion rule chosen in Stage 8 can be applied.");
  txt(s, "Example: Domain A, problem framing", { x: L, y: 1.4, w: 8, h: 0.35, fontSize: 15, color: GREY });
  const lv = [
    ["Foundational", "The canvas is complete, but the statement stays broad or contains a cause or solution. The decision-maker is \"the government\" in general.", false],
    ["Working", "The statement is specific, free of solutions and bounded. It names a role with authority and a real decision. Success is a change in people's conditions.", true],
    ["Advanced", "Also anticipates how others would frame the problem, explains why this framing serves the decision, and revises it when evidence requires.", false],
  ];
  const gap = 0.35, cw = (W - 2 * gap) / 3;
  lv.forEach(([h, b, hi], i) => {
    const x = L + i * (cw + gap);
    if (hi) card(s, x, 2.0, cw, 3.9);
    else s.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: cw, h: 3.9, fill: { color: WHITE }, line: { color: RULE, width: 0.75 }, objectName: name("card") });
    for (let k = 0; k < 3; k++) dot(s, x + 0.25 + k * 0.3, 2.3, 0.2, k <= i ? NAVY : WHITE, null, { line: k <= i ? null : LIGHT });
    txt(s, h, { x: x + 0.25, y: 2.7, w: cw - 0.5, h: 0.45, fontSize: 22, bold: true, color: NAVY });
    if (hi) txt(s, "Completion standard", { x: x + 0.25, y: 3.2, w: cw - 0.5, h: 0.3, fontSize: 12, bold: true, color: BLUE });
    txt(s, b, { x: x + 0.25, y: 3.65, w: cw - 0.5, h: 2.1, fontSize: 15 });
  });
  txt(s, "The completion threshold itself is deferred to Stage 8.", { x: L, y: 6.15, w: 11, h: 0.35, fontSize: 13, color: GREY });
}

// 16. Assessment weights
{
  const s = contentSlide("Assessment keeps individual work individual", "What participants learn",
    "Weights are as agreed. The change is that research and evidence quality is attached to a distinct artefact, the evidence register, so it is not marked twice.");
  s.addChart(pres.charts.BAR, [{
    name: "Weight",
    labels: ["Workbook portfolio", "Evidence register", "Pod work and peer review", "Client report", "Presentation and defence"],
    values: [35, 15, 10, 20, 20],
  }], {
    x: L, y: 1.6, w: 6.9, h: 4.9, barDir: "bar", chartColors: [NAVY],
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 40, valAxisMinVal: 0,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLabelFontSize: 14, catAxisLabelColor: TEXT, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 14, dataLabelColor: NAVY, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0\"%\"",
    showLegend: false, showTitle: false, barGapWidthPct: 60, objectName: "assessment-chart",
  });
  const pts = [
    ["95%", "of marks are individual. The only collective mark is the 5 per cent pod synthesis slide on Day 20."],
    ["4", "gates give detailed feedback. Proposed: gates carry no marks; the portfolio is marked once, with credit for revision."],
    ["5", "feedback headings at every gate: strongest element, critical weakness, missing dimension, required revision, next task."],
  ];
  pts.forEach(([num, t], i) => {
    const y = 1.75 + i * 1.6;
    txt(s, num, { x: 8.1, y, w: 1.4, h: 0.7, fontSize: 36, bold: true, color: NAVY });
    txt(s, t, { x: 9.5, y: y + 0.05, w: 3.08, h: 1.4, fontSize: 14 });
  });
}

// 17. Capstone
{
  const s = contentSlide("The capstone is the case, finished", "What participants learn",
    "Decision 6 approved this format. The report is due 72 hours after Day 20 so participants can respond to the panel's challenge.");
  const parts = [
    ["Client report", "3,500 to 4,500 words, written to the named decision-maker, with annexes"],
    ["Full deck", "10 to 12 slides, submitted rather than presented in full"],
    ["Presentation", "5 slides in 6 minutes, recommendation in the first minute"],
    ["Individual defence", "6 minutes of questions on evidence, assumptions and feasibility"],
    ["Reflection", "500 words that open the sealed Day 3 answer and explain what changed"],
  ];
  parts.forEach(([h, b], i) => {
    const y = 1.65 + i * 0.95;
    dot(s, L, y + 0.04, 0.3, NAVY, i + 1, { fontSize: 11 });
    txt(s, h, { x: L + 0.5, y, w: 6.4, h: 0.35, fontSize: 17, bold: true, color: NAVY });
    txt(s, b, { x: L + 0.5, y: y + 0.38, w: 6.4, h: 0.45, fontSize: 14 });
  });
  const tx = 8.4;
  rule(s, tx - 0.4, 1.65, 0, 4.7);
  txt(s, "Timeline", { x: tx, y: 1.65, w: 4, h: 0.35, fontSize: 16, bold: true, color: NAVY });
  const tl = [["Day 19", "Gate 4: draft deck"], ["Day 20", "Presentation, defence and pod synthesis slide"], ["Day 20 + 72 hours", "Client report and reflection due"]];
  s.addShape(pres.shapes.LINE, { x: tx + 0.14, y: 2.45, w: 0, h: 2.9, line: { color: LIGHT, width: 1.5 }, objectName: name("timeline") });
  tl.forEach(([d, t], i) => {
    const y = 2.3 + i * 1.45;
    dot(s, tx, y, 0.28, i === 1 ? BLUE : NAVY);
    txt(s, d, { x: tx + 0.5, y: y - 0.02, w: 3.6, h: 0.32, fontSize: 15, bold: true, color: BLUE });
    txt(s, t, { x: tx + 0.5, y: y + 0.32, w: 3.6, h: 0.7, fontSize: 14 });
  });
}

// 18. Feedback capacity
{
  const s = contentSlide("One instructor can give real feedback to about sixteen participants", "What participants learn",
    "Estimate: four gates at about 35 minutes each, six lighter checks at 10 minutes, and 45 minutes for the report, about four hours per participant. To be tested in the pilot.");
  s.addChart(pres.charts.BAR, [{ name: "Hours", labels: ["12", "16", "20", "24"], values: [49, 65, 82, 98] }], {
    x: L, y: 1.6, w: 6.6, h: 4.6, barDir: "col", chartColors: [BLUE],
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 110, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLabelFontSize: 14, catAxisLabelColor: TEXT, catAxisLabelFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 14, dataLabelColor: NAVY, dataLabelFontFace: "+mn-lt",
    showLegend: false, showTitle: false, barGapWidthPct: 70, objectName: "grading-chart",
  });
  txt(s, "Feedback and grading hours by cohort size (participants)", { x: L, y: 6.25, w: 6.6, h: 0.3, fontSize: 12, color: GREY });
  const pts = [
    ["About 4 hours", "of feedback per participant across the programme."],
    ["About 9", "presentations fit in a two-hour Day 20. Sixteen need two panels or a longer session."],
    ["Recommendation", "cap the first cohort at 16; add a teaching assistant above that."],
  ];
  pts.forEach(([h, t], i) => {
    const y = 1.75 + i * 1.5;
    txt(s, h, { x: 7.9, y, w: 4.68, h: 0.45, fontSize: 22, bold: true, color: NAVY });
    txt(s, t, { x: 7.9, y: y + 0.5, w: 4.68, h: 0.8, fontSize: 14 });
  });
}

// 19. Decisions
pres.addSection({ title: "Decisions and next steps" });
{
  const s = contentSlide("Six decisions are recorded; six still shape the next stages", "Decisions and next steps",
    "Provisional decisions use the designer's recommendation until reviewed. The full record is in the Decision Log.");
  const rec = [
    ["Audience", "Final-year UG, PG and early-career", "Provisional"],
    ["One anchor tool per day", "Review when Stage 4 is presented", "Provisional"],
    ["Named client role", "A role, never contacted", "Provisional"],
    ["Completion standard", "To be set in Stage 8", "Deferred"],
    ["Primary research", "None; published evidence only", "Approved"],
    ["Capstone format", "Report, pitch, defence, reflection", "Approved"],
  ];
  const open = [
    ["Cohort size", "Recommended 12 to 16"],
    ["Delivery mode", "Online, in person or hybrid"],
    ["Spine case", "Waste segregation or foundational literacy"],
    ["Pod composition", "Recommended: same state, different problems"],
    ["Gate mechanics", "Recommended: feedback only, marked at the end"],
    ["Workbooks", "Recommended: ten, aligned to the gates"],
  ];
  const cw = (W - 0.6) / 2;
  txt(s, "Recorded", { x: L, y: 1.55, w: cw, h: 0.4, fontSize: 18, bold: true, color: NAVY });
  txt(s, "Open", { x: L + cw + 0.6, y: 1.55, w: cw, h: 0.4, fontSize: 18, bold: true, color: NAVY });
  rec.forEach(([h, b, tag], i) => {
    const y = 2.1 + i * 0.75;
    txt(s, h, { x: L, y, w: 3.9, h: 0.3, fontSize: 15, bold: true });
    txt(s, b, { x: L, y: y + 0.32, w: 3.9, h: 0.3, fontSize: 13, color: GREY });
    const fill = tag === "Approved" ? NAVY : PALE, tc = tag === "Approved" ? WHITE : NAVY;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: L + 4.2, y: y + 0.08, w: 1.3, h: 0.36, rectRadius: 0.08, fill: { color: fill }, line: { type: "none" }, objectName: name("tag") });
    s.addText(tag, { x: L + 4.2, y: y + 0.08, w: 1.3, h: 0.36, align: "center", valign: "middle", fontSize: 12, bold: true, color: tc, margin: 0, isTextBox: true, objectName: name("taglabel") });
  });
  rule(s, L + cw + 0.3, 1.55, 0, 4.95);
  open.forEach(([h, b], i) => {
    const y = 2.1 + i * 0.75, x = L + cw + 0.6;
    dot(s, x, y + 0.08, 0.16, WHITE, null, { line: MID });
    txt(s, h, { x: x + 0.35, y, w: cw - 0.4, h: 0.3, fontSize: 15, bold: true });
    txt(s, b, { x: x + 0.35, y: y + 0.32, w: cw - 0.4, h: 0.3, fontSize: 13, color: GREY });
  });
}

// 20. Next
{
  const s = contentSlide("Next: Stage 3 builds the framework library", "Decisions and next steps",
    "The competency framework now fixes which tools the course needs: about nineteen anchors and twenty supporting tools.");
  const steps = [
    ["Research each tool at its source", "Original books, papers and firm publications, not summaries."],
    ["Verify who created it", "Originated, developed, popularised or simply used: each tool gets an honest attribution."],
    ["Write a one-page tool card", "Question, inputs, output, steps, Indian example, misuses, limits and place in the seven steps."],
    ["Widen the search", "PwC, KPMG, Accenture, government delivery units and development agencies."],
    ["Deliver as Word, PDF and slides", "A library document and a tool-card deck in this visual style."],
  ];
  steps.forEach(([h, b], i) => {
    const y = 1.65 + i * 0.95;
    dot(s, L, y + 0.04, 0.34, i < 4 ? NAVY : BLUE, i + 1, { fontSize: 12 });
    txt(s, h, { x: L + 0.6, y, w: 10.5, h: 0.35, fontSize: 18, bold: true, color: NAVY });
    txt(s, b, { x: L + 0.6, y: y + 0.4, w: 10.5, h: 0.4, fontSize: 15 });
  });
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
