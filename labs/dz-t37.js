/* DARSLIK · 37-mavzu (73-§). Kosmik apparatlarni Oyga uchirish */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU, D2R=K0.D2R;
const KE=3.986e5, RE=6370, RM=384400, VM=1.018, KM=4.903e3, RMo=1737, SOIM=66000;
const TX={
 title:X('Kosmik apparatlarni Oyga uchirish','Полёт космических аппаратов к Луне','Sending spacecraft to the Moon'),
 sub:X('73-§ · Oraliq orbita, gomon (yarim elliptik) o‘tish trayektoriyasi, perigey va apogey tezliklari, qo‘shimcha impuls 3,134 km/s, Oy ta’sir sferasiga kirish tezligi, giperbolik yaqinlashish, Oy yo‘ldoshiga aylantirish, uchish vaqti ≈ 5 sutka','§73 · Промежуточная орбита, гомановская (полуэллиптическая) траектория перелёта, скорости в перигее и апогее, дополнительный импульс 3,134 км/с, скорость входа в сферу действия Луны, гиперболическое сближение, выход на орбиту спутника Луны, время полёта ≈ 5 суток','§73 · Parking orbit, the Hohmann (half-ellipse) transfer, perigee and apogee speeds, the extra 3.134 km/s impulse, entry speed into the Moon’s sphere, hyperbolic approach, capture into lunar orbit, ≈ 5-day flight time'),
 intro:X('KAni Oyga uchirish uchun avval uni Oy orbitasi tekisligida yotuvchi, kamida 200 km balandlikdagi Yer atrofi <b>oraliq orbitasiga</b> chiqarish kerak (123-rasm). O‘tish orbitalari ichida eng kam energiya sarfi bilan uchish — <b>yarim elliptik (gomon) trayektoriya</b> bo‘ylab: uning perigeyi oraliq orbitada, apogeyi Oy orbitasida yotadi.','Чтобы отправить КА к Луне, его сначала выводят на околоземную <b>промежуточную орбиту</b> в плоскости орбиты Луны, высотой не менее 200 км (рис. 123). Из всех орбит перелёта наименьших затрат требует <b>полуэллиптическая (гомановская) траектория</b>: её перигей лежит на промежуточной орбите, апогей — на орбите Луны.','To send a craft to the Moon it is first put into a <b>parking orbit</b> around Earth, in the plane of the Moon’s orbit and at least 200 km high (Fig. 123). Of all transfer orbits the cheapest is the <b>half-ellipse (Hohmann) path</b>: its perigee lies on the parking orbit and its apogee on the Moon’s orbit.'),
 s1:X('O‘tish trayektoriyasini hisoblash','Расчёт траектории перелёта','Computing the transfer'),
 s1D:X('Oraliq orbitadagi tezlik: <b>υ₁ = √(K⊕/(R⊕ + h))</b> = 7,789 km/s (h = 200 km). Oy orbitasining o‘rtacha radiusi r = 384 400 km, Oyning orbital tezligi 1,018 km/s. O‘tish ellipsining katta yarim o‘qi: <b>a = (r + R⊕ + h)/2</b> = 195 485 km. Energiya integralidan perigeydagi tezlik <b>υ_p = √(K⊕(2/(R⊕+h) − 1/a))</b> = 10,923 km/s, demak qo‘shimcha impuls <b>Δυ = υ_p − υ₁</b> = 3,134 km/s (bevosita Yer sirtidan esa 11,09 km/s kerak bo‘lardi). Apogeydagi tezlik <b>υ_A = √(K⊕(2/r − 1/a))</b> = 0,187 km/s. Uchish vaqti — ellips davrining yarmi: <b>T = 2π·a^3/2/√K⊕</b> = 9 sutka 22 soat 56 min, <b>t = T/2</b> = 4 sutka 23 soat 28 min.','Скорость на промежуточной орбите: <b>υ₁ = √(K⊕/(R⊕ + h))</b> = 7,789 км/с (h = 200 км). Средний радиус орбиты Луны r = 384 400 км, её орбитальная скорость 1,018 км/с. Большая полуось эллипса перелёта: <b>a = (r + R⊕ + h)/2</b> = 195 485 км. По интегралу энергии скорость в перигее <b>υ_p = √(K⊕(2/(R⊕+h) − 1/a))</b> = 10,923 км/с, значит дополнительный импульс <b>Δυ = υ_p − υ₁</b> = 3,134 км/с (прямо с поверхности понадобилось бы 11,09 км/с). Скорость в апогее <b>υ_A = √(K⊕(2/r − 1/a))</b> = 0,187 км/с. Время полёта — половина периода эллипса: <b>T = 2π·a^3/2/√K⊕</b> = 9 сут 22 ч 56 мин, <b>t = T/2</b> = 4 сут 23 ч 28 мин.','Parking-orbit speed: <b>υ₁ = √(K⊕/(R⊕ + h))</b> = 7.789 km/s (h = 200 km). The Moon’s mean orbital radius is r = 384 400 km and its orbital speed 1.018 km/s. The transfer ellipse’s semi-major axis: <b>a = (r + R⊕ + h)/2</b> = 195 485 km. From the energy integral the perigee speed is <b>υ_p = √(K⊕(2/(R⊕+h) − 1/a))</b> = 10.923 km/s, so the extra impulse is <b>Δυ = υ_p − υ₁</b> = 3.134 km/s (straight from the surface 11.09 km/s would be needed). Apogee speed <b>υ_A = √(K⊕(2/r − 1/a))</b> = 0.187 km/s. Flight time is half the ellipse’s period: <b>T = 2π·a^3/2/√K⊕</b> = 9 d 22 h 56 min, <b>t = T/2</b> = 4 d 23 h 28 min.'),
 h:X('Oraliq orbita balandligi h','Высота промежуточной орбиты h','Parking-orbit height h'), v1:X('Oraliq orbitadagi tezlik υ₁','Скорость на промежуточной орбите υ₁','Parking speed υ₁'), a:X('Katta yarim o‘q a','Большая полуось a','Semi-major axis a'), vp:X('Perigeydagi tezlik υ_p','Скорость в перигее υ_p','Perigee speed υ_p'), dv:X('Qo‘shimcha impuls Δυ','Дополнительный импульс Δυ','Extra impulse Δυ'), va:X('Apogeydagi tezlik υ_A','Скорость в апогее υ_A','Apogee speed υ_A'), vrel:X('Oyga nisbatan tezlik (sferaga kirish)','Скорость относительно Луны (вход в сферу)','Speed relative to the Moon (sphere entry)'), tt:X('Uchish vaqti t = T/2','Время полёта t = T/2','Flight time t = T/2'), d:X('sut','сут','d'), hr:X('soat','ч','h'),
 moon:X('Oy','Луна','Moon'), earth:X('Yer','Земля','Earth'), park:X('oraliq orbita','промежуточная орбита','parking orbit'), tr:X('o‘tish trayektoriyasi','траектория перелёта','transfer path'), soi:X('Oy ta’sir sferasi','сфера действия Луны','Moon’s sphere'),
 s2:X('Oy ta’sir sferasi ichida','Внутри сферы действия Луны','Inside the Moon’s sphere'),
 s2D:X('KA Oy orbitasining biror nuqtasiga Oy bilan bir vaqtda yetganda, uning Oyga nisbatan tezligi <b>Δυ = υ_Oy − υ_A</b> = 1,018 − 0,187 = 0,831 km/s. Oy ta’sir sferasi (r = 66 000 km) chegarasida Oyga nisbatan parabolik tezlik ≈ 383 m/s; 831 m/s undan katta, shuning uchun KA sfera ichida <b>giperbolik trayektoriya</b> bo‘ylab harakatlanadi va Oyga yaqinlashgan sari tezlashadi. Kirish yo‘nalishiga qarab KA yo <b>Oyga uriladi</b> (tezligi 2,5 km/s dan kam emas), yo Oyni aylanib o‘tib, kirish tezligiga teng tezlik bilan sferadan <b>chiqib ketadi</b>. KAni Oy yo‘ldoshiga aylantirish uchun Oy yaqinida (h ≈ 50 km) bort dvigateli bilan tezlik 1,6–1,8 km/s gacha <b>tormozlanadi</b>.','Когда КА достигает точки орбиты Луны одновременно с ней, его скорость относительно Луны <b>Δυ = υ_Л − υ_A</b> = 1,018 − 0,187 = 0,831 км/с. На границе сферы действия Луны (r = 66 000 км) параболическая скорость относительно Луны ≈ 383 м/с; 831 м/с больше, поэтому внутри сферы КА движется по <b>гиперболе</b>, разгоняясь по мере приближения. В зависимости от направления входа КА либо <b>врезается в Луну</b> (со скоростью не менее 2,5 км/с), либо облетает её и <b>выходит</b> из сферы со скоростью, равной скорости входа. Чтобы сделать КА спутником Луны, вблизи неё (h ≈ 50 км) скорость бортовым двигателем <b>гасят</b> до 1,6–1,8 км/с.','When the craft reaches a point on the Moon’s orbit together with the Moon, its speed relative to the Moon is <b>Δυ = υ_Moon − υ_A</b> = 1.018 − 0.187 = 0.831 km/s. At the boundary of the Moon’s sphere (r = 66 000 km) the parabolic speed relative to the Moon is ≈ 383 m/s; 831 m/s exceeds it, so inside the sphere the craft follows a <b>hyperbola</b>, speeding up as it closes in. Depending on the entry direction it either <b>hits the Moon</b> (at no less than 2.5 km/s) or swings round and <b>leaves</b> the sphere at its entry speed. To become a lunar satellite it <b>brakes</b> with its engine near the Moon (h ≈ 50 km) to 1.6–1.8 km/s.'),
 b:X('Nishon masofasi (Oy markazidan)','Прицельное расстояние (от центра Луны)','Aim distance (from the Moon’s centre)'), cap:X('Tormozlash (h ≈ 50 km)','Торможение (h ≈ 50 км)','Brake (h ≈ 50 km)'),
 res:X('Natija','Результат','Outcome'), rHit:X('Oyga uriladi','врезается в Луну','hits the Moon'), rFly:X('Oyni aylanib o‘tib, sferadan chiqadi','облетает Луну и выходит из сферы','swings round and leaves'), rCap:X('Oy yo‘ldoshiga aylandi','стал спутником Луны','captured into lunar orbit'),
 vpar:X('Sfera chegarasida parabolik tezlik','Параболическая скорость на границе сферы','Parabolic speed at the boundary'), rp:X('Periseleniy balandligi','Высота периселения','Periselene height'), vper:X('Periseleniydagi tezlik','Скорость в периселении','Periselene speed'), vimp:X('Urilish tezligi','Скорость удара','Impact speed'), dvc:X('Aylanma orbita uchun tormozlash','Торможение для круговой орбиты','Braking for a circular orbit'),
 on:X('yoqilgan','вкл.','on'), off:X('o‘chirilgan','выкл.','off')
};
const GL=[
 [X('Oraliq orbita','Промежуточная орбита','Parking orbit'),X('Oy orbitasi tekisligidagi, kamida 200 km balandlikdagi Yer atrofi orbitasi.','Околоземная орбита в плоскости орбиты Луны, высотой не менее 200 км.','An Earth orbit in the Moon’s orbital plane, at least 200 km high.')],
 [X('Gomon trayektoriyasi','Гомановская траектория','Hohmann trajectory'),X('Perigeyi oraliq, apogeyi maqsad orbitasida yotgan yarim ellips — eng tejamli o‘tish.','Полуэллипс с перигеем на промежуточной и апогеем на целевой орбите — самый экономный перелёт.','A half-ellipse from the parking orbit to the target orbit — the cheapest transfer.')],
 [X('Qo‘shimcha impuls','Дополнительный импульс','Extra impulse'),X('Oraliq orbitadan o‘tish orbitasiga o‘tish uchun: 3,134 km/s.','Для перехода с промежуточной орбиты на орбиту перелёта: 3,134 км/с.','To go from the parking orbit onto the transfer: 3.134 km/s.')],
 [X('Oy ta’sir sferasi','Сфера действия Луны','Moon’s sphere of influence'),X('Radiusi 66 000 km; ichida KA Oyga nisbatan harakatlanadi deb qaraladi.','Радиус 66 000 км; внутри неё движение КА рассматривают относительно Луны.','Radius 66 000 km; inside it the motion is taken relative to the Moon.')],
 [X('Giperbolik yaqinlashish','Гиперболическое сближение','Hyperbolic approach'),X('Kirish tezligi (0,831 km/s) parabolikdan (0,383 km/s) katta — trayektoriya giperbola.','Скорость входа (0,831 км/с) больше параболической (0,383 км/с) — траектория гипербола.','Entry speed (0.831 km/s) exceeds parabolic (0.383 km/s), so the path is a hyperbola.')],
 [X('Uchish vaqti','Время полёта','Flight time'),X('O‘tish ellipsi davrining yarmi: ≈ 4 sutka 23 soat 28 min.','Половина периода эллипса перелёта: ≈ 4 сут 23 ч 28 мин.','Half the transfer ellipse’s period: ≈ 4 d 23 h 28 min.')]
];
const QA=[
 [X('Oyga uchish uchun KA avval qanday orbitaga chiqariladi?','На какую орбиту сначала выводят КА для полёта к Луне?','What orbit is the craft placed in first?'),X('Oy orbitasi tekisligidagi, kamida 200 km balandlikdagi oraliq orbitaga.','На промежуточную орбиту в плоскости орбиты Луны высотой не менее 200 км.','A parking orbit in the Moon’s orbital plane, at least 200 km high.')],
 [X('Oraliq orbitadan Oyga yo‘l olish uchun qancha qo‘shimcha tezlik kerak?','Какая дополнительная скорость нужна для старта к Луне с промежуточной орбиты?','What extra speed is needed to leave the parking orbit for the Moon?'),X('Δυ = υ_p − υ₁ = 10,923 − 7,789 ≈ 3,134 km/s.','Δυ = υ_p − υ₁ = 10,923 − 7,789 ≈ 3,134 км/с.','Δυ = υ_p − υ₁ = 10.923 − 7.789 ≈ 3.134 km/s.')],
 [X('Nega Oy ta’sir sferasida trayektoriya giperbolik bo‘ladi?','Почему в сфере действия Луны траектория гиперболическая?','Why is the path hyperbolic inside the Moon’s sphere?'),X('Oyga nisbatan kirish tezligi 0,831 km/s, sfera chegarasidagi parabolik tezlik 0,383 km/s dan katta.','Скорость входа относительно Луны 0,831 км/с больше параболической на границе сферы 0,383 км/с.','The entry speed relative to the Moon, 0.831 km/s, exceeds the 0.383 km/s parabolic speed there.')],
 [X('KAni Oy yo‘ldoshiga qanday aylantiriladi?','Как сделать КА спутником Луны?','How is the craft made a lunar satellite?'),X('Oy yaqinida (h ≈ 50 km) bort dvigatelini yoqib, tezlikni 1,6–1,8 km/s gacha tormozlab.','Включив бортовой двигатель вблизи Луны (h ≈ 50 км) и затормозив до 1,6–1,8 км/с.','By firing its engine near the Moon (h ≈ 50 km) to slow to 1.6–1.8 km/s.')],
 [X('Gomon trayektoriyasi bo‘ylab Oyga uchish vaqti qancha?','Сколько длится полёт к Луне по гомановской траектории?','How long is the Hohmann flight to the Moon?'),X('Ellips davrining yarmi: T = 9 sut 22 soat 56 min, t ≈ 4 sutka 23 soat 28 min.','Половина периода: T = 9 сут 22 ч 56 мин, t ≈ 4 сут 23 ч 28 мин.','Half the period: T = 9 d 22 h 56 min, so t ≈ 4 d 23 h 28 min.')]
];
const QZ=[
 [X('200 km li oraliq orbitadagi tezlik:','Скорость на промежуточной орбите 200 км:','Speed in a 200 km parking orbit:'),[X('7,79 km/s','7,79 км/с','7.79 km/s'),X('10,92 km/s','10,92 км/с','10.92 km/s'),X('11,19 km/s','11,19 км/с','11.19 km/s')]],
 [X('O‘tish ellipsining perigeydagi tezligi:','Скорость в перигее эллипса перелёта:','Perigee speed of the transfer ellipse:'),[X('10,923 km/s','10,923 км/с','10.923 km/s'),X('7,789 km/s','7,789 км/с','7.789 km/s'),X('3,134 km/s','3,134 км/с','3.134 km/s')]],
 [X('O‘tish ellipsining katta yarim o‘qi:','Большая полуось эллипса перелёта:','Semi-major axis of the transfer ellipse:'),[X('195 485 km','195 485 км','195 485 km'),X('384 400 km','384 400 км','384 400 km'),X('66 000 km','66 000 км','66 000 km')]],
 [X('Apogeydagi tezlik υ_A ≈','Скорость в апогее υ_A ≈','Apogee speed υ_A ≈'),[X('0,187 km/s','0,187 км/с','0.187 km/s'),X('1,018 km/s','1,018 км/с','1.018 km/s'),X('0,831 km/s','0,831 км/с','0.831 km/s')]],
 [X('Oy ta’sir sferasiga kirish tezligi (Oyga nisbatan):','Скорость входа в сферу Луны (относительно Луны):','Entry speed into the Moon’s sphere (relative):'),[X('0,831 km/s','0,831 км/с','0.831 km/s'),X('0,383 km/s','0,383 км/с','0.383 km/s'),X('2,5 km/s','2,5 км/с','2.5 km/s')]],
 [X('Oyga urilishda tezlik:','Скорость при ударе о Луну:','Speed when hitting the Moon:'),[X('2,5 km/s dan kam emas','не менее 2,5 км/с','at least 2.5 km/s'),X('≈ 0,2 km/s','≈ 0,2 км/с','≈ 0.2 km/s'),X('≈ 11 km/s','≈ 11 км/с','≈ 11 km/s')]],
 [X('Oyga uchish vaqti (gomon):','Время полёта к Луне (Гоман):','Flight time to the Moon (Hohmann):'),[X('≈ 5 sutka','≈ 5 суток','≈ 5 days'),X('≈ 10 sutka','≈ 10 суток','≈ 10 days'),X('≈ 1 sutka','≈ 1 сутки','≈ 1 day')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,$,fmtN,C,fit,sec,chips,mark,on}=K;
  const kv=(k,v,f)=>K.kv(String(k).split(' ').map(w=>/[_\u0370-\u03FF\u2080-\u209F⊕☉∞′\/]|^[A-Za-z]$/.test(w)?'<span style="text-transform:none">'+w+'</span>':w).join(' '),v,f);
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const rng=(id,lab,min,max,step,val)=>`<label class="t1-ctl"><span>${T(lab)}: <b id="${id}V"></b></span><input type="range" class="lab-range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  const dhm=s=>{ const d=Math.floor(s/86400), hh=Math.floor(s%86400/3600), m=Math.round(s%3600/60); return d+' '+T(TX.d)+' '+hh+' '+T(TX.hr)+' '+m+' min'; };
  const kep=(M,e)=>{ let E=M+e*Math.sin(M); for(let k=0;k<20;k++) E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E)); return E; };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-formula">a = (r + R⊕ + h)/2 · υ_p = √(K(2/(R⊕+h) − 1/a)) · Δυ = υ_p − υ₁ · t = π √(a³/K)</div>
    <div class="dz-card t4-m">${rng('t37H',TX.h,200,2000,10,200)}<canvas class="t1-cv" id="t37T"></canvas><div class="lab-kv" id="t37TKv"></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t37M"></canvas></div>
      <div class="t1-side">${rng('t37B',TX.b,500,20000,50,6000)}<div class="lab-row" style="margin:0">${chips('cp',[[1,T(TX.cap)]])}</div><div class="lab-kv" id="t37MKv"></div></div></div>`)}
  ${sec('03',K.U.gl,K.glHTML(GL))}
  ${sec('04',K.U.qa,K.qaHTML(QA))}
  ${sec('05',K.U.test,`<div class="dz-card t1-quiz" id="t37Quiz"></div>`)}`;

  /* 01 · Gomon o'tish trayektoriyasi */
  let tu=0;
  const orb=()=>{ const hh=+$('#t37H').value, r0=RE+hh, a=(RM+r0)/2, e=(RM-r0)/(RM+r0), v1=Math.sqrt(KE/r0), vp=Math.sqrt(KE*(2/r0-1/a)), va=Math.sqrt(KE*(2/RM-1/a)), Tp=TAU*Math.sqrt(a**3/KE); return {hh,r0,a,e,b:a*Math.sqrt(1-e*e),v1,vp,va,Tp}; };
  const drawT=K.draw(function(){ const cv=$('#t37T'); const {x,w,h}=fit(cv,.5,380), o=orb();
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const s=Math.min(w*.44,h*.46)/RM, cx=w*.52, cy=h/2, P=(px,py)=>[cx+px*s,cy-py*s], nM=TAU/(27.32*86400), tf=o.Tp/2;
    x.strokeStyle='rgba(207,207,207,.45)'; x.lineWidth=1.2; x.beginPath(); x.arc(cx,cy,RM*s,0,TAU); x.stroke();
    const ep=E=>P(o.a*(Math.cos(E)-o.e)*-1,o.b*Math.sin(E)*-1);
    x.setLineDash([4,5]); x.strokeStyle='rgba(255,198,92,.4)'; x.beginPath(); for(let k=0;k<=120;k++){ const q=ep(Math.PI*k/120); k?x.lineTo(...q):x.moveTo(...q); } x.stroke(); x.setLineDash([]);
    const M=Math.PI*tu, E=kep(M,o.e); x.strokeStyle='#ffc65c'; x.lineWidth=2.2; x.beginPath(); for(let k=0;k<=80;k++){ const q=ep(kep(M*k/80,o.e)); k?x.lineTo(...q):x.moveTo(...q); } x.stroke();
    [1,2,3,4].forEach(dd=>{ const t=dd*86400; if(t>=tf*.92) return; const q=ep(kep(Math.PI*t/tf,o.e)), an=Math.atan2(q[1]-cy,q[0]-cx); dot(x,q[0],q[1],2.5,'#ffc65c'); lbl(x,dd+' '+T(TX.d),q[0]+16*Math.cos(an),q[1]+16*Math.sin(an)+4,'rgba(255,214,140,.85)'); });
    lbl(x,'t = '+fmtN(tf/86400,1)+' '+T(TX.d),10,18,'#ffc65c','left');
    const g=x.createRadialGradient(cx-4,cy-4,0,cx,cy,9); g.addColorStop(0,'#6fb0ff'); g.addColorStop(1,'#16336a'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,9,0,TAU); x.fill();
    x.strokeStyle='rgba(111,176,255,.6)'; x.beginPath(); x.arc(cx,cy,Math.max(12,o.r0*s),0,TAU); x.stroke(); lbl(x,T(TX.earth),cx,cy+26,'#6fb0ff');
    const mA=-nM*tf*(1-tu), mq=[cx+RM*s*Math.cos(mA),cy-RM*s*Math.sin(mA)];
    x.setLineDash([2,3]); x.strokeStyle='rgba(207,207,207,.6)'; x.beginPath(); x.arc(mq[0],mq[1],SOIM*s,0,TAU); x.stroke(); x.setLineDash([]);
    dot(x,mq[0],mq[1],5,'#cfcfcf'); lbl(x,T(TX.moon),mq[0],mq[1]-SOIM*s-6,'#cfcfcf');
    const cq=ep(E); dot(x,cq[0],cq[1],4,'#fff');
    const qm=ep(Math.PI*.62); lbl(x,T(TX.tr),qm[0],qm[1]-10,'#ffc65c'); lbl(x,T(TX.soi),10,h-10,'rgba(207,207,207,.6)','left'); });
  const setT=()=>{ const o=orb(); $('#t37HV').textContent=fmtN(o.hh)+' km';
    $('#t37TKv').innerHTML=kv(T(TX.v1),fmtN(o.v1,3)+' km/s')+kv(T(TX.a),fmtN(o.a)+' km')+kv(T(TX.vp),fmtN(o.vp,3)+' km/s')+kv(T(TX.dv),fmtN(o.vp-o.v1,3)+' km/s')+kv(T(TX.va),fmtN(o.va,3)+' km/s')+kv(T(TX.vrel),fmtN(VM-o.va,3)+' km/s')+kv('T',dhm(o.Tp))+kv(T(TX.tt),dhm(o.Tp/2)); };
  $('#t37H').oninput=()=>{ setT(); drawT(); }; setT();

  /* 02 · Oy ta'sir sferasi */
  let cap=false, mu=0;
  const hyp=()=>{ const vi=VM-orb().va, b=+$('#t37B').value, q=b*vi*vi/KM, rp=KM/(vi*vi)*(Math.sqrt(1+q*q)-1), e=1+rp*vi*vi/KM, vpar=Math.sqrt(2*KM/SOIM), vper=Math.sqrt(vi*vi+2*KM/rp); return {vi,b,rp,e,vpar,vper,hit:rp<RMo,vimp:Math.sqrt(vi*vi+2*KM/RMo)}; };
  const drawM=K.draw(function(){ const cv=$('#t37M'); const {x,w,h}=fit(cv,.8,400), o=hyp();
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const Rs=Math.min(w,h)*.45, cx=w/2, cy=h/2, rr=r=>Rs*Math.sqrt(r/SOIM), R0=rr(RMo);
    x.setLineDash([4,4]); x.strokeStyle='rgba(207,207,207,.55)'; x.beginPath(); x.arc(cx,cy,Rs,0,TAU); x.stroke(); x.setLineDash([]); lbl(x,T(TX.soi)+' · 66 000 km',cx,cy-Rs-6,'rgba(207,207,207,.7)');
    const g=x.createRadialGradient(cx-R0*.3,cy-R0*.3,0,cx,cy,R0); g.addColorStop(0,'#e8e8e8'); g.addColorStop(1,'#6a6a6a'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,R0,0,TAU); x.fill();
    const p=o.rp*(1+o.e), nus=Math.acos(Math.max(-1,Math.min(1,(p/SOIM-1)/o.e))), Q=(r,a)=>[cx+rr(r)*Math.cos(a),cy-rr(r)*Math.sin(a)], rot=-Math.PI/2;
    const pts=[]; let hitAt=null; for(let k=0;k<=200;k++){ const nu=-nus+2*nus*k/200, r=p/(1+o.e*Math.cos(nu)); if(r<RMo){ hitAt=k; break; } pts.push([r,nu+rot]); }
    const N=pts.length; const capK=cap&&!o.hit?Math.floor(N/2):N;
    x.strokeStyle='#ffc65c'; x.lineWidth=2; x.beginPath(); for(let k=0;k<capK;k++){ const q=Q(...pts[k]); k?x.lineTo(...q):x.moveTo(...q); } x.stroke();
    if(cap&&!o.hit){ x.strokeStyle='#5fd39a'; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,rr(o.rp),0,TAU); x.stroke(); }
    const i=Math.min(capK-1,Math.floor(mu*capK)); let sp;
    if(cap&&!o.hit&&mu>=1){ const t=(mu-1)*TAU; sp=Q(o.rp,rot+t); } else sp=Q(...pts[Math.max(0,i)]);
    if(o.hit&&mu>=.999){ x.fillStyle='rgba(255,122,60,.5)'; x.beginPath(); x.arc(sp[0],sp[1],9,0,TAU); x.fill(); }
    dot(x,sp[0],sp[1],4,'#fff');
    const e0=Q(...pts[0]); lbl(x,'υ = '+fmtN(o.vi*1000)+' m/s',e0[0]+8,e0[1]+4,'#ffc65c','left'); });
  const setM=()=>{ const o=hyp(); $('#t37BV').textContent=fmtN(o.b)+' km'; mark('cp',cap?1:''); const vc=Math.sqrt(KM/o.rp);
    $('#t37MKv').innerHTML=kv(T(TX.vpar),fmtN(o.vpar*1000)+' m/s')+kv('υ_kir',fmtN(o.vi*1000)+' m/s')+(o.hit?kv(T(TX.vimp),fmtN(o.vimp,2)+' km/s'):kv(T(TX.rp),fmtN(o.rp-RMo)+' km')+kv(T(TX.vper),fmtN(o.vper,2)+' km/s')+kv(T(TX.dvc),fmtN(o.vper-vc,2)+' km/s → '+fmtN(vc,2)+' km/s'))+kv(T(TX.res),T(o.hit?TX.rHit:cap?TX.rCap:TX.rFly),true); };
  $('#t37B').oninput=()=>{ mu=0; setM(); drawM(); }; on('cp',()=>{ cap=!cap; mu=0; setM(); drawM(); }); setM();

  let last=performance.now();
  const loop=n=>{ const dt=Math.min(.05,Math.max(0,(n-last)/1000)); last=n; tu=(tu+dt/8)%1; const o=hyp(); mu+=dt/6; if(mu>(cap&&!o.hit?3:1.4)) mu=0; drawT(); drawM(); K.rafs.l=requestAnimationFrame(loop); };
  K.rafs.l=requestAnimationFrame(loop);
  K.bindQA(); K.quiz($('#t37Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t37', GL, QZ, ico:'🌙', title:TX.title, sub:TX.sub, build });
}; go0();
})();
