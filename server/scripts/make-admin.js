// Foydalanuvchiga admin rolini berish: npm run make-admin -- email@example.com
import { prisma } from '../db.js';

const email = (process.argv[2] || '').trim().toLowerCase();
if (!email) {
  console.error('Foydalanish: npm run make-admin -- email@example.com');
  process.exit(1);
}
const r = await prisma.user.updateMany({ where: { email }, data: { role: 'admin', blocked: false } });
console.log(r.count ? `${email} endi admin.` : `${email} topilmadi — avval saytda ro'yxatdan o'ting.`);
await prisma.$disconnect();
process.exit(r.count ? 0 : 1);
