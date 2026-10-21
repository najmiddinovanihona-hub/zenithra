// Darslik mavzularining 3 tilli nomlari — admin statistikasida "t07" o'rniga nom ko'rsatish uchun.
// labs/dz-*.js fayllaridan bir marta (birinchi so'rovda) o'qiladi: DARSLIK.add({ id:'t07' ... }) va title:X('uz','ru','en').
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './config.js';

const STR = String.raw`(['"])((?:(?!\1)[^\\]|\\.)*)\1`;
const TITLE_RE = new RegExp(String.raw`title\s*:\s*X\(\s*${STR}\s*,\s*${STR.replaceAll('\\1', '\\3')}\s*,\s*${STR.replaceAll('\\1', '\\5')}\s*\)`);
const ID_RE = /DARSLIK\.add\(\{\s*id\s*:\s*'([^']+)'/;
const unescape = (s) => s.replace(/\\(.)/g, '$1');

let cache = null;

export function topicTitles() {
  if (cache) return cache;
  // Ba'zi mavzular ikki faylga bo'lingan: dz-t07.js (id) + dz-t07d.js (matnlar, title shu yerda).
  const ids = {}, titles = {};
  const dir = path.join(ROOT, 'labs');
  for (const f of readdirSync(dir).filter((n) => /^dz-.+\.js$/.test(n))) {
    const base = f.replace(/^dz-(t\d+)d\.js$/, 'dz-$1.js');
    const src = readFileSync(path.join(dir, f), 'utf8');
    const id = ID_RE.exec(src)?.[1];
    const t = TITLE_RE.exec(src);
    if (id) ids[base] ??= id;
    if (t) titles[base] ??= { uz: unescape(t[2]), ru: unescape(t[4]), en: unescape(t[6]) };
  }
  cache = {};
  for (const [base, id] of Object.entries(ids)) if (titles[base]) cache[id] = titles[base];
  return cache;
}
