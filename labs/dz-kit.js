/* DARSLIK uchun umumiy yordamchilar: grafik kanvas, test, savollar, atamalar va 3D osmon sferasi */
window.DZK=(()=>{
const X=(uz,ru,en)=>({uz,ru,en}), D2R=Math.PI/180, TAU=Math.PI*2;
const U={ all:X('Hammasi','Все','All'), drag:X('Aylantirish — sichqoncha, yaqinlashtirish — g‘ildirakcha','Вращение — мышь, масштаб — колесо','Drag to rotate, scroll to zoom'),
  show:X('Javobni ko‘rish','Показать ответ','Show answer'), hide:X('Yashirish','Скрыть','Hide'),
  qOf:X('Savol','Вопрос','Question'), qNext:X('Keyingi','Далее','Next'), qDone:X('Natija','Результат','Result'), qAgain:X('Qaytadan','Заново','Try again'), qRes:X('to‘g‘ri javob','правильных ответов','correct answers'),
  h:X('soat','ч','h'), gl:X('Tayanch tushunchalar','Ключевые понятия','Key terms'), qa:X('Savol va topshiriqlar','Вопросы и задания','Questions and tasks'), test:X('O‘zingizni sinang','Проверьте себя','Test yourself') };

function skyStage(host,o){
  o=o||{}; const cv=host.querySelector('canvas'), lb=host.querySelector('.t1-lbls');
  if(!window.THREE||!THREE.OrbitControls){ host.classList.add('t1-no3d'); const n=()=>{}; return {setLat:n,rebuild:n,play:n,speed:n,setTheta:n,theta:()=>0,destroy:n,api:null}; }
  const R=new THREE.WebGLRenderer({canvas:cv,antialias:true}); R.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1)); R.setClearColor(0x070a1c,1);
  const S=new THREE.Scene(), cam=new THREE.PerspectiveCamera(40,1,0.1,200); cam.position.set(9.5,5.2,10.5);
  const ctl=new THREE.OrbitControls(cam,cv); ctl.enableDamping=true; ctl.enablePan=false; ctl.minDistance=7; ctl.maxDistance=26; ctl.target.set(0,.4,0);
  const RS=5, V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const keep=[];
  const shell=new THREE.Mesh(new THREE.SphereGeometry(RS,48,32),new THREE.MeshBasicMaterial({color:0x4ea8ff,transparent:true,opacity:.06,side:THREE.BackSide,depthWrite:false})); S.add(shell); keep.push(shell);
  const ground=new THREE.Mesh(new THREE.CircleGeometry(RS,72),new THREE.MeshBasicMaterial({color:0x173a2a,transparent:true,opacity:.62,side:THREE.DoubleSide,depthWrite:false})); ground.rotation.x=-Math.PI/2; ground.renderOrder=2; S.add(ground); keep.push(ground);
  const mm=new THREE.MeshBasicMaterial({color:0xe8edff}); const body=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,.42,10),mm); body.position.y=.21; const head=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),mm); head.position.y=.5; S.add(body,head); keep.push(body,head);
  const FIX=new THREE.Group(), SKY=new THREE.Group(), ROT=new THREE.Group(); S.add(FIX,SKY,ROT);
  const N=320, sp=new Float32Array(N*3); { let s=11; const rnd=()=>(s=(s*16807)%2147483647)/2147483647; for(let i=0;i<N;i++){ const u=rnd()*2-1, a=rnd()*TAU, q=Math.sqrt(1-u*u); sp[i*3]=RS*.995*q*Math.cos(a); sp[i*3+1]=RS*.995*u; sp[i*3+2]=RS*.995*q*Math.sin(a); } }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(sp,3)); const stars=new THREE.Points(sg,new THREE.PointsMaterial({color:0xdfe6ff,size:.07,transparent:true,opacity:o.stars===false?0:.9})); ROT.add(stars); keep.push(stars);
  let phi=o.lat==null?41.3:o.lat, theta=o.theta||0, run=o.run!==false, spd=1, alive=true, raf=0, last=performance.now(), seen=true, labs=[];
  const vio=new IntersectionObserver(es=>{ seen=es[0].isIntersecting; }); vio.observe(host);
  const C3=c=>new THREE.Color(c);
  const line=(pts,c,op,loop)=>{ const m=new THREE.LineBasicMaterial({color:C3(c),transparent:true,opacity:op==null?1:op}); const g=new THREE.BufferGeometry().setFromPoints(pts); return loop?new THREE.LineLoop(g,m):new THREE.Line(g,m); };
  const arcPts=(c,a,b,r,t0,t1,n)=>{ const p=[]; n=n||Math.max(8,Math.ceil(Math.abs(t1-t0)/TAU*160)); for(let i=0;i<=n;i++){ const t=t0+(t1-t0)*i/n; p.push(c.clone().addScaledVector(a,r*Math.cos(t)).addScaledVector(b,r*Math.sin(t))); } return p; };
  const ring=(c,a,b,r,col,op)=>line(arcPts(c,a,b,r,0,TAU,160).slice(0,160),col,op,true);
  const tube=(pts,col,rad,op)=>{ if(pts.length<2) return new THREE.Object3D(); return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),Math.max(8,pts.length*2),rad||.04,6,false),new THREE.MeshBasicMaterial({color:C3(col),transparent:op!=null,opacity:op==null?1:op})); };
  const dot=(col,r)=>new THREE.Mesh(new THREE.SphereGeometry(r||.08,14,10),new THREE.MeshBasicMaterial({color:C3(col)}));
  const label=(parent,pos,html,col,cls)=>{ const ob=new THREE.Object3D(); ob.position.copy(pos); parent.add(ob); const d=document.createElement('div'); d.className='t1-lbl t2-lbl'+(cls?' '+cls:''); d.innerHTML=html; if(col) d.style.color=col; lb.appendChild(d); labs.push([d,ob]); return d; };
  const disposeG=g=>{ g.traverse(x=>{ if(x.geometry) x.geometry.dispose(); if(x.material) x.material.dispose(); }); while(g.children.length) g.remove(g.children[0]); };
  const basis=()=>{ const s=Math.sin(phi*D2R), c=Math.cos(phi*D2R); return {p:V(0,s,-c), u:V(1,0,0), w:V(0,c,s), e2:V(0,-c,-s)}; };
  const API={THREE,V,RS,line,arcPts,ring,tube,dot,label,disposeG,FIX,SKY,basis,get phi(){return phi;},get theta(){return theta;},dropLabels(list){ list.forEach(d=>{ const i=labs.findIndex(l=>l[0]===d); if(i>=0){ labs[i][0].remove(); labs.splice(i,1); } }); }};
  const STD=o.std||{};
  function build(){
    disposeG(FIX); disposeG(SKY); labs.forEach(l=>l[0].remove()); labs=[];
    const {p,u,w}=basis(), O=V(0,0,0), A=STD.alpha==null?1:STD.alpha;
    if(STD.zen!==false){ FIX.add(line([V(0,RS,0),V(0,-RS,0)],'#ffffff',.55*A)); label(FIX,V(0,RS+.35,0),'Z','#ffffff'); }
    FIX.add(ring(O,V(1,0,0),V(0,0,1),RS,'#5fd39a',.95));
    [['N',V(0,0,-RS)],['S',V(0,0,RS)],['E',V(RS,0,0)],['W',V(-RS,0,0)]].forEach(([n,v])=>{ const d=dot('#5fd39a',.08); d.position.copy(v); FIX.add(d); label(FIX,v.clone().multiplyScalar(1.08),n,'#5fd39a'); });
    if(STD.axis!==false){ FIX.add(line([p.clone().multiplyScalar(RS*1.12),p.clone().multiplyScalar(-RS*1.12)],'#ff7a6b',.9*A)); const P1=dot('#ff7a6b',.1); P1.position.copy(p).multiplyScalar(RS); FIX.add(P1); label(FIX,p.clone().multiplyScalar(RS*1.18),'P','#ff7a6b'); }
    if(STD.eq!==false){ FIX.add(ring(O,u,w,RS,'#4ea8ff',.9*A)); label(FIX,w.clone().multiplyScalar(RS*1.08),'Q','#4ea8ff'); }
    if(STD.mer!==false) FIX.add(ring(O,V(0,1,0),V(0,0,1),RS,'#c08bff',.55*A));
    ROT.userData.p=p;
    o.build&&o.build(API); }
  const q=new THREE.Quaternion(), v=new THREE.Vector3();
  function size(){ const w=host.clientWidth, h=host.clientHeight; if(!w||!h) return; const c=R.getSize(new THREE.Vector2()); if(c.x!==w||c.y!==h){ R.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix(); } }
  function frame(now){ if(!alive) return; raf=requestAnimationFrame(frame); const dt=Math.min(.05,(now-last)/1000); last=now; if(!seen||document.hidden) return;
    if(run) theta+=dt*spd*TAU/24; q.setFromAxisAngle(ROT.userData.p,-theta); SKY.quaternion.copy(q); ROT.quaternion.copy(q);
    o.frame&&o.frame(API,dt,run);
    ctl.update(); size(); R.render(S,cam); const w=host.clientWidth, h=host.clientHeight;
    labs.forEach(([d,ob])=>{ ob.getWorldPosition(v); v.project(cam); const vis=v.z<1; d.style.display=vis?'':'none'; if(vis) d.style.transform=`translate(${(v.x*.5+.5)*w}px,${(-v.y*.5+.5)*h}px) translate(-50%,-50%)`; }); }
  build(); raf=requestAnimationFrame(frame);
  return { api:API, setLat(f){ phi=f; build(); }, rebuild:build, play(b){ run=b; }, speed(s){ spd=s; }, setTheta(t){ theta=t; }, theta:()=>theta,
    destroy(){ alive=false; cancelAnimationFrame(raf); vio.disconnect(); disposeG(FIX); disposeG(SKY); keep.forEach(m=>{ m.geometry.dispose(); m.material.dispose(); }); ctl.dispose(); R.dispose(); try{ R.forceContextLoss(); }catch(e){} } };
}

