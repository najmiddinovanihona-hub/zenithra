// Osmon hodisalari eslatmalari — Web Push.
//  - Brauzer obuna bo'ladi (service worker /sw.js), joylashuvi ~10 km aniqlikkacha yaxlitlab yuboriladi.
//  - Har 5 daqiqada: XKS ko'rinadigan o'tishidan ~10–20 daqiqa oldin va meteor oqimi cho'qqisi kechasi (18:00–23:00)
//    bildirishnoma yuboriladi. Har bir eslatma bir marta (sent ro'yxati bo'yicha).
import { Router } from 'express';
import webpush from 'web-push';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from './db.js';
import { ApiError, parse } from './http.js';
import { SKY, sat, getTLE } from './sky.js';

/* ---------- VAPID kalitlari: .env dan yoki bazadan; bo'lmasa bir marta yaratiladi ---------- */
let vapid = null;
export async function initPush() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    vapid = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
  } else {
    const row = await prisma.appKV.findUnique({ where: { key: 'vapid' } });
    if (row) vapid = JSON.parse(row.value);
    else {
      vapid = webpush.generateVAPIDKeys();
      await prisma.appKV.create({ data: { key: 'vapid', value: JSON.stringify(vapid) } });
    }
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@astro.local', vapid.publicKey, vapid.privateKey);
  return vapid.publicKey;
}

// Bitta obunaga yuborish. 404/410 — obuna endi yo'q (brauzer bekor qilgan) → 'gone'
export async function sendPush(sub, payload) {
  try {
    await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload), { TTL: 900, urgency: 'high' });
    return 'ok';
  } catch (e) {
    if (e.statusCode === 404 || e.statusCode === 410) return 'gone';
    console.warn('[push]', e.statusCode || '', e.body || e.message);
    return 'error';
  }
}

/* ---------- Rejalashtiruvchi ---------- */
const dayStr = (t) => new Date(t).toISOString().slice(0, 10);
export async function runReminders({ now = Date.now(), send = sendPush, tle = undefined } = {}) {
  const subs = await prisma.pushSub.findMany();
  if (!subs.length) return { sent: 0 };
  if (tle === undefined && subs.some((s) => s.prefs?.iss)) tle = await getTLE().catch(() => null);
  const cells = new Map();
  let count = 0;
  for (const s of subs) {
    const done = new Set(Array.isArray(s.sent) ? s.sent : []);
    const out = [];
    if (s.prefs?.iss && tle) {
      const key = `${s.lat.toFixed(1)},${s.lon.toFixed(1)}`;   // bir hududdagi obunalar uchun bir marta hisoblanadi
      let passes = cells.get(key);
      if (!passes) { passes = SKY.issPasses(sat, tle[0], tle[1], { lat: s.lat, lon: s.lon }, now, now + 3600000); cells.set(key, passes); }
      for (const p of passes) {
        if (!p.vis || !p.vS || (p.vMax?.el ?? 0) < 20) continue;   // past o'tishlar — xabar bermaymiz
        const lead = p.vS.t - now;
        const k = 'iss:' + Math.round(p.vS.t / 60000);
        if (lead > 8 * 60000 && lead <= 20 * 60000 && !done.has(k)) out.push({ k, ...SKY.issText(p, s.lang, s.tz, now) });
      }
    }
    if (s.prefs?.showers) {
      const local = now + s.tz * 3600000, h = new Date(local).getUTCHours();
      if (h >= 18 && h < 23) {
        const today = dayStr(local), tomorrow = dayStr(local + 86400000);
        for (const pk of SKY.nextShowerPeaks(new Date(now), 2)) {
          const pd = dayStr(pk.peak), inDays = pd === today ? 0 : pd === tomorrow ? 1 : null;
          const k = `met:${pk.sh.k}:${pd}:${inDays}`;
          if (inDays === null || pk.sh.zhr < 10 || done.has(k)) continue;
          out.push({ k, ...SKY.showerText(pk.sh, s.lang, inDays) });
        }
      }
    }
    let gone = false;
    for (const m of out) {
      const r = await send(s, { title: m.title, body: m.body, url: '/#eslatma', tag: m.k });
      if (r === 'gone') { gone = true; break; }
      if (r === 'ok') { done.add(m.k); count++; }
    }
    if (gone) await prisma.pushSub.delete({ where: { id: s.id } }).catch(() => {});
    else if (out.length) await prisma.pushSub.update({ where: { id: s.id }, data: { sent: [...done].slice(-60) } }).catch(() => {});
  }
  return { sent: count };
}
export function startScheduler() {
  const tick = () => runReminders().catch((e) => console.warn('[push] scheduler', e.message));
  setTimeout(tick, 30000).unref();
  setInterval(tick, 5 * 60000).unref();
}

