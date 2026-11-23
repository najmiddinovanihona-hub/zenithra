/* Zenithra · Admin — Statistika: KPI, kunlik grafiklar (inline SVG, tashqi kutubxonasiz), mavzular bo'yicha
   o'zlashtirish, eng qiyin savollar va CSV eksport. Har bir blok alohida yuklanadi: biri xato bersa, qolganlari ko'rinadi. */
(function(){
const A = window.ADM, { T, $, esc, fmt, num, api, emptyRow, errorBox, pctPill } = A;
A.addTX({
  kUsers:{uz:'Foydalanuvchilar',ru:'Пользователи',en:'Users'},
  kActive:{uz:'Faol (7 kun)',ru:'Активные (7 дней)',en:'Active (7 days)'},
  kNew:{uz:'Yangi (7 kun)',ru:'Новые (7 дней)',en:'New (7 days)'},
  kQuiz:{uz:'Topshirilgan testlar',ru:'Пройдено тестов',en:'Quizzes taken'},
  kAvg:{uz:'O‘rtacha natija',ru:'Средний результат',en:'Average score'},
  kBlocked:{uz:'Bloklangan',ru:'Заблокировано',en:'Blocked'},
  active30:{uz:'30 kunda faol',ru:'активны за 30 дней',en:'active in 30 days'},
  admins:{uz:'admin',ru:'админ',en:'admins'},
  period:{uz:'Davr',ru:'Период',en:'Period'},
  d7:{uz:'7 kun',ru:'7 дней',en:'7 days'}, d30:{uz:'30 kun',ru:'30 дней',en:'30 days'}, d90:{uz:'90 kun',ru:'90 дней',en:'90 days'},
  export:{uz:'Eksport:',ru:'Экспорт:',en:'Export:'},
  csvUsers:{uz:'⬇ Foydalanuvchilar',ru:'⬇ Пользователи',en:'⬇ Users'}, csvDaily:{uz:'⬇ Kunlik',ru:'⬇ По дням',en:'⬇ Daily'},
  csvTopics:{uz:'⬇ Mavzular',ru:'⬇ Темы',en:'⬇ Topics'}, csvQuestions:{uz:'⬇ Savollar',ru:'⬇ Вопросы',en:'⬇ Questions'},
  chRegs:{uz:'Ro‘yxatdan o‘tishlar',ru:'Регистрации',en:'Sign-ups'},
  chActive:{uz:'Faol foydalanuvchilar (kunlik)',ru:'Активные пользователи (в день)',en:'Daily active users'},
  chAttempts:{uz:'Test urinishlari',ru:'Попытки тестов',en:'Quiz attempts'},
  chAvg:{uz:'O‘rtacha test natijasi',ru:'Средний результат тестов',en:'Average quiz score'},
  sumTotal:{uz:'jami {n}',ru:'всего {n}',en:'{n} total'}, sumAvgDay:{uz:'kuniga o‘rtacha {n}',ru:'в среднем {n} в день',en:'{n} per day on average'},
  sumAvg:{uz:'davr bo‘yicha {n}',ru:'за период {n}',en:'{n} for the period'},
  tableView:{uz:'Jadval ko‘rinishi (kunlar bo‘yicha)',ru:'Таблица по дням',en:'Table view (by day)'},
  colRegs:{uz:'Ro‘yxatdan o‘tgan',ru:'Регистрации',en:'Sign-ups'}, colActive:{uz:'Faol',ru:'Активные',en:'Active'},
  colAttempts:{uz:'Urinishlar',ru:'Попытки',en:'Attempts'}, colAvg:{uz:'O‘rtacha %',ru:'Средний %',en:'Average %'},
  noAttempts:{uz:'test yo‘q',ru:'нет тестов',en:'no quizzes'},
  mastery:{uz:'Mavzular bo‘yicha o‘zlashtirish',ru:'Усвоение по темам',en:'Topic mastery'},
  masteryHint:{uz:'o‘qiganlar va mavzu testidagi eng yaxshi natija o‘rtachasi',ru:'прочитавшие и средний лучший результат теста темы',en:'readers and the average best topic-test score'},
  topic:{uz:'Mavzu',ru:'Тема',en:'Topic'}, readers:{uz:'O‘qiganlar',ru:'Прочитали',en:'Readers'}, testers:{uz:'Test topshirgan',ru:'Сдавали тест',en:'Took the test'},
  avgBest:{uz:'O‘rtacha eng yaxshi natija',ru:'Средний лучший результат',en:'Average best score'},
  hardest:{uz:'Eng qiyin savollar',ru:'Самые сложные вопросы',en:'Hardest questions'},
  minAnswers:{uz:'kamida javob:',ru:'минимум ответов:',en:'min. answers:'},
  question:{uz:'Savol (o‘zbekcha matn)',ru:'Вопрос (текст на узбекском)',en:'Question (Uzbek text)'}, where:{uz:'Qayerda',ru:'Где',en:'Where'},
  answers:{uz:'Javoblar',ru:'Ответы',en:'Answers'}, correctRate:{uz:'To‘g‘ri',ru:'Верно',en:'Correct'},
  hiddenB:{uz:'yashirilgan',ru:'скрыт',en:'hidden'}, goneB:{uz:'o‘chirilgan',ru:'удалён',en:'deleted'},
  hardEmpty:{uz:'Hali yetarli javob yo‘q — savollar statistikasi test tugaganda yig‘iladi',ru:'Пока мало ответов — статистика собирается после завершения тестов',en:'Not enough answers yet — stats are collected when quizzes finish'},
  hardSum:{uz:'{q} ta savol, {a} ta javob kuzatilmoqda',ru:'отслеживается {q} вопросов, {a} ответов',en:'{q} questions, {a} answers tracked'},
  topTopics:{uz:'Eng ko‘p o‘qilgan mavzular',ru:'Самые читаемые темы',en:'Most read topics'},
  topQuizzes:{uz:'Eng ko‘p topshirilgan testlar',ru:'Самые популярные тесты',en:'Most taken quizzes'},
  reads:{uz:'o‘qigan',ru:'прочитали',en:'reads'},
  attempts:{uz:'Urinishlar',ru:'Попытки',en:'Attempts'}, avg:{uz:'O‘rtacha',ru:'Среднее',en:'Average'},
});
const TX = A.TX;
const S = { days:30, daily:null, topics:null, sort:'n', seq:{ basic:0, daily:0, topics:0, hard:0 } };

/* ---------------- SVG grafiklar ---------------- */
const dLbl = d => new Date(d+'T00:00:00Z').toLocaleDateString(A.LOCALE, { day:'numeric', month:'short', timeZone:'UTC' });
const nice = m => { if(m<=4) return 4; const p=10**Math.floor(Math.log10(m)), f=m/p; return (f<=1?1:f<=2?2:f<=5?5:10)*p; };
const r1 = v => Math.round(v*10)/10;

// kind: 'col' (ustunlar) yoki 'line' (chiziq, bo'sh kunlarda uziladi). get(row) → son yoki null.
function chart(el, rows, kind, get, o){
  el._chart = [rows, kind, get, o];
  const W = Math.max(240, Math.floor(el.clientWidth || 300)), H = 170, L = 36, R = 8, TOP = 10, B = 22;
  const iw = W-L-R, ih = H-TOP-B, n = rows.length, band = iw/n;
  const vals = rows.map(get), max = o.max || nice(Math.max(0, ...vals.filter(v => v!=null)));
  const x = i => L + band*(i+.5), y = v => TOP + ih - (v/max)*ih;
  const ticks = o.max ? [0, o.max/2, o.max] : (max%2 ? [0, max] : [0, max/2, max]);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(o.label)}">`;
  ticks.forEach(t => { s += `<line class="g" x1="${L}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}"/><text class="yt" x="${L-6}" y="${y(t)+3.5}" text-anchor="end">${esc(o.tick(t))}</text>`; });
  const every = Math.ceil(n / Math.max(2, Math.floor(iw/52)));
  rows.forEach((r, i) => { if((n-1-i) % every === 0) s += `<text class="xt" x="${x(i)}" y="${H-6}" text-anchor="middle">${esc(dLbl(r.date))}</text>`; });
  if(kind==='col'){
    const bw = Math.max(2, Math.min(24, band-2));
    vals.forEach((v, i) => {
      if(!v) return;
      const x0 = x(i)-bw/2, x1 = x0+bw, yb = y(0), yt = y(v), rr = Math.min(4, bw/2, yb-yt);
      s += `<path class="bar" data-i="${i}" d="M${x0},${yb}V${yt+rr}Q${x0},${yt} ${x0+rr},${yt}H${x1-rr}Q${x1},${yt} ${x1},${yt+rr}V${yb}Z"/>`;
    });
  } else {
    let d = '', open = false;
    vals.forEach((v, i) => { if(v==null){ open=false; return; } d += (open?'L':'M') + x(i) + ',' + y(v); open = true; });
    s += `<path class="ln" d="${d}"/>`;
    vals.forEach((v, i) => { if(v!=null) s += `<circle class="dot" data-i="${i}" cx="${x(i)}" cy="${y(v)}" r="4"/>`; });
  }
  s += `<line class="base" x1="${L}" x2="${W-R}" y1="${y(0)}" y2="${y(0)}"/>`;
  s += `<line class="cx" x1="0" x2="0" y1="${TOP}" y2="${TOP+ih}" visibility="hidden"/>`;
  rows.forEach((_, i) => { s += `<rect class="hit" data-i="${i}" x="${L+band*i}" y="${TOP}" width="${band}" height="${ih}"/>`; });
  el.innerHTML = s + '</svg>';
  // Hover: ustunda — ustun ajratiladi, chiziqda — vertikal kursor; bitta umumiy tooltip (matn textContent orqali)
  const svg = el.firstChild, cx = svg.querySelector('.cx'), tip = $('adTip');
  const hide = () => { tip.hidden = true; cx.setAttribute('visibility', 'hidden'); svg.querySelectorAll('.on').forEach(e => e.classList.remove('on')); };
  svg.onpointerleave = hide;
  svg.onpointermove = ev => {
    const h = ev.target.closest && ev.target.closest('.hit'); if(!h) return hide();
    const i = +h.dataset.i, r = rows[i], v = vals[i];
    svg.querySelectorAll('.on').forEach(e => e.classList.remove('on'));
    svg.querySelectorAll(`[data-i="${i}"]:not(.hit)`).forEach(e => e.classList.add('on'));
    if(kind==='line'){ cx.setAttribute('x1', x(i)); cx.setAttribute('x2', x(i)); cx.setAttribute('visibility', 'visible'); }
    const b = document.createElement('b'); b.textContent = v==null ? T(TX.noAttempts) : o.val(v, r);
    const sp = document.createElement('span'); sp.textContent = dLbl(r.date) + (o.extra ? ' · ' + o.extra(r) : '');
    tip.replaceChildren(b, sp); tip.hidden = false;
    const tw = tip.offsetWidth, px = Math.min(window.innerWidth - tw - 8, Math.max(8, ev.clientX - tw/2));
    tip.style.left = px + 'px'; tip.style.top = Math.max(8, ev.clientY - tip.offsetHeight - 14) + 'px';
  };
}
// Kenglik o'zgarsa (telefon burilishi, oyna) — qayta chiziladi
const ro = typeof ResizeObserver==='function' ? new ResizeObserver(es => es.forEach(e => {
  const el = e.target; if(!el._chart || el._w === el.clientWidth) return;
  el._w = el.clientWidth; clearTimeout(el._rt); el._rt = setTimeout(() => chart(el, ...el._chart), 120);
})) : null;
['chRegs','chActive','chAttempts','chAvg'].forEach(id => ro && ro.observe($(id)));

/* ---------------- bloklar ---------------- */
async function loadBasic(){
  const seq = ++S.seq.basic;
  const s = await api('GET', '/api/admin/stats');
  if(seq !== S.seq.basic) return;
  const k = (v, l, sub) => `<div class="glass ad-kpi"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div>${sub?`<div class="s">${esc(sub)}</div>`:''}</div>`;
  $('kpis').innerHTML =
    k(num(s.users.total), T(TX.kUsers), `${num(s.users.admins)} ${T(TX.admins)}`) +
    k(num(s.users.active7d), T(TX.kActive), `${num(s.users.active30d)} ${T(TX.active30)}`) +
    k(num(s.users.new7d), T(TX.kNew)) +
    k(num(s.quiz.count), T(TX.kQuiz)) +
    k(s.quiz.avgPercent==null ? '—' : s.quiz.avgPercent+'%', T(TX.kAvg)) +
    k(num(s.users.blocked), T(TX.kBlocked));
  const tmax = Math.max(1, ...s.topTopics.map(t => t.reads));
  $('topTopics').innerHTML = s.topTopics.length ? s.topTopics.map(t => { const nm = A.topicName(t.topicId, t.title);
    return `<div class="ad-hbar"><div class="t"><span title="${esc(nm)}">${esc(nm)}</span><span>${num(t.reads)} ${esc(T(TX.reads))}</span></div><div class="r"><i style="width:${(t.reads/tmax)*100}%"></i></div></div>`; }
  ).join('') : `<div class="ad-empty">${esc(T(TX.empty))}</div>`;
  $('topQuizzes').innerHTML = s.topQuizzes.length
    ? `<tr><th>${esc(T(TX.quiz))}</th><th class="num">${esc(T(TX.attempts))}</th><th class="num">${esc(T(TX.avg))}</th></tr>` +
      s.topQuizzes.map(q => `<tr><td>${esc(A.quizName(q.quizId))} <span class="em">${esc(q.quizId)}</span></td><td class="num">${num(q.attempts)}</td><td class="num">${pctPill(q.avgPercent)}</td></tr>`).join('')
    : emptyRow(T(TX.empty));
}

function drawDaily(){
  const d = S.daily; if(!d) return;
  const sum = f => d.reduce((a, r) => a + f(r), 0);
  const intTick = t => num(t);
  chart($('chRegs'), d, 'col', r => r.registrations, { label:T(TX.chRegs), tick:intTick, val:v => num(v) });
  chart($('chActive'), d, 'col', r => r.active, { label:T(TX.chActive), tick:intTick, val:v => num(v) });
  chart($('chAttempts'), d, 'col', r => r.attempts, { label:T(TX.chAttempts), tick:intTick, val:v => num(v),
    extra:r => r.avgPercent==null ? '' : r.avgPercent+'%' });
  chart($('chAvg'), d, 'line', r => r.avgPercent, { label:T(TX.chAvg), max:100, tick:t => t+'%', val:v => v+'%',
    extra:r => fmt(T(TX.sumTotal), { n:num(r.attempts) }) });
  $('chRegsSum').textContent = fmt(T(TX.sumTotal), { n:num(sum(r => r.registrations)) });
  $('chActiveSum').textContent = fmt(T(TX.sumAvgDay), { n:r1(sum(r => r.active)/d.length).toLocaleString(A.LOCALE) });
  $('chAttemptsSum').textContent = fmt(T(TX.sumTotal), { n:num(sum(r => r.attempts)) });
  const tot = d.filter(r => r.avgPercent!=null);
  const wavg = sum(r => r.attempts) ? r1(tot.reduce((a, r) => a + r.avgPercent*r.attempts, 0) / sum(r => r.attempts)) : null;
  $('chAvgSum').textContent = wavg==null ? '' : fmt(T(TX.sumAvg), { n:wavg+'%' });
  $('dailyTable').innerHTML = `<tr><th>${esc(T(A.TX.date))}</th><th class="num">${esc(T(TX.colRegs))}</th><th class="num">${esc(T(TX.colActive))}</th><th class="num">${esc(T(TX.colAttempts))}</th><th class="num">${esc(T(TX.colAvg))}</th></tr>` +
    d.slice().reverse().map(r => `<tr><td class="dim">${esc(dLbl(r.date))} <span class="em">${esc(r.date)}</span></td><td class="num">${num(r.registrations)}</td><td class="num">${num(r.active)}</td><td class="num">${num(r.attempts)}</td><td class="num">${pctPill(r.avgPercent)}</td></tr>`).join('');
}
async function loadDaily(){
  const seq = ++S.seq.daily;
  const ids = ['chRegs','chActive','chAttempts','chAvg'];
  if(!S.daily) ids.forEach(id => { $(id).innerHTML = `<div class="ad-empty">${esc(T(A.TX.loading))}</div>`; });
  let r;
  try{ r = await api('GET', '/api/admin/stats/daily?days='+S.days); }
  catch(e){ if(seq===S.seq.daily){ S.daily=null; ids.forEach(id => errorBox($(id), e, () => loadDaily().catch(()=>{}))); } throw e; }
  if(seq !== S.seq.daily) return;
  S.daily = r.days; drawDaily();
}

const SORTS = { n:(a,b)=>0, readers:(a,b)=>b.readers-a.readers, best:(a,b)=>(a.avgBest??101)-(b.avgBest??101) };
function drawTopics(){
  const list = S.topics; if(!list) return;
  const rows = list.filter(t => /^t\d+$/.test(t.topicId)).sort(SORTS[S.sort]);
  const max = Math.max(1, ...rows.map(t => t.readers));
  const th = (k, label, cls) => `<th class="${cls||''}"><button class="ad-sort ${S.sort===k?'on':''}" data-sort="${k}">${esc(label)}${S.sort===k?' ↓':''}</button></th>`;
  $('mastery').innerHTML = rows.length
    ? `<tr>${th('n', T(TX.topic))}${th('readers', T(TX.readers))}<th class="num">${esc(T(TX.testers))}</th>${th('best', T(TX.avgBest))}</tr>` +
      rows.map(t => `<tr><td>${esc(A.levelName('dz', t.topicId))}</td>
        <td><div class="ad-meter"><i style="width:${t.readers/max*100}%"></i></div><span class="num-in">${num(t.readers)}</span></td>
        <td class="num">${num(t.testers)}</td>
        <td>${t.avgBest==null ? '<span class="dim">—</span>' : `<div class="ad-meter q ${A.pctCls(t.avgBest)}"><i style="width:${t.avgBest}%"></i></div>${pctPill(t.avgBest)}`}</td></tr>`).join('')
    : emptyRow(T(A.TX.empty));
  $('mastery').querySelectorAll('[data-sort]').forEach(b => b.onclick = () => { S.sort = b.dataset.sort; drawTopics(); });
}
async function loadTopics(){
  const seq = ++S.seq.topics;
  let r;
  try{ r = await api('GET', '/api/admin/stats/topics'); }
  catch(e){ if(seq===S.seq.topics && !S.topics) A.errorRow($('mastery'), e, () => loadTopics().catch(()=>{})); throw e; }
  if(seq !== S.seq.topics) return;
  S.topics = r.topics; drawTopics();
}

async function loadHard(){
  const seq = ++S.seq.hard;
  const tb = $('hardest');
  let r;
  try{ r = await api('GET', '/api/admin/stats/questions?limit=20&min='+encodeURIComponent($('hMin').value)); }
  catch(e){ if(seq===S.seq.hard) A.errorRow(tb, e, () => loadHard().catch(()=>{})); throw e; }
  if(seq !== S.seq.hard) return;
  if(!r.items.length){ tb.innerHTML = emptyRow(T(TX.hardEmpty)); return; }
  tb.innerHTML = `<caption>${esc(fmt(T(TX.hardSum), { q:num(r.tracked), a:num(r.answers) }))}</caption>
    <tr><th class="num">#</th><th>${esc(T(TX.question))}</th><th>${esc(T(TX.where))}</th><th class="num">${esc(T(TX.answers))}</th><th>${esc(T(TX.correctRate))}</th></tr>` +
    r.items.map((q, i) => `<tr><td class="num dim">${i+1}</td>
      <td class="ad-qtext">${esc(q.text)} ${q.hidden?`<span class="badge warn">${esc(T(TX.hiddenB))}</span>`:''}${!q.exists?` <span class="badge bad">${esc(T(TX.goneB))}</span>`:''}<div class="em">${esc(q.qid)}</div></td>
      <td class="dim">${esc(A.levelName(q.scope, q.level))}</td>
      <td class="num">${num(q.shown)}</td>
      <td><div class="ad-meter q ${A.pctCls(q.rate)}"><i style="width:${q.rate}%"></i></div>${pctPill(q.rate)}</td></tr>`).join('');
}
$('hMin').onchange = () => loadHard().catch(A.fail);
$('sDays').onchange = () => { S.days = +$('sDays').value; S.daily = null; loadDaily().catch(A.fail); };
document.querySelectorAll('[data-csv]').forEach(b => b.onclick = () => {
  const k = b.dataset.csv;
  A.download(k==='users' ? '/api/admin/users.csv' : `/api/admin/stats.csv?kind=${k}&days=${S.days}&min=${encodeURIComponent($('hMin').value)}`);
});

// Bloklar mustaqil: biri xato bersa ham qolganlari chiziladi; xabar bitta (birinchi xato)
A.tabs.stats = async () => {
  const rs = await Promise.allSettled([loadBasic(), loadDaily(), loadTopics(), loadHard()]);
  const bad = rs.find(r => r.status==='rejected');
  if(bad) throw bad.reason;
};
A.onLang(() => { drawDaily(); drawTopics(); });
})();
