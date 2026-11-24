/* Zenithra API — backend bilan aloqa: kirish, darslik progressi, test natijalari va sozlamalar sinxroni.
   Backend bo'lmasa (file:// yoki statik hosting) — API.online=false, sayt avvalgidek mehmon rejimida
   faqat localStorage bilan ishlaydi.
   Sinxron: localStorage.setItem ustidan kuzatuv — `dz_prog` va sozlama kalitlari o'zgarsa, kirgan
   foydalanuvchida serverga (debounce bilan) yuboriladi. Shu sababli mavjud kodni o'zgartirish shart emas. */

/* ---------- Xatolar monitori: brauzerdagi xatolar → POST /api/errors (admin "Xatolar" bo'limi) ----------
   window 'error' (skript xatolari va o'z saytimizdagi skript/CSS yuklanmasligi) va 'unhandledrejection'.
   Takrorlar yuborilmaydi (xabar+manba bo'yicha), sessiyada ko'pi bilan 10 ta. Shaxsiy ma'lumot olib tashlanadi:
   emaillar, URL so'rov qatorlari (?...), tokenlar; foydalanuvchidan faqat "kirganmi" (true/false).
   Bu kodning o'zi hech qachon xato otmaydi va o'zini qayta chaqirmaydi. */
(function(){
  try{
    if(!/^https?:$/.test(location.protocol) || !window.fetch) return;
    const MAX = 10, KEY = 'dz_err_sent';
    const me = document.currentScript, APPV = (me && /[?&]v=([\w.-]{1,20})/.exec(me.src) || [])[1];
    let busy = false, mem = { n:0, k:[] };
    const store = () => { try{ return JSON.parse(sessionStorage.getItem(KEY)) || mem; }catch(e){ return mem; } };
    const save = s => { mem = s; try{ sessionStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} };
    const origin = location.origin;
    // Shaxsiy ma'lumotni tozalash (server ham qayta tozalaydi)
    const clean = (s, max) => {
      s = String(s == null ? '' : s).split(origin).join('')
        .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '[email]')
        .replace(/\b(bearer\s+|(?:token|password|parol|secret|session)\s*[:=]\s*["']?)[^\s"',;&]+/gi, '$1[hidden]')
        .replace(/([^\s?#'"()]*[/.][^\s?#'"()]*)[?#][^\s'"():]*/g, '$1')
        .replace(/\b(?=[\w-]*\d)(?=[\w-]*[A-Za-z])[\w-]{24,}\b/g, '[token]');
      return s.length > max ? s.slice(0, max - 1) + '…' : s;
    };
    const ua = (() => { try{
      const u = navigator.userAgent, b = /Edg\//.test(u)?'Edge':/OPR\/|Opera/.test(u)?'Opera':/SamsungBrowser/.test(u)?'Samsung':
        /YaBrowser/.test(u)?'Yandex':/Firefox\//.test(u)?'Firefox':/Chrome\//.test(u)?'Chrome':/Safari\//.test(u)?'Safari':'Other';
      const o = /Android/.test(u)?'Android':/iPhone|iPad|iPod/.test(u)?'iOS':/Windows/.test(u)?'Windows':/Mac OS X/.test(u)?'macOS':/Linux/.test(u)?'Linux':'Other';
      const v = (new RegExp((b==='Edge'?'Edg':b==='Opera'?'OPR':b==='Samsung'?'SamsungBrowser':b==='Yandex'?'YaBrowser':b==='Safari'?'Version':b)+'/(\\d+)').exec(u) || [])[1];
      return b + (v ? ' ' + v : '') + ' · ' + o;
    }catch(e){ return ''; } })();
    function send(kind, message, source, line, col, stack){
      if(busy) return; busy = true;
      try{
        message = clean(message, 500);
        if(!message || /ResizeObserver loop/i.test(message)) return;
        if(/^(Uncaught )?Script error\.?$/i.test(message.trim()) && !source) return;
        if(/-extension:\/\//.test(String(source) + String(stack))) return;
        const v = (/[?&]v=([\w.-]{1,20})/.exec(String(source || '')) || [])[1] || APPV;
        source = source ? clean(source, 300) : '';
        const s = store(), key = (message + '|' + source).slice(0, 300);
        if(s.n >= MAX || s.k.indexOf(key) >= 0) return;
        s.n++; s.k.push(key); save(s);
        const body = { kind, message, page: location.pathname.slice(0, 200), auth: !!(window.API && window.API.user) };
        if(source) body.source = source;
        if(line >= 0) body.line = Math.min(1e7, line | 0);
        if(col >= 0) body.col = Math.min(1e7, col | 0);
        if(stack) body.stack = clean(stack, 2000);
        if(ua) body.ua = ua.slice(0, 80);
        if(v) body.v = v;
        fetch('/api/errors', { method:'POST', keepalive:true, credentials:'same-origin',
          headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) }).catch(() => {});
      }catch(e){}
      finally{ busy = false; }
    }
    window.addEventListener('error', e => {
      try{
        const t = e.target;
        // Resurs yuklanmadi (capture bosqichida keladi): faqat o'z saytimizdagi skript va CSS
        if(t && t !== window && (t.tagName === 'SCRIPT' || t.tagName === 'LINK')){
          const url = t.src || t.href || '';
          if(url.indexOf(origin + '/') === 0 && (t.tagName === 'SCRIPT' || /stylesheet/i.test(t.rel || '')))
            send('resource', 'Resource failed to load: ' + url, url);
          return;
        }
        if(t && t !== window) return;
        send('error', e.message || (e.error && e.error.message) || 'Error', e.filename, e.lineno, e.colno, e.error && e.error.stack);
      }catch(x){}
    }, true);
    window.addEventListener('unhandledrejection', e => {
      try{
        const r = e.reason;
        const msg = r instanceof Error ? (r.name && r.name !== 'Error' ? r.name + ': ' : '') + r.message
          : typeof r === 'string' ? r : (() => { try{ return JSON.stringify(r); }catch(x){ return String(r); } })();
        // api.js ning o'z tarmoq xatolari ({status, code}) — kutilgan holat, xato emas
        if(r && typeof r === 'object' && !(r instanceof Error) && 'status' in r && 'code' in r) return;
        send('rejection', 'Unhandled rejection: ' + msg, '', -1, -1, r && r.stack);
      }catch(x){}
    });
  }catch(e){}
})();

(function(){
// Brauzer xotirasi bloklangan bo'lsa (cookie/sayt ma'lumotlari taqiqlangan) window.localStorage xato otadi —
// vaqtinchalik (sahifa yopilguncha) xotira ishlatiladi, sayt va kirish ishlayveradi.
const MEM = (()=>{ const m = new Map(); return { getItem:k=>m.has(k)?m.get(k):null, setItem:(k,v)=>{ m.set(k,String(v)); }, removeItem:k=>{ m.delete(k); } }; })();
const LS = (()=>{ try{ const s = window.localStorage; s.getItem('dz_prog'); return s; }catch(e){ return MEM; } })();
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
    const err = { status:r.status, code:(data&&data.error)||'SERVER_ERROR', details:data&&data.details };
    // Sessiya kutilmaganda tugadi (muddati, bloklash, boshqa qurilmada parol almashtirildi) — chiqish kabi
    if(r.status===401 && API.user && !/\/auth\/(login|register|reset|password|verify)$/.test(url)){ const uid=String(API.user.id); API.user=null; forgetLocalUser(uid); emit(); }
    throw err;
  }
  return data;
}

/* ---------- localStorage kuzatuvi ---------- */
let applying = false;            // serverdan kelgan qiymatni yozayotganda qayta yubormaslik uchun
const rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
// Kuzatuvsiz yozish/o'chirish (vaqtinchalik xotirada — oddiy chaqiruv)
const rSet = (k, v) => { try{ LS===MEM ? MEM.setItem(k, v) : rawSet.call(LS, k, v); }catch(e){} };
const rDel = k => { try{ LS===MEM ? MEM.removeItem(k) : rawRemove.call(LS, k); }catch(e){} };
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
// Sessiya kutilmaganda tugaganda serverga yetib bormagan belgilar yo'qolmasin: ekrandan olinadi (keyingi odam ko'rmaydi),
// lekin {uid: progress} ko'rinishida saqlab qo'yiladi va AYNAN shu foydalanuvchi qayta kirganda serverga birlashtiriladi.
const STASH = 'dz_prog_stash';
function readStash(){ try{ const s = JSON.parse(LS.getItem(STASH)); return s && typeof s==='object' ? s : {}; }catch(e){ return {}; } }
function writeStash(s){ if(Object.keys(s).length) rSet(STASH, JSON.stringify(s)); else rDel(STASH); }
function forgetLocalUser(stashUid){
  clearTimeout(timers.prog); clearTimeout(timers.set); timers.prog = timers.set = null; pendingSettings = {};
  if(stashUid){ const p = localProgress(); if(Object.keys(p).length){ const s = readStash(); s[stashUid] = p; writeStash(s); } }
  applyProgress({}); rDel(OWNER);
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
  // Avvalgi sessiya tugaganda saqlab qo'yilgan shu foydalanuvchi belgilari — serverga birlashtiriladi
  try{
    const s = readStash();
    if(s[uid]){ await req('PUT', '/api/me/progress', { progress:s[uid], mode:'merge' }); const s2 = readStash(); delete s2[uid]; writeStash(s2); }
  }catch(e){}
  try{
    if(owner && owner!==uid){
      // Qurilmada BOSHQA foydalanuvchining qoldiq progressi — birlashtirilmaydi, serverdagisi olinadi.
      const r = await req('GET', '/api/me/progress'); applyProgress(r.progress);
    } else {
      // Mehmon progressi yoki shu foydalanuvchiniki — serverdagisi bilan birlashtiriladi (yo'qolmaydi).
      await pushProgress('merge');
    }
    rSet(OWNER, uid);
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
// Pochta kodi: avval kod yuboriladi ({challenge, email, resendIn}), so'ng API.verify(challenge, kod):
//   kirish — sessiya ochiladi ({user}); ro'yxatdan o'tish / parolni tiklash — {setup, purpose} qaytadi,
//   keyin API.setPassword(setup, parol, ism?) parolni o'rnatadi va sessiyani ochadi.
const curLang = () => { const l = LS.getItem('solar_lang'); return VALID.lang(l) ? l : 'uz'; };
const signedIn = (r) => { API.user = r.user; emit(); syncAll(); return r; };
API.register = (email) => req('POST', '/api/auth/register', { email, lang:curLang() });
// Kirish: email + parol → darhol sessiya ({user}); pochta kodi so'ralmaydi
API.login = async (email, password) => signedIn(await req('POST', '/api/auth/login', { email, password }));
API.reset = (email) => req('POST', '/api/auth/reset', { email, lang:curLang() });
API.verify = async (challenge, code) => {
  const r = await req('POST', '/api/auth/verify', { challenge, code });
  return r.user ? signedIn(r) : r;
};
API.setPassword = async (setup, password, name) =>
  signedIn(await req('POST', '/api/auth/password', name ? { setup, password, name } : { setup, password }));
API.resend = (challenge) => req('POST', '/api/auth/resend', { challenge });
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
// answers (ixtiyoriy) — savollar bo'yicha javoblar statistikasi (content.js tozalab beradi).
API.quiz = (quizId, score, total, answers) => {
  if(!API.user || !(total>0)) return;
  const body = { quizId:String(quizId).slice(0,64), score, total };
  if(Array.isArray(answers) && answers.length) body.answers = answers;
  // Tarmoq uzilishi yoki server band bo'lsa — bir marta qayta urinish (natija jimgina yo'qolmasin)
  req('POST', '/api/me/quiz', body).catch(e=>{
    if(e && (e.status===0 || e.status>=500 || e.status===429)) setTimeout(()=>{ if(API.user) req('POST','/api/me/quiz',body).catch(()=>{}); }, 15000);
  });
};

/* ---------- ishga tushish ---------- */
// Eski demo-auth (localStorage'dagi zaif parol xeshlari) endi ishlatilmaydi — o'chiramiz.
try{ rDel('st_users'); rDel('st_session'); }catch(e){}
// Bir martalik tuzatish: oldingi versiya joylashuvni sinxronlab, serverdagi ESKI joyni qurilmadagi to'g'ri joy ustiga
// yozib qo'ygan bo'lishi mumkin. GPS bilan aniqlanmagan saqlangan joy o'chiriladi — keyingi ochilishda qayta aniqlanadi.
try{
  if(!LS.getItem('loc_fix_v1')){
    let cur=null; try{ cur=JSON.parse(LS.getItem('sky_loc')||'null'); }catch(e){}
    if(!cur || cur.src!=='gps'){ rDel('sky_loc'); rDel('loc_manual'); }
    try{ sessionStorage.removeItem('loc_auto'); }catch(e){}
    rSet('loc_fix_v1','1');
  }
}catch(e){}

async function probe(){
  const r = await req('GET', '/api/auth/me');   // mehmonda {user:null}
  API.online = 'user' in r; API.user = r.user || null;
  // Sessiya yo'q, lekin qurilmada kimningdir progressi qolgan (sessiya muddati tugagan/bloklangan) — tozalanadi
  // (yuborilmay qolgan belgilar o'sha foydalanuvchi uchun saqlab qo'yiladi — qayta kirganda serverga qo'shiladi)
  const owner = LS.getItem(OWNER);
  if(!API.user && owner) forgetLocalUser(owner);
}
API.ready = (async ()=>{
  if(!/^https?:$/.test(location.protocol)) return;
  try{ await probe(); }
  catch(e){
    // Server vaqtincha javob bermadi (tarmoq yoki 5xx — baza band/ishga tushmoqda) — bir necha marta qayta urinamiz
    // (👤 tugma sessiya oxirigacha yashirin qolmasin)
    if(e && (e.status===0 || e.status>=500)){ [5000,15000,45000].forEach(ms=>setTimeout(()=>{ if(!API.online) probe().then(()=>{ emit(); if(API.user) syncAll(); }).catch(()=>{}); }, ms)); }
  }
  emit();
  if(API.user) syncAll();
})();
})();
