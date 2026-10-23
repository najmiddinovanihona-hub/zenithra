/* Ulug'bek rasadxonasi — 5 bo'lim:
     🏛 Rasadxona  — 3D model (kesib ko'rish, Quyosh harakati, peshinda nur meridian yoyiga tushadi)
     📐 Sekstant   — yon kesim chizmasi, odam qomati bilan masshtab, yil animatsiyasi
     📜 Tarix      — vaqt chizig'i
     ⭐ Zij yulduzlari — 1437-yil va bugungi osmon (presessiya), Samarqanddan ko'rinmaydigan yulduzlar
     🎯 Ulug'bek o'rnida — yoz va qish o'qishlaridan Yer o'qi og'ishi va Samarqand kengligini hisoblash
   Geometriya (metr): Faxriy sekstanti — meridian yoyi R = 40,2 m, pastki nuqtasi yer sathidan ~11 m pastda;
   bino Ø ~46 m, uch qavat (~30 m). 3D koordinatalar: x — sharq, y — yuqori, z — janub.
   Host (script.js) beradi: window.UB_HOST = { lang, decl, fmtDate, click, loc }. */
(function(){
'use strict';
const H=()=>window.UB_HOST;
const L=()=>{ const l=H()?H().lang():'uz'; return (l==='ru'||l==='en')?l:'uz'; };
const T=o=>o==null?'':(typeof o==='string'?o:(o[L()]!=null?o[L()]:o.uz));
const D2R=Math.PI/180, LAT=39.67, R_ARC=40.2, CY=29.2, CZ=20, A_MAX=72, EPS=23.4393*D2R;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const num=(v,d)=>{ const s=v.toFixed(d==null?1:d); return L()==='en'?s:s.replace('.',','); };
const decl=N=>H().decl(N);
const zOf=N=>Math.abs(LAT-decl(N));               // peshindagi zenit masofasi = yoydagi o'qish
const hm=h=>{ const m=Math.round(h*60); return pad(Math.floor(m/60)%24)+':'+pad(m%60); };
function dms(v,withSec){ const s=v<0?'−':''; v=Math.abs(v); let d=Math.floor(v), m=Math.floor((v-d)*60), sec=Math.round(((v-d)*60-m)*60);
  if(sec===60){ sec=0; m++; } if(m===60){ m=0; d++; } return s+d+'°'+pad(m)+'′'+(withSec?pad(sec)+'″':''); }
function fit(cv,w,h){ const r=Math.min(2,window.devicePixelRatio||1); if(cv.width!==Math.round(w*r)||cv.height!==Math.round(h*r)){ cv.width=Math.round(w*r); cv.height=Math.round(h*r); }
  cv.style.height=h+'px'; const x=cv.getContext('2d'); x.setTransform(r,0,0,r,0,0); x.clearRect(0,0,w,h); return x; }
const click=f=>{ try{ H().click(f); }catch(e){} };

/* ======================= Matnlar (3 tilda) ======================= */
const TX={
  tabs:[{uz:'🏛 Rasadxona',ru:'🏛 Обсерватория',en:'🏛 Observatory'},{uz:'📐 Sekstant',ru:'📐 Секстант',en:'📐 Sextant'},
    {uz:'📜 Tarix',ru:'📜 История',en:'📜 History'},{uz:'⭐ Zij yulduzlari',ru:'⭐ Звёзды «Зиджа»',en:'⭐ Stars of the Zij'},
    {uz:'🎯 Ulug‘bek o‘rnida',ru:'🎯 На месте Улугбека',en:'🎯 Be Ulugh Beg'}],
  date:{uz:'Sana',ru:'Дата',en:'Date'}, time:{uz:'Quyosh vaqti',ru:'Солнечное время',en:'Solar time'},
  alt:{uz:'Quyosh balandligi',ru:'Высота Солнца',en:'Sun altitude'}, read:{uz:'Yoydagi o‘qish (z)',ru:'Отсчёт на дуге (z)',en:'Arc reading (z)'},
  wait:{uz:'peshinni kuting',ru:'ждите полудня',en:'wait for noon'}, night:{uz:'tun',ru:'ночь',en:'night'},
  play:{uz:'▶ Kun bo‘yi',ru:'▶ Весь день',en:'▶ Whole day'}, pause:{uz:'⏸ To‘xtatish',ru:'⏸ Пауза',en:'⏸ Pause'},
  noon:{uz:'☀ Peshin',ru:'☀ Полдень',en:'☀ Noon'}, cut:{uz:'✂ Kesib ko‘rish',ru:'✂ Разрез',en:'✂ Cutaway'},
  spot:{uz:'🔍 Dog‘ga yaqin',ru:'🔍 К пятну',en:'🔍 Zoom to spot'}, view:{uz:'↺ Umumiy ko‘rinish',ru:'↺ Общий вид',en:'↺ Overview'},
  note:{uz:'Nur yoyga faqat peshinda — Quyosh meridiandan o‘tadigan bir necha daqiqada tushadi. Shuning uchun asbob «meridian yoyi» deyiladi. Sichqoncha bilan aylantiring, g‘ildirakcha bilan yaqinlashtiring.',
    ru:'Луч попадает на дугу только в полдень — в те несколько минут, когда Солнце проходит меридиан. Поэтому инструмент и называют «меридианной дугой». Вращайте мышью, приближайте колёсиком.',
    en:'The beam lands on the arc only at noon — for the few minutes when the Sun crosses the meridian. That is why it is called a “meridian arc”. Drag to rotate, scroll to zoom.'},
  lAperture:{uz:'Tuynuk',ru:'Отверстие',en:'Aperture'},
  lArc:{uz:'Meridian yoyi · R = 40 m',ru:'Меридианная дуга · R = 40 м',en:'Meridian arc · R = 40 m'},
  lTrench:{uz:'Xandaq · 11 m chuqur',ru:'Траншея · глубина 11 м',en:'Trench · 11 m deep'},
  lMan:{uz:'Odam · 1,75 m',ru:'Человек · 1,75 м',en:'Person · 1.75 m'},
  lBuild:{uz:'Rasadxona · Ø 46 m, 3 qavat',ru:'Обсерватория · Ø 46 м, 3 этажа',en:'Observatory · Ø 46 m, 3 storeys'},
  lN:{uz:'Shimol',ru:'Север',en:'North'}, lS:{uz:'Janub',ru:'Юг',en:'South'},
  noGl:{uz:'Bu qurilmada 3D ko‘rinish ishlamadi (WebGL yo‘q). «Sekstant» bo‘limidagi chizma xuddi shu jarayonni ko‘rsatadi.',
    ru:'На этом устройстве 3D не работает (нет WebGL). Чертёж во вкладке «Секстант» показывает то же самое.',
    en:'3D is not available on this device (no WebGL). The drawing in the “Sextant” tab shows the same process.'},
  // Sekstant
  playYear:{uz:'▶ Yil davomida',ru:'▶ В течение года',en:'▶ Through the year'},
  scale:{uz:'R = 40 m — taxminan 14 qavatli uy balandligi',ru:'R = 40 м — примерно 14-этажный дом',en:'R = 40 m — about a 14-storey building'},
  man:{uz:'odam 1,75 m',ru:'человек 1,75 м',en:'person 1.75 m'}, trench:{uz:'xandaq',ru:'траншея',en:'trench'},
  // Zij
  zIntro:{uz:'Ulug‘bek yulduzlarni 1437-yil osmonida o‘lchagan. O‘shandan beri Yer o‘qi sekin aylangani (presessiya) uchun barcha yulduz koordinatalari siljigan. Yilni suring yoki ▶ ni bosing — siljishni ko‘rasiz. Yulduz ustiga bosing.',
    ru:'Улугбек измерял звёзды на небе 1437 года. С тех пор ось Земли медленно повернулась (прецессия), и координаты всех звёзд сместились. Двигайте год или нажмите ▶. Нажмите на звезду.',
    en:'Ulugh Beg measured the stars on the sky of 1437. Since then Earth’s axis has slowly turned (precession) and every star’s coordinates have shifted. Drag the year or press ▶. Tap a star.'},
  year:{uz:'Yil',ru:'Год',en:'Year'},
  shift:{uz:'Ekliptik uzunlik siljishi 1437-yildan beri: ',ru:'Сдвиг эклиптической долготы с 1437 года: ',en:'Shift in ecliptic longitude since 1437: '},
  never:{uz:'Samarqanddan hech qachon ko‘rinmaydi',ru:'Никогда не видно из Самарканда',en:'Never visible from Samarkand'},
  termez:{uz:'Termiz chegarasi',ru:'граница для Термеза',en:'limit for Termez'},
  eq:{uz:'osmon ekvatori',ru:'небесный экватор',en:'celestial equator'}, ecl:{uz:'ekliptika',ru:'эклиптика',en:'ecliptic'},
  maxAlt:{uz:'Samarqandda eng baland',ru:'Наибольшая высота в Самарканде',en:'Highest in Samarkand'},
  noRise:{uz:'Samarqandda ufqdan chiqmaydi',ru:'В Самарканде не восходит',en:'Never rises in Samarkand'},
  facts:[{uz:'«Zij»da 1018 yulduz bor. Ulardan 27 tasi Samarqand osmonida hech qachon chiqmagani uchun Ulug‘bek ularni as-So‘fiy katalogidan olgan — xaritadagi qizil hudud aynan shu.',
      ru:'В «Зидже» 1018 звёзд. 27 из них никогда не восходят над Самаркандом, поэтому Улугбек взял их из каталога ас-Суфи — это и есть красная область на карте.',
      en:'The Zij lists 1018 stars. 27 of them never rise over Samarkand, so Ulugh Beg took them from al-Sufi’s catalogue — that is the red zone on the chart.'},
    {uz:'Presessiya: Yer o‘qi ~25 800 yilda bir marta aylanadi, koordinatalar yiliga ~50,3″ siljiydi. 1437-yildan beri bu ~8,2° — Oyning 16 ta diametri!',
      ru:'Прецессия: ось Земли делает оборот за ~25 800 лет, координаты смещаются на ~50,3″ в год. С 1437 года это ~8,2° — 16 поперечников Луны!',
      en:'Precession: Earth’s axis turns once in ~25,800 years, shifting coordinates by ~50.3″ a year. Since 1437 that is ~8.2° — 16 Moon diameters!'},
    {uz:'Suhayl (Kanopus) Samarqanddan ko‘rinmaydi, lekin janubroqdagi Termizdan ufq ustida zo‘rg‘a ko‘tariladi.',
      ru:'Сухейль (Канопус) не виден из Самарканда, но из более южного Термеза едва поднимается над горизонтом.',
      en:'Suhayl (Canopus) is invisible from Samarkand, but from Termez further south it barely clears the horizon.'}],
  // Ulug'bek o'rnida
  yIntro:{uz:'Ulug‘bek Yer o‘qining og‘ishini va Samarqand kengligini shunday topgan: yil davomida peshindagi dog‘ eng yuqori (yozda) va eng past (qishda) tushgan o‘qishlarni yozib olgan. Siz ham urinib ko‘ring!',
    ru:'Так Улугбек нашёл наклон земной оси и широту Самарканда: записал самый высокий (летом) и самый низкий (зимой) полуденный отсчёт пятна. Попробуйте и вы!',
    en:'This is how Ulugh Beg found the tilt of Earth’s axis and the latitude of Samarkand: he recorded the highest (summer) and lowest (winter) noon readings of the light spot. Try it yourself!'},
  y1:{uz:'1. Yozgi quyosh turishini toping — dog‘ eng KICHIK z ga tushadigan kunni (surgichni suring).',ru:'1. Найдите летнее солнцестояние — день, когда z САМЫЙ МАЛЕНЬКИЙ (двигайте ползунок).',en:'1. Find the summer solstice — the day the reading z is SMALLEST (drag the slider).'},
  y2:{uz:'2. Qishki quyosh turishini toping — dog‘ eng KATTA z ga tushadigan kun.',ru:'2. Найдите зимнее солнцестояние — день, когда z САМЫЙ БОЛЬШОЙ.',en:'2. Find the winter solstice — the day z is LARGEST.'},
  recS:{uz:'📌 Yoz o‘qishini yozib olish',ru:'📌 Записать летний отсчёт',en:'📌 Record the summer reading'},
  recW:{uz:'📌 Qish o‘qishini yozib olish',ru:'📌 Записать зимний отсчёт',en:'📌 Record the winter reading'},
  zS:{uz:'z (yoz)',ru:'z (лето)',en:'z (summer)'}, zW:{uz:'z (qish)',ru:'z (зима)',en:'z (winter)'},
  resE:{uz:'Yer o‘qi og‘ishi ε',ru:'Наклон оси ε',en:'Axial tilt ε'}, resP:{uz:'Samarqand kengligi φ',ru:'Широта Самарканда φ',en:'Latitude of Samarkand φ'},
  now:{uz:'hozir',ru:'сейчас',en:'now'}, you:{uz:'Siz',ru:'Вы',en:'You'}, ub:{uz:'Ulug‘bek',ru:'Улугбек',en:'Ulugh Beg'}, real:{uz:'Haqiqiy',ru:'Точное',en:'True'},
  g1:{uz:'Ulug‘bek darajasida! 🏆',ru:'Уровень Улугбека! 🏆',en:'Ulugh Beg level! 🏆'},
  g2:{uz:'Yaxshi! Lekin aniqroq kun bor — dog‘ chekkasini qidiring.',ru:'Хорошо! Но есть день точнее — ищите крайнее положение пятна.',en:'Good! But there is a more exact day — look for the extreme position.'},
  g3:{uz:'Dog‘ chekka nuqtaga yetmagan — kunni yana qidiring.',ru:'Пятно не дошло до крайней точки — поищите ещё.',en:'The spot hasn’t reached its extreme — keep searching.'},
  again:{uz:'↺ Qaytadan',ru:'↺ Заново',en:'↺ Start over'},
  modelNote:{uz:'Modeldagi Quyosh bugungi osmon bo‘yicha harakatlanadi (ε = 23°26′). 1437-yilda haqiqiy og‘ish ≈ 23°30′48″ edi — Ulug‘bek 23°30′17″ topgan: farq yarim yoy daqiqasi!',
    ru:'Солнце в модели движется по сегодняшнему небу (ε = 23°26′). В 1437 году наклон был ≈ 23°30′48″ — Улугбек получил 23°30′17″: разница полминуты дуги!',
    en:'The model Sun follows today’s sky (ε = 23°26′). In 1437 the true tilt was ≈ 23°30′48″ — Ulugh Beg found 23°30′17″: half an arcminute off!'},
  measTitle:{uz:'Ulug‘bek o‘lchovlari va bugungi qiymatlar',ru:'Измерения Улугбека и современные значения',en:'Ulugh Beg’s measurements vs modern values'},
  // Tarix
  hist:[
    ['1394','👶',{uz:'Tug‘ilishi',ru:'Рождение',en:'Birth'},{uz:'22-mart, Sultoniya shahrida. Amir Temurning nevarasi, asl ismi — Muhammad Tarag‘ay.',ru:'22 марта, в Султании. Внук Амира Тимура, настоящее имя — Мухаммад Тарагай.',en:'Born 22 March in Sultaniyeh — a grandson of Amir Timur; his given name was Muhammad Taragai.'}],
    ['1409','👑',{uz:'Samarqand hukmdori',ru:'Правитель Самарканда',en:'Ruler of Samarkand'},{uz:'15 yoshida Samarqand va Movarounnahr hokimi bo‘ladi va 40 yil boshqaradi.',ru:'В 15 лет становится правителем Самарканда и Мавераннахра и правит 40 лет.',en:'At 15 he becomes ruler of Samarkand and Transoxiana and reigns for 40 years.'}],
    ['1417–1420','🕌',{uz:'Registondagi madrasa',ru:'Медресе на Регистане',en:'The Registan madrasa'},{uz:'Astronomiya va matematika o‘qitiladigan madrasa qurdiradi — o‘zi ham dars beradi.',ru:'Строит медресе, где преподают астрономию и математику, — и сам ведёт занятия.',en:'Builds a madrasa where astronomy and mathematics are taught — and teaches there himself.'}],
    ['1424–1429','🏛',{uz:'Rasadxona',ru:'Обсерватория',en:'The observatory'},{uz:'Ko‘hak tepaligida uch qavatli dumaloq bino (Ø ~46 m), ichida 40 metrlik Faxriy sekstanti.',ru:'На холме Кухак — трёхэтажное круглое здание (Ø ~46 м) с 40-метровым секстантом Фахри.',en:'On Kohak hill: a three-storey round building (~46 m across) housing the 40-metre Fakhri sextant.'}],
    ['1437','📖',{uz:'«Ziji jadidi Ko‘ragoniy»',ru:'«Зидж-и джадид-и Гурагани»',en:'The Zij-i Sultani'},{uz:'1018 yulduz katalogi, yil uzunligi, sayyoralar jadvallari. Qozizoda Rumiy, G‘iyosiddin Koshiy, Ali Qushchi bilan birga.',ru:'Каталог 1018 звёзд, длина года, планетные таблицы — вместе с Кази-заде Руми, Гиясаддином Каши и Али Кушчи.',en:'A catalogue of 1018 stars, the length of the year and planetary tables — with Qadi-zada al-Rumi, al-Kashi and Ali Qushji.'}],
    ['1449','⚔',{uz:'Fojia',ru:'Трагедия',en:'Tragedy'},{uz:'27-oktabrda o‘ldiriladi; rasadxona tez orada vayron qilinadi.',ru:'27 октября убит; вскоре обсерватория разрушена.',en:'Murdered on 27 October; the observatory is soon destroyed.'}],
    ['~1472','🕯',{uz:'Ilm saqlanib qoldi',ru:'Знание спасено',en:'The knowledge survives'},{uz:'Ali Qushchi «Zij»ni Istanbulga olib boradi — asar Usmonli va Yevropa olimlariga yetib boradi.',ru:'Али Кушчи увозит «Зидж» в Стамбул — труд доходит до османских и европейских учёных.',en:'Ali Qushji carries the Zij to Istanbul — from there it reaches Ottoman and European scholars.'}],
    ['1665','🎓',{uz:'Oksford',ru:'Оксфорд',en:'Oxford'},{uz:'Tomas Xayd yulduzlar jadvalini lotin tiliga tarjima qilib, Oksfordda nashr etadi.',ru:'Томас Хайд издаёт звёздные таблицы в Оксфорде в латинском переводе.',en:'Thomas Hyde publishes the star tables at Oxford in Latin translation.'}],
    ['1908','⛏',{uz:'Topilma',ru:'Находка',en:'Rediscovery'},{uz:'Arxeolog V. Vyatkin yer ostidagi sekstant qoldig‘ini topadi — uni bugun ham Samarqandda ko‘rish mumkin.',ru:'Археолог В. Вяткин находит подземную часть секстанта — её и сегодня можно увидеть в Самарканде.',en:'Archaeologist V. Vyatkin unearths the underground part of the sextant — you can still see it in Samarkand today.'}],
  ],
};

/* ======================= Umumiy holat ======================= */
const S={ open:false, tab:0, root:null, day:171, hour:12, playDay:false, cut:false, yDay:120, rec:{s:null,w:null}, zYear:1437, zPlay:false, zSel:null, sDay:171, sPlay:false, raf2:0, quiz:null };
const $=sel=>S.root&&S.root.querySelector(sel);

/* ======================= 📐 Sekstant: yon kesim chizmasi ======================= */
function drawSext(cv,N,compact){
  const lc=H().loc(), w=cv.clientWidth||600, hgt=Math.round(Math.min(compact?300:440,Math.max(compact?220:260,w*(compact?0.46:0.6))));
  const x=fit(cv,w,hgt);
  const top=compact?50:82, left=compact?66:92, right=compact?40:58, bottom=compact?14:20;
  const R=Math.min((w-left-right)/Math.sin(A_MAX*D2R),(hgt-top-bottom)/1.0);
  const cx=left, cy=top, gy=cy+R*(CY/R_ARC), P=a=>[cx+R*Math.sin(a*D2R), cy+R*Math.cos(a*D2R)];
  const fs=compact?10:11;
  // osmon va yer
  let g=x.createLinearGradient(0,0,0,gy); g.addColorStop(0,'#0a1630'); g.addColorStop(1,'#1c3158'); x.fillStyle=g; x.fillRect(0,0,w,gy);
  g=x.createLinearGradient(0,gy,0,hgt); g.addColorStop(0,'#3b2f1f'); g.addColorStop(1,'#1d160e'); x.fillStyle=g; x.fillRect(0,gy,w,hgt-gy);
  // xandaq (yer ostidagi bo'shliq) va yoy ostidagi g'isht tana
  const ag=Math.acos(CY/R_ARC)/D2R, xg=P(ag)[0];
  x.fillStyle='#0f0c08'; x.fillRect(cx-16,gy,xg-cx+22,cy+R+8-gy);
  x.beginPath(); for(let a=0;a<=A_MAX;a+=1){ const p=P(a); a?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]); }
  x.lineTo(P(A_MAX)[0],hgt); x.lineTo(cx-2,hgt); x.lineTo(cx-2,cy+R); x.closePath();
  g=x.createLinearGradient(0,cy,0,hgt); g.addColorStop(0,'#9a6a40'); g.addColorStop(1,'#5a3c22'); x.fillStyle=g; x.fill();
  // g'isht qatorlari
  x.save(); x.clip(); x.strokeStyle='rgba(40,24,12,.35)'; x.lineWidth=1; for(let y=cy;y<hgt;y+=7){ x.beginPath(); x.moveTo(0,y); x.lineTo(w,y); x.stroke(); } x.restore();
  // yer sathi chizig'i
  x.strokeStyle='rgba(160,190,255,.55)'; x.lineWidth=1.2; x.beginPath(); x.moveTo(0,gy); x.lineTo(w,gy); x.stroke();
  x.fillStyle='#9fb0d8'; x.font=fs+'px system-ui,sans-serif'; x.textAlign='left'; x.fillText(lc.ground,6,gy-6);
  x.fillStyle='#7d6a52'; x.fillText(T(TX.trench),cx-12,gy+16);
  // marmar yoy + shkala
  x.lineCap='butt'; x.strokeStyle='#ece5d3'; x.lineWidth=compact?6:8; x.beginPath(); x.arc(cx,cy,R,Math.PI/2-A_MAX*D2R,Math.PI/2); x.stroke();
  for(let d=0;d<=A_MAX;d++){ const a=Math.PI/2-d*D2R, big=d%10===0, mid=d%5===0, r1=R-(big?7:mid?5:3), r2=R+(compact?3:4);
    x.strokeStyle=big?'#2b1c0c':'rgba(60,40,20,.6)'; x.lineWidth=big?1.4:.7; x.beginPath(); x.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); x.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2); x.stroke();
    if(big){ x.fillStyle='#cfd8f3'; x.font=fs+'px system-ui,sans-serif'; x.textAlign='center'; x.fillText(d+'°',cx+Math.cos(a)*(R-(compact?18:22)),cy+Math.sin(a)*(R-(compact?18:22))+4); } }
  if(!compact){ const am=P(52); x.fillStyle='#e8d9b0'; x.textAlign='left'; x.font='600 '+fs+'px system-ui,sans-serif'; x.fillText(lc.arcLbl,am[0]+12,am[1]+2); }
  // R o'lchov chizig'i
  const pr=P(compact?40:30); x.setLineDash([4,4]); x.strokeStyle='rgba(200,215,255,.45)'; x.lineWidth=1; x.beginPath(); x.moveTo(cx,cy); x.lineTo(pr[0],pr[1]); x.stroke(); x.setLineDash([]);
  x.fillStyle='#c9d4f5'; x.font=fs+'px system-ui,sans-serif'; x.textAlign='left'; x.fillText('R = 40,2 m',(cx+pr[0])/2+6,(cy+pr[1])/2);
  // Quyosh, nur, dog'
  const z=zOf(N), h=90-z, sd=compact?40:54, sx=cx-sd*Math.cos(h*D2R), sy=cy-sd*Math.sin(h*D2R), sp=P(z);
  let rg=x.createRadialGradient(sx,sy,0,sx,sy,compact?16:20); rg.addColorStop(0,'rgba(255,240,180,1)'); rg.addColorStop(.35,'rgba(255,200,80,.9)'); rg.addColorStop(1,'rgba(255,160,40,0)');
  x.fillStyle=rg; x.beginPath(); x.arc(sx,sy,compact?16:20,0,7); x.fill();
  x.setLineDash([3,4]); x.strokeStyle='rgba(255,224,138,.6)'; x.lineWidth=1.2; x.beginPath(); x.moveTo(sx,sy); x.lineTo(cx,cy); x.stroke(); x.setLineDash([]);
  g=x.createLinearGradient(cx,cy,sp[0],sp[1]); g.addColorStop(0,'rgba(255,236,160,.95)'); g.addColorStop(1,'rgba(255,200,90,.35)');
  x.strokeStyle=g; x.lineWidth=compact?3:4; x.lineCap='round'; x.beginPath(); x.moveTo(cx,cy); x.lineTo(sp[0],sp[1]); x.stroke();
  rg=x.createRadialGradient(sp[0],sp[1],0,sp[0],sp[1],14); rg.addColorStop(0,'rgba(255,248,210,1)'); rg.addColorStop(1,'rgba(255,158,27,0)');
  x.fillStyle=rg; x.beginPath(); x.arc(sp[0],sp[1],14,0,7); x.fill();
  x.fillStyle='#fff3c4'; x.font='bold '+(compact?12:13)+'px system-ui,sans-serif'; x.textAlign='left'; x.fillText('z = '+num(z)+'°',sp[0]+12,sp[1]+(z<25?16:4));
  // tuynuk
  x.fillStyle='#fff3c4'; x.beginPath(); x.arc(cx,cy,3.5,0,7); x.fill(); x.strokeStyle='rgba(255,243,196,.55)'; x.strokeRect(cx-9,cy-12,18,9);
  if(!compact){ x.fillStyle='#c9d4f5'; x.font=fs+'px system-ui,sans-serif'; x.fillText(lc.slit,cx+14,cy-14); }
  // odam (masshtab) — xandaq tubida, yoyning eng past nuqtasi yonida
  const hp=Math.max(6,1.75/R_ARC*R), bx=cx+6, by=cy+R-3;
  x.strokeStyle='#ffd27a'; x.fillStyle='#ffd27a'; x.lineWidth=1.3;
  x.beginPath(); x.arc(bx,by-hp+hp*0.12,hp*0.12,0,7); x.fill(); x.beginPath(); x.moveTo(bx,by-hp*0.76); x.lineTo(bx,by-hp*0.3); x.lineTo(bx-hp*0.15,by); x.moveTo(bx,by-hp*0.3); x.lineTo(bx+hp*0.15,by); x.stroke();
  if(!compact){ x.strokeStyle='rgba(255,210,122,.55)'; x.beginPath(); x.moveTo(bx-3,by-hp*0.6); x.lineTo(cx-20,by-34); x.stroke();
    x.fillStyle='#ffd27a'; x.font=fs+'px system-ui,sans-serif'; x.textAlign='right'; x.fillText(T(TX.man),cx-22,by-36); x.textAlign='left';
    x.fillStyle='rgba(200,212,245,.75)'; x.textAlign='right'; x.fillText(T(TX.scale),w-10,hgt-8); }
  return z;
}

