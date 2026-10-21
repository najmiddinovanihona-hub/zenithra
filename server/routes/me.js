import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { ApiError, badRequest, parse } from '../http.js';
import { publicUser, requireAuth } from '../session.js';
import { mergeProgress } from '../progress.js';
import { topicTitles } from '../topics.js';

const router = Router();
router.use(requireAuth);

const ID = /^[\w:.-]{1,64}$/;
const MAX_ENTRY_BYTES = 2048;
const MAX_TOPICS = 300;   // bitta foydalanuvchida jami mavzu yozuvlari (darslikda ~45 ta) — bazani cheksiz to'ldirishga qarshi

/* ---------------- Progress ---------------- */

const ProgressEntry = z.record(z.string().max(32), z.union([z.number(), z.string().max(200), z.boolean(), z.null()]));
const ProgressBody = z.object({
  progress: z.record(z.string().regex(ID), ProgressEntry).refine((p) => Object.keys(p).length <= MAX_TOPICS, 'too many topics'),
  mode: z.enum(['merge', 'replace']).default('merge'),
});

async function readProgress(userId) {
  const rows = await prisma.progress.findMany({ where: { userId } });
  return Object.fromEntries(rows.map((r) => [r.topicId, r.data]));
}

router.get('/progress', async (req, res) => {
  res.json({ progress: await readProgress(req.user.id) });
});

// mode=merge (standart): klient yuborgani serverdagisi bilan birlashtiriladi — bir nechta qurilma uchun xavfsiz.
// mode=replace: to'liq almashtirish (masalan, "Belgilarni tozalash").
router.put('/progress', async (req, res) => {
  const { progress, mode } = parse(ProgressBody, req.body);
  for (const [id, entry] of Object.entries(progress)) {
    if (JSON.stringify(entry).length > MAX_ENTRY_BYTES) throw badRequest([{ field: `progress.${id}`, message: 'entry too large' }]);
  }
  const userId = req.user.id;
  await prisma.$transaction(async (tx) => {
    const current = mode === 'replace' ? {} : Object.fromEntries(
      (await tx.progress.findMany({ where: { userId, topicId: { in: Object.keys(progress) } } })).map((r) => [r.topicId, r.data]),
    );
    if (mode === 'replace') await tx.progress.deleteMany({ where: { userId } });
    const next = mergeProgress(current, progress);
    if (mode !== 'replace') {
      const fresh = Object.keys(next).filter((id) => !(id in current));
      const have = await tx.progress.count({ where: { userId } });
      if (have + fresh.length > MAX_TOPICS) throw new ApiError(400, 'TOO_MANY_TOPICS');
    }
    for (const [topicId, data] of Object.entries(next)) {
      const seen = Boolean(data.v);
      await tx.progress.upsert({
        where: { userId_topicId: { userId, topicId } },
        create: { userId, topicId, data, seen },
        update: { data, seen },
      });
    }
  });
  res.json({ progress: await readProgress(userId) });
});

/* ---------------- Test natijalari ---------------- */

const quizLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  keyGenerator: (req) => `u${req.user.id}`,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'RATE_LIMIT' }),
});

const QuizBody = z.object({
  quizId: z.string().regex(ID),
  score: z.number().int().min(0).max(1000),
  total: z.number().int().min(1).max(1000),
}).refine((q) => q.score <= q.total, { message: 'score > total', path: ['score'] });

router.post('/quiz', quizLimiter, async (req, res) => {
  const q = parse(QuizBody, req.body);
  const row = await prisma.quizResult.create({ data: { userId: req.user.id, ...q } });
  res.status(201).json({ result: { id: row.id, quizId: row.quizId, score: row.score, total: row.total, at: row.createdAt } });
});

router.get('/quiz', async (req, res) => {
  const rows = await prisma.quizResult.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json({ results: rows.map((r) => ({ id: r.id, quizId: r.quizId, score: r.score, total: r.total, at: r.createdAt })) });
});

/* ---------------- Sozlamalar ---------------- */

// Joylashuv bu yerda YO'Q: u qurilmaga xos va shaxsiy ma'lumot (aniq GPS, ko'cha) — faqat brauzerda saqlanadi.
const SETTING_KEYS = ['lang', 'voice', 'theme', 'side'];
const SettingsBody = z.object({
  lang: z.enum(['uz', 'ru', 'en']),
  voice: z.boolean(),
  theme: z.enum(['day', 'night']),
  side: z.enum(['open', 'shut']),
}).partial().strict();
// Bazada qolgan eski/noma'lum kalitlar (masalan, oldingi versiyadagi loc) tashqariga chiqmaydi
const pick = (d) => Object.fromEntries(SETTING_KEYS.filter((k) => d && d[k] !== undefined).map((k) => [k, d[k]]));

