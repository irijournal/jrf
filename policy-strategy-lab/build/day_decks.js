// Renders one PowerPoint per teaching day from out/days.json
// Usage: NODE_PATH=node_modules node day_decks.js out/days.json "<output folder>" [day numbers...]
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/f218a6be-6141-4f23-a687-cb058014c616_1248a252-a28d-4416-8d9c-de5f5eefcbdb/pptx/scripts/apply_theme.js");

const [, , DATA, OUTDIR, ...ONLY] = process.argv;
const DAYS = JSON.parse(fs.readFileSync(DATA, "utf8"));

const THEME = {
  name: "Policy and Strategy Lab",
  headFontFace: "Arial", bodyFontFace: "Arial",
  colors: {
    dk1: "202B36", lt1: "FFFFFF", dk2: "123B63", lt2: "EAF1F7",
    accent1: "2F5F8F", accent2: "4D82B8", accent3: "123B63", accent4: "667482",
    accent5: "D7E0E8", accent6: "9DB9D5", hlink: "2F5F8F", folHlink: "667482",
  },
};
const L = 0.75, R = 12.583, W = R - L, TOP = 1.6, BOTTOM = 6.65;
const WEEKS = { 1: "Define and structure", 2: "Situate and prioritise", 3: "Investigate and synthesise", 4: "Decide, deliver, defend" };
const GATES = { 5: 1, 10: 2, 15: 3, 19: 4 };
const warnings = [];

