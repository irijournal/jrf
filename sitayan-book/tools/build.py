#!/usr/bin/env python3
"""Build the manuscript: chapters/*.md -> build/The-Many-Lives-of-Sita.docx

Styles follow the author's stylesheet (src/css/app.css, light theme):
ink #172033, accent #2F43A8, accent-soft #E3E7FA, copper #A85A26, muted #56617A, line #D8DEE9;
display font Bricolage Grotesque, body font Lexend (Word substitutes if they are not installed).
"""
import glob, os, re, subprocess, sys
from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Cm

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(BASE, "build")
os.makedirs(BUILD, exist_ok=True)
INK, ACCENT, SOFT, COPPER, MUTED, LINE = "172033", "2F43A8", "E3E7FA", "A85A26", "56617A", "D8DEE9"
BODY, DISPLAY = "Lexend", "Bricolage Grotesque"

def rgb(h): return RGBColor.from_string(h)

def set_font(style, name, size=None, color=None, bold=None, italic=None):
    f = style.font
    f.name = name
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts"); rpr.append(rfonts)
    for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(a), name)
    if size: f.size = Pt(size)
    if color: f.color.rgb = rgb(color)
    if bold is not None: f.bold = bold
    if italic is not None: f.italic = italic

def shade(style, fill):
    ppr = style.element.get_or_add_pPr()
    shd = OxmlElement("w:shd"); shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), fill)
    ppr.append(shd)

def border(style, side, color, sz=12, space=6):
    ppr = style.element.get_or_add_pPr()
    pbdr = ppr.find(qn("w:pBdr"))
    if pbdr is None:
        pbdr = OxmlElement("w:pBdr"); ppr.append(pbdr)
    b = OxmlElement(f"w:{side}"); b.set(qn("w:val"), "single"); b.set(qn("w:sz"), str(sz)); b.set(qn("w:space"), str(space)); b.set(qn("w:color"), color)
    pbdr.append(b)

def make_reference(path):
    raw = os.path.join(BUILD, "pandoc-default.docx")
    with open(raw, "wb") as fh:
        fh.write(subprocess.run(["pandoc", "--print-default-data-file", "reference.docx"], capture_output=True, check=True).stdout)
    d = Document(raw)
    class _St:
        def __init__(self, styles): self.s = styles
        def __iter__(self): return iter(self.s)
        def __getitem__(self, name):
            for x in self.s:
                if x.name and (x.name.lower() == name.lower() or (x.style_id or "").lower() == name.replace(" ", "").lower()):
                    return x
            raise KeyError(name)
        def add_style(self, *a, **k): return self.s.add_style(*a, **k)
    st = _St(d.styles)
    names = {(x.name or "").lower() for x in d.styles} | {(x.style_id or "").lower() for x in d.styles}
    sec = d.sections[0]
    sec.page_width, sec.page_height = Cm(15.6), Cm(23.4)  # royal octavo
    sec.left_margin = sec.right_margin = Cm(2.0); sec.top_margin = Cm(2.2); sec.bottom_margin = Cm(2.2)
    for name in ("Normal", "Body Text", "First Paragraph", "Compact"):
        if name.lower() in names or name.replace(" ", "").lower() in names:
            s = st[name]; set_font(s, BODY, 10.5, INK)
            s.paragraph_format.line_spacing = 1.35
            s.paragraph_format.space_after = Pt(6)
    if "body text" in names:
        st["Body Text"].paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        st["First Paragraph"].paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    for name, size, color in (("Title", 30, INK), ("Subtitle", 15, ACCENT), ("Author", 13, MUTED)):
        if name.lower() in names or name.replace(" ", "").lower() in names:
            set_font(st[name], DISPLAY, size, color, bold=(name == "Title"))
    for lvl, size, color in ((1, 22, INK), (2, 14, ACCENT), (3, 12, INK), (4, 11, MUTED)):
        s = st[f"Heading {lvl}"]
        set_font(s, DISPLAY, size, color, bold=True, italic=False)
        s.paragraph_format.space_before = Pt(18 if lvl == 1 else 12)
        s.paragraph_format.space_after = Pt(8)
        if lvl == 1:
            s.paragraph_format.page_break_before = True
            border(s, "bottom", ACCENT, sz=8, space=6)
    for name in ("Footnote Text",):
        if name.lower() in names or name.replace(" ", "").lower() in names:
            set_font(st[name], BODY, 8.5, INK)
    for name in ("Image Caption", "Caption", "Table Caption"):
        if name.lower() in names or name.replace(" ", "").lower() in names:
            set_font(st[name], BODY, 8.5, MUTED, italic=True)
    if "block text" in names or "blocktext" in names:
        s = st["Block Text"]; set_font(s, BODY, 10, INK)
        s.paragraph_format.left_indent = Cm(0.8); s.paragraph_format.right_indent = Cm(0.5)
        border(s, "left", LINE, sz=16, space=10)
    # custom paragraph styles used by ::: {custom-style="..."}
    def para_style(name, base="Normal"):
        if name.lower() in names or name.replace(" ", "").lower() in names:
            return st[name]
        s = st.add_style(name, WD_STYLE_TYPE.PARAGRAPH); s.base_style = st[base]; return s
    ep = para_style("Epigraph"); set_font(ep, BODY, 9.5, MUTED, italic=True)
    ep.paragraph_format.left_indent = Cm(3.0); ep.paragraph_format.space_after = Pt(8)
    bt = para_style("Box Title"); set_font(bt, DISPLAY, 10.5, ACCENT, bold=True)
    shade(bt, SOFT); border(bt, "left", ACCENT, sz=24, space=8)
    bt.paragraph_format.space_before = Pt(10); bt.paragraph_format.space_after = Pt(0); bt.paragraph_format.keep_with_next = True
    bx = para_style("Box"); set_font(bx, BODY, 9.5, INK)
    shade(bx, SOFT); border(bx, "left", ACCENT, sz=24, space=8)
    bx.paragraph_format.space_after = Pt(10); bx.paragraph_format.line_spacing = 1.3
    d.save(path)

def assemble():
    files = sorted(glob.glob(os.path.join(BASE, "chapters", "*.md")))
    parts, missing = [], []
    for f in files:
        txt = open(f, encoding="utf-8").read()
        if not f.endswith("00-front.md"):
            txt = re.sub(r"^---\n.*?\n---\n", "", txt, flags=re.S)
        def keep(m):
            p = os.path.normpath(os.path.join(BASE, "chapters", m.group(2)))
            if os.path.exists(p):
                return m.group(0)
            missing.append(m.group(2)); return ""
        txt = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", keep, txt)
        parts.append(txt.strip() + "\n\n")
    out = os.path.join(BUILD, "manuscript.md")
    open(out, "w", encoding="utf-8").write("\n".join(parts))
    return out, missing

if __name__ == "__main__":
    ref = os.path.join(BUILD, "reference.docx")
    make_reference(ref)
    md, missing = assemble()
    target = os.path.join(BUILD, "The-Many-Lives-of-Sita.docx")
    subprocess.run(["pandoc", md, "-f", "markdown+smart", "-o", target, "--reference-doc", ref,
                    "--resource-path", os.path.join(BASE, "chapters")], check=True)
    words = len(open(md, encoding="utf-8").read().split())
    print("built", target, "| words in manuscript.md:", words)
    if missing:
        print("images skipped (not yet downloaded):", sorted(set(missing)))