/* ======================= 🏛 3D rasadxona ======================= */
const O={ ok:false, r:null, sc:null, cam:null, ctl:null, raf:0, clip:null, cutC:60, sunL:null, hemi:null, skyU:null, sky:null, beam:null, spotS:null, spotL:null, apS:null,
  labels:[], camGoal:null, last:0, host:null, ro:null, disp:[] };
function cTex(w,h,draw,rep){ const THREE=window.THREE, c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=8; if(rep){ t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rep[0],rep[1]); } O.disp.push(t); return t; }
const rnd=(()=>{ let s=7; return ()=>{ s=(s*16807)%2147483647; return s/2147483647; }; })();
function texGround(){ return cTex(512,512,(x,w,h)=>{ x.fillStyle='#b99d70'; x.fillRect(0,0,w,h);
  for(let i=0;i<9000;i++){ const v=rnd(); x.fillStyle=v<.5?'rgba(90,70,40,'+(rnd()*.18)+')':'rgba(235,215,170,'+(rnd()*.18)+')'; x.fillRect(rnd()*w,rnd()*h,1+rnd()*3,1+rnd()*3); }
  for(let i=0;i<40;i++){ x.fillStyle='rgba(120,100,60,.06)'; x.beginPath(); x.arc(rnd()*w,rnd()*h,20+rnd()*60,0,7); x.fill(); } },[0.06,0.06]); }
