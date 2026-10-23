/* Astronomik asboblar — 3D modellar (1-qism): qadimgi dunyo va o'rta asrlar.
   Har bir model: matnlar (uz/ru/en), vazifalari (use — filtr uchun), muhit (env) va build(ctx). ctx — labs/observatories.js dvigateli
   (+ play() — "Ishlatib ko'rish" holati, img(url) — rasm teksturasi). O'lchamlar metrda, muzey nusxalari asosida.
   INS_KIT — ikkala model fayli uchun umumiy yordamchilar (guruch materiallari, gravyurali shkalalar, tishli g'ildirak va h.k.). */
(function(){
'use strict';
const IM=window.INS_MODELS=window.INS_MODELS||[];
const t3=(uz,ru,en)=>({uz,ru,en});
const D=Math.PI/180;

const K=window.INS_KIT={
  t3,
  // ikki nuqta orasidagi tayoq/sim
  bar(c,p1,p2,r,mat,parent,seg){ const THREE=c.THREE, a=new THREE.Vector3(p1[0],p1[1],p1[2]), b=new THREE.Vector3(p2[0],p2[1],p2[2]);
    const m=c.mesh(new THREE.CylinderGeometry(r,r,a.distanceTo(b),seg||10),mat,null,null,parent); m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize()); return m; },
  ext(c,shape,depth,mat,pos,rot,parent,bev,cs){ return c.mesh(new c.THREE.ExtrudeGeometry(shape,{ depth, bevelEnabled:!!bev, bevelThickness:bev||0, bevelSize:bev||0, bevelSegments:2, curveSegments:cs||48 }),mat,pos,rot,parent); },
  // ExtrudeGeometry/ShapeGeometry UV = shape koordinatalari (metr): teksturani [x0..x0+w]×[y0..y0+w] kvadratiga moslash
  fit(t,x0,y0,w){ t.repeat.set(1/w,1/w); t.offset.set(-x0/w,-y0/w); return t; },
  lathe(c,pts,mat,pos,parent,seg){ return c.mesh(new c.THREE.LatheGeometry(pts.map(p=>new c.THREE.Vector2(p[0],p[1])),seg||64),mat,pos,null,parent); },
  annulus(c,ro,ri,a0,a1){ const THREE=c.THREE, s=new THREE.Shape();
    if(a0==null){ s.absarc(0,0,ro,0,Math.PI*2,false); const h=new THREE.Path(); h.absarc(0,0,ri,0,Math.PI*2,true); s.holes.push(h); return s; }
    s.moveTo(Math.cos(a0)*ro,Math.sin(a0)*ro); s.absarc(0,0,ro,a0,a1,false); s.lineTo(Math.cos(a1)*ri,Math.sin(a1)*ri); s.absarc(0,0,ri,a1,a0,true); s.closePath(); return s; },
  // tishli g'ildirak: r — tish asosi radiusi, n — tishlar, spokes — kegaylar soni (teshiklar bilan)
  gear(c,r,n,th,mat,pos,parent,spokes){ const THREE=c.THREE, s=new THREE.Shape(), h=r*0.07+0.0012;
    for(let i=0;i<n;i++){ const a=i/n*Math.PI*2, b=(i+0.5)/n*Math.PI*2; const f=i?'lineTo':'moveTo'; s[f](Math.cos(a)*r,Math.sin(a)*r); s.lineTo(Math.cos(b)*(r+h),Math.sin(b)*(r+h)); } s.closePath();
    if(spokes&&r>0.022){ const k=spokes, w=0.16; for(let i=0;i<k;i++){ const a0=i/k*Math.PI*2+w, a1=(i+1)/k*Math.PI*2-w, p=new THREE.Path();
      p.moveTo(Math.cos(a0)*r*0.28,Math.sin(a0)*r*0.28); p.absarc(0,0,r*0.28,a0,a1,false); p.lineTo(Math.cos(a1)*r*0.8,Math.sin(a1)*r*0.8); p.absarc(0,0,r*0.8,a1,a0,true); s.holes.push(p); } }
    const hole=new THREE.Path(); hole.absarc(0,0,Math.min(0.003,r*0.15),0,Math.PI*2,true); s.holes.push(hole);
    return K.ext(c,s,th,mat,pos,null,parent,0,6); },
  // materiallar
  brass(c,o){ return c.M(Object.assign({ map:c.X.metal('#b8914f','#4f6a4c'), metal:0.95, rough:0.3, env:1.3, bump:0.02 },o||{})); },
  bronze(c,o){ return c.M(Object.assign({ map:c.X.metal('#a7743a','#3d6b55'), metal:0.9, rough:0.4, env:1.1, bump:0.03 },o||{})); },
  steel(c,o){ return c.M(Object.assign({ map:c.X.metal('#9aa2ab'), metal:0.95, rough:0.32, env:1.2, bump:0.02 },o||{})); },
  wood(c,col,o){ return c.M(Object.assign({ map:c.X.wood(col||'#6b3f22'), rough:0.5, env:0.7, bump:0.12 },o||{})); },
  glass(c,o){ return c.M(Object.assign({ clean:true, color:0xcfe6ff, rough:0.04, metal:0.1, transparent:true, opacity:0.32, env:1.6 },o||{})); },
  // guruch asosidagi gravyurali shkala (relyef ham — chiziqlar botiq ko'rinadi)
  plate(c,size,col,draw){ return c.texB(size,size,(x,w,h)=>{ const b=c.rgb(col||'#c09a58'); c.paint(x,w,[[0,...c.shade(b,0.8)],[0.5,...b],[1,...c.shade(b,1.12)]],{ oct:5, persist:0.5, speck:8 });
    x.strokeStyle='rgba(45,28,10,.9)'; x.fillStyle='rgba(45,28,10,.95)'; x.lineCap='round'; draw(x,w,h); }); },
  // aylanma shkala: markaz (cx,cy), radiuslar piksellarda, n bo'linma; long(i) — uzun chiziq; lab(i) — yozuv
  scale(x,cx,cy,r0,r1,n,o){ o=o||{}; const a0=o.a0||0, a1=o.a1!=null?o.a1:Math.PI*2;
    for(let i=0;i<=n;i++){ if(a1-a0>=Math.PI*2-1e-6&&i===n) break; const a=a0+(a1-a0)*i/n, L=o.long&&o.long(i)?1:o.mid&&o.mid(i)?0.6:0.35;
      x.lineWidth=L>0.9?2.2:1.2; x.beginPath(); x.moveTo(cx+Math.cos(a)*r0,cy-Math.sin(a)*r0); x.lineTo(cx+Math.cos(a)*(r0+(r1-r0)*L),cy-Math.sin(a)*(r0+(r1-r0)*L)); x.stroke();
      if(o.lab){ const t=o.lab(i); if(t!=null){ const rr=o.lr||(r1+(o.lgap||14)); x.save(); x.translate(cx+Math.cos(a)*rr,cy-Math.sin(a)*rr); x.rotate(-a+Math.PI/2+(o.flip?Math.PI:0)); x.textAlign='center'; x.textBaseline='middle'; x.font=o.font||'bold 22px serif'; x.fillText(t,0,0); x.restore(); } } } },
  ring(x,cx,cy,r,lw){ x.lineWidth=lw||2; x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.stroke(); },
  // o'zgaruvchan yozuv (masalan, burchak qiymati) uchun belgi havolasi
  lblRef(c,text,pos){ c.lbl(text,pos); const E=window.OBS_ENGINE.E; return E.labels[E.labels.length-1]; },
  T:o=>{ const l=document.documentElement.lang; return o[l]||o.uz; },
  // Quyosh holati: kenglik, og'ish va soat burchagi (gradus) → azimut (shimoldan sharqqa) va balandlik
  sunPos(lat,dec,H){ const f=lat*D, d=dec*D, h=H*D, e=-Math.cos(d)*Math.sin(h), n=Math.sin(d)*Math.cos(f)-Math.cos(d)*Math.cos(h)*Math.sin(f), u=Math.sin(d)*Math.sin(f)+Math.cos(d)*Math.cos(h)*Math.cos(f);
    return { az:(Math.atan2(e,n)/D+360)%360, alt:Math.asin(u)/D }; },
};
const arabic=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);

/* ---------------- Gnomon ---------------- */
IM.push({ id:'gnomon', use:['time','angle'], icon:'📏', yearN:-2500,
  name:t3('Gnomon','Гномон','Gnomon'), year:t3('mil. avv. III ming yillik','III тыс. до н. э.','3rd millennium BC'),
  who:t3('Qadimgi Misr, Bobil, Xitoy; Guo Shoujing (1276)','Древний Египет, Вавилон, Китай; Го Шоуцзин (1276)','Ancient Egypt, Babylon, China; Guo Shoujing (1276)'),
  size:t3('Model: 3,5 m ustun, 8 m shkala','Модель: столб 3,5 м, шкала 8 м','Model: 3.5 m post, 8 m scale'),
  short:t3('Tik ustun soyasi bo‘yicha peshin, fasl va kenglikni aniqlaydi','По тени вертикального столба определяет полдень, сезон и широту','Finds noon, the season and latitude from a post’s shadow'),
  about:t3('Gnomon — eng qadimgi astronomik asbob: yerga tik o‘rnatilgan ustun va uning soyasi tushadigan tekis shkala. Soya yo‘nalishi va uzunligiga qarab Quyoshning osmondagi o‘rni aniqlanadi. Undan quyosh soatlari, kalendarlar va hatto Yerning o‘lchami kelib chiqqan.',
    'Гномон — древнейший астрономический инструмент: вертикальный столб и ровная шкала, на которую падает его тень. По направлению и длине тени определяют положение Солнца. Из него выросли солнечные часы, календари и даже измерение размеров Земли.',
    'The gnomon is the oldest astronomical instrument: an upright post and a level scale that catches its shadow. The shadow’s direction and length reveal the Sun’s position. Sundials, calendars and even the size of the Earth all grew out of it.'),
  tasks:[t3('Mahalliy peshinni aniqlash — soya eng qisqa bo‘lgan payt','Определять местный полдень — момент самой короткой тени','Find local noon — the moment of the shortest shadow'),
    t3('Quyosh turishi va kun-tun tengligi kunlarini, yil uzunligini o‘lchash','Измерять дни солнцестояний и равноденствий, длину года','Measure solstices, equinoxes and the length of the year'),
    t3('Joyning geografik kengligi va Yer o‘qi og‘ishini hisoblash','Вычислять широту места и наклон земной оси','Work out latitude and the tilt of Earth’s axis'),
    t3('Shimol–janub (meridian) yo‘nalishini topish','Находить направление север–юг (меридиан)','Find the north–south line (meridian)')],
  how:[t3('Ustun aniq tik qilib o‘rnatiladi, uning shimol tomoniga tekis tosh shkala yotqiziladi.','Столб ставят строго вертикально, к северу от него кладут ровную каменную шкалу.','The post is set exactly upright and a level stone scale is laid to its north.'),
    t3('Quyosh ko‘tarilgan sari soya qisqaradi. Eng qisqa soya — mahalliy peshin: shu payt u aniq shimolga qaraydi.','Чем выше Солнце, тем короче тень. Самая короткая тень — местный полдень: она смотрит точно на север.','As the Sun climbs, the shadow shortens. The shortest shadow marks local noon and points due north.'),
    t3('Peshindagi soya yil davomida o‘zgaradi: yozgi quyosh turishida eng qisqa, qishkida eng uzun bo‘ladi. «Ishlatib ko‘rish» tugmasi bir yilni ko‘rsatadi.','Полуденная тень меняется в течение года: самая короткая в летнее солнцестояние, самая длинная — в зимнее. Кнопка «Показать в работе» прокручивает год.','The noon shadow changes through the year: shortest at the summer solstice, longest at the winter one. “See it work” runs through a year.'),
    t3('Ustun balandligi H va soya uzunligi L dan Quyosh balandligi topiladi: tg h = H / L. Bundan kenglik va Yer o‘qi og‘ishi hisoblanadi.','По высоте столба H и длине тени L находят высоту Солнца: tg h = H / L. Отсюда вычисляют широту и наклон оси.','From the post height H and shadow length L comes the Sun’s altitude: tan h = H / L — and from that latitude and axial tilt.')],
  parts:[[t3('Gnomon ustuni','Столб гномона','Gnomon post'),t3('Tik tosh ustun; uchi soyaning aniq nuqtasini beradi.','Вертикальный каменный столб; его вершина даёт точку тени.','Upright stone post; its tip casts the measured point.')],
    [t3('Soya shkalasi','Теневая шкала','Shadow scale'),t3('Shimolga yotqizilgan tosh, har 10 sm da belgi — soya uzunligi o‘qiladi.','Камень, уложенный к северу, деления через 10 см — читается длина тени.','Stone laid to the north, marked every 10 cm to read the shadow’s length.')],
    [t3('Fasl belgilari','Отметки сезонов','Season marks'),t3('Yozgi va qishki quyosh turishi, kun-tun tengligi kunlaridagi peshin soyasi uchlari.','Концы полуденной тени в солнцестояния и равноденствия.','Where the noon shadow ends at the solstices and equinoxes.')],
    [t3('Tosh supa','Каменная платформа','Stone platform'),t3('Tekislangan asos — ustun tikligi va shkala gorizontalligi uchun.','Выровненное основание — для вертикальности столба и горизонтальности шкалы.','Levelled base keeping the post upright and the scale horizontal.')]],
  facts:[t3('Eratosfen mil. avv. ~240-yilda Asvan va Iskandariyadagi peshin soyalarini taqqoslab, Yer aylanasini ~40 000 km deb hisoblagan.','Эратосфен около 240 г. до н. э., сравнив полуденные тени в Асуане и Александрии, вычислил окружность Земли ~40 000 км.','Around 240 BC Eratosthenes compared noon shadows in Syene and Alexandria and found Earth’s circumference ≈40,000 km.'),
    t3('Guo Shoujing 1276-yilda Gaochengda balandligi ~12 m bo‘lgan gnomon qurdirgan: ustun qancha baland bo‘lsa, o‘lchov xatosi shuncha kam.','Го Шоуцзин в 1276 г. построил в Гаочэне гномон высотой ~12 м: чем выше столб, тем меньше ошибка.','In 1276 Guo Shoujing built a ~12 m gnomon at Gaocheng: the taller the post, the smaller the error.'),
    t3('Rimga keltirilgan Misr obeliski Avgust davrida ulkan quyosh soatining ko‘rsatkichi bo‘lib xizmat qilgan.','Египетский обелиск, привезённый в Рим, при Августе служил указателем огромных солнечных часов.','An Egyptian obelisk brought to Rome served as the pointer of a huge sundial under Augustus.')],
  env:{ sky:'day', sunAz:180, sunAlt:49, ground:'grass', size:160, shadow:10, nb:0.01, hemiGround:0x3a4a2a },
  feat:{ play:true },
  build(c){ const {THREE,M,X,mesh,lbl,anim,sun}=c, P=this.parts, LAT=41.3, H=3.5;
    const blocks=M({ map:X.blocks('#cbbd9c','rgba(70,60,45,.5)',[3,3],6,6), rough:0.9, bump:0.5 }), stone=M({ map:X.noise('#b7a98b',0.2,[1,3]), rough:0.85, bump:0.6 });
    mesh(new THREE.CylinderGeometry(2.4,2.6,0.4,64),blocks,[0,0.2,0]);
    mesh(new THREE.BoxGeometry(0.75,0.12,0.75),stone,[0,0.46,0]);
    mesh(new THREE.CylinderGeometry(0.17,0.32,H-0.12,4,1),stone,[0,0.52+(H-0.12)/2,0],[0,Math.PI/4,0]);
    mesh(new THREE.ConeGeometry(0.17,0.24,4),M({ clean:true, color:0xc9a24a, metal:0.9, rough:0.3, env:1.2 }),[0,0.4+H+0.1-0.02,0],[0,Math.PI/4,0]);
    // shimolga cho'zilgan shkala (z<0): yuqori yuzasida gravyurali o'lchov chiziqlari
    const Ls=8, z0=0.3, sc=mesh(new THREE.BoxGeometry(0.6,0.4,Ls),blocks,[0,0.2,-z0-Ls/2]);
    const tt=c.tex(128,2048,(x,w,h)=>{ const b=c.rgb('#e8e0cf'); c.paint(x,128,[[0,...c.shade(b,0.85)],[1,...b]],{ oct:5, speck:14 }); x.drawImage(x.canvas,0,0,128,128,0,0,w,h);
      const Y=d=>(1-(d-z0)/Ls)*h; x.strokeStyle='rgba(60,40,20,.85)'; x.fillStyle='rgba(60,40,20,.9)'; x.font='bold 30px serif'; x.textAlign='left';
      for(let k=1;k*0.1<=Ls+z0;k++){ const d=k*0.1; if(d<z0) continue; const big=k%10===0; x.lineWidth=big?3:1.4; x.beginPath(); x.moveTo(big?8:30,Y(d)); x.lineTo(big?w-8:w-30,Y(d)); x.stroke(); if(big) x.fillText((d|0)+' m',10,Y(d)-6); }
      x.strokeStyle='rgba(120,90,40,.6)'; x.lineWidth=2; x.beginPath(); x.moveTo(w/2,0); x.lineTo(w/2,h); x.stroke();
      [90-LAT+23.44,90-LAT,90-LAT-23.44].forEach(alt=>{ const d=H/Math.tan(alt*Math.PI/180); x.fillStyle='rgba(150,40,20,.9)'; x.fillRect(4,Y(d)-5,w-8,10); }); });
    mesh(new THREE.PlaneGeometry(0.6,Ls).rotateX(-Math.PI/2),M({ map:tt, rough:0.7, bump:0 }),[0,0.402,-z0-Ls/2]);
    lbl(P[0][0],[0,H+0.9,0]); lbl(P[1][0],[0.3,0.9,-z0-Ls*0.6]);
    lbl(P[2][0],[0,0.9,-H/Math.tan((90-LAT)*D)]); lbl(P[3][0],[1.6,0.7,1.4]);
    // namoyish: bir yil davomida peshin (og'ish −23,4° … +23,4°) — soya uchi shkala bo'ylab yuradi
    let ph=Math.PI/2*0; anim((t,dt)=>{ if(c.play()) ph+=dt*0.55; const dec=23.44*Math.sin(ph), p=K.sunPos(LAT,dec,0); sun(p.az,p.alt); });
    return { cam:[7.5,5.2,5.5], tgt:[0,1.2,-3], maxDist:40, minDist:2 }; } });

