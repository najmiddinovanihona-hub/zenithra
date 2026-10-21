/* OSMON+: Kosmik ob-havo · Meteor yomg'irlari · Raketa uchirilishlari · Tutilishlar */
(function(){
const {register,T,L,esc,fmt,hiDPI,loc,locPicker,locName,zoned,tzLabel,click,jd}=window.LAB;
const GROUP={uz:'Osmon',ru:'Небо',en:'Sky'};
const D2R=Math.PI/180, pad=n=>String(n).padStart(2,'0');
const MON={uz:['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],en:['January','February','March','April','May','June','July','August','September','October','November','December']};
const MS={uz:['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'],ru:['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
const WD={uz:['yakshanba','dushanba','seshanba','chorshanba','payshanba','juma','shanba'],ru:['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
const dLong=d=>{ const z=zoned(d,loc().tz); return L()==='en'?T(MON)[z.m]+' '+z.d+', '+z.y:z.d+' '+T(MON)[z.m]+' '+z.y; };
const hm=d=>{ const z=zoned(d,loc().tz); return pad(z.h)+':'+pad(z.mi); };
const cdown=ms=>{ if(ms<0) ms=0; const d=Math.floor(ms/86400000), h=Math.floor(ms/3600000)%24, m=Math.floor(ms/60000)%60, s=Math.floor(ms/1000)%60; return (d?d+(L()==='en'?'d ':(L()==='ru'?' д ':' kun ')):'')+pad(h)+':'+pad(m)+':'+pad(s); };
async function getJ(u,ms){ const c=new AbortController(), t=setTimeout(()=>c.abort(),ms||15000); try{ const r=await fetch(u,{signal:c.signal,cache:'no-store'}); if(r.status===429) throw new Error('rate'); if(!r.ok) throw new Error('http'); return await r.json(); } finally{ clearTimeout(t); } }
const C={ load:{uz:'Yuklanmoqda…',ru:'Загрузка…',en:'Loading…'}, err:{uz:'Ma’lumotni olib bo‘lmadi. Internetni tekshiring.',ru:'Не удалось загрузить данные. Проверьте интернет.',en:'Couldn’t load data. Check your connection.'},
  retry:{uz:'Qayta urinish',ru:'Повторить',en:'Retry'}, upd:{uz:'yangilangan',ru:'обновлено',en:'updated'}, local:{uz:'mahalliy vaqt',ru:'местное время',en:'local time'} };
const spin=()=>`<div class="wx-msg"><span class="wx-spin"></span>${esc(T(C.load))}</div>`;
const fail=(el,fn)=>{ el.innerHTML=`<div class="wx-msg">⚠ ${esc(T(C.err))} <button class="lab-chip" data-retry>${esc(T(C.retry))}</button></div>`; el.querySelector('[data-retry]').onclick=()=>fn(true); };

/* =================== 1. KOSMIK OB-HAVO =================== */
const SW={ name:{uz:'Kosmik ob-havo',ru:'Космическая погода',en:'Space weather'}, sub:{uz:'Quyosh chaqnashlari, magnit bo‘ronlari va qutb shafag‘i — NOAA ma’lumotlari',ru:'Вспышки на Солнце, магнитные бури и полярные сияния — данные NOAA',en:'Solar flares, geomagnetic storms and aurora — live NOAA data'},
  R:{uz:'Radio uzilishlar',ru:'Радиопомехи',en:'Radio blackouts'}, S:{uz:'Radiatsiya bo‘roni',ru:'Радиационный шторм',en:'Radiation storm'}, G:{uz:'Magnit bo‘roni',ru:'Магнитная буря',en:'Geomagnetic storm'},
  kp:{uz:'Kp indeksi (magnit faolligi)',ru:'Индекс Kp (геомагнитная активность)',en:'Kp index (geomagnetic activity)'}, kpF:{uz:'Kp: 3 kun oldin va 3 kunlik prognoz',ru:'Kp: 3 дня назад и прогноз на 3 дня',en:'Kp: past 3 days and 3-day forecast'},
  wind:{uz:'Quyosh shamoli',ru:'Солнечный ветер',en:'Solar wind'}, bz:{uz:'Magnit maydon Bz',ru:'Магнитное поле Bz',en:'Magnetic field Bz'}, flare:{uz:'Rentgen nurlanishi (24 soat)',ru:'Рентгеновский поток (24 ч)',en:'X-ray flux (24 h)'},
  last:{uz:'Oxirgi chaqnash',ru:'Последняя вспышка',en:'Latest flare'}, now:{uz:'hozir',ru:'сейчас',en:'now'}, obs:{uz:'kuzatilgan',ru:'наблюдение',en:'observed'}, pred:{uz:'prognoz',ru:'прогноз',en:'forecast'},
  aur:{uz:'Qutb shafag‘i sizning joyingizda',ru:'Полярное сияние у вас',en:'Aurora at your location'}, mlat:{uz:'Geomagnit kenglik',ru:'Геомагнитная широта',en:'Geomagnetic latitude'},
  need:{uz:'Ko‘rish uchun kerak',ru:'Нужно для наблюдения',en:'Needed to see it'}, never:{uz:'Kp 9 ham yetmaydi — faqat 1859, 1989, 2024-yilgidek o‘ta kuchli bo‘ronlarda ufqda qizil shafaq ko‘rinishi mumkin.',ru:'Даже Kp 9 недостаточно — только при экстремальных бурях (1859, 1989, 2024) у горизонта бывает красное сияние.',en:'Even Kp 9 isn’t enough — only extreme storms (1859, 1989, 2024) bring a red glow to the horizon here.'},
  chance:{uz:'Hozirgi imkoniyat',ru:'Шанс сейчас',en:'Chance now'}, low:{uz:'deyarli yo‘q',ru:'почти нет',en:'very low'}, mid:{uz:'ufqda bo‘lishi mumkin',ru:'возможно у горизонта',en:'possible on the horizon'}, high:{uz:'yuqori!',ru:'высокий!',en:'high!'},
  sun:{uz:'Quyosh hozir (NASA SDO)',ru:'Солнце сейчас (NASA SDO)',en:'The Sun now (NASA SDO)'},
  lv:{uz:['Tinch','Tinch','Past','Mo‘tadil','Faol','G1 kuchsiz bo‘ron','G2 o‘rtacha bo‘ron','G3 kuchli bo‘ron','G4 juda kuchli','G5 o‘ta kuchli'],ru:['Спокойно','Спокойно','Слабая','Умеренная','Активно','G1 слабая буря','G2 умеренная буря','G3 сильная буря','G4 очень сильная','G5 экстремальная'],en:['Quiet','Quiet','Low','Unsettled','Active','G1 minor storm','G2 moderate storm','G3 strong storm','G4 severe storm','G5 extreme storm']},
  note:{uz:'Manba: NOAA Kosmik ob-havo bashorat markazi (SWPC), GOES va DSCOVR/IMAP sun’iy yo‘ldoshlari; Quyosh tasviri — NASA SDO. Ma’lumotlar har 5 daqiqada yangilanadi.',ru:'Источник: NOAA SWPC, спутники GOES и DSCOVR/IMAP; изображение Солнца — NASA SDO. Обновление каждые 5 минут.',en:'Source: NOAA Space Weather Prediction Center, GOES and DSCOVR/IMAP satellites; Sun imagery — NASA SDO. Refreshed every 5 minutes.'} };
const kpCol=k=>k>=8?'#ff3b5c':k>=7?'#ff6a3d':k>=6?'#ff9a3d':k>=5?'#ffc23d':k>=4?'#e6dd5a':'#5fd39a';
const scCol=s=>['#5fd39a','#e6dd5a','#ffc23d','#ff9a3d','#ff6a3d','#ff3b5c'][Math.max(0,Math.min(5,+s||0))];
// Geomagnit kenglik (IGRF-2025 dipol qutbi: 80.8°N, 72.7°W)
const magLat=(la,lo)=>{ const pl=80.8*D2R, pL=-72.7*D2R, a=la*D2R, b=lo*D2R; return Math.asin(Math.sin(a)*Math.sin(pl)+Math.cos(a)*Math.cos(pl)*Math.cos(b-pL))/D2R; };
const flareCls=f=>{ if(!(f>0)) return '—'; const L_=[['X',1e-4],['M',1e-5],['C',1e-6],['B',1e-7],['A',1e-8]]; for(const [c,v] of L_) if(f>=v) return c+(f/v).toFixed(1); return 'A'+(f/1e-8).toFixed(1); };
register('spacewx',{ ico:'☀', group:GROUP, name:SW.name, sub:SW.sub,
  build(body, lab){
    lab.img=lab.img||'0193';
    body.innerHTML=`<div class="sp-scales" id="swSc"></div><div class="lab-grid sp-g"><div>
        <div class="sp-kp" id="swKp">${spin()}</div><div class="sec-title" style="margin-top:14px">${esc(T(SW.kpF))}</div><canvas class="lab-cv" id="swKpC"></canvas>
        <div class="sec-title" style="margin-top:14px">${esc(T(SW.flare))}</div><canvas class="lab-cv" id="swX"></canvas><div class="lab-kv" id="swKv" style="margin-top:10px"></div></div>
      <div><div class="sp-sun"><img id="swImg" alt="" /><div class="sp-sunb">${[['0193','193 Å'],['0171','171 Å'],['0304','304 Å'],['HMIIC','☀']].map(([k,t])=>`<button class="lab-chip" data-i="${k}">${t}</button>`).join('')}</div><div class="sp-sunt">${esc(T(SW.sun))}</div></div>
        <div class="sp-aur" id="swAur"></div></div></div><p class="lab-note">${esc(T(SW.note))}</p>`;
    const $=id=>body.querySelector('#'+id);
    const setImg=()=>{ $('swImg').src='https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_'+lab.img+'.jpg?t='+Math.floor(Date.now()/600000); body.querySelectorAll('[data-i]').forEach(b=>b.classList.toggle('on',b.dataset.i===lab.img)); };
    body.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ lab.img=b.dataset.i; click(740); setImg(); });
    setImg();
    lab.onLoc=()=>{ if(lab.D) aurora(); };
    async function load(force){
      if(!force&&lab.D&&Date.now()-lab.D.t<5*60000){ render(); return; }
      try{ const B='https://services.swpc.noaa.gov/';
        const [sc,kp,kpf,spd,bz,fl,xr]=await Promise.all([getJ(B+'products/noaa-scales.json'),getJ(B+'products/noaa-planetary-k-index.json'),getJ(B+'products/noaa-planetary-k-index-forecast.json'),
          getJ(B+'products/summary/solar-wind-speed.json').catch(()=>null),getJ(B+'products/summary/solar-wind-mag-field.json').catch(()=>null),getJ(B+'json/goes/primary/xray-flares-latest.json').catch(()=>null),getJ(B+'json/goes/primary/xrays-1-day.json',25000).catch(()=>null)]);
        lab.D={t:Date.now(),sc,kp,kpf,spd,bz,fl,xr}; render(); }
      catch(e){ fail($('swKp'),load); }
    }
    function render(){ const D=lab.D;
      const s=D.sc&&D.sc['0']; if(s) $('swSc').innerHTML=['R','S','G'].map(k=>{ const v=s[k]||{}; return `<div class="sp-sc" style="--c:${scCol(v.Scale)}"><b>${k}${v.Scale||0}</b><span>${esc(T(SW[k]))}</span></div>`; }).join('');
      const rows=Array.isArray(D.kp)?D.kp.map(r=>Array.isArray(r)?{t:r[0],k:+r[1]}:{t:r.time_tag,k:+r.Kp}).filter(r=>isFinite(r.k)):[];
      const cur=rows[rows.length-1]||{k:0,t:''}, ki=Math.min(9,Math.round(cur.k));
      $('swKp').innerHTML=`<div class="k">${esc(T(SW.kp))}</div><div class="sp-kpv"><b style="color:${kpCol(cur.k)}">${fmt(cur.k,1)}</b><span>${esc(T(SW.lv)[ki])}</span></div><div class="sp-kpb"><i style="width:${cur.k/9*100}%;background:${kpCol(cur.k)}"></i></div><small>${cur.t?esc(hm(new Date(cur.t.replace(' ','T')+'Z'))+' · '+T(C.local)):''}</small>`;
      kpChart(); xrChart();
      const sp=D.spd&&D.spd[0], bz=D.bz&&D.bz[0], fl=D.fl&&D.fl[0];
      const kv=(k,v)=>`<div><div class="k">${esc(k)}</div><div class="v">${v}</div></div>`;
      $('swKv').innerHTML=(sp?kv(T(SW.wind),fmt(sp.proton_speed,0)+' km/s'):'')+(bz?kv(T(SW.bz),`<span style="color:${bz.bz_gsm<-5?'#ff8a5c':'inherit'}">${bz.bz_gsm>0?'+':''}${fmt(bz.bz_gsm,0)} nT</span> <small style="color:var(--text-dim)">(Bt ${fmt(bz.bt,0)})</small>`):'')
        +(fl?kv(T(SW.last),`<b>${esc(fl.max_class||fl.current_class||'—')}</b> <small style="color:var(--text-dim)">${fl.max_time?esc(hm(new Date(fl.max_time))):''}</small>`):'');
      aurora();
    }
    function kpChart(){ const D=lab.D, cv=$('swKpC'), w=Math.max(280,cv.parentElement.clientWidth), h=150, x=hiDPI(cv,w,h); cv.style.height=h+'px';
      const all=(D.kpf||[]).map(r=>Array.isArray(r)?{t:r[0],k:+r[1],o:r[2]}:{t:r.time_tag,k:+r.kp,o:r.observed}).filter(r=>isFinite(r.k));
      const now=Date.now(), pts=all.filter(r=>{ const t=Date.parse(r.t.replace(' ','T')+'Z'); return t>now-3*86400000-3600000&&t<now+3*86400000+3600000; }); if(!pts.length) return;
      const pl=22, bw=(w-pl-4)/pts.length, Y=k=>h-18-(k/9)*(h-32);
      x.fillStyle='rgba(255,255,255,.03)'; x.fillRect(pl,8,w-pl-4,h-26);
      [5,7].forEach(k=>{ x.strokeStyle='rgba(255,180,80,.25)'; x.setLineDash([3,4]); x.beginPath(); x.moveTo(pl,Y(k)); x.lineTo(w-4,Y(k)); x.stroke(); }); x.setLineDash([]);
      x.fillStyle='#9aa6cc'; x.font='10px "Segoe UI",system-ui,sans-serif'; x.textAlign='right'; [0,3,5,7,9].forEach(k=>x.fillText(k,pl-5,Y(k)+3));
      let nowX=null;
      pts.forEach((r,i)=>{ const t=Date.parse(r.t.replace(' ','T')+'Z'), X=pl+i*bw, pr=r.o==='predicted';
        if(nowX==null&&t+3*3600000>now) nowX=X+bw*Math.min(1,Math.max(0,(now-t)/(3*3600000)));
        x.globalAlpha=pr?0.55:1; x.fillStyle=kpCol(r.k); x.fillRect(X+1,Y(r.k),Math.max(1,bw-2),h-18-Y(r.k)); x.globalAlpha=1;
        const z=zoned(new Date(t),loc().tz); if(z.h<3){ x.fillStyle='#9aa6cc'; x.textAlign='left'; x.fillText(z.d+' '+T(MS)[z.m],X+2,h-5); x.strokeStyle='rgba(255,255,255,.08)'; x.beginPath(); x.moveTo(X,8); x.lineTo(X,h-18); x.stroke(); } });
      if(nowX!=null){ x.strokeStyle='#fff'; x.lineWidth=1.5; x.beginPath(); x.moveTo(nowX,6); x.lineTo(nowX,h-18); x.stroke(); x.fillStyle='#fff'; x.textAlign='center'; x.fillText(T(SW.now),nowX,16); }
    }
    function xrChart(){ const D=lab.D, cv=$('swX'), w=Math.max(280,cv.parentElement.clientWidth), h=150, x=hiDPI(cv,w,h); cv.style.height=h+'px';
      const pts=(D.xr||[]).filter(r=>r.energy==='0.1-0.8nm'&&r.flux>0).map(r=>({t:Date.parse(r.time_tag),f:r.flux})); if(!pts.length){ x.fillStyle='#9aa6cc'; x.fillText('—',w/2,h/2); return; }
      const t0=pts[0].t, t1=pts[pts.length-1].t, pl=22, X=t=>pl+(t-t0)/(t1-t0)*(w-pl-4), lo=-8.5, hi=-3, Y=f=>h-14-(Math.log10(f)-lo)/(hi-lo)*(h-22);
      [['A',-8],['B',-7],['C',-6],['M',-5],['X',-4]].forEach(([c,e],i)=>{ x.fillStyle=i%2?'rgba(255,255,255,.035)':'rgba(255,255,255,.015)'; x.fillRect(pl,Y(10**(e+1)),w-pl-4,Y(10**e)-Y(10**(e+1))); x.fillStyle='#9aa6cc'; x.font='10px "Segoe UI",system-ui,sans-serif'; x.textAlign='right'; x.fillText(c,pl-6,(Y(10**e)+Y(10**(e+1)))/2+3); });
      x.beginPath(); pts.forEach((p,i)=>i?x.lineTo(X(p.t),Y(p.f)):x.moveTo(X(p.t),Y(p.f))); x.strokeStyle='#ffc857'; x.lineWidth=1.4; x.stroke();
      x.fillStyle='#9aa6cc'; x.textAlign='center'; for(let t=Math.ceil(t0/21600000)*21600000;t<t1;t+=21600000) x.fillText(hm(new Date(t)),X(t),h-2);
      const mx=pts.reduce((a,b)=>b.f>a.f?b:a); x.fillStyle='#fff'; x.font='700 11px "Segoe UI",system-ui,sans-serif'; x.fillText(flareCls(mx.f),Math.min(w-20,Math.max(pl+16,X(mx.t))),Math.max(12,Y(mx.f)-6));
    }
    function aurora(){ const o=loc(), ml=magLat(o.lat,o.lon), need=(Math.abs(66.5)-Math.abs(ml))/2.5, D=lab.D, rows=Array.isArray(D.kp)?D.kp:[], last=rows[rows.length-1], kp=last?+(Array.isArray(last)?last[1]:last.Kp):0;
      const ch=need>9?T(SW.low):(kp>=need?T(SW.high):(kp>=need-1.5?T(SW.mid):T(SW.low)));
      $('swAur').innerHTML=`<div class="sec-title" style="margin-top:0">${esc(T(SW.aur))}</div><div class="lab-row" style="margin:4px 0 8px" id="swLoc"></div>
        <div class="lab-kv">${[[T(SW.mlat),fmt(ml,1)+'°'],[T(SW.need),need>9?'Kp > 9':'Kp ≥ '+fmt(Math.max(0,need),1)],[T(SW.chance),ch]].map(([a,b])=>`<div><div class="k">${esc(a)}</div><div class="v">${esc(b)}</div></div>`).join('')}</div>
        ${need>9?`<p class="lab-note" style="margin-top:8px">${esc(T(SW.never))}</p>`:''}`;
      locPicker($('swLoc')); }
    lab.load=load; load(false);
    lab.timer=setInterval(()=>{ if(lab.isOpen) load(true); },5*60000);
  },
  open(){ this.load&&this.load(false); }
});

/* =================== 2. METEOR YOMG'IRLARI =================== */
const MT={ name:{uz:'Meteor yomg‘irlari',ru:'Метеорные потоки',en:'Meteor showers'}, sub:{uz:'Yil davomidagi «yulduz yog‘ishlari» va ularni sizning joyingizdan eng yaxshi kuzatish vaqti',ru:'«Звездопады» года и лучшее время наблюдения из вашего места',en:'The year’s “shooting-star” showers and the best time to watch from your location'},
  peak:{uz:'Cho‘qqi',ru:'Пик',en:'Peak'}, zhr:{uz:'ZHR (ideal sharoitda soatiga)',ru:'ZHR (в идеале, в час)',en:'ZHR (per hour, ideal)'}, exp:{uz:'Sizda kutiladi',ru:'Ожидается у вас',en:'Expected for you'}, ph:{uz:'ta/soat',ru:'в час',en:'/hour'},
  best:{uz:'Eng yaxshi vaqt',ru:'Лучшее время',en:'Best time'}, rad:{uz:'Radiant',ru:'Радиант',en:'Radiant'}, moon:{uz:'Oy',ru:'Луна',en:'Moon'}, spd:{uz:'Tezlik',ru:'Скорость',en:'Speed'}, par:{uz:'Manba jism',ru:'Родительское тело',en:'Parent body'},
  act:{uz:'Faollik',ru:'Активность',en:'Active'}, now:{uz:'HOZIR FAOL',ru:'АКТИВЕН СЕЙЧАС',en:'ACTIVE NOW'}, in:{uz:'kundan keyin',ru:'дн. осталось',en:'days away'}, today:{uz:'bugun kechasi!',ru:'сегодня ночью!',en:'tonight!'},
  night:{uz:'Cho‘qqi kechasi: radiant va Oy balandligi',ru:'Ночь пика: высота радианта и Луны',en:'Peak night: radiant and Moon altitude'}, low:{uz:'radiant past — kam ko‘rinadi',ru:'радиант низко — мало метеоров',en:'radiant low — few meteors'},
  moonBad:{uz:'Oy yorug‘ — xira meteorlarni yashiradi',ru:'Яркая Луна мешает',en:'Bright Moon interferes'}, moonOk:{uz:'Oy halal bermaydi',ru:'Луна не мешает',en:'Moon is out of the way'},
  tip:{uz:'Kuzatish uchun: shahar chirog‘laridan uzoqroq, qorong‘i joyga boring, 20 daqiqa ko‘zingizni qorong‘ilikka moslang va osmonning katta qismiga qarang — radiantga emas, undan 40–60° chetga.',ru:'Совет: уезжайте от городских огней, дайте глазам 20 минут привыкнуть к темноте и смотрите на большую часть неба — не прямо в радиант, а на 40–60° в сторону.',en:'Tip: get away from city lights, give your eyes 20 minutes to adapt, and watch a wide patch of sky 40–60° away from the radiant rather than right at it.'},
  note:{uz:'Sanalar va ZHR — Xalqaro meteor tashkiloti (IMO) taqvimi asosida. «Kutiladi» — radiant balandligi va Oy yorug‘ligi hisobga olingan taxminiy son.',ru:'Даты и ZHR — по календарю IMO. «Ожидается» — оценка с учётом высоты радианта и Луны.',en:'Dates and ZHR follow the IMO calendar. “Expected” is an estimate allowing for radiant height and moonlight.'} };
// [kalit, nom uz/ru/en, faollik boshlanishi (oy,kun), tugashi, cho'qqi (oy,kun), ZHR, RA°, Dec°, v km/s, manba, yulduz turkumi]
const SHW=[
 ['qua',['Kvadrantidlar','Квадрантиды','Quadrantids'],[12,28],[1,12],[1,4],110,230,49,41,'2003 EH1',['Ho‘kizboqar','Волопас','Boötes']],
 ['lyr',['Liridlar','Лириды','Lyrids'],[4,14],[4,30],[4,22],18,271,34,49,'C/1861 G1 (Thatcher)',['Lira','Лира','Lyra']],
 ['eta',['Eta-Akvaridlar','Эта-Аквариды','Eta Aquariids'],[4,19],[5,28],[5,6],50,338,-1,66,'1P/Halley',['Dalv (Qovg‘a)','Водолей','Aquarius']],
 ['sda',['Janubiy Delta-Akvaridlar','Южные дельта-Аквариды','Southern Delta Aquariids'],[7,12],[8,23],[7,30],25,340,-16,41,'96P/Machholz',['Dalv (Qovg‘a)','Водолей','Aquarius']],
 ['per',['Perseidlar','Персеиды','Perseids'],[7,17],[8,24],[8,12],100,48,58,59,'109P/Swift–Tuttle',['Persey','Персей','Perseus']],
 ['dra',['Drakonidlar','Дракониды','Draconids'],[10,6],[10,10],[10,8],10,262,54,20,'21P/Giacobini–Zinner',['Ajdaho','Дракон','Draco']],
 ['ori',['Orionidlar','Ориониды','Orionids'],[10,2],[11,7],[10,21],20,95,16,66,'1P/Halley',['Orion','Орион','Orion']],
 ['nta',['Shimoliy Tauridlar','Северные Тауриды','Northern Taurids'],[10,20],[12,10],[11,12],5,58,22,29,'2P/Encke',['Savr (Buzoq)','Телец','Taurus']],
 ['leo',['Leonidlar','Леониды','Leonids'],[11,6],[11,30],[11,17],15,152,22,71,'55P/Tempel–Tuttle',['Asad (Arslon)','Лев','Leo']],
 ['gem',['Geminidlar','Геминиды','Geminids'],[12,4],[12,20],[12,14],150,112,33,35,'3200 Phaethon',['Javzo (Egizaklar)','Близнецы','Gemini']],
 ['urs',['Ursidlar','Урсиды','Ursids'],[12,17],[12,26],[12,22],10,217,76,33,'8P/Tuttle',['Kichik Ayiq','Малая Медведица','Ursa Minor']]
].map(a=>({k:a[0],n:{uz:a[1][0],ru:a[1][1],en:a[1][2]},s:a[2],e:a[3],p:a[4],zhr:a[5],ra:a[6],dec:a[7],v:a[8],par:a[9],con:{uz:a[10][0],ru:a[10][1],en:a[10][2]}}));
const doy=(m,d)=>{ const n=[0,31,59,90,120,151,181,212,243,273,304,334]; return n[m-1]+d; };
register('meteors',{ ico:'💫', group:GROUP, name:MT.name, sub:MT.sub,
  build(body, lab){
    body.innerHTML=`<div class="lab-row" id="mtLoc" style="margin-top:0"></div><div class="sp-year" id="mtYear"></div><div class="lab-grid sp-g"><div class="sp-mlist" id="mtList"></div><div><div class="sp-mdet" id="mtDet"></div></div></div>
      <p class="lab-note">${esc(T(MT.tip))}</p><p class="lab-note">${esc(T(MT.note))}</p>`;
    const $=id=>body.querySelector('#'+id), A=window.SKY_ASTRO;
    lab.onLoc=()=>{ locPicker($('mtLoc')); calc(); render(); };
    locPicker($('mtLoc'));
    // Cho'qqi kechasi: 17:00 dan ertangi 07:00 gacha, 15 daqiqa qadam
    function night(sh,peakUTC){ const o=loc(), z=zoned(peakUTC,o.tz); const start=Date.UTC(z.y,z.m,z.d-1,17)-o.tz*3600000, pts=[];
      for(let t=start;t<=start+14*3600000;t+=900000){ const J=jd(new Date(t)), B=A.bodies(J), sun=A.altaz(B.sun.ra,B.sun.dec,J,o).alt, mo=A.look('moon',B,J,o).alt, p=A.precess(sh.ra,sh.dec,J), rad=A.altaz(p.ra,p.dec,J,o).alt;
        pts.push({t,sun,moon:mo,ill:B.moon.ill,rad}); }
      let best=null; pts.forEach(q=>{ if(q.sun>-12||q.rad<5) return; const mf=q.moon>0?1-0.75*q.ill:1, r=sh.zhr*Math.sin(q.rad*D2R)*mf; q.r=r; if(!best||r>best.r) best=q; });
      return {pts,best}; }
    function calc(){ const now=new Date(), y=now.getUTCFullYear(), td=doy(now.getUTCMonth()+1,now.getUTCDate());
      lab.rows=SHW.map(sh=>{ let py=y; const pd=doy(sh.p[0],sh.p[1]); if(pd<td-1) py=y+1; const peak=new Date(Date.UTC(py,sh.p[0]-1,sh.p[1],0));
        const sd=doy(sh.s[0],sh.s[1]), ed=doy(sh.e[0],sh.e[1]), active=sd<=ed?(td>=sd&&td<=ed):(td>=sd||td<=ed);
        const n=night(sh,peak); return {sh,peak,active,days:Math.round((peak-now)/86400000),n}; }).sort((a,b)=>a.peak-b.peak);
      if(!lab.sel||!lab.rows.find(r=>r.sh.k===lab.sel)) lab.sel=lab.rows[0].sh.k; }
    function render(){
      const now=new Date(), td=doy(now.getUTCMonth()+1,now.getUTCDate());
      $('mtYear').innerHTML=`<div class="sp-ym">${T(MS).map((m,i)=>`<span style="left:${doy(i+1,1)/365*100}%">${m}</span>`).join('')}</div>`+
        SHW.map((sh,i)=>{ const s=doy(sh.s[0],sh.s[1])/365*100, e=doy(sh.e[0],sh.e[1])/365*100, p=doy(sh.p[0],sh.p[1])/365*100, row=i%3, seg=(a,b)=>`<i class="sp-ys${sh.k===lab.sel?' on':''}" data-k="${sh.k}" style="left:${a}%;width:${Math.max(.6,b-a)}%;top:${22+row*12}px"></i>`;
          return (s<=e?seg(s,e):seg(s,100)+seg(0,e))+`<b class="sp-yp${sh.k===lab.sel?' on':''}" data-k="${sh.k}" title="${esc(T(sh.n))}" style="left:${p}%;top:${19+row*12}px;width:${6+Math.sqrt(sh.zhr)}px;height:${6+Math.sqrt(sh.zhr)}px"></b>`; }).join('')+
        `<em class="sp-yt" style="left:${td/365*100}%"></em>`;
      $('mtYear').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ lab.sel=b.dataset.k; click(780); render(); });
      $('mtList').innerHTML=lab.rows.map(r=>{ const b=r.n.best, exp=b?Math.round(b.r):0;
        return `<button class="sp-mc${r.sh.k===lab.sel?' on':''}" data-k="${r.sh.k}"><span class="sp-mt"><b>${esc(T(r.sh.n))}</b>${r.active?`<em>${esc(T(MT.now))}</em>`:''}</span>
          <span class="sp-md">${esc(dLong(r.peak))} · ${r.days<=0?esc(T(MT.today)):r.days+' '+esc(T(MT.in))}</span>
          <span class="sp-mx"><span>ZHR <b>${r.sh.zhr}</b></span><span>${esc(T(MT.exp))}: <b>~${exp}</b> ${esc(T(MT.ph))}</span><span>🌙 ${Math.round(r.n.pts[0].ill*100)}%</span></span></button>`; }).join('');
      $('mtList').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ lab.sel=b.dataset.k; click(780); render(); });
      const r=lab.rows.find(q=>q.sh.k===lab.sel), sh=r.sh, b=r.n.best, ill=r.n.pts[Math.floor(r.n.pts.length/2)].ill;
      const kv=(k,v)=>`<div><div class="k">${esc(k)}</div><div class="v">${v}</div></div>`;
      $('mtDet').innerHTML=`<h4 class="ed-mnm" style="margin:0">${esc(T(sh.n))}</h4><div class="sp-mdd">${esc(T(MT.peak))}: <b>${esc(dLong(r.peak))}</b> · ${esc(T(MT.act))}: ${sh.s[1]} ${esc(T(MS)[sh.s[0]-1])} – ${sh.e[1]} ${esc(T(MS)[sh.e[0]-1])}</div>
        <div class="lab-kv" style="margin-top:10px">${kv(T(MT.zhr),sh.zhr)}${kv(T(MT.exp),b?'~'+Math.round(b.r)+' '+esc(T(MT.ph)):'—')}${kv(T(MT.best),b?hm(new Date(b.t))+' · '+fmt(b.rad,0)+'°':esc(T(MT.low)))}
          ${kv(T(MT.rad),esc(T(sh.con)))}${kv(T(MT.moon),Math.round(ill*100)+'% · '+esc(T(ill>0.5?MT.moonBad:MT.moonOk)))}${kv(T(MT.spd),sh.v+' km/s')}${kv(T(MT.par),esc(sh.par))}</div>
        <div class="sec-title" style="margin-top:14px">${esc(T(MT.night))}</div><canvas class="lab-cv" id="mtC"></canvas>`;
      chart(r);
    }
    function chart(r){ const cv=$('mtC'), w=Math.max(260,cv.parentElement.clientWidth), h=170, x=hiDPI(cv,w,h); cv.style.height=h+'px';
      const P=r.n.pts, t0=P[0].t, t1=P[P.length-1].t, X=t=>8+(t-t0)/(t1-t0)*(w-16), Y=a=>h-22-Math.max(0,a)/90*(h-34);
      P.forEach((q,i)=>{ if(i===P.length-1) return; const k=Math.max(0,Math.min(1,(q.sun+18)/18)); x.fillStyle=`rgba(${Math.round(10+60*k)},${Math.round(14+90*k)},${Math.round(36+130*k)},1)`; x.fillRect(X(q.t),12,X(P[i+1].t)-X(q.t)+1,h-34); });
      [30,60].forEach(a=>{ x.strokeStyle='rgba(255,255,255,.1)'; x.beginPath(); x.moveTo(8,Y(a)); x.lineTo(w-8,Y(a)); x.stroke(); x.fillStyle='#9aa6cc'; x.font='10px "Segoe UI",system-ui,sans-serif'; x.textAlign='left'; x.fillText(a+'°',10,Y(a)-3); });
      const line=(f,c,wd)=>{ x.beginPath(); let on=false; P.forEach(q=>{ const a=f(q); if(a<0){ on=false; return; } on?x.lineTo(X(q.t),Y(a)):x.moveTo(X(q.t),Y(a)); on=true; }); x.strokeStyle=c; x.lineWidth=wd; x.stroke(); };
      line(q=>q.moon,'rgba(240,236,220,.75)',1.6); line(q=>q.rad,'#7fd0ff',2.4);
      if(r.n.best){ const b=r.n.best; x.fillStyle='#ffd35a'; x.beginPath(); x.arc(X(b.t),Y(b.rad),5,0,6.283); x.fill(); x.fillStyle='#fff'; x.font='700 11px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; x.fillText(hm(new Date(b.t)),X(b.t),Math.max(22,Y(b.rad)-9)); }
      x.fillStyle='#9aa6cc'; x.font='10.5px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; for(let t=Math.ceil(t0/7200000)*7200000;t<t1;t+=7200000) x.fillText(hm(new Date(t)),X(t),h-6);
      x.textAlign='right'; x.font='600 11px "Segoe UI",system-ui,sans-serif'; x.fillStyle='#7fd0ff'; x.fillText('— '+T(MT.rad),w-10,24); x.fillStyle='rgba(240,236,220,.9)'; x.fillText('— '+T(MT.moon),w-10,38);
    }
    lab.calcRender=()=>{ calc(); render(); }; lab.calcRender();
  },
  open(){ this.calcRender&&this.calcRender(); }
});

/* =================== 3. RAKETA UCHIRILISHLARI: kelgusi, o'tganlar (1957-yildan), kompaniyalar =================== */
const LN={ name:{uz:'Raketa uchirilishlari',ru:'Запуски ракет',en:'Rocket launches'}, sub:{uz:'Kelgusi va 1957-yildan beri bo‘lgan barcha uchirilishlar hamda raketa kompaniyalari',ru:'Будущие и все прошедшие с 1957 года запуски и ракетные компании',en:'Upcoming launches, every launch since 1957, and the companies behind them'},
  tUp:{uz:'Kelgusi',ru:'Ближайшие',en:'Upcoming'}, tPast:{uz:'O‘tgan uchirilishlar',ru:'Прошедшие запуски',en:'Past launches'}, tCo:{uz:'Kompaniyalar',ru:'Компании',en:'Companies'},
  next:{uz:'Keyingi uchirilish',ru:'Следующий запуск',en:'Next launch'}, prov:{uz:'Tashkilot',ru:'Оператор',en:'Provider'}, rocket:{uz:'Raketa',ru:'Ракета',en:'Rocket'}, padL:{uz:'Kosmodrom',ru:'Космодром',en:'Launch site'},
  orbit:{uz:'Orbita',ru:'Орбита',en:'Orbit'}, mis:{uz:'Vazifa',ru:'Миссия',en:'Mission'}, all:{uz:'Hammasi',ru:'Все',en:'All'}, live:{uz:'JONLI EFIR',ru:'ПРЯМОЙ ЭФИР',en:'LIVE'},
  tbd:{uz:'vaqti aniqlanmoqda',ru:'время уточняется',en:'time TBD'}, enOnly:{uz:'Tavsif manbada faqat ingliz tilida.',ru:'Описание в источнике только на английском.',en:''},
  st:{Go:{uz:'Tayyor',ru:'Готов',en:'Go'},TBD:{uz:'Aniqlanmoqda',ru:'Уточняется',en:'TBD'},TBC:{uz:'Tasdiqlanmoqda',ru:'Ожидает подтверждения',en:'TBC'},Hold:{uz:'To‘xtatilgan',ru:'Задержка',en:'Hold'},'In Flight':{uz:'Parvozda',ru:'В полёте',en:'In flight'},Success:{uz:'Muvaffaqiyatli',ru:'Успех',en:'Success'},Failure:{uz:'Muvaffaqiyatsiz',ru:'Авария',en:'Failure'},'Partial Failure':{uz:'Qisman muvaffaqiyatsiz',ru:'Частичная неудача',en:'Partial failure'}},
  stale:{uz:'Asosiy server band — zaxira (biroz eskirgan bo‘lishi mumkin) ma’lumot ko‘rsatilmoqda.',ru:'Основной сервер занят — показаны резервные данные (могут быть устаревшими).',en:'Main server busy — showing backup data (may be slightly out of date).'},
  rate:{uz:'Ma’lumot serveri soatiga cheklangan miqdordagi so‘rovga ruxsat beradi va hozir limit tugadi. Allaqachon ko‘rilgan sahifalar saqlangan; yangilari bir oz vaqtdan so‘ng ochiladi.',ru:'Сервер данных ограничивает число запросов в час, лимит исчерпан. Просмотренные страницы сохранены; новые откроются чуть позже.',en:'The data server limits requests per hour and the limit is used up. Pages you’ve seen are saved; new ones will load a little later.'},
  year:{uz:'Yil',ru:'Год',en:'Year'}, allY:{uz:'Barcha yillar',ru:'Все годы',en:'All years'}, allP:{uz:'Barcha kompaniyalar',ru:'Все компании',en:'All companies'}, search:{uz:'Raketa yoki vazifa nomi…',ru:'Ракета или миссия…',en:'Rocket or mission…'},
  ok:{uz:'Muvaffaqiyatli',ru:'Успешные',en:'Successful'}, bad:{uz:'Muvaffaqiyatsiz',ru:'Неудачные',en:'Failed'}, found:{uz:'Topildi',ru:'Найдено',en:'Found'}, more:{uz:'Yana yuklash',ru:'Загрузить ещё',en:'Load more'}, none:{uz:'Hech narsa topilmadi',ru:'Ничего не найдено',en:'Nothing found'},
  founded:{uz:'Tashkil etilgan',ru:'Основана',en:'Founded'}, country:{uz:'Davlat',ru:'Страна',en:'Country'}, admin:{uz:'Rahbar',ru:'Руководитель',en:'Leader'}, rockets:{uz:'Raketalari',ru:'Ракеты',en:'Rockets'},
  total:{uz:'Jami uchirilish',ru:'Всего запусков',en:'Total launches'}, rateS:{uz:'Muvaffaqiyat',ru:'Успешность',en:'Success rate'}, pend:{uz:'Rejalashtirilgan',ru:'Запланировано',en:'Planned'}, streak:{uz:'Ketma-ket muvaffaqiyat',ru:'Успехов подряд',en:'Success streak'},
  gov:{uz:'Davlat agentligi',ru:'Государственное агентство',en:'Government agency'}, com:{uz:'Xususiy kompaniya',ru:'Частная компания',en:'Commercial company'},
  seePast:{uz:'O‘tgan uchirilishlari',ru:'Прошедшие запуски',en:'Past launches'}, seeUp:{uz:'Kelgusi uchirilishlari',ru:'Будущие запуски',en:'Upcoming launches'}, orig:{uz:'Manbadagi tavsif (ingliz tilida)',ru:'Описание из источника (англ.)',en:'Source description'},
  cached:{uz:'saqlangan nusxa',ru:'сохранённая копия',en:'saved copy'}, rateD:{uz:'Batafsil tavsif limit tiklangach ochiladi; yuqorida asosiy ma’lumotlar.',ru:'Подробное описание откроется после сброса лимита; выше — основные данные.',en:'The full description will load once the limit resets; key details are shown above.'},
  landing:{uz:'Qo‘nish',ru:'Посадка',en:'Landing'}, back:{uz:'Kompaniyalar ro‘yxati',ru:'Список компаний',en:'All companies'},
  note:{uz:'Manba: The Space Devs — Launch Library 2 (1957-yildan beri 7 600 dan ortiq uchirilish). Vaqtlar sizning vaqt zonangizda. Server so‘rovlarni soatiga cheklagani uchun ko‘rilgan sahifalar qurilmangizda saqlanadi.',ru:'Источник: The Space Devs — Launch Library 2 (более 7600 запусков с 1957 г.). Время — в вашем поясе. Из-за лимита запросов просмотренные страницы сохраняются на устройстве.',en:'Source: The Space Devs — Launch Library 2 (7,600+ launches since 1957). Times are in your time zone. Because of hourly request limits, viewed pages are cached on your device.'} };
const CC={USA:['AQSh','США','USA'],RUS:['Rossiya','Россия','Russia'],CHN:['Xitoy','Китай','China'],FRA:['Fransiya','Франция','France'],ITA:['Italiya','Италия','Italy'],IND:['Hindiston','Индия','India'],JPN:['Yaponiya','Япония','Japan'],NZL:['Yangi Zelandiya','Новая Зеландия','New Zealand']};
const ccN=c=>{ const a=CC[c]; return a?a[{uz:0,ru:1,en:2}[L()]]:(c||''); };
const AG0=[[121,'SpaceX','SpX','USA','Commercial',2002,736,721,15,'Falcon | Starship'],[88,'China Aerospace Science and Technology Corporation','CASC','CHN','Government',1999,618,602,16,'Long March'],[63,'Russian Federal Space Agency (ROSCOSMOS)','RFSA','RUS','Government',1992,344,333,11,'Soyuz'],
 [115,'Arianespace','ASA','FRA','Commercial',1980,328,313,15,'Ariane | Vega'],[96,'Khrunichev State Research and Production Space Center','KhSC','RUS','Government',1916,193,178,15,'Proton | Rokot'],[124,'United Launch Alliance','ULA','USA','Commercial',2006,175,175,0,'Atlas | Delta | Vulcan'],
 [44,'National Aeronautics and Space Administration','NASA','USA','Government',1958,142,122,20,'Space Shuttle | SLS'],[31,'Indian Space Research Organization','ISRO','IND','Government',1969,100,85,15,'PSLV | GSLV'],[147,'Rocket Lab','RL','USA','Commercial',2006,97,93,4,'Electron'],
 [141,'Blue Origin','BO','USA','Commercial',2000,41,39,2,'New Shepard | New Glenn'],[37,'Japan Aerospace Exploration Agency','JAXA','JPN','Government',2003,37,33,4,'H-II'],[257,'Northrop Grumman Space Systems','NGSS','USA','Commercial',2015,17,17,0,'Antares | Minotaur | Pegasus'],
 [265,'Firefly Aerospace','FA','USA','Commercial',2014,7,4,3,''],[159,'Avio S.p.A','Avio','ITA','Commercial',1908,2,2,0,'Vega'],[17,'China National Space Administration','CNSA','CHN','Government',1993,2,2,0,'']]
 .map(a=>({id:a[0],name:a[1],abbrev:a[2],country_code:a[3],type:a[4],founding_year:a[5],total_launch_count:a[6],successful_launches:a[7],failed_launches:a[8],launchers:a[9]}));
const AGI={
 121:['2002-yilda Ilon Mask asos solgan Amerika kompaniyasi. Falcon 9 raketasining birinchi bosqichi qaytib qo‘nadi va qayta ishlatiladi (birinchi marta 2015-yilda). Dragon kemasi 2020-yildan beri XKSga astronavtlar olib boradi. Starship — hozirgacha qurilgan eng katta raketa. Starlink internet yo‘ldoshlari tarmog‘ini ham shu kompaniya uchiradi.','Американская компания, основанная Илоном Маском в 2002 г. Первая ступень Falcon 9 возвращается и используется повторно (впервые — в 2015 г.). Корабль Dragon с 2020 г. доставляет астронавтов на МКС. Starship — крупнейшая ракета в истории. Компания также запускает спутники Starlink.','American company founded by Elon Musk in 2002. Falcon 9’s first stage lands and flies again (first landing in 2015). Dragon has carried astronauts to the ISS since 2020, Starship is the largest rocket ever built, and SpaceX launches its own Starlink satellites.'],
 44:['AQShning kosmik agentligi, 1958-yilda tashkil etilgan. Apollon dasturi bilan 1969–1972-yillarda Oyga odam qo‘ndirgan. Space Shuttle (1981–2011), Hubble va Jeyms Uebb teleskoplari, Marsdagi marsoxodlar — NASA loyihalari. Hozir Artemis dasturi va SLS raketasi bilan Oyga qaytishga tayyorlanmoqda.','Космическое агентство США, основано в 1958 г. В 1969–1972 гг. высадило людей на Луну (Apollo). Space Shuttle (1981–2011), телескопы Hubble и James Webb, марсоходы — проекты NASA. Сейчас готовит возвращение на Луну по программе Artemis с ракетой SLS.','The US space agency, founded in 1958. It landed people on the Moon with Apollo (1969–1972) and ran the Space Shuttle (1981–2011), Hubble, Webb and the Mars rovers. Today it is preparing to return to the Moon with Artemis and the SLS rocket.'],
 63:['Rossiyaning davlat kosmik korporatsiyasi (agentlik sifatida 1992-yildan). Sovet kosmik dasturining merosxo‘ri: birinchi sun’iy yo‘ldosh va Gagarin parvozi. Soyuz raketasi va kemasi Boyqo‘ng‘ir (Qozog‘iston) va Vostochniy kosmodromlaridan uchadi. XKSning asosiy hamkorlaridan biri.','Государственная космическая корпорация России (как агентство — с 1992 г.). Наследник советской программы: первый спутник и полёт Гагарина. Ракеты и корабли «Союз» стартуют с Байконура (Казахстан) и Восточного. Один из главных партнёров МКС.','Russia’s state space corporation (an agency since 1992) and heir to the Soviet programme behind Sputnik and Gagarin. Soyuz rockets and spacecraft fly from Baikonur (Kazakhstan) and Vostochny. A core ISS partner.'],
 88:['Xitoyning asosiy davlat kosmik korporatsiyasi. «Chanchjen» (Long March) raketalarini quradi va uchiradi. Shenchjou kemalari, Tyangun orbital stansiyasi va Chang’e Oy missiyalari (2019-yilda Oyning orqa tomoniga birinchi qo‘nish) shu korporatsiya ishi.','Главная государственная космическая корпорация Китая. Строит и запускает ракеты «Чанчжэн» (Long March). Корабли «Шэньчжоу», станция «Тяньгун» и лунные миссии «Чанъэ» (первая посадка на обратную сторону Луны в 2019 г.).','China’s main state space contractor. It builds and flies the Long March rockets, Shenzhou crew ships, the Tiangong space station and the Chang’e lunar missions (first landing on the Moon’s far side in 2019).'],
 17:['Xitoy milliy kosmik boshqarmasi — mamlakat kosmik dasturlarini muvofiqlashtiradi: Chang’e Oy missiyalari va 2021-yilda Marsga qo‘ngan Tyanven-1 (Chjujun marsoxodi).','Национальное космическое управление Китая — координирует программы страны: лунные «Чанъэ» и «Тяньвэнь-1», посадившую марсоход «Чжужун» в 2021 г.','China’s national space administration, coordinating programmes such as Chang’e and Tianwen-1, which landed the Zhurong rover on Mars in 2021.'],
 147:['2006-yilda Piter Bek Yangi Zelandiyada asos solgan, hozir AQShda joylashgan kompaniya. Kichik Electron raketasi bilan kichik yo‘ldoshlarni Yangi Zelandiyaning Mahiya yarim orolidan uchiradi. Kattaroq Neutron raketasini ishlab chiqmoqda.','Компания, основанная Питером Беком в Новой Зеландии в 2006 г., сейчас базируется в США. Малая ракета Electron выводит небольшие спутники с полуострова Махия. Разрабатывается более крупная ракета Neutron.','Founded by Peter Beck in New Zealand in 2006, now US-based. Its small Electron rocket launches small satellites from New Zealand’s Mahia Peninsula; the larger Neutron is in development.'],
 124:['Boeing va Lockheed Martin 2006-yilda tuzgan qo‘shma korxona. Atlas V, Delta IV va yangi Vulcan raketalari bilan AQSh hukumati va NASA yuklarini — jumladan Curiosity, Perseverance va Juno zondlarini uchirgan.','Совместное предприятие Boeing и Lockheed Martin, созданное в 2006 г. Ракетами Atlas V, Delta IV и новой Vulcan запускало грузы правительства США и NASA, включая Curiosity, Perseverance и Juno.','A Boeing–Lockheed Martin joint venture formed in 2006. Its Atlas V, Delta IV and new Vulcan rockets have flown US government and NASA payloads, including Curiosity, Perseverance and Juno.'],
 115:['1980-yilda Fransiyada tuzilgan dunyodagi birinchi tijoriy uchirish kompaniyasi. Ariane raketalari Fransuz Gvianasidagi Kuru kosmodromidan uchadi. 2021-yilda Ariane 5 Jeyms Uebb teleskopini koinotga olib chiqqan; 2024-yildan Ariane 6 ishlaydi.','Первая в мире коммерческая пусковая компания (Франция, 1980). Ракеты Ariane стартуют с Куру во Французской Гвиане. В 2021 г. Ariane 5 вывела телескоп «Джеймс Уэбб»; с 2024 г. летает Ariane 6.','The world’s first commercial launch company (France, 1980). Ariane rockets fly from Kourou in French Guiana; Ariane 5 launched the James Webb telescope in 2021, and Ariane 6 has flown since 2024.'],
 159:['Italiyaning aerokosmik kompaniyasi. Kichik va o‘rta yuklar uchun Vega raketasini quradi.','Итальянская аэрокосмическая компания, производитель ракеты Vega для малых и средних грузов.','Italian aerospace company that builds the Vega rocket for small and medium payloads.'],
 31:['Hindiston kosmik tadqiqotlar tashkiloti, 1969-yilda tuzilgan. PSLV, GSLV va LVM3 raketalarini uchiradi. 2014-yilda Marsga birinchi urinishdayoq yetib borgan, 2023-yilda Chandrayaan-3 Oyning janubiy qutbi yaqiniga qo‘ngan.','Индийская организация космических исследований (1969). Запускает PSLV, GSLV и LVM3. В 2014 г. с первой попытки достигла Марса, в 2023 г. «Чандраян-3» сел у южного полюса Луны.','India’s space research organisation (1969). It flies PSLV, GSLV and LVM3; reached Mars on its first try in 2014 and landed Chandrayaan-3 near the Moon’s south pole in 2023.'],
 37:['Yaponiya aerokosmik tadqiqot agentligi, 2003-yilda uch tashkilot birlashib tuzilgan. H-IIA va H3 raketalari, asteroidlardan namuna olib kelgan Hayabusa missiyalari va 2024-yilda Oyga aniq qo‘ngan SLIM zondi bilan mashhur.','Японское агентство аэрокосмических исследований, создано в 2003 г. слиянием трёх организаций. Ракеты H-IIA и H3, миссии «Хаябуса» с доставкой грунта астероидов, точная посадка SLIM на Луну в 2024 г.','Japan’s aerospace agency, formed in 2003 from three organisations. Known for the H-IIA and H3 rockets, the Hayabusa asteroid sample-return missions and SLIM’s pinpoint Moon landing in 2024.'],
 96:['Moskvadagi Xrunichev nomidagi kosmik markaz (1916-yildan). Proton va Angara raketalarini, Mir stansiyasi va XKSning birinchi moduli «Zarya»ni qurgan.','Центр им. Хруничева (Москва, с 1916 г.). Создатель ракет «Протон» и «Ангара», модулей станции «Мир» и первого модуля МКС «Заря».','Moscow’s Khrunichev Space Center (since 1916), maker of the Proton and Angara rockets, Mir station modules and the ISS’s first module, Zarya.'],
 141:['2000-yilda Jeff Bezos asos solgan Amerika kompaniyasi. New Shepard qisqa suborbital sayohatlarga sayyohlarni olib chiqadi; katta New Glenn orbital raketasi 2025-yilda birinchi marta uchgan.','Американская компания, основанная Джеффом Безосом в 2000 г. New Shepard возит туристов в суборбитальные полёты; тяжёлая New Glenn впервые полетела в 2025 г.','American company founded by Jeff Bezos in 2000. New Shepard flies tourists on short suborbital hops; the heavy New Glenn orbital rocket first flew in 2025.'],
 265:['2014-yilda Texasda tuzilgan Amerika kompaniyasi. Alpha raketasini uchiradi; uning Blue Ghost moduli 2025-yil martida Oyga muvaffaqiyatli qo‘ngan.','Американская компания из Техаса (2014). Запускает ракету Alpha; её модуль Blue Ghost успешно сел на Луну в марте 2025 г.','Texas company founded in 2014. It flies the Alpha rocket, and its Blue Ghost lander touched down on the Moon in March 2025.'],
 257:['Northrop Grummanning kosmik bo‘limi. Antares, Minotaur va samolyotdan uchiriladigan Pegasus raketalari hamda XKSga yuk olib boradigan Cygnus kemasi.','Космическое подразделение Northrop Grumman: ракеты Antares, Minotaur и запускаемая с самолёта Pegasus, а также грузовой корабль Cygnus для МКС.','Northrop Grumman’s space division: Antares, Minotaur and the air-launched Pegasus rockets, plus the Cygnus cargo ship that supplies the ISS.']};
const stCol=a=>({Go:'#5fd39a',TBD:'#9aa6cc',TBC:'#e6dd5a',Hold:'#ff9a3d','In Flight':'#7fd0ff',Success:'#5fd39a',Failure:'#ff5c6c','Partial Failure':'#ff9a3d'}[a]||'#9aa6cc');
const stT=a=>T((LN.st[a])||{uz:a,ru:a,en:a});
const LL='https://ll.thespacedevs.com/2.2.0/', LLD='https://lldev.thespacedevs.com/2.2.0/';
const lcGet=(k,ttl)=>{ try{ const o=JSON.parse(localStorage.getItem('llc_'+k)||'null'); if(o&&(!ttl||Date.now()-o.t<ttl)) return o.d; }catch(e){} return null; };
const lcSet=(k,d)=>{ try{ localStorage.setItem('llc_'+k,JSON.stringify({t:Date.now(),d})); }catch(e){ try{ Object.keys(localStorage).filter(x=>x.startsWith('llc_p')).slice(0,20).forEach(x=>localStorage.removeItem(x)); localStorage.setItem('llc_'+k,JSON.stringify({t:Date.now(),d})); }catch(_){} } };
async function llGet(path,key,ttl,dev){ const c=lcGet(key,ttl); if(c) return {d:c};
  try{ const d=await getJ(LL+path); lcSet(key,d); return {d}; }
  catch(e){ const old=lcGet(key,0); if(old) return {d:old,old:true}; if(dev&&e.message==='rate'){ try{ const d=await getJ(LLD+path); return {d,dev:true}; }catch(_){} } throw e; } }
register('launches',{ ico:'🚀', group:GROUP, name:LN.name, sub:LN.sub,
  build(body, lab){
    lab.tab=lab.tab||'up'; lab.f=lab.f||'all'; lab.pf=lab.pf||{p:'',y:'',s:'',q:''}; lab.co=lab.co||null;
    const tabs=[['up','🚀',LN.tUp],['past','📜',LN.tPast],['co','🏢',LN.tCo]];
    body.innerHTML='<div class="wx-tabs" id="lnTabs" style="margin-bottom:12px">'+tabs.map(([k,i,t])=>'<button class="lab-chip" data-t="'+k+'">'+i+' '+esc(T(t))+'<span class="sp-cnt" id="lnC_'+k+'"></span></button>').join('')+'</div>'
      +'<div id="lnUp"><div id="lnUpW"></div><div id="lnNext">'+spin()+'</div><div class="lab-row" id="lnF"></div><div class="sp-llist" id="lnList"></div></div>'
      +'<div id="lnPast" style="display:none"></div><div id="lnCo" style="display:none"></div>'
      +'<p class="lab-note" id="lnStale" style="display:none">'+esc(T(LN.stale))+'</p><p class="lab-note">'+esc(T(LN.note))+'</p>';
    const $=id=>body.querySelector('#'+id);
    $('lnTabs').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ lab.tab=b.dataset.t; click(740); show(); });
    function show(){ $('lnTabs').querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===lab.tab));
      $('lnUp').style.display=lab.tab==='up'?'':'none'; $('lnPast').style.display=lab.tab==='past'?'':'none'; $('lnCo').style.display=lab.tab==='co'?'':'none';
      if(lab.tab==='up') loadUp(false); else if(lab.tab==='past') pastUI(); else coUI(); }
    async function agencies(){ if(lab.AG) return lab.AG; try{ const r=await llGet('agencies/?featured=true&limit=60&mode=detailed','ag',7*86400000); lab.AG=r.d.results; }catch(e){ lab.AG=AG0.slice(); }
      lab.AG.sort((a,b)=>(b.total_launch_count||0)-(a.total_launch_count||0)); return lab.AG; }
    const agByName=n=>(lab.AG||AG0).find(a=>a.name===n||a.abbrev===n);
    const short=n=>String(n||'').replace(/ (Corporation|Technologies|Space Corporation|Space Exploration)$/,'');
    const kv=(k,v)=>v?'<div><div class="k">'+esc(T(k))+'</div><div class="v">'+esc(v)+'</div></div>':'';
    const row=(x,d,st,provHtml,loc_)=>'<span class="sp-lt"><b>'+esc(dLong(d))+'</b><span>'+hm(d)+'</span></span><span class="sp-lnm"><b>'+esc(x.name)+'</b><small>'+provHtml+' · '+esc(loc_||'')+'</small></span><span class="sp-st" style="--c:'+stCol(st)+'">'+esc(stT(st))+'</span>';
    // ---- Kelgusi
    async function loadUp(force){
      let r; try{ r=await llGet('launch/upcoming/?limit=25&mode=normal&hide_recent_previous=true','up',force?1:60*60000,true); }
      catch(e){ $('lnNext').innerHTML='<div class="wx-msg">'+(e.message==='rate'?'⏳ '+esc(T(LN.rate)):'⚠ '+esc(T(C.err)))+'</div>'; return; }
      lab.D={r:r.d.results,stale:r.dev}; $('lnC_up').textContent=r.d.count?' '+fmt(r.d.count,0):''; renderUp(); agencies(); }
    const prov=r=>(r.launch_service_provider&&r.launch_service_provider.name)||r.lsp_name||'—';
    function renderUp(){ const D=lab.D; if(!D) return; const now=Date.now(); const rs=D.r.filter(r=>Date.parse(r.net)>now-2*3600000);
      $('lnStale').style.display='none'; $('lnUpW').innerHTML=D.stale?'<div class="sp-warn">⚠ '+esc(T(LN.stale))+'</div>':'';
      const ps=[...new Set(rs.map(prov))].slice(0,7);
      $('lnF').innerHTML='<button class="lab-chip'+(lab.f==='all'?' on':'')+'" data-f="all">'+esc(T(LN.all))+'</button>'+ps.map(p=>'<button class="lab-chip'+(lab.f===p?' on':'')+'" data-f="'+esc(p)+'">'+esc(short(p))+'</button>').join('');
      $('lnF').querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ lab.f=b.dataset.f; click(740); renderUp(); });
      const fl=rs.filter(r=>lab.f==='all'||prov(r)===lab.f), n=fl[0];
      if(n){ const st=(n.status&&n.status.abbrev)||'TBD', m=n.mission||{}, nd=new Date(n.net), tbd=n.net_precision&&/Month|Day|Week|Quarter/.test(n.net_precision.name||'');
        $('lnNext').innerHTML='<div class="sp-ln">'+(n.image?'<div class="sp-lim"><img src="'+esc(n.image)+'" alt="" loading="lazy" onerror="this.parentNode.remove()" /></div>':'')
          +'<div class="sp-lb"><div class="k">'+esc(T(LN.next))+'</div><h4 class="ed-mnm" style="margin:2px 0 4px">'+esc(n.name)+'</h4><div class="sp-cd" id="lnCd"></div>'
          +'<div class="sp-ld">'+esc(dLong(nd))+', <b>'+hm(nd)+'</b> '+tzLabel(loc().tz)+(tbd?' · '+esc(T(LN.tbd)):'')+' <span class="sp-st" style="--c:'+stCol(st)+'">'+esc(stT(st))+'</span>'+(n.webcast_live?'<span class="sp-st" style="--c:#ff4d6a">● '+esc(T(LN.live))+'</span>':'')+'</div>'
          +'<div class="lab-kv" style="margin-top:10px"><div><div class="k">'+esc(T(LN.prov))+'</div><div class="v"><button class="sp-alink" data-ag="'+esc(prov(n))+'">'+esc(short(prov(n)))+' ↗</button></div></div>'
          +kv(LN.rocket,n.rocket&&n.rocket.configuration&&(n.rocket.configuration.full_name||n.rocket.configuration.name))+kv(LN.padL,n.pad&&((n.pad.location&&n.pad.location.name)||n.pad.name))+kv(LN.orbit,m.orbit&&(m.orbit.name||m.orbit.abbrev))+'</div>'
          +(m.description?'<p class="lab-p" style="margin-top:10px">'+esc(m.description)+'</p>'+(T(LN.enOnly)?'<p class="lab-note" style="margin:0">'+esc(T(LN.enOnly))+'</p>':''):'')+'</div></div>'; }
      else $('lnNext').innerHTML='';
      $('lnList').innerHTML=fl.slice(1,20).map(r=>'<div class="sp-li">'+row(r,new Date(r.net),(r.status&&r.status.abbrev)||'TBD','<button class="sp-alink" data-ag="'+esc(prov(r))+'">'+esc(short(prov(r)))+'</button>',r.pad&&r.pad.location&&r.pad.location.name)+'</div>').join('');
      bindAg($('lnUp')); lab.next=n; tick(); }
    function bindAg(root){ root.querySelectorAll('[data-ag]').forEach(b=>b.onclick=async()=>{ click(760); await agencies(); const a=agByName(b.dataset.ag); if(a){ lab.co=a.id; lab.tab='co'; show(); } }); }
    function tick(){ const e=$('lnCd'); if(!e||!lab.next) return; const ms=Date.parse(lab.next.net)-Date.now(); e.textContent=(ms<0?'T+ ':'T− ')+cdown(Math.abs(ms)); }
    // ---- O'tgan uchirilishlar: barchasi, filtr va sahifalash bilan
    async function pastUI(){ const el=$('lnPast'); if(!el.dataset.built) el.innerHTML=spin(); const AG=await agencies();
      if(!el.dataset.built){ el.dataset.built=1; const y=new Date().getFullYear(); let yo=''; for(let i=y;i>=1957;i--) yo+='<option>'+i+'</option>';
        el.innerHTML='<div class="wx-uzc"><label class="wx-fl"><span>'+esc(T(LN.prov))+'</span><select class="lab-date lab-loc" id="lpP"></select></label>'
          +'<label class="wx-fl"><span>'+esc(T(LN.year))+'</span><select class="lab-date lab-loc" id="lpY"><option value="">'+esc(T(LN.allY))+'</option>'+yo+'</select></label>'
          +'<label class="wx-fl"><span>&nbsp;</span><input class="lab-date" id="lpQ" type="search" placeholder="'+esc(T(LN.search))+'" /></label></div>'
          +'<div class="lab-row" id="lpS" style="margin:0 0 10px"><button class="lab-chip" data-s="">'+esc(T(LN.all))+'</button><button class="lab-chip" data-s="3">✓ '+esc(T(LN.ok))+'</button><button class="lab-chip" data-s="4,7">✕ '+esc(T(LN.bad))+'</button><span class="sp-found" id="lpN"></span></div>'
          +'<div class="sp-llist" id="lpL"></div><div class="lab-row" style="justify-content:center"><button class="lab-chip" id="lpM" style="display:none">'+esc(T(LN.more))+' ↓</button></div><div id="lpE"></div>';
        $('lpY').onchange=e=>{ lab.pf.y=e.target.value; click(740); query(true); };
        $('lpP').onchange=e=>{ lab.pf.p=e.target.value; click(740); query(true); };
        let qt=0; $('lpQ').oninput=e=>{ clearTimeout(qt); qt=setTimeout(()=>{ lab.pf.q=e.target.value.trim(); query(true); },800); };
        el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ lab.pf.s=b.dataset.s; click(740); query(true); });
        $('lpM').onclick=()=>{ click(760); query(false); };
      }
      $('lpP').innerHTML='<option value="">'+esc(T(LN.allP))+'</option>'+AG.map(a=>'<option value="'+a.id+'"'+(String(a.id)===String(lab.pf.p)?' selected':'')+'>'+esc(short(a.name))+' ('+fmt(a.total_launch_count||0,0)+')</option>').join('');
      $('lpY').value=lab.pf.y; $('lpQ').value=lab.pf.q;
      query(true); }
    async function query(reset){ const f=lab.pf, el=$('lnPast'); el.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===f.s));
      if(reset){ lab.pl=[]; lab.pOff=0; $('lpL').innerHTML=spin(); }
      const ps=['limit=25','offset='+lab.pOff,'mode=list'];
      if(f.p) ps.push('lsp__id='+f.p); if(f.y) ps.push('net__gte='+f.y+'-01-01T00:00:00Z','net__lt='+(+f.y+1)+'-01-01T00:00:00Z'); if(f.s) ps.push('status__ids='+f.s); if(f.q) ps.push('search='+encodeURIComponent(f.q));
      const recent=!f.y||+f.y>=new Date().getFullYear();
      let r; try{ r=await llGet('launch/previous/?'+ps.join('&'),'p'+ps.join('&'),recent&&lab.pOff===0?6*3600000:30*86400000); }
      catch(e){ $('lpE').innerHTML='<div class="wx-msg">'+(e.message==='rate'?'⏳ '+esc(T(LN.rate)):'⚠ '+esc(T(C.err)))+'</div>'; if(reset) $('lpL').innerHTML=''; return; }
      $('lpE').innerHTML='';
      lab.pl=lab.pl.concat(r.d.results); lab.pOff+=r.d.results.length;
      if(!f.p&&!f.y&&!f.s&&!f.q) $('lnC_past').textContent=' '+fmt(r.d.count,0);
      $('lpN').innerHTML=esc(T(LN.found))+': <b>'+fmt(r.d.count,0)+'</b>'+(r.old?' <small>('+esc(T(LN.cached))+')</small>':'');
      $('lpM').style.display=lab.pOff<r.d.count?'':'none';
      $('lpL').innerHTML=lab.pl.length?lab.pl.map((x,i)=>'<div class="sp-pi" data-i="'+i+'"><div class="sp-li sp-lic">'+row(x,new Date(x.net),(x.status&&x.status.abbrev)||'TBD',esc(short(x.lsp_name||'')),x.location||x.pad)+'</div><div class="sp-pd" id="lpd'+i+'"></div></div>').join(''):'<div class="wx-msg">'+esc(T(LN.none))+'</div>';
      $('lpL').querySelectorAll('.sp-lic').forEach(b=>b.onclick=()=>detail(+b.parentNode.dataset.i)); }
    async function detail(i){ const box=$('lpd'+i), x=lab.pl[i]; if(!box) return; if(box.innerHTML){ box.innerHTML=''; return; } click(780); box.innerHTML=spin();
      let d=null, limited=false; if(!lab.rateUntil||Date.now()>lab.rateUntil){ try{ d=(await llGet('launch/'+x.id+'/?mode=normal','l'+x.id,0)).d; }catch(e){ if(e.message==='rate'){ limited=true; lab.rateUntil=Date.now()+10*60000; } } } else { d=lcGet('l'+x.id,0); limited=!d; }
      const m=(d&&d.mission)||{}, img=(d&&d.image)||x.image;
      box.innerHTML='<div class="sp-pdi'+(img?'':' noimg')+'">'+(img?'<img src="'+esc(img)+'" alt="" loading="lazy" onerror="this.remove()" />':'')+'<div><div class="lab-kv">'
        +kv(LN.prov,x.lsp_name)+kv(LN.rocket,d&&d.rocket&&d.rocket.configuration&&(d.rocket.configuration.full_name||d.rocket.configuration.name))+kv(LN.padL,x.location||x.pad)+kv(LN.orbit,x.orbit||(m.orbit&&m.orbit.name))+kv(LN.mis,x.mission||m.name)
        +kv(LN.landing,x.landing?x.landing+(x.landing_success===true?' ✓':x.landing_success===false?' ✕':''):'')+'</div>'
        +(m.description?'<p class="lab-p" style="margin-top:8px">'+esc(m.description)+'</p>':'')+(d&&d.failreason?'<p class="lab-p" style="color:#ff8a8a">⚠ '+esc(d.failreason)+'</p>':'')
        +(!d&&limited?'<p class="lab-note">⏳ '+esc(T(LN.rateD))+'</p>':'')+'</div></div>'; }
    // ---- Kompaniyalar
    async function coUI(){ const el=$('lnCo'); el.innerHTML=spin(); const AG=await agencies(); $('lnC_co').textContent=' '+AG.length;
      const a=lab.co&&AG.find(x=>x.id===lab.co), rate=x=>x.total_launch_count?(x.successful_launches/x.total_launch_count*100):0;
      const logo=(x,big)=>'<span class="sp-col'+(big?' big':'')+'">'+(x.logo_url?'<img src="'+esc(x.logo_url)+'" alt="" loading="lazy" onerror="this.parentNode.textContent=\''+esc(x.abbrev||'')+'\'" />':esc(x.abbrev||''))+'</span>';
      const grid='<div class="sp-cog">'+AG.map(x=>'<button class="sp-coc'+(a&&a.id===x.id?' on':'')+'" data-id="'+x.id+'">'+logo(x)
          +'<span class="sp-con"><b>'+esc(short(x.name))+'</b><small>'+esc(ccN(x.country_code))+' · '+esc(x.founding_year||'')+'</small></span>'
          +'<span class="sp-cos"><b>'+fmt(x.total_launch_count||0,0)+'</b><i class="ed-mb"><i style="width:'+rate(x)+'%;background:#5fd39a"></i></i><small>'+fmt(rate(x),1)+'%</small></span></button>').join('')+'</div>';
      let det='';
      if(a){ const info=AGI[a.id], li={uz:0,ru:1,en:2}[L()];
        const stb=(k,v,c)=>'<div class="sp-cst"'+(c?' style="--c:'+c+'"':'')+'><b>'+v+'</b><span>'+esc(T(k))+'</span></div>';
        det='<div class="sp-cod"><button class="lab-chip" id="coBack">← '+esc(T(LN.back))+'</button>'
          +'<div class="sp-coh">'+logo(a,true)+'<div><h4 class="ed-mnm" style="margin:0">'+esc(a.name)+'</h4><div class="sp-mdd">'+esc(a.abbrev||'')+' · '+esc(ccN(a.country_code))+' · '+esc(T(a.type==='Government'?LN.gov:LN.com))+'</div></div></div>'
          +'<div class="sp-csts">'+stb(LN.total,fmt(a.total_launch_count||0,0))+stb(LN.ok,fmt(a.successful_launches||0,0),'#5fd39a')+stb(LN.bad,fmt(a.failed_launches||0,0),'#ff5c6c')+stb(LN.rateS,fmt(rate(a),1)+'%')
            +(a.pending_launches!=null?stb(LN.pend,fmt(a.pending_launches,0)):'')+(a.consecutive_successful_launches!=null?stb(LN.streak,fmt(a.consecutive_successful_launches,0)):'')+'</div>'
          +'<div class="lab-kv" style="margin-top:10px">'+kv(LN.founded,a.founding_year)+kv(LN.country,ccN(a.country_code))+kv(LN.admin,a.administrator)+kv(LN.rockets,a.launchers)+'</div>'
          +(info?'<p class="lab-p" style="margin-top:12px">'+esc(info[li])+'</p>':'')
          +(a.description?(info&&L()!=='en'?'<details class="sp-orig"><summary>'+esc(T(LN.orig))+'</summary><p class="lab-p">'+esc(a.description)+'</p></details>':(!info?'<p class="lab-p">'+esc(a.description)+'</p>':'')):'')
          +'<div class="lab-row"><button class="lab-chip on" id="coPast">📜 '+esc(T(LN.seePast))+'</button><button class="lab-chip" id="coUp">🚀 '+esc(T(LN.seeUp))+'</button>'
            +(a.wiki_url?'<a class="lab-chip" href="'+esc(a.wiki_url)+'" target="_blank" rel="noopener">Wikipedia ↗</a>':'')+(a.info_url?'<a class="lab-chip" href="'+esc(a.info_url)+'" target="_blank" rel="noopener">'+esc(a.abbrev||short(a.name))+' ↗</a>':'')+'</div></div>'; }
      el.innerHTML=det+grid;
      el.querySelectorAll('.sp-coc').forEach(b=>b.onclick=()=>{ lab.co=+b.dataset.id; click(780); coUI(); });
      if($('coBack')) $('coBack').onclick=()=>{ lab.co=null; click(700); coUI(); };
      if($('coPast')) $('coPast').onclick=()=>{ lab.pf={p:String(a.id),y:'',s:'',q:''}; lab.tab='past'; show(); };
      if($('coUp')) $('coUp').onclick=()=>{ lab.f=a.name; lab.tab='up'; show(); };
    }
    lab.show=show; show(); lab.timer=setInterval(()=>{ if(lab.isOpen) tick(); },1000);
  },
  open(){ this.show&&this.show(); }
});

