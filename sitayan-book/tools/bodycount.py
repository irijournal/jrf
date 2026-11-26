import re,glob
tot=0
for f in sorted(glob.glob('chapters/*.md')):
    if f.endswith(('back-a.md','back-b.md')): continue
    t=open(f).read(); out=[];i=0;d=0
    while i<len(t):
        if t.startswith('^[',i) and d==0: d=1;i+=2;continue
        if d>0:
            if t[i]=='[':d+=1
            elif t[i]==']':d-=1
            i+=1;continue
        out.append(t[i]);i+=1
    b=re.sub(r'!\[[^\]]*\]\([^)]*\)','',''.join(out)); tot+=len(b.split())
print('BODY WORDS:',tot)
