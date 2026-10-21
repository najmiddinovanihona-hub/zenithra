import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { isPostgres } from '../config.js';
import { ApiError, notFound, parse } from '../http.js';
import { requireAdmin } from '../session.js';
import { topicTitles } from '../topics.js';

const router = Router();
router.use(requireAdmin);

const DAY = 864e5;
const daysAgo = (n) => new Date(Date.now() - n * DAY);
const contains = (q) => (isPostgres ? { contains: q, mode: 'insensitive' } : { contains: q });

const Page = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/* ---------------- Statistika ---------------- */

router.get('/stats', async (req, res) => {
  const [total, admins, blocked, new7d, active7d, active30d, quizCount, avgRow, topTopics, topQuizzes, recent] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'admin' } }),
    prisma.user.count({ where: { blocked: true } }),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.user.count({ where: { lastSeenAt: { gte: daysAgo(7) } } }),
    prisma.user.count({ where: { lastSeenAt: { gte: daysAgo(30) } } }),
    prisma.quizResult.count(),
    prisma.$queryRaw`SELECT AVG(CAST(score AS REAL) / total) AS avg FROM quiz_results`,
    prisma.progress.groupBy({
      by: ['topicId'],
      where: { seen: true },
      _count: { _all: true },
      orderBy: { _count: { topicId: 'desc' } },
      take: 10,
    }),
    prisma.quizResult.groupBy({
      by: ['quizId'],
      _count: { _all: true },
      _sum: { score: true, total: true },
      orderBy: { _count: { quizId: 'desc' } },
      take: 10,
    }),
    prisma.user.findMany({ where: { createdAt: { gte: daysAgo(13.5) } }, select: { createdAt: true } }),
  ]);

  // Oxirgi 14 kun bo'yicha ro'yxatdan o'tishlar (UTC sana).
  const byDay = {};
  for (let i = 13; i >= 0; i--) byDay[daysAgo(i).toISOString().slice(0, 10)] = 0;
  for (const u of recent) {
    const k = u.createdAt.toISOString().slice(0, 10);
    if (k in byDay) byDay[k]++;
  }

  const titles = topicTitles();
  const avg = avgRow[0]?.avg;
  res.json({
    users: { total, admins, blocked, new7d, active7d, active30d },
    quiz: { count: quizCount, avgPercent: avg == null ? null : Math.round(Number(avg) * 1000) / 10 },
    topTopics: topTopics.map((t) => ({ topicId: t.topicId, title: titles[t.topicId] || null, reads: t._count._all })),
    topQuizzes: topQuizzes.map((q) => ({
      quizId: q.quizId,
      attempts: q._count._all,
      avgPercent: q._sum.total ? Math.round((q._sum.score / q._sum.total) * 1000) / 10 : null,
    })),
    registrations: Object.entries(byDay).map(([date, count]) => ({ date, count })),
  });
});

router.get('/topics', (req, res) => {
  res.json({ topics: topicTitles() });
});

/* ---------------- Foydalanuvchilar ---------------- */

const UserQuery = Page.extend({
  q: z.string().trim().max(100).optional(),
  role: z.enum(['user', 'admin']).optional(),
  blocked: z.enum(['0', '1']).optional(),
});

router.get('/users', async (req, res) => {
  const { page, pageSize, q, role, blocked } = parse(UserQuery, req.query);
  const where = {
    ...(q ? { OR: [{ name: contains(q) }, { email: contains(q) }] } : {}),
    ...(role ? { role } : {}),
    ...(blocked ? { blocked: blocked === '1' } : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { quizResults: true, progress: { where: { seen: true } } } } },
    }),
  ]);
  res.json({
    total, page, pageSize,
    items: rows.map((u) => ({
      id: u.id, name: u.name, email: u.email, role: u.role, blocked: u.blocked, lang: u.lang,
      createdAt: u.createdAt, lastSeenAt: u.lastSeenAt,
      quizCount: u._count.quizResults, readCount: u._count.progress,
    })),
  });
});

