/* Zenithra · Admin paneliga kirish (admin-login.html). /admin manzili admin bo'lmagan yoki kirmagan foydalanuvchiga shu
   sahifani beradi. Oqim: email + parol → pochtaga 6 xonali kod → /api/auth/verify → /admin qayta ochiladi (endi admin.html).
   Server admin bo'lmagan hisobga ham "parol noto'g'ri" deb javob beradi va xat yubormaydi. */
(function(){
const TX = {
  admin:{uz:'Admin',ru:'Админ',en:'Admin'},
  title:{uz:'Admin paneliga kirish',ru:'Вход в админ-панель',en:'Admin panel sign-in'},
  sub:{uz:'Administrator email va parolini kiriting — pochtangizga tasdiqlash kodi yuboriladi.',
    ru:'Введите email и пароль администратора — на почту придёт код подтверждения.',
    en:'Enter the administrator email and password — a verification code will be emailed to you.'},
  email:{uz:'Email',ru:'Email',en:'Email'},
  pass:{uz:'Parol',ru:'Пароль',en:'Password'},
  showPass:{uz:'Parolni ko‘rsatish',ru:'Показать пароль',en:'Show password'},
  hidePass:{uz:'Parolni yashirish',ru:'Скрыть пароль',en:'Hide password'},
  sendCode:{uz:'Davom etish — kod yuborish',ru:'Продолжить — отправить код',en:'Continue — send code'},
  forgot:{uz:'Parolni unutdim',ru:'Забыли пароль?',en:'Forgot password?'},
  sent:{uz:'Tasdiqlash kodi yuborildi:',ru:'Код подтверждения отправлен на',en:'We sent a verification code to'},
  codePh:{uz:'6 xonali kod',ru:'6-значный код',en:'6-digit code'},
  verify:{uz:'Tasdiqlash va kirish',ru:'Подтвердить и войти',en:'Verify and sign in'},
  back:{uz:'← Orqaga',ru:'← Назад',en:'← Back'},
  resend:{uz:'Kodni qayta yuborish',ru:'Отправить код ещё раз',en:'Resend code'},
  resendIn:{uz:'Qayta yuborish: {s} s',ru:'Повторно через {s} с',en:'Resend in {s} s'},
  resent:{uz:'Yangi kod yuborildi',ru:'Новый код отправлен',en:'A new code has been sent'},
  hint:{uz:'Xat kelmasa, «Spam» papkasini tekshiring. Kod 10 daqiqa amal qiladi, admin sessiyasi — 12 soat.',
    ru:'Если письма нет, проверьте «Спам». Код действует 10 минут, сессия администратора — 12 часов.',
    en:'No email? Check your Spam folder. The code is valid for 10 minutes; an admin session lasts 12 hours.'},
  toSite:{uz:'← Saytga qaytish',ru:'← Вернуться на сайт',en:'← Back to the site'},
  signedAs:{uz:'Siz {e} sifatida kirgansiz — bu hisobda admin huquqi yo‘q. Admin hisobi bilan kiring.',
    ru:'Вы вошли как {e} — у этой учётной записи нет прав администратора. Войдите под админом.',
    en:'You are signed in as {e} — this account has no admin rights. Sign in with an admin account.'},
  ok:{uz:'Kirildi — panel ochilmoqda…',ru:'Вход выполнен — открываем панель…',en:'Signed in — opening the panel…'},
};
// Server xato kodlari → 3 tilli matn
const ERR = {
  FILL:{uz:'Email va parolni kiriting',ru:'Введите email и пароль',en:'Enter your email and password'},
  EMAIL:{uz:'Email noto‘g‘ri ko‘rinishda',ru:'Email выглядит неверно',en:'That email does not look right'},
  CODE_FILL:{uz:'6 xonali kodni kiriting',ru:'Введите 6-значный код',en:'Enter the 6-digit code'},
  INVALID_CREDENTIALS:{uz:'Email yoki parol noto‘g‘ri (yoki bu hisob admin emas)',ru:'Неверный email или пароль (или это не учётная запись администратора)',en:'Wrong email or password (or this is not an admin account)'},
  RATE_LIMIT:{uz:'Urinishlar juda ko‘p — birozdan so‘ng qayta urinib ko‘ring',ru:'Слишком много попыток — попробуйте позже',en:'Too many attempts — try again later'},
  RATE_WAIT:{uz:'Kod yaqinda yuborilgan — {s} soniyadan so‘ng qayta urinib ko‘ring',ru:'Код уже отправлен — попробуйте через {s} с',en:'A code was just sent — try again in {s} s'},
  WRONG_CODE:{uz:'Kod noto‘g‘ri — yana {n} ta urinish qoldi',ru:'Неверный код — осталось попыток: {n}',en:'Wrong code — {n} attempts left'},
  CODE_EXPIRED:{uz:'Kod eskirgan — qaytadan kiring',ru:'Код устарел — войдите заново',en:'The code has expired — please sign in again'},
  TOO_MANY_ATTEMPTS:{uz:'Juda ko‘p noto‘g‘ri urinish — qaytadan kiring',ru:'Слишком много неверных попыток — войдите заново',en:'Too many wrong attempts — please sign in again'},
  FORBIDDEN:{uz:'Bu hisobda admin huquqi yo‘q',ru:'У этой учётной записи нет прав администратора',en:'This account has no admin rights'},
  BLOCKED:{uz:'Hisob bloklangan',ru:'Учётная запись заблокирована',en:'This account is blocked'},
  MAIL_FAILED:{uz:'Xat yuborib bo‘lmadi — birozdan so‘ng urinib ko‘ring',ru:'Не удалось отправить письмо — попробуйте чуть позже',en:'Could not send the email — try again shortly'},
  MAIL_NOT_CONFIGURED:{uz:'Pochta xizmati sozlanmagan (SMTP) — server sozlamalarini tekshiring',ru:'Почта не настроена (SMTP) — проверьте настройки сервера',en:'Email (SMTP) is not configured — check the server settings'},
  BAD_ORIGIN:{uz:'So‘rov rad etildi — sahifani yangilang',ru:'Запрос отклонён — обновите страницу',en:'Request rejected — reload the page'},
  NETWORK:{uz:'Server bilan aloqa yo‘q',ru:'Нет связи с сервером',en:'Cannot reach the server'},
  SERVER_ERROR:{uz:'Serverda xatolik — birozdan so‘ng urinib ko‘ring',ru:'Ошибка сервера — попробуйте позже',en:'Server error — try again shortly'},
};
const LANGS = ['uz','ru','en'];
let LANG = (()=>{ try{ const l=localStorage.getItem('solar_lang'); return LANGS.includes(l)?l:'uz'; }catch(e){ return 'uz'; } })();
const T = o => (o && (o[LANG] ?? o.uz)) ?? '';
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
const $ = id => document.getElementById(id);

async function api(method, url, body){
  let r;
  try{ r = await fetch(url, { method, credentials:'same-origin',
    headers: body!==undefined ? {'Content-Type':'application/json'} : {}, body: body!==undefined ? JSON.stringify(body) : undefined }); }
  catch(e){ throw { code:'NETWORK' }; }
  let data = null; try{ data = await r.json(); }catch(e){}
  if(!r.ok || !data) throw { status:r.status, code:(data&&data.error)||'SERVER_ERROR', details:data&&data.details };
  return data;
}

/* ---------- holat ---------- */
let ch = null, mailTo = '', resendAt = 0, resendTm = null, busy = false, me = null;
const errs = { alErr:null, alCodeErr:null };   // til almashganda xabar qayta tarjima qilinadi
function errText(e){
  if(!e) return '';
  if(e.text) return T(e.text);
  const d = e.details || {};
  if(e.code==='WRONG_CODE') return fmt(T(ERR.WRONG_CODE), { n: d.left ?? '?' });
  if(e.code==='RATE_LIMIT' && d.wait) return fmt(T(ERR.RATE_WAIT), { s: d.wait });
  return T(ERR[e.code]) || T(ERR.SERVER_ERROR);
}
function setErr(id, e, ok){ errs[id] = e || null; const el = $(id); el.textContent = errText(e); el.classList.toggle('ok', !!ok); }

/* ---------- til ---------- */
function applyLang(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = T(TX[el.dataset.t]); });
  document.querySelectorAll('.ad-langs button').forEach(b => b.classList.toggle('on', b.dataset.lang===LANG));
  document.title = 'Zenithra · ' + T(TX.title);
  $('alCode').setAttribute('aria-label', T(TX.codePh));
  const eye = $('alEye'); eye.title = T(eye.classList.contains('on') ? TX.hidePass : TX.showPass); eye.setAttribute('aria-label', eye.title);
  const s = $('alSent'); s.textContent = T(TX.sent) + ' ';
  const b = document.createElement('b'); b.textContent = mailTo; s.append(document.createElement('br'), b);
  const note = $('alNote'); note.hidden = !me; if(me) note.textContent = fmt(T(TX.signedAs), { e: me.email });
  for(const id in errs) $(id).textContent = errText(errs[id]);
  resendLabel();
}
document.querySelectorAll('.ad-langs button').forEach(b => b.onclick = () => {
  LANG = b.dataset.lang; try{ localStorage.setItem('solar_lang', LANG); }catch(e){}
  applyLang();
});

