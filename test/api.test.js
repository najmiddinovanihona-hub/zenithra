// API integratsion testlari: alohida test bazasi (prisma/test.db) bilan haqiqiy serverni ishga tushiradi.
// Ishga tushirish: npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import http from 'node:http';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.env.DATABASE_URL = 'file:./test.db';
process.env.ADMIN_EMAIL = 'boss@test.uz';
process.env.BCRYPT_ROUNDS = '4';
process.env.NODE_ENV = 'test';
rmSync(path.join(ROOT, 'prisma', 'test.db'), { force: true });
execSync('npx prisma db push --skip-generate', { cwd: ROOT, env: process.env, stdio: 'ignore' });

const { createApp } = await import('../server/app.js');
const { prisma } = await import('../server/db.js');
const { outbox } = await import('../server/mailer.js');

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

// Ro'yxatdan o'tish / kirish endi ikki bosqichli: pochtaga ketgan kod (testda — outbox) /verify ga yuboriladi.
// Ro'yxatdan o'tish: email → kod → {setup} → /password (ism + parol) → sessiya.
const lastCode = (to) => [...outbox].reverse().find((m) => m.to === to).code;
async function signup(c, { name, email, password }) {
  const r = await c('POST', '/api/auth/register', { email });
  if (r.status !== 202) return r;
  const v = await c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: lastCode(email.toLowerCase()) });
  if (v.status !== 200) return v;
  return c('POST', '/api/auth/password', { setup: v.json.setup, password, name });
}
async function signin(c, email, password) {
  const r = await c('POST', '/api/auth/login', { email, password });
  if (r.status !== 202) return r;
  return c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: lastCode(email) });
}

const admin = client();
const alice = client();

