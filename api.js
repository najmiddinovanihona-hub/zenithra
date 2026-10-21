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
};
// Joylashuv (sky_loc, loc_manual) ATAYLAB sinxronlanmaydi: u har bir qurilmaning o'ziga xos (telefon va kompyuter
// turli joyda bo'lishi mumkin), aniq GPS koordinatasi va ko'cha nomi esa shaxsiy ma'lumot — serverga yuborilmaydi.
const VALID = { lang:v=>['uz','ru','en'].includes(v), theme:v=>['day','night'].includes(v), side:v=>['open','shut'].includes(v),
  voice:v=>typeof v==='boolean' };

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
    // Sessiya kutilmaganda tugadi (muddati, bloklash, boshqa qurilmada parol almashtirildi) — chiqish kabi
    if(r.status===401 && API.user && !/\/auth\/(login|register)$/.test(url)){ API.user=null; forgetLocalUser(); emit(); }
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
  const v = removed ? null : m.get(LS.getItem(key));
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
// Qurilmadagi progress kimniki: umumiy (maktab) kompyuterida oldingi foydalanuvchi progressi keyingisiga o'tib ketmasin.
const OWNER = 'dz_prog_uid';
function forgetLocalUser(){
  clearTimeout(timers.prog); clearTimeout(timers.set); timers.prog = timers.set = null; pendingSettings = {};
  applyProgress({}); try{ rawRemove.call(LS, OWNER); }catch(e){}
}
// mode: 'auto' — bo'sh progress = foydalanuvchi o'zi tozalagan (DZP.reset) → serverda ham tozalanadi;
//       'merge' — kirish paytidagi sinxron: qurilma bo'sh bo'lsa ham serverdagi progress hech qachon o'chmaydi.
async function pushProgress(mode = 'auto'){
  const p = localProgress(), sent = JSON.stringify(p);
  const empty = !Object.keys(p).length;
  const r = await req('PUT', '/api/me/progress', { progress:p, mode: mode==='auto' && empty ? 'replace' : 'merge' });
  // So'rov ketayotganda darslikda yangi belgi qo'yilgan bo'lsa — uni server javobi bilan bosib ketmaymiz,
  // keyingi yuborishda u ham birlashadi.
  if(JSON.stringify(localProgress())!==sent){ schedule('prog'); return; }
  if(JSON.stringify(r.progress)!==sent) applyProgress(r.progress);
}
async function pushSettings(){
  const patch = pendingSettings; pendingSettings = {};
  if(!Object.keys(patch).length) return;
  try{ await req('PUT', '/api/me/settings', patch); }
  catch(e){ pendingSettings = { ...patch, ...pendingSettings }; throw e; }   // yo'qolmasin — keyingi safar qayta
}

