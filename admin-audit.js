/* Zenithra · Admin — Jurnal: harakatlar tarixi (filtrlar, sahifalash, CSV) va amal nomlarining 3 tilli matnlari. */
(function(){
const A = window.ADM, { T, $, esc, num, dt, api, emptyRow, debounce, pager, fail } = A;
A.addTX({
  allActions:{uz:'Barcha amallar',ru:'Все действия',en:'All actions'}, groups:{uz:'Guruhlar',ru:'Группы',en:'Groups'}, exact:{uz:'Aniq amal',ru:'Конкретное действие',en:'Exact action'},
  gAuth:{uz:'Kirish va ro‘yxatdan o‘tish',ru:'Вход и регистрация',en:'Sign-in & sign-up'}, gAdminUser:{uz:'Admin: foydalanuvchilar',ru:'Админ: пользователи',en:'Admin: users'},
  gContent:{uz:'Kontent',ru:'Контент',en:'Content'}, gMe:{uz:'Foydalanuvchi o‘zi',ru:'Сам пользователь',en:'User self-service'},
  actorPh:{uz:'Bajaruvchi email…',ru:'Email исполнителя…',en:'Actor email…'}, targetPh:{uz:'Nishon: foydalanuvchi ID yoki email…',ru:'Цель: ID или email пользователя…',en:'Target: user ID or email…'},
  from:{uz:'dan',ru:'с',en:'from'}, to:{uz:'gacha',ru:'по',en:'to'}, resetF:{uz:'Tozalash',ru:'Сбросить',en:'Reset'},
  target:{uz:'Nishon',ru:'Цель',en:'Target'}, detailsH:{uz:'Tafsilotlar',ru:'Подробности',en:'Details'},
  system:{uz:'tizim / mehmon',ru:'система / гость',en:'system / guest'}, goneUser:{uz:'o‘chirilgan foydalanuvchi',ru:'удалённый пользователь',en:'deleted user'},
});
// Amal nomlari: noma'lumi xom kod bilan ko'rsatiladi
const ACT = {
  'auth.login':{uz:'Saytga kirdi',ru:'Вход на сайт',en:'Signed in'},
  'auth.admin_login':{uz:'Admin paneliga kirdi',ru:'Вход в админ-панель',en:'Signed in to admin panel'},
  'auth.login_failed':{uz:'Kirish rad etildi (noto‘g‘ri parol)',ru:'Неудачный вход (неверный пароль)',en:'Failed sign-in (wrong password)'},
  'auth.admin_login_failed':{uz:'Admin kirishi rad etildi',ru:'Неудачный вход в админку',en:'Failed admin sign-in'},
  'auth.code_failed':{uz:'Tasdiqlash kodi: urinishlar tugadi',ru:'Код подтверждения: попытки исчерпаны',en:'Verification code: attempts exhausted'},
  'auth.logout':{uz:'Chiqdi',ru:'Выход',en:'Signed out'},
  'auth.register_start':{uz:'Ro‘yxatdan o‘tishni boshladi',ru:'Начал регистрацию',en:'Started sign-up'},
  'auth.register_complete':{uz:'Ro‘yxatdan o‘tishni yakunladi',ru:'Завершил регистрацию',en:'Completed sign-up'},
  'auth.reset_start':{uz:'Parolni tiklashni so‘radi',ru:'Запросил сброс пароля',en:'Requested password reset'},
  'auth.reset_complete':{uz:'Yangi parol o‘rnatdi',ru:'Установил новый пароль',en:'Set a new password'},
  'admin.user.update':{uz:'Admin: ism/email o‘zgartirildi',ru:'Админ: изменены имя/email',en:'Admin: name/email changed'},
  'admin.user.block':{uz:'Admin: bloklandi',ru:'Админ: заблокирован',en:'Admin: blocked'},
  'admin.user.unblock':{uz:'Admin: blokdan chiqarildi',ru:'Админ: разблокирован',en:'Admin: unblocked'},
  'admin.user.role':{uz:'Admin: rol o‘zgartirildi',ru:'Админ: изменена роль',en:'Admin: role changed'},
  'admin.user.delete':{uz:'Admin: foydalanuvchi o‘chirildi',ru:'Админ: пользователь удалён',en:'Admin: user deleted'},
  'admin.user.force_reset':{uz:'Admin: parol majburiy tiklandi',ru:'Админ: принудительный сброс пароля',en:'Admin: forced password reset'},
  'admin.user.revoke_sessions':{uz:'Admin: sessiyalar yopildi',ru:'Админ: сессии закрыты',en:'Admin: sessions revoked'},
  'me.profile_update':{uz:'Profilini o‘zgartirdi',ru:'Изменил профиль',en:'Updated own profile'},
  'me.password_change':{uz:'Parolini o‘zgartirdi',ru:'Сменил пароль',en:'Changed own password'},
  'content.question.create':{uz:'Savol qo‘shildi',ru:'Вопрос добавлен',en:'Question created'},
  'content.question.update':{uz:'Savol tahrirlandi',ru:'Вопрос изменён',en:'Question edited'},
  'content.question.delete':{uz:'Savol o‘chirildi',ru:'Вопрос удалён',en:'Question deleted'},
  'content.question.activate':{uz:'Savol faollashtirildi',ru:'Вопрос включён',en:'Question activated'},
  'content.question.deactivate':{uz:'Savol o‘chirib qo‘yildi',ru:'Вопрос отключён',en:'Question deactivated'},
  'content.builtin.hide':{uz:'O‘rnatilgan savol yashirildi',ru:'Встроенный вопрос скрыт',en:'Built-in question hidden'},
  'content.builtin.unhide':{uz:'O‘rnatilgan savol qaytarildi',ru:'Встроенный вопрос возвращён',en:'Built-in question restored'},
};
const GROUPS = [['auth.*','gAuth'],['admin.user.*','gAdminUser'],['content.*','gContent'],['me.*','gMe']];
// Tafsilotlardagi kalitlar
const KEY = {
  name:{uz:'ism',ru:'имя',en:'name'}, email:{uz:'email',ru:'email',en:'email'}, role:{uz:'rol',ru:'роль',en:'role'},
  sessionsRevoked:{uz:'yopilgan sessiyalar',ru:'закрыто сессий',en:'sessions revoked'}, otherSessionsClosed:{uz:'boshqa sessiyalar yopildi',ru:'закрыто других сессий',en:'other sessions closed'},
  hadPassword:{uz:'parol bor edi',ru:'был пароль',en:'had password'}, purpose:{uz:'maqsad',ru:'цель',en:'purpose'},
  question:{uz:'savol',ru:'вопрос',en:'question'}, scope:{uz:'bo‘lim',ru:'раздел',en:'scope'}, level:{uz:'daraja',ru:'уровень',en:'level'},
  options:{uz:'variantlar',ru:'варианты',en:'options'}, correct:{uz:'to‘g‘ri',ru:'верный',en:'correct'}, active:{uz:'faol',ru:'активен',en:'active'},
  explain:{uz:'izoh',ru:'пояснение',en:'explanation'}, truncated:{uz:'qisqartirilgan',ru:'сокращено',en:'truncated'},
};
const TX = A.TX;
const actionLabel = a => ACT[a] ? T(ACT[a]) : a;
const val = v => { if(v===true) return T(TX.yes||{uz:'ha'}); if(v===false) return T(TX.no||{uz:'yo‘q'}); if(v==null) return '—';
  const s = typeof v==='object' ? JSON.stringify(v) : String(v); return s.length>120 ? s.slice(0,117)+'…' : s; };
const kl = k => KEY[k] ? T(KEY[k]) : k;
// details → qisqa matn: "ism: A → B; email: x → y; yopilgan sessiyalar: 2"
function detailsText(d){
  if(!d || typeof d!=='object') return d==null ? '' : val(d);
  const out = [];
  const { before, after, ...rest } = d;
  if(before!==undefined || after!==undefined){
    if(before && after && typeof before==='object' && typeof after==='object'){
      for(const k of new Set([...Object.keys(before), ...Object.keys(after)])){
        if(JSON.stringify(before[k]) !== JSON.stringify(after[k])) out.push(`${kl(k)}: ${val(before[k])} → ${val(after[k])}`);
      }
    } else out.push(`${val(before)} → ${val(after)}`);
  }
  for(const [k, v] of Object.entries(rest)) out.push(`${kl(k)}: ${val(v)}`);
  return out.join('; ');
}
A.actionLabel = actionLabel;
A.detailsText = detailsText;

/* ---------------- ro'yxat ---------------- */
const S = { page:1, pageSize:30, seq:0, actions:null };
function params(){
  const qs = new URLSearchParams();
  if($('aAction').value) qs.set('action', $('aAction').value);
  if($('aActor').value.trim()) qs.set('actor', $('aActor').value.trim());
  if($('aTarget').value.trim()) qs.set('target', $('aTarget').value.trim());
  // Sanalar mahalliy vaqt bo'yicha: "dan" — kun boshi, "gacha" — kun oxiri
  const day = (v, end) => { const d = new Date(v + (end ? 'T23:59:59.999' : 'T00:00:00')); return isNaN(d) ? null : d.toISOString(); };
  if($('aFrom').value && day($('aFrom').value)) qs.set('from', day($('aFrom').value));
  if($('aTo').value && day($('aTo').value, true)) qs.set('to', day($('aTo').value, true));
  return qs;
}
function fillActions(){
  const sel = $('aAction'), cur = sel.value;
  const known = new Set(Object.keys(ACT));
  (S.actions || []).forEach(a => known.add(a.action));
  const counts = Object.fromEntries((S.actions || []).map(a => [a.action, a.count]));
  sel.innerHTML = `<option value="">${esc(T(TX.allActions))}</option>
    <optgroup label="${esc(T(TX.groups))}">${GROUPS.map(([v, k]) => `<option value="${esc(v)}">${esc(T(TX[k]))}</option>`).join('')}</optgroup>
    <optgroup label="${esc(T(TX.exact))}">${[...known].sort().map(a => `<option value="${esc(a)}">${esc(actionLabel(a))}${counts[a]?` (${num(counts[a])})`:''}</option>`).join('')}</optgroup>`;
  sel.value = cur;
  if(sel.value !== cur) sel.value = '';
}
async function loadActions(){
  try{ S.actions = (await api('GET', '/api/admin/audit/actions')).actions; }catch(e){ /* ro'yxat ixtiyoriy */ }
  fillActions();
}

function targetCell(e){
  if(e.targetType==='user'){
    const u = e.target, email = e.details && e.details.email;
    return u ? `<button class="ad-link" data-open="${esc(u.id)}">${esc(u.name || '—')}</button><div class="em">${esc(u.email)}</div>`
      : `<span class="dim">${esc(T(TX.goneUser))} #${esc(e.targetId)}</span>${email?`<div class="em">${esc(email)}</div>`:''}`;
  }
  if(e.targetType) return `<span class="dim">${esc(e.targetType)}</span> <span class="em">${esc(e.targetId)}</span>`;
  return '<span class="dim">—</span>';
}

async function load(){
  const seq = ++S.seq, tb = $('aTable');
  if(!tb.rows.length) tb.innerHTML = emptyRow(T(TX.loading));
  if(!S.actions) loadActions();
  const qs = params(); qs.set('page', S.page); qs.set('pageSize', S.pageSize);
  let r;
  try{ r = await api('GET', '/api/admin/audit?'+qs); }
  catch(e){ if(seq===S.seq) A.errorRow(tb, e, () => load().catch(fail)); throw e; }
  if(seq !== S.seq) return;
  $('aCount').textContent = `${num(r.total)} ${T(TX.shown)}`;
  tb.innerHTML = r.items.length
    ? `<tr><th>${esc(T(TX.date))}</th><th>${esc(T(TX.action))}</th><th>${esc(T(TX.actor))}</th><th>${esc(T(TX.target))}</th><th>${esc(T(TX.detailsH))}</th></tr>` +
      r.items.map(e => `<tr><td class="dim">${esc(dt(e.at))}</td>
        <td><span class="ad-act ${esc(e.action.split('.')[0])}">${esc(actionLabel(e.action))}</span><div class="em">${esc(e.action)}</div></td>
        <td>${e.actorEmail ? esc(e.actorEmail) : `<span class="dim">${esc(T(TX.system))}</span>`}${e.ip?`<div class="em">${esc(e.ip)}</div>`:''}</td>
        <td>${targetCell(e)}</td>
        <td class="ad-det">${esc(detailsText(e.details))}</td></tr>`).join('')
    : emptyRow(T(TX.empty));
  tb.querySelectorAll('[data-open]').forEach(b => b.onclick = () => A.openUser && A.openUser(+b.dataset.open));
  pager($('aPager'), S, r.total, load);
}

const again = () => { S.page = 1; load().catch(fail); };
$('aAction').onchange = again;
$('aFrom').onchange = $('aTo').onchange = again;
$('aActor').oninput = $('aTarget').oninput = debounce(again, 300);
$('aReset').onclick = () => { ['aAction','aActor','aTarget','aFrom','aTo'].forEach(id => { $(id).value = ''; }); again(); };
$('aCsv').onclick = () => A.download('/api/admin/audit.csv?' + params());

A.tabs.audit = () => { S.actions = null; return load(); };
// Foydalanuvchi kartasidan: shu foydalanuvchiga tegishli yozuvlar
A.openAudit = target => {
  ['aAction','aActor','aFrom','aTo'].forEach(id => { $(id).value = ''; });
  $('aTarget').value = target; S.page = 1;
  A.show('audit');
};
A.onLang(fillActions);
})();