function texTiles(){ return cTex(512,512,(x,w,h)=>{ const n=8, s=w/n; for(let i=0;i<n;i++) for(let j=0;j<n;j++){ const v=200+rnd()*30|0; x.fillStyle='rgb('+v+','+(v-14)+','+(v-40)+')'; x.fillRect(i*s,j*s,s,s); }
  x.strokeStyle='rgba(90,70,45,.7)'; x.lineWidth=3; for(let i=0;i<=n;i++){ x.beginPath(); x.moveTo(i*s,0); x.lineTo(i*s,h); x.moveTo(0,i*s); x.lineTo(w,i*s); x.stroke(); } },[0.25,0.25]); }
function texBrick(dark){ return cTex(512,512,(x,w,h)=>{ x.fillStyle=dark?'#4a3424':'#7a5434'; x.fillRect(0,0,w,h); const bh=24, bw=64;
  for(let r=0;r*bh<h;r++) for(let c=-1;c*bw<w;c++){ const v=rnd()*26-13, base=dark?[96,66,44]:[168,116,72]; x.fillStyle='rgb('+(base[0]+v|0)+','+(base[1]+v|0)+','+(base[2]+v|0)+')'; x.fillRect(c*bw+(r%2?bw/2:0)+2,r*bh+2,bw-4,bh-4); } },[0.5,0.5]); }
