/* Dunyo rasadxonalari — 3D modellar (2-qism): yirik teleskoplar, radio-teleskoplar va kosmik teleskop. */
(function(){
'use strict';
const OM=window.OBS_MODELS=window.OBS_MODELS||[];
const t3=(uz,ru,en)=>({uz,ru,en});
const pines=(c,n,r0,r1,hFn)=>{ const {THREE,M,mesh,rnd}=c, trunk=M({ color:0x4a3a2a, rough:1 }), nd=M({ color:0x22452a, rough:0.95, flat:true });
  for(let i=0;i<n;i++){ const a=rnd()*Math.PI*2, r=r0+rnd()*(r1-r0), x=Math.cos(a)*r, z=Math.sin(a)*r, y=hFn?hFn(x,z):0, s=0.8+rnd()*0.8;
    mesh(new THREE.CylinderGeometry(0.25*s,0.35*s,3*s,6),trunk,[x,y+1.5*s,z]); mesh(new THREE.ConeGeometry(2.4*s,8*s,7),nd,[x,y+6*s,z]); } };

/* ---------------- Yerkes ---------------- */
OM.push({ id:'yerkes', cat:'classic', icon:'🔭', flag:'🇺🇸', yearN:1897,
  name:t3('Yerkes rasadxonasi','Йеркская обсерватория','Yerkes Observatory'), place:t3('Uiskonsin, AQSh','Висконсин, США','Wisconsin, USA'),
  year:t3('1897','1897','1897'), coords:t3('42,57° Sh, 88,56° G‘','42,57° с. ш., 88,56° з. д.','42.57° N, 88.56° W'),
  instr:t3('102 sm refraktor — dunyodagi eng katta linzali teleskop','102-см рефрактор — крупнейший линзовый телескоп мира','102 cm refractor — the largest lens telescope ever used'),
  facts:[t3('102 sm (40 dyuym) linzali teleskop hozirgacha astronomiyada ishlatilgan eng katta refraktor; trubasi ~19 m.','102-см (40-дюймовый) рефрактор — крупнейший из когда-либо применявшихся в астрономии; труба ~19 м.','The 102 cm (40-inch) refractor is the largest refractor ever used in astronomy; its tube is ~19 m long.'),
    t3('Gumbaz ostidagi pol butunligicha ko‘tarilib-tushadi — kuzatuvchi okulyarga yetishi uchun.','Пол под куполом целиком поднимается и опускается — чтобы наблюдатель доставал до окуляра.','The whole floor under the dome rises and falls so the observer can reach the eyepiece.'),
    t3('Edvin Xabbl shu yerda doktorlik ishini yozgan (1917).','Здесь защитил докторскую Эдвин Хаббл (1917).','Edwin Hubble earned his doctorate here (1917).')],
  env:{ sky:'day', sunAz:215, sunAlt:30, ground:'grass', size:700, shadow:70, hemiGround:0x3e5030 },
  build(c){ const {THREE,M,X,mesh,lbl}=c;
    const brick=M({ map:X.brick('#b98a5e','#d9c9aa',[6,2]), rough:0.85, clip:true }), roof=M({ color:0x5e4a3c, rough:0.8, clip:true });
    const hollow=(w,h,d,x,z)=>{ [[0,-d/2,w,0.7],[0,d/2,w,0.7],[-w/2,0,0.7,d],[w/2,0,0.7,d]].forEach(([dx,dz,ww,dd])=>mesh(new THREE.BoxGeometry(ww,h,dd),brick,[x+dx,h/2,z+dz])); mesh(new THREE.BoxGeometry(w,0.6,d),roof,[x,h+0.3,z]); };
    hollow(54,10,12,0,0); hollow(10,14,16,-22,0);
    const big=c.domeHouse({ r:13.7, h:14, wallMap:null, wall:0xc39468, dome:0x9aa6b2, inner:0x6a5a4a }); big.position.set(-38,0,0); c.root.add(big); big.userData.dome.rotation.y=Math.PI/2;
    const sm=[[30,-7],[30,7]].map(([x,z])=>{ const d=c.domeHouse({ r:4.5, h:12, wall:0xc39468, dome:0x9aa6b2 }); d.position.set(x,0,z); c.root.add(d); return d; });
    const floor=mesh(new THREE.CylinderGeometry(11.5,11.5,0.4,64),M({ color:0x7a5c44, rough:0.9, clip:true }),[-38,1,0]);
    const ref=c.refractor({ L:19.2, D:1.02, lat:42.6, pier:8, color:0x1e2c40, ha:1.2, decl:0.55 }); ref.position.set(-38,0.2,0); c.root.add(ref);
    c.onDome(k=>{ big.userData.setOpen(k); sm.forEach(d=>d.userData.setOpen(k)); floor.position.y=1+k*5.5; });
    lbl(t3('102 sm refraktor · truba 19 m','102-см рефрактор · труба 19 м','102 cm refractor · 19 m tube'),[-38,31,0]);
    lbl(t3('Ko‘tariladigan pol','Поднимающийся пол','Rising floor'),[-30,7,4]);
    return { cam:[30,30,62], tgt:[-14,9,0], maxDist:320, cutAt:0, cutN:[0,0,-1] }; },
  feat:{ cut:true, dome:true }
});

/* ---------------- Palomar (Hale) ---------------- */
OM.push({ id:'palomar', cat:'classic', icon:'🪞', flag:'🇺🇸', yearN:1948,
  name:t3('Palomar — Hale teleskopi','Паломар — телескоп Хейла','Palomar — Hale Telescope'), place:t3('Kaliforniya, AQSh','Калифорния, США','California, USA'),
  year:t3('1948','1948','1948'), coords:t3('33,36° Sh, 116,86° G‘','33,36° с. ш., 116,86° з. д.','33.36° N, 116.86° W'),
  instr:t3('5,1 m (200 dyuym) ko‘zguli teleskop','5,1-м (200-дюймовый) зеркальный телескоп','5.1 m (200-inch) reflecting telescope'),
  facts:[t3('1948-yildan 1976-yilgacha dunyodagi eng katta teleskop bo‘lgan. Ko‘zgusi 11 yil davomida silliqlangan.','С 1948 по 1976 год — крупнейший телескоп мира. Зеркало шлифовали 11 лет.','The world’s largest telescope from 1948 to 1976. Its mirror took 11 years to grind and polish.'),
    t3('Teleskop «taqasimon» montirovkada: ulkan halqa Yer o‘qiga parallel aylanadi — teleskop Qutb yulduzigacha yetadi.','Телескоп на «подковообразной» монтировке: огромное кольцо вращается параллельно земной оси.','It sits on a “horseshoe” mount: a huge ring that turns parallel to Earth’s axis.'),
    t3('Gumbaz diametri 41 m. Shu teleskopda 1963-yilda kvazarlar tabiati ochilgan.','Диаметр купола — 41 м. На этом телескопе в 1963 году раскрыли природу квазаров.','The dome is 41 m across. Here, in 1963, the nature of quasars was revealed.')],
  env:{ sky:'dusk', sunAz:255, sunAlt:4, ground:'grass', size:700, shadow:60, hemiGround:0x34442c },
  build(c){ const {THREE,mesh,lbl}=c;
    const house=c.domeHouse({ r:20.5, h:21, wall:0xf1f1ec, dome:0xf7f7f4, domeMetal:0.35, inner:0x4a5160, floor:0x5f6470, slit:0.2 }); c.root.add(house); house.userData.dome.rotation.y=Math.PI/2;
    const tel=c.reflector({ D:5.1, L:17, mount:'horseshoe', lat:33.4, axisH:9 }); tel.position.set(0,0.3,0); c.root.add(tel);
    c.onDome(k=>{ house.userData.setOpen(k); tel.userData.point(k); });
    pines(c,90,40,200);
    lbl(t3('5,1 m ko‘zgu','Зеркало 5,1 м','5.1 m mirror'),[0,10,-3]);
    lbl(t3('Taqasimon montirovka','Подковообразная монтировка','Horseshoe mount'),[0,20,-10]);
    lbl(t3('Gumbaz · Ø 41 m','Купол · Ø 41 м','Dome · Ø 41 m'),[0,44,0]);
    return { cam:[40,24,44], tgt:[0,10,0], maxDist:350, cutAt:0 }; },
  feat:{ cut:true, dome:true }
});

/* ---------------- Maydanak (O'zbekiston) ---------------- */
const maidH=(x,z)=>{ const r=Math.hypot(x,z), n=Math.sin(x*0.031+Math.cos(z*0.017))*0.5+Math.sin(z*0.027+x*0.011)*0.5;
  let h=r<62?n*0.8:-(r-62)*0.5-Math.pow(r-62,2)*0.0009+n*7*Math.min(1,(r-62)/120);
  if(r>430) h+=(r-430)*1.15+n*40; return h; };
OM.push({ id:'maidanak', cat:'modern', icon:'⛰', flag:'🇺🇿', yearN:1970,
  name:t3('Maydanak rasadxonasi','Обсерватория Майданак','Maidanak Observatory'), place:t3('Qashqadaryo, O‘zbekiston · 2593 m','Кашкадарья, Узбекистан · 2593 м','Kashkadarya, Uzbekistan · 2593 m'),
  year:t3('1970-yillardan','с 1970-х','since the 1970s'), coords:t3('38,67° Sh, 66,90° Sh.u.','38,67° с. ш., 66,90° в. д.','38.67° N, 66.90° E'),
  instr:t3('AZT-22 · 1,5 m ko‘zguli teleskop','АЗТ-22 · 1,5-м зеркальный телескоп','AZT-22 · 1.5 m reflector'),
  facts:[t3('Maydanak — dunyodagi eng tiniq osmonli joylardan biri: yulduz tasvirining «titrashi» o‘rtacha ~0,7″, bu Chili va Gavayidagi eng yaxshi rasadxonalar darajasi.','Майданак — одно из мест с самым спокойным небом в мире: «дрожание» звёзд в среднем ~0,7″ — уровень лучших обсерваторий Чили и Гавайев.','Maidanak has one of the steadiest skies on Earth: median “seeing” ~0.7″, on par with the best sites in Chile and Hawaii.'),
    t3('Ulug‘bek nomidagi Astronomiya instituti boshqaradi — Ulug‘bek an’anasi bugun ham davom etmoqda.','Обсерваторией управляет Астрономический институт имени Улугбека — традиция Улугбека продолжается.','It is run by the Ulugh Beg Astronomical Institute — Ulugh Beg’s tradition lives on.'),
    t3('Shu yerda gravitatsion linzalangan kvazarlar va yangi o‘zgaruvchan yulduzlar kuzatiladi.','Здесь наблюдают гравитационно линзированные квазары и переменные звёзды.','Astronomers here study gravitationally lensed quasars and variable stars.')],
  env:{ sky:'dusk', sunAz:265, sunAlt:3, ground:'sand', groundColor:'#8a7b67', size:1700, seg:190, shadow:70, terrain:maidH },
  build(c){ const {THREE,M,mesh,lbl}=c;
    const main=c.domeHouse({ r:6.5, h:6.5, wall:0xf4f4f2, dome:0xffffff, domeMetal:0.3, inner:0x50586a }); main.userData.dome.rotation.y=Math.PI/2; c.root.add(main);
    const tel=c.reflector({ D:1.5, L:4.2, mount:'fork', lat:38.7, axisH:2.3 }); tel.position.set(0,0.3,0); c.root.add(tel);
    const small=[[-24,10,3.6],[19,-15,3.2],[-11,-26,2.8],[26,18,2.6]].map(([x,z,r])=>{ const d=c.domeHouse({ r, h:r*0.95, wall:0xf4f4f2, dome:0xf0f2f4 }); d.position.set(x,maidH(x,z),z); c.root.add(d); return d; });
    c.onDome(k=>{ main.userData.setOpen(k); tel.userData.point(k); small.forEach(d=>d.userData.setOpen(k)); });
    const wh=M({ color:0xf0eee8, rough:0.8 }), bl=M({ color:0x2f5d8a, rough:0.6 });
    [[34,-36,14,8],[-38,-6,10,7]].forEach(([x,z,w,d])=>{ const y=maidH(x,z); mesh(new THREE.BoxGeometry(w,4,d),wh,[x,y+2,z]); mesh(new THREE.BoxGeometry(w+0.6,0.4,d+0.6),bl,[x,y+4.2,z]); });
    lbl(t3('AZT-22 · 1,5 m teleskop','АЗТ-22 · телескоп 1,5 м','AZT-22 · 1.5 m telescope'),[0,15,0]);
    lbl(t3('Eng tiniq osmonlardan biri · 0,7″','Одно из самых спокойных небес · 0,7″','One of the steadiest skies · 0.7″'),[30,22,30]);
    lbl(t3('Hisor tizmasi','Гиссарский хребет','Hissar Range'),[-380,190,-520]);
    return { cam:[70,38,84], tgt:[0,4,0], maxDist:700, cutAt:0 }; },
  feat:{ cut:true, dome:true }
});

/* ---------------- Keck (Mauna-Kea) ---------------- */
const keckH=(x,z)=>{ const r=Math.hypot(x,z); let h=r<120?0:-(r-120)*0.18;
  [[-260,-180,60,45],[300,-260,70,55],[-120,330,50,40],[420,160,80,60]].forEach(([cx,cz,hh,s])=>{ const d=Math.hypot(x-cx,z-cz); h+=hh*Math.exp(-(d*d)/(2*s*s)); });
  return h+Math.sin(x*0.05)*Math.cos(z*0.04)*1.2; };
OM.push({ id:'keck', cat:'modern', icon:'🌋', flag:'🇺🇸', yearN:1993,
  name:t3('Keck rasadxonasi','Обсерватория Кека','W. M. Keck Observatory'), place:t3('Mauna-Kea, Gavayi · 4145 m','Мауна-Кеа, Гавайи · 4145 м','Mauna Kea, Hawaii · 4145 m'),
  year:t3('1993 / 1996','1993 / 1996','1993 / 1996'), coords:t3('19,83° Sh, 155,47° G‘','19,83° с. ш., 155,47° з. д.','19.83° N, 155.47° W'),
  instr:t3('Ikkita 10 m teleskop · 36 segmentli ko‘zgu','Два 10-м телескопа · зеркало из 36 сегментов','Two 10 m telescopes · 36-segment mirrors'),
  facts:[t3('Har bir ko‘zgu 36 ta olti burchakli segmentdan yig‘ilgan (har biri 1,8 m) — ular soniyasiga 2 marta nanometr aniqlikda to‘g‘rilanadi.','Каждое зеркало собрано из 36 шестиугольных сегментов по 1,8 м — их положение подстраивается дважды в секунду с нанометровой точностью.','Each mirror is made of 36 hexagonal 1.8 m segments, re-aligned twice a second to nanometre precision.'),
    t3('Vulqon cho‘qqisida, bulutlardan baland — havo quruq va tiniq.','На вершине вулкана, выше облаков — воздух сухой и прозрачный.','On a volcano summit above the clouds, where the air is dry and clear.'),
    t3('Adaptiv optika atmosfera titrashini lazer yulduz yordamida tuzatadi; ikki teleskop birga interferometr bo‘lib ishlay oladi.','Адаптивная оптика исправляет дрожание атмосферы с помощью лазерной звезды; два телескопа могут работать как интерферометр.','Adaptive optics uses a laser guide star to cancel atmospheric blur; the two telescopes can work together as an interferometer.')],
  env:{ sky:'dusk', sunAz:280, sunAlt:2, ground:'sand', groundColor:'#7a4a36', size:1800, seg:170, shadow:90, terrain:keckH },
  build(c){ const {THREE,M,mesh,lbl,tex,rnd}=c;
    const cloudT=tex(512,512,(x,w,h)=>{ x.fillStyle='#e9eef5'; x.fillRect(0,0,w,h); for(let i=0;i<1400;i++){ x.globalAlpha=0.06+rnd()*0.1; x.fillStyle=rnd()<0.5?'#ffffff':'#b9c4d4'; x.beginPath(); x.arc(rnd()*w,rnd()*h,8+rnd()*40,0,7); x.fill(); } x.globalAlpha=1; },[6,6]);
    mesh(new THREE.PlaneGeometry(6000,6000),M({ map:cloudT, color:0xffe2c8, rough:1 }),[0,-210,0],[-Math.PI/2,0,0],null,true);
    const domes=[-42.5,42.5].map(x=>{ const d=c.domeHouse({ r:15, h:13, wall:0xf3f3f0, dome:0xfafafa, domeMetal:0.35, inner:0x48505e, slit:0.22 }); d.position.set(x,0,0); c.root.add(d); d.userData.dome.rotation.y=Math.PI/2; return d; });
    mesh(new THREE.BoxGeometry(56,8,12),M({ color:0xe8e8e4, rough:0.8, clip:true }),[0,4,-6]);
    const els=[-42.5,42.5].map(x=>{ const g=new THREE.Group(); g.position.set(x,0,0); c.root.add(g); const steel=M({ color:0x5d6b7c, rough:0.45, metal:0.6 });
      mesh(new THREE.CylinderGeometry(5,5.6,5,40),M({ color:0x8d949e, rough:0.8 }),[0,2.5,0],null,g);
      [-1,1].forEach(s=>mesh(new THREE.BoxGeometry(1.2,7,4),steel,[s*6.2,8,0],null,g));
      const el=new THREE.Group(); el.position.y=9.5; g.add(el);
      const mir=c.hexMirror({ rings:3, s:1.0, f:17.5, color:0xd8e4ec }); el.add(mir);
      mesh(new THREE.CylinderGeometry(5.8,5.8,0.6,6),M({ color:0x2a2f38, rough:0.6 }),[0,-0.5,0],[0,Math.PI/6,0],el);
      mesh(new THREE.TorusGeometry(2.2,0.18,8,32),steel,[0,10,0],[Math.PI/2,0,0],el);
      for(let i=0;i<4;i++){ const a=i/4*Math.PI*2+Math.PI/4, p1=new THREE.Vector3(Math.cos(a)*5.2,0,Math.sin(a)*5.2), p2=new THREE.Vector3(Math.cos(a)*2.2,10,Math.sin(a)*2.2);
        const m=mesh(new THREE.CylinderGeometry(0.12,0.12,p1.distanceTo(p2),6),steel,null,null,el); m.position.copy(p1).add(p2).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p2.clone().sub(p1).normalize()); }
      return el; });
    c.onDome(k=>{ domes.forEach(d=>d.userData.setOpen(k)); els.forEach(el=>{ el.rotation.x=0.25+k*0.4; }); });
    lbl(t3('Keck I','Кек I','Keck I'),[-42.5,32,0]); lbl(t3('Keck II','Кек II','Keck II'),[42.5,32,0]);
    lbl(t3('36 segment = 10 m ko‘zgu','36 сегментов = зеркало 10 м','36 segments = 10 m mirror'),[-42.5,17,3]);
    lbl(t3('Bulutlar ustida · 4145 m','Над облаками · 4145 м','Above the clouds · 4145 m'),[260,-150,420]);
    return { cam:[70,40,96], tgt:[0,9,0], maxDist:900, cutAt:0, cutN:[0,0,-1] }; },
  feat:{ cut:true, dome:true }
});

/* ---------------- ALMA (Chili) ---------------- */
const almaH=(x,z)=>Math.sin(x*0.004)*6+Math.cos(z*0.005+x*0.002)*5;
OM.push({ id:'alma', cat:'modern', icon:'📡', flag:'🇨🇱', yearN:2013,
  name:t3('ALMA','ALMA','ALMA'), place:t3('Chaxnantor platosi, Chili · 5000 m','Плато Чахнантор, Чили · 5000 м','Chajnantor Plateau, Chile · 5000 m'),
  year:t3('2013','2013','2013'), coords:t3('23,03° J, 67,75° G‘','23,03° ю. ш., 67,75° з. д.','23.03° S, 67.75° W'),
  instr:t3('66 ta antenna (12 m va 7 m)','66 антенн (12 м и 7 м)','66 antennas (12 m and 7 m)'),
  facts:[t3('66 ta antenna birgalikda bitta ulkan teleskop bo‘lib ishlaydi — ular orasidagi masofa 16 km gacha cho‘ziladi.','66 антенн работают как один гигантский телескоп — расстояние между ними до 16 км.','66 antennas work together as one giant telescope — spread over up to 16 km.'),
    t3('Antennalarni 28 g‘ildirakli maxsus yuk mashinalari joyidan joyga ko‘chiradi.','Антенны перевозят специальные 28-колёсные тягачи.','Special 28-wheeled transporters move the antennas around.'),
    t3('ALMA qora tuynukning birinchi «surati» (2019) olingan Event Horizon Telescope tarmog‘ida qatnashgan va sayyoralar tug‘ilayotgan disklarni suratga olgan.','ALMA участвовала в сети Event Horizon Telescope, получившей первое «фото» чёрной дыры (2019), и сняла диски, где рождаются планеты.','ALMA was part of the Event Horizon Telescope that took the first black-hole “photo” (2019), and it imaged discs where planets are forming.')],
  env:{ sky:'day', sunAz:20, sunAlt:55, ground:'sand', groundColor:'#a0705a', size:3200, seg:120, shadow:140, terrain:almaH },
  build(c){ const {THREE,M,mesh,lbl,rnd}=c;
    const vol=M({ color:0x7a4f42, rough:1, flat:true }), snow=M({ color:0xf4f6f8, rough:0.8, flat:true });
    [[-1300,-1700,520,420],[900,-1900,620,360],[2000,-600,500,300]].forEach(([x,z,r,h])=>{ mesh(new THREE.ConeGeometry(r,h,18),vol,[x,h/2-10,z],null,null,true); mesh(new THREE.ConeGeometry(r*0.22,h*0.22,18),snow,[x,h-10-h*0.11+1,z],null,null,true); });
    const pts=[]; let guard=0; while(pts.length<26&&guard++<2000){ const a=rnd()*Math.PI*2, r=Math.sqrt(rnd())*150, x=Math.cos(a)*r, z=Math.sin(a)*r; if(pts.every(p=>Math.hypot(p[0]-x,p[1]-z)>19)) pts.push([x,z, pts.length<20?12:7]); }
    const base=M({ color:0xeceef0, rough:0.6, metal:0.2 }), steel=M({ color:0xc8ccd2, rough:0.5, metal:0.3 });
    const ants=pts.map(([x,z,D])=>{ const s=D/12, g=new THREE.Group(); g.position.set(x,almaH(x,z),z); c.root.add(g);
      mesh(new THREE.CylinderGeometry(1.4*s,1.8*s,5*s,16),base,[0,2.5*s,0],null,g); mesh(new THREE.BoxGeometry(4*s,0.6*s,4*s),base,[0,0.3*s,0],null,g);
      const az=new THREE.Group(); az.position.y=5*s; g.add(az); [-1,1].forEach(q=>mesh(new THREE.BoxGeometry(0.7*s,3.6*s,1.6*s),steel,[q*2.3*s,1.8*s,0],null,az));
      const el=new THREE.Group(); el.position.y=3.3*s; az.add(el); mesh(new THREE.BoxGeometry(3.2*s,2.2*s,2.4*s),base,[0,0,0],null,el);
      const d=c.dish({ D, depth:D*0.17 }); d.position.y=0.8*s; el.add(d); return { az, el, ph:rnd()*0.2 }; });
    c.anim(t=>{ const A=Math.sin(t*0.06)*1.2, E=0.45+Math.sin(t*0.09)*0.25; ants.forEach(a=>{ a.az.rotation.y=A; a.el.rotation.x=E; }); });
    lbl(t3('66 antenna — bitta ulkan teleskop','66 антенн — один огромный телескоп','66 antennas — one giant telescope'),[0,30,0]);
    lbl(t3('12 m antenna','Антенна 12 м','12 m antenna'),[pts[0][0],22,pts[0][1]]);
    lbl(t3('Chaxnantor · 5000 m','Чахнантор · 5000 м','Chajnantor · 5000 m'),[-1300,470,-1700]);
    return { cam:[150,55,190], tgt:[0,8,0], maxDist:1600 }; },
  feat:{}
});

/* ---------------- FAST (Xitoy) ---------------- */
const fastH=(x,z)=>{ const r=Math.hypot(x,z); if(r<262) return -150;
  const base=Math.min(26,(r-262)*0.35), k=Math.max(0,Math.sin(x*0.011+1)*Math.sin(z*0.013+2))*95+Math.max(0,Math.sin(x*0.021+z*0.009))*35;
  return base+k*Math.min(1,(r-262)/150); };
OM.push({ id:'fast', cat:'modern', icon:'🛰', flag:'🇨🇳', yearN:2016,
  name:t3('FAST radio-teleskopi','Радиотелескоп FAST','FAST radio telescope'), place:t3('Guychjou, Xitoy','Гуйчжоу, Китай','Guizhou, China'),
  year:t3('2016','2016','2016'), coords:t3('25,65° Sh, 106,86° Sh.u.','25,65° с. ш., 106,86° в. д.','25.65° N, 106.86° E'),
  instr:t3('500 m sferik antenna','Сферическая антенна 500 м','500 m spherical dish'),
  facts:[t3('Diametri 500 m — dunyodagi eng katta yagona radio-teleskop; ichiga 30 ta futbol maydoni sig‘adi.','Диаметр 500 м — крупнейший в мире единый радиотелескоп; в нём поместятся 30 футбольных полей.','At 500 m across it is the world’s largest single-dish radio telescope — big enough for 30 football pitches.'),
    t3('4450 ta panel motorlar yordamida harakatlanib, sirt shaklini real vaqtda o‘zgartiradi.','4450 панелей двигаются моторами и меняют форму поверхности в реальном времени.','4,450 panels are moved by motors to reshape the surface in real time.'),
    t3('~30 tonnalik qabul kabinasi 6 ta minoradan tortilgan arqonlarda osilib turadi. FAST 1000 dan ortiq yangi pulsar topgan.','Приёмная кабина ~30 т висит на тросах от 6 башен. FAST открыл более 1000 новых пульсаров.','A ~30-tonne receiver cabin hangs from cables strung between 6 towers. FAST has found over 1,000 new pulsars.')],
  env:{ sky:'day', sunAz:160, sunAlt:46, ground:'grass', size:2600, seg:200, shadow:420, terrain:fastH, hemiGround:0x3a5030 },
  build(c){ const {THREE,M,mesh,lbl,tex}=c, Rc=300, tmax=Math.asin(250/300);
    const panT=tex(1024,512,(x,w,h)=>{ x.fillStyle='#c9cdd2'; x.fillRect(0,0,w,h); x.strokeStyle='rgba(70,80,95,.55)'; x.lineWidth=1.2; const n=64;
      for(let i=0;i<=n;i++){ x.beginPath(); x.moveTo(i*w/n,0); x.lineTo(i*w/n,h); x.stroke(); } for(let j=0;j<=32;j++){ x.beginPath(); x.moveTo(0,j*h/32); x.lineTo(w,j*h/32); x.stroke(); }
      for(let i=0;i<n;i++) for(let j=0;j<32;j++){ x.beginPath(); x.moveTo(i*w/n,j*h/32); x.lineTo((i+1)*w/n,(j+1)*h/32); x.stroke(); } },[3,1]);
    mesh(new THREE.SphereGeometry(Rc,160,40,0,Math.PI*2,Math.PI-tmax,tmax),M({ map:panT, rough:0.4, metal:0.5, side:THREE.DoubleSide }),[0,Rc*Math.cos(tmax),0]);
    mesh(new THREE.TorusGeometry(250,2.2,8,160),M({ color:0x8d939b, rough:0.6, metal:0.4 }),[0,0,0],[Math.PI/2,0,0]);
    const towerM=M({ color:0xe6e8ea, rough:0.6, metal:0.2 }), cableM=M({ color:0x2a2d33, rough:0.6, metal:0.5 });
    const tops=[]; for(let i=0;i<6;i++){ const a=i/6*Math.PI*2+0.3, x=Math.cos(a)*300, z=Math.sin(a)*300, y=fastH(x,z), top=y+150;
      mesh(new THREE.CylinderGeometry(2.4,4.5,top-y,8),towerM,[x,(top+y)/2,z]); mesh(new THREE.BoxGeometry(9,4,9),towerM,[x,top+2,z]); tops.push(new THREE.Vector3(x,top+2,z)); }
    const cab=new THREE.Group(); c.root.add(cab); mesh(new THREE.CylinderGeometry(7,7,4.5,6),M({ color:0xf3f4f5, rough:0.5, metal:0.3 }),[0,0,0],null,cab); mesh(new THREE.SphereGeometry(5,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),M({ color:0x9aa2ac, metal:0.5, rough:0.4 }),[0,-2.2,0],null,cab);
    const cables=tops.map(()=>mesh(new THREE.CylinderGeometry(0.5,0.5,1,6),cableM,null,null,null,true));
    c.anim(t=>{ cab.position.set(Math.cos(t*0.05)*40,30,Math.sin(t*0.05)*40);
      cables.forEach((m,i)=>{ const p1=tops[i], p2=cab.position, len=p1.distanceTo(p2); m.position.copy(p1).add(p2).multiplyScalar(0.5); m.scale.set(1,len,1); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p2.clone().sub(p1).normalize()); }); });
    lbl(t3('Ø 500 m — eng katta yagona antenna','Ø 500 м — крупнейшая единая антенна','Ø 500 m — largest single dish'),[0,-60,-200]);
    lbl(t3('Qabul kabinasi · ~30 t','Приёмная кабина · ~30 т','Receiver cabin · ~30 t'),[0,48,0]);
    lbl(t3('6 ta minora va arqonlar','6 башен и тросы','6 towers and cables'),[tops[0].x,tops[0].y+18,tops[0].z]);
    lbl(t3('4450 ta harakatlanuvchi panel','4450 подвижных панелей','4,450 moving panels'),[150,-70,90]);
    return { cam:[520,250,520], tgt:[0,-40,0], maxDist:2600, near:1 }; },
  feat:{}
});

