import crypto from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { ApiError, badRequest, parse } from '../http.js';
import { startSession, endSession, dropSession, publicUser } from '../session.js';
import { sendCode } from '../mailer.js';
import { audit } from '../audit.js';

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
// Parolni tiklash so'rovlari (begona pochtalarni xatga ko'mishga va hisoblarni sinab chiqishga qarshi)
const resetLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, handler: limitHandler });
const setupLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, handler: limitHandler });

const email = z.string().trim().toLowerCase().max(254).email();
// bcrypt parolning faqat birinchi 72 baytini hisobga oladi — uzunroq parolda "dum" e'tiborsiz qolardi
export const password = z.string().min(8).refine((p) => Buffer.byteLength(p, 'utf8') <= 72, 'max 72 bytes');
const lang = z.enum(['uz', 'ru', 'en']).optional();

const RegisterBody = z.object({ email, lang }).strict();
const ResetBody = z.object({ email, lang }).strict();
const LoginBody = z.object({ email, password: z.string().min(1).max(128) }).strict();
const SetPasswordBody = z.object({
  setup: z.string().min(20).max(64),
  password,
  name: z.string().trim().min(1).max(60).optional(),   // ro'yxatdan o'tishda majburiy, tiklashda e'tiborsiz
}).strict();

// Mavjud bo'lmagan email (yoki parolsiz hisob) uchun ham bcrypt ishlaydi — javob vaqti orqali email borligini bilib bo'lmaydi.
const DUMMY_HASH = bcrypt.hashSync('astro-dummy-password', config.bcryptRounds);

/* ---------- Email orqali tasdiqlash kodi ----------
   (1) email (+ parol) → pochtaga 6 xonali kod, brauzerga "challenge" tokeni; (2) /verify ga token + kod:
     login, admin-login — sessiya ochiladi; register, reset — sessiya OCHILMAYDI, parol o'rnatish ruxsati ("setup") beriladi;
   (3) /password ga setup + parol → parol o'rnatiladi va sessiya ochiladi.
   Bazada token ham, kod ham faqat xesh bo'lib saqlanadi. Kod 10 daqiqa amal qiladi, 5 ta noto'g'ri urinishdan keyin bekor
   bo'ladi, qayta yuborish — 60 s da bir marta. */
const CODE_TTL = 10 * 60 * 1000, RESEND_WAIT = 60 * 1000, MAX_ATTEMPTS = 5, MAX_SENDS = 5;
const SETUP_TTL = 30 * 60 * 1000, ADMIN_SESSION = 12 * 3600 * 1000;
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const codeHash = (id, code) => sha256(id + ':' + code);
const newCode = () => String(crypto.randomInt(0, 1e6)).padStart(6, '0');
const newToken = () => crypto.randomBytes(24).toString('base64url');
// "na***@gmail.com" — kod qaysi pochtaga ketganini ko'rsatish uchun (to'liq manzil qaytarilmaydi)
const maskEmail = (e) => { const [u, d] = e.split('@'); return (u.length <= 2 ? u[0] + '*' : u.slice(0, 2) + '***') + '@' + d; };
const codeReply = (token, to) => ({ needCode: true, challenge: token, email: maskEmail(to), resendIn: RESEND_WAIT / 1000, ttl: CODE_TTL / 1000 });
const mailError = (e) => { console.warn('[mail]', e.code || '', e.message); return new ApiError(503, e.code === 'MAIL_NOT_CONFIGURED' ? 'MAIL_NOT_CONFIGURED' : 'MAIL_FAILED'); };

// Bitta pochtaga xatlar oqimini cheklaydi (qayta ro'yxatdan o'tish / kirish orqali begona pochtani xatga ko'mib
// tashlashga qarshi): oldingi koddan 60 s o'tmagan bo'lsa yoki faol zanjirda 5 ta xat yuborilgan bo'lsa — rad etiladi.
// Qaytaradi: yangi kod nechanchi xat bo'lishi (sends).
function quota(prev) {
  if (!prev) return 1;
  const wait = prev.sentAt.getTime() + RESEND_WAIT - Date.now();
  if (wait > 0) throw new ApiError(429, 'RATE_LIMIT', { wait: Math.ceil(wait / 1000) });
  if (prev.sends >= MAX_SENDS) throw new ApiError(429, 'RATE_LIMIT');
  return prev.sends + 1;
}
async function sendQuota(userId, purpose) {
  return quota(await prisma.authCode.findFirst({ where: { userId, purpose, expiresAt: { gt: new Date() } }, orderBy: { sentAt: 'desc' } }));
}

