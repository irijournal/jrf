import json, re, glob, os
recs = json.load(open('research/corpus.json'))
order = ["Classical (before 1000)", "Medieval and early modern (1000 to 1800)", "Colonial (1800 to 1947)",
         "Post-independence (1947 to 1990)", "Liberalisation era (1991 to 2009)", "Contemporary (2010 onward)"]
def clean(s): return (s or '').replace('|', '/').replace('\n', ' ').strip()
out = ["# Appendix B. The Corpus at a Glance {.unnumbered}\n",
       "The research corpus on which this book rests holds 243 works, recorded in the author's workbook *Sitayans: Feminist Retellings of the Ramayana* (last updated 10 November 2026). They are listed here by period, with the identifier used in the notes, the creator, the date as recorded, the original language, the form, and a one-line description drawn from the workbook's characterisation field. Dates marked \"check\" in the workbook remain to be confirmed.\n"]
for p in order:
    rows = [r for r in recs if r['Period'] == p]
    def sk(r):
        try: return float(r['Sort year'])
        except Exception: return 9999
    rows.sort(key=sk)
    out.append(f"\n## {p} ({len(rows)} works)\n")
    for r in rows:
        desc = clean(r['Distinctive characterisation'])
        desc = desc if len(desc) < 260 else desc[:257].rsplit(' ', 1)[0] + '…'
        out.append(f"**{r['ID']}. *{clean(r['Title'])}*.** {clean(r['Creator'])}. {clean(r['Year'])}. {clean(r['Original language'])}; {clean(r['Form']).lower()}; {clean(r['Category']).lower()}. {desc}\n")
# list of illustrations
out.append("\n# List of Illustrations and Credits {.unnumbered}\n")
out.append("Diagrams and charts were made for this book by the author (tools/figs.py) in the palette of the author's stylesheet; data figures are computed from the corpus workbook, and interpretive figures are so labelled in their captions. Photographs and paintings are reproduced from Wikimedia Commons under the licences stated. Book covers are © their publishers and are reproduced for criticism and review; permissions are to be cleared before publication.\n")
credits = json.load(open('research/image-credits.json')) if os.path.exists('research/image-credits.json') else {}
n = 0
for f in sorted(glob.glob('chapters/*.md')):
    if f.endswith(('back-a.md','back-b.md')): continue
    for m in re.finditer(r'!\[([^\]]*)\]\(([^)]+)\)', open(f).read()):
        path = os.path.normpath(os.path.join('chapters', m.group(2)))
        if not os.path.exists(path): continue
        n += 1
        cap = m.group(1)
        key = os.path.splitext(os.path.basename(path))[0]
        src = ''
        if key in credits:
            c = credits[key]; src = f" Source: {c['file'].replace('File:','')}, {c.get('license','')}, Wikimedia Commons."
        cap_short = re.split(r'(?<=\.)\s', cap, maxsplit=1)
        out.append(f"{n}. {cap_short[0]} {cap_short[1] if len(cap_short)>1 else ''}{src}\n")
open('chapters/33-back-b.md', 'w').write('\n'.join(out))
print('illustrations:', n)