function buildDeck(D) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: "Arial", bodyFontFace: "Arial" };
  pres.title = `Day ${D.day}: ${D.title}`;
  pres.author = "Policy and Strategy Lab course team";
  pres.company = "Policy and Strategy Lab";
  const C = pres.SchemeColor;
  const NAVY = C.text2, TEXT = C.text1, WHITE = C.background1, PALE = C.background2;
  const BLUE = C.accent1, MID = C.accent2, GREY = C.accent4, RULE = C.accent5, LIGHT = C.accent6;
  const RULE_HEX = "D7E0E8";
  const FOOT = `Policy & Strategy Lab · Day ${D.day} · ${D.title}`;
  let n = 0, slideNo = 0;
  const nm = (p) => `${p}-${++n}`;

  pres.defineSlideMaster({
    title: "COVER", background: { color: "FFFFFF" },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: L, y: 2.0, w: 11.6, h: 1.5, fontSize: 40, bold: true, color: NAVY, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: L, y: 3.7, w: 11.0, h: 1.0, fontSize: 20, italic: true, color: TEXT, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: "FFFFFF" }, margin: [0.5, 0.75, 0.6, 0.75],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: L, y: 0.42, w: W, h: 0.95, fontSize: 28, bold: true, color: NAVY, valign: "top", align: "left", margin: 0 }, text: "" } },
      { text: { text: FOOT, options: { x: L, y: 6.95, w: 10, h: 0.3, fontSize: 10, color: GREY, margin: 0 } } },
    ],
    slideNumber: { x: 11.983, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: "667482", align: "right", margin: 0 },
  });

  // ---------------------------------------------------------------- helpers
  function fit(text, o) {
    if (o.noFit) return;
    const s = Array.isArray(text) ? text.map((r) => r.text).join("") : String(text);
    const fsz = o.fontSize || 14;
    const cw = (o.bold ? 0.56 : 0.52) * fsz / 72;
    const per = Math.max(1, Math.floor(o.w / cw));
    let lines = 0;
    for (const para of s.split("\n")) {
      const words = para.split(" ");
      const longest = Math.max(...words.map((x) => x.length));
      if (longest > per) warnings.push(`Day ${D.day} slide ${slideNo}: word too long for box: ${s.slice(0, 40)}`);
      let cur = 0, l = 1;
      for (const wd of words) {
        if (cur + wd.length + (cur ? 1 : 0) > per) { l += 1; cur = wd.length; } else cur += wd.length + (cur ? 1 : 0);
      }
      lines += l;
    }
    const need = lines * fsz * 1.18 / 72;
    if (need > o.h + 0.06) warnings.push(`Day ${D.day} slide ${slideNo}: text may overflow (${need.toFixed(2)} > ${o.h.toFixed(2)}): ${s.slice(0, 60)}`);
  }
  function txt(sl, text, o) {
    const opts = Object.assign({ isTextBox: true, margin: 0, valign: "top", color: TEXT, fontSize: 14, objectName: nm("text") }, o);
    fit(text, opts);
    delete opts.noFit;
    sl.addText(text, opts);
  }
  function dot(sl, x, y, d, fill, label, o = {}) {
    sl.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: o.line ? { color: o.line, width: 1 } : { type: "none" }, objectName: nm("dot") });
    if (label !== undefined && label !== null && label !== "") {
      sl.addText(String(label), { x, y, w: d, h: d, align: "center", valign: "middle", margin: 0, isTextBox: true, fontSize: o.fontSize || 12, bold: true, color: o.textColor || WHITE, objectName: nm("dotlabel") });
    }
  }
  function box(sl, x, y, w, h, fill, line) {
    sl.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: line ? { color: line, width: 0.75 } : { type: "none" }, objectName: nm("box") });
  }
  function line(sl, x, y, w, h, o = {}) {
    const opt = { x, y, w: Math.abs(w), h: Math.abs(h), line: { color: o.color || RULE, width: o.width || 0.75 }, objectName: nm("line") };
    if (o.dash) opt.line.dashType = "dash";
    if (o.arrow) opt.line.endArrowType = "triangle";
    if (w < 0) { opt.x = x + w; opt.flipH = true; }
    if (h < 0) { opt.y = y + h; opt.flipV = true; }
    sl.addShape(pres.shapes.LINE, opt);
  }
  const border = () => [{ type: "solid", pt: 0.75, color: RULE_HEX }, { type: "none" }, { type: "solid", pt: 0.75, color: RULE_HEX }, { type: "none" }];
  function content(title, notes) {
    const sl = pres.addSlide({ masterName: "CONTENT" });
    slideNo += 1;
    sl.addText(title, { placeholder: "title" });
    fit(title, { w: W, h: 0.95, fontSize: 28, bold: true });
    if (notes) sl.addNotes(notes);
    return sl;
  }
  function lead(sl, t) {
    if (!t) return TOP;
    txt(sl, t, { x: L, y: 1.38, w: W, h: 0.5, fontSize: 16, color: GREY });
    return 2.0;
  }
  function dayDots(sl, x0, y, d, sp) {
    for (let i = 1; i <= 20; i++) {
      const x = x0 + (i - 1) * sp;
      if (i === D.day) dot(sl, x - 0.05, y - 0.05, d + 0.1, NAVY);
      else if (i < D.day) dot(sl, x, y, d, LIGHT);
      else dot(sl, x, y, d, WHITE, null, { line: GATES[i] || i === 20 ? NAVY : LIGHT });
    }
  }

  // ---------------------------------------------------------------- renderers
  const R_ = {};

  R_.points = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const items = s.points;
    const two = items.length > 5;
    const per = two ? Math.ceil(items.length / 2) : items.length;
    const cw = two ? (W - 0.6) / 2 : W;
    const rowH = Math.min(1.15, (BOTTOM - y0) / per);
    items.forEach(([h, b], i) => {
      const col = two ? Math.floor(i / per) : 0, row = two ? i % per : i;
      const x = L + col * (cw + 0.6), y = y0 + row * rowH;
      dot(sl, x, y + 0.03, 0.34, NAVY, s.numbered === false ? "" : i + 1, { fontSize: 12 });
      txt(sl, h, { x: x + 0.55, y, w: cw - 0.55, h: 0.36, fontSize: 18, bold: true, color: NAVY });
      if (b) txt(sl, b, { x: x + 0.55, y: y + 0.4, w: cw - 0.55, h: rowH - 0.48, fontSize: 15 });
    });
  };

  R_.columns = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const k = s.cols.length, gap = 0.3, cw = (W - (k - 1) * gap) / k;
    const h = (s.note ? BOTTOM - 0.55 : BOTTOM) - y0;
    s.cols.forEach(([head, body], i) => {
      const x = L + i * (cw + gap);
      box(sl, x, y0, cw, h, i === s.highlight ? NAVY : PALE);
      const hi = i === s.highlight;
      dot(sl, x + 0.22, y0 + 0.22, 0.4, hi ? WHITE : NAVY, s.labels ? s.labels[i] : i + 1, { textColor: hi ? NAVY : WHITE, fontSize: 13 });
      txt(sl, head, { x: x + 0.22, y: y0 + 0.78, w: cw - 0.44, h: 0.75, fontSize: 18, bold: true, color: hi ? WHITE : NAVY });
      txt(sl, body, { x: x + 0.22, y: y0 + 1.55, w: cw - 0.44, h: h - 1.7, fontSize: 15, color: hi ? WHITE : TEXT });
    });
    if (s.note) txt(sl, s.note, { x: L, y: BOTTOM - 0.4, w: W, h: 0.4, fontSize: 14, color: GREY });
  };

  R_.compare = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const cw = (W - 0.8) / 2;
    const bottom = s.verdict ? BOTTOM - 0.75 : BOTTOM;
    [s.left, s.right].forEach(([head, items], c) => {
      const x = L + c * (cw + 0.8);
      txt(sl, head, { x, y: y0, w: cw, h: 0.45, fontSize: 20, bold: true, color: c === 0 ? GREY : NAVY });
      const rh = Math.min(items.length === 1 ? 2.6 : 0.95, (bottom - y0 - 0.65) / items.length);
      items.forEach((it, i) => {
        const y = y0 + 0.65 + i * rh;
        dot(sl, x, y + 0.09, 0.16, c === 0 ? WHITE : NAVY, null, { line: c === 0 ? GREY : null });
        txt(sl, it, { x: x + 0.35, y, w: cw - 0.35, h: rh - 0.08, fontSize: 15, color: c === 0 ? GREY : TEXT });
      });
    });
    line(sl, L + cw + 0.4, y0, 0, bottom - y0);
    if (s.verdict) {
      box(sl, L, BOTTOM - 0.6, W, 0.6, PALE);
      txt(sl, s.verdict, { x: L + 0.25, y: BOTTOM - 0.5, w: W - 0.5, h: 0.42, fontSize: 15, bold: true, color: NAVY, valign: "middle" });
    }
  };

  R_.steps = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead) + 0.1;
    const k = s.steps.length, cw = W / k;
    line(sl, L + 0.2, y0 + 0.22, cw * (k - 1), 0, { color: LIGHT, width: 1.5 });
    s.steps.forEach(([h, b], i) => {
      const x = L + i * cw;
      const big = k < 6;
      dot(sl, x, y0, 0.44, NAVY, i + 1, { fontSize: 14 });
      const hh = s.tallHeads ? 1.0 : 0.75;
      txt(sl, h, { x, y: y0 + 0.65, w: cw - (big ? 0.3 : 0.12), h: hh, fontSize: big ? 17 : 14, bold: true, color: NAVY });
      txt(sl, b, { x, y: y0 + 0.75 + hh, w: cw - (big ? 0.3 : 0.12), h: (s.note ? BOTTOM - 0.55 : BOTTOM) - y0 - 0.8 - hh, fontSize: big ? 15 : 14 });
    });
    if (s.note) txt(sl, s.note, { x: L, y: BOTTOM - 0.4, w: W, h: 0.4, fontSize: 14, color: GREY });
  };

  R_.tree = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const bottom = s.note ? BOTTOM - 0.5 : BOTTOM;
    const k = s.branches.length, slot = (bottom - y0) / k;
    const rx = L, rw = 2.5, bx = L + 3.0, bw = 3.3, lx = bx + bw + 0.45, lw = R - lx;
    const rh = Math.min(1.6, bottom - y0), ry = y0 + (bottom - y0 - rh) / 2;
    box(sl, rx, ry, rw, rh, NAVY);
    txt(sl, s.root, { x: rx + 0.15, y: ry + 0.1, w: rw - 0.3, h: rh - 0.2, fontSize: 15, bold: true, color: WHITE, valign: "middle" });
    const midx = rx + rw + 0.25;
    line(sl, rx + rw, ry + rh / 2, 0.25, 0, { color: MID, width: 1 });
    const firstC = y0 + slot / 2, lastC = y0 + slot * (k - 0.5);
    line(sl, midx, firstC, 0, lastC - firstC, { color: MID, width: 1 });
    s.branches.forEach(([label, leaves], i) => {
      const cy = y0 + slot * (i + 0.5), bh = Math.min(slot - 0.12, 1.0);
      line(sl, midx, cy, bx - midx, 0, { color: MID, width: 1 });
      box(sl, bx, cy - bh / 2, bw, bh, PALE);
      txt(sl, label, { x: bx + 0.15, y: cy - bh / 2 + 0.05, w: bw - 0.3, h: bh - 0.1, fontSize: 15, bold: true, color: NAVY, valign: "middle" });
      if (leaves && leaves.length) {
        line(sl, bx + bw, cy, 0.3, 0, { color: LIGHT, width: 1 });
        const t = leaves.map((lf, j) => ({ text: lf, options: { breakLine: j < leaves.length - 1 } }));
        txt(sl, t, { x: lx, y: cy - (slot - 0.1) / 2, w: lw, h: slot - 0.1, fontSize: 14, valign: "middle", paraSpaceAfter: 2 });
      }
    });
    if (s.note) txt(sl, s.note, { x: L, y: BOTTOM - 0.38, w: W, h: 0.38, fontSize: 13, color: GREY });
  };

  R_.matrix = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const mx = L + 0.55, my = y0, mw = s.note ? 6.6 : 10.9, mh = BOTTOM - y0 - 0.5;
    const qw = mw / 2 - 0.05, qh = mh / 2 - 0.05;
    const pos = [[mx, my], [mx + mw / 2 + 0.05, my], [mx, my + mh / 2 + 0.05], [mx + mw / 2 + 0.05, my + mh / 2 + 0.05]];
    s.quads.forEach(([h, b], i) => {
      const [x, y] = pos[i];
      const hi = s.highlight === i;
      box(sl, x, y, qw, qh, hi ? NAVY : PALE);
      txt(sl, h, { x: x + 0.18, y: y + 0.14, w: qw - 0.36, h: 0.4, fontSize: 16, bold: true, color: hi ? WHITE : NAVY });
      txt(sl, b, { x: x + 0.18, y: y + 0.58, w: qw - 0.36, h: qh - 0.7, fontSize: 14, color: hi ? WHITE : TEXT });
    });
    // axes
    txt(sl, s.y[0], { x: L - 0.35 - 1.6, y: my + mh / 2 - 0.2, w: 3.2, h: 0.4, fontSize: 13, bold: true, color: BLUE, rotate: 270, align: "center", valign: "middle", noFit: true });
    txt(sl, `${s.y[2]}`, { x: L, y: my, w: 0.5, h: 0.3, fontSize: 11, color: GREY, noFit: true });
    txt(sl, `${s.y[1]}`, { x: L, y: my + mh - 0.3, w: 0.5, h: 0.3, fontSize: 11, color: GREY, noFit: true });
    txt(sl, s.x[0], { x: mx, y: my + mh + 0.12, w: mw, h: 0.3, fontSize: 13, bold: true, color: BLUE, align: "center" });
    txt(sl, s.x[1], { x: mx, y: my + mh + 0.12, w: 2, h: 0.3, fontSize: 11, color: GREY, noFit: true });
    txt(sl, s.x[2], { x: mx + mw - 2, y: my + mh + 0.12, w: 2, h: 0.3, fontSize: 11, color: GREY, align: "right", noFit: true });
    if (s.note) {
      const nx = mx + mw + 0.45;
      txt(sl, s.note, { x: nx, y: my, w: R - nx, h: mh, fontSize: 15 });
    }
  };

  R_.table = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const rows = s.rows.length;
    const fsz = s.fontSize || (rows > 7 ? 13 : 14);
    const colW = s.colW || s.header.map(() => W / s.header.length);
    const head = s.header.map((h) => ({ text: h, options: { bold: true, color: NAVY, fill: { color: PALE }, border: border(), fontSize: fsz } }));
    const body = s.rows.map((r, ri) => r.map((c, j) => ({ text: c, options: { fontSize: fsz, color: TEXT, border: border(), bold: j === 0 && !!s.boldFirst, fill: s.highlightRows && s.highlightRows.includes(ri) ? { color: PALE } : undefined } })));
    const avail = (s.note ? BOTTOM - 0.5 : BOTTOM) - y0;
    const rowH = Math.min(0.62, avail / (rows + 1));
    sl.addTable([head, ...body], { x: L, y: y0, w: W, colW, rowH, margin: [0.04, 0.08, 0.04, 0.08], valign: "middle", objectName: nm("table") });
    // rough fit check per cell
    s.rows.forEach((r) => r.forEach((c, j) => fit(c, { w: colW[j] - 0.16, h: rowH * 1.9, fontSize: fsz })));
    if (s.note) txt(sl, s.note, { x: L, y: BOTTOM - 0.4, w: W, h: 0.4, fontSize: 13, color: GREY });
  };

  R_.chain = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead) + 0.2;
    const k = s.nodes.length, gap = 0.42, cw = (W - (k - 1) * gap) / k, h = 2.6;
    s.nodes.forEach(([head, body], i) => {
      const x = L + i * (cw + gap);
      box(sl, x, y0, cw, h, i === s.highlight ? NAVY : PALE);
      const hi = i === s.highlight;
      txt(sl, head, { x: x + 0.15, y: y0 + 0.15, w: cw - 0.3, h: 0.7, fontSize: 15, bold: true, color: hi ? WHITE : NAVY });
      txt(sl, body, { x: x + 0.15, y: y0 + 0.9, w: cw - 0.3, h: h - 1.0, fontSize: 14, color: hi ? WHITE : TEXT });
      if (i < k - 1) {
        const broken = s.break === i;
        line(sl, x + cw + 0.04, y0 + h / 2, gap - 0.08, 0, { color: broken ? NAVY : MID, width: broken ? 2 : 1.25, arrow: true, dash: broken });
        if (broken) {
          dot(sl, x + cw + gap / 2 - 0.17, y0 + h + 0.15, 0.34, NAVY, "!", { fontSize: 14 });
        }
      }
    });
    const ny = y0 + h + 0.65;
    if (s.note) txt(sl, s.note, { x: L, y: ny, w: W, h: BOTTOM - ny, fontSize: 15 });
  };

  R_.loop = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const cx = L + 3.3, cy = y0 + (BOTTOM - y0) / 2, rx = 2.45, ry = (BOTTOM - y0) / 2 - 0.55;
    const k = s.nodes.length, bw = 2.3, bh = 0.85;
    const pts = s.nodes.map((_, i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / k;
      return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
    });
    pts.forEach(([x, y], i) => {
      const [x2, y2] = pts[(i + 1) % k];
      const dx = x2 - x, dy = y2 - y, len = Math.hypot(dx, dy);
      const sx = x + dx * (0.36), sy = y + dy * (0.36), ex = x + dx * 0.64, ey = y + dy * 0.64;
      line(sl, sx, sy, ex - sx, ey - sy, { color: MID, width: 1.5, arrow: true });
      const sign = s.signs ? s.signs[i] : "+";
      txt(sl, sign, { x: (sx + ex) / 2 + (dy / len) * 0.3 - 0.15, y: (sy + ey) / 2 - (dx / len) * 0.3 - 0.15, w: 0.3, h: 0.3, fontSize: 16, bold: true, color: NAVY, align: "center", noFit: true });
    });
    pts.forEach(([x, y], i) => {
      box(sl, x - bw / 2, y - bh / 2, bw, bh, PALE);
      txt(sl, s.nodes[i], { x: x - bw / 2 + 0.1, y: y - bh / 2 + 0.05, w: bw - 0.2, h: bh - 0.1, fontSize: 14, bold: true, color: NAVY, align: "center", valign: "middle" });
    });
    dot(sl, cx - 0.4, cy - 0.4, 0.8, NAVY, s.kind || "R", { fontSize: 22 });
    const nx = L + 7.2;
    txt(sl, s.kindLabel || "Reinforcing loop", { x: nx, y: y0, w: R - nx, h: 0.4, fontSize: 18, bold: true, color: NAVY });
    if (s.note) txt(sl, s.note, { x: nx, y: y0 + 0.5, w: R - nx, h: BOTTOM - y0 - 0.5, fontSize: 15 });
  };

  R_.fishbone = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const sy = y0 + (BOTTOM - y0) / 2, ex = 10.3;
    line(sl, L, sy, ex - L, 0, { color: NAVY, width: 2, arrow: true });
    box(sl, ex + 0.05, sy - 0.8, R - ex - 0.05, 1.6, NAVY);
    txt(sl, s.effect, { x: ex + 0.15, y: sy - 0.72, w: R - ex - 0.25, h: 1.44, fontSize: 14, bold: true, color: WHITE, valign: "middle" });
    const top = s.bones.slice(0, Math.ceil(s.bones.length / 2)), bot = s.bones.slice(Math.ceil(s.bones.length / 2));
    const span = ex - L - 0.4;
    [[top, -1], [bot, 1]].forEach(([bones, dir]) => {
      const k = bones.length, step = span / k;
      bones.forEach(([cat, causes], i) => {
        const jx = L + 0.4 + step * (i + 0.75), jy = sy;
        const tx = jx - 0.9, ty = dir < 0 ? y0 + 0.45 : BOTTOM - 0.45;
        line(sl, tx, ty, jx - tx, jy - ty, { color: MID, width: 1.25 });
        txt(sl, cat, { x: tx - 1.0, y: dir < 0 ? ty - 0.42 : ty + 0.02, w: 2.2, h: 0.4, fontSize: 15, bold: true, color: NAVY, align: "center" });
        const t = causes.map((c, j) => ({ text: c, options: { breakLine: j < causes.length - 1 } }));
        const bw = Math.min(2.1, tx - L - 0.05 + (dir < 0 ? 0 : 0.2));
        if (dir < 0) {
          txt(sl, t, { x: tx - 0.1 - bw, y: ty + 0.08, w: bw, h: sy - ty - 0.3, fontSize: 13, align: "right" });
        } else {
          txt(sl, t, { x: tx + 0.1 - bw, y: sy + 0.25, w: bw, h: ty - sy - 0.35, fontSize: 13, align: "right", valign: "bottom" });
        }
      });
    });
  };

  R_.statement = (s) => {
    const sl = content(s.title, s.notes);
    dot(sl, L, 2.25, 0.22, NAVY);
    txt(sl, s.big, { x: L + 0.45, y: 2.05, w: W - 0.6, h: 2.2, fontSize: 28, bold: true, color: NAVY });
    if (s.sub) txt(sl, s.sub, { x: L + 0.45, y: 4.45, w: W - 1.2, h: 1.9, fontSize: 18, color: TEXT });
  };

  R_.canvas = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    const cols = s.cols || 3, k = s.cells.length, rows = Math.ceil(k / cols), gap = 0.18;
    const cw = (W - (cols - 1) * gap) / cols, ch = (BOTTOM - y0 - (rows - 1) * gap) / rows;
    s.cells.forEach(([label, t], i) => {
      const x = L + (i % cols) * (cw + gap), y = y0 + Math.floor(i / cols) * (ch + gap);
      box(sl, x, y, cw, ch, WHITE, RULE);
      txt(sl, label, { x: x + 0.15, y: y + 0.1, w: cw - 0.3, h: 0.3, fontSize: 13, bold: true, color: BLUE });
      txt(sl, t, { x: x + 0.15, y: y + 0.45, w: cw - 0.3, h: ch - 0.55, fontSize: 14 });
    });
  };

  R_.pyramid = (s) => {
    const sl = content(s.title, s.notes);
    const y0 = lead(sl, s.lead);
    box(sl, L + 1.2, y0, W - 2.4, 0.95, NAVY);
    txt(sl, s.top, { x: L + 1.4, y: y0 + 0.08, w: W - 2.8, h: 0.8, fontSize: 16, bold: true, color: WHITE, align: "center", valign: "middle" });
    const k = s.keys.length, gap = 0.3, cw = (W - (k - 1) * gap) / k, ky = y0 + 1.45;
    line(sl, L + cw / 2, ky - 0.25, W - cw, 0, { color: MID });
    line(sl, L + W / 2, y0 + 0.95, 0, 0.25, { color: MID });
    s.keys.forEach((kt, i) => {
      const x = L + i * (cw + gap);
      line(sl, x + cw / 2, ky - 0.25, 0, 0.25, { color: MID });
      box(sl, x, ky, cw, 1.0, PALE);
      txt(sl, kt, { x: x + 0.15, y: ky + 0.08, w: cw - 0.3, h: 0.85, fontSize: 15, bold: true, color: NAVY, valign: "middle" });
      if (s.support && s.support[i]) {
        const t = s.support[i].map((c, j) => ({ text: c, options: { breakLine: j < s.support[i].length - 1, bullet: { indent: 12 } } }));
        txt(sl, t, { x: x + 0.05, y: ky + 1.2, w: cw - 0.1, h: BOTTOM - ky - 1.2, fontSize: 14, paraSpaceAfter: 4 });
      }
    });
  };

  // ---------------------------------------------------------------- auto slides
  function cover() {
    const sl = pres.addSlide({ masterName: "COVER" });
    slideNo += 1;
    txt(sl, `Day ${D.day} · Week ${D.week} · ${WEEKS[D.week]}`, { x: L, y: 1.2, w: 9, h: 0.4, fontSize: 15, bold: true, color: BLUE });
    sl.addText(D.title, { placeholder: "title" });
    sl.addText(D.question, { placeholder: "body" });
    fit(D.question, { w: 11, h: 1.0, fontSize: 20 });
    dayDots(sl, L, 5.6, 0.2, 0.42);
    const gate = GATES[D.day] ? ` · Gate ${GATES[D.day]} submission today` : "";
    txt(sl, `Day ${D.day} of 20${gate}`, { x: L, y: 5.95, w: 9, h: 0.3, fontSize: 12, color: GREY });
    txt(sl, "Policy & Strategy Lab", { x: L, y: 6.85, w: 6, h: 0.3, fontSize: 12, color: GREY });
    sl.addNotes(D.cover_notes || `Open by reading the central question aloud: ${D.question}`);
  }

  function today() {
    const sl = content("Today", `Session outcome: by the end of the session each participant has ${D.outcome}.`);
    txt(sl, "By the end of today, you will have", { x: L, y: 1.45, w: 6.6, h: 0.35, fontSize: 15, color: GREY });
    txt(sl, D.outcome.charAt(0).toUpperCase() + D.outcome.slice(1) + ".", { x: L, y: 1.85, w: 6.6, h: 1.55, fontSize: 19, bold: true, color: NAVY });
    D.objectives.forEach((o, i) => {
      const y = 3.55 + i * 0.62;
      dot(sl, L, y + 0.07, 0.16, NAVY);
      txt(sl, o, { x: L + 0.35, y, w: 6.25, h: 0.58, fontSize: 14 });
    });
    txt(sl, `Competencies: ${D.competencies.join(" · ")}`, { x: L, y: 6.35, w: 6.6, h: 0.3, fontSize: 12, color: BLUE, bold: true });
    // timing strip
    const tx = 8.0, tw = R - tx;
    txt(sl, "Session plan", { x: tx, y: 1.45, w: tw, h: 0.35, fontSize: 15, color: GREY });
    const total = D.timing.reduce((a, t) => a + t[1], 0), avail = 4.85;
    let y = 1.9;
    D.timing.forEach(([lab, mins]) => {
      const h = Math.max(0.42, (mins / total) * avail);
      box(sl, tx, y, 0.12, h - 0.06, /activity|own case|workbook|challenge|pod|present/i.test(lab) ? NAVY : LIGHT);
      txt(sl, `${mins} min`, { x: tx + 0.25, y: y + (h - 0.06) / 2 - 0.15, w: 0.9, h: 0.3, fontSize: 12, color: GREY, noFit: true });
      txt(sl, lab, { x: tx + 1.15, y: y + (h - 0.06) / 2 - 0.15, w: tw - 1.15, h: 0.3, fontSize: 14, bold: true, color: NAVY, noFit: true });
      y += h;
    });
  }

  function theory() {
    if (!D.theory) return;
    const [who, work, q, gloss] = D.theory;
    const sl = content("A thinker for your case", `Theory link. ${who}, ${work}. ${gloss || ""} Put the question to the room, then ask each participant to answer it for their own case in one sentence.`);
    box(sl, L, 1.65, 4.6, 4.9, PALE);
    dot(sl, L + 0.3, 1.95, 0.3, NAVY);
    txt(sl, who, { x: L + 0.3, y: 2.45, w: 4.0, h: 1.0, fontSize: 24, bold: true, color: NAVY });
    txt(sl, work, { x: L + 0.3, y: 3.5, w: 4.0, h: 0.9, fontSize: 14, italic: true, color: GREY });
    if (gloss) txt(sl, gloss, { x: L + 0.3, y: 4.45, w: 4.0, h: 1.95, fontSize: 14 });
    txt(sl, "The question it puts to your case", { x: 6.0, y: 1.75, w: 6.5, h: 0.35, fontSize: 15, color: GREY });
    txt(sl, q, { x: 6.0, y: 2.25, w: 6.5, h: 2.6, fontSize: 26, bold: true, color: NAVY });
    txt(sl, "Answer it in one sentence in your workbook today.", { x: 6.0, y: 5.6, w: 6.5, h: 0.4, fontSize: 14, color: BLUE });
  }

  function activity() {
    const A = D.activity;
    const sl = content(`Activity: ${A.name}`, `Facilitation. ${A.facilitation || ""} Debrief questions: ${A.debrief.join(" ")}`);
    txt(sl, A.purpose, { x: L, y: 1.38, w: W, h: 0.5, fontSize: 16, color: GREY });
    const lw = 5.3;
    box(sl, L, 2.0, lw, 4.05, PALE);
    txt(sl, "Scenario", { x: L + 0.25, y: 2.15, w: lw - 0.5, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    txt(sl, A.scenario_short || A.scenario, { x: L + 0.25, y: 2.5, w: lw - 0.5, h: 3.5, fontSize: 15 });
    const sx = L + lw + 0.45, sw = R - sx;
    txt(sl, "What to do", { x: sx, y: 2.0, w: sw, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    const steps = A.steps.slice(0, 5), rh = Math.min(0.82, 3.7 / steps.length);
    steps.forEach((st, i) => {
      const y = 2.4 + i * rh;
      dot(sl, sx, y + 0.02, 0.3, NAVY, i + 1, { fontSize: 11 });
      txt(sl, st, { x: sx + 0.45, y, w: sw - 0.45, h: rh - 0.06, fontSize: 14 });
    });
    const chips = [["Time", A.time], ["Groups", A.group], ["Output", A.output]];
    const cw = W / 3;
    chips.forEach(([k, v], i) => {
      const x = L + i * cw;
      txt(sl, [{ text: `${k}  `, options: { bold: true, color: BLUE } }, { text: v, options: { color: TEXT } }], { x, y: 6.2, w: cw - 0.2, h: 0.62, fontSize: 13 });
    });
  }

  function workbook() {
    const Wk = D.worksheet;
    const sl = content(`Your case: Worksheet ${Wk.id}`, `Individual application, about 20 minutes. Circulate and check that every participant is working on their own case, not the common case. ${Wk.guidance || ""}`);
    txt(sl, Wk.title, { x: L, y: 1.38, w: W, h: 0.45, fontSize: 18, bold: true, color: BLUE });
    const steps = Wk.instructions.slice(0, 5), rh = Math.min(0.85, 3.9 / steps.length);
    steps.forEach((st, i) => {
      const y = 2.05 + i * rh;
      dot(sl, L, y + 0.02, 0.32, NAVY, i + 1, { fontSize: 11 });
      txt(sl, st, { x: L + 0.5, y, w: 7.2, h: rh - 0.06, fontSize: 15 });
    });
    const bx = 8.65, bw = R - bx;
    box(sl, bx, 2.05, bw, 4.0, PALE);
    txt(sl, "Hand in", { x: bx + 0.25, y: 2.2, w: bw - 0.5, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    txt(sl, Wk.submit, { x: bx + 0.25, y: 2.55, w: bw - 0.5, h: 1.6, fontSize: 14 });
    txt(sl, "Quality check", { x: bx + 0.25, y: 4.2, w: bw - 0.5, h: 0.3, fontSize: 13, bold: true, color: BLUE });
    txt(sl, Wk.checklist[0], { x: bx + 0.25, y: 4.55, w: bw - 0.5, h: 1.4, fontSize: 14 });
    txt(sl, "Tag every claim in your Analyst's Ledger: fact, inference, assumption or hypothesis.", { x: L, y: 6.2, w: 7.7, h: 0.4, fontSize: 13, color: GREY });
  }

  function takeaways() {
    const sl = content("What to take away", "Ask two participants to state, in their own words, the takeaway they found least obvious. Then close with the exit task.");
    D.takeaways.forEach((t, i) => {
      const y = 1.65 + i * 0.9;
      dot(sl, L, y + 0.03, 0.34, NAVY, i + 1, { fontSize: 12 });
      txt(sl, t, { x: L + 0.6, y, w: W - 0.6, h: 0.82, fontSize: 18, color: TEXT });
    });
    box(sl, L, 5.75, W, 0.85, PALE);
    txt(sl, [{ text: "Exit task  ", options: { bold: true, color: BLUE } }, { text: D.exit, options: { color: NAVY } }], { x: L + 0.25, y: 5.83, w: W - 0.5, h: 0.7, fontSize: 15, valign: "middle" });
  }

  function next() {
    const sl = content("Before the next session", "Remind participants where the independent task sits in their workbook and when it is due.");
    txt(sl, "Independent work", { x: L, y: 1.6, w: 6.6, h: 0.35, fontSize: 15, bold: true, color: BLUE });
    txt(sl, D.independent, { x: L, y: 2.0, w: 6.6, h: 2.6, fontSize: 16 });
    const rx = 8.0, rw = R - rx;
    txt(sl, "Read", { x: rx, y: 1.6, w: rw, h: 0.35, fontSize: 15, bold: true, color: BLUE });
    const rd = D.readings.essential.length ? D.readings.essential : ["No set reading today."];
    rd.forEach((r, i) => txt(sl, r, { x: rx, y: 2.0 + i * 1.05, w: rw, h: 0.98, fontSize: 13 }));
    line(sl, L, 5.1, W, 0);
    if (D.day < 20) {
      const nx = DAYS.find((d) => d.day === D.day + 1);
      txt(sl, "Next", { x: L, y: 5.35, w: 2, h: 0.35, fontSize: 15, bold: true, color: BLUE });
      txt(sl, `Day ${D.day + 1}: ${nx ? nx.title : ""}`, { x: L, y: 5.75, w: W, h: 0.45, fontSize: 20, bold: true, color: NAVY });
      txt(sl, D.next, { x: L, y: 6.2, w: W, h: 0.4, fontSize: 14, color: GREY });
    } else {
      txt(sl, D.next, { x: L, y: 5.4, w: W, h: 1.0, fontSize: 16, color: NAVY });
    }
  }

  // ---------------------------------------------------------------- assemble
  cover();
  today();
  const auto = { theory, activity, workbook };
  for (const s of D.slides) {
    if (auto[s.type]) auto[s.type]();
    else if (R_[s.type]) R_[s.type](s);
    else warnings.push(`Day ${D.day}: unknown slide type ${s.type}`);
  }
  takeaways();
  next();
  return pres;
}

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  for (const D of DAYS) {
    if (ONLY.length && !ONLY.includes(String(D.day))) continue;
    const pres = buildDeck(D);
    const file = path.join(OUTDIR, `Day ${String(D.day).padStart(2, "0")} - ${D.title}.pptx`);
    await pres.writeFile({ fileName: file });
    await applyTheme(file, THEME);
    console.log("wrote", path.basename(file));
  }
  if (warnings.length) { console.log("WARNINGS:"); warnings.forEach((w) => console.log("  " + w)); }
})();
