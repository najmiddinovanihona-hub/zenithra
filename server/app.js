import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { config, ROOT } from './config.js';
import { ApiError } from './http.js';
import { loadUser } from './session.js';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import adminRoutes from './routes/admin.js';

// Brauzerga beriladigan fayllar: faqat shular (server/, prisma/, .env, uploads/ va h.k. hech qachon berilmaydi).
const PUBLIC_DIRS = /^\/(labs|photos)\//;
const PUBLIC_ROOT_FILE = /^\/[\w.-]+\.(js|css|svg|png|jpg|ico|webp)$/;
const PRIVATE_ROOT_FILE = /^\/(package(-lock)?\.json)$/;

// Saytdan boshqa domendan kelgan o'zgartiruvchi so'rovlarni rad etadi (CSRF himoyasi, SameSite=Lax ga qo'shimcha).
function sameOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (origin) {
    let host;
    try { host = new URL(origin).host; } catch { host = null; }
    if (host !== req.get('host')) throw new ApiError(403, 'BAD_ORIGIN');
  }
  next();
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', config.trustProxy);

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
  api.get('/health', (req, res) => res.json({ ok: true }));
  api.use('/auth', authRoutes);
  api.use('/me', meRoutes);
  api.use('/admin', adminRoutes);
  api.use((req, res) => res.status(404).json({ error: 'NOT_FOUND' }));
  api.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ error: err.code, ...(err.details ? { details: err.details } : {}) });
    }
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'BAD_JSON' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'TOO_LARGE' });
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
  const files = express.static(ROOT, { index: false, dotfiles: 'deny', fallthrough: false });
  app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));
  app.get('/index.html', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if ((PUBLIC_DIRS.test(req.path) || PUBLIC_ROOT_FILE.test(req.path)) && !PRIVATE_ROOT_FILE.test(req.path)) {
      return files(req, res, next);
    }
    next();
  });
  app.use((req, res) => res.status(404).type('text/plain').send('404 — topilmadi'));
  app.use((err, req, res, next) => {
    res.status(err.status || err.statusCode || 500).type('text/plain').send(err.status === 404 ? '404 — topilmadi' : 'Xato');
  });

  return app;
}