// background: xat javobni kutmasdan yuboriladi va xatosi qaytarilmaydi (parolni tiklash — javob vaqti va 503 orqali
// hisob borligi bilinmasin).
async function issueCode(user, purpose, sends = 1, { background = false } = {}) {
  await prisma.authCode.deleteMany({ where: { userId: user.id, purpose } });   // bir vaqtda bitta faol kod
  const token = newToken(), id = sha256(token), code = newCode();
  await prisma.authCode.create({ data: { id, userId: user.id, purpose, sends, codeHash: codeHash(id, code), expiresAt: new Date(Date.now() + CODE_TTL) } });
  const mail = sendCode({ to: user.email, name: user.name, lang: user.lang, purpose, code });
  if (background) mail.catch((e) => console.warn('[mail]', purpose, e.code || '', e.message));
  else {
    try { await mail; }
    catch (e) { await prisma.authCode.delete({ where: { id } }).catch(() => {}); throw mailError(e); }
  }
  return codeReply(token, user.email);
}

/* ---------- "Soxta" zanjir (parolni tiklash: hisob yo'q / bloklangan / tasdiqlanmagan) ----------
   Javoblar haqiqiysidan farq qilmaydi: /reset, /verify (WRONG_CODE + qolgan urinishlar), /resend va 60 s / 5 xat
   cheklovlari bir xil ishlaydi, faqat xat yuborilmaydi. Xotirada saqlanadi (server qayta ishga tushsa — eskiradi). */
const decoys = new Map();        // sha256(challenge) → { email, attempts, sends, sentAt, expiresAt }
const decoyByEmail = new Map();  // email → sha256(challenge)
const MAX_DECOYS = 5000;
function pruneDecoys() {
  const now = Date.now();
  for (const [id, d] of decoys) if (d.expiresAt.getTime() < now) { decoys.delete(id); if (decoyByEmail.get(d.email) === id) decoyByEmail.delete(d.email); }
  while (decoys.size >= MAX_DECOYS) { const [id, d] = decoys.entries().next().value; decoys.delete(id); decoyByEmail.delete(d.email); }
}
function issueDecoy(to) {
  pruneDecoys();
  const prevId = decoyByEmail.get(to), prev = prevId && decoys.get(prevId);
  const sends = quota(prev);
  if (prevId) decoys.delete(prevId);
  const token = newToken(), id = sha256(token);
  decoys.set(id, { email: to, attempts: 0, sends, sentAt: new Date(), expiresAt: new Date(Date.now() + CODE_TTL) });
  decoyByEmail.set(to, id);
  return codeReply(token, to);
}
function dropDecoy(id) { const d = decoys.get(id); decoys.delete(id); if (d && decoyByEmail.get(d.email) === id) decoyByEmail.delete(d.email); }

// Email + parolni tekshiradi; to'g'ri bo'lsa foydalanuvchini qaytaradi. Parolsiz ("") hisobda bcrypt.compare("")
// chaqirilmaydi — DUMMY_HASH bilan solishtiriladi (vaqt bir xil) va natija har doim "noto'g'ri".
async function checkCredentials(body) {
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  const hasPass = !!user?.passwordHash;
  const ok = await bcrypt.compare(body.password, hasPass ? user.passwordHash : DUMMY_HASH);
  return hasPass && ok ? user : null;
}

