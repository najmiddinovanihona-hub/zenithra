/* ==========================================================================
   LABORATORIYA — alohida interaktiv oynalar: Oy fazalari, yulduz hayoti,
   TRAPPIST-1, bugungi osmon (Toshkent), teleskop, asteroid to'qnashuvi.
   Asosiy sahnaga faqat window.__solar orqali ulanadi.
   ========================================================================== */
(function(){
'use strict';
const LANGS=['uz','ru','en'];
const L=()=>{ const l=localStorage.getItem('solar_lang'); return LANGS.includes(l)?l:'uz'; };
const T=o=>o?(o[L()]!=null?o[L()]:o.uz):'';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const click=f=>{ try{ window.__solar&&window.__solar.click&&window.__solar.click(f); }catch(e){} };
const fmt=(x,d)=>{ const l=L(); const o={maximumFractionDigits:d==null?1:d, minimumFractionDigits:0};
  const s=Number(x).toLocaleString('en-US',o); return l==='en'?s:s.replace(/,/g,'\u202f').replace('.',','); };
const LABS={}, ORDER=[];
function register(id, def){ LABS[id]=def; ORDER.push(id); }
function build(id){
  const lab=LABS[id];
  if(lab.root){ lab.close&&lab.close(); lab.root.remove(); }
  const root=document.createElement('div'); root.className='lab'+(lab.bare?' lab-bare':''); root.id='lab-'+id;
  root.innerHTML=lab.bare?'<div class="lab-body"></div>':`<div class="lab-card glass"><button class="panel-close lab-x" aria-label="close">✕</button>
    <div class="lab-head"><h3>${esc(T(lab.name))}</h3><span class="lab-sub">${esc(T(lab.sub))}</span></div><div class="lab-body"></div></div>`;
  document.body.appendChild(root);
  const x=root.querySelector('.lab-x'); if(x) x.addEventListener('click',()=>closeLab(id));
  root.addEventListener('pointerdown',e=>{ if(e.target===root && !lab.bare) closeLab(id); });
  lab.root=root; lab.body=root.querySelector('.lab-body'); lab.lang=L();
  lab.build(lab.body, lab);
}
function openLab(id){
  const lab=LABS[id]; if(!lab) return;
  if(['tonight','iss','weather'].includes(id)) setTimeout(autoLocate,300);
  ORDER.forEach(k=>{ if(k!==id && LABS[k].root && LABS[k].root.classList.contains('open')) closeLab(k); });
  if(!lab.root || lab.lang!==L()) build(id);
  lab.root.classList.add('open'); lab.isOpen=true; click(700);
  window.__labCover=!lab.bare;   // asosiy 3D sahna yopiq oyna ortida chizilmaydi (blur + ikki WebGL bir vaqtda — qotish sababi)
  lab.open&&lab.open();
}
function closeLab(id){ const lab=LABS[id]; if(!lab||!lab.root) return; lab.root.classList.remove('open'); lab.isOpen=false; window.__labCover=false; lab.close&&lab.close(); click(440); }
window.addEventListener('keydown',e=>{ if(e.key==='Escape') ORDER.forEach(k=>{ if(LABS[k].isOpen) closeLab(k); }); });
const MENU_T={uz:'Laboratoriya',ru:'Лаборатория',en:'Laboratory'};
window.LABS_MENU=function(menu){
  const head=t=>{ const h=document.createElement('div');
    h.style.cssText='padding:8px 12px 4px;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--neon);font-weight:700';
    h.textContent=t; menu.appendChild(h); };
  let grp=null; head(T(MENU_T));
  [...ORDER.filter(id=>!LABS[id].group&&!LABS[id].nomenu), ...ORDER.filter(id=>LABS[id].group&&LABS[id].group.uz!=='Osmon')].forEach(id=>{ const lab=LABS[id];
    if(lab.group && (!grp||lab.group.uz!==grp.uz)){ grp=lab.group; head(T(grp)); }
    const b=document.createElement('button'); b.className='tour-item';
    b.innerHTML=`<span class="ti-ico">${lab.ico}</span><span class="ti-label">${esc(T(lab.name))}</span>`;
    b.addEventListener('click',()=>{ menu.classList.remove('open'); openLab(id); }); menu.appendChild(b); });
};
// Osmon — yuqori paneldagi alohida 🌃 tugma
const SKY_T={uz:'Osmon',ru:'Небо',en:'Sky'};
function skyMenu(){ const btn=document.getElementById('skyBtn'), m=document.getElementById('skyMenu'); if(!btn||!m) return;
  const fill=()=>{ m.innerHTML=''; const h=document.createElement('div');
    h.style.cssText='padding:8px 12px 4px;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--neon);font-weight:700'; h.textContent=T(SKY_T); m.appendChild(h);
    ORDER.filter(id=>LABS[id].group&&LABS[id].group.uz==='Osmon').forEach(id=>{ const lab=LABS[id], b=document.createElement('button'); b.className='tour-item';
      b.innerHTML='<span class="ti-ico">'+lab.ico+'</span><span class="ti-label">'+esc(T(lab.name))+'</span>';
      b.addEventListener('click',e=>{ e.stopPropagation(); m.classList.remove('open'); openLab(id); }); m.appendChild(b); });
    btn.title=T(SKY_T); };
  btn.addEventListener('click',e=>{ e.stopPropagation(); fill(); click(700); const tm=document.getElementById('toursMenu'); if(tm) tm.classList.remove('open'); m.classList.toggle('open'); });
  document.addEventListener('click',e=>{ if(!m.contains(e.target)&&!btn.contains(e.target)) m.classList.remove('open'); }, true);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',skyMenu); else setTimeout(skyMenu,0);
// kichik yordamchilar
function jd(d){ return d.getTime()/86400000+2440587.5; }
function sstep(a,b,x){ const t=Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); }
function bvRGB(bv){ const t=Math.max(-0.3,Math.min(1.8,bv==null?0.6:bv));
  const st=[[-0.3,155,176,255],[0,202,215,255],[0.3,248,247,255],[0.6,255,244,234],[1.0,255,222,180],[1.8,255,190,130]];
  for(let i=0;i<st.length-1;i++) if(t<=st[i+1][0]){ const k=(t-st[i][0])/(st[i+1][0]-st[i][0]);
    return [0,1,2].map(c=>Math.round(st[i][c+1]+(st[i+1][c+1]-st[i][c+1])*k)); }
  return [255,190,130]; }
function hiDPI(cv, w, h){ const r=Math.min(2,window.devicePixelRatio||1); cv.width=Math.round(w*r); cv.height=Math.round(h*r); const x=cv.getContext('2d'); x.setTransform(r,0,0,r,0,0); return x; }
function fitCanvas(cv, aspect){ const w=Math.max(260, cv.parentElement.clientWidth||600); const h=Math.round(w/aspect); cv.style.height=h+'px'; return {x:hiDPI(cv,w,h), w, h}; }
// ---- Kuzatuvchi joylashuvi (barcha osmon oynalari uchun umumiy) ----
const CITIES=[
  ['tashkent','Toshkent','Ташкент','Tashkent',41.2995,69.2401,5],['samarkand','Samarqand','Самарканд','Samarkand',39.6542,66.9597,5],
  ['bukhara','Buxoro','Бухара','Bukhara',39.7747,64.4286,5],['andijan','Andijon','Андижан','Andijan',40.7821,72.3442,5],
  ['namangan','Namangan','Наманган','Namangan',40.9983,71.6726,5],['fergana','Farg‘ona','Фергана','Fergana',40.3864,71.7864,5],
  ['qarshi','Qarshi','Карши','Qarshi',38.8606,65.7891,5],['termez','Termiz','Термез','Termez',37.2242,67.2783,5],
  ['nukus','Nukus','Нукус','Nukus',42.4600,59.6100,5],['urgench','Urganch','Ургенч','Urgench',41.5500,60.6333,5],
  ['khiva','Xiva','Хива','Khiva',41.3783,60.3639,5],['navoi','Navoiy','Навои','Navoi',40.0844,65.3792,5],
  ['jizzakh','Jizzax','Джизак','Jizzakh',40.1158,67.8422,5],['gulistan','Guliston','Гулистан','Gulistan',40.4897,68.7842,5],
  ['almaty','Olmaota','Алматы','Almaty',43.2389,76.8897,5],['bishkek','Bishkek','Бишкек','Bishkek',42.8746,74.5698,6],
  ['dushanbe','Dushanbe','Душанбе','Dushanbe',38.5598,68.7870,5],['ashgabat','Ashxobod','Ашхабад','Ashgabat',37.9601,58.3261,5],
  ['moscow','Moskva','Москва','Moscow',55.7558,37.6173,3],['istanbul','Istanbul','Стамбул','Istanbul',41.0082,28.9784,3]
].map(c=>({k:c[0],n:{uz:c[1],ru:c[2],en:c[3]},lat:c[4],lon:c[5],tz:c[6]}));
const GEO_T={uz:'Mening joylashuvim',ru:'Моё местоположение',en:'My location'}, GEO_ERR={uz:'Joylashuvni aniqlab bo‘lmadi',ru:'Не удалось определить местоположение',en:'Could not get your location'},
  GEO_HELP={uz:'Brauzer sozlamalarida bu sayt uchun joylashuvga ruxsat bering yoki ro‘yxatdan shaharni tanlang',ru:'Разрешите доступ к геолокации в настройках браузера или выберите город из списка',en:'Allow location for this site in browser settings, or pick a city from the list'};
function loc(){ try{ const o=JSON.parse(localStorage.getItem('sky_loc')||'null'); if(o && isFinite(o.lat) && isFinite(o.lon)) return o; }catch(e){} return {k:'tashkent',lat:41.2995,lon:69.2401,tz:5}; }
function placeOf(o){ const p=o&&o.place; return p?(p[L()]||p.uz||p.en):null; }
function locName(o){ o=o||loc(); const c=CITIES.find(c=>c.k===o.k); if(c) return T(c.n); const p=placeOf(o);
  if(p){ const a=[p.loc,p.city].filter((v,i,s)=>v&&s.indexOf(v)===i); if(a.length) return a.join(', '); }
  return T(GEO_T)+' ('+o.lat.toFixed(2)+'°, '+o.lon.toFixed(2)+'°)'; }
// Koordinatadan joy nomi (3 tilda) — BigDataCloud; GPS bo'lsa ko'cha/mahalla — OpenStreetMap
async function geocode(o){ const out={};
  await Promise.all(['uz','ru','en'].map(async lg=>{ try{ const j=await (await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+o.lat+'&longitude='+o.lon+'&localityLanguage='+lg)).json();
    const adm=(j.localityInfo&&j.localityInfo.administrative)||[]; const dist=adm.filter(a=>a.adminLevel>=6).map(a=>a.name).filter(n=>n!==j.locality&&n!==j.city);
    out[lg]={loc:j.locality||'', city:j.city||'', dist:dist.join(', '), region:j.principalSubdivision||'', country:j.countryName||'', cc:j.countryCode||''}; }catch(e){} }));
  if(o.src==='gps') for(const lg of ['uz','ru','en']){ try{ const j=await (await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&lat='+o.lat+'&lon='+o.lon+'&accept-language='+lg)).json(), a=j.address||{};
      const st=[a.road,a.neighbourhood||a.quarter||a.suburb].filter(Boolean).join(', '); if(st){ (out[lg]=out[lg]||{}).street=st; } }catch(e){} await new Promise(r=>setTimeout(r,1100)); if(L()===lg) break; }
  return Object.keys(out).length?out:null; }
const HERE_T={ title:{uz:'Siz turgan joy',ru:'Вы находитесь здесь',en:'You are here'}, street:{uz:'Ko‘cha / mahalla',ru:'Улица / квартал',en:'Street / area'}, dist:{uz:'Tuman',ru:'Район',en:'District'},
  city:{uz:'Shahar',ru:'Город',en:'City'}, region:{uz:'Viloyat',ru:'Область',en:'Region'}, country:{uz:'Davlat',ru:'Страна',en:'Country'}, coord:{uz:'Koordinatalar',ru:'Координаты',en:'Coordinates'},
  acc:{uz:'Aniqlik',ru:'Точность',en:'Accuracy'}, tz:{uz:'Vaqt zonasi',ru:'Часовой пояс',en:'Time zone'}, gps:{uz:'GPS',ru:'GPS',en:'GPS'}, ip:{uz:'internet manzili bo‘yicha, taxminan',ru:'по IP-адресу, примерно',en:'by IP address, approximate'},
  look:{uz:'Joy nomi aniqlanmoqda…',ru:'Определяем название места…',en:'Looking up the place name…'}, map:{uz:'Xaritada ochish',ru:'Открыть на карте',en:'Open on map'} };
function setLoc(o){ localStorage.setItem('sky_loc',JSON.stringify(o)); window.dispatchEvent(new CustomEvent('lab-loc',{detail:o})); }
// GPS shu oynada ruxsat etilganmi (ichki oyna/iframe'da brauzer uni bloklaydi)
function geoAllowed(){ if(!navigator.geolocation||!window.isSecureContext&&location.protocol!=='file:') return false; const p=document.permissionsPolicy||document.featurePolicy; try{ return p&&p.allowsFeature?p.allowsFeature('geolocation'):true; }catch(e){ return true; } }
const LOC_T={ src:{uz:'Manba',ru:'Источник',en:'Source'}, gps:{uz:'GPS (qurilma)',ru:'GPS (устройство)',en:'GPS (device)'}, ip:{uz:'Internet manzili (IP) — taxminiy',ru:'IP-адрес — приблизительно',en:'IP address — approximate'},
  manual:{uz:'Ro‘yxatdan tanlangan',ru:'Выбрано из списка',en:'Picked from the list'}, frame:{uz:'Bu oynada brauzer GPS’ni bloklagan, shuning uchun joy IP bo‘yicha taxminiy. Aniq joy uchun ilovani alohida oynada oching.',ru:'В этом окне браузер блокирует GPS, поэтому место определено по IP приблизительно. Для точного места откройте приложение в отдельной вкладке.',en:'This frame blocks GPS, so your place is estimated from your IP. Open the app in its own tab for an exact fix.'},
  openTab:{uz:'Alohida oynada ochish',ru:'Открыть в отдельной вкладке',en:'Open in its own tab'}, denied:{uz:'GPS’ga ruxsat berilmagan. Manzil satridagi 🔒 belgisini bosib, «Joylashuv» → «Ruxsat berish» ni tanlang.',ru:'Доступ к GPS запрещён. Нажмите 🔒 в адресной строке → «Геолокация» → «Разрешить».',en:'Location permission is blocked. Click 🔒 in the address bar → Location → Allow.'},
  locating:{uz:'Aniq joy aniqlanmoqda…',ru:'Определяем точное место…',en:'Getting your exact position…'} };
let locBusy=null;
const tzNow=()=>-new Date().getTimezoneOffset()/60;
async function applyLoc(la,lo,src,acc){ const o={k:'geo',lat:+la.toFixed(5),lon:+lo.toFixed(5),tz:tzNow(),src,acc:acc||null,at:Date.now()}; setLoc(o);
  const pl=await geocode(o); if(pl){ const cur=loc(); if(cur.k==='geo'&&cur.lat===o.lat&&cur.lon===o.lon){ o.place=pl; setLoc(o); } } }
async function byIP(){ for(const [u,f] of [['https://ipwho.is/',j=>[+j.latitude,+j.longitude]],['https://get.geojs.io/v1/ip/geo.json',j=>[+j.latitude,+j.longitude]]]){
    try{ const ctl=new AbortController(), t=setTimeout(()=>ctl.abort(),7000); const j=await (await fetch(u,{signal:ctl.signal})).json(); clearTimeout(t);
      const [la,lo]=f(j); if(isFinite(la)&&isFinite(lo)&&(la||lo)){ await applyLoc(la,lo,'ip'); return true; } }catch(e){} } return false; }
// Joyni aniqlash: avval GPS (aniq), bo'lmasa IP (taxminiy)
function locate(manual){ if(locBusy) return locBusy; window.dispatchEvent(new CustomEvent('lab-locating',{detail:true}));
  locBusy=(async()=>{ let res='fail';
    if(geoAllowed()){ const r=await new Promise(ok=>navigator.geolocation.getCurrentPosition(p=>ok({p}),e=>ok({e}),{enableHighAccuracy:true,timeout:15000,maximumAge:120000}));
      if(r.p){ await applyLoc(r.p.coords.latitude,r.p.coords.longitude,'gps',r.p.coords.accuracy); res='gps'; } else sessionStorage.setItem('loc_err',r.e&&r.e.code===1?'denied':'timeout'); }
    if(res==='fail' && (manual || loc().src!=='gps')){ if(await byIP()) res='ip'; }
    locBusy=null; window.dispatchEvent(new CustomEvent('lab-locating',{detail:false})); if(res==='fail') window.dispatchEvent(new CustomEvent('lab-loc',{detail:loc()})); return res; })();
  return locBusy; }
// Joylashuvga oid oyna birinchi ochilganda — avtomatik aniq joy
async function autoLocate(){ if(sessionStorage.getItem('loc_auto')) return; sessionStorage.setItem('loc_auto','1');
  const cur=loc(); if(cur.src==='gps' && Date.now()-(cur.at||0)<30*60000) return;
  if(cur.k!=='geo' && localStorage.getItem('sky_loc') && !cur.src && localStorage.getItem('loc_manual')==='1') return;   // foydalanuvchi shaharni o'zi tanlagan
  if(geoAllowed()){ let st='prompt'; try{ st=(await navigator.permissions.query({name:'geolocation'})).state; }catch(e){} if(st!=='denied'){ locate(false); return; } }
  if(cur.k!=='geo') locate(false); }
function locPicker(host){
  PICKERS.add(host);
  const cur=loc(), allowed=geoAllowed(), err=sessionStorage.getItem('loc_err');
  host.innerHTML=`<select class="lab-date lab-loc">${CITIES.map(c=>`<option value="${c.k}"${c.k===cur.k?' selected':''}>${esc(T(c.n))}</option>`).join('')}${cur.k==='geo'?`<option value="geo" selected>${esc(locName(cur))}</option>`:''}</select><button class="lab-chip lab-geo" title="${esc(T(GEO_T))}">${locBusy?'📍 …':'📍 '+esc(T(GEO_T))}</button>`;
  const row=(k,v,t)=>v?'<div><div class="k">'+esc(T(t||HERE_T[k]))+'</div><div class="v">'+esc(v)+'</div></div>':'';
  const box=document.createElement('div'); box.className='lab-here';
  if(cur.k==='geo'){ const p=placeOf(cur)||{};
    const acc=cur.src==='gps'?(cur.acc?'± '+(cur.acc<1000?Math.round(cur.acc)+' m':(cur.acc/1000).toFixed(1)+' km'):'GPS'):'± 5–25 km';
    box.innerHTML='<div class="lab-here-h"><span>📍 '+esc(T(HERE_T.title))+'</span><a href="https://www.openstreetmap.org/?mlat='+cur.lat+'&mlon='+cur.lon+'#map=16/'+cur.lat+'/'+cur.lon+'" target="_blank" rel="noopener">'+esc(T(HERE_T.map))+' ↗</a></div>'
      +(cur.place?'<div class="lab-kv">'+row('street',p.street)+row('dist',p.dist||(p.loc!==p.city?p.loc:''))+row('city',p.city)+row('region',p.region!==p.city?p.region:'')+row('country',p.country)
        +row('coord',Math.abs(cur.lat).toFixed(5)+'° '+(cur.lat>=0?'N':'S')+', '+Math.abs(cur.lon).toFixed(5)+'° '+(cur.lon>=0?'E':'W'))+row('acc',acc)+row('src',T(LOC_T[cur.src==='gps'?'gps':'ip']),LOC_T.src)+row('tz',tzLabel(cur.tz))+'</div>'
        :'<div class="lab-note" style="margin:6px 0 0">'+esc(T(HERE_T.look))+'</div>'); }
  let warn='';
  if(locBusy) warn='<div class="lab-here-w">⏳ '+esc(T(LOC_T.locating))+'</div>';
  else if(!allowed && cur.src!=='gps') warn='<div class="lab-here-w">ⓘ '+esc(T(LOC_T.frame))+' <button class="lab-chip" data-open-tab>↗ '+esc(T(LOC_T.openTab))+'</button></div>';
  else if(allowed && err==='denied' && cur.src!=='gps') warn='<div class="lab-here-w">⚠ '+esc(T(LOC_T.denied))+'</div>';
  if(cur.k==='geo'||warn){ box.insertAdjacentHTML('beforeend',warn); host.appendChild(box); }
  const ot=box.querySelector('[data-open-tab]'); if(ot) ot.onclick=()=>{ click(760); window.open(location.href.split('#')[0],'_blank','noopener'); };
  host.querySelector('select').onchange=e=>{ const c=CITIES.find(c=>c.k===e.target.value); if(c){ click(760); localStorage.setItem('loc_manual','1'); setLoc({k:c.k,lat:c.lat,lon:c.lon,tz:c.tz}); } };
  const gb=host.querySelector('.lab-geo');
  gb.onclick=async()=>{ click(780); localStorage.removeItem('loc_manual'); gb.disabled=true; gb.textContent='📍 …'; const r=await locate(true);
    if(r==='fail'){ gb.disabled=false; gb.textContent='⚠ '+T(GEO_ERR); gb.title=T(GEO_HELP); } };
}
const PICKERS=new Set();
window.addEventListener('lab-locating',()=>{ PICKERS.forEach(h=>{ if(h.isConnected) locPicker(h); else PICKERS.delete(h); }); });
// Joylashuv vaqt zonasida sana/vaqt: Date -> {y,m,d,h,mi,s}
function zoned(date,tz){ const t=new Date(date.getTime()+tz*3600000); return {y:t.getUTCFullYear(),m:t.getUTCMonth(),d:t.getUTCDate(),h:t.getUTCHours(),mi:t.getUTCMinutes(),s:t.getUTCSeconds(),wd:t.getUTCDay()}; }
const tzLabel=tz=>'UTC'+(tz>=0?'+':'−')+Math.abs(tz);
window.addEventListener('lab-loc',()=>{ ORDER.forEach(k=>{ const l=LABS[k]; if(l.onLoc && l.root) l.onLoc(); }); });
window.LAB={ get:id=>LABS[id], register, T, L, esc, fmt, click, jd, sstep, bvRGB, hiDPI, fitCanvas, openLab, closeLab, loc, setLoc, locName, locPicker, zoned, tzLabel, CITIES, locate, geoAllowed };
})();
