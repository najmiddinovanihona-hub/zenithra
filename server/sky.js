// Osmon hisoblari serverda: labs/sky-core.js (brauzer bilan BIR XIL kod) window'siz muhitda bajariladi.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as satellite from 'satellite.js';
import { ROOT } from './config.js';
import { prisma } from './db.js';

const box = {};
new Function('window', readFileSync(path.join(ROOT, 'labs', 'sky-core.js'), 'utf8'))(box);
export const SKY = box.SKYCORE;
export const sat = satellite;

const TLE_TTL = 6 * 3600 * 1000;
const SOURCES = [
  ['https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE',
    (t) => t.split(/\r?\n/).filter((s) => /^[12] /.test(s))],
  ['https://api.wheretheiss.at/v1/satellites/25544/tles',
    (t) => { const j = JSON.parse(t); return [j.line1, j.line2]; }],
];

// XKS orbita elementlari (TLE): bazada keshlanadi, 6 soatda bir yangilanadi; manba ishlamasa — eski nusxa
export async function getTLE() {
  const row = await prisma.appKV.findUnique({ where: { key: 'iss_tle' } });
  const cached = row ? JSON.parse(row.value) : null;
  if (cached && Date.now() - cached.t < TLE_TTL) return cached.l;
  for (const [url, parse] of SOURCES) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!r.ok) continue;
      const l = parse(await r.text());
      if (l.length === 2) {
        const value = JSON.stringify({ l, t: Date.now() });
        await prisma.appKV.upsert({ where: { key: 'iss_tle' }, create: { key: 'iss_tle', value }, update: { value } });
        return l;
      }
    } catch { /* keyingi manba */ }
  }
  return cached ? cached.l : null;
}
