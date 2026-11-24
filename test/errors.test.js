// Xatolar monitori testlari: qabul qilish (validatsiya, shovqin, PII tozalash, IP chegarasi), guruhlash,
// admin ruxsati, "hal qilindi" oqimi, server xatolari va Jurnalni xatolar yozuvlaridan ajratish.
// Alohida test bazasi (prisma/errors-test.db). Ishga tushirish: node --test test/errors.test.js
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DB = path.join(ROOT, 'prisma', 'errors-test.db');
process.env.DATABASE_URL = 'file:./errors-test.db';
process.env.BCRYPT_ROUNDS = '4';
process.env.NODE_ENV = 'test';
rmSync(DB, { force: true });
execSync('npx prisma db push --skip-generate', { cwd: ROOT, env: process.env, stdio: 'ignore' });

const { createApp } = await import('../server/app.js');
const { prisma } = await import('../server/db.js');
const { reportServerError, fingerprint, scrub, topFrame } = await import('../server/routes/errors.js');

let server, base;
before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(async () => {
  server.close();
  await prisma.$disconnect();
  rmSync(DB, { force: true });
  rmSync(DB + '-journal', { force: true });
});

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
async function mkUser(name, email, role = 'user') {
  return prisma.user.create({ data: { name, email, role, passwordHash: bcrypt.hashSync('password-1', 4), emailVerified: true, lastSeenAt: new Date() } });
}
const errRows = (where = {}) => prisma.auditLog.findMany({ where: { action: { in: ['client.error', 'server.error'] }, ...where }, orderBy: { id: 'asc' } });

const boss = client(), alice = client(), guest = client();
let posts = 0;   // POST /api/errors soni (IP chegarasi 30/10 daqiqa — oxirgi testgacha undan oshmaslik kerak)
const report = (body, c = guest) => { posts++; return c('POST', '/api/errors', body); };
const ok = (over = {}) => ({ kind: 'error', message: 'TypeError: x is undefined', source: '/script.js?v=12', line: 10, col: 5,
  stack: 'TypeError: x is undefined\n    at run (/script.js?v=12:10:5)', page: '/', ua: 'Chrome 131 · Windows', v: '12', auth: false, ...over });

test('tayyorgarlik', async () => {
  await mkUser('Boss', 'boss@test.uz', 'admin');
  await mkUser('Alice', 'alice@test.uz');
  assert.equal((await boss('POST', '/api/auth/login', { email: 'boss@test.uz', password: 'password-1' })).status, 200);
  assert.equal((await alice('POST', '/api/auth/login', { email: 'alice@test.uz', password: 'password-1' })).status, 200);
});

test('qabul: to\'g\'ri xato saqlanadi, foydalanuvchi/IP yozilmaydi', async () => {
  const r = await report(ok(), alice);   // kirgan foydalanuvchi bo'lsa ham — identifikatsiya saqlanmaydi
  assert.equal(r.status, 204);
  const [row] = await errRows();
  assert.equal(row.action, 'client.error');
  assert.equal(row.targetType, 'client');
  assert.match(row.targetId, /^[a-f0-9]{16}$/);
  assert.equal(row.actorId, null);
  assert.equal(row.actorEmail, null);
  assert.equal(row.ip, null);
  assert.equal(row.details.source, '/script.js', 'so\'rov qatori olib tashlanadi');
  assert.equal(row.details.line, 10);
  assert.equal(row.details.v, '12');
  assert.match(row.details.stack, /\/script\.js:10:5/);
  assert.doesNotMatch(row.details.stack, /\?v=/);
});

test('qabul: validatsiya va hajm chegaralari', async () => {
  assert.equal((await report({ ...ok(), extra: 1 })).status, 400, 'strict: ortiqcha maydon');
  assert.equal((await report({ ...ok(), message: '' })).status, 400, 'bo\'sh xabar');
  assert.equal((await report({ ...ok(), kind: 'boom' })).status, 400, 'noma\'lum tur');
  assert.equal((await report({ ...ok(), auth: 'yes' })).status, 400, 'auth faqat boolean');
  assert.equal((await report({ ...ok(), stack: 'x'.repeat(4001) })).status, 400, 'juda uzun stek');
  const r = await report(ok({ message: 'Long stack', stack: 'at a (/x.js:1:1)\n'.repeat(220) }));
  assert.equal(r.status, 204);
  const row = (await errRows({ targetType: 'client' })).at(-1);
  assert.ok(row.details.stack.length <= 2048, 'stek 2 KB gacha qisqartiriladi');
  assert.equal((await errRows()).length, 2, 'noto\'g\'ri so\'rovlar saqlanmaydi');
});

test('qabul: begona kengaytma va shovqin xatolari e\'tiborsiz qoldiriladi', async () => {
  const before = (await errRows()).length;
  for (const b of [
    ok({ message: 'Boom', source: 'chrome-extension://abcdef/content.js' }),
    ok({ message: 'Boom2', source: '/script.js', stack: 'at x (moz-extension://abc/inject.js:1:1)' }),
    ok({ message: 'ResizeObserver loop completed with undelivered notifications.' }),
    { kind: 'error', message: 'Script error.', page: '/', auth: false },
  ]) assert.equal((await report(b)).status, 204);
  assert.equal((await errRows()).length, before);
});

