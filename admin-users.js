/* Zenithra · Admin — foydalanuvchi kartasi (o'ng paneli): profil, mavzular progressi, test natijalari, sessiyalar,
   jurnal yozuvlari va amallar (ism/email, blok, rol, sessiyalarni yopish, parolni majburiy tiklash, o'chirish). */
(function(){
const A = window.ADM, { T, $, esc, fmt, num, dt, api, toast, fail, ask, pctPill, emptyRow } = A;
A.addTX({
  udProfile:{uz:'Profil',ru:'Профиль',en:'Profile'}, udActions:{uz:'Amallar',ru:'Действия',en:'Actions'},
  udProgress:{uz:'Mavzular bo‘yicha progress',ru:'Прогресс по темам',en:'Progress by topic'},
  udResults:{uz:'Test natijalari (oxirgi 50 ta)',ru:'Результаты тестов (последние 50)',en:'Quiz results (last 50)'},
  udEvents:{uz:'Jurnal (oxirgi 50 ta)',ru:'Журнал (последние 50)',en:'Audit log (last 50)'},
  udSessions:{uz:'Faol sessiyalar',ru:'Активные сессии',en:'Active sessions'},
  udVerified:{uz:'Email tasdiqlangan',ru:'Email подтверждён',en:'Email verified'},
  udPassword:{uz:'Parol',ru:'Пароль',en:'Password'}, udPassSet:{uz:'o‘rnatilgan',ru:'установлен',en:'set'}, udPassNone:{uz:'o‘rnatilmagan',ru:'не установлен',en:'not set'},
  yes:{uz:'ha',ru:'да',en:'yes'}, no:{uz:'yo‘q',ru:'нет',en:'no'}, lang:{uz:'Til',ru:'Язык',en:'Language'},
  email:{uz:'Email',ru:'Email',en:'Email'}, avgScore:{uz:'O‘rtacha natija',ru:'Средний результат',en:'Average score'},
  emailNote:{uz:'Email o‘zgarsa, foydalanuvchining barcha sessiyalari yopiladi va keyingi kirishda yangi manzil kod bilan tasdiqlanadi.',ru:'При смене email все сессии пользователя закрываются, а новый адрес подтверждается кодом при следующем входе.',en:'Changing the email signs the user out everywhere; the new address is confirmed with a code at the next sign-in.'},
  confirmEmail:{uz:'{n} emaili «{e}» ga o‘zgartirilsinmi?',ru:'Изменить email {n} на «{e}»?',en:'Change {n}’s email to “{e}”?'},
  makeAdmin:{uz:'Admin qilish',ru:'Сделать админом',en:'Make admin'}, removeAdmin:{uz:'Adminlikdan olish',ru:'Снять админа',en:'Remove admin'},
  revoke:{uz:'Sessiyalarni yopish',ru:'Закрыть сессии',en:'Revoke sessions'},
  confirmRevoke:{uz:'{n} barcha qurilmalardan chiqarilsinmi?',ru:'Выйти из аккаунта {n} на всех устройствах?',en:'Sign {n} out on all devices?'},
  revoked:{uz:'{c} ta sessiya yopildi',ru:'Закрыто сессий: {c}',en:'{c} session(s) revoked'},
  forceReset:{uz:'Parolni majburiy tiklash',ru:'Принудительный сброс пароля',en:'Force password reset'},
  confirmReset:{uz:'{n} paroli bekor qilinsinmi? Barcha sessiyalari yopiladi va eski parol bilan kira olmaydi.',ru:'Аннулировать пароль {n}? Все сессии будут закрыты, старый пароль перестанет работать.',en:'Invalidate {n}’s password? All sessions are closed and the old password stops working.'},
  resetInfo:{uz:'Foydalanuvchi saytda kirish oynasidagi «Parolni unutdim» havolasi orqali emailiga keladigan kod bilan yangi parol o‘rnatadi. Unga buni xabar qiling.',ru:'Пользователь задаёт новый пароль на сайте через ссылку «Забыли пароль?» в окне входа — по коду из письма. Сообщите ему об этом.',en:'The user sets a new password on the site via “Forgot password” in the sign-in window, using the code sent to their email. Let them know.'},
  resetDone:{uz:'Parol bekor qilindi',ru:'Пароль аннулирован',en:'Password invalidated'},
  noPassInfo:{uz:'Parol o‘rnatilmagan — foydalanuvchi «Parolni unutdim» orqali o‘rnatishi kerak (yoki ro‘yxatdan o‘tishni yakunlamagan).',ru:'Пароль не установлен — пользователь должен задать его через «Забыли пароль?» (или не завершил регистрацию).',en:'No password set — the user must set one via “Forgot password” (or never finished signing up).'},
  openAudit:{uz:'Jurnalda ko‘rish',ru:'Открыть в журнале',en:'Open in audit log'},
  topicCol:{uz:'Mavzu',ru:'Тема',en:'Topic'}, readCol:{uz:'O‘qigan',ru:'Прочитано',en:'Read'}, lastTest:{uz:'Oxirgi test',ru:'Последний тест',en:'Last test'}, bestCol:{uz:'Eng yaxshi',ru:'Лучший',en:'Best'},
  when:{uz:'Vaqt',ru:'Время',en:'When'}, action:{uz:'Amal',ru:'Действие',en:'Action'}, actor:{uz:'Bajaruvchi',ru:'Кто',en:'Actor'},
  selfNote:{uz:'Bu sizning hisobingiz — rol, blok va emailni boshqa admin o‘zgartiradi.',ru:'Это ваш аккаунт — роль, блокировку и email меняет другой админ.',en:'This is your account — role, block and email are changed by another admin.'},
});
const TX = A.TX;
const D = { id:null, seq:0, data:null, notice:'', back:null };

function open(id){
  if(D.id !== id) D.notice = '';
  D.id = id; D.back = document.activeElement;
  $('udBack').hidden = false; $('uDrawer').hidden = false;
  document.body.classList.add('ad-noscroll');
  $('udClose').focus();
  return reload();
}
function close(){
  D.id = null; D.data = null; D.seq++;
  $('udBack').hidden = true; $('uDrawer').hidden = true;
  document.body.classList.remove('ad-noscroll');
  if(D.back && D.back.focus) try{ D.back.focus(); }catch(e){}
}
$('udClose').onclick = close;
$('udBack').onclick = close;
document.addEventListener('keydown', e => { if(e.key==='Escape' && D.id && !document.querySelector('dialog[open]')) close(); });

async function reload(){
  const seq = ++D.seq, id = D.id;
  if(!D.data || D.data.user.id !== id){
    $('udTitle').textContent = T(TX.loading); $('udSub').textContent = '';
    $('udBody').innerHTML = `<div class="ad-empty">${esc(T(TX.loading))}</div>`;
  }
  let r;
  try{ r = await api('GET', '/api/admin/users/'+id); }
  catch(e){ if(seq===D.seq) A.errorBox($('udBody'), e, () => reload()); return; }
  if(seq !== D.seq) return;   // boshqa foydalanuvchi ochilgan yoki panel yopilgan
  D.data = r; render();
}

const row = (k, v) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`;
function render(){
  const { user:u, stats, progress, quizResults, events } = D.data, me = u.id === A.ME.id;
  $('udTitle').textContent = u.name || '—';
  $('udSub').innerHTML = `${esc(u.email)} · <span class="badge ${u.role==='admin'?'me':''}">${esc(T(u.role==='admin'?TX.roleAdmin:TX.roleUser))}</span>
    ${u.blocked?`<span class="badge bad">${esc(T(TX.blocked))}</span>`:`<span class="badge ok">${esc(T(TX.active))}</span>`}${me?` <span class="badge me">${esc(T(TX.you))}</span>`:''}`;
  const dis = me ? 'disabled' : '';
  const sortedProg = progress.slice().sort((a, b) => a.topicId.localeCompare(b.topicId, 'en', { numeric:true }));
  $('udBody').innerHTML = `
    ${D.notice ? `<div class="ad-info" role="status">${esc(D.notice)}</div>` : ''}
    ${!u.hasPassword && !D.notice ? `<div class="ad-info warn">${esc(T(TX.noPassInfo))}</div>` : ''}
    <section><h4>${esc(T(TX.udProfile))}</h4>
      <dl class="ad-dl">
        ${row(T(TX.udSessions), num(u.sessions))}${row(T(TX.tests), num(stats.quizCount))}
        ${row(T(TX.avgScore), pctPill(stats.avgPercent))}${row(T(TX.read), num(stats.readCount))}
        ${row(T(TX.joined), esc(dt(u.createdAt)))}${row(T(TX.seen), esc(dt(u.lastSeenAt)))}
        ${row(T(TX.udVerified), esc(T(u.emailVerified?TX.yes:TX.no)))}${row(T(TX.udPassword), esc(T(u.hasPassword?TX.udPassSet:TX.udPassNone)))}
        ${row(T(TX.lang), esc(String(u.lang).toUpperCase()))}${row('ID', esc(u.id))}
      </dl>
      <form class="ad-form" id="udForm" novalidate>
        <label><span>${esc(T(TX.name))}</span><input name="name" maxlength="60" required value="${esc(u.name)}" /></label>
        <label><span>${esc(T(TX.email))}</span><input name="email" type="email" maxlength="254" required value="${esc(u.email)}" ${dis} /></label>
        <p class="ad-hint">${esc(T(me?TX.selfNote:TX.emailNote))}</p>
        <div><button class="ad-btn" type="submit">${esc(T(TX.save))}</button></div>
      </form>
    </section>
    <section><h4>${esc(T(TX.udActions))}</h4>
      <div class="ad-actions">
        <button class="ad-btn ghost sm" data-a="role" ${dis}>${esc(T(u.role==='admin'?TX.removeAdmin:TX.makeAdmin))}</button>
        <button class="ad-btn ghost sm" data-a="block" ${dis}>${esc(T(u.blocked?TX.unblock:TX.block))}</button>
        <button class="ad-btn ghost sm" data-a="revoke" ${dis || (u.sessions ? '' : 'disabled')}>${esc(T(TX.revoke))}</button>
        <button class="ad-btn ghost sm danger" data-a="reset" ${dis}>${esc(T(TX.forceReset))}</button>
        <button class="ad-btn ghost sm danger" data-a="del" ${dis}>${esc(T(TX.del))}</button>
        <button class="ad-btn ghost sm" data-a="results">${esc(T(TX.results))}</button>
        <button class="ad-btn ghost sm" data-a="audit">${esc(T(TX.openAudit))}</button>
      </div>
    </section>
    <section><h4>${esc(T(TX.udProgress))} <small>${num(stats.readCount)}</small></h4>
      <div class="ad-table-wrap"><table class="ad-table">${sortedProg.length
        ? `<tr><th>${esc(T(TX.topicCol))}</th><th>${esc(T(TX.readCol))}</th><th class="num">${esc(T(TX.lastTest))}</th><th class="num">${esc(T(TX.bestCol))}</th><th>${esc(T(TX.date))}</th></tr>` +
          sortedProg.map(p => { const d = p.data || {}, t = Number(d.t) || 0;
            return `<tr><td>${esc(A.levelName('dz', p.topicId))}</td><td>${d.v?'<span class="ok-mark">✓</span>':'<span class="dim">—</span>'}</td>
              <td class="num">${t ? `${esc(d.s ?? 0)} / ${esc(t)}` : '—'}</td>
              <td class="num">${t && d.b!=null ? pctPill(Math.round(Math.min(1, d.b/t)*100)) : '—'}</td>
              <td class="dim">${esc(d.d ? dt(d.d) : dt(p.updatedAt))}</td></tr>`; }).join('')
        : emptyRow(T(TX.empty))}</table></div>
    </section>
    <section><h4>${esc(T(TX.udResults))} <small>${num(stats.quizCount)}</small></h4>
      <div class="ad-table-wrap"><table class="ad-table">${quizResults.length
        ? `<tr><th>${esc(T(TX.quiz))}</th><th class="num">${esc(T(TX.result))}</th><th class="num">%</th><th>${esc(T(TX.date))}</th></tr>` +
          quizResults.map(x => `<tr><td>${esc(A.quizName(x.quizId))}</td><td class="num">${esc(x.score)} / ${esc(x.total)}</td>
            <td class="num">${pctPill(Math.round(x.score/x.total*100))}</td><td class="dim">${esc(dt(x.at))}</td></tr>`).join('')
        : emptyRow(T(TX.empty))}</table></div>
    </section>
    <section><h4>${esc(T(TX.udEvents))}</h4>
      <div class="ad-table-wrap"><table class="ad-table">${events.length
        ? `<tr><th>${esc(T(TX.when))}</th><th>${esc(T(TX.action))}</th><th>${esc(T(TX.actor))}</th></tr>` +
          events.map(e => `<tr><td class="dim">${esc(dt(e.at))}</td>
            <td>${esc(A.actionLabel ? A.actionLabel(e.action) : e.action)}<div class="em">${esc(A.detailsText ? A.detailsText(e.details) : '')}</div></td>
            <td class="dim">${esc(e.actorEmail || '—')}</td></tr>`).join('')
        : emptyRow(T(TX.empty))}</table></div>
    </section>`;

  $('udForm').onsubmit = ev => { ev.preventDefault(); saveProfile(u); };
  $('udBody').querySelectorAll('[data-a]').forEach(b => b.onclick = () => act(u, b.dataset.a, b));
}

async function saveProfile(u){
  const f = $('udForm'), name = f.name.value.trim(), email = f.email.value.trim().toLowerCase();
  const patch = {};
  if(name !== u.name) patch.name = name;
  if(!f.email.disabled && email !== u.email) patch.email = email;
  if(!Object.keys(patch).length) return;
  if(!name){ f.name.focus(); return toast(T(TX.err)+T(TX.name), true); }
  if(patch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ f.email.focus(); return toast(T(TX.err)+T(TX.email), true); }
  if(patch.email && !await ask({ text:fmt(T(TX.confirmEmail), { n:u.name||u.email, e:email }), note:T(TX.emailNote) })) return;
  const btn = f.querySelector('[type=submit]'); btn.disabled = true;
  try{
    const r = await api('PATCH', '/api/admin/users/'+u.id, patch);
    D.notice = r.sessionsRevoked ? fmt(T(TX.revoked), { c:r.sessionsRevoked }) : '';
    toast(T(TX.saved)); await reload(); A.reloadUsers();
  }catch(e){ fail(e); btn.disabled = false; }
}

async function act(u, a, btn){
  const n = u.name || u.email;
  if(a==='results'){ close(); A.showResultsFor(u); return; }
  if(a==='audit'){ close(); A.openAudit && A.openAudit(String(u.id)); return; }
  let done = false;
  btn.disabled = true;
  try{
    if(a==='role') done = await A.userAction(u, 'role', u.role==='admin' ? 'user' : 'admin');
    else if(a==='block') done = await A.userAction(u, 'block');
    else if(a==='del'){ if(await A.userAction(u, 'del')){ close(); A.reloadUsers(); } return; }
    else if(a==='revoke'){
      if(!await ask({ text:fmt(T(TX.confirmRevoke), { n }), ok:T(TX.revoke), danger:true })) return;
      const r = await api('POST', `/api/admin/users/${u.id}/revoke-sessions`);
      toast(fmt(T(TX.revoked), { c:r.sessionsRevoked })); done = true;
    } else if(a==='reset'){
      if(!await ask({ text:fmt(T(TX.confirmReset), { n }), note:T(TX.resetInfo), ok:T(TX.forceReset), danger:true })) return;
      await api('POST', `/api/admin/users/${u.id}/force-reset`);
      D.notice = T(TX.resetDone) + '. ' + T(TX.resetInfo);
      toast(T(TX.resetDone)); done = true;
    }
  }catch(e){ fail(e); }
  finally{ if(btn.isConnected) btn.disabled = false; }
  if(done){ await reload(); A.reloadUsers(); }
}

A.openUser = open;
A.onLang(() => { if(D.id && D.data) render(); });
})();