/* ---------- kirgandan keyin: server ↔ qurilma ---------- */
async function syncAll(){
  const uid = API.user && String(API.user.id); if(!uid) return;
  const owner = LS.getItem(OWNER);
  try{
    if(owner && owner!==uid){
      // Qurilmada BOSHQA foydalanuvchining qoldiq progressi — birlashtirilmaydi, serverdagisi olinadi.
      const r = await req('GET', '/api/me/progress'); applyProgress(r.progress);
    } else {
      // Mehmon progressi yoki shu foydalanuvchiniki — serverdagisi bilan birlashtiriladi (yo'qolmaydi).
      await pushProgress('merge');
    }
    rawSet.call(LS, OWNER, uid);
  }catch(e){}
  // Sozlamalar: serverda borlari qurilmaga yoziladi, serverda yo'qlari qurilmadan serverga yuboriladi.
  try{
    const { settings:s } = await req('GET', '/api/me/settings');
    const missing = {};
    for(const [lsKey, m] of Object.entries(SET)){
      if(m.k in pendingSettings) continue;   // foydalanuvchi shu orada o'zgartirgan — eski server qiymati bosmasin
      if(s[m.k]!==undefined && s[m.k]!==null){
        const nv = m.put(s[m.k]);
        if(LS.getItem(lsKey)===nv) continue;
        if(m.k==='lang'){ if(typeof window.applyLanguage==='function') quiet(()=>window.applyLanguage(s.lang)); else quiet(()=>LS.setItem(lsKey,nv)); }
        else quiet(()=>LS.setItem(lsKey, nv));
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
// Chiqish: avval yuborilmagan o'zgarishlar saqlanadi. Server bilan aloqa bo'lmasa — xato qaytariladi va foydalanuvchi
// kirgan holicha qoladi (aks holda saqlanmagan progress o'chib ketardi yoki cookie tirik qolib, "chiqdim" deb aldardi).
API.logout = async () => {
  const pending = timers.prog; clearTimeout(timers.prog); clearTimeout(timers.set); timers.prog = timers.set = null;
  try{ await Promise.all([pending ? pushProgress() : null, pushSettings()]); }
  catch(e){ if(e && e.status===401) return; if(pending) schedule('prog'); throw e; }
  try{ await req('POST', '/api/auth/logout'); }
  catch(e){ if(!(e && e.status===401)) throw e; }
  API.user = null;
  // Umumiy kompyuterda keyingi odam oldingi foydalanuvchi progressini ko'rmasligi uchun.
  forgetLocalUser();
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
  const body = { quizId:String(quizId).slice(0,64), score, total };
  // Tarmoq uzilishi yoki server band bo'lsa — bir marta qayta urinish (natija jimgina yo'qolmasin)
  req('POST', '/api/me/quiz', body).catch(e=>{
    if(e && (e.status===0 || e.status>=500 || e.status===429)) setTimeout(()=>{ if(API.user) req('POST','/api/me/quiz',body).catch(()=>{}); }, 15000);
  });
};

/* ---------- ishga tushish ---------- */
// Eski demo-auth (localStorage'dagi zaif parol xeshlari) endi ishlatilmaydi — o'chiramiz.
try{ rawRemove.call(LS, 'st_users'); rawRemove.call(LS, 'st_session'); }catch(e){}
// Bir martalik tuzatish: oldingi versiya joylashuvni sinxronlab, serverdagi ESKI joyni qurilmadagi to'g'ri joy ustiga
// yozib qo'ygan bo'lishi mumkin. GPS bilan aniqlanmagan saqlangan joy o'chiriladi — keyingi ochilishda qayta aniqlanadi.
try{
  if(!LS.getItem('loc_fix_v1')){
    let cur=null; try{ cur=JSON.parse(LS.getItem('sky_loc')||'null'); }catch(e){}
    if(!cur || cur.src!=='gps'){ rawRemove.call(LS,'sky_loc'); rawRemove.call(LS,'loc_manual'); }
    try{ sessionStorage.removeItem('loc_auto'); }catch(e){}
    rawSet.call(LS,'loc_fix_v1','1');
  }
}catch(e){}

async function probe(){
  const r = await req('GET', '/api/auth/me');   // mehmonda {user:null}
  API.online = 'user' in r; API.user = r.user || null;
  // Sessiya yo'q, lekin qurilmada kimningdir progressi qolgan (sessiya muddati tugagan/bloklangan) — tozalanadi
  if(!API.user && LS.getItem(OWNER)) forgetLocalUser();
}
API.ready = (async ()=>{
  if(!/^https?:$/.test(location.protocol)) return;
  try{ await probe(); }
  catch(e){
    // Server vaqtincha javob bermadi — bir necha marta qayta urinamiz (👤 tugma sessiya oxirigacha yashirin qolmasin)
    if(e && e.status===0){ [5000,15000,45000].forEach(ms=>setTimeout(()=>{ if(!API.online) probe().then(()=>{ emit(); if(API.user) syncAll(); }).catch(()=>{}); }, ms)); }
  }
  emit();
  if(API.user) syncAll();
})();
})();
