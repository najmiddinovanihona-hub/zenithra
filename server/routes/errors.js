// Xatolar monitori (bepul, o'zimizda): brauzerdagi va serverdagi xatolar AuditLog jadvaliga yoziladi —
//   client.error  (targetType 'client', targetId = fingerprint) — POST /api/errors orqali brauzerdan
//   server.error  (targetType 'server', targetId = fingerprint) — reportServerError(err, req) orqali (500 xatolar)
//   admin.error.resolve (targetType 'error', targetId = fingerprint) — admin "Hal qilindi" tugmasi
// Fingerprint = xato turi + normallashtirilgan xabar + yuqori kadr (fayl:qator). Bir xil xatolar bitta guruhga tushadi.
// Guruh "hal qilingan" — oxirgi hal qilish vaqti oxirgi uchrashdan keyin bo'lsa; xato qayta chiqsa yana ochiq bo'ladi.
// Shaxsiy ma'lumot saqlanmaydi: foydalanuvchi ID/email/IP yozilmaydi (faqat "kirganmi" — true/false),
// URL so'rov qatorlari (?...), emaillar va tokenga o'xshash uzun qatorlar olib tashlanadi.
import crypto from 'node:crypto';
import path from 'node:path';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { ROOT } from '../config.js';
import { ApiError, notFound, parse } from '../http.js';
import { audit } from '../audit.js';
import { sendCsv } from '../csv.js';
import { DAY } from './admin-util.js';

export const ERROR_ACTIONS = ['client.error', 'server.error'];
const RESOLVE = 'admin.error.resolve';
const MAX_MSG = 500, MAX_STACK = 2048, MAX_SRC = 300;

