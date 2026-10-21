/* TRAPPIST-1 ekzosayyoralar tizimi */
(function(){
const {register,T,L,esc,fmt,hiDPI}=window.LAB;
/* ---------------- TRAPPIST-1 (alohida 3D sahna) ---------------- */
const TR={ name:{uz:'TRAPPIST-1 tizimi',ru:'Система TRAPPIST-1',en:'The TRAPPIST-1 system'},
  sub:{uz:'40 yorug\'lik yili narida — qizil mitti atrofida 7 ta Yer kattaligidagi sayyora',ru:'В 40 световых годах — 7 планет размером с Землю у красного карлика',en:'40 light-years away — seven Earth-sized planets around a red dwarf'},
  hz:{uz:'Yashash mumkin bo\'lgan zona',ru:'Зона обитаемости',en:'Habitable zone'}, merc:{uz:'Merkuriy orbitasi (taqqoslash)',ru:'Орбита Меркурия (для сравнения)',en:'Mercury’s orbit (for scale)'},
  showM:{uz:'Merkuriy orbitasini ko\'rsatish',ru:'Показать орбиту Меркурия',en:'Show Mercury’s orbit'},
  k:{ r:{uz:'Radiusi',ru:'Радиус',en:'Radius'}, m:{uz:'Massasi',ru:'Масса',en:'Mass'}, p:{uz:'Yili',ru:'Год',en:'Year'}, a:{uz:'Yulduzgacha',ru:'До звезды',en:'From star'}, t:{uz:'Harorat',ru:'Температура',en:'Temperature'}, z:{uz:'Zona',ru:'Зона',en:'Zone'} },
  days:{uz:'kun',ru:'сут',en:'days'}, mkm:{uz:'mln km',ru:'млн км',en:'million km'}, yes:{uz:'yashash zonasida',ru:'в зоне обитаемости',en:'in the habitable zone'}, no:{uz:'zonadan tashqarida',ru:'вне зоны',en:'outside the zone'},
  star:{uz:'Yulduz: 0,09 M☉ · 2 566 K · Yupiterdan sal kattaroq. Tizim to\'lig\'icha Merkuriy orbitasi ichiga 6 marta sig\'adi.',ru:'Звезда: 0,09 M☉ · 2 566 K · чуть больше Юпитера. Вся система в 6 раз меньше орбиты Меркурия.',en:'Star: 0.09 M☉ · 2,566 K · barely larger than Jupiter. The whole system would fit inside Mercury’s orbit six times over.'},
  tap:{uz:'Sayyorani bosing',ru:'Нажмите на планету',en:'Tap a planet'} };
// Agol va boshq. (2021): radius (R⊕), massa (M⊕), davr (kun), a (a.b.), muvozanat harorati (K)
const TP=[['b',1.116,1.374,1.511,0.01154,400,'#c48a63',{uz:'Eng ichki sayyora. JWST (2023) kuzatuviga ko\'ra qalin atmosferasi yo\'q, kunduzgi tomoni ~230 °C.',ru:'Самая внутренняя планета. По данным JWST (2023), плотной атмосферы нет, дневная сторона ~230 °C.',en:'The innermost planet. JWST (2023) found no thick atmosphere; its day side is about 230 °C.'}],
 ['c',1.097,1.308,2.422,0.01580,342,'#b99a78',{uz:'Qoyali, Venera kabi issiq bo\'lishi mumkin. JWST qalin CO₂ atmosferasini inkor etdi.',ru:'Каменистая и, возможно, горячая, как Венера. JWST исключил плотную CO₂-атмосферу.',en:'Rocky and possibly Venus-hot. JWST ruled out a thick CO₂ atmosphere.'}],
 ['d',0.788,0.388,4.050,0.02227,288,'#8fb0c8',{uz:'Yashash zonasining ichki chekkasida. Yerdan yengil — massasi Yerning 39%.',ru:'На внутренней границе зоны обитаемости. Легче Земли — 39% её массы.',en:'On the inner edge of the habitable zone, with only 39% of Earth’s mass.'}],
 ['e',0.920,0.692,6.101,0.02925,251,'#5d9ad6',{uz:'Suyuq suv uchun eng istiqbolli sayyora — zichligi va olayotgan nuri Yernikiga yaqin.',ru:'Самый перспективный кандидат для жидкой воды — плотность и освещённость близки к земным.',en:'The best candidate for liquid water — its density and sunlight are close to Earth’s.'}],
 ['f',1.045,1.039,9.208,0.03849,219,'#7fb6d9',{uz:'Yashash zonasida. Ehtimol muz bilan qoplangan okean dunyosi.',ru:'В зоне обитаемости. Возможно, мир-океан подо льдом.',en:'In the habitable zone — possibly an ice-covered ocean world.'}],
 ['g',1.129,1.321,12.35,0.04683,199,'#a9c8dc',{uz:'Tizimdagi eng katta sayyora, yashash zonasining tashqi chekkasida.',ru:'Крупнейшая планета системы, на внешней границе зоны.',en:'The largest planet, on the outer edge of the habitable zone.'}],
 ['h',0.755,0.326,18.77,0.06189,173,'#d4dde6',{uz:'Eng tashqi va eng sovuq — ehtimol muzli olam.',ru:'Самая внешняя и холодная — вероятно, ледяной мир.',en:'The outermost and coldest — likely an icy world.'}]];
const SCALE=600;
function planetTex(col, seed, icy){ const c=document.createElement('canvas'); c.width=256; c.height=128; const x=c.getContext('2d');
  x.fillStyle=col; x.fillRect(0,0,256,128); let s=seed*9301+49297;
  const rnd=()=>((s=(s*9301+49297)%233280)/233280);
  for(let i=0;i<220;i++){ x.fillStyle=`rgba(${rnd()<0.5?'255,255,255':'0,0,0'},${0.05+rnd()*0.12})`; x.beginPath(); x.ellipse(rnd()*256,rnd()*128,4+rnd()*26,2+rnd()*8,0,0,6.283); x.fill(); }
  if(icy){ x.fillStyle='rgba(245,250,255,0.85)'; x.fillRect(0,0,256,14); x.fillRect(0,114,256,14); }
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t; }
register('trappist',{ ico:'🔴', name:TR.name, sub:TR.sub,
  build(body, lab){
    body.innerHTML=`<div class="lab-grid"><div style="position:relative"><canvas class="lab-cv" id="tpCv" style="cursor:grab"></canvas><div id="tpLbl"></div>
      <label class="lab-row" style="font-size:12.5px;color:var(--text-dim);gap:6px"><input type="checkbox" id="tpM" /> ${esc(T(TR.showM))}</label></div>
      <div><h4 id="tpN" style="font-size:20px;margin:0 0 6px">TRAPPIST-1</h4><p class="lab-p" id="tpD">${esc(T(TR.star))}</p><div class="lab-kv" id="tpKv"></div>
      <div class="lab-row" id="tpChips">${TP.map(p=>`<button class="lab-chip" data-p="${p[0]}">${p[0]}</button>`).join('')}</div><p class="lab-note">${esc(T(TR.tap))}</p></div></div>`;
    const $=id=>body.querySelector('#'+id), cv=$('tpCv');
    const R=new THREE.WebGLRenderer({canvas:cv, antialias:true}); R.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); R.outputEncoding=THREE.sRGBEncoding;
    const sc=new THREE.Scene(), cam=new THREE.PerspectiveCamera(45,1.6,0.1,5000); cam.position.set(0,34,56);
    const ctl=new THREE.OrbitControls(cam,cv); ctl.enableDamping=true; ctl.minDistance=8; ctl.maxDistance=700;
    lab.destroy=()=>{ cancelAnimationFrame(lab._raf); lab._raf=0; ctl.dispose(); R.dispose(); try{ R.forceContextLoss(); }catch(e){} };
    sc.add(new THREE.AmbientLight(0x331a14,0.6)); const pl=new THREE.PointLight(0xff8a5a,2.4,0,1.2); sc.add(pl);
    const sgc=document.createElement('canvas'); sgc.width=sgc.height=256; const sx=sgc.getContext('2d'), gg=sx.createRadialGradient(128,128,0,128,128,128);
    gg.addColorStop(0,'rgba(255,200,150,1)'); gg.addColorStop(0.2,'rgba(255,110,60,0.8)'); gg.addColorStop(0.5,'rgba(220,60,30,0.25)'); gg.addColorStop(1,'rgba(160,30,20,0)'); sx.fillStyle=gg; sx.fillRect(0,0,256,256);
    const star=new THREE.Mesh(new THREE.SphereGeometry(1.6,48,32), new THREE.MeshBasicMaterial({color:0xff6a3a})); sc.add(star);
    // Haqiqiy teksturalar (NASA asosida): qizil mitti — Quyosh fotosferasi naqshi qizil rangda; sayyoralar sirti noma'lum,
    // shuning uchun haqiqiy toshli (Oy) va muzli (Serera) sirt suratlari ularning rangiga bo'yaladi.
    const RT=window.REALTEX&&window.REALTEX.ok?window.REALTEX:null;
    if(RT) RT.star(star,0xff6a3a,{gain:1.45,glow:false});   // o'z nuri (glow) allaqachon bor
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(sgc), transparent:true, blending:THREE.AdditiveBlending, depthWrite:false})); glow.scale.set(14,14,1); sc.add(glow);
    const hz=new THREE.Mesh(new THREE.RingGeometry(0.025*SCALE,0.05*SCALE,128), new THREE.MeshBasicMaterial({color:0x3ccf7a, transparent:true, opacity:0.12, side:THREE.DoubleSide, depthWrite:false}));
    hz.rotation.x=-Math.PI/2; sc.add(hz);
    const ring=(r,col,op,dash)=>{ const p=[]; for(let i=0;i<=256;i++){ const a=i/256*Math.PI*2; p.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r)); }
      const m=dash?new THREE.LineDashedMaterial({color:col,transparent:true,opacity:op,dashSize:4,gapSize:4}):new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op});
      const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(p),m); if(dash) l.computeLineDistances(); sc.add(l); return l; };
    const merc=ring(0.387*SCALE,0xffd8a0,0.5,true); merc.visible=false;
    const bg=new THREE.BufferGeometry(), bp=new Float32Array(1500*3); for(let i=0;i<1500;i++){ const v=new THREE.Vector3().randomDirection? new THREE.Vector3().randomDirection():new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).normalize(); v.multiplyScalar(1500+Math.random()*800); bp.set([v.x,v.y,v.z],i*3); }
    bg.setAttribute('position',new THREE.BufferAttribute(bp,3)); sc.add(new THREE.Points(bg,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,transparent:true,opacity:0.7})));
    const lbl=$('tpLbl');
    const P=TP.map((d,i)=>{ const r=d[1]*0.55, a=d[4]*SCALE; ring(a,0x9fb8ff,0.18,false);
      const m=new THREE.Mesh(new THREE.SphereGeometry(r,48,32), new THREE.MeshStandardMaterial({map:planetTex(d[6],i+3,i>=4), roughness:0.9}));
      m.userData.i=i; sc.add(m);
      if(RT) RT.apply(m, i>=4?'ceres':'moon', { tint:d[6], gain:1.25, bump:r*.01, renderer:R }); const el=document.createElement('div'); el.className='tp-lbl'; el.textContent=d[0]; lbl.appendChild(el);
      return {d,m,a,ang:Math.random()*Math.PI*2,el}; });
    let sel=-1;
    function show(i){ sel=i; const d=TP[i]; $('tpN').textContent='TRAPPIST-1'+d[0]; $('tpD').textContent=T(d[7]);
      const inHz=d[4]>=0.025&&d[4]<=0.05;
      $('tpKv').innerHTML=[[T(TR.k.r),fmt(d[1],2)+' R⊕'],[T(TR.k.m),fmt(d[2],2)+' M⊕'],[T(TR.k.p),fmt(d[3],2)+' '+T(TR.days)],[T(TR.k.a),fmt(d[4]*149.6,2)+' '+T(TR.mkm)],
        [T(TR.k.t),fmt(d[5],0)+' K ('+fmt(d[5]-273,0)+' °C)'],[T(TR.k.z),T(inHz?TR.yes:TR.no)]].map(([k,v])=>`<div><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join('');
      body.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('on',b.dataset.p===d[0])); }
    body.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>show(TP.findIndex(p=>p[0]===b.dataset.p)));
    $('tpM').onchange=e=>{ merc.visible=e.target.checked; if(e.target.checked){ cam.position.set(0,380,420); } };
    const ray=new THREE.Raycaster(), pv=new THREE.Vector2(); let down=null;
    cv.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
    cv.addEventListener('pointerup',e=>{ if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5) return; const r=cv.getBoundingClientRect();
      pv.set((e.clientX-r.left)/r.width*2-1, -(e.clientY-r.top)/r.height*2+1); ray.setFromCamera(pv,cam);
      const h=ray.intersectObjects(P.map(p=>p.m)); if(h.length){ show(h[0].object.userData.i); window.LAB.click(820); } });
    let last=performance.now();
    lab.loop=now=>{ if(!lab.isOpen) return; const dt=Math.min(0.05,(now-last)/1000); last=now;
      const w=Math.max(260,cv.parentElement.clientWidth), h=Math.round(w*0.66); if(cv._w!==w){ cv._w=w; cv.style.height=h+'px'; R.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix(); }
      const r=cv.getBoundingClientRect();
      P.forEach(p=>{ p.ang+=dt*(2*Math.PI/p.d[3])*1.0; p.m.position.set(Math.cos(p.ang)*p.a,0,Math.sin(p.ang)*p.a); p.m.rotation.y=-p.ang;   // qulflangan aylanish
        const v=p.m.position.clone(); v.y+=p.d[1]*0.55+0.8; v.project(cam);
        p.el.style.transform=`translate(${(v.x*0.5+0.5)*r.width}px,${(-v.y*0.5+0.5)*r.height}px) translate(-50%,-100%)`; p.el.style.opacity=v.z<1?1:0; p.el.classList.toggle('on',p.m.userData.i===sel); });
      ctl.update(); R.render(sc,cam); lab._raf=requestAnimationFrame(lab.loop); };
  },
  open(){ cancelAnimationFrame(this._raf); this._raf=requestAnimationFrame(this.loop); }   // yopib-ochishda ikkita sikl bo'lmasin
});

})();
