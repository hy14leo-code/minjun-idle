/* 시뮬레이션 봇: 게임 내부 스코프에서 eval 로 로드됨 */
(function(){
  save=function(){};uiGrow=function(){};uiTop=function(){};renderTab=function(){};renderSbar=function(){};toast=function(){};bannerFx=function(){};snd=function(){};jingle=function(){};showOv=function(){};paintField=function(){};later=function(){};popAt=function(){};fxSpr=function(){return null};fxHtml=function(){return null};flashFx=function(){};boomAt=function(){};shakeF=function(){};knock=function(){};hurtFx=function(){};
  S.tl=true;S.title="kim";E.fx=null;
  var Z={t:0,lastBest:1,lastBestT:0,rebirths:[],ms:{},pulls:0,day:0,buys:0,lastBoss:-999,bestEver:1,deaths0:0};
  window.__Z=Z;
  var RANK={common:1,rare:2,epic:3,legend:4,ultra:5,trash:-9};
  var RSPRI=["atkm","gold","head","boss","critd","tix","off","offt","gm","auto","spd3"];
  function spend(){
    for(var k=0;k<60;k++){
      var best=-1,bc=1e300;
      for(var i=0;i<7;i++){
        if(i===4&&S.up[4]>S.up[0]*0.4)continue;
        if(window.__casual&&(i===1||i===2))continue;
        var c=upCostN(i,1);if(c<bc&&c<=S.gold){bc=c;best=i}
      }
      if(best<0)break;
      S.gold-=bc;S.up[best]+=1;Z.buys++;
    }
  }
  function gear(){
    ["weapon","armor","acc"].forEach(function(sl){
      var bi=null,br=-99;
      ITEMS.forEach(function(it){if(it.slot===sl&&S.inv[it.id]){var r=(RANK[it.t]||0)*100+(S.inv[it.id].lv||0)*5;if(r>br){br=r;bi=it.id}}});
      if(bi&&S.equip[sl]!==bi)equip(bi);
    });
    // 강화: 조각이 있으면 장착 장비를 강화
    ["weapon","armor","acc"].forEach(function(sl){
      var id=S.equip[sl];if(!id)return;var o=S.inv[id];
      for(var n=0;n<6;n++){
        if(!o||o.lv>=10)break;
        if(S.shards<enhCost(o.lv)||S.gold<enhGold(o.lv))break;
        enhance(id,false);
      }
    });
  }
  function loadout(){
    var sk=Object.keys(S.skl).map(function(id){return SKM[id]}).filter(Boolean).sort(function(a,b){return SKTI[b.t].rank-SKTI[a.t].rank||S.skl[b.id].lv-S.skl[a.id].lv});
    var want=[],top=false;
    sk.forEach(function(s){if(want.length>=4)return;if(isTop(s)){if(top)return;top=true}want.push(s.id)});
    S.slots.forEach(function(id){if(id&&want.indexOf(id)<0)toggleSkill(id)});
    want.forEach(function(id){if(S.slots.indexOf(id)<0){if(S.slots.indexOf(null)>=0||true)toggleSkill(id)}});
    var cm=Object.keys(S.cmp).map(function(id){return CMM[id]}).filter(Boolean).filter(function(c){return c.id!=="juyul"}).sort(function(a,b){return CMTI[b.t].rank-CMTI[a.t].rank||S.cmp[b.id].lv-S.cmp[a.id].lv}).slice(0,3).map(function(c){return c.id});
    S.party.forEach(function(id){if(id&&cm.indexOf(id)<0)toggleParty(id)});
    cm.forEach(function(id){if(S.party.indexOf(id)<0)toggleParty(id)});
  }
  function pulls(){
    var kinds=["cm","sk","eq","pt"];
    var guard=0;
    while(S.tickets>=1&&guard++<400){
      var kind=kinds[Z.pulls%4];var n=S.tickets>=10?10:1;
      doPull(kind,n);Z.pulls+=n;
    }
  }
  function rebirthLogic(){
    var g=rpGain(S.rbest);
    var stall=Z.t-Z.lastBestT;
    if(S.best>Z.lastBest){Z.lastBest=S.best;Z.lastBestT=Z.t}
    var cur=S.rp||0;
    // 정체(40분 이상 최고 기록 갱신 없음)이고 얻을 점수가 의미 있으면 회귀
    if(!window.__noRb&&g>=3&&stall>2400&&g>=Math.max(3,cur*0.12)){
      Z.rebirths.push([Math.round(Z.t/3600*10)/10,S.rbest,g]);
      rebirthGo();
      Z.lastBest=1;Z.lastBestT=Z.t;
    }
    // 회귀 상점 구매
    for(var g2=0;g2<30;g2++){
      var bought=false;
      for(var i=0;i<RSPRI.length;i++){
        var id=RSPRI[i],r=RSM[id];if(!r)continue;
        var l=rsLv(id);if(l>=r.max)continue;
        if(rpAvail()>=rsCost(r)){rsBuy(id);bought=true;break}
      }
      if(!bought)break;
    }
  }
  var MS=[20,40,60,80,100,140,160,180,200,260,300,360,440,520];
  window.__tick=function(){
    Z.t+=10;
    for(var i=0;i<20;i++)step(0.5);
    // 일일 단위
    var day=Math.floor(Z.t/86400);
    if(day>Z.day){Z.day=day;var K=dayKey(new Date());S.tb={d:K,n:0};S.gtd={d:K,n:0};S.dg={d:K,n:0,m:0};S.tickets+=14;S.dia+=10}
    // 선물 상자 (활동 시 20~30분마다 한 번 수령)
    if(G){claimGift()}
    // 매 10초: 소비
    spend();
    if(Z.t%60===0){
      // 하루 뽑기권 구매 한도까지 (금화 여유가 있을 때만)
      var tb=S.tb||{n:0};
      if((tb.n||0)<8&&S.gold>ticketPrice()*3){buyTicket(1)}
      pulls();if(!window.__casual){gear();loadout();}
      if((S.bossReady||((S.stage+1)%10===0))&&!(F&&F.boss)&&Z.t-Z.lastBoss>120&&canWin()){Z.lastBoss=Z.t;enterBoss()}
      if(Z.t%300===0)rebirthLogic();
      // 던전 (하루 2회씩)
      if(!F||!F.boss){if((S.dg.n||0)<2)dgStart("a");else if(S.best>=30&&(S.dg.m||0)<2)dgStart("b")}
    }
    if(S.best>Z.bestEver){Z.bestEver=S.best;MS.forEach(function(m){if(Z.ms[m]===undefined&&S.best>=m)Z.ms[m]=Math.round(Z.t/360)/10})}
  };
  return true;
})()