function texFacade(){ // Temuriylar uslubi: g'isht, ravoqli tokchalar, firuza-ko'k koshinlar, yulduzli naqsh
  return cTex(2048,768,(x,w,h)=>{ const fl=3, fh=h/fl, nA=16, aw=w/nA;
    x.fillStyle='#b4895a'; x.fillRect(0,0,w,h);
    for(let r=0;r<h;r+=12) for(let c=0;c<w;c+=36){ const v=rnd()*20-10; x.fillStyle='rgba('+(150+v|0)+','+(108+v|0)+','+(66+v|0)+',.55)'; x.fillRect(c+(r/12%2?18:0)+1,r+1,34,10); }
    const star=(cx,cy,r,col)=>{ x.fillStyle=col; x.beginPath(); for(let i=0;i<16;i++){ const a=i*Math.PI/8, rr=i%2?r*.45:r; x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr); } x.closePath(); x.fill(); };
    for(let f=0;f<fl;f++){ const y0=f*fh;
      // qavatlar orasidagi koshin tasma
      x.fillStyle='#1f6f9c'; x.fillRect(0,y0,w,fh*0.11); x.fillStyle='#38b2c4'; x.fillRect(0,y0+fh*0.11-5,w,5);
      for(let c=0;c<w;c+=48) star(c+24,y0+fh*0.055,fh*0.04,'#e9f4f2');
      for(let a=0;a<nA;a++){ const xa=a*aw, m=aw*0.16, x0=xa+m, x1=xa+aw-m, yt=y0+fh*0.22, yb=y0+fh*0.97, cxm=(x0+x1)/2, aR=(x1-x0)/2;
        // ravoq ramkasi (koshin)
        x.fillStyle='#2a7fb0'; x.beginPath(); x.moveTo(x0-8,yb); x.lineTo(x0-8,yt+aR); x.quadraticCurveTo(x0-8,yt-12,cxm,yt-26); x.quadraticCurveTo(x1+8,yt-12,x1+8,yt+aR); x.lineTo(x1+8,yb); x.closePath(); x.fill();
        x.fillStyle='#42c0cf'; x.beginPath(); x.moveTo(x0-3,yb); x.lineTo(x0-3,yt+aR); x.quadraticCurveTo(x0-3,yt-6,cxm,yt-18); x.quadraticCurveTo(x1+3,yt-6,x1+3,yt+aR); x.lineTo(x1+3,yb); x.closePath(); x.fill();
        // tokcha ichi (soya)
        const gg=x.createLinearGradient(0,yt,0,yb); gg.addColorStop(0,'#2a1f16'); gg.addColorStop(1,'#4a3826'); x.fillStyle=gg;
        x.beginPath(); x.moveTo(x0+4,yb); x.lineTo(x0+4,yt+aR); x.quadraticCurveTo(x0+4,yt+4,cxm,yt-8); x.quadraticCurveTo(x1-4,yt+4,x1-4,yt+aR); x.lineTo(x1-4,yb); x.closePath(); x.fill();
        star(cxm,yt+aR*0.9,aR*0.32,'rgba(66,192,207,.85)');
        // burchak bezaklari (spandrel)
        star(xa+m*0.5,yt+4,m*0.35,'#e9d27a'); }
    }
    // yuqori kitobaga o'xshash tasma
    x.fillStyle='#174f78'; x.fillRect(0,0,w,fh*0.08);
    x.strokeStyle='#f0e6c8'; x.lineWidth=3; for(let c=0;c<w;c+=26){ x.beginPath(); x.moveTo(c,fh*0.065); x.lineTo(c,fh*0.02); x.lineTo(c+13,fh*0.02); x.lineTo(c+13,fh*0.05); x.stroke(); }
  }); }
function texScale(){ return cTex(4096,128,(x,w,h)=>{ x.fillStyle='#efe8d8'; x.fillRect(0,0,w,h);
  for(let i=0;i<300;i++){ x.strokeStyle='rgba(150,140,120,'+(rnd()*.12)+')'; x.lineWidth=1+rnd()*2; x.beginPath(); const y=rnd()*h; x.moveTo(rnd()*w,y); x.bezierCurveTo(rnd()*w,rnd()*h,rnd()*w,rnd()*h,rnd()*w,y); x.stroke(); }
  for(let q=0;q<=A_MAX*4;q++){ const d=q/4, u=d/A_MAX*w, big=q%40===0, mid=q%20===0, one=q%4===0, len=big?h*.62:mid?h*.46:one?h*.3:h*.14;
    x.fillStyle=big||mid?'#2a1b0c':'rgba(50,34,18,.8)'; x.fillRect(u-(big?2:1),0,big?4:one?2:1,len); x.fillRect(u-(big?2:1),h-len,big?4:one?2:1,len);
    if(big){ x.font='bold 30px Georgia,serif'; x.textAlign='center'; x.fillStyle='#3a250f'; x.fillText(String(d),u+(d===0?18:0),h/2+11); } }
  }); }

