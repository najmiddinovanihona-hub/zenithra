/* Zenithra · Test kontenti: admin qo'shgan savollar va yashirilgan o'rnatilgan savollar (GET /api/content/questions),
   hamda test tugagach savollar bo'yicha javob statistikasini yuborish.
   Ishonchlilik: ma'lumot sahifa ochilganda bir marta olinadi; test undan oldin ochilsa yoki server o'chiq bo'lsa —
   o'rnatilgan savollar o'zgarishsiz ishlatiladi. Savollar ro'yxati har safar test BOSHLANGANDA hisoblanadi
   (window.LOC massivlari o'zgartirilmaydi), shuning uchun ketayotgan testga kech kelgan javob ta'sir qilmaydi.
   Bog'liqlik: quiz-ids.js (window.QIDS). */
(function(){
const LANGS = ['uz','ru','en'];
const web = /^https?:$/.test(location.protocol);
let custom = [], hidden = new Set(), state = 'idle';   // idle | loading | ok | fail

const pick = (o, L) => o == null ? '' : typeof o === 'string' ? o : String(o[L] || o.uz || '');
const valid = q => q && typeof q.qid === 'string' && q.question && Array.isArray(q.options) && q.options.length >= 2
  && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length;

function load(){
  if(!web || state === 'loading' || state === 'ok') return;
  state = 'loading';
  const ctl = typeof AbortController === 'function' ? new AbortController() : null;
  const tm = setTimeout(() => ctl && ctl.abort(), 10000);
  fetch('/api/content/questions', { credentials:'same-origin', signal: ctl ? ctl.signal : undefined })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(d => {
      custom = (Array.isArray(d && d.custom) ? d.custom : []).filter(valid);
      hidden = new Set(Array.isArray(d && d.hidden) ? d.hidden : []);
      state = 'ok';
    })
    .catch(() => { state = 'fail'; })
    .finally(() => clearTimeout(tm));
}
load();

/* Klassik test: daraja (easy|medium|hard) bo'yicha savollar {q,o,c,e,m}; m — statistika uchun {qid,scope,level,text}.
   LOC[lang].quiz[level] massivlari tillar bo'yicha indeks bo'yicha mos (quiz-extra*.js ham 3 tilga bir xil qo'shadi),
   shuning uchun qid o'zbekcha nusxadagi shu indeksdan olinadi. Mos kelmasa (uzunlik farqli) — qid berilmaydi. */
function quizPool(level, L){
  if(state === 'fail') load();   // oldin tarmoq xatosi bo'lgan — keyingi test uchun qayta urinamiz
  const LOC = window.LOC || {}, base = ((LOC[L] || {}).quiz || {})[level] || [];
  const uz = ((LOC.uz || {}).quiz || {})[level] || [];
  const ids = window.QIDS && uz.length === base.length ? QIDS.forList('quiz', level, uz.map(x => x.q)) : [];
  const all = base.map((it, i) => Object.assign({}, it, { m: ids[i] ? { qid:ids[i], scope:'quiz', level, text:uz[i].q } : null }));
  const out = all.filter(it => !(it.m && hidden.has(it.m.qid)));
  custom.filter(c => c.scope === 'quiz' && c.level === level).forEach(c => {
    const o = c.options.map(x => pick(x, L));
    out.push({ q:pick(c.question, L), o, c:c.correct, e:pick(c.explain, L) || '✓ ' + o[c.correct],
      m:{ qid:c.qid, scope:'quiz', level, text:pick(c.question, 'uz') } });
  });
  return out.length ? out : all;   // hammasi yashirilgan bo'lsa ham test bo'sh qolmasin
}

/* Darslik mavzusi testi: QZ formatida ([savol, [variantlar — to'g'risi birinchi]]) ro'yxat, har birida .m.
   Kod ichidagi QZ o'zgartirilmaydi — yangi massiv qaytadi. html=true — matn innerHTML ga qo'yiladi (darslik testlari):
   admin savollari matni HTML sifatida emas, oddiy matn sifatida ko'rinishi uchun ekranlanadi. */
const escH = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escL = o => { const r = {}; LANGS.forEach(l => { r[l] = escH(pick(o, l)); }); return r; };
function dzPool(topicId, QZ, html){
  QZ = Array.isArray(QZ) ? QZ.filter(z => z && Array.isArray(z[1]) && z[1].length >= 2) : [];
  if(!/^t\d+$/.test(String(topicId))) return QZ;
  const uz = QZ.map(z => pick(z[0], 'uz'));
  const ids = window.QIDS ? QIDS.forList('dz', topicId, uz) : [];
  const wrap = (z, m) => { const a = [z[0], z[1]]; a.m = m; return a; };
  const all = QZ.map((z, i) => wrap(z, ids[i] ? { qid:ids[i], scope:'dz', level:topicId, text:uz[i] } : null));
  const out = all.filter(z => !(z.m && hidden.has(z.m.qid)));
  custom.filter(c => c.scope === 'dz' && c.level === topicId).forEach(c => {
    const opts = [c.options[c.correct]].concat(c.options.filter((_, k) => k !== c.correct));
    out.push(wrap(html ? [escL(c.question), opts.map(escL)] : [c.question, opts], { qid:c.qid, scope:'dz', level:topicId, text:pick(c.question, 'uz') }));
  });
  return out.length ? out : all;
}

/* Javoblar: [{qid, scope, level, text, correct}] (≤ 50). Kirgan foydalanuvchi — POST /api/me/quiz bilan birga
   (api.js dagi API.quiz 4-argument — answers — ni qabul qilsa), aks holda POST /api/content/answers ga alohida. */
function clean(list){
  const seen = new Set();
  return (Array.isArray(list) ? list : []).filter(a => a && window.QIDS && QIDS.valid(a.qid) && !seen.has(a.qid) && seen.add(a.qid))
    .slice(0, 50).map(a => ({ qid:a.qid, scope:a.scope, level:String(a.level), text:String(a.text || '').slice(0, 500), correct:!!a.correct }));
}
function postAnswers(answers, quizId){
  if(!web || !answers.length) return;
  const body = { answers };
  if(/^[\w:.-]{1,64}$/.test(quizId || '')) body.quizId = quizId;
  try{
    fetch('/api/content/answers', { method:'POST', credentials:'same-origin', keepalive:true,
      headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(body) }).catch(() => {});
  }catch(e){}
}
function finish(quizId, score, total, answers){
  const A = window.API, list = clean(answers);
  const viaMe = !!(A && A.user && typeof A.quiz === 'function' && A.quiz.length >= 4 && list.length);
  if(A && typeof A.quiz === 'function'){ try{ viaMe ? A.quiz(quizId, score, total, list) : A.quiz(quizId, score, total); }catch(e){} }
  if(!viaMe) postAnswers(list, quizId);
}

window.QCONTENT = { quizPool, dzPool, finish, report:(answers, quizId) => postAnswers(clean(answers), quizId),
  get state(){ return state; }, LANGS };
})();
