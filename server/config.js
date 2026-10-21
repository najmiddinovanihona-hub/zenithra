import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// .env ni Node'ning o'zi bilan o'qiymiz (dotenv shart emas). Mavjud env o'zgaruvchilari ustun.
const envFile = path.join(ROOT, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const env = process.env;

// TRUST_PROXY: raqam (proksi soni), "loopback"/"uniquelocal" kabi Express qiymatlari yoki bo'sh.
// Avval Number("loopback") = 0 bo'lib, sozlama jimgina e'tiborsiz qolardi.
function parseTrustProxy(v) {
  if (v == null || v === '' || v === '0' || v === 'false') return 0;
  if (/^[0-9]+$/.test(v)) return Number(v);
  if (v === 'true') return 1;
  return v;
}
const isProd = env.NODE_ENV === 'production';

export const config = {
  port: Number(env.PORT) || 3000,
  isProd,
  databaseUrl: env.DATABASE_URL || 'file:./dev.db',
  adminEmail: (env.ADMIN_EMAIL || '').trim().toLowerCase(),
  cookieSecure: env.COOKIE_SECURE ? env.COOKIE_SECURE === '1' : isProd,
  trustProxy: parseTrustProxy(env.TRUST_PROXY),
  sessionDays: 30,
  // 10..14 oralig'ida (testlarda tezlik uchun 4 ham ruxsat) — juda kichigi xavfsiz emas, kattasi serverni sekinlashtiradi
  bcryptRounds: Math.min(14, Math.max(env.NODE_ENV === 'test' ? 4 : 10, Number(env.BCRYPT_ROUNDS) || 12)),
};

// SQLite'da LIKE katta-kichik harfga sezgir emas; PostgreSQL'da `mode: 'insensitive'` kerak.
export const isPostgres = /^postgres(ql)?:/.test(config.databaseUrl);

if (!process.env.DATABASE_URL) process.env.DATABASE_URL = config.databaseUrl;
