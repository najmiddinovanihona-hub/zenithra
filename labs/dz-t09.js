/* DARSLIK · 9-mavzu (24–26-§). Birliklar, Kepler qonunlari, massalar */
(function(){
function build(el, api){
  const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU, {TX,DST,SAT,GL,QA,QZ}=window.DZ9, PL=window.DZ7?window.DZ7.PL:[];
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const AU=149.6e6, LY=9.4607e12, PC=30.857e12, UN=[['km',1],['a.b.',AU],['y.y.',LY],['pk',PC],['kpk',PC*1e3],['Mpk',PC*1e6]];
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11.5px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const ln=(x,a,b,c,d,col,w,dash)=>{ x.strokeStyle=col; x.lineWidth=w||1; x.setLineDash(dash||[]); x.beginPath(); x.moveTo(a,b); x.lineTo(c,d); x.stroke(); x.setLineDash([]); };
  const sci=v=>{ if(v===0) return '0'; const e=Math.floor(Math.log10(Math.abs(v))); if(e>=-2&&e<7) return fmtN(v,v<10?3:v<1000?2:0); const m=v/10**e; return fmtN(m,2)+'·10'+String(e).split('').map(ch=>'⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(ch)]||'⁻').join(''); };
  const kep=(M,e)=>{ let E=M; for(let i=0;i<8;i++) E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E)); return E; };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p>
    <div class="dz-card t4-m"><div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.val)}</span><input type="number" class="lab-date" id="t9V" value="1" step="any" style="width:130px"><select class="lab-date" id="t9U">${UN.map((u,i)=>`<option value="${i}"${i===3?' selected':''}>${u[0]}</option>`).join('')}</select></div>
      <div class="lab-row" style="margin:0">${chips('ds',DST.map((d,i)=>[i,T(d[0])]))}</div>
      <canvas class="t1-cv" id="t9Sc"></canvas><div class="lab-kv t2-kv5" id="t9UKv"></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t9E1"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.ecc)}: <b id="t9EV"></b></span><input type="range" class="lab-range" id="t9E" min="0" max="0.9" step="0.01" value="0.5"></label>
      <label class="t1-ctl"><span>${T(TX.pt)}: <b id="t9PV"></b></span><input type="range" class="lab-range" id="t9P" min="0" max="360" step="1" value="70"></label><div class="lab-kv" id="t9E1Kv"></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t9E2"></canvas><p class="t1-cap">${T(TX.sectors)}</p></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.ecc)}: <b id="t9FV"></b></span><input type="range" class="lab-range" id="t9F" min="0" max="0.85" step="0.01" value="0.55"></label>
      <div class="lab-row" style="margin:0"><button class="lab-chip" id="t9Go">▶</button></div><div class="lab-kv" id="t9E2Kv"></div></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-formula">T₁² / T₂² = a₁³ / a₂³ · T² = a³</div>
    <div class="t1-two"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t9K3"></canvas><p class="t1-cap">${T(TX.logC)}</p></div>
      <div class="dz-card t4-m"><label class="t1-ctl"><span>${T(TX.aIn)}: <b id="t9AV"></b></span><input type="range" class="lab-range" id="t9A" min="-0.6" max="1.8" step="0.005" value="0.716"></label>
        <div class="lab-row" style="margin:0">${chips('k3',PL.map((p,i)=>[i,T(p[0])]))}</div><div class="lab-kv" id="t9K3Kv"></div></div></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p>
    <div class="t1-two"><div class="dz-card t4-m"><h4>${T(TX.eM)}</h4><div class="t1-formula">M = g·R² / G</div><div class="lab-kv">${kv('g','9,8 m/s²')+kv('R','6370 km')+kv('G','6,67·10⁻¹¹ N·m²/kg²')+kv('M',sci(9.8*6.37e6**2/6.67e-11)+' kg',true)}</div></div>
      <div class="dz-card t4-m"><h4>${T(TX.host)}</h4><div class="lab-row" style="margin:0">${chips('ms',SAT.map((s,i)=>[i,T(s[0])]))}</div><div class="t1-formula" id="t9MF"></div><div class="lab-kv" id="t9MKv"></div></div></div>`)}
  ${sec('06',K.U.gl,K.glHTML(GL))}
  ${sec('07',K.U.qa,K.qaHTML(QA))}
  ${sec('08',K.U.test,`<div class="dz-card t1-quiz" id="t9Quiz"></div>`)}`;

  /* 01 · Birliklar */
  let km=PC;
  const drawU=K.draw(function(){ const cv=$('#t9Sc'); const {x,w,h}=fit(cv,.16,110), c=C(), pl=10, pr=10, L0=5, L1=20, sx=v=>pl+(Math.log10(v)-L0)/(L1-L0)*(w-pl-pr), y=h*.42;
    ln(x,pl,y,w-pr,y,c.brd,2);
    for(let e=L0;e<=L1;e+=5){ ln(x,sx(10**e),y-4,sx(10**e),y+4,c.dim); lbl(x,'10'+String(e).split('').map(ch=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch]).join('')+' km',sx(10**e),h-6,c.dim); }
    DST.forEach((d,i)=>{ dot(x,sx(d[1]),y,4,c.dim); lbl(x,T(d[0]),sx(d[1]),i%2?y+18:y-10,c.dim); });
    const v=Math.max(10**L0,Math.min(10**L1,km)); dot(x,sx(v),y,7,c.gold);
    $('#t9UKv').innerHTML=UN.map(u=>kv(u[0],sci(km/u[1]),u[0]==='pk')).join('')+kv(T(X('Yorug‘lik yo‘li','Свет идёт','Light time')),km/299792.458<86400*365?sci(km/299792.458/60)+' min':sci(km/LY)+' '+T(X('yil','лет','yr'))); });
  const fromIn=()=>{ km=(+$('#t9V').value||0)*UN[+$('#t9U').value][1]; mark('ds',''); drawU(); };
  $('#t9V').oninput=fromIn; $('#t9U').onchange=fromIn;
  on('ds',v=>{ const d=DST[+v][1], u=d<1e9?0:d<1e12?1:d<5e14?2:d<5e16?3:d<5e18?4:5; $('#t9U').value=u; $('#t9V').value=+(d/UN[u][1]).toPrecision(4); km=d; mark('ds',v); drawU(); });

  /* 02 · I qonun */
  const drawE1=K.draw(function(){ const cv=$('#t9E1'); const {x,w,h}=fit(cv,.62,380), c=C(), e=+$('#t9E').value, a=Math.min(w*.4,h*.7/Math.sqrt(1-e*e)*.7), b=a*Math.sqrt(1-e*e), cx=w/2, cy=h/2, f=a*e, th=+$('#t9P').value*D2R;
    x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); x.ellipse(cx,cy,a,b,0,0,TAU); x.stroke();
    ln(x,cx-a,cy,cx+a,cy,c.dim,1,[4,4]); const F1=[cx-f,cy], F2=[cx+f,cy], P=[cx+a*Math.cos(th),cy-b*Math.sin(th)];
    ln(x,F1[0],F1[1],P[0],P[1],c.gold,1.6); ln(x,F2[0],F2[1],P[0],P[1],c.neon2,1.6);
    const g=x.createRadialGradient(F1[0],cy,0,F1[0],cy,16); g.addColorStop(0,'#fff3c4'); g.addColorStop(.5,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(F1[0],cy,16,0,TAU); x.fill();
    dot(x,F2[0],cy,3,c.text); lbl(x,'F₁',F1[0],cy+24,c.text); lbl(x,'F₂',F2[0],cy+18,c.text); dot(x,P[0],P[1],6,'#d8603a'); lbl(x,'B',P[0]+10,P[1]-8,c.text,'left');
    dot(x,cx-a,cy,3,c.dim); dot(x,cx+a,cy,3,c.dim); lbl(x,'P',cx-a-10,cy+4,c.text,'right'); lbl(x,'A',cx+a+10,cy+4,c.text,'left'); lbl(x,'O',cx,cy+16,c.dim);
    const d1=Math.hypot(P[0]-F1[0],P[1]-F1[1])/a, d2=Math.hypot(P[0]-F2[0],P[1]-F2[1])/a;
    $('#t9EV').textContent=fmtN(e,2); $('#t9PV').textContent=Math.round(th/D2R)+'°';
    $('#t9E1Kv').innerHTML=kv('a₁ (F₁B)',fmtN(d1,3)+' a')+kv('b₁ (F₂B)',fmtN(d2,3)+' a')+kv('a₁ + b₁',fmtN(d1+d2,3)+' a = 2a',true)+kv('r_P = a(1 − e)',fmtN(1-e,2)+' a')+kv('r_A = a(1 + e)',fmtN(1+e,2)+' a'); });
  $('#t9E').oninput=drawE1; $('#t9P').oninput=drawE1;

  /* 03 · II qonun */
  let ph=0, run=false, lt=0;
  const drawE2=K.draw(function(){ const cv=$('#t9E2'); const {x,w,h}=fit(cv,.62,380), c=C(), e=+$('#t9F').value, a=Math.min(w*.4,h*.42/Math.sqrt(1-e*e)), b=a*Math.sqrt(1-e*e), cx=w/2+a*e*.0, cy=h/2, fx=cx-a*e;
    const P=E=>[cx+a*Math.cos(E),cy-b*Math.sin(E)];
    for(let k=0;k<12;k+=3){ x.fillStyle=k%6?'rgba(255,198,92,.22)':'rgba(78,168,255,.22)'; x.beginPath(); x.moveTo(fx,cy); const M0=k/12*TAU, M1=(k+1)/12*TAU; for(let t=0;t<=20;t++){ const p=P(kep(M0+(M1-M0)*t/20,e)); x.lineTo(p[0],p[1]); } x.closePath(); x.fill(); }
    x.strokeStyle=c.neon; x.lineWidth=1.6; x.beginPath(); x.ellipse(cx,cy,a,b,0,0,TAU); x.stroke();
    for(let k=0;k<12;k++){ const p=P(kep(k/12*TAU,e)); ln(x,fx,cy,p[0],p[1],c.brd,1); dot(x,p[0],p[1],2.5,c.dim); }
    const g=x.createRadialGradient(fx,cy,0,fx,cy,16); g.addColorStop(0,'#fff3c4'); g.addColorStop(.5,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(fx,cy,16,0,TAU); x.fill();
    const E=kep(ph*TAU,e), p=P(E); ln(x,fx,cy,p[0],p[1],c.gold,2); dot(x,p[0],p[1],7,'#3f7fe0');
    lbl(x,'P',cx-a-10,cy+4,c.text,'right'); lbl(x,'A',cx+a+10,cy+4,c.text,'left');
    const r=1-e*Math.cos(E), v=Math.sqrt(2/r-1);
    $('#t9FV').textContent=fmtN(e,2);
    $('#t9E2Kv').innerHTML=kv(T(TX.dist),fmtN(r,2)+' a')+kv(T(TX.speed)+' v/v̄',fmtN(v,2),true)+kv('v_P / v_A',fmtN((1+e)/(1-e),2)); });
  $('#t9F').oninput=drawE2;
  const step=n=>{ if(!run) return; ph=(ph+Math.min(.05,(n-lt)/1000)/8)%1; lt=n; drawE2(); K.rafs.k2=requestAnimationFrame(step); };
  $('#t9Go').onclick=()=>{ run=!run; $('#t9Go').textContent=run?'⏸':'▶'; click(700); if(run){ lt=performance.now(); K.rafs.k2=requestAnimationFrame(step); } };

  /* 04 · III qonun */
  const drawK3=K.draw(function(){ const cv=$('#t9K3'); const {x,w,h}=fit(cv,.7,320), c=C(), pl=40, pr=10, pt=10, pb=26, A0=-.6, A1=1.8, T0=-1, T1=2.7;
    const X0=a=>pl+(Math.log10(a)-A0)/(A1-A0)*(w-pl-pr), Y0=t=>pt+(1-(Math.log10(t)-T0)/(T1-T0))*(h-pt-pb);
    x.font='10.5px system-ui,sans-serif';
    [.3,1,3,10,30].forEach(a=>{ ln(x,X0(a),pt,X0(a),h-pb,c.brd); lbl(x,String(a).replace('.',','),X0(a),h-8,c.dim); });
    [.1,1,10,100].forEach(t=>{ ln(x,pl,Y0(t),w-pr,Y0(t),c.brd); x.fillStyle=c.dim; x.textAlign='right'; x.fillText(String(t).replace('.',','),pl-5,Y0(t)+3.5); });
    ln(x,X0(10**A0),Y0(10**(A0*1.5)),X0(10**A1),Y0(10**(A1*1.5)),c.neon,2);
    PL.forEach(p=>{ dot(x,X0(p[1]),Y0(p[2]),5,p[3]); lbl(x,T(p[0]),X0(p[1])+8,Y0(p[2])+4,c.text,'left'); });
    const a=10**+$('#t9A').value, t=a**1.5; dot(x,X0(a),Y0(t),7,c.gold);
    x.fillStyle=c.dim; x.textAlign='left'; x.fillText('T, '+T(TX.yr),pl+4,pt+10); x.textAlign='right'; x.fillText('a, '+T(TX.au),w-pr,h-pb-4);
    $('#t9AV').textContent=fmtN(a,3)+' '+T(TX.au);
    $('#t9K3Kv').innerHTML=kv('a³',fmtN(a**3,3))+kv('T = a^(3/2)',fmtN(t,3)+' '+T(TX.yr),true)+kv('T',fmtN(t*365.25)+' '+T(TX.dd)); });
  $('#t9A').oninput=()=>{ mark('k3',''); drawK3(); };
  on('k3',v=>{ $('#t9A').value=Math.log10(PL[+v][1]); mark('k3',v); drawK3(); });

  /* 05 · Massalar */
  const mass=i=>{ const s=SAT[i], m0=SAT[0], r=(s[1]/m0[1])**3*(m0[2]/s[2])**2, G=6.674e-20, M=4*Math.PI**2*s[1]**3/(G*(s[2]*86400)**2);
    $('#t9MF').textContent='m/m⊕ = ('+fmtN(s[1])+' / 384 400)³ · (27,32 / '+fmtN(s[2],3)+')²';
    $('#t9MKv').innerHTML=kv(T(TX.sa),fmtN(s[1])+' km')+kv(T(TX.st),fmtN(s[2],3)+' '+T(TX.dd))+kv('m / m⊕',fmtN(r,r<1?3:1),true)+kv('M = 4π²a³ / GT²',sci(M)+' kg')+kv(T(TX.ref),fmtN(s[3],s[3]<1?3:1)+' m⊕'); mark('ms',i); };
  on('ms',v=>mass(+v)); mass(1);

  K.bindQA(); K.quiz($('#t9Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK||!window.DZ9||!window.DZ7) return setTimeout(add,50); window.DARSLIK.add({ id:'t09', get GL(){ return (window.DZ9||{}).GL; }, get QZ(){ return (window.DZ9||{}).QZ; }, ico:'🌀', title:window.DZ9.TX.title, sub:window.DZ9.TX.sub, build }); };
add();
})();
