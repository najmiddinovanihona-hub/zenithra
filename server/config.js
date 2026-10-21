import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// .env ni Node'ning o'zi bilan o'qiymiz (dotenv shart emas). Mavjud env o'zgaruvchilari ustun.
const envFile = path.join(ROOT, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const env = process.env;
const isProd = env.NODE_ENV === 'production';

export const config = {
  port: Number(env.PORT) || 3000,
  isProd,
  databaseUrl: env.DATABASE_URL || 'file:./dev.db',
  adminEmail: (env.ADMIN_EMAIL || '').trim().toLowerCase(),
  cookieSecure: env.COOKIE_SECURE ? env.COOKIE_SECURE === '1' : isProd,
  trustProxy: Number(env.TRUST_PROXY) || 0,
  sessionDays: 30,
  bcryptRounds: Number(env.BCRYPT_ROUNDS) || 12,
};

// SQLite'da LIKE katta-kichik harfga sezgir emas; PostgreSQL'da `mode: 'insensitive'` kerak.
export const isPostgres = /^postgres(ql)?:/.test(config.databaseUrl);

if (!process.env.DATABASE_URL) process.env.DATABASE_URL = config.databaseUrl;
