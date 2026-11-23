// Kengaytirilgan statistika: kunlik ko'rsatkichlar, mavzular bo'yicha o'zlashtirish, eng qiyin savollar va CSV eksport.
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { parse } from '../http.js';
import { topicTitles } from '../topics.js';
import { sendCsv } from '../csv.js';
import { builtinCatalog, QIDS } from '../builtins.js';
import { dayKey, lastDays, pct } from './admin-util.js';

const router = Router();
const ACTIVE_ACTIONS = ['auth.login', 'auth.admin_login'];

// Kunlik: ro'yxatdan o'tishlar, faol foydalanuvchilar, test urinishlari va o'rtacha natija (UTC kunlar).
// Faol = shu kuni kirgan (jurnal: auth.login), o'z profilida biror amal qilgan (me.*), test topshirgan
// yoki oxirgi tashrifi (lastSeenAt — faqat eng oxirgi kun saqlanadi) shu kunga to'g'ri kelgan foydalanuvchi.
async function daily(days) {
  const keys = lastDays(days);
  const since = new Date(keys[0] + 'T00:00:00Z');
  const [users, seen, logs, results] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.user.findMany({ where: { lastSeenAt: { gte: since } }, select: { id: true, lastSeenAt: true } }),
    prisma.auditLog.findMany({
      where: { createdAt: { gte: since }, actorId: { not: null }, OR: [{ action: { in: ACTIVE_ACTIONS } }, { action: { startsWith: 'me.' } }] },
      select: { actorId: true, createdAt: true },
      take: 500000,
    }),
    prisma.quizResult.findMany({ where: { createdAt: { gte: since } }, select: { userId: true, score: true, total: true, createdAt: true }, take: 500000 }),
  ]);
  const row = Object.fromEntries(keys.map((k) => [k, { reg: 0, act: new Set(), n: 0, s: 0, t: 0 }]));
  const at = (d) => row[dayKey(d)];
  for (const u of users) { const r = at(u.createdAt); if (r) r.reg++; }
  for (const u of seen) at(u.lastSeenAt)?.act.add(u.id);
  for (const l of logs) at(l.createdAt)?.act.add(l.actorId);
  for (const q of results) {
    const r = at(q.createdAt);
    if (!r) continue;
    r.act.add(q.userId); r.n++; r.s += q.score; r.t += q.total;
  }
  return keys.map((date) => {
    const r = row[date];
    return { date, registrations: r.reg, active: r.act.size, attempts: r.n, avgPercent: pct(r.s, r.t) };
  });
}

// Mavzular: o'qiganlar soni, test topshirganlar va o'rtacha eng yaxshi natija (Progress: {v, s, t, b, d})
async function topics() {
  const titles = topicTitles();
  const rows = await prisma.progress.findMany({ select: { topicId: true, data: true, seen: true } });
  const acc = {};
  for (const id of Object.keys(titles)) acc[id] = { readers: 0, testers: 0, sum: 0 };
  for (const p of rows) {
    const a = acc[p.topicId] ??= { readers: 0, testers: 0, sum: 0 };
    if (p.seen) a.readers++;
    const d = p.data || {}, t = Number(d.t), b = Number(d.b ?? d.s);
    if (t > 0 && Number.isFinite(b)) { a.testers++; a.sum += Math.min(1, Math.max(0, b / t)); }
  }
  const num = (id) => Number(/^t(\d+)$/.exec(id)?.[1] ?? 1e3);
  return Object.entries(acc)
    .map(([topicId, a]) => ({
      topicId, title: titles[topicId] || null, readers: a.readers, testers: a.testers,
      avgBest: a.testers ? Math.round((a.sum / a.testers) * 1000) / 10 : null,
    }))
    .sort((x, y) => num(x.topicId) - num(y.topicId) || x.topicId.localeCompare(y.topicId));
}

const HardQuery = z.object({
  min: z.coerce.number().int().min(1).max(10000).default(5),
  limit: z.coerce.number().int().min(1).max(500).default(20),
  scope: z.enum(['quiz', 'dz']).optional(),
});

// Eng qiyin savollar: to'g'ri javoblar ulushi eng past (kamida `min` marta javob berilgan)
async function hardest({ min, limit, scope }) {
  const where = { shown: { gte: min }, ...(scope ? { scope } : {}) };
  const [rows, tracked, sum] = await Promise.all([
    prisma.questionStat.findMany({ where, take: 20000 }),
    prisma.questionStat.count(),
    prisma.questionStat.aggregate({ _sum: { shown: true, correct: true } }),
  ]);
  rows.sort((a, b) => a.correct / a.shown - b.correct / b.shown || b.shown - a.shown);
  const top = rows.slice(0, limit);
  const cat = builtinCatalog();
  const customIds = top.map((r) => QIDS().parse(r.qid)).filter((p) => p?.kind === 'c').map((p) => p.id);
  const custom = new Map((await prisma.quizQuestion.findMany({ where: { id: { in: customIds } }, select: { id: true, question: true, active: true } }))
    .map((q) => [`c:${q.id}`, q]));
  const hidden = new Set((await prisma.questionOverride.findMany({ where: { qid: { in: top.map((r) => r.qid) }, hidden: true }, select: { qid: true } })).map((o) => o.qid));
  return {
    tracked, answers: sum._sum.shown || 0, correct: sum._sum.correct || 0,
    items: top.map((r) => {
      const c = custom.get(r.qid), b = cat.byQid.get(r.qid);
      return {
        qid: r.qid, scope: r.scope, level: r.level,
        text: c ? String(c.question?.uz ?? r.text) : b ? b.question.uz : r.text,
        shown: r.shown, correct: r.correct, rate: pct(r.correct, r.shown),
        exists: !!(c || b), hidden: hidden.has(r.qid) || (c ? !c.active : false),
      };
    }),
  };
}

const DaysQuery = z.object({ days: z.coerce.number().int().min(7).max(365).default(30) });

router.get('/stats/daily', async (req, res) => {
  const { days } = parse(DaysQuery, req.query);
  res.json({ days: await daily(days) });
});

router.get('/stats/topics', async (req, res) => {
  res.json({ topics: await topics() });
});

router.get('/stats/questions', async (req, res) => {
  res.json(await hardest(parse(HardQuery, req.query)));
});

const CsvQuery = z.object({ kind: z.enum(['daily', 'topics', 'questions']).default('daily') }).extend(DaysQuery.shape).extend(HardQuery.shape);

router.get('/stats.csv', async (req, res) => {
  const q = parse(CsvQuery, req.query);
  if (q.kind === 'daily') {
    const rows = await daily(q.days);
    return sendCsv(res, 'stats-daily', [['date', 'registrations', 'active_users', 'quiz_attempts', 'avg_percent'],
      ...rows.map((r) => [r.date, r.registrations, r.active, r.attempts, r.avgPercent ?? ''])]);
  }
  if (q.kind === 'topics') {
    const rows = await topics();
    return sendCsv(res, 'stats-topics', [['topic_id', 'title_uz', 'readers', 'testers', 'avg_best_percent'],
      ...rows.map((r) => [r.topicId, r.title?.uz ?? '', r.readers, r.testers, r.avgBest ?? ''])]);
  }
  const { items } = await hardest({ ...q, limit: 500 });
  sendCsv(res, 'stats-questions', [['qid', 'scope', 'level', 'question_uz', 'answers', 'correct', 'correct_percent'],
    ...items.map((r) => [r.qid, r.scope, r.level, r.text, r.shown, r.correct, r.rate ?? ''])]);
});

export default router;