/* ---------------- Quyosh soati ---------------- */
IM.push({ id:'sundial', use:['time'], icon:'🕰', yearN:-1500,
  name:t3('Quyosh soati','Солнечные часы','Sundial'), year:t3('mil. avv. ~1500-yil','~1500 до н. э.','~1500 BC'),
  who:t3('Qadimgi Misr; qutbga qaratilgan ko‘rsatkich — Islom olimlari (XIII–XIV asr)','Древний Египет; указатель на полюс — учёные исламского мира (XIII–XIV вв.)','Ancient Egypt; the pole-pointing style — Islamic scholars (13th–14th c.)'),
  size:t3('Siferblat Ø 44 sm, ustun 1 m','Циферблат Ø 44 см, колонна 1 м','Dial Ø 44 cm, pedestal 1 m'),
  short:t3('Ko‘rsatkich soyasi bo‘yicha kunduzgi vaqtni ko‘rsatadi','Показывает дневное время по тени указателя','Tells daytime hours by the shadow of a pointer'),
  about:t3('Gorizontal quyosh soati — tekis siferblat va uning ustidagi uchburchak ko‘rsatkich (stil). Stilning qirrasi Olam qutbiga qaratilgan, ya’ni Yer o‘qiga parallel, shuning uchun soya yil davomida bir xil soat chiziqlariga tushadi. Model Toshkent kengligi (41,3°) uchun hisoblangan.',
    'Горизонтальные солнечные часы — плоский циферблат и треугольный указатель (стиль). Ребро стиля направлено на полюс мира, параллельно земной оси, поэтому тень весь год падает на одни и те же часовые линии. Модель рассчитана для широты Ташкента (41,3°).',
    'A horizontal sundial is a flat dial with a triangular pointer (the style). The style’s edge points at the celestial pole, parallel to Earth’s axis, so its shadow falls on the same hour lines all year. This model is laid out for Tashkent’s latitude (41.3°).'),
  tasks:[t3('Kunduzgi mahalliy quyosh vaqtini o‘lchash','Измерять местное солнечное время днём','Tell local solar time during the day'),
    t3('Mexanik soatlarni sozlash (XIX asrgacha)','Сверять механические часы (до XIX в.)','Set mechanical clocks (until the 19th century)'),
    t3('Namoz va ish vaqtlarini belgilash','Определять время молитв и работ','Mark times for prayer and work')],
  how:[t3('Stil qirrasi kenglikka teng burchak (41,3°) ostida shimolga qaratiladi — u Yer o‘qiga parallel bo‘ladi.','Ребро стиля наклонено к северу под углом, равным широте (41,3°), — оно параллельно земной оси.','The style edge rises northward at an angle equal to the latitude (41.3°) — parallel to Earth’s axis.'),
    t3('Quyosh har soatda 15° siljiydi, lekin gorizontal siferblatda soat chiziqlari orasidagi burchak teng emas: tg θ = sin φ · tg(15°·t).','Солнце смещается на 15° в час, но на горизонтальном циферблате углы между линиями неравны: tg θ = sin φ · tg(15°·t).','The Sun moves 15° an hour, but on a horizontal dial the hour lines are unevenly spaced: tan θ = sin φ · tan(15°·t).'),
    t3('Soya qirrasi tushgan chiziq — mahalliy quyosh vaqti. Peshinda soya XII chizig‘iga, aniq shimolga tushadi.','Линия, на которую падает край тени, — местное солнечное время. В полдень тень на линии XII, точно на севере.','The line under the shadow edge is local solar time; at noon it lies on XII, due north.'),
    t3('Soat vaqti bilan farq qiladi: vaqt mintaqasi va «vaqt tenglamasi» (±16 daqiqa) hisobga olinadi.','Время отличается от часового: учитывают часовой пояс и «уравнение времени» (±16 мин).','It differs from clock time: correct for the time zone and the “equation of time” (±16 min).')],
  parts:[[t3('Stil (ko‘rsatkich)','Стиль (указатель)','Style (gnomon)'),t3('Qirrasi Olam qutbiga qaragan uchburchak plastinka.','Треугольная пластина, ребро которой направлено на полюс мира.','Triangular plate whose edge points to the celestial pole.')],
    [t3('Soat chiziqlari','Часовые линии','Hour lines'),t3('Kenglik uchun hisoblangan, teng bo‘lmagan oraliqdagi chiziqlar VI–XVIII.','Неравномерные линии VI–XVIII, рассчитанные для широты.','Unevenly spaced lines VI–XVIII computed for the latitude.')],
    [t3('Peshin chizig‘i (XII)','Полуденная линия (XII)','Noon line (XII)'),t3('Meridian bo‘ylab shimolga qaragan chiziq.','Линия вдоль меридиана, на север.','Line along the meridian, pointing north.')],
    [t3('Tosh ustun','Каменная колонна','Stone pedestal'),t3('Siferblatni gorizontal va barqaror ushlab turadi.','Держит циферблат горизонтально и неподвижно.','Holds the dial level and steady.')]],
  facts:[t3('Ma’lum eng qadimgi quyosh soati Misrda topilgan va mil. avv. ~1500-yillarga oid.','Древнейшие известные солнечные часы найдены в Египте и датируются ~1500 г. до н. э.','The oldest known sundial, from Egypt, dates to ~1500 BC.'),
    t3('Damashqdagi Umaviylar masjidi uchun Ibn ash-Shotir 1371-yilda qutbga qaratilgan stilli quyosh soati yasagan.','Ибн аш-Шатир в 1371 г. сделал для мечети Омейядов в Дамаске часы со стилем, направленным на полюс.','In 1371 Ibn al-Shatir made a pole-aligned sundial for the Umayyad Mosque in Damascus.'),
    t3('Ko‘p quyosh soatlarida lotincha «Horas non numero nisi serenas» — «Faqat quyoshli soatlarni sanayman» degan yozuv bor.','На многих часах надпись «Horas non numero nisi serenas» — «Считаю лишь ясные часы».','Many carry the motto “Horas non numero nisi serenas” — “I count only the sunny hours”.')],
  env:{ sky:'day', sunAz:140, sunAlt:45, ground:'grass', size:120, shadow:1.4, nb:0.002, hemiGround:0x3a4a2a },
  feat:{ play:true },
  build(c){ const {THREE,M,X,mesh,lbl,anim,sun}=c, P=this.parts, LAT=41.3, R=0.22, Y=1.0, OZ=0.1;
    const stone=M({ map:X.noise('#cfc6b2',0.07,[1,2]), rough:0.85, bump:0.2 }), br=K.brass(c);
    K.lathe(c,[[0,0],[0.3,0],[0.3,0.08],[0.24,0.12],[0.17,0.16],[0.12,0.22],[0.1,0.3],[0.13,0.5],[0.12,0.72],[0.09,0.82],[0.14,0.88],[0.25,0.93],[0.27,Y-0.012],[0,Y-0.012]],stone);
    mesh(new THREE.CylinderGeometry(R+0.006,R+0.006,0.012,96),br,[0,Y-0.006,0]);
    const tt=K.plate(c,1024,'#c49c55',(x,w,h)=>{ const s=w/(2*R), cx=w/2, oy=h/2+OZ*s, f=LAT*D;
      x.save(); x.beginPath(); x.arc(cx,h/2,(R-0.012)*s,0,7); x.clip();
      for(let k=10;k<=40;k++){ const hh=(k/2)-12; if(hh<-7.5||hh>7.5) continue; const th=Math.atan2(Math.sin(f)*Math.sin(hh*15*D),Math.cos(hh*15*D)), whole=k%2===0;
        x.lineWidth=whole?3:1.3; x.beginPath(); x.moveTo(cx,oy); x.lineTo(cx+Math.sin(th)*h,oy-Math.cos(th)*h); x.stroke();
        if(whole){ let t=0.02; while(Math.hypot(Math.sin(th)*t,OZ-Math.cos(th)*t)<R-0.05) t+=0.002; const RN=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'], H24=hh+12, lab=RN[H24>12?H24-12:H24]||'';
          x.save(); x.translate(cx+Math.sin(th)*t*s,oy-Math.cos(th)*t*s); x.rotate(th); x.font='bold 30px serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillStyle='#f2e6c8'; x.fillRect(-26,-17,52,34); x.fillStyle='rgba(45,28,10,.95)'; x.fillText(lab,0,0); x.restore(); } }
      x.restore(); K.ring(x,cx,h/2,(R-0.012)*s,3); K.ring(x,cx,h/2,(R-0.03)*s,1.5);
      x.font='italic 22px serif'; x.textAlign='center'; x.fillText('HORAS NON NUMERO NISI SERENAS',cx,h/2+(R-0.05)*s);
      x.font='bold 28px serif'; x.fillText('N',cx,h/2-(R-0.045)*s+10); x.fillText('41° 18′',cx,h/2+(R-0.09)*s); });
    mesh(new THREE.CircleGeometry(R,96).rotateX(-Math.PI/2),M({ map:tt, metal:0.85, rough:0.38, env:1.1, bump:0.08 }),[0,Y+0.0005,0]);
    // stil: gipotenuza markazdan shimolga kenglik burchagida ko'tariladi
    const Lg=0.2, s=new THREE.Shape(); s.moveTo(0,0); s.lineTo(Lg,0); s.lineTo(Lg,0.012); s.quadraticCurveTo(Lg*0.75,0.03,Lg*0.62,Lg*0.62*Math.tan(LAT*D)); s.lineTo(0,0);
    K.ext(c,s,0.007,M({ clean:true, color:0xb8914f, metal:0.95, rough:0.3, env:1.3 }),[-0.0035,Y,OZ],[0,Math.PI/2,0]);
    lbl(P[0][0],[0,Y+0.16,-0.06]); lbl(P[1][0],[0.15,Y+0.04,-0.05]); lbl(P[2][0],[0,Y+0.03,-0.2]); lbl(P[3][0],[0.2,0.55,0.15]);
    const trees=[[-9,-12],[11,-8],[-13,5],[10,11],[3,-16],[-6,14]]; trees.forEach(([x,z],k)=>c.tree(k%3?'leaf':'pine',x,0,z,0.8));
    mesh(new THREE.CircleGeometry(1.6,64).rotateX(-Math.PI/2),M({ map:X.ground('#a89c86',0.2,[6,6]), rough:1, bump:0.8 }),[0,0.01,0]);
    let H=-30; anim((t,dt)=>{ if(c.play()){ H+=dt*18; if(H>95) H=-95; } const p=K.sunPos(LAT,10,H); sun(p.az,Math.max(p.alt,1)); });
    return { cam:[0.72,1.5,0.9], tgt:[0,1.0,0], maxDist:12, minDist:0.25, near:0.02 }; } });

/* ---------------- Armillyar sfera ---------------- */
IM.push({ id:'armillary', use:['model','angle'], icon:'🌐', yearN:-255,
  name:t3('Armillyar sfera','Армиллярная сфера','Armillary sphere'), year:t3('mil. avv. ~255-yil','~255 до н. э.','~255 BC'),
  who:t3('Eratosfen (Iskandariya); Xitoyda Chjan Xen (II asr); Tixo Brage','Эратосфен (Александрия); в Китае Чжан Хэн (II в.); Тихо Браге','Eratosthenes (Alexandria); Zhang Heng in China (2nd c.); Tycho Brahe'),
  size:t3('Halqa Ø 50 sm, balandligi 0,8 m','Кольца Ø 50 см, высота 0,8 м','Rings Ø 50 cm, height 0.8 m'),
  short:t3('Osmon sferasining halqali modeli — koordinatalarni o‘lchaydi va o‘rgatadi','Кольцевая модель небесной сферы — измеряет и объясняет координаты','A ring model of the celestial sphere for measuring and teaching coordinates'),
  about:t3('Armillyar sfera osmonning asosiy aylanalarini — ekvator, ekliptika, tropiklar, meridian va gorizontni — halqalar bilan ko‘rsatadi. Ichki halqalar Olam o‘qi atrofida aylanib, osmonning kunlik harakatini takrorlaydi. Katta nusxalari kuzatuv asbobi bo‘lgan, kichiklari esa ta’lim uchun ishlatilgan.',
    'Армиллярная сфера показывает кольцами главные круги неба — экватор, эклиптику, тропики, меридиан и горизонт. Внутренние кольца вращаются вокруг оси мира, повторяя суточное движение неба. Большие сферы были инструментами наблюдения, малые — учебными пособиями.',
    'An armillary sphere shows the sky’s great circles — equator, ecliptic, tropics, meridian and horizon — as rings. The inner rings turn around the celestial axis, re-enacting the sky’s daily motion. Large ones were observing instruments; small ones were for teaching.'),
  tasks:[t3('Yulduz va sayyoralarning ekliptik va ekvatorial koordinatalarini o‘lchash','Измерять эклиптические и экваториальные координаты светил','Measure ecliptic and equatorial coordinates of stars and planets'),
    t3('Osmonning kunlik aylanishini va fasllarni tushuntirish','Объяснять суточное вращение неба и времена года','Explain the sky’s daily turning and the seasons'),
    t3('Koordinatalarni bir tizimdan boshqasiga o‘tkazish','Переводить координаты из одной системы в другую','Convert coordinates between systems')],
  how:[t3('Tashqi meridian halqasi shimol–janub tekisligida turadi, gorizont halqasi yer tekisligini ko‘rsatadi.','Внешнее меридианное кольцо стоит в плоскости север–юг, кольцо горизонта показывает плоскость Земли.','The outer meridian ring stands in the north–south plane; the horizon ring shows the ground plane.'),
    t3('Ichki «osmon» halqalari kenglikka teng burchak ostida og‘gan Olam o‘qiga mahkamlangan.','Внутренние «небесные» кольца закреплены на оси мира, наклонённой под углом широты.','The inner “sky” rings are fixed to the celestial axis, tilted at the latitude.'),
    t3('Ekliptika belbog‘i ekvatorga 23,4° og‘gan — Quyoshning yillik yo‘li va zodiak belgilarini ko‘rsatadi.','Пояс эклиптики наклонён к экватору на 23,4° — это годовой путь Солнца и знаки зодиака.','The ecliptic band is tilted 23.4° to the equator — the Sun’s yearly path through the zodiac.'),
    t3('Kuzatuv sferalarida ko‘zlash moslamasi yulduzga qaratiladi va koordinata halqalardagi shkaladan o‘qiladi.','В наблюдательных сферах визир наводят на звезду и читают координату по шкалам колец.','On observing spheres a sight is aimed at a star and its coordinates are read off the ring scales.')],
  parts:[[t3('Meridian halqasi','Меридианное кольцо','Meridian ring'),t3('Graduslangan tashqi halqa, shimol–janub tekisligida.','Внешнее градуированное кольцо в плоскости север–юг.','Outer graduated ring in the north–south plane.')],
    [t3('Gorizont halqasi','Кольцо горизонта','Horizon ring'),t3('Keng yassi halqa: tomonlar va zodiak taqvimi.','Широкое плоское кольцо: стороны света и зодиакальный календарь.','Wide flat ring with compass points and a zodiac calendar.')],
    [t3('Ekliptika belbog‘i','Пояс эклиптики','Ecliptic band'),t3('Zodiak belgilari yozilgan og‘ma keng halqa.','Наклонный широкий пояс со знаками зодиака.','Tilted wide band marked with the zodiac.')],
    [t3('Ekvator va tropiklar','Экватор и тропики','Equator and tropics'),t3('Osmon ekvatori, Saraton va Jadiy tropiklari, qutb doiralari.','Небесный экватор, тропики Рака и Козерога, полярные круги.','Celestial equator, tropics of Cancer and Capricorn, polar circles.')],
    [t3('Olam o‘qi','Ось мира','Celestial axis'),t3('Qutbdan qutbga o‘tgan sterjen — butun ichki qism uning atrofida aylanadi.','Стержень от полюса к полюсу — вокруг него вращается внутренняя часть.','Pole-to-pole rod around which the inner rings turn.')],
    [t3('Yer (markazda)','Земля (в центре)','Earth (centre)'),t3('Geotsentrik qarash: kuzatuvchi markazda.','Геоцентрический взгляд: наблюдатель в центре.','Geocentric view: the observer at the centre.')]],
  facts:[t3('Ptolemey «Almagest»da (II asr) armillyar sferadan yulduz koordinatalarini o‘lchashda foydalangan.','Птолемей в «Альмагесте» (II в.) пользовался армиллярной сферой для измерения координат звёзд.','Ptolemy used an armillary sphere for star positions in the Almagest (2nd century).'),
    t3('Chjan Xen (132-yil) suv bilan aylantiriladigan armillyar sfera yasagan — u osmon bilan birga aylangan.','Чжан Хэн (132 г.) создал армиллярную сферу, вращаемую водой, — она двигалась вместе с небом.','Zhang Heng (AD 132) built a water-driven armillary sphere that turned with the sky.'),
    t3('Portugaliya bayrog‘ida armillyar sfera tasvirlangan — buyuk geografik kashfiyotlar ramzi.','На флаге Португалии изображена армиллярная сфера — символ эпохи Великих открытий.','Portugal’s flag shows an armillary sphere, a symbol of the Age of Discovery.')],
  env:{ sky:'studio', shadow:1.0, size:8, floor:'wood' },
  feat:{ play:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, LAT=41.3, CY=0.56, RM=0.25, RS=0.226;
    const br=K.brass(c), wd=K.wood(c,'#5a3218'), dk=K.brass(c,{ map:c.X.metal('#8d6a35','#3e5640') });
    K.lathe(c,[[0,0],[0.3,0],[0.3,0.025],[0.285,0.04],[0,0.04]],wd);
    K.lathe(c,[[0,0.04],[0.07,0.04],[0.06,0.07],[0.03,0.1],[0.025,0.2],[0.035,0.24],[0.02,0.27],[0.02,CY-RM-0.006],[0,CY-RM-0.006]],wd);
    for(let i=0;i<4;i++){ const a=i*Math.PI/2+Math.PI/4; K.lathe(c,[[0,0],[0.016,0],[0.012,0.05],[0.015,0.12],[0.009,0.2],[0.011,CY-0.04],[0.008,CY-0.004],[0,CY-0.004]],wd,[Math.cos(a)*0.28,0.04,Math.sin(a)*0.28],null,16); }
    // gorizont halqasi (yassi, yog'och ustidagi qog'oz — zodiak va oylar)
    const HR0=0.3, HR1=0.262, ht=c.tex(1024,1024,(x,w)=>{ const s=w/(2*HR0), cx=w/2; x.fillStyle='#e9dcb8'; x.fillRect(0,0,w,w); x.strokeStyle='#3b2a14'; x.fillStyle='#3b2a14';
      [HR0-0.003,HR1+0.003,0.288,0.276].forEach(r=>K.ring(x,cx,cx,r*s,2)); K.scale(x,cx,cx,0.288*s,0.3*s-6,360,{ long:i=>i%10===0, mid:i=>i%5===0 });
      const Z=['ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITTARIUS','CAPRICORNUS','AQUARIUS','PISCES'];
      K.scale(x,cx,cx,HR1*s+3,0.276*s,12,{ long:()=>true, lab:i=>Z[i], lr:0.269*s, font:'bold 15px serif', flip:false }); });
    const hs=K.annulus(c,HR0,HR1), hm=K.ext(c,hs,0.01,M({ map:K.fit(ht,-HR0,-HR0,2*HR0), rough:0.6, env:0.7, bump:0.05 }),[0,CY,0],[-Math.PI/2,0,0]); hm.position.y=CY-0.01+0.01;
    // meridian halqasi (shimol–janub tekisligi) gradus shkalasi bilan
    const mt=K.plate(c,1024,'#c09a58',(x,w)=>{ const s=w/(2*(RM+0.01)), cx=w/2; K.ring(x,cx,cx,(RM+0.008)*s,2); K.ring(x,cx,cx,(RM-0.008)*s,2); K.scale(x,cx,cx,(RM-0.008)*s,(RM+0.004)*s,360,{ long:i=>i%10===0, mid:i=>i%5===0 }); });
    K.ext(c,K.annulus(c,RM+0.01,RM-0.01),0.005,M({ map:K.fit(mt,-(RM+0.01),-(RM+0.01),2*(RM+0.01)), metal:0.95, rough:0.3, env:1.3, bump:0.03 }),[-0.0025,CY,0],[0,Math.PI/2,0]);
    mesh(new THREE.BoxGeometry(0.03,0.02,0.03),br,[0,CY-RM-0.008,0]);
    // ichki osmon: o'q kenglikka teng og'gan (shimol = −z)
    const tilt=new THREE.Group(); tilt.position.y=CY; tilt.rotation.x=-(90-LAT)*D; c.root.add(tilt); const sky=new THREE.Group(); tilt.add(sky);
    const ring=(r,y,tube,m,rx,rz,par)=>mesh(new THREE.TorusGeometry(r,tube,8,128),m,[0,y,0],[rx!=null?rx:Math.PI/2,0,rz||0],par||sky);
    ring(RS,0,0.0045,br); [23.44,-23.44].forEach(e=>ring(RS*Math.cos(e*D),RS*Math.sin(e*D),0.003,dk)); [66.56,-66.56].forEach(e=>ring(RS*Math.cos(e*D),RS*Math.sin(e*D),0.003,dk));
    ring(RS,0,0.004,br,0,0); mesh(new THREE.TorusGeometry(RS,0.004,8,128),br,null,[0,Math.PI/2,0],sky);
    K.bar(c,[0,-RM-0.02,0],[0,RM+0.02,0],0.004,br,tilt); [1,-1].forEach(s=>mesh(new THREE.SphereGeometry(0.009,16,12),br,[0,s*(RM+0.022),0],null,tilt));
    // ekliptika belbog'i — zodiak belgilari
    const et=c.texB(2048,64,(x,w,h)=>{ const b=c.rgb('#c7a160'); c.paint(x,64,[[0,...c.shade(b,0.85)],[1,...b]],{ oct:4 }); x.drawImage(x.canvas,0,0,64,64,0,0,w,h); x.strokeStyle=x.fillStyle='rgba(45,28,10,.9)';
      x.lineWidth=2; x.strokeRect(2,4,w-4,h-8); for(let i=0;i<=360;i++){ const X=i/360*w; x.lineWidth=i%30===0?3:1; x.beginPath(); x.moveTo(X,4); x.lineTo(X,i%30===0?h-4:i%5===0?20:12); x.stroke(); }
      const Z=['ARI','TAU','GEM','CNC','LEO','VIR','LIB','SCO','SGR','CAP','AQR','PSC']; x.font='bold 24px serif'; x.textAlign='center'; Z.forEach((z,i)=>x.fillText(z,(i+0.5)/12*w,h-14)); });
    const eg=new THREE.Group(); eg.rotation.x=23.44*D; sky.add(eg);
    mesh(new THREE.CylinderGeometry(RS+0.002,RS+0.002,0.024,160,1,true),M({ map:et, metal:0.9, rough:0.32, env:1.2, bump:0.05, side:THREE.DoubleSide }),null,null,eg);
    const earth=mesh(new THREE.SphereGeometry(0.035,48,32),M({ map:c.img('textures/2k_earth_daymap.jpg'), rough:0.7, clean:true, env:0.5 }),null,null,sky);
    lbl(P[0][0],[0,CY+RM+0.03,0.05]); lbl(P[1][0],[0.26,CY+0.02,0.14]); lbl(P[2][0],[-0.18,CY+0.12,0.1]); lbl(P[3][0],[0.2,CY-0.05,0.1]);
    lbl(P[4][0],[0,CY+Math.sin(LAT*D)*(RM+0.05),-Math.cos(LAT*D)*(RM+0.05)]); lbl(P[5][0],[0,CY+0.05,0]);
    anim((t,dt)=>{ sky.rotation.y+=dt*(c.play()?0.9:0.07); earth.rotation.y-=dt*(c.play()?0.9:0.07); });
    return { cam:[0.78,0.92,0.92], tgt:[0,0.5,0], maxDist:5, minDist:0.25, near:0.01 }; } });

/* ---------------- Antikitera mexanizmi ---------------- */
IM.push({ id:'antikythera', use:['model','time'], icon:'⚙️', yearN:-150,
  name:t3('Antikitera mexanizmi','Антикитерский механизм','Antikythera mechanism'), year:t3('mil. avv. ~150–100-yillar','~150–100 до н. э.','~150–100 BC'),
  who:t3('Qadimgi Yunoniston (ehtimol Rodos ustaxonasi)','Древняя Греция (вероятно, мастерская Родоса)','Ancient Greece (probably a workshop on Rhodes)'),
  size:t3('~34 × 18 × 9 sm, 30 dan ortiq tishli g‘ildirak','~34 × 18 × 9 см, более 30 шестерён','~34 × 18 × 9 cm, 30+ gear wheels'),
  short:t3('Dunyodagi ma’lum eng qadimgi analog «kompyuter» — tutilishlarni bashorat qilgan','Древнейший известный аналоговый «компьютер» — предсказывал затмения','The oldest known analogue “computer” — it predicted eclipses'),
  about:t3('1901-yilda Antikitera oroli yaqinidagi qadimgi kema qoldiqlaridan topilgan bronza mexanizm. Dastani aylantirib, istalgan sana uchun Quyosh va Oyning zodiakdagi o‘rni, Oy fazasi, Quyosh va Oy tutilishlari, hatto Olimpiya o‘yinlari yili ko‘rsatilgan. Model — rentgen tomografiyasi asosidagi zamonaviy rekonstruksiya.',
    'Бронзовый механизм, найденный в 1901 г. на древнем корабле у острова Антикитера. Вращая ручку, можно было для любой даты увидеть положение Солнца и Луны в зодиаке, фазу Луны, солнечные и лунные затмения и даже год Олимпийских игр. Модель — современная реконструкция по рентгеновской томографии.',
    'A bronze mechanism found in 1901 in an ancient shipwreck off Antikythera. Turning a handle showed, for any date, the Sun and Moon in the zodiac, the Moon’s phase, solar and lunar eclipses and even the year of the Olympic Games. The model is a modern reconstruction based on X-ray tomography.'),
  tasks:[t3('Quyosh va Oyning zodiakdagi o‘rnini ko‘rsatish','Показывать положение Солнца и Луны в зодиаке','Show the Sun and Moon in the zodiac'),
    t3('Oy fazasini ko‘rsatish (yarim kumush shar)','Показывать фазу Луны (полусеребряный шар)','Show the lunar phase (half-silvered ball)'),
    t3('Tutilishlarni Saros sikli bo‘yicha bashorat qilish','Предсказывать затмения по циклу Сарос','Predict eclipses with the Saros cycle'),
    t3('Taqvim: Meton sikli (19 yil) va o‘yinlar yili','Календарь: метонов цикл (19 лет) и годы игр','Calendar: the 19-year Metonic cycle and games years')],
  how:[t3('Yon tomondagi dasta aylantirilganda asosiy katta g‘ildirak harakatlanadi: bir aylanish — bir yil.','Ручка сбоку вращает главное большое колесо: один оборот — один год.','The side handle turns the main wheel: one turn is one year.'),
    t3('Tishlar soni nisbatlari astronomik davrlarni takrorlaydi: masalan, 254 sideral oy = 19 yil.','Отношения чисел зубьев повторяют астрономические периоды: например, 254 сидерических месяца = 19 лет.','Tooth-count ratios reproduce astronomical periods: e.g. 254 sidereal months = 19 years.'),
    t3('Old siferblatda zodiak va 365 kunlik Misr taqvimi; ko‘rsatkichlar Quyosh va Oyni ko‘rsatadi.','На переднем циферблате — зодиак и 365-дневный египетский календарь; стрелки показывают Солнце и Луну.','The front dial has the zodiac and the 365-day Egyptian calendar; pointers mark the Sun and Moon.'),
    t3('Orqadagi spiral siferblatlar: yuqorida 19 yillik Meton, pastda 18 yillik Saros — tutilishlar oyini belgilaydi.','Задние спиральные шкалы: сверху 19-летний метонов цикл, снизу 18-летний Сарос — месяцы затмений.','Back spiral dials: the 19-year Metonic cycle above and the 18-year Saros below, marking eclipse months.'),
    t3('Pin-va-tirqish uzatmasi Oyning notekis tezligini (Kepler qonunini bilmasdan!) taqlid qilgan.','Передача «штифт в прорези» имитировала неравномерную скорость Луны — задолго до Кеплера.','A pin-and-slot gear mimicked the Moon’s varying speed — long before Kepler.')],
  parts:[[t3('Old siferblat','Передний циферблат','Front dial'),t3('Zodiak halqasi va Misr taqvimi (365 kun).','Кольцо зодиака и египетский календарь (365 дней).','Zodiac ring and Egyptian calendar (365 days).')],
    [t3('Quyosh va Oy ko‘rsatkichlari','Стрелки Солнца и Луны','Sun and Moon pointers'),t3('Oy ko‘rsatkichidagi yarim kumush shar fazani ko‘rsatadi.','Полусеребряный шар на лунной стрелке показывает фазу.','A half-silvered ball on the Moon pointer shows the phase.')],
    [t3('Tishli g‘ildiraklar','Шестерни','Gear train'),t3('30 dan ortiq bronza g‘ildirak, tishlari uchburchak shaklda.','Более 30 бронзовых колёс с треугольными зубьями.','30+ bronze wheels with triangular teeth.')],
    [t3('Orqa spirallar','Задние спирали','Back spiral dials'),t3('Meton (19 yil) va Saros (223 oy) sikllari.','Циклы Метона (19 лет) и Сарос (223 месяца).','Metonic (19 years) and Saros (223 months) cycles.')],
    [t3('Dasta','Ручка','Crank handle'),t3('Vaqtni oldinga-orqaga «aylantirish» uchun.','Чтобы «прокручивать» время вперёд и назад.','To wind time forwards or backwards.')],
    [t3('Yog‘och quti','Деревянный корпус','Wooden case'),t3('Mexanizm ichida joylashgan, yuzalarida yo‘riqnoma yozuvlari bo‘lgan.','В нём размещался механизм, на стенках — инструкции.','Housed the mechanism; its plates carried instructions.')]],
  facts:[t3('Asosiy g‘ildirakda 223 tish bor — bu Saros siklidagi oylar soniga teng.','У одной из шестерён 223 зуба — столько месяцев в цикле Сарос.','One wheel has 223 teeth — the number of months in a Saros cycle.'),
    t3('Bunday murakkablikdagi mexanizmlar keyin faqat XIV asrda Yevropa minora soatlarida paydo bo‘lgan.','Механизмы подобной сложности вновь появились лишь в XIV в. в европейских башенных часах.','Machines this complex reappeared only with 14th-century European tower clocks.'),
    t3('Qoldiqlar 82 bo‘lakdan iborat va Afina Milliy arxeologiya muzeyida saqlanadi.','Сохранилось 82 фрагмента; они хранятся в Национальном археологическом музее Афин.','82 fragments survive, kept at the National Archaeological Museum in Athens.')],
  env:{ sky:'studio', shadow:0.5, size:4, floor:'stone' },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, W=0.18, Hh=0.32, Dp=0.09, B=0.06, CYb=B+Hh/2, DC=B+0.2;
    const wd=K.wood(c,'#6a4325',{ clip:true }), bz=K.bronze(c,{ clip:true }), gz=K.bronze(c,{ map:c.X.metal('#b98446','#3f6e58') });
    mesh(new THREE.BoxGeometry(0.28,B,0.17),K.wood(c,'#2c1c12'),[0,B/2,0]);
    // quti: 4 devor
    [[W/2-0.004,0],[-W/2+0.004,0]].forEach(([x])=>mesh(new THREE.BoxGeometry(0.008,Hh,Dp),wd,[x,CYb,0]));
    [CYb+Hh/2-0.004,CYb-Hh/2+0.004].forEach(y=>mesh(new THREE.BoxGeometry(W,0.008,Dp),wd,[0,y,0]));
    // old plita (bronza, gravyura: zodiak + Misr taqvimi + yunoncha yozuvlar)
    const Wp=W-0.016, Hp=Hh-0.016, ft=c.texB(1024,Math.round(1024*Hp/Wp),(x,w,h)=>{ const b=c.rgb('#b07c40'); c.paint(x,w,[[0,...c.shade(b,0.8)],[0.5,...b],[1,...c.shade(b,1.12)]],{ oct:5, speck:8 }); x.drawImage(x.canvas,0,0,w,w,0,w-2,w,w); x.strokeStyle='rgba(45,28,10,.9)'; x.fillStyle='rgba(45,28,10,.95)'; const s=w/Wp, cx=w/2, cy=(1-(DC-(CYb-Hp/2))/Hp)*h;
      [0.079,0.07,0.06,0.052].forEach(r=>K.ring(x,cx,cy,r*s,2.4));
      K.scale(x,cx,cy,0.07*s,0.079*s,365,{ long:i=>i%30===0, mid:i=>i%5===0 });
      const Z=['ΚΡΙΟΣ','ΤΑΥΡΟΣ','ΔΙΔΥΜΟΙ','ΚΑΡΚΙΝΟΣ','ΛΕΩΝ','ΠΑΡΘΕΝΟΣ','ΧΗΛΑΙ','ΣΚΟΡΠΙΟΣ','ΤΟΞΟΤΗΣ','ΑΙΓΟΚΕΡΩΣ','ΥΔΡΟΧΟΟΣ','ΙΧΘΥΕΣ'];
      K.scale(x,cx,cy,0.06*s,0.07*s,12,{ long:()=>true, lab:i=>Z[i], lr:0.065*s, font:'bold 17px serif' });
      K.scale(x,cx,cy,0.052*s,0.06*s,360,{ long:i=>i%30===0, mid:i=>i%10===0 });
      x.font='18px serif'; x.textAlign='left'; const G='ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'; for(let r=0;r<9;r++){ let t=''; for(let k=0;k<26;k++) t+=(k%6===5?' ':G[(r*7+k*5)%24]); x.globalAlpha=0.75; x.fillText(t,30,h*0.72+r*26); } x.globalAlpha=1;
      for(let r=0;r<4;r++){ let t=''; for(let k=0;k<22;k++) t+=(k%5===4?' ':G[(r*3+k*11)%24]); x.globalAlpha=0.7; x.fillText(t,40,40+r*26); } x.globalAlpha=1; });
    mesh(new THREE.BoxGeometry(W-0.016,Hh-0.016,0.003),bz,[0,CYb,Dp/2-0.003]).material=M({ map:ft, metal:0.88, rough:0.42, env:1.1, bump:0.06, clip:true });
    // orqa plita: ikkita spiral
    const bt=K.plate(c,1024,'#a87338',(x,w,h)=>{ const s=w/W, sp=(cx,cy,r0,r1,turns,n)=>{ x.lineWidth=2.4; for(const off of [0,1]){ x.beginPath(); for(let i=0;i<=600;i++){ const a=i/600*turns*Math.PI*2, r=(r0+(r1-r0)*(i/600)+off*(r1-r0)/turns)*s; x.lineTo(cx+Math.cos(a)*r,cy-Math.sin(a)*r); } x.stroke(); }
        for(let k=0;k<n;k++){ const f=k/n, a=f*turns*Math.PI*2, r=r0+(r1-r0)*f; x.lineWidth=1; x.beginPath(); x.moveTo(cx+Math.cos(a)*r*s,cy-Math.sin(a)*r*s); x.lineTo(cx+Math.cos(a)*(r+(r1-r0)/turns)*s,cy-Math.sin(a)*(r+(r1-r0)/turns)*s); x.stroke(); } };
      sp(w/2,h*0.3,0.025,0.072,5,235); sp(w/2,h*0.74,0.022,0.066,4,223); K.ring(x,w*0.72,h*0.3,0.014*s,1.6); K.ring(x,w*0.72,h*0.74,0.014*s,1.6); });
    const bp=mesh(new THREE.BoxGeometry(W-0.016,Hh-0.016,0.003),M({ map:bt, metal:0.88, rough:0.45, env:1.1, bump:0.06 }),[0,CYb,-Dp/2+0.003]); bp.rotation.y=Math.PI;
    // ichki g'ildiraklar
    const gears=[]; [[0.064,72,0,DC,0.012,4],[0.022,24,-0.052,DC-0.07,0.004,0],[0.036,48,0.045,DC-0.09,0.0,4],[0.017,18,0.026,DC-0.15,-0.01,0],[0.03,40,-0.04,DC-0.14,-0.016,4],[0.013,15,0,DC-0.19,-0.024,0],[0.042,56,0.0,DC-0.06,-0.03,4],[0.02,22,0.05,DC+0.02,-0.006,0],[0.026,32,-0.045,DC+0.07,-0.012,4]]
      .forEach(([r,n,x,y,z,sk],k)=>{ const g=K.gear(c,r,n,0.0025,gz,[x,y,z],null,sk); gears.push([g,(k%2?-1:1)*0.064/r]); });
    for(let i=0;i<5;i++) mesh(new THREE.CylinderGeometry(0.0025,0.0025,Dp-0.01,10),gz,[[0,-0.052,0.045,0.026,-0.04][i],[DC,DC-0.07,DC-0.09,DC-0.15,DC-0.14][i],0],[Math.PI/2,0,0]);
    // ko'rsatkichlar
    const ptr=(len,w,col)=>{ const g=new THREE.Group(); g.position.set(0,DC,Dp/2+0.002); c.root.add(g); mesh(new THREE.BoxGeometry(w,len,0.0015),col,[0,len/2,0],null,g); return g; };
    const sunP=ptr(0.078,0.004,K.brass(c,{ clip:true })), moonP=ptr(0.066,0.0035,bz), dateP=ptr(0.082,0.002,bz);
    mesh(new THREE.SphereGeometry(0.006,24,16),K.brass(c,{ map:c.X.metal('#e0b24f'), clip:true }),[0,0.06,0.003],null,sunP);
    const mt=c.tex(128,64,(x,w,h)=>{ x.fillStyle='#d9dde2'; x.fillRect(0,0,w/2,h); x.fillStyle='#1b1a18'; x.fillRect(w/2,0,w/2,h); });
    const moonB=mesh(new THREE.SphereGeometry(0.0055,24,16),M({ map:mt, metal:0.7, rough:0.35, clip:true }),[0,0.05,0.004],null,moonP);
    mesh(new THREE.CylinderGeometry(0.004,0.004,0.006,16),bz,[0,DC,Dp/2+0.003],[Math.PI/2,0,0]);
    // dasta
    const cr=new THREE.Group(); cr.position.set(W/2,DC,0); c.root.add(cr); mesh(new THREE.CylinderGeometry(0.004,0.004,0.025,12),bz,[0.012,0,0],[0,0,Math.PI/2],cr);
    mesh(new THREE.BoxGeometry(0.004,0.04,0.006),bz,[0.025,0.018,0],null,cr); mesh(new THREE.CylinderGeometry(0.004,0.004,0.016,12),K.wood(c,'#3a2414'),[0.032,0.036,0],[0,0,Math.PI/2],cr);
    lbl(P[0][0],[0,DC+0.1,Dp/2]); lbl(P[1][0],[0.06,DC+0.05,Dp/2+0.01]); lbl(P[2][0],[-0.03,DC-0.12,0.01]); lbl(P[3][0],[0,CYb+0.12,-Dp/2-0.01]); lbl(P[4][0],[W/2+0.04,DC+0.05,0]); lbl(P[5][0],[-W/2,CYb-0.1,0.03]);
    let yr=0; anim((t,dt)=>{ const v=c.play()?0.25:0.01; yr+=dt*v; gears.forEach(([g,k])=>{ g.rotation.z=yr*Math.PI*2*k*0.3; }); sunP.rotation.z=-yr*Math.PI*2; moonP.rotation.z=-yr*Math.PI*2*13.37; dateP.rotation.z=-yr*Math.PI*2*1.002; cr.rotation.x=yr*Math.PI*2*6; moonB.rotation.y=yr*Math.PI*2*12.37; });
    return { cam:[0.32,0.36,0.5], tgt:[0,0.22,0], maxDist:2.5, minDist:0.12, near:0.005, cutAt:Dp/2-0.017, cutN:[0,0,-1] }; } });

/* ---------------- Astrolyabiya ---------------- */
IM.push({ id:'astrolabe', use:['time','angle','model','nav'], icon:'🧿', yearN:800,
  name:t3('Astrolyabiya','Астролябия','Astrolabe'), year:t3('VIII–X asrlar (yunon asosida)','VIII–X вв. (на греческой основе)','8th–10th c. (on a Greek basis)'),
  who:t3('Yunon olimlari (Gipparx g‘oyasi); Islom dunyosi ustalari — al-Fazoriy, al-Farg‘oniy, al-Beruniy','Греческие учёные (идея Гиппарха); мастера исламского мира — аль-Фазари, аль-Фергани, аль-Бируни','Greek scholars (Hipparchus’ idea); Islamic makers — al-Fazari, al-Farghani, al-Biruni'),
  size:t3('Ø 18 sm, guruch','Ø 18 см, латунь','Ø 18 cm, brass'),
  short:t3('Osmonning cho‘ntak «kompyuteri»: vaqt, yulduz o‘rni va balandlikni topadi','Карманный «компьютер» неба: время, положение звёзд и высоты','A pocket “computer” of the sky: time, star positions and heights'),
  about:t3('Astrolyabiya — osmon sferasining tekislikka stereografik proyeksiyasi. Ona disk ichiga ma’lum kenglik uchun chizilgan plastinka (timpan) qo‘yiladi, ustida yulduzlar to‘ri — rete aylanadi. Orqadagi alidada bilan Quyosh yoki yulduz balandligi o‘lchanadi, keyin reteni burab vaqt, chiqish-botish va boshqa ko‘plab masalalar yechiladi. Al-Farg‘oniy va al-Beruniy unga bag‘ishlangan risolalar yozgan.',
    'Астролябия — стереографическая проекция небесной сферы на плоскость. В материнский диск вкладывается пластина (тимпан) для определённой широты, над ней вращается звёздная сетка — паук (рете). Алидадой на обороте измеряют высоту Солнца или звезды, затем поворотом паука находят время, восход и заход и решают много других задач. Аль-Фергани и аль-Бируни писали о ней трактаты.',
    'An astrolabe is a stereographic projection of the celestial sphere onto a flat plate. A plate (tympan) drawn for one latitude sits in the mother disc, with the star map — the rete — turning above it. The alidade on the back measures the altitude of the Sun or a star; turning the rete then gives the time, rising and setting and much more. Al-Farghani and al-Biruni wrote treatises on it.'),
  tasks:[t3('Quyosh yoki yulduz balandligini o‘lchash','Измерять высоту Солнца или звезды','Measure the altitude of the Sun or a star'),
    t3('Kunduzi va kechasi vaqtni aniqlash','Определять время днём и ночью','Tell the time by day and night'),
    t3('Yulduzlar chiqishi va botishini, qibla yo‘nalishini topish','Находить восход и заход светил, направление киблы','Find risings, settings and the qibla direction'),
    t3('Bino balandligi va masofani o‘lchash (orqadagi soya kvadrati)','Измерять высоту зданий и расстояния (теневой квадрат)','Survey heights and distances (shadow square)')],
  how:[t3('Astrolyabiya halqasidan osib qo‘yiladi — u o‘z-o‘zidan tik turadi.','Астролябию подвешивают за кольцо — она висит вертикально.','Hang the astrolabe by its ring so it hangs plumb.'),
    t3('Orqadagi alidadani Quyoshga (yoki yulduzga) qaratib, balandlik gradusda o‘qiladi.','Алидаду на обороте наводят на Солнце или звезду и читают высоту в градусах.','Sight the Sun or a star with the alidade on the back and read its altitude.'),
    t3('Old tomonda rete buraladi: yulduz uchi (yoki ekliptikadagi Quyosh nuqtasi) timpandagi shu balandlik aylanasiga keltiriladi.','На лицевой стороне поворачивают паук, пока звезда (или Солнце на эклиптике) не ляжет на круг этой высоты.','Turn the rete on the front until the star (or the Sun on the ecliptic) lies on that altitude circle.'),
    t3('Chizg‘ich (rule) shu nuqtaga qo‘yilib, chetdagi soat shkalasidan vaqt o‘qiladi. «Ishlatib ko‘rish» osmon aylanishini ko‘rsatadi.','Линейку кладут через эту точку и читают время по шкале на краю. «Показать в работе» вращает небо.','Lay the rule across that point and read the time on the rim. “See it work” turns the sky.')],
  parts:[[t3('Ona disk va limb','Матка и лимб','Mater and limb'),t3('Chetida 360° va 24 soat shkalasi (arab raqamlari).','На краю шкалы 360° и 24 часа (арабские цифры).','Rim scales of 360° and 24 hours (Arabic numerals).')],
    [t3('Timpan','Тимпан','Tympan'),t3('Kenglik uchun: almukantaratlar (balandlik aylanalari), gorizont, tropiklar.','Для широты: альмукантараты, горизонт, тропики.','For one latitude: altitude circles, horizon and tropics.')],
    [t3('Rete (yulduz to‘ri)','Паук (рете)','Rete (star map)'),t3('Teshik-teshik guruch to‘r; o‘tkir uchlar — yorqin yulduzlar.','Ажурная сетка; острия — яркие звёзды.','Pierced brass net; its pointers are bright stars.')],
    [t3('Ekliptika halqasi','Кольцо эклиптики','Ecliptic ring'),t3('Markazdan siljigan halqa — Quyoshning yillik yo‘li.','Смещённое кольцо — годовой путь Солнца.','Off-centre ring — the Sun’s yearly path.')],
    [t3('Chizg‘ich (rule)','Линейка','Rule'),t3('Markaz atrofida aylanib, vaqtni o‘qishga yordam beradi.','Вращается вокруг центра, помогает читать время.','Pivots at the centre to read off the time.')],
    [t3('Taxt va halqa','Трон и кольцо','Throne and ring'),t3('Osib qo‘yish uchun; ko‘pincha naqshinkor bezatilgan.','Для подвеса; часто богато украшены.','For hanging; often richly decorated.')]],
  facts:[t3('Al-Farg‘oniy (IX asr) astrolyabiya nazariyasi bo‘yicha risola yozgan; uning asarlari lotin tilida Yevropada o‘qitilgan.','Аль-Фергани (IX в.) написал трактат по теории астролябии; его труды изучали в Европе на латыни.','Al-Farghani (9th c.) wrote a treatise on astrolabe theory, studied in Europe in Latin.'),
    t3('Al-Beruniy astrolyabiyaning 1000 dan ortiq qo‘llanilishini sanab o‘tgan.','Аль-Бируни перечислил более 1000 применений астролябии.','Al-Biruni listed over 1,000 uses of the astrolabe.'),
    t3('Jeffri Choser 1391-yilda o‘g‘liga atab astrolyabiya haqida qo‘llanma yozgan — ingliz tilidagi ilk texnik matnlardan biri.','Джеффри Чосер в 1391 г. написал для сына трактат об астролябии — один из первых технических текстов на английском.','In 1391 Geoffrey Chaucer wrote his son a guide to the astrolabe — one of the first technical texts in English.')],
  env:{ sky:'studio', shadow:0.45, size:3, floor:'wood' },
  feat:{ play:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, R=0.09, RP=0.078, CY=0.17, LAT=41.3, f=LAT*D;
    const br=K.brass(c), wd=K.wood(c,'#4a2a16');
    // stend: yog'och asos, guruch ustun va ilgak
    mesh(new THREE.BoxGeometry(0.16,0.02,0.09),wd,[0,0.01,-0.02]); K.bar(c,[0,0.02,-0.03],[0,0.315,-0.03],0.004,br); K.bar(c,[0,0.312,-0.03],[0,0.312,0.0],0.003,br);
    const A=new THREE.Group(); A.position.y=CY; c.root.add(A);
    K.ext(c,new THREE.Shape().absarc(0,0,R,0,Math.PI*2),0.004,br,[0,0,-0.004],null,A);
    // limb (chetdagi ko'tarilgan halqa): 360° va 24 soat shkalasi
    const lt=K.plate(c,1024,'#c49c55',(x,w)=>{ const s=w/(2*R), cx=w/2; K.ring(x,cx,cx,(R-0.001)*s,2); K.ring(x,cx,cx,(RP+0.001)*s,2); K.ring(x,cx,cx,0.084*s,1.5);
      K.scale(x,cx,cx,(RP+0.001)*s,0.084*s,360,{ long:i=>i%5===0 }); K.scale(x,cx,cx,0.084*s,(R-0.002)*s,24,{ long:()=>true, lab:i=>arabic(i===0?24:i), lr:0.0872*s, font:'bold 26px serif' }); });
    K.ext(c,K.annulus(c,R,RP),0.003,M({ map:K.fit(lt,-R,-R,2*R), metal:0.93, rough:0.32, env:1.3, bump:0.05 }),[0,0,0],null,A);
    // timpan — stereografik proyeksiya (Toshkent kengligi)
    const Rcap=RP-0.002, Re=Rcap/Math.tan((45+23.44/2)*D), Rcan=Re*Math.tan((45-23.44/2)*D);
    const pt=K.plate(c,1024,'#c8a463',(x,w)=>{ const s=w/(2*RP), cx=w/2; x.save(); x.beginPath(); x.arc(cx,cx,Rcap*s,0,7); x.clip();
      [Re,Rcan,Rcap].forEach(r=>K.ring(x,cx,cx,r*s,2));
      for(let a=0;a<=84;a+=6){ const den=Math.sin(f)+Math.sin(a*D), yc=Re*Math.cos(f)/den, rr=Re*Math.cos(a*D)/den; x.lineWidth=a===0?3:a%18===0?1.8:1; x.beginPath(); x.arc(cx,cx-yc*s,rr*s,0,7); x.stroke(); }
      for(let az=0;az<180;az+=15){ const den=Math.sin(f)+1, yz=Re*Math.cos(f)/den; x.lineWidth=0.8; x.beginPath(); x.moveTo(cx,cx-yz*s); x.lineTo(cx+Math.cos(az*D)*w,cx-yz*s+Math.sin(az*D)*w*0.6); x.stroke(); }
      x.lineWidth=1.6; x.beginPath(); x.moveTo(cx,0); x.lineTo(cx,w); x.moveTo(0,cx); x.lineTo(w,cx); x.stroke(); x.restore();
      x.font='bold 24px serif'; x.textAlign='center'; x.fillText(arabic(41),cx,cx+Rcap*s*0.86); });
    mesh(new THREE.CircleGeometry(RP,96),M({ map:pt, metal:0.9, rough:0.36, env:1.2, bump:0.05 }),[0,0,0.0012],null,A);
    // rete: yulduz uchlari, ekliptika halqasi, ramka (shaffof fonli tekstura)
    const STARS=[[4.6,16.5],[5.24,-8.2],[5.92,7.4],[6.75,-16.7],[7.65,5.2],[10.14,12],[13.42,-11.2],[14.26,19.2],[18.62,38.8],[19.85,8.9],[20.69,45.3],[5.28,46],[7.76,28],[3.4,49.9],[16.49,-26.4]];
    const rt=c.tex(1024,1024,(x,w)=>{ const s=w/(2*RP), cx=w/2, P2=(r,ra)=>[cx+Math.cos(ra*15*D)*r*s,cx-Math.sin(ra*15*D)*r*s];
      x.strokeStyle=x.fillStyle='#c9a55e'; x.lineCap='round';
      const ring=(ox,oy,r,lw)=>{ x.lineWidth=lw*s; x.beginPath(); x.arc(cx+ox*s,cx-oy*s,r*s,0,7); x.stroke(); };
      ring(0,0,Rcap-0.0015,0.003); const dE=(Rcap-Rcan)/2; ring(Math.cos(18*15*D)*dE,Math.sin(18*15*D)*dE,(Rcap+Rcan)/2-0.002,0.0045);
      ring(0,0,Re,0.0016); x.lineWidth=0.003*s; [0,6,12,18].forEach(h=>{ const [a,b]=P2(Rcap,h); x.beginPath(); x.moveTo(cx,cx); x.lineTo(a,b); x.stroke(); });
      for(let k=0;k<8;k++){ const a=(k+0.5)/8*Math.PI*2; x.lineWidth=0.0015*s; x.beginPath(); x.arc(cx+Math.cos(a)*0.045*s,cx-Math.sin(a)*0.045*s,0.012*s,a+1.6,a+4.6); x.stroke(); }
      STARS.forEach(([ra,dec])=>{ const r=Re*Math.tan((90-dec)/2*D); if(r>Rcap-0.003) return; const [px,py]=P2(r,ra), [qx,qy]=P2(Math.min(Rcap,r+0.012),ra), a=Math.atan2(qy-py,qx-px);
        x.lineWidth=0.0018*s; x.beginPath(); x.moveTo(px,py); x.lineTo(qx,qy); x.stroke();
        x.beginPath(); x.moveTo(px,py); x.lineTo(px+Math.cos(a+0.35)*0.009*s,py+Math.sin(a+0.35)*0.009*s); x.quadraticCurveTo(px+Math.cos(a)*0.013*s,py+Math.sin(a)*0.013*s,px+Math.cos(a-0.35)*0.009*s,py+Math.sin(a-0.35)*0.009*s); x.closePath(); x.fill(); });
      x.fillStyle='rgba(60,38,14,.85)'; x.font='bold 16px serif'; x.textAlign='center'; for(let i=0;i<12;i++){ const a=(18*15+i*30+15)*D, ex=Math.cos(18*15*D)*dE, ey=Math.sin(18*15*D)*dE, rr=(Rcap+Rcan)/2-0.002; x.save(); x.translate(cx+(ex+Math.cos(a)*rr)*s,cx-(ey+Math.sin(a)*rr)*s); x.rotate(-a+Math.PI/2); x.fillText(['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'][i]+'︎',0,5); x.restore(); } });
    const rete=new THREE.Group(); rete.position.z=0.0024; A.add(rete);
    mesh(new THREE.CircleGeometry(RP,96),M({ clean:true, map:rt, metal:0.95, rough:0.28, env:1.4, alphaTest:0.5, side:THREE.DoubleSide }),null,null,rete).material.alphaTest=0.5;
    const rule=new THREE.Group(); rule.position.z=0.0038; A.add(rule); mesh(new THREE.BoxGeometry(0.17,0.007,0.0012),br,[0,0,0],null,rule);
    mesh(new THREE.CylinderGeometry(0.0035,0.0035,0.012,16),br,[0,0,0.002],[Math.PI/2,0,0],A);
    // taxt va halqa
    const th=new THREE.Shape(); th.moveTo(-0.034,0.078); th.quadraticCurveTo(-0.03,0.103,-0.012,0.108); th.lineTo(-0.007,0.121); th.lineTo(0.007,0.121); th.lineTo(0.012,0.108); th.quadraticCurveTo(0.03,0.103,0.034,0.078); th.closePath();
    const hh=new THREE.Path(); hh.absarc(0,0.097,0.007,0,Math.PI*2,true); th.holes.push(hh); K.ext(c,th,0.004,br,[0,0,-0.004],null,A);
    mesh(new THREE.TorusGeometry(0.014,0.0022,10,40),br,[0,0.138,-0.002],[0,Math.PI/2,0],A);
    // orqa: alidada (ko'zlash chizg'ichi)
    const al=new THREE.Group(); al.position.z=-0.0052; al.rotation.z=0.5; A.add(al); mesh(new THREE.BoxGeometry(0.17,0.01,0.0016),br,null,null,al);
    [-1,1].forEach(sg=>mesh(new THREE.BoxGeometry(0.003,0.012,0.012),br,[sg*0.07,0,-0.006],null,al));
    lbl(P[0][0],[-0.085,CY-0.04,0.01]); lbl(P[1][0],[0.03,CY-0.035,0.005]); lbl(P[2][0],[0.04,CY+0.03,0.005]); lbl(P[3][0],[-0.02,CY+0.05,0.005]); lbl(P[4][0],[0.07,CY+0.0,0.006]); lbl(P[5][0],[0,CY+0.15,0]);
    let a=0; anim((t,dt)=>{ a+=dt*(c.play()?0.5:0.02); rete.rotation.z=-a; rule.rotation.z=-a*0.35+0.4; });
    return { cam:[0.1,0.19,0.33], tgt:[0,0.17,0], maxDist:2, minDist:0.06, near:0.004 }; } });

/* ---------------- Sinus kvadranti ---------------- */
IM.push({ id:'quadrant', use:['angle','time'], icon:'📐', yearN:830,
  name:t3('Sinus kvadranti','Синус-квадрант','Sine quadrant'), year:t3('IX asr','IX в.','9th century'),
  who:t3('Muhammad al-Xorazmiy (Bag‘dod) ga nisbat beriladi','Приписывается Мухаммаду аль-Хорезми (Багдад)','Attributed to Muhammad al-Khwarizmi (Baghdad)'),
  size:t3('Radiusi 20 sm','Радиус 20 см','20 cm radius'),
  short:t3('Chorak doira: balandlikni o‘lchaydi va trigonometrik hisoblarni grafik yechadi','Четверть круга: измеряет высоту и графически решает тригонометрию','A quarter circle that measures altitude and solves trigonometry graphically'),
  about:t3('Kvadrant — doiraning to‘rtdan bir qismi shaklidagi burchak o‘lchagich. Sinus kvadrantida 60 ta parallel chiziqdan iborat to‘r bor — undan sinus va kosinus qiymatlari bevosita o‘qiladi, ya’ni u ham o‘lchov asbobi, ham «hisoblash mashinasi» bo‘lgan. Masjidlarda namoz vaqtlarini aniqlovchi muvaqqitlar undan asrlar davomida foydalangan.',
    'Квадрант — угломер в форме четверти круга. На синус-квадранте нанесена сетка из 60 параллельных линий, по которой прямо читаются синусы и косинусы: это и измерительный прибор, и «вычислительная машина». Муваккиты в мечетях веками определяли с его помощью время молитв.',
    'A quadrant is an angle-measurer shaped like a quarter circle. The sine quadrant carries a grid of 60 parallel lines from which sines and cosines are read directly — both an instrument and a “calculator”. Mosque timekeepers used it for centuries to set prayer times.'),
  tasks:[t3('Quyosh va yulduzlar balandligini o‘lchash','Измерять высоту Солнца и звёзд','Measure the altitude of the Sun and stars'),
    t3('Sinus, kosinus va boshqa trigonometrik qiymatlarni topish','Находить синусы, косинусы и другие тригонометрические величины','Find sines, cosines and other trig values'),
    t3('Namoz vaqtlari va soatni hisoblash','Вычислять время молитв и часы','Compute prayer times and the hour')],
  how:[t3('Kuzatuvchi kvadrant qirrasidagi ikki diopter teshigi orqali Quyosh yoki yulduzga qaraydi.','Наблюдатель смотрит на Солнце или звезду через два диоптра на ребре.','The observer sights the Sun or a star through two pinholes on the edge.'),
    t3('Markazdan osilgan shovun ipi har doim tik turadi va yoydagi shkalani kesib o‘tadi.','Отвес из центра всегда висит вертикально и пересекает шкалу на дуге.','A plumb line hung from the centre stays vertical and crosses the scale on the arc.'),
    t3('Ip kesgan nuqtada balandlik gradusi o‘qiladi. «Ishlatib ko‘rish» kvadrantni qiyalatadi — ip esa tik qoladi.','В точке пересечения читают высоту в градусах. «Показать в работе» наклоняет квадрант — отвес остаётся вертикальным.','Read the altitude where the thread crosses. “See it work” tilts the quadrant while the thread stays plumb.'),
    t3('Ipdagi munchoqni to‘r chizig‘iga qo‘yib, burchak sinusi (60 birlik bo‘yicha) va boshqa kattaliklar grafik yo‘l bilan topiladi.','Переводя бусину на линию сетки, графически находят синус угла (в 60 частях) и другие величины.','Sliding a bead onto the grid gives the sine of the angle (in 60 parts) and other quantities graphically.')],
  parts:[[t3('Dioptrlar','Диоптры','Sights'),t3('Qirradagi ikki teshikli plastinka — nishonga olish uchun.','Две пластинки с отверстиями на ребре — для визирования.','Two pierced vanes on the edge for sighting.')],
    [t3('Graduslangan yoy','Градуированная дуга','Graduated arc'),t3('0° dan 90° gacha, har gradusda belgi.','От 0° до 90°, деления через градус.','0° to 90°, marked every degree.')],
    [t3('Sinus to‘ri','Синусная сетка','Sine grid'),t3('Har yo‘nalishda 60 ta parallel chiziq.','По 60 параллельных линий в каждую сторону.','60 parallel lines each way.')],
    [t3('Shovun','Отвес','Plumb line'),t3('Ip va og‘irlik — tik yo‘nalishni beradi.','Нить с грузом — даёт вертикаль.','Thread and bob give the vertical.')],
    [t3('Markaz (cho‘qqi)','Центр (вершина)','Centre (apex)'),t3('Yoy markazi; shovun shu yerdan osiladi.','Центр дуги; отсюда подвешен отвес.','Centre of the arc where the plumb hangs.')]],
  facts:[t3('Sinus kvadranti XIX asrgacha Usmonlilar imperiyasi masjidlarida keng ishlatilgan.','Синус-квадрант широко использовался в мечетях Османской империи вплоть до XIX в.','The sine quadrant was used in Ottoman mosques until the 19th century.'),
    t3('Tixo Brage devoriy kvadranti radiusi ~2 m bo‘lgan — katta o‘lcham aniqroq o‘qish imkonini beradi.','Стенной квадрант Тихо Браге имел радиус ~2 м — большой размер давал точность.','Tycho Brahe’s mural quadrant had a ~2 m radius — bigger means more precise.'),
    t3('«Sinus» so‘zi arabcha «jayb» (kamon tetivasi, qo‘yin) so‘zining lotincha tarjimasidan kelib chiqqan.','Слово «синус» — латинский перевод арабского «джайб» (тетива, пазуха).','“Sine” comes from a Latin translation of Arabic “jayb” (chord, fold).')],
  env:{ sky:'studio', shadow:0.6, size:3.5, floor:'wood' },
  feat:{ play:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, R=0.2, AY=0.43;
    const br=K.brass(c), wd=K.wood(c,'#4a2a16');
    mesh(new THREE.BoxGeometry(0.24,0.025,0.14),wd,[0.06,0.0125,-0.02]); K.bar(c,[0,0.025,-0.03],[0,AY,-0.03],0.007,wd); K.bar(c,[0,AY,-0.03],[0,AY,0.004],0.003,br);
    const tt=c.texB(1024,1024,(x,w,h)=>{ const b=c.rgb('#c9a462'); c.paint(x,w,[[0,...c.shade(b,0.8)],[0.5,...b],[1,...c.shade(b,1.1)]],{ oct:5, speck:8 }); const s=w/R, X=v=>v*s, Y=v=>-v*s;
      x.strokeStyle='rgba(45,28,10,.9)'; x.fillStyle='rgba(45,28,10,.95)'; x.save(); x.beginPath(); x.moveTo(0,0); x.arc(0,0,(R-0.022)*s,0,Math.PI/2); x.closePath(); x.clip();
      for(let k=1;k<60;k++){ const v=k/60*(R-0.022); x.lineWidth=k%5===0?1.8:0.7; x.beginPath(); x.moveTo(X(v),0); x.lineTo(X(v),h); x.stroke(); x.beginPath(); x.moveTo(0,v*s); x.lineTo(w,v*s); x.stroke(); }
      x.lineWidth=2; x.beginPath(); x.arc(X((R-0.022)/2),0,(R-0.022)/2*s,0,Math.PI); x.stroke(); x.beginPath(); x.arc(0,X((R-0.022)/2),(R-0.022)/2*s,-Math.PI/2,Math.PI/2); x.stroke(); x.restore();
      K.ring(x,0,0,(R-0.022)*s,2.2); K.ring(x,0,0,(R-0.004)*s,2.2);
      K.scale(x,0,0,(R-0.022)*s,(R-0.012)*s,90,{ a0:0, a1:-Math.PI/2, long:i=>i%5===0, lab:i=>i%10===0?arabic(i):null, lr:(R-0.0075)*s, font:'bold 24px serif' }); });
    const q=new THREE.Group(); q.position.set(0,AY,0); c.root.add(q);
    const sh=new THREE.Shape(); sh.moveTo(0,0); sh.lineTo(R,0); sh.absarc(0,0,R,0,-Math.PI/2,true); sh.lineTo(0,0);
    K.ext(c,sh,0.005,M({ map:K.fit(tt,0,-R,R), metal:0.9, rough:0.35, env:1.2, bump:0.05 }),[0,0,0],null,q);
    [0.025,0.17].forEach(xx=>{ const v=mesh(new THREE.BoxGeometry(0.004,0.022,0.016),br,[xx,0.011,0.0025],null,q); });
    mesh(new THREE.SphereGeometry(0.006,16,12),br,[0,0,0.007],null,q);
    // shovun — dunyoga nisbatan doim tik
    const thr=mesh(new THREE.CylinderGeometry(0.0006,0.0006,0.205,6),M({ clean:true, color:0x2a241c, rough:0.9 }),[0,AY-0.1025,0.008]);
    mesh(new THREE.ConeGeometry(0.008,0.02,16),K.bronze(c),[0,AY-0.205-0.01,0.008],[Math.PI,0,0]); mesh(new THREE.SphereGeometry(0.0028,12,8),M({ clean:true, color:0x9b2d22, rough:0.5 }),[0,AY-0.14,0.0085]);
    lbl(P[0][0],[0.1,AY+0.05,0.0]); lbl(P[1][0],[0.16,AY-0.16,0.005]); lbl(P[2][0],[0.07,AY-0.08,0.006]); lbl(P[3][0],[0.01,AY-0.24,0.01]); lbl(P[4][0],[-0.02,AY+0.025,0.01]);
    let ph=0; anim((t,dt)=>{ if(c.play()) ph+=dt*0.9; q.rotation.z=-(37.5+22.5*Math.sin(ph))*D; });
    return { cam:[0.16,0.36,0.62], tgt:[0.08,0.32,0], maxDist:3, minDist:0.1, near:0.005 }; } });

/* ---------------- Yoqub tayog'i ---------------- */
IM.push({ id:'crossstaff', use:['angle','nav'], icon:'🎯', yearN:1330,
  name:t3('Yoqub tayog‘i','Посох Якова','Jacob’s staff (cross-staff)'), year:t3('~1330-yil','~1330 г.','~1330'),
  who:t3('Levi ben Gershon (Provans) tasvirlagan','Описан Леви бен Гершомом (Прованс)','Described by Levi ben Gerson (Provence)'),
  size:t3('Tayoq 90 sm, ko‘ndalang 30 sm','Посох 90 см, поперечина 30 см','Staff 90 cm, cross-piece 30 cm'),
  short:t3('Ikki yulduz orasidagi yoki ufqdan balandlikni oddiy tayoq bilan o‘lchaydi','Простым посохом измеряет углы между звёздами или над горизонтом','Measures angles between stars, or above the horizon, with a simple staff'),
  about:t3('Yoqub tayog‘i — uzun graduslangan tayoq va unda sirpanadigan ko‘ndalang taxtacha. Ko‘z tayoq uchiga qo‘yiladi, ko‘ndalang taxtacha uchlari ikki nuqtaga (masalan, ufq va Quyoshga) to‘g‘ri kelguncha suriladi. Burchak taxtacha qayerda turganiga qarab shkaladan o‘qiladi. Dengizchilar uni XVIII asrgacha qo‘llagan.',
    'Посох Якова — длинный градуированный шест со скользящей поперечиной. Глаз прикладывают к концу шеста, поперечину сдвигают, пока её концы не совпадут с двумя точками (например, горизонтом и Солнцем). Угол читают по шкале в месте, где стоит поперечина. Моряки пользовались им до XVIII века.',
    'A cross-staff is a long graduated staff with a sliding cross-piece. With the eye at the end of the staff, you slide the cross-piece until its ends line up with two points (say, the horizon and the Sun). The angle is read from the scale where the cross-piece sits. Sailors used it until the 18th century.'),
  tasks:[t3('Ikki yulduz orasidagi burchak masofani o‘lchash','Измерять угловое расстояние между звёздами','Measure the angle between two stars'),
    t3('Dengizda Quyosh yoki Qutb yulduzi balandligidan kenglikni topish','Определять широту в море по высоте Солнца или Полярной','Find latitude at sea from the Sun or Pole Star'),
    t3('Yer o‘lchash ishlarida balandlik va masofani aniqlash','Определять высоты и расстояния в геодезии','Survey heights and distances on land')],
  how:[t3('Tayoq uchi ko‘zga yaqin tutiladi, ko‘ndalang taxtacha tik holatda bo‘ladi.','Конец посоха держат у глаза, поперечина — вертикально.','Hold the end of the staff to your eye with the cross-piece upright.'),
    t3('Taxtacha oldinga-orqaga surilib, uning pastki uchi ufqqa, yuqori uchi Quyosh yoki yulduzga to‘g‘rilanadi.','Поперечину двигают, совмещая нижний конец с горизонтом, верхний — со светилом.','Slide it until the lower end meets the horizon and the upper end the star.'),
    t3('Burchak: α = 2·arctg(d / 2L), bunda d — taxtacha uzunligi, L — ko‘zdan masofa. Shkala darhol gradusni beradi.','Угол: α = 2·arctg(d / 2L), где d — длина поперечины, L — расстояние от глаза. Шкала сразу даёт градусы.','Angle: α = 2·arctan(d / 2L), with d the cross-piece and L its distance from the eye; the scale gives degrees directly.'),
    t3('«Ishlatib ko‘rish»: taxtacha suriladi va ko‘rish burchagi o‘zgarishi ko‘rsatiladi.','«Показать в работе»: поперечина двигается, показывается изменение угла.','“See it work” slides the cross-piece and shows the angle change.')],
  parts:[[t3('Graduslangan tayoq','Градуированный посох','Graduated staff'),t3('Shkala burchakni to‘g‘ridan-to‘g‘ri gradusda beradi.','Шкала сразу даёт угол в градусах.','Scale reads the angle in degrees.')],
    [t3('Ko‘ndalang taxtacha','Поперечина','Cross-piece (transom)'),t3('Tayoq bo‘ylab sirpanadi; uchlarida mis uchliklar.','Скользит по посоху; на концах латунные наконечники.','Slides along the staff; brass tips at its ends.')],
    [t3('Ko‘z uchi','Глазной конец','Eye end'),t3('Guruch qalpoq — ko‘z doim bir nuqtada bo‘lishi uchun.','Латунный колпачок — чтобы глаз был в одной точке.','Brass cap that keeps the eye in one place.')],
    [t3('Ko‘rish burchagi','Угол визирования','Sighting angle'),t3('Ko‘zdan taxtacha uchlarigacha bo‘lgan chiziqlar orasidagi burchak.','Угол между лучами от глаза к концам поперечины.','Angle between the lines from eye to the transom ends.')]],
  facts:[t3('Quyoshga to‘g‘ri qarash ko‘zga zarar bo‘lgani uchun keyinchalik orqa bilan turib o‘lchanadigan Devis kvadranti (1594) ixtiro qilindi.','Смотреть на Солнце вредно, поэтому позже изобрели квадрант Дэвиса (1594), где меряют спиной к Солнцу.','Looking at the Sun hurts the eyes, so the back-staff (Davis quadrant, 1594) was invented to measure with your back to it.'),
    t3('Ko‘pincha bitta tayoqqa turli uzunlikdagi 3–4 ta ko‘ndalang taxtacha berilgan — har biri o‘z burchak oralig‘i uchun.','К одному посоху часто давали 3–4 поперечины разной длины — для разных диапазонов углов.','A staff often came with 3–4 transoms of different lengths for different angle ranges.')],
  env:{ sky:'studio', shadow:0.8, size:5, floor:'wood' },
  feat:{ play:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, L=0.9, Y=0.22, HT=0.15;
    const wl=K.wood(c,'#a8754a'), wd=K.wood(c,'#4a2a16'), br=K.brass(c);
    const st=c.texB(2048,64,(x,w,h)=>{ const t=document.createElement('canvas'); t.width=t.height=64; const b=c.rgb('#b78456'); c.paint(t.getContext('2d'),64,[[0,...c.shade(b,0.75)],[1,...c.shade(b,1.15)]],{ oct:4, contrast:2 }); x.drawImage(t,0,0,64,64,0,0,w,h);
      x.strokeStyle=x.fillStyle='rgba(30,16,6,.9)'; x.font='bold 30px serif'; x.textAlign='center';
      for(let a=90;a>=6;a-=1){ const d=HT/Math.tan(a*D/2); if(d>L-0.03) continue; const X=(d/L)*w; x.lineWidth=a%10===0?3:a%5===0?2:1; x.beginPath(); x.moveTo(X,0); x.lineTo(X,a%10===0?h*0.55:a%5===0?h*0.4:h*0.25); x.stroke(); if(a%10===0) x.fillText(a+'°',X,h-8); } });
    mesh(new THREE.BoxGeometry(L,0.016,0.016),M({ map:st, rough:0.55, env:0.7, bump:0.15 }),[0,Y,0]);
    mesh(new THREE.CylinderGeometry(0.011,0.011,0.03,20),br,[-L/2-0.01,Y,0],[0,0,Math.PI/2]);
    [-0.28,0.3].forEach(xx=>{ mesh(new THREE.BoxGeometry(0.1,0.02,0.07),wd,[xx,0.01,0]); K.bar(c,[xx,0.02,0],[xx,Y-0.015,0],0.005,br); [-1,1].forEach(s=>K.bar(c,[xx,Y-0.015,0],[xx,Y+0.004,s*0.012],0.0025,br)); });
    const tr=new THREE.Group(); tr.position.set(0,Y,0); c.root.add(tr);
    mesh(new THREE.BoxGeometry(0.02,2*HT,0.012),wl,null,null,tr); mesh(new THREE.BoxGeometry(0.026,0.024,0.024),wl,null,null,tr);
    [-1,1].forEach(s=>mesh(new THREE.ConeGeometry(0.004,0.012,10),br,[0,s*(HT+0.006),0],[s<0?Math.PI:0,0,0],tr));
    const rm=M({ clean:true, color:0x8fe3ff, emissive:0x2bb6e8, ei:1.2, transparent:true, opacity:0.75 });
    const r1=mesh(new THREE.CylinderGeometry(0.0012,0.0012,1,6),rm,null,null,null,true), r2=mesh(new THREE.CylinderGeometry(0.0012,0.0012,1,6),rm,null,null,null,true);
    const eye=new THREE.Vector3(-L/2-0.025,Y,0), up=new THREE.Vector3(0,1,0);
    const setRay=(m,p)=>{ m.position.copy(eye).add(p).multiplyScalar(0.5); m.scale.set(1,eye.distanceTo(p),1); m.quaternion.setFromUnitVectors(up,p.clone().sub(eye).normalize()); };
    lbl(P[0][0],[-0.3,Y+0.04,0]); lbl(P[1][0],[0,Y+HT+0.03,0]); lbl(P[2][0],[-L/2-0.02,Y+0.04,0]);
    const al=K.lblRef(c,P[3][0],[0,Y,0]);
    let ph=0; anim((t,dt)=>{ if(c.play()) ph+=dt*0.7; const d=0.36+0.25*Math.sin(ph); tr.position.x=-L/2+d; setRay(r1,new THREE.Vector3(-L/2+d,Y+HT,0)); setRay(r2,new THREE.Vector3(-L/2+d,Y-HT,0));
      const ang=2*Math.atan(HT/d)/D; al.p.set(-L/2+d*0.55,Y+HT*0.4,0); al.el.textContent=K.T(P[3][0])+': '+ang.toFixed(1)+'°'; });
    return { cam:[0.15,0.55,0.95], tgt:[0,0.2,0], maxDist:4, minDist:0.15, near:0.01 }; } });

/* ---------------- Osmon globusi ---------------- */
IM.push({ id:'globe', use:['model'], icon:'🔮', yearN:1085,
  name:t3('Osmon globusi','Небесный глобус','Celestial globe'), year:t3('saqlangan eng qadimgisi — 1085-yil','древнейший сохранившийся — 1085 г.','oldest surviving — 1085'),
  who:t3('G‘oya — yunonlar (Gipparx); Ibrohim ibn Said as-Sahliy (Valensiya, 1085)','Идея — греки (Гиппарх); Ибрахим ибн Саид ас-Сахли (Валенсия, 1085)','Idea from the Greeks (Hipparchus); Ibrahim ibn Said al-Sahli (Valencia, 1085)'),
  size:t3('Shar Ø 32 sm, balandligi ~0,8 m','Шар Ø 32 см, высота ~0,8 м','Sphere Ø 32 cm, ~0.8 m tall'),
  short:t3('Yulduz turkumlari tushirilgan shar — osmonni «tashqaridan» ko‘rsatadi','Шар с созвездиями — показывает небо «снаружи»','A sphere mapped with the constellations — the sky seen “from outside”'),
  about:t3('Osmon globusi — yulduzlar va yulduz turkumlari tushirilgan shar. U meridian halqasiga o‘rnatilgan va kenglikka moslab og‘diriladi, gorizont halqasi esa qaysi yulduzlar ko‘rinishini ko‘rsatadi. Sharni aylantirib, yulduzlarning chiqishi, botishi va kulminatsiyasi topiladi. Modeldagi chiziqlar — 88 ta zamonaviy yulduz turkumi; globusdagi tasvir osmonga nisbatan ko‘zguda aks etgandek bo‘ladi.',
    'Небесный глобус — шар со звёздами и созвездиями. Он закреплён в меридианном кольце, которое наклоняют по широте, а кольцо горизонта показывает, какие звёзды видны. Вращая шар, находят восход, заход и кульминацию звёзд. На модели — линии 88 современных созвездий; изображение на глобусе зеркально небу.',
    'A celestial globe is a sphere bearing the stars and constellations. It sits in a meridian ring tilted for the latitude, while the horizon ring shows which stars are up. Turning it gives star risings, settings and culminations. The model shows the 88 modern constellations; a globe shows the sky mirror-reversed.'),
  tasks:[t3('Ma’lum vaqtda qaysi yulduzlar ko‘rinishini aniqlash','Определять, какие звёзды видны в данное время','Find which stars are visible at a given time'),
    t3('Yulduzlarning chiqish va botish vaqtini topish','Находить время восхода и захода звёзд','Find star rising and setting times'),
    t3('Yulduz turkumlarini o‘rganish va o‘rgatish','Изучать и преподавать созвездия','Learn and teach the constellations')],
  how:[t3('Shimoliy qutb gorizont ustida kenglikka teng balandlikka ko‘tariladi (Toshkent — 41°).','Северный полюс поднимают над горизонтом на высоту, равную широте (Ташкент — 41°).','Raise the north pole above the horizon by the latitude (Tashkent — 41°).'),
    t3('Gorizont halqasidagi taqvimdan sana topiladi va Quyosh o‘rni ekliptikada belgilanadi.','По календарю на кольце горизонта находят дату и отмечают Солнце на эклиптике.','Find the date on the horizon ring calendar and mark the Sun on the ecliptic.'),
    t3('Shar Olam o‘qi atrofida aylantiriladi: gorizont ustidagi qism — hozir ko‘rinadigan osmon. «Ishlatib ko‘rish» bir kecha aylanishini ko‘rsatadi.','Шар вращают вокруг оси мира: часть над горизонтом — видимое сейчас небо. «Показать в работе» прокручивает ночь.','Turn the globe on its axis: the part above the horizon is the sky now visible. “See it work” runs through a night.')],
  parts:[[t3('Yulduzlar shari','Звёздный шар','Star sphere'),t3('Turkum chiziqlari va kumush yulduz nuqtalari, ekvator va ekliptika.','Линии созвездий и серебряные звёзды, экватор и эклиптика.','Constellation lines, silver stars, equator and ecliptic.')],
    [t3('Meridian halqasi','Меридианное кольцо','Meridian ring'),t3('Graduslangan halqa — qutbni kenglikka moslab ko‘taradi.','Градуированное кольцо — поднимает полюс по широте.','Graduated ring that sets the pole to the latitude.')],
    [t3('Gorizont halqasi','Кольцо горизонта','Horizon ring'),t3('Oylar, zodiak va tomonlar yozilgan keng halqa.','Широкое кольцо с месяцами, зодиаком и сторонами света.','Wide ring with months, zodiac and compass points.')],
    [t3('Olam o‘qi','Ось мира','Celestial axis'),t3('Shar shu o‘q atrofida aylanadi.','Шар вращается вокруг этой оси.','The sphere turns on this axis.')],
    [t3('Tayanch oyoqlar','Опоры','Stand'),t3('To‘rt yo‘nilgan oyoq va dumaloq asos.','Четыре точёные ножки и круглое основание.','Four turned legs and a round base.')]],
  facts:[t3('Abdurahmon as-Sufiy «Qo‘zg‘almas yulduzlar kitobi»da (964) har bir turkumni globusdagidek va osmondagidek — ikki xil ko‘rinishda chizgan.','Ас-Суфи в «Книге неподвижных звёзд» (964) рисовал каждое созвездие дважды — как на глобусе и как на небе.','Al-Sufi’s Book of Fixed Stars (964) drew each constellation twice — as on a globe and as in the sky.'),
    t3('Farnese Atlasi (Rim nusxasi, II asr) yelkasida ko‘tarib turgan sharda yulduz turkumlari tasvirlangan — eng qadimgi osmon globusi tasviri.','Атлас Фарнезе (римская копия II в.) держит шар с созвездиями — древнейшее изображение небесного глобуса.','The Farnese Atlas (2nd-century Roman copy) carries a globe of constellations — the oldest surviving depiction of one.')],
  env:{ sky:'studio', shadow:1.0, size:7, floor:'wood' },
  feat:{ play:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, LAT=41.3, CY=0.56, RG=0.16;
    const br=K.brass(c), wd=K.wood(c,'#4e2c16');
    const gt=c.texB(2048,1024,(x,w,h)=>{ const b=c.rgb('#bf9550'); c.paint(x,512,[[0,...c.shade(b,0.78)],[0.5,...b],[1,...c.shade(b,1.12)]],{ oct:6, speck:10 }); x.drawImage(x.canvas,0,0,512,512,0,0,w,h);
      const X=ra=>(1-ra/24)*w, Y=dec=>(90-dec)/180*h; x.strokeStyle='rgba(45,28,10,.85)'; x.lineWidth=2.6; x.beginPath(); x.moveTo(0,Y(0)); x.lineTo(w,Y(0)); x.stroke();
      x.lineWidth=2; x.beginPath(); for(let i=0;i<=360;i++){ const ra=i/15, dec=Math.atan(Math.tan(23.44*D)*Math.sin(i*D))/D; x.lineTo(X(ra),Y(dec)); } x.stroke();
      [23.44,-23.44,66.56,-66.56].forEach(d=>{ x.lineWidth=1; x.setLineDash([8,6]); x.beginPath(); x.moveTo(0,Y(d)); x.lineTo(w,Y(d)); x.stroke(); }); x.setLineDash([]);
      for(let r=0;r<24;r+=2){ x.lineWidth=0.8; x.beginPath(); x.moveTo(X(r),0); x.lineTo(X(r),h); x.stroke(); }
      const pts=[]; (window.SKY_CONSTELLATIONS||[]).forEach(cn=>{ x.lineWidth=1.8; cn.l.forEach(seg=>{ x.beginPath(); seg.forEach((p,i)=>{ const px=X(p[0]), py=Y(p[1]); if(i&&Math.abs(seg[i-1][0]-p[0])>12) x.moveTo(px,py); else x[i?'lineTo':'moveTo'](px,py); pts.push([px,py]); }); x.stroke(); }); });
      pts.forEach(([px,py])=>{ x.fillStyle='rgba(45,28,10,.9)'; x.beginPath(); x.arc(px,py,5,0,7); x.fill(); x.fillStyle='#e8ecef'; x.beginPath(); x.arc(px,py,3.2,0,7); x.fill(); }); });
    // asos, oyoqlar
    K.lathe(c,[[0,0],[0.27,0],[0.27,0.03],[0.25,0.045],[0,0.045]],wd);
    for(let i=0;i<4;i++){ const a=i*Math.PI/2+Math.PI/4; K.lathe(c,[[0,0],[0.02,0],[0.014,0.06],[0.02,0.14],[0.011,0.26],[0.014,CY-0.06],[0.01,CY-0.012],[0,CY-0.012]],wd,[Math.cos(a)*0.215,0.045,Math.sin(a)*0.215],null,16); }
    K.lathe(c,[[0,0.045],[0.05,0.045],[0.03,0.09],[0.018,0.2],[0.024,0.3],[0.014,CY-RG-0.03],[0,CY-RG-0.03]],wd);
    // gorizont halqasi: qog'oz taqvim
    const HR0=0.24, HR1=0.185, ht=c.tex(1024,1024,(x,w)=>{ const s=w/(2*HR0), cx=w/2; x.fillStyle='#ebe0c2'; x.fillRect(0,0,w,w); x.strokeStyle=x.fillStyle='#3b2a14';
      [HR0-0.003,HR1+0.003,0.225,0.207].forEach(r=>K.ring(x,cx,cx,r*s,2)); K.scale(x,cx,cx,0.225*s,(HR0-0.003)*s,360,{ long:i=>i%30===0, mid:i=>i%5===0 });
      const Mo=['YANVAR','FEVRAL','MART','APREL','MAY','IYUN','IYUL','AVGUST','SENTABR','OKTABR','NOYABR','DEKABR'];
      K.scale(x,cx,cx,0.207*s,0.225*s,12,{ long:()=>true, lab:i=>Mo[i], lr:0.216*s, font:'bold 16px serif' });
      const Z=['ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITT.','CAPRIC.','AQUAR.','PISCES']; K.scale(x,cx,cx,(HR1+0.003)*s,0.207*s,12,{ long:()=>true, lab:i=>Z[i], lr:0.196*s, font:'14px serif' }); });
    K.ext(c,K.annulus(c,HR0,HR1),0.012,M({ map:K.fit(ht,-HR0,-HR0,2*HR0), rough:0.55, env:0.6, bump:0.04 }),[0,CY,0],[-Math.PI/2,0,0]).position.y=CY;
    mesh(new THREE.TorusGeometry((HR0+HR1)/2,0.004,6,96),wd,[0,CY-0.006,0],[Math.PI/2,0,0]);
    // meridian halqasi
    const RM=0.172, mt=K.plate(c,1024,'#c09a58',(x,w)=>{ const s=w/(2*(RM+0.007)), cx=w/2; K.scale(x,cx,cx,(RM-0.006)*s,(RM+0.004)*s,360,{ long:i=>i%10===0, mid:i=>i%5===0 }); K.ring(x,cx,cx,(RM-0.006)*s,1.6); });
    K.ext(c,K.annulus(c,RM+0.007,RM-0.007),0.005,M({ map:K.fit(mt,-(RM+0.007),-(RM+0.007),2*(RM+0.007)), metal:0.95, rough:0.3, env:1.3, bump:0.03 }),[-0.0025,CY,0],[0,Math.PI/2,0]);
    const tilt=new THREE.Group(); tilt.position.y=CY; tilt.rotation.x=-(90-LAT)*D; c.root.add(tilt); const spin=new THREE.Group(); tilt.add(spin);
    mesh(new THREE.SphereGeometry(RG,128,64),M({ map:gt, metal:0.9, rough:0.34, env:1.25, bump:0.04 }),null,null,spin);
    K.bar(c,[0,-RM-0.004,0],[0,RM+0.004,0],0.0035,br,tilt); [1,-1].forEach(s=>mesh(new THREE.CylinderGeometry(0.012,0.012,0.004,24),br,[0,s*(RG+0.003),0],null,tilt));
    lbl(P[0][0],[0.06,CY+0.17,0.08]); lbl(P[1][0],[0,CY+RM+0.03,0.02]); lbl(P[2][0],[0.21,CY+0.02,0.12]); lbl(P[3][0],[0,CY+Math.sin(LAT*D)*0.2,-Math.cos(LAT*D)*0.2]); lbl(P[4][0],[0.2,0.22,0.12]);
    anim((t,dt)=>{ spin.rotation.y+=dt*(c.play()?0.8:0.05); });
    return { cam:[0.72,0.86,0.82], tgt:[0,0.5,0], maxDist:5, minDist:0.22, near:0.01 }; } });
})();
