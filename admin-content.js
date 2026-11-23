/* Zenithra · Admin — Kontent: test savollari.
   "Admin savollari" — 3 tilli savollar (yaratish, tahrirlash, faol/nofaol, o'chirish);
   "O'rnatilgan savollar" — kod ichidagi savollar (faqat o'qish), saytdagi testlarda yashirish/qaytarish. */
(function(){
const A = window.ADM, { T, $, esc, fmt, num, api, toast, fail, ask, emptyRow, debounce, pager, pctPill } = A;
const LANGS = A.LANGS, LN = { uz:'UZ', ru:'RU', en:'EN' };
A.addTX({
  srcCustom:{uz:'Admin savollari',ru:'Вопросы админа',en:'Admin questions'}, srcBuiltin:{uz:'O‘rnatilgan savollar',ru:'Встроенные вопросы',en:'Built-in questions'},
  noteCustom:{uz:'Bu savollar saytdagi klassik test va darslik testlariga qo‘shiladi. Har bir savol, variant (va izoh bo‘lsa) 3 tilda to‘ldirilishi shart.',ru:'Эти вопросы добавляются в классический тест и тесты учебника на сайте. Вопрос, варианты (и пояснение, если есть) заполняются на 3 языках.',en:'These questions are added to the classic quiz and textbook tests on the site. The question, options (and explanation, if any) must be filled in all 3 languages.'},
  noteBuiltin:{uz:'Kod ichidagi savollar — faqat ko‘rish uchun. Yashirilgan savol saytdagi testlarda chiqmaydi (sahifa qayta ochilganda).',ru:'Вопросы из кода — только просмотр. Скрытый вопрос не показывается в тестах на сайте (после перезагрузки страницы).',en:'Questions from the code are read-only. A hidden question is not shown in quizzes on the site (after a page reload).'},
  builtinFail:{uz:'O‘rnatilgan savollarni serverda o‘qib bo‘lmadi',ru:'Не удалось прочитать встроенные вопросы на сервере',en:'The server could not read the built-in questions'},
  allScopes:{uz:'Barcha bo‘limlar',ru:'Все разделы',en:'All sections'}, scopeQuiz:{uz:'Klassik test',ru:'Классический тест',en:'Classic quiz'}, scopeDz:{uz:'Darslik testlari',ru:'Тесты учебника',en:'Textbook tests'},
  allLevels:{uz:'Barcha darajalar / mavzular',ru:'Все уровни / темы',en:'All levels / topics'},
  searchQ:{uz:'Savol yoki variant matni…',ru:'Текст вопроса или варианта…',en:'Question or option text…'},
  stAll:{uz:'Barchasi',ru:'Все',en:'All'}, stActive:{uz:'Faol',ru:'Активные',en:'Active'}, stInactive:{uz:'Nofaol',ru:'Неактивные',en:'Inactive'},
  stVisible:{uz:'Ko‘rinadigan',ru:'Видимые',en:'Visible'}, stHidden:{uz:'Yashirilgan',ru:'Скрытые',en:'Hidden'},
  newQ:{uz:'+ Yangi savol',ru:'+ Новый вопрос',en:'+ New question'}, editQ:{uz:'Savolni tahrirlash',ru:'Редактировать вопрос',en:'Edit question'},
  qCol:{uz:'Savol',ru:'Вопрос',en:'Question'}, ansCol:{uz:'To‘g‘ri javob',ru:'Правильный ответ',en:'Correct answer'}, statCol:{uz:'Javoblar',ru:'Ответы',en:'Answers'},
  edit:{uz:'Tahrirlash',ru:'Изменить',en:'Edit'}, activate:{uz:'Yoqish',ru:'Включить',en:'Activate'}, deactivate:{uz:'O‘chirib qo‘yish',ru:'Отключить',en:'Deactivate'},
  hide:{uz:'Yashirish',ru:'Скрыть',en:'Hide'}, unhide:{uz:'Qaytarish',ru:'Вернуть',en:'Restore'},
  isActive:{uz:'faol',ru:'активен',en:'active'}, isInactive:{uz:'nofaol',ru:'неактивен',en:'inactive'}, isVisible:{uz:'ko‘rinadi',ru:'видим',en:'visible'}, isHidden:{uz:'yashirilgan',ru:'скрыт',en:'hidden'},
  confirmQDel:{uz:'«{q}» savoli va uning statistikasi o‘chirilsinmi?',ru:'Удалить вопрос «{q}» и его статистику?',en:'Delete the question “{q}” and its stats?'},
  noStat:{uz:'hali yo‘q',ru:'пока нет',en:'none yet'}, showOpts:{uz:'variantlar',ru:'варианты',en:'options'},
  fScope:{uz:'Bo‘lim',ru:'Раздел',en:'Section'}, fLevel:{uz:'Daraja / mavzu',ru:'Уровень / тема',en:'Level / topic'},
  fQuestion:{uz:'Savol matni',ru:'Текст вопроса',en:'Question text'}, fOptions:{uz:'Javob variantlari (to‘g‘risini belgilang)',ru:'Варианты ответа (отметьте верный)',en:'Answer options (mark the correct one)'},
  fOption:{uz:'Variant',ru:'Вариант',en:'Option'}, fCorrect:{uz:'To‘g‘ri javob',ru:'Верный ответ',en:'Correct answer'},
  addOpt:{uz:'+ Variant qo‘shish',ru:'+ Добавить вариант',en:'+ Add option'}, rmOpt:{uz:'Variantni o‘chirish',ru:'Удалить вариант',en:'Remove option'},
  fExplain:{uz:'Izoh (ixtiyoriy — to‘ldirilsa 3 tilda)',ru:'Пояснение (необязательно — если есть, на 3 языках)',en:'Explanation (optional — if given, in all 3 languages)'},
  fActive:{uz:'Faol — saytdagi testlarda ko‘rinadi',ru:'Активен — показывается в тестах на сайте',en:'Active — shown in quizzes on the site'},
  eFill:{uz:'Barcha majburiy maydonlarni 3 tilda to‘ldiring',ru:'Заполните все обязательные поля на 3 языках',en:'Fill in all required fields in all 3 languages'},
  eExplain:{uz:'Izoh 3 tilda to‘liq yoki butunlay bo‘sh bo‘lishi kerak',ru:'Пояснение — либо на всех 3 языках, либо пустое',en:'The explanation must be in all 3 languages or empty'},
  eDup:{uz:'Variantlar takrorlanmasligi kerak',ru:'Варианты не должны повторяться',en:'Options must not repeat'},
  eLevel:{uz:'Daraja yoki mavzuni tanlang',ru:'Выберите уровень или тему',en:'Choose a level or topic'},
  discard:{uz:'Saqlanmagan o‘zgarishlar yo‘qolsinmi?',ru:'Отменить несохранённые изменения?',en:'Discard unsaved changes?'},
  created:{uz:'Savol qo‘shildi',ru:'Вопрос добавлен',en:'Question added'},
});
const TX = A.TX;
const C = { src:'custom', page:1, pageSize:20, seq:0, meta:null };
const tl = (o, L) => (o && (o[L || A.LANG] || o.uz)) || '';

/* ---------------- filtrlar ---------------- */
function levelOptions(sel, scope, withAll){
  const m = C.meta, cur = sel.value;
  let h = withAll ? `<option value="">${esc(T(TX.allLevels))}</option>` : `<option value="">—</option>`;
  if(m && (!scope || scope==='quiz')) h += `<optgroup label="${esc(T(TX.scopeQuiz))}">${m.levels.quiz.map(l => `<option value="${esc(l)}" data-scope="quiz">${esc(A.levelName('quiz', l))}</option>`).join('')}</optgroup>`;
  if(m && (!scope || scope==='dz')) h += `<optgroup label="${esc(T(TX.scopeDz))}">${m.levels.dz.map(t => `<option value="${esc(t.id)}" data-scope="dz">${esc((+t.id.slice(1))+'. '+tl(t.title))}</option>`).join('')}</optgroup>`;
  sel.innerHTML = h; sel.value = cur; if(sel.value !== cur) sel.value = '';
}
function fillFilters(){
  levelOptions($('cLevel'), $('cScope').value, true);
  const st = $('cStatus'), cur = st.value;
  st.innerHTML = C.src==='custom'
    ? `<option value="">${esc(T(TX.stAll))}</option><option value="1">${esc(T(TX.stActive))}</option><option value="0">${esc(T(TX.stInactive))}</option>`
    : `<option value="">${esc(T(TX.stAll))}</option><option value="0">${esc(T(TX.stVisible))}</option><option value="1">${esc(T(TX.stHidden))}</option>`;
  st.value = cur; if(st.value !== cur) st.value = '';
  document.querySelectorAll('.ad-seg [data-src]').forEach(b => { b.classList.toggle('on', b.dataset.src===C.src); b.setAttribute('aria-selected', b.dataset.src===C.src); });
  $('cNew').hidden = C.src !== 'custom';
  $('cNote').textContent = T(C.src==='custom' ? TX.noteCustom : TX.noteBuiltin);
}
async function loadMeta(){
  if(C.meta) return;
  C.meta = await api('GET', '/api/admin/content/meta');
  fillFilters();
}
const again = () => { C.page = 1; load().catch(fail); };
document.querySelectorAll('.ad-seg [data-src]').forEach(b => b.onclick = () => {
  if(C.src === b.dataset.src) return;
  C.src = b.dataset.src; $('cStatus').value = ''; $('cTable').innerHTML = ''; fillFilters(); again();
});
$('cScope').onchange = () => { levelOptions($('cLevel'), $('cScope').value, true); again(); };
$('cLevel').onchange = $('cStatus').onchange = again;
$('cQ').oninput = debounce(again, 300);

function params(){
  const qs = new URLSearchParams({ page:C.page, pageSize:C.pageSize });
  const lv = $('cLevel'), opt = lv.selectedOptions[0];
  const scope = $('cScope').value || (opt && opt.dataset.scope) || '';
  if(scope) qs.set('scope', scope);
  if(lv.value) qs.set('level', lv.value);
  if($('cQ').value.trim()) qs.set('q', $('cQ').value.trim());
  if($('cStatus').value) qs.set(C.src==='custom' ? 'active' : 'hidden', $('cStatus').value);
  return qs;
}
const statCell = s => s ? `${num(s.shown)} · ${pctPill(s.rate)}` : `<span class="dim">${esc(T(TX.noStat))}</span>`;
const otherLangs = o => LANGS.filter(l => l !== A.LANG).map(l => `<div class="em"><b>${LN[l]}</b> ${esc(o[l])}</div>`).join('');

/* ---------------- ro'yxat ---------------- */
async function load(){
  const seq = ++C.seq, tb = $('cTable');
  if(!tb.rows.length) tb.innerHTML = emptyRow(T(TX.loading));
  let r;
  try{
    await loadMeta();
    r = await api('GET', `/api/admin/content/${C.src==='custom' ? 'questions' : 'builtin'}?` + params());
  }catch(e){ if(seq===C.seq) A.errorRow(tb, e, () => load().catch(fail)); throw e; }
  if(seq !== C.seq) return;
  $('cCount').textContent = `${num(r.total)} ${T(TX.shown)}`;
  if(C.src==='builtin' && r.ok===false) $('cNote').textContent = T(TX.builtinFail);
  if(!r.items.length && r.total && C.page>1){ C.page = Math.ceil(r.total/C.pageSize); return load(); }
  const byKey = new Map(r.items.map(q => [String(C.src==='custom' ? q.id : q.qid), q]));
  if(C.src==='custom'){
    tb.innerHTML = r.items.length
      ? `<tr><th>${esc(T(TX.qCol))}</th><th>${esc(T(TX.where))}</th><th>${esc(T(TX.ansCol))}</th><th>${esc(T(TX.statCol))}</th><th>${esc(T(TX.status))}</th><th></th></tr>` +
        r.items.map(q => `<tr data-k="${esc(q.id)}" class="${q.active?'':'off'}">
          <td class="ad-qtext">${esc(tl(q.question))}${otherLangs(q.question)}<div class="em">${esc(q.qid)}</div></td>
          <td class="dim">${esc(A.levelName(q.scope, q.level))}</td>
          <td>${esc(tl(q.options[q.correct]))} <span class="em">(${q.options.length} ${esc(T(TX.showOpts))})</span></td>
          <td>${statCell(q.stat)}</td>
          <td>${q.active?`<span class="badge ok">${esc(T(TX.isActive))}</span>`:`<span class="badge">${esc(T(TX.isInactive))}</span>`}</td>
          <td><div class="acts">
            <button class="ad-btn ghost sm" data-a="edit">${esc(T(TX.edit))}</button>
            <button class="ad-btn ghost sm" data-a="toggle">${esc(T(q.active?TX.deactivate:TX.activate))}</button>
            <button class="ad-btn ghost sm danger" data-a="del">${esc(T(TX.del))}</button></div></td></tr>`).join('')
      : emptyRow(T(TX.empty));
  } else {
    tb.innerHTML = r.items.length
      ? `<tr><th>${esc(T(TX.qCol))}</th><th>${esc(T(TX.where))}</th><th>${esc(T(TX.statCol))}</th><th>${esc(T(TX.status))}</th><th></th></tr>` +
        r.items.map(q => `<tr data-k="${esc(q.qid)}" class="${q.hidden?'off':''}">
          <td class="ad-qtext">${esc(tl(q.question))}
            <details class="ad-opts"><summary>${q.options.length} ${esc(T(TX.showOpts))}</summary><ol>${q.options.map((o, i) =>
              `<li class="${i===q.correct?'ok':''}">${esc(tl(o))}${i===q.correct?' ✓':''}</li>`).join('')}</ol>${otherLangs(q.question)}</details>
            <div class="em">${esc(q.qid)}</div></td>
          <td class="dim">${esc(A.levelName(q.scope, q.level))} · #${esc(q.n)}</td>
          <td>${statCell(q.stat)}</td>
          <td>${q.hidden?`<span class="badge warn">${esc(T(TX.isHidden))}</span>`:`<span class="badge ok">${esc(T(TX.isVisible))}</span>`}</td>
          <td><div class="acts"><button class="ad-btn ghost sm" data-a="hide">${esc(T(q.hidden?TX.unhide:TX.hide))}</button></div></td></tr>`).join('')
      : emptyRow(T(TX.empty));
  }
  tb.querySelectorAll('[data-a]').forEach(b => b.onclick = () => rowAction(byKey.get(b.closest('tr').dataset.k), b.dataset.a, b));
  pager($('cPager'), C, r.total, load);
}

async function rowAction(q, a, btn){
  if(!q) return;
  if(a==='edit') return openEditor(q);
  btn.disabled = true;
  try{
    if(a==='toggle'){ await api('PATCH', '/api/admin/content/questions/'+q.id, { active:!q.active }); toast(T(TX.saved)); }
    else if(a==='del'){
      const short = tl(q.question).slice(0, 80);
      if(!await ask({ text:fmt(T(TX.confirmQDel), { q:short }), danger:true, ok:T(TX.del) })){ btn.disabled = false; return; }
      await api('DELETE', '/api/admin/content/questions/'+q.id); toast(T(TX.deleted));
    }
    else if(a==='hide'){ await api('POST', '/api/admin/content/builtin/hidden', { qid:q.qid, hidden:!q.hidden }); toast(T(TX.saved)); }
    C.meta = null;   // sonlar o'zgardi
    await load();
  }catch(e){ fail(e); if(btn.isConnected) btn.disabled = false; }
}

/* ---------------- muharrir ---------------- */
const dlg = $('qEditor');
let E = null, E0 = '';   // joriy model va boshlang'ich holat (o'zgarganini bilish uchun)
const blank = () => ({ uz:'', ru:'', en:'' });

function openEditor(q){
  E = q ? { id:q.id, scope:q.scope, level:q.level, question:{ ...q.question }, options:q.options.map(o => ({ ...o })), correct:q.correct,
      explain:q.explain ? { ...q.explain } : blank(), active:q.active }
    : { id:null, scope:$('cScope').value || 'quiz', level:'', question:blank(), options:[blank(), blank(), blank(), blank()], correct:0, explain:blank(), active:true };
  if(!q && $('cLevel').value && $('cLevel').selectedOptions[0].dataset.scope===E.scope) E.level = $('cLevel').value;
  E0 = JSON.stringify(E);
  $('qeTitle').textContent = T(q ? TX.editQ : TX.newQ).replace(/^\+\s*/, '');
  $('qeErr').textContent = '';
  render();
  if(typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  const first = $('qeBody').querySelector('textarea'); if(first) first.focus();
}
const l3 = (path, obj, tag, max, req) => `<div class="ad-l3">${LANGS.map(l => `<label><span>${LN[l]}</span>${tag==='input'
  ? `<input data-p="${path}.${l}" maxlength="${max}" value="${esc(obj[l])}" ${req?'required':''} />`
  : `<textarea data-p="${path}.${l}" maxlength="${max}" rows="2" ${req?'required':''}>${esc(obj[l])}</textarea>`}</label>`).join('')}</div>`;
function render(){
  const b = $('qeBody');
  b.innerHTML = `
    <div class="ad-row2">
      <label><span>${esc(T(TX.fScope))}</span><select id="qeScope"><option value="quiz">${esc(T(TX.scopeQuiz))}</option><option value="dz">${esc(T(TX.scopeDz))}</option></select></label>
      <label><span>${esc(T(TX.fLevel))}</span><select id="qeLevel"></select></label>
    </div>
    <fieldset><legend>${esc(T(TX.fQuestion))} *</legend>${l3('question', E.question, 'textarea', 500, true)}</fieldset>
    <fieldset><legend>${esc(T(TX.fOptions))} *</legend>
      ${E.options.map((o, i) => `<div class="ad-opt ${i===E.correct?'ok':''}">
        <label class="ad-radio" title="${esc(T(TX.fCorrect))}"><input type="radio" name="qeCorrect" value="${i}" ${i===E.correct?'checked':''} aria-label="${esc(T(TX.fCorrect))} ${i+1}" /><b>${i+1}</b></label>
        ${l3('options.'+i, o, 'input', 200, true)}
        <button type="button" class="ad-x sm" data-rm="${i}" ${E.options.length<=2?'disabled':''} aria-label="${esc(T(TX.rmOpt))}" title="${esc(T(TX.rmOpt))}">✕</button></div>`).join('')}
      <button type="button" class="ad-btn ghost sm" id="qeAdd" ${E.options.length>=6?'disabled':''}>${esc(T(TX.addOpt))}</button>
    </fieldset>
    <fieldset><legend>${esc(T(TX.fExplain))}</legend>${l3('explain', E.explain, 'textarea', 1000, false)}</fieldset>
    <label class="ad-check"><input type="checkbox" id="qeActive" ${E.active?'checked':''} /> ${esc(T(TX.fActive))}</label>`;
  const sc = $('qeScope'); sc.value = E.scope;
  const lv = $('qeLevel'); levelOptions(lv, E.scope, false); lv.value = E.level; if(lv.value !== E.level) E.level = lv.value = '';
  sc.onchange = () => { E.scope = sc.value; E.level = ''; levelOptions(lv, E.scope, false); lv.value = ''; };
  lv.onchange = () => { E.level = lv.value; lv.classList.remove('invalid'); };
  b.querySelectorAll('[data-p]').forEach(inp => inp.oninput = () => {
    const [k, a, c] = inp.dataset.p.split('.');
    if(k==='options') E.options[+a][c] = inp.value; else E[k][a] = inp.value;
    inp.classList.remove('invalid');
  });
  b.querySelectorAll('[name=qeCorrect]').forEach(r => r.onchange = () => {
    E.correct = +r.value; b.querySelectorAll('.ad-opt').forEach((d, i) => d.classList.toggle('ok', i===E.correct));
  });
  b.querySelectorAll('[data-rm]').forEach(x => x.onclick = () => {
    const i = +x.dataset.rm; E.options.splice(i, 1);
    if(E.correct===i) E.correct = 0; else if(E.correct>i) E.correct--;
    render();
  });
  $('qeAdd').onclick = () => { if(E.options.length<6){ E.options.push(blank()); render(); b.querySelector(`[data-p="options.${E.options.length-1}.uz"]`).focus(); } };
  $('qeActive').onchange = e => { E.active = e.target.checked; };
}

// Klient tomonda tekshiruv (server ham aynan shuni tekshiradi)
function validate(){
  const b = $('qeBody'), bad = [];
  const mark = p => { const el = b.querySelector(`[data-p="${p}"]`); if(el){ el.classList.add('invalid'); bad.push(el); } };
  let msg = '';
  if(!E.level){ $('qeLevel').classList.add('invalid'); bad.push($('qeLevel')); msg = T(TX.eLevel); }
  LANGS.forEach(l => { if(!E.question[l].trim()) mark('question.'+l); });
  E.options.forEach((o, i) => LANGS.forEach(l => { if(!o[l].trim()) mark(`options.${i}.${l}`); }));
  if(bad.length && !msg) msg = T(TX.eFill);
  const ex = LANGS.filter(l => E.explain[l].trim()).length;
  if(ex && ex<3){ LANGS.forEach(l => { if(!E.explain[l].trim()) mark('explain.'+l); }); msg = msg || T(TX.eExplain); }
  if(!msg && LANGS.some(l => new Set(E.options.map(o => o[l].trim().toLowerCase())).size !== E.options.length)) msg = T(TX.eDup);
  $('qeErr').textContent = msg;
  if(bad[0]) bad[0].focus();
  return !msg;
}
const body = () => {
  const tr = o => Object.fromEntries(LANGS.map(l => [l, o[l].trim()]));
  const ex = tr(E.explain);
  return { scope:E.scope, level:E.level, question:tr(E.question), options:E.options.map(tr), correct:E.correct,
    explain:LANGS.every(l => ex[l]) ? ex : null, active:E.active };
};
$('qeForm').onsubmit = async ev => {
  ev.preventDefault();
  if(!validate()) return;
  const btn = $('qeSave'); btn.disabled = true;
  try{
    if(E.id) await api('PUT', '/api/admin/content/questions/'+E.id, body());
    else await api('POST', '/api/admin/content/questions', body());
    toast(T(E.id ? TX.saved : TX.created)); E0 = JSON.stringify(E); dlg.close();
    C.meta = null; load().catch(fail);
  }catch(e){
    const f = e.details && e.details[0] && e.details[0].field;
    $('qeErr').textContent = A.errText(e) + (f ? ` (${f})` : '');
  }finally{ btn.disabled = false; }
};
async function tryClose(){
  if(E && JSON.stringify(E) !== E0 && !await ask({ text:T(TX.discard), danger:true })) return;
  dlg.close();
}
$('qeClose').onclick = $('qeCancel').onclick = tryClose;
dlg.addEventListener('cancel', ev => { ev.preventDefault(); tryClose(); });   // Esc

$('cNew').onclick = () => { if(C.meta) openEditor(null); else loadMeta().then(() => openEditor(null)).catch(fail); };
A.tabs.content = () => { C.meta = null; return load(); };
A.onLang(() => { fillFilters(); if(dlg.open && E) render(); });
})();
