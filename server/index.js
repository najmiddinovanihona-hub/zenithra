import { config } from './config.js';
import { prisma } from './db.js';
import { createApp } from './app.js';
import { initPush, startScheduler } from './push.js';

// Admin faqat server egasi tomonidan tayinlanadi: npm run make-admin -- email@example.com
// (avval ADMIN_EMAIL bilan ro'yxatdan o'tgan HAR QANDAY odam admin bo'lardi — email tasdiqlanmagani uchun xavfli edi).
if (config.adminEmail) console.warn('[astro] ADMIN_EMAIL endi ishlatilmaydi — admin tayinlash: npm run make-admin -- email');
if (config.isProd && !config.cookieSecure) console.warn("[astro] DIQQAT: COOKIE_SECURE=0 — sessiya cookie'si HTTPS'siz yuboriladi");
if (!config.isProd) console.log("[astro] development rejimi (NODE_ENV=production bo'lmasa cookie Secure emas — faqat lokal sinov uchun)");

const purgeSessions = () => prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
await purgeSessions();
setInterval(purgeSessions, 6 * 3600 * 1000).unref();

// Oldingi versiya foydalanuvchi joylashuvini (aniq GPS, ko'cha) sozlamalarda saqlagan — endi saqlanmaydi, eskisi o'chiriladi.
for (const s of await prisma.settings.findMany()) {
  if (s.data && ('loc' in s.data || 'locManual' in s.data)) {
    const { loc, locManual, ...rest } = s.data;
    await prisma.settings.update({ where: { userId: s.userId }, data: { data: rest } });
  }
}

await initPush();
startScheduler();

const server = createApp().listen(config.port, () => {
  console.log(`[astro] http://localhost:${config.port}`);
});

const stop = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
