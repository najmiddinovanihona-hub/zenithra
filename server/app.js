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
import contentRoutes from './routes/content.js';
import errorRoutes, { reportServerError } from './routes/errors.js';

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

/* ---------- Content-Security-Policy ----------
   Inline <script> va onclick="..." kabi atributlar taqiqlangan (index.html dagi skriptlar boot.js, vendor-fallback.js
   fayllariga ko'chirilgan). three.js / OrbitControls / Leaflet zaxirasi — faqat aniq fayl manzillari (butun CDN emas:
   CDN'dagi boshqa paketlar orqali CSP aylanib o'tilmasin); CDN fayllari SRI (integrity) bilan ham tekshiriladi.
   style-src 'unsafe-inline' — style="..." atributlari va JS bilan o'rnatiladigan uslublar juda ko'p (xavfi kichik). */
const SITE_CSP = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'",
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'],   // labs/weather.js: mahalliy Leaflet yuklanmasa
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'blob:',
    'https://sdo.gsfc.nasa.gov',                              // Quyosh suratlari (kosmik ob-havo)
    'https://server.arcgisonline.com',                         // xarita plitkalari (ob-havo xaritasi)
    'https://thespacedevs-prod.nyc3.digitaloceanspaces.com',  // Launch Library: raketa/agentlik rasmlari
    'https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com'],   // (eski yozuvlardagi rasmlar)
  fontSrc: ["'self'", 'data:'],
  connectSrc: ["'self'",
    'https://api.open-meteo.com',                // ob-havo
    'https://services.swpc.noaa.gov',            // kosmik ob-havo (NOAA SWPC)
    'https://ll.thespacedevs.com', 'https://lldev.thespacedevs.com',   // raketa uchirilishlari
    'https://celestrak.org', 'https://api.wheretheiss.at',             // XKS orbitasi (TLE)
    'https://api.bigdatacloud.net', 'https://nominatim.openstreetmap.org',   // joy nomi (teskari geokodlash)
    'https://ipwho.is', 'https://get.geojs.io'],                       // taxminiy joylashuv (IP bo'yicha)
  workerSrc: ["'self'", 'blob:'],   // sw.js + Blob URL'dan yaratiladigan Worker'lar (yuklanish animatsiyasi, teksturalar)
  childSrc: ["'self'", 'blob:'],    // worker-src ni bilmaydigan eski Safari uchun
  frameSrc: ['https://najmiddinovanihona-hub.github.io'],   // muallif portfoliosi (iframe)
  mediaSrc: ["'self'", 'blob:'],
  manifestSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  ...(config.isProd ? { upgradeInsecureRequests: [] } : {}),   // lokal http://localhost da yoqilmaydi
};
const ADMIN_CSP = ["default-src 'self'", "script-src 'self'", "script-src-attr 'none'", "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "worker-src 'none'", "frame-src 'none'",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  ...(config.isProd ? ['upgrade-insecure-requests'] : [])].join('; ');

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', config.trustProxy);

  app.use(compression());   // JS/CSS/JSON gzip bilan — ~1.2 MB skriptlar bir necha baravar kichrayadi
  app.use(helmet({
    // Content-Security-Policy: sahifa faqat ro'yxatdagi manbalardan skript/ma'lumot/rasm yuklay oladi (XSS himoyasi).
    // Yangi tashqi API yoki rasm manbai qo'shilsa — SITE_CSP ga ham qo'shilishi SHART, aks holda brauzer bloklaydi.
    contentSecurityPolicy: { useDefaults: false, directives: SITE_CSP },
    crossOriginEmbedderPolicy: false,   // tashqi rasmlar (NASA SDO, xarita plitkalari) CORP sarlavhasisiz keladi
    // Tashqi API'larga faqat sayt manzili (origin) yuboriladi, sahifa yo'li emas. "no-referrer" (standart) ba'zi
    // bepul xizmatlar (Nominatim, Esri plitkalari) talab qiladigan ilova identifikatsiyasini butunlay olib tashlardi.
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }));
  // Admin sahifalari (/admin — kirish sahifasi ham shu manzilda) tashqi manbalarga umuman murojaat qilmaydi — qattiqroq siyosat
  app.use((req, res, next) => {
    if (req.path === '/admin' || req.path === '/admin.html') res.setHeader('Content-Security-Policy', ADMIN_CSP);
    next();
  });

  /* ---------- API ---------- */
  const api = express.Router();
  api.use(express.json({ limit: '100kb' }));
  api.use(cookieParser());
  api.use(sameOrigin);
  api.use(loadUser);
  api.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  // Render har bir necha soniyada /health ni tekshiradi (va uyg'otgich ham shu yerga so'rov yuboradi) — bazaga TEGMAYDI,
  // aks holda Neon hech qachon uxlamaydi va oylik bepul hisoblash soatlari (100 CU-soat) tugab, baza to'xtatiladi.
  api.get('/health', (req, res) => res.json({ ok: true }));
  // Baza holati — faqat qo'lda tekshirish uchun
  api.get('/health/db', async (req, res) => {
    try { await prisma.$queryRaw`SELECT 1`; res.json({ ok: true, db: true }); }
    catch { res.status(503).json({ ok: false, db: false }); }
  });
  api.use('/auth', authRoutes);
  api.use('/me', meRoutes);
  api.use('/admin', adminRoutes);
  api.use('/push', pushRoutes);   // osmon hodisalari eslatmalari (Web Push)
  api.use('/content', contentRoutes);   // admin qo'shgan test savollari (ommaviy, faqat o'qish)
  api.use('/errors', errorRoutes);   // brauzer xatolari (xatolar monitori, admin "Xatolar" bo'limi)
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
    reportServerError(err, req);   // admin panelidagi "Xatolar" bo'limi uchun (hech qachon xato tashlamaydi)
    res.status(500).json({ error: 'SERVER_ERROR' });
  });
  app.use('/api', api);

  /* ---------- Admin sahifasi: faqat admin uchun (server tomonda tekshiriladi) ----------
     Admin bo'lmagan / kirmagan foydalanuvchiga shu manzilning o'zida alohida kirish sahifasi beriladi. */
  const adminPage = express.Router();
  adminPage.use(cookieParser(), loadUser);
  adminPage.get(['/admin', '/admin.html'], (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(ROOT, req.user?.role === 'admin' ? 'admin.html' : 'admin-login.html'));
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
