/* v2 콘텐츠를 쓰는 봇 확장 */
(function(){
  var base=window.__tick,ORD=["atk","gd","cd","hp","sp","spd","fr","cr","tm","df","rst","of","dgb","rg","ds"];
  window.__tick=function(){
    base();
    var Z=window.__Z;
    if(Z.t%60===0){
      // 특성
      var g=0;while(talLeft()>0&&g++<80){var done=true;for(var i=0;i<ORD.length;i++){if(talLv(ORD[i])<TALMAX){S.tal[ORD[i]]=talLv(ORD[i])+1;done=false;break}}if(done)break}
      // 유물: 가장 싼 것부터
      for(var k=0;k<40;k++){var best=null,bc=1e300;RELICS.forEach(function(r){if(relLv(r.id)<r.max){var c=relCost(r);if(c<bc){bc=c;best=r}}});if(!best||(S.rst||0)<bc)break;S.rst-=bc;S.rel[best.id]=relLv(best.id)+1}
      refreshFM();
      twDaily();passClaim();
      // 탑: 5분마다, 예상 처치 시간이 제한의 80% 이내면 도전
      if(Z.t%300===0&&!(F&&F.boss)&&(S.twf||0)<TWMAX){var c=calc();if(twHp((S.twf||0)+1)/autoDps(c)<Math.max(15,c.time)*0.8)twStart()}
    }
  };
  return true;
})()