function obsBuild(host){
  const THREE=window.THREE; if(!THREE||!THREE.OrbitControls) return false;
  const cv=host.querySelector('canvas');
  let r; try{ r=new THREE.WebGLRenderer({ canvas:cv, antialias:true, powerPreference:'high-performance' }); }catch(e){ return false; }
  O.r=r; O.host=host; O.disp=[];
  r.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); r.shadowMap.enabled=true; r.shadowMap.type=THREE.PCFSoftShadowMap;
  r.localClippingEnabled=true; r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.05;
  const sc=new THREE.Scene(); O.sc=sc;
  const cam=new THREE.PerspectiveCamera(42,1.6,0.3,3000); cam.position.set(82,46,78); O.cam=cam;
  const ctl=new THREE.OrbitControls(cam,cv); ctl.target.set(0,8,0); ctl.enableDamping=true; ctl.dampingFactor=0.08;
  ctl.minDistance=5; ctl.maxDistance=320; ctl.maxPolarAngle=Math.PI*0.495; O.ctl=ctl;
  ctl.addEventListener('start',()=>{ O.camGoal=null; });
  // osmon
  O.skyU={ uSun:{ value:new THREE.Vector3(0,1,0) } };
  const sky=new THREE.Mesh(new THREE.SphereGeometry(1400,40,20),new THREE.ShaderMaterial({ uniforms:O.skyU, side:THREE.BackSide, depthWrite:false,
    vertexShader:'varying vec3 vD; void main(){ vD=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:[
      'uniform vec3 uSun; varying vec3 vD;',
      'float hs(vec3 p){ return fract(sin(dot(p,vec3(12.9898,78.233,45.164)))*43758.5453); }',
      'void main(){ vec3 d=normalize(vD); vec3 sN=normalize(uSun); float s=sN.y; float up=clamp(d.y,0.0,1.0);',
      ' float day=smoothstep(-0.12,0.22,s);',
      ' vec3 zen=mix(vec3(0.012,0.018,0.055),vec3(0.13,0.34,0.74),day);',
      ' vec3 hor=mix(vec3(0.035,0.05,0.11),vec3(0.60,0.76,0.92),day);',
      ' float tw=exp(-pow(s*5.0,2.0));',
      ' float tow=max(dot(normalize(vec3(d.x,0.0,d.z)+1e-4),normalize(vec3(sN.x,0.0,sN.z)+1e-4)),0.0);',
      ' hor=mix(hor,vec3(1.0,0.48,0.2),tw*0.8*(0.3+0.7*tow));',
      ' vec3 c=mix(hor,zen,pow(up,0.5));',
      ' if(d.y<0.0) c=mix(hor*0.7,vec3(0.06,0.05,0.04),clamp(-d.y*5.0,0.0,1.0));',
      ' float sd=max(dot(d,sN),0.0);',
      ' c+=vec3(1.0,0.92,0.75)*(smoothstep(0.9994,0.9997,sd)*6.0+pow(sd,30.0)*0.3*day+pow(sd,5.0)*0.15*tw);',
      ' c+=vec3(step(0.9982,hs(floor(d*300.0))))*(1.0-day)*up*0.9;',
      ' gl_FragColor=vec4(c,1.0); }'].join('\n') }));
  sky.renderOrder=-1; sc.add(sky); O.sky=sky;
  // yorug'lik
  O.hemi=new THREE.HemisphereLight(0xbfd6ff,0x6b5136,0.6); sc.add(O.hemi);
  const sun=new THREE.DirectionalLight(0xfff0d8,2.4); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  const sh=sun.shadow.camera; sh.left=-60; sh.right=60; sh.top=60; sh.bottom=-60; sh.near=10; sh.far=400; sun.shadow.bias=-0.0005; sun.shadow.normalBias=0.04;
  sc.add(sun); sc.add(sun.target); O.sunL=sun;
  // kesish tekisligi: x <= c qoladi (sharqiy yarmi olib tashlanadi)
  O.clip=new THREE.Plane(new THREE.Vector3(-1,0,0),60);
  const clipM=m=>{ m.clippingPlanes=[O.clip]; m.clipShadows=true; return m; };
  const TR={ x0:-1.75, x1:1.75, z0:-7.9, z1:21.6 };   // xandaq teshigi (yer sathida)
  // yer (xandaq teshigi bilan)
  const gs=new THREE.Shape(); gs.absarc(0,0,700,0,Math.PI*2,false);
  const hole=new THREE.Path(); hole.moveTo(TR.x0,-TR.z1); hole.lineTo(TR.x1,-TR.z1); hole.lineTo(TR.x1,-TR.z0); hole.lineTo(TR.x0,-TR.z0); hole.closePath(); gs.holes.push(hole);
  const gGeo=new THREE.ShapeGeometry(gs,96); gGeo.rotateX(-Math.PI/2);
  const ground=new THREE.Mesh(gGeo,new THREE.MeshStandardMaterial({ map:texGround(), roughness:1 })); ground.receiveShadow=true; sc.add(ground);
  // bino ichidagi tosh pol
  const fs=new THREE.Shape(); fs.absarc(0,0,22.9,0,Math.PI*2,false); fs.holes.push(hole);
  const fGeo=new THREE.ShapeGeometry(fs,96); fGeo.rotateX(-Math.PI/2); fGeo.translate(0,0.03,0);
  const floor0=new THREE.Mesh(fGeo,new THREE.MeshStandardMaterial({ map:texTiles(), roughness:.9 })); floor0.receiveShadow=true; sc.add(floor0);
  // bino: tashqi devor (fasad), ichki devor, qavatlar, tepa halqa
  const facade=texFacade(); facade.wrapS=THREE.RepeatWrapping;
  const wallO=new THREE.Mesh(new THREE.CylinderGeometry(23,23,30,128,1,true),clipM(new THREE.MeshStandardMaterial({ map:facade, roughness:.8 })));
  wallO.position.y=15; wallO.castShadow=wallO.receiveShadow=true; sc.add(wallO);
  const wallI=new THREE.Mesh(new THREE.CylinderGeometry(21.6,21.6,30,128,1,true),clipM(new THREE.MeshStandardMaterial({ color:0xd8c7a6, roughness:.95, side:THREE.BackSide })));
  wallI.position.y=15; wallI.receiveShadow=true; sc.add(wallI);
  const rim=new THREE.Mesh(new THREE.RingGeometry(21.6,23.4,128),clipM(new THREE.MeshStandardMaterial({ color:0x8a6a48, roughness:.9, side:THREE.DoubleSide })));
  rim.rotation.x=-Math.PI/2; rim.position.y=30; sc.add(rim);
  const parapet=new THREE.Mesh(new THREE.TorusGeometry(23.1,0.5,8,128),clipM(new THREE.MeshStandardMaterial({ color:0x2a7fb0, roughness:.5 })));
  parapet.rotation.x=Math.PI/2; parapet.position.y=30.1; sc.add(parapet);
  // qavat plitalari (o'rtada sekstant uchun bo'sh joy)
  const rr=21.6, gap=3, s=Math.sqrt(rr*rr-gap*gap);
  const half=(sgn)=>{ const sh2=new THREE.Shape();
    if(sgn<0){ sh2.moveTo(-gap,-s); sh2.lineTo(-gap,s); sh2.absarc(0,0,rr,Math.atan2(s,-gap),Math.atan2(-s,-gap)+Math.PI*2,false); }
    else { sh2.moveTo(gap,s); sh2.lineTo(gap,-s); sh2.absarc(0,0,rr,Math.atan2(-s,gap),Math.atan2(s,gap),false); }
    sh2.closePath(); return sh2; };
  const slabM=clipM(new THREE.MeshStandardMaterial({ color:0xcdb894, roughness:.95 }));
  [10,20].forEach(yy=>{ [-1,1].forEach(sg=>{ const geo=new THREE.ExtrudeGeometry(half(sg),{ depth:0.6, bevelEnabled:false, curveSegments:48 }); geo.rotateX(-Math.PI/2);
    const m=new THREE.Mesh(geo,slabM); m.position.y=yy; m.castShadow=m.receiveShadow=true; sc.add(m); }); });
  // ichki ustunlar (qavatlarni ko'tarib turadi)
  const colM=clipM(new THREE.MeshStandardMaterial({ color:0xc9b28a, roughness:.9 }));
  for(let i=0;i<12;i++){ const a=i/12*Math.PI*2+0.13; if(Math.abs(Math.sin(a))<0.25) continue;
    const c=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.65,30,12),colM); c.position.set(Math.sin(a)*13,15,Math.cos(a)*13); c.castShadow=true; sc.add(c); }
  // xandaq devorlari
  const brickD=new THREE.MeshStandardMaterial({ map:texBrick(true), roughness:.95 });
  const tl=TR.z1-TR.z0, tz=(TR.z1+TR.z0)/2;
  [[TR.x0-0.3,tz,0.6,tl],[TR.x1+0.3,tz,0.6,tl]].forEach(([px,pz,sx,sz])=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(sx,12.2,sz),brickD); m.position.set(px,-6.1,pz); m.receiveShadow=true; sc.add(m); });
  [TR.z0-0.3,TR.z1+0.3].forEach(pz=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(4.1,12.2,0.6),brickD); m.position.set(0,-6.1,pz); m.receiveShadow=true; sc.add(m); });
  const tb=new THREE.Mesh(new THREE.BoxGeometry(3.5,0.3,tl),brickD); tb.position.set(0,-12.1,tz); sc.add(tb);
  // sekstant tanasi: yoy ostidagi g'isht devor (yer ostidan bino ichigacha)
  const P=(a,rad)=>{ rad=rad||R_ARC; return new THREE.Vector3(0,CY-rad*Math.cos(a*D2R),CZ-rad*Math.sin(a*D2R)); };
  const bs=new THREE.Shape(); bs.moveTo(CZ+0.4,-12);
  for(let a=0;a<=A_MAX;a+=1){ const p=P(a,R_ARC+0.12); bs.lineTo(p.z,p.y); }
  bs.lineTo(P(A_MAX).z-0.6,P(A_MAX).y-0.4); bs.lineTo(P(A_MAX).z-0.6,-12); bs.closePath();
  const bGeo=new THREE.ExtrudeGeometry(bs,{ depth:2.4, bevelEnabled:false, curveSegments:4 }); bGeo.rotateY(-Math.PI/2); bGeo.translate(1.2,0,0);
  const body=new THREE.Mesh(bGeo,new THREE.MeshStandardMaterial({ map:texBrick(false), roughness:.92 })); body.castShadow=body.receiveShadow=true; sc.add(body);
  // marmar relslar
  class ArcC extends THREE.Curve{ constructor(xx,rad){ super(); this.xx=xx; this.rad=rad; } getPoint(t,tg){ const p=P(t*A_MAX,this.rad); return (tg||new THREE.Vector3()).set(this.xx,p.y,p.z); } }
  const marble=new THREE.MeshStandardMaterial({ color:0xf3efe4, roughness:.32, metalness:0 });
  [-0.95,0.95].forEach(xx=>{ const m=new THREE.Mesh(new THREE.TubeGeometry(new ArcC(xx,R_ARC-0.1),240,0.17,10,false),marble); m.castShadow=true; m.receiveShadow=true; sc.add(m); });
  // graduslangan marmar tasma (0..72°)
  { const n=288, pos=[], nor=[], uv=[], idx=[];
    for(let i=0;i<=n;i++){ const a=i/n*A_MAX, p=P(a,R_ARC-0.04), nn=new THREE.Vector3(0,CY,CZ).sub(p).normalize();
      [-0.78,0.78].forEach((xx,k)=>{ pos.push(xx,p.y,p.z); nor.push(nn.x,nn.y,nn.z); uv.push(i/n,k); }); if(i<n){ const b=i*2; idx.push(b,b+2,b+1,b+1,b+2,b+3); } }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx);
    const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({ map:texScale(), roughness:.35, side:THREE.DoubleSide })); m.receiveShadow=true; sc.add(m); }
  // tuynuk: tepa to'sinda teshik
  const apM=new THREE.MeshStandardMaterial({ color:0x9a7a55, roughness:.85 });
  [[-1.6,0],[1.6,0]].forEach(([dx])=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.0,1.4),apM); m.position.set(dx,CY+0.2,CZ+0.6); m.castShadow=true; sc.add(m); });
  const beamTop=new THREE.Mesh(new THREE.BoxGeometry(6,0.6,1.4),apM); beamTop.position.set(0,CY+1.0,CZ+0.6); beamTop.castShadow=true; sc.add(beamTop);
  [-2.8,2.8].forEach(dx=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(0.8,CY+1.3,0.9),apM); m.position.set(dx,(CY+1.3)/2-0.1,CZ+0.8); m.castShadow=true; sc.add(m); });
  // R o'lchov chizig'i
  { const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.0,CY,CZ),P(30,R_ARC-0.3)]);
    const ln=new THREE.Line(g,new THREE.LineDashedMaterial({ color:0xdbe4ff, dashSize:0.8, gapSize:0.6, transparent:true, opacity:.7 })); ln.computeLineDistances(); sc.add(ln); }
  // odamlar (masshtab uchun): biri xandaq tubida, biri eshik oldida
  const man=(px,py,pz,col)=>{ const g=new THREE.Group(), m=new THREE.MeshStandardMaterial({ color:col, roughness:.7 });
    const b=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.24,1.5,12),m); b.position.y=0.75; const hd=new THREE.Mesh(new THREE.SphereGeometry(0.13,12,10),new THREE.MeshStandardMaterial({ color:0xe0b892, roughness:.7 })); hd.position.y=1.63;
    g.add(b,hd); g.position.set(px,py,pz); g.traverse(o=>{ if(o.isMesh) o.castShadow=true; }); sc.add(g); return g; };
  const manT=man(0,-11+0.25,CZ-0.6,0x2f6db0); man(26.5,0,4,0xb04a3a);
  // nur, dog' va yorug'lik
  const bMat=new THREE.MeshBasicMaterial({ color:0xffe7a0, transparent:true, opacity:.32, blending:THREE.AdditiveBlending, depthWrite:false });
  O.beam=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.6,1,16,1,true),bMat); O.beam.visible=false; sc.add(O.beam);
  const glowT=cTex(128,128,(x,w,h)=>{ const g=x.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2); g.addColorStop(0,'rgba(255,250,225,1)'); g.addColorStop(.25,'rgba(255,220,130,.85)'); g.addColorStop(1,'rgba(255,170,60,0)'); x.fillStyle=g; x.fillRect(0,0,w,h); });
  O.spotS=new THREE.Sprite(new THREE.SpriteMaterial({ map:glowT, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending })); O.spotS.scale.set(2.4,2.4,1); O.spotS.visible=false; sc.add(O.spotS);
  O.apS=new THREE.Sprite(new THREE.SpriteMaterial({ map:glowT, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending })); O.apS.scale.set(1.6,1.6,1); O.apS.position.set(0,CY,CZ); O.apS.visible=false; sc.add(O.apS);
  O.spotL=new THREE.PointLight(0xffd88a,0,14,2); sc.add(O.spotL);
  // HTML yorliqlar
  O.labels=[[TX.lAperture,new THREE.Vector3(0,CY+2.2,CZ+0.6)],[TX.lArc,P(58,R_ARC-1.5)],[TX.lTrench,new THREE.Vector3(0,-4,TR.z1-3)],
    [TX.lMan,manT.position.clone().add(new THREE.Vector3(0,2.2,0))],[TX.lBuild,new THREE.Vector3(0,34,-23)]]
    .map(([t,p])=>{ const el=document.createElement('div'); el.className='ub3d-lbl'; el.textContent=T(t); host.querySelector('.ub3d-lbls').appendChild(el); return { el, p }; });
  // o'lcham
  const resize=()=>{ const w=host.clientWidth, h=Math.round(Math.min(560,Math.max(300,w*0.58))); r.setSize(w,h,false); cv.style.height=h+'px'; cam.aspect=w/h; cam.updateProjectionMatrix(); };
  resize(); O.ro=new ResizeObserver(resize); O.ro.observe(host);
  O.ok=true; return true;
}
function sunDir(N,hr){ const THREE=window.THREE, d=decl(N)*D2R, p=LAT*D2R, Hh=(hr-12)*15*D2R, sinh=Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(Hh);
  const east=-Math.cos(d)*Math.sin(Hh), north=Math.cos(p)*Math.sin(d)-Math.sin(p)*Math.cos(d)*Math.cos(Hh);
  return { v:new THREE.Vector3(east,sinh,-north).normalize(), h:Math.asin(sinh)/D2R }; }
