/* DARSLIK · 7-mavzu (18–21-§). Quyosh sistemasining tuzilishi */
(function(){
function build(el, api){
  const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU, {TX,PL,CONF,GL,QA,QZ}=window.DZ7;
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const pn=i=>T(PL[i][0]);
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<div class="lab-row" style="margin:0">${chips('md',[['p',T(TX.mP)],['b',T(TX.mB)],['k',T(TX.mK)]])}<button class="lab-chip" id="t7MP">▶</button></div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t7Mod"></canvas></div><div class="t1-side"><p class="t1-p" id="t7MD"></p></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t7Ret"></canvas><div class="lab-row"><button class="lab-chip" id="t7RP">▶</button><span class="t1-lab">${T(TX.day)}: <b id="t7RV"></b></span><input type="range" class="lab-range" id="t7R" min="0" max="780" step="1" value="250" style="flex:1"></div></div>
    <div class="lab-kv" id="t7RKv"></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p>
    <div class="lab-row" style="margin:0">${chips('pl',PL.map((p,i)=>[i,T(p[0])]))}</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t7Sc"></canvas></div>
    <div class="t1-two"><div class="lab-kv" id="t7SKv"></div>
      <div class="dz-card t4-m"><h4>${T(TX.mass)}</h4><div class="t2-track" style="height:18px"><i style="width:99.85%;background:linear-gradient(90deg,#ffb347,#ffd27a)"></i></div><div class="lab-kv">${kv(T(TX.sun),'99,85%',true)+kv(T(TX.rest),'0,15%')+kv('D☉ / D⊕','109')+kv('M☉ / M⊕','330 000')}</div></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p>
    <div class="lab-row" style="margin:0">${chips('cf',CONF.map((c,i)=>[i,T(c[0])]))}</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t7Cf"></canvas></div>
      <div class="t1-side"><div class="lab-row" style="margin:0">${chips('io',[['in',T(TX.inner)],['out',T(TX.outer)]])}</div>
        <label class="t1-ctl"><span>${T(TX.ang)}: <b id="t7CV"></b></span><input type="range" class="lab-range" id="t7C" min="-180" max="180" step="1" value="40"></label>
        <div class="lab-kv" id="t7CKv"></div></div></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p>
    <div class="t1-two"><div class="dz-card t4-m"><div class="t1-formula">${T(TX.inner)}: 1/S = 1/T − 1/T⊕ · T = S·T⊕/(S + T⊕)</div><div class="t1-formula">${T(TX.outer)}: 1/S = 1/T⊕ − 1/T · T = S·T⊕/(S − T⊕)</div>
      <div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.pick)}</span>${chips('sy',PL.map((p,i)=>[i,T(p[0])]).filter(p=>p[0]!==2))}</div><div class="lab-kv" id="t7YKv"></div></div>
      <div class="dz-card t1-chart"><h4>${T(TX.chartT)}</h4><canvas class="t1-cv" id="t7Syn"></canvas><p class="t1-cap">${T(TX.chartC)}</p></div></div>`)}
  ${sec('06',K.U.gl,K.glHTML(GL))}
  ${sec('07',K.U.qa,K.qaHTML(QA))}
  ${sec('08',K.U.test,`<div class="dz-card t1-quiz" id="t7Quiz"></div>`)}`;

  const sun=(x,cx,cy,r)=>{ const g=x.createRadialGradient(cx,cy,0,cx,cy,r*2); g.addColorStop(0,'#fff3c4'); g.addColorStop(.45,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r*2,0,TAU); x.fill(); };
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const ring=(x,cx,cy,r,col,dash)=>{ x.strokeStyle=col; x.lineWidth=1; x.setLineDash(dash||[]); x.beginPath(); x.arc(cx,cy,r,0,TAU); x.stroke(); x.setLineDash([]); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };

  /* 01 · Modellar */
  let md='k', mt=0, mRun=false;
  const drawMod=K.draw(function(){ const cv=$('#t7Mod'); const {x,w,h}=fit(cv,.9,460), c=C(), cx=w/2, cy=h/2, R=Math.min(w,h)*.46;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    for(let i=0;i<90;i++){ const a=i*2.39996, rr=R*(.97+.03*((i*7)%5)/5); dot(x,cx+rr*Math.cos(a),cy+rr*Math.sin(a),.9,'rgba(220,230,255,.7)'); }
    ring(x,cx,cy,R*.95,'rgba(160,180,255,.25)',[3,5]); lbl(x,T(TX.stars),cx,cy-R*.95+14,'#9aa6cc');
    const P=(r,per,ph)=>{ const a=-(mt/per)*TAU+(ph||0); return [r*Math.cos(a),r*Math.sin(a)]; }, oc='rgba(160,180,255,.28)';
    const body=(i,px,py,name)=>{ dot(x,px,py,PL[i][4]*.7+1.5,PL[i][3]); lbl(x,name||pn(i),px,py-PL[i][4]-4,'#cfd6f2'); };
    if(md==='k'){ sun(x,cx,cy,10); const rs=[.15,.25,.36,.5,.68,.86];
      [0,1,2,3,4,5].forEach((i,k)=>{ ring(x,cx,cy,R*rs[k],oc); const [px,py]=P(R*rs[k],PL[i][2],k); body(i,cx+px,cy+py);
        if(i===2){ const [mx,my]=P(R*.04,.0748); dot(x,cx+px+mx,cy+py+my,2,'#ccc'); } }); }
    else { dot(x,cx,cy,7,'#3f7fe0'); lbl(x,pn(2),cx,cy+20,'#cfd6f2'); const [mx,my]=P(R*.09,.0748); ring(x,cx,cy,R*.09,oc); dot(x,cx+mx,cy+my,2.5,'#ccc');
      const sr=md==='p'?R*.42:R*.4, [sx,sy]=P(sr,1); ring(x,cx,cy,sr,'rgba(255,190,90,.35)');
      if(md==='p'){ [[0,.2],[1,.31]].forEach(([i,r])=>{ ring(x,cx,cy,R*r,oc); const [px,py]=P(R*r,1,i?.5:-.4); body(i,cx+px,cy+py); }); }
      else { [[0,.07],[1,.13]].forEach(([i,r])=>{ ring(x,cx+sx,cy+sy,R*r,oc); const [px,py]=P(R*r,PL[i][2]); body(i,cx+sx+px,cy+sy+py); }); }
      sun(x,cx+sx,cy+sy,8); lbl(x,T(TX.sun),cx+sx,cy+sy+22,'#ffd27a');
      [[3,.58],[4,.72],[5,.85]].forEach(([i,r],k)=>{ ring(x,cx,cy,R*r,oc); const [px,py]=P(R*r,PL[i][2],k*2); body(i,cx+px,cy+py); }); }
    mark('md',md); $('#t7MD').innerHTML=T(md==='p'?TX.dP:md==='b'?TX.dB:TX.dK); });
  on('md',v=>{ md=v; drawMod(); });
  let mL=0; const mStep=n=>{ if(!mRun) return; mt+=Math.min(.05,(n-mL)/1000)*.25; mL=n; drawMod(); K.rafs.mod=requestAnimationFrame(mStep); };
  $('#t7MP').onclick=()=>{ mRun=!mRun; $('#t7MP').textContent=mRun?'⏸':'▶'; click(700); if(mRun){ mL=performance.now(); K.rafs.mod=requestAnimationFrame(mStep); } };

  /* 02 · Sirtmoq */
  let rd=250, rRun=false; const OPP=390;
  const pos=d=>{ const ae=(d-OPP)/365.25*TAU, am=(d-OPP)/686.98*TAU; return {e:[Math.cos(ae),Math.sin(ae)],m:[1.524*Math.cos(am),1.524*Math.sin(am)],am}; };
  const geo=d=>{ const p=pos(d), dx=p.m[0]-p.e[0], dy=p.m[1]-p.e[1], D=Math.hypot(dx,dy); return {lam:Math.atan2(dy,dx),bet:1.85*D2R*Math.sin(p.am+1.1)*1.524/D,p}; };
  const drawRet=K.draw(function(){ const cv=$('#t7Ret'); const {x,w,h}=fit(cv,.62,440), c=C(); x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const sh=h*.34, cx=w/2, cy=sh+(h-sh)*.52, s=(h-sh)*.3, LR=46*D2R;
    const sx=l=>cx-(l/LR)*(w*.46), sy=b=>sh*.55-b/(4*D2R)*sh*.38;
    x.fillStyle='rgba(30,40,80,.55)'; x.fillRect(0,0,w,sh); for(let i=0;i<60;i++) dot(x,(i*97)%w,(i*53)%sh,.8,'rgba(220,230,255,.5)');
    lbl(x,T(TX.bg),10,16,'#9aa6cc','left');
    x.strokeStyle='rgba(216,96,58,.45)'; x.lineWidth=1.5; x.beginPath(); let pv=null; for(let d=0;d<=780;d+=3){ const g=geo(d); (pv===null||Math.abs(g.lam-pv)>Math.PI)?x.moveTo(sx(g.lam),sy(g.bet)):x.lineTo(sx(g.lam),sy(g.bet)); pv=g.lam; } x.stroke();
    ring(x,cx,cy,s,'rgba(120,170,255,.35)'); ring(x,cx,cy,s*1.524,'rgba(216,96,58,.35)'); sun(x,cx,cy,7);
    for(let k=1;k<=7;k++){ const d=OPP+(k-4)*30, g=geo(d), ex=cx+g.p.e[0]*s, ey=cy-g.p.e[1]*s, px=cx+g.p.m[0]*s, py=cy-g.p.m[1]*s;
      x.strokeStyle='rgba(200,210,255,.12)'; x.beginPath(); x.moveTo(ex,ey); x.lineTo(px+(px-ex)*3,py+(py-ey)*3); x.stroke();
      dot(x,sx(g.lam),sy(g.bet),3,'#d8603a'); lbl(x,String(k),sx(g.lam),sy(g.bet)-7,'#ffb08a'); dot(x,ex,ey,2,'rgba(120,170,255,.6)'); lbl(x,String(k),ex+(ex-cx)*.12,ey+(ey-cy)*.12+4,'#8fb6ff'); }
    const g=geo(rd), ex=cx+g.p.e[0]*s, ey=cy-g.p.e[1]*s, px=cx+g.p.m[0]*s, py=cy-g.p.m[1]*s;
    x.strokeStyle='rgba(255,210,120,.7)'; x.lineWidth=1.2; x.setLineDash([4,4]); x.beginPath(); x.moveTo(ex,ey); x.lineTo(px+(px-ex)*4,py+(py-ey)*4); x.stroke(); x.setLineDash([]);
    dot(x,ex,ey,5,'#3f7fe0'); dot(x,px,py,5,'#d8603a'); dot(x,sx(g.lam),sy(g.bet),6,'#ffc65c');
    let dl=geo(rd+1).lam-g.lam; dl=((dl+Math.PI)%TAU+TAU)%TAU-Math.PI; const retro=dl<0;
    $('#t7RV').textContent=rd; $('#t7RKv').innerHTML=kv(T(TX.motion),T(retro?TX.retro:TX.direct),true)+kv('λ − λ₀',fmtN(g.lam/D2R,1)+'°'); });
  $('#t7R').oninput=e=>{ rd=+e.target.value; drawRet(); };
  let rL=0; const rStep=n=>{ if(!rRun) return; rd+=Math.min(.05,(n-rL)/1000)*60; rL=n; if(rd>780) rd=0; $('#t7R').value=rd; drawRet(); K.rafs.ret=requestAnimationFrame(rStep); };
  $('#t7RP').onclick=()=>{ rRun=!rRun; $('#t7RP').textContent=rRun?'⏸':'▶'; click(700); if(rRun){ rL=performance.now(); K.rafs.ret=requestAnimationFrame(rStep); } };

  /* 03 · Masshtab */
  let sp=7;
  const drawSc=K.draw(function(){ const cv=$('#t7Sc'); const {x,w,h}=fit(cv,.26,200), c=C(), pl=24, pr=24, y=h*.5, sx=a=>pl+Math.sqrt(a/42)*(w-pl-pr);
    sun(x,pl,y,9);
    x.fillStyle=c.day?'rgba(120,100,70,.18)':'rgba(200,210,255,.12)'; x.fillRect(sx(2.1),y-8,sx(3.3)-sx(2.1),16); x.fillRect(sx(30),y-8,sx(42)-sx(30),16);
    lbl(x,T(TX.belt),(sx(2.1)+sx(3.3))/2,y+26,c.dim); lbl(x,T(TX.kuiper),(sx(30)+sx(42))/2,y+26,c.dim);
    x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,y); x.lineTo(w-pr,y); x.stroke();
    [1,5,10,20,30,40].forEach(a=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(sx(a),h-22); x.lineTo(sx(a),h-16); x.stroke(); lbl(x,a+' '+T(TX.au),sx(a),h-4,c.dim); });
    PL.forEach((p,i)=>{ dot(x,sx(p[1]),y,p[4]*.8,p[3]); if(i===sp){ x.strokeStyle=c.gold; x.lineWidth=2; x.beginPath(); x.arc(sx(p[1]),y,p[4]*.8+4,0,TAU); x.stroke(); }
      lbl(x,T(p[0]),sx(p[1]),y-(i%2?28:16),i===sp?c.gold:c.text); });
    const a=PL[sp][1], m=a*499/60; mark('pl',sp);
    $('#t7SKv').innerHTML=kv(T(TX.dist),fmtN(a,2)+' '+T(TX.au)+' ≈ '+fmtN(a*149.6,1)+' mln km',true)+kv(T(TX.light),m<60?fmtN(m,1)+' min':fmtN(m/60,1)+' h')+kv(T(TX.speed),fmtN(29.78/Math.sqrt(a),1)+' km/s'); });
  on('pl',v=>{ sp=+v; drawSc(); });

  /* 04 · Konfiguratsiyalar */
  let io='in', al=40;
  const special=k=>{ const ri=.55, re=1, ro=1.6; if(k===-1) return 180-Math.acos(ri/re)/D2R; if(k===-2) return -(180-Math.acos(ri/re)/D2R); if(k===-3) return 180-Math.acos(re/ro)/D2R; if(k===-4) return -(180-Math.acos(re/ro)/D2R); return k; };
  const drawCf=K.draw(function(){ const cv=$('#t7Cf'); const {x,w,h}=fit(cv,.86,440), c=C(), cx=w/2, cy=h*.46, s=Math.min(w,h)*.27, ex=cx, ey=cy+s;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    ring(x,cx,cy,s*.55,io==='in'?'rgba(232,194,122,.5)':'rgba(160,180,255,.2)',[4,4]); ring(x,cx,cy,s,'rgba(120,170,255,.45)'); ring(x,cx,cy,s*1.6,io==='out'?'rgba(216,96,58,.5)':'rgba(160,180,255,.2)',[4,4]);
    sun(x,cx,cy,9); dot(x,ex,ey,6,'#3f7fe0'); lbl(x,pn(2),ex,ey+20,'#cfd6f2');
    lbl(x,'E',cx-s*1.75,ey+4,'#ffc65c'); lbl(x,'W',cx+s*1.75,ey+4,'#ffc65c');
    x.strokeStyle='rgba(255,255,255,.12)'; x.beginPath(); x.moveTo(cx-s*1.65,ey); x.lineTo(cx+s*1.65,ey); x.stroke();
    const r=s*(io==='in'?.55:1.6), px=cx-r*Math.sin(al*D2R), py=cy-r*Math.cos(al*D2R);
    x.strokeStyle='rgba(255,210,120,.6)'; x.setLineDash([4,4]); x.beginPath(); x.moveTo(ex,ey); x.lineTo(cx,cy); x.moveTo(ex,ey); x.lineTo(px,py); x.stroke(); x.setLineDash([]);
    const dx=px-ex, dy=py-ey, th=Math.atan2(-dx,-dy)/D2R;
    x.strokeStyle='#ffc65c'; x.lineWidth=1.5; x.beginPath(); const a0=-Math.PI/2, a1=a0-th*D2R; x.arc(ex,ey,26,Math.min(a0,a1),Math.max(a0,a1)); x.stroke(); lbl(x,'θ',ex-Math.sin(th*D2R/2)*38,ey-Math.cos(th*D2R/2)*38+4,'#ffc65c');
    dot(x,px,py,7,io==='in'?'#e8c27a':'#d8603a');
    const A=Math.abs(th), east=th>0;
    let vis;
    if(A<6) vis=X('Quyosh nurlariga ko‘milib ko‘rinmaydi','Не видна — теряется в лучах Солнца','Invisible — lost in the Sun’s glare');
    else if(io==='in') vis=east?X('Kechqurun, Quyosh botgach g‘arbda','Вечером после заката, на западе','In the evening after sunset, in the west'):X('Tongda, Quyosh chiqishidan oldin sharqda','Утром до восхода, на востоке','At dawn before sunrise, in the east');
    else if(A>150) vis=X('Butun tun davomida','Всю ночь','All night long');
    else vis=east?X('Kechqurundan yarim kechagacha','С вечера до полуночи','From dusk till midnight'):X('Yarim kechadan erta tonggacha','С полуночи до утра','From midnight till dawn');
    $('#t7CV').textContent=Math.round(al)+'°'; $('#t7C').value=al; mark('io',io);
    $('#t7CKv').innerHTML=kv(T(TX.elong),fmtN(A,1)+'°',true)+kv(T(TX.side),(A<6||A>178)?'—':T(east?X('sharq (E)','восток (E)','east (E)'):X('g‘arb (W)','запад (W)','west (W)')))+kv(T(TX.vis),T(vis)); });
  $('#t7C').oninput=e=>{ al=+e.target.value; mark('cf',''); drawCf(); };
  on('io',v=>{ io=v; mark('cf',''); drawCf(); });
  on('cf',v=>{ const cf=CONF[+v]; io=cf[2]; al=special(cf[1]); if(al>180) al-=360; mark('cf',v); drawCf(); });

  /* 05 · Sinodik davr */
  let sy=3;
  const Sof=t=>1/Math.abs(1/t-1);
  const drawSyn=K.draw(function(){ const cv=$('#t7Syn'); const {x,w,h}=fit(cv,.6,300), c=C(), pl=34, pr=12, pt=10, pb=26, L0=Math.log10(.15), L1=Math.log10(200);
    const X0=t=>pl+(Math.log10(t)-L0)/(L1-L0)*(w-pl-pr), Y0=s=>pt+(1-Math.min(s,4)/4)*(h-pt-pb);
    x.font='10.5px system-ui,sans-serif';
    for(let s=0;s<=4;s++){ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,Y0(s)); x.lineTo(w-pr,Y0(s)); x.stroke(); x.fillStyle=c.dim; x.textAlign='right'; x.fillText(s,pl-5,Y0(s)+3.5); }
    [.2,1,10,100].forEach(t=>{ x.fillStyle=c.dim; x.textAlign='center'; x.fillText(String(t).replace('.',','),X0(t),h-8); });
    x.strokeStyle=c.neon; x.lineWidth=2; [[.15,.97],[1.03,200]].forEach(([a,b])=>{ x.beginPath(); let f=true; for(let l=Math.log10(a);l<=Math.log10(b);l+=.01){ const t=10**l; f?x.moveTo(X0(t),Y0(Sof(t))):x.lineTo(X0(t),Y0(Sof(t))); f=false; } x.stroke(); });
    x.setLineDash([3,4]); x.strokeStyle=c.dim; x.beginPath(); x.moveTo(X0(1),pt); x.lineTo(X0(1),h-pb); x.stroke(); x.setLineDash([]);
    PL.forEach((p,i)=>{ if(i===2) return; const px=X0(p[2]), py=Y0(Sof(p[2])); dot(x,px,py,i===sy?6:4,p[3]); if(i===sy){ x.strokeStyle=c.gold; x.lineWidth=2; x.beginPath(); x.arc(px,py,9,0,TAU); x.stroke(); } lbl(x,T(p[0]),px,py-11,i===sy?c.gold:c.dim); });
    x.fillStyle=c.dim; x.textAlign='left'; x.fillText('S, '+T(TX.yr),pl+4,pt+10); x.textAlign='right'; x.fillText('T, '+T(TX.yr),w-pr,h-pb-4);
    const t=PL[sy][2], S=Sof(t); mark('sy',sy);
    $('#t7YKv').innerHTML=kv('T',fmtN(t,t<2?3:2)+' '+T(TX.yr)+' = '+fmtN(t*365.25)+' '+T(TX.dd))+kv('S',fmtN(S*365.25)+' '+T(TX.dd)+' = '+fmtN(S,2)+' '+T(TX.yr),true)+kv(T(t<1?TX.inner:TX.outer),t<1?'1/S = 1/'+fmtN(t,3)+' − 1':'1/S = 1 − 1/'+fmtN(t,2)); });
  on('sy',v=>{ sy=+v; drawSyn(); });

  K.bindQA(); K.quiz($('#t7Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK||!window.DZ7) return setTimeout(add,50); window.DARSLIK.add({ id:'t07', get GL(){ return (window.DZ7||{}).GL; }, get QZ(){ return (window.DZ7||{}).QZ; }, ico:'🪐', title:window.DZ7.TX.title, sub:window.DZ7.TX.sub, build }); };
add();
})();
