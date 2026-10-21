/* DARSLIK · 15-mavzu (39–40-§). Yer rusumidagi planetalar */
(function(){
function build(el, api){
  const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU, {TX,PL,ATM,LAY,MARS,GL,QA,QZ}=window.DZ15;
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const ball=(x,px,py,r,col)=>{ const g=x.createRadialGradient(px-r*.35,py-r*.35,r*.1,px,py,r); g.addColorStop(0,'#fff'); g.addColorStop(.25,col); g.addColorStop(1,'#111'); x.fillStyle=g; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<div class="lab-row" style="margin:0">${chips('pl',PL.map((p,i)=>[i,T(p[0])]))}</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t15Sz"></canvas></div>
    <div class="t1-two"><div class="lab-kv" id="t15Kv"></div>
      <div class="dz-card t4-m"><h4>${T(TX.wT)}</h4><label class="t1-ctl"><span>${T(TX.wIn)}: <b id="t15WV"></b></span><input type="range" class="lab-range" id="t15W" min="10" max="150" step="1" value="80"></label><div class="lab-kv" id="t15WKv"></div></div></div>`)}
  ${sec('02',TX.sM,`<p class="t1-p">${T(TX.sMD)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t15Me"></canvas>
      <div class="lab-row"><button class="lab-chip" id="t15MP">▶</button><input type="range" class="lab-range" id="t15M" min="0" max="1" step="0.002" value="0" style="flex:1"></div></div>
    <div class="t1-side"><div class="lab-kv" id="t15MKv"></div></div></div>`)}
  ${sec('03',TX.sV,`<p class="t1-p">${T(TX.sVD)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t15Ve"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.pos)}: <b id="t15VV"></b></span><input type="range" class="lab-range" id="t15V" min="0" max="360" step="1" value="120"></label><div class="lab-kv" id="t15VKv"></div></div></div>
    <p class="t1-p">${T(TX.vAtm)}</p>`)}
  ${sec('04',TX.sE,`<p class="t1-p">${T(TX.sED)}</p><div class="t1-two"><div class="dz-card t1-chart"><h4>${T(TX.inT)}</h4><canvas class="t1-cv" id="t15In"></canvas></div>
    <div class="dz-card t4-m"><h4>${T(TX.atmT)}</h4><div class="t15-atm">${ATM.map(a=>`<div><span><b>${T(a[0])}</b> · ${a[1]}</span><div class="t15-bar">${a[2].map(s=>`<i style="width:${s[1]}%;background:${s[2]}" title="${s[0]} ${s[1]}%"></i>`).join('')}</div><small>${a[2].map(s=>s[0]+' '+String(s[1]).replace('.',',')+'%').join(' · ')}</small></div>`).join('')}</div></div></div>
    <p class="t1-p">${T(TX.magD)}</p>`)}
  ${sec('05',TX.sMo,`<p class="t1-p">${T(TX.sMoD)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t15Mo"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.mDist)}: <b id="t15DV"></b></span><input type="range" class="lab-range" id="t15D" min="363400" max="405400" step="100" value="384400"></label>
      <div class="lab-row" style="margin:0">${chips('md',[[363400,T(TX.perig)],[405400,T(TX.apog)]])}</div><div class="lab-kv" id="t15MoKv"></div></div></div>`)}
  ${sec('06',TX.sMa,`<p class="t1-p">${T(TX.sMaD)}</p>
    <div class="t1-two"><div class="dz-card t1-chart"><h4>${T(TX.relT)}</h4><canvas class="t1-cv" id="t15Re"></canvas><div class="lab-row" style="margin:0">${chips('mr',MARS.map((m,i)=>[i,T(m[0])]))}</div><p class="t1-p" id="t15ReD"></p></div>
      <div class="dz-card t1-chart"><h4>${T(TX.moonT)}</h4><canvas class="t1-cv" id="t15Ph"></canvas><div class="lab-row"><button class="lab-chip" id="t15PP">▶</button><span class="t1-lab">${T(TX.hrs)}: <b id="t15PV"></b></span></div><p class="t1-p">${T(TX.moonD)}</p></div></div>`)}
  ${sec('07',K.U.gl,K.glHTML(GL))}
  ${sec('08',K.U.qa,K.qaHTML(QA))}
  ${sec('09',K.U.test,`<div class="dz-card t1-quiz" id="t15Quiz"></div>`)}`;

  /* 01 · Solishtirish */
  let sp=0;
  const drawSz=K.draw(function(){ const cv=$('#t15Sz'); const {x,w,h}=fit(cv,.3,220), c=C(), mx=12756, k=Math.min(h*.36,w/11)/ (mx/2);
    const tot=PL.reduce((s,p)=>s+p[2]*k,0), gap=(w-tot)/5; let px=gap;
    PL.forEach((p,i)=>{ const r=p[2]*k/2; px+=r; ball(x,px,h*.45,r,p[8]); if(i===sp){ x.strokeStyle=c.gold; x.lineWidth=2; x.beginPath(); x.arc(px,h*.45,r+5,0,TAU); x.stroke(); }
      lbl(x,T(p[0]),px,h*.45+r+18,i===sp?c.gold:c.text); lbl(x,fmtN(p[2])+' km',px,h*.45+r+32,c.dim); px+=r+gap; });
    const p=PL[sp]; mark('pl',sp);
    $('#t15Kv').innerHTML=kv(T(TX.a),fmtN(p[1],1)+' mln km ('+fmtN(p[1]/149.6,2)+' a.b.)')+kv(T(TX.D),fmtN(p[2])+' km ('+fmtN(p[2]/12756,3)+' D⊕)')+kv(T(TX.g),fmtN(p[3],2)+' m/s²')+kv(T(TX.T),fmtN(p[4],2)+' '+T(X('sutka','сут','d')))+kv(T(TX.rot),T(p[5]))+kv(T(TX.rho),fmtN(p[6],2)+' g/sm³')+kv(T(TX.tmp),p[7])+kv(T(TX.v),'≈ '+p[10]+' km/s')+kv(T(TX.sat),String(p[9]),true); wt(); });
  const wt=()=>{ const m=+$('#t15W').value, p=PL[sp]; $('#t15WV').textContent=m+' kg'; $('#t15WKv').innerHTML=kv(T(TX.wOut)+' ('+T(p[0])+')','≈ '+fmtN(m*p[3]/9.81,1)+' kg',true)+kv('g / g⊕',fmtN(p[3]/9.81,2)); };
  on('pl',v=>{ sp=+v; drawSz(); }); $('#t15W').oninput=wt;

  /* 02 · Merkuriy orbitasi */
  let mph=0, mRun=false, mL=0;
  const drawMe=K.draw(function(){ const cv=$('#t15Me'); const {x,w,h}=fit(cv,.7,360), c=C(), e=.2056, a=Math.min(w*.4,h*.46/Math.sqrt(1-e*e)), b=a*Math.sqrt(1-e*e), cx=w/2+a*e, cy=h/2, fx=cx-a*e;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h); x.strokeStyle='rgba(185,164,140,.6)'; x.lineWidth=1.5; x.beginPath(); x.ellipse(cx,cy,a,b,0,0,TAU); x.stroke();
    const g=x.createRadialGradient(fx,cy,0,fx,cy,20); g.addColorStop(0,'#fff3c4'); g.addColorStop(.5,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(fx,cy,20,0,TAU); x.fill();
    let E=mph*TAU; for(let i=0;i<8;i++) E-=(E-e*Math.sin(E)-mph*TAU)/(1-e*Math.cos(E));
    const px=cx-a*Math.cos(E), py=cy-b*Math.sin(E), r=.387*(1-e*Math.cos(E));
    x.strokeStyle='rgba(255,198,92,.5)'; x.beginPath(); x.moveTo(fx,cy); x.lineTo(px,py); x.stroke(); ball(x,px,py,8,'#b9a48c');
    lbl(x,'0,31 a.b.',cx-a-6,cy-10,'#e8edff','right'); lbl(x,'0,47 a.b.',cx+a+6,cy-10,'#e8edff','left');
    const Tsun=(r=>-180+(480+180)*Math.max(0,Math.min(1,(.47-r)/.16+.35)))(r);
    $('#t15M').value=mph;
    $('#t15MKv').innerHTML=kv(T(TX.dist),fmtN(r,3)+' a.b. = '+fmtN(r*149.6,1)+' mln km',true)+kv(T(TX.day),fmtN(mph*87.97,1)+' / 87,97')+kv(T(TX.v),fmtN(47.4*Math.sqrt(2/(r/.387)-1),1)+' km/s')+kv('E / E⊕',fmtN(1/r**2,1)+'×'); });
  $('#t15M').oninput=e=>{ mph=+e.target.value; drawMe(); };
  const mStep=n=>{ if(!mRun) return; mph=(mph+Math.min(.05,(n-mL)/1000)*.1)%1; mL=n; drawMe(); K.rafs.me=requestAnimationFrame(mStep); };
  $('#t15MP').onclick=()=>{ mRun=!mRun; $('#t15MP').textContent=mRun?'⏸':'▶'; click(700); if(mRun){ mL=performance.now(); K.rafs.me=requestAnimationFrame(mStep); } };

  /* 03 · Venera fazalari */
  const drawVe=K.draw(function(){ const cv=$('#t15Ve'); const {x,w,h}=fit(cv,.62,340), c=C(), th=+$('#t15V').value*D2R, s=Math.min(w*.3,h*.42), cx=w*.36, cy=h/2, rv=.723;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(232,194,122,.4)'; x.setLineDash([4,4]); x.beginPath(); x.arc(cx,cy,s*rv,0,TAU); x.stroke(); x.strokeStyle='rgba(120,170,255,.4)'; x.beginPath(); x.arc(cx,cy,s,0,TAU); x.stroke(); x.setLineDash([]);
    const g=x.createRadialGradient(cx,cy,0,cx,cy,18); g.addColorStop(0,'#fff3c4'); g.addColorStop(.5,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,18,0,TAU); x.fill();
    const ex=cx, ey=cy+s, vx=cx+s*rv*Math.sin(th), vy=cy+s*rv*Math.cos(th);
    dot(x,ex,ey,7,'#3f7fe0'); dot(x,vx,vy,6,'#e8c27a'); x.strokeStyle='rgba(255,255,255,.25)'; x.beginPath(); x.moveTo(ex,ey); x.lineTo(vx,vy); x.stroke();
    const d=Math.hypot(vx-ex,vy-ey)/s, sv=[cx-vx,cy-vy], ve=[ex-vx,ey-vy], ph=Math.acos((sv[0]*ve[0]+sv[1]*ve[1])/(Math.hypot(...sv)*Math.hypot(...ve))), k=(1+Math.cos(ph))/2, ang=60*.28/d*1.0;
    const vr=Math.min(h*.36,10+44*.28/d), vcx=w*.82, vcy=cy;
    x.fillStyle='#1d1a12'; x.beginPath(); x.arc(vcx,vcy,vr,0,TAU); x.fill();
    const cross=sv[0]*ve[1]-sv[1]*ve[0], right=cross<0;
    x.fillStyle='#f4e2b0'; x.beginPath(); x.arc(vcx,vcy,vr,-Math.PI/2,Math.PI/2,!right); const ce=Math.cos(ph); x.ellipse(vcx,vcy,Math.abs(ce)*vr,vr,0,Math.PI/2,-Math.PI/2,right?ce>0:ce<0); x.fill();
    lbl(x,T(TX.phase),vcx,vcy+Math.max(vr,20)+18,c.dim);
    $('#t15VV').textContent=Math.round(th/D2R)+'°';
    $('#t15VKv').innerHTML=kv(T(TX.lit),fmtN(k*100)+'%',true)+kv(T(TX.dist),fmtN(d,2)+' a.b.')+kv(T(TX.size),fmtN(60*.28/d*1.07*.98,0)+'″'); });
  $('#t15V').oninput=drawVe;

  /* 04 · Yer ichki tuzilishi */
  K.draw(function(){ const cv=$('#t15In'); const {x,w,h}=fit(cv,.7,340), c=C(), R=Math.min(w*.46,h*.9), cx=w*.06, cy=h*.95, k=R/6371;
    [...LAY].reverse().forEach(l=>{ x.fillStyle=l[2]; x.beginPath(); x.moveTo(cx,cy); x.arc(cx,cy,l[1]*k,-Math.PI/2,0); x.closePath(); x.fill(); });
    LAY.forEach((l,i)=>{ const prev=i?LAY[i-1][1]:0, mid=(prev+l[1])/2*k, a=-Math.PI/4; const px=cx+Math.cos(a)*mid, py=cy+Math.sin(a)*mid, tx=cx+R+14, ty=cy-R+18+i*(R-20)/5;
      x.strokeStyle=c.dim; x.lineWidth=1; x.beginPath(); x.moveTo(px,py); x.lineTo(tx-4,ty-4); x.stroke(); lbl(x,T(l[0]),tx,ty,c.text,'left'); lbl(x,fmtN(6371-l[1])+'–'+fmtN(6371-prev)+' km',tx,ty+13,c.dim,'left'); });
    lbl(x,'R = 6371 km',cx+R/2,cy+0-4,c.text); });

  /* 05 · Oy */
  const drawMo=K.draw(function(){ const cv=$('#t15Mo'); const {x,w,h}=fit(cv,.5,280), c=C(), d=+$('#t15D').value, aM=2*Math.atan(1738/d)/D2R*60, aE=2*Math.atan(6371/d)/D2R*60, s=h*.28/31;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    ball(x,w*.28,h*.45,aM*s/2*1.0,'#cfcfcf'); lbl(x,T(X('Yerdan Oy','Луна с Земли','Moon from Earth')),w*.28,h*.9,'#cfd6f2');
    ball(x,w*.72,h*.45,aE*s/2,'#3f7fe0'); lbl(x,T(X('Oydan Yer','Земля с Луны','Earth from the Moon')),w*.72,h*.9,'#cfd6f2');
    $('#t15DV').textContent=fmtN(d)+' km'; mark('md',d);
    $('#t15MoKv').innerHTML=kv(T(TX.mAng),fmtN(aM,1)+'′')+kv(T(TX.eAng),fmtN(aE/60,2)+'° ('+fmtN(aE/aM,1)+'×)',true)+kv('M⊕ / M☾','81')+kv('g☾','1,63 m/s²'); });
  $('#t15D').oninput=drawMo; on('md',v=>{ $('#t15D').value=v; drawMo(); });

  /* 06 · Mars relyefi */
  let mr=0;
  const drawRe=K.draw(function(){ const cv=$('#t15Re'); const {x,w,h}=fit(cv,.42,230), c=C(), base=h*.62, kz=h*.5/30;
    x.fillStyle=c.day?'#f1e1cf':'#160a06'; x.fillRect(0,0,w,h);
    x.fillStyle=c.day?'rgba(120,170,255,.15)':'rgba(120,170,255,.08)'; x.fillRect(0,0,w,base-27*kz-6);
    x.strokeStyle=c.dim; x.setLineDash([3,3]); x.beginPath(); x.moveTo(0,base); x.lineTo(w,base); x.stroke(); x.setLineDash([]); lbl(x,'0 km',4,base-4,c.dim,'left');
    const prof=u=>{ const o=27*Math.exp(-(((u-.18)/.06)**2)), ar=18*Math.exp(-(((u-.36)/.035)**2)), cn=-2*(Math.abs(u-.5)<.025?1:0), nv=-1*(Math.abs(u-.64)<.008?1:0), hel=-7*Math.exp(-(((u-.84)/.07)**4)); return o+ar+cn+nv+hel+.6*Math.sin(u*80)*.3; };
    const g=x.createLinearGradient(0,base-27*kz,0,h); g.addColorStop(0,'#e8a07a'); g.addColorStop(1,'#7a3018'); x.fillStyle=g;
    x.beginPath(); x.moveTo(0,h); for(let i=0;i<=w;i+=2) x.lineTo(i,base-prof(i/w)*kz); x.lineTo(w,h); x.closePath(); x.fill();
    const us=[.18,.36,.5,.64,.84], u=us[mr], px=u*w, py=base-prof(u)*kz; x.strokeStyle=c.gold; x.lineWidth=2; x.beginPath(); x.moveTo(px,py-6); x.lineTo(px,py-28); x.stroke(); dot(x,px,py-30,4,c.gold);
    lbl(x,(MARS[mr][2]>0?'+':'')+MARS[mr][2]+' km',px,py-38,c.gold);
    ['Olimp','Arsiya',T(X('jarlik','каньон','canyon')),'Nirgal','Ellada'].forEach((s,i)=>lbl(x,s,us[i]*w,h-6,i===mr?c.gold:c.dim));
    mark('mr',mr); $('#t15ReD').innerHTML=T(MARS[mr][1]); });
  on('mr',v=>{ mr=+v; drawRe(); });

  /* 06 · Fobos va Deymos */
  let ht=0, pRun=false, pL=0;
  const drawPh=K.draw(function(){ const cv=$('#t15Ph'); const {x,w,h}=fit(cv,.8,260), c=C(), cx=w/2, cy=h/2, Rm=3390, sc=Math.min(w,h)*.46/(Rm+20000);
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(200,200,220,.25)'; x.setLineDash([3,4]); [Rm+6000,Rm+20000].forEach(r=>{ x.beginPath(); x.arc(cx,cy,r*sc,0,TAU); x.stroke(); }); x.setLineDash([]);
    ball(x,cx,cy,Rm*sc,'#d8603a');
    const rotA=-ht/24.66*TAU; x.strokeStyle='rgba(255,255,255,.6)'; x.lineWidth=2; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.cos(rotA)*Rm*sc,cy+Math.sin(rotA)*Rm*sc); x.stroke();
    const pa=-ht/7.05*TAU, da=-ht/30.3*TAU;
    dot(x,cx+Math.cos(pa)*(Rm+6000)*sc,cy+Math.sin(pa)*(Rm+6000)*sc,4,'#c9b8a6'); lbl(x,'Fobos',cx+Math.cos(pa)*(Rm+6000)*sc,cy+Math.sin(pa)*(Rm+6000)*sc-8,'#e8edff');
    dot(x,cx+Math.cos(da)*(Rm+20000)*sc,cy+Math.sin(da)*(Rm+20000)*sc,3,'#a89a8a'); lbl(x,'Deymos',cx+Math.cos(da)*(Rm+20000)*sc,cy+Math.sin(da)*(Rm+20000)*sc-8,'#e8edff');
    $('#t15PV').textContent=fmtN(ht,1)+' '+T(TX.hh); });
  const pStep=n=>{ if(!pRun) return; ht+=Math.min(.05,(n-pL)/1000)*3; pL=n; drawPh(); K.rafs.ph=requestAnimationFrame(pStep); };
  $('#t15PP').onclick=()=>{ pRun=!pRun; $('#t15PP').textContent=pRun?'⏸':'▶'; click(700); if(pRun){ pL=performance.now(); K.rafs.ph=requestAnimationFrame(pStep); } };

  K.bindQA(); K.quiz($('#t15Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK||!window.DZ15) return setTimeout(add,50); window.DARSLIK.add({ id:'t15', get GL(){ return (window.DZ15||{}).GL; }, get QZ(){ return (window.DZ15||{}).QZ; }, ico:'🌍', title:window.DZ15.TX.title, sub:window.DZ15.TX.sub, build }); };
add();
})();
