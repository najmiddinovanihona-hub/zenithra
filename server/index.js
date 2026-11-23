import { config } from './config.js';
import { prisma } from './db.js';
import { createApp } from './app.js';
import { initPush, startScheduler } from './push.js';
import { mailConfigured, mailSender, verifyMail } from './mailer.js';

// Admin tayinlash: npm run make-admin -- email@example.com (server konsoli bo'lsa).
// Konsolsiz hosting uchun ADMIN_EMAIL — faqat BIRINCHI adminni tayinlaydi: tizimda hali birorta admin yo'q bo'lsa va shu
// email bilan ro'yxatdan o'tish pochta kodi bilan tasdiqlangan (emailVerified) va parol o'rnatilgan bo'lsa.
// Admin paydo bo'lgach, ADMIN_EMAIL hech narsa qilmaydi (keyingi adminlar — admin panelidan).
async function bootstrapAdmin() {
  if (await prisma.user.count({ where: { role: 'admin' } })) return true;
  const r = await prisma.user.updateMany({
    where: { email: config.adminEmail, emailVerified: true, blocked: false, NOT: { passwordHash: '' } },
    data: { role: 'admin' },
  });
  if (r.count) console.log(`[astro] ${config.adminEmail} birinchi admin etib tayinlandi (ADMIN_EMAIL)`);
  return r.count > 0;
}
if (config.adminEmail) {
  const tick = () => bootstrapAdmin().then((done) => { if (done) clearInterval(timer); }).catch(() => {});
  const timer = setInterval(tick, 30 * 1000);
  timer.unref();
  tick();
}
if (config.isProd && !config.cookieSecure) console.warn("[astro] DIQQAT: COOKIE_SECURE=0 — sessiya cookie'si HTTPS'siz yuboriladi");
if (!config.isProd) console.log("[astro] development rejimi (NODE_ENV=production bo'lmasa cookie Secure emas — faqat lokal sinov uchun)");

const purgeSessions = () => Promise.all([
  prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
  prisma.authCode.deleteMany({ where: { expiresAt: { lt: new Date() } } }),   // muddati o'tgan email kodlari
]).catch(() => {});
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

// Pochta holati: ulanmagan bo'lsa tasdiqlash kodlari xat bo'lib bormaydi — buni ochiq aytamiz
if (mailConfigured()) {
  verifyMail().then(() => console.log(`[mail] ✔ Pochta ulangan (${process.env.BREVO_API_KEY ? 'Brevo' : 'SMTP'}): ${mailSender()} — kodlar xat bo'lib yuboriladi`))
    .catch((e) => console.warn(`[mail] ✖ Pochtaga ulanib bo'lmadi (${e.code || e.message}). Qayta sozlash: npm run mail:setup`));
} else {
  console.warn("[mail] ⚠ Pochta ULANMAGAN — kodlar xat bo'lib bormaydi, faqat shu oynada ko'rinadi. Ulash: npm run mail:setup");
}

const server = createApp().listen(config.port, (err) => {
  if (err) return;   // xato quyidagi 'error' hodisasida chiqariladi
  console.log(`[astro] http://localhost:${config.port}`);
});
// Port band bo'lsa server jimgina o'chib qolmasin (avval "http://localhost:3000" deb yozib, chiqib ketardi)
server.on('error', (e) => {
  console.error(e.code === 'EADDRINUSE'
    ? `[astro] ✖ ${config.port}-port band — boshqa server ishlab turibdi. Uni to'xtating yoki PORT ni o'zgartiring.`
    : `[astro] ✖ Serverni ishga tushirib bo'lmadi: ${e.message}`);
  process.exit(1);
});

const stop = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
