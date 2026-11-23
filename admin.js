/* Zenithra · Admin paneli — yadro: tillar, API, umumiy yordamchilar, foydalanuvchilar ro'yxati va test natijalari.
   Bo'limlar alohida fayllarda: admin-stats.js, admin-users.js (foydalanuvchi kartasi), admin-content.js, admin-audit.js.
   Ular window.ADM orqali ulanadi: ADM.addTX({...}) — matnlar, ADM.tabs.<nom> = yuklovchi. Ruxsat server tomonda tekshiriladi. */
(function(){
const TX = {
  admin:{uz:'Admin',ru:'Админ',en:'Admin'},
  tabStats:{uz:'Statistika',ru:'Статистика',en:'Statistics'},
  tabUsers:{uz:'Foydalanuvchilar',ru:'Пользователи',en:'Users'},
  tabQuiz:{uz:'Test natijalari',ru:'Результаты тестов',en:'Quiz results'},
  tabContent:{uz:'Kontent',ru:'Контент',en:'Content'},
  tabAudit:{uz:'Jurnal',ru:'Журнал',en:'Audit log'},
  toSite:{uz:'← Saytga',ru:'← На сайт',en:'← To site'},
  logout:{uz:'Chiqish',ru:'Выйти',en:'Log out'},
  searchUser:{uz:'Ism yoki email bo‘yicha qidirish…',ru:'Поиск по имени или email…',en:'Search by name or email…'},
  quizIdPh:{uz:'Test ID (masalan quiz:easy)',ru:'ID теста (напр. quiz:easy)',en:'Quiz ID (e.g. quiz:easy)'},
  allRoles:{uz:'Barcha rollar',ru:'Все роли',en:'All roles'}, roleUser:{uz:'Foydalanuvchi',ru:'Пользователь',en:'User'}, roleAdmin:{uz:'Admin',ru:'Админ',en:'Admin'},
  allStatus:{uz:'Barcha holatlar',ru:'Все статусы',en:'All statuses'}, active:{uz:'Faol',ru:'Активен',en:'Active'}, blocked:{uz:'Bloklangan',ru:'Заблокирован',en:'Blocked'},
  name:{uz:'Ism',ru:'Имя',en:'Name'}, role:{uz:'Rol',ru:'Роль',en:'Role'}, status:{uz:'Holat',ru:'Статус',en:'Status'},
  read:{uz:'O‘qilgan',ru:'Прочитано',en:'Read'}, tests:{uz:'Testlar',ru:'Тесты',en:'Quizzes'},
  joined:{uz:'Ro‘yxatdan o‘tgan',ru:'Регистрация',en:'Joined'}, seen:{uz:'Oxirgi faollik',ru:'Последняя активность',en:'Last seen'},
  user:{uz:'Foydalanuvchi',ru:'Пользователь',en:'User'}, result:{uz:'Natija',ru:'Результат',en:'Score'}, date:{uz:'Sana',ru:'Дата',en:'Date'},
  quiz:{uz:'Test',ru:'Тест',en:'Quiz'},
  you:{uz:'siz',ru:'вы',en:'you'},
  block:{uz:'Bloklash',ru:'Заблокировать',en:'Block'}, unblock:{uz:'Blokdan chiqarish',ru:'Разблокировать',en:'Unblock'},
  del:{uz:'O‘chirish',ru:'Удалить',en:'Delete'}, results:{uz:'Natijalar',ru:'Результаты',en:'Results'}, details:{uz:'Batafsil',ru:'Подробнее',en:'Details'},
  csv:{uz:'⬇ CSV eksport',ru:'⬇ Экспорт CSV',en:'⬇ Export CSV'},
  shown:{uz:'ta',ru:'шт.',en:'total'},
  prev:{uz:'← Oldingi',ru:'← Назад',en:'← Prev'}, next:{uz:'Keyingi →',ru:'Далее →',en:'Next →'}, page:{uz:'sahifa',ru:'стр.',en:'page'},
  empty:{uz:'Ma’lumot yo‘q',ru:'Нет данных',en:'No data'},
  loading:{uz:'Yuklanmoqda…',ru:'Загрузка…',en:'Loading…'},
  loadErr:{uz:'Yuklab bo‘lmadi',ru:'Не удалось загрузить',en:'Could not load'}, retry:{uz:'Qayta urinish',ru:'Повторить',en:'Retry'},
  cancel:{uz:'Bekor qilish',ru:'Отмена',en:'Cancel'}, ok:{uz:'Tasdiqlash',ru:'Подтвердить',en:'Confirm'}, save:{uz:'Saqlash',ru:'Сохранить',en:'Save'},
  confirmDel:{uz:'{n} ({e}) va uning barcha ma’lumotlari butunlay o‘chirilsinmi?',ru:'Удалить {n} ({e}) и все его данные навсегда?',en:'Permanently delete {n} ({e}) and all their data?'},
  confirmBlock:{uz:'{n} bloklansinmi? U tizimdan chiqariladi.',ru:'Заблокировать {n}? Пользователь будет разлогинен.',en:'Block {n}? They will be signed out.'},
  confirmUnblock:{uz:'{n} blokdan chiqarilsinmi?',ru:'Разблокировать {n}?',en:'Unblock {n}?'},
  confirmRole:{uz:'{n} uchun rol «{r}» qilinsinmi?',ru:'Изменить роль {n} на «{r}»?',en:'Change {n}’s role to “{r}”?'},
  saved:{uz:'Saqlandi',ru:'Сохранено',en:'Saved'}, deleted:{uz:'O‘chirildi',ru:'Удалено',en:'Deleted'},
  err:{uz:'Xatolik: ',ru:'Ошибка: ',en:'Error: '},
  qMain:{uz:'Kosmik test',ru:'Космический тест',en:'Space quiz'}, qDz:{uz:'Darslik testi',ru:'Тест учебника',en:'Textbook quiz'}, qTopic:{uz:'Mavzu testi',ru:'Тест темы',en:'Topic quiz'},
  lv:{easy:{uz:'oson',ru:'лёгкий',en:'easy'},medium:{uz:'o‘rta',ru:'средний',en:'medium'},hard:{uz:'qiyin',ru:'сложный',en:'hard'}},
};
const LANGS=['uz','ru','en'];
let LANG = (()=>{ try{ const l=localStorage.getItem('solar_lang'); return LANGS.includes(l)?l:'uz'; }catch(e){ return 'uz'; } })();
const T = o => (o && (o[LANG] ?? o.uz)) ?? '';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
const LOCALE = { uz:'uz-UZ', ru:'ru-RU', en:'en-GB' };
const dt = v => v ? new Date(v).toLocaleString(LOCALE[LANG], { dateStyle:'short', timeStyle:'short' }) : '—';
const num = v => Number(v||0).toLocaleString(LOCALE[LANG]);
const pctCls = p => p>=80?'hi':p>=50?'mid':'lo';
const pctPill = p => p==null ? '—' : `<span class="pct ${pctCls(p)}">${esc(p)}%</span>`;

let ME = null, TOPICS = {};

async function api(method, url, body){
  let r;
  try{ r = await fetch(url, { method, credentials:'same-origin',
    headers: body!==undefined ? {'Content-Type':'application/json'} : {}, body: body!==undefined ? JSON.stringify(body) : undefined }); }
  catch(e){ throw new Error('NETWORK'); }
  let data=null; try{ data=await r.json(); }catch(e){}
  // Sessiya tugagan yoki admin emas — /admin o'zi admin kirish sahifasini ko'rsatadi
  if(r.status===401 || r.status===403){ location.href='/admin'; throw new Error('auth'); }
  if(!r.ok){ const e=new Error((data&&data.error)||('HTTP '+r.status)); e.details=data&&data.details; throw e; }
  return data;
}
function toast(msg, err){ const t=$('adToast'); t.textContent=msg; t.classList.toggle('err',!!err); t.classList.add('on');
  clearTimeout(toast.tm); toast.tm=setTimeout(()=>t.classList.remove('on'), err?4200:2600); }
// Server xato kodlari → tushunarli 3 tilli matn (xom "SELF_ACTION" o'rniga)
const ERR = {
  SELF_ACTION:{uz:'O‘zingizga nisbatan bu amalni bajarib bo‘lmaydi',ru:'Это действие нельзя применить к себе',en:'You cannot do this to your own account'},
  LAST_ADMIN:{uz:'Tizimda kamida bitta faol admin qolishi kerak',ru:'В системе должен остаться хотя бы один активный админ',en:'At least one active admin must remain'},
  NOT_FOUND:{uz:'Topilmadi (ehtimol, allaqachon o‘chirilgan)',ru:'Не найдено (возможно, уже удалено)',en:'Not found (maybe already deleted)'},
  RATE_LIMIT:{uz:'Juda ko‘p so‘rov — biroz kuting',ru:'Слишком много запросов — подождите',en:'Too many requests — please wait'},
  NETWORK:{uz:'Server bilan aloqa yo‘q',ru:'Нет связи с сервером',en:'Cannot reach the server'},
  EMAIL_EXISTS:{uz:'Bu email boshqa hisobda band',ru:'Этот email уже занят',en:'This email is already in use'},
  CONFLICT:{uz:'Bu qiymat allaqachon band',ru:'Это значение уже занято',en:'This value is already taken'},
  VALIDATION:{uz:'Ma’lumotlar noto‘g‘ri to‘ldirilgan',ru:'Данные заполнены неверно',en:'Some fields are invalid'},
  BUSY:{uz:'Server band — qayta urinib ko‘ring',ru:'Сервер занят — повторите',en:'Server is busy — try again'},
};
const errText = e => ERR[e.message] ? T(ERR[e.message]) : T(TX.err)+e.message;
const fail = e => { if(e && e.message==='auth') return; toast(errText(e), true); };

// Test ID → o'qiladigan nom: quiz:easy, quiz:dz:1-40, topic:t05
function quizName(id){
  let m;
  if((m=/^quiz:dz:(\d+)-(\d+)$/.exec(id))) return `${T(TX.qDz)} · ${m[1]}–${m[2]}`;
  if((m=/^quiz:(\w+)$/.exec(id))) return `${T(TX.qMain)} · ${TX.lv[m[1]]?T(TX.lv[m[1]]):m[1]}`;
  if((m=/^topic:(.+)$/.exec(id))) return `${T(TX.qTopic)} · ${TOPICS[m[1]]?T(TOPICS[m[1]]):m[1]}`;
  return id;
}
const topicName = (id, title) => title ? T(title) : (TOPICS[id] ? T(TOPICS[id]) : id);
// Savol joyi: "Kosmik test · oson" yoki "7. <mavzu nomi>"
function levelName(scope, level){
  if(scope==='quiz') return `${T(TX.qMain)} · ${TX.lv[level]?T(TX.lv[level]):level}`;
  const n = /^t(\d+)$/.exec(level);
  return (n ? +n[1]+'. ' : '') + topicName(level);
}
const emptyRow = (text, cls) => `<tr><td class="ad-empty ${cls||''}">${esc(text)}</td></tr>`;
// Yuklash xatosi holati: matn + "Qayta urinish" tugmasi (onclick keyin biriktiriladi)
function errorBox(el, e, retry){
  if(e && e.message==='auth') return;
  el.innerHTML = `<div class="ad-empty err">${esc(T(TX.loadErr))}: ${esc(errText(e))} <button class="ad-btn ghost sm">${esc(T(TX.retry))}</button></div>`;
  el.querySelector('button').onclick = retry;
}

// Jadval ichida xato qatori
function errorRow(table, e, retry){
  if(e && e.message==='auth') return;
  table.innerHTML = '<tr><td></td></tr>';
  errorBox(table.querySelector('td'), e, retry);
}

/* ---------------- tasdiqlash oynasi ---------------- */
// ask({text, note, ok, danger}) → Promise<boolean>. <dialog> bo'lmasa — oddiy confirm()
function ask({ text, note, ok, danger }){
  const d = $('adAsk');
  if(!d || typeof d.showModal !== 'function') return Promise.resolve(confirm(text + (note ? '\n\n'+note : '')));
  d.querySelector('.ad-ask-msg').textContent = text;
  const n = d.querySelector('.ad-ask-note'); n.hidden = !note; n.textContent = note || '';
  const b = d.querySelector('.ad-ask-ok'); b.textContent = ok || T(TX.ok); b.classList.toggle('danger-solid', !!danger);
  d.returnValue = '';
  d.showModal();
  return new Promise(res => d.addEventListener('close', () => res(d.returnValue==='yes'), { once:true }));
}

/* ---------------- til ---------------- */
const langCbs = [];
function applyLang(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = T(TX[el.dataset.t]); });
  document.querySelectorAll('[data-tp]').forEach(el => { el.placeholder = T(TX[el.dataset.tp]); });
  document.querySelectorAll('.ad-langs button').forEach(b => b.classList.toggle('on', b.dataset.lang===LANG));
  document.title = 'Zenithra · ' + T(TX.admin);
  langCbs.forEach(f => { try{ f(); }catch(e){ console.error(e); } });
}
document.querySelectorAll('.ad-langs button').forEach(b => b.onclick = () => {
  LANG = b.dataset.lang; try{ localStorage.setItem('solar_lang', LANG); }catch(e){}
  // Serverga ham — aks holda asosiy saytga qaytganda sinxron eski tilni qaytarib qo'yardi
  api('PUT', '/api/me/settings', { lang:LANG }).catch(()=>{});
  applyLang(); load(cur);
});

