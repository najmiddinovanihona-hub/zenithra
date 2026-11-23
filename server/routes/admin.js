import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { ApiError, notFound, parse } from '../http.js';
import { requireAdmin } from '../session.js';
import { topicTitles } from '../topics.js';
import { audit } from '../audit.js';
import { sendCsv } from '../csv.js';
import { Page, IdParam, contains, daysAgo, pct, eventOut } from './admin-util.js';
import statsRoutes from './admin-stats.js';
import auditRoutes from './admin-audit.js';
import contentRoutes from './admin-content.js';

const router = Router();
router.use(requireAdmin);

/* ---------------- Statistika (umumiy) ---------------- */

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

const userWhere = ({ q, role, blocked }) => ({
  ...(q ? { OR: [{ name: contains(q) }, { email: contains(q) }] } : {}),
  ...(role ? { role } : {}),
  ...(blocked ? { blocked: blocked === '1' } : {}),
});

router.get('/users', async (req, res) => {
  const query = parse(UserQuery, req.query);
  const { page, pageSize } = query;
  const where = userWhere(query);
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

// Foydalanuvchilar CSV (ro'yxatdagi filtrlar bilan)
router.get('/users.csv', async (req, res) => {
  const query = parse(UserQuery.omit({ page: true, pageSize: true }), req.query);
  const LIMIT = 50000;
  const rows = await prisma.user.findMany({
    where: userWhere(query),
    orderBy: { createdAt: 'desc' },
    take: LIMIT + 1,
    include: { _count: { select: { quizResults: true, progress: { where: { seen: true } } } } },
  });
  if (rows.length > LIMIT) { rows.length = LIMIT; res.setHeader('X-Truncated', String(LIMIT)); }
  const sums = new Map((await prisma.quizResult.groupBy({
    by: ['userId'], where: { userId: { in: rows.map((u) => u.id) } }, _sum: { score: true, total: true },
  })).map((g) => [g.userId, g._sum]));
  const lines = [['id', 'name', 'email', 'role', 'blocked', 'email_verified', 'has_password', 'lang', 'created_at', 'last_seen_at', 'topics_read', 'quiz_count', 'avg_percent']];
  for (const u of rows) {
    const s = sums.get(u.id);
    lines.push([u.id, u.name, u.email, u.role, u.blocked ? 1 : 0, u.emailVerified ? 1 : 0, u.passwordHash ? 1 : 0, u.lang,
      u.createdAt.toISOString(), u.lastSeenAt ? u.lastSeenAt.toISOString() : '', u._count.progress, u._count.quizResults,
      s ? pct(s.score, s.total) ?? '' : '']);
  }
  sendCsv(res, 'users', lines);
});

const userOut = (u) => ({
  id: u.id, name: u.name, email: u.email, role: u.role, blocked: u.blocked, lang: u.lang,
  emailVerified: u.emailVerified, hasPassword: !!u.passwordHash, createdAt: u.createdAt, lastSeenAt: u.lastSeenAt,
});

// To'liq ma'lumot: profil, mavzular bo'yicha progress, test natijalari, faol sessiyalar, jurnal yozuvlari
router.get('/users/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const [u, sessions, agg, events] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        progress: { orderBy: { updatedAt: 'desc' } },
        quizResults: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    }),
    prisma.session.count({ where: { userId: id, expiresAt: { gt: new Date() } } }),
    prisma.quizResult.aggregate({ where: { userId: id }, _count: { _all: true }, _sum: { score: true, total: true } }),
    prisma.auditLog.findMany({
      where: { OR: [{ targetType: 'user', targetId: String(id) }, { actorId: id }] },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);
  if (!u) throw notFound();
  const titles = topicTitles();
  res.json({
    user: { ...userOut(u), sessions },
    stats: {
      readCount: u.progress.filter((p) => p.seen).length,
      quizCount: agg._count._all,
      avgPercent: pct(agg._sum.score, agg._sum.total),
    },
    progress: u.progress.map((p) => ({ topicId: p.topicId, title: titles[p.topicId] || null, data: p.data, updatedAt: p.updatedAt })),
    quizResults: u.quizResults.map((r) => ({ id: r.id, quizId: r.quizId, score: r.score, total: r.total, at: r.createdAt })),
    events: events.map(eventOut),
  });
});

const UserPatch = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  email: z.string().trim().toLowerCase().max(254).email().optional(),
  role: z.enum(['user', 'admin']).optional(),
  blocked: z.boolean().optional(),
}).strict().refine((b) => Object.values(b).some((v) => v !== undefined), 'nothing to update');

// Admin o'zini bloklay/o'chira/pasaytira olmaydi — tizim adminsiz qolmasligi uchun.
function notSelf(req, id) {
  if (req.user.id === id) throw new ApiError(400, 'SELF_ACTION');
}
// Ikki admin bir-birini bir vaqtda pasaytirsa ham tizimda kamida bitta faol admin qoladi
async function keepLastAdmin(tx, target, patch) {
  const losesAdmin = target.role === 'admin' && !target.blocked && (patch === null || patch.role === 'user' || patch.blocked === true);
  if (losesAdmin) {
    const others = await tx.user.count({ where: { role: 'admin', blocked: false, id: { not: target.id } } });
    if (others === 0) throw new ApiError(400, 'LAST_ADMIN');
  }
}
async function findUser(tx, id) {
  const u = await tx.user.findUnique({ where: { id } });
  if (!u) throw notFound();
  return u;
}
// Kirish bilan bog'liq hamma narsa: sessiyalar, kutayotgan kodlar va parol o'rnatish ruxsatlari
async function revokeAccess(tx, userId) {
  const { count } = await tx.session.deleteMany({ where: { userId } });
  await tx.authCode.deleteMany({ where: { userId } });
  await tx.passwordSetup.deleteMany({ where: { userId } });
  return count;
}

