// Harakatlar jurnali (admin panelidagi "Jurnal" bo'limi). Yozish xatosi asosiy amalni hech qachon buzmaydi.
//   audit(req, 'admin.user.block', { targetType: 'user', targetId: 5, details: { blocked: true } })
// actor standart bo'yicha req.user; kirishdan oldingi hodisalar uchun (masalan, auth.login) { actor: user } bering.
import { prisma } from './db.js';

const MAX_DETAILS = 4000;   // details JSON hajmi chegarasi (belgi)

export function audit(req, action, { actor, targetType, targetId, details } = {}) {
  const who = actor === undefined ? req?.user : actor;
  let d = details ?? null;
  if (d != null && JSON.stringify(d).length > MAX_DETAILS) d = { truncated: true };
  return prisma.auditLog.create({
    data: {
      action,
      actorId: who?.id ?? null,
      actorEmail: who?.email ?? null,
      targetType: targetType ?? null,
      targetId: targetId == null ? null : String(targetId),
      ip: req?.ip ?? null,
      details: d,
    },
  }).catch((e) => { console.warn('[audit]', action, e.message); });
}