const IdParam = z.object({ id: z.coerce.number().int().positive() });

router.get('/users/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const u = await prisma.user.findUnique({
    where: { id },
    include: {
      progress: { orderBy: { updatedAt: 'desc' } },
      quizResults: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  });
  if (!u) throw notFound();
  const titles = topicTitles();
  res.json({
    user: {
      id: u.id, name: u.name, email: u.email, role: u.role, blocked: u.blocked, lang: u.lang,
      createdAt: u.createdAt, lastSeenAt: u.lastSeenAt,
    },
    progress: u.progress.map((p) => ({ topicId: p.topicId, title: titles[p.topicId] || null, data: p.data, updatedAt: p.updatedAt })),
    quizResults: u.quizResults.map((r) => ({ id: r.id, quizId: r.quizId, score: r.score, total: r.total, at: r.createdAt })),
  });
});

const UserPatch = z.object({
  role: z.enum(['user', 'admin']).optional(),
  blocked: z.boolean().optional(),
}).strict().refine((b) => b.role !== undefined || b.blocked !== undefined, 'nothing to update');

// Admin o'zini bloklay/o'chira/pasaytira olmaydi — tizim adminsiz qolmasligi uchun.
function notSelf(req, id) {
  if (req.user.id === id) throw new ApiError(400, 'SELF_ACTION');
}

router.patch('/users/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const patch = parse(UserPatch, req.body);
  notSelf(req, id);
  const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw notFound();
  const u = await prisma.user.update({ where: { id }, data: patch });
  if (patch.blocked) await prisma.session.deleteMany({ where: { userId: id } });
  res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role, blocked: u.blocked } });
});

router.delete('/users/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  notSelf(req, id);
  const r = await prisma.user.deleteMany({ where: { id } });
  if (!r.count) throw notFound();
  res.json({ ok: true });
});

/* ---------------- Test natijalari ---------------- */

const QuizQuery = Page.extend({
  userId: z.coerce.number().int().positive().optional(),
  quizId: z.string().max(64).optional(),
  q: z.string().trim().max(100).optional(),
});

const quizWhere = ({ userId, quizId, q }) => ({
  ...(userId ? { userId } : {}),
  ...(quizId ? { quizId } : {}),
  ...(q ? { user: { OR: [{ name: contains(q) }, { email: contains(q) }] } } : {}),
});

router.get('/quiz', async (req, res) => {
  const query = parse(QuizQuery, req.query);
  const where = quizWhere(query);
  const [total, rows] = await Promise.all([
    prisma.quizResult.count({ where }),
    prisma.quizResult.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);
  res.json({
    total, page: query.page, pageSize: query.pageSize,
    items: rows.map((r) => ({ id: r.id, quizId: r.quizId, score: r.score, total: r.total, at: r.createdAt, user: r.user })),
  });
});

// CSV: Excel uchun UTF-8 BOM; "=", "+", "-", "@" bilan boshlanuvchi qiymatlar formula bo'lib ishlamasligi uchun ' qo'shiladi.
function csvCell(v) {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

router.get('/quiz.csv', async (req, res) => {
  const query = parse(QuizQuery.omit({ page: true, pageSize: true }), req.query);
  const rows = await prisma.quizResult.findMany({
    where: quizWhere(query),
    orderBy: { createdAt: 'desc' },
    take: 50000,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  const lines = [['id', 'user_id', 'name', 'email', 'quiz_id', 'score', 'total', 'percent', 'created_at']];
  for (const r of rows) {
    lines.push([r.id, r.user.id, r.user.name, r.user.email, r.quizId, r.score, r.total,
      Math.round((r.score / r.total) * 1000) / 10, r.createdAt.toISOString()]);
  }
  const csv = '﻿' + lines.map((l) => l.map(csvCell).join(',')).join('\r\n') + '\r\n';
  const stamp = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="quiz-results-${stamp}.csv"`);
  res.send(csv);
});

export default router;