/* ---------- API: /api/push ---------- */
const router = Router();
const lim = (limit, windowMs) => rateLimit({ windowMs, limit, standardHeaders: 'draft-8', legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'RATE_LIMIT' }) });

const round1 = (x) => Math.round(x * 10) / 10;   // ~11 km — XKS o'tishi uchun yetarli, aniq manzil saqlanmaydi
const SubBody = z.object({
  subscription: z.object({
    endpoint: z.string().url().max(1000).refine((u) => u.startsWith('https://'), 'https only'),
    keys: z.object({ p256dh: z.string().min(10).max(200), auth: z.string().min(8).max(100) }),
  }).passthrough(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  tz: z.number().min(-12).max(14),
  lang: z.enum(['uz', 'ru', 'en']).default('uz'),
  prefs: z.object({ iss: z.boolean(), showers: z.boolean() }).strict(),
}).strict();
const EndpointBody = z.object({ endpoint: z.string().url().max(1000) }).strict();

router.get('/key', (req, res) => {
  if (!vapid) throw new ApiError(503, 'PUSH_DISABLED');
  res.json({ key: vapid.publicKey });
});

router.post('/subscribe', lim(30, 3600000), async (req, res) => {
  const b = parse(SubBody, req.body);
  const data = { p256dh: b.subscription.keys.p256dh, auth: b.subscription.keys.auth, lat: round1(b.lat), lon: round1(b.lon),
    tz: b.tz, lang: b.lang, prefs: b.prefs, userId: req.user?.id ?? null };
  await prisma.pushSub.upsert({ where: { endpoint: b.subscription.endpoint },
    create: { endpoint: b.subscription.endpoint, sent: [], ...data }, update: data });
  res.json({ ok: true });
});

router.post('/unsubscribe', async (req, res) => {
  const { endpoint } = parse(EndpointBody, req.body);
  await prisma.pushSub.deleteMany({ where: { endpoint } });
  res.json({ ok: true });
});

// Sinov: faqat bazada mavjud obunaga (begona manzilga yuborib bo'lmaydi)
const TEST = { uz: ['🔔 Eslatmalar yoqildi', 'XKS o‘tishi va meteor oqimlari haqida shu tarzda xabar beramiz.'],
  ru: ['🔔 Напоминания включены', 'Так мы сообщим о пролётах МКС и метеорных потоках.'],
  en: ['🔔 Reminders are on', 'This is how we will tell you about ISS passes and meteor showers.'] };
router.post('/test', lim(6, 600000), async (req, res) => {
  const { endpoint } = parse(EndpointBody, req.body);
  const s = await prisma.pushSub.findUnique({ where: { endpoint } });
  if (!s) throw new ApiError(404, 'NOT_FOUND');
  const [title, body] = TEST[s.lang] || TEST.uz;
  const r = await sendPush(s, { title, body, url: '/#eslatma', tag: 'test' });
  if (r === 'gone') { await prisma.pushSub.delete({ where: { id: s.id } }).catch(() => {}); throw new ApiError(410, 'GONE'); }
  res.json({ ok: r === 'ok' });
});

export default router;
