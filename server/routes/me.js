import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { badRequest, parse } from '../http.js';
import { requireAuth } from '../session.js';
import { mergeProgress } from '../progress.js';

const router = Router();
router.use(requireAuth);

const ID = /^[\w:.-]{1,64}$/;
const MAX_ENTRY_BYTES = 2048;

/* ---------------- Progress ---------------- */

const ProgressEntry = z.record(z.string().max(32), z.union([z.number(), z.string().max(200), z.boolean(), z.null()]));
const ProgressBody = z.object({
  progress: z.record(z.string().regex(ID), ProgressEntry).refine((p) => Object.keys(p).length <= 500, 'too many topics'),
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

const Loc = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
}).catchall(z.union([z.string().max(120), z.number(), z.boolean(), z.null()]))
  .refine((o) => Object.keys(o).length <= 12, 'too many fields');

const SettingsBody = z.object({
  lang: z.enum(['uz', 'ru', 'en']),
  voice: z.boolean(),
  theme: z.enum(['day', 'night']),
  side: z.enum(['open', 'shut']),
  loc: Loc.nullable(),
  locManual: z.boolean(),
}).partial().strict();

router.get('/settings', async (req, res) => {
  const s = await prisma.settings.findUnique({ where: { userId: req.user.id } });
  res.json({ settings: { lang: req.user.lang, ...(s?.data || {}) } });
});

// Qisman yangilash: faqat yuborilgan kalitlar o'zgaradi.
router.put('/settings', async (req, res) => {
  const patch = parse(SettingsBody, req.body);
  const userId = req.user.id;
  const cur = await prisma.settings.findUnique({ where: { userId } });
  const data = { ...(cur?.data || {}), ...patch };
  await prisma.settings.upsert({ where: { userId }, create: { userId, data }, update: { data } });
  if (patch.lang && patch.lang !== req.user.lang) {
    await prisma.user.update({ where: { id: userId }, data: { lang: patch.lang } });
  }
  res.json({ settings: { lang: patch.lang || req.user.lang, ...data } });
});

export default router;