// Ism va emailni o'zgartirish, bloklash, rol. Email o'zgarsa — sessiyalar yopiladi (yangi manzil kod bilan tasdiqlanadi).
// O'zingizga: faqat ism (rol, blok, email — SELF_ACTION).
router.patch('/users/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const patch = parse(UserPatch, req.body);
  if (patch.role !== undefined || patch.blocked !== undefined || patch.email !== undefined) notSelf(req, id);
  const { before, after, revoked } = await prisma.$transaction(async (tx) => {
    const before = await findUser(tx, id);
    const data = {};
    if (patch.name !== undefined && patch.name !== before.name) data.name = patch.name;
    if (patch.email !== undefined && patch.email !== before.email) {
      if (await tx.user.findUnique({ where: { email: patch.email }, select: { id: true } })) throw new ApiError(409, 'EMAIL_EXISTS');
      data.email = patch.email;
      data.emailVerified = false;
    }
    if (patch.role !== undefined && patch.role !== before.role) data.role = patch.role;
    if (patch.blocked !== undefined && patch.blocked !== before.blocked) data.blocked = patch.blocked;
    await keepLastAdmin(tx, before, data);
    const after = Object.keys(data).length ? await tx.user.update({ where: { id }, data }) : before;
    const revoked = data.email || data.blocked ? await revokeAccess(tx, id) : 0;
    return { before, after, revoked };
  });

  const t = { targetType: 'user', targetId: id };
  if (before.name !== after.name || before.email !== after.email) {
    await audit(req, 'admin.user.update', { ...t, details: {
      before: { name: before.name, email: before.email }, after: { name: after.name, email: after.email },
      ...(before.email !== after.email ? { sessionsRevoked: revoked } : {}),
    } });
  }
  if (before.role !== after.role) await audit(req, 'admin.user.role', { ...t, details: { email: after.email, before: before.role, after: after.role } });
  if (before.blocked !== after.blocked) {
    await audit(req, after.blocked ? 'admin.user.block' : 'admin.user.unblock', { ...t, details: { email: after.email, ...(after.blocked ? { sessionsRevoked: revoked } : {}) } });
  }
  res.json({ user: userOut(after), sessionsRevoked: revoked });
});

router.post('/users/:id/revoke-sessions', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  notSelf(req, id);
  const { u, count } = await prisma.$transaction(async (tx) => {
    const u = await findUser(tx, id);
    return { u, count: (await tx.session.deleteMany({ where: { userId: id } })).count };
  });
  await audit(req, 'admin.user.revoke_sessions', { targetType: 'user', targetId: id, details: { email: u.email, sessionsRevoked: count } });
  res.json({ ok: true, sessionsRevoked: count });
});

// Parolni majburiy tiklash: parol bekor qilinadi (passwordHash = ""), barcha sessiyalar yopiladi.
// Foydalanuvchi saytda "Parolni unutdingizmi?" orqali pochtasiga kelgan kod bilan yangi parol o'rnatadi.
router.post('/users/:id/force-reset', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  notSelf(req, id);
  const { u, count } = await prisma.$transaction(async (tx) => {
    const u = await findUser(tx, id);
    await tx.user.update({ where: { id }, data: { passwordHash: '' } });
    return { u, count: await revokeAccess(tx, id) };
  });
  await audit(req, 'admin.user.force_reset', { targetType: 'user', targetId: id, details: { email: u.email, hadPassword: !!u.passwordHash, sessionsRevoked: count } });
  res.json({ ok: true, sessionsRevoked: count });
});

router.delete('/users/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  notSelf(req, id);
  const u = await prisma.$transaction(async (tx) => {
    const u = await findUser(tx, id);
    await keepLastAdmin(tx, u, null);
    await tx.pushSub.deleteMany({ where: { userId: id } });   // eslatma obunalari (taxminiy joylashuv bilan) ham o'chadi
    await tx.user.delete({ where: { id } });
    return u;
  });
  await audit(req, 'admin.user.delete', { targetType: 'user', targetId: id, details: { email: u.email, name: u.name, role: u.role } });
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

router.get('/quiz.csv', async (req, res) => {
  const query = parse(QuizQuery.omit({ page: true, pageSize: true }), req.query);
  const LIMIT = 50000;
  const rows = await prisma.quizResult.findMany({
    where: quizWhere(query),
    orderBy: { createdAt: 'desc' },
    take: LIMIT + 1,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (rows.length > LIMIT) { rows.length = LIMIT; res.setHeader('X-Truncated', String(LIMIT)); }   // eng yangi 50 000 tasi
  const lines = [['id', 'user_id', 'name', 'email', 'quiz_id', 'score', 'total', 'percent', 'created_at']];
  for (const r of rows) {
    lines.push([r.id, r.user.id, r.user.name, r.user.email, r.quizId, r.score, r.total,
      Math.round((r.score / r.total) * 1000) / 10, r.createdAt.toISOString()]);
  }
  sendCsv(res, 'quiz-results', lines);
});

/* ---------------- Kengaytirilgan statistika, jurnal, kontent ---------------- */
router.use(statsRoutes);
router.use(auditRoutes);
router.use('/content', contentRoutes);

export default router;
