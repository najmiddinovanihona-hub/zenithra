/* ASTRO API — backend bilan aloqa: kirish, darslik progressi, test natijalari va sozlamalar sinxroni.
   Backend bo'lmasa (file:// yoki statik hosting) — API.online=false, sayt avvalgidek mehmon rejimida
   faqat localStorage bilan ishlaydi.
   Sinxron: localStorage.setItem ustidan kuzatuv — `dz_prog` va sozlama kalitlari o'zgarsa, kirgan
   foydalanuvchida serverga (debounce bilan) yuboriladi. Shu sababli mavjud kodni o'zgartirish shart emas. */
(function(){
const LS = window.localStorage;
const PROG = 'dz_prog';
// localStorage kaliti → server sozlamasi
const SET = {
  solar_lang: { k:'lang',      get:v=>v,          put:v=>v },
  solar_voice:{ k:'voice',     get:v=>v==='1',    put:v=>v?'1':'0' },
  dz_theme:   { k:'theme',     get:v=>v,          put:v=>v },
  dz_side:    { k:'side',      get:v=>v,          put:v=>v },
  sky_loc:    { k:'loc',       get:v=>{ try{ return JSON.parse(v); }catch(e){ return null; } }, put:v=>JSON.stringify(v) },
  loc_manual: { k:'locManual', get:v=>v==='1',    put:v=>v?'1':'0' },
};
const VALID = { lang:v=>['uz','ru','en'].includes(v), theme:v=>['day','night'].includes(v), side:v=>['open','shut'].includes(v),
  voice:v=>typeof v==='boolean', locManual:v=>typeof v==='boolean', loc:v=>v===null||(v&&isFinite(v.lat)&&isFinite(v.lon)) };

const listeners = [];
const API = window.API = { online:false, user:null, on:f=>listeners.push(f) };
const emit = () => listeners.forEach(f=>{ try{ f(API.user); }catch(e){ console.error(e); } });

async function req(method, url, body){
  let r;
  try{
    r = await fetch(url, { method, credentials:'same-origin',
      headers: body!==undefined ? {'Content-Type':'application/json'} : {},
      body: body!==undefined ? JSON.stringify(body) : undefined });
  }catch(e){ throw { status:0, code:'NETWORK' }; }
  let data = null;
  try{ data = await r.json(); }catch(e){}
  if(!r.ok || !data){
    const err = { status:r.status, code:(data&&data.error)||'SERVER_ERROR' };
    if(r.status===401 && API.user && !/\/auth\/(login|register)$/.test(url)){ API.user=null; emit(); }
    throw err;
  }
  return data;
}

/* ---------- localStorage kuzatuvi ---------- */
let applying = false;            // serverdan kelgan qiymatni yozayotganda qayta yubormaslik uchun
const rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
function quiet(fn){ applying=true; try{ fn(); }finally{ applying=false; } }
function watch(key, removed){
  if(applying || !API.user) return;
  if(key===PROG) return schedule('prog');
  const m = SET[key]; if(!m) return;
  const v = removed ? (key==='loc_manual' ? false : null) : m.get(LS.getItem(key));
  if(VALID[m.k](v)){ pendingSettings[m.k]=v; schedule('set'); }
}
Storage.prototype.setItem = function(k, v){ rawSet.call(this, k, v); if(this===LS) watch(k, false); };
Storage.prototype.removeItem = function(k){ rawRemove.call(this, k); if(this===LS) watch(k, true); };

const timers = {}; let pendingSettings = {};
function schedule(what){
  clearTimeout(timers[what]);
  timers[what] = setTimeout(()=>{ timers[what]=null; (what==='prog' ? pushProgress() : pushSettings()).catch(()=>{}); }, 1200);
}
function localProgress(){ try{ return JSON.parse(LS.getItem(PROG)) || {}; }catch(e){ return {}; } }
function applyProgress(p){
  quiet(()=>{ if(window.DZP && window.DZP.replace) window.DZP.replace(p); else LS.setItem(PROG, JSON.stringify(p)); });
}
// mode: 'auto' — bo'sh progress = foydalanuvchi o'zi tozalagan (DZP.reset) → serverda ham tozalanadi;
//       'merge' — kirish paytidagi sinxron: qurilma bo'sh bo'lsa ham serverdagi progress hech qachon o'chmaydi.
async function pushProgress(mode = 'auto'){
  const p = localProgress();
  const empty = !Object.keys(p).length;
  const r = await req('PUT', '/api/me/progress', { progress:p, mode: mode==='auto' && empty ? 'replace' : 'merge' });
  if(JSON.stringify(r.progress)!==JSON.stringify(p)) applyProgress(r.progress);
}
async function pushSettings(){
  const patch = pendingSettings; pendingSettings = {};
  if(Object.keys(patch).length) await req('PUT', '/api/me/settings', patch);
}

/* ---------- kirgandan keyin: server ↔ qurilma ---------- */
async function syncAll(){
  // Progress: qurilmadagisi serverdagisi bilan birlashtiriladi (birinchi kirishda mehmon progressi yo'qolmaydi).
  await pushProgress('merge').catch(()=>{});
  // Sozlamalar: serverda borlari qurilmaga yoziladi, serverda yo'qlari qurilmadan serverga yuboriladi.
  try{
    const { settings:s } = await req('GET', '/api/me/settings');
    const missing = {};
    for(const [lsKey, m] of Object.entries(SET)){
      if(s[m.k]!==undefined && s[m.k]!==null){
        const nv = m.put(s[m.k]);
        if(LS.getItem(lsKey)===nv) continue;
        if(m.k==='lang'){ if(typeof window.applyLanguage==='function') quiet(()=>window.applyLanguage(s.lang)); else quiet(()=>LS.setItem(lsKey,nv)); }
        else quiet(()=>LS.setItem(lsKey, nv));
        if(m.k==='loc') window.dispatchEvent(new CustomEvent('lab-loc', { detail:s.loc }));
      } else if(LS.getItem(lsKey)!==null){
        const v = m.get(LS.getItem(lsKey));
        if(VALID[m.k](v) && v!==null) missing[m.k]=v;
      }
    }
    if(Object.keys(missing).length) await req('PUT', '/api/me/settings', missing);
  }catch(e){}
}

/* ---------- ommaviy funksiyalar ---------- */
API.register = async (name, email, password) => {
  const lang = LS.getItem('solar_lang') || 'uz';
  const r = await req('POST', '/api/auth/register', { name, email, password, lang });
  API.user = r.user; emit(); syncAll(); return r.user;
};
API.login = async (email, password) => {
  const r = await req('POST', '/api/auth/login', { email, password });
  API.user = r.user; emit(); syncAll(); return r.user;
};
API.logout = async () => {
  // Yuborilmagan o'zgarishlarni chiqishdan oldin saqlab qolamiz.
  const pending = timers.prog; clearTimeout(timers.prog); clearTimeout(timers.set); timers.prog = timers.set = null;
  await Promise.all([pending ? pushProgress() : null, pushSettings()]).catch(()=>{});
  try{ await req('POST', '/api/auth/logout'); }catch(e){}
  API.user = null;
  // Umumiy kompyuterda keyingi odam oldingi foydalanuvchi progressini ko'rmasligi uchun.
  applyProgress({});
  emit();
};
// Profil: avval yuborilmay turgan progress saqlanadi, so'ng yangi statistika olinadi.
API.profile = async () => {
  if(timers.prog){ clearTimeout(timers.prog); timers.prog=null; await pushProgress().catch(()=>{}); }
  return req('GET', '/api/me/profile');
};
API.updateName = async (name) => {
  const r = await req('PATCH', '/api/me/profile', { name });
  API.user = r.user; emit(); return r.user;
};
API.changePassword = (currentPassword, newPassword) => req('POST', '/api/me/password', { currentPassword, newPassword });
// Test natijasi: faqat kirgan foydalanuvchida serverga yoziladi (mehmonda jim o'tkazib yuboriladi).
API.quiz = (quizId, score, total) => {
  if(!API.user || !(total>0)) return;
  req('POST', '/api/me/quiz', { quizId:String(quizId).slice(0,64), score, total }).catch(()=>{});
};

/* ---------- ishga tushish ---------- */
// Eski demo-auth (localStorage'dagi zaif parol xeshlari) endi ishlatilmaydi — o'chiramiz.
try{ rawRemove.call(LS, 'st_users'); rawRemove.call(LS, 'st_session'); }catch(e){}

API.ready = (async ()=>{
  if(!/^https?:$/.test(location.protocol)) return;
  try{
    const r = await req('GET', '/api/auth/me');   // mehmonda {user:null}
    API.online = 'user' in r; API.user = r.user || null;
  }catch(e){}
  emit();
  if(API.user) syncAll();
})();
})();
