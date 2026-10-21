/* DARSLIK · Ilovalar: astronomik doimiylar, Quyosh, Yer, Oy va planetalar haqida ma'lumotlar */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU, D2R=K0.D2R;
const TX={
 title:X('Ilovalar','Приложения','Appendices'),
 sub:X('Astronomik doimiylar · Quyosh, Yer va Oy haqida ma’lumotlar · Planetalar jadvali','Астрономические постоянные · Данные о Солнце, Земле и Луне · Таблица планет','Astronomical constants · Data on the Sun, Earth and Moon · Table of planets'),
 find:X('Qidirish: masalan, «radius», «davr», «tezlik»…','Поиск: например, «радиус», «период», «скорость»…','Search: e.g. “radius”, “period”, “speed”…'), none:X('Hech narsa topilmadi','Ничего не найдено','Nothing found'),
 s1:X('Astronomik doimiylar','Астрономические постоянные','Astronomical constants'), s2:X('Quyosh haqida ma’lumotlar','Данные о Солнце','The Sun'), s3:X('Yer haqida ma’lumotlar','Данные о Земле','The Earth'), s4:X('Oy haqida ma’lumotlar','Данные о Луне','The Moon'), s5:X('Planetalarga oid ma’lumotlar','Данные о планетах','The planets'),
 lat:X('Geografik kenglama φ','Географическая широта φ','Latitude φ'), lin:X('Shu kenglamadagi nuqtaning chiziqli tezligi','Линейная скорость точки на этой широте','Linear speed at this latitude'), kmh:X('km/soat','км/ч','km/h'), tash:X('Toshkent','Ташкент','Tashkent'), eqt:X('Ekvator','Экватор','Equator'),
 pl:X('Planeta','Планета','Planet'), col:X('Diagramma','Диаграмма','Chart'), log:X('logarifmik masshtab','логарифмическая шкала','log scale'), sort:X('Ustun nomini bosib saralang','Нажмите на заголовок для сортировки','Click a column header to sort'), retro:X('manfiy ishora — teskari aylanish','знак минус — обратное вращение','minus sign — retrograde rotation')
};
const C1=[
 [X('Yerning ekvatorial radiusi','Экваториальный радиус Земли','Earth’s equatorial radius'),'6378,16 km'],
 [X('Yerning qutbiy radiusi','Полярный радиус Земли','Earth’s polar radius'),'6356,78 km'],
 [X('Yer hajmiga teng shar radiusi','Радиус шара, равного по объёму Земле','Radius of a sphere of Earth’s volume'),'6371,03 km'],
 [X('Yulduz sutkasining uzunligi','Продолжительность звёздных суток','Length of the sidereal day'),X('23ʰ56ᵐ4ˢ,091 o‘rtacha Quyosh vaqti','23ʰ56ᵐ4ˢ,091 среднего солнечного времени','23ʰ56ᵐ4ˢ.091 of mean solar time')],
 [X('O‘rtacha Quyosh sutkasining uzunligi','Продолжительность средних солнечных суток','Length of the mean solar day'),X('24ʰ03ᵐ56ˢ,555 yulduz vaqti','24ʰ03ᵐ56ˢ,555 звёздного времени','24ʰ03ᵐ56ˢ.555 of sidereal time')],
 [X('Tropik yil','Тропический год','Tropical year'),'365ᵈ,2422 = 365ᵈ5ʰ48ᵐ46ˢ'],
 [X('Yulduz yili','Звёздный год','Sidereal year'),'365ᵈ,2564 = 365ᵈ6ʰ9ᵐ10ˢ'],
 [X('Sinodik oy','Синодический месяц','Synodic month'),'29ᵈ,5306 = 29ᵈ12ʰ44ᵐ3ˢ'],
 [X('Yulduz oyi','Звёздный месяц','Sidereal month'),'27ᵈ,3217 = 27ᵈ7ʰ43ᵐ12ˢ'],
 [X('Ajdaho oyi','Драконический месяц','Draconic month'),'27ᵈ,2122 = 27ᵈ5ʰ5ᵐ36ˢ']
];
const C2=[
 [X('Quyosh parallaksi','Параллакс Солнца','Solar parallax'),'8,794″'],
 [X('Yerdan Quyoshgacha o‘rtacha masofa','Среднее расстояние от Земли до Солнца','Mean Earth–Sun distance'),'149 600 000 km'],
 [X('Diametri','Диаметр','Diameter'),'D☉ = 109,12 D⊕ = 1 391 016 km'],
 [X('Sirt yuzi','Площадь поверхности','Surface area'),'S☉ = 11 930 S⊕ = 608,7·10¹⁰ km²'],
 [X('Hajmi','Объём','Volume'),'V☉ = 1 303 800 V⊕ = 1,412·10³³ cm³ = 1,4·10¹⁸ km³'],
 [X('Massasi','Масса','Mass'),'M☉ = 332 958 M⊕ = 1,99·10³⁰ kg'],
 [X('O‘rtacha zichligi','Средняя плотность','Mean density'),'ρ☉ = 0,255 ρ⊕ = 1,410 g/cm³'],
 [X('Sirtida erkin tushish tezlanishi','Ускорение свободного падения на поверхности','Surface gravity'),'g☉ = 2,738·10⁴ cm/s²'],
 [X('Sirtida parabolik (kritik) tezlik','Параболическая (критическая) скорость у поверхности','Parabolic (escape) speed at the surface'),'υ_par = 617,7 km/s'],
 [X('Ekvator nuqtasining sinodik aylanish davri','Синодический период вращения точки экватора','Synodic rotation period at the equator'),'T_sin = 27ᵈ,275'],
 [X('Quyosh ekvatorining ekliptikaga og‘maligi','Наклон солнечного экватора к эклиптике','Tilt of the solar equator to the ecliptic'),'7°15′00″'],
 [X('Quyosh doimiysining o‘rtacha qiymati','Среднее значение солнечной постоянной','Mean solar constant'),'W = 1,388·10⁶ erg/(s·cm²)'],
 [X('Vaqt birligida ajraladigan umumiy nurlanish energiyasi','Полная энергия излучения в единицу времени','Total radiated power'),'3,88·10³³ erg/s'],
 [X('Quyosh harakatining apeksi','Апекс движения Солнца','Solar apex'),'α = 18ʰ00ᵐ, δ = +30°'],
 [X('Galaktika markazi atrofida tezligi','Скорость вокруг центра Галактики','Speed around the Galactic centre'),'240 km/s'],
 [X('Galaktika markazi atrofida aylanish davri','Период обращения вокруг центра Галактики','Orbital period around the Galactic centre'),X('T = 200 mln yil','T = 200 млн лет','T = 200 million years')],
 [X('Eng katta ko‘rinma burchak diametri','Наибольший видимый угловой диаметр','Largest apparent diameter'),'32′35″,78'],
 [X('Eng kichik ko‘rinma burchak diametri','Наименьший видимый угловой диаметр','Smallest apparent diameter'),'31′31″,34']
];
const C3=[
 [X('Massasi','Масса','Mass'),'6·10²⁴ kg'],
 [X('Ekvatorial radiusi','Экваториальный радиус','Equatorial radius'),'6378,160 km'],
 [X('O‘z o‘qi atrofida aylanishining burchak tezligi','Угловая скорость вращения','Angular speed of rotation'),'15″,041 s⁻¹'],
 [X('Ekvatordagi nuqtaning chiziqli tezligi','Линейная скорость точки на экваторе','Linear speed at the equator'),'465,119 m/s'],
 [X('φ kenglamadagi nuqtaning chiziqli tezligi','Линейная скорость точки на широте φ','Linear speed at latitude φ'),'465,119·cos φ m/s'],
 [X('Orbitadagi eng katta tezligi (perigeliyda)','Наибольшая орбитальная скорость (в перигелии)','Greatest orbital speed (perihelion)'),'30,27 km/s'],
 [X('Orbitadagi eng kichik tezligi (afeliyda)','Наименьшая орбитальная скорость (в афелии)','Least orbital speed (aphelion)'),'29,27 km/s'],
 [X('Quyosh tomon tezlanishi','Ускорение к Солнцу','Acceleration toward the Sun'),'0,59 cm/s²'],
 [X('Erkin tushish tezlanishi','Ускорение свободного падения','Gravitational acceleration'),'980,665 cm/s²'],
 [X('Yer o‘qining ekliptika o‘qi atrofida aylanish davri (pretsessiya)','Период обращения оси Земли вокруг оси эклиптики (прецессия)','Precession period of Earth’s axis'),X('25 725 yil','25 725 лет','25 725 years')],
 [X('Shimoliy geomagnit qutb koordinatalari','Координаты северного геомагнитного полюса','North geomagnetic pole'),'φ = 78°,6; λ = 70°,1'],
 [X('Geomagnit qutblarda maydon kuchlanganligi','Напряжённость поля на геомагнитных полюсах','Field strength at the geomagnetic poles'),'0,63 E']
];
const C4=[
 [X('O‘rtacha sutkalik gorizontal parallaksi','Средний суточный горизонтальный параллакс','Mean horizontal parallax'),'57′2″,61'],
 [X('Yerdan o‘rtacha uzoqligi','Среднее расстояние от Земли','Mean distance from Earth'),'384 467 km'],
 [X('Eng katta ko‘rinma burchak diametri','Наибольший видимый угловой диаметр','Largest apparent diameter'),'33′32″'],
 [X('Eng kichik ko‘rinma burchak diametri','Наименьший видимый угловой диаметр','Smallest apparent diameter'),'29′20″'],
 [X('Diametri','Диаметр','Diameter'),'3476 km = 0,27234 d⊕'],
 [X('Hajmi','Объём','Volume'),'2195,3·10⁷ km³ = 0,020266 V⊕'],
 [X('Sirt yuzi','Площадь поверхности','Surface area'),'3,791·10⁷ km² = 0,0743 S⊕'],
 [X('Massasi','Масса','Mass'),'7,35·10²² kg = 0,012300 m⊕'],
 [X('O‘rtacha zichligi','Средняя плотность','Mean density'),'3,350 g/cm³ = 0,607 ρ⊕'],
 [X('Sirtida erkin tushish tezlanishi','Ускорение свободного падения на поверхности','Surface gravity'),'1,623 m/s²'],
 [X('Kritik tezlik (2-kosmik tezlik)','Критическая (вторая космическая) скорость','Escape speed'),'2,38 km/s'],
 [X('Orbita tekisligining ekliptikaga og‘maligi','Наклон плоскости орбиты к эклиптике','Orbital inclination to the ecliptic'),X('6°40′,7 (6°31′ dan 6°51′ gacha o‘zgaradi)','6°40′,7 (меняется от 6°31′ до 6°51′)','6°40′.7 (varies 6°31′–6°51′)')],
 [X('Yerdan ko‘rinmaydigan qismi','Невидимая с Земли часть поверхности','Fraction never seen from Earth'),'0,410'],
 [X('O‘rtacha ko‘rinma burchak tezligi','Средняя видимая угловая скорость','Mean apparent angular speed'),'12°,15'],
 [X('Orbita bo‘ylab o‘rtacha tezligi','Средняя орбитальная скорость','Mean orbital speed'),'1,023 km/s'],
 [X('Yer ta’sirida olgan tezlanishi','Ускорение, сообщаемое Землёй','Acceleration due to Earth'),'0,272 cm/s²'],
 [X('Siderik davri (o‘z o‘qi atrofida aylanish davriga teng)','Сидерический период (равен периоду вращения)','Sidereal period (equal to its rotation period)'),X('27,32 sutka','27,32 сут','27.32 days')],
 [X('Sinodik davri (Quyoshga nisbatan to‘la aylanish)','Синодический период (относительно Солнца)','Synodic period (relative to the Sun)'),X('29,53 sutka','29,53 сут','29.53 days')],
 [X('Tush paytida temperatura','Температура в полдень','Midday temperature'),'+120 °C'],
 [X('Yarim kechada temperatura','Температура в полночь','Midnight temperature'),'−150 °C']
];
/* name, R ekv km, a mln km, m/m⊕, m 10²⁴ kg, aylanish (matn, soat), kritik tezlik, davr (matn, sutka), orbital tezlik, rang */
const PL=[
 [X('Merkuriy','Меркурий','Mercury'),2439,57.91,.055,.330,['58ᵈ,65',58.65*24],4.3,['87ᵈ,97',87.97],48.0,'#b5a493'],
 [X('Venera','Венера','Venus'),6052,108.21,.816,4.872,['−243ᵈ,16',243.16*24],10.4,['224ᵈ,7',224.7],35.0,'#e8c27a'],
 [X('Yer','Земля','Earth'),6378,149.60,1,6,['23ʰ56ᵐ04ˢ',23.934],11.2,['365ᵈ,26',365.26],30.0,'#4f8fe8'],
 [X('Mars','Марс','Mars'),3396,227.94,.107,.639,['24ʰ37ᵐ23ˢ',24.623],5.0,['686ᵈ,98',686.98],24.1,'#d9693f'],
 [X('Yupiter','Юпитер','Jupiter'),71492,778.5,317.84,1900,['9ʰ50ᵐ',9.833],59.5,['4332ᵈ,59',4332.59],13.1,'#d8b48a'],
 [X('Saturn','Сатурн','Saturn'),60268,1427,95.17,568,['10ʰ14ᵐ',10.233],36.2,['10759ᵈ,21',10759.21],9.6,'#e3cf96'],
 [X('Uran','Уран','Uranus'),25559,2875.03,14.59,87,['−17ʰ42ᵐ',17.7],21.3,['30685ᵈ',30685],6.8,'#8fd6e0'],
 [X('Neptun','Нептун','Neptune'),24764,4554.4,17.25,103,['15ʰ57ᵐ',15.95],23.5,['60188ᵈ',60188],5.5,'#6f8ff0']];