/* ---------- 1-bosqich: email + parol ---------- */
function step(n){
  $('alForm').hidden = n!==1; $('alCodeForm').hidden = n!==2;
  $('alSub').hidden = n!==1;
  setTimeout(()=>{ (n===1 ? ($('alEmail').value ? $('alPass') : $('alEmail')) : $('alCode')).focus(); }, 30);
}
function setBusy(btn, on){ busy = on; btn.disabled = on; btn.classList.toggle('busy', on); }
$('alEye').onclick = () => {
  const inp = $('alPass'), show = inp.type==='password';
  inp.type = show ? 'text' : 'password'; $('alEye').classList.toggle('on', show); applyLang(); inp.focus();
};
$('alForm').addEventListener('submit', async e => {
  e.preventDefault(); if(busy) return;
  const email = $('alEmail').value.trim().toLowerCase(), password = $('alPass').value;
  if(!email || !password) return setErr('alErr', { text:ERR.FILL });
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('alErr', { text:ERR.EMAIL });
  setErr('alErr', null); setBusy($('alSubmit'), true);
  try{
    const r = await api('POST', '/api/auth/admin/login', { email, password });
    ch = r.challenge; mailTo = r.email || ''; $('alPass').value = '';
    $('alCode').value = ''; setErr('alCodeErr', null);
    countdown(r.resendIn || 60); applyLang(); step(2);
  }catch(err){ setErr('alErr', err); }
  finally{ setBusy($('alSubmit'), false); }
});

