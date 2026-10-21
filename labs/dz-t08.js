/* DARSLIK · 8-mavzu (22–23-§). Parallaks, masofalar, radiuslar */
(function(){
function build(el, api){
  const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU, {TX,OBJ,RAD,GL,QA,QZ}=window.DZ8, RE=6378, C_=299792.458;
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11.5px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const ln=(x,a,b,c,d,col,w,dash)=>{ x.strokeStyle=col; x.lineWidth=w||1; x.setLineDash(dash||[]); x.beginPath(); x.moveTo(a,b); x.lineTo(c,d); x.stroke(); x.setLineDash([]); };
  const sec2=v=>v>=60?fmtN(v/60,1)+'′ ('+fmtN(v,1)+'″)':fmtN(v,v<10?3:1)+'″';
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t8Par"></canvas><p class="t1-cap">${T(TX.exag)}</p></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.z)}: <b id="t8ZV"></b></span><input type="range" class="lab-range" id="t8Z" min="0" max="90" step="1" value="60"></label>
      <div class="lab-row" style="margin:0">${chips('ob',OBJ.map((o,i)=>[i,T(o[0])]))}</div><div class="t1-formula">p = p₀ · sin z</div><div class="lab-kv" id="t8PKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-formula">L = R⊕ / sin p₀ = 206265 · R⊕ / p₀″</div>
    <div class="dz-card t4-m"><label class="t1-ctl"><span>${T(TX.p0)}: <b id="t8LV"></b></span><input type="range" class="lab-range" id="t8L" min="0" max="3.6" step="0.001" value="0.944"></label>
      <div class="lab-row" style="margin:0">${chips('lp',OBJ.map((o,i)=>[i,T(o[0])]))}</div><div class="lab-kv t2-kv5" id="t8LKv"></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p>
    <div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.target)}</span>${chips('rd',RAD.map((r,i)=>[i,T(r[0])]))}<button class="lab-chip" id="t8Go">📡 ${T(TX.send)}</button></div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t8Rad"></canvas></div><div class="lab-kv" id="t8RKv"></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t8Rr"></canvas></div>
    <div class="t1-side"><div class="lab-row" style="margin:0">${chips('rr',OBJ.map((o,i)=>[i,T(o[0])]))}</div><div class="t1-formula">r = R⊕ · ρ″ / p₀″</div><div class="lab-kv" id="t8XKv"></div></div></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t8Quiz"></div>`)}`;

  /* 01 · Sutkalik parallaks (29-rasm) */
  let ob=0;
  const drawPar=K.draw(function(){ const cv=$('#t8Par'); const {x,w,h}=fit(cv,.72,420), c=C(), R=Math.min(w,h)*.2, ox=w*.24, oy=h*.6, z=+$('#t8Z').value*D2R, Lp=w*.62;
    x.fillStyle=c.day?'#eadfc8':'#0b1230'; x.beginPath(); x.arc(ox,oy,R,0,TAU); x.fill(); x.strokeStyle=c.brd; x.stroke();
    const kx=ox, ky=oy-R, cx2=ox, cy2=oy+R*.0, mx=kx+Math.sin(z)*Lp, my=ky-Math.cos(z)*Lp*.55;
    const m0x=kx+Lp*.98, m0y=ky;
    ln(x,ox,oy,kx,ky-R*1.5,c.dim,1,[3,4]); lbl(x,'Z',kx,ky-R*1.5-6,c.dim);
    ln(x,ox,oy,kx,ky,c.text,1.6); lbl(x,'R⊕',ox-12,oy-R*.5,c.text,'right');
    ln(x,kx,ky,m0x,m0y,c.dim,1,[4,4]); ln(x,ox,oy,m0x,m0y,c.dim,1,[4,4]); dot(x,m0x,m0y,4,c.dim); lbl(x,'M₀',m0x,m0y-9,c.dim);
    ln(x,kx,ky,mx,my,c.gold,1.6); ln(x,ox,oy,mx,my,c.neon2,1.6);
    const col=OBJ[ob][3]; dot(x,mx,my,7,col); lbl(x,'M',mx+12,my-6,c.text,'left');
    const sky=h*.07; ln(x,0,sky,w,sky,c.brd,1); for(let i=0;i<30;i++) dot(x,(i*71)%w,sky-6+(i*13)%10,.8,c.dim);
    const pr=(px,py,qx,qy)=>{ const t=(sky-py)/(qy-py); return px+(qx-px)*t; };
    const m1=pr(kx,ky,mx,my), m2=pr(ox,oy,mx,my); dot(x,m1,sky,4,c.gold); dot(x,m2,sky,4,c.neon2); lbl(x,'M₁',m1,sky+16,c.gold); lbl(x,'M₂',m2,sky+16,c.neon2);
    dot(x,ox,oy,3,c.text); lbl(x,'O',ox-10,oy+14,c.text); dot(x,kx,ky,4,c.gold); lbl(x,'K',kx-12,ky-4,c.gold);
    const a1=Math.atan2(ky-my,kx-mx), a2=Math.atan2(oy-my,ox-mx); x.strokeStyle='#e0604f'; x.lineWidth=2; x.beginPath(); x.arc(mx,my,30,Math.min(a1,a2),Math.max(a1,a2)); x.stroke(); lbl(x,'p',mx-38*Math.cos((a1+a2)/2)*-1,my+38*Math.sin((a1+a2)/2)+4,'#e0604f');
    const p0=OBJ[ob][1], p=p0*Math.sin(z); mark('ob',ob); $('#t8ZV').textContent=Math.round(z/D2R)+'°';
    $('#t8PKv').innerHTML=kv('p₀',sec2(p0))+kv('p',sec2(p),true)+kv(T(TX.L),fmtN(206265*RE/p0/1e6,p0>100?3:1)+' mln km'); });
  $('#t8Z').oninput=drawPar; on('ob',v=>{ ob=+v; drawPar(); });

  /* 02 · Masofa kalkulyatori (log shkala) */
  const setL=lg=>{ const p0=10**lg; mark('lp',''); $('#t8LV').textContent=sec2(p0); const L=206265*RE/p0;
    $('#t8LKv').innerHTML=kv('p₀',sec2(p0))+kv(T(TX.L),fmtN(L/1e6,L<1e7?3:2)+' mln km',true)+kv(T(TX.L)+' · '+T(TX.Re),fmtN(206265/p0))+kv(T(TX.L)+' · a.b.',fmtN(L/149597870,3))+kv('sin p₀',(p0/206265).toExponential(3)); };
  $('#t8L').oninput=e=>setL(+e.target.value); on('lp',v=>{ const lg=Math.log10(OBJ[+v][1]); $('#t8L').value=lg; setL(lg); mark('lp',v); }); setL(Math.log10(8.794));
  $('#t8L').value=Math.log10(8.794);

  /* 03 · Radiolokatsiya */
  let rd=0, rt0=0, rRun=false, rEl=0;
  const drawRad=K.draw(function(){ const cv=$('#t8Rad'); const {x,w,h}=fit(cv,.3,200), c=C(), y=h/2, ex=40, px=w-50, D=RAD[rd][1], tt=2*D/C_;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    dot(x,ex,y,16,'#3f7fe0'); lbl(x,T(X('Yer','Земля','Earth')),ex,y+34,'#cfd6f2');
    dot(x,px,y,rd===3?20:12,['#cfcfcf','#e8c27a','#d8603a','#ffb347'][rd]); lbl(x,T(RAD[rd][0]),px,y+36,'#cfd6f2','right');
    ln(x,ex+18,y,px-14,y,'rgba(160,180,255,.25)',1,[3,5]);
    if(rRun||rEl>0){ const f=Math.min(1,rEl/tt), out=f<.5, s=out?f*2:2-f*2, sx=ex+18+(px-14-ex-18)*s;
      for(let k=0;k<3;k++){ x.strokeStyle=`rgba(255,198,92,${.9-k*.28})`; x.lineWidth=2; x.beginPath(); x.arc(sx-(out?k*8:-k*8),y,10+k*5,out?-.6:Math.PI-.6,out?.6:Math.PI+.6); x.stroke(); } }
    const fmtT=s=>s<120?fmtN(s,2)+' s':fmtN(s/60,1)+' min';
    $('#t8RKv').innerHTML=kv(T(TX.echo),fmtT(tt),true)+kv(T(TX.elapsed),fmtT(Math.min(rEl,tt)))+kv('L = c·t / 2',fmtN(D/1e6,D<1e7?4:1)+' mln km'); mark('rd',rd); });
  const rStep=n=>{ if(!rRun) return; const tt=2*RAD[rd][1]/C_, k=tt/3.5; rEl=(n-rt0)/1000*k; if(rEl>=tt){ rEl=tt; rRun=false; click(880); } drawRad(); if(rRun) K.rafs.rad=requestAnimationFrame(rStep); };
  $('#t8Go').onclick=()=>{ click(660); rRun=true; rEl=0; rt0=performance.now(); K.rafs.rad=requestAnimationFrame(rStep); };
  on('rd',v=>{ rd=+v; rRun=false; rEl=0; drawRad(); });

  /* 04 · Radiuslar (30-rasm) */
  let rr=1;
  const drawRr=K.draw(function(){ const cv=$('#t8Rr'); const {x,w,h}=fit(cv,.7,380), c=C(), o=OBJ[rr], r=o[2]/o[1];
    const top=h*.5, ox=w*.12, px=w*.82, sc=Math.min(h*.36,(w*.3))/Math.max(1,r), Rp=Math.max(3,1*sc), rp=Math.max(3,r*sc);
    x.fillStyle=c.day?'#cdd9ee':'#16304f'; x.beginPath(); x.arc(ox,top,Math.min(Rp,h*.36),0,TAU); x.fill();
    dot(x,px,top,Math.min(rp,h*.4),o[3]);
    ln(x,ox,top,px,top,c.dim,1,[4,4]); ln(x,px,top,ox,top-Math.min(Rp,h*.36),c.gold,1.4); ln(x,ox,top,px,top-Math.min(rp,h*.4),c.neon2,1.4);
    ln(x,ox,top,ox,top-Math.min(Rp,h*.36),c.text,2); ln(x,px,top,px,top-Math.min(rp,h*.4),c.text,2);
    lbl(x,'O',ox,top+16,c.text); lbl(x,'E',ox-10,top-Math.min(Rp,h*.36)-4,c.text); lbl(x,'P',px,top+16,c.text); lbl(x,"O′",px+12,top-Math.min(rp,h*.4)-4,c.text,'left');
    lbl(x,'R⊕',ox+14,top-Math.min(Rp,h*.36)/2,c.text,'left'); lbl(x,'r',px-8,top-Math.min(rp,h*.4)/2,c.text,'right'); lbl(x,'L',(ox+px)/2,top+16,c.dim);
    lbl(x,'p₀',px-60,top-8,c.gold); lbl(x,'ρ',ox+56,top-8,c.neon2);
    lbl(x,T(TX.seeT),w/2,h-8,c.dim);
    mark('rr',rr); $('#t8XKv').innerHTML=kv('p₀',sec2(o[1]))+kv('ρ',sec2(o[2]))+kv(T(TX.r),fmtN(r,r<1?3:2)+' R⊕ ≈ '+fmtN(r*RE)+' km',true); });
  on('rr',v=>{ rr=+v; drawRr(); });

  K.bindQA(); K.quiz($('#t8Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK||!window.DZ8) return setTimeout(add,50); window.DARSLIK.add({ id:'t08', get GL(){ return (window.DZ8||{}).GL; }, get QZ(){ return (window.DZ8||{}).QZ; }, ico:'📐', title:window.DZ8.TX.title, sub:window.DZ8.TX.sub, build }); };
add();
})();
