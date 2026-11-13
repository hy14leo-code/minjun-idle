const fs=require('fs');const {chromium}=require('playwright');
(async()=>{const file=process.argv[2],hours=+process.argv[3]||200,chunk=+process.argv[4]||10;
const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.route(/supabase|fonts\./,r=>r.abort());
await p.goto('file://'+file);await p.waitForTimeout(600);
await p.evaluate(([a,c])=>{window.__ev('document.getElementById("ov").hidden=true');window.__ev(a);window.__ev(c)},[fs.readFileSync('bot.js','utf8'),fs.readFileSync('bot2.js','utf8')]);
for(let h=0;h<hours;h+=chunk){
 const r=await p.evaluate((n)=>{for(let i=0;i<n*360;i++)window.__tick();const ev=window.__ev;
  return {h:Math.round(window.__Z.t/3600),st:ev('S.stage'),best:ev('S.best'),rb:ev('S.rb'),rp:ev('S.rp'),tw:ev('S.twf'),rst:ev('S.rst'),rel:ev('RELICS.map(function(r){return relLv(r.id)}).join("/")'),tal:ev('talUsed()+"/"+talTotal()'),pass:ev('passLv()'),dia:ev('S.dia'),ms:window.__Z.ms}},chunk);
 console.log(`${r.h}h stage=${r.st} best=${r.best} rb=${r.rb} rp=${r.rp} tower=${r.tw} rst=${r.rst} rel=${r.rel} tal=${r.tal} pass=${r.pass} dia=${r.dia} | ${JSON.stringify(r.ms)}`);
 if(errs.length){console.log('ERR',errs.slice(0,3));break}
}
console.log('errs',errs);await b.close()})();
