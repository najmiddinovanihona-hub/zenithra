// Ommaviy kontent API (/api/content): admin qo'shgan faol test savollari, yashirilgan o'rnatilgan savollar
// va savollar bo'yicha javob statistikasini yig'ish (mehmonlar uchun ham).
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { parse } from '../http.js';
import { Answers, recordAnswers } from '../answers.js';

const router = Router();

export const publicQuestion = (q) => ({
  qid: `c:${q.id}`, scope: q.scope, level: q.level,
  question: q.question, options: q.options, correct: q.correct, explain: q.explain ?? null,
});

// Sayt bir marta (sahifa ochilganda) oladi: { custom: [...], hidden: ["b:quiz:easy:..."] }
router.get('/questions', async (req, res) => {
  const [custom, hidden] = await Promise.all([
    prisma.quizQuestion.findMany({ where: { active: true }, orderBy: { id: 'asc' }, take: 5000 }),
    prisma.questionOverride.findMany({ where: { hidden: true }, select: { qid: true }, take: 20000 }),
  ]);
  res.json({ custom: custom.map(publicQuestion), hidden: hidden.map((h) => h.qid) });
});

// Javoblar statistikasi: IP bo'yicha 10 daqiqada 15 ta so'rov (bitta test — bitta so'rov, ≤ 50 javob)
const answersLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'RATE_LIMIT' }),
});

const AnswersBody = z.object({
  answers: Answers,
  quizId: z.string().regex(/^[\w:.-]{1,64}$/).optional(),
}).strict();

router.post('/answers', answersLimiter, async (req, res) => {
  const { answers } = parse(AnswersBody, req.body);
  const counted = await recordAnswers(answers);
  res.json({ ok: true, counted });
});

export default router;