test('register: hamma "user" bo\'lib ro\'yxatdan o\'tadi (ADMIN_EMAIL ham), admin faqat make-admin orqali', async () => {
  const a = await signup(admin, { name: 'Boss', email: 'BOSS@test.uz', password: 'password-1' });
  assert.equal(a.status, 201);
  assert.equal(a.json.user.role, 'user', 'ro\'yxatdan o\'tish orqali admin bo\'lib bo\'lmaydi');
  await prisma.user.update({ where: { email: 'boss@test.uz' }, data: { role: 'admin' } });   // make-admin o'rniga
  assert.equal((await admin('GET', '/api/auth/me')).json.user.role, 'admin');
  assert.equal(a.json.user.email, 'boss@test.uz');
  assert.match(a.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(a.headers.get('set-cookie'), /SameSite=Lax/i);

  const b = await signup(alice, { name: 'Alice', email: 'alice@test.uz', password: 'password-2' });
  assert.equal(b.status, 201);
  assert.equal(b.json.user.role, 'user');
});

test('register: validatsiya va takroriy email', async () => {
  const c = client();
  assert.equal((await c('POST', '/api/auth/register', { email: 'not-an-email' })).status, 400);
  assert.equal((await c('POST', '/api/auth/register', { email: 'x@test.uz', password: 'password-3' })).status, 400, 'ortiqcha maydon (strict)');
  const dup = await c('POST', '/api/auth/register', { email: 'alice@test.uz' });
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
  assert.equal((await signin(c, 'alice@test.uz', 'password-2')).status, 200);
  assert.equal((await c('GET', '/api/auth/me')).json.user.email, 'alice@test.uz');
  await c('POST', '/api/auth/logout');
  assert.equal((await c('GET', '/api/auth/me')).json.user, null);
});

test('email kodi: parol to\'g\'ri bo\'lsa ham kodsiz kirib bo\'lmaydi; xat to\'g\'ri pochtaga ketadi', async () => {
  const c = client();
  const r = await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' });
  assert.equal(r.status, 202);
  assert.equal(r.json.needCode, true);
  assert.equal(r.json.email, 'al***@test.uz', 'to\'liq manzil qaytarilmaydi');
  assert.equal(r.headers.get('set-cookie'), null, 'kod kiritilmaguncha sessiya yo\'q');
  assert.equal((await c('GET', '/api/auth/me')).json.user, null);
  const m = outbox.at(-1);
  assert.equal(m.to, 'alice@test.uz');
  assert.match(m.code, /^\d{6}$/);
  assert.ok(m.subject.includes(m.code) && m.html.includes(m.code));
  const rec = await prisma.authCode.findFirst({ where: { user: { email: 'alice@test.uz' } } });
  assert.ok(rec && !rec.codeHash.includes(m.code) && rec.id !== r.json.challenge, 'bazada kod ham, token ham ochiq saqlanmaydi');
});

test('email kodi: noto\'g\'ri kod — 5 urinishdan keyin bekor; eski kod yangisidan keyin ishlamaydi', async () => {
  const c = client();
  await prisma.authCode.deleteMany({ where: { user: { email: 'alice@test.uz' } } });   // oldingi testdan qolgan kod
  const r1 = await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' });
  const code1 = lastCode('alice@test.uz');
  const again = await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' });
  assert.equal(again.status, 429, '60 s o\'tmay qayta kirish — yangi xat yuborilmaydi');
  assert.equal(again.json.error, 'RATE_LIMIT');
  await prisma.authCode.updateMany({ where: { user: { email: 'alice@test.uz' } }, data: { sentAt: new Date(Date.now() - 61000) } });
  const r2 = await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' });
  assert.equal((await c('POST', '/api/auth/verify', { challenge: r1.json.challenge, code: code1 })).json.error, 'CODE_EXPIRED', 'yangi kod eskisini bekor qiladi');
  const good = lastCode('alice@test.uz'), bad = good === '000000' ? '111111' : '000000';
  let w;
  for (let i = 1; i <= 4; i++) { w = await c('POST', '/api/auth/verify', { challenge: r2.json.challenge, code: bad }); assert.equal(w.json.error, 'WRONG_CODE'); assert.equal(w.json.details.left, 5 - i); }
  assert.equal((await c('POST', '/api/auth/verify', { challenge: r2.json.challenge, code: bad })).json.error, 'TOO_MANY_ATTEMPTS');
  assert.equal((await c('POST', '/api/auth/verify', { challenge: r2.json.challenge, code: good })).json.error, 'CODE_EXPIRED', 'to\'g\'ri kod ham endi ishlamaydi');
  assert.equal((await c('POST', '/api/auth/verify', { challenge: r2.json.challenge, code: '12ab56' })).status, 400);
});

test('email kodi: parallel noto\'g\'ri urinishlar 5 ta chegarani aylanib o\'ta olmaydi', async () => {
  const c = client();
  await prisma.authCode.deleteMany({ where: { user: { email: 'alice@test.uz' } } });
  const r = await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' });
  const good = lastCode('alice@test.uz'), bad = good === '000000' ? '111111' : '000000';
  const rs = await Promise.all(Array.from({ length: 12 }, () => c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: bad })));
  assert.ok(rs.filter((x) => x.json.error === 'WRONG_CODE').length <= 4, 'ko\'pi bilan 4 ta "yana urinib ko\'ring"');
  assert.equal((await c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: good })).json.error, 'CODE_EXPIRED');
});

test('email kodi: qayta ro\'yxatdan o\'tish orqali begona pochtaga xatlar oqimi cheklangan', async () => {
  const c = client();
  const body = { email: 'victim@test.uz' };
  assert.equal((await c('POST', '/api/auth/register', body)).status, 202);
  const n = outbox.length;
  const again = await c('POST', '/api/auth/register', body);
  assert.equal(again.status, 429);
  assert.equal(outbox.length, n, 'yangi xat yuborilmadi');
  const u = await prisma.user.findUnique({ where: { email: 'victim@test.uz' } });
  assert.equal(u.passwordHash, '', 'parol hali o\'rnatilmagan');
  assert.equal(u.name, '');
  // 60 s kutib turilsa ham, faol zanjirda 5 tadan ortiq xat yo'q
  for (let i = 0; i < 6; i++) {
    await prisma.authCode.updateMany({ where: { userId: u.id }, data: { sentAt: new Date(Date.now() - 61000) } });
    await c('POST', '/api/auth/register', body);
  }
  assert.equal(outbox.filter((m) => m.to === 'victim@test.uz').length, 5);
  await prisma.user.delete({ where: { id: u.id } });
});

