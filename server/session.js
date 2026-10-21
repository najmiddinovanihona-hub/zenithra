import crypto from 'node:crypto';
import { prisma } from './db.js';
import { config } from './config.js';
import { ApiError } from './http.js';

export const COOKIE = 'astro_sid';
const SEEN_EVERY_MS = 5 * 60 * 1000;

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

const cookieOpts = () => ({
  httpOnly: true,
  secure: config.cookieSecure,
  sameSite: 'lax',
  path: '/',
});

export function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, lang: u.lang };
}

// Yangi sessiya: brauzerga tasodifiy token, bazaga faqat uning xeshi.
export async function startSession(res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + config.sessionDays * 864e5);
  await prisma.session.create({ data: { id: sha256(token), userId, expiresAt } });
  res.cookie(COOKIE, token, { ...cookieOpts(), expires: expiresAt });
}

export async function endSession(req, res) {
  const token = req.cookies?.[COOKIE];
  if (token) await prisma.session.deleteMany({ where: { id: sha256(token) } });
  res.clearCookie(COOKIE, cookieOpts());
}

// Har bir /api so'rovida: cookie bo'lsa foydalanuvchini req.user ga yuklaydi.
export async function loadUser(req, res, next) {
  req.user = null;
  const token = req.cookies?.[COOKIE];
  if (!token) return next();
  const s = await prisma.session.findUnique({ where: { id: sha256(token) }, include: { user: true } });
  if (!s || s.expiresAt < new Date() || s.user.blocked) {
    if (s) await prisma.session.delete({ where: { id: s.id } }).catch(() => {});
    res.clearCookie(COOKIE, cookieOpts());
    return next();
  }
  req.user = s.user;
  if (!s.user.lastSeenAt || Date.now() - s.user.lastSeenAt.getTime() > SEEN_EVERY_MS) {
    prisma.user.update({ where: { id: s.user.id }, data: { lastSeenAt: new Date() } }).catch(() => {});
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) throw new ApiError(401, 'UNAUTHORIZED');
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) throw new ApiError(401, 'UNAUTHORIZED');
  if (req.user.role !== 'admin') throw new ApiError(403, 'FORBIDDEN');
  next();
}
