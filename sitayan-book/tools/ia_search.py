#!/usr/bin/env python3
"""Search inside an archive.org book and report printed page numbers for each hit.

Usage: python3 ia_search.py IDENTIFIER "query words" [max_hits]
Prints: printed page label (from *_page_numbers.json when available), leaf index, and the snippet.
"""
import json, sys, urllib.parse, urllib.request, re

UA = {"User-Agent": "Mozilla/5.0 (scholarly citation check)"}

def get(url, timeout=60):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def main():
    ident, q = sys.argv[1], sys.argv[2]
    maxhits = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    meta = json.loads(get(f"https://archive.org/metadata/{ident}"))
    server, d = meta.get("server"), meta.get("dir")
    files = [f["name"] for f in meta.get("files", [])]
    # choose the book document (djvu/chOCR base name)
    base = None
    for f in files:
        m = re.match(r"(.+)_(?:djvu\.xml|chocr\.html\.gz|hocr\.html)$", f)
        if m:
            base = m.group(1); break
    if not base:
        for f in files:
            if f.endswith(".pdf"):
                base = f[:-4]; break
    pagemap = {}
    pn = f"{base}_page_numbers.json"
    if pn in files:
        try:
            pj = json.loads(get(f"https://archive.org/download/{ident}/{urllib.parse.quote(pn)}"))
            for p in pj.get("pages", []):
                pagemap[p.get("leafNum")] = p.get("pageNumber")
        except Exception as e:
            print("page map error", e)
    url = (f"https://{server}/fulltext/inside.php?item_id={ident}&doc={urllib.parse.quote(base)}"
           f"&path={urllib.parse.quote(d)}&q={urllib.parse.quote(q)}")
    try:
        res = json.loads(get(url))
    except Exception as e:
        print("search error", e, url); return
    matches = res.get("matches", [])
    print(f"{ident}: {len(matches)} hits for {q!r} (title: {meta.get('metadata',{}).get('title')})")
    for m in matches[:maxhits]:
        par = m.get("par", [{}])[0]
        leaf = par.get("page")
        label = pagemap.get(leaf, "?")
        text = re.sub(r"\s+", " ", m.get("text", "")).replace("{{{", "[").replace("}}}", "]")
        print(f"  p.{label} (leaf {leaf}): {text}")

if __name__ == "__main__":
    main()
