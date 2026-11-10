"""Markdown to styled Word (and PDF) for the Policy & Strategy Lab.

Conventions in the markdown sources:
  # Title            first H1 becomes the document title
  ## Subtitle        an H2 directly after it becomes the subtitle
  ---                dropped (no horizontal rules)
  \\newpage          page break
  [[box: Label | n]] a writing box: a one-column table with n ruled empty rows
Empty table rows are given writing height, so templates can be filled in by hand or in Word.
"""
import re
import statistics
import subprocess
import sys
from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

HERE = Path(__file__).parent
SOFFICE = Path("/root/.claude/skills/synced/f218a6be-6141-4f23-a687-cb058014c616_1248a252-a28d-4416-8d9c-de5f5eefcbdb/docx/scripts/office/soffice.py")

FONT = "Arial"
NAVY = RGBColor(0x12, 0x3B, 0x63)
BLUE = RGBColor(0x2F, 0x5F, 0x8F)
TEXT = RGBColor(0x20, 0x2B, 0x36)
GREY = RGBColor(0x66, 0x74, 0x82)
PALE = "EAF1F7"
RULE = "D7E0E8"
PAGEBREAK = '```{=openxml}\n<w:p><w:r><w:br w:type="page"/></w:r></w:p>\n```'


# ------------------------------------------------------------------ markdown
def prepare_markdown(text):
    lines = text.splitlines()
    title = subtitle = None
    out = []
    for line in lines:
        if title is None and line.startswith("# "):
            title = line[2:].strip()
            continue
        if subtitle is None and title is not None and line.startswith("## ") and not any(l.strip() for l in out):
            subtitle = line[3:].strip()
            continue
        if line.strip() == "---":
            continue
        if line.strip() == "\\newpage":
            out.append("")
            out.append(PAGEBREAK)
            out.append("")
            continue
        m = re.match(r"^\[\[box:\s*(.*?)\s*\|\s*(\d+)\s*\]\]$", line.strip())
        if m:
            label, rows = m.group(1), int(m.group(2))
            out.append("")
            out.append(f"| {label} |")
            out.append("|---|")
            for _ in range(rows):
                out.append("|   |")
            out.append("")
            continue
        out.append(line)
    body = "\n".join(out)
    body = re.sub(r"(?m)^- (\d+)\. ", r"- \1\\. ", body)
    body = body.replace("| | |\n|---|---|", "| Item | Detail |\n|---|---|")
    if title and not subtitle and ":" in title:
        title, subtitle = [p.strip() for p in title.split(":", 1)]
    return title or "", subtitle or "", body


# ------------------------------------------------------------------ reference
def _set_style_font(style, size=None, bold=None, color=None, italic=None):
    style.font.name = FONT
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.insert(0, rfonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(attr), FONT)
    for attr in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
        if rfonts.get(qn(attr)) is not None:
            del rfonts.attrib[qn(attr)]
    if size is not None:
        style.font.size = Pt(size)
    if bold is not None:
        style.font.bold = bold
    if italic is not None:
        style.font.italic = italic
    if color is not None:
        style.font.color.rgb = color


def build_reference(path):
    subprocess.run(["pandoc", "-o", str(path), "--print-default-data-file", "reference.docx"], check=True)
    doc = Document(str(path))
    st = {s.name: s for s in doc.styles}
    for name in ("Normal", "Body Text", "First Paragraph", "Compact", "Block Text"):
        if name in st:
            _set_style_font(st[name], size=10.5, color=TEXT)
            pf = st[name].paragraph_format
            pf.space_after = Pt(6)
            pf.line_spacing = 1.15
    st["Compact"].paragraph_format.space_after = Pt(2)
    _set_style_font(st["Title"], size=28, bold=True, color=NAVY)
    st["Title"].paragraph_format.space_after = Pt(4)
    st["Title"].paragraph_format.alignment = 0
    _set_style_font(st["Subtitle"], size=16, bold=False, color=BLUE)
    st["Subtitle"].paragraph_format.space_after = Pt(18)
    st["Subtitle"].paragraph_format.alignment = 0
    heads = {"Heading 1": (16, NAVY, 20, 6), "Heading 2": (13, BLUE, 14, 4), "Heading 3": (11, TEXT, 10, 3), "Heading 4": (10.5, BLUE, 8, 2)}
    for name, (size, color, before, after) in heads.items():
        _set_style_font(st[name], size=size, bold=True, color=color, italic=False)
        pf = st[name].paragraph_format
        pf.space_before = Pt(before)
        pf.space_after = Pt(after)
        pf.keep_with_next = True
    if "Block Text" in st:
        _set_style_font(st["Block Text"], size=10.5, color=NAVY, italic=False)
    if "Hyperlink" in st:
        st["Hyperlink"].font.color.rgb = BLUE
    doc.save(str(path))