test('email kodi: muddati o\'tgan kod; qayta yuborish 60 s dan keyin', async () => {
  const c = client();
  const r = await c('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-2' });
  const w = await c('POST', '/api/auth/resend', { challenge: r.json.challenge });
  assert.equal(w.json.error, 'RESEND_WAIT');
  assert.ok(w.json.details.wait > 50);
  const id = (await prisma.authCode.findFirst({ where: { user: { email: 'alice@test.uz' } } })).id;
  await prisma.authCode.update({ where: { id }, data: { sentAt: new Date(Date.now() - 61000) } });
  const n = outbox.length;
  assert.equal((await c('POST', '/api/auth/resend', { challenge: r.json.challenge })).status, 200);
  assert.equal(outbox.length, n + 1);
  await prisma.authCode.update({ where: { id }, data: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: lastCode('alice@test.uz') })).json.error, 'CODE_EXPIRED');
});

test('email kodi: kod kiritilmay qolgan ro\'yxat qayta ochiladi, lekin tasdiqlangan/eski hisobni egallab bo\'lmaydi', async () => {
  const c = client();
  assert.equal((await c('POST', '/api/auth/register', { email: 'half@test.uz' })).status, 202);
  assert.equal((await prisma.user.findUnique({ where: { email: 'half@test.uz' } })).emailVerified, false);
  await prisma.authCode.updateMany({ where: { user: { email: 'half@test.uz' } }, data: { sentAt: new Date(Date.now() - 61000) } });   // 60 s o'tdi
  // kod kelmadi / yo'qoldi — qayta ro'yxatdan o'tish mumkin
  const v = await signup(c, { name: 'Yarim2', email: 'half@test.uz', password: 'password-6' });
  assert.equal(v.status, 201);
  const u = await prisma.user.findUnique({ where: { email: 'half@test.uz' } });
  assert.equal(u.emailVerified, true); assert.equal(u.name, 'Yarim2');
  assert.equal((await c('POST', '/api/auth/register', { email: 'half@test.uz' })).json.error, 'EMAIL_EXISTS');
  // bu o'zgarishdan oldingi hisob (tasdiqlanmagan, lekin ishlatilgan) — ham himoyalangan
  await prisma.user.create({ data: { name: 'Old', email: 'old@test.uz', passwordHash: 'x', lastSeenAt: new Date() } });
  assert.equal((await c('POST', '/api/auth/register', { email: 'old@test.uz' })).json.error, 'EMAIL_EXISTS');
  await prisma.user.deleteMany({ where: { email: { in: ['half@test.uz', 'old@test.uz'] } } });
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

test('settings: qisman yangilash, noma\'lum kalit rad etiladi, joylashuv saqlanmaydi', async () => {
  await alice('PUT', '/api/me/settings', { lang: 'ru', voice: true });
  const r = await alice('PUT', '/api/me/settings', { theme: 'day' });
  assert.equal(r.json.settings.lang, 'ru');
  assert.equal(r.json.settings.voice, true);
  assert.equal(r.json.settings.theme, 'day');
  assert.equal((await alice('GET', '/api/auth/me')).json.user.lang, 'ru');
  assert.equal((await alice('PUT', '/api/me/settings', { hack: 1 })).status, 400);
  // Joylashuv qurilmaga xos va shaxsiy — server uni qabul qilmaydi
  assert.equal((await alice('PUT', '/api/me/settings', { loc: { lat: 41.3, lon: 69.2 } })).status, 400);
  // Bazada eski versiyadan qolgan loc bo'lsa ham tashqariga chiqmaydi
  const me = (await alice('GET', '/api/auth/me')).json.user;
  const row = await prisma.settings.findUnique({ where: { userId: me.id } });
  await prisma.settings.update({ where: { userId: me.id }, data: { data: { ...row.data, loc: { lat: 1, lon: 2 } } } });
  const g = (await alice('GET', '/api/me/settings')).json.settings;
  assert.equal(g.loc, undefined);
  assert.equal(g.theme, 'day');
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
  await signin(other, 'alice@test.uz', 'password-2');
  assert.equal((await alice('POST', '/api/me/password', { currentPassword: 'nope-nope', newPassword: 'password-new' })).json.error, 'WRONG_PASSWORD');
  assert.equal((await alice('POST', '/api/me/password', { currentPassword: 'password-2', newPassword: 'short' })).status, 400);
  assert.equal((await alice('POST', '/api/me/password', { currentPassword: 'password-2', newPassword: 'password-new' })).status, 200);
  assert.equal((await alice('GET', '/api/auth/me')).json.user.email, 'alice@test.uz');
  assert.equal((await other('GET', '/api/auth/me')).json.user, null);
  const c = client();
  assert.equal((await signin(c, 'alice@test.uz', 'password-new')).status, 200);
  await alice('POST', '/api/me/password', { currentPassword: 'password-new', newPassword: 'password-2' });
});

// fetch URL'ni normallashtiradi — shuning uchun xom HTTP so'rov (kodlangan ".." aynan yuboriladi)
function rawGet(p) {
  return new Promise((resolve, reject) => {
    const u = new URL(base);
    http.get({ host: u.hostname, port: u.port, path: p }, (r) => { r.resume(); r.on('end', () => resolve(r.statusCode)); }).on('error', reject);
  });
}

test('statik fayllar: kodlangan yo\'l orqali papkadan chiqib bo\'lmaydi (path traversal)', async () => {
  for (const p of ['/labs/%2e%2e/prisma/test.db', '/labs/..%2fprisma/test.db', '/photos/%2e%2e/package.json',
    '/labs/../server/config.js', '/textures/%2e%2e/.env', '/%2e%2e/package.json', '/package.json', '/server/app.js']) {
    const st = await rawGet(p);
    assert.ok(st === 403 || st === 404 || st === 400, p + ' -> ' + st);
  }
  assert.equal(await rawGet('/labs/core.js'), 200);
});

test('CSRF: Origin\'siz, lekin boshqa saytdan (Sec-Fetch-Site: cross-site) kelgan so\'rov rad etiladi', async () => {
  const r = await alice('POST', '/api/auth/logout', undefined, { 'Sec-Fetch-Site': 'cross-site' });
  assert.equal(r.status, 403);
  assert.equal((await alice('GET', '/api/auth/me')).json.user.name, 'Alice');
});

test('parol: 72 baytdan uzun parol qabul qilinmaydi (bcrypt chegarasi)', async () => {
  const c = client();
  const r = await c('POST', '/api/auth/register', { email: 'long@test.uz' });
  const v = await c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: lastCode('long@test.uz') });
  const p = await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'я'.repeat(40), name: 'L' });   // 80 bayt
  assert.equal(p.status, 400);
  assert.equal((await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'я'.repeat(36), name: 'L' })).status, 201, '72 bayt — mumkin');
  await prisma.user.delete({ where: { email: 'long@test.uz' } });
});

