/* Teleskop rejimi (Bugungi osmon — labs/tonight.js) */
(function(){
const {register,T,L,esc,fmt,jd,hiDPI,bvRGB}=window.LAB;
const LAT=41.2995, LON=69.2401, TZ=5, D2R=Math.PI/180, EPS=23.4393*D2R;
// Standish (JPL) J2000 elementlari: a, e, I, L, ϖ, Ω va ularning asrlik o'zgarishi
const EL={
 mercury:[0.38709927,0.20563593,7.00497902,252.25032350,77.45779628,48.33076593, 0.00000037,0.00001906,-0.00594749,149472.67411175,0.16047689,-0.12534081],
 venus:  [0.72333566,0.00677672,3.39467605,181.97909950,131.60246718,76.67984255, 0.00000390,-0.00004107,-0.00078890,58517.81538729,0.00268329,-0.27769418],
 earth:  [1.00000261,0.01671123,-0.00001531,100.46457166,102.93768193,0, 0.00000562,-0.00004392,-0.01294668,35999.37244981,0.32327364,0],
 mars:   [1.52371034,0.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891, 0.00001847,0.00007882,-0.00813131,19140.30268499,0.44441088,-0.29257343],
 jupiter:[5.20288700,0.04838624,1.30439695,34.39644051,14.72847983,100.47390909, -0.00011607,-0.00013253,-0.00183714,3034.74612775,0.21252668,0.20469106],
 saturn: [9.53667594,0.05386179,2.48599187,49.95424423,92.59887831,113.66242448, -0.00125060,-0.00050991,0.00193609,1222.49362201,-0.41897216,-0.28867794],
 uranus: [19.18916464,0.04725744,0.77263783,313.23810451,170.95427630,74.01692503, -0.00196176,-0.00004397,-0.00242939,428.48202785,0.40805281,0.04240589],
 neptune:[30.06992276,0.00859048,1.77004347,-55.12002969,44.96476227,131.78422574, 0.00026291,0.00005105,0.00035372,218.45945325,-0.32241464,-0.00508664]
};
function helio(k, J){ const e0=EL[k], t=(J-2451545)/36525, v=i=>e0[i]+e0[i+6]*t;
  const a=v(0), e=v(1), I=v(2)*D2R, Lm=v(3), w=v(4), O=v(5)*D2R, om=(w-v(5))*D2R;
  let M=((Lm-w)%360+540)%360-180; M*=D2R; let E=M+e*Math.sin(M); for(let n=0;n<6;n++) E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
  const xp=a*(Math.cos(E)-e), yp=a*Math.sqrt(1-e*e)*Math.sin(E);
  const co=Math.cos(om), so=Math.sin(om), cO=Math.cos(O), sO=Math.sin(O), cI=Math.cos(I), sI=Math.sin(I);
  return [(co*cO-so*sO*cI)*xp+(-so*cO-co*sO*cI)*yp, (co*sO+so*cO*cI)*xp+(-so*sO+co*cO*cI)*yp, (so*sI)*xp+(co*sI)*yp]; }
function eclToEq(x,y,z){ const X=x, Y=y*Math.cos(EPS)-z*Math.sin(EPS), Z=y*Math.sin(EPS)+z*Math.cos(EPS), r=Math.hypot(X,Y,Z);
  return { ra:(Math.atan2(Y,X)/D2R+360)%360, dec:Math.asin(Z/r)/D2R, r }; }
function bodies(J){
  const E=helio('earth',J), out={};
  out.sun=eclToEq(-E[0],-E[1],-E[2]);
  ['mercury','venus','mars','jupiter','saturn','uranus','neptune'].forEach(k=>{ const P=helio(k,J); out[k]=eclToEq(P[0]-E[0],P[1]-E[1],P[2]-E[2]); });
  const d=J-2451545, Lm=(218.316+13.176396*d)*D2R, Mm=(134.963+13.064993*d)*D2R, F=(93.272+13.229350*d)*D2R;
  const lam=Lm+6.289*D2R*Math.sin(Mm), bet=5.128*D2R*Math.sin(F);
  out.moon=eclToEq(Math.cos(bet)*Math.cos(lam), Math.cos(bet)*Math.sin(lam), Math.sin(bet));
  const sl=Math.atan2(-E[1],-E[0]); out.moon.elong=((lam-sl)/D2R%360+360)%360;
  return out; }
function altaz(ra, dec, J){ const lst=((280.46061837+360.98564736629*(J-2451545)+LON)%360+360)%360;
  const H=(lst-ra)*D2R, d=dec*D2R, p=LAT*D2R;
  const alt=Math.asin(Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(H));
  const az=Math.atan2(-Math.sin(H), Math.tan(d)*Math.cos(p)-Math.sin(p)*Math.cos(H));
  return { alt:alt/D2R, az:(az/D2R+360)%360 }; }
const PN={ sun:{uz:'Quyosh',ru:'Солнце',en:'Sun'}, moon:{uz:'Oy',ru:'Луна',en:'Moon'}, mercury:{uz:'Merkuriy',ru:'Меркурий',en:'Mercury'}, venus:{uz:'Venera',ru:'Венера',en:'Venus'},
  mars:{uz:'Mars',ru:'Марс',en:'Mars'}, jupiter:{uz:'Yupiter',ru:'Юпитер',en:'Jupiter'}, saturn:{uz:'Saturn',ru:'Сатурн',en:'Saturn'}, uranus:{uz:'Uran',ru:'Уран',en:'Uranus'}, neptune:{uz:'Neptun',ru:'Нептун',en:'Neptune'} };
const PC={ sun:'#ffd35a', moon:'#f2f0e6', mercury:'#c9b8a2', venus:'#fff2c4', mars:'#ff7a4d', jupiter:'#f0d3a8', saturn:'#e8d49a', uranus:'#9fe6ec', neptune:'#7aa0ff' };
const PMAG={ sun:-26, moon:-11, mercury:0, venus:-4.2, mars:0.5, jupiter:-2.3, saturn:0.7, uranus:5.7, neptune:7.8 };
const DIR8={ uz:['shimol','shimoli-sharq','sharq','janubi-sharq','janub','janubi-g\'arb','g\'arb','shimoli-g\'arb'], ru:['север','северо-восток','восток','юго-восток','юг','юго-запад','запад','северо-запад'], en:['north','north-east','east','south-east','south','south-west','west','north-west'] };
const CARD={ uz:['Sh','Shq','J','G\''], ru:['С','В','Ю','З'], en:['N','E','S','W'] };
const CON={ ursaMajor:[['dubhe','merak','phecda','megrez','alioth','mizar','alkaid'],[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]],{uz:'Katta Ayiq',ru:'Большая Медведица',en:'Ursa Major'}],
  ursaMinor:[['polaris','yildun','epsUmi','zetaUmi','kochab','pherkad','etaUmi'],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],{uz:'Kichik Ayiq',ru:'Малая Медведица',en:'Ursa Minor'}],
  orion:[['betelgeuse','bellatrix','alnitak','alnilam','mintaka','saiph','rigel'],[[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[6,5]],{uz:'Orion',ru:'Орион',en:'Orion'}],
  cassiopeia:[['caph','schedar','gammaCas','ruchbah','segin'],[[0,1],[1,2],[2,3],[3,4]],{uz:'Kassiopeya',ru:'Кассиопея',en:'Cassiopeia'}],
  cygnus:[['deneb','sadr','albireo','deltaCyg','gienahCyg'],[[0,1],[1,2],[3,1],[1,4]],{uz:'Oqqush',ru:'Лебедь',en:'Cygnus'}],
  scorpius:[['acrab','dschubba','piSco','antares','tauSco','epsSco','sargas','kappaSco','shaula'],[[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8]],{uz:'Chayon',ru:'Скорпион',en:'Scorpius'}] };
const TX={ name:{uz:'Bugungi osmon — Toshkent',ru:'Небо сегодня — Ташкент',en:'Tonight’s sky — Tashkent'},
  sub:{uz:'41,3° sh.k. · 69,2° sh.u. · boshingiz ustidagi butun osmon',ru:'41,3° с.ш. · 69,2° в.д. · всё небо над головой',en:'41.3° N · 69.2° E · the whole sky overhead'},
  now:{uz:'Hozir',ru:'Сейчас',en:'Now'}, best:{uz:'Bugun kechasi ko\'rinadi',ru:'Видно этой ночью',en:'Visible tonight'},
  up:{uz:'Hozir osmonda',ru:'Сейчас над горизонтом',en:'Above the horizon now'}, none:{uz:'Hozir ufqdan yuqorida sayyora yo\'q',ru:'Сейчас планет над горизонтом нет',en:'No planets above the horizon right now'},
  at:{uz:'eng yaxshi',ru:'лучше всего',en:'best at'}, alt:{uz:'balandlik',ru:'высота',en:'altitude'},
  day:{uz:'Kunduz',ru:'День',en:'Daytime'}, tw:{uz:'Shafaq',ru:'Сумерки',en:'Twilight'}, night:{uz:'Tun',ru:'Ночь',en:'Night'},
  lit:{uz:'yoritilgan',ru:'освещена',en:'lit'},
  note:{uz:'Xarita boshingiz ustida ushlab turilgandek: markaz — zenit, chekka — ufq; sharq chapda. Sayyoralar JPL elementlari bo\'yicha hisoblanadi (~1°).',ru:'Карта как бы над головой: центр — зенит, край — горизонт; восток слева. Планеты по элементам JPL (~1°).',en:'Held overhead: centre is the zenith, the edge is the horizon, east is on the left. Planets from JPL elements (~1°).'} };
/* ---------------- Teleskop rejimi — asosiy 3D sahna kattalashtiriladi ---------------- */
const SX={ name:{uz:'Teleskop',ru:'Телескоп',en:'Telescope'}, sub:{uz:'Yerdan qarab, obyektni kattalashtiring',ru:'Смотрите с Земли и увеличивайте объект',en:'Look from Earth and magnify'},
  mag:{uz:'Kattalashtirish',ru:'Увеличение',en:'Magnification'}, fov:{uz:'Ko\'rish maydoni',ru:'Поле зрения',en:'Field of view'},
  drag:{uz:'Sudrab — yo\'naltirish · g\'ildirak — kattalashtirish',ru:'Перетаскивание — наведение · колесо — увеличение',en:'Drag to aim · scroll to zoom'},
  close:{uz:'✕ Chiqish',ru:'✕ Выйти',en:'✕ Exit'} };
const TG={ moon:[{uz:'Oy',ru:'Луна',en:'Moon'},30,{uz:'20× dan kraterlar va dengizlar ko\'rinadi; terminator yonida relyef eng yaxshi.',ru:'С 20× видны кратеры и моря; рельеф лучше всего у терминатора.',en:'From 20× craters and maria appear; relief is best near the terminator.'}],
  venus:[PN.venus,40,{uz:'30× da Oy kabi fazalari ko\'rinadi — Galiley ham shuni ko\'rgan.',ru:'При 30× видны фазы, как у Луны — это увидел ещё Галилей.',en:'At 30× it shows Moon-like phases — as Galileo saw.'}],
  mars:[PN.mars,60,{uz:'100× dan qutb qalpog\'i va qora dog\'lar; eng yaxshi — qarama-qarshi turish paytida.',ru:'С 100× — полярная шапка и тёмные области; лучше всего в противостояние.',en:'From 100× the polar cap and dark markings; best at opposition.'}],
  jupiter:[PN.jupiter,30,{uz:'10× da 4 Galiley yo\'ldoshi, 40× dan bulut kamarlari ko\'rinadi.',ru:'При 10× видны 4 галилеевых спутника, с 40× — облачные пояса.',en:'At 10× the 4 Galilean moons, from 40× the cloud belts.'}],
  saturn:[PN.saturn,30,{uz:'25× da halqalar aniq ko\'rinadi — birinchi marta ko\'rgan odam hayratda qoladi.',ru:'При 25× отчётливо видны кольца — впервые это поражает.',en:'At 25× the rings are clear — unforgettable the first time.'}],
  m31:[{uz:'Andromeda (M31)',ru:'Андромеда (M31)',en:'Andromeda (M31)'},6,{uz:'Qorong\'i osmonda oddiy ko\'z bilan ham xira dog\' bo\'lib ko\'rinadi — 2,5 mln yil oldin chiqqan nur.',ru:'В тёмном небе видна даже глазом как туманное пятно — свет, вышедший 2,5 млн лет назад.',en:'Under dark skies it is visible to the naked eye — light that left 2.5 million years ago.'}],
  sgra:[{uz:'Galaktika markazi (Sgr A*)',ru:'Центр Галактики (Sgr A*)',en:'Galactic centre (Sgr A*)'},4,{uz:'Qavs turkumi yo\'nalishida; markazni chang to\'sadi — uni infraqizil va radioda o\'rganishadi.',ru:'В направлении Стрельца; центр скрыт пылью — его изучают в ИК и радио.',en:'Towards Sagittarius; dust hides the centre — it is studied in infrared and radio.'}] };
register('scope',{ ico:'🔭', bare:true, name:SX.name, sub:SX.sub,
  build(body, lab){
    lab.tgt='saturn'; lab.mag=TG.saturn[1]; lab.yaw=0; lab.pitch=0;
    body.innerHTML=`<div class="sc-vig"></div><svg class="sc-cross" viewBox="-50 -50 100 100"><circle r="30" fill="none" stroke="rgba(160,210,255,.35)" stroke-width=".3"/><path d="M-46 0H-8M8 0H46M0-46V-8M0 8V46" stroke="rgba(160,210,255,.55)" stroke-width=".35"/></svg>
      <div class="sc-hud glass"><div class="lab-row" style="margin:0 0 8px;justify-content:space-between"><b style="font-size:15px">🔭 ${esc(T(SX.name))}</b><button class="lab-chip" id="scX">${esc(T(SX.close))}</button></div>
        <div class="lab-row" id="scT" style="margin:0 0 8px">${Object.keys(TG).map(k=>`<button class="lab-chip${k===lab.tgt?' on':''}" data-t="${k}">${esc(T(TG[k][0]))}</button>`).join('')}</div>
        <div class="lab-row" style="margin:0"><span style="font-size:12px;color:var(--text-dim)">${esc(T(SX.mag))}</span><input type="range" class="lab-range" id="scM" min="0" max="1000" style="flex:1" /><b id="scMv" style="min-width:52px;text-align:right"></b></div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:4px" id="scF"></div><p class="lab-p" id="scTip" style="margin:8px 0 0;font-size:12.5px"></p>
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">${esc(T(SX.drag))}</div></div>`;
    const $=id=>body.querySelector('#'+id);
    const m2s=m=>Math.log(m)/Math.log(400)*1000, s2m=s=>Math.exp(s/1000*Math.log(400));
    const upd=()=>{ $('scM').value=m2s(lab.mag); $('scMv').textContent=fmt(lab.mag,lab.mag<10?1:0)+'×'; const f=55/lab.mag;
      $('scF').textContent=T(SX.fov)+': '+(f>=1?fmt(f,1)+'°':fmt(f*60,0)+'′'); $('scTip').textContent=T(TG[lab.tgt][2]); };
    body.querySelectorAll('[data-t]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); lab.tgt=b.dataset.t; lab.mag=TG[lab.tgt][1]; lab.yaw=lab.pitch=0;
      body.querySelectorAll('[data-t]').forEach(q=>q.classList.toggle('on',q===b)); upd(); window.LAB.click(760); });
    $('scM').oninput=e=>{ lab.mag=s2m(+e.target.value); upd(); };
    $('scX').onclick=()=>window.LAB.closeLab('scope');
    let drag=null;
    lab.root.addEventListener('pointerdown',e=>{ if(e.target.closest('.sc-hud')) return; drag=[e.clientX,e.clientY]; });
    window.addEventListener('pointermove',e=>{ if(!drag||!lab.isOpen) return; const f=55/lab.mag*D2R/window.innerHeight;
      lab.yaw-=(e.clientX-drag[0])*f; lab.pitch+=(e.clientY-drag[1])*f; lab.pitch=Math.max(-1.2,Math.min(1.2,lab.pitch)); drag=[e.clientX,e.clientY]; });
    window.addEventListener('pointerup',()=>drag=null);
    lab.root.addEventListener('wheel',e=>{ if(!lab.isOpen) return; e.preventDefault(); lab.mag=Math.max(1,Math.min(400,lab.mag*Math.exp(-e.deltaY*0.0012))); upd(); },{passive:false});
    lab.upd=upd;
  },
  open(){
    const S=window.__solar; if(!S) return; const lab=this, cam=S.camera, ctl=S.controls;
    lab.saved={ pos:cam.position.clone(), tgt:ctl.target.clone(), fov:cam.fov };
    S.halt&&S.halt(); document.body.classList.add('scope-on'); lab.upd();
    const cache=lab.cache||(lab.cache={});
    const find=k=>{ if(cache[k]) return cache[k]; let o=null; S.scene.traverse(q=>{ if(!o && q.isMesh && q.userData && (q.userData.key===k || q.userData.pickKey===k)) o=q; }); return (cache[k]=o); };
    const earth=find('earth'), V=THREE.Vector3, ep=new V(), tp=new V(), up=new V(0,1,0);
    const loop=()=>{ if(!lab.isOpen) return;
      earth.getWorldPosition(ep);
      if(lab.tgt==='m31' && S.COSMO && S.COSMO.pos.m31) tp.copy(S.COSMO.pos.m31);
      else if(lab.tgt==='sgra' && S.BLACKHOLES && S.BLACKHOLES.sagA) tp.copy(S.BLACKHOLES.sagA.g.position);
      else { const o=find(lab.tgt); if(o) o.getWorldPosition(tp); }
      const d0=tp.clone().sub(ep).normalize(), r=new V().crossVectors(d0,up).normalize(), u=new V().crossVectors(r,d0);
      const dir=d0.clone().addScaledVector(r,Math.tan(lab.yaw)).addScaledVector(u,Math.tan(lab.pitch)).normalize();
      const cp=ep.clone().addScaledVector(d0,(earth.geometry.parameters.radius||2.5)*1.7);
      cam.position.copy(cp); ctl.target.copy(cp).addScaledVector(dir,40); cam.lookAt(ctl.target);
      cam.fov=55/lab.mag; cam.updateProjectionMatrix();
      lab.raf=requestAnimationFrame(loop); };
    lab.raf=requestAnimationFrame(loop);
  },
  close(){ const S=window.__solar, lab=this; cancelAnimationFrame(lab.raf); document.body.classList.remove('scope-on');
    if(S && lab.saved){ S.camera.position.copy(lab.saved.pos); S.controls.target.copy(lab.saved.tgt); S.camera.fov=lab.saved.fov; S.camera.updateProjectionMatrix(); S.controls.update(); } }
});
})();