# ------------------------------------------------------------------ tables
def _shade(cell, fill):
    tcpr = cell._tc.get_or_add_tcPr()
    for old in tcpr.findall(qn("w:shd")):
        tcpr.remove(old)
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    tcpr.append(shd)


def _borders(table, boxed=False):
    tblpr = table._tbl.tblPr
    for old in tblpr.findall(qn("w:tblBorders")):
        tblpr.remove(old)
    b = OxmlElement("w:tblBorders")
    edges = (("top", "single"), ("left", "single" if boxed else "nil"), ("bottom", "single"),
             ("right", "single" if boxed else "nil"), ("insideH", "single"), ("insideV", "single" if boxed else "nil"))
    for edge, val in edges:
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), val)
        if val != "nil":
            el.set(qn("w:sz"), "4")
            el.set(qn("w:space"), "0")
            el.set(qn("w:color"), "2F5F8F" if edge == "top" else RULE)
        b.append(el)
    tblpr.append(b)
    for old in tblpr.findall(qn("w:tblCellMar")):
        tblpr.remove(old)
    mar = OxmlElement("w:tblCellMar")
    for edge, w in (("top", 60), ("left", 90), ("bottom", 60), ("right", 90)):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:w"), str(w))
        el.set(qn("w:type"), "dxa")
        mar.append(el)
    tblpr.append(mar)


def _fit_columns(table, total):
    rows = table.rows
    ncols = len(table.columns)
    weights, mins = [], []
    for j in range(ncols):
        texts = []
        for r in rows:
            try:
                texts.append(r.cells[j].text.strip())
            except IndexError:
                texts.append("")
        lens = [len(t) for t in texts]
        mx, avg = (max(lens), statistics.mean(lens)) if lens else (0, 0)
        lw = max((len(w) for t in texts for w in t.split()), default=3)
        weights.append(max(0.55 * min(mx, 90) + 0.45 * avg, lw * 1.1, 5))
        mins.append(max(600, lw * 102 + 230))
    widths = [total * w / sum(weights) for w in weights]
    for _ in range(20):
        short = [j for j in range(ncols) if widths[j] < mins[j]]
        if not short:
            break
        for j in short:
            widths[j] = mins[j]
        fixed = sum(widths[j] for j in range(ncols) if widths[j] <= mins[j])
        flex = [j for j in range(ncols) if widths[j] > mins[j]]
        room = total - fixed
        if not flex or room <= 0:
            break
        ft = sum(widths[j] for j in flex)
        for j in flex:
            widths[j] = widths[j] * room / ft
    scale = total / sum(widths)
    widths = [int(w * scale) for w in widths]
    tbl = table._tbl
    tblpr = tbl.tblPr
    for tag in ("w:tblW", "w:tblLayout"):
        for old in tblpr.findall(qn(tag)):
            tblpr.remove(old)
    tw = OxmlElement("w:tblW")
    tw.set(qn("w:w"), str(sum(widths)))
    tw.set(qn("w:type"), "dxa")
    tblpr.append(tw)
    lay = OxmlElement("w:tblLayout")
    lay.set(qn("w:type"), "fixed")
    tblpr.append(lay)
    grid = tbl.tblGrid
    for gc in list(grid):
        grid.remove(gc)
    for w in widths:
        gc = OxmlElement("w:gridCol")
        gc.set(qn("w:w"), str(w))
        grid.append(gc)
    for r in rows:
        for j, cell in enumerate(r.cells):
            if j < len(widths):
                tcpr = cell._tc.get_or_add_tcPr()
                for old in tcpr.findall(qn("w:tcW")):
                    tcpr.remove(old)
                tcw = OxmlElement("w:tcW")
                tcw.set(qn("w:w"), str(widths[j]))
                tcw.set(qn("w:type"), "dxa")
                tcpr.insert(0, tcw)


