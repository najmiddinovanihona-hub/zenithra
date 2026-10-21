/* Osmon eslatmalari — yaqin hodisalar (XKS ko'rinadigan o'tishlari, meteor oqimlari) va bildirishnomalar.
   Hisob: labs/sky-core.js (server ham xuddi shu kod bilan eslatma yuboradi). Bildirishnoma: sw.js + /api/push. */
(function(){
const {register,T,L,esc,fmt,loc,locPicker,zoned,click}=window.LAB;
const SK=window.SKYCORE; if(!SK) return;
const TX={
  name:{uz:'Osmon eslatmalari',ru:'Небесные напоминания',en:'Sky reminders'},
  sub:{uz:'XKS shahringiz ustidan o‘tishi va meteor oqimlari — vaqtida xabar oling',ru:'Пролёты МКС над вашим городом и метеорные потоки — узнавайте вовремя',en:'ISS passes over your city and meteor showers — get told in time'},
  upcoming:{uz:'Yaqin hodisalar',ru:'Ближайшие события',en:'Upcoming events'},
  iss:{uz:'XKS ko‘rinadigan o‘tishlari (3 kun)',ru:'Видимые пролёты МКС (3 дня)',en:'Visible ISS passes (3 days)'},
  met:{uz:'Meteor oqimlari (45 kun)',ru:'Метеорные потоки (45 дней)',en:'Meteor showers (45 days)'},
  noIss:{uz:'Yaqin 3 kunda ko‘rinadigan o‘tish yo‘q (XKS kunduzi yoki Yer soyasida o‘tadi).',ru:'В ближайшие 3 дня видимых пролётов нет (МКС пролетает днём или в тени Земли).',en:'No visible passes in the next 3 days (the ISS passes in daylight or in Earth’s shadow).'},
  loading:{uz:'Hisoblanmoqda…',ru:'Считаем…',en:'Calculating…'},
  offline:{uz:'XKS orbitasini yuklab bo‘lmadi — internetni tekshiring.',ru:'Не удалось загрузить орбиту МКС — проверьте интернет.',en:'Could not load the ISS orbit — check your connection.'},
  high:{uz:'eng baland',ru:'макс. высота',en:'highest'},
  today:{uz:'Bugun',ru:'Сегодня',en:'Today'}, tom:{uz:'Ertaga',ru:'Завтра',en:'Tomorrow'},
  inDays:{uz:'kundan keyin',ru:'дн.',en:'days'}, perHour:{uz:'soatiga ~',ru:'до ~',en:'up to ~'}, perHour2:{uz:' ta',ru:' в час',en:'/hour'},
  notif:{uz:'Bildirishnomalar',ru:'Уведомления',en:'Notifications'},
  pIss:{uz:'🛰 XKS o‘tishidan ~15 daqiqa oldin',ru:'🛰 За ~15 минут до пролёта МКС',en:'🛰 ~15 minutes before an ISS pass'},
  pMet:{uz:'🌠 Meteor oqimi cho‘qqisi kechasi',ru:'🌠 Вечером в пик метеорного потока',en:'🌠 On meteor shower peak evenings'},
  on:{uz:'🔔 Bildirishnomalarni yoqish',ru:'🔔 Включить уведомления',en:'🔔 Turn on notifications'},
  off:{uz:'🔕 O‘chirish',ru:'🔕 Выключить',en:'🔕 Turn off'},
  test:{uz:'Sinab ko‘rish',ru:'Проверить',en:'Send a test'},
  isOn:{uz:'Yoqilgan — sayt yopiq bo‘lsa ham xabar keladi.',ru:'Включено — сообщения придут, даже если сайт закрыт.',en:'On — you will be notified even when the site is closed.'},
  isOff:{uz:'O‘chiq.',ru:'Выключено.',en:'Off.'},
  denied:{uz:'Brauzer bildirishnomalarni taqiqlagan. Manzil satridagi 🔒 → «Bildirishnomalar» → «Ruxsat berish».',ru:'Браузер запретил уведомления. 🔒 в адресной строке → «Уведомления» → «Разрешить».',en:'Notifications are blocked. Click 🔒 in the address bar → Notifications → Allow.'},
  unsup:{uz:'Bu brauzer bildirishnomalarni qo‘llamaydi. iPhone’da: saytni «Ulashish → Bosh ekranga qo‘shish» orqali o‘rnating va o‘sha ikonkadan oching.',ru:'Этот браузер не поддерживает уведомления. На iPhone: «Поделиться → На экран Домой», затем откройте с этой иконки.',en:'This browser does not support notifications. On iPhone: Share → Add to Home Screen, then open from that icon.'},
  noServer:{uz:'Bildirishnomalar faqat sayt server orqali ochilganda ishlaydi.',ru:'Уведомления работают, только когда сайт открыт через сервер.',en:'Notifications only work when the site is served by its server.'},
  err:{uz:'Xatolik — keyinroq urinib ko‘ring.',ru:'Ошибка — попробуйте позже.',en:'Something went wrong — try again later.'},
  sent:{uz:'Sinov xabari yuborildi.',ru:'Тестовое сообщение отправлено.',en:'Test notification sent.'},
  privacy:{uz:'Maxfiylik: bildirishnoma yoqilganda serverga faqat taxminiy joylashuv (~10 km aniqlikda) yuboriladi; o‘chirilsa — o‘chiriladi.',ru:'Конфиденциальность: при включении на сервер отправляется только примерное место (~10 км); при выключении — удаляется.',en:'Privacy: only an approximate location (~10 km) is sent when you turn this on, and it is deleted when you turn it off.'},
  more:{uz:'Batafsil',ru:'Подробнее',en:'Details'},
  toastIss:{uz:'XKS ko‘rinadi',ru:'МКС будет видна',en:'ISS visible'},
};
const pad=n=>String(n).padStart(2,'0');
const hm=t=>{ const z=zoned(new Date(t),loc().tz); return pad(z.h)+':'+pad(z.mi); };
function dayLabel(t){ const o=loc(), z=zoned(new Date(t),o.tz), n=zoned(new Date(),o.tz), dd=Math.round((Date.UTC(z.y,z.m,z.d)-Date.UTC(n.y,n.m,n.d))/86400000);
  if(dd===0) return T(TX.today); if(dd===1) return T(TX.tom);
  const mo={uz:['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'],ru:['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}[L()];
  return L()==='en'?mo[z.m]+' '+z.d:z.d+' '+mo[z.m]; }

/* ---------- XKS: satellite.js + TLE (labs/iss.js bilan bir xil kesh kaliti) ---------- */
function loadSat(){ return new Promise((res,rej)=>{ if(window.satellite) return res(window.satellite);
  const s=document.createElement('script'); s.src='labs/satellite.min.js'; s.onload=()=>window.satellite?res(window.satellite):rej(); s.onerror=rej; document.head.appendChild(s); }); }
async function getTLE(){
  let c=null; try{ c=JSON.parse(localStorage.getItem('iss_tle')||'null'); }catch(e){}
  if(c && Date.now()-c.t<3*3600000) return c.l;
  try{ const r=await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE',{signal:AbortSignal.timeout?AbortSignal.timeout(8000):undefined});
    const l=(await r.text()).split(/\r?\n/).filter(s=>/^[12] /.test(s)); if(l.length===2){ localStorage.setItem('iss_tle',JSON.stringify({l,t:Date.now(),src:'CelesTrak'})); return l; } }catch(e){}
  return c?c.l:null; }
async function issPasses(days){ const [sat,l]=await Promise.all([loadSat(),getTLE()]); if(!l) return null; const o=loc(), now=Date.now();
  return SK.issPasses(sat,l[0],l[1],{lat:o.lat,lon:o.lon},now,now+days*86400000).filter(p=>p.vis&&p.vS&&(p.vMax?p.vMax.el:0)>=10); }

/* ---------- Bildirishnoma (Web Push) ---------- */
const canPush=()=>'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const PREF='push_prefs';
const getPrefs=()=>{ try{ return JSON.parse(localStorage.getItem(PREF))||{iss:true,showers:true}; }catch(e){ return {iss:true,showers:true}; } };
const b64=s=>{ const p='='.repeat((4-s.length%4)%4), r=atob((s+p).replace(/-/g,'+').replace(/_/g,'/')); return Uint8Array.from(r,c=>c.charCodeAt(0)); };
async function post(url,body){ const r=await fetch(url,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); if(!r.ok) throw new Error(r.status); return r.json(); }
async function currentSub(){ if(!canPush()) return null; const reg=await navigator.serviceWorker.getRegistration('/'); return reg?reg.pushManager.getSubscription():null; }
async function sendSub(sub,prefs){ const o=loc(); return post('/api/push/subscribe',{ subscription:sub.toJSON(), lat:+o.lat, lon:+o.lon, tz:+o.tz||0, lang:L(), prefs }); }
async function enablePush(prefs){
  const reg=await navigator.serviceWorker.register('/sw.js');
  const perm=await Notification.requestPermission(); if(perm!=='granted') throw Object.assign(new Error('denied'),{code:'denied'});
  const {key}=await (await fetch('/api/push/key')).json();
  let sub=await reg.pushManager.getSubscription();
  if(!sub) sub=await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:b64(key) });
  await sendSub(sub,prefs); return sub; }
async function disablePush(){ const sub=await currentSub(); if(!sub) return; await post('/api/push/unsubscribe',{endpoint:sub.endpoint}).catch(()=>{}); await sub.unsubscribe().catch(()=>{}); }

register('reminders',{ ico:'🔔', group:{uz:'Osmon',ru:'Небо',en:'Sky'}, name:TX.name, sub:TX.sub,
  build(body, lab){
    body.innerHTML=`<div class="lab-row" id="rmLoc" style="margin-top:0"></div>
      <div class="lab-grid"><div><div class="sec-title">${esc(T(TX.upcoming))}</div>
        <div class="rm-h">🛰 ${esc(T(TX.iss))}</div><div class="lab-list rm-list" id="rmIss"><div class="lab-note">${esc(T(TX.loading))}</div></div>
        <div class="rm-h">🌠 ${esc(T(TX.met))}</div><div class="lab-list rm-list" id="rmMet"></div></div>
      <div><div class="sec-title">${esc(T(TX.notif))}</div>
        <label class="rm-chk"><input type="checkbox" id="rmPIss"> ${esc(T(TX.pIss))}</label>
        <label class="rm-chk"><input type="checkbox" id="rmPMet"> ${esc(T(TX.pMet))}</label>
        <div class="lab-row"><button class="lab-chip on" id="rmOn"></button><button class="lab-chip" id="rmTest">${esc(T(TX.test))}</button></div>
        <p class="lab-p rm-st" id="rmSt"></p><p class="lab-note">${esc(T(TX.privacy))}</p></div></div>`;
    const $=id=>body.querySelector('#'+id), prefs=getPrefs();
    $('rmPIss').checked=prefs.iss; $('rmPMet').checked=prefs.showers;
    locPicker($('rmLoc'));
    let on=false;
    const st=(m,bad)=>{ $('rmSt').textContent=m; $('rmSt').classList.toggle('bad',!!bad); };
    async function refreshState(){
      const online=window.API&&window.API.online;
      if(!online){ $('rmOn').disabled=true; $('rmTest').style.display='none'; st(T(TX.noServer)); return; }
      if(!canPush()){ $('rmOn').disabled=true; $('rmTest').style.display='none'; st(T(TX.unsup)); return; }
      if(Notification.permission==='denied'){ st(T(TX.denied),true); }
      on=!!(await currentSub()); $('rmOn').textContent=T(on?TX.off:TX.on); $('rmOn').classList.toggle('on',!on);
      $('rmTest').style.display=on?'':'none'; if(Notification.permission!=='denied') st(T(on?TX.isOn:TX.isOff));
    }
    const curPrefs=()=>({ iss:$('rmPIss').checked, showers:$('rmPMet').checked });
    const savePrefs=async()=>{ const p=curPrefs(); localStorage.setItem(PREF,JSON.stringify(p)); if(on){ const s=await currentSub(); if(s) sendSub(s,p).catch(()=>{}); } };
    $('rmPIss').onchange=savePrefs; $('rmPMet').onchange=savePrefs;
    $('rmOn').onclick=async()=>{ click(760); $('rmOn').disabled=true;
      try{ if(on) await disablePush(); else await enablePush(curPrefs()); }
      catch(e){ st(e.code==='denied'?T(TX.denied):T(TX.err),true); }
      finally{ $('rmOn').disabled=false; refreshState(); } };
    $('rmTest').onclick=async()=>{ click(700); try{ const s=await currentSub(); await post('/api/push/test',{endpoint:s.endpoint}); st(T(TX.sent)); }catch(e){ st(T(TX.err),true); } };
    async function renderIss(){ const box=$('rmIss');
      try{ const ps=await issPasses(3); if(ps===null){ box.innerHTML=`<div class="lab-note">${esc(T(TX.offline))}</div>`; return; }
        if(!ps.length){ box.innerHTML=`<div class="lab-note">${esc(T(TX.noIss))}</div>`; return; }
        box.innerHTML=ps.slice(0,8).map(p=>`<div class="rm-it"><b>${esc(dayLabel(p.vS.t))} ${hm(p.vS.t)}–${hm(p.vE.t)}</b>
          <span>${esc(SK.dir8(p.vS.az,L()))} → ${esc(SK.dir8(p.vE.az,L()))} · ${esc(T(TX.high))} ${Math.round(p.vMax.el)}°${p.mag!=null?' · '+esc(SK.brightness(p.mag,L())):''}</span></div>`).join(''); }
      catch(e){ box.innerHTML=`<div class="lab-note">${esc(T(TX.offline))}</div>`; } }
    function renderMet(){ const now=new Date();
      $('rmMet').innerHTML=SK.nextShowerPeaks(now,45).map(pk=>{ const d=pk.inDays;
        return `<div class="rm-it"><b>${esc(T(pk.sh.n))}</b><span>${esc(dayLabel(pk.peak+12*3600000))}${d>1?' · '+d+' '+esc(T(TX.inDays)):''} · ${esc(T(TX.perHour))}${pk.sh.zhr}${esc(T(TX.perHour2))}</span></div>`; }).join('')||'<div class="lab-note">—</div>'; }
    lab.render=()=>{ renderMet(); renderIss(); refreshState(); };
    lab.onLoc=()=>{ locPicker($('rmLoc')); lab.render(); if(on) savePrefs(); };
    lab.render();
  },
  open(){ this.render&&this.render(); }
});

/* ---------- Sayt ochilganda: bugungi hodisa haqida qisqa eslatma (bir marta) ---------- */
function toast(text,onMore){
  const t=document.createElement('div'); t.className='rm-toast glass'; t.setAttribute('role','status');
  t.innerHTML=`<span>${esc(text)}</span><button class="lab-chip">${esc(T(TX.more))}</button><button class="rm-x" aria-label="×">×</button>`;
  t.querySelector('.lab-chip').onclick=()=>{ t.remove(); onMore(); }; t.querySelector('.rm-x').onclick=()=>t.remove();
  document.body.appendChild(t); setTimeout(()=>t.classList.add('on'),30); setTimeout(()=>{ t.classList.remove('on'); setTimeout(()=>t.remove(),500); },14000); }
const seen=k=>{ try{ const a=JSON.parse(localStorage.getItem('rm_seen')||'[]'); if(a.includes(k)) return true; a.push(k); localStorage.setItem('rm_seen',JSON.stringify(a.slice(-30))); }catch(e){} return false; };
async function todayHint(){
  const open=()=>window.LAB.openLab('reminders');
  const now=Date.now(), pk=SK.nextShowerPeaks(new Date(now),1).find(p=>p.inDays<=1 && p.sh.zhr>=10);
  if(pk && !seen('met:'+pk.sh.k+':'+pk.peak)){ const t=SK.showerText(pk.sh,L(),pk.inDays); toast(t.title,open); return; }
  try{ const ps=await issPasses(0.5); const p=ps&&ps.find(x=>x.vMax&&x.vMax.el>=25);
    if(p && !seen('iss:'+Math.round(p.vS.t/60000))) toast(`🛰 ${T(TX.toastIss)}: ${dayLabel(p.vS.t)} ${hm(p.vS.t)} · ${SK.dir8(p.vS.az,L())} → ${SK.dir8(p.vE.az,L())} · ${T(TX.high)} ${Math.round(p.vMax.el)}°`,open); }catch(e){}
}
// Intro tugab, sahna ochilgach (yuqori panel ko'ringanda) — fonda, sahifani sekinlashtirmasdan
const tb=document.getElementById('topbar');
if(tb){ const mo=new MutationObserver(()=>{ if(!tb.classList.contains('hidden')){ mo.disconnect(); setTimeout(()=>(window.requestIdleCallback||setTimeout)(todayHint),6000); } }); mo.observe(tb,{attributes:true,attributeFilter:['class']}); }
// Bildirishnoma bosilganda (sw.js) yoki /#eslatma havolasi bilan ochilganda
if('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message',e=>{ if(e.data&&e.data.astro==='open-reminders') window.LAB.openLab('reminders'); });
if(location.hash==='#eslatma') window.addEventListener('load',()=>setTimeout(()=>{ history.replaceState(null,'',location.pathname+location.search); window.LAB.openLab('reminders'); },1200));
})();
