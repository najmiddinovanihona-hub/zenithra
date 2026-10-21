/* DARSLIK · 11-mavzu (28–32-§). Keng to'lqinli astronomiya, teleskoplar, Ulug'bek rasadxonasi */
(function(){
function build(el, api){
  const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU, {TX,BAND,TEL,DISH,GL,QA,QZ}=window.DZ11;
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const ln=(x,a,b,c,d,col,w,dash)=>{ x.strokeStyle=col; x.lineWidth=w||1; x.setLineDash(dash||[]); x.beginPath(); x.moveTo(a,b); x.lineTo(c,d); x.stroke(); x.setLineDash([]); };
  const sci=v=>{ const e=Math.floor(Math.log10(v)); if(e>=-2&&e<5) return fmtN(v,v<1?3:v<100?2:0); return fmtN(v/10**e,2)+'·10'+String(e).split('').map(ch=>'⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(ch)]||'⁻').join(''); };
  const lamS=m=>m<1e-9?sci(m*1e9)+' nm':m<1e-6?fmtN(m*1e9)+' nm':m<1e-3?fmtN(m*1e6,m<1e-5?2:0)+' mkm':m<1?fmtN(m*1e3,m<1e-2?1:0)+' mm':fmtN(m,m<10?2:0)+' m';
  const asec=v=>v<1?fmtN(v,3)+'″':v<60?fmtN(v,2)+'″':v<3600?fmtN(v/60,1)+'′':fmtN(v/3600,1)+'°';
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t11S"></canvas><label class="t1-ctl"><span>${T(TX.lam)}: <b id="t11SV"></b></span><input type="range" class="lab-range" id="t11L" min="-14" max="2" step="0.01" value="-6.26"></label></div>
    <div class="lab-kv t2-kv5" id="t11SKv"></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="lab-row" style="margin:0">${chips('tp',[['r',T(TX.tR)],['n',T(TX.tN)],['c',T(TX.tC)],['l',T(TX.tL)]])}</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t11T"></canvas></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="lab-row" style="margin:0">${chips('tl',TEL.map((t,i)=>[i,T(t[0])]))}</div>
    <div class="t1-split"><div class="t1-side">
      <label class="t1-ctl"><span>${T(TX.D)}: <b id="t11DV"></b></span><input type="range" class="lab-range" id="t11D" min="1" max="3.8" step="0.005" value="2"></label>
      <label class="t1-ctl"><span>${T(TX.F)}: <b id="t11FV"></b></span><input type="range" class="lab-range" id="t11F" min="2.3" max="4.5" step="0.005" value="3"></label>
      <label class="t1-ctl"><span>${T(TX.f)}: <b id="t11fV"></b></span><input type="range" class="lab-range" id="t11f" min="3" max="40" step="0.5" value="10"></label>
      <div class="lab-kv" id="t11CKv"></div></div>
      <div class="dz-card t1-chart"><h4>${T(TX.fov)}</h4><canvas class="t1-cv" id="t11V"></canvas></div></div>
    <div class="dz-card t1-chart"><h4>${T(TX.airyT)}</h4><canvas class="t1-cv" id="t11A"></canvas></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="dz-card t4-m">
    <label class="t1-ctl"><span>${T(TX.rl)}: <b id="t11RV"></b></span><input type="range" class="lab-range" id="t11R" min="-3" max="1.3" step="0.01" value="-0.68"></label>
    <div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.dish)}</span>${chips('ds',DISH.map((d,i)=>[i,T(d[0])+(d[1]<1e4?' · '+d[1]+' m':'')]))}</div><div class="lab-kv" id="t11RKv"></div></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t11U"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.alt)}: <b id="t11UV"></b></span><input type="range" class="lab-range" id="t11H" min="20" max="90" step="0.1" value="50.35"></label>
      <div class="lab-row" style="margin:0">${chips('ud',K0.KEYD.map(([d,t])=>[d,T(t)]))}</div><div class="lab-kv" id="t11UKv"></div></div></div>`)}
  ${sec('06',K.U.gl,K.glHTML(GL))}
  ${sec('07',K.U.qa,K.qaHTML(QA))}
  ${sec('08',K.U.test,`<div class="dz-card t1-quiz" id="t11Quiz"></div>`)}`;

  /* 01 · Spektr */
  const trans=l=>{ const um=l*1e6; if(um<.3) return 0; if(um<.4) return (um-.3)/.1; if(um<.9) return 1; if(um<25) return .35+.25*Math.sin(Math.log(um)*6); if(l<1e-3) return .04; if(l<20) return 1; return 0; };
  const drawS=K.draw(function(){ const cv=$('#t11S'); const {x,w,h}=fit(cv,.34,240), c=C(), L0=-14, L1=2, pl=10, pr=10, sx=lg=>pl+(lg-L0)/(L1-L0)*(w-pl-pr), by=h*.62, bh=22;
    BAND.forEach(b=>{ const a=sx(Math.max(L0,Math.log10(b[1]))), z=sx(Math.min(L1,Math.log10(b[2]))); if(b[4]===2&&b[1]===4e-7){ const g=x.createLinearGradient(a,0,z,0); ['#8b5cf6','#3b82f6','#22c55e','#facc15','#f97316','#ef4444'].forEach((cc,i)=>g.addColorStop(i/5,cc)); x.fillStyle=g; } else x.fillStyle=b[3]; x.globalAlpha=b[1]===4e-7?1:.55; x.fillRect(a,by,z-a,bh); x.globalAlpha=1;
      lbl(x,T(b[0]),(a+z)/2,by+bh+14,c.text); });
    x.fillStyle=c.day?'rgba(45,92,174,.18)':'rgba(120,170,255,.2)'; x.beginPath(); x.moveTo(sx(L0),by-4);
    for(let lg=L0;lg<=L1;lg+=.02) x.lineTo(sx(lg),by-4-trans(10**lg)*by*.75); x.lineTo(sx(L1),by-4); x.closePath(); x.fill();
    x.strokeStyle=c.neon2; x.lineWidth=1.5; x.beginPath(); for(let lg=L0;lg<=L1;lg+=.02){ const yy=by-4-trans(10**lg)*by*.75; lg===L0?x.moveTo(sx(lg),yy):x.lineTo(sx(lg),yy); } x.stroke();
    lbl(x,T(TX.opac),pl,14,c.dim,'left');
    [-12,-9,-6,-3,0].forEach(e=>lbl(x,lamS(10**e),sx(e),h-4,c.dim));
    const lg=+$('#t11L').value, l=10**lg, mx=sx(lg); ln(x,mx,8,mx,by+bh,c.gold,2); dot(x,mx,by+bh/2,5,c.gold);
    const b=BAND.find(b=>l>=b[1]&&l<b[2])||BAND[5], tr=trans(l), nu=2.998e8/l, E=4.1357e-15*nu;
    $('#t11SV').textContent=lamS(l);
    $('#t11SKv').innerHTML=kv(T(TX.band),T(b[0]),true)+kv(T(TX.nu),sci(nu)+' Hz')+kv(T(TX.en),sci(E)+' eV')+kv(T(TX.atm),T(tr>.8?TX.yes:tr>.1?TX.part:TX.no)); });
  $('#t11L').oninput=drawS;

  /* 02 · Teleskop sxemalari */
  let tp='r';
  const drawT=K.draw(function(){ const cv=$('#t11T'); const {x,w,h}=fit(cv,.36,260), c=C(), cy=h*.5, ap=h*.26, ray='rgba(255,198,92,.9)', glass=c.day?'rgba(45,92,174,.35)':'rgba(140,190,255,.45)', mir=c.day?'#555':'#d8dde8';
    const tube=(a,b)=>{ x.strokeStyle=c.brd; x.lineWidth=2; x.strokeRect(a,cy-ap-8,b-a,2*ap+16); };
    const lens=(px,r,thk)=>{ x.fillStyle=glass; x.beginPath(); x.ellipse(px,cy,thk,r,0,0,TAU); x.fill(); };
    if(tp==='r'){ const L=w*.12, Fx=w*.7, E=w*.82; tube(L-6,Fx); lens(L,ap,8); lens(E,ap*.32,4);
      [-1,-.5,.5,1].forEach(k=>{ const y0=cy+k*ap*.85; ln(x,0,y0,L,y0,ray,1.4); ln(x,L,y0,Fx,cy,ray,1.4); const y1=cy-k*ap*.85*(E-Fx)/(Fx-L); ln(x,Fx,cy,E,y1,ray,1.4); ln(x,E,y1,w,y1,ray,1.4); });
      ln(x,Fx,cy-ap,Fx,cy+ap,c.dim,1,[3,3]); lbl(x,T(TX.fp),Fx,cy-ap-14,c.dim); lbl(x,'F',Fx+8,cy+14,c.text); lbl(x,T(TX.obj),L,cy+ap+24,c.text); lbl(x,T(TX.eye),E,cy+ap*.32+18,c.text); ln(x,0,cy,w,cy,c.brd,1,[6,4]); }
    else { const L=w*.1, M=w*.84; tube(L,M+6);
      x.strokeStyle=mir; x.lineWidth=4; x.beginPath(); x.moveTo(M-10,cy-ap); x.quadraticCurveTo(M+10,cy,M-10,cy+ap); x.stroke(); lbl(x,'2 · '+T(TX.obj),M,cy+ap+26,c.text);
      if(tp==='n'){ const Px=w*.3; [-1,-.5,.5,1].forEach(k=>{ const y0=cy+k*ap*.8; ln(x,0,y0,M-2,y0,ray,1.3); const t=(M-Px)/((M-L)*1.05), yy=y0+(cy-y0)*t; ln(x,M-2,y0,Px,yy,ray,1.3); ln(x,Px,yy,Px+(yy-cy)*.3,cy-ap-34,ray,1.3); });
        x.strokeStyle=mir; x.lineWidth=4; ln(x,Px-12,cy+12,Px+12,cy-12,mir,4); lbl(x,'3 · '+T(TX.flat),Px+40,cy+24,c.text,'left'); lens(Px,10,4); x.fillStyle=glass; x.fillRect(Px-12,cy-ap-44,24,8); lbl(x,'1 · '+T(TX.eye),Px,cy-ap-50,c.text); }
      else if(tp==='c'){ const Sx=w*.42; [-1,-.6,.6,1].forEach(k=>{ const y0=cy+k*ap*.8; ln(x,0,y0,M-2,y0,ray,1.3); const ys=cy+k*ap*.22; ln(x,M-2,y0,Sx,ys,ray,1.3); ln(x,Sx,ys,M+30,cy-k*4,ray,1.3); });
        x.strokeStyle=mir; x.lineWidth=4; x.beginPath(); x.moveTo(Sx+4,cy-ap*.3); x.quadraticCurveTo(Sx-6,cy,Sx+4,cy+ap*.3); x.stroke(); x.clearRect(M-14,cy-6,30,12); lbl(x,"3′ · "+T(TX.cvx),Sx,cy-ap*.3-10,c.text); x.fillStyle=glass; x.fillRect(M+26,cy-12,10,24); lbl(x,'1 · '+T(TX.eye),M+30,cy-20,c.text,'right'); }
      else { const Fx=L+18; [-1,-.5,0,.5].forEach(k=>{ const y0=cy+k*ap*.75; ln(x,0,y0,M-2,y0,ray,1.3); ln(x,M-2,y0,Fx,cy-ap-2,ray,1.3); }); x.fillStyle=glass; x.fillRect(Fx-10,cy-ap-22,20,10); lbl(x,'1 · '+T(TX.eye),Fx+16,cy-ap-26,c.text,'left'); }
      ln(x,0,cy,w,cy,c.brd,1,[6,4]); }
    mark('tp',tp); });
  on('tp',v=>{ tp=v; drawT(); });

  /* 03 · Xarakteristikalar */
  const g=()=>({D:10**+$('#t11D').value,F:10**+$('#t11F').value,f:+$('#t11f').value});
  const J1=xx=>{ let s=0; const n=60; for(let i=0;i<=n;i++){ const t=i/n*Math.PI, wt=(i===0||i===n)?.5:1; s+=wt*Math.cos(t-xx*Math.sin(t)); } return s/n; };
  const drawC=K.draw(function(){ const {D,F,f}=g(), k=F/f, A=D/F, km=2*D, del=206265*550e-9/(D/1000), fov=3000/k;
    $('#t11DV').textContent=fmtN(D)+' mm'; $('#t11FV').textContent=fmtN(F)+' mm'; $('#t11fV').textContent=fmtN(f,1)+' mm';
    $('#t11CKv').innerHTML=kv(T(TX.k),fmtN(k)+'×'+(k>km?' · '+T(TX.over):''),true)+kv(T(TX.kmax),'≈ '+fmtN(km)+'×')+kv(T(TX.A),'1 : '+fmtN(1/A,1))+kv(T(TX.res),asec(del))+kv(T(TX.lg),fmtN((D/6)**2)+'×');
    { const cv=$('#t11V'); const {x,w,h}=fit(cv,1,260), c=C(), R=Math.min(w,h)/2-6, cx=w/2, cy=h/2;
      x.fillStyle='#000'; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.fill(); x.save(); x.beginPath(); x.arc(cx,cy,R,0,TAU); x.clip();
      const mr=R*16/(fov/2), gg=x.createRadialGradient(cx-mr*.2,cy-mr*.2,0,cx,cy,mr); gg.addColorStop(0,'#f1eee4'); gg.addColorStop(1,'#a9a596'); x.fillStyle=gg; x.beginPath(); x.arc(cx,cy,mr,0,TAU); x.fill();
      x.fillStyle='rgba(90,85,75,.45)'; [[.3,-.2,.18],[-.25,.1,.12],[.05,.4,.1],[-.4,-.35,.08],[.45,.3,.07]].forEach(([a,b,r])=>{ x.beginPath(); x.arc(cx+a*mr,cy+b*mr,r*mr,0,TAU); x.fill(); });
      if(k>km){ x.fillStyle='rgba(0,0,0,.25)'; x.fillRect(0,0,w,h); } x.restore(); x.strokeStyle=c.brd; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.stroke();
      lbl(x,fmtN(k)+'× · '+asec(fov*60),cx,h-2,c.dim); }
    { const cv=$('#t11A'); const {x,w,h}=fit(cv,.28,180), c=C(), pl=30, pr=14, pt=12, pb=22, sx=v=>pl+(v+12)/24*(w-pl-pr), sy=v=>pt+(1-v)*(h-pt-pb);
      ln(x,pl,sy(0),w-pr,sy(0),c.brd); ln(x,sx(0),pt,sx(0),sy(0),c.brd); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText('1,0',pl-4,sy(1)+3); x.fillText('0,5',pl-4,sy(.5)+3);
      x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); for(let v=-12;v<=12;v+=.06){ const vv=Math.abs(v)<1e-4?1e-4:v, I=(2*J1(vv)/vv)**2; v===-12?x.moveTo(sx(v),sy(I)):x.lineTo(sx(v),sy(I)); } x.stroke();
      x.strokeStyle=c.gold; x.lineWidth=1; x.beginPath(); for(let v=-12;v<=12;v+=.06){ const vv=Math.abs(v)<1e-4?1e-4:v, I=Math.min(1,(2*J1(vv)/vv)**2*12); v===-12?x.moveTo(sx(v),sy(I)):x.lineTo(sx(v),sy(I)); } x.setLineDash([3,3]); x.stroke(); x.setLineDash([]);
      [3.83,7.02,10.17].forEach(z=>{ lbl(x,fmtN(z,1),sx(z),h-6,c.dim); lbl(x,fmtN(z,1),sx(-z),h-6,c.dim); });
      lbl(x,'δ',sx(0),h-6,c.gold); } });
  ['#t11D','#t11F','#t11f'].forEach(s=>$(s).oninput=()=>{ mark('tl',''); drawC(); });
  on('tl',v=>{ const t=TEL[+v]; $('#t11D').value=Math.log10(t[1]); $('#t11F').value=Math.log10(t[2]); mark('tl',v); drawC(); });

  /* 04 · Radio */
  let ds=3;
  const radio=()=>{ const l=10**+$('#t11R').value, D=DISH[ds][1], del=206265*l/D, eq=550e-9/(l/D); $('#t11RV').textContent=lamS(l); mark('ds',ds);
    $('#t11RKv').innerHTML=kv('λ / D',sci(l/D)+' rad')+kv('δ',asec(del),true)+kv(T(TX.eqv),eq<1?fmtN(eq*1000,eq<.01?2:0)+' mm':fmtN(eq,2)+' m'); };
  $('#t11R').oninput=radio; on('ds',v=>{ ds=+v; radio(); }); radio();

  /* 05 · Ulug'bek sekstanti */
  const PHI=39.67;
  const drawU=K.draw(function(){ const cv=$('#t11U'); const {x,w,h}=fit(cv,.8,420), c=C(), hh=+$('#t11H').value, z=90-hh, R=h*.78, cx=w*.32, cy=h*.08, gy=cy+R*.62;
    x.fillStyle=c.day?'rgba(160,130,90,.18)':'rgba(120,100,70,.22)'; x.fillRect(0,gy,w,h-gy); ln(x,0,gy,w,gy,c.dim,1.5); lbl(x,'0 m',w-6,gy-4,c.dim,'right');
    x.strokeStyle=c.day?'#8a6a3e':'#c9a46a'; x.lineWidth=10; x.beginPath(); x.arc(cx,cy,R,Math.PI/2-70*D2R,Math.PI/2); x.stroke();
    x.strokeStyle=c.dim; x.lineWidth=1; for(let d=0;d<=70;d+=10){ const a=Math.PI/2-d*D2R; ln(x,cx+Math.cos(a)*(R-10),cy+Math.sin(a)*(R-10),cx+Math.cos(a)*(R+10),cy+Math.sin(a)*(R+10),c.dim); lbl(x,(90-d)+'°',cx+Math.cos(a)*(R+24),cy+Math.sin(a)*(R+24)+4,c.dim); }
    dot(x,cx,cy,4,c.text); lbl(x,T(X('teshik','отверстие','aperture')),cx-8,cy+4,c.text,'right');
    lbl(x,'S ←',12,cy+16,c.gold,'left'); lbl(x,'→ N',w-12,cy+16,c.dim,'right');
    ln(x,cx-Math.cos(hh*D2R)*w,cy-Math.sin(hh*D2R)*w,cx,cy,'rgba(255,198,92,.6)',2,[6,4]);
    if(z<=70){ const a=Math.PI/2-z*D2R, px=cx+Math.cos(a)*R, py=cy+Math.sin(a)*R; ln(x,cx,cy,px,py,'rgba(255,198,92,.9)',2); dot(x,px,py,8,'#ffd27a'); }
    $('#t11UV').textContent=fmtN(hh,1)+'°';
    $('#t11UKv').innerHTML=kv('R','40,2 m')+kv('1°','70,2 sm')+kv(T(TX.onArc),z<=70?fmtN(40.2*z*D2R,2)+' m':'—',true)+kv(T(TX.acc),fmtN(40.2*10/206265*1000,2)+' mm')+kv('φ (Samarqand)',fmtN(PHI,2)+'°'); });
  $('#t11H').oninput=()=>{ mark('ud',''); drawU(); };
  on('ud',v=>{ const dec=K0.sunDec(+v); $('#t11H').value=Math.min(90,90-PHI+dec); mark('ud',v); drawU(); });

  K.bindQA(); K.quiz($('#t11Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK||!window.DZ11) return setTimeout(add,50); window.DARSLIK.add({ id:'t11', get GL(){ return (window.DZ11||{}).GL; }, get QZ(){ return (window.DZ11||{}).QZ; }, ico:'🔭', title:window.DZ11.TX.title, sub:window.DZ11.TX.sub, build }); };
add();
})();