const COLS=[
 [X('Ekvatorial radiusi, km','Экв. радиус, км','Equatorial radius, km'),1],
 [X('Quyoshdan o‘rtacha uzoqligi, mln km','Среднее расстояние от Солнца, млн км','Mean distance from Sun, million km'),2],
 [X('Massasi, m⊕','Масса, m⊕','Mass, m⊕'),3],
 [X('Massasi, 10²⁴ kg','Масса, 10²⁴ кг','Mass, 10²⁴ kg'),4],
 [X('O‘z o‘qi atrofida aylanish davri','Период вращения','Rotation period'),5],
 [X('Sirtidagi kritik tezlik, km/s','Критическая скорость, км/с','Escape speed, km/s'),6],
 [X('Quyosh atrofida aylanish davri','Период обращения','Orbital period'),7],
 [X('Orbital tezligi, km/s','Орбитальная скорость, км/с','Orbital speed, km/s'),8]];
function build(el, api){
  const K=K0.kit(el,api), {T,$,$$,fmtN,C,fit,sec,chips,mark,on}=K;
  const BRD='border-bottom:1px solid var(--glass-brd)';
  const rows=list=>`<div class="dz-card" style="padding:4px 14px">${list.map(([k,v])=>`<div class="ilv-row" style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:14px;padding:9px 0;${BRD};align-items:baseline"><span class="t1-p" style="margin:0">${T(k)}</span><b style="font-variant-numeric:tabular-nums;text-wrap:pretty">${typeof v==='string'?v:T(v)}</b></div>`).join('')}</div>`;
  const val=(p,c)=>c===5?p[5][1]:c===7?p[7][1]:p[c];
  const cell=(p,c)=>{ if(c===5) return p[5][0]; if(c===7) return p[7][0]; if(c===6||c===8) return fmtN(p[c],1); const v=p[c], d=(String(v).split('.')[1]||'').length; return fmtN(v,c===3&&v===1?3:d); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><input id="ilvQ" type="search" placeholder="${T(TX.find)}" style="width:100%;box-sizing:border-box;padding:11px 14px;border-radius:10px;border:1px solid var(--glass-brd);background:transparent;color:inherit;font:inherit"><p class="t1-p" id="ilvNo" hidden style="margin:10px 0 0">${T(TX.none)}</p></section>
  ${sec('01',TX.s1,rows(C1),'ilv1')}
  ${sec('02',TX.s2,rows(C2),'ilv2')}
  ${sec('03',TX.s3,rows(C3)+`<div class="dz-card t4-m" style="margin-top:10px"><div class="lab-row" style="margin:0">${chips('lt',[[0,T(TX.eqt)],[41.3,T(TX.tash)+' 41,3°'],[66.5,'66,5°'],[90,'90°']])}</div>
      <label class="t1-ctl"><span>${T(TX.lat)}: <b id="ilvLV"></b></span><input type="range" class="lab-range" id="ilvL" min="0" max="90" step="0.1" value="41.3"></label><canvas class="t1-cv" id="ilvE"></canvas><div class="lab-kv" id="ilvEKv"></div></div>`,'ilv3')}
  ${sec('04',TX.s4,rows(C4),'ilv4')}
  ${sec('05',TX.s5,`<p class="t1-p" style="margin:0 0 8px">${T(TX.sort)} · ${T(TX.retro)}</p>
    <div class="dz-card" style="overflow-x:auto;padding:4px"><table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:760px"><thead><tr id="ilvTh"></tr></thead><tbody id="ilvTb"></tbody></table></div>
    <div class="lab-row" style="margin:10px 0 0"><span class="t1-lab">${T(TX.col)}</span>${chips('pc',COLS.map(c=>[c[1],T(c[0]).split(',')[0]]))}</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="ilvP"></canvas></div>`,'ilv5')}`;

  /* Qidiruv */
  $('#ilvQ').oninput=()=>{ const q=$('#ilvQ').value.trim().toLowerCase(); let n=0;
    $$('.ilv-row').forEach(r=>{ const ok=!q||r.textContent.toLowerCase().includes(q); r.style.display=ok?'':'none'; if(ok) n++; });
    ['#ilv1','#ilv2','#ilv3','#ilv4'].forEach(id=>{ const s=$(id), any=[...s.querySelectorAll('.ilv-row')].some(r=>r.style.display!=='none'); s.style.display=any||!q?'':'none'; });
    const t5=!q||PL.some(p=>T(p[0]).toLowerCase().includes(q))||COLS.some(c=>T(c[0]).toLowerCase().includes(q)); $('#ilv5').style.display=t5?'':'none';
    $('#ilvNo').hidden=n>0||t5; };

  /* Yer: chiziqli tezlik */
  const drawE=K.draw(function(){ const cv=$('#ilvE'); const {x,w,h}=fit(cv,.36,220), c=C(), f=+$('#ilvL').value, pl=44, pr=12, pt=12, pb=26, sx=v=>pl+v/90*(w-pl-pr), sy=v=>pt+(1-v/500)*(h-pt-pb);
    [0,100,200,300,400,500].forEach(v=>{ x.strokeStyle=c.brd; x.lineWidth=1; x.beginPath(); x.moveTo(pl,sy(v)); x.lineTo(w-pr,sy(v)); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(v,pl-4,sy(v)+3); });
    [0,15,30,45,60,75,90].forEach(v=>{ x.fillStyle=c.dim; x.textAlign='center'; x.fillText(v+'°',sx(v),h-10); }); x.textAlign='left'; x.fillText('m/s',pl+4,pt+10);
    x.strokeStyle=c.neon; x.lineWidth=2.2; x.beginPath(); for(let v=0;v<=90;v+=.5){ const y=sy(465.119*Math.cos(v*D2R)); v?x.lineTo(sx(v),y):x.moveTo(sx(v),y); } x.stroke();
    x.fillStyle=c.gold; x.beginPath(); x.arc(sx(f),sy(465.119*Math.cos(f*D2R)),5.5,0,TAU); x.fill();
    const v=465.119*Math.cos(f*D2R); $('#ilvLV').textContent=fmtN(f,1)+'°';
    K.$('#ilvEKv').innerHTML=K.kv(T(TX.lin),fmtN(v,1)+' m/s = '+fmtN(v*3.6)+' '+T(TX.kmh),true); });
  $('#ilvL').oninput=()=>{ mark('lt',''); drawE(); }; on('lt',v=>{ $('#ilvL').value=v; mark('lt',v); drawE(); }); mark('lt','41.3');

  /* Planetalar jadvali */
  let sc=-1, sd=1, pc=1, lg=true;
  const th=(t,i)=>`<th data-sc="${i}" style="text-align:left;padding:7px 8px;font-size:11px;color:var(--text-dim);${BRD};cursor:pointer;user-select:none;vertical-align:bottom">${t}${sc===i?(sd>0?' ▲':' ▼'):''}</th>`;
  const renderT=()=>{ const idx=PL.map((_,i)=>i); if(sc>=0) idx.sort((a,b)=>(sc===0?0:(val(PL[a],sc)-val(PL[b],sc)))*sd); if(sc===0) idx.sort((a,b)=>T(PL[a][0]).localeCompare(T(PL[b][0]))*sd);
    $('#ilvTh').innerHTML=th(T(TX.pl),0)+COLS.map(c=>th(T(c[0]),c[1])).join('');
    $('#ilvTb').innerHTML=idx.map(i=>{ const p=PL[i]; return `<tr><td style="padding:7px 8px;${BRD};font-weight:700"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${p[9]};margin-right:7px"></span>${T(p[0])}</td>${COLS.map(c=>`<td style="padding:7px 8px;${BRD};font-variant-numeric:tabular-nums;${c[1]===pc?'font-weight:700':''}">${cell(p,c[1])}</td>`).join('')}</tr>`; }).join('');
    $$('[data-sc]').forEach(b=>b.onclick=()=>{ K.click(720); const i=+b.dataset.sc; if(sc===i) sd=-sd; else { sc=i; sd=1; } if(i>0) pc=i; renderT(); mark('pc',pc); drawP(); }); };
  const drawP=K.draw(function(){ const cv=$('#ilvP'); const {x,w,h}=fit(cv,.5,320), c=C(), vs=PL.map(p=>val(p,pc)), mx=Math.max(...vs), mn=Math.min(...vs), useLog=mx/mn>40, pl=Math.min(90,w*.22), pr=70, pt=8, pb=8, rh=(h-pt-pb)/PL.length;
    const L0=Math.floor(Math.log10(mn)), L1=Math.log10(mx)*1.02, f=v=>useLog?(Math.log10(v)-L0)/(L1-L0):v/mx;
    PL.forEach((p,i)=>{ const y=pt+i*rh, bw=Math.max(2,f(vs[i])*(w-pl-pr)); x.fillStyle=p[9]; x.globalAlpha=.85; x.fillRect(pl,y+rh*.2,bw,rh*.6); x.globalAlpha=1;
      x.fillStyle=c.text; x.font='600 11px system-ui,sans-serif'; x.textAlign='right'; x.fillText(T(p[0]),pl-6,y+rh*.5+4); x.textAlign='left'; x.fillStyle=c.dim; x.fillText(cell(p,pc),pl+bw+6,y+rh*.5+4); });
    if(useLog){ x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(T(TX.log),w-6,h-4); } });
  on('pc',v=>{ pc=+v; mark('pc',v); renderT(); drawP(); }); mark('pc',pc); renderT();
  return K.start();
}
window.DARSLIK.add({ id:'ilova', ico:'📚', num:X('✦','✦','✦'), badge:X('Ilovalar','Приложения','Appendices'), title:TX.title, sub:TX.sub, build });
}; go0();
})();
