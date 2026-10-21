/* Bugungi osmon — joylashuv bo'yicha: sayyoralar, Oy, yulduz turkumlari, chiqish/botish vaqtlari.
   Aniqlik: sayyoralar JPL elementlari + presessiya (~1′–1°), Oy — asosiy davriy hadlar + topotsentrik parallaks (~0,3°), refraksiya hisobga olingan. */
(function(){
const {register,T,L,esc,fmt,jd,hiDPI,bvRGB,loc,locPicker,locName,zoned,tzLabel}=window.LAB;
const D2R=Math.PI/180, EPS0=23.4392911*D2R;
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
const PL=['mercury','venus','mars','jupiter','saturn','uranus','neptune'];
function helio(k,J){ const e0=EL[k], t=(J-2451545)/36525, v=i=>e0[i]+e0[i+6]*t;
  const a=v(0), e=v(1), I=v(2)*D2R, Lm=v(3), w=v(4), O=v(5)*D2R, om=(w-v(5))*D2R;
  let M=((Lm-w)%360+540)%360-180; M*=D2R; let E=M+e*Math.sin(M); for(let n=0;n<7;n++) E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
  const xp=a*(Math.cos(E)-e), yp=a*Math.sqrt(1-e*e)*Math.sin(E);
  const co=Math.cos(om), so=Math.sin(om), cO=Math.cos(O), sO=Math.sin(O), cI=Math.cos(I), sI=Math.sin(I);
  return [(co*cO-so*sO*cI)*xp+(-so*cO-co*sO*cI)*yp, (co*sO+so*cO*cI)*xp+(-so*sO+co*cO*cI)*yp, (so*sI)*xp+(co*sI)*yp]; }
function eq(x,y,z,eps){ const Y=y*Math.cos(eps)-z*Math.sin(eps), Z=y*Math.sin(eps)+z*Math.cos(eps), r=Math.hypot(x,Y,Z);
  return { ra:(Math.atan2(Y,x)/D2R+360)%360, dec:Math.asin(Z/r)/D2R, r }; }
// J2000 -> sana ekvatori (Meeus 21)
function precess(ra,dec,J){ const t=(J-2451545)/36525, s=1/3600*D2R;
  const ze=(2306.2181*t+0.30188*t*t)*s, z=(2306.2181*t+1.09468*t*t)*s, th=(2004.3109*t-0.42665*t*t)*s;
  const a0=ra*D2R+ze, d0=dec*D2R;
  const A=Math.cos(d0)*Math.sin(a0), B=Math.cos(th)*Math.cos(d0)*Math.cos(a0)-Math.sin(th)*Math.sin(d0), C=Math.sin(th)*Math.cos(d0)*Math.cos(a0)+Math.cos(th)*Math.sin(d0);
  return { ra:((Math.atan2(A,B)+z)/D2R+360)%360, dec:Math.asin(Math.max(-1,Math.min(1,C)))/D2R }; }
function vmag(k,r,D,R,ringB){ const i=Math.acos(Math.max(-1,Math.min(1,(r*r+D*D-R*R)/(2*r*D))))/D2R; let V;
  if(k==='mercury') V=-0.613+6.328e-2*i-1.6336e-3*i*i+3.3644e-5*i**3-3.4265e-7*i**4+1.6893e-9*i**5-3.0334e-12*i**6;
  else if(k==='venus') V=i<163.7?-4.384-1.044e-3*i+3.687e-4*i*i-2.814e-6*i**3+8.938e-9*i**4:236.05828-2.81914*i+8.39034e-3*i*i;
  else if(k==='mars') V=-1.601+2.267e-2*i-1.302e-4*i*i;
  else if(k==='jupiter') V=-9.395-3.7e-4*i+6.16e-4*i*i;
  else if(k==='saturn'){ const sb=Math.abs(Math.sin(ringB)); V=-8.88+0.044*i-2.60*sb+1.25*sb*sb; }
  else if(k==='uranus') V=-7.19+0.002*i; else V=-6.87;
  return V+5*Math.log10(r*D); }
function bodies(J){
  const t=(J-2451545)/36525, E=helio('earth',J), R=Math.hypot(...E), out={};
  const s=eq(-E[0],-E[1],-E[2],EPS0); out.sun=Object.assign(precess(s.ra,s.dec,J),{mag:-26.7});
  PL.forEach(k=>{ const P=helio(k,J), g=eq(P[0]-E[0],P[1]-E[1],P[2]-E[2],EPS0); let rb=0;
    if(k==='saturn'){ const sp=83.537*D2R, ap=40.589*D2R, d=g.dec*D2R, a=g.ra*D2R; rb=Math.asin(Math.sin(d)*Math.sin(sp)+Math.cos(d)*Math.cos(sp)*Math.cos(a-ap)); }
    out[k]=Object.assign(precess(g.ra,g.dec,J),{mag:vmag(k,Math.hypot(...P),g.r,R,rb)}); });
  const d=J-2451545, r_=x=>((x%360)+360)%360*D2R;
  const Lp=r_(218.316+13.176396*d), Mp=r_(134.963+13.064993*d), F=r_(93.272+13.229350*d), D=r_(297.850+12.190749*d), Ms=r_(357.529+0.98560028*d);
  const lam=Lp+D2R*(6.289*Math.sin(Mp)-1.274*Math.sin(Mp-2*D)+0.658*Math.sin(2*D)+0.214*Math.sin(2*Mp)-0.186*Math.sin(Ms)-0.114*Math.sin(2*F)+0.059*Math.sin(2*Mp-2*D)+0.057*Math.sin(Mp-2*D+Ms));
  const bet=D2R*(5.128*Math.sin(F)+0.280*Math.sin(Mp+F)+0.277*Math.sin(Mp-F)+0.173*Math.sin(2*D-F));
  const eps=(23.4392911-0.0130042*t)*D2R;
  out.moon=eq(Math.cos(bet)*Math.cos(lam),Math.cos(bet)*Math.sin(lam),Math.sin(bet),eps);
  out.moon.dist=385001-20905*Math.cos(Mp);
  const sl=Math.atan2(-E[1],-E[0])+(5029.0966*t/3600)*D2R;          // Quyosh uzunlamasi (sana ekliptikasi)
  out.moon.elong=((lam-sl)/D2R%360+360)%360;
  out.moon.ill=(1-Math.cos(out.moon.elong*D2R))/2; out.moon.mag=-12.7+0.026*Math.abs(180-out.moon.elong)+4e-9*Math.abs(180-out.moon.elong)**4;
  return out; }
function lst(J,lon){ const t=(J-2451545)/36525; return ((280.46061837+360.98564736629*(J-2451545)+0.000387933*t*t+lon)%360+360)%360; }
function altaz(ra,dec,J,o){ const H=(lst(J,o.lon)-ra)*D2R, d=dec*D2R, p=o.lat*D2R;
  const alt=Math.asin(Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(H));
  const az=Math.atan2(-Math.sin(H), Math.tan(d)*Math.cos(p)-Math.sin(p)*Math.cos(H));
  return { alt:alt/D2R, az:(az/D2R+360)%360 }; }
const refr=h=>h>-1.5?h+1.02/Math.tan((h+10.3/(h+5.11))*D2R)/60:h;
// ko'rinadigan (topotsentrik + refraksiya) balandlik
function look(k,B,J,o){ const q=altaz(B[k].ra,B[k].dec,J,o); if(k==='moon') q.alt-=Math.asin(6378.14/B.moon.dist)/D2R*Math.cos(q.alt*D2R); q.geo=q.alt; q.alt=refr(q.alt); return q; }
const PN={ sun:{uz:'Quyosh',ru:'Солнце',en:'Sun'}, moon:{uz:'Oy',ru:'Луна',en:'Moon'}, mercury:{uz:'Merkuriy',ru:'Меркурий',en:'Mercury'}, venus:{uz:'Venera',ru:'Венера',en:'Venus'},
  mars:{uz:'Mars',ru:'Марс',en:'Mars'}, jupiter:{uz:'Yupiter',ru:'Юпитер',en:'Jupiter'}, saturn:{uz:'Saturn',ru:'Сатурн',en:'Saturn'}, uranus:{uz:'Uran',ru:'Уран',en:'Uranus'}, neptune:{uz:'Neptun',ru:'Нептун',en:'Neptune'} };
const PC={ sun:'#ffd35a', moon:'#f2f0e6', mercury:'#c9b8a2', venus:'#fff2c4', mars:'#ff7a4d', jupiter:'#f0d3a8', saturn:'#e8d49a', uranus:'#9fe6ec', neptune:'#7aa0ff' };
const DIR8={ uz:['shimol','shimoli-sharq','sharq','janubi-sharq','janub','janubi-g‘arb','g‘arb','shimoli-g‘arb'], ru:['север','северо-восток','восток','юго-восток','юг','юго-запад','запад','северо-запад'], en:['north','north-east','east','south-east','south','south-west','west','north-west'] };
const CARD={ uz:['Sh','Shq','J','G‘'], ru:['С','В','Ю','З'], en:['N','E','S','W'] };
const dir=az=>T(DIR8)[Math.round(az/45)%8];
const CN={ ursaMajor:['Katta Ayiq','Большая Медведица','Ursa Major'], ursaMinor:['Kichik Ayiq','Малая Медведица','Ursa Minor'], orion:['Orion','Орион','Orion'], cassiopeia:['Kassiopeya','Кассиопея','Cassiopeia'],
  cygnus:['Oqqush','Лебедь','Cygnus'], scorpius:['Chayon (Aqrab)','Скорпион','Scorpius'], canisMajor:['Katta It','Большой Пёс','Canis Major'], carina:['Kil','Киль','Carina'], centaurus:['Sentavr','Центавр','Centaurus'],
  bootes:['Ho‘kizboqar','Волопас','Boötes'], lyra:['Lira','Лира','Lyra'], auriga:['Aravakash','Возничий','Auriga'], canisMinor:['Kichik It','Малый Пёс','Canis Minor'], eridanus:['Eridan','Эридан','Eridanus'],
  crux:['Janubiy Xoch','Южный Крест','Crux'], aquila:['Burgut','Орёл','Aquila'], taurus:['Savr (Buzoq)','Телец','Taurus'], virgo:['Sunbula','Дева','Virgo'], gemini:['Javzo (Egizaklar)','Близнецы','Gemini'],
  piscisAustrinus:['Janubiy Baliq','Южная Рыба','Piscis Austrinus'], leo:['Asad (Arslon)','Лев','Leo'], grus:['Turna','Журавль','Grus'], vela:['Yelkanlar','Паруса','Vela'], perseus:['Persey','Персей','Perseus'],
  sagittarius:['Qavs (O‘qotar)','Стрелец','Sagittarius'], triangulumAustrale:['Janubiy Uchburchak','Южный Треугольник','Triangulum Australe'], pavo:['Tovus','Павлин','Pavo'], hydra:['Gidra','Гидра','Hydra'],
  aries:['Hamal (Qo‘y)','Овен','Aries'], cetus:['Kit','Кит','Cetus'], andromeda:['Andromeda','Андромеда','Andromeda'], ophiuchus:['Ilon eltuvchi','Змееносец','Ophiuchus'], coronaBorealis:['Shimoliy Toj','Северная Корона','Corona Borealis'],
  draco:['Ajdaho','Дракон','Draco'], puppis:['Kema quyrug‘i','Корма','Puppis'], lupus:['Bo‘ri','Волк','Lupus'], phoenix:['Qaqnus','Феникс','Phoenix'], pegasus:['Pegas','Пегас','Pegasus'], cepheus:['Sefey','Цефей','Cepheus'],
  lepus:['Quyon','Заяц','Lepus'], corvus:['Qarg‘a','Ворон','Corvus'], libra:['Mezon (Tarozi)','Весы','Libra'], columba:['Kaptar','Голубь','Columba'], serpens:['Ilon','Змея','Serpens'], hercules:['Gerkules','Геркулес','Hercules'],
  hydrus:['Janubiy Gidra','Южная Гидра','Hydrus'], capricornus:['Jadi (Tog‘ echkisi)','Козерог','Capricornus'], aquarius:['Dalv (Qovg‘a)','Водолей','Aquarius'], canesVenatici:['Ov itlari','Гончие Псы','Canes Venatici'] };
const cn=k=>{ const a=CN[k]; return a?a[{uz:0,ru:1,en:2}[L()]]:k; };
const LINES={ ursaMajor:[['dubhe','merak','phecda','megrez','alioth','mizar','alkaid'],[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]],
  ursaMinor:[['polaris','yildun','epsUmi','zetaUmi','kochab','pherkad','etaUmi'],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]]],
  orion:[['betelgeuse','bellatrix','alnitak','alnilam','mintaka','saiph','rigel'],[[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[6,5]]],
  cassiopeia:[['caph','schedar','gammaCas','ruchbah','segin'],[[0,1],[1,2],[2,3],[3,4]]],
  cygnus:[['deneb','sadr','albireo','deltaCyg','gienahCyg'],[[0,1],[1,2],[3,1],[1,4]]],
  scorpius:[['acrab','dschubba','piSco','antares','tauSco','epsSco','sargas','kappaSco','shaula'],[[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8]]],
  leo:[['regulus','algieba','denebola','epsLeo'],[[0,1],[1,3],[1,2],[0,2]]],
  gemini:[['pollux','castor','alhena','tejat'],[[0,1],[0,2],[1,3]]],
  pegasus:[['markab','scheat','alpheratz','algenib','enif'],[[0,1],[1,2],[2,3],[3,0],[0,4]]],
  andromeda:[['alpheratz','mirach','almach'],[[0,1],[1,2]]],
  perseus:[['gammaPer','mirfak','epsPer','zetaPer','algol'],[[0,1],[1,2],[2,3],[1,4]]],
  auriga:[['capella','menkalinan','elnath','iotaAur'],[[0,1],[1,2],[2,3],[3,0]]],
  taurus:[['aldebaran','elnath'],[[0,1]]],
  bootes:[['arcturus','izar','muphrid'],[[0,1],[0,2]]],
  aquila:[['altair','tarazed','zetaAql'],[[0,1],[1,2]]],
  sagittarius:[['kausAustralis','kausMedia','kausBorealis','nunki','ascella','alnasl'],[[5,1],[1,0],[0,4],[4,3],[3,2],[2,1],[4,1]]],
  canisMajor:[['mirzam','sirius','wezen','adhara','aludra'],[[0,1],[1,2],[2,3],[2,4]]],
  crux:[['acrux','gacrux','mimosa','deltaCru'],[[0,1],[2,3]]],
  draco:[['eltanin','rastaban','etaDra','thuban'],[[0,1],[1,2],[2,3]]],
  corvus:[['gienahCrv','algorab','kraz'],[[0,1],[1,2],[2,0]]] };
const TX={ name:{uz:'Bugungi osmon',ru:'Небо сегодня',en:'Tonight’s sky'},
  sub:{uz:'Joylashuvingiz ustida hozir nima ko‘rinadi',ru:'Что видно над вами прямо сейчас',en:'What’s above you right now'},
  now:{uz:'Hozir',ru:'Сейчас',en:'Now'}, live:{uz:'jonli',ru:'в реальном времени',en:'live'},
  up:{uz:'Hozir osmonda',ru:'Сейчас над горизонтом',en:'Above the horizon now'}, none:{uz:'Hozir ufqdan yuqorida sayyora yo‘q',ru:'Сейчас планет над горизонтом нет',en:'No planets above the horizon right now'},
  plan:{uz:'Sayyoralar jadvali',ru:'Планеты за сутки',en:'Planets for the date'}, rise:{uz:'Chiqish',ru:'Восход',en:'Rise'}, set:{uz:'Botish',ru:'Заход',en:'Set'},
  best:{uz:'Kechasi eng yaxshi',ru:'Лучше ночью',en:'Best tonight'}, mag:{uz:'Yorqinlik',ru:'Блеск',en:'Mag.'},
  never:{uz:'kechasi ko‘rinmaydi',ru:'ночью не видна',en:'not visible at night'}, circ:{uz:'botmaydi',ru:'не заходит',en:'never sets'}, nr:{uz:'chiqmaydi',ru:'не восходит',en:'never rises'},
  eye:{uz:'ko‘z bilan',ru:'глазом',en:'naked eye'}, bino:{uz:'durbin',ru:'бинокль',en:'binoculars'}, tele:{uz:'teleskop',ru:'телескоп',en:'telescope'},
  con:{uz:'Ko‘rinadigan yulduz turkumlari',ru:'Видимые созвездия',en:'Visible constellations'}, conDay:{uz:'Qorong‘i tushgach ko‘rinadi',ru:'Станут видны после наступления темноты',en:'Visible once it gets dark'},
  sunK:{uz:'Quyosh',ru:'Солнце',en:'Sun'}, moonK:{uz:'Oy',ru:'Луна',en:'Moon'}, darkK:{uz:'To‘liq qorong‘ilik',ru:'Астрономическая ночь',en:'Astronomical dark'},
  day:{uz:'Kunduz',ru:'День',en:'Day'}, civ:{uz:'Fuqarolik shafag‘i',ru:'Гражданские сумерки',en:'Civil twilight'}, nau:{uz:'Dengiz shafag‘i',ru:'Навигационные сумерки',en:'Nautical twilight'}, ast:{uz:'Astronomik shafaq',ru:'Астрономические сумерки',en:'Astronomical twilight'}, night:{uz:'Tun',ru:'Ночь',en:'Night'},
  lit:{uz:'yoritilgan',ru:'освещена',en:'lit'}, alt:{uz:'balandlik',ru:'высота',en:'altitude'}, ecl:{uz:'Ekliptika — sayyoralar yo‘li',ru:'Эклиптика — путь планет',en:'Ecliptic — the planets’ path'},
  noDark:{uz:'yo‘q (oq tun)',ru:'нет (белая ночь)',en:'none (white night)'},
  note:{uz:'Xarita boshingiz ustida ushlab turilgandek: markaz — zenit, chekka — ufq, sharq chapda. Sayyoralar JPL elementlari va presessiya bilan, Oy — parallaks bilan hisoblanadi; balandliklarga atmosfera refraksiyasi qo‘shilgan. Aniqlik — Oy uchun ~0,3°, sayyoralar uchun ~1′, vaqtlar ±2 daqiqa.',
        ru:'Карта как бы над головой: центр — зенит, край — горизонт, восток слева. Планеты — по элементам JPL с прецессией, Луна — с параллаксом; высоты учитывают рефракцию. Точность: Луна ~0,3°, планеты ~1′, время ±2 мин.',
        en:'Held overhead: centre is the zenith, edge is the horizon, east on the left. Planets use JPL elements with precession, the Moon includes parallax; altitudes include refraction. Accuracy: Moon ~0.3°, planets ~1′, times ±2 min.'} };
const pad=n=>String(n).padStart(2,'0');
register('tonight',{ ico:'🌃', group:{uz:'Osmon',ru:'Небо',en:'Sky'}, name:TX.name, sub:TX.sub,
  build(body, lab){
    const setNow=()=>{ const o=loc(), z=zoned(new Date(),o.tz); lab.ymd=[z.y,z.m,z.d]; lab.min=z.h*60+z.mi; lab.live=true; };
    setNow();
    body.innerHTML=`<div class="lab-row tn-loc" id="tnLoc" style="margin-top:0"></div>
      <div class="lab-grid"><div style="position:relative"><canvas class="lab-cv" id="tnCv"></canvas><div class="lab-tip" id="tnTip"></div>
      <div class="lab-row"><input type="date" class="lab-date" id="tnDate" /><input type="range" class="lab-range" id="tnTime" min="0" max="1439" step="1" style="flex:1" /><b id="tnClock" style="min-width:92px;text-align:right;font-variant-numeric:tabular-nums"></b><button class="lab-chip" id="tnNow">${esc(T(TX.now))}</button></div>
      <div class="sec-title" style="margin-top:12px">${esc(T(TX.con))}</div><div class="tn-cons" id="tnCon"></div></div>
      <div><div class="lab-kv" id="tnKv"></div><div class="sec-title" style="margin-top:14px">${esc(T(TX.up))}</div><div class="lab-list" id="tnUp"></div>
      <div class="sec-title" style="margin-top:14px">${esc(T(TX.plan))}</div><div class="tn-tbl" id="tnTbl"></div><p class="lab-note">${esc(T(TX.note))}</p></div></div>`;
    const $=id=>body.querySelector('#'+id);
    locPicker($('tnLoc'));
    const stars=(window.STAR_CATALOG||[]), byId={}; stars.forEach(s=>byId[s.id]=s);
    const cons={}; stars.forEach(s=>{ if(!s.con) return; const a=s.ra*15*D2R, d=s.dec*D2R; const c=cons[s.con]||(cons[s.con]=[0,0,0,99]); c[0]+=Math.cos(d)*Math.cos(a); c[1]+=Math.cos(d)*Math.sin(a); c[2]+=Math.sin(d); c[3]=Math.min(c[3],s.mag); });
    Object.keys(cons).forEach(k=>{ const c=cons[k], r=Math.hypot(c[0],c[1],c[2]); cons[k]={ra:(Math.atan2(c[1],c[0])/D2R+360)%360, dec:Math.asin(c[2]/r)/D2R, mag:c[3]}; });
    const utcOf=(ymd,min)=>new Date(Date.UTC(ymd[0],ymd[1],ymd[2])-loc().tz*3600000+min*60000);
    const hm=d=>{ const z=zoned(d,loc().tz); return pad(z.h)+':'+pad(z.mi); };
    $('tnDate').onchange=e=>{ const v=e.target.value; if(v){ const [y,m,d]=v.split('-').map(Number); lab.ymd=[y,m-1,d]; lab.live=false; render(true); } };
    $('tnTime').oninput=e=>{ lab.min=+e.target.value; lab.live=false; render(false); };
    $('tnNow').onclick=()=>{ setNow(); render(true); };
    lab.onLoc=()=>{ locPicker($('tnLoc')); setNow(); render(true); };
    let pts=[];
    function render(full){
      const o=loc(), when=utcOf(lab.ymd,lab.min), J=jd(when), B=bodies(J), cv=$('tnCv'), w=Math.max(280,cv.parentElement.clientWidth), h=w; cv.style.height=h+'px';
      const x=hiDPI(cv,w,h), cx=w/2, cy=h/2, R=w/2-34;
      const P=(alt,az)=>{ const r=R*(90-Math.max(alt,-3))/90, a=az*D2R; return [cx-r*Math.sin(a), cy-r*Math.cos(a)]; };
      const sun=look('sun',B,J,o), sa=sun.geo;
      const k=Math.max(0,Math.min(1,(sa+18)/24));
      x.fillStyle='#000'; x.fillRect(0,0,w,h);
      const g=x.createRadialGradient(cx,cy,0,cx,cy,R), mix=(a,b)=>a.map((v,i)=>Math.round(v+(b[i]-v)*k));
      g.addColorStop(0,`rgb(${mix([5,8,22],[70,125,200])})`); g.addColorStop(1,`rgb(${mix([12,16,38],[140,180,225])})`); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,R,0,6.283); x.fill();
      if(sa>-18 && sa<5){ const sp=P(Math.max(-2,sa),sun.az); const gg=x.createRadialGradient(sp[0],sp[1],0,sp[0],sp[1],R*0.9);
        gg.addColorStop(0,`rgba(255,150,80,${0.45*(1-Math.abs(sa+4)/14)})`); gg.addColorStop(1,'rgba(255,150,80,0)'); x.save(); x.beginPath(); x.arc(cx,cy,R,0,6.283); x.clip(); x.fillStyle=gg; x.fillRect(0,0,w,h); x.restore(); }
      x.strokeStyle='rgba(160,190,255,0.16)'; x.lineWidth=1; [30,60].forEach(a=>{ x.beginPath(); x.arc(cx,cy,R*(90-a)/90,0,6.283); x.stroke(); });
      for(let a=0;a<360;a+=45){ const [px,py]=P(0,a); x.beginPath(); x.moveTo(cx,cy); x.lineTo(px,py); x.stroke(); }
      const vis=1-k; pts=[];
      x.save(); x.beginPath(); x.arc(cx,cy,R,0,6.283); x.clip();
      // ekliptika
      const t=(J-2451545)/36525, eps=(23.4392911-0.0130042*t)*D2R; x.setLineDash([4,5]); x.strokeStyle='rgba(255,200,120,0.4)'; x.lineWidth=1.2; x.beginPath(); let pen=false;
      for(let l=0;l<=360;l+=3){ const e=eq(Math.cos(l*D2R),Math.sin(l*D2R),0,eps), q=altaz(e.ra,e.dec,J,o); if(q.alt<-2){ pen=false; continue; } const [px,py]=P(refr(q.alt),q.az); pen?x.lineTo(px,py):x.moveTo(px,py); pen=true; }
      x.stroke(); x.setLineDash([]);
      const sp=s=>{ const p=precess(s.ra*15,s.dec,J); return altaz(p.ra,p.dec,J,o); };
      x.strokeStyle=`rgba(120,170,255,${0.5*vis})`; x.lineWidth=1.2;
      Object.keys(LINES).forEach(key=>{ const [ids,links]=LINES[key]; const pp=ids.map(id=>{ const s=byId[id]; if(!s) return null; const q=sp(s); return q.alt>-2?P(refr(q.alt),q.az):null; });
        links.forEach(([a,b])=>{ if(pp[a]&&pp[b]){ x.beginPath(); x.moveTo(pp[a][0],pp[a][1]); x.lineTo(pp[b][0],pp[b][1]); x.stroke(); } });
        const ok=pp.filter(Boolean); if(ok.length>=2 && ok.length>=ids.length*0.6 && vis>0.3){ const mx=ok.reduce((s,p)=>s+p[0],0)/ok.length, my=ok.reduce((s,p)=>s+p[1],0)/ok.length;
          x.fillStyle=`rgba(150,190,255,${0.75*vis})`; x.font='600 11px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; x.fillText(cn(key),mx,my+20); } });
      const lim=-1.5+(1-k)*8;
      stars.forEach(s=>{ if(s.mag>lim) return; const q=sp(s); if(q.alt<0) return; const [px,py]=P(refr(q.alt),q.az);
        const r=Math.max(0.7,3.6-s.mag*0.75), c=bvRGB(s.bv);
        x.fillStyle=`rgba(${c},${Math.min(1,vis*1.2)})`; x.beginPath(); x.arc(px,py,r,0,6.283); x.fill();
        if(s.name){ pts.push({x:px,y:py,t:s.name+' · '+fmt(s.mag,1)+'ᵐ · '+fmt(refr(q.alt),0)+'°'}); if(s.mag<0.9 && vis>0.5){ x.fillStyle=`rgba(220,230,255,${0.6*vis})`; x.font='10.5px "Segoe UI",system-ui,sans-serif'; x.textAlign='left'; x.fillText(s.name,px+r+3,py-3); } } });
      ['neptune','uranus','mercury','mars','saturn','jupiter','venus','moon','sun'].forEach(kk=>{ const q=look(kk,B,J,o); if(q.alt<-1) return; const [px,py]=P(q.alt,q.az);
        const r=kk==='sun'?11:(kk==='moon'?9:Math.max(2.4,4.6-B[kk].mag*0.55));
        x.fillStyle=PC[kk]; x.shadowColor=PC[kk]; x.shadowBlur=kk==='sun'?24:10; x.beginPath(); x.arc(px,py,r,0,6.283); x.fill(); x.shadowBlur=0;
        if(kk==='moon'){ const il=B.moon.ill; x.fillStyle='rgba(8,10,26,0.85)'; x.beginPath(); x.arc(px+(B.moon.elong<180?-1:1)*r*(2*il),py,r,0,6.283); x.fill(); }
        x.fillStyle='#fff'; x.font='700 12px "Segoe UI",system-ui,sans-serif'; x.textAlign='left'; x.fillText(T(PN[kk]),px+r+4,py+4);
        pts.push({x:px,y:py,t:T(PN[kk])+' · '+fmt(B[kk].mag,1)+'ᵐ · '+fmt(q.alt,1)+'° · '+dir(q.az)}); });
      x.restore();
      x.strokeStyle='rgba(180,200,255,0.55)'; x.lineWidth=1.5; x.beginPath(); x.arc(cx,cy,R,0,6.283); x.stroke();
      x.fillStyle='#cfe0ff'; x.font='700 14px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; x.textBaseline='middle';
      const cd=T(CARD); [[0,cd[0]],[90,cd[1]],[180,cd[2]],[270,cd[3]]].forEach(([a,tx])=>{ const r=R+17, aa=a*D2R; x.fillText(tx, cx-r*Math.sin(aa), cy-r*Math.cos(aa)); }); x.textBaseline='alphabetic';
      $('tnTime').value=lab.min; $('tnClock').innerHTML=pad(Math.floor(lab.min/60))+':'+pad(lab.min%60)+` <small style="color:var(--text-dim);font-weight:600">${tzLabel(o.tz)}</small>`;
      $('tnDate').value=lab.ymd[0]+'-'+pad(lab.ymd[1]+1)+'-'+pad(lab.ymd[2]);
      const phase=sa>-0.833?T(TX.day):sa>-6?T(TX.civ):sa>-12?T(TX.nau):sa>-18?T(TX.ast):T(TX.night);
      const moonQ=look('moon',B,J,o);
      $('tnKv').innerHTML=[[T(TX.sunK), phase+' · '+fmt(sun.alt,0)+'°'],[T(TX.moonK), Math.round(B.moon.ill*100)+'% '+T(TX.lit)+' · '+fmt(moonQ.alt,0)+'°']].map(([a,b])=>`<div><div class="k">${esc(a)}</div><div class="v">${esc(b)}</div></div>`).join('')+(lab.dark?`<div style="grid-column:1/-1"><div class="k">${esc(T(TX.darkK))}</div><div class="v">${esc(lab.dark)}</div></div>`:'');
      const up=['moon',...PL].map(kk=>({kk,q:look(kk,B,J,o)})).filter(z=>z.q.alt>0).sort((a,b)=>B[a.kk].mag-B[b.kk].mag);
      $('tnUp').innerHTML=up.length?up.map(z=>`<div class="it"><span><b style="color:${PC[z.kk]}">●</b> ${esc(T(PN[z.kk]))} <small style="color:var(--text-dim)">${fmt(B[z.kk].mag,1)}ᵐ</small></span><span>${fmt(z.q.alt,0)}° · ${esc(dir(z.q.az))}</span></div>`).join(''):`<div class="it">${esc(T(TX.none))}</div>`;
      const cl=Object.keys(cons).map(kk=>{ const p=precess(cons[kk].ra,cons[kk].dec,J); return {kk,alt:altaz(p.ra,p.dec,J,o).alt,az:altaz(p.ra,p.dec,J,o).az}; }).filter(z=>z.alt>15&&CN[z.kk]).sort((a,b)=>b.alt-a.alt);
      $('tnCon').innerHTML=(sa>-6?`<div class="lab-note" style="margin:0 0 6px;width:100%">${esc(T(TX.conDay))}</div>`:'')+cl.map(z=>`<span class="tn-c" title="${fmt(z.alt,0)}° · ${esc(dir(z.az))}">${esc(cn(z.kk))} <small>${fmt(z.alt,0)}°</small></span>`).join('');
      if(full) table();
    }
    // Sana uchun chiqish/botish va kechasi eng yaxshi vaqt
    function table(){
      const o=loc(), t0=utcOf(lab.ymd,0).getTime(), N=24*6+1, rows={}, keys=['sun','moon',...PL];
      keys.forEach(k=>rows[k]={a:[],rise:null,set:null});
      const h0={sun:-0.833,moon:-0.833}, sunA=[];
      for(let i=0;i<N;i++){ const J=jd(new Date(t0+i*600000)), B=bodies(J);
        keys.forEach(k=>{ const q=altaz(B[k].ra,B[k].dec,J,o); let a=q.alt; if(k==='moon') a-=Math.asin(6378.14/B.moon.dist)/D2R*Math.cos(a*D2R); rows[k].a.push(a-(h0[k]??-0.567)); }); }
      keys.forEach(k=>{ const r=rows[k], a=r.a; for(let i=1;i<a.length;i++){ if(a[i-1]<0&&a[i]>=0&&r.rise==null) r.rise=t0+(i-1+a[i-1]/(a[i-1]-a[i]))*600000; if(a[i-1]>=0&&a[i]<0&&r.set==null) r.set=t0+(i-1+a[i-1]/(a[i-1]-a[i]))*600000; }
        r.allUp=a.every(v=>v>=0); r.allDown=a.every(v=>v<0); });
      // kechasi: shu kunning 12:00 dan ertangi 12:00 gacha, Quyosh < −12°
      const best={}; let dS=null, dE=null, prevSun=null;
      for(let m=12*60;m<=36*60;m+=10){ const d=new Date(t0+m*60000), J=jd(d), B=bodies(J), s=altaz(B.sun.ra,B.sun.dec,J,o).alt;
        if(prevSun!=null){ if(prevSun>=-18&&s<-18) dS=d; if(prevSun<-18&&s>=-18) dE=d; } prevSun=s;
        if(s>-12) continue;
        ['moon',...PL].forEach(k=>{ const q=look(k,B,J,o); if(q.alt>8&&(!best[k]||q.alt>best[k].alt)) best[k]={alt:q.alt,az:q.az,d}; }); }
      lab.dark=dS&&dE?hm(dS)+' – '+hm(dE):(dS?hm(dS)+' – …':T(TX.noDark));
      const B0=bodies(jd(utcOf(lab.ymd,lab.min)));
      const how=m=>m<5.5?T(TX.eye):(m<9?T(TX.bino):T(TX.tele));
      const cell=(r,which)=>{ if(r.allUp) return `<i>${esc(T(TX.circ))}</i>`; if(r.allDown) return `<i>${esc(T(TX.nr))}</i>`; const v=r[which]; return v?hm(new Date(v)):'—'; };
      $('tnTbl').innerHTML=`<div class="tn-tr tn-th"><span></span><span>${esc(T(TX.mag))}</span><span>${esc(T(TX.rise))}</span><span>${esc(T(TX.set))}</span><span>${esc(T(TX.best))}</span></div>`+
        keys.map(k=>{ const r=rows[k], b=best[k];
          return `<div class="tn-tr"><span><b style="color:${PC[k]}">●</b> ${esc(T(PN[k]))}${k==='sun'?'':`<small>${esc(how(B0[k].mag))}</small>`}</span><span>${k==='sun'?'—':fmt(B0[k].mag,1)}</span><span>${cell(r,'rise')}</span><span>${cell(r,'set')}</span>
            <span>${k==='sun'?'—':(b?`${hm(b.d)} · ${fmt(b.alt,0)}° ${esc(dir(b.az))}`:`<i>${esc(T(TX.never))}</i>`)}</span></div>`; }).join('');
      render(false);
    }
    const cv=$('tnCv'), tip=$('tnTip');
    cv.addEventListener('pointermove',e=>{ const r=cv.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top; let b=null, bd=16;
      pts.forEach(p=>{ const d=Math.hypot(p.x-mx,p.y-my); if(d<bd){ bd=d; b=p; } });
      if(b){ tip.textContent=b.t; tip.style.left=b.x+'px'; tip.style.top=(b.y-10)+'px'; tip.style.opacity=1; } else tip.style.opacity=0; });
    cv.addEventListener('pointerleave',()=>tip.style.opacity=0);
    lab.render=render; table();
    lab.tick=setInterval(()=>{ if(lab.isOpen && lab.live){ const prev=lab.ymd.join(); setNow(); render(lab.ymd.join()!==prev); } },20000);
  },
  open(){ if(this.live!==false && this.render){ const o=loc(), z=zoned(new Date(),o.tz); this.ymd=[z.y,z.m,z.d]; this.min=z.h*60+z.mi; } this.render&&this.render(true); }
});
window.SKY_ASTRO={bodies,altaz,look,precess,lst,D2R,PN,PC,CN};   // PN/PC/CN — nomlar va ranglar (AR rejimi uchun)
})();
