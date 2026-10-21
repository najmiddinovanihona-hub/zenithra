import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { ApiError, parse } from '../http.js';
import { startSession, endSession, dropSession, publicUser } from '../session.js';

const router = Router();

const limitHandler = (req, res) => res.status(429).json({ error: 'RATE_LIMIT' });

// Bitta hisobga: 15 daqiqada 5 ta muvaffaqiyatsiz urinish (IP + email bo'yicha) — bir sinf bitta tarmoqdan
// kirganda bir o'quvchining xatolari boshqalarni bloklamaydi.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => ipKeyGenerator(req.ip) + '|' + String(req.body?.email || '').trim().toLowerCase().slice(0, 254),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: limitHandler,
});
// Bitta IP dan umumiy chegara (ko'p hisoblarni ketma-ket sinab ko'rishga qarshi)
const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: limitHandler,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: limitHandler,
});

const email = z.string().trim().toLowerCase().max(254).email();
// bcrypt parolning faqat birinchi 72 baytini hisobga oladi — uzunroq parolda "dum" e'tiborsiz qolardi
export const password = z.string().min(8).refine((p) => Buffer.byteLength(p, 'utf8') <= 72, 'max 72 bytes');

const RegisterBody = z.object({
  name: z.string().trim().min(1).max(60),
  email,
  password,
  lang: z.enum(['uz', 'ru', 'en']).optional(),
});

const LoginBody = z.object({
  email,
  password: z.string().min(1).max(128),
});

// Mavjud bo'lmagan email uchun ham bcrypt ishlaydi — javob vaqti orqali email borligini bilib bo'lmaydi.
const DUMMY_HASH = bcrypt.hashSync('astro-dummy-password', config.bcryptRounds);

router.post('/register', registerLimiter, async (req, res) => {
  const body = parse(RegisterBody, req.body);
  if (await prisma.user.findUnique({ where: { email: body.email } })) {
    throw new ApiError(409, 'EMAIL_EXISTS');
  }
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, config.bcryptRounds),
      lang: body.lang || 'uz',
      lastSeenAt: new Date(),
    },
  });
  await dropSession(req);   // eski sessiya bazada osilib qolmasin
  await startSession(res, user.id);
  res.status(201).json({ user: publicUser(user) });
});

router.post('/login', loginIpLimiter, loginLimiter, async (req, res) => {
  const body = parse(LoginBody, req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  const ok = await bcrypt.compare(body.password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) throw new ApiError(401, 'INVALID_CREDENTIALS');
  if (user.blocked) throw new ApiError(403, 'BLOCKED');
  await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
  await dropSession(req);   // eski sessiya bazada osilib qolmasin
  await startSession(res, user.id);
  res.json({ user: publicUser(user) });
});

router.post('/logout', async (req, res) => {
  await endSession(req, res);
  res.json({ ok: true });
});

// Mehmon uchun 200 + {user:null}: frontend server borligini shu bilan biladi (konsolda 401 xatosi chiqmaydi).
router.get('/me', (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

export default router;
