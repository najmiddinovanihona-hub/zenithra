import { config } from './config.js';
import { prisma } from './db.js';
import { createApp } from './app.js';

// ADMIN_EMAIL egasi oldin oddiy foydalanuvchi sifatida ro'yxatdan o'tgan bo'lsa ham admin bo'ladi.
if (config.adminEmail) {
  const r = await prisma.user.updateMany({ where: { email: config.adminEmail, role: { not: 'admin' } }, data: { role: 'admin' } });
  if (r.count) console.log(`[astro] ${config.adminEmail} admin qilindi`);
}
await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });

// Oldingi versiya foydalanuvchi joylashuvini (aniq GPS, ko'cha) sozlamalarda saqlagan — endi saqlanmaydi, eskisi o'chiriladi.
for (const s of await prisma.settings.findMany()) {
  if (s.data && ('loc' in s.data || 'locManual' in s.data)) {
    const { loc, locManual, ...rest } = s.data;
    await prisma.settings.update({ where: { userId: s.userId }, data: { data: rest } });
  }
}

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