function kit(el,api){
  const T=api.T, L=api.L(), click=api.click, offs=[], rafs={}, draws=[];
  const $=s=>el.querySelector(s), $$=s=>el.querySelectorAll(s);
  const fmtN=(n,d)=>{ const s=Number(n).toLocaleString('en-US',{maximumFractionDigits:d||0,minimumFractionDigits:d||0}); return L==='en'?s:s.replace(/,/g,'\u202f').replace('.',','); };
  const dms=(x,sign)=>{ const s=x<0?'−':(sign===false?'':'+'), a=Math.abs(x); let d=Math.floor(a), m=Math.round((a-d)*60); if(m===60){ d++; m=0; } return s+d+'°'+String(m).padStart(2,'0')+'′'; };
  const hm=(h,sign)=>{ const s=h<0?'−':(sign?'+':''), a=Math.abs(h); let H=Math.floor(a), M=Math.round((a-H)*60); if(M===60){ H++; M=0; } return s+H+'ʰ'+String(M).padStart(2,'0')+'ᵐ'; };
  const C=()=>{ const s=getComputedStyle(el), g=k=>s.getPropertyValue(k).trim(); return {text:g('--text'),dim:g('--text-dim'),brd:g('--glass-brd'),neon:g('--neon'),neon2:g('--neon-2'),gold:g('--dz-gold'),chart:g('--dz-chart'),earth:g('--dz-earth'),day:!!el.closest('.dz-day')}; };
  const fit=(cv,ratio,maxH)=>{ const w=Math.max(200,Math.round(cv.getBoundingClientRect().width||cv.parentElement.clientWidth)), h=Math.round(Math.min(maxH,w*ratio)); if(cv._w!==w||cv._h!==h){ cv.style.height=h+'px'; cv._x=api.hiDPI(cv,w,h); cv._w=w; cv._h=h; } const x=cv._x; x.globalAlpha=1; x.setLineDash([]); x.clearRect(0,0,w,h); return {x,w,h}; };
  const anim=(key,ms,draw)=>{ cancelAnimationFrame(rafs[key]); const t0=performance.now(); const st=n=>{ const p=Math.min(1,(n-t0)/ms); draw(p); if(p<1) rafs[key]=requestAnimationFrame(st); }; rafs[key]=requestAnimationFrame(st); };
  const sec=(n,t,inner,id)=>`<section class="dz-sec"${id?` id="${id}"`:''}><div class="sec-title">${n} · ${T(t)}</div>${inner}</section>`;
  const chips=(attr,list)=>list.map(([v,lab])=>`<button class="lab-chip" data-${attr}="${v}">${lab}</button>`).join('');
  const mark=(attr,val)=>$$(`[data-${attr}]`).forEach(b=>b.classList.toggle('on',b.dataset[attr]===String(val)));
  const on=(attr,fn)=>$$(`[data-${attr}]`).forEach(b=>b.onclick=()=>{ click(730); fn(b.dataset[attr],b); });
  const kv=(k,v,full)=>`<div${full?' style="grid-column:1/-1"':''}><div class="k">${k}</div><div class="v">${v}</div></div>`;
  const glHTML=GL=>`<dl class="t1-gl">${GL.map(g=>`<div class="dz-card"><dt>${T(g[0])}</dt><dd>${T(g[1])}</dd></div>`).join('')}</dl>`;
  const qaHTML=QA=>`<div class="t2-qa">${QA.map((q,i)=>`<div class="dz-card t2-qi"><div class="t2-qq"><span class="t2-qn">${i+1}</span><b>${T(q[0])}</b></div><div class="t2-ans" hidden>${T(q[1])}</div><button class="lab-chip t2-tog" data-qa="${i}">${T(U.show)}</button></div>`).join('')}</div>`;
  const bindQA=()=>$$('[data-qa]').forEach(b=>b.onclick=()=>{ click(720); const a=b.parentElement.querySelector('.t2-ans'); a.hidden=!a.hidden; b.textContent=T(a.hidden?U.show:U.hide); });
  function quiz(box,QZ){ let qi=0, score=0, order=[];
    const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
    const start=()=>{ qi=0; score=0; order=shuffle(QZ.map((_,i)=>i)); show(); };
    function show(){ if(qi>=order.length){ if(window.DZP&&api.id) window.DZP.score(api.id,score,order.length); box.innerHTML=`<div class="t1-qend"><div class="t1-qsc">${score} / ${order.length}</div><p class="t1-p">${T(U.qRes)}</p><button class="lab-chip on">↻ ${T(U.qAgain)}</button></div>`; box.querySelector('button').onclick=()=>{ click(720); start(); }; return; }
      const q=QZ[order[qi]], opts=shuffle(q[1].map((o,i)=>[o,i]));
      box.innerHTML=`<div class="t1-qh"><span>${T(U.qOf)} ${qi+1} / ${order.length}</span><span>${score} ✦</span></div><div class="t1-qbar"><i style="width:${qi/order.length*100}%"></i></div><h4>${T(q[0])}</h4>
        <div class="t1-opts">${opts.map(([o,i])=>`<button class="t1-opt" data-k="${i}">${T(o)}</button>`).join('')}</div><div class="t1-qn"></div>`;
      box.querySelectorAll('.t1-opt').forEach(b=>b.onclick=()=>{ const ok=b.dataset.k==='0'; if(ok) score++; click(ok?900:300);
        box.querySelectorAll('.t1-opt').forEach(x=>{ x.disabled=true; if(x.dataset.k==='0') x.classList.add('ok'); else if(x===b) x.classList.add('no'); });
        const n=box.querySelector('.t1-qn'); n.innerHTML=`<button class="lab-chip on">${T(qi===order.length-1?U.qDone:U.qNext)} →</button>`; n.firstChild.onclick=()=>{ click(720); qi++; show(); }; }); }
    start(); }
  const stage=(host,o)=>{ const s=skyStage(host,o); offs.push(s.destroy); return s; };
  const draw=fn=>{ draws.push(fn); return fn; };
  function start(){ const redraw=()=>draws.forEach(f=>{ try{ f(); }catch(e){ console.error(e); } });
    api.onTheme(redraw); let rt=0; const onR=()=>{ clearTimeout(rt); rt=setTimeout(redraw,120); };
    window.addEventListener('resize',onR); let rw=el.clientWidth; const ro=new ResizeObserver(()=>{ if(el.clientWidth!==rw){ rw=el.clientWidth; onR(); } }); ro.observe(el);
    redraw();
    return ()=>{ window.removeEventListener('resize',onR); ro.disconnect(); clearTimeout(rt); offs.forEach(f=>{ try{ f(); }catch(e){} }); Object.values(rafs).forEach(cancelAnimationFrame); }; }
  return {T,L,click,X,D2R,TAU,U,offs,rafs,$,$$,fmtN,dms,hm,C,fit,anim,sec,chips,mark,on,kv,glHTML,qaHTML,bindQA,quiz,stage,draw,start};
}
const EPS=23.44;
function sunLon(doy,year){ year=year||2026; const Dd=(Date.UTC(year,0,1,12)+doy*86400000-Date.UTC(2000,0,1,12))/86400000, g=(357.529+0.98560028*Dd)*D2R, q=280.459+0.98564736*Dd; return (((q+1.915*Math.sin(g)+0.02*Math.sin(2*g))%360)+360)%360; }
const sunDec=doy=>Math.asin(Math.sin(EPS*D2R)*Math.sin(sunLon(doy)*D2R))/D2R;
const MON={uz:['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
const MONS={uz:['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'],ru:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
const dLbl=(doy,L)=>{ const d=new Date(Date.UTC(2026,0,1)+doy*86400000), n=d.getUTCDate(), m=d.getUTCMonth(); return L==='uz'?n+'-'+MON.uz[m]:(L==='ru'?n+' '+MON.ru[m]:MON.en[m]+' '+n); };
const KEYD=[[79,X('21-mart','21 марта','Mar 21')],[172,X('22-iyun','22 июня','Jun 22')],[265,X('23-sentabr','23 сентября','Sep 23')],[355,X('22-dekabr','22 декабря','Dec 22')]];
const dayLen=(f,d)=>{ const c=-Math.tan(f*D2R)*Math.tan(d*D2R); return c<=-1?24:c>=1?0:2*Math.acos(c)/D2R/15; };
return {X,D2R,TAU,U,EPS,kit,skyStage,sunLon,sunDec,MON,MONS,dLbl,KEYD,dayLen};
})();