/* ---------------- tablar ---------------- */
const TABS = ['stats','users','quiz','content','audit'];
const tabs = {};   // nom → yuklovchi (Promise qaytaradi)
let cur = 'stats';
function show(tab){
  cur = tab;
  $('adTip').hidden = true;   // grafik tooltipi boshqa tabda osilib qolmasin
  document.querySelectorAll('.ad-tab').forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.ad-page').forEach(p => p.hidden = p.id !== 'tab-'+tab);
  try{ history.replaceState(null, '', '#'+tab); }catch(e){}
  load(tab);
}
document.querySelectorAll('.ad-tab').forEach(b => b.onclick = () => show(b.dataset.tab));
// ME (joriy admin) hali yuklanmagan bo'lsa yuklamaymiz — ishga tushish oxirida show() joriy tabni o'zi yuklaydi
const load = tab => ME && tabs[tab] ? tabs[tab]().catch(fail) : Promise.resolve();

function debounce(fn, ms){ let t; return () => { clearTimeout(t); t=setTimeout(fn, ms); }; }
function pager(el, st, total, reload){
  const pages = Math.max(1, Math.ceil(total/st.pageSize));
  el.innerHTML = pages<=1 ? '' :
    `<button class="ad-btn ghost sm" ${st.page<=1?'disabled':''} data-p="-1">${esc(T(TX.prev))}</button>
     <span>${st.page} / ${pages} ${esc(T(TX.page))}</span>
     <button class="ad-btn ghost sm" ${st.page>=pages?'disabled':''} data-p="1">${esc(T(TX.next))}</button>`;
  // Yuklanayotganda tugmalar o'chiriladi — tez ikki marta bosish mavjud bo'lmagan sahifaga o'tkazib yubormaydi
  el.querySelectorAll('button').forEach(b => b.onclick = () => {
    el.querySelectorAll('button').forEach(x => x.disabled = true);
    // Xato bo'lsa sahifa raqami qaytariladi va tugmalar qayta yoqiladi (jadval eski sahifada qolgani uchun)
    const prev = st.page; st.page += +b.dataset.p;
    reload().catch(e => { st.page = prev; pager(el, st, total, reload); fail(e); });
  });
}
const download = url => { location.href = url; };