test('CSRF: boshqa domendan kelgan POST rad etiladi', async () => {
  const r = await alice('POST', '/api/auth/logout', undefined, { Origin: 'https://evil.example' });
  assert.equal(r.status, 403);
  assert.equal((await alice('GET', '/api/auth/me')).json.user.name, 'Alice');
});

test('admin: oddiy foydalanuvchi va mehmonga yopiq', async () => {
  assert.equal((await alice('GET', '/api/admin/stats')).status, 403);
  assert.equal((await client()('GET', '/api/admin/stats')).status, 401);
  // admin bo'lmagan / mehmon — shu manzilning o'zida alohida kirish sahifasi (saytga yo'naltirilmaydi)
  for (const c of [alice, client()]) {
    for (const url of ['/admin', '/admin.html']) {
      const p = await c('GET', url);
      assert.equal(p.status, 200, url);
      assert.match(p.text, /admin-login\.js/);
      assert.doesNotMatch(p.text, /src="admin\.js/);
    }
  }
  const page = await admin('GET', '/admin');
  assert.equal(page.status, 200);
  assert.match(page.text, /src="admin\.js/);
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

test('admin: ikki admin bir vaqtda bir-birini pasaytirsa ham bittasi qoladi', async () => {
  const second = client();
  await signup(second, { name: 'Admin2', email: 'admin2@test.uz', password: 'password-7' });
  const id2 = (await prisma.user.update({ where: { email: 'admin2@test.uz' }, data: { role: 'admin' } })).id;
  const bossId = (await admin('GET', '/api/auth/me')).json.user.id;
  const [r1, r2] = await Promise.all([
    admin('PATCH', `/api/admin/users/${id2}`, { role: 'user' }),
    second('PATCH', `/api/admin/users/${bossId}`, { role: 'user' }),
  ]);
  const bad = [r1, r2].filter((r) => r.status !== 200);
  assert.equal(bad.length, 1, 'bittasi o\'tadi, ikkinchisi rad etiladi');
  assert.ok(['LAST_ADMIN', 'FORBIDDEN'].includes(bad[0].json.error), bad[0].json.error);
  assert.equal(await prisma.user.count({ where: { role: 'admin', blocked: false } }), 1);
  // keyingi testlar uchun: boss yana admin, Admin2 o'chiriladi
  await prisma.user.update({ where: { id: bossId }, data: { role: 'admin' } });
  await prisma.user.delete({ where: { id: id2 } });
});

test('admin: CSV eksport (formula-injection himoyasi bilan)', async () => {
  const evil = client();
  await signup(evil, { name: '=HYPERLINK("x")', email: 'evil@test.uz', password: 'password-9' });
  await evil('POST', '/api/me/quiz', { quizId: 'quiz:hard', score: 1, total: 10 });
  const r = await admin('GET', '/api/admin/quiz.csv');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/csv/);
  assert.match(r.text, /quiz:hard/);
  assert.match(r.text, /"'=HYPERLINK\(""x""\)"/);
});

test('admin: foydalanuvchini o\'chirish — barcha ma\'lumotlari bilan', async () => {
  const id = (await admin('GET', '/api/admin/users?q=evil')).json.items[0].id;
  await prisma.pushSub.create({ data: { endpoint: 'https://fcm.googleapis.com/fcm/send/evil', p256dh: 'k', auth: 'a', lat: 41.3, lon: 69.3,
    tz: 5, prefs: { iss: true, showers: true }, sent: [], userId: id } });
  assert.equal((await admin('DELETE', `/api/admin/users/${id}`)).status, 200);
  assert.equal(await prisma.quizResult.count({ where: { userId: id } }), 0);
  assert.equal(await prisma.pushSub.count({ where: { userId: id } }), 0, 'eslatma obunasi (joylashuv) ham o\'chdi');
  assert.equal((await admin('DELETE', `/api/admin/users/${id}`)).status, 404);
});

test('statik fayllar: sayt beriladi, maxfiy fayllar yopiq', async () => {
  const c = client();
  const home = await c('GET', '/');
  assert.equal(home.status, 200);
  assert.equal(home.headers.get('cache-control'), 'no-cache', 'index.html har safar tekshirilishi kerak (yangi versiya darhol yetib borsin)');
  const js = await c('GET', '/script.js');
  assert.equal(js.status, 200);
  assert.equal(js.headers.get('cache-control'), 'no-cache');
  assert.equal((await c('GET', '/labs/core.js')).headers.get('cache-control'), 'no-cache');
  const tex = await c('GET', '/textures/2k_mars.jpg?v=1');
  assert.equal(tex.status, 200);
  assert.match(tex.headers.get('cache-control'), /immutable/);
  assert.equal((await c('GET', '/textures/nope.jpg')).status, 404);
  for (const p of ['/.env', '/package.json', '/server/app.js', '/prisma/schema.prisma', '/prisma/test.db', '/uploads/_crop.png', '/node_modules/express/package.json', '/.git/config']) {
    assert.equal((await c('GET', p)).status, 404, p);
  }
});

/* ---------- Yangi oqimlar: ro'yxatdan o'tish (email → kod → parol), parolni tiklash, admin kirishi, jurnal ---------- */
const cookieHours = (r) => (new Date(/Expires=([^;]+)/i.exec(r.headers.get('set-cookie'))[1]) - Date.now()) / 3600e3;

test('ro\'yxatdan o\'tish: email → kod → ism + parol; kod sessiya ochmaydi; parolsiz hisobga kirib bo\'lmaydi', async () => {
  const c = client();
  const r = await c('POST', '/api/auth/register', { email: 'New@test.uz', lang: 'ru' });
  assert.equal(r.status, 202);
  assert.equal(r.json.email, 'ne***@test.uz');
  let u = await prisma.user.findUnique({ where: { email: 'new@test.uz' } });
  assert.equal(u.passwordHash, ''); assert.equal(u.name, ''); assert.equal(u.emailVerified, false); assert.equal(u.lang, 'ru');
  assert.equal(outbox.at(-1).purpose, 'register');

  // parol hali o'rnatilmagan — kirish "noto'g'ri parol" kabi rad etiladi va xat yuborilmaydi
  const n = outbox.length;
  for (const pw of ['anything-1', '']) {
    const l = await client()('POST', '/api/auth/login', { email: 'new@test.uz', password: pw || 'x' });
    assert.equal(l.status, 401); assert.equal(l.json.error, 'INVALID_CREDENTIALS');
  }
  assert.equal(outbox.length, n);

  const v = await c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: lastCode('new@test.uz') });
  assert.equal(v.status, 200);
  assert.equal(v.json.purpose, 'register');
  assert.equal(v.json.user, undefined);
  assert.ok(typeof v.json.setup === 'string' && v.json.setup.length >= 20);
  assert.equal(v.headers.get('set-cookie'), null, 'kod tasdiqlangach ham sessiya yo\'q');
  assert.equal((await c('GET', '/api/auth/me')).json.user, null);
  assert.equal(await prisma.session.count({ where: { userId: u.id } }), 0);
  const row = await prisma.passwordSetup.findFirst({ where: { userId: u.id } });
  assert.ok(row && row.id !== v.json.setup, 'bazada token ochiq saqlanmaydi');
  assert.ok(row.expiresAt - Date.now() > 29 * 60e3 && row.expiresAt - Date.now() <= 30 * 60e3);

  assert.equal((await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'password-11' })).status, 400, 'ism majburiy');
  assert.equal((await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'short', name: 'N' })).status, 400);
  assert.equal((await c('POST', '/api/auth/password', { setup: 'x'.repeat(30), password: 'password-11', name: 'N' })).json.error, 'SETUP_EXPIRED');
  const p = await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'password-11', name: '  Yangi Odam ' });
  assert.equal(p.status, 201);
  assert.equal(p.json.user.name, 'Yangi Odam');
  assert.ok(cookieHours(p) > 29 * 24, 'oddiy sessiya — 30 kun');
  assert.equal((await c('GET', '/api/auth/me')).json.user.email, 'new@test.uz');
  assert.equal((await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'password-12', name: 'X' })).json.error, 'SETUP_EXPIRED', 'bir martalik');
  u = await prisma.user.findUnique({ where: { email: 'new@test.uz' } });
  assert.equal(u.emailVerified, true); assert.ok(u.lastSeenAt); assert.match(u.passwordHash, /^\$2[aby]\$/);
  assert.equal(await prisma.passwordSetup.count({ where: { userId: u.id } }), 0);
  assert.equal((await c('POST', '/api/auth/register', { email: 'new@test.uz' })).json.error, 'EMAIL_EXISTS');
  assert.equal((await signin(client(), 'new@test.uz', 'password-11')).status, 200);

  // muddati o'tgan ruxsat
  const r2 = await client()('POST', '/api/auth/register', { email: 'late@test.uz' });
  const v2 = await client()('POST', '/api/auth/verify', { challenge: r2.json.challenge, code: lastCode('late@test.uz') });
  await prisma.passwordSetup.updateMany({ where: { user: { email: 'late@test.uz' } }, data: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await client()('POST', '/api/auth/password', { setup: v2.json.setup, password: 'password-11', name: 'L' })).json.error, 'SETUP_EXPIRED');
  await prisma.user.delete({ where: { email: 'late@test.uz' } });
});