/* =================== 4. TUTILISHLAR =================== */
const EC={ name:{uz:'Tutilishlar',ru:'Затмения',en:'Eclipses'}, sub:{uz:'Keyingi Quyosh va Oy tutilishlari — sizning joyingizdan ko‘rinadimi',ru:'Ближайшие солнечные и лунные затмения — видны ли они у вас',en:'Upcoming solar and lunar eclipses — and whether you can see them'},
  solar:{uz:'Quyosh tutilishi',ru:'Солнечное затмение',en:'Solar eclipse'}, lunar:{uz:'Oy tutilishi',ru:'Лунное затмение',en:'Lunar eclipse'},
  T:{uz:'To‘liq',ru:'Полное',en:'Total'}, A:{uz:'Halqasimon',ru:'Кольцеобразное',en:'Annular'}, P:{uz:'Qisman',ru:'Частное',en:'Partial'}, N:{uz:'Yarim soya',ru:'Полутеневое',en:'Penumbral'},
  next:{uz:'Sizdan ko‘rinadigan keyingi tutilish',ru:'Следующее видимое у вас затмение',en:'Next eclipse visible from you'}, all:{uz:'Hammasi',ru:'Все',en:'All'},
  vis:{uz:'Ko‘rinadi',ru:'Видно',en:'Visible'}, nvis:{uz:'Ko‘rinmaydi',ru:'Не видно',en:'Not visible'}, part:{uz:'Qisman ko‘rinadi',ru:'Видно частично',en:'Partly visible'},
  moonAlt:{uz:'Oy balandligi eng katta fazada',ru:'Высота Луны в максимуме',en:'Moon altitude at maximum'}, mag:{uz:'Faza',ru:'Фаза',en:'Magnitude'}, dur:{uz:'To‘liq faza',ru:'Полная фаза',en:'Totality'},
  where:{uz:'Qayerda ko‘rinadi',ru:'Где видно',en:'Where visible'}, max:{uz:'Eng katta faza',ru:'Максимум',en:'Greatest eclipse'}, more:{uz:'Batafsil xarita va vaqtlar',ru:'Подробная карта и время',en:'Detailed map and times'},
  solarNote:{uz:'Quyosh tutilishi faqat tor hududda to‘liq ko‘rinadi; sizning joyingiz uchun aniq vaqtlarni «Batafsil» havolasida tekshiring. Quyoshga hech qachon himoyasiz qaramang!',ru:'Солнечное затмение полное лишь в узкой полосе; точное время для вас — по ссылке «Подробно». Никогда не смотрите на Солнце без защиты!',en:'A solar eclipse is total only in a narrow strip; check exact local times via the details link. Never look at the Sun without proper protection!'},
  note:{uz:'Tutilish sanalari va vaqtlari — NASA (F. Espenak) katalogi. Oy tutilishi ko‘rinishi sizning joyingiz uchun hisoblanadi (Oy ufqdan balandmi).',ru:'Даты и время — каталог NASA (Ф. Эспенак). Видимость лунных затмений рассчитана для вашего места.',en:'Dates and times from NASA’s catalogue (F. Espenak). Lunar eclipse visibility is computed for your location.'} };