/* ---------------- foydalanuvchilar ---------------- */
const U = { page:1, pageSize:20, seq:0 };
$('uQ').oninput = debounce(() => { U.page=1; loadUsers().catch(fail); }, 300);
$('uRole').onchange = $('uBlocked').onchange = () => { U.page=1; loadUsers().catch(fail); };
function userParams(){
  const qs = new URLSearchParams();
  if($('uQ').value.trim()) qs.set('q', $('uQ').value.trim());
  if($('uRole').value) qs.set('role', $('uRole').value);
  if($('uBlocked').value) qs.set('blocked', $('uBlocked').value);
  return qs;
}
$('uCsv').onclick = () => download('/api/admin/users.csv?' + userParams());

// Foydalanuvchiga amal (ro'yxat va karta umumiy ishlatadi). true — bajarildi.
async function userAction(u, act, value){
  try{
    if(act==='role'){
      const rl = value==='admin' ? T(TX.roleAdmin) : T(TX.roleUser);
      if(!await ask({ text: fmt(T(TX.confirmRole), { n:u.name||u.email, r:rl }) })) return false;
      await api('PATCH', '/api/admin/users/'+u.id, { role:value });
    } else if(act==='block'){
      const next = !u.blocked;
      if(!await ask({ text: fmt(T(next?TX.confirmBlock:TX.confirmUnblock), { n:u.name||u.email }), danger:next, ok:T(next?TX.block:TX.unblock) })) return false;
      await api('PATCH', '/api/admin/users/'+u.id, { blocked:next });
    } else if(act==='del'){
      if(!await ask({ text: fmt(T(TX.confirmDel), { n:u.name||'—', e:u.email }), danger:true, ok:T(TX.del) })) return false;
      await api('DELETE', '/api/admin/users/'+u.id);
      toast(T(TX.deleted)); return true;
    } else return false;
    toast(T(TX.saved)); return true;
  }catch(e){ fail(e); return false; }
}