/* ---------- Ro'yxatdan o'tish: email → kod → ism + parol ---------- */
router.post('/register', registerLimiter, async (req, res) => {
  const body = parse(RegisterBody, req.body);
  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  // Tasdiqlanmagan va hech qachon kirilmagan yozuv (kod kiritilmay qolgan) — qayta ro'yxatdan o'tish mumkin.
  // Eski (bu o'zgarishdan oldingi) hisoblarda lastSeenAt bor — ularni hech kim "egallab" ololmaydi.
  if (exists && (exists.emailVerified || exists.lastSeenAt)) throw new ApiError(409, 'EMAIL_EXISTS');
  const sends = exists ? await sendQuota(exists.id, 'register') : 1;   // yozuv o'zgartirilishidan OLDIN tekshiriladi
  const data = { name: '', passwordHash: '', lang: body.lang || 'uz' };
  const user = exists
    ? await prisma.user.update({ where: { id: exists.id }, data })
    : await prisma.user.create({ data: { ...data, email: body.email } });
  const reply = await issueCode(user, 'register', sends);
  audit(req, 'auth.register_start', { actor: user, targetType: 'user', targetId: user.id, details: { email: user.email } });
  res.status(202).json(reply);
});

/* ---------- Kirish: email + parol → sessiya (standart) ----------
   Pochta kodi faqat bir marta — ro'yxatdan o'tishda (email egasi ekanini isbotlash) va parolni tiklashda so'raladi.
   Parol o'rnatilgan hisob pochtasi allaqachon tasdiqlangan. Parolni taxmin qilishga qarshi: IP+email bo'yicha 15 daqiqada
   5 ta, IP bo'yicha 50 ta muvaffaqiyatsiz urinish. Admin paneli uchun kod saqlanadi (/admin/login). */
router.post('/login', loginIpLimiter, loginLimiter, async (req, res) => {
  const body = parse(LoginBody, req.body);
  const found = await checkCredentials(body);
  if (!found) {
    audit(req, 'auth.login_failed', { actor: null, details: { email: body.email } });
    throw new ApiError(401, 'INVALID_CREDENTIALS');
  }
  if (found.blocked) throw new ApiError(403, 'BLOCKED');
  const user = await prisma.user.update({ where: { id: found.id }, data: { lastSeenAt: new Date() } });
  await dropSession(req);   // eski sessiya bazada osilib qolmasin
  await startSession(res, user.id);
  audit(req, 'auth.login', { actor: user, targetType: 'user', targetId: user.id });
  res.json({ user: publicUser(user) });
});

// Admin paneli uchun alohida kirish: parol noto'g'ri, hisob admin emas yoki bloklangan — hammasi bir xil 401 va xat
// yuborilmaydi (admin hisoblarini aniqlab bo'lmaydi). Sessiya qisqaroq — 12 soat.
router.post('/admin/login', loginIpLimiter, loginLimiter, async (req, res) => {
  const body = parse(LoginBody, req.body);
  const user = await checkCredentials(body);
  if (!user || user.role !== 'admin' || user.blocked) {
    audit(req, 'auth.admin_login_failed', { actor: null, details: { email: body.email } });
    throw new ApiError(401, 'INVALID_CREDENTIALS');
  }
  const sends = await sendQuota(user.id, 'admin-login');
  res.status(202).json(await issueCode(user, 'admin-login', sends));
});

/* ---------- Parolni tiklash: email → kod → yangi parol ---------- */
router.post('/reset', resetLimiter, async (req, res) => {
  const body = parse(ResetBody, req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || user.blocked || !(user.emailVerified || user.lastSeenAt)) return res.status(202).json(issueDecoy(body.email));
  const sends = await sendQuota(user.id, 'reset');
  const reply = await issueCode(user, 'reset', sends, { background: true });
  audit(req, 'auth.reset_start', { actor: user, targetType: 'user', targetId: user.id, details: { email: user.email } });
  res.status(202).json(reply);
});

const ChallengeBody = z.object({ challenge: z.string().min(20).max(64) }).strict();
const VerifyBody = z.object({ challenge: z.string().min(20).max(64), code: z.string().trim().regex(/^\d{6}$/) }).strict();
// Faqat muvaffaqiyatsiz urinishlar sanaladi (to'g'ri kod — pochtaga kirish isboti; bitta tarmoqdagi sinf bloklanmasin)
const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, skipSuccessfulRequests: true, standardHeaders: 'draft-8', legacyHeaders: false, handler: limitHandler });

