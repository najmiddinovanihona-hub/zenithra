// Prisma/Neon DATABASE_URL ni pg_dump / pg_restore (libpq) tushunadigan ko'rinishga keltiradi.
//   - Prisma'ga xos parametrlar (pgbouncer, schema, connection_limit, pool_timeout ...) olib tashlanadi —
//     libpq ularni bilmaydi va "invalid URI query parameter" xatosi bilan to'xtaydi.
//   - Neon "pooled" manzili (ep-...-pooler.<region>.neon.tech) to'g'ridan-to'g'ri ulanishga almashtiriladi:
//     pg_dump/pg_restore PgBouncer (transaction rejimi) orqali emas, bevosita ishlashi kerak.
//   - sslmode berilmagan bo'lsa, "require" qo'yiladi.
//
// Manzil argument sifatida EMAS, muhit o'zgaruvchisidan o'qiladi (jarayonlar ro'yxatida ko'rinmasligi uchun):
//   SRC_DATABASE_URL='postgresql://...' node scripts/pg-url.mjs              -> toza URL (stdout)
//   SRC_DATABASE_URL='postgresql://...' node scripts/pg-url.mjs --password   -> faqat parol (log'da yashirish uchun)
// Hech qachon URL'ni log'ga chiqarmang.

const raw = (process.env.SRC_DATABASE_URL || '').trim();
if (!raw) {
  console.error('[pg-url] SRC_DATABASE_URL bo\'sh');
  process.exit(2);
}

let u;
try {
  u = new URL(raw);
} catch {
  console.error('[pg-url] DATABASE_URL to\'g\'ri URL emas (postgresql://user:parol@host/baza?sslmode=require ko\'rinishida bo\'lishi kerak)');
  process.exit(2);
}
if (u.protocol !== 'postgres:' && u.protocol !== 'postgresql:') {
  console.error('[pg-url] DATABASE_URL PostgreSQL manzili emas (postgresql:// bilan boshlanishi kerak)');
  process.exit(2);
}

if (process.argv.includes('--password')) {
  process.stdout.write(decodeURIComponent(u.password || ''));
  process.exit(0);
}

// Neon: pooler -> direct
if (/\.neon\.tech$/i.test(u.hostname)) u.hostname = u.hostname.replace(/-pooler\./i, '.');

// libpq qabul qiladigan parametrlar (qolganlari — Prisma'niki)
const LIBPQ = new Set([
  'sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'sslnegotiation', 'channel_binding', 'connect_timeout',
  'application_name', 'options', 'target_session_attrs', 'gssencmode', 'keepalives', 'keepalives_idle',
]);
for (const k of [...u.searchParams.keys()]) if (!LIBPQ.has(k)) u.searchParams.delete(k);
if (!u.searchParams.has('sslmode')) u.searchParams.set('sslmode', 'require');

process.stdout.write(u.toString().replace(/^postgres:/, 'postgresql:'));