async function loadUsers(){
  if(!ME) return;
  const seq = ++U.seq;   // eskiroq (sekinroq) javob yangi filtr natijasini bosib ketmasin
  const qs = userParams(); qs.set('page', U.page); qs.set('pageSize', U.pageSize);
  const tb = $('uTable');
  if(!tb.rows.length) tb.innerHTML = emptyRow(T(TX.loading));
  let r;
  try{ r = await api('GET', '/api/admin/users?'+qs); }
  catch(e){ if(seq===U.seq && !tb.querySelector('tr[data-id]')){ tb.innerHTML=''; errorBox($('uPager'), e, () => loadUsers().catch(fail)); } throw e; }
  if(seq !== U.seq) return;
  $('uPager').innerHTML = '';
  $('uCount').textContent = `${num(r.total)} ${T(TX.shown)}`;
  // Oxirgi sahifadagi oxirgi qator o'chirilsa/bloklansa — bo'sh sahifada qotib qolmasdan oxirgi mavjud sahifaga o'tamiz
  if(!r.items.length && r.total && U.page>1){ U.page=Math.max(1, Math.ceil(r.total/U.pageSize)); return loadUsers(); }
  if(!r.items.length){ tb.innerHTML = emptyRow(T(TX.empty)); pager($('uPager'), U, 0, loadUsers); return; }
  tb.innerHTML = `<tr><th>${esc(T(TX.name))}</th><th>${esc(T(TX.role))}</th><th>${esc(T(TX.status))}</th>
    <th class="num">${esc(T(TX.read))}</th><th class="num">${esc(T(TX.tests))}</th><th>${esc(T(TX.joined))}</th><th>${esc(T(TX.seen))}</th><th></th></tr>` +
    r.items.map(u => {
      const me = u.id===ME.id;
      return `<tr data-id="${esc(u.id)}">
        <td><button class="ad-link" data-act="open">${esc(u.name||'—')}</button> ${me?`<span class="badge me">${esc(T(TX.you))}</span>`:''}<div class="em">${esc(u.email)}</div></td>
        <td><select data-act="role" ${me?'disabled':''} aria-label="${esc(T(TX.role))}">
          <option value="user" ${u.role==='user'?'selected':''}>${esc(T(TX.roleUser))}</option>
          <option value="admin" ${u.role==='admin'?'selected':''}>${esc(T(TX.roleAdmin))}</option></select></td>
        <td>${u.blocked?`<span class="badge bad">${esc(T(TX.blocked))}</span>`:`<span class="badge ok">${esc(T(TX.active))}</span>`}</td>
        <td class="num">${num(u.readCount)}</td><td class="num">${num(u.quizCount)}</td>
        <td class="dim">${esc(dt(u.createdAt))}</td><td class="dim">${esc(dt(u.lastSeenAt))}</td>
        <td><div class="acts">
          <button class="ad-btn ghost sm" data-act="open">${esc(T(TX.details))}</button>
          <button class="ad-btn ghost sm" data-act="results">${esc(T(TX.results))}</button>
          <button class="ad-btn ghost sm" data-act="block" ${me?'disabled':''}>${esc(T(u.blocked?TX.unblock:TX.block))}</button>
          <button class="ad-btn ghost sm danger" data-act="del" ${me?'disabled':''}>${esc(T(TX.del))}</button>
        </div></td></tr>`;
    }).join('');
  const byId = Object.fromEntries(r.items.map(u => [u.id, u]));
  tb.querySelectorAll('[data-act]').forEach(el => {
    const u = byId[el.closest('tr').dataset.id];
    const act = el.dataset.act;
    if(act==='role') el.onchange = async () => {
      const ok = await userAction(u, 'role', el.value);
      if(!ok) el.value = u.role;
      loadUsers().catch(fail);
    };
    else el.onclick = async () => {
      if(act==='open'){ if(window.ADM.openUser) window.ADM.openUser(u.id); return; }
      if(act==='results'){ showResultsFor(u); return; }
      if(await userAction(u, act)) loadUsers().catch(fail);
    };
  });
  pager($('uPager'), U, r.total, loadUsers);
}
function showResultsFor(u){ Q.userId=u.id; Q.userLabel=`${u.name||'—'} · ${u.email}`; Q.page=1; show('quiz'); }

