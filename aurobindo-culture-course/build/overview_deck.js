// Course overview deck for Spirit and Form: Sri Aurobindo on Indian Culture
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/f218a6be-6141-4f23-a687-cb058014c616_1248a252-a28d-4416-8d9c-de5f5eefcbdb/pptx/scripts/apply_theme.js");

const OUT = process.argv[2] || "deck.pptx";

const THEME = {
  name: "Spirit and Form",
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
pres.title = "Spirit and Form: course overview";
pres.author = "Spirit and Form course team";
pres.company = "Spirit and Form";

const C = pres.SchemeColor;
const NAVY = C.text2, TEXT = C.text1, WHITE = C.background1, PALE = C.background2;
const BLUE = C.accent1, MID = C.accent2, GREY = C.accent4, RULE = C.accent5, LIGHT = C.accent6;
const RULE_HEX = "D7E0E8";

const L = 0.75, R = 12.583, W = R - L; // content frame
const FOOT = "Spirit and Form · Course overview";

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

const GATES = { 5: "G1", 10: "G2", 15: "G3", 20: "G4", 25: "G5" };
function dayDots(slide, xs, y, d, showLabels) {
  for (let i = 1; i <= 30; i++) {
    const x = xs[i - 1];
    if (GATES[i]) dot(slide, x, y, d, NAVY);
    else if (i === 30) dot(slide, x, y, d, BLUE);
    else dot(slide, x, y, d, WHITE, null, { line: LIGHT });
    if (showLabels && (GATES[i] || i === 30)) {
      txt(slide, `Day ${i}`, { x: x - 0.45, y: y + d + 0.06, w: 0.9 + d, h: 0.28, fontSize: 10, color: GREY, align: "center" });
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
  txt(s, "Course overview", { x: L, y: 1.6, w: 8, h: 0.35, fontSize: 14, color: BLUE, bold: true });
  s.addText("Spirit and Form", { placeholder: "title" });
  s.addText("Sri Aurobindo on Indian culture: a 30-day seminar on The Renaissance in India, A Defence of Indian Culture and the five complete plays", { placeholder: "body" });
  const xs = Array.from({ length: 30 }, (_, i) => L + i * 0.3);
  dayDots(s, xs, 5.0, 0.16, false);
  txt(s, "Thirty teaching days. Filled dots mark the five gates; the last is the capstone and the staged readings.", { x: L, y: 5.3, w: 10, h: 0.35, fontSize: 12, color: GREY });
  txt(s, "Version 1.0 · November 2026", { x: L, y: 6.85, w: 6, h: 0.3, fontSize: 12, color: GREY });
  s.addNotes("This deck summarises the Course Concept Note and the Learning Outcomes and Competency Framework. Full detail is in the Word and PDF documents in 00 Programme Documents.");
}

// 2. At a glance
{
  const s = contentSlide("Three bodies of work, read closely, judged fairly", "Opening",
    "The core proposition: participants read the essays and the plays together, and carry one question of their own from Day 1 to a defended capstone.");
  const stats = [
    ["30", "teaching days, Monday to Friday over six weeks"],
    ["60", "live hours, two a day, with about an hour of reading on most days"],
    ["5", "complete verse plays, read aloud and staged"],
    ["5", "gates with detailed feedback before the capstone"],
  ];
  const cw = (W - 3 * 0.35) / 4;
  stats.forEach(([num, lab], i) => {
    const x = L + i * (cw + 0.35);
    txt(s, num, { x, y: 1.75, w: cw, h: 1.1, fontSize: 60, bold: true, color: NAVY });
    txt(s, lab, { x, y: 2.95, w: cw - 0.2, h: 0.9, fontSize: 15, color: TEXT });
  });
  rule(s, L, 4.3, W, 0);
  txt(s, [
    { text: "Reverent courses paraphrase and admire; ", options: { color: TEXT } },
    { text: "participants learn what the author believed, not how to test it. ", options: { bold: true, color: NAVY } },
    { text: "Critical courses apply a theory before the text is understood; ", options: { color: TEXT } },
    { text: "participants learn to label rather than to read.", options: { bold: true, color: NAVY } },
  ], { x: L, y: 4.6, w: 11.2, h: 1.2, fontSize: 18 });
  txt(s, "This seminar teaches one thing above all: understand an argument fully, then judge it fairly.", { x: L, y: 6.0, w: 11.2, h: 0.4, fontSize: 14, color: GREY });
}

// 3. The three bodies of work
{
  const s = contentSlide("The essays argue; the plays enact", "Opening",
    "Dates follow the CWSA editorial notes. The plays were published only after his death, except Perseus the Deliverer, serialised in the Bande Mataram in 1907.");
  const works = [
    ["The Renaissance in India", "Arya, August to November 1918; revised as a booklet in 1920", "What would a true renaissance in India be? Spirit and form, decline and awakening, assimilation against imitation."],
    ["A Defence of Indian Culture", "'Is India Civilised?' and the Defence, Arya, December 1918 to January 1921; unfinished", "A reply to William Archer's India and the Future (1917) that widens into a theory of religion, art, literature and polity."],
    ["The five complete plays", "Written about 1905 to 1915; CWSA Volumes 3 and 4", "Perseus the Deliverer, Vasavadutta, Rodogune, The Viziers of Bassora and Eric: deliverance, love, rivalry, just rule and the transformation of enmity."],
  ];
  const gap = 0.35, cw = (W - 2 * gap) / 3;
  works.forEach(([h, d, b], i) => {
    const x = L + i * (cw + gap);
    card(s, x, 1.6, cw, 4.6);
    dot(s, x + 0.25, 1.85, 0.45, NAVY, i + 1, { fontSize: 15 });
    txt(s, h, { x: x + 0.25, y: 2.45, w: cw - 0.5, h: 0.8, fontSize: 21, bold: true, color: NAVY });
    txt(s, d, { x: x + 0.25, y: 3.3, w: cw - 0.5, h: 0.85, fontSize: 13, color: BLUE });
    txt(s, b, { x: x + 0.25, y: 4.25, w: cw - 0.5, h: 1.8, fontSize: 15 });
  });
  txt(s, "Texts are cited from The Complete Works of Sri Aurobindo (CWSA): Volume 20 for the essays, Volumes 3 and 4 for the plays.", { x: L, y: 6.4, w: 11.2, h: 0.35, fontSize: 12, color: GREY });
}

// 4. Seven principles
{
  const s = contentSlide("Seven principles govern every design decision", "Opening",
    "When a later teaching choice is contested, these principles are the reference point.");
  const ps = [
    ["Understand before judging", "Every judgement follows an accurate reconstruction of the text."],
    ["Text, inference, judgement, question", "Keep them apart, every day, in the Reader's Ledger."],
    ["Steelman the critics", "Archer, Ambedkar, Said and others are read at their strongest."],
    ["Every claim needs a standard", "Name the standard by which a culture, a work or an argument is judged."],
    ["The plays are read aloud", "Drama is heard and staged, not only analysed."],
    ["One question, carried all the way", "Each participant's question grows from Day 1 to the capstone."],
    ["Accuracy is a moral matter", "No invented quotation, page or fact. AI output is never evidence of what an author wrote."],
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
pres.addSection({ title: "How the course is built" });
{
  const s = pres.addSlide({ masterName: "SECTION", sectionTitle: "How the course is built" });
  s.addText("01", { placeholder: "number" });
  s.addText("How the course is built", { placeholder: "title" });
  s.addText("One reading method, six weeks, one question carried from start to finish", { placeholder: "body" });
}

// 6. The Reader's Ledger
{
  const s = contentSlide("One method, used every day: the Reader's Ledger", "How the course is built",
    "Introduced on Day 1 and kept every day. Most errors in reading come from mixing the four columns: treating an inference as the text, or a judgement as a fact.");
  const cols = [
    ["Text", "What the passage says, in the reader's own words, with essay or act and page.", "He holds that a renaissance is a rebirth of the old spirit in new forms, not a return to old forms. (Give essay and page.)"],
    ["Inference", "What the passage implies or assumes.", "He assumes a culture has a lasting spirit that can be told apart from its changing forms."],
    ["Judgement", "What the reader thinks, and why.", "The distinction is useful, but who decides what belongs to the spirit?"],
    ["Question", "What the reader still needs to find out.", "Does he apply the same test to the reform movements of his own time?"],
  ];
  const gap = 0.25, cw = (W - 3 * gap) / 4;
  cols.forEach(([h, b, ex], i) => {
    const x = L + i * (cw + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: cw, h: 0.55, fill: { color: i === 0 ? NAVY : i === 3 ? MID : BLUE }, line: { type: "none" }, objectName: name("head") });
    s.addText(h, { x, y: 1.6, w: cw, h: 0.55, align: "center", valign: "middle", fontSize: 18, bold: true, color: WHITE, margin: 0, isTextBox: true, objectName: name("headlabel") });
    txt(s, b, { x: x + 0.1, y: 2.35, w: cw - 0.2, h: 1.1, fontSize: 14 });
    card(s, x, 3.6, cw, 2.2);
    txt(s, "Example", { x: x + 0.15, y: 3.72, w: cw - 0.3, h: 0.25, fontSize: 11, color: GREY });
    txt(s, ex, { x: x + 0.15, y: 4.0, w: cw - 0.3, h: 1.7, fontSize: 13, italic: true });
  });
  txt(s, "The example paraphrases the argument of The Renaissance in India; participants supply the reference from their own edition.", { x: L, y: 6.1, w: 11.2, h: 0.35, fontSize: 12, color: GREY });
}

// 7. Six weeks
{
  const s = contentSlide("Six weeks, from context to capstone", "How the course is built",
    "Each week ends in a gate on Friday. Weeks 5 and 6 move from the essays to the plays, then bring the two together on Day 28.");
  const weeks = [
    ["Week 1", "Foundations", "The life, the Arya, the colonial debate, key concepts", "Gate 1 · Day 5"],
    ["Week 2", "The Renaissance in India", "Spirit and form; decline; the work ahead; external influence", "Gate 2 · Day 10"],
    ["Week 3", "The controversy and the spirit", "'Is India Civilised?', Archer, religion, the four aims, the social ideal", "Gate 3 · Day 15"],
    ["Week 4", "Art, literature, polity", "Sculpture and painting; Veda to Kalidasa; the polity of dharma", "Gate 4 · Day 20"],
    ["Week 5", "Judgement and the first plays", "The Defence weighed; Perseus, Vasavadutta, Rodogune", "Gate 5 · Day 25"],
    ["Week 6", "The plays and the capstone", "The Viziers of Bassora, Eric, studio, defence, staged readings", "Capstone · Day 30"],
  ];
  const gap = 0.2, cw = (W - 5 * gap) / 6;
  const xs = [];
  weeks.forEach(([wk, h, q, gate], i) => {
    const x = L + i * (cw + gap);
    card(s, x, 1.6, cw, 3.9);
    txt(s, wk, { x: x + 0.15, y: 1.78, w: cw - 0.3, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    txt(s, h, { x: x + 0.15, y: 2.12, w: cw - 0.3, h: 0.95, fontSize: 16, bold: true, color: NAVY });
    txt(s, q, { x: x + 0.15, y: 3.1, w: cw - 0.3, h: 1.6, fontSize: 13 });
    txt(s, gate, { x: x + 0.15, y: 4.95, w: cw - 0.3, h: 0.35, fontSize: 12, bold: true, color: BLUE });
    const d = 0.18, sp = (cw - 0.3 - d) / 4;
    for (let k = 0; k < 5; k++) xs.push(x + 0.15 + k * sp);
  });
  dayDots(s, xs, 5.8, 0.18, true);
}

// 8 & 9. Architecture tables
const DAYS = require("./out/days.json");
const archRows = DAYS.map((d) => {
  const anchor = Array.isArray(d.anchor) ? d.anchor[0] : d.anchor;
  const voice = d.theory ? d.theory[0] : (d.day >= 29 ? "None: studio day" : "None: corpus survey");
  return { cells: [String(d.day), d.title, anchor.split(":")[0], voice], highlight: d.day % 5 === 0, strongFirst: true };
});
[["The 30-day architecture: Weeks 1 to 3", 0], ["The 30-day architecture: Weeks 4 to 6", 15]].forEach(([title, start]) => {
  const s = contentSlide(title, "How the course is built",
    "One anchor method a day, learned to independent use. 'In conversation' names the thinker or source read beside Sri Aurobindo that day. Shaded rows are gate days.");
  table(s, ["Day", "Theme", "Anchor method", "In conversation"], archRows.slice(start, start + 15), [0.65, 5.0, 3.68, 2.5], { y: 1.45, rowH: 0.32, fontSize: 11 });
});

// 10. Session format
{
  const s = contentSlide("Every session moves from reading to making", "How the course is built",
    "Default two-hour format. Gate days shorten the concept block to allow 40 minutes of peer review. Play days replace close reading with a read-through of the scene of the day.");
  const segs = [
    [0, 10, "Open", PALE, NAVY], [10, 35, "Context and concepts", BLUE, WHITE], [35, 55, "Close reading", BLUE, WHITE],
    [55, 90, "Group activity", NAVY, WHITE], [90, 110, "Ledger worksheet", NAVY, WHITE], [110, 120, "Close", PALE, NAVY],
  ];
  const k = W / 120, y = 1.75;
  segs.forEach(([a, b, lab, fill, tc]) => {
    s.addShape(pres.shapes.RECTANGLE, { x: L + a * k, y, w: (b - a) * k - 0.04, h: 0.6, fill: { color: fill }, line: { type: "none" }, objectName: name("seg") });
    s.addText(lab, { x: L + a * k, y, w: (b - a) * k - 0.04, h: 0.6, align: "center", valign: "middle", fontSize: 12, bold: true, color: tc, margin: 0, isTextBox: true, objectName: name("seglabel") });
  });
  [0, 10, 35, 55, 90, 110, 120].forEach((m) => txt(s, String(m), { x: L + m * k - 0.3, y: y + 0.66, w: 0.6, h: 0.25, fontSize: 11, color: GREY, align: "center" }));
  txt(s, "minutes", { x: R - 1.0, y: y + 0.92, w: 1.0, h: 0.25, fontSize: 11, color: GREY, align: "right" });
  const groups = [
    [PALE, "Frame and close · 20 minutes", "An opening question; a debrief and an exit task.", true],
    [BLUE, "Read · 45 minutes", "Context and one anchor method, then close reading of the passage of the day.", false],
    [NAVY, "Make · 55 minutes", "A group activity, then the worksheet that links the day's reading to the participant's own question.", false],
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
    ["Monday to Thursday", "Read, reconstruct and apply"],
    ["Friday", "Gate submission and peer review"],
    ["Days 22 to 30", "Read-throughs, studio, rehearsal and staged readings"],
  ];
  wk.forEach(([d, t], i) => {
    const x = L + i * (gw + 0.4);
    card(s, x, 5.3, gw, 1.15);
    txt(s, d, { x: x + 0.2, y: 5.42, w: gw - 0.4, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    txt(s, t, { x: x + 0.2, y: 5.75, w: gw - 0.4, h: 0.6, fontSize: 14 });
  });
}

// 11. In conversation
{
  const s = contentSlide("Sri Aurobindo is read in conversation, never alone", "How the course is built",
    "Each voice gets five to ten minutes, one short reading and one question about the day's text. Critics are read at their strongest, not as foils.");
  const groups = [
    ["The colonial case", "Macaulay; William Archer; Sir John Woodroffe's reply", "What standard did the critics apply, and did he answer the standard or only the facts?"],
    ["Culture and renaissance", "Matthew Arnold; Jacob Burckhardt; William James; Max Weber", "What do 'culture', 'renaissance' and 'spirituality' mean in other traditions of thought?"],
    ["Indian contemporaries", "Gandhi; Tagore; Havell and Coomaraswamy on art", "How did others of his time answer the same questions?"],
    ["Later critics", "Ambedkar; Said; Chatterjee; Sen; Ramanujan", "Where do the essays fail, and do the critics answer what he actually argued?"],
    ["Sources of the plays", "Bhasa; Corneille; the Thousand and One Nights; Snorri Sturluson; Bharata", "What did he change in his sources, and why?"],
  ];
  groups.forEach(([h, who, q], i) => {
    const y = 1.6 + i * 0.98;
    dot(s, L, y + 0.04, 0.3, NAVY, i + 1, { fontSize: 11 });
    txt(s, h, { x: L + 0.5, y, w: 3.3, h: 0.35, fontSize: 16, bold: true, color: NAVY });
    txt(s, who, { x: L + 3.9, y, w: 3.6, h: 0.8, fontSize: 14 });
    txt(s, q, { x: L + 7.7, y, w: 4.1, h: 0.8, fontSize: 14, italic: true, color: BLUE });
    if (i < groups.length - 1) rule(s, L + 0.5, y + 0.86, W - 0.5, 0);
  });
}

// 12. The plays
{
  const s = contentSlide("Five plays, five worlds, one question about culture", "How the course is built",
    "Details follow the CWSA notes. Check settings, names and the order of events in the printed text before teaching; the Text Guide marks the details to verify.");
  const rows = [
    ["23", "Perseus the Deliverer", "Greek legend of Perseus and Andromeda; serialised 1907", "A cruel cult against a humane new order", "Spirituality against religiosity"],
    ["24", "Vasavadutta", "The Kathasaritsagara; Udayan of Cowsambie and the princess of Avunthie", "Love and statecraft", "New forms from an old spirit"],
    ["25", "Rodogune", "Syria; the history of Cleopatra Thea; Corneille's Rodogune", "Rivalry, fear and ambition", "Tragedy and the limits of power"],
    ["26", "The Viziers of Bassora", "The Thousand and One Nights; Baroda, 1905", "A good and a wicked vizier", "Just rule and good counsel"],
    ["27", "Eric", "Norway, late tenth to early eleventh century, names used freely", "Enmity transformed by love", "Assimilation into a larger unity"],
  ].map((r) => ({ cells: r, strongFirst: true }));
  table(s, ["Day", "Play", "Setting and source", "Conflict", "Link to the essays"], rows, [0.65, 2.45, 3.85, 2.45, 2.433], { y: 1.55, rowH: 0.74, fontSize: 13 });
  txt(s, "Day 22 introduces the dramatist; Day 28 brings plays and essays together; Day 30 ends in staged readings.", { x: L, y: 6.45, w: 11.2, h: 0.35, fontSize: 13, color: GREY });
}

// 13. Section divider
pres.addSection({ title: "What participants learn" });
{
  const s = pres.addSlide({ masterName: "SECTION", sectionTitle: "What participants learn" });
  s.addText("02", { placeholder: "number" });
  s.addText("What participants learn, and how we know", { placeholder: "title" });
  s.addText("Ten outcomes, twenty-three competencies and one set of levels used everywhere", { placeholder: "body" });
}

// 14. Domains
{
  const s = contentSlide("Eight domains of competence, twenty-three competencies", "What participants learn",
    "Competency codes (A1, A2 and so on) are used in the slides, workbooks, feedback and rubrics. The completion standard is the Working level in every domain.");
  const doms = [
    ["A", "Context", "Place a text in its moment and its controversy"],
    ["B", "Comprehension", "Summarise structure; explain terms in his sense; see rhetoric"],
    ["C", "Argument", "Reconstruct claims; assess evidence; surface standards"],
    ["D", "Critique", "Compare; weigh strengths and limits; engage hard critiques"],
    ["E", "Drama", "Structure, character, verse, interpretation for performance"],
    ["F", "Connection", "Link texts, present debates and an original thesis"],
    ["G", "Expression", "Write, present, defend, read aloud"],
    ["J", "Integrity", "Cite accurately; keep text, inference and judgement apart"],
  ];
  const gap = 0.25, cw = (W - 3 * gap) / 4, ch = 2.3;
  doms.forEach(([l, h, b], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = L + col * (cw + gap), y = 1.6 + row * (ch + 0.25);
    card(s, x, y, cw, ch);
    dot(s, x + 0.2, y + 0.2, 0.45, NAVY, l, { fontSize: 15 });
    txt(s, h, { x: x + 0.2, y: y + 0.8, w: cw - 0.35, h: 0.4, fontSize: 17, bold: true, color: NAVY });
    txt(s, b, { x: x + 0.2, y: y + 1.3, w: cw - 0.35, h: 0.9, fontSize: 14 });
  });
}

// 15. Three levels
{
  const s = contentSlide("Three levels describe every domain; Working is the standard", "What participants learn",
    "The same three levels are used in every rubric, so feedback at Gate 1 speaks the same language as the capstone panel.");
  const lv = [
    ["Foundational", "Summarises the text accurately with support. Judgements are reactions rather than arguments. References are sometimes missing.", false],
    ["Working", "Reconstructs arguments and analyses scenes independently, with references. Judges with reasons. States critics fairly.", true],
    ["Advanced", "Moves easily between essays and plays. Weighs competing readings, concedes where necessary and still argues. Offers an original thesis.", false],
  ];
  const gap = 0.35, cw = (W - 2 * gap) / 3;
  lv.forEach(([h, b, hi], i) => {
    const x = L + i * (cw + gap);
    if (hi) card(s, x, 1.7, cw, 4.2);
    else s.addShape(pres.shapes.RECTANGLE, { x, y: 1.7, w: cw, h: 4.2, fill: { color: WHITE }, line: { color: RULE, width: 0.75 }, objectName: name("card") });
    for (let k = 0; k < 3; k++) dot(s, x + 0.25 + k * 0.3, 2.0, 0.2, k <= i ? NAVY : WHITE, null, { line: k <= i ? null : LIGHT });
    txt(s, h, { x: x + 0.25, y: 2.4, w: cw - 0.5, h: 0.45, fontSize: 22, bold: true, color: NAVY });
    if (hi) txt(s, "Completion standard", { x: x + 0.25, y: 2.9, w: cw - 0.5, h: 0.3, fontSize: 12, bold: true, color: BLUE });
    txt(s, b, { x: x + 0.25, y: 3.35, w: cw - 0.5, h: 2.4, fontSize: 15 });
  });
}

// 16. Assessment weights
{
  const s = contentSlide("Assessment rewards reading, revision and performance", "What participants learn",
    "Gates are formative: detailed feedback during the course, marked once at the end as part of the portfolio, with credit for revision. Full rubrics are in the Assessment Handbook.");
  s.addChart(pres.charts.BAR, [{
    name: "Weight",
    labels: ["Journal and worksheets", "Gate essays and maps", "Seminar and peer review", "Staged reading", "Capstone essay", "Presentation and defence"],
    values: [25, 25, 10, 10, 20, 10],
  }], {
    x: L, y: 1.6, w: 6.9, h: 4.9, barDir: "bar", chartColors: [NAVY],
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 32, valAxisMinVal: 0,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLabelFontSize: 14, catAxisLabelColor: TEXT, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 14, dataLabelColor: NAVY, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0\"%\"",
    showLegend: false, showTitle: false, barGapWidthPct: 60, objectName: "assessment-chart",
  });
  const pts = [
    ["5", "gates with detailed feedback, each in five headings: strongest element, critical weakness, missing dimension, required revision, next task."],
    ["4", "rubric dimensions, three levels each, used for every written task."],
    ["0", "invented quotations tolerated. AI use is disclosed with every submission."],
  ];
  pts.forEach(([num, t], i) => {
    const y = 1.75 + i * 1.6;
    txt(s, num, { x: 8.1, y, w: 1.2, h: 0.7, fontSize: 36, bold: true, color: NAVY });
    txt(s, t, { x: 9.3, y: y + 0.05, w: 3.28, h: 1.45, fontSize: 14 });
  });
}

// 17. Capstone
{
  const s = contentSlide("The capstone is the participant's own question, answered", "What participants learn",
    "The essay is due 72 hours after Day 30, so participants can respond to the panel's challenge. Full guidance and 28 defence questions are in the Capstone Guide.");
  const parts = [
    ["Essay", "3,000 to 4,000 words, three claims, each with a counter-argument answered", "20%"],
    ["Presentation", "Six minutes, following the argument pyramid; at most three slides", "5%"],
    ["Defence", "Six minutes of questions from a panel of three", "5%"],
    ["Staged reading", "A three-minute scene with a one-minute introduction, by a company of five", "10%"],
  ];
  parts.forEach(([h, b, w], i) => {
    const y = 1.65 + i * 1.15;
    dot(s, L, y + 0.04, 0.3, NAVY, i + 1, { fontSize: 11 });
    txt(s, h, { x: L + 0.5, y, w: 4.5, h: 0.35, fontSize: 17, bold: true, color: NAVY });
    txt(s, w, { x: L + 5.6, y, w: 1.0, h: 0.35, fontSize: 17, bold: true, color: BLUE, align: "right" });
    txt(s, b, { x: L + 0.5, y: y + 0.38, w: 6.1, h: 0.6, fontSize: 14 });
  });
  const tx = 8.4;
  rule(s, tx - 0.4, 1.65, 0, 4.7);
  txt(s, "Timeline", { x: tx, y: 1.65, w: 4, h: 0.35, fontSize: 16, bold: true, color: NAVY });
  const tl = [["Day 1", "A first question, drafted in the Ledger"], ["Day 5", "Gate 1: the capstone question"], ["Day 29", "Studio: thesis test and rehearsal"], ["Day 30", "Presentation, defence, staged readings"], ["Day 30 + 72 hours", "Essay and reflection due"]];
  s.addShape(pres.shapes.LINE, { x: tx + 0.14, y: 2.35, w: 0, h: 3.6, line: { color: LIGHT, width: 1.5 }, objectName: name("timeline") });
  tl.forEach(([d, t], i) => {
    const y = 2.2 + i * 0.9;
    dot(s, tx, y, 0.28, i === 3 ? BLUE : NAVY);
    txt(s, d, { x: tx + 0.5, y: y - 0.02, w: 3.6, h: 0.32, fontSize: 14, bold: true, color: BLUE });
    txt(s, t, { x: tx + 0.5, y: y + 0.3, w: 3.6, h: 0.45, fontSize: 13 });
  });
}

// 18. Section divider
pres.addSection({ title: "Running the course" });
{
  const s = pres.addSlide({ masterName: "SECTION", sectionTitle: "Running the course" });
  s.addText("03", { placeholder: "number" });
  s.addText("Running the course", { placeholder: "title" });
  s.addText("Accuracy, assumptions and what is in the package", { placeholder: "body" });
}

// 19. Accuracy
{
  const s = contentSlide("Accuracy comes first: check before you teach", "Running the course",
    "The materials paraphrase rather than quote wherever possible. Items marked for checking are listed in the Text Guide and the Reading List.");
  const left = [
    ["Paraphrase by default", "Quotations appear only where a sentence is famous, and every one must be checked against CWSA."],
    ["No page numbers", "Pages vary between editions. Participants supply them from their own edition."],
    ["Flagged details", "Some details of the plays (for example the setting and names in Perseus the Deliverer) and some volume numbers are marked 'verify'."],
  ];
  const right = [
    ["AI is never evidence", "AI tools invent quotations and plot details, especially for little-read plays. Their output never stands for what an author wrote."],
    ["Disclosure", "Every submission states whether and how AI tools were used."],
    ["Integrity", "An invented quotation is treated as a breach of academic integrity."],
  ];
  const cw = (W - 0.6) / 2;
  [left, right].forEach((col, c) => {
    const x = L + c * (cw + 0.6);
    txt(s, c === 0 ? "In the materials" : "For participants", { x, y: 1.55, w: cw, h: 0.4, fontSize: 18, bold: true, color: NAVY });
    col.forEach(([h, b], i) => {
      const y = 2.15 + i * 1.35;
      dot(s, x, y + 0.08, 0.16, c === 0 ? NAVY : BLUE);
      txt(s, h, { x: x + 0.35, y, w: cw - 0.4, h: 0.35, fontSize: 16, bold: true });
      txt(s, b, { x: x + 0.35, y: y + 0.38, w: cw - 0.4, h: 0.85, fontSize: 14, color: TEXT });
    });
  });
  rule(s, L + cw + 0.3, 1.55, 0, 4.7);
}

// 20. Assumptions and package
{
  const s = contentSlide("Assumptions to confirm, and what the package contains", "Running the course",
    "Confirm the assumptions with the host institution before a first run. Every document exists in Word and PDF; every deck in PowerPoint and PDF.");
  const asm = [
    ["Cohort", "12 to 20; above 16, add a teaching assistant"],
    ["Delivery", "In person; a space for performance on Days 28 to 30"],
    ["Texts", "CWSA or the Ashram's online editions"],
    ["Workload", "About 60 contact hours and 55 hours of study"],
    ["Credential", "Completion, with distinction; credit set by the host"],
  ];
  const pkg = [
    "Programme documents and Start Here",
    "Text Guide and Model Readings",
    "30-day curriculum and calendar",
    "30 slide decks with speaker notes",
    "Six weekly instructor guides",
    "Six participant workbooks, 30 worksheets",
    "Activity bank and Performance Studio Guide",
    "Assessment Handbook and Capstone Guide",
    "Participant Handbook and Reading List",
  ];
  const cw = (W - 0.6) / 2;
  txt(s, "Assumptions", { x: L, y: 1.55, w: cw, h: 0.4, fontSize: 18, bold: true, color: NAVY });
  asm.forEach(([h, b], i) => {
    const y = 2.1 + i * 0.85;
    txt(s, h, { x: L, y, w: 1.7, h: 0.35, fontSize: 15, bold: true, color: BLUE });
    txt(s, b, { x: L + 1.8, y, w: cw - 1.8, h: 0.7, fontSize: 14 });
  });
  rule(s, L + cw + 0.3, 1.55, 0, 4.9);
  const x = L + cw + 0.6;
  txt(s, "The package", { x, y: 1.55, w: cw, h: 0.4, fontSize: 18, bold: true, color: NAVY });
  pkg.forEach((p, i) => {
    const y = 2.1 + i * 0.47;
    dot(s, x, y + 0.08, 0.14, NAVY);
    txt(s, p, { x: x + 0.35, y, w: cw - 0.4, h: 0.35, fontSize: 14 });
  });
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
