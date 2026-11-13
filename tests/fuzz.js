const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];
p.on('pageerror',e=>errs.push(String(e)));await p.route(/supabase|fonts\./,r=>r.abort());
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);
const seed=+process.argv[3]||1;
const out=await p.evaluate((seed)=>{
 let sd=seed;const R=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
 const ev=window.__ev;ev('document.getElementById("ov").hidden=true;E.fx=null');
 const bad=[];const log=[];
 const acts=[
  ()=>ev('S.tickets+=30;S.gold+=1e8;S.shards+=50;S.dia+=20'),
  ()=>ev('doPull(["eq","sk","cm","pt"][Math.floor(Math.random()*4)],Math.random()<.5?1:10)'),
  ()=>ev('ITEMS.forEach(function(i){if(S.inv[i.id]&&Math.random()<.3)enhance(i.id,Math.random()<.3)})'),
  ()=>ev('ITEMS.forEach(function(i){if(S.inv[i.id]&&Math.random()<.3)equip(i.id)})'),
  ()=>ev('Object.keys(S.skl).forEach(function(i){if(Math.random()<.3)toggleSkill(i)})'),
  ()=>ev('Object.keys(S.cmp).forEach(function(i){if(Math.random()<.3)toggleParty(i)})'),
  ()=>ev('for(var i=0;i<7;i++)if(Math.random()<.5)buyUp(i)'),
  ()=>ev('Object.keys(S.skl).forEach(function(i){if(Math.random()<.4)useSkill(i)})'),
  ()=>ev('buyTicket(1+Math.floor(Math.random()*5))'),
  ()=>ev('if(!F||!F.boss){try{dgStart(Math.random()<.5?"a":"b")}catch(e){throw e}}'),
  ()=>ev('["dohyeon","heesung","junbeom","jihwan"].forEach(function(id){if(S.cmp[id]&&jobState(id)==="ready"){jobOv(id);T.jobSel=Object.keys(JOBD[id])[0];jobGo()}})'),
  ()=>ev('S.cmp.heesung&&(S.cmp.heesung.lv=Math.max(S.cmp.heesung.lv,20));S.best=Math.max(S.best,100)'),
  ()=>ev('tab=["char","skill","gear","party","gacha","quest"][Math.floor(Math.random()*6)];renderTab()'),
  ()=>ev('if(S.rbest>=20&&Math.random()<.3){rebirthGo()}'),
  ()=>ev('S.stage=Math.max(1,Math.min(S.stage+Math.floor(Math.random()*20-5),S.rbest||S.best));'),
 ];
 for(let i=0;i<400;i++){
  acts[Math.floor(R()*acts.length)]();
  for(let k=0;k<20;k++)ev('step(0.5)');
  const chk=ev('JSON.stringify({g:S.gold,t:S.tickets,sh:S.shards,d:S.dia,up:S.up,st:S.stage,b:S.best,hp:T.hp})');
  if(/null|NaN|Infinity/.test(chk)&&!/"hp":-1/.test(chk))bad.push([i,chk]);
 }
 return {bad:bad.slice(0,5),n:bad.length,end:ev('JSON.stringify({st:S.stage,b:S.best,rb:S.rb,pulls:S.pulls,cm:Object.keys(S.cmp).length,sk:Object.keys(S.skl).length})')};
},seed);
console.log(JSON.stringify(out));console.log('errs',errs.slice(0,5));await b.close()})();