function obsUpdate(){
  const THREE=window.THREE, sd=sunDir(S.day,S.hour), v=sd.v, up=v.y;
  O.skyU.uSun.value.copy(v);
  O.sunL.position.copy(v).multiplyScalar(200); O.sunL.target.position.set(0,0,0);
  const dayK=THREE.MathUtils.smoothstep(up,-0.05,0.25);
  O.sunL.intensity=1.75*dayK; O.sunL.color.setHSL(0.09,0.7,0.62+0.3*THREE.MathUtils.smoothstep(up,0,0.5));
  O.hemi.intensity=0.08+0.42*THREE.MathUtils.smoothstep(up,-0.2,0.3);
  O.r.toneMappingExposure=0.85+0.45*(1-dayK);
  // nur tuynukdan o'tib, quyoshga qarama-qarshi yo'nalishda R masofada yoyga (meridian tekisligiga) tushadi
  const C=new THREE.Vector3(0,CY,CZ), spot=C.clone().addScaledVector(v,-R_ARC), onArc=up>0.02&&Math.abs(spot.x)<0.8&&spot.y<CY;
  const near=up>0.02&&Math.abs(spot.x)<2.6&&spot.y<CY;
  let read=null;
  if(near){ const mid=C.clone().add(spot).multiplyScalar(0.5), len=C.distanceTo(spot);
    O.beam.position.copy(mid); O.beam.scale.set(1,len,1); O.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),C.clone().sub(spot).normalize());
    O.beam.visible=true; O.beam.material.opacity=(onArc?0.34:0.16)*THREE.MathUtils.smoothstep(up,0.02,0.2);
    O.spotS.position.copy(spot).addScaledVector(C.clone().sub(spot).normalize(),0.25); O.spotS.visible=true; O.spotS.material.opacity=onArc?1:0.45;
    O.spotL.position.copy(O.spotS.position); O.spotL.intensity=onArc?3:1; O.apS.visible=true;
    if(onArc) read=Math.atan2(CZ-spot.z,CY-spot.y)/D2R;
  } else { O.beam.visible=false; O.spotS.visible=false; O.spotL.intensity=0; O.apS.visible=false; }
  return { h:sd.h, read, spot };
}
function obsFrame(t){
  O.raf=requestAnimationFrame(obsFrame);
  if(!O.ok||document.hidden) return;
  const dt=Math.min(0.25,(t-(O.last||t))/1000); O.last=t;   // sekin kadrlarda ham animatsiya haqiqiy vaqtda
  if(S.playDay){ const nearNoon=Math.abs(S.hour-12)<0.13; S.hour+=dt*(nearNoon?0.035:1.1); if(S.hour>19.5){ S.hour=4.5; } const sl=$('#ubHour'); if(sl) sl.value=S.hour; }
  // kesish animatsiyasi
  const goal=S.cut?0.4:60; O.clip.constant+=(goal-O.clip.constant)*Math.min(1,dt*3.5);
  if(O.camGoal){ O.cam.position.lerp(O.camGoal.pos,Math.min(1,dt*2.2)); O.ctl.target.lerp(O.camGoal.tgt,Math.min(1,dt*2.2)); if(O.cam.position.distanceTo(O.camGoal.pos)<0.2) O.camGoal=null; }
  O.ctl.update(); O.sky.position.copy(O.cam.position);
  const st=obsUpdate(); O.r.render(O.sc,O.cam); obsHud(st);
  // yorliqlar
  const w=O.host.clientWidth, h=O.r.domElement.clientHeight, v=new window.THREE.Vector3();
  O.labels.forEach(l=>{ v.copy(l.p).project(O.cam); const vis=v.z<1&&Math.abs(v.x)<1.05&&Math.abs(v.y)<1.05;
    l.el.style.opacity=vis?1:0; if(vis) l.el.style.transform='translate('+((v.x*0.5+0.5)*w)+'px,'+((-v.y*0.5+0.5)*h)+'px) translate(-50%,-100%)'; });
}
function obsHud(st){
  const set=(id,t)=>{ const e=$(id); if(e&&e.textContent!==t) e.textContent=t; };
  set('#ubO_date',H().fmtDate(S.day)); set('#ubO_time',hm(S.hour)); set('#ubO_alt',st.h>-0.5?num(st.h)+'°':T(TX.night));
  set('#ubO_read',st.read!=null?num(st.read)+'°':'— '+T(TX.wait));
  const rv=$('#ubO_read'); if(rv) rv.classList.toggle('hot',st.read!=null);
  const pb=$('#ubO_play'); if(pb) pb.textContent=S.playDay?T(TX.pause):T(TX.play);
}
function obsStart(){ if(!O.ok){ const host=$('.ub3d'); if(!host) return; if(!obsBuild(host)){ host.classList.add('nogl'); host.querySelector('.ub3d-msg').textContent=T(TX.noGl); return; } }
  if(!O.raf){ O.last=0; O.raf=requestAnimationFrame(obsFrame); } window.__labCover=true; }
function obsStop(){ if(O.raf){ cancelAnimationFrame(O.raf); O.raf=0; } window.__labCover=false; }
function obsDispose(){ obsStop(); if(!O.r) { O.ok=false; return; }
  if(O.ro) O.ro.disconnect();
  O.sc.traverse(o=>{ if(o.geometry) o.geometry.dispose(); const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[]; ms.forEach(m=>{ if(m.map) m.map.dispose(); m.dispose(); }); });
  O.disp.forEach(t=>t.dispose()); O.ctl.dispose(); O.r.dispose(); try{ O.r.forceContextLoss(); }catch(e){}
  Object.assign(O,{ ok:false, r:null, sc:null, cam:null, ctl:null, labels:[], camGoal:null, host:null, ro:null, disp:[] }); }
function obsView(kind){ const THREE=window.THREE; if(!O.ok) return;
  if(kind==='spot'){ S.cut=true; syncCut(); const z=zOf(S.day), t=new THREE.Vector3(0,CY-R_ARC*Math.cos(z*D2R),CZ-R_ARC*Math.sin(z*D2R));
    // dog' yer ostida (xandaqda) bo'lsa — xandaqqa deyarli tepadan qaraymiz, aks holda devor to'sadi
    O.camGoal={ tgt:t, pos:t.clone().add(t.y<1?new THREE.Vector3(2.2,15,7.5):new THREE.Vector3(10,4,6)) }; if(Math.abs(S.hour-12)>0.05){ S.hour=12; const sl=$('#ubHour'); if(sl) sl.value=12; } }
  else O.camGoal={ tgt:new THREE.Vector3(0,8,0), pos:new THREE.Vector3(82,46,78) }; }
function syncCut(){ const b=$('#ubO_cut'); if(b) b.classList.toggle('on',S.cut); }

/* ======================= ⭐ Zij yulduzlari ======================= */
function prec(raH,dec,Y){ const a=raH*15*D2R, d=dec*D2R, ce=Math.cos(EPS), se=Math.sin(EPS);
  const x=Math.cos(d)*Math.cos(a), y=Math.cos(d)*Math.sin(a), z=Math.sin(d);
  let l=Math.atan2(y*ce+z*se,x); const b=Math.asin(-y*se+z*ce); l+=(Y-2000)*50.29/3600*D2R;
  const X=Math.cos(b)*Math.cos(l), Yc=Math.cos(b)*Math.sin(l), Z=Math.sin(b);
  return [((Math.atan2(Yc*ce-Z*se,X)/D2R/15)%24+24)%24, Math.asin(Yc*se+Z*ce)/D2R]; }