/* ---------------- Jeyms Uebb kosmik teleskopi ---------------- */
OM.push({ id:'jwst', cat:'space', icon:'🛸', flag:'🌌', yearN:2021,
  name:t3('Jeyms Uebb kosmik teleskopi','Космический телескоп «Джеймс Уэбб»','James Webb Space Telescope'), place:t3('L2 nuqtasi · Yerdan 1,5 mln km','Точка L2 · 1,5 млн км от Земли','L2 point · 1.5 million km from Earth'),
  year:t3('2021 (uchirilgan)','2021 (запуск)','2021 (launched)'), coords:t3('Quyosh–Yer L2 nuqtasi atrofida','Вокруг точки L2 системы Солнце–Земля','Orbiting the Sun–Earth L2 point'),
  instr:t3('6,5 m oltin ko‘zgu · 18 segment','Золотое зеркало 6,5 м · 18 сегментов','6.5 m gold mirror · 18 segments'),
  facts:[t3('Ko‘zgu 18 ta berilliy segmentdan iborat va infraqizil nurni yaxshi qaytarishi uchun yupqa oltin qatlam bilan qoplangan.','Зеркало из 18 бериллиевых сегментов покрыто тончайшим слоем золота — оно лучше всего отражает инфракрасный свет.','The mirror is 18 beryllium segments coated with a whisper-thin layer of gold, which reflects infrared light best.'),
    t3('5 qatlamli quyosh qalqoni tennis maydonidek (21 × 14 m): bir tomoni ~+85 °C, ko‘zgu tomoni ~−233 °C.','5-слойный солнечный щит размером с теннисный корт (21 × 14 м): с одной стороны ~+85 °C, со стороны зеркала ~−233 °C.','The 5-layer sunshield is the size of a tennis court (21 × 14 m): ~+85 °C on one side, ~−233 °C on the mirror side.'),
    t3('25-dekabr 2021-yilda uchirilgan; koinotdagi eng birinchi galaktikalar va boshqa sayyoralar atmosferasini o‘rganadi.','Запущен 25 декабря 2021 г.; изучает самые первые галактики и атмосферы других планет.','Launched on 25 December 2021; it studies the very first galaxies and the atmospheres of other worlds.')],
  env:{ sky:'space', sunAz:20, sunAlt:-62, shadow:30, hemiSky:0x8899bb, hemiGround:0x221a10 },
  build(c){ const {THREE,M,mesh,lbl,D2R}=c;
    const sat=new THREE.Group(); c.root.add(sat);
    // to'ldiruvchi yorug'lik (NASA tasvirlaridagidek): ko'zgu tomoni haqiqatda soyada, aks holda hech narsa ko'rinmaydi
    const fill=new THREE.DirectionalLight(0xdfe6ff,1.3); fill.position.set(12,22,26); c.root.add(fill); const fill2=new THREE.DirectionalLight(0xffd9a0,0.5); fill2.position.set(-20,6,-10); c.root.add(fill2);
    const sh=new THREE.Shape([new THREE.Vector2(-10.5,0),new THREE.Vector2(-6,7),new THREE.Vector2(6,7),new THREE.Vector2(10.5,0),new THREE.Vector2(6,-7),new THREE.Vector2(-6,-7)]);
    for(let i=0;i<5;i++){ const g=new THREE.ShapeGeometry(sh); g.rotateX(-Math.PI/2); const s=1-i*0.035;
      const m=mesh(g,M({ color:i===4?0xe3d6ee:0xc9b6d8, metal:0.85, rough:0.28, side:THREE.DoubleSide, emissive:0x1a1024, ei:0.5 }),[0,i*0.38,0],null,sat); m.scale.set(s,1,s); }
    mesh(new THREE.BoxGeometry(2.6,1.4,2.6),M({ color:0x3b3f46, rough:0.6, metal:0.4 }),[0,-1.1,0],null,sat);
    mesh(new THREE.BoxGeometry(5.6,0.06,2.3),M({ color:0x1b2a55, rough:0.35, metal:0.6, emissive:0x0a1430, ei:0.5 }),[0,-1.1,4.2],null,sat);
    const ant=c.dish({ D:1.2, depth:0.25 }); ant.position.set(0.8,-2.2,-1.6); ant.rotation.x=Math.PI; sat.add(ant);
    mesh(new THREE.CylinderGeometry(0.3,0.3,2.2,12),M({ color:0x2f3238, metal:0.5, rough:0.5 }),[0,2.6,-0.6],null,sat);
    const ote=new THREE.Group(); ote.position.set(0,4.2,-1.2); ote.rotation.x=1.2; sat.add(ote);
    ote.add(c.hexMirror({ rings:2, s:0.76, gap:0.025, f:9, color:0xf0c060, rough:0.3, metal:0.45, emissive:0x7a5212 }));
    mesh(new THREE.BoxGeometry(5.2,0.5,5.6),M({ color:0x14161a, rough:0.7 }),[0,-0.45,0],null,ote);
    mesh(new THREE.BoxGeometry(2.2,1.6,2.2),M({ color:0x2a2c30, rough:0.6, metal:0.3 }),[0,-1.5,0],null,ote);
    const sec=new THREE.Vector3(0,7.2,0); mesh(new THREE.CylinderGeometry(0.37,0.37,0.1,6),M({ color:0xd9a73d, metal:1, rough:0.2, emissive:0x3a2a06 }),[0,7.2,0],null,ote);
    [90,210,330].forEach(a=>{ const p1=new THREE.Vector3(Math.cos(a*D2R)*2.8,0.2,Math.sin(a*D2R)*2.8), m=mesh(new THREE.CylinderGeometry(0.05,0.05,p1.distanceTo(sec),6),M({ color:0x1d1f24, rough:0.6 }),null,null,ote);
      m.position.copy(p1).add(sec).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),sec.clone().sub(p1).normalize()); });
    lbl(t3('18 oltin segment · 6,5 m','18 золотых сегментов · 6,5 м','18 gold segments · 6.5 m'),[0,9,2]);
    lbl(t3('5 qatlamli quyosh qalqoni · 21 × 14 m','5-слойный солнечный щит · 21 × 14 м','5-layer sunshield · 21 × 14 m'),[9,1.2,0]);
    lbl(t3('Ikkilamchi ko‘zgu','Вторичное зеркало','Secondary mirror'),[0,12.4,4.8]);
    return { cam:[6,12,19], tgt:[0,4.5,-1], maxDist:120, minDist:6, below:true }; },
  feat:{}
});
})();
