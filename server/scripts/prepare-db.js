// Deploy (build) bosqichi uchun: DATABASE_URL PostgreSQL bo'lsa, prisma/schema.prisma dagi provider'ni "postgresql" ga
// almashtiradi. Lokal ishlab chiqish va testlar SQLite'da qoladi (repo'dagi fayl o'zgarmaydi — faqat build serverida).
//   node server/scripts/prepare-db.js
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from '../config.js';

const url = process.env.DATABASE_URL || '';
const file = path.join(ROOT, 'prisma', 'schema.prisma');
const src = readFileSync(file, 'utf8');
const target = /^postgres(ql)?:/.test(url) ? 'postgresql' : 'sqlite';
const out = src.replace(/(datasource db \{[^}]*?provider\s*=\s*)"(sqlite|postgresql)"/, `$1"${target}"`);
if (out === src && !src.includes(`provider = "${target}"`)) {
  console.error('[prepare-db] schema.prisma dagi datasource provider topilmadi');
  process.exit(1);
}
writeFileSync(file, out);
console.log(`[prepare-db] provider = "${target}"`);