test('parolni tiklash: noma\'lum email — bir xil javob, xat yo\'q; ma\'lum — parol almashadi, eski sessiyalar yopiladi', async () => {
  const c = client();
  await client()('POST', '/api/auth/register', { email: 'pend@test.uz' });   // tasdiqlanmagan hisob — tiklab bo'lmaydi
  const old = client();   // tiklashdan oldin ochilgan sessiya (muvaffaqiyatli kirish foydalanuvchining boshqa kodlarini bekor qiladi)
  assert.equal((await signin(old, 'new@test.uz', 'password-11')).status, 200);
  const n = outbox.length;
  const fake = await c('POST', '/api/auth/reset', { email: 'ghost@test.uz' });
  const pend = await c('POST', '/api/auth/reset', { email: 'pend@test.uz' });
  const real = await c('POST', '/api/auth/reset', { email: 'new@test.uz' });
  for (const x of [fake, pend, real]) {
    assert.equal(x.status, 202);
    assert.deepEqual(Object.keys(x.json).sort(), Object.keys(real.json).sort());
    assert.equal(typeof x.json.challenge, 'string'); assert.equal(x.json.challenge.length, real.json.challenge.length);
  }
  assert.equal(fake.json.email, 'gh***@test.uz');
  assert.equal(outbox.length, n + 1, 'faqat haqiqiy hisobga xat ketdi');
  assert.equal(outbox.at(-1).to, 'new@test.uz'); assert.equal(outbox.at(-1).purpose, 'reset');
  // soxta zanjir: verify / resend / 60 s cheklovi ham haqiqiysi kabi javob beradi
  const fw = await c('POST', '/api/auth/verify', { challenge: fake.json.challenge, code: '123456' });
  assert.equal(fw.status, 400); assert.equal(fw.json.error, 'WRONG_CODE'); assert.equal(fw.json.details.left, 4);
  assert.equal((await c('POST', '/api/auth/resend', { challenge: fake.json.challenge })).json.error, 'RESEND_WAIT');
  for (const email of ['ghost@test.uz', 'new@test.uz']) {
    const again = await c('POST', '/api/auth/reset', { email });
    assert.equal(again.status, 429); assert.equal(again.json.error, 'RATE_LIMIT'); assert.ok(again.json.details.wait > 50);
  }
  assert.equal(outbox.length, n + 1);

  const v = await c('POST', '/api/auth/verify', { challenge: real.json.challenge, code: lastCode('new@test.uz') });
  assert.equal(v.status, 200); assert.equal(v.json.purpose, 'reset');
  assert.equal(v.headers.get('set-cookie'), null);
  assert.equal((await old('GET', '/api/auth/me')).json.user.email, 'new@test.uz', 'kod tasdiqlangani hali hech narsani o\'zgartirmaydi');
  assert.equal((await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'short' })).status, 400);
  const p = await c('POST', '/api/auth/password', { setup: v.json.setup, password: 'password-12', name: 'Boshqa' });
  assert.equal(p.status, 200);
  assert.equal(p.json.user.name, 'Yangi Odam', 'tiklashda ism o\'zgarmaydi');
  assert.equal((await old('GET', '/api/auth/me')).json.user, null, 'eski sessiyalar yopildi');
  assert.equal((await c('GET', '/api/auth/me')).json.user.email, 'new@test.uz');
  assert.equal((await client()('POST', '/api/auth/login', { email: 'new@test.uz', password: 'password-11' })).json.error, 'INVALID_CREDENTIALS');
  assert.equal((await signin(client(), 'new@test.uz', 'password-12')).status, 200);
  await prisma.user.delete({ where: { email: 'pend@test.uz' } });
});