function bvRGB(bv){ bv=Math.max(-0.3,Math.min(1.8,bv==null?0.6:bv)); const k=(bv+0.3)/2.1; return 'rgb('+(200+55*Math.min(1,k*1.6)|0)+','+(215-40*k|0)+','+(255-120*k|0)+')'; }
function conName(k){ const A=window.SKY_ASTRO; const a=A&&A.CN&&A.CN[k]; return a?a[{uz:0,ru:1,en:2}[L()]]:k; }
function drawZij(){
  const cv=$('#ubZcv'); if(!cv) return; const w=cv.clientWidth||600, hgt=Math.round(Math.max(240,Math.min(420,w*0.52)));
  const x=fit(cv,w,hgt), ml=34, mr=10, mt=12, mb=24, pw=w-ml-mr, ph=hgt-mt-mb;
  const X=ra=>ml+(24-ra)/24*pw, Y=dec=>mt+(90-dec)/180*ph;
  x.fillStyle='#070c1c'; x.fillRect(0,0,w,hgt);
  // Samarqanddan ko'rinmaydigan hudud
  const lim=-(90-LAT); x.fillStyle='rgba(220,70,60,.16)'; x.fillRect(ml,Y(lim),pw,Y(-90)-Y(lim));
  x.strokeStyle='rgba(255,120,100,.75)'; x.lineWidth=1.2; x.beginPath(); x.moveTo(ml,Y(lim)); x.lineTo(ml+pw,Y(lim)); x.stroke();
  x.setLineDash([4,4]); x.strokeStyle='rgba(255,190,120,.55)'; const tlim=-(90-37.22); x.beginPath(); x.moveTo(ml,Y(tlim)); x.lineTo(ml+pw,Y(tlim)); x.stroke(); x.setLineDash([]);
  x.font='10.5px system-ui,sans-serif'; x.fillStyle='#ff9d8c'; x.textAlign='left'; x.fillText(T(TX.never)+' (δ < −50,3°)',ml+6,Y(-84));
  x.fillStyle='rgba(255,200,140,.8)'; x.textAlign='right'; x.fillText('- - -  '+T(TX.termez)+' (δ −52,8°)',ml+pw-6,Y(-84));
  // to'r
  x.strokeStyle='rgba(120,150,220,.13)'; x.lineWidth=1; x.fillStyle='#6e7ca6'; x.font='9.5px system-ui,sans-serif';
  for(let h=0;h<=24;h+=2){ x.beginPath(); x.moveTo(X(h),mt); x.lineTo(X(h),mt+ph); x.stroke(); if(h<24){ x.textAlign='center'; x.fillText(h+'h',X(h),hgt-8); } }
  for(let d=-60;d<=60;d+=30){ x.beginPath(); x.moveTo(ml,Y(d)); x.lineTo(ml+pw,Y(d)); x.stroke(); x.textAlign='right'; x.fillText((d>0?'+':'')+d+'°',ml-4,Y(d)+3); }
  x.strokeStyle='rgba(160,190,255,.35)'; x.beginPath(); x.moveTo(ml,Y(0)); x.lineTo(ml+pw,Y(0)); x.stroke();
  // ekliptika (tanlangan yil uchun ham bir xil chiziq — u yulduzlarga nisbatan siljimaydi, yulduzlar uning bo'ylab siljiydi)
  x.setLineDash([6,4]); x.strokeStyle='rgba(255,213,79,.5)'; x.beginPath();
  for(let i=0;i<=96;i++){ const l=i/96*Math.PI*2, ra=((Math.atan2(Math.sin(l)*Math.cos(EPS),Math.cos(l))/D2R/15)%24+24)%24, dec=Math.asin(Math.sin(EPS)*Math.sin(l))/D2R;
    const px=X(ra), py=Y(dec); if(i&&Math.abs(px-x._lx)>pw/2) x.moveTo(px,py); else i?x.lineTo(px,py):x.moveTo(px,py); x._lx=px; } x.stroke(); x.setLineDash([]);
  x.fillStyle='rgba(255,213,79,.75)'; x.textAlign='left'; x.fillText(T(TX.ecl),X(6.2),Y(23.4)-6); x.fillStyle='rgba(170,195,255,.7)'; x.fillText(T(TX.eq),X(23.6),Y(0)-5);
  // yulduzlar: 1437 dan tanlangan yilgacha iz
  const cat=window.STAR_CATALOG||[]; S.zPts=[];
  cat.forEach(s=>{ const a=prec(s.ra,s.dec,1437), b=prec(s.ra,s.dec,S.zYear), r=Math.max(1.2,3.6-s.mag*0.75);
    const ax=X(a[0]), ay=Y(a[1]), bx=X(b[0]), by=Y(b[1]);
    if(Math.abs(ax-bx)<pw/2&&S.zYear>1437){ x.strokeStyle='rgba(140,180,255,.35)'; x.lineWidth=1; x.beginPath(); x.moveTo(ax,ay); x.lineTo(bx,by); x.stroke(); }
    const sel=S.zSel===s; x.fillStyle=bvRGB(s.bv); x.beginPath(); x.arc(bx,by,sel?r+1.5:r,0,7); x.fill();
    if(sel){ x.strokeStyle='#ffd54f'; x.lineWidth=1.5; x.beginPath(); x.arc(bx,by,r+5,0,7); x.stroke(); }
    if(s.name&&s.mag<1.2){ x.fillStyle='rgba(220,230,255,.75)'; x.font='9.5px system-ui,sans-serif'; x.textAlign='left'; x.fillText(s.name,bx+r+3,by+3); }
    S.zPts.push([bx,by,s]); });
  const sh=(S.zYear-1437)*50.29/3600; const so=$('#ubZshift'); if(so) so.textContent=T(TX.shift)+'+'+num(sh,2)+'° ('+(S.zYear-1437)+')';
  zInfo();
}
function zInfo(){ const box=$('#ubZinfo'); if(!box) return; const s=S.zSel;
  if(!s){ box.innerHTML=''; return; }
  const a=prec(s.ra,s.dec,1437), b=prec(s.ra,s.dec,S.zYear), fr=(p)=>'α '+Math.floor(p[0])+'h'+pad(Math.floor((p[0]%1)*60))+'m · δ '+dms(p[1]);
  const maxH=90-Math.abs(LAT-b[1]), vis=b[1]>-(90-LAT);
  box.innerHTML='<b>'+esc(s.name||s.id)+'</b> <span>'+esc(conName(s.con))+'</span><div>1437: '+fr(a)+'</div><div>'+S.zYear+': '+fr(b)+'</div><div class="'+(vis?'ok':'no')+'">'+
    (vis?esc(T(TX.maxAlt))+': '+num(maxH)+'°':'🚫 '+esc(T(TX.noRise)))+'</div>'; }

/* ======================= Bo'limlarni qurish ======================= */
function paneObs(){ return '<div class="ub3d"><canvas></canvas><div class="ub3d-lbls"></div><div class="ub3d-msg"></div>'+
  '<div class="ub3d-hud"><div><span>'+esc(T(TX.date))+'</span><b id="ubO_date"></b></div><div><span>'+esc(T(TX.time))+'</span><b id="ubO_time"></b></div>'+
  '<div><span>'+esc(T(TX.alt))+'</span><b id="ubO_alt"></b></div><div><span>'+esc(T(TX.read))+'</span><b id="ubO_read" class="ub-z"></b></div></div>'+
  '<div class="ub3d-tools"><button class="sn-chip" id="ubO_cut">'+esc(T(TX.cut))+'</button><button class="sn-chip" id="ubO_spot">'+esc(T(TX.spot))+'</button><button class="sn-chip" id="ubO_view">'+esc(T(TX.view))+'</button></div></div>'+
  '<div class="ub-ctl"><label><span>'+esc(T(TX.date))+'</span><input type="range" id="ubDay3" min="0" max="364" step="1" value="'+S.day+'"></label>'+
  '<label><span>'+esc(T(TX.time))+'</span><input type="range" id="ubHour" min="4.5" max="19.5" step="0.0083" value="'+S.hour+'"></label>'+
  '<div class="ub-btns"><button class="sn-chip" id="ubO_play"></button><button class="sn-chip" id="ubO_noon">'+esc(T(TX.noon))+'</button>'+dateChips('ubO_d')+'</div></div>'+
  '<p class="ub-note">'+esc(T(TX.note))+'</p>'; }
function dateChips(cls){ const lc=H().loc(); return [171,79,354].map((d,i)=>'<button class="sn-chip '+cls+'" data-d="'+d+'">'+esc(lc.dates[i])+'</button>').join(''); }
function paneSext(){ const lc=H().loc(); return '<canvas class="ub-cv" id="ubScv"></canvas>'+
  '<div class="ub-stats"><div class="ub-stat"><span class="k">'+esc(lc.hudDate)+'</span><span class="v" id="ubS_date"></span></div><div class="ub-stat"><span class="k">'+esc(lc.hudH)+'</span><span class="v" id="ubS_h"></span></div><div class="ub-stat"><span class="k">'+esc(lc.hudZ)+'</span><span class="v ub-z" id="ubS_z"></span></div></div>'+
  '<div class="ub-ctl"><label><span>'+esc(lc.hudDate)+'</span><input type="range" id="ubSday" min="0" max="364" step="1" value="'+S.sDay+'"></label>'+
  '<div class="ub-btns"><button class="sn-chip" id="ubS_play">'+esc(T(TX.playYear))+'</button>'+dateChips('ubS_d')+'</div></div>'+
  '<div class="ub-aha" id="ubS_aha">'+esc(lc.ahaLat)+'</div><div class="ub-yearnote">📏 '+esc(lc.yearNote)+'</div>'+
  '<div class="ub-try"><button class="sn-chip" id="ubTryBtn">🎯 '+esc(lc.tryBtn)+'</button><div id="ubTryQ"></div><div id="ubTryOpts"></div><div id="ubTryMsg"></div></div>'; }
function paneHist(){ const lc=H().loc(); return '<div class="ub-tl">'+TX.hist.map((h,i)=>'<div class="ub-tl-it" style="--i:'+i+'"><div class="ub-tl-y">'+esc(h[0])+'</div><div class="ub-tl-ic">'+h[1]+'</div><div class="ub-tl-c"><b>'+esc(T(h[2]))+'</b><p>'+esc(T(h[3]))+'</p></div></div>').join('')+'</div>'+
  '<p class="ub-quote">'+esc(lc.history[lc.history.length-1])+'</p>'; }
function paneZij(){ return '<p class="ub-note top">'+esc(T(TX.zIntro))+'</p><canvas class="ub-cv" id="ubZcv"></canvas>'+
  '<div class="ub-ctl"><label><span>'+esc(T(TX.year))+'</span><input type="range" id="ubZy" min="1437" max="2026" step="1" value="'+S.zYear+'"></label>'+
  '<div class="ub-btns"><button class="sn-chip" id="ubZplay">▶ 1437 → 2026</button><b id="ubZyv" class="ub-yv">'+S.zYear+'</b><span id="ubZshift" class="ub-shift"></span></div></div>'+
  '<div id="ubZinfo" class="ub-zinfo"></div><ul class="ub-facts">'+TX.facts.map(f=>'<li>'+esc(T(f))+'</li>').join('')+'</ul>'; }