/* ---------- 2-bosqich: kod ---------- */
function resendLabel(){
  const btn = $('alResend'), left = Math.ceil((resendAt - Date.now()) / 1000);
  if(left > 0){ btn.disabled = true; btn.textContent = fmt(T(TX.resendIn), { s:left }); }
  else { btn.disabled = false; btn.textContent = T(TX.resend); clearInterval(resendTm); resendTm = null; }
}
function countdown(sec){ resendAt = Date.now() + sec*1000; clearInterval(resendTm); resendTm = setInterval(resendLabel, 1000); resendLabel(); }
function backToStart(err){ ch = null; clearInterval(resendTm); resendTm = null; setErr('alCodeErr', null); setErr('alErr', err || null); step(1); }

$('alCode').addEventListener('input', () => {
  const inp = $('alCode'), d = inp.value.replace(/\D/g, '').slice(0, 6);
  if(inp.value !== d) inp.value = d;
  if(errs.alCodeErr) setErr('alCodeErr', null);
  if(d.length===6) $('alCodeForm').requestSubmit();
});
$('alCodeForm').addEventListener('submit', async e => {
  e.preventDefault(); if(busy || !ch) return;
  const code = $('alCode').value.trim();
  if(!/^\d{6}$/.test(code)) return setErr('alCodeErr', { text:ERR.CODE_FILL });
  setBusy($('alVerify'), true);
  try{
    await api('POST', '/api/auth/verify', { challenge:ch, code });
    setErr('alCodeErr', { text:TX.ok }, true);
    location.replace('/admin');   // endi server admin.html ni beradi
  }catch(err){
    setBusy($('alVerify'), false);
    if(err.code==='WRONG_CODE'){ setErr('alCodeErr', err); $('alCode').value = ''; $('alCode').focus(); }
    else if(['CODE_EXPIRED','TOO_MANY_ATTEMPTS','FORBIDDEN','BLOCKED'].includes(err.code)){ setErr('alCodeErr', err); setTimeout(() => { if(ch) backToStart(err); }, 1800); }
    else setErr('alCodeErr', err);
  }
});
$('alBack').onclick = () => backToStart();
$('alResend').onclick = async () => {
  if(!ch) return; const btn = $('alResend'); btn.disabled = true;
  try{ const r = await api('POST', '/api/auth/resend', { challenge:ch }); countdown(r.resendIn || 60); setErr('alCodeErr', { text:TX.resent }, true); }
  catch(err){
    if(err.code==='RESEND_WAIT') countdown((err.details && err.details.wait) || 30);
    else { setErr('alCodeErr', err); resendLabel(); if(err.code==='CODE_EXPIRED') setTimeout(() => { if(ch) backToStart(err); }, 1800); }
  }
};

/* ---------- ishga tushish ---------- */
applyLang(); step(1);
// Saytga oddiy hisob bilan kirgan bo'lsa — kim sifatida kirgani ko'rsatiladi (server bu sahifani admin bo'lmagani uchun berdi)
api('GET', '/api/auth/me').then(r => { if(r.user){ me = r.user; applyLang(); } }).catch(() => {});
})();