test('admin kirishi: admin bo\'lmaganga 401 va xat yo\'q; adminga 12 soatlik sessiya; /admin sahifasi', async () => {
  const c = client(), n = outbox.length;
  for (const body of [{ email: 'new@test.uz', password: 'password-12' }, { email: 'boss@test.uz', password: 'wrong-pass' }, { email: 'nobody@test.uz', password: 'password-12' }]) {
    const r = await c('POST', '/api/auth/admin/login', body);
    assert.equal(r.status, 401); assert.equal(r.json.error, 'INVALID_CREDENTIALS');
  }
  assert.equal(outbox.length, n, 'xat yuborilmadi');
  assert.equal((await c('GET', '/admin')).text.includes('admin-login.js'), true);

  const r = await c('POST', '/api/auth/admin/login', { email: 'boss@test.uz', password: 'password-1' });
  assert.equal(r.status, 202);
  assert.equal(outbox.at(-1).to, 'boss@test.uz'); assert.equal(outbox.at(-1).purpose, 'admin-login');
  const v = await c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: lastCode('boss@test.uz') });
  assert.equal(v.status, 200); assert.equal(v.json.user.role, 'admin');
  const h = cookieHours(v);
  assert.ok(h > 11.9 && h <= 12, 'admin sessiyasi 12 soat: ' + h);
  const s = await prisma.session.findFirst({ where: { userId: v.json.user.id }, orderBy: { createdAt: 'desc' } });
  assert.ok(s.expiresAt - Date.now() <= 12 * 3600e3);
  const page = await c('GET', '/admin');
  assert.equal(page.status, 200); assert.match(page.text, /src="admin\.js/);

  // kod yuborilgach admin roli olib tashlansa — kod sessiya ochmaydi
  const c2 = client();
  await prisma.authCode.deleteMany({ where: { user: { email: 'boss@test.uz' } } });
  const r2 = await c2('POST', '/api/auth/admin/login', { email: 'boss@test.uz', password: 'password-1' });
  await prisma.user.update({ where: { email: 'boss@test.uz' }, data: { role: 'user' } });
  const v2 = await c2('POST', '/api/auth/verify', { challenge: r2.json.challenge, code: lastCode('boss@test.uz') });
  await prisma.user.update({ where: { email: 'boss@test.uz' }, data: { role: 'admin' } });
  assert.equal(v2.status, 403); assert.equal(v2.headers.get('set-cookie'), null);
});