/* ---------------- tozalash (PII) ---------------- */
const EMAIL_RE = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
// Uzun tasodifiy qatorlar (sessiya tokeni, JWT, kalit): 24+ belgi harf/raqam aralash
const TOKEN_RE = /\b(?=[A-Za-z0-9_-]*\d)(?=[A-Za-z0-9_-]*[A-Za-z])[A-Za-z0-9_-]{24,}\b/g;
// URL so'rov qatori va # qismi (faqat yo'lga o'xshash so'zdan keyin: "/a/b?x=1", "file.js?v=3"); ":qator:ustun" qoladi
const QUERY_RE = /([^\s?#'"()]*[/.][^\s?#'"()]*)[?#][^\s'"():]*/g;
// "token=...", "password: ...", "Bearer ..." — qiymati yashiriladi ("Unexpected token '<'" kabi xabarlarga tegmaydi)
const SECRET_RE = /\b(bearer\s+|(?:token|password|parol|secret|api[_-]?key|session)\s*[:=]\s*["']?)[^\s"',;&]+/gi;

export function scrub(s, max) {
  if (s == null) return s;
  let t = String(s)
    .replace(EMAIL_RE, '[email]')
    .replace(SECRET_RE, '$1[hidden]')
    .replace(QUERY_RE, '$1')
    .replace(TOKEN_RE, '[token]');
  // Mutlaq server yo'llari — loyiha ichidagi nisbiy yo'lga (kompyuter/foydalanuvchi nomi chiqmasin)
  t = t.split(ROOT + path.sep).join('').split(ROOT.replaceAll('\\', '/') + '/').join('');
  return max && t.length > max ? t.slice(0, max - 1) + '…' : t;
}
// Sahifa yo'li: faqat pathname (so'rov qatorisiz), "/" bilan boshlanadi
const cleanPage = (p) => {
  const s = String(p || '/').replace(/[?#].*$/, '').slice(0, 200);
  return s.startsWith('/') ? scrub(s) : '/';
};
// Manba fayl: o'z saytimizdagi — faqat yo'l; boshqa domendagi (CDN) — host + yo'l
function cleanSource(src, host) {
  if (!src) return null;
  let s = String(src);
  try {
    const u = new URL(s, 'http://x.invalid');
    s = u.host === 'x.invalid' || (host && u.host === host) ? u.pathname : u.host + u.pathname;
  } catch { s = s.replace(/[?#].*$/, ''); }
  return scrub(s, MAX_SRC);
}

/* ---------------- shovqin (begona kengaytmalar) ---------------- */
const EXT_RE = /(chrome|moz|safari(-web)?|ms-browser)-extension:\/\/|webkit-masked-url:/i;
export function isNoise({ message = '', source = '', stack = '' }) {
  if (/ResizeObserver loop/i.test(message)) return true;
  if (/^(Uncaught )?Script error\.?$/i.test(String(message).trim()) && !source) return true;
  if (EXT_RE.test(source || '') || EXT_RE.test(stack || '') || EXT_RE.test(message || '')) return true;
  return false;
}

/* ---------------- fingerprint ---------------- */
// Raqamlar (vaqt, ID, o'lcham) bitta guruhga tushishi uchun "0" ga almashtiriladi
const normMsg = (m) => String(m || '').replace(/\d+/g, '0').replace(/\s+/g, ' ').trim().slice(0, 200);
export function topFrame(stack) {
  for (const ln of String(stack || '').split('\n')) {
    // V8: "    at fn (file:line:col)" | Firefox/Safari: "fn@file:line:col"
    const m = /(?:\bat\s+(?:.*?\()?|@)(\S+?):(\d+):\d+\)?\s*$/.exec(ln.trim());
    if (m && !/^node:/.test(m[1]) && !/node_modules/.test(m[1])) return `${cleanSource(m[1])}:${m[2]}`;
  }
  return '';
}
export function fingerprint(kind, message, frame) {
  return crypto.createHash('sha1').update(`${kind}\n${normMsg(message)}\n${frame || ''}`).digest('hex').slice(0, 16);
}

/* ---------------- brauzer xatolarini qabul qilish ---------------- */
const intakeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'RATE_LIMIT' }),
});
// Umumiy chegara (ko'p IP dan to'lqin bo'lsa ham baza to'lib ketmasin): soatiga 1000 ta yozuv, ortig'i jim tashlanadi
function budget(max, windowMs) {
  let start = Date.now(), n = 0;
  return () => {
    const now = Date.now();
    if (now - start > windowMs) { start = now; n = 0; }
    return ++n <= max;
  };
}
const clientBudget = budget(1000, 60 * 60 * 1000);
const serverBudget = budget(200, 10 * 60 * 1000);

const ClientError = z.object({
  kind: z.enum(['error', 'rejection', 'resource']),
  message: z.string().min(1).max(1000),
  source: z.string().max(1000).optional(),
  line: z.number().int().min(0).max(1e7).optional(),
  col: z.number().int().min(0).max(1e7).optional(),
  stack: z.string().max(4000).optional(),
  page: z.string().max(1000),
  ua: z.string().max(80).optional(),
  v: z.string().regex(/^[\w.-]{0,20}$/).optional(),
  auth: z.boolean(),
}).strict();

const router = Router();

router.post('/', intakeLimiter, async (req, res) => {
  if (Number(req.get('content-length') || 0) > 16 * 1024) throw new ApiError(413, 'TOO_LARGE');
  const b = parse(ClientError, req.body);
  if (isNoise(b) || !clientBudget()) return res.status(204).end();
  const host = req.get('host');
  const source = cleanSource(b.source, host);
  const stack = b.stack ? scrub(b.stack.replace(/(https?:\/\/[^/\s]+)?(\/[^\s:)]*)/g, (m, origin, p) =>
    !origin || origin.endsWith('//' + host) ? p : m), MAX_STACK) : null;
  const message = scrub(b.message, MAX_MSG);
  const frame = (source ? `${source}:${b.line ?? 0}` : '') || topFrame(stack);
  const details = {
    kind: b.kind, message, source, line: b.line ?? null, col: b.col ?? null, stack,
    page: cleanPage(b.page), ua: b.ua ? scrub(b.ua, 80) : null, v: b.v || null, auth: b.auth,
  };
  // actor: null va req o'rniga null — foydalanuvchi ID/email va IP yozilmaydi
  await audit(null, 'client.error', { actor: null, targetType: 'client', targetId: fingerprint('client', message, frame), details });
  res.status(204).end();
});

/* ---------------- server xatolari ---------------- */
// app.js dagi API xato ishlovchisining 500 shoxobchasidan chaqiriladi. Hech qachon xato otmaydi.
export function reportServerError(err, req) {
  try {
    if (!serverBudget()) return;
    const message = scrub(`${err?.name && err.name !== 'Error' ? err.name + ': ' : ''}${err?.message || String(err)}`, MAX_MSG);
    const stack = err?.stack ? scrub(String(err.stack), MAX_STACK) : null;
    const frame = topFrame(stack);
    const page = cleanPage(((req?.baseUrl || '') + (req?.path || '')) || req?.originalUrl);
    const details = {
      kind: 'server', message, source: frame || null, stack, page,
      method: req?.method || null, code: typeof err?.code === 'string' ? err.code.slice(0, 40) : null, status: 500,
    };
    return audit(null, 'server.error', { actor: null, targetType: 'server', targetId: fingerprint('server', message, frame), details });
  } catch (e) {
    try { console.warn('[errors]', e.message); } catch {}
  }
}

/* ---------------- admin: guruhlar ---------------- */
const Fp = z.object({ fp: z.string().regex(/^[a-f0-9]{16}$/) });
const ListQuery = z.object({
  days: z.coerce.number().int().refine((d) => [1, 7, 30].includes(d)).default(7),
  kind: z.enum(['client', 'server']).optional(),
  status: z.enum(['open', 'resolved', 'all']).default('all'),
});
const MAX_GROUPS = 300;

// Guruhlar ro'yxati (oxirgi uchrash bo'yicha). where — oyna va tur filtri
async function groupsFor({ days, kind }) {
  const where = { action: kind ? `${kind}.error` : { in: ERROR_ACTIONS }, createdAt: { gte: new Date(Date.now() - days * DAY) } };
  const g = await prisma.auditLog.groupBy({
    by: ['action', 'targetId'], where, _count: { _all: true }, _max: { id: true, createdAt: true },
    orderBy: { _max: { id: 'desc' } }, take: MAX_GROUPS,
  });
  if (!g.length) return [];
  const fps = g.map((x) => x.targetId);
  const [first, res, samples, recent] = await Promise.all([
    prisma.auditLog.groupBy({ by: ['targetId'], where: { action: { in: ERROR_ACTIONS }, targetId: { in: fps } }, _min: { createdAt: true } }),
    prisma.auditLog.groupBy({ by: ['targetId'], where: { action: RESOLVE, targetId: { in: fps } }, _max: { createdAt: true } }),
    prisma.auditLog.findMany({ where: { id: { in: g.map((x) => x._max.id) } }, select: { id: true, details: true } }),
    // Ta'sirlangan sahifalar: oynadagi oxirgi 3000 yozuv bo'yicha (taxminiy, lekin yetarli)
    prisma.auditLog.findMany({ where: { ...where, targetId: { in: fps } }, select: { targetId: true, details: true }, orderBy: { id: 'desc' }, take: 3000 }),
  ]);
  const firstBy = new Map(first.map((x) => [x.targetId, x._min.createdAt]));
  const resBy = new Map(res.map((x) => [x.targetId, x._max.createdAt]));
  const sampleBy = new Map(samples.map((x) => [x.id, x.details || {}]));
  const pagesBy = new Map();
  for (const r of recent) {
    const p = r.details?.page; if (!p) continue;
    const m = pagesBy.get(r.targetId) || new Map(); pagesBy.set(r.targetId, m);
    m.set(p, (m.get(p) || 0) + 1);
  }
  return g.map((x) => {
    const d = sampleBy.get(x._max.id) || {};
    const resolvedAt = resBy.get(x.targetId) || null;
    const lastSeen = x._max.createdAt;
    const pages = [...(pagesBy.get(x.targetId) || new Map())].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([page, count]) => ({ page, count }));
    return {
      fp: x.targetId, kind: x.action === 'server.error' ? 'server' : 'client',
      message: d.message ?? '', source: d.source ?? null, line: d.line ?? null, col: d.col ?? null,
      count: x._count._all, firstSeen: firstBy.get(x.targetId) || lastSeen, lastSeen,
      resolvedAt, resolved: !!resolvedAt && resolvedAt >= lastSeen, pages,
    };
  });
}
const sortGroups = (a, b) => (a.resolved - b.resolved) || (b.lastSeen - a.lastSeen);
async function openCount24h() {
  return (await groupsFor({ days: 1 })).filter((g) => !g.resolved).length;
}

export const adminErrors = Router();   // admin.js ichida (requireAdmin dan keyin) ulanadi

adminErrors.get('/errors', async (req, res) => {
  const q = parse(ListQuery, req.query);
  const all = await groupsFor(q);
  const items = all.filter((g) => q.status === 'all' || (q.status === 'open') === !g.resolved).sort(sortGroups);
  res.json({ days: q.days, total: items.length, items, open24h: q.days === 1 && !q.kind ? all.filter((g) => !g.resolved).length : await openCount24h() });
});

adminErrors.get('/errors/summary', async (req, res) => {
  res.json({ open24h: await openCount24h() });
});

adminErrors.get('/errors.csv', async (req, res) => {
  const q = parse(ListQuery, req.query);
  const items = (await groupsFor(q)).filter((g) => q.status === 'all' || (q.status === 'open') === !g.resolved).sort(sortGroups);
  const lines = [['fingerprint', 'kind', 'status', 'message', 'source', 'line', 'count', 'first_seen', 'last_seen', 'resolved_at', 'pages']];
  for (const g of items) {
    lines.push([g.fp, g.kind, g.resolved ? 'resolved' : 'open', g.message, g.source ?? '', g.line ?? '', g.count,
      new Date(g.firstSeen).toISOString(), new Date(g.lastSeen).toISOString(), g.resolvedAt ? new Date(g.resolvedAt).toISOString() : '',
      g.pages.map((p) => `${p.page} (${p.count})`).join(' ')]);
  }
  sendCsv(res, 'errors', lines);
});

adminErrors.get('/errors/:fp', async (req, res) => {
  const { fp } = parse(Fp, req.params);
  const where = { action: { in: ERROR_ACTIONS }, targetId: fp };
  const [agg, rows, resolutions] = await Promise.all([
    prisma.auditLog.aggregate({ where, _count: { _all: true }, _min: { createdAt: true }, _max: { createdAt: true } }),
    prisma.auditLog.findMany({ where, orderBy: { id: 'desc' }, take: 20 }),
    prisma.auditLog.findMany({ where: { action: RESOLVE, targetId: fp }, orderBy: { id: 'desc' }, take: 10 }),
  ]);
  if (!rows.length) throw notFound();
  const lastSeen = agg._max.createdAt, resolvedAt = resolutions[0]?.createdAt || null;
  const d = rows[0].details || {};
  res.json({
    group: {
      fp, kind: rows[0].action === 'server.error' ? 'server' : 'client', message: d.message ?? '', source: d.source ?? null,
      line: d.line ?? null, col: d.col ?? null, count: agg._count._all, firstSeen: agg._min.createdAt, lastSeen,
      resolvedAt, resolved: !!resolvedAt && resolvedAt >= lastSeen,
    },
    samples: rows.map((r) => ({ id: r.id, at: r.createdAt, details: r.details })),
    resolutions: resolutions.map((r) => ({ at: r.createdAt, actorEmail: r.actorEmail })),
  });
});

adminErrors.post('/errors/:fp/resolve', async (req, res) => {
  const { fp } = parse(Fp, req.params);
  const last = await prisma.auditLog.findFirst({ where: { action: { in: ERROR_ACTIONS }, targetId: fp }, orderBy: { id: 'desc' } });
  if (!last) throw notFound();
  await audit(req, RESOLVE, { targetType: 'error', targetId: fp, details: { message: String(last.details?.message || '').slice(0, 200) } });
  res.json({ ok: true, open24h: await openCount24h() });
});

export default router;
