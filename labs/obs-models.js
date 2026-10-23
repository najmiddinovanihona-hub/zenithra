/* Dunyo rasadxonalari — 3D modellar (1-qism): teleskopsiz davr va klassik rasadxonalar.
   Har bir model: matnlar (uz/ru/en), muhit (env) va build(ctx) — ctx bloklari labs/observatories.js da.
   O'lchamlar metrda, haqiqiy inshootlar asosida soddalashtirilgan. */
(function(){
'use strict';
const OM=window.OBS_MODELS=window.OBS_MODELS||[];
const t3=(uz,ru,en)=>({uz,ru,en});

/* ---------------- Stounxenj ---------------- */
OM.push({ id:'stonehenge', cat:'naked', icon:'🪨', flag:'🇬🇧', yearN:-2500,
  name:t3('Stounxenj','Стоунхендж','Stonehenge'), place:t3('Uiltshir, Angliya','Уилтшир, Англия','Wiltshire, England'),
  year:t3('mil. avv. ~3000–2000','~3000–2000 до н. э.','~3000–2000 BC'), coords:t3('51,18° Sh, 1,83° G‘','51,18° с. ш., 1,83° з. д.','51.18° N, 1.83° W'),
  instr:t3('Tosh doira — quyosh va oy yo‘nalishlari','Каменный круг — направления на Солнце и Луну','Stone circle aligned to the Sun and Moon'),
  facts:[t3('Asosiy o‘qi yozgi quyosh chiqishi va qishki quyosh botishiga qaratilgan — 21-iyun tongida Quyosh aynan Tovon toshi ustidan chiqadi.','Главная ось направлена на восход Солнца в летнее солнцестояние и закат в зимнее — 21 июня Солнце встаёт прямо над Пяточным камнем.','Its main axis points to the midsummer sunrise and midwinter sunset — on 21 June the Sun rises right over the Heel Stone.'),
    t3('Katta sarsen toshlar 25 tonnagacha keladi; kichik «ko‘k toshlar» esa 240 km naridagi Uelsdan olib kelingan.','Большие сарсены весят до 25 тонн, а малые «голубые камни» привезены из Уэльса — за 240 км.','The big sarsens weigh up to 25 tonnes; the smaller “bluestones” were hauled from Wales, 240 km away.'),
    t3('Sarsen doirasining diametri ~33 m, eng baland trilit — 7,3 m. Qurilish ~1500 yil davom etgan.','Диаметр круга сарсенов ~33 м, самый высокий трилит — 7,3 м. Строили около 1500 лет.','The sarsen circle is ~33 m across, the tallest trilithon 7.3 m. Building went on for ~1500 years.')],
  env:{ sky:'dusk', sunAz:49.5, sunAlt:2, ground:'grass', size:800, shadow:70, hemiGround:0x3a4a2a },
  build(c){ const {THREE,M,X,mesh,jitter,lbl,D2R,rnd}=c, A=49.5*D2R, u=[Math.sin(A),0,-Math.cos(A)];
    const stone=M({ map:X.noise('#8f8c83',0.28,[1,1],{n:50,r:9,c:'rgba(130,150,90,.7)'}), rough:0.96 });
    const at=(r,deg)=>{ const a=deg*D2R; return [Math.sin(a)*r,0,-Math.cos(a)*r]; };
    const st=(w,h,d,pos,rotY,tilt)=>{ const g=jitter(new THREE.BoxGeometry(w,h,d,2,4,2),0.22); const m=mesh(g,stone,[pos[0],pos[1]!=null?pos[1]:h/2,pos[2]],[tilt||0,rotY,0]); return m; };
    const miss=new Set([4,9,13,21,22,26,27]), lint=new Set([0,1,2,28,29,6,7,16]), A0=49.5;
    for(let i=0;i<30;i++){ if(miss.has(i)) continue; const deg=A0+(i+0.5)/30*360, p=at(16.5,deg);
      if(i===8){ st(2.1,1.1,4.1,[p[0]*1.18,0.55,p[2]*1.18],-deg*D2R); continue; }
      st(2.1,4.1,1.1,p,-deg*D2R,(rnd()-0.5)*0.05);
      if(lint.has(i)&&!miss.has((i+1)%30)){ const d2=A0+(i+1)/30*360, q=at(16.5,d2); st(3.4,0.8,1.0,[q[0],4.5,q[2]],-d2*D2R); } }
    [[180,7.3],[140,6.5],[-140,6.5],[100,6.0],[-100,6.0]].forEach(([rel,h],k)=>{ const deg=A0+rel, r=k===0?8.5:k<3?9.5:10.5, p=at(r,deg), tg=[Math.cos(deg*D2R),0,Math.sin(deg*D2R)];
      [-1,1].forEach(s=>st(2.2,h,1.2,[p[0]+tg[0]*s*1.5,null,p[2]+tg[2]*s*1.5],-deg*D2R,(rnd()-0.5)*0.04));
      st(5.4,0.9,1.1,[p[0],h+0.45,p[2]],-deg*D2R); });
    for(let i=0;i<46;i++){ if(rnd()<0.42) continue; const deg=A0+i/46*360+3, p=at(12.2,deg); st(0.9,1.6+rnd()*0.5,0.6,p,-deg*D2R,(rnd()-0.5)*0.12); }
    for(let i=0;i<15;i++){ const deg=A0+110+i/14*140, p=at(6.8,deg); st(0.7,1.8+rnd()*0.6,0.6,p,-deg*D2R); }
    st(4.9,0.6,1.0,at(5,A0+180).map((v,i)=>i===1?0.3:v),-(A0+90)*D2R);
    const hs=[u[0]*77,0,u[2]*77]; st(2.4,4.9,2.1,hs,0.4,0.18);
    const bank=M({ map:X.grass([30,1]), color:0x8fae6a, rough:1 });
    mesh(new THREE.TorusGeometry(55,1.6,8,96),bank,[0,-0.6,0],[Math.PI/2,0,0]);
    [-1,1].forEach(s=>{ const m=mesh(new THREE.BoxGeometry(1.4,0.8,110),bank,[u[0]*72+Math.cos(A)*s*11,0.1,u[2]*72+Math.sin(A)*s*11],[0,-A,0]); });
    lbl(t3('Sarsen doirasi · Ø 33 m','Круг сарсенов · Ø 33 м','Sarsen circle · Ø 33 m'),[...at(16.5,A0+250).map((v,i)=>i===1?6.5:v)]);
    lbl(t3('Trilitlar · 7,3 m gacha','Трилиты · до 7,3 м','Trilithons · up to 7.3 m'),[...at(8.5,A0+180).map((v,i)=>i===1?9:v)]);
    lbl(t3('Tovon toshi','Пяточный камень','Heel Stone'),[hs[0],6.5,hs[2]]);
    lbl(t3('Ko‘k toshlar (Uelsdan)','«Голубые камни» (из Уэльса)','Bluestones (from Wales)'),[...at(12.2,A0+120).map((v,i)=>i===1?3:v)]);
    lbl(t3('☀ 21-iyun quyosh chiqishi','☀ Восход 21 июня','☀ Midsummer sunrise'),[u[0]*150,10,u[2]*150]);
    c.anim(t=>{ const k=(t*0.05)%1; c.sun(49.5,-1.5+k*9); });
    return { cam:[-u[0]*38+Math.cos(A)*14,9,-u[2]*38+Math.sin(A)*14], tgt:[u[0]*6,3,u[2]*6], maxDist:400 }; }
});

/* ---------------- El Karakol (Chichen-Itsa) ---------------- */
OM.push({ id:'caracol', cat:'naked', icon:'🐌', flag:'🇲🇽', yearN:906,
  name:t3('El Karakol (Chichen-Itsa)','Эль-Караколь (Чичен-Ица)','El Caracol (Chichén Itzá)'), place:t3('Yukatan, Meksika','Юкатан, Мексика','Yucatán, Mexico'),
  year:t3('~906-yil (mayya)','~906 г. (майя)','~906 AD (Maya)'), coords:t3('20,68° Sh, 88,57° G‘','20,68° с. ш., 88,57° з. д.','20.68° N, 88.57° W'),
  instr:t3('Minora derazalari — Venera yo‘nalishlari','Окна башни — направления на Венеру','Tower windows aligned to Venus'),
  facts:[t3('«Karakol» — ispanchada «shilliqqurt»: minora ichidagi spiral zinapoya shunga o‘xshaydi.','«Караколь» по-испански — «улитка»: так выглядит винтовая лестница внутри башни.','“Caracol” is Spanish for “snail” — named after the spiral staircase inside the tower.'),
    t3('Yuqori xonaning tor derazalari Veneraning ufqdagi eng shimoliy va janubiy nuqtalariga qaratilgan deb hisoblanadi.','Узкие окна верхней комнаты, как считается, указывают на крайние северную и южную точки Венеры на горизонте.','The narrow windows of the upper room are thought to point to Venus’s northernmost and southernmost horizon points.'),
    t3('Mayyalar Venera siklini (584 kun) bir necha soat aniqlik bilan bilgan — bu «Drezden kodeksi»da yozilgan.','Майя знали цикл Венеры (584 дня) с точностью до часов — это записано в «Дрезденском кодексе».','The Maya knew Venus’s 584-day cycle to within hours — it is recorded in the Dresden Codex.')],
  env:{ sky:'day', sunAz:120, sunAlt:48, ground:'grass', size:700, shadow:60, hemiGround:0x405030 },
  build(c){ const {THREE,M,X,mesh,lbl,D2R,rnd}=c;
    const lime=X.blocks('#cdbf9f','rgba(95,80,55,.45)',[6,2],6,4), limeM=M({ map:lime, rough:0.92 }), limeC=M({ map:lime, rough:0.92, clip:true }), limeIn=M({ color:0x9b8e72, rough:0.95, side:THREE.BackSide, clip:true });
    mesh(new THREE.BoxGeometry(52,6,67),limeM,[0,3,0]);
    for(let i=0;i<12;i++) mesh(new THREE.BoxGeometry(2,0.5,12),limeM,[-26-1-i*1.0,6-0.25-i*0.5,8]);
    mesh(new THREE.BoxGeometry(24,4.5,20),limeM,[0,8.25,0]);
    for(let i=0;i<9;i++) mesh(new THREE.BoxGeometry(1.0,0.5,8),limeM,[-12-0.5-i*1.0,10.5-0.25-i*0.5,0]);
    const y0=10.5, wallH=7.2;
    const ring=(r,h,gaps,y,mat)=>{ const n=gaps.length; gaps.forEach((g,i)=>{ const a1=g+0.22, a2=gaps[(i+1)%n]+(i+1===n?Math.PI*2:0)-0.22;
      mesh(new THREE.CylinderGeometry(r,r,h,48,1,true,a1,a2-a1),mat,[0,y+h/2,0]); }); };
    const g4=[0,Math.PI/2,Math.PI,Math.PI*1.5], g4b=g4.map(a=>a+Math.PI/4);
    ring(5.5,wallH,g4,y0,limeC); ring(5.4,wallH,g4,y0,limeIn);
    ring(3.4,wallH,g4b,y0,limeC); ring(3.3,wallH,g4b,y0,limeIn);
    mesh(new THREE.CylinderGeometry(1.2,1.2,wallH+0.5,24),limeC,[0,y0+(wallH+0.5)/2,0]);
    mesh(new THREE.CylinderGeometry(5.8,5.8,0.7,48),limeC,[0,y0+wallH+0.35,0]);
    for(let k=0;k<38;k++){ const a=k*0.36, y=y0+0.2+k*0.19; mesh(new THREE.BoxGeometry(1.5,0.18,0.55),limeC,[Math.sin(a)*2.0,y,Math.cos(a)*2.0],[0,a+Math.PI/2,0]); }
    const yT=y0+wallH+0.7; ring(3.2,3.4,[1.0,1.35,1.75,4.2],yT,limeC);
    mesh(new THREE.SphereGeometry(3.25,32,12,0.6,Math.PI*1.45,0,Math.PI/2),limeC,[0,yT+3.4,0]);
    const trunk=M({ color:0x5a4330, rough:1 }), leaf=M({ color:0x2f6b2c, rough:0.95, flat:true });
    for(let i=0;i<70;i++){ const a=rnd()*Math.PI*2, r=55+rnd()*220, s=0.8+rnd()*0.9; mesh(new THREE.CylinderGeometry(0.3*s,0.4*s,4*s,6),trunk,[Math.cos(a)*r,2*s,Math.sin(a)*r]);
      mesh(new THREE.IcosahedronGeometry(3.2*s,0),leaf,[Math.cos(a)*r,5*s,Math.sin(a)*r]); }
    lbl(t3('Kuzatuv xonasi · Venera derazalari','Комната наблюдений · окна Венеры','Observation room · Venus windows'),[0,yT+7.5,0]);
    lbl(t3('Spiral zinapoya — «shilliqqurt»','Винтовая лестница — «улитка»','Spiral staircase — the “snail”'),[0,y0+4,1.5]);
    lbl(t3('Platforma · 67 × 52 m','Платформа · 67 × 52 м','Platform · 67 × 52 m'),[20,6.5,28]);
    return { cam:[28,22,28], tgt:[0,13,0], maxDist:300, cutAt:0 }; },
  feat:{ cut:true }
});

/* ---------------- Ulug'bek rasadxonasi ---------------- */
OM.push({ id:'ulugbek', cat:'naked', icon:'🏛', flag:'🇺🇿', yearN:1424, link:'ulugbek',
  linkText:t3('To‘liq interaktiv modulni ochish →','Открыть полный интерактивный модуль →','Open the full interactive module →'),
  name:t3('Ulug‘bek rasadxonasi','Обсерватория Улугбека','Ulugh Beg Observatory'), place:t3('Samarqand, O‘zbekiston','Самарканд, Узбекистан','Samarkand, Uzbekistan'),
  year:t3('1424–1429','1424–1429','1424–1429'), coords:t3('39,67° Sh, 66,98° Sh.u.','39,67° с. ш., 66,98° в. д.','39.67° N, 66.98° E'),
  instr:t3('Faxriy sekstanti · R = 40 m','Секстант Фахри · R = 40 м','Fakhri sextant · R = 40 m'),
  facts:[t3('Teleskopsiz davrning eng katta asbobi: 40 metrlik marmar yoy, pastki qismi 11 m yer ostida.','Самый большой инструмент дотелескопной эпохи: 40-метровая мраморная дуга, нижняя часть — на 11 м под землёй.','The largest instrument of the pre-telescope age: a 40-metre marble arc, its lower part 11 m underground.'),
    t3('Yil uzunligini bir daqiqadan kam xato bilan o‘lchagan: 365 k 6 s 10 daq.','Измерил длину года с ошибкой меньше минуты: 365 д 6 ч 10 мин.','Measured the length of the year to within a minute: 365 d 6 h 10 min.'),
    t3('1018 yulduzli «Zij» Yevropada ~200 yil eng aniq katalog bo‘lgan.','«Зидж» с 1018 звёздами ~200 лет был точнейшим каталогом в Европе.','The 1018-star Zij was Europe’s most accurate catalogue for ~200 years.')],
  env:{ sky:'day', sunAz:180, sunAlt:62, ground:'sand', groundColor:'#bfa173', size:700, shadow:60 },
  build(c){ const {THREE,M,mesh,lbl,D2R,tex}=c;
    const fac=tex(1024,384,(x,w,h)=>{ x.fillStyle='#b4895a'; x.fillRect(0,0,w,h); const fh=h/3, n=16, aw=w/n;
      for(let f=0;f<3;f++){ const y0=f*fh; x.fillStyle='#1f6f9c'; x.fillRect(0,y0,w,fh*0.12); x.fillStyle='#38b2c4'; x.fillRect(0,y0+fh*0.12-3,w,3);
        for(let a=0;a<n;a++){ const x0=a*aw+aw*0.18, x1=a*aw+aw*0.82, yt=y0+fh*0.28, yb=y0+fh*0.96, cx=(x0+x1)/2, r=(x1-x0)/2;
          x.fillStyle='#2a7fb0'; x.beginPath(); x.moveTo(x0-5,yb); x.lineTo(x0-5,yt+r); x.quadraticCurveTo(x0-5,yt-8,cx,yt-16); x.quadraticCurveTo(x1+5,yt-8,x1+5,yt+r); x.lineTo(x1+5,yb); x.fill();
          x.fillStyle='#2b2016'; x.beginPath(); x.moveTo(x0,yb); x.lineTo(x0,yt+r); x.quadraticCurveTo(x0,yt,cx,yt-6); x.quadraticCurveTo(x1,yt,x1,yt+r); x.lineTo(x1,yb); x.fill(); } } });
    fac.wrapS=THREE.RepeatWrapping;
    mesh(new THREE.CylinderGeometry(23,23,30,96,1,true),M({ map:fac, rough:0.8, clip:true }),[0,15,0]);
    mesh(new THREE.CylinderGeometry(21.6,21.6,30,96,1,true),M({ color:0xd6c5a4, rough:0.95, side:THREE.BackSide, clip:true }),[0,15,0]);
    mesh(new THREE.TorusGeometry(23.1,0.5,8,96),M({ color:0x2a7fb0, rough:0.5, clip:true }),[0,30,0],[Math.PI/2,0,0]);
    const CY=29.2, CZ=20, R=40.2, P=a=>new THREE.Vector3(0,CY-R*Math.cos(a*D2R),CZ-R*Math.sin(a*D2R));
    class Arc extends THREE.Curve{ constructor(x0){ super(); this.x0=x0; } getPoint(t,tg){ const p=P(43.5+t*28.5); return (tg||new THREE.Vector3()).set(this.x0,p.y,p.z); } }
    const marble=M({ color:0xf3efe4, rough:0.3 }), brick=M({ color:0x8a5e3a, rough:0.9 });
    [-0.95,0.95].forEach(x0=>mesh(new THREE.TubeGeometry(new Arc(x0),80,0.2,8,false),marble));
    for(let a=44;a<=72;a+=2){ const p=P(a); mesh(new THREE.BoxGeometry(2.4,p.y,1.6),brick,[0,p.y/2,p.z]); }
    mesh(new THREE.BoxGeometry(6,0.6,1.4),M({ color:0x9a7a55, rough:0.85 }),[0,CY+1,CZ+0.6]);
    lbl(t3('Faxriy sekstanti · R = 40 m','Секстант Фахри · R = 40 м','Fakhri sextant · R = 40 m'),[0,22,-14]);
    lbl(t3('Bino · Ø 46 m, 3 qavat','Здание · Ø 46 м, 3 этажа','Building · Ø 46 m, 3 storeys'),[0,34,-23]);
    return { cam:[70,42,64], tgt:[0,10,0], maxDist:400, cutAt:0.4 }; },
  feat:{ cut:true }
});

/* ---------------- Uraniborg (Tixo Brage) ---------------- */
OM.push({ id:'uraniborg', cat:'naked', icon:'🏰', flag:'🇩🇰', yearN:1576,
  name:t3('Uraniborg (Tixo Brage)','Ураниборг (Тихо Браге)','Uraniborg (Tycho Brahe)'), place:t3('Ven oroli, Daniya (bugun Shvetsiya)','Остров Вен, Дания (ныне Швеция)','Island of Hven, Denmark (now Sweden)'),
  year:t3('1576–1580','1576–1580','1576–1580'), coords:t3('55,91° Sh, 12,70° Sh.u.','55,91° с. ш., 12,70° в. д.','55.91° N, 12.70° E'),
  instr:t3('Devoriy kvadrant · r ≈ 2 m','Стенной квадрант · r ≈ 2 м','Mural quadrant · r ≈ 2 m'),
  facts:[t3('Tixo Brage teleskopsiz, faqat ko‘z bilan yulduzlarni ~1 yoy daqiqasi aniqlikda o‘lchagan — o‘z davrining eng anig‘i.','Тихо Браге без телескопа, одним глазом, измерял звёзды с точностью ~1 угловой минуты — лучшей для своего времени.','With no telescope, by eye alone, Tycho Brahe measured stars to ~1 arcminute — the best of his time.'),
    t3('Uning Mars kuzatuvlari asosida Kepler sayyoralar orbitasi ellips ekanini isbotlagan.','По его наблюдениям Марса Кеплер доказал, что орбиты планет — эллипсы.','Kepler used his Mars observations to prove that planetary orbits are ellipses.'),
    t3('Minoralarning tomlari kuzatish uchun yechib olinardi. Yonida 1584-yilda yer osti rasadxonasi — Stjerneborg qurilgan.','Крыши башен снимались для наблюдений. Рядом в 1584 г. построили подземную обсерваторию — Стьернеборг.','The tower roofs could be removed for observing. Next to it he built an underground observatory, Stjerneborg, in 1584.')],
  env:{ sky:'day', sunAz:150, sunAlt:34, ground:'grass', size:600, shadow:45, hemiGround:0x3e5030 },
  build(c){ const {THREE,M,X,mesh,lbl,D2R}=c;
    const brickT=X.brick('#a8462f','#d9cdb8',[3,2]), brick=M({ map:brickT, rough:0.85, clip:true, side:THREE.DoubleSide }), white=M({ color:0xece6d8, rough:0.8, clip:true }),
      copper=M({ color:0x5f9e8a, rough:0.55, metal:0.3, clip:true, side:THREE.DoubleSide }), plaster=M({ color:0xe9dcc4, rough:0.95, clip:true, side:THREE.DoubleSide }), brass=M({ color:0xc9a24a, rough:0.3, metal:0.9, clip:true });
    const hedge=M({ color:0x3f6b33, rough:1 }); [[0,-38,76,2],[0,38,76,2],[-38,0,2,76],[38,0,2,76]].forEach(([x,z,w,d])=>mesh(new THREE.BoxGeometry(w,2.2,d),hedge,[x,1.1,z]));
    // asosiy bino: devorlar, qavat, tom
    const W=15, Hh=10;
    [[0,-W/2,W,0.5],[0,W/2,W,0.5],[-W/2,0,0.5,W],[W/2,0,0.5,W]].forEach(([x,z,w,d])=>mesh(new THREE.BoxGeometry(w,Hh,d),brick,[x,Hh/2,z]));
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>mesh(new THREE.BoxGeometry(0.9,Hh,0.9),white,[sx*W/2,Hh/2,sz*W/2]));
    mesh(new THREE.BoxGeometry(W,0.4,W),white,[0,Hh*0.5,0]);
    const roof=mesh(new THREE.ConeGeometry(W*0.74,5,4,1,true),copper,[0,Hh+2.5,0],[0,Math.PI/4,0]);
    mesh(new THREE.CylinderGeometry(2.2,2.4,3.4,8),white,[0,Hh+5.2,0]); mesh(new THREE.SphereGeometry(2.3,24,12,0,Math.PI*2,0,Math.PI/2),copper,[0,Hh+6.9,0]); mesh(new THREE.ConeGeometry(0.35,3,8),copper,[0,Hh+10,0]);
    // ichkarida: devoriy kvadrant (g'arbiy ichki devorda, sharqqa qaragan) va freska
    mesh(new THREE.BoxGeometry(0.3,Hh*0.5-0.4,W-1),plaster,[-2.6,Hh*0.25,0]);
    const qd=new THREE.Group(); qd.position.set(-2.4,0.6,-3.5); c.root.add(qd);
    mesh(new THREE.TorusGeometry(3.6,0.07,8,48,Math.PI/2),brass,[0,0,0],[0,Math.PI/2,0],qd);
    [[0,1],[1,0],[0.7071,0.7071]].forEach(([s,co])=>{ const m=mesh(new THREE.CylinderGeometry(0.035,0.035,3.6,6),brass,null,null,qd); m.position.set(0,co*1.8,-s*1.8); m.rotation.x=-Math.atan2(s,co); });
    mesh(new THREE.SphereGeometry(0.12,12,8),brass,[0,0,0],null,qd);
    // shimoliy va janubiy kuzatuv minoralari, tomlari ikkiga ochiladi
    const roofs=[];
    [-1,1].forEach(s=>{ const z=s*(W/2+3.4); mesh(new THREE.CylinderGeometry(3.5,3.5,Hh+1,32,1,true),brick,[0,(Hh+1)/2,z]); mesh(new THREE.CylinderGeometry(3.5,3.5,0.3,32),white,[0,0.15,z]);
      const halves=[0,1].map(k=>{ const g=new THREE.Group(); g.position.set(0,Hh+1,z); c.root.add(g); mesh(new THREE.ConeGeometry(3.9,4.2,24,1,true,k*Math.PI,Math.PI),copper,[0,2.1,0],null,g); return g; }); roofs.push(halves);
      const arm=new THREE.Group(); arm.position.set(0,Hh+1.6,z); c.root.add(arm);
      [[0,0,0],[Math.PI/2,0,0],[0,0,Math.PI/2],[(90-55.9)*D2R,0,0]].forEach(r=>mesh(new THREE.TorusGeometry(1.4,0.05,8,48),brass,[0,0,0],r,arm));
      mesh(new THREE.CylinderGeometry(0.12,0.2,1.2,8),brass,[0,-0.9,0],null,arm); c.anim(t=>{ arm.rotation.y=t*0.25*s; }); });
    c.onDome(k=>{ roofs.forEach(([a,b])=>{ a.position.x=-k*4.4; b.position.x=k*4.4; }); });
    lbl(t3('Devoriy kvadrant','Стенной квадрант','Mural quadrant'),[-2.4,4.8,-3.5]);
    lbl(t3('Armillyar sfera','Армиллярная сфера','Armillary sphere'),[0,Hh+4.6,W/2+3.4]);
    lbl(t3('Kuzatuv minorasi — tomi yechiladi','Башня — крыша снимается','Observing tower — removable roof'),[0,Hh+6,-(W/2+3.4)]);
    return { cam:[32,18,28], tgt:[0,6,0], maxDist:250, cutAt:0 }; },
  feat:{ cut:true, dome:true }
});

/* ---------------- Jantar Mantar (Jaypur) ---------------- */
OM.push({ id:'jantar', cat:'naked', icon:'☀️', flag:'🇮🇳', yearN:1734,
  name:t3('Jantar Mantar','Джантар-Мантар','Jantar Mantar'), place:t3('Jaypur, Hindiston','Джайпур, Индия','Jaipur, India'),
  year:t3('1728–1734','1728–1734','1728–1734'), coords:t3('26,92° Sh, 75,82° Sh.u.','26,92° с. ш., 75,82° в. д.','26.92° N, 75.82° E'),
  instr:t3('Samrat Yantra — 27 metrlik quyosh soati','Самрат-янтра — солнечные часы высотой 27 м','Samrat Yantra — a 27-metre sundial'),
  facts:[t3('Samrat Yantra — dunyodagi eng katta quyosh soati: uchburchak devor (gnomon) 27 m baland, qiyaligi 27° — Jaypur kengligi, shuning uchun u Qutb yulduziga qaraydi.','Самрат-янтра — крупнейшие солнечные часы мира: треугольная стена (гномон) высотой 27 м наклонена на 27° — широту Джайпура, поэтому смотрит на Полярную звезду.','Samrat Yantra is the world’s largest sundial: its triangular wall (gnomon) is 27 m high and slopes at 27° — Jaipur’s latitude — so it points at the Pole Star.'),
    t3('Soya kvadrant bo‘ylab soniyasiga ~1 mm suriladi — vaqtni 2 soniya aniqlikda o‘qish mumkin.','Тень ползёт по квадранту ~1 мм в секунду — время читается с точностью до 2 секунд.','The shadow creeps across the quadrant ~1 mm per second — time can be read to 2 seconds.'),
    t3('Maharaja Savay Jay Singh II qurdirgan 19 ta asbobdan iborat; 2010-yildan YUNESKO merosi. Jay Singh Ulug‘bek «Zij»ini o‘rgangan.','Построен махараджей Савай Джай Сингхом II, 19 инструментов; с 2010 г. — наследие ЮНЕСКО. Джай Сингх изучал «Зидж» Улугбека.','Built by Maharaja Sawai Jai Singh II with 19 instruments; a UNESCO site since 2010. Jai Singh studied Ulugh Beg’s Zij.')],
  env:{ sky:'day', sunAz:100, sunAlt:30, ground:'sand', groundColor:'#d2b088', size:600, shadow:55 },
  build(c){ const {THREE,M,X,mesh,lbl,D2R,tex}=c, phi=26.9*D2R, H=27, B=H/Math.tan(phi);
    const ochre=M({ map:X.noise('#e3a77a',0.12,[4,4]), rough:0.9 }), marble=M({ color:0xf4efe6, rough:0.4, side:THREE.DoubleSide });
    // gnomon (yon tomondan uchburchak), shimolga ko'tariladi
    const sh=new THREE.Shape(); sh.moveTo(B/2,0); sh.lineTo(-B/2,0); sh.lineTo(-B/2,H); sh.closePath();
    const gg=new THREE.ExtrudeGeometry(sh,{ depth:3, bevelEnabled:false }); gg.rotateY(-Math.PI/2); gg.translate(1.5,0,0); mesh(gg,ochre);
    for(let i=0;i<54;i++){ const f=(i+0.5)/54, z=B/2-f*B, y=f*H; mesh(new THREE.BoxGeometry(3.05,0.35,B/54+0.02),marble,[0,y+0.1,z]); }
    // kvadrantlar: ekvator tekisligida, gnomon o'qi atrofida (sharq va g'arb)
    const a=new THREE.Vector3(0,Math.sin(phi),-Math.cos(phi)), perp=new THREE.Vector3(0,-Math.cos(phi),-Math.sin(phi)), e=new THREE.Vector3(1,0,0), C=new THREE.Vector3(0,H/2,0), R=15;
    const scaleT=tex(1024,64,(x,w,h)=>{ x.fillStyle='#f3eee3'; x.fillRect(0,0,w,h); for(let i=0;i<=90;i++){ const xx=i/90*w; x.fillStyle='#5b3b22'; x.fillRect(xx-(i%15?0.5:1.5),0,i%15?1:3,i%5?h*0.35:h*0.7); } });
    const basis=new THREE.Matrix4().makeBasis(e,a,perp.clone().negate()), q=new THREE.Quaternion().setFromRotationMatrix(basis);
    [[Math.PI/2],[Math.PI]].forEach(([ts])=>{ const m=mesh(new THREE.CylinderGeometry(R,R,5,64,1,true,ts,Math.PI/2),M({ map:scaleT, rough:0.4, side:THREE.DoubleSide }),null,null); m.position.copy(C); m.quaternion.copy(q);
      // yoy ostidagi g'isht tana — zich ustunlar bilan uzluksiz devor
      for(let k=1;k<36;k++){ const th=ts+k/36*Math.PI/2, p=C.clone().addScaledVector(e,R*Math.sin(th)).addScaledVector(perp.clone().negate(),R*Math.cos(th)); if(p.y<0.3) continue;
        const b=mesh(new THREE.BoxGeometry(1.0,p.y-0.15,4.6),ochre,[p.x*0.985,(p.y-0.15)/2,p.z]); b.rotation.y=Math.atan2(p.x,-p.z)*0+0; } });
    // Jay Prakash: ikki yarim shar kosa (ichi ko'rinadi)
    [[30,8],[30,-6]].forEach(([x,z])=>{ const r=4.25, ph=4.4;
      [[0,-r-0.2,9.2,0.4],[0,r+0.2,9.2,0.4],[-r-0.2,0,0.4,9.2],[r+0.2,0,0.4,9.2]].forEach(([dx,dz,w,d])=>mesh(new THREE.BoxGeometry(w,ph,d),ochre,[x+dx,ph/2,z+dz]));
      mesh(new THREE.SphereGeometry(r,48,16,0,Math.PI*2,Math.PI/2,Math.PI/2),marble,[x,ph,z]);
      mesh(new THREE.TorusGeometry(r,0.12,8,48),M({ color:0xb08d4a, metal:0.8, rough:0.3 }),[x,ph,z],[Math.PI/2,0,0]);
      [0,Math.PI/2].forEach(rr=>mesh(new THREE.CylinderGeometry(0.02,0.02,2*r,4),M({ color:0x333333 }),[x,ph+0.02,z],[Math.PI/2,0,rr])); });
    // Quyosh kun bo'yi harakatlanadi (tengkunlik), gnomon soyasi kvadrantda yuradi
    c.anim(t=>{ const H0=((t*0.06)%1)*150-75, Hh=H0*D2R, d=0, la=phi; const sinh=Math.sin(la)*Math.sin(d)+Math.cos(la)*Math.cos(d)*Math.cos(Hh);
      const east=-Math.cos(d)*Math.sin(Hh), north=Math.cos(la)*Math.sin(d)-Math.sin(la)*Math.cos(d)*Math.cos(Hh);
      c.sun(Math.atan2(east,north)/D2R,Math.asin(sinh)/D2R); });
    lbl(t3('Gnomon · 27 m — Qutb yulduziga qaragan','Гномон · 27 м — смотрит на Полярную','Gnomon · 27 m — aimed at the Pole Star'),[0,H+2,-B/2]);
    lbl(t3('Kvadrant — soya vaqtni ko‘rsatadi','Квадрант — тень показывает время','Quadrant — the shadow tells the time'),[R*0.8,H*0.45,0]);
    lbl(t3('Jay Prakash kosalari','Чаши Джай Пракаш','Jai Prakash bowls'),[30,6.5,1]);
    return { cam:[34,24,58], tgt:[2,9,-4], maxDist:300 }; },
  feat:{}
});

/* ---------------- Grinvich ---------------- */
OM.push({ id:'greenwich', cat:'classic', icon:'🕰', flag:'🇬🇧', yearN:1675,
  name:t3('Grinvich qirollik rasadxonasi','Королевская Гринвичская обсерватория','Royal Observatory Greenwich'), place:t3('London, Angliya','Лондон, Англия','London, England'),
  year:t3('1675','1675','1675'), coords:t3('51,48° Sh, 0° (Bosh meridian)','51,48° с. ш., 0° (нулевой меридиан)','51.48° N, 0° (Prime Meridian)'),
  instr:t3('Buyuk ekvatorial teleskop · 71 sm','Большой экваториальный телескоп · 71 см','Great Equatorial Telescope · 71 cm'),
  facts:[t3('1884-yilda Grinvichdan o‘tgan chiziq butun dunyo uchun 0° — Bosh meridian deb qabul qilingan; dunyo vaqti (GMT) ham shu yerdan hisoblanadi.','В 1884 г. линия через Гринвич принята за 0° — нулевой меридиан; отсюда же ведётся мировое время (GMT).','In 1884 the line through Greenwich became 0° — the Prime Meridian; world time (GMT) is counted from here too.'),
    t3('Qizil «vaqt shari» 1833-yildan beri har kuni soat 13:00 da tushadi — Temza daryosidagi kemalar soatini shunga to‘g‘rilagan.','Красный «шар времени» с 1833 г. каждый день падает ровно в 13:00 — по нему моряки на Темзе сверяли хронометры.','The red “time ball” has dropped at exactly 13:00 every day since 1833 — sailors on the Thames set their clocks by it.'),
    t3('Asosiy binoni — Flemstid uyini Kristofer Ren loyihalagan. Piyozsimon gumbaz ostida Britaniyadagi eng katta refraktor (71 sm) turibdi.','Главное здание — Дом Флемстида — спроектировал Кристофер Рен. Под луковичным куполом — крупнейший рефрактор Британии (71 см).','Christopher Wren designed the main building, Flamsteed House. The onion dome houses Britain’s largest refractor (71 cm).')],
  env:{ sky:'day', sunAz:205, sunAlt:36, ground:'grass', size:600, shadow:45, hemiGround:0x3e5030 },
  build(c){ const {THREE,M,X,mesh,lbl}=c;
    const brick=M({ map:X.brick('#9c3f2e','#d8cbb2',[4,2]), rough:0.85, clip:true }), stone=M({ color:0xece4d4, rough:0.8, clip:true }), slate=M({ color:0x3c4048, rough:0.7, clip:true, side:THREE.DoubleSide });
    // Flemstid uyi
    mesh(new THREE.BoxGeometry(18,9,8),brick,[0,4.5,-8]);
    [[-9,-4],[9,-4],[-9,-12],[9,-12]].forEach(([x,z])=>mesh(new THREE.BoxGeometry(0.8,9.2,0.8),stone,[x,4.6,z]));
    const roof=new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-4.2,0),new THREE.Vector2(4.2,0),new THREE.Vector2(0,2.6)]),{ depth:18.4, bevelEnabled:false }); roof.translate(0,0,-9.2); roof.rotateY(Math.PI/2);
    mesh(roof,slate,[0,9,-8]);
    mesh(new THREE.CylinderGeometry(4.2,4.2,5.4,8),brick,[0,11.6,-8],[0,Math.PI/8,0]); mesh(new THREE.ConeGeometry(4.6,2.2,8),slate,[0,15.4,-8],[0,Math.PI/8,0]);
    [-7,7].forEach(x=>{ mesh(new THREE.CylinderGeometry(1,1,3,12),stone,[x,10.5,-8]); mesh(new THREE.SphereGeometry(1.05,16,8,0,Math.PI*2,0,Math.PI/2),M({ color:0x2e5e52, rough:0.5, clip:true }),[x,12,-8]); });
    // vaqt shari
    mesh(new THREE.CylinderGeometry(0.12,0.12,7,8),stone,[0,19.8,-8]);
    const ball=mesh(new THREE.SphereGeometry(0.85,24,16),M({ color:0xc8102e, rough:0.4, emissive:0x400000, ei:0.4 }),[0,22.5,-8]);
    c.anim(t=>{ const k=(t%14)/14; ball.position.y=k<0.75?17.6+Math.min(1,k/0.4)*4.9:22.5-((k-0.75)/0.25)*4.9; });
    // Bosh meridian chizig'i (x = 0)
    mesh(new THREE.BoxGeometry(0.22,0.04,90),M({ color:0xc9ccd2, metal:0.9, rough:0.25, emissive:0x113322, ei:0.6 }),[0,0.03,15],null,null,true);
    // Buyuk ekvatorial bino va piyozsimon gumbaz
    const bx=19, bz=9, r=5, h=7;
    mesh(new THREE.CylinderGeometry(r,r,h,48,1,true),brick,[bx,h/2,bz]); mesh(new THREE.CylinderGeometry(r*0.96,r*0.96,h,48,1,true),M({ color:0x6f5a48, rough:0.95, side:THREE.BackSide, clip:true }),[bx,h/2,bz]);
    mesh(new THREE.CylinderGeometry(r,r,0.3,48),M({ color:0x5a4a3c, clip:true }),[bx,h,bz]);
    const pts=[]; for(let i=0;i<=24;i++){ const t=i/24, y=t*7.5, rr=r*(t<0.45?1+0.22*Math.sin(t/0.45*Math.PI/2):1.22*Math.cos((t-0.45)/0.55*Math.PI/2)); pts.push(new THREE.Vector2(Math.max(0.02,rr),y)); }
    pts.push(new THREE.Vector2(0.02,8.6));
    const sh=0.26, onion=M({ color:0x3f2e22, rough:0.55, metal:0.2, clip:true, side:THREE.DoubleSide });
    const dome=new THREE.Group(); dome.position.set(bx,h+0.15,bz); c.root.add(dome); dome.rotation.y=Math.PI*0.7;
    mesh(new THREE.LatheGeometry(pts,48,sh,Math.PI*2-2*sh),onion,null,null,dome); const shut=new THREE.Group(); dome.add(shut);
    mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p.x*1.02,p.y)),12,-sh,2*sh),onion,null,null,shut);
    c.onDome(k=>{ shut.rotation.y=k*(2*sh+0.15); });
    const ref=c.refractor({ L:7, D:0.6, lat:51.5, pier:2.6, color:0x2b3a52, ha:0.9, decl:0.55 }); ref.position.set(bx,0.3,bz); c.root.add(ref);
    lbl(t3('Flemstid uyi (Kristofer Ren)','Дом Флемстида (Кристофер Рен)','Flamsteed House (Christopher Wren)'),[0,17,-8]);
    lbl(t3('Vaqt shari — har kuni 13:00 da tushadi','Шар времени — падает в 13:00','Time ball — drops at 13:00'),[0,24.5,-8]);
    lbl(t3('0° — Bosh meridian','0° — нулевой меридиан','0° — Prime Meridian'),[0,1,32]);
    lbl(t3('Buyuk ekvatorial teleskop · 71 sm','Большой экваториальный · 71 см','Great Equatorial · 71 cm'),[bx,h+10,bz]);
    return { cam:[52,18,-22], tgt:[8,5,-1], maxDist:260, cutAt:bx }; },
  feat:{ cut:true, dome:true }
});

