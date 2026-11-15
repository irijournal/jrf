#!/bin/bash
# Render given day decks to PDF and a contact sheet per deck for visual QA.
# Usage: ./qa_decks.sh 1 2 3
set -e
cd "$(dirname "$0")"
export NODE_PATH=$PWD/node_modules
python3 export_days.py
node day_decks.js out/days.json out/decks "$@"
SOFF=/root/.claude/skills/synced/f218a6be-6141-4f23-a687-cb058014c616_1248a252-a28d-4416-8d9c-de5f5eefcbdb/pptx/scripts/office/soffice.py
for d in "$@"; do
  f=$(ls out/decks/Day\ $(printf %02d $d)\ -*.pptx)
  python3 $SOFF --headless --convert-to pdf --outdir out/decks "$f" >/dev/null 2>&1
  pdf="${f%.pptx}.pdf"
  rm -rf out/qa/d$d && mkdir -p out/qa/d$d
  pdftoppm -jpeg -r 45 "$pdf" out/qa/d$d/s
  python3 - "$d" <<'EOF'
import glob, sys
from PIL import Image
d = sys.argv[1]
fs = sorted(glob.glob(f"out/qa/d{d}/s-*.jpg")); ims = [Image.open(f) for f in fs]
w, h = ims[0].size; cols = 4; rows = (len(ims) + cols - 1) // cols
c = Image.new("RGB", (w * cols + 6 * (cols - 1), h * rows + 6 * (rows - 1)), "#888")
for i, im in enumerate(ims): c.paste(im, ((i % cols) * (w + 6), (i // cols) * (h + 6)))
c.save(f"out/qa/sheet-d{d}.jpg"); print(f"day {d}: {len(fs)} slides")
EOF
done
