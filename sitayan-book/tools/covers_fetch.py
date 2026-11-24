import json,urllib.request,urllib.parse,time,os,sys
UA={'User-Agent':'Mozilla/5.0 (scholarly book; cover lookup)'}
base='/home/user/jrf/sitayan-book'
want=[l.split('|') for l in open(base+'/tools/cover_wants.txt').read().strip().split('\n')]
res=json.load(open(base+'/research/ol_covers.json')) if os.path.exists(base+'/research/ol_covers.json') else {}
def get(url,tries=6):
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60).read()
        except Exception as e:
            time.sleep(4*(i+1))
    return None
for wid,t,a in want:
    if wid in res and os.path.exists(f'{base}/covers/{wid}.jpg'): continue
    if os.path.exists(f'{base}/covers/{wid}.jpg'): continue
    q=urllib.parse.urlencode({'title':t,'author':a,'fields':'key,title,author_name,cover_i,first_publish_year','limit':5})
    raw=get('https://openlibrary.org/search.json?'+q)
    if not raw: print('FAIL',wid,flush=True); continue
    docs=[x for x in json.loads(raw).get('docs',[]) if x.get('cover_i')]
    if not docs: print('NOCOVER',wid,t,flush=True); continue
    x=docs[0]
    img=get(f"https://covers.openlibrary.org/b/id/{x['cover_i']}-L.jpg")
    if img and len(img)>3000:
        open(f'{base}/covers/{wid}.jpg','wb').write(img)
        res[wid]={'title':x.get('title'),'author':x.get('author_name'),'cover_i':x['cover_i'],'year':x.get('first_publish_year')}
        json.dump(res,open(base+'/research/ol_covers.json','w'),indent=1)
        print('OK',wid,x.get('title'),x.get('author_name'),flush=True)
    time.sleep(3)
print('DONE',flush=True)