/* ---------------- test natijalari ---------------- */
const Q = { page:1, pageSize:25, userId:null, userLabel:'', seq:0 };
$('qQ').oninput = $('qQuiz').oninput = debounce(() => { Q.page=1; loadQuiz().catch(fail); }, 300);
function quizParams(){
  const qs = new URLSearchParams();
  if(Q.userId) qs.set('userId', Q.userId);
  if($('qQ').value.trim()) qs.set('q', $('qQ').value.trim());
  if($('qQuiz').value.trim()) qs.set('quizId', $('qQuiz').value.trim());
  return qs;
}
$('qCsv').onclick = () => download('/api/admin/quiz.csv?' + quizParams());

async function loadQuiz(){
  if(!ME) return;
  const seq = ++Q.seq;
  const chip = $('qUserChip');
  chip.hidden = !Q.userId;
  if(Q.userId){
    chip.innerHTML = `${esc(Q.userLabel)} <button aria-label="✕">✕</button>`;
    chip.querySelector('button').onclick = () => { Q.userId=null; Q.page=1; loadQuiz().catch(fail); };
  }
  const qs = quizParams(); qs.set('page', Q.page); qs.set('pageSize', Q.pageSize);
  const r = await api('GET', '/api/admin/quiz?'+qs);
  if(seq !== Q.seq) return;
  $('qCount').textContent = `${num(r.total)} ${T(TX.shown)}`;
  $('qTable').innerHTML = r.items.length
    ? `<tr><th>${esc(T(TX.user))}</th><th>${esc(T(TX.quiz))}</th><th class="num">${esc(T(TX.result))}</th><th class="num">%</th><th>${esc(T(TX.date))}</th></tr>` +
      r.items.map(x => { const p = Math.round(x.score/x.total*100);
        return `<tr><td><div>${esc(x.user.name)}</div><div class="em">${esc(x.user.email)}</div></td>
          <td>${esc(quizName(x.quizId))}<div class="em">${esc(x.quizId)}</div></td>
          <td class="num">${esc(x.score)} / ${esc(x.total)}</td><td class="num">${pctPill(p)}</td>
          <td class="dim">${esc(dt(x.at))}</td></tr>`; }).join('')
    : emptyRow(T(TX.empty));
  pager($('qPager'), Q, r.total, loadQuiz);
}
tabs.users = loadUsers;
tabs.quiz = loadQuiz;

