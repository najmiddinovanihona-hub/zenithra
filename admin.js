/* ASTRO · Admin paneli — statistika, foydalanuvchilar, test natijalari. Ruxsat server tomonda tekshiriladi. */
(function(){
const TX = {
  admin:{uz:'Admin',ru:'Админ',en:'Admin'},
  tabStats:{uz:'Statistika',ru:'Статистика',en:'Statistics'},
  tabUsers:{uz:'Foydalanuvchilar',ru:'Пользователи',en:'Users'},
  tabQuiz:{uz:'Test natijalari',ru:'Результаты тестов',en:'Quiz results'},
  toSite:{uz:'← Saytga',ru:'← На сайт',en:'← To site'},
  logout:{uz:'Chiqish',ru:'Выйти',en:'Log out'},
  kUsers:{uz:'Foydalanuvchilar',ru:'Пользователи',en:'Users'},
  kActive:{uz:'Faol (7 kun)',ru:'Активные (7 дней)',en:'Active (7 days)'},
  kNew:{uz:'Yangi (7 kun)',ru:'Новые (7 дней)',en:'New (7 days)'},
  kQuiz:{uz:'Topshirilgan testlar',ru:'Пройдено тестов',en:'Quizzes taken'},
  kAvg:{uz:'O‘rtacha natija',ru:'Средний результат',en:'Average score'},
  kBlocked:{uz:'Bloklangan',ru:'Заблокировано',en:'Blocked'},
  active30:{uz:'30 kunda faol',ru:'активны за 30 дней',en:'active in 30 days'},
  admins:{uz:'admin',ru:'админ',en:'admins'},
  regs14:{uz:'Ro‘yxatdan o‘tishlar — oxirgi 14 kun',ru:'Регистрации — последние 14 дней',en:'Sign-ups — last 14 days'},
  topTopics:{uz:'Eng ko‘p o‘qilgan mavzular',ru:'Самые читаемые темы',en:'Most read topics'},
  topQuizzes:{uz:'Eng ko‘p topshirilgan testlar',ru:'Самые популярные тесты',en:'Most taken quizzes'},
  reads:{uz:'o‘qigan',ru:'прочитали',en:'reads'},
  quiz:{uz:'Test',ru:'Тест',en:'Quiz'}, attempts:{uz:'Urinishlar',ru:'Попытки',en:'Attempts'}, avg:{uz:'O‘rtacha',ru:'Среднее',en:'Average'},
  searchUser:{uz:'Ism yoki email bo‘yicha qidirish…',ru:'Поиск по имени или email…',en:'Search by name or email…'},
  quizIdPh:{uz:'Test ID (masalan quiz:easy)',ru:'ID теста (напр. quiz:easy)',en:'Quiz ID (e.g. quiz:easy)'},
  allRoles:{uz:'Barcha rollar',ru:'Все роли',en:'All roles'}, roleUser:{uz:'Foydalanuvchi',ru:'Пользователь',en:'User'}, roleAdmin:{uz:'Admin',ru:'Админ',en:'Admin'},
  allStatus:{uz:'Barcha holatlar',ru:'Все статусы',en:'All statuses'}, active:{uz:'Faol',ru:'Активен',en:'Active'}, blocked:{uz:'Bloklangan',ru:'Заблокирован',en:'Blocked'},
  name:{uz:'Ism',ru:'Имя',en:'Name'}, role:{uz:'Rol',ru:'Роль',en:'Role'}, status:{uz:'Holat',ru:'Статус',en:'Status'},
  read:{uz:'O‘qilgan',ru:'Прочитано',en:'Read'}, tests:{uz:'Testlar',ru:'Тесты',en:'Quizzes'},
  joined:{uz:'Ro‘yxatdan o‘tgan',ru:'Регистрация',en:'Joined'}, seen:{uz:'Oxirgi faollik',ru:'Последняя активность',en:'Last seen'},
  user:{uz:'Foydalanuvchi',ru:'Пользователь',en:'User'}, result:{uz:'Natija',ru:'Результат',en:'Score'}, date:{uz:'Sana',ru:'Дата',en:'Date'},
  you:{uz:'siz',ru:'вы',en:'you'},
  block:{uz:'Bloklash',ru:'Заблокировать',en:'Block'}, unblock:{uz:'Blokdan chiqarish',ru:'Разблокировать',en:'Unblock'},
  del:{uz:'O‘chirish',ru:'Удалить',en:'Delete'}, results:{uz:'Natijalar',ru:'Результаты',en:'Results'},
  csv:{uz:'⬇ CSV eksport',ru:'⬇ Экспорт CSV',en:'⬇ Export CSV'},
  shown:{uz:'ta',ru:'шт.',en:'total'},
  prev:{uz:'← Oldingi',ru:'← Назад',en:'← Prev'}, next:{uz:'Keyingi →',ru:'Далее →',en:'Next →'}, page:{uz:'sahifa',ru:'стр.',en:'page'},
  empty:{uz:'Ma’lumot yo‘q',ru:'Нет данных',en:'No data'},
  confirmDel:{uz:'{n} ({e}) va uning barcha ma’lumotlari butunlay o‘chirilsinmi?',ru:'Удалить {n} ({e}) и все его данные навсегда?',en:'Permanently delete {n} ({e}) and all their data?'},
  confirmBlock:{uz:'{n} bloklansinmi? U tizimdan chiqariladi.',ru:'Заблокировать {n}? Пользователь будет разлогинен.',en:'Block {n}? They will be signed out.'},
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

let ME = null, TOPICS = {};

async function api(method, url, body){
  let r;
  try{ r = await fetch(url, { method, credentials:'same-origin',
    headers: body!==undefined ? {'Content-Type':'application/json'} : {}, body: body!==undefined ? JSON.stringify(body) : undefined }); }
  catch(e){ throw new Error('NETWORK'); }
  let data=null; try{ data=await r.json(); }catch(e){}
  if(r.status===401 || r.status===403){ location.href='/#login'; throw new Error('auth'); }
  if(!r.ok) throw new Error((data&&data.error)||('HTTP '+r.status));
  return data;
}
function toast(msg, err){ const t=$('adToast'); t.textContent=msg; t.classList.toggle('err',!!err); t.classList.add('on');
  clearTimeout(toast.tm); toast.tm=setTimeout(()=>t.classList.remove('on'), 2600); }
// Server xato kodlari → tushunarli 3 tilli matn (xom "SELF_ACTION" o'rniga)
const ERR = {
  SELF_ACTION:{uz:'O‘zingizga nisbatan bu amalni bajarib bo‘lmaydi',ru:'Это действие нельзя применить к себе',en:'You cannot do this to your own account'},
  LAST_ADMIN:{uz:'Tizimda kamida bitta faol admin qolishi kerak',ru:'В системе должен остаться хотя бы один активный админ',en:'At least one active admin must remain'},
  NOT_FOUND:{uz:'Topilmadi (ehtimol, allaqachon o‘chirilgan)',ru:'Не найдено (возможно, уже удалено)',en:'Not found (maybe already deleted)'},
  RATE_LIMIT:{uz:'Juda ko‘p so‘rov — biroz kuting',ru:'Слишком много запросов — подождите',en:'Too many requests — please wait'},
  NETWORK:{uz:'Server bilan aloqa yo‘q',ru:'Нет связи с сервером',en:'Cannot reach the server'},
};
const fail = e => { if(e.message==='auth') return; toast(ERR[e.message] ? T(ERR[e.message]) : T(TX.err)+e.message, true); };

// Test ID → o'qiladigan nom: quiz:easy, quiz:dz:1-40, topic:t05
function quizName(id){
  let m;
  if((m=/^quiz:dz:(\d+)-(\d+)$/.exec(id))) return `${T(TX.qDz)} · ${m[1]}–${m[2]}`;
  if((m=/^quiz:(\w+)$/.exec(id))) return `${T(TX.qMain)} · ${TX.lv[m[1]]?T(TX.lv[m[1]]):m[1]}`;
  if((m=/^topic:(.+)$/.exec(id))) return `${T(TX.qTopic)} · ${TOPICS[m[1]]?T(TOPICS[m[1]]):m[1]}`;
  return id;
}
const topicName = (id, title) => title ? T(title) : (TOPICS[id] ? T(TOPICS[id]) : id);

/* ---------------- til ---------------- */
function applyLang(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = T(TX[el.dataset.t]); });
  document.querySelectorAll('[data-tp]').forEach(el => { el.placeholder = T(TX[el.dataset.tp]); });
  document.querySelectorAll('.ad-langs button').forEach(b => b.classList.toggle('on', b.dataset.lang===LANG));
  document.title = 'ASTRO · ' + T(TX.admin);
}
document.querySelectorAll('.ad-langs button').forEach(b => b.onclick = () => {
  LANG = b.dataset.lang; try{ localStorage.setItem('solar_lang', LANG); }catch(e){}
  // Serverga ham — aks holda asosiy saytga qaytganda sinxron eski tilni qaytarib qo'yardi
  api('PUT', '/api/me/settings', { lang:LANG }).catch(()=>{});
  applyLang(); load(cur);
});

/* ---------------- tablar ---------------- */
let cur = 'stats';
function show(tab){
  cur = tab;
  document.querySelectorAll('.ad-tab').forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.ad-page').forEach(p => p.hidden = p.id !== 'tab-'+tab);
  try{ history.replaceState(null, '', '#'+tab); }catch(e){}
  load(tab);
}
document.querySelectorAll('.ad-tab').forEach(b => b.onclick = () => show(b.dataset.tab));
const load = tab => ({ stats:loadStats, users:loadUsers, quiz:loadQuiz })[tab]().catch(fail);

/* ---------------- statistika ---------------- */
async function loadStats(){
  const s = await api('GET', '/api/admin/stats');
  const k = (v, l, sub) => `<div class="glass ad-kpi"><div class="v">${v}</div><div class="l">${esc(l)}</div>${sub?`<div class="s">${esc(sub)}</div>`:''}</div>`;
  $('kpis').innerHTML =
    k(num(s.users.total), T(TX.kUsers), `${num(s.users.admins)} ${T(TX.admins)}`) +
    k(num(s.users.active7d), T(TX.kActive), `${num(s.users.active30d)} ${T(TX.active30)}`) +
    k(num(s.users.new7d), T(TX.kNew)) +
    k(num(s.quiz.count), T(TX.kQuiz)) +
    k(s.quiz.avgPercent==null ? '—' : s.quiz.avgPercent+'%', T(TX.kAvg)) +
    k(num(s.users.blocked), T(TX.kBlocked));

  const max = Math.max(1, ...s.registrations.map(r => r.count));
  $('regChart').innerHTML = s.registrations.map(r => {
    const d = new Date(r.date+'T00:00:00Z');
    const lbl = d.toLocaleDateString(LOCALE[LANG], { day:'numeric', month:'short', timeZone:'UTC' });
    return `<div class="b" title="${esc(lbl)}: ${r.count}"><div class="f" style="height:${(r.count/max)*100}%">${r.count?`<span class="n">${r.count}</span>`:''}</div><div class="d">${esc(lbl)}</div></div>`;
  }).join('');

  const tmax = Math.max(1, ...s.topTopics.map(t => t.reads));
  $('topTopics').innerHTML = s.topTopics.length ? s.topTopics.map(t =>
    `<div class="ad-hbar"><div class="t"><span title="${esc(topicName(t.topicId,t.title))}">${esc(topicName(t.topicId,t.title))}</span><span>${num(t.reads)} ${esc(T(TX.reads))}</span></div><div class="r"><i style="width:${(t.reads/tmax)*100}%"></i></div></div>`
  ).join('') : `<div class="ad-empty">${esc(T(TX.empty))}</div>`;

  $('topQuizzes').innerHTML = s.topQuizzes.length
    ? `<tr><th>${esc(T(TX.quiz))}</th><th class="num">${esc(T(TX.attempts))}</th><th class="num">${esc(T(TX.avg))}</th></tr>` +
      s.topQuizzes.map(q => `<tr><td>${esc(quizName(q.quizId))} <span class="em">${esc(q.quizId)}</span></td><td class="num">${num(q.attempts)}</td><td class="num">${q.avgPercent==null ? '—' : `<span class="pct ${pctCls(q.avgPercent)}">${q.avgPercent}%</span>`}</td></tr>`).join('')
    : `<tr><td class="ad-empty">${esc(T(TX.empty))}</td></tr>`;
}

/* ---------------- foydalanuvchilar ---------------- */
const U = { page:1, pageSize:20 };
function debounce(fn, ms){ let t; return () => { clearTimeout(t); t=setTimeout(fn, ms); }; }
$('uQ').oninput = debounce(() => { U.page=1; loadUsers().catch(fail); }, 300);
$('uRole').onchange = $('uBlocked').onchange = () => { U.page=1; loadUsers().catch(fail); };

function pager(el, st, total, reload){
  const pages = Math.max(1, Math.ceil(total/st.pageSize));
  el.innerHTML = pages<=1 ? '' :
    `<button class="ad-btn ghost sm" ${st.page<=1?'disabled':''} data-p="-1">${esc(T(TX.prev))}</button>
     <span>${st.page} / ${pages} ${esc(T(TX.page))}</span>
     <button class="ad-btn ghost sm" ${st.page>=pages?'disabled':''} data-p="1">${esc(T(TX.next))}</button>`;
  // Yuklanayotganda tugmalar o'chiriladi — tez ikki marta bosish mavjud bo'lmagan sahifaga o'tkazib yubormaydi
  el.querySelectorAll('button').forEach(b => b.onclick = () => {
    el.querySelectorAll('button').forEach(x => x.disabled = true);
    st.page += +b.dataset.p; reload().catch(fail);
  });
}

async function loadUsers(){
  const qs = new URLSearchParams({ page:U.page, pageSize:U.pageSize });
  if($('uQ').value.trim()) qs.set('q', $('uQ').value.trim());
  if($('uRole').value) qs.set('role', $('uRole').value);
  if($('uBlocked').value) qs.set('blocked', $('uBlocked').value);
  const r = await api('GET', '/api/admin/users?'+qs);
  $('uCount').textContent = `${num(r.total)} ${T(TX.shown)}`;
  const tb = $('uTable');
  // Oxirgi sahifadagi oxirgi qator o'chirilsa/bloklansa — bo'sh sahifada qotib qolmasdan oxirgi mavjud sahifaga o'tamiz
  if(!r.items.length && r.total && U.page>1){ U.page=Math.max(1, Math.ceil(r.total/U.pageSize)); return loadUsers(); }
  if(!r.items.length){ tb.innerHTML = `<tr><td class="ad-empty">${esc(T(TX.empty))}</td></tr>`; pager($('uPager'), U, 0, loadUsers); return; }
  tb.innerHTML = `<tr><th>${esc(T(TX.name))}</th><th>${esc(T(TX.role))}</th><th>${esc(T(TX.status))}</th>
    <th class="num">${esc(T(TX.read))}</th><th class="num">${esc(T(TX.tests))}</th><th>${esc(T(TX.joined))}</th><th>${esc(T(TX.seen))}</th><th></th></tr>` +
    r.items.map(u => {
      const me = u.id===ME.id;
      return `<tr data-id="${u.id}">
        <td><div>${esc(u.name)} ${me?`<span class="badge me">${esc(T(TX.you))}</span>`:''}</div><div class="em">${esc(u.email)}</div></td>
        <td><select data-act="role" ${me?'disabled':''}>
          <option value="user" ${u.role==='user'?'selected':''}>${esc(T(TX.roleUser))}</option>
          <option value="admin" ${u.role==='admin'?'selected':''}>${esc(T(TX.roleAdmin))}</option></select></td>
        <td>${u.blocked?`<span class="badge bad">${esc(T(TX.blocked))}</span>`:`<span class="badge ok">${esc(T(TX.active))}</span>`}</td>
        <td class="num">${num(u.readCount)}</td><td class="num">${num(u.quizCount)}</td>
        <td class="dim">${esc(dt(u.createdAt))}</td><td class="dim">${esc(dt(u.lastSeenAt))}</td>
        <td><div class="acts">
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
      const rl = el.value==='admin' ? T(TX.roleAdmin) : T(TX.roleUser);
      if(!confirm(fmt(T(TX.confirmRole), { n:u.name, r:rl }))){ el.value=u.role; return; }
      try{ await api('PATCH', '/api/admin/users/'+u.id, { role:el.value }); toast(T(TX.saved)); loadUsers().catch(fail); }
      catch(e){ el.value=u.role; fail(e); }
    };
    else el.onclick = async () => {
      if(act==='results'){ Q.userId=u.id; Q.userLabel=`${u.name} · ${u.email}`; Q.page=1; show('quiz'); return; }
      if(act==='block'){
        if(!u.blocked && !confirm(fmt(T(TX.confirmBlock), { n:u.name }))) return;
        try{ await api('PATCH', '/api/admin/users/'+u.id, { blocked:!u.blocked }); toast(T(TX.saved)); loadUsers().catch(fail); }catch(e){ fail(e); loadUsers().catch(()=>{}); }
      }
      if(act==='del'){
        if(!confirm(fmt(T(TX.confirmDel), { n:u.name, e:u.email }))) return;
        try{ await api('DELETE', '/api/admin/users/'+u.id); toast(T(TX.deleted)); loadUsers().catch(fail); }catch(e){ fail(e); loadUsers().catch(()=>{}); }
      }
    };
  });
  pager($('uPager'), U, r.total, loadUsers);
}

/* ---------------- test natijalari ---------------- */
const Q = { page:1, pageSize:25, userId:null, userLabel:'' };
$('qQ').oninput = $('qQuiz').oninput = debounce(() => { Q.page=1; loadQuiz().catch(fail); }, 300);
function quizParams(){
  const qs = new URLSearchParams();
  if(Q.userId) qs.set('userId', Q.userId);
  if($('qQ').value.trim()) qs.set('q', $('qQ').value.trim());
  if($('qQuiz').value.trim()) qs.set('quizId', $('qQuiz').value.trim());
  return qs;
}
$('qCsv').onclick = () => { location.href = '/api/admin/quiz.csv?' + quizParams(); };

async function loadQuiz(){
  const chip = $('qUserChip');
  chip.hidden = !Q.userId;
  if(Q.userId){
    chip.innerHTML = `${esc(Q.userLabel)} <button title="✕">✕</button>`;
    chip.querySelector('button').onclick = () => { Q.userId=null; Q.page=1; loadQuiz().catch(fail); };
  }
  const qs = quizParams(); qs.set('page', Q.page); qs.set('pageSize', Q.pageSize);
  const r = await api('GET', '/api/admin/quiz?'+qs);
  $('qCount').textContent = `${num(r.total)} ${T(TX.shown)}`;
  $('qTable').innerHTML = r.items.length
    ? `<tr><th>${esc(T(TX.user))}</th><th>${esc(T(TX.quiz))}</th><th class="num">${esc(T(TX.result))}</th><th class="num">%</th><th>${esc(T(TX.date))}</th></tr>` +
      r.items.map(x => { const p = Math.round(x.score/x.total*100);
        return `<tr><td><div>${esc(x.user.name)}</div><div class="em">${esc(x.user.email)}</div></td>
          <td>${esc(quizName(x.quizId))}<div class="em">${esc(x.quizId)}</div></td>
          <td class="num">${x.score} / ${x.total}</td><td class="num"><span class="pct ${pctCls(p)}">${p}%</span></td>
          <td class="dim">${esc(dt(x.at))}</td></tr>`; }).join('')
    : `<tr><td class="ad-empty">${esc(T(TX.empty))}</td></tr>`;
  pager($('qPager'), Q, r.total, loadQuiz);
}

/* ---------------- ishga tushish ---------------- */
$('adLogout').onclick = async () => { try{ await api('POST', '/api/auth/logout'); }catch(e){} location.href='/'; };

(async () => {
  applyLang();
  try{
    ME = (await api('GET', '/api/auth/me')).user;
    if(!ME){ location.href='/#login'; return; }
    if(ME.role!=='admin'){ location.href='/'; return; }
    $('adMe').textContent = ME.name + ' · ' + ME.email;
    TOPICS = (await api('GET', '/api/admin/topics')).topics;
  }catch(e){ return fail(e); }
  const h = location.hash.slice(1);
  show(['stats','users','quiz'].includes(h) ? h : 'stats');
})();
})();
