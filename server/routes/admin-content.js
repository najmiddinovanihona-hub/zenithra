// Kontent boshqaruvi (/api/admin/content): admin qo'shgan test savollari (CRUD) va kod ichidagi savollarni yashirish.
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { ApiError, notFound, parse } from '../http.js';
import { topicTitles } from '../topics.js';
import { audit } from '../audit.js';
import { builtinCatalog, QIDS } from '../builtins.js';
import { Page, IdParam, pct } from './admin-util.js';

const router = Router();
const LANGS = ['uz', 'ru', 'en'];
const QUIZ_LEVELS = ['easy', 'medium', 'hard'];
const MAIN_TOPIC = /^t\d+$/;

const statsFor = async (qids) => new Map((await prisma.questionStat.findMany({ where: { qid: { in: qids } } }))
  .map((s) => [s.qid, { shown: s.shown, correct: s.correct, rate: pct(s.correct, s.shown) }]));

const lc = (s) => String(s ?? '').toLowerCase();
// Matn qidiruvi: savol va variantlarning 3 tilidagi matni
const matches = (q, needle) => !needle || [q.question, ...(q.options || []), q.explain || {}]
  .some((o) => LANGS.some((l) => lc(o?.[l]).includes(needle)));

// Darajalar ro'yxati: klassik test darajalari va darslik mavzulari (nomlari bilan) + savollar soni
router.get('/meta', async (req, res) => {
  const titles = topicTitles();
  const cat = builtinCatalog();
  const [custom, hidden] = await Promise.all([
    prisma.quizQuestion.groupBy({ by: ['scope', 'level'], _count: { _all: true } }),
    prisma.questionOverride.findMany({ where: { hidden: true }, select: { qid: true } }),
  ]);
  const count = {};
  const bump = (k, f) => { (count[k] ??= { builtin: 0, hidden: 0, custom: 0 })[f]++; };
  const hid = new Set(hidden.map((h) => h.qid));
  for (const q of cat.items) { bump(`${q.scope}:${q.level}`, 'builtin'); if (hid.has(q.qid)) bump(`${q.scope}:${q.level}`, 'hidden'); }
  for (const g of custom) (count[`${g.scope}:${g.level}`] ??= { builtin: 0, hidden: 0, custom: 0 }).custom = g._count._all;
  res.json({
    builtinOk: cat.ok,
    levels: {
      quiz: QUIZ_LEVELS,
      dz: Object.keys(titles).filter((id) => MAIN_TOPIC.test(id))
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).map((id) => ({ id, title: titles[id] })),
    },
    count,
  });
});

/* ---------------- Admin savollari ---------------- */

const text = (max) => z.string().trim().max(max);
const L3 = (max) => z.object({ uz: text(max).min(1), ru: text(max).min(1), en: text(max).min(1) }).strict();
const L3opt = (max) => z.object({ uz: text(max), ru: text(max), en: text(max) }).strict();

const QuestionBody = z.object({
  scope: z.enum(['quiz', 'dz']),
  level: z.string().regex(/^[a-z0-9_-]{1,24}$/),
  question: L3(500),
  options: z.array(L3(200)).min(2).max(6),
  correct: z.number().int().min(0).max(5),
  explain: L3opt(1000).nullable().optional(),
  active: z.boolean().optional(),
}).strict().superRefine((b, ctx) => {
  const add = (path, message) => ctx.addIssue({ code: 'custom', path, message });
  if (b.correct >= b.options.length) add(['correct'], 'correct out of range');
  if (b.scope === 'quiz' && !QUIZ_LEVELS.includes(b.level)) add(['level'], 'unknown level');
  if (b.scope === 'dz' && !(MAIN_TOPIC.test(b.level) && topicTitles()[b.level])) add(['level'], 'unknown topic');
  for (const l of LANGS) {
    const seen = new Set(b.options.map((o) => lc(o[l])));
    if (seen.size !== b.options.length) add(['options'], `duplicate options (${l})`);
  }
  if (b.explain) {
    const filled = LANGS.filter((l) => b.explain[l]).length;
    if (filled && filled < 3) add(['explain'], 'explanation must be filled in all 3 languages');
  }
});

// Izoh: 3 tilda ham bo'sh bo'lsa — null
const normalize = (b) => ({ ...b, explain: b.explain && LANGS.every((l) => b.explain[l]) ? b.explain : null });

const questionOut = (q, stat) => ({
  id: q.id, qid: QIDS().custom(q.id), scope: q.scope, level: q.level, question: q.question, options: q.options,
  correct: q.correct, explain: q.explain ?? null, active: q.active, createdBy: q.createdBy,
  createdAt: q.createdAt, updatedAt: q.updatedAt, stat: stat || null,
});
// Jurnal uchun qisqa ko'rinish
const brief = (q) => ({
  scope: q.scope, level: q.level, question: String(q.question?.uz ?? '').slice(0, 200),
  options: q.options?.length ?? 0, correct: q.correct, explain: !!q.explain, active: q.active,
});

const ListQuery = Page.extend({
  scope: z.enum(['quiz', 'dz']).optional(),
  level: z.string().regex(/^[a-z0-9_-]{1,24}$/).optional(),
  q: z.string().trim().max(100).optional(),
  active: z.enum(['0', '1']).optional(),
});

