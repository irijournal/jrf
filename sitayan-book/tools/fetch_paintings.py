import hashlib, urllib.parse, urllib.request, time, os, json, subprocess
UA={'User-Agent':'SitaMonographImages/1.0 (scholarly book research; non-commercial)'}
items=[l.split('|') for l in open('tools/paintings.txt').read().strip().split('\n')]
cred=json.load(open('research/image-credits.json')) if os.path.exists('research/image-credits.json') else {}
def url(name, w=None):
    n=name.replace(' ','_'); h=hashlib.md5(n.encode()).hexdigest(); q=urllib.parse.quote(n)
    if w: return f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}" + ('.jpg' if n.lower().endswith(('.tif','.tiff')) else '')
    return f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{q}"
for key,name,lic,artist,date in items:
    out=f'images/{key}.jpg'
    if os.path.exists(out) and os.path.getsize(out)>5000: print('HAVE',key,flush=True); continue
    data=None
    for w in (1280,960,800,640,None):
        try:
            data=urllib.request.urlopen(urllib.request.Request(url(name,w),headers=UA),timeout=120).read()
            if len(data)>5000: break
        except Exception as e:
            data=None; time.sleep(4)
    if not data: print('FAIL',key,flush=True); continue
    tmp=f'images/{key}.tmp'; open(tmp,'wb').write(data)
    subprocess.run(['convert',tmp,'-resize','1400x1400>','-background','white','-flatten','-quality','88',out]); os.remove(tmp)
    cred[key]={'file':name,'page':'https://commons.wikimedia.org/wiki/File:'+urllib.parse.quote(name.replace(' ','_')),'license':lic,'artist':artist,'date':date}
    json.dump(cred,open('research/image-credits.json','w'),indent=1,ensure_ascii=False)
    print('OK',key,flush=True); time.sleep(3)
print('DONE',flush=True)
