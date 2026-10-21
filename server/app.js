import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { config, ROOT } from './config.js';
import { ApiError } from './http.js';
import { loadUser } from './session.js';
import { prisma } from './db.js';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import adminRoutes from './routes/admin.js';
import pushRoutes from './push.js';

// Brauzerga beriladigan fayllar: faqat shular (server/, prisma/, .env, uploads/ va h.k. hech qachon berilmaydi).
// MUHIM: har bir ochiq papka O'ZINING ildizidan beriladi. Avval butun loyiha ildizi regex bilan cheklangan edi —
// "/labs/%2e%2e/prisma/dev.db" kabi kodlangan yo'l regex'dan o'tib, bazani berib yuborardi (path traversal).
const PUBLIC_DIRS = ['labs', 'photos', 'textures'];
const ROOT_EXT = /\.(js|css|svg|png|jpg|ico|webp)$/;
const PRIVATE_ROOT = new Set(['package.json', 'package-lock.json']);
// Ildizdagi ochiq fayllar — ishga tushishda aniq ro'yxat (faqat oddiy fayllar, nomi to'liq mos kelishi shart)
const ROOT_FILES = new Set(readdirSync(ROOT).filter((n) =>
  ROOT_EXT.test(n) && !PRIVATE_ROOT.has(n) && statSync(path.join(ROOT, n)).isFile()));

const LONG_CACHE = 'public, max-age=31536000, immutable';
// ?v=N bilan versiyalangan fayl o'zgarmaydi — brauzer 1 yil keshlaydi; versiyasizlari har safar tekshiriladi (ETag).
function cacheHeaders(res) {
  res.setHeader('Cache-Control', res.req && res.req.query && res.req.query.v ? LONG_CACHE : 'no-cache');
}

// Saytdan boshqa domendan kelgan o'zgartiruvchi so'rovlarni rad etadi (CSRF himoyasi, SameSite=Lax ga qo'shimcha).
// Origin bo'lmasa, zamonaviy brauzerlar yuboradigan Sec-Fetch-Site tekshiriladi (masalan, body'siz logout uchun).
function sameOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (origin) {
    let host;
    try { host = new URL(origin).host; } catch { host = null; }
    if (host !== req.get('host')) throw new ApiError(403, 'BAD_ORIGIN');
  } else {
    const site = req.get('sec-fetch-site');
    if (site && site !== 'same-origin' && site !== 'none') throw new ApiError(403, 'BAD_ORIGIN');
  }
  next();
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', config.trustProxy);

  app.use(compression());   // JS/CSS/JSON gzip bilan — ~1.2 MB skriptlar bir necha baravar kichrayadi
  app.use(helmet({
    // Sayt CDN (three.js), tashqi API'lar va inline skriptlardan foydalanadi — CSP keyinroq alohida sozlanadi.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  /* ---------- API ---------- */
  const api = express.Router();
  api.use(express.json({ limit: '100kb' }));
  api.use(cookieParser());
  api.use(sameOrigin);
  api.use(loadUser);
  api.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  api.get('/health', async (req, res) => {
    try { await prisma.$queryRaw`SELECT 1`; res.json({ ok: true }); }
    catch { res.status(503).json({ ok: false }); }
  });
  api.use('/auth', authRoutes);
  api.use('/me', meRoutes);
  api.use('/admin', adminRoutes);
  api.use('/push', pushRoutes);   // osmon hodisalari eslatmalari (Web Push)
  api.use((req, res) => res.status(404).json({ error: 'NOT_FOUND' }));
  api.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ error: err.code, ...(err.details ? { details: err.details } : {}) });
    }
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'BAD_JSON' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'TOO_LARGE' });
    // Prisma poyga holatlari: unikal kalit (bir vaqtda ikki ro'yxatdan o'tish), o'chirilgan yozuv, band baza
    if (err.code === 'P2002') return res.status(409).json({ error: 'CONFLICT' });
    if (err.code === 'P2025') return res.status(404).json({ error: 'NOT_FOUND' });
    if (err.code === 'P2034' || err.code === 'P2028') return res.status(503).json({ error: 'BUSY' });
    console.error(err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  });
  app.use('/api', api);

  /* ---------- Admin sahifasi: faqat admin uchun (server tomonda tekshiriladi) ---------- */
  const adminPage = express.Router();
  adminPage.use(cookieParser(), loadUser);
  adminPage.get(['/admin', '/admin.html'], (req, res) => {
    if (req.user?.role !== 'admin') return res.redirect(302, '/#login');
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(ROOT, 'admin.html'));
  });
  app.use(adminPage);

  /* ---------- Statik sayt ---------- */
  const opts = { index: false, dotfiles: 'deny', fallthrough: false, setHeaders: cacheHeaders };
  for (const dir of PUBLIC_DIRS) app.use('/' + dir, express.static(path.join(ROOT, dir), opts));
  // index.html va versiyasiz fayllar: har safar tekshiriladi (no-cache + ETag). Aks holda brauzer Last-Modified bo'yicha
  // o'zicha keshlab, yangi versiya (yangi ?v=N havolalar) foydalanuvchiga kunlab yetib bormasdi.
  app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(ROOT, 'index.html'), { headers: { 'Cache-Control': 'no-cache' } }));
  app.get('/:file', (req, res, next) => {
    if (!ROOT_FILES.has(req.params.file)) return next();
    res.sendFile(path.join(ROOT, req.params.file), { headers: { 'Cache-Control': req.query.v ? LONG_CACHE : 'no-cache' } });
  });
  app.use((req, res) => res.status(404).type('text/plain').send('404 — topilmadi'));
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    res.status(status).type('text/plain').send(status === 404 ? '404 — topilmadi' : status === 403 ? '403' : 'Xato');
  });

  return app;
}
