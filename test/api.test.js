// API integratsion testlari: alohida test bazasi (prisma/test.db) bilan haqiqiy serverni ishga tushiradi.
// Ishga tushirish: npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.env.DATABASE_URL = 'file:./test.db';
process.env.ADMIN_EMAIL = 'boss@test.uz';
process.env.BCRYPT_ROUNDS = '4';
rmSync(path.join(ROOT, 'prisma', 'test.db'), { force: true });
execSync('npx prisma db push --skip-generate', { cwd: ROOT, env: process.env, stdio: 'ignore' });

const { createApp } = await import('../server/app.js');
const { prisma } = await import('../server/db.js');

let server, base;
before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(async () => {
  server.close();
  await prisma.$disconnect();
  rmSync(path.join(ROOT, 'prisma', 'test.db'), { force: true });
});

// Kichik "brauzer": cookie'ni saqlab boradi.
function client() {
  let cookie = '';
  return async (method, url, body, headers = {}) => {
    const r = await fetch(base + url, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      redirect: 'manual',
    });
    const set = r.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0].endsWith('=') ? '' : set.split(';')[0];
    const text = await r.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: r.status, json, text, headers: r.headers };
  };
}

const admin = client();
const alice = client();

test('register: ADMIN_EMAIL egasi admin bo\'ladi, oddiy foydalanuvchi — user', async () => {
  const a = await admin('POST', '/api/auth/register', { name: 'Boss', email: 'BOSS@test.uz', password: 'password-1' });
  assert.equal(a.status, 201);
  assert.equal(a.json.user.role, 'admin');
  assert.equal(a.json.user.email, 'boss@test.uz');
  assert.match(a.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(a.headers.get('set-cookie'), /SameSite=Lax/i);

  const b = await alice('POST', '/api/auth/register', { name: 'Alice', email: 'alice@test.uz', password: 'password-2' });
  assert.equal(b.status, 201);
  assert.equal(b.json.user.role, 'user');
});

test('register: validatsiya va takroriy email', async () => {
  const c = client();
  assert.equal((await c('POST', '/api/auth/register', { name: 'X', email: 'x@test.uz', password: 'short' })).status, 400);
  assert.equal((await c('POST', '/api/auth/register', { name: 'X', email: 'not-an-email', password: 'password-3' })).status, 400);
  const dup = await c('POST', '/api/auth/register', { name: 'A2', email: 'alice@test.uz', password: 'password-3' });
  assert.equal(dup.status, 409);
  assert.equal(dup.json.error, 'EMAIL_EXISTS');
});

test('parol bazada bcrypt xeshi sifatida saqlanadi', async () => {
  const u = await prisma.user.findUnique({ where: { email: 'alice@test.uz' } });
  assert.match(u.passwordHash, /^\$2[aby]\$/);
  assert.ok(!u.passwordHash.includes('password-2'));
});

test('me: mehmon uchun user=null, kirgan uchun foydalanuvchi', async () => {
  assert.deepEqual((await client()('GET', '/api/auth/me')).json, { user: null });
  assert.equal((await alice('GET', '/api/auth/me')).json.user.name, 'Alice');
});

test('login / logout', async () => {
  const c = client();
  assert.equal((await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'wrong-pass' })).json.error, 'INVALID_CREDENTIALS');
  assert.equal((await c('POST', '/api/auth/login', { email: 'nobody@test.uz', password: 'wrong-pass' })).json.error, 'INVALID_CREDENTIALS');
  assert.equal((await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' })).status, 200);
  assert.equal((await c('GET', '/api/auth/me')).json.user.email, 'alice@test.uz');
  await c('POST', '/api/auth/logout');
  assert.equal((await c('GET', '/api/auth/me')).json.user, null);
});

test('progress: merge — o\'qilgan belgi yo\'qolmaydi, eng yaxshi ball kamaymaydi', async () => {
  await alice('PUT', '/api/me/progress', { progress: { t01: { v: 1 }, t02: { v: 1, s: 4, t: 5, b: 4, d: 1000 } } });
  const r = await alice('PUT', '/api/me/progress', { progress: { t02: { v: 1, s: 2, t: 5, b: 2, d: 2000 }, t03: { v: 1 } } });
  assert.deepEqual(r.json.progress.t01, { v: 1 });
  assert.equal(r.json.progress.t02.s, 2);
  assert.equal(r.json.progress.t02.b, 4);
  assert.ok(r.json.progress.t03);
  // Eskiroq (d kichik) natija yangisini bosib ketmaydi
  const old = await alice('PUT', '/api/me/progress', { progress: { t02: { v: 1, s: 1, t: 5, d: 500 } } });
  assert.equal(old.json.progress.t02.s, 2);
});

test('progress: replace — to\'liq tozalash', async () => {
  const r = await alice('PUT', '/api/me/progress', { progress: {}, mode: 'replace' });
  assert.deepEqual(r.json.progress, {});
  await alice('PUT', '/api/me/progress', { progress: { t05: { v: 1 } } });
});

test('progress / quiz / settings: mehmonga yopiq', async () => {
  const c = client();
  assert.equal((await c('GET', '/api/me/progress')).status, 401);
  assert.equal((await c('POST', '/api/me/quiz', { quizId: 'a', score: 1, total: 2 })).status, 401);
  assert.equal((await c('GET', '/api/me/settings')).status, 401);
});

test('quiz: saqlanadi va tekshiriladi', async () => {
  assert.equal((await alice('POST', '/api/me/quiz', { quizId: 'quiz:easy', score: 7, total: 10 })).status, 201);
  assert.equal((await alice('POST', '/api/me/quiz', { quizId: 'quiz:easy', score: 11, total: 10 })).status, 400);
  assert.equal((await alice('POST', '/api/me/quiz', { quizId: 'bad id!', score: 1, total: 10 })).status, 400);
  const list = await alice('GET', '/api/me/quiz');
  assert.equal(list.json.results.length, 1);
});

test('settings: qisman yangilash, noma\'lum kalit rad etiladi', async () => {
  await alice('PUT', '/api/me/settings', { lang: 'ru', voice: true });
  const r = await alice('PUT', '/api/me/settings', { loc: { k: 'tashkent', lat: 41.3, lon: 69.24, tz: 5 } });
  assert.equal(r.json.settings.lang, 'ru');
  assert.equal(r.json.settings.voice, true);
  assert.equal(r.json.settings.loc.k, 'tashkent');
  assert.equal((await alice('GET', '/api/auth/me')).json.user.lang, 'ru');
  assert.equal((await alice('PUT', '/api/me/settings', { hack: 1 })).status, 400);
  assert.equal((await alice('PUT', '/api/me/settings', { loc: { lat: 200, lon: 0 } })).status, 400);
});

test('profil: statistika va so\'nggi natijalar', async () => {
  await alice('PUT', '/api/me/progress', { progress: { t01: { v: 1 }, t02: { v: 1 }, tarix: { v: 1 } } });
  await alice('POST', '/api/me/quiz', { quizId: 'topic:t02', score: 5, total: 5 });
  const p = (await alice('GET', '/api/me/profile')).json;
  assert.equal(p.user.email, 'alice@test.uz');
  assert.ok(p.user.createdAt);
  assert.equal(p.stats.totalTopics, 40);
  assert.equal(p.stats.readCount, 3, 'faqat asosiy mavzular (t01..t40) sanaladi');
  assert.equal(p.stats.quizCount, 2);
  assert.equal(p.stats.bestPercent, 100);
  assert.equal(p.stats.avgPercent, 80);
  assert.equal(p.recent[0].quizId, 'topic:t02');
  assert.ok(p.recent[0].title.uz);
  assert.equal((await client()('GET', '/api/me/profile')).status, 401);
});

test('profil: ismni o\'zgartirish', async () => {
  const r = await alice('PATCH', '/api/me/profile', { name: '  Alisa  ' });
  assert.equal(r.json.user.name, 'Alisa');
  assert.equal((await alice('PATCH', '/api/me/profile', { name: '' })).status, 400);
  assert.equal((await alice('PATCH', '/api/me/profile', { name: 'X', role: 'admin' })).status, 400);
  await alice('PATCH', '/api/me/profile', { name: 'Alice' });
});

test('parolni o\'zgartirish: joriy sessiya qoladi, boshqalari yopiladi', async () => {
  const other = client();
  await other('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' });
  assert.equal((await alice('POST', '/api/me/password', { currentPassword: 'nope-nope', newPassword: 'password-new' })).json.error, 'WRONG_PASSWORD');
  assert.equal((await alice('POST', '/api/me/password', { currentPassword: 'password-2', newPassword: 'short' })).status, 400);
  assert.equal((await alice('POST', '/api/me/password', { currentPassword: 'password-2', newPassword: 'password-new' })).status, 200);
  assert.equal((await alice('GET', '/api/auth/me')).json.user.email, 'alice@test.uz');
  assert.equal((await other('GET', '/api/auth/me')).json.user, null);
  const c = client();
  assert.equal((await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-new' })).status, 200);
  await alice('POST', '/api/me/password', { currentPassword: 'password-new', newPassword: 'password-2' });
});

test('CSRF: boshqa domendan kelgan POST rad etiladi', async () => {
  const r = await alice('POST', '/api/auth/logout', undefined, { Origin: 'https://evil.example' });
  assert.equal(r.status, 403);
  assert.equal((await alice('GET', '/api/auth/me')).json.user.name, 'Alice');
});

test('admin: oddiy foydalanuvchi va mehmonga yopiq', async () => {
  assert.equal((await alice('GET', '/api/admin/stats')).status, 403);
  assert.equal((await client()('GET', '/api/admin/stats')).status, 401);
  assert.equal((await alice('GET', '/admin')).status, 302);
  const page = await admin('GET', '/admin');
  assert.equal(page.status, 200);
  assert.match(page.text, /admin\.js/);
});

test('admin: statistika', async () => {
  const s = (await admin('GET', '/api/admin/stats')).json;
  assert.equal(s.users.total, 2);
  assert.equal(s.users.admins, 1);
  assert.equal(s.quiz.count, 2);
  assert.equal(s.quiz.avgPercent, 85);
  assert.equal(s.registrations.length, 14);
  const t05 = s.topTopics.find((t) => t.topicId === 't05');
  assert.equal(t05.reads, 1);
  assert.ok(t05.title.uz, 'mavzu nomi labs/ fayllaridan olinadi');
});

test('admin: foydalanuvchilar ro\'yxati va qidiruv', async () => {
  const r = (await admin('GET', '/api/admin/users?q=ALI')).json;
  assert.equal(r.total, 1);
  assert.equal(r.items[0].email, 'alice@test.uz');
  assert.equal(r.items[0].quizCount, 2);
});

test('admin: bloklash sessiyani tugatadi va kirishga yo\'l qo\'ymaydi', async () => {
  const id = (await admin('GET', '/api/admin/users?q=alice')).json.items[0].id;
  assert.equal((await admin('PATCH', `/api/admin/users/${id}`, { blocked: true })).status, 200);
  assert.equal((await alice('GET', '/api/auth/me')).json.user, null);
  const c = client();
  assert.equal((await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' })).json.error, 'BLOCKED');
  await admin('PATCH', `/api/admin/users/${id}`, { blocked: false });
});

test('admin: o\'zini bloklay / o\'chira olmaydi', async () => {
  const me = (await admin('GET', '/api/auth/me')).json.user;
  assert.equal((await admin('PATCH', `/api/admin/users/${me.id}`, { blocked: true })).json.error, 'SELF_ACTION');
  assert.equal((await admin('DELETE', `/api/admin/users/${me.id}`)).json.error, 'SELF_ACTION');
});

test('admin: CSV eksport (formula-injection himoyasi bilan)', async () => {
  const evil = client();
  await evil('POST', '/api/auth/register', { name: '=HYPERLINK("x")', email: 'evil@test.uz', password: 'password-9' });
  await evil('POST', '/api/me/quiz', { quizId: 'quiz:hard', score: 1, total: 10 });
  const r = await admin('GET', '/api/admin/quiz.csv');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/csv/);
  assert.match(r.text, /quiz:hard/);
  assert.match(r.text, /"'=HYPERLINK\(""x""\)"/);
});

test('admin: foydalanuvchini o\'chirish — barcha ma\'lumotlari bilan', async () => {
  const id = (await admin('GET', '/api/admin/users?q=evil')).json.items[0].id;
  assert.equal((await admin('DELETE', `/api/admin/users/${id}`)).status, 200);
  assert.equal(await prisma.quizResult.count({ where: { userId: id } }), 0);
  assert.equal((await admin('DELETE', `/api/admin/users/${id}`)).status, 404);
});

test('statik fayllar: sayt beriladi, maxfiy fayllar yopiq', async () => {
  const c = client();
  assert.equal((await c('GET', '/')).status, 200);
  assert.equal((await c('GET', '/script.js')).status, 200);
  assert.equal((await c('GET', '/labs/core.js')).status, 200);
  const tex = await c('GET', '/textures/2k_mars.jpg');
  assert.equal(tex.status, 200);
  assert.match(tex.headers.get('cache-control'), /immutable/);
  assert.equal((await c('GET', '/textures/nope.jpg')).status, 404);
  for (const p of ['/.env', '/package.json', '/server/app.js', '/prisma/schema.prisma', '/prisma/test.db', '/uploads/_crop.png', '/node_modules/express/package.json', '/.git/config']) {
    assert.equal((await c('GET', p)).status, 404, p);
  }
});

test('login rate-limit: 5 ta xato urinishdan keyin 429', async () => {
  const c = client();
  let last;
  for (let i = 0; i < 6; i++) last = await c('POST', '/api/auth/login', { email: 'boss@test.uz', password: 'nope-nope' });
  assert.equal(last.status, 429);
  assert.equal(last.json.error, 'RATE_LIMIT');
});
