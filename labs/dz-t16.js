/* DARSLIK · 16-mavzu (41-§). Gigant planetalar. Ekzoplanetalar */
(function(){
function build(el, api){
  const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU, {TX,PL,GAL,INT,MIS,GL,QA,QZ}=window.DZ16;
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const ball=(x,px,py,r,col)=>{ const g=x.createRadialGradient(px-r*.35,py-r*.35,r*.1,px,py,r); g.addColorStop(0,'#fff'); g.addColorStop(.25,col); g.addColorStop(1,'#111'); x.fillStyle=g; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const play=(btn,key,fn,speed)=>{ let run=false, L=0; const st=n=>{ if(!run) return; fn(Math.min(.05,(n-L)/1000)*speed); L=n; K.rafs[key]=requestAnimationFrame(st); };
    $(btn).onclick=()=>{ run=!run; $(btn).textContent=run?'⏸':'▶'; click(700); if(run){ L=performance.now(); K.rafs[key]=requestAnimationFrame(st); } }; };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<div class="lab-row" style="margin:0">${chips('gp',PL.map((p,i)=>[i,T(p[0])]))}</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t16Sz"></canvas></div><div class="lab-kv t2-kv5" id="t16Kv"></div>`)}
  ${sec('02',TX.sJ,`<p class="t1-p">${T(TX.sJD)}</p>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t16J"></canvas><div class="lab-row"><button class="lab-chip" id="t16JP">▶</button></div></div>
    <p class="t1-p">${T(TX.jAtm)}</p>
    <div class="t1-two"><div class="dz-card t1-chart"><h4>${T(TX.inT)}</h4><canvas class="t1-cv" id="t16In"></canvas><div class="lab-row" style="margin:0">${chips('in',[['j',T(PL[0][0])],['s',T(PL[1][0])],['u',T(PL[2][0])],['n',T(PL[3][0])]])}</div></div>
      <div class="dz-card t1-chart"><h4>${T(TX.galT)}</h4><canvas class="t1-cv" id="t16G"></canvas><div class="lab-row"><button class="lab-chip" id="t16GP">▶</button><span class="t1-lab">${T(TX.days)}: <b id="t16GV"></b></span></div></div></div>
    <p class="t1-p">${T(TX.galD)}</p>
    <div class="dz-card t4-m"><h4>${T(TX.misT)}</h4><div class="t16-mis">${MIS.map(m=>`<div><b>${m[0]}</b><span>${T(m[1])}</span></div>`).join('')}</div></div>`)}
  ${sec('03',TX.sS,`<p class="t1-p">${T(TX.sSD)}</p>
    <div class="t1-split"><div class="dz-card t1-chart"><h4>${T(TX.ringT)}</h4><canvas class="t1-cv" id="t16S"></canvas></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.yr)}: <b id="t16SV"></b></span><input type="range" class="lab-range" id="t16SY" min="0" max="29.46" step="0.02" value="4"></label><div class="lab-kv" id="t16SKv"></div></div></div>
    <p class="t1-p">${T(TX.titD)}</p>`)}
  ${sec('04',TX.sU,`<p class="t1-p">${T(TX.sUD)}</p><p class="t1-p">${T(TX.sND)}</p>
    <div class="t1-two"><div class="dz-card t1-chart"><h4>${T(TX.nepT)}</h4><canvas class="t1-cv" id="t16N"></canvas>
        <label class="t1-ctl"><span>${T(TX.year)}: <b id="t16NV"></b></span><input type="range" class="lab-range" id="t16NY" min="1781" max="1846.8" step="0.1" value="1810"></label><p class="t1-cap" id="t16NC"></p></div>
      <div class="dz-card t1-chart"><h4>Triton · Nereida</h4><canvas class="t1-cv" id="t16T"></canvas><div class="lab-row"><button class="lab-chip" id="t16TP">▶</button></div></div></div>`)}
  ${sec('05',TX.sX,`<p class="t1-p">${T(TX.sXD)}</p>
    <div class="dz-card t1-chart"><h4>${T(TX.rvT)}</h4><canvas class="t1-cv" id="t16R"></canvas>
      <div class="lab-row"><button class="lab-chip" id="t16RP">▶</button><span class="t1-lab">${T(TX.mp)}: <b id="t16MV"></b></span><input type="range" class="lab-range" id="t16M" min="-2.5" max="1.1" step="0.01" value="-0.33" style="flex:1"></div></div>
    <div class="lab-kv" id="t16RKv"></div>
    <div class="t1-two"><div class="dz-card t4-m"><h4>${T(TX.clsT)}</h4><div class="t16-cls">${[[TX.cJ,TX.cJd,'#d9a873'],[TX.cN,TX.cNd,'#4f78e0'],[TX.cE,TX.cEd,'#3f7fe0']].map(([a,b,c])=>`<div><i style="background:${c}"></i><b>${T(a)}</b><span>${T(b)}</span></div>`).join('')}</div></div>
      <div class="dz-card t1-chart"><h4>${T(TX.cntT)}</h4><canvas class="t1-cv" id="t16C"></canvas><p class="t1-cap">${T(TX.cntC)}</p></div></div>`)}
  ${sec('06',K.U.gl,K.glHTML(GL))}
  ${sec('07',K.U.qa,K.qaHTML(QA))}
  ${sec('08',K.U.test,`<div class="dz-card t1-quiz" id="t16Quiz"></div>`)}`;

  /* 01 */
  let gp=0;
  const drawSz=K.draw(function(){ const cv=$('#t16Sz'); const {x,w,h}=fit(cv,.32,240), c=C(), k=Math.min(h*.8,w/3.2)/142984;
    const items=[...PL.map((p,i)=>[p[1],p[10],T(p[0]),i]),[12756,'#3f7fe0',T(TX.earth),-1]], tot=items.reduce((s,p)=>s+p[0]*k,0), gap=(w-tot)/6; let px=gap;
    items.forEach(p=>{ const r=p[0]*k/2; px+=r; ball(x,px,h*.45,Math.max(2,r),p[1]); if(p[3]===1){ x.strokeStyle='rgba(227,207,142,.8)'; x.lineWidth=2; x.beginPath(); x.ellipse(px,h*.45,r*2.2,r*.45,-.35,0,TAU); x.stroke(); }
      if(p[3]===gp){ x.strokeStyle=c.gold; x.lineWidth=2; x.beginPath(); x.arc(px,h*.45,r+5,0,TAU); x.stroke(); } lbl(x,p[2],px,h*.45+Math.max(r,8)+16,p[3]===gp?c.gold:c.text); px+=r+gap; });
    const p=PL[gp]; mark('gp',gp);
    $('#t16Kv').innerHTML=kv(T(TX.D),fmtN(p[1])+' km')+kv(T(TX.M),fmtN(p[2],2)+' M⊕',true)+kv(T(TX.rho),fmtN(p[3],2)+' g/sm³')+kv(T(TX.a),fmtN(p[4],1)+' a.b.')+kv(T(TX.v),fmtN(p[5],1)+' km/s')+kv(T(TX.T),T(p[6]))+kv(T(TX.day),p[7])+kv(T(TX.tmp),typeof p[8]==='string'?p[8]:T(p[8]))+kv(T(TX.moons),p[9]); });
  on('gp',v=>{ gp=+v; drawSz(); });

  /* 02 · Yupiter diski */
  let jr=0;
  const drawJ=K.draw(function(){ const cv=$('#t16J'); const {x,w,h}=fit(cv,.42,280), c=C(), R=Math.min(w*.3,h*.44), cx=w/2, cy=h/2, rx=R, ry=R*.935;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    x.save(); x.beginPath(); x.ellipse(cx,cy,rx,ry,0,0,TAU); x.clip();
    const bands=[[-1,-.72,'#b9a68a'],[-.72,-.5,'#e6d6b8'],[-.5,-.34,'#a5795a'],[-.34,-.12,'#efe2c6'],[-.12,.08,'#d9b88e'],[.08,.26,'#9c6a48'],[.26,.44,'#f0e4ca'],[.44,.62,'#b48a68'],[.62,1,'#c9b597']];
    bands.forEach(([a,b,col],i)=>{ x.fillStyle=col; x.fillRect(cx-rx,cy+a*ry,2*rx,(b-a)*ry+1); });
    for(let i=0;i<30;i++){ const yy=cy+(-.9+i*.06)*ry, off=Math.sin(i*1.7+jr*(1+(i%3)*.15))*rx*.1; x.strokeStyle='rgba(255,255,255,.08)'; x.beginPath(); x.moveTo(cx-rx,yy); x.bezierCurveTo(cx-rx/3+off,yy+3,cx+rx/3-off,yy-3,cx+rx,yy); x.stroke(); }
    const lon=((jr*.6)%TAU)-Math.PI/2, gx=cx+rx*Math.sin(lon)*Math.cos(.38), gy=cy+.33*ry;
    if(Math.cos(lon)>0){ x.fillStyle='#c4523a'; x.beginPath(); x.ellipse(gx,gy,rx*.21*Math.cos(lon),ry*.09,0,0,TAU); x.fill(); x.strokeStyle='rgba(255,230,210,.5)'; x.stroke(); }
    const sh=x.createRadialGradient(cx-rx*.3,cy-ry*.3,rx*.2,cx,cy,rx*1.05); sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(0,0,0,.55)'); x.fillStyle=sh; x.fillRect(cx-rx,cy-ry,2*rx,2*ry); x.restore();
    lbl(x,T(X('Katta Qizil Dog‘ · 30 000 × 13 000 km','Большое Красное Пятно · 30 000 × 13 000 км','Great Red Spot · 30,000 × 13,000 km')),cx,h-8,'#e8edff'); });
  play('#t16JP','j',dt=>{ jr+=dt; drawJ(); },2);

  /* Ichki tuzilish */
  let it='j';
  const drawIn=K.draw(function(){ const cv=$('#t16In'); const {x,w,h}=fit(cv,.72,300), c=C(), R=Math.min(w*.42,h*.88), cx=w*.06, cy=h*.94, L=INT[it];
    L.forEach(l=>{ x.fillStyle=l[2]; x.beginPath(); x.moveTo(cx,cy); x.arc(cx,cy,R*l[1],-Math.PI/2,0); x.closePath(); x.fill(); });
    L.forEach((l,i)=>{ const nx=i<L.length-1?L[i+1][1]:0, mid=(l[1]+nx)/2*R, a=-Math.PI/4, tx=cx+R+12, ty=cy-R+16+i*(R-10)/L.length;
      x.strokeStyle=c.dim; x.lineWidth=1; x.beginPath(); x.moveTo(cx+Math.cos(a)*mid,cy+Math.sin(a)*mid); x.lineTo(tx-4,ty-4); x.stroke(); lbl(x,T(l[0]),tx,ty,c.text,'left'); });
    mark('in',it); });
  on('in',v=>{ it=v; drawIn(); });

  /* Galiley yo'ldoshlari */
  let gd=0;
  const drawG=K.draw(function(){ const cv=$('#t16G'); const {x,w,h}=fit(cv,.72,300), c=C(), cx=w/2, cy=h*.42, sc=(w*.46)/1882700;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    GAL.forEach(g=>{ x.strokeStyle='rgba(200,210,255,.18)'; x.beginPath(); x.ellipse(cx,cy,g[2]*sc,g[2]*sc*.28,0,0,TAU); x.stroke(); });
    ball(x,cx,cy,69911*sc*1.6,'#d9a873');
    GAL.forEach(g=>{ const a=gd/g[3]*TAU, px=cx+Math.cos(a)*g[2]*sc, py=cy+Math.sin(a)*g[2]*sc*.28; dot(x,px,py,3.5,g[4]); lbl(x,typeof g[0]==='string'?g[0]:T(g[0]),px,py-7,'#cfd6f2'); });
    const by=h*.86, kk=Math.min(w/4/5268*.42,0.012); let bx=w*.12;
    GAL.forEach(g=>{ const r=g[1]*kk; ball(x,bx,by,r,g[4]); lbl(x,fmtN(g[1])+' km',bx,by+r+12,'#9aa6cc'); bx+=w*.25; });
    $('#t16GV').textContent=fmtN(gd,1)+' '+T(TX.dd); });
  play('#t16GP','g',dt=>{ gd+=dt; drawG(); },1.2);

  /* 03 · Saturn halqasi */
  const drawS=K.draw(function(){ const cv=$('#t16S'); const {x,w,h}=fit(cv,.62,320), c=C(), y=+$('#t16SY').value, B=26.75*Math.sin(y/29.46*TAU), R=Math.min(w*.17,h*.26), cx=w/2, cy=h/2, sb=Math.sin(B*D2R);
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const ring=(back)=>{ [[2.3,2.05,'rgba(225,205,160,.85)'],[2.0,1.62,'rgba(240,222,180,.95)'],[1.55,1.25,'rgba(200,180,140,.55)']].forEach(([o,i,col])=>{ x.fillStyle=col; x.beginPath(); x.ellipse(cx,cy,R*o,Math.max(.6,R*o*Math.abs(sb)),0,back?Math.PI:0,back?TAU:Math.PI); x.ellipse(cx,cy,R*i,Math.max(.4,R*i*Math.abs(sb)),0,back?TAU:Math.PI,back?Math.PI:0,true); x.fill(); }); };
    const front=sb>0; ring(front); ball(x,cx,cy,R,'#e3cf8e'); x.save(); x.beginPath(); x.arc(cx,cy,R,0,TAU); x.clip(); for(let i=-3;i<=3;i++){ x.fillStyle=i%2?'rgba(160,120,70,.18)':'rgba(255,240,200,.12)'; x.fillRect(cx-R,cy+i*R*.22,2*R,R*.1); } x.restore(); ring(!front);
    $('#t16SV').textContent=fmtN(y,1)+' / 29,46';
    $('#t16SKv').innerHTML=kv(T(TX.tilt),fmtN(Math.abs(B),1)+'°',true)+kv('',Math.abs(B)<2?T(TX.edge):(B>0?T(X('shimoliy tomoni','северная сторона','north face')):T(X('janubiy tomoni','южная сторона','south face'))))+kv(T(X('Halqa eni','Ширина кольца','Ring width')),'≈ 60 000 km')+kv(T(X('Qalinligi','Толщина','Thickness')),'10–15 km'); });
  $('#t16SY').oninput=drawS;

  /* 04 · Neptun va Uran */
  const drawN=K.draw(function(){ const cv=$('#t16N'); const {x,w,h}=fit(cv,.72,300), c=C(), yr=+$('#t16NY').value, cx=w/2, cy=h/2, s=Math.min(w,h)*.46/30.1;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    [19.2,30.1].forEach(r=>{ x.strokeStyle='rgba(200,210,255,.18)'; x.beginPath(); x.arc(cx,cy,r*s,0,TAU); x.stroke(); });
    const g=x.createRadialGradient(cx,cy,0,cx,cy,10); g.addColorStop(0,'#fff3c4'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,10,0,TAU); x.fill();
    const lu=(yr-1822)/84.01*TAU+1.2, ln=(yr-1822)/164.8*TAU+1.2, ux=cx+19.2*s*Math.cos(lu), uy=cy-19.2*s*Math.sin(lu), nx=cx+30.1*s*Math.cos(ln), ny=cy-30.1*s*Math.sin(ln);
    x.strokeStyle='rgba(255,198,92,.6)'; x.setLineDash([4,4]); x.beginPath(); x.moveTo(ux,uy); x.lineTo(nx,ny); x.stroke(); x.setLineDash([]);
    ball(x,ux,uy,6,'#8fd3dc'); lbl(x,T(PL[2][0]),ux,uy-10,'#cfd6f2');
    if(yr>=1846.7){ ball(x,nx,ny,6,'#4f78e0'); lbl(x,T(PL[3][0]),nx,ny-10,'#cfd6f2'); } else { x.strokeStyle='#4f78e0'; x.lineWidth=1.5; x.beginPath(); x.arc(nx,ny,6,0,TAU); x.stroke(); lbl(x,'?',nx,ny+4,'#8fb6ff'); }
    const d=Math.sin(lu-ln); x.strokeStyle=c.gold; x.lineWidth=2; const ta=lu+(d<0?1:-1)*Math.PI/2; x.beginPath(); x.moveTo(ux,uy); x.lineTo(ux-Math.cos(ta)*Math.abs(d)*26,uy+Math.sin(ta)*Math.abs(d)*26); x.stroke();
    $('#t16NV').textContent=Math.floor(yr); $('#t16NC').textContent=yr>=1846.7?T(TX.found):(yr<1822?T(TX.ahead):T(TX.behind)); });
  $('#t16NY').oninput=drawN;
  let tt=0;
  const drawT=K.draw(function(){ const cv=$('#t16T'); const {x,w,h}=fit(cv,.72,300), c=C(), cx=w/2, cy=h/2, R=Math.min(w,h)*.42;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(200,210,255,.2)'; x.beginPath(); x.arc(cx,cy,R*.42,0,TAU); x.stroke(); x.beginPath(); x.ellipse(cx+R*.45,cy,R*.55,R*.5,0,0,TAU); x.stroke();
    ball(x,cx,cy,16,'#4f78e0');
    const sp=-tt*1.6; x.strokeStyle='rgba(255,255,255,.7)'; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,24,sp,sp+1.2); x.stroke();
    const ta=tt/5.88*TAU, tx2=cx+R*.42*Math.cos(ta), ty2=cy+R*.42*Math.sin(ta); dot(x,tx2,ty2,4,'#d8cfc4'); lbl(x,'Triton ↻',tx2,ty2-8,'#e8edff');
    let M=-tt/360*TAU*6, E=M; for(let i=0;i<6;i++) E-=(E-.75*Math.sin(E)-M)/(1-.75*Math.cos(E));
    const nx=cx+R*.45+R*.55*Math.cos(E), ny=cy+R*.5*Math.sin(E); dot(x,nx,ny,2.5,'#a89a8a'); lbl(x,'Nereida',nx,ny-7,'#cfd6f2');
    lbl(x,T(X('Neptun aylanishi ↺, Triton ↻ teskari','Нептун вращается ↺, Тритон ↻ обратно','Neptune spins ↺, Triton orbits ↻ backwards')),cx,h-8,'#9aa6cc'); });
  play('#t16TP','t',dt=>{ tt+=dt; drawT(); },2);

  /* 05 · Nuriy tezlik */
  let rp=0;
  const drawR=K.draw(function(){ const cv=$('#t16R'); const {x,w,h}=fit(cv,.36,240), c=C(), mp=10**+$('#t16M').value, P=4.23, Kv=28.4*mp/Math.cbrt(P/365.25), ph=rp/P*TAU;
    const L=w*.34; x.fillStyle=c.day?'#f1e8d8':'#05081a'; x.fillRect(0,0,w,h);
    const cx=L*.5, cy=h*.5, ro=L*.36, ws=Math.min(ro*.4,4+Kv/60*ro*.3);
    x.strokeStyle=c.brd; x.setLineDash([3,4]); x.beginPath(); x.arc(cx,cy,ro,0,TAU); x.stroke(); x.setLineDash([]);
    const sx=cx-Math.cos(ph)*ws, sy=cy-Math.sin(ph)*ws*.4; const vr=Math.sin(ph);
    const sc=vr>0?'#ff8a6a':'#7fb0ff'; const g=x.createRadialGradient(sx,sy,0,sx,sy,16); g.addColorStop(0,'#fff'); g.addColorStop(.5,'#ffd27a'); g.addColorStop(1,sc); x.fillStyle=g; x.beginPath(); x.arc(sx,sy,12,0,TAU); x.fill();
    dot(x,cx+Math.cos(ph)*ro,cy+Math.sin(ph)*ro*.4,5,'#d9a873');
    lbl(x,'↓ '+T(X('Yerga','к Земле','to Earth')),cx,h-8,c.dim);
    const pl=L+30, pr=12, pt=14, pb=24, W=w-pl-pr, mid=pt+(h-pt-pb)/2, A=(h-pt-pb)/2*.85, ymax=Math.max(70,Kv*1.1), sy2=v=>mid-v/ymax*A;
    x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,mid); x.lineTo(w-pr,mid); x.stroke();
    x.fillStyle=c.day?'rgba(200,80,60,.08)':'rgba(255,120,90,.08)'; x.fillRect(pl,sy2(13),W,sy2(-13)-sy2(13));
    lbl(x,'±13 m/s',w-pr,sy2(13)-3,c.dim,'right');
    x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); for(let i=0;i<=W;i+=2){ const t=i/W*3*P, v=Kv*Math.sin(t/P*TAU); i?x.lineTo(pl+i,sy2(v)):x.moveTo(pl+i,sy2(v)); } x.stroke();
    const cxp=pl+(rp%(3*P))/(3*P)*W; dot(x,cxp,sy2(Kv*vr),4,c.gold);
    for(let d=0;d<=12;d+=4) lbl(x,d+' '+T(TX.dd),pl+d/(3*P)*W,h-6,c.dim);
    x.fillStyle=c.dim; x.textAlign='right'; x.font='10px system-ui'; x.fillText(fmtN(ymax)+' m/s',pl-4,pt+6);
    $('#t16MV').textContent=fmtN(mp,mp<.1?3:2)+' '+T(TX.mj)+' ≈ '+fmtN(mp*317.8,mp<.1?1:0)+' M⊕';
    $('#t16RKv').innerHTML=kv('P','4,23 '+T(TX.dd))+kv(T(TX.K),fmtN(Kv,1)+' m/s',true)+kv(T(TX.det),T(Kv>13?TX.yes:TX.no))+kv(T(X('Turi','Тип','Type')),T(mp*317.8<7?TX.cE:mp*317.8<60?TX.cN:TX.cJ)); });
  $('#t16M').oninput=drawR; play('#t16RP','r',dt=>{ rp+=dt; drawR(); },1.4);
  K.draw(function(){ const cv=$('#t16C'); const {x,w,h}=fit(cv,.6,260), c=C(), D=[[1995,1],[2000,20],[2005,180],[2009,350],[2012,850],[2014,1800],[2016,3400],[2018.25,3767]], pl=40, pr=12, pt=12, pb=22, sx=y=>pl+(y-1994)/(2019-1994)*(w-pl-pr), sy=v=>pt+(1-v/4000)*(h-pt-pb);
    [0,1000,2000,3000,4000].forEach(v=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(v)); x.lineTo(w-pr,sy(v)); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(v,pl-4,sy(v)+3); });
    [1995,2000,2005,2010,2015].forEach(y=>lbl(x,String(y),sx(y),h-6,c.dim));
    x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); D.forEach((d,i)=>i?x.lineTo(sx(d[0]),sy(d[1])):x.moveTo(sx(d[0]),sy(d[1]))); x.stroke();
    [[1995,1,'51 Peg'],[2009,350,'Kepler'],[2018.25,3767,'3767']].forEach(([a,b,s])=>{ dot(x,sx(a),sy(b),4,c.gold); lbl(x,s,sx(a)+(a>2015?-6:6),sy(b)-6,c.gold,a>2015?'right':'left'); }); });

  K.bindQA(); K.quiz($('#t16Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK||!window.DZ16) return setTimeout(add,50); window.DARSLIK.add({ id:'t16', get GL(){ return (window.DZ16||{}).GL; }, get QZ(){ return (window.DZ16||{}).QZ; }, ico:'🪐', title:window.DZ16.TX.title, sub:window.DZ16.TX.sub, build }); };
add();
})();