test('PII: email, URL parametrlari, tokenlar va sahifa so\'rov qatori tozalanadi', async () => {
  const r = await report(ok({
    message: 'Failed for ali@mail.uz at https://zenithra.onrender.com/api/x?email=ali@mail.uz&t=1 token=abc123secretvalue',
    source: 'https://cdn.example.com/lib.js?key=SECRET#frag',
    stack: 'Error\n    at f (/app.js?session=1a2b3c4d5e6f7g8h9i0j1k2l3m:1:2) eyJhbGciOiJIUzI1NiJ9abcdef1234567890',
    page: '/labs?user=ali@mail.uz#top',
  }));
  assert.equal(r.status, 204);
  const row = (await errRows()).at(-1);
  const all = JSON.stringify(row.details);
  assert.doesNotMatch(all, /ali@mail\.uz/);
  assert.doesNotMatch(all, /SECRET|frag|abc123secretvalue|1a2b3c4d5e6f7g8h|eyJhbGci/);
  assert.match(row.details.message, /\[email\]/);
  assert.match(row.details.message, /onrender\.com\/api\/x/);
  assert.equal(row.details.source, 'cdn.example.com/lib.js', 'begona domen: host + yo\'l');
  assert.equal(row.details.page, '/labs');
  // "Unexpected token '<'" kabi oddiy xabarlar buzilmaydi
  assert.equal(scrub("Unexpected token '<', \"<!DOCTYPE \" is not valid JSON"), "Unexpected token '<', \"<!DOCTYPE \" is not valid JSON");
});

test('guruhlash: xabar + yuqori kadr; raqamlar normallashtiriladi', async () => {
  const msg = (n) => ok({ message: `Timeout after ${n}ms`, source: '/labs/iss.js?v=4', line: 77, page: n % 2 ? '/a' : '/b' });
  for (const n of [1200, 999, 31]) assert.equal((await report(msg(n))).status, 204);
  assert.equal((await report(ok({ message: 'Timeout after 5ms', source: '/labs/iss.js', line: 78 }))).status, 204, 'boshqa qator — boshqa guruh');
  assert.equal(fingerprint('client', 'Timeout after 1ms', 'x.js:1'), fingerprint('client', 'Timeout after 22ms', 'x.js:1'));
  assert.notEqual(fingerprint('client', 'A', 'x.js:1'), fingerprint('server', 'A', 'x.js:1'));
  assert.equal(topFrame('Error: x\n    at fn (node:internal/x:1:1)\n    at go (/server/routes/me.js:12:5)'), '/server/routes/me.js:12');
  assert.equal(topFrame('fn@https://h.uz/labs/a.js?v=2:3:4'), 'h.uz/labs/a.js:3');

  const r = await boss('GET', '/api/admin/errors?days=1');
  assert.equal(r.status, 200);
  const g = r.json.items.find((x) => x.message.startsWith('Timeout after') && x.line === 77);
  assert.ok(g, 'guruh topildi');
  assert.equal(g.count, 3);
  assert.equal(g.kind, 'client');
  assert.equal(g.source, '/labs/iss.js');
  assert.equal(g.resolved, false);
  assert.deepEqual(g.pages.map((p) => p.page).sort(), ['/a', '/b']);
  assert.ok(new Date(g.firstSeen) <= new Date(g.lastSeen));
  assert.equal(r.json.items.filter((x) => x.message.startsWith('Timeout after')).length, 2);
  assert.ok(r.json.open24h >= 2);

  const d = await boss('GET', `/api/admin/errors/${g.fp}`);
  assert.equal(d.status, 200);
  assert.equal(d.json.group.count, 3);
  assert.equal(d.json.samples.length, 3);
  assert.equal(d.json.samples[0].details.ua, 'Chrome 131 · Windows');
  assert.equal((await boss('GET', '/api/admin/errors/0123456789abcdef')).status, 404);
  assert.equal((await boss('GET', '/api/admin/errors/not-a-fp')).status, 400);
  assert.equal((await boss('GET', '/api/admin/errors?days=3')).status, 400);

  const csv = await boss('GET', '/api/admin/errors.csv?days=1');
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get('content-type'), /text\/csv/);
  assert.match(csv.text, /Timeout after/);
});

test('admin ruxsati: mehmon 401, oddiy foydalanuvchi 403', async () => {
  for (const [m, u] of [['GET', '/api/admin/errors'], ['GET', '/api/admin/errors/summary'], ['GET', '/api/admin/errors.csv'],
    ['GET', '/api/admin/errors/0123456789abcdef'], ['POST', '/api/admin/errors/0123456789abcdef/resolve']]) {
    assert.equal((await guest(m, u)).status, 401, `${m} ${u} mehmon`);
    assert.equal((await alice(m, u)).status, 403, `${m} ${u} oddiy foydalanuvchi`);
  }
});