function paneYou(){ const lc=H().loc();
  let tbl='<tr>'+lc.tblHead.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>';
  lc.tblRows.forEach(r=>{ tbl+='<tr><td>'+esc(r[0])+'</td><td class="ub-uv">'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr><tr class="ub-note-row"><td colspan="3">↳ '+esc(r[3])+'</td></tr>'; });
  return '<p class="ub-note top">'+esc(T(TX.yIntro))+'</p><canvas class="ub-cv" id="ubYcv"></canvas>'+
  '<div class="ub-stats"><div class="ub-stat"><span class="k">'+esc(lc.hudDate)+'</span><span class="v" id="ubY_date"></span></div><div class="ub-stat"><span class="k">z</span><span class="v ub-z" id="ubY_z"></span></div></div>'+
  '<div class="ub-ctl"><label><span>'+esc(lc.hudDate)+'</span><input type="range" id="ubYday" min="0" max="364" step="1" value="'+S.yDay+'"></label></div>'+
  '<div class="ub-steps"><p>'+esc(T(TX.y1))+'</p><button class="sn-chip" id="ubRecS">'+esc(T(TX.recS))+'</button><b id="ubRecSv"></b>'+
  '<p>'+esc(T(TX.y2))+'</p><button class="sn-chip" id="ubRecW">'+esc(T(TX.recW))+'</button><b id="ubRecWv"></b></div>'+
  '<div class="ub-formula">ε = (z<sub>'+esc(T(TX.zW).replace(/^z \(|\)$/g,''))+'</sub> − z<sub>'+esc(T(TX.zS).replace(/^z \(|\)$/g,''))+'</sub>) / 2 &nbsp;·&nbsp; φ = (z<sub>'+esc(T(TX.zW).replace(/^z \(|\)$/g,''))+'</sub> + z<sub>'+esc(T(TX.zS).replace(/^z \(|\)$/g,''))+'</sub>) / 2</div>'+
  '<div id="ubYres"></div><button class="ac-link" id="ubYreset">'+esc(T(TX.again))+'</button>'+
  '<h4 class="ub-h4">'+esc(T(TX.measTitle))+'</h4><table class="ub-table">'+tbl+'</table><div class="ub-foot">⏳ '+esc(lc.tblFoot)+'</div>'; }

function updSext(){ const cv=$('#ubScv'); if(!cv) return; const z=drawSext(cv,S.sDay,false), lc=H().loc();
  $('#ubS_date').textContent=H().fmtDate(S.sDay); $('#ubS_h').textContent=num(90-z)+'°'; $('#ubS_z').textContent=num(z)+'°';
  $('#ubS_aha').classList.toggle('on',Math.abs(S.sDay-79)<3||Math.abs(S.sDay-265)<3); }
function updYou(){ const cv=$('#ubYcv'); if(!cv) return; const z=drawSext(cv,S.yDay,true);
  $('#ubY_date').textContent=H().fmtDate(S.yDay); $('#ubY_z').textContent=num(z,2)+'°';
  $('#ubRecSv').textContent=S.rec.s?'z = '+num(S.rec.s.z,2)+'° · '+H().fmtDate(S.rec.s.d):''; $('#ubRecWv').textContent=S.rec.w?'z = '+num(S.rec.w.z,2)+'° · '+H().fmtDate(S.rec.w.d):'';
  const res=$('#ubYres'); if(!S.rec.s||!S.rec.w){ res.innerHTML=''; return; }
  const e=(S.rec.w.z-S.rec.s.z)/2, f=(S.rec.w.z+S.rec.s.z)/2, eT=23.4393, fT=LAT, err=Math.max(Math.abs(e-eT),Math.abs(f-fT))*60;
  const g=err<5?TX.g1:err<30?TX.g2:TX.g3;
  res.innerHTML='<table class="ub-table ub-res"><tr><th></th><th>'+esc(T(TX.you))+'</th><th>'+esc(T(TX.ub))+'</th><th>'+esc(T(TX.real))+'</th></tr>'+
    '<tr><td>'+esc(T(TX.resE))+'</td><td class="ub-uv">'+dms(e)+'</td><td>23°30′17″</td><td>23°26′ ('+esc(T(TX.now))+')</td></tr>'+
    '<tr><td>'+esc(T(TX.resP))+'</td><td class="ub-uv">'+dms(f)+'</td><td>≈ 39°40′</td><td>39°40′</td></tr></table>'+
    '<p class="ub-grade '+(err<5?'g1':err<30?'g2':'g3')+'">'+esc(T(g))+'</p><p class="ub-note">'+esc(T(TX.modelNote))+'</p>'; }

// Sekstant viktorinasi: z ga qarab faslni topish (5 savol)
function quizNext(){ const lc=H().loc(), q=S.quiz;
  if(q.n>=5){ $('#ubTryQ').textContent=lc.tryDone+': '+q.score+'/5'; $('#ubTryOpts').innerHTML=''; $('#ubTryMsg').textContent=q.score>=4?'🏆':''; S.quiz=null; return; }
  const pool=[[354,20,0],[79,265,1],[171,150,2]], pick=pool[Math.floor(Math.random()*3)];
  q.day=pick[Math.random()<0.5?0:1]; q.ans=pick[2]; S.sDay=q.day; const sl=$('#ubSday'); if(sl) sl.value=S.sDay; updSext();
  $('#ubTryQ').textContent=(q.n+1)+'/5 · '+lc.tryQ; $('#ubTryMsg').textContent='';
  const op=$('#ubTryOpts'); op.innerHTML='';
  lc.trySeasons.forEach((nm,i)=>{ const b=document.createElement('button'); b.className='sn-chip'; b.textContent=nm;
    b.addEventListener('click',()=>{ if(!S.quiz) return; const ok=i===S.quiz.ans; $('#ubTryMsg').textContent=ok?'✅ '+lc.tryOk:'❌ '+lc.tryNo; click(ok?950:300);
      S.quiz.score+=ok?1:0; S.quiz.n++; setTimeout(()=>{ if(S.quiz) quizNext(); },900); }); op.appendChild(b); }); }

function loop2(){ // sekstant yil animatsiyasi va Zij yil animatsiyasi
  S.raf2=0; let again=false;
  if(S.sPlay&&S.tab===1){ S.sDay=(S.sDay+1.2)%365; const sl=$('#ubSday'); if(sl) sl.value=Math.floor(S.sDay); updSext(); again=true; }
  if(S.zPlay&&S.tab===3){ S.zYear=Math.min(2026,S.zYear+4); const sl=$('#ubZy'); if(sl) sl.value=S.zYear; $('#ubZyv').textContent=S.zYear; drawZij(); if(S.zYear>=2026) S.zPlay=false; else again=true; }
  if(again) S.raf2=requestAnimationFrame(loop2);
}
const kick=()=>{ if(!S.raf2) S.raf2=requestAnimationFrame(loop2); };

function wire(){
  const on=(sel,ev,fn)=>{ const e=$(sel); if(e) e.addEventListener(ev,fn); };
  const onAll=(sel,ev,fn)=>S.root.querySelectorAll(sel).forEach(e=>e.addEventListener(ev,()=>fn(e)));
  // 3D
  on('#ubDay3','input',e=>{ S.day=+e.target.value; });
  on('#ubHour','input',e=>{ S.hour=+e.target.value; S.playDay=false; });
  on('#ubO_play','click',()=>{ click(700); S.playDay=!S.playDay; });
  on('#ubO_noon','click',()=>{ click(760); S.playDay=false; S.hour=12; $('#ubHour').value=12; });
  on('#ubO_cut','click',()=>{ click(620); S.cut=!S.cut; syncCut(); });
  on('#ubO_spot','click',()=>{ click(760); obsView('spot'); });
  on('#ubO_view','click',()=>{ click(620); obsView('home'); });
  onAll('.ubO_d','click',b=>{ click(700); S.day=+b.dataset.d; $('#ubDay3').value=S.day; S.hour=12; $('#ubHour').value=12; S.playDay=false; });
  // sekstant
  on('#ubSday','input',e=>{ S.sDay=+e.target.value; S.sPlay=false; syncSPlay(); updSext(); });
  on('#ubS_play','click',()=>{ click(700); S.sPlay=!S.sPlay; syncSPlay(); kick(); });
  onAll('.ubS_d','click',b=>{ click(700); S.sPlay=false; syncSPlay(); S.sDay=+b.dataset.d; $('#ubSday').value=S.sDay; updSext(); });
  on('#ubTryBtn','click',()=>{ click(700); S.sPlay=false; syncSPlay(); S.quiz={ n:0, score:0 }; quizNext(); });
  // Zij
  on('#ubZy','input',e=>{ S.zYear=+e.target.value; S.zPlay=false; $('#ubZyv').textContent=S.zYear; drawZij(); });
  on('#ubZplay','click',()=>{ click(700); if(S.zYear>=2026) S.zYear=1437; S.zPlay=true; kick(); });
  on('#ubZcv','click',e=>{ const r=e.target.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top; let best=null, bd=14;
    (S.zPts||[]).forEach(([px,py,s])=>{ const d=Math.hypot(px-mx,py-my); if(d<bd){ bd=d; best=s; } }); S.zSel=best; click(best?760:440); drawZij(); });
  // Ulug'bek o'rnida
  on('#ubYday','input',e=>{ S.yDay=+e.target.value; updYou(); });
  on('#ubRecS','click',()=>{ click(820); S.rec.s={ z:zOf(S.yDay), d:S.yDay }; updYou(); });
  on('#ubRecW','click',()=>{ click(820); S.rec.w={ z:zOf(S.yDay), d:S.yDay }; updYou(); });
  on('#ubYreset','click',()=>{ click(520); S.rec={ s:null, w:null }; updYou(); });
}
function syncSPlay(){ const b=$('#ubS_play'); if(b) b.textContent=S.sPlay?T(TX.pause):T(TX.playYear); }

function showTab(i){
  S.tab=i; S.root.querySelectorAll('.ub-tab').forEach((b,k)=>b.classList.toggle('active',k===i));
  S.root.querySelectorAll('.ub-pane').forEach((p,k)=>p.classList.toggle('on',k===i));
  if(i===0) obsStart(); else obsStop();
  if(i===1){ updSext(); syncSPlay(); if(S.sPlay) kick(); }
  if(i===3) drawZij();
  if(i===4) updYou();
}
function build(){
  const tabs=document.getElementById('ubTabs'), body=document.getElementById('ubBody'); if(!tabs||!body) return;
  obsDispose();
  S.root=document.getElementById('ubCard');
  const lc=H().loc(); document.getElementById('ubTitle').textContent=lc.title;
  tabs.innerHTML=TX.tabs.map((t,i)=>'<button class="ub-tab" type="button">'+esc(T(t))+'</button>').join('');
  body.innerHTML=[paneObs(),paneSext(),paneHist(),paneZij(),paneYou()].map(h=>'<div class="ub-pane">'+h+'</div>').join('');
  tabs.querySelectorAll('.ub-tab').forEach((b,i)=>b.addEventListener('click',()=>{ click(620); showTab(i); }));
  wire(); showTab(S.tab);
}
let resizeT=0;
window.addEventListener('resize',()=>{ if(!S.open) return; clearTimeout(resizeT); resizeT=setTimeout(()=>{ if(S.tab===1) updSext(); if(S.tab===3) drawZij(); if(S.tab===4) updYou(); },120); });
document.addEventListener('visibilitychange',()=>{ if(S.open&&S.tab===0&&!document.hidden) O.last=0; });

window.ULUGBEK={
  open(){ S.open=true; S.tab=0; build(); },
  close(){ S.open=false; S.playDay=false; S.sPlay=false; S.zPlay=false; obsDispose(); if(S.raf2){ cancelAnimationFrame(S.raf2); S.raf2=0; } window.__labCover=false; },
  rebuild(){ if(S.open) build(); },
  zOf, _O:O, _S:S
};
})();
