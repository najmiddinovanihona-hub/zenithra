// Harakatlar jurnali (admin panelidagi "Jurnal"): filtrlar, sahifalash, CSV eksport.
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { parse } from '../http.js';
import { sendCsv } from '../csv.js';
import { Page, contains, eventOut } from './admin-util.js';

const router = Router();

const AuditFilter = z.object({
  // aniq nom ("admin.user.block") yoki prefiks ("admin.user.*" yoki "admin.user.")
  action: z.string().regex(/^[a-z_.]{1,64}\*?$/).optional(),
  actor: z.string().trim().max(100).optional(),               // bajaruvchi email bo'yicha qidiruv
  target: z.string().trim().max(100).optional(),              // foydalanuvchi ID yoki email qismi
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  // Xatolar monitori yozuvlari (client.* / server.*) standart bo'yicha yashiriladi — "Xatolar" bo'limida ko'rinadi.
  // sys=1 — ularni ham ko'rsatish; amal filtri aniq "client."/"server." bo'lsa ham ko'rsatiladi.
  sys: z.enum(['0', '1']).optional(),
});
const AuditQuery = Page.extend(AuditFilter.shape);

const SYS_PREFIXES = ['client.', 'server.'];
async function auditWhere({ action, actor, target, from, to, sys }) {
  const w = {};
  if (action) w.action = /[*.]$/.test(action) ? { startsWith: action.replace(/\*$/, '') } : action;
  if (sys !== '1' && !(action && SYS_PREFIXES.some((p) => action.startsWith(p)))) {
    w.NOT = SYS_PREFIXES.map((p) => ({ action: { startsWith: p } }));
  }
  if (actor) w.actorEmail = contains(actor.toLowerCase());
  if (target) {
    w.targetType = 'user';
    if (/^\d{1,10}$/.test(target)) w.targetId = target;
    else {
      const ids = await prisma.user.findMany({ where: { email: contains(target.toLowerCase()) }, select: { id: true }, take: 500 });
      w.targetId = { in: ids.map((u) => String(u.id)) };
    }
  }
  if (from || to) w.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };
  return w;
}

router.get('/audit', async (req, res) => {
  const q = parse(AuditQuery, req.query);
  const where = await auditWhere(q);
  const [total, rows] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ where, orderBy: { id: 'desc' }, skip: (q.page - 1) * q.pageSize, take: q.pageSize }),
  ]);
  // Nishondagi foydalanuvchining hozirgi ismi/emaili (o'chirilgan bo'lsa — null, details.email qoladi)
  const ids = [...new Set(rows.filter((r) => r.targetType === 'user' && /^\d+$/.test(r.targetId || '')).map((r) => Number(r.targetId)))];
  const users = new Map((await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, email: true } })).map((u) => [String(u.id), u]));
  res.json({
    total, page: q.page, pageSize: q.pageSize,
    items: rows.map((r) => ({ ...eventOut(r), target: r.targetType === 'user' ? users.get(r.targetId) || null : null })),
  });
});

// Filtr ro'yxati uchun: mavjud amallar va ularning soni
router.get('/audit/actions', async (req, res) => {
  const rows = await prisma.auditLog.groupBy({ by: ['action'], _count: { _all: true }, orderBy: { action: 'asc' } });
  res.json({ actions: rows.map((r) => ({ action: r.action, count: r._count._all })) });
});

router.get('/audit.csv', async (req, res) => {
  const q = parse(AuditFilter, req.query);
  const LIMIT = 50000;
  const rows = await prisma.auditLog.findMany({ where: await auditWhere(q), orderBy: { id: 'desc' }, take: LIMIT + 1 });
  if (rows.length > LIMIT) { rows.length = LIMIT; res.setHeader('X-Truncated', String(LIMIT)); }
  const lines = [['id', 'created_at', 'action', 'actor_id', 'actor_email', 'target_type', 'target_id', 'ip', 'details']];
  for (const r of rows) {
    lines.push([r.id, r.createdAt.toISOString(), r.action, r.actorId ?? '', r.actorEmail ?? '', r.targetType ?? '', r.targetId ?? '', r.ip ?? '',
      r.details == null ? '' : JSON.stringify(r.details)]);
  }
  sendCsv(res, 'audit-log', lines);
});

export default router;