test('hal qilish: guruh yopiladi, xato qayta chiqsa yana ochiladi', async () => {
  const list = async (status = 'all') => (await boss('GET', `/api/admin/errors?days=1&status=${status}`)).json;
  const g = (await list()).items.find((x) => x.message.startsWith('Timeout after') && x.line === 77);
  const open0 = (await boss('GET', '/api/admin/errors/summary')).json.open24h;

  const r = await boss('POST', `/api/admin/errors/${g.fp}/resolve`);
  assert.equal(r.status, 200);
  assert.equal(r.json.open24h, open0 - 1);
  const resolved = (await list('resolved')).items.find((x) => x.fp === g.fp);
  assert.ok(resolved && resolved.resolved && resolved.resolvedAt);
  assert.ok(!(await list('open')).items.some((x) => x.fp === g.fp));
  const ev = await prisma.auditLog.findFirst({ where: { action: 'admin.error.resolve', targetId: g.fp } });
  assert.equal(ev.actorEmail, 'boss@test.uz');
  assert.equal(ev.targetType, 'error');
  assert.equal((await boss('POST', '/api/admin/errors/0123456789abcdef/resolve')).status, 404);

  await new Promise((res) => setTimeout(res, 15));
  assert.equal((await report(ok({ message: 'Timeout after 7ms', source: '/labs/iss.js', line: 77 }))).status, 204);
  const again = (await list('open')).items.find((x) => x.fp === g.fp);
  assert.ok(again, 'qayta paydo bo\'ldi');
  assert.equal(again.resolved, false);
  assert.equal(again.count, 4);
  assert.equal((await boss('GET', '/api/admin/errors/summary')).json.open24h, open0);
  const d = await boss('GET', `/api/admin/errors/${g.fp}`);
  assert.equal(d.json.resolutions.length, 1);
});

test('server xatolari: reportServerError guruhga tushadi, shaxsiy ma\'lumotsiz', async () => {
  const err = new Error('DB exploded for bob@test.uz');
  err.code = 'P1001';
  const req = { method: 'GET', baseUrl: '/api/me', path: '/profile', originalUrl: '/api/me/profile?x=1', ip: '1.2.3.4', user: { id: 1, email: 'bob@test.uz' } };
  await reportServerError(err, req);
  await reportServerError(err, req);
  const rows = await errRows({ action: 'server.error' });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].targetId, rows[1].targetId);
  assert.equal(rows[0].ip, null);
  assert.equal(rows[0].actorId, null);
  assert.equal(rows[0].details.page, '/api/me/profile');
  assert.equal(rows[0].details.code, 'P1001');
  assert.doesNotMatch(JSON.stringify(rows[0].details), /bob@test\.uz/);
  assert.doesNotMatch(rows[0].details.stack || '', new RegExp(ROOT.replaceAll('\\', '\\\\')), 'mutlaq yo\'l olib tashlanadi');
  assert.doesNotThrow(() => reportServerError(null, null), 'hech qachon xato otmaydi');

  const r = await boss('GET', '/api/admin/errors?days=1&kind=server');
  assert.equal(r.status, 200);
  assert.ok(r.json.items.length >= 1);
  assert.ok(r.json.items.every((x) => x.kind === 'server'));
  assert.equal(r.json.items.find((x) => x.fp === rows[0].targetId).count, 2);
});

test('Jurnal: client./server. yozuvlari standart bo\'yicha yashirin', async () => {
  const def = await boss('GET', '/api/admin/audit?pageSize=100');
  assert.equal(def.status, 200);
  assert.ok(!def.json.items.some((e) => /^(client|server)\./.test(e.action)));
  assert.ok(def.json.items.some((e) => e.action === 'admin.error.resolve'), 'admin amali ko\'rinadi');
  const sys = await boss('GET', '/api/admin/audit?pageSize=100&sys=1');
  assert.ok(sys.json.items.some((e) => e.action === 'client.error'));
  assert.ok(sys.json.items.some((e) => e.action === 'server.error'));
  const only = await boss('GET', '/api/admin/audit?pageSize=100&action=client.error');
  assert.ok(only.json.items.length && only.json.items.every((e) => e.action === 'client.error'));
  const pref = await boss('GET', '/api/admin/audit?pageSize=100&action=server.*');
  assert.ok(pref.json.items.length && pref.json.items.every((e) => e.action === 'server.error'));
  const csv = await boss('GET', '/api/admin/audit.csv');
  assert.doesNotMatch(csv.text, /client\.error/);
});

test('IP chegarasi: 10 daqiqada 30 ta so\'rov, keyin 429', async () => {
  assert.ok(posts < 30, `oldingi testlar ${posts} ta so'rov yubordi`);
  let last;
  for (let i = posts; i < 31; i++) last = await report(ok({ message: `flood ${i}` }));
  assert.equal(last.status, 429);
  assert.equal(last.json.error, 'RATE_LIMIT');
});
