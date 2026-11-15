#!/bin/bash
# Build the course overview deck and the 30 day decks into the course package, with PDFs.
set -e
cd "$(dirname "$0")"
export NODE_PATH=$PWD/node_modules
SOFF=/root/.claude/skills/synced/f218a6be-6141-4f23-a687-cb058014c616_1248a252-a28d-4416-8d9c-de5f5eefcbdb/pptx/scripts/office/soffice.py
PKG="../course-package"
python3 export_days.py
mkdir -p "$PKG/00 Programme Documents" "$PKG/03 Slides"
node overview_deck.js "$PKG/00 Programme Documents/03 Course Overview.pptx"
python3 $SOFF --headless --convert-to pdf --outdir "$PKG/00 Programme Documents" "$PKG/00 Programme Documents/03 Course Overview.pptx" >/dev/null 2>&1
node day_decks.js out/days.json "$PKG/03 Slides"
for f in "$PKG/03 Slides"/Day*.pptx; do
  python3 $SOFF --headless --convert-to pdf --outdir "$PKG/03 Slides" "$f" >/dev/null 2>&1
done
ls "$PKG/03 Slides" | wc -l