router.get('/settings', async (req, res) => {
  const s = await prisma.settings.findUnique({ where: { userId: req.user.id } });
  res.json({ settings: { lang: req.user.lang, ...pick(s?.data) } });
});

// Qisman yangilash: faqat yuborilgan kalitlar o'zgaradi. O'qish+yozish bitta tranzaksiyada —
// ikki tab bir vaqtda turli kalitni yozsa, biri ikkinchisini o'chirib yubormaydi.
router.put('/settings', async (req, res) => {
  const patch = parse(SettingsBody, req.body);
  const userId = req.user.id;
  const data = await prisma.$transaction(async (tx) => {
    const cur = await tx.settings.findUnique({ where: { userId } });
    const next = { ...pick(cur?.data), ...patch };
    await tx.settings.upsert({ where: { userId }, create: { userId, data: next }, update: { data: next } });
    return next;
  });
  if (patch.lang && patch.lang !== req.user.lang) {
    await prisma.user.update({ where: { id: userId }, data: { lang: patch.lang } });
  }
  res.json({ settings: { lang: patch.lang || req.user.lang, ...data } });
});

/* ---------------- Profil ---------------- */

const MAIN_TOPIC = /^t\d+$/;   // darslikning asosiy 40 mavzusi (qo'shimcha bo'limlar hisobga kirmaydi)
const pct = (s, t) => (t ? Math.round((s / t) * 1000) / 10 : null);

router.get('/profile', async (req, res) => {
  const userId = req.user.id;
  const [seenRows, agg, results, recent] = await Promise.all([
    prisma.progress.findMany({ where: { userId, seen: true }, select: { topicId: true } }),
    prisma.quizResult.aggregate({ where: { userId }, _count: { _all: true }, _sum: { score: true, total: true } }),
    prisma.quizResult.findMany({ where: { userId }, select: { score: true, total: true } }),
    prisma.quizResult.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);
  const titles = topicTitles();
  const totalTopics = Object.keys(titles).filter((id) => MAIN_TOPIC.test(id)).length || 40;
  const best = results.reduce((m, r) => Math.max(m, pct(r.score, r.total) ?? 0), 0);
  res.json({
    user: { ...publicUser(req.user), createdAt: req.user.createdAt },
    stats: {
      readCount: seenRows.filter((r) => MAIN_TOPIC.test(r.topicId)).length,
      totalTopics,
      quizCount: agg._count._all,
      avgPercent: pct(agg._sum.score, agg._sum.total),
      bestPercent: results.length ? best : null,
    },
    recent: recent.map((r) => {
      const topic = /^topic:(.+)$/.exec(r.quizId)?.[1];
      return { quizId: r.quizId, score: r.score, total: r.total, at: r.createdAt, title: topic ? titles[topic] || null : null };
    }),
  });
});

const ProfileBody = z.object({ name: z.string().trim().min(1).max(60) }).strict();

router.patch('/profile', async (req, res) => {
  const { name } = parse(ProfileBody, req.body);
  const u = await prisma.user.update({ where: { id: req.user.id }, data: { name } });
  res.json({ user: publicUser(u) });
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `u${req.user.id}`,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'RATE_LIMIT' }),
});

const PasswordBody = z.object({
  currentPassword: z.string().min(1).max(128),
  // bcrypt faqat birinchi 72 baytni hisobga oladi
  newPassword: z.string().min(8).refine((p) => Buffer.byteLength(p, 'utf8') <= 72, 'max 72 bytes'),
}).strict();

// Parol o'zgarsa, boshqa qurilmalardagi sessiyalar yopiladi (joriy sessiya qoladi).
router.post('/password', passwordLimiter, async (req, res) => {
  const { currentPassword, newPassword } = parse(PasswordBody, req.body);
  if (!(await bcrypt.compare(currentPassword, req.user.passwordHash))) throw new ApiError(400, 'WRONG_PASSWORD');
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, config.bcryptRounds) },
  });
  await prisma.session.deleteMany({ where: { userId: req.user.id, id: { not: req.sessionId } } });
  res.json({ ok: true });
});

export default router;
