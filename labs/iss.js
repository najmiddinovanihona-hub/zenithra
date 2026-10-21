/* XKS kuzatuvchisi — jonli joylashuv, yer izi, kun/tun chizig'i va ko'rinadigan o'tishlar (SGP4, satellite.js) */
(function(){
const {register,T,L,esc,fmt,hiDPI,loc,locPicker,locName,zoned,tzLabel,click}=window.LAB;
const D2R=Math.PI/180, RE=6378.137;
// zaxira TLE (internet bo'lmasa); har ochilganda CelesTrak'dan yangilanadi
const TLE0=['1 25544U 98067A   26284.82161096  .00007651  00000+0  14771-3 0  9996','2 25544  51.6314  82.9019 0006707 250.7442 109.2821 15.48831270589830'];
const TX={ name:{uz:'XKS kuzatuvchisi',ru:'Где сейчас МКС',en:'ISS tracker'},
  sub:{uz:'Xalqaro kosmik stansiya hozir qayerda va qachon ustingizdan o‘tadi',ru:'Где сейчас Международная космическая станция и когда она пролетит над вами',en:'Where the International Space Station is now and when it passes over you'},
  lat:{uz:'Kenglik',ru:'Широта',en:'Latitude'}, lon:{uz:'Uzunlik',ru:'Долгота',en:'Longitude'}, alt:{uz:'Balandlik',ru:'Высота',en:'Altitude'}, spd:{uz:'Tezlik',ru:'Скорость',en:'Speed'},
  dist:{uz:'Sizdan masofa',ru:'Расстояние до вас',en:'Distance from you'}, st:{uz:'Holati',ru:'Состояние',en:'Status'},
  sunlit:{uz:'Quyosh nurida',ru:'Освещена Солнцем',en:'In sunlight'}, shadow:{uz:'Yer soyasida',ru:'В тени Земли',en:'In Earth’s shadow'},
  sky:{uz:'Sizning osmoningizda',ru:'На вашем небе',en:'In your sky'}, below:{uz:'ufqdan pastda',ru:'под горизонтом',en:'below horizon'},
  next:{uz:'Keyingi ko‘rinadigan o‘tish',ru:'Следующий видимый пролёт',en:'Next visible pass'}, passes:{uz:'O‘tishlar (10 kun)',ru:'Пролёты (10 дней)',en:'Passes (10 days)'},
  onlyVis:{uz:'Faqat ko‘rinadiganlar',ru:'Только видимые',en:'Visible only'}, all:{uz:'Hammasi',ru:'Все',en:'All'},
  none:{uz:'Yaqin 10 kunda ko‘rinadigan o‘tish yo‘q — XKS faqat tong yoki kechqurun, u Quyosh nurida, siz esa qorong‘ida bo‘lganingizda ko‘rinadi.',ru:'В ближайшие 10 дней видимых пролётов нет — МКС видна только утром или вечером, когда она освещена, а у вас темно.',en:'No visible passes in the next 10 days — the ISS is only visible at dawn or dusk, when it is sunlit and you are in darkness.'},
  vis:{uz:'ko‘rinadi',ru:'видно',en:'visible'}, day:{uz:'kunduzi',ru:'днём',en:'daylight'}, ecl:{uz:'soyada',ru:'в тени',en:'eclipsed'},
  today:{uz:'Bugun',ru:'Сегодня',en:'Today'}, tom:{uz:'Ertaga',ru:'Завтра',en:'Tomorrow'}, inT:{uz:'gacha',ru:'осталось',en:'to go'},
  now:{uz:'HOZIR OSMONDA!',ru:'СЕЙЧАС НА НЕБЕ!',en:'IN THE SKY NOW!'},
  dur:{uz:'daq',ru:'мин',en:'min'}, from:{uz:'dan',ru:'с',en:'from'}, to:{uz:'ga',ru:'на',en:'to'}, max:{uz:'eng baland',ru:'макс.',en:'max'},
  bright:{uz:['juda yorqin','yorqin','yaxshi ko‘rinadi','xira'],ru:['очень ярко','ярко','хорошо видно','тускло'],en:['very bright','bright','easy to see','faint']},
  src:{uz:'Orbita ma’lumoti',ru:'Орбитальные данные',en:'Orbit data'}, ago:{uz:'yangilangan',ru:'обновлено',en:'updated'}, off:{uz:'saqlangan nusxa (oflayn)',ru:'сохранённая копия (офлайн)',en:'saved copy (offline)'},
  refresh:{uz:'Yangilash',ru:'Обновить',en:'Refresh'}, loading:{uz:'Orbita hisoblanmoqda…',ru:'Расчёт орбиты…',en:'Computing orbit…'}, nolib:{uz:'Hisoblash moduli yuklanmadi',ru:'Модуль расчёта не загрузился',en:'Orbit module failed to load'},
  how:{uz:'XKS osmonda yulduzdek, miltillamaydigan oq nuqta bo‘lib tez suzib o‘tadi — teleskop kerak emas. Ko‘rsatilgan tomondan qarang; yo‘lning bir qismida u to‘satdan Yer soyasiga kirib, ko‘zdan yo‘qoladi.',
       ru:'МКС выглядит как немигающая белая точка, быстро плывущая по небу, — телескоп не нужен. Смотрите в указанную сторону; часть пути она может внезапно исчезнуть, войдя в тень Земли.',
       en:'The ISS looks like a bright, steady white dot gliding quickly across the sky — no telescope needed. Look in the direction shown; it may suddenly fade as it enters Earth’s shadow.'},
  note:{uz:'Hisob — SGP4 modeli va NORAD TLE ma’lumotlari bo‘yicha (CelesTrak). Vaqt aniqligi ±10 soniya; stansiya orbitasini tuzatsa, prognoz bir necha daqiqaga o‘zgarishi mumkin — shuning uchun ma’lumot har ochilganda yangilanadi.',
        ru:'Расчёт по модели SGP4 и данным NORAD TLE (CelesTrak). Точность ±10 с; после коррекции орбиты прогноз может сдвинуться на минуты, поэтому данные обновляются при каждом открытии.',
        en:'Computed with the SGP4 model from NORAD TLE data (CelesTrak). Timing ±10 s; an orbit boost can shift predictions by minutes, so data refreshes each time you open this.'} };
const CARD={ uz:['Sh','Shq','J','G‘'], ru:['С','В','Ю','З'], en:['N','E','S','W'] };
const D16={ uz:['Sh','Sh-ShSh','ShSh','Shq-ShSh','Shq','Shq-JSh','JSh','J-JSh','J','J-JG‘','JG‘','G‘-JG‘','G‘','G‘-ShG‘','ShG‘','Sh-ShG‘'],
  ru:['С','ССВ','СВ','ВСВ','В','ВЮВ','ЮВ','ЮЮВ','Ю','ЮЮЗ','ЮЗ','ЗЮЗ','З','ЗСЗ','СЗ','ССЗ'], en:['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'] };
const DIR8={ uz:['shimol','shimoli-sharq','sharq','janubi-sharq','janub','janubi-g‘arb','g‘arb','shimoli-g‘arb'], ru:['север','северо-восток','восток','юго-восток','юг','юго-запад','запад','северо-запад'], en:['north','north-east','east','south-east','south','south-west','west','north-west'] };
const d16=az=>T(D16)[Math.round(az/22.5)%16], d8=az=>T(DIR8)[Math.round(az/45)%8];
const pad=n=>String(n).padStart(2,'0');
// Quyosh: ECI birlik vektori va RA/Dec (sana ekvatori)
function sunVec(date){ const n=date.getTime()/86400000+2440587.5-2451545, L=(280.460+0.9856474*n)*D2R, g=(357.528+0.9856003*n)*D2R;
  const lam=L+(1.915*Math.sin(g)+0.020*Math.sin(2*g))*D2R, e=(23.439-0.0000004*n)*D2R;
  const v=[Math.cos(lam),Math.cos(e)*Math.sin(lam),Math.sin(e)*Math.sin(lam)];
  return {v, ra:Math.atan2(v[1],v[0]), dec:Math.asin(v[2])}; }
function sunAlt(date,o,sat){ const s=sunVec(date), H=sat.gstime(date)+o.lon*D2R-s.ra, p=o.lat*D2R;
  return Math.asin(Math.sin(p)*Math.sin(s.dec)+Math.cos(p)*Math.cos(s.dec)*Math.cos(H))/D2R; }
function inShadow(r,s){ const d=r.x*s[0]+r.y*s[1]+r.z*s[2]; if(d>0) return false; const px=r.x-d*s[0], py=r.y-d*s[1], pz=r.z-d*s[2]; return Math.hypot(px,py,pz)<RE; }
function loadLib(){ return new Promise((res,rej)=>{ if(window.satellite) return res(window.satellite);
  const s=document.createElement('script'); s.src='labs/satellite.min.js'; s.onload=()=>window.satellite?res(window.satellite):rej(); s.onerror=()=>{
    const s2=document.createElement('script'); s2.src='https://cdn.jsdelivr.net/npm/satellite.js@5.0.0/dist/satellite.min.js'; s2.onload=()=>res(window.satellite); s2.onerror=rej; document.head.appendChild(s2); };
  document.head.appendChild(s); }); }
async function getTLE(force){
  let c=null; try{ c=JSON.parse(localStorage.getItem('iss_tle')||'null'); }catch(e){}
  if(!force && c && Date.now()-c.t<3*3600000) return c;
  const tryF=async(u,parse)=>{ const ctl=new AbortController(); const tm=setTimeout(()=>ctl.abort(),8000);
    try{ const r=await fetch(u,{signal:ctl.signal,cache:'no-store'}); if(!r.ok) throw 0; return parse(await r.text()); } finally{ clearTimeout(tm); } };
  for(const [u,p] of [['https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE',t=>{ const l=t.split(/\r?\n/).filter(s=>/^[12] /.test(s)); if(l.length<2) throw 0; return l; }],
                      ['https://api.wheretheiss.at/v1/satellites/25544/tles',t=>{ const j=JSON.parse(t); return [j.line1,j.line2]; }]]){
    try{ const l=await tryF(u,p); const o={l, t:Date.now(), src:u.includes('celestrak')?'CelesTrak':'wheretheiss.at'}; localStorage.setItem('iss_tle',JSON.stringify(o)); return o; }catch(e){} }
  return c?Object.assign(c,{stale:true}):{l:TLE0,t:0,src:'NORAD',stale:true};
}
const epochOf=l1=>{ const y=+l1.slice(18,20), d=+l1.slice(20,32); return new Date(Date.UTC(y<57?2000+y:1900+y,0,1)+(d-1)*86400000); };
const map=new Image(); map.src=(window.PHOTO_BASE||'')+'photos/earth-now.jpg';

register('iss',{ ico:'🛰', group:{uz:'Osmon',ru:'Небо',en:'Sky'}, name:TX.name, sub:TX.sub,
  build(body, lab){
    lab.only=lab.only!==false; lab.sel=null;
    body.innerHTML=`<div class="lab-row" id="isLoc" style="margin-top:0"></div>
      <div class="lab-grid"><div><div style="position:relative"><canvas class="lab-cv" id="isMap"></canvas><div class="is-badge" id="isBadge"></div></div>
        <div class="lab-kv is-kv" id="isKv"></div>
        <div class="lab-row is-src" id="isSrc"></div><p class="lab-note">${esc(T(TX.note))}</p></div>
      <div><div class="is-next" id="isNext"></div><canvas class="lab-cv" id="isSky" style="max-width:340px;margin:10px auto 0"></canvas>
        <div class="lab-row" style="justify-content:space-between"><div class="sec-title" style="margin:0;flex:1">${esc(T(TX.passes))}</div>
          <button class="lab-chip" id="isOnly"></button></div>
        <div class="lab-list is-list" id="isList"></div><p class="lab-note">${esc(T(TX.how))}</p></div></div>`;
    const $=id=>body.querySelector('#'+id);
    locPicker($('isLoc'));
    $('isOnly').onclick=()=>{ lab.only=!lab.only; click(700); renderList(); };
    lab.onLoc=()=>{ locPicker($('isLoc')); lab.sel=null; if(lab.rec) predict(); };
    let sat=null, sh=null;
    const obs=()=>{ const o=loc(); return {longitude:o.lon*D2R, latitude:o.lat*D2R, height:0.4}; };
    const fmtD=d=>{ const o=loc(), z=zoned(d,o.tz), n=zoned(new Date(),o.tz), dd=Math.round((Date.UTC(z.y,z.m,z.d)-Date.UTC(n.y,n.m,n.d))/86400000);
      const mo={uz:['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'],ru:['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}[L()]||[];
      return dd===0?T(TX.today):(dd===1?T(TX.tom):(L()==='en'?mo[z.m]+' '+z.d:z.d+' '+mo[z.m])); };
    const hms=d=>{ const z=zoned(d,loc().tz); return pad(z.h)+':'+pad(z.mi)+':'+pad(z.s); }, hmm=d=>{ const z=zoned(d,loc().tz); return pad(z.h)+':'+pad(z.mi); };
    function state(d){ const pv=sat.propagate(lab.rec,d); if(!pv||!pv.position) return null; const g=sat.gstime(d);
      const geo=sat.eciToGeodetic(pv.position,g), la=sat.ecfToLookAngles(obs(),sat.eciToEcf(pv.position,g));
      return { lat:geo.latitude/D2R, lon:((geo.longitude/D2R+540)%360)-180, h:geo.height, v:Math.hypot(pv.velocity.x,pv.velocity.y,pv.velocity.z),
        el:la.elevation/D2R, az:la.azimuth/D2R, range:la.rangeSat, sunlit:!inShadow(pv.position,sunVec(d).v), r:pv.position }; }
    function mag(s,d){ const sv=sunVec(d).v, rv=[s.r.x,s.r.y,s.r.z], g=sat.gstime(d);
      const oe=sat.geodeticToEcf(obs()), c=Math.cos(g), sn=Math.sin(g), oi=[oe.x*c-oe.y*sn, oe.x*sn+oe.y*c, oe.z];
      const to=[oi[0]-rv[0],oi[1]-rv[1],oi[2]-rv[2]], n=Math.hypot(...to), ph=Math.acos(Math.max(-1,Math.min(1,(to[0]*sv[0]+to[1]*sv[1]+to[2]*sv[2])/n)));
      const F=(Math.sin(ph)+(Math.PI-ph)*Math.cos(ph))/Math.PI; return -1.8+5*Math.log10(s.range/1000)-2.5*Math.log10(Math.max(1e-3,F)/0.3183); }
    // O'tishlarni topish: 20 s qadam, chegaralar 1 s gacha aniqlanadi
    function predict(){
      const o=loc(), t0=Date.now()-10*60000, T1=t0+10*86400000, list=[]; let cur=null, prevEl=null;
      const elAt=t=>{ const s=state(new Date(t)); return s?s.el:-90; };
      const edge=(a,b)=>{ let ea=elAt(a); for(let i=0;i<12;i++){ const m=(a+b)/2, em=elAt(m); if((em>=0)===(ea>=0)){ a=m; ea=em; } else b=m; } return (a+b)/2; };
      for(let t=t0;t<=T1;t+=20000){ const el=elAt(t);
        if(prevEl!=null && prevEl<0 && el>=0) cur={start:edge(t-20000,t)};
        if(cur && prevEl!=null && prevEl>=0 && el<0){ cur.end=edge(t-20000,t); list.push(cur); cur=null; }
        prevEl=el; }
      lab.passes=list.map(p=>{ const pts=[]; let mx=null, vS=null, vE=null, vMax=null, bestMag=9;
        for(let t=p.start;t<=p.end+1;t+=5000){ const d=new Date(Math.min(t,p.end)), s=state(d); if(!s) continue;
          const dark=sunAlt(d,o,sat)<-6, v=s.el>=10&&dark&&s.sunlit; s.t=d.getTime(); s.vis=s.sunlit&&dark; pts.push(s);
          if(!mx||s.el>mx.el) mx=s;
          if(v){ if(!vS) vS=s; vE=s; if(!vMax||s.el>vMax.el) vMax=s; const m=mag(s,d); if(m<bestMag) bestMag=m; } }
        const dayP=sunAlt(new Date(mx.t),o,sat)>-6;
        return {start:p.start,end:p.end,max:mx,pts,vis:!!vS,vS,vE,vMax,mag:bestMag,kind:vS?'vis':(dayP?'day':'ecl')}; }).filter(p=>p.max.el>=10);
      renderList(); drawSky(); tick();
    }
    function renderList(){
      $('isOnly').textContent=lab.only?T(TX.onlyVis):T(TX.all);
      const ps=(lab.passes||[]).filter(p=>p.end>Date.now()-60000&&(!lab.only||p.vis));
      if(!ps.length){ $('isList').innerHTML=`<div class="it" style="display:block">${esc(T(TX.none))}</div>`; return; }
      $('isList').innerHTML=ps.slice(0,24).map(p=>{ const a=p.vis?p.vS:p.pts[0], b=p.vis?p.vE:p.pts[p.pts.length-1], m=p.vis?p.vMax:p.max;
        const br=p.mag<-3?0:p.mag<-2?1:p.mag<-1?2:3, dur=Math.max(1,Math.round((b.t-a.t)/60000));
        return `<button class="it is-p${p===lab.sel?' on':''} k-${p.kind}" data-s="${p.start}">
          <span class="is-pd"><b>${esc(fmtD(new Date(a.t)))}</b><span>${hmm(new Date(a.t))}</span></span>
          <span class="is-pm"><span>${esc(d16(a.az))} → <b>${fmt(m.el,0)}°</b> ${esc(d16(m.az))} → ${esc(d16(b.az))}</span>
            <small>${dur} ${esc(T(TX.dur))}${p.vis?' · '+fmt(p.mag,1)+'ᵐ · '+esc(T(TX.bright)[br]):' · '+esc(T(TX[p.kind]))}</small></span></button>`; }).join('');
      $('isList').querySelectorAll('.is-p').forEach(b=>b.onclick=()=>{ lab.sel=lab.passes.find(p=>p.start==+b.dataset.s); click(800); renderList(); drawSky(); tick(); });
    }
    function drawSky(){
      const cv=$('isSky'), w=Math.min(340,Math.max(220,cv.parentElement.clientWidth)), x=hiDPI(cv,w,w); cv.style.height=w+'px';
      const cx=w/2, cy=w/2, R=w/2-24, P=(el,az)=>{ const r=R*(90-el)/90, a=az*D2R; return [cx-r*Math.sin(a), cy-r*Math.cos(a)]; };
      x.fillStyle='#02030a'; x.fillRect(0,0,w,w); const g=x.createRadialGradient(cx,cy,0,cx,cy,R); g.addColorStop(0,'#0b1230'); g.addColorStop(1,'#141c40'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,R,0,6.283); x.fill();
      x.strokeStyle='rgba(160,190,255,.18)'; [30,60].forEach(a=>{ x.beginPath(); x.arc(cx,cy,R*(90-a)/90,0,6.283); x.stroke(); });
      x.strokeStyle='rgba(180,200,255,.55)'; x.lineWidth=1.4; x.beginPath(); x.arc(cx,cy,R,0,6.283); x.stroke();
      x.fillStyle='#cfe0ff'; x.font='700 12px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; x.textBaseline='middle';
      const cd=T(CARD); [[0,cd[0]],[90,cd[1]],[180,cd[2]],[270,cd[3]]].forEach(([a,t])=>{ const r=R+12; x.fillText(t,cx-r*Math.sin(a*D2R),cy-r*Math.cos(a*D2R)); }); x.textBaseline='alphabetic';
      const p=lab.sel||(lab.passes||[]).find(q=>q.end>Date.now()&&(!lab.only||q.vis)); if(!p){ return; }
      for(let i=1;i<p.pts.length;i++){ const a=p.pts[i-1], b=p.pts[i]; const [x1,y1]=P(a.el,a.az), [x2,y2]=P(b.el,b.az);
        x.strokeStyle=b.vis?'#ffffff':'rgba(140,160,210,.45)'; x.lineWidth=b.vis?3:1.6; x.setLineDash(b.vis?[]:[4,4]); x.beginPath(); x.moveTo(x1,y1); x.lineTo(x2,y2); x.stroke(); }
      x.setLineDash([]);
      const lab2=(s,t)=>{ const [px,py]=P(s.el,s.az); x.fillStyle='#4ea8ff'; x.beginPath(); x.arc(px,py,4.5,0,6.283); x.fill(); x.fillStyle='#e8edff'; x.font='600 11px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; x.fillText(t,px,py-9); };
      const a=p.vis?p.vS:p.pts[0], b=p.vis?p.vE:p.pts[p.pts.length-1], m=p.vis?p.vMax:p.max;
      lab2(a,hmm(new Date(a.t))); lab2(m,fmt(m.el,0)+'°'); lab2(b,hmm(new Date(b.t)));
      const [ex,ey]=P(b.el,b.az), pb=p.pts[Math.max(0,p.pts.indexOf(b)-2)]||b, [qx,qy]=P(pb.el,pb.az), an=Math.atan2(ey-qy,ex-qx);
      x.fillStyle='#fff'; x.beginPath(); x.moveTo(ex+Math.cos(an)*9,ey+Math.sin(an)*9); x.lineTo(ex+Math.cos(an+2.5)*8,ey+Math.sin(an+2.5)*8); x.lineTo(ex+Math.cos(an-2.5)*8,ey+Math.sin(an-2.5)*8); x.fill();
      if(lab.live && lab.live.el>0){ const [px,py]=P(lab.live.el,lab.live.az); x.fillStyle='#ffd35a'; x.shadowColor='#ffd35a'; x.shadowBlur=12; x.beginPath(); x.arc(px,py,5,0,6.283); x.fill(); x.shadowBlur=0; }
    }
    let shade=null, shadeT=0, track=null, trackT=0;
    function drawMap(s,now){
      const cv=$('isMap'), w=Math.max(280,cv.parentElement.clientWidth), h=Math.round(w/2); cv.style.height=h+'px'; const x=hiDPI(cv,w,h);
      const X=lon=>(lon+180)/360*w, Y=lat=>(90-lat)/180*h;
      if(map.complete&&map.naturalWidth) x.drawImage(map,0,0,w,h); else { x.fillStyle='#0b1a33'; x.fillRect(0,0,w,h); }
      if(!shade||now-shadeT>60000){ shadeT=now; const W=180, H=90; shade=document.createElement('canvas'); shade.width=W; shade.height=H; const c=shade.getContext('2d'), im=c.createImageData(W,H);
        const sv=sunVec(new Date(now)), sl=(sv.ra-sat.gstime(new Date(now))), sd=sv.dec;
        for(let j=0;j<H;j++){ const la=(90-(j+0.5)*180/H)*D2R; for(let i=0;i<W;i++){ const lo=(-180+(i+0.5)*360/W)*D2R;
          const sa=Math.asin(Math.sin(la)*Math.sin(sd)+Math.cos(la)*Math.cos(sd)*Math.cos(lo-sl))/D2R, a=Math.max(0,Math.min(1,(0.5-sa)/12.5));
          const k=(j*W+i)*4; im.data[k]=2; im.data[k+1]=5; im.data[k+2]=20; im.data[k+3]=Math.round(a*178); } }
        c.putImageData(im,0,0); }
      x.imageSmoothingEnabled=true; x.drawImage(shade,0,0,w,h);
      if(!track||now-trackT>30000){ trackT=now; track=[]; for(let t=-40;t<=95;t+=0.5){ const q=state(new Date(now+t*60000)); if(q) track.push([t,q.lat,q.lon]); } }
      const line=(from,to,style,width,dash)=>{ x.strokeStyle=style; x.lineWidth=width; x.setLineDash(dash); x.beginPath(); let prev=null;
        track.forEach(([t,la,lo])=>{ const tt=t-(now-trackT)/60000; if(tt<from||tt>to) return; const px=X(lo), py=Y(la); if(!prev||Math.abs(lo-prev)>180) x.moveTo(px,py); else x.lineTo(px,py); prev=lo; }); x.stroke(); x.setLineDash([]); };
      line(-40,0,'rgba(255,211,90,.55)',1.6,[4,4]); line(0,95,'rgba(255,255,255,.9)',2,[]);
      // ko'rinish doirasi (XKS 10° dan baland ko'rinadigan hudud)
      const e=10*D2R, lam=Math.acos(RE*Math.cos(e)/(RE+s.h))-e, la0=s.lat*D2R, lo0=s.lon*D2R;
      x.strokeStyle='rgba(78,168,255,.85)'; x.fillStyle='rgba(78,168,255,.14)'; x.lineWidth=1.3; x.beginPath(); let pl=null;
      for(let i=0;i<=72;i++){ const b=i/72*2*Math.PI, la=Math.asin(Math.sin(la0)*Math.cos(lam)+Math.cos(la0)*Math.sin(lam)*Math.cos(b));
        const lo=lo0+Math.atan2(Math.sin(b)*Math.sin(lam)*Math.cos(la0),Math.cos(lam)-Math.sin(la0)*Math.sin(la)); const L=((lo/D2R+540)%360)-180, px=X(L), py=Y(la/D2R);
        if(pl==null||Math.abs(L-pl)>180) x.moveTo(px,py); else x.lineTo(px,py); pl=L; }
      x.fill(); x.stroke();
      const o=loc(), ox=X(o.lon), oy=Y(o.lat); x.fillStyle='#ff6b6b'; x.strokeStyle='#fff'; x.lineWidth=1.5; x.beginPath(); x.arc(ox,oy,4.5,0,6.283); x.fill(); x.stroke();
      x.font='600 11px "Segoe UI",system-ui,sans-serif'; x.fillStyle='#fff'; x.textAlign='left'; x.shadowColor='#000'; x.shadowBlur=4; x.fillText(locName(o).split(' (')[0],ox+7,oy+4); x.shadowBlur=0;
      const ix=X(s.lon), iy=Y(s.lat), pulse=0.5+0.5*Math.sin(now/300);
      x.fillStyle=`rgba(255,255,255,${0.15+0.15*pulse})`; x.beginPath(); x.arc(ix,iy,13+4*pulse,0,6.283); x.fill();
      x.save(); x.translate(ix,iy); x.fillStyle='#ffffff'; x.fillRect(-2.5,-2.5,5,5); x.fillStyle='#8fc4ff'; x.fillRect(-11,-1.5,7,3); x.fillRect(4,-1.5,7,3); x.fillStyle='#fff'; x.fillRect(-1,-7,2,14); x.restore();
    }
    const kv=(k,v)=>`<div><div class="k">${esc(k)}</div><div class="v">${v}</div></div>`;
    function tick(){
      if(!lab.rec) return; const now=Date.now(), s=state(new Date(now)); if(!s) return; lab.live=s;
      drawMap(s,now);
      $('isKv').innerHTML=kv(T(TX.lat),fmt(Math.abs(s.lat),2)+'° '+(s.lat>=0?'N':'S'))+kv(T(TX.lon),fmt(Math.abs(s.lon),2)+'° '+(s.lon>=0?'E':'W'))
        +kv(T(TX.alt),fmt(s.h,0)+' km')+kv(T(TX.spd),fmt(s.v*3600,0)+' km/h <small style="color:var(--text-dim)">('+fmt(s.v,2)+' km/s)</small>')
        +kv(T(TX.dist),fmt(s.range,0)+' km')+kv(T(TX.st),s.sunlit?'☀ '+esc(T(TX.sunlit)):'● '+esc(T(TX.shadow)))
        +kv(T(TX.sky),s.el>0?fmt(s.el,1)+'° · '+esc(d8(s.az)):'<span style="color:var(--text-dim)">'+esc(T(TX.below))+' ('+fmt(s.el,0)+'°)</span>');
      const o=loc(), nv=(lab.passes||[]).find(p=>p.vis&&p.vE.t>now);
      const live=nv&&nv.vS.t<=now;
      $('isBadge').textContent=live?'● '+T(TX.now):''; $('isBadge').style.display=live?'':'none';
      if(nv){ const a=nv.vS, ms=a.t-now, dd=Math.floor(ms/86400000), hh=Math.floor(ms/3600000)%24, mm=Math.floor(ms/60000)%60, ss=Math.floor(ms/1000)%60;
        const cd=live?T(TX.now):(dd>0?dd+'d ':'')+pad(hh)+':'+pad(mm)+':'+pad(ss)+' '+T(TX.inT);
        $('isNext').innerHTML=`<div class="k">${esc(T(TX.next))}</div><div class="is-cd">${esc(cd)}</div>
          <div class="is-nd">${esc(fmtD(new Date(a.t)))}, <b>${hms(new Date(a.t))}</b> ${tzLabel(o.tz)} · ${esc(d16(a.az))} → <b>${fmt(nv.vMax.el,0)}°</b> → ${esc(d16(nv.vE.az))} · ${fmt(nv.mag,1)}ᵐ</div>`; }
      else $('isNext').innerHTML=`<div class="k">${esc(T(TX.next))}</div><div class="is-nd">—</div>`;
      drawSkyLive();
    }
    let skyT=0; function drawSkyLive(){ const n=Date.now(); if(n-skyT>5000){ skyT=n; drawSky(); } }
    function srcLine(tle){ const ep=epochOf(tle.l[0]), age=Math.round((Date.now()-ep)/3600000);
      $('isSrc').innerHTML=`<span style="font-size:12px;color:var(--text-dim)">${esc(T(TX.src))}: ${esc(tle.src)} · TLE ${age<48?age+' h':Math.round(age/24)+' d'} · ${tle.stale?esc(T(TX.off)):esc(T(TX.ago))+' '+hmm(new Date(tle.t||Date.now()))}</span><button class="lab-chip" id="isRef">↻ ${esc(T(TX.refresh))}</button>`;
      $('isRef').onclick=()=>{ click(700); start(true); }; }
    async function start(force){
      $('isNext').innerHTML=`<div class="is-nd">${esc(T(TX.loading))}</div>`;
      try{ sat=await loadLib(); }catch(e){ $('isNext').innerHTML=`<div class="is-nd">⚠ ${esc(T(TX.nolib))}</div>`; return; }
      const tle=await getTLE(force); lab.rec=sat.twoline2satrec(tle.l[0],tle.l[1]); track=null; srcLine(tle);
      setTimeout(predict,30);
    }
    map.onload=()=>tick();
    lab.start=start; lab.tickFn=tick; lab.lastPred=Date.now(); start(false);
  },
  open(){ const lab=this; clearInterval(lab.timer); lab.timer=setInterval(()=>{ if(lab.isOpen) lab.tickFn&&lab.tickFn(); },1000);
    if(lab.rec && (!lab.lastPred || Date.now()-lab.lastPred>15*60000)){ lab.lastPred=Date.now(); lab.start&&lab.start(false); } },
  close(){ clearInterval(this.timer); }
});
})();
