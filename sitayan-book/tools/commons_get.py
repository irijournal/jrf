import json,urllib.request,urllib.parse,time,re,sys,os
UA={'User-Agent':'SitaMonographImages/1.0 (scholarly book research; non-commercial)'}
sel=[l.split('|',1) for l in open('tools/image_wants.txt').read().strip().split('\n')]
credits=json.load(open('research/image-credits.json')) if os.path.exists('research/image-credits.json') else {}
def api(params):
    params.update({'format':'json'})
    url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)
    for i in range(5):
        try: return json.loads(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60).read())
        except Exception: time.sleep(30*(i+1))
    return {}
def clean(s): return re.sub(r'<[^>]+>','',s or '').replace('\n',' ').strip()
for key,title in sel:
    if key in credits and os.path.exists(f'images/{key}.jpg'): continue
    d=api({'action':'query','titles':title,'prop':'imageinfo','iiprop':'url|extmetadata|size','iiurlwidth':1280})
    pages=d.get('query',{}).get('pages',{})
    p=list(pages.values())[0] if pages else {}
    ii=(p.get('imageinfo') or [{}])[0]; md=ii.get('extmetadata',{})
    g=lambda k: clean((md.get(k,{}) or {}).get('value',''))
    url=ii.get('thumburl') or ii.get('url')
    if not url: print('NOURL',key,title,flush=True); continue
    for i in range(5):
        try:
            data=urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=90).read(); break
        except Exception as e: data=None; time.sleep(30*(i+1))
    if not data: print('FAIL',key,flush=True); continue
    ext='.png' if url.lower().endswith('.png') else '.jpg'
    fn=f'images/{key}{ext}'
    open(fn,'wb').write(data)
    if ext=='.png':
        os.system(f'convert "{fn}" -background white -flatten "images/{key}.jpg" && rm "{fn}"')
    credits[key]={'file':title,'page':'https://commons.wikimedia.org/wiki/'+urllib.parse.quote(title.replace(' ','_')),'artist':g('Artist')[:200],'date':g('DateTimeOriginal')[:80],'license':g('LicenseShortName'),'credit':g('Credit')[:200],'desc':g('ImageDescription')[:300]}
    json.dump(credits,open('research/image-credits.json','w'),indent=1,ensure_ascii=False)
    print('OK',key,credits[key]['license'],flush=True)
    time.sleep(20)