/* ---------------- Pulkovo ---------------- */
OM.push({ id:'pulkovo', cat:'classic', icon:'🏛', flag:'🇷🇺', yearN:1839,
  name:t3('Pulkovo rasadxonasi','Пулковская обсерватория','Pulkovo Observatory'), place:t3('Sankt-Peterburg, Rossiya','Санкт-Петербург, Россия','St Petersburg, Russia'),
  year:t3('1839','1839','1839'), coords:t3('59,77° Sh, 30,33° Sh.u.','59,77° с. ш., 30,33° в. д.','59.77° N, 30.33° E'),
  instr:t3('76 sm refraktor (1885)','76-см рефрактор (1885)','76 cm refractor (1885)'),
  facts:[t3('XIX asrda «dunyoning astronomik poytaxti» deb atalgan; asoschisi — Fridrix Georg Vilgelm Struve.','В XIX веке её называли «астрономической столицей мира»; основатель — Василий (Фридрих Георг Вильгельм) Струве.','In the 19th century it was called the “astronomical capital of the world”; founded by F. G. W. Struve.'),
    t3('1885-yilda o‘rnatilgan 76 sm refraktor o‘sha paytda dunyodagi eng katta teleskop bo‘lgan.','76-см рефрактор 1885 года был тогда крупнейшим телескопом в мире.','Its 76 cm refractor of 1885 was then the largest telescope in the world.'),
    t3('Ikkinchi jahon urushida deyarli butunlay vayron bo‘lgan va 1954-yilda qayta tiklangan.','Во время Второй мировой войны почти полностью разрушена и восстановлена к 1954 году.','Almost entirely destroyed in the Second World War and rebuilt by 1954.')],
  env:{ sky:'day', sunAz:170, sunAlt:28, ground:'grass', size:600, shadow:55, hemiGround:0x3e5030 },
  build(c){ const {THREE,M,mesh,lbl}=c;
    const wall=M({ color:0xf0e2bf, rough:0.85, clip:true }), white=M({ color:0xf7f4ee, rough:0.75, clip:true }), roofM=M({ color:0x6d7a74, rough:0.7, clip:true }), inner=M({ color:0x8c8070, rough:0.95, side:THREE.BackSide, clip:true });
    const block=(w,h,d,x,z)=>{ [[0,-d/2,w,0.6],[0,d/2,w,0.6],[-w/2,0,0.6,d],[w/2,0,0.6,d]].forEach(([dx,dz,ww,dd])=>mesh(new THREE.BoxGeometry(ww,h,dd),wall,[x+dx,h/2,z+dz])); mesh(new THREE.BoxGeometry(w,0.5,d),roofM,[x,h+0.25,z]); };
    block(30,10,14,0,0); block(16,8,12,-24,0); block(16,8,12,24,0);
    for(let i=0;i<8;i++) mesh(new THREE.CylinderGeometry(0.5,0.55,9,16),white,[-7+i*2,4.5,8.2]);
    const ped=new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-9,0),new THREE.Vector2(9,0),new THREE.Vector2(0,3)]),{ depth:1.2, bevelEnabled:false }); mesh(ped,white,[0,9.4,7.6]);
    mesh(new THREE.BoxGeometry(18,0.6,2),white,[0,9.2,8.2]);
    const main=c.domeHouse({ r:6.5, h:5, wall:0xf0e2bf, dome:0xb8c2cc, inner:0x8c8070 }); main.position.set(0,10,0); c.root.add(main); main.userData.dome.rotation.y=Math.PI*0.6;
    [-10,10].forEach(x=>{ const d=c.domeHouse({ r:3.6, h:3.5, wall:0xf0e2bf, dome:0xb8c2cc }); d.position.set(x,10,0); c.root.add(d); c.onDome(k=>d.userData.setOpen(k)); });
    c.onDome(k=>main.userData.setOpen(k));
    mesh(new THREE.BoxGeometry(29,0.4,13),M({ color:0x7a6e60, clip:true }),[0,5,0]);
    const ref=c.refractor({ L:10, D:0.76, lat:59.8, pier:4, color:0x2b3d33, ha:0.7, decl:0.6 }); ref.position.set(0,10.3,0); c.root.add(ref);
    lbl(t3('76 sm refraktor (1885 — dunyoda eng katta)','76-см рефрактор (1885 — крупнейший в мире)','76 cm refractor (1885 — world’s largest)'),[0,24,0]);
    lbl(t3('«Dunyoning astronomik poytaxti»','«Астрономическая столица мира»','“Astronomical capital of the world”'),[0,14,9]);
    return { cam:[40,24,46], tgt:[0,8,0], maxDist:260, cutAt:0, cutN:[0,0,-1] }; },
  feat:{ cut:true, dome:true }
});
})();
