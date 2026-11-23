// Har bir savol bo'yicha javob statistikasi (QuestionStat): test tugaganda sayt javoblar ro'yxatini yuboradi
//   [{ qid, scope, level, text, correct }] — mehmon: POST /api/content/answers, kirgan: POST /api/me/quiz (answers maydoni).
// Ishonchsiz ma'lumot: qid formati qat'iy tekshiriladi; "c:<id>" bazada bo'lishi, "b:..." esa o'rnatilgan katalogda
// bo'lishi shart (scope/level/matn serverdagi nusxadan olinadi). Bir so'rovda bitta qid bir marta hisoblanadi.
import { z } from 'zod';
import { prisma } from './db.js';
import { QIDS, builtinCatalog } from './builtins.js';

export const MAX_ANSWERS = 50;

const Answer = z.object({
  qid: z.string().max(48).refine((q) => QIDS().valid(q), 'bad qid'),
  scope: z.enum(['quiz', 'dz']),
  level: z.string().regex(/^[a-z0-9_-]{1,24}$/),
  text: z.string().max(500),
  correct: z.boolean(),
}).strict();
export const Answers = z.array(Answer).min(1).max(MAX_ANSWERS);

// Tekshirilgan javoblarni bazaga yozadi; qaytaradi: hisobga olinganlar soni
export async function recordAnswers(answers) {
  const uniq = new Map();
  for (const a of answers) if (!uniq.has(a.qid)) uniq.set(a.qid, a);
  const cat = builtinCatalog();
  const customIds = [...uniq.keys()].map((q) => QIDS().parse(q)).filter((p) => p.kind === 'c').map((p) => p.id);
  const custom = customIds.length
    ? new Map((await prisma.quizQuestion.findMany({ where: { id: { in: customIds } }, select: { id: true, scope: true, level: true, question: true } }))
      .map((q) => [`c:${q.id}`, q]))
    : new Map();

  const rows = [];
  for (const [qid, a] of uniq) {
    const p = QIDS().parse(qid);
    if (p.kind === 'c') {
      const q = custom.get(qid);
      if (!q) continue;   // o'chirilgan yoki mavjud bo'lmagan savol
      rows.push({ qid, scope: q.scope, level: q.level, text: String(q.question?.uz ?? '').slice(0, 500), correct: a.correct });
    } else {
      if (p.scope !== a.scope || p.level !== a.level) continue;
      const b = cat.byQid.get(qid);
      // Katalog yuklanmagan bo'lsa (kutilmagan xato) — formati to'g'ri qid klient matni bilan qabul qilinadi
      if (!b && cat.ok) continue;
      rows.push({ qid, scope: p.scope, level: p.level, text: b ? b.question.uz.slice(0, 500) : a.text, correct: a.correct });
    }
  }
  if (!rows.length) return 0;
  await prisma.$transaction(rows.map((r) => prisma.questionStat.upsert({
    where: { qid: r.qid },
    create: { qid: r.qid, scope: r.scope, level: r.level, text: r.text, shown: 1, correct: r.correct ? 1 : 0 },
    update: { text: r.text, shown: { increment: 1 }, correct: { increment: r.correct ? 1 : 0 } },
  })));
  return rows.length;
}

// Oddiy oyna-hisoblagich (xotirada): kirgan foydalanuvchi /api/me/quiz orqali statistikani ko'pirtirib yubormasligi uchun
const windows = new Map();
export function allowAnswers(key, limit = 15, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  if (windows.size > 10000) for (const [k, w] of windows) if (w.until < now) windows.delete(k);
  const w = windows.get(key);
  if (!w || w.until < now) { windows.set(key, { n: 1, until: now + windowMs }); return true; }
  if (w.n >= limit) return false;
  w.n++;
  return true;
}