router.get('/questions', async (req, res) => {
  const { page, pageSize, scope, level, q, active } = parse(ListQuery, req.query);
  const rows = await prisma.quizQuestion.findMany({
    where: { ...(scope ? { scope } : {}), ...(level ? { level } : {}), ...(active ? { active: active === '1' } : {}) },
    orderBy: { id: 'desc' },
    take: 10000,
  });
  const found = rows.filter((r) => matches(r, lc(q)));
  const items = found.slice((page - 1) * pageSize, page * pageSize);
  const stats = await statsFor(items.map((r) => QIDS().custom(r.id)));
  res.json({ total: found.length, page, pageSize, items: items.map((r) => questionOut(r, stats.get(QIDS().custom(r.id)))) });
});

router.get('/questions/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const q = await prisma.quizQuestion.findUnique({ where: { id } });
  if (!q) throw notFound();
  res.json({ question: questionOut(q, (await statsFor([QIDS().custom(id)])).get(QIDS().custom(id))) });
});

router.post('/questions', async (req, res) => {
  const b = normalize(parse(QuestionBody, req.body));
  const q = await prisma.quizQuestion.create({ data: { ...b, active: b.active ?? true, createdBy: req.user.id } });
  await audit(req, 'content.question.create', { targetType: 'question', targetId: q.id, details: brief(q) });
  res.status(201).json({ question: questionOut(q) });
});

router.put('/questions/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const b = normalize(parse(QuestionBody, req.body));
  const { before, after } = await prisma.$transaction(async (tx) => {
    const before = await tx.quizQuestion.findUnique({ where: { id } });
    if (!before) throw notFound();
    const after = await tx.quizQuestion.update({ where: { id }, data: { ...b, active: b.active ?? before.active } });
    return { before, after };
  });
  await audit(req, 'content.question.update', { targetType: 'question', targetId: id, details: { before: brief(before), after: brief(after) } });
  if (before.active !== after.active) {
    await audit(req, after.active ? 'content.question.activate' : 'content.question.deactivate', { targetType: 'question', targetId: id, details: { question: brief(after).question } });
  }
  res.json({ question: questionOut(after) });
});

const ActiveBody = z.object({ active: z.boolean() }).strict();

router.patch('/questions/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const { active } = parse(ActiveBody, req.body);
  const { before, after } = await prisma.$transaction(async (tx) => {
    const before = await tx.quizQuestion.findUnique({ where: { id } });
    if (!before) throw notFound();
    return { before, after: before.active === active ? before : await tx.quizQuestion.update({ where: { id }, data: { active } }) };
  });
  if (before.active !== after.active) {
    await audit(req, active ? 'content.question.activate' : 'content.question.deactivate', { targetType: 'question', targetId: id, details: { question: brief(after).question } });
  }
  res.json({ question: questionOut(after) });
});

router.delete('/questions/:id', async (req, res) => {
  const { id } = parse(IdParam, req.params);
  const q = await prisma.$transaction(async (tx) => {
    const q = await tx.quizQuestion.findUnique({ where: { id } });
    if (!q) throw notFound();
    await tx.questionStat.deleteMany({ where: { qid: QIDS().custom(id) } });
    await tx.quizQuestion.delete({ where: { id } });
    return q;
  });
  await audit(req, 'content.question.delete', { targetType: 'question', targetId: id, details: brief(q) });
  res.json({ ok: true });
});

/* ---------------- O'rnatilgan (kod ichidagi) savollar ---------------- */

const BuiltinQuery = Page.extend({
  scope: z.enum(['quiz', 'dz']).optional(),
  level: z.string().regex(/^[a-z0-9_-]{1,24}$/).optional(),
  q: z.string().trim().max(100).optional(),
  hidden: z.enum(['0', '1']).optional(),
});

router.get('/builtin', async (req, res) => {
  const { page, pageSize, scope, level, q, hidden } = parse(BuiltinQuery, req.query);
  const cat = builtinCatalog();
  const hid = new Set((await prisma.questionOverride.findMany({ where: { hidden: true }, select: { qid: true } })).map((o) => o.qid));
  const found = cat.items.filter((it) => (!scope || it.scope === scope) && (!level || it.level === level)
    && (!hidden || hid.has(it.qid) === (hidden === '1')) && matches(it, lc(q)));
  const items = found.slice((page - 1) * pageSize, page * pageSize);
  const stats = await statsFor(items.map((it) => it.qid));
  res.json({
    ok: cat.ok, total: found.length, page, pageSize,
    items: items.map((it) => ({ ...it, hidden: hid.has(it.qid), stat: stats.get(it.qid) || null })),
  });
});

const HideBody = z.object({ qid: z.string().max(48), hidden: z.boolean() }).strict();

router.post('/builtin/hidden', async (req, res) => {
  const { qid, hidden } = parse(HideBody, req.body);
  const it = builtinCatalog().byQid.get(qid);
  if (!it) throw new ApiError(404, 'NOT_FOUND');
  const prev = await prisma.questionOverride.findUnique({ where: { qid } });
  if (hidden) await prisma.questionOverride.upsert({ where: { qid }, create: { qid, hidden: true }, update: { hidden: true } });
  else await prisma.questionOverride.deleteMany({ where: { qid } });
  if (!!prev?.hidden !== hidden) {
    await audit(req, hidden ? 'content.builtin.hide' : 'content.builtin.unhide', {
      targetType: 'question', targetId: qid, details: { scope: it.scope, level: it.level, question: it.question.uz.slice(0, 200) },
    });
  }
  res.json({ qid, hidden });
});

export default router;
