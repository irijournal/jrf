import json,urllib.request,urllib.parse,sys,time
UA={'User-Agent':'SitaMonographImages/1.0 (scholarly book research; non-commercial)'}
def api(params):
    params.update({'format':'json'})
    url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)
    for i in range(5):
        try: return json.loads(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60).read())
        except Exception as e: time.sleep(5*(i+1))
    return {}
def search(q,n=8):
    d=api({'action':'query','generator':'search','gsrsearch':q,'gsrnamespace':6,'gsrlimit':n,'prop':'imageinfo','iiprop':'url|size|extmetadata','iiurlwidth':1600})
    out=[]
    for p in d.get('query',{}).get('pages',{}).values():
        ii=p.get('imageinfo',[{}])[0]; md=ii.get('extmetadata',{})
        g=lambda k: (md.get(k,{}) or {}).get('value','')
        out.append({'title':p['title'],'w':ii.get('width'),'h':ii.get('height'),'thumb':ii.get('thumburl'),'url':ii.get('url'),'license':g('LicenseShortName'),'artist':g('Artist')[:120],'date':g('DateTimeOriginal')[:60],'desc':g('ImageDescription')[:160],'credit':g('Credit')[:120]})
    return out
if __name__=='__main__':
    for q in sys.argv[1:]:
        print('==',q)
        for r in search(q):
            print(' ',r['title'],'|',r['license'],'|',r['w'],'x',r['h'],'|',r['date'],'|',r['artist'][:60].replace('\n',' '))
        time.sleep(1)
