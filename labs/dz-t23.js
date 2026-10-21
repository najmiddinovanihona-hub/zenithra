/* DARSLIK · 23-mavzu (54-§). O'zgaruvchan yulduzlar */
(function(){
function build(el, api){
  const K0=window.DZK, X=K0.X, TAU=K0.TAU, {TX,GL,QA,QZ}=window.DZ23;
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const star=(x,px,py,r,col)=>{ const g=x.createRadialGradient(px,py,0,px,py,r*1.6); g.addColorStop(0,'#fff'); g.addColorStop(.5,col); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.beginPath(); x.arc(px,py,r*1.6,0,TAU); x.fill(); };
  const play=(btn,key,fn,speed)=>{ let run=false, L=0; const st=n=>{ if(!run) return; fn(Math.min(.05,(n-L)/1000)*speed); L=n; K.rafs[key]=requestAnimationFrame(st); };
    $(btn).onclick=()=>{ run=!run; $(btn).textContent=run?'⏸':'▶'; click(700); if(run){ L=performance.now(); K.rafs[key]=requestAnimationFrame(st); } }; };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t23C"></canvas>
    <div class="lab-row"><button class="lab-chip" id="t23CP">▶</button><input type="range" class="lab-range" id="t23CF" min="0" max="1" step="0.002" value="0" style="flex:1"></div></div>
    <div class="t1-side"><div class="lab-kv" id="t23CKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t23P"></canvas><p class="t1-cap">${T(TX.lawN)}</p></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.P)}: <b id="t23PV"></b></span><input type="range" class="lab-range" id="t23PP" min="0" max="2" step="0.005" value="0.73"></label>
      <label class="t1-ctl"><span>${T(TX.mObs)}: <b id="t23MV"></b></span><input type="range" class="lab-range" id="t23M" min="2" max="26" step="0.05" value="3.95"></label>
      <div class="lab-row" style="margin:0">${chips('cp',[[0,'δ Cep'],[1,'Polaris'],[2,'M31'],[3,'M100']])}</div><div class="lab-kv" id="t23PKv"></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv" id="t23N"></canvas><div class="lab-row"><button class="lab-chip" id="t23NP">💥 ${T(TX.go)}</button><span class="t1-lab"><b id="t23NV"></b></span></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p>
    <div class="t1-two"><div class="dz-card t1-chart"><h4>${T(TX.lcT)}</h4><canvas class="t1-cv" id="t23L"></canvas></div>
      <div class="dz-card t4-m"><h4>${T(TX.hist)}</h4><div class="t16-mis">${[TX.h1,TX.h2,TX.h3].map(h=>`<div><span>${T(h)}</span></div>`).join('')}</div></div></div>
    <div class="dz-card t4-m"><h4>${T(TX.nsT)}</h4><p class="t1-p">${T(TX.nsD)}</p><div class="lab-kv t2-kv5" id="t23NSKv"></div></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t23Quiz"></div>`)}`;

  /* 01 · Sefeid pulsatsiyasi */
  let cf=0;
  const lc=f=>{ const p=f%1; return p<.15?(p/.15):(1-(p-.15)/.85)**1.4; };
  const rc=f=>Math.sin((f%1)*TAU-.6);
  const drawC=K.draw(function(){ const cv=$('#t23C'); const {x,w,h}=fit(cv,.55,320), c=C(), b=lc(cf), r=rc(cf), Tk=5600+1500*b;
    x.fillStyle='#03050f'; x.fillRect(0,0,w*.3,h);
    const R=w*.09*(1+.18*r); star(x,w*.15,h*.45,R,b>.5?'#fff3d0':'#ffd28a'); lbl(x,'δ Cep',w*.15,h-10,'#cfd6f2');
    const gx=w*.36, gw=w-gx-10, g1=12, gh=(h-40)/2;
    const plot=(f,y0,col,lab)=>{ x.strokeStyle=c.brd; x.strokeRect(gx,y0,gw,gh); x.strokeStyle=col; x.lineWidth=2; x.beginPath(); for(let i=0;i<=gw;i++){ const p=i/gw*2, v=f(p); i?x.lineTo(gx+i,y0+gh*(1-(v+1)/2*.9-.05)):x.moveTo(gx+i,y0+gh*(1-(v+1)/2*.9-.05)); } x.stroke(); lbl(x,lab,gx+4,y0+12,c.dim,'left');
      const px=gx+(cf%2)/2*gw; x.strokeStyle=c.gold; x.beginPath(); x.moveTo(px,y0); x.lineTo(px,y0+gh); x.stroke(); };
    plot(p=>lc(p)*2-1,g1,c.neon,T(TX.dm)); plot(rc,g1+gh+16,'#ff9a6a',T(TX.dR));
    lbl(x,'0 — 2 '+T(X('davr','периода','periods')),gx+gw,h-4,c.dim,'right');
    const vr=-Math.cos((cf%1)*TAU-.6);
    $('#t23CF').value=cf%1;
    $('#t23CKv').innerHTML=kv(T(TX.ph),fmtN(cf%1,2))+kv(T(TX.dm),fmtN(.8*(1-b),2)+'ᵐ')+kv('T',fmtN(Tk)+' K')+kv(T(TX.cls),Tk>6500?'F':Tk>6100?'F8–G0':'G',true)+kv(T(TX.shift),T(vr>0?TX.red:TX.blue))+kv('P (δ Cep)','5,37 '+T(TX.dd)); });
  $('#t23CF').oninput=e=>{ cf=+e.target.value; drawC(); }; play('#t23CP','c',dt=>{ cf=(cf+dt)%2; drawC(); },.35);

  /* 02 · Davr-yorqinlik */
  const CP=[[Math.log10(5.37),3.95],[Math.log10(3.97),1.98],[Math.log10(31.4),19.2],[Math.log10(30),25.3]];
  const Mof=lp=>-2.43*(lp-1)-4.05;
  const drawP=K.draw(function(){ const cv=$('#t23P'); const {x,w,h}=fit(cv,.65,300), c=C(), lp=+$('#t23PP').value, m=+$('#t23M').value, pl=40, pr=12, pt=12, pb=28, sx=v=>pl+v/2*(w-pl-pr), sy=M=>pt+(M+8)/7*(h-pt-pb);
    [-8,-6,-4,-2].forEach(M=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(M)); x.lineTo(w-pr,sy(M)); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(M+'ᵐ',pl-4,sy(M)+3); });
    [1,3,10,30,100].forEach(P=>lbl(x,String(P),sx(Math.log10(P)),h-10,c.dim)); lbl(x,'P, '+T(TX.dd),w-pr,h-pb-4,c.dim,'right');
    x.strokeStyle=c.gold; x.lineWidth=2.2; x.beginPath(); x.moveTo(sx(0),sy(Mof(0))); x.lineTo(sx(2),sy(Mof(2))); x.stroke();
    let s=8; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<40;i++){ const l=.2+r()*1.7; dot(x,sx(l),sy(Mof(l)+(r()-.5)*.6),2.3,'rgba(150,180,255,.6)'); }
    const M=Mof(lp); x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); x.arc(sx(lp),sy(M),7,0,TAU); x.stroke();
    const d=10**((m-M+5)/5), L=10**(.4*(4.8-M));
    $('#t23PV').textContent=fmtN(10**lp,1)+' '+T(TX.dd); $('#t23MV').textContent=fmtN(m,2);
    $('#t23PKv').innerHTML=kv(T(TX.Mabs),fmtN(M,2)+'ᵐ')+kv(T(TX.L),'≈ '+fmtN(L)+' L☉')+kv(T(TX.r),d<1e4?fmtN(d)+' pk':d<1e6?fmtN(d/1e3,1)+' kpk':fmtN(d/1e6,2)+' Mpk',true)+kv('',d*3.26<1e6?fmtN(d*3.26)+' '+T(TX.ly):fmtN(d*3.26/1e6,1)+' mln '+T(TX.ly)); });
  ['#t23PP','#t23M'].forEach(s=>$(s).oninput=()=>{ mark('cp',''); drawP(); });
  on('cp',v=>{ $('#t23PP').value=CP[+v][0]; $('#t23M').value=CP[+v][1]; mark('cp',v); drawP(); });

  /* 03 · Yangi yulduz */
  let nt=0, nRun=false, nL=0; const PRT=[]; { let s=12; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<140;i++) PRT.push([r(),r()*TAU,.4+r()*.6]); }
  const drawN=K.draw(function(){ const cv=$('#t23N'); const {x,w,h}=fit(cv,.42,300), c=C(), gx=w*.3, gy=h/2, gr=h*.3, dx=w*.68, dy=h/2, t=nt%8, ph=t/8*TAU*3;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    x.save(); x.translate(gx,gy); x.scale(1.15,1); const g=x.createRadialGradient(0,0,0,0,0,gr); g.addColorStop(0,'#ffd8b0'); g.addColorStop(.7,'#ff8a5a'); g.addColorStop(1,'rgba(255,110,80,.0)'); x.fillStyle=g; x.beginPath(); x.ellipse(gr*.1,0,gr*1.05,gr*.92,0,0,TAU); x.fill(); x.restore();
    x.strokeStyle='rgba(255,180,140,.7)'; x.lineWidth=1.5; for(let k=0;k<3;k++){ x.beginPath(); for(let i=0;i<=40;i++){ const u=i/40, px=gx+gr*.95+u*(dx-gx-gr*.95), py=gy+Math.sin(u*Math.PI)*(-24+k*8)*(1-u*.4); i?x.lineTo(px,py):x.moveTo(px,py); } x.stroke(); }
    x.strokeStyle='rgba(255,210,170,.55)'; x.beginPath(); x.ellipse(dx,dy,30,9,ph*.05,0,TAU); x.stroke();
    const boom=t>5&&t<7.6, k=boom?(t-5)/2.6:0;
    if(boom){ PRT.forEach(([rr,a,sp])=>{ const R=k*sp*Math.min(w,h)*.55; x.fillStyle=`rgba(255,240,200,${1-k})`; x.fillRect(dx+Math.cos(a)*R,dy+Math.sin(a)*R,2,2); }); const fl=x.createRadialGradient(dx,dy,0,dx,dy,60*(1-k)+8); fl.addColorStop(0,'rgba(255,255,255,1)'); fl.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=fl; x.beginPath(); x.arc(dx,dy,60*(1-k)+8,0,TAU); x.fill(); }
    const hot=Math.min(1,t/5); star(x,dx,dy,5+hot*3,`rgb(${200+55*hot|0},${220+35*hot|0},255)`);
    lbl(x,T(X('Gigant','Гигант','Giant')),gx,gy+gr+18,'#ffb08a'); lbl(x,T(X('Oq mitti','Белый карлик','White dwarf')),dx,dy+30,'#cfe0ff');
    $('#t23NV').textContent=T(t<2.5?TX.s3a:t<5?TX.s3b:TX.s3c)+(boom?' · 10³⁸–10³⁹ J':''); });
  const nStep=n=>{ if(!nRun) return; nt+=Math.min(.05,(n-nL)/1000); nL=n; if(nt>8){ nRun=false; nt=0; } drawN(); if(nRun) K.rafs.n=requestAnimationFrame(nStep); };
  $('#t23NP').onclick=()=>{ click(880); nt=0; nRun=true; nL=performance.now(); K.rafs.n=requestAnimationFrame(nStep); };

  /* 04 · Ravshanlik egriliklari */
  K.draw(function(){ const cv=$('#t23L'); const {x,w,h}=fit(cv,.7,300), c=C(), pl=42, pr=12, pt=12, pb=28, sx=d=>pl+d/300*(w-pl-pr), sy=M=>pt+(M+20)/22*(h-pt-pb);
    [-20,-15,-10,-5,0].forEach(M=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(M)); x.lineTo(w-pr,sy(M)); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(M+'ᵐ',pl-4,sy(M)+3); });
    [0,50,100,150,200,250,300].forEach(d=>lbl(x,String(d),sx(d),h-10,c.dim)); lbl(x,T(TX.days),w-pr,h-pb-4,c.dim,'right');
    const sn=d=>d<0?0:d<18?-19*(1-(1-d/18)**2)+0:-19+2.5*Math.log10(1+(d-18)/2)*1.6, nova=d=>d<0?1:d<3?1-9.5*(d/3):-8.5+3.2*Math.log10(1+(d-3)/3)*1.5;
    const curve=(f,col,lab)=>{ x.strokeStyle=col; x.lineWidth=2.2; x.beginPath(); for(let d=-10;d<=300;d+=1){ const M=Math.min(2,f(d)); d===-10?x.moveTo(sx(Math.max(0,d)),sy(M)):x.lineTo(sx(Math.max(0,d)),sy(M)); } x.stroke(); };
    curve(sn,'#ff7a5a'); curve(nova,c.neon);
    lbl(x,T(TX.sn)+' · −19ᵐ',sx(26),sy(-19)-6,'#ff7a5a','left'); lbl(x,T(TX.nova)+' · −8,5ᵐ',sx(8),sy(-8.5)-6,c.neon,'left');
    x.strokeStyle='rgba(255,210,120,.5)'; x.setLineDash([3,3]); x.beginPath(); x.moveTo(sx(18),pt); x.lineTo(sx(18),h-pb); x.stroke(); x.setLineDash([]); lbl(x,'2–3 hafta',sx(18)+4,pt+12,c.gold,'left'); });
  { const Rs=Math.cbrt(1.989e33/(4/3*Math.PI*1e14))/1e5;
    $('#t23NSKv').innerHTML=kv(T(TX.Rns),'≈ '+fmtN(Rs,1)+' km',true)+kv(T(TX.spoon),'≈ 10⁸ t')+kv('ρ','10¹⁴ g/sm³')+kv('ρ☉ / ρ','≈ 1,4 / 10¹⁴'); }

  K.bindQA(); K.quiz($('#t23Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK||!window.DZ23) return setTimeout(add,50); window.DARSLIK.add({ id:'t23', get GL(){ return (window.DZ23||{}).GL; }, get QZ(){ return (window.DZ23||{}).QZ; }, ico:'💥', title:window.DZ23.TX.title, sub:window.DZ23.TX.sub, build }); };
add();
})();