/* ---------------- umumiy interfeys (boshqa fayllar uchun) ---------------- */
window.ADM = {
  TX, T, $, esc, fmt, dt, num, pctCls, pctPill, api, toast, fail, errText, errorBox, errorRow, emptyRow, ask, debounce, pager, download,
  quizName, topicName, levelName, userAction, showResultsFor, show, tabs, LANGS,
  addTX: o => Object.assign(TX, o),
  onLang: f => langCbs.push(f),
  reloadUsers: () => cur==='users' ? loadUsers().catch(fail) : Promise.resolve(),
  get LANG(){ return LANG; }, get LOCALE(){ return LOCALE[LANG]; }, get ME(){ return ME; }, get TOPICS(){ return TOPICS; }, get cur(){ return cur; },
};

/* ---------------- ishga tushish ---------------- */
$('adLogout').onclick = async () => { try{ await api('POST', '/api/auth/logout'); }catch(e){} location.href='/'; };

// Bo'lim fayllari (defer) shu fayldan keyin bajariladi — ishga tushish DOMContentLoaded da (hammasi ulangach)
async function boot(){
  applyLang();
  try{
    ME = (await api('GET', '/api/auth/me')).user;
    if(!ME || ME.role!=='admin'){ location.href='/admin'; return; }
    $('adMe').textContent = ME.name + ' · ' + ME.email;
    TOPICS = (await api('GET', '/api/admin/topics')).topics;
  }catch(e){ return fail(e); }
  const h = location.hash.slice(1);
  show(TABS.includes(h) ? h : 'stats');
}
if(document.readyState==='complete') boot(); else document.addEventListener('DOMContentLoaded', boot, { once:true });
})();