router.post('/verify', verifyLimiter, async (req, res) => {
  const body = parse(VerifyBody, req.body);
  const id = sha256(body.challenge);
  const rec = await prisma.authCode.findUnique({ where: { id }, include: { user: true } });
  if (!rec) {
    // soxta zanjir: kod hech qachon to'g'ri emas, lekin javoblar haqiqiysi kabi
    const d = decoys.get(id);
    if (!d || d.expiresAt < new Date()) { dropDecoy(id); throw new ApiError(410, 'CODE_EXPIRED'); }
    if (++d.attempts >= MAX_ATTEMPTS) { dropDecoy(id); throw new ApiError(429, 'TOO_MANY_ATTEMPTS'); }
    throw new ApiError(400, 'WRONG_CODE', { left: MAX_ATTEMPTS - d.attempts });
  }
  if (rec.expiresAt < new Date()) {
    await prisma.authCode.delete({ where: { id } }).catch(() => {});
    throw new ApiError(410, 'CODE_EXPIRED');
  }
  const tooMany = async () => {
    await prisma.authCode.deleteMany({ where: { id } });
    audit(req, 'auth.code_failed', { actor: rec.user, targetType: 'user', targetId: rec.userId, details: { purpose: rec.purpose } });
    return new ApiError(429, 'TOO_MANY_ATTEMPTS');
  };
  // Urinish kod tekshirilishidan OLDIN atomik "band qilinadi" — parallel so'rovlar 5 ta chegarani aylanib o'ta olmaydi.
  const slot = await prisma.authCode.updateMany({ where: { id, attempts: { lt: MAX_ATTEMPTS } }, data: { attempts: { increment: 1 } } });
  if (!slot.count) throw await tooMany();
  const good = crypto.timingSafeEqual(Buffer.from(codeHash(id, body.code)), Buffer.from(rec.codeHash));
  if (!good) {
    const cur = await prisma.authCode.findUnique({ where: { id }, select: { attempts: true } });
    if (!cur || cur.attempts >= MAX_ATTEMPTS) throw await tooMany();
    throw new ApiError(400, 'WRONG_CODE', { left: MAX_ATTEMPTS - cur.attempts });
  }
  // Kod bir martalik: atomik o'chiriladi — bir xil kod bilan parallel ikkinchi so'rov o'tmaydi
  const used = await prisma.authCode.deleteMany({ where: { id } });
  if (!used.count) throw new ApiError(410, 'CODE_EXPIRED');
  await prisma.authCode.deleteMany({ where: { userId: rec.userId } });
  const u = await prisma.user.findUnique({ where: { id: rec.userId } });
  if (!u) throw new ApiError(410, 'CODE_EXPIRED');
  if (u.blocked) throw new ApiError(403, 'BLOCKED');

  // Ro'yxatdan o'tish / tiklash: sessiya ochilmaydi — parol o'rnatish uchun bir martalik ruxsat beriladi
  if (rec.purpose === 'register' || rec.purpose === 'reset') {
    const setup = newToken();
    await prisma.$transaction([
      prisma.passwordSetup.deleteMany({ where: { userId: u.id } }),
      prisma.passwordSetup.create({ data: { id: sha256(setup), userId: u.id, purpose: rec.purpose, expiresAt: new Date(Date.now() + SETUP_TTL) } }),
    ]);
    return res.json({ setup, purpose: rec.purpose, ttl: SETUP_TTL / 1000 });
  }

  const admin = rec.purpose === 'admin-login';
  if (admin && u.role !== 'admin') throw new ApiError(403, 'FORBIDDEN');   // kod yuborilgandan keyin roli olib tashlangan
  if (!u.passwordHash) throw new ApiError(401, 'INVALID_CREDENTIALS');     // shu orada parol bekor qilingan
  const user = await prisma.user.update({ where: { id: u.id }, data: { emailVerified: true, lastSeenAt: new Date() } });
  await dropSession(req);   // eski sessiya bazada osilib qolmasin
  await startSession(res, user.id, admin ? ADMIN_SESSION : undefined);
  audit(req, admin ? 'auth.admin_login' : 'auth.login', { actor: user, targetType: 'user', targetId: user.id });
  res.json({ user: publicUser(user) });
});