test('jurnal: asosiy auth hodisalari yoziladi, parol va kodlar yozilmaydi', async () => {
  // kod 5 marta noto'g'ri — auth.code_failed; chiqish — auth.logout
  const c = client();
  await prisma.authCode.deleteMany({ where: { user: { email: 'new@test.uz' } } });
  const r = await c('POST', '/api/auth/login', { email: 'new@test.uz', password: 'password-12' });
  const bad = lastCode('new@test.uz') === '000000' ? '111111' : '000000';
  for (let i = 0; i < 5; i++) await c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: bad });
  const c2 = client();
  await signin(c2, 'new@test.uz', 'password-12');
  await c2('POST', '/api/auth/logout');
  await new Promise((ok) => setTimeout(ok, 100));   // audit() javobni kutmaydi

  const rows = await prisma.auditLog.findMany({ orderBy: { id: 'asc' } });
  const acts = new Set(rows.map((x) => x.action));
  for (const a of ['auth.register_start', 'auth.register_complete', 'auth.login', 'auth.login_failed', 'auth.code_failed',
    'auth.reset_start', 'auth.reset_complete', 'auth.admin_login', 'auth.admin_login_failed', 'auth.logout']) assert.ok(acts.has(a), a);
  const failed = rows.find((x) => x.action === 'auth.login_failed' && x.details?.email === 'nobody@test.uz');
  assert.ok(failed); assert.equal(failed.actorId, null);
  const al = rows.findLast((x) => x.action === 'auth.admin_login');
  assert.equal(al.actorEmail, 'boss@test.uz');
  assert.ok(rows.some((x) => x.action === 'auth.admin_login_failed' && x.details?.email === 'new@test.uz' && x.actorId === null));
  const resets = rows.filter((x) => x.action === 'auth.reset_start').map((x) => x.details.email);
  assert.ok(resets.includes('new@test.uz') && !resets.includes('ghost@test.uz') && !resets.includes('pend@test.uz'), 'soxta tiklash yozilmaydi');
  const all = JSON.stringify(rows);
  for (const secret of ['password-1"', 'password-11', 'password-12', 'wrong-pass', ...outbox.map((m) => '"' + m.code + '"')]) assert.ok(!all.includes(secret), secret);
  await prisma.user.delete({ where: { email: 'new@test.uz' } });
});

test('login rate-limit: 5 ta xato urinishdan keyin 429', async () => {
  const c = client();
  let last;
  for (let i = 0; i < 6; i++) last = await c('POST', '/api/auth/login', { email: 'boss@test.uz', password: 'nope-nope' });
  assert.equal(last.status, 429);
  assert.equal(last.json.error, 'RATE_LIMIT');
});
