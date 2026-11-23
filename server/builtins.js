// Kod ichidagi (o'rnatilgan) test savollari katalogi — admin panelida ko'rsatish va javob statistikasini tekshirish uchun.
// Saytning o'z fayllari node:vm ichida bir marta (birinchi so'rovda) bajariladi:
//   klassik test — data.js (window.LOC[lang].quiz[level]) + quiz-extra*.js (window.QUIZ_EXTRA, LOC ga 3 tilda bir xil
//   tartibda qo'shiladi — massivlar indeks bo'yicha mos), darslik testlari — labs/dz-*.js (DARSLIK.add({id, QZ})).
// qid'lar ildizdagi quiz-ids.js orqali hisoblanadi — sayt bilan aynan bir xil.
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './config.js';

const LANGS = ['uz', 'ru', 'en'];
const MAIN_TOPIC = /^t\d+$/;
const tx = (o, l) => (o == null ? '' : typeof o === 'string' ? o : String(o[l] ?? o.uz ?? ''));
const run = (ctx, file) => vm.runInContext(readFileSync(path.join(ROOT, file), 'utf8'), ctx, { filename: file, timeout: 3000 });

let qidsLib = null;
export function QIDS() {
  if (!qidsLib) {
    const ctx = vm.createContext({});
    run(ctx, 'quiz-ids.js');
    qidsLib = ctx.QIDS;
  }
  return qidsLib;
}

// setTimeout navbati: fayllar bog'liqlik tayyor bo'lguncha setTimeout(add, 50) bilan kutadi — biz uni qo'lda aylantiramiz
function sandbox() {
  const queue = [];
  const w = { setTimeout: (f) => { if (typeof f === 'function') queue.push(f); return 0; }, clearTimeout() {}, console: { log() {}, warn() {}, error() {} } };
  w.window = w;
  const ctx = vm.createContext(w);
  const drain = () => {
    for (let i = 0; i < 30 && queue.length; i++) queue.splice(0).forEach((f) => { try { f(); } catch {} });
  };
  return { ctx, w, drain };
}

function loadClassic(Q) {
  const { ctx, w, drain } = sandbox();
  for (const f of ['data.js', 'quiz-extra.js', 'quiz-extra-hard.js']) run(ctx, f);
  drain();
  const out = [];
  const levels = Object.keys(w.LOC?.uz?.quiz || {});
  for (const level of levels) {
    const per = Object.fromEntries(LANGS.map((l) => [l, w.LOC[l]?.quiz?.[level] || []]));
    const uz = per.uz;
    const aligned = LANGS.every((l) => per[l].length === uz.length);
    const ids = Q.forList('quiz', level, uz.map((x) => x.q));
    uz.forEach((it, i) => {
      const at = (l) => (aligned ? per[l][i] : it);
      out.push({
        qid: ids[i], scope: 'quiz', level, n: i + 1,
        question: Object.fromEntries(LANGS.map((l) => [l, String(at(l).q)])),
        options: it.o.map((_, k) => Object.fromEntries(LANGS.map((l) => [l, String(at(l).o?.[k] ?? it.o[k])]))),
        correct: it.c,
        explain: Object.fromEntries(LANGS.map((l) => [l, String(at(l).e ?? '')])),
      });
    });
  }
  return out;
}

function loadDarslik(Q) {
  const { ctx, w, drain } = sandbox();
  const topics = {};
  w.DARSLIK = { add: (t) => { topics[t.id] = t; }, list: () => Object.values(topics) };
  // Yuklash tartibi labs/dz-load.js dagi bilan bir xil (masalan dz-t07d.js → dz-t07.js)
  const files = [...readFileSync(path.join(ROOT, 'labs', 'dz-load.js'), 'utf8').matchAll(/"labs\/(dz-[\w-]+\.js)/g)].map((m) => m[1]);
  for (const f of ['dz-kit.js', ...files]) {
    try { run(ctx, path.join('labs', f)); } catch {}
  }
  drain();
  const out = [];
  for (const [id, t] of Object.entries(topics)) {
    if (!MAIN_TOPIC.test(id)) continue;
    let QZ = [];
    try { QZ = (t.QZ || []).filter((z) => z && Array.isArray(z[1]) && z[1].length >= 2); } catch {}
    const ids = Q.forList('dz', id, QZ.map((z) => tx(z[0], 'uz')));
    QZ.forEach((z, i) => out.push({
      qid: ids[i], scope: 'dz', level: id, n: i + 1,
      question: Object.fromEntries(LANGS.map((l) => [l, tx(z[0], l)])),
      options: z[1].map((o) => Object.fromEntries(LANGS.map((l) => [l, tx(o, l)]))),
      correct: 0,   // darslik testlarida to'g'ri javob doim birinchi (ko'rsatishda aralashtiriladi)
      explain: null,
    }));
  }
  return out.sort((a, b) => a.level.localeCompare(b.level, 'en', { numeric: true }) || a.n - b.n);
}

let cache = null;
// { ok, items: [...], byQid: Map } — xato bo'lsa ok=false va bo'sh ro'yxat (asosiy API ishlashda davom etadi)
export function builtinCatalog() {
  if (cache) return cache;
  const items = [];
  let ok = true;
  try {
    const Q = QIDS();
    items.push(...loadClassic(Q), ...loadDarslik(Q));
  } catch (e) {
    ok = false;
    console.warn('[builtins] katalogni yuklab bo\'lmadi:', e.message);
  }
  cache = { ok: ok && items.length > 0, items, byQid: new Map(items.map((q) => [q.qid, q])) };
  return cache;
}
