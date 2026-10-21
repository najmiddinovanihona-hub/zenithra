/* AR osmon — telefonni osmonga qarating: yulduzlar, yulduz turkumlari, sayyoralar, Oy va Quyosh nomlari
   haqiqiy o'rnida chiziladi. Telefonda — yo'nalish datchiklari (+ ixtiyoriy orqa kamera); kompyuterda — sichqoncha.
   Hisob: labs/tonight.js (window.SKY_ASTRO) — sayyoralar JPL elementlari, refraksiya bilan; yulduzlar — data.js katalogi.
   Yo'nalish matematikasi (W3C DeviceOrientation): R = Rz(α)·Rx(β)·Ry(γ) qurilma o'qlarini ENU (sharq, shimol, yuqori)
   o'qlariga o'tkazadi; orqa kamera qurilmaning −Z o'qi bo'yicha qaraydi. */
(function(){
const {register,T,L,esc,fmt,loc,locName,locate,click,jd,bvRGB}=window.LAB;
const D2R=Math.PI/180;
const TX={
  name:{uz:'Osmonga qarang (AR)',ru:'Смотри на небо (AR)',en:'Point at the sky (AR)'},
  sub:{uz:'Telefonni osmonga qarating — yulduz va sayyoralar nomi o‘sha joyda ko‘rinadi',ru:'Наведите телефон на небо — названия звёзд и планет появятся на своих местах',en:'Point your phone at the sky — star and planet names appear in place'},
  close:{uz:'Yopish',ru:'Закрыть',en:'Close'},
  sensors:{uz:'📱 Datchiklarni yoqish',ru:'📱 Включить датчики',en:'📱 Enable sensors'},
  camOn:{uz:'📷 Kamera',ru:'📷 Камера',en:'📷 Camera'}, camOff:{uz:'📷 Kamerasiz',ru:'📷 Без камеры',en:'📷 No camera'},
  find:{uz:'Topish:',ru:'Найти:',en:'Find:'}, none:{uz:'—',ru:'—',en:'—'},
  drag:{uz:'Kompyuterda: sichqoncha bilan suring, g‘ildirakcha — yaqinlashtirish. Telefonda datchiklarni yoqing.',
        ru:'На компьютере: тяните мышью, колесо — масштаб. На телефоне включите датчики.',
        en:'On a computer: drag to look around, scroll to zoom. On a phone, enable the sensors.'},
  calib:{uz:'Kompas noaniq bo‘lsa, ⟲ ⟳ bilan to‘g‘rilang (masalan, Oyni haqiqiy joyiga keltiring).',
         ru:'Если компас неточен, поправьте кнопками ⟲ ⟳ (например, совместите Луну с настоящей).',
         en:'If the compass is off, adjust with ⟲ ⟳ (e.g. line the Moon up with the real one).'},
  looking:{uz:'Markazda:',ru:'В центре:',en:'Centre:'},
  alt:{uz:'balandlik',ru:'высота',en:'altitude'},
  below:{uz:'ufq ostida',ru:'под горизонтом',en:'below the horizon'},
  denied:{uz:'Datchiklarga ruxsat berilmadi — sichqoncha/barmoq bilan suring.',ru:'Доступ к датчикам не дан — листайте пальцем.',en:'Sensor access denied — drag with your finger instead.'},
  noSens:{uz:'Bu qurilmada yo‘nalish datchigi yo‘q — barmoq bilan suring.',ru:'На этом устройстве нет датчика ориентации — листайте пальцем.',en:'No orientation sensor on this device — drag instead.'},
  camErr:{uz:'Kamerani ochib bo‘lmadi.',ru:'Не удалось открыть камеру.',en:'Could not open the camera.'},
  relative:{uz:'Kompas mutlaq emas — ⟲ ⟳ bilan shimolni to‘g‘rilang.',ru:'Компас не абсолютный — поправьте север кнопками ⟲ ⟳.',en:'Compass is not absolute — fix north with ⟲ ⟳.'},
};
const CARD={ uz:['Shimol','Sharq','Janub','G‘arb'], ru:['Север','Восток','Юг','Запад'], en:['North','East','South','West'] };
const DIR8={ uz:['Sh','ShSh','Shq','JShq','J','JG‘','G‘','ShG‘'], ru:['С','СВ','В','ЮВ','Ю','ЮЗ','З','СЗ'], en:['N','NE','E','SE','S','SW','W','NW'] };
const PLAN=['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune'];

// ---- vektor yordamchilari (ENU: x=sharq, y=shimol, z=yuqori) ----
const enu=(az,alt)=>{ const a=az*D2R, h=alt*D2R; return [Math.sin(a)*Math.cos(h), Math.cos(a)*Math.cos(h), Math.sin(h)]; };
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const norm=a=>{ const l=Math.hypot(a[0],a[1],a[2])||1; return [a[0]/l,a[1]/l,a[2]/l]; };
const mix=(a,b,k)=>norm([a[0]+(b[0]-a[0])*k, a[1]+(b[1]-a[1])*k, a[2]+(b[2]-a[2])*k]);
const rotZ=(v,deg)=>{ const c=Math.cos(deg*D2R), s=Math.sin(deg*D2R); return [v[0]*c+v[1]*s, -v[0]*s+v[1]*c, v[2]]; };   // azimut bo'yicha +deg

// Qurilma yo'nalishi → kamera bazisi (oldinga, o'ngga, yuqoriga) ENU'da
function basisFromEuler(alpha,beta,gamma,screenAngle){
  const a=alpha*D2R, b=beta*D2R, g=gamma*D2R, cA=Math.cos(a), sA=Math.sin(a), cB=Math.cos(b), sB=Math.sin(b), cG=Math.cos(g), sG=Math.sin(g);
  const R=[[cA*cG-sA*sB*sG, -cB*sA, cG*sA*sB+cA*sG],
           [cG*sA+cA*sB*sG,  cA*cB, sA*sG-cA*cG*sB],
           [-cB*sG,          sB,    cB*cG]];
  const M=v=>[R[0][0]*v[0]+R[0][1]*v[1]+R[0][2]*v[2], R[1][0]*v[0]+R[1][1]*v[1]+R[1][2]*v[2], R[2][0]*v[0]+R[2][1]*v[1]+R[2][2]*v[2]];
  const th=(screenAngle||0)*D2R;   // ekran burilishi (landshaft): ekran o'ngi/yuqorisi qurilma o'qlarida
  return { f:M([0,0,-1]), r:M([Math.cos(th),-Math.sin(th),0]), u:M([Math.sin(th),Math.cos(th),0]) };
}
function basisFromLook(az,alt){
  const f=enu(az,alt); let r=cross(f,[0,0,1]); if(Math.hypot(...r)<1e-6) r=[Math.cos(az*D2R),-Math.sin(az*D2R),0];
  r=norm(r); return { f, r, u:cross(r,f) };
}

register('ar',{ ico:'📱', bare:true, group:{uz:'Osmon',ru:'Небо',en:'Sky'}, name:TX.name, sub:TX.sub,
  build(body, lab){
    lab.az=lab.az??180; lab.alt=lab.alt??30; lab.fov=lab.fov||62; lab.off=lab.off||0; lab.target=lab.target||'';
    body.innerHTML=`<video class="ar-video" playsinline muted></video><canvas class="ar-cv"></canvas>
      <div class="ar-cross" aria-hidden="true"></div>
      <div class="ar-top glass">
        <div class="ar-row"><b class="ar-title">📱 ${esc(T(TX.name))}</b><button class="lab-chip" data-a="close">${esc(T(TX.close))}</button></div>
        <div class="ar-row ar-info"><span class="ar-dir"></span><span class="ar-look"></span></div>
      </div>
      <div class="ar-bot glass">
        <div class="ar-row">
          <button class="lab-chip" data-a="sens">${esc(T(TX.sensors))}</button>
          <button class="lab-chip" data-a="cam">${esc(T(TX.camOn))}</button>
          <button class="lab-chip" data-a="ccw" aria-label="−3°">⟲</button><button class="lab-chip" data-a="cw" aria-label="+3°">⟳</button>
        </div>
        <div class="ar-row"><label class="ar-find">${esc(T(TX.find))} <select class="ar-sel"></select></label><span class="ar-loc"></span><button class="lab-chip" data-a="loc">📍</button></div>
        <div class="ar-note"></div>
      </div>`;
    const q=s=>body.querySelector(s), cv=q('.ar-cv'), ctx=cv.getContext('2d'), video=q('.ar-video'), note=q('.ar-note');
    const sel=q('.ar-sel');
    sel.innerHTML=`<option value="">${esc(T(TX.none))}</option>`+PLAN.map(k=>`<option value="${k}">${esc(T(window.SKY_ASTRO.PN[k]))}</option>`).join('');
    sel.value=lab.target; sel.onchange=()=>{ lab.target=sel.value; click(700); };
    note.textContent=T(TX.drag);

    // --- ob'ektlar: alt/az har 2 soniyada qayta hisoblanadi ---
    const A=window.SKY_ASTRO, CAT=window.STAR_CATALOG||[], DEFS=window.SKY_CONST_DEFS||[];
    // yorqin yulduzlar + turkum chiziqlaridagi barcha yulduzlar (xiraroqlari ham — aks holda chiziq uziladi)
    const inLines=new Set(DEFS.flatMap(d=>d.ids));
    const stars=CAT.filter(s=>s.mag<=3.2||inLines.has(s.id)).map(s=>({ s, rgb:bvRGB(s.bv) }));
    const byId={}; stars.forEach(o=>{ byId[o.s.id]=o; });
    let objs=null, lastCalc=0;
    function calc(){
      const o=loc(), J=jd(new Date()), B=A.bodies(J);
      stars.forEach(x=>{ const p=A.precess(x.s.ra*15,x.s.dec,J), h=A.altaz(p.ra,p.dec,J,o); x.az=h.az; x.alt=h.alt; x.v=enu(h.az,h.alt); });
      objs=PLAN.map(k=>{ const h=A.look(k,B,J,o); return { k, az:h.az, alt:h.alt, v:enu(h.az,h.alt), mag:B[k].mag, ill:B[k].ill }; });
      q('.ar-loc').textContent=locName ? locName(o) : '';
      lastCalc=Date.now();
    }

    // --- yo'nalish: datchik yoki sichqoncha ---
    lab.mode='drag'; let raw=null, cur=null, absolute=false;
    const onOri=e=>{
      if(e.alpha==null && e.webkitCompassHeading==null) return;
      let alpha=e.alpha||0;
      if(e.webkitCompassHeading!=null){ alpha=360-e.webkitCompassHeading; absolute=true; }   // iOS
      else if(e.absolute || e.type==='deviceorientationabsolute') absolute=true;
      raw={ alpha, beta:e.beta||0, gamma:e.gamma||0 };
      if(lab.mode!=='sensor'){ lab.mode='sensor'; note.textContent=absolute?T(TX.calib):T(TX.relative); }
    };
    lab.onOri=onOri;
    async function enableSensors(){
      try{
        if(typeof DeviceOrientationEvent!=='undefined' && typeof DeviceOrientationEvent.requestPermission==='function'){
          const r=await DeviceOrientationEvent.requestPermission(); if(r!=='granted'){ note.textContent=T(TX.denied); return; } }
        if('ondeviceorientationabsolute' in window) window.addEventListener('deviceorientationabsolute',onOri);
        else window.addEventListener('deviceorientation',onOri);
        lab.sensOn=true;
        setTimeout(()=>{ if(!raw) note.textContent=T(TX.noSens); },2500);
      }catch(e){ note.textContent=T(TX.denied); }
    }
    async function toggleCam(){
      const btn=q('[data-a="cam"]');
      if(lab.stream){ stopCam(); btn.textContent=T(TX.camOn); return; }
      try{ lab.stream=await navigator.mediaDevices.getUserMedia({ video:{ facingMode:{ ideal:'environment' } }, audio:false });
        video.srcObject=lab.stream; await video.play().catch(()=>{}); body.classList.add('ar-camera'); btn.textContent=T(TX.camOff); }
      catch(e){ note.textContent=T(TX.camErr); }
    }
    function stopCam(){ if(lab.stream){ lab.stream.getTracks().forEach(t=>t.stop()); lab.stream=null; } video.srcObject=null; body.classList.remove('ar-camera'); }
    lab.stopCam=stopCam;

    body.addEventListener('click',e=>{ const b=e.target.closest('[data-a]'); if(!b) return; const a=b.dataset.a;
      if(a==='close') window.LAB.closeLab('ar');
      else if(a==='sens'){ click(760); enableSensors(); }
      else if(a==='cam'){ click(760); toggleCam(); }
      else if(a==='cw'||a==='ccw'){ lab.off=(lab.off+(a==='cw'?3:-3)+360)%360; click(620); }
      else if(a==='loc'){ click(760); if(locate) locate(true).then(()=>{ calc(); }); }
    });
    // sichqoncha / barmoq bilan surish (datchik bo'lmasa)
    let drag=null;
    cv.addEventListener('pointerdown',e=>{ if(lab.mode==='sensor') return; drag={x:e.clientX,y:e.clientY,az:lab.az,alt:lab.alt}; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove',e=>{ if(!drag) return; const k=lab.fov/Math.max(cv.clientHeight,1);
      lab.az=(drag.az-(e.clientX-drag.x)*k+360)%360; lab.alt=Math.max(-89,Math.min(89,drag.alt+(e.clientY-drag.y)*k)); });
    cv.addEventListener('pointerup',()=>{ drag=null; });
    cv.addEventListener('wheel',e=>{ e.preventDefault(); lab.fov=Math.max(15,Math.min(110,lab.fov*Math.exp(e.deltaY*0.001))); },{passive:false});

    // --- chizish ---
    function frame(){
      if(!lab.isOpen){ lab.raf=0; return; }
      lab.raf=requestAnimationFrame(frame);
      if(!objs || Date.now()-lastCalc>2000) calc();
      const dpr=Math.min(window.devicePixelRatio||1,2), W=cv.clientWidth, H=cv.clientHeight;
      if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){ cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); }
      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H);
      // kamera bazisi
      let tgt;
      if(lab.mode==='sensor' && raw){ const ang=(screen.orientation&&screen.orientation.angle)||window.orientation||0; tgt=basisFromEuler(raw.alpha,raw.beta,raw.gamma,ang); }
      else tgt=basisFromLook(lab.az,lab.alt);
      cur=cur?{ f:mix(cur.f,tgt.f,0.25), r:mix(cur.r,tgt.r,0.25), u:mix(cur.u,tgt.u,0.25) }:tgt;   // silliqlash
      const B=cur, off=lab.off, F=(Math.max(W,H)/2)/Math.tan(lab.fov*D2R/2), cx=W/2, cy=H/2;
      const P=v=>{ const w=rotZ(v,off), z=dot(w,B.f); if(z<=0.05) return null; return [cx+dot(w,B.r)/z*F, cy-dot(w,B.u)/z*F]; };
      const cam=!!lab.stream;
      // ufq ostini qoraytirish + ufq chizig'i
      ctx.beginPath(); let first=true;
      for(let a=0;a<=360;a+=3){ const p=P(enu(a,0)); if(!p){ first=true; continue; } if(first){ ctx.moveTo(p[0],p[1]); first=false; } else ctx.lineTo(p[0],p[1]); }
      ctx.strokeStyle='rgba(120,200,140,.65)'; ctx.lineWidth=1.5; ctx.stroke();
      // tomonlar
      ctx.font='600 13px system-ui,sans-serif'; ctx.textAlign='center';
      T(CARD).forEach((n,i)=>{ const p=P(enu(i*90,0)); if(p){ ctx.fillStyle='rgba(140,230,160,.95)'; ctx.fillText(n,p[0],p[1]-8); } });
      // turkum chiziqlari va nomlari
      ctx.lineWidth=1; ctx.strokeStyle=cam?'rgba(160,200,255,.7)':'rgba(120,160,255,.45)';
      DEFS.forEach(d=>{ const pts=d.ids.map(id=>byId[id]&&P(byId[id].v));
        d.links.forEach(([a,b])=>{ const p=pts[a], q2=pts[b]; if(p&&q2){ ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(q2[0],q2[1]); ctx.stroke(); } });
        const vis=pts.filter(Boolean); if(vis.length>=2 && A.CN && A.CN[d.key]){ const mx=vis.reduce((s,p)=>s+p[0],0)/vis.length, my=vis.reduce((s,p)=>s+p[1],0)/vis.length;
          ctx.fillStyle='rgba(160,190,255,.8)'; ctx.font='italic 12px system-ui,sans-serif'; ctx.fillText(A.CN[d.key][['uz','ru','en'].indexOf(L())]||A.CN[d.key][0],mx,my+22); } });
      // yulduzlar
      let best=null, bestD=1e9;
      stars.forEach(x=>{ const p=P(x.v); if(!p||p[0]<-20||p[0]>W+20||p[1]<-20||p[1]>H+20) return;
        const r=Math.max(1.1,(3.6-x.s.mag)*1.25), [R,G,Bc]=x.rgb;
        ctx.fillStyle=`rgba(${R},${G},${Bc},${x.alt<0?0.35:1})`; ctx.beginPath(); ctx.arc(p[0],p[1],r,0,7); ctx.fill();
        if(x.s.name && x.s.mag<1.6){ ctx.font='11px system-ui,sans-serif'; ctx.fillStyle='rgba(230,236,255,.85)'; ctx.fillText(x.s.name,p[0],p[1]-r-5); }
        const d=Math.hypot(p[0]-cx,p[1]-cy); if(d<bestD && d<60){ bestD=d; best={ name:x.s.name||x.s.id, alt:x.alt }; } });
      // sayyoralar, Oy, Quyosh
      objs.forEach(o=>{ const p=P(o.v); if(!p) return; const col=A.PC[o.k]||'#fff', big=o.k==='sun'||o.k==='moon', r=big?11:Math.max(3,5-o.mag*0.6);
        ctx.globalAlpha=o.alt<0?0.4:1;
        ctx.beginPath(); ctx.arc(p[0],p[1],r,0,7); ctx.fillStyle=col; ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(p[0],p[1],r+4,0,7); ctx.stroke();
        ctx.font='600 12.5px system-ui,sans-serif'; ctx.fillStyle='#fff'; ctx.fillText(T(A.PN[o.k]),p[0],p[1]-r-8);
        ctx.globalAlpha=1;
        const d=Math.hypot(p[0]-cx,p[1]-cy); if(d<bestD && d<80){ bestD=d; best={ name:T(A.PN[o.k]), alt:o.alt }; } });
      // qidirilayotgan ob'ektga yo'l ko'rsatkich (ekrandan tashqarida bo'lsa)
      if(lab.target){ const o=objs.find(x=>x.k===lab.target); if(o){ const w=rotZ(o.v,off), z=dot(w,B.f), x=dot(w,B.r), y=dot(w,B.u);
          const p=z>0.05?[cx+x/z*F, cy-y/z*F]:null;
          if(!p || p[0]<30||p[0]>W-30||p[1]<90||p[1]>H-150){ const ang=Math.atan2(-y,x), R0=Math.min(W,H)*0.36, ax=cx+Math.cos(ang)*R0, ay=cy+Math.sin(ang)*R0;
            ctx.save(); ctx.translate(ax,ay); ctx.rotate(ang); ctx.fillStyle='rgba(255,213,79,.95)'; ctx.beginPath(); ctx.moveTo(18,0); ctx.lineTo(-10,-11); ctx.lineTo(-4,0); ctx.lineTo(-10,11); ctx.closePath(); ctx.fill(); ctx.restore();
            ctx.fillStyle='rgba(255,213,79,.95)'; ctx.font='600 12px system-ui,sans-serif'; ctx.fillText(T(A.PN[o.k])+(o.alt<0?' ('+T(TX.below)+')':''),ax,ay+28); } } }
      // HUD: qayoqqa qarayapmiz
      const fw=rotZ(B.f,-off), az=(Math.atan2(fw[0],fw[1])/D2R+360)%360, alt=Math.asin(Math.max(-1,Math.min(1,fw[2])))/D2R;
      lab.hudT=lab.hudT||0; if(Date.now()-lab.hudT>200){ lab.hudT=Date.now();
        q('.ar-dir').textContent=`${Math.round(az)%360}° ${T(DIR8)[Math.round(az/45)%8]} · ${T(TX.alt)} ${Math.round(alt)}°`;
        q('.ar-look').textContent=best?`${T(TX.looking)} ${best.name}${best.alt<0?' ('+T(TX.below)+')':''}`:''; }
    }
    lab.frame=frame;
  },
  open(){ window.__labCover=true; cancelAnimationFrame(this.raf); this.raf=requestAnimationFrame(this.frame); },
  close(){ window.__labCover=false; cancelAnimationFrame(this.raf); this.raf=0; if(this.stopCam) this.stopCam();
    if(this.onOri){ window.removeEventListener('deviceorientationabsolute',this.onOri); window.removeEventListener('deviceorientation',this.onOri); this.sensOn=false; this.mode='drag'; } },
  destroy(){ this.close && this.close(); }
});
})();