// [turi: S/L, kod T/A/P/N, eng katta faza UTC, kattalik, to'liq faza (daq), hudud uz/ru/en]
const ECL=[
 ['L','N','2027-02-20T23:13Z',0.93,0,['Yevropa, Afrika, Osiyo','Европа, Африка, Азия','Europe, Africa, Asia']],
 ['S','A','2027-02-06T16:00Z',0.928,0,['Chili, Argentina, Atlantika, G‘arbiy Afrika','Чили, Аргентина, Атлантика, Западная Африка','Chile, Argentina, Atlantic, West Africa']],
 ['L','N','2027-07-18T16:03Z',0.01,0,['Osiyo, Avstraliya, Tinch okeani','Азия, Австралия, Тихий океан','Asia, Australia, Pacific']],
 ['S','T','2027-08-02T10:07Z',1.079,6.4,['Ispaniya, Marokash, Jazoir, Tunis, Liviya, Misr (Luksor), Saudiya Arabistoni, Yaman; qisman — Yevropa, Afrika, Yaqin Sharq, G‘arbiy Osiyo','Испания, Марокко, Алжир, Тунис, Ливия, Египет (Луксор), Саудовская Аравия, Йемен; частично — Европа, Африка, Ближний Восток, Западная Азия','Spain, Morocco, Algeria, Tunisia, Libya, Egypt (Luxor), Saudi Arabia, Yemen; partial — Europe, Africa, Middle East, western Asia']],
 ['L','N','2027-08-17T07:14Z',0.55,0,['Tinch okeani, Amerika','Тихий океан, Америка','Pacific, Americas']],
 ['L','P','2028-01-12T04:13Z',0.066,0,['Amerika, Yevropa, Afrika','Америка, Европа, Африка','Americas, Europe, Africa']],
 ['S','A','2028-01-26T15:08Z',0.921,0,['Ekvador, Peru, Braziliya, Ispaniya, Portugaliya','Эквадор, Перу, Бразилия, Испания, Португалия','Ecuador, Peru, Brazil, Spain, Portugal']],
 ['L','P','2028-07-06T18:20Z',0.39,0,['Yevropa, Afrika, Osiyo, Avstraliya','Европа, Африка, Азия, Австралия','Europe, Africa, Asia, Australia']],
 ['S','T','2028-07-22T02:56Z',1.056,5.2,['Avstraliya (Sidney), Yangi Zelandiya','Австралия (Сидней), Новая Зеландия','Australia (Sydney), New Zealand']],
 ['L','T','2028-12-31T16:52Z',1.25,71,['Yevropa, Afrika, Osiyo, Avstraliya','Европа, Африка, Азия, Австралия','Europe, Africa, Asia, Australia']],
 ['S','P','2029-01-14T17:13Z',0.871,0,['Shimoliy Amerika','Северная Америка','North America']],
 ['S','P','2029-06-12T04:06Z',0.458,0,['Arktika, Skandinaviya, Rossiya shimoli','Арктика, Скандинавия, север России','Arctic, Scandinavia, northern Russia']],
 ['L','T','2029-06-26T03:22Z',1.84,102,['Amerika, Yevropa, Afrika, Yaqin Sharq','Америка, Европа, Африка, Ближний Восток','Americas, Europe, Africa, Middle East']],
 ['S','P','2029-07-11T15:37Z',0.23,0,['Janubiy Amerika janubi','юг Южной Америки','southern South America']],
 ['S','P','2029-12-05T15:03Z',0.891,0,['Antarktida, Janubiy Amerika janubi','Антарктида, юг Южной Америки','Antarctica, southern South America']],
 ['L','T','2029-12-20T22:42Z',1.12,54,['Amerika, Yevropa, Afrika, Osiyo','Америка, Европа, Африка, Азия','Americas, Europe, Africa, Asia']],
 ['S','A','2030-06-01T06:29Z',0.944,0,['Jazoir, Tunis, Gretsiya, Turkiya, Rossiya, Xitoy, Yaponiya; qisman — Yevropa, Osiyo, shu jumladan Markaziy Osiyo','Алжир, Тунис, Греция, Турция, Россия, Китай, Япония; частично — Европа и Азия, включая Центральную Азию','Algeria, Tunisia, Greece, Turkey, Russia, China, Japan; partial — Europe and Asia incl. Central Asia']],
 ['L','P','2030-06-15T18:33Z',0.50,0,['Yevropa, Afrika, Osiyo','Европа, Африка, Азия','Europe, Africa, Asia']],
 ['S','T','2030-11-25T06:51Z',1.047,3.7,['Namibiya, Botsvana, Janubiy Afrika, Avstraliya','Намибия, Ботсвана, ЮАР, Австралия','Namibia, Botswana, South Africa, Australia']],
 ['L','N','2030-12-09T22:28Z',0.92,0,['Amerika, Yevropa, Afrika, Osiyo','Америка, Европа, Африка, Азия','Americas, Europe, Africa, Asia']]
].map(a=>({s:a[0],c:a[1],t:new Date(a[2]),m:a[3],dur:a[4],w:{uz:a[5][0],ru:a[5][1],en:a[5][2]}})).sort((a,b)=>a.t-b.t);
const MEN=['january','february','march','april','may','june','july','august','september','october','november','december'];
register('eclipses',{ ico:'🌑', group:GROUP, name:EC.name, sub:EC.sub,
  build(body, lab){
    lab.f=lab.f||'all';
    body.innerHTML=`<div class="lab-row" id="ecLoc" style="margin-top:0"></div><div id="ecNext"></div><div class="lab-row" id="ecF"><button class="lab-chip" data-f="all">${esc(T(EC.all))}</button><button class="lab-chip" data-f="S">☀ ${esc(T(EC.solar))}</button><button class="lab-chip" data-f="L">🌕 ${esc(T(EC.lunar))}</button></div>
      <div class="sp-elist" id="ecList"></div><p class="lab-note">${esc(T(EC.solarNote))}</p><p class="lab-note">${esc(T(EC.note))}</p>`;
    const $=id=>body.querySelector('#'+id), A=window.SKY_ASTRO;
    body.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ lab.f=b.dataset.f; click(740); render(); });
    lab.onLoc=()=>{ locPicker($('ecLoc')); render(); }; locPicker($('ecLoc'));
    // Oy tutilishi: eng katta faza va ±1,5 soatda Oy balandligi
    function lunarVis(e){ const o=loc(), alt=t=>{ const J=jd(new Date(t)), B=A.bodies(J); return A.look('moon',B,J,o).alt; };
      const a0=alt(e.t.getTime()), a1=alt(e.t.getTime()-5400000), a2=alt(e.t.getTime()+5400000); const st=a0>0&&a1>0&&a2>0?'vis':(a0>0||a1>0||a2>0?'part':'nvis'); return {st,alt:a0}; }
    function render(){ const now=Date.now(), up=ECL.filter(e=>e.t.getTime()>now-6*3600000);
      body.querySelectorAll('[data-f]').forEach(b=>b.classList.toggle('on',b.dataset.f===lab.f));
      const rows=up.map(e=>Object.assign({},e,e.s==='L'?lunarVis(e):{st:null}));
      const nx=rows.find(e=>e.s==='L'&&e.st!=='nvis');
      if(nx){ $('ecNext').innerHTML=`<div class="is-next"><div class="k">${esc(T(EC.next))}</div><div class="is-cd" id="ecCd"></div>
          <div class="is-nd">🌕 ${esc(T(EC[nx.c]))} ${esc(T(EC.lunar).toLowerCase())} · <b>${esc(dLong(nx.t))}, ${hm(nx.t)}</b> ${tzLabel(loc().tz)} · ${esc(T(EC.moonAlt))}: <b>${fmt(nx.alt,0)}°</b></div></div>`; lab.nx=nx; tick(); }
      else $('ecNext').innerHTML='';
      $('ecList').innerHTML=rows.filter(e=>lab.f==='all'||e.s===lab.f).map(e=>{ const z=zoned(e.t,0), url='https://www.timeanddate.com/eclipse/'+(e.s==='S'?'solar':'lunar')+'/'+z.y+'-'+MEN[z.m]+'-'+z.d;
        const vis=e.s==='L'?`<span class="sp-st" style="--c:${e.st==='vis'?'#5fd39a':e.st==='part'?'#e6dd5a':'#9aa6cc'}">${esc(T(EC[e.st]))}${e.st!=='nvis'?' · '+fmt(e.alt,0)+'°':''}</span>`:'';
        return `<div class="sp-ec k-${e.s}${e.st==='nvis'?' dim':''}"><div class="sp-eci">${e.s==='S'?(e.c==='T'?'🌑':e.c==='A'?'⭕':'🌘'):(e.c==='T'?'🔴':e.c==='P'?'🌗':'🌕')}</div>
          <div class="sp-ecb"><div class="sp-ect"><b>${esc(T(EC[e.c]))} ${esc((e.s==='S'?T(EC.solar):T(EC.lunar)).toLowerCase())}</b>${vis}</div>
            <div class="sp-ecd">${esc(dLong(e.t))} · ${esc(T(EC.max))}: <b>${hm(e.t)}</b> ${tzLabel(loc().tz)} · ${esc(T(EC.mag))} ${fmt(e.m,e.m<0.1?3:2)}${e.dur?` · ${esc(T(EC.dur))}: ${e.s==='S'?fmt(e.dur,1)+' min':Math.round(e.dur)+' min'}`:''}</div>
            <div class="sp-ecw">${esc(T(EC.where))}: ${esc(T(e.w))}</div><a href="${url}" target="_blank" rel="noopener">${esc(T(EC.more))} ↗</a></div></div>`; }).join('');
    }
    function tick(){ const e=$('ecCd'); if(e&&lab.nx) e.textContent=cdown(lab.nx.t-Date.now()); }
    lab.render=render; render(); lab.timer=setInterval(()=>{ if(lab.isOpen) tick(); },1000);
  },
  open(){ this.render&&this.render(); }
});
})();
