// Osmon eslatmalari (Web Push) testlari: alohida baza (prisma/push-test.db), yuborish soxta funksiya bilan.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.env.DATABASE_URL = 'file:./push-test.db';
process.env.NODE_ENV = 'test';
delete process.env.VAPID_PUBLIC_KEY; delete process.env.VAPID_PRIVATE_KEY;
rmSync(path.join(ROOT, 'prisma', 'push-test.db'), { force: true });
execSync('npx prisma db push --skip-generate', { cwd: ROOT, env: process.env, stdio: 'ignore' });

const { createApp } = await import('../server/app.js');
const { prisma } = await import('../server/db.js');
const { initPush, runReminders } = await import('../server/push.js');
const { SKY, sat } = await import('../server/sky.js');

// Belgilangan XKS orbitasi (2026-10-20) — natija internetga bog'liq emas
const TLE = ['1 25544U 98067A   26293.66080995  .00008635  00000+0  16489-3 0  9997',
  '2 25544  51.6326  39.1774 0006750 287.9320  72.0932 15.48959761591200'];
const EP = 'https://fcm.googleapis.com/fcm/send/test-endpoint-1';
const SUB = { endpoint: EP, keys: { p256dh: 'BOr_p256dh_key_xxxxxxxxxx', auth: 'auth_secret_x' } };

let server, base;
before(async () => {
  await initPush();
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(async () => {
  server.close();
  await prisma.$disconnect();
  rmSync(path.join(ROOT, 'prisma', 'push-test.db'), { force: true });
});
const req = async (method, url, body) => {
  const r = await fetch(base + url, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, json: await r.json().catch(() => null) };
};

test('push: VAPID ochiq kaliti beriladi va qayta ishga tushganda o\'zgarmaydi', async () => {
  const a = await req('GET', '/api/push/key');
  assert.equal(a.status, 200);
  assert.match(a.json.key, /^[A-Za-z0-9_-]{80,}$/);
  assert.equal(await initPush(), a.json.key);
});

test('push: obuna — joylashuv ~10 km gacha yaxlitlanadi, noto\'g\'ri ma\'lumot rad etiladi', async () => {
  const ok = await req('POST', '/api/push/subscribe', { subscription: SUB, lat: 41.31108, lon: 69.27966, tz: 5, lang: 'uz', prefs: { iss: true, showers: true } });
  assert.equal(ok.status, 200);
  const s = await prisma.pushSub.findUnique({ where: { endpoint: EP } });
  assert.equal(s.lat, 41.3); assert.equal(s.lon, 69.3); assert.equal(s.tz, 5);
  // qayta obuna — yangi yozuv emas, yangilanadi
  await req('POST', '/api/push/subscribe', { subscription: SUB, lat: 39.65, lon: 66.96, tz: 5, lang: 'ru', prefs: { iss: false, showers: true } });
  assert.equal(await prisma.pushSub.count(), 1);
  assert.equal((await prisma.pushSub.findUnique({ where: { endpoint: EP } })).lang, 'ru');

  for (const bad of [
    { subscription: { ...SUB, endpoint: 'http://evil.example/x' }, lat: 1, lon: 1, tz: 5, prefs: { iss: true, showers: true } },
    { subscription: SUB, lat: 95, lon: 1, tz: 5, prefs: { iss: true, showers: true } },
    { subscription: SUB, lat: 1, lon: 1, tz: 5, prefs: { iss: true } },
    { subscription: SUB, lat: 1, lon: 1, tz: 5, prefs: { iss: true, showers: true }, extra: 1 },
  ]) assert.equal((await req('POST', '/api/push/subscribe', bad)).status, 400);
});

test('push: sinov xabari faqat mavjud obunaga; o\'chirish yozuvni (joylashuv bilan) o\'chiradi', async () => {
  assert.equal((await req('POST', '/api/push/test', { endpoint: 'https://fcm.googleapis.com/fcm/send/unknown' })).status, 404);
  assert.equal((await req('POST', '/api/push/unsubscribe', { endpoint: EP })).status, 200);
  assert.equal(await prisma.pushSub.count(), 0);
});

test('runReminders: XKS o\'tishidan ~15 daqiqa oldin bir marta xabar beradi', async () => {
  // Toshkent uchun keyingi 3 kundagi baland, ko'rinadigan o'tishni topamiz
  const t0 = Date.UTC(2026, 9, 20, 18), o = { lat: 41.3, lon: 69.3 };
  const p = SKY.issPasses(sat, TLE[0], TLE[1], o, t0, t0 + 3 * 86400000).find((x) => x.vis && x.vS && x.vMax.el >= 20);
  assert.ok(p, 'sinov orbitasida ko\'rinadigan o\'tish bo\'lishi kerak');
  await prisma.pushSub.create({ data: { endpoint: EP, p256dh: 'k', auth: 'a', lat: 41.3, lon: 69.3, tz: 5, lang: 'uz',
    prefs: { iss: true, showers: false }, sent: [] } });
  const got = [];
  const send = async (s, m) => { got.push(m); return 'ok'; };
  const now = p.vS.t - 15 * 60000;
  assert.equal((await runReminders({ now, send, tle: TLE })).sent, 1);
  assert.match(got[0].title, /XKS/);
  assert.equal(got[0].url, '/#eslatma');
  // 5 daqiqadan keyin — takror yuborilmaydi
  assert.equal((await runReminders({ now: now + 5 * 60000, send, tle: TLE })).sent, 0);
  // juda erta (1 soat oldin) — hali yubormaydi
  await prisma.pushSub.update({ where: { endpoint: EP }, data: { sent: [] } });
  assert.equal((await runReminders({ now: p.vS.t - 3600000, send, tle: TLE })).sent, 0);
});

test('runReminders: meteor cho\'qqisi kechasi xabar; 410 kelsa obuna o\'chiriladi', async () => {
  await prisma.pushSub.update({ where: { endpoint: EP }, data: { prefs: { iss: false, showers: true }, sent: [] } });
  // Orionidlar cho'qqisiga eng yaqin kech: sky-core'dagi sanadan olinadi
  const pk = SKY.nextShowerPeaks(new Date(Date.UTC(2026, 9, 1)), 60).find((x) => x.sh.zhr >= 10);
  assert.ok(pk);
  const peakDay = new Date(pk.peak).toISOString().slice(0, 10);
  const now = Date.parse(peakDay + 'T15:00:00Z');   // Toshkentda 20:00
  const got = [];
  assert.ok((await runReminders({ now, send: async (s, m) => (got.push(m), 'ok'), tle: null })).sent >= 1);
  assert.ok(got.some((m) => m.title.includes(pk.sh.n.uz)), "cho'qqidagi oqim nomi xabarda bo'lishi kerak");
  // kunduzi (Toshkentda 12:00) — yubormaydi
  await prisma.pushSub.update({ where: { endpoint: EP }, data: { sent: [] } });
  assert.equal((await runReminders({ now: now - 8 * 3600000, send: async () => 'ok', tle: null })).sent, 0);
  // brauzer obunani bekor qilgan (410) — bazadan o'chadi
  assert.equal((await runReminders({ now, send: async () => 'gone', tle: null })).sent, 0);
  assert.equal(await prisma.pushSub.count(), 0);
});
