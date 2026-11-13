import sys
t=open(sys.argv[1],encoding='utf8').read()
k="refreshCM();refreshSF();\nsetTimeout(checkVer,3000);setInterval(checkVer,180000);\ninitTop();"
assert k in t
open(sys.argv[2],'w',encoding='utf8').write(t.replace(k,"window.__ev=function(c){return eval(c)};\n"+k))
