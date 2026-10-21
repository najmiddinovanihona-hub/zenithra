import crypto from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { ApiError, parse } from '../http.js';
import { startSession, endSession, dropSession, publicUser } from '../session.js';
import { sendCode } from '../mailer.js';

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

/* ---------- Email orqali tasdiqlash kodi ----------
   Ro'yxatdan o'tish ham, kirish ham ikki bosqichli: (1) parol to'g'ri → pochtaga 6 xonali kod yuboriladi va brauzerga
   "challenge" tokeni beriladi; (2) /verify ga token + kod → sessiya ochiladi. Bazada token ham, kod ham faqat xesh bo'lib
   saqlanadi. Kod 10 daqiqa amal qiladi, 5 ta noto'g'ri urinishdan keyin bekor bo'ladi, qayta yuborish — 60 s da bir marta. */
const CODE_TTL = 10 * 60 * 1000, RESEND_WAIT = 60 * 1000, MAX_ATTEMPTS = 5, MAX_SENDS = 5;
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const codeHash = (id, code) => sha256(id + ':' + code);
const newCode = () => String(crypto.randomInt(0, 1e6)).padStart(6, '0');
// "na***@gmail.com" — kod qaysi pochtaga ketganini ko'rsatish uchun (to'liq manzil qaytarilmaydi)
const maskEmail = (e) => { const [u, d] = e.split('@'); return (u.length <= 2 ? u[0] + '*' : u.slice(0, 2) + '***') + '@' + d; };

async function issueCode(user, purpose) {
  await prisma.authCode.deleteMany({ where: { userId: user.id, purpose } });   // bir vaqtda bitta faol kod
  const token = crypto.randomBytes(24).toString('base64url'), id = sha256(token), code = newCode();
  await prisma.authCode.create({ data: { id, userId: user.id, purpose, codeHash: codeHash(id, code), expiresAt: new Date(Date.now() + CODE_TTL) } });
  try { await sendCode({ to: user.email, name: user.name, lang: user.lang, purpose, code }); }
  catch (e) {
    await prisma.authCode.delete({ where: { id } }).catch(() => {});
    console.warn('[mail]', e.code || '', e.message);
    throw new ApiError(503, e.code === 'MAIL_NOT_CONFIGURED' ? 'MAIL_NOT_CONFIGURED' : 'MAIL_FAILED');
  }
  return { challenge: token, email: maskEmail(user.email), resendIn: RESEND_WAIT / 1000, ttl: CODE_TTL / 1000 };
}

router.post('/register', registerLimiter, async (req, res) => {
  const body = parse(RegisterBody, req.body);
  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  // Tasdiqlanmagan va hech qachon kirilmagan yozuv (kod kiritilmay qolgan) — qayta ro'yxatdan o'tish mumkin.
  // Eski (bu o'zgarishdan oldingi) hisoblarda lastSeenAt bor — ularni hech kim "egallab" ololmaydi.
  if (exists && (exists.emailVerified || exists.lastSeenAt)) throw new ApiError(409, 'EMAIL_EXISTS');
  const data = { name: body.name, passwordHash: await bcrypt.hash(body.password, config.bcryptRounds), lang: body.lang || 'uz' };
  const user = exists
    ? await prisma.user.update({ where: { id: exists.id }, data })
    : await prisma.user.create({ data: { ...data, email: body.email } });
  res.status(202).json({ needCode: true, ...(await issueCode(user, 'register')) });
});

router.post('/login', loginIpLimiter, loginLimiter, async (req, res) => {
  const body = parse(LoginBody, req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  const ok = await bcrypt.compare(body.password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) throw new ApiError(401, 'INVALID_CREDENTIALS');
  if (user.blocked) throw new ApiError(403, 'BLOCKED');
  res.status(202).json({ needCode: true, ...(await issueCode(user, 'login')) });
});

const ChallengeBody = z.object({ challenge: z.string().min(20).max(64) }).strict();
const VerifyBody = z.object({ challenge: z.string().min(20).max(64), code: z.string().trim().regex(/^\d{6}$/) }).strict();
const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: 'draft-8', legacyHeaders: false, handler: limitHandler });

router.post('/verify', verifyLimiter, async (req, res) => {
  const body = parse(VerifyBody, req.body);
  const id = sha256(body.challenge);
  const rec = await prisma.authCode.findUnique({ where: { id }, include: { user: true } });
  if (!rec || rec.expiresAt < new Date()) {
    if (rec) await prisma.authCode.delete({ where: { id } }).catch(() => {});
    throw new ApiError(410, 'CODE_EXPIRED');
  }
  const good = crypto.timingSafeEqual(Buffer.from(codeHash(id, body.code)), Buffer.from(rec.codeHash));
  if (!good) {
    const attempts = rec.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) { await prisma.authCode.delete({ where: { id } }).catch(() => {}); throw new ApiError(429, 'TOO_MANY_ATTEMPTS'); }
    await prisma.authCode.update({ where: { id }, data: { attempts } });
    throw new ApiError(400, 'WRONG_CODE', { left: MAX_ATTEMPTS - attempts });
  }
  await prisma.authCode.deleteMany({ where: { userId: rec.userId } });
  if (rec.user.blocked) throw new ApiError(403, 'BLOCKED');
  const user = await prisma.user.update({ where: { id: rec.userId }, data: { emailVerified: true, lastSeenAt: new Date() } });
  await dropSession(req);   // eski sessiya bazada osilib qolmasin
  await startSession(res, user.id);
  res.status(rec.purpose === 'register' ? 201 : 200).json({ user: publicUser(user) });
});

router.post('/resend', verifyLimiter, async (req, res) => {
  const { challenge } = parse(ChallengeBody, req.body);
  const id = sha256(challenge);
  const rec = await prisma.authCode.findUnique({ where: { id }, include: { user: true } });
  if (!rec || rec.expiresAt < new Date()) throw new ApiError(410, 'CODE_EXPIRED');
  const wait = rec.sentAt.getTime() + RESEND_WAIT - Date.now();
  if (wait > 0) throw new ApiError(429, 'RESEND_WAIT', { wait: Math.ceil(wait / 1000) });
  if (rec.sends >= MAX_SENDS) throw new ApiError(429, 'RATE_LIMIT');
  const code = newCode();
  await prisma.authCode.update({ where: { id }, data: { codeHash: codeHash(id, code), attempts: 0, sends: rec.sends + 1, sentAt: new Date(), expiresAt: new Date(Date.now() + CODE_TTL) } });
  try { await sendCode({ to: rec.user.email, name: rec.user.name, lang: rec.user.lang, purpose: rec.purpose, code }); }
  catch (e) { console.warn('[mail]', e.code || '', e.message); throw new ApiError(503, e.code === 'MAIL_NOT_CONFIGURED' ? 'MAIL_NOT_CONFIGURED' : 'MAIL_FAILED'); }
  res.json({ ok: true, resendIn: RESEND_WAIT / 1000 });
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
