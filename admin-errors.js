/* Zenithra · Admin — Xatolar: saytdagi (brauzer) va serverdagi xatolar guruhlari, tafsilotlar paneli, "Hal qilindi".
   Ma'lumot: GET /api/admin/errors?days=&kind=&status=, GET /api/admin/errors/:fp, POST /api/admin/errors/:fp/resolve,
   GET /api/admin/errors/summary (nishoncha), GET /api/admin/errors.csv. Serverdan kelgan har bir qiymat esc() qilinadi. */
(function(){
const A = window.ADM, { T, $, esc, num, dt, api, emptyRow, fail, toast } = A;
A.addTX({
  eAllKinds:{uz:'Barcha manbalar',ru:'Все источники',en:'All sources'},
  eClient:{uz:'Brauzer',ru:'Браузер',en:'Browser'}, eServer:{uz:'Server',ru:'Сервер',en:'Server'},
  eOpen:{uz:'Ochiq',ru:'Открытые',en:'Open'}, eResolvedF:{uz:'Hal qilingan',ru:'Решённые',en:'Resolved'}, eAllStatus:{uz:'Hammasi',ru:'Все',en:'All'},
  e1:{uz:'24 soat',ru:'24 часа',en:'24 hours'}, e7:{uz:'7 kun',ru:'7 дней',en:'7 days'}, e30:{uz:'30 kun',ru:'30 дней',en:'30 days'},
  eMsg:{uz:'Xato',ru:'Ошибка',en:'Error'}, eWhere:{uz:'Fayl:qator',ru:'Файл:строка',en:'File:line'},
  eCount:{uz:'Soni',ru:'Кол-во',en:'Count'}, eLast:{uz:'Oxirgi marta',ru:'Последний раз',en:'Last seen'},
  eFirst:{uz:'Birinchi marta',ru:'Впервые',en:'First seen'}, ePages:{uz:'Sahifalar',ru:'Страницы',en:'Pages'},
  eResolve:{uz:'Hal qilindi',ru:'Решено',en:'Resolved'}, eIsResolved:{uz:'hal qilingan',ru:'решено',en:'resolved'},
  eIsNew:{uz:'yangi',ru:'новая',en:'new'},
  eResolveAsk:{uz:'Bu xato hal qilingan deb belgilansinmi? U yana takrorlansa, ro‘yxatda qayta paydo bo‘ladi.',
    ru:'Отметить эту ошибку как решённую? Если она повторится, снова появится в списке.',
    en:'Mark this error as resolved? If it happens again, it will reappear in the list.'},
  eResolvedToast:{uz:'Hal qilingan deb belgilandi',ru:'Отмечено как решённое',en:'Marked as resolved'},
  eNone:{uz:'Bu davrda xato yo‘q 🎉',ru:'За этот период ошибок нет 🎉',en:'No errors in this period 🎉'},
  eSamples:{uz:'Oxirgi holatlar',ru:'Последние случаи',en:'Recent occurrences'}, eStack:{uz:'Stek',ru:'Стек',en:'Stack'},
  eHistory:{uz:'Hal qilish tarixi',ru:'История решений',en:'Resolution history'},
  eLogged:{uz:'kirgan',ru:'вошёл',en:'signed in'}, eGuest:{uz:'mehmon',ru:'гость',en:'guest'},
  eVersion:{uz:'versiya',ru:'версия',en:'version'}, eBrowser:{uz:'brauzer',ru:'браузер',en:'browser'},
  eKindError:{uz:'xato',ru:'ошибка',en:'error'}, eKindRejection:{uz:'promise rad etildi',ru:'отклонённый promise',en:'promise rejection'},
  eKindResource:{uz:'fayl yuklanmadi',ru:'файл не загрузился',en:'file failed to load'}, eKindServer:{uz:'server 500',ru:'сервер 500',en:'server 500'},
  eBadgeTitle:{uz:'Oxirgi 24 soatdagi ochiq xatolar guruhlari',ru:'Открытые группы ошибок за 24 часа',en:'Open error groups in the last 24 hours'},
  eHint:{uz:'Bir xil xatolar (xabar + joy) bitta guruhga yig‘iladi. Shaxsiy ma’lumot (email, URL parametrlari, tokenlar, IP) saqlanmaydi.',
    ru:'Одинаковые ошибки (сообщение + место) объединяются в группу. Личные данные (email, параметры URL, токены, IP) не сохраняются.',
    en:'Identical errors (message + location) are grouped. Personal data (emails, URL parameters, tokens, IPs) is not stored.'},
});
const TX = A.TX;
const S = { seq:0, items:[] };
const D = { fp:null, seq:0, back:null };
const kindLabel = k => T(TX[{ error:'eKindError', rejection:'eKindRejection', resource:'eKindResource', server:'eKindServer' }[k]] || {uz:k});
const where = g => g.source ? `${g.source}${g.line!=null && g.line!=='' ? ':'+g.line : ''}` : '—';
const short = (s, n) => { s = String(s ?? ''); return s.length > n ? s.slice(0, n-1)+'…' : s; };
const DAY = 864e5;

function params(){
  const qs = new URLSearchParams();
  qs.set('days', $('eDays').value);
  if($('eKind').value) qs.set('kind', $('eKind').value);
  qs.set('status', $('eStatus').value);
  return qs;
}
function setBadge(n){
  const b = $('errBadge'); if(!b) return;
  b.hidden = !(n > 0); b.textContent = n > 99 ? '99+' : String(n || '');
  b.title = T(TX.eBadgeTitle);
}
function refreshBadge(){ return api('GET', '/api/admin/errors/summary').then(r => setBadge(r.open24h)).catch(()=>{}); }

async function load(){
  const seq = ++S.seq, tb = $('eTable');
  if(!tb.rows.length) tb.innerHTML = emptyRow(T(TX.loading));
  let r;
  try{ r = await api('GET', '/api/admin/errors?' + params()); }
  catch(e){ if(seq===S.seq) A.errorRow(tb, e, () => load().catch(fail)); throw e; }
  if(seq !== S.seq) return;
  S.items = r.items;
  setBadge(r.open24h);
  $('eCount').textContent = `${num(r.total)} ${T(TX.shown)}`;
  if(!r.items.length){ tb.innerHTML = emptyRow(T(TX.eNone)); return; }
  const fresh = Date.now() - DAY;
  tb.innerHTML = `<tr><th>${esc(T(TX.eMsg))}</th><th>${esc(T(TX.eWhere))}</th><th class="num">${esc(T(TX.eCount))}</th>
    <th>${esc(T(TX.eLast))}</th><th class="ad-err-pages">${esc(T(TX.ePages))}</th><th></th></tr>` +
    r.items.map((g, i) => `<tr data-i="${i}" class="${g.resolved ? 'ad-err-done' : ''}">
      <td class="ad-err-msg"><button class="ad-link" data-act="open">${esc(short(g.message, 160))}</button>
        <div class="em"><span class="badge ${g.kind==='server' ? 'bad' : 'warn'}">${esc(T(g.kind==='server' ? TX.eServer : TX.eClient))}</span>
        ${g.resolved ? `<span class="badge ok">${esc(T(TX.eIsResolved))}</span>` : new Date(g.firstSeen).getTime() > fresh ? `<span class="badge me">${esc(T(TX.eIsNew))}</span>` : ''}</div></td>
      <td class="ad-err-where em">${esc(short(where(g), 80))}</td>
      <td class="num">${num(g.count)}</td>
      <td class="dim">${esc(dt(g.lastSeen))}</td>
      <td class="ad-err-pages">${g.pages.map(p => `<span class="em">${esc(short(p.page, 40))} <b>×${num(p.count)}</b></span>`).join('<br>') || '—'}</td>
      <td><div class="acts">
        <button class="ad-btn ghost sm" data-act="open">${esc(T(TX.details))}</button>
        ${g.resolved ? '' : `<button class="ad-btn ghost sm" data-act="resolve">${esc(T(TX.eResolve))}</button>`}
      </div></td></tr>`).join('');
  tb.querySelectorAll('[data-act]').forEach(el => el.onclick = () => {
    const g = S.items[+el.closest('tr').dataset.i]; if(!g) return;
    if(el.dataset.act === 'open') open(g.fp);
    else resolve(g.fp, el);
  });
}

async function resolve(fp, btn){
  if(!await A.ask({ text: T(TX.eResolveAsk), ok: T(TX.eResolve) })) return;
  if(btn) btn.disabled = true;
  try{
    const r = await api('POST', '/api/admin/errors/' + encodeURIComponent(fp) + '/resolve');
    setBadge(r.open24h);
    toast(T(TX.eResolvedToast));
    await load();
    if(D.fp === fp) reloadDrawer();
  }catch(e){ if(btn) btn.disabled = false; fail(e); }
}

/* ---------------- tafsilotlar paneli ---------------- */
function open(fp){
  D.fp = fp; D.back = document.activeElement;
  $('edBack').hidden = false; $('eDrawer').hidden = false;
  document.body.classList.add('ad-noscroll');
  $('edClose').focus();
  return reloadDrawer();
}
function close(){
  D.fp = null; D.seq++;
  $('edBack').hidden = true; $('eDrawer').hidden = true;
  document.body.classList.remove('ad-noscroll');
  if(D.back && D.back.focus) try{ D.back.focus(); }catch(e){}
}
$('edClose').onclick = close;
$('edBack').onclick = close;
document.addEventListener('keydown', e => { if(e.key==='Escape' && D.fp && !document.querySelector('dialog[open]')) close(); });

function sampleHtml(s){
  const d = s.details || {};
  const meta = [
    d.kind ? kindLabel(d.kind) : '',
    d.page ? d.page : '',
    d.method ? d.method : '',
    d.ua ? `${T(TX.eBrowser)}: ${d.ua}` : '',
    d.v ? `${T(TX.eVersion)}: ${d.v}` : '',
    d.auth === true ? T(TX.eLogged) : d.auth === false ? T(TX.eGuest) : '',
  ].filter(Boolean);
  return `<li class="ad-err-sample">
    <div><span class="dim">${esc(dt(s.at))}</span> · ${meta.map(m => `<span class="em">${esc(m)}</span>`).join(' · ')}</div>
    ${d.source ? `<div class="em">${esc(d.source)}${d.line!=null ? ':'+esc(d.line)+(d.col!=null ? ':'+esc(d.col) : '') : ''}</div>` : ''}
    ${d.stack ? `<details><summary>${esc(T(TX.eStack))}</summary><pre class="ad-err-stack">${esc(d.stack)}</pre></details>` : ''}
  </li>`;
}

async function reloadDrawer(){
  const seq = ++D.seq, fp = D.fp;
  $('edTitle').textContent = T(TX.loading); $('edSub').textContent = '';
  $('edBody').innerHTML = `<div class="ad-empty">${esc(T(TX.loading))}</div>`;
  let r;
  try{ r = await api('GET', '/api/admin/errors/' + encodeURIComponent(fp)); }
  catch(e){ if(seq===D.seq) A.errorBox($('edBody'), e, () => reloadDrawer()); return; }
  if(seq !== D.seq) return;
  const g = r.group;
  $('edTitle').textContent = short(g.message, 300);
  $('edSub').textContent = `${T(g.kind==='server' ? TX.eServer : TX.eClient)} · ${where(g)}`;
  $('edBody').innerHTML = `
    <dl class="ad-dl">
      <div><dt>${esc(T(TX.eCount))}</dt><dd>${num(g.count)}</dd></div>
      <div><dt>${esc(T(TX.status))}</dt><dd>${g.resolved ? `<span class="badge ok">${esc(T(TX.eIsResolved))}</span>` : `<span class="badge bad">${esc(T(TX.eOpen))}</span>`}</dd></div>
      <div><dt>${esc(T(TX.eFirst))}</dt><dd>${esc(dt(g.firstSeen))}</dd></div>
      <div><dt>${esc(T(TX.eLast))}</dt><dd>${esc(dt(g.lastSeen))}</dd></div>
    </dl>
    <div class="ad-actions">${g.resolved ? '' : `<button class="ad-btn" id="edResolve">${esc(T(TX.eResolve))}</button>`}</div>
    <section><h4>${esc(T(TX.eMsg))}</h4><pre class="ad-err-stack">${esc(g.message)}</pre></section>
    <section><h4>${esc(T(TX.eSamples))} <small>${num(r.samples.length)}</small></h4><ul class="ad-err-samples">${r.samples.map(sampleHtml).join('')}</ul></section>
    ${r.resolutions.length ? `<section><h4>${esc(T(TX.eHistory))}</h4><ul class="ad-err-samples">${r.resolutions.map(x =>
      `<li><span class="dim">${esc(dt(x.at))}</span> · ${esc(x.actorEmail || '—')}</li>`).join('')}</ul></section>` : ''}`;
  const b = $('edResolve'); if(b) b.onclick = () => resolve(g.fp, b);
}

/* ---------------- filtrlar ---------------- */
function fillSelects(){
  const set = (id, opts) => { const sel = $(id), cur = sel.value;
    sel.innerHTML = opts.map(([v, k]) => `<option value="${esc(v)}">${esc(T(TX[k]))}</option>`).join('');
    sel.value = cur || opts[0][0]; if(!sel.value) sel.value = opts[0][0]; };
  set('eDays', [['1','e1'],['7','e7'],['30','e30']]);
  set('eKind', [['','eAllKinds'],['client','eClient'],['server','eServer']]);
  set('eStatus', [['open','eOpen'],['resolved','eResolvedF'],['all','eAllStatus']]);
  $('eHint').textContent = T(TX.eHint);
  const b = $('errBadge'); if(b) b.title = T(TX.eBadgeTitle);
}
fillSelects();
$('eDays').value = '7';
$('eDays').onchange = $('eKind').onchange = $('eStatus').onchange = () => load().catch(fail);
$('eCsv').onclick = () => A.download('/api/admin/errors.csv?' + params());

A.tabs.errors = load;
A.onLang(fillSelects);
A.onBoot(() => { if(A.cur !== 'errors') refreshBadge(); });
})();