router.post('/resend', verifyLimiter, async (req, res) => {
  const { challenge } = parse(ChallengeBody, req.body);
  const id = sha256(challenge);
  const rec = await prisma.authCode.findUnique({ where: { id }, include: { user: true } });
  const cur = rec || decoys.get(id);
  if (!cur || cur.expiresAt < new Date()) throw new ApiError(410, 'CODE_EXPIRED');
  const wait = cur.sentAt.getTime() + RESEND_WAIT - Date.now();
  if (wait > 0) throw new ApiError(429, 'RESEND_WAIT', { wait: Math.ceil(wait / 1000) });
  if (cur.sends >= MAX_SENDS) throw new ApiError(429, 'RATE_LIMIT');
  const next = { attempts: 0, sends: cur.sends + 1, sentAt: new Date(), expiresAt: new Date(Date.now() + CODE_TTL) };
  if (!rec) { Object.assign(cur, next); return res.json({ ok: true, resendIn: RESEND_WAIT / 1000 }); }
  const code = newCode();
  await prisma.authCode.update({ where: { id }, data: { ...next, codeHash: codeHash(id, code) } });
  const mail = sendCode({ to: rec.user.email, name: rec.user.name, lang: rec.user.lang, purpose: rec.purpose, code });
  if (rec.purpose === 'reset') mail.catch((e) => console.warn('[mail]', 'reset', e.code || '', e.message));
  else { try { await mail; } catch (e) { throw mailError(e); } }
  res.json({ ok: true, resendIn: RESEND_WAIT / 1000 });
});

/* ---------- Parol o'rnatish (ro'yxatdan o'tishni yakunlash yoki tiklash) ---------- */
router.post('/password', setupLimiter, async (req, res) => {
  const body = parse(SetPasswordBody, req.body);
  const id = sha256(body.setup);
  const s = await prisma.passwordSetup.findUnique({ where: { id }, include: { user: true } });
  if (!s || s.expiresAt < new Date()) {
    if (s) await prisma.passwordSetup.deleteMany({ where: { id } });
    throw new ApiError(410, 'SETUP_EXPIRED');
  }
  const register = s.purpose === 'register';
  if (register && !body.name) throw badRequest([{ field: 'name', message: 'required' }]);
  if (s.user.blocked) throw new ApiError(403, 'BLOCKED');
  // Ruxsat bir martalik: atomik o'chiriladi — parallel ikkinchi so'rov o'tmaydi
  const used = await prisma.passwordSetup.deleteMany({ where: { id } });
  if (!used.count) throw new ApiError(410, 'SETUP_EXPIRED');
  const data = { passwordHash: await bcrypt.hash(body.password, config.bcryptRounds), emailVerified: true, lastSeenAt: new Date() };
  if (register) data.name = body.name;
  const [user] = await prisma.$transaction([
    prisma.user.update({ where: { id: s.userId }, data }),
    prisma.passwordSetup.deleteMany({ where: { userId: s.userId } }),
    prisma.authCode.deleteMany({ where: { userId: s.userId } }),
    // Tiklashda: parolni bilgan (yoki o'g'irlagan) boshqa qurilmalar darhol chiqariladi
    prisma.session.deleteMany({ where: { userId: s.userId } }),
  ]);
  await dropSession(req);
  await startSession(res, user.id);
  audit(req, register ? 'auth.register_complete' : 'auth.reset_complete', { actor: user, targetType: 'user', targetId: user.id });
  res.status(register ? 201 : 200).json({ user: publicUser(user) });
});

router.post('/logout', async (req, res) => {
  if (req.user) audit(req, 'auth.logout', { actor: req.user, targetType: 'user', targetId: req.user.id });
  await endSession(req, res);
  res.json({ ok: true });
});

// Mehmon uchun 200 + {user:null}: frontend server borligini shu bilan biladi (konsolda 401 xatosi chiqmaydi).
router.get('/me', (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

export default router;
