/* Osmon hisoblari — brauzer VA server uchun umumiy (server/sky.js bu faylni window'siz muhitda bajaradi).
   - SHOWERS: meteor oqimlari (labs/space.js shu ma'lumotdan foydalanadi);
   - issPasses: XKS o'tishlari (SGP4, satellite.js) — eslatmalar uchun;
   - matnlar 3 tilda (bildirishnomalar). */
(function(root){
const SHOWERS=[
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

const D2R=Math.PI/180, RE=6378.137;

// ---- Quyosh (ECI birlik vektori va RA/Dec) — labs/iss.js bilan bir xil formula ----
function sunVec(date){ const n=date.getTime()/86400000+2440587.5-2451545, L=(280.460+0.9856474*n)*D2R, g=(357.528+0.9856003*n)*D2R;
  const lam=L+(1.915*Math.sin(g)+0.020*Math.sin(2*g))*D2R, e=(23.439-0.0000004*n)*D2R;
  const v=[Math.cos(lam),Math.cos(e)*Math.sin(lam),Math.sin(e)*Math.sin(lam)];
  return { v, ra:Math.atan2(v[1],v[0]), dec:Math.asin(v[2]) }; }
function sunAlt(date,o,sat){ const s=sunVec(date), H=sat.gstime(date)+o.lon*D2R-s.ra, p=o.lat*D2R;
  return Math.asin(Math.sin(p)*Math.sin(s.dec)+Math.cos(p)*Math.cos(s.dec)*Math.cos(H))/D2R; }
function inShadow(r,s){ const d=r.x*s[0]+r.y*s[1]+r.z*s[2]; if(d>0) return false; const px=r.x-d*s[0], py=r.y-d*s[1], pz=r.z-d*s[2]; return Math.hypot(px,py,pz)<RE; }

/* XKS o'tishlari [t0, t1] oralig'ida (ms). sat — satellite.js; l1/l2 — TLE; o — {lat, lon}.
   Ko'rinadigan o'tish: XKS Quyosh nurida, kuzatuvchida esa qorong'i (Quyosh < −6°) va balandlik ≥ 10°.
   Algoritm labs/iss.js dagi bilan bir xil: 20 s qadam, chegaralar ikkiga bo'lish bilan aniqlanadi. */
function issPasses(sat, l1, l2, o, t0, t1){
  const rec=sat.twoline2satrec(l1,l2), obs={ longitude:o.lon*D2R, latitude:o.lat*D2R, height:0.4 };
  const state=d=>{ const pv=sat.propagate(rec,d); if(!pv||!pv.position) return null; const g=sat.gstime(d);
    const la=sat.ecfToLookAngles(obs, sat.eciToEcf(pv.position,g));
    return { el:la.elevation/D2R, az:la.azimuth/D2R, range:la.rangeSat, sunlit:!inShadow(pv.position,sunVec(d).v), r:pv.position }; };
  const mag=(s,d)=>{ const sv=sunVec(d).v, g=sat.gstime(d), oe=sat.geodeticToEcf(obs), c=Math.cos(g), sn=Math.sin(g), oi=[oe.x*c-oe.y*sn, oe.x*sn+oe.y*c, oe.z];
    const to=[oi[0]-s.r.x,oi[1]-s.r.y,oi[2]-s.r.z], n=Math.hypot(...to), ph=Math.acos(Math.max(-1,Math.min(1,(to[0]*sv[0]+to[1]*sv[1]+to[2]*sv[2])/n)));
    const F=(Math.sin(ph)+(Math.PI-ph)*Math.cos(ph))/Math.PI; return -1.8+5*Math.log10(s.range/1000)-2.5*Math.log10(Math.max(1e-3,F)/0.3183); };
  const elAt=t=>{ const s=state(new Date(t)); return s?s.el:-90; };
  const edge=(a,b)=>{ let ea=elAt(a); for(let i=0;i<12;i++){ const m=(a+b)/2, em=elAt(m); if((em>=0)===(ea>=0)){ a=m; ea=em; } else b=m; } return (a+b)/2; };
  const raw=[]; let cur=null, prev=null;
  for(let t=t0-20*60000;t<=t1;t+=20000){ const el=elAt(t);
    if(prev!=null && prev<0 && el>=0) cur={ start:edge(t-20000,t) };
    if(cur && prev!=null && prev>=0 && el<0){ cur.end=edge(t-20000,t); raw.push(cur); cur=null; }
    prev=el; }
  return raw.map(p=>{ let mx=null, vS=null, vE=null, vMax=null, best=9;
    for(let t=p.start;t<=p.end+1;t+=5000){ const d=new Date(Math.min(t,p.end)), s=state(d); if(!s) continue; s.t=d.getTime();
      if(!mx||s.el>mx.el) mx=s;
      if(s.el>=10 && s.sunlit && sunAlt(d,o,sat)<-6){ if(!vS) vS=s; vE=s; if(!vMax||s.el>vMax.el) vMax=s; const m=mag(s,d); if(m<best) best=m; } }
    const pick=s=>s&&{ t:s.t, el:s.el, az:s.az };
    return { start:p.start, end:p.end, max:pick(mx), vis:!!vS, vS:pick(vS), vE:pick(vE), vMax:pick(vMax), mag:vS?best:null };
  }).filter(p=>p.max && p.max.el>=10 && p.end>=t0 && p.start<=t1);
}

// ---- Meteor oqimlari: keyingi cho'qqilar (cho'qqi kuni UTC 00:00) ----
function nextShowerPeaks(now, days){
  const out=[], y=now.getUTCFullYear();
  SHOWERS.forEach(sh=>{ for(const yy of [y, y+1]){ const peak=Date.UTC(yy, sh.p[0]-1, sh.p[1]);
    const dd=(peak-now.getTime())/86400000; if(dd>=-1 && dd<=days){ out.push({ sh, peak, inDays:Math.ceil(dd) }); break; } } });
  return out.sort((a,b)=>a.peak-b.peak);
}

// ---- Matnlar (3 tilda) ----
function brightness(mag,l){ if(mag==null) return ''; return (mag<-2.5?{uz:'juda yorqin',ru:'очень яркая',en:'very bright'}:mag<-1?{uz:'yorqin',ru:'яркая',en:'bright'}:{uz:'oddiy yulduzdek',ru:'как обычная звезда',en:'like an ordinary star'})[l]||''; }
const DIR8={ uz:['shimol','shimoli-sharq','sharq','janubi-sharq','janub','janubi-g‘arb','g‘arb','shimoli-g‘arb'],
  ru:['север','северо-восток','восток','юго-восток','юг','юго-запад','запад','северо-запад'],
  en:['north','north-east','east','south-east','south','south-west','west','north-west'] };
const dir8=(az,l)=>(DIR8[l]||DIR8.uz)[Math.round(az/45)%8];
const hm=(t,tz)=>{ const d=new Date(t+tz*3600000); return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0'); };
function issText(p, l, tz, now){
  const s=p.vS||p.max, e=p.vE||p.max, m=p.vMax||p.max, mins=Math.max(1,Math.round((s.t-now)/60000));
  const brt=brightness(p.mag,l);
  const T={
    uz:{ title:`🛰 XKS ${mins} daqiqadan keyin`, body:`${hm(s.t,tz)} da ${dir8(s.az,'uz')}dan chiqadi, eng baland ${Math.round(m.el)}° (${hm(m.t,tz)}), ${dir8(e.az,'uz')}da yo‘qoladi. ${brt?'Yorqinligi: '+brt+'.':''}`.trim() },
    ru:{ title:`🛰 МКС через ${mins} мин`, body:`Появится в ${hm(s.t,tz)} на ${dir8(s.az,'ru')}е, наибольшая высота ${Math.round(m.el)}° (${hm(m.t,tz)}), исчезнет на ${dir8(e.az,'ru')}е. ${brt?'Яркость: '+brt+'.':''}`.trim() },
    en:{ title:`🛰 ISS in ${mins} min`, body:`Appears at ${hm(s.t,tz)} in the ${dir8(s.az,'en')}, highest ${Math.round(m.el)}° at ${hm(m.t,tz)}, disappears in the ${dir8(e.az,'en')}. ${brt?'It will be '+brt+'.':''}`.trim() } };
  return T[l]||T.uz;
}
function showerText(sh, l, inDays){
  const n=sh.n[l]||sh.n.uz, when=inDays<=0?{uz:'Bugun kechasi',ru:'Сегодня ночью',en:'Tonight'}:{uz:'Ertaga kechasi',ru:'Завтра ночью',en:'Tomorrow night'};
  const T={
    uz:{ title:`🌠 ${when.uz}: ${n}`, body:`Meteor oqimi cho‘qqisi — qorong‘i joyda soatiga ~${sh.zhr} tagacha meteor. Eng yaxshi vaqt: yarim tundan keyin, shahar chirog‘idan uzoqda.` },
    ru:{ title:`🌠 ${when.ru}: ${n}`, body:`Пик метеорного потока — в тёмном месте до ~${sh.zhr} метеоров в час. Лучшее время: после полуночи, вдали от городских огней.` },
    en:{ title:`🌠 ${when.en}: ${n}`, body:`Meteor shower peak — up to ~${sh.zhr} meteors per hour from a dark site. Best after midnight, away from city lights.` } };
  return T[l]||T.uz;
}

root.SKYCORE={ SHOWERS, issPasses, nextShowerPeaks, issText, showerText, brightness, dir8, hm, sunVec };
})(typeof window!=='undefined' ? window : globalThis);
