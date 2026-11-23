// Admin marshrutlari uchun umumiy yordamchilar
import { z } from 'zod';
import { isPostgres } from '../config.js';

export const DAY = 864e5;
export const daysAgo = (n) => new Date(Date.now() - n * DAY);
export const contains = (q) => (isPostgres ? { contains: q, mode: 'insensitive' } : { contains: q });
export const dayKey = (d) => d.toISOString().slice(0, 10);   // UTC sana
export const pct = (s, t) => (t ? Math.round((s / t) * 1000) / 10 : null);

// Oxirgi n kun (bugun ham) — UTC sanalar, eskisidan yangisiga
export function lastDays(n) {
  const today = new Date(dayKey(new Date()) + 'T00:00:00Z').getTime();
  return Array.from({ length: n }, (_, i) => dayKey(new Date(today - (n - 1 - i) * DAY)));
}

export const Page = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export const eventOut = (e) => ({
  id: e.id, at: e.createdAt, action: e.action, actorId: e.actorId, actorEmail: e.actorEmail,
  targetType: e.targetType, targetId: e.targetId, ip: e.ip, details: e.details,
});
export const IdParam = z.object({ id: z.coerce.number().int().positive() });