def _style_table(table, total, size):
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    has_blank = any(all(not c.text.strip() for c in r.cells) for r in table.rows[1:])
    _borders(table, boxed=has_blank)
    _fit_columns(table, total)
    for i, row in enumerate(table.rows):
        trpr = row._tr.get_or_add_trPr()
        if i == 0:
            trpr.append(OxmlElement("w:tblHeader"))
        trpr.append(OxmlElement("w:cantSplit"))
        blank = i > 0 and all(not c.text.strip() for c in row.cells)
        if blank:
            h = OxmlElement("w:trHeight")
            h.set(qn("w:val"), "620")
            h.set(qn("w:hRule"), "atLeast")
            trpr.append(h)
        for cell in row.cells:
            if i == 0:
                _shade(cell, PALE)
            for p in cell.paragraphs:
                p.paragraph_format.space_after = Pt(1)
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.line_spacing = 1.05
                for run in p.runs:
                    run.font.size = Pt(size)
                    run.font.name = FONT
                    if i == 0:
                        run.font.bold = True
                        run.font.color.rgb = NAVY


def _footer(section, label):
    footer = section.footer
    footer.is_linked_to_previous = False
    p = footer.paragraphs[0]
    p.text = ""
    usable = section.page_width - section.left_margin - section.right_margin
    p.paragraph_format.tab_stops.add_tab_stop(usable, WD_TAB_ALIGNMENT.RIGHT)

    def run(text=None):
        r = p.add_run(text or "")
        r.font.size = Pt(8.5)
        r.font.color.rgb = GREY
        r.font.name = FONT
        return r
    run(f"Policy & Strategy Lab · {label}")
    run("\t")
    for kind, text in (("begin", None), ("instr", " PAGE "), ("separate", None), ("text", "1"), ("end", None)):
        r = run()
        if kind == "instr":
            el = OxmlElement("w:instrText")
            el.set(qn("xml:space"), "preserve")
            el.text = text
            r._r.append(el)
        elif kind == "text":
            r.text = text
        else:
            el = OxmlElement("w:fldChar")
            el.set(qn("w:fldCharType"), kind)
            r._r.append(el)


def _postprocess(path, label, landscape, doc_title):
    doc = Document(str(path))
    sec = doc.sections[0]
    if landscape:
        sec.orientation = WD_ORIENT.LANDSCAPE
        sec.page_width, sec.page_height = Cm(29.7), Cm(21.0)
    else:
        sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
    sec.left_margin = sec.right_margin = Cm(2.0)
    sec.top_margin = sec.bottom_margin = Cm(2.0)
    sec.footer_distance = Cm(1.0)
    usable = int((sec.page_width - sec.left_margin - sec.right_margin) / 635)
    for table in doc.tables:
        n = len(table.columns)
        _style_table(table, usable, 9 if (n <= 4 or landscape) else 8.5)
    _footer(sec, label)
    doc.core_properties.author = "Policy & Strategy Lab course team"
    doc.core_properties.title = doc_title
    doc.save(str(path))


_REF = None


def md_to_docx(md_text, out_docx, footer_label, landscape=False, pdf=True):
    """Convert markdown text to a styled .docx (and .pdf beside it)."""
    global _REF
    out_docx = Path(out_docx)
    out_docx.parent.mkdir(parents=True, exist_ok=True)
    if _REF is None:
        _REF = HERE / "out" / "reference.docx"
        _REF.parent.mkdir(exist_ok=True)
        build_reference(_REF)
    title, subtitle, body = prepare_markdown(md_text)
    tmp = HERE / "out" / (out_docx.stem.replace(" ", "_") + ".prepared.md")
    tmp.write_text(body)
    cmd = ["pandoc", str(tmp), "-f", "markdown-smart", "-o", str(out_docx),
           f"--reference-doc={_REF}", "--columns=10", "--metadata", f"title={title}"]
    if subtitle:
        cmd += ["--metadata", f"subtitle={subtitle}"]
    if re.search(r"(?m)^## ", body) and not re.search(r"(?m)^# ", body):
        cmd += ["--shift-heading-level-by=-1"]
    subprocess.run(cmd, check=True)
    _postprocess(out_docx, footer_label, landscape, f"{title}: {subtitle}" if subtitle else title)
    subprocess.run(["zip", "-dq", str(out_docx), "*/"], capture_output=True)
    if pdf:
        to_pdf([out_docx])
    return out_docx


def to_pdf(paths):
    """Convert office files to PDF beside them."""
    for p in paths:
        p = Path(p)
        subprocess.run([sys.executable, str(SOFFICE), "--headless", "--convert-to", "pdf",
                        "--outdir", str(p.parent), str(p)], check=True, capture_output=True)
