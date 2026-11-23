// Admin paneli testlari: foydalanuvchilarni boshqarish, jurnal, kontent (savollar), statistika va javoblar statistikasi.
// Alohida test bazasi (prisma/admin-test.db). Ishga tushirish: npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { rmSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DB = path.join(ROOT, 'prisma', 'admin-test.db');
process.env.DATABASE_URL = 'file:./admin-test.db';
process.env.BCRYPT_ROUNDS = '4';
process.env.NODE_ENV = 'test';
rmSync(DB, { force: true });
execSync('npx prisma db push --skip-generate', { cwd: ROOT, env: process.env, stdio: 'ignore' });

const { createApp } = await import('../server/app.js');
const { prisma } = await import('../server/db.js');
const { outbox } = await import('../server/mailer.js');
const { builtinCatalog } = await import('../server/builtins.js');

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

// Kichik "brauzer": cookie'ni saqlab boradi
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
    const text = Buffer.from(await r.arrayBuffer()).toString('utf8');   // r.text() BOM ni olib tashlaydi
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: r.status, json, text, headers: r.headers };
  };
}
const lastCode = (to) => [...outbox].reverse().find((m) => m.to === to).code;
async function mkUser(name, email, role = 'user', password = 'password-1') {
  return prisma.user.create({ data: { name, email, role, passwordHash: bcrypt.hashSync(password, 4), emailVerified: true, lastSeenAt: new Date() } });
}
async function login(c, email, password = 'password-1') {
  const r = await c('POST', '/api/auth/login', { email, password });
  if (r.status !== 202) return r;
  return c('POST', '/api/auth/verify', { challenge: r.json.challenge, code: lastCode(email) });
}
// Jurnal yozuvi "fire-and-forget" — javobdan keyin bir oz kechikib yozilishi mumkin, shuning uchun biroz kutamiz
async function lastAudit(action, where = {}) {
  for (let i = 0; i < 40; i++) {
    const row = await prisma.auditLog.findFirst({ where: { action, ...where }, orderBy: { id: 'desc' } });
    if (row) return row;
    await new Promise((r) => setTimeout(r, 25));
  }
  return null;
}

const boss = client(), boss2 = client(), alice = client(), bob = client(), guest = client();
let BOSS, BOSS2, ALICE, BOB;

test('tayyorgarlik: foydalanuvchilar va kirish', async () => {
  BOSS = await mkUser('Boss', 'boss@test.uz', 'admin');
  BOSS2 = await mkUser('Boss Two', 'boss2@test.uz', 'admin');
  ALICE = await mkUser('Alice', 'alice@test.uz');
  BOB = await mkUser('Bob', 'bob@test.uz');
  for (const [c, u] of [[boss, BOSS], [boss2, BOSS2], [alice, ALICE], [bob, BOB]]) {
    const r = await login(c, u.email);
    assert.equal(r.status, 200, `${u.email} kira olishi kerak`);
  }
  assert.equal((await boss('GET', '/api/auth/me')).json.user.role, 'admin');
});

test('yangi admin endpointlari: mehmon 401, oddiy foydalanuvchi 403', async () => {
  const eps = [
    ['GET', `/api/admin/users/${ALICE.id}`], ['PATCH', `/api/admin/users/${ALICE.id}`, { name: 'X' }],
    ['POST', `/api/admin/users/${ALICE.id}/revoke-sessions`], ['POST', `/api/admin/users/${ALICE.id}/force-reset`],
    ['GET', '/api/admin/users.csv'], ['GET', '/api/admin/audit'], ['GET', '/api/admin/audit/actions'], ['GET', '/api/admin/audit.csv'],
    ['GET', '/api/admin/content/meta'], ['GET', '/api/admin/content/questions'], ['POST', '/api/admin/content/questions', {}],
    ['PUT', '/api/admin/content/questions/1', {}], ['PATCH', '/api/admin/content/questions/1', { active: false }],
    ['DELETE', '/api/admin/content/questions/1'], ['GET', '/api/admin/content/builtin'],
    ['POST', '/api/admin/content/builtin/hidden', { qid: 'b:quiz:easy:x', hidden: true }],
    ['GET', '/api/admin/stats/daily'], ['GET', '/api/admin/stats/topics'], ['GET', '/api/admin/stats/questions'], ['GET', '/api/admin/stats.csv'],
  ];
  for (const [m, u, b] of eps) {
    assert.equal((await guest(m, u, b)).status, 401, `${m} ${u} mehmon`);
    assert.equal((await alice(m, u, b)).status, 403, `${m} ${u} oddiy foydalanuvchi`);
  }
});

test('foydalanuvchi kartasi: profil, sessiyalar, progress, natijalar, jurnal', async () => {
  await alice('PUT', '/api/me/progress', { progress: { t05: { v: 1, s: 6, t: 8, b: 6, d: Date.now() } } });
  await alice('POST', '/api/me/quiz', { quizId: 'quiz:easy', score: 7, total: 10 });
  const r = await boss('GET', `/api/admin/users/${ALICE.id}`);
  assert.equal(r.status, 200);
  const { user, stats, progress, quizResults, events } = r.json;
  assert.equal(user.email, 'alice@test.uz');
  assert.equal(user.sessions, 1);
  assert.equal(user.hasPassword, true);
  assert.equal(user.emailVerified, true);
  assert.equal('passwordHash' in user, false, 'parol xeshi tashqariga chiqmaydi');
  assert.equal(stats.quizCount, 1);
  assert.equal(stats.avgPercent, 70);
  assert.equal(progress[0].topicId, 't05');
  assert.equal(quizResults[0].score, 7);
  assert.ok(Array.isArray(events) && events.some((e) => e.action === 'auth.login'), 'kirish hodisasi kartada ko\'rinadi');
  assert.equal((await boss('GET', '/api/admin/users/999999')).status, 404);
});

test('ism va email: unikal email, email o\'zgarsa sessiyalar yopiladi, jurnalga before/after', async () => {
  const dup = await boss('PATCH', `/api/admin/users/${BOB.id}`, { email: 'ALICE@test.uz' });
  assert.equal(dup.status, 409);
  assert.equal(dup.json.error, 'EMAIL_EXISTS');
  assert.equal((await boss('PATCH', `/api/admin/users/${BOB.id}`, { email: 'not-an-email' })).status, 400);
  assert.equal((await boss('PATCH', `/api/admin/users/${BOB.id}`, { name: '' })).status, 400);
  assert.equal((await boss('PATCH', `/api/admin/users/${BOB.id}`, { foo: 1 })).status, 400, 'strict');
  assert.equal((await boss('PATCH', `/api/admin/users/${BOB.id}`, {})).status, 400);

  assert.equal((await bob('GET', '/api/auth/me')).json.user.email, 'bob@test.uz');
  const r = await boss('PATCH', `/api/admin/users/${BOB.id}`, { name: 'Robert', email: 'Robert@Test.uz' });
  assert.equal(r.status, 200);
  assert.equal(r.json.user.email, 'robert@test.uz');
  assert.equal(r.json.user.name, 'Robert');
  assert.equal(r.json.sessionsRevoked, 1);
  assert.equal((await bob('GET', '/api/auth/me')).json.user, null, 'email o\'zgargach sessiya yopilgan');
  const a = await lastAudit('admin.user.update', { targetId: String(BOB.id) });
  assert.equal(a.actorEmail, 'boss@test.uz');
  assert.deepEqual(a.details.before, { name: 'Bob', email: 'bob@test.uz' });
  assert.deepEqual(a.details.after, { name: 'Robert', email: 'robert@test.uz' });
  // yangi email bilan kirish ishlaydi
  assert.equal((await login(bob, 'robert@test.uz')).status, 200);

  // faqat ism o'zgarsa sessiya yopilmaydi
  const n = await boss('PATCH', `/api/admin/users/${BOB.id}`, { name: 'Bobby' });
  assert.equal(n.json.sessionsRevoked, 0);
  assert.ok((await bob('GET', '/api/auth/me')).json.user);
});

test('o\'ziga nisbatan himoya: rol, blok, email, sessiyalar, parol, o\'chirish — SELF_ACTION; ism mumkin', async () => {
  for (const body of [{ role: 'user' }, { blocked: true }, { email: 'me2@test.uz' }]) {
    const r = await boss('PATCH', `/api/admin/users/${BOSS.id}`, body);
    assert.equal(r.status, 400);
    assert.equal(r.json.error, 'SELF_ACTION');
  }
  for (const u of [`/api/admin/users/${BOSS.id}/revoke-sessions`, `/api/admin/users/${BOSS.id}/force-reset`]) {
    assert.equal((await boss('POST', u)).json.error, 'SELF_ACTION');
  }
  assert.equal((await boss('DELETE', `/api/admin/users/${BOSS.id}`)).json.error, 'SELF_ACTION');
  const ok = await boss('PATCH', `/api/admin/users/${BOSS.id}`, { name: 'Big Boss' });
  assert.equal(ok.status, 200);
  assert.equal(ok.json.user.name, 'Big Boss');
});

test('rol va oxirgi admin: ikki admin bir-birini bir vaqtda pasaytirsa ham kamida bitta faol admin qoladi', async () => {
  const [a, b] = await Promise.all([
    boss('PATCH', `/api/admin/users/${BOSS2.id}`, { role: 'user' }),
    boss2('PATCH', `/api/admin/users/${BOSS.id}`, { role: 'user' }),
  ]);
  const statuses = [a, b].map((r) => r.json?.error || r.status).sort();
  // Biri muvaffaqiyatli; ikkinchisi yo LAST_ADMIN, yo (rolini yo'qotgani uchun) FORBIDDEN
  assert.ok(statuses.includes(200), JSON.stringify(statuses));
  assert.equal(await prisma.user.count({ where: { role: 'admin', blocked: false } }), 1, 'kamida bitta admin qoladi');
  // Holatni tiklaymiz: Boss — admin, Boss2 — admin
  await prisma.user.updateMany({ where: { id: { in: [BOSS.id, BOSS2.id] } }, data: { role: 'admin' } });
  const role = await lastAudit('admin.user.role');
  assert.equal(role.details.before, 'admin');
  assert.equal(role.details.after, 'user');

  // Rolni berish/olish bitta so'rovda
  const up = await boss('PATCH', `/api/admin/users/${ALICE.id}`, { role: 'admin' });
  assert.equal(up.json.user.role, 'admin');
  assert.equal((await boss('PATCH', `/api/admin/users/${ALICE.id}`, { role: 'user' })).json.user.role, 'user');
  assert.equal((await lastAudit('admin.user.role', { targetId: String(ALICE.id) })).details.after, 'user');
});

test('blok / blokdan chiqarish: sessiyalar yopiladi, bloklangan kira olmaydi, jurnal', async () => {
  const r = await boss('PATCH', `/api/admin/users/${BOB.id}`, { blocked: true });
  assert.equal(r.status, 200);
  assert.equal(r.json.user.blocked, true);
  assert.equal((await bob('GET', '/api/auth/me')).json.user, null);
  assert.equal((await bob('POST', '/api/auth/login', { email: 'robert@test.uz', password: 'password-1' })).json.error, 'BLOCKED');
  assert.ok(await lastAudit('admin.user.block', { targetId: String(BOB.id) }));
  assert.equal((await boss('PATCH', `/api/admin/users/${BOB.id}`, { blocked: false })).json.user.blocked, false);
  assert.ok(await lastAudit('admin.user.unblock', { targetId: String(BOB.id) }));
  assert.equal((await login(bob, 'robert@test.uz')).status, 200);
});

test('sessiyalarni yopish', async () => {
  const r = await boss('POST', `/api/admin/users/${BOB.id}/revoke-sessions`);
  assert.equal(r.status, 200);
  assert.equal(r.json.sessionsRevoked, 1);
  assert.equal((await bob('GET', '/api/auth/me')).json.user, null);
  const a = await lastAudit('admin.user.revoke_sessions');
  assert.equal(a.details.sessionsRevoked, 1);
  assert.equal(a.targetId, String(BOB.id));
  assert.equal((await boss('POST', '/api/admin/users/999999/revoke-sessions')).status, 404);
});

test('parolni majburiy tiklash: parol bekor, sessiyalar yopiladi, eski parol bilan kirib bo\'lmaydi', async () => {
  await login(bob, 'robert@test.uz');
  const r = await boss('POST', `/api/admin/users/${BOB.id}/force-reset`);
  assert.equal(r.status, 200);
  assert.equal(r.json.sessionsRevoked, 1);
  assert.equal((await prisma.user.findUnique({ where: { id: BOB.id } })).passwordHash, '');
  assert.equal((await bob('GET', '/api/auth/me')).json.user, null);
  assert.equal((await bob('POST', '/api/auth/login', { email: 'robert@test.uz', password: 'password-1' })).json.error, 'INVALID_CREDENTIALS');
  const a = await lastAudit('admin.user.force_reset');
  assert.equal(a.details.hadPassword, true);
  const card = await boss('GET', `/api/admin/users/${BOB.id}`);
  assert.equal(card.json.user.hasPassword, false);
  assert.ok(card.json.events.some((e) => e.action === 'admin.user.force_reset'));
});

test('o\'zi bajargan amallar jurnalda: me.profile_update, me.password_change', async () => {
  assert.equal((await alice('PATCH', '/api/me/profile', { name: 'Alisa' })).status, 200);
  const p = await lastAudit('me.profile_update');
  assert.equal(p.actorId, ALICE.id);
  assert.deepEqual(p.details, { before: { name: 'Alice' }, after: { name: 'Alisa' } });
  assert.equal((await alice('POST', '/api/me/password', { currentPassword: 'password-1', newPassword: 'password-2' })).status, 200);
  const w = await lastAudit('me.password_change');
  assert.equal(w.actorId, ALICE.id);
  assert.ok(!JSON.stringify(w.details).includes('password-2'), 'parol jurnalga yozilmaydi');
});

test('o\'chirish: jurnal yozuvi foydalanuvchi o\'chgandan keyin ham qoladi', async () => {
  const tmp = await mkUser('=HYPERLINK("x")', 'tmp@test.uz');
  // CSV formula himoyasi
  const csv = await boss('GET', '/api/admin/users.csv?q=tmp');
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get('content-type'), /text\/csv/);
  assert.ok(csv.text.startsWith('﻿'), 'UTF-8 BOM');
  assert.ok(csv.text.includes('"\'=HYPERLINK(""x"")"'), csv.text);
  assert.match(csv.text.split('\r\n')[0], /^﻿id,name,email,role,blocked/);

  assert.equal((await boss('DELETE', `/api/admin/users/${tmp.id}`)).status, 200);
  assert.equal(await prisma.user.count({ where: { id: tmp.id } }), 0);
  const a = await lastAudit('admin.user.delete', { targetId: String(tmp.id) });
  assert.equal(a.details.email, 'tmp@test.uz');
  assert.equal((await boss('DELETE', `/api/admin/users/${tmp.id}`)).status, 404);
});

test('jurnal: filtrlar, sahifalash, amallar ro\'yxati, CSV', async () => {
  const all = await boss('GET', '/api/admin/audit?pageSize=5');
  assert.equal(all.status, 200);
  assert.equal(all.json.items.length, 5);
  assert.ok(all.json.total > 5);
  assert.ok(all.json.items[0].id > all.json.items[1].id, 'yangilari birinchi');

  const exact = await boss('GET', '/api/admin/audit?action=admin.user.block');
  assert.ok(exact.json.total >= 1 && exact.json.items.every((e) => e.action === 'admin.user.block'));
  const prefix = await boss('GET', '/api/admin/audit?action=admin.user.*&pageSize=100');
  assert.ok(prefix.json.items.length > 1 && prefix.json.items.every((e) => e.action.startsWith('admin.user.')));
  const actor = await boss('GET', '/api/admin/audit?actor=boss2&pageSize=100');
  assert.ok(actor.json.total >= 1 && actor.json.items.every((e) => e.actorEmail === 'boss2@test.uz'));
  const tId = await boss('GET', `/api/admin/audit?target=${BOB.id}&pageSize=100`);
  assert.ok(tId.json.items.length >= 3 && tId.json.items.every((e) => e.targetType === 'user' && e.targetId === String(BOB.id)));
  assert.equal(tId.json.items[0].target.email, 'robert@test.uz', 'nishon foydalanuvchining hozirgi ma\'lumoti');
  const tEmail = await boss('GET', '/api/admin/audit?target=robert&pageSize=100');
  assert.equal(tEmail.json.total, tId.json.total);
  const future = new Date(Date.now() + 864e5).toISOString();
  assert.equal((await boss('GET', `/api/admin/audit?from=${future}`)).json.total, 0);
  assert.equal((await boss('GET', `/api/admin/audit?to=2000-01-01T00:00:00Z`)).json.total, 0);
  assert.equal((await boss('GET', '/api/admin/audit?from=not-a-date')).status, 400);
  assert.equal((await boss('GET', '/api/admin/audit?action=DROP TABLE')).status, 400);
  const p2 = await boss('GET', '/api/admin/audit?pageSize=5&page=2');
  assert.notEqual(p2.json.items[0].id, all.json.items[0].id);

  const acts = await boss('GET', '/api/admin/audit/actions');
  assert.ok(acts.json.actions.some((a) => a.action === 'admin.user.force_reset' && a.count >= 1));

  const csv = await boss('GET', '/api/admin/audit.csv?action=admin.user.*');
  assert.ok(csv.text.startsWith('﻿id,created_at,action,actor_id,actor_email,target_type,target_id,ip,details\r\n'));
  assert.ok(csv.text.includes('admin.user.force_reset'));
  assert.ok(!csv.text.includes('auth.login,'), 'filtr CSV ga ham qo\'llanadi');
});

/* ---------------- Kontent ---------------- */

const L3 = (s) => ({ uz: `${s} uz`, ru: `${s} ru`, en: `${s} en` });
const newQ = (over = {}) => ({
  scope: 'quiz', level: 'easy', question: L3('Savol 1'),
  options: [L3('A'), L3('B'), L3('C')], correct: 1, explain: L3('Izoh'), ...over,
});
let Q1, Q2;

test('kontent: savol yaratish — validatsiya (3 til, variantlar, daraja, mavzu, izoh)', async () => {
  const bad = [
    newQ({ question: { uz: 'a', ru: '', en: 'c' } }),
    newQ({ question: { uz: 'a', ru: 'b' } }),
    newQ({ options: [L3('A')] }),
    newQ({ options: Array.from({ length: 7 }, (_, i) => L3('O' + i)) }),
    newQ({ correct: 3 }),
    newQ({ level: 'extreme' }),
    newQ({ scope: 'dz', level: 't999' }),
    newQ({ scope: 'dz', level: 'easy' }),
    newQ({ explain: { uz: 'faqat uz', ru: '', en: '' } }),
    newQ({ options: [L3('A'), L3('A')], correct: 0 }),
    { ...newQ(), extra: 1 },
  ];
  for (const b of bad) {
    const r = await boss('POST', '/api/admin/content/questions', b);
    assert.equal(r.status, 400, JSON.stringify(b).slice(0, 120));
    assert.equal(r.json.error, 'VALIDATION');
  }
});

test('kontent: yaratish, ro\'yxat, tahrirlash, faol/nofaol, o\'chirish + jurnal', async () => {
  const c1 = await boss('POST', '/api/admin/content/questions', newQ({ question: L3('Quyosh qaysi yulduz') }));
  assert.equal(c1.status, 201);
  Q1 = c1.json.question;
  assert.equal(Q1.qid, `c:${Q1.id}`);
  assert.equal(Q1.active, true);
  const c2 = await boss('POST', '/api/admin/content/questions', newQ({ scope: 'dz', level: 't07', question: L3('Kepler qonuni'), explain: { uz: '', ru: '', en: '' } }));
  assert.equal(c2.status, 201);
  Q2 = c2.json.question;
  assert.equal(Q2.explain, null, 'bo\'sh izoh — null');
  assert.equal((await lastAudit('content.question.create', { targetId: String(Q1.id) })).details.question, 'Quyosh qaysi yulduz uz');

  const list = await boss('GET', '/api/admin/content/questions?scope=quiz&level=easy');
  assert.ok(list.json.items.some((q) => q.id === Q1.id) && list.json.items.every((q) => q.scope === 'quiz'));
  const search = await boss('GET', '/api/admin/content/questions?q=kepler%20qonuni%20RU');
  assert.deepEqual(search.json.items.map((q) => q.id), [Q2.id], 'qidiruv 3 tilda');

  const up = await boss('PUT', `/api/admin/content/questions/${Q1.id}`, newQ({ question: L3('Quyosh — sariq mitti'), correct: 2 }));
  assert.equal(up.status, 200);
  assert.equal(up.json.question.correct, 2);
  const ua = await lastAudit('content.question.update', { targetId: String(Q1.id) });
  assert.equal(ua.details.before.question, 'Quyosh qaysi yulduz uz');
  assert.equal(ua.details.after.correct, 2);
  assert.equal((await boss('PUT', '/api/admin/content/questions/99999', newQ())).status, 404);

  const off = await boss('PATCH', `/api/admin/content/questions/${Q2.id}`, { active: false });
  assert.equal(off.json.question.active, false);
  assert.ok(await lastAudit('content.question.deactivate', { targetId: String(Q2.id) }));
  assert.equal((await boss('GET', '/api/admin/content/questions?active=0')).json.items.length, 1);

  const pub = await guest('GET', '/api/content/questions');
  assert.equal(pub.status, 200);
  assert.ok(pub.json.custom.some((q) => q.qid === Q1.qid), 'faol savol ommaviy');
  assert.ok(!pub.json.custom.some((q) => q.qid === Q2.qid), 'nofaol savol ommaviy ro\'yxatda yo\'q');
  const pq = pub.json.custom.find((q) => q.qid === Q1.qid);
  assert.deepEqual(Object.keys(pq).sort(), ['correct', 'explain', 'level', 'options', 'qid', 'question', 'scope']);

  await boss('PATCH', `/api/admin/content/questions/${Q2.id}`, { active: true });
  assert.ok(await lastAudit('content.question.activate', { targetId: String(Q2.id) }));
  assert.ok((await guest('GET', '/api/content/questions')).json.custom.some((q) => q.qid === Q2.qid));

  const tmp = (await boss('POST', '/api/admin/content/questions', newQ({ question: L3('Vaqtinchalik') }))).json.question;
  await prisma.questionStat.create({ data: { qid: tmp.qid, scope: 'quiz', level: 'easy', text: 'x', shown: 3, correct: 1 } });
  assert.equal((await boss('DELETE', `/api/admin/content/questions/${tmp.id}`)).status, 200);
  assert.equal(await prisma.questionStat.count({ where: { qid: tmp.qid } }), 0, 'statistikasi ham o\'chadi');
  assert.ok(await lastAudit('content.question.delete', { targetId: String(tmp.id) }));
  assert.equal((await boss('DELETE', `/api/admin/content/questions/${tmp.id}`)).status, 404);

  const meta = await boss('GET', '/api/admin/content/meta');
  assert.deepEqual(meta.json.levels.quiz, ['easy', 'medium', 'hard']);
  assert.equal(meta.json.levels.dz.length, 40);
  assert.equal(meta.json.count['quiz:easy'].custom, 1);
  assert.ok(meta.json.count['quiz:easy'].builtin >= 20);
});

test('o\'rnatilgan savollar: katalog, yashirish/qaytarish, ommaviy hidden ro\'yxati', async () => {
  const r = await boss('GET', '/api/admin/content/builtin?scope=quiz&level=easy&pageSize=100');
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
  assert.ok(r.json.total >= 20);
  const it = r.json.items[0];
  assert.match(it.qid, /^b:quiz:easy:[0-9a-z]+$/);
  assert.ok(it.question.uz && it.question.ru && it.question.en);
  assert.equal(it.hidden, false);
  const dz = await boss('GET', '/api/admin/content/builtin?scope=dz&level=t07');
  assert.ok(dz.json.total > 0 && dz.json.items.every((q) => q.correct === 0 && q.qid.startsWith('b:dz:t07:')));
  // qid lar takrorlanmaydi (bir xil matnli savollar .2 qo'shimchasini oladi)
  const cat = builtinCatalog();
  assert.equal(cat.byQid.size, cat.items.length);

  assert.equal((await boss('POST', '/api/admin/content/builtin/hidden', { qid: 'b:quiz:easy:zzzzzz', hidden: true })).status, 404);
  assert.equal((await boss('POST', '/api/admin/content/builtin/hidden', { qid: it.qid })).status, 400);
  const h = await boss('POST', '/api/admin/content/builtin/hidden', { qid: it.qid, hidden: true });
  assert.equal(h.status, 200);
  assert.ok((await guest('GET', '/api/content/questions')).json.hidden.includes(it.qid));
  assert.equal((await lastAudit('content.builtin.hide', { targetId: it.qid })).details.question, it.question.uz.slice(0, 200));
  assert.equal((await boss('GET', '/api/admin/content/builtin?hidden=1')).json.total, 1);
  // takroriy yashirish jurnalga qayta yozilmaydi
  const before = await prisma.auditLog.count({ where: { action: 'content.builtin.hide' } });
  await boss('POST', '/api/admin/content/builtin/hidden', { qid: it.qid, hidden: true });
  assert.equal(await prisma.auditLog.count({ where: { action: 'content.builtin.hide' } }), before);

  await boss('POST', '/api/admin/content/builtin/hidden', { qid: it.qid, hidden: false });
  assert.ok(!(await guest('GET', '/api/content/questions')).json.hidden.includes(it.qid));
  assert.ok(await lastAudit('content.builtin.unhide', { targetId: it.qid }));
});

test('sayt (content.js) va server bir xil qid hisoblaydi; yashirilganlar chiqariladi, admin savollari qo\'shiladi', async () => {
  const cat = builtinCatalog();
  const easy = cat.items.filter((q) => q.scope === 'quiz' && q.level === 'easy');
  const hiddenQid = easy[3].qid;
  const custom = (await guest('GET', '/api/content/questions')).json.custom;
  const w = { console, setTimeout, clearTimeout, AbortController, location: { protocol: 'http:' } };
  w.window = w;
  w.fetch = async () => ({ ok: true, json: async () => ({ custom, hidden: [hiddenQid] }) });
  const ctx = vm.createContext(w);
  for (const f of ['data.js', 'quiz-extra.js', 'quiz-extra-hard.js', 'quiz-ids.js', 'content.js']) {
    vm.runInContext(readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(w.QCONTENT.state, 'ok');
  for (const L of ['uz', 'ru', 'en']) {
    const pool = w.QCONTENT.quizPool('easy', L);
    const ids = pool.map((q) => q.m && q.m.qid);
    assert.ok(!ids.includes(hiddenQid), `${L}: yashirilgan savol chiqarildi`);
    assert.ok(ids.includes(Q1.qid), `${L}: admin savoli qo'shildi`);
    assert.equal(pool.length, easy.length - 1 + 1);
    // qid'lar tilga bog'liq emas va server katalogidagi bilan bir xil
    for (const q of pool) if (q.m.qid.startsWith('b:')) assert.ok(cat.byQid.has(q.m.qid), q.m.qid);
    const cq = pool.find((q) => q.m.qid === Q1.qid);
    assert.equal(cq.q, `Quyosh — sariq mitti ${L}`);
    assert.equal(cq.o[cq.c], `C ${L}`);
  }
  const dz = w.QCONTENT.dzPool('t07', cat.items.filter((q) => q.level === 't07').map((q) => [q.question, q.options]), true);
  assert.ok(dz.every((z) => z.m && (z.m.qid.startsWith('c:') || cat.byQid.has(z.m.qid))));
  const c = dz.find((z) => z.m.qid === Q2.qid);
  assert.equal(c[1][0].uz, 'B uz', 'darslik formatida to\'g\'ri javob birinchi');
});

/* ---------------- Javoblar statistikasi ---------------- */

const ans = (qid, correct, over = {}) => {
  const [, scope, level] = qid.startsWith('b:') ? qid.split(':') : ['', 'quiz', 'easy'];
  return { qid, scope, level, text: 'matn', correct, ...over };
};

test('javoblar: qat\'iy validatsiya', async () => {
  const b = builtinCatalog().items[0].qid;
  const bad = [
    {}, { answers: [] }, { answers: 'x' },
    { answers: [ans('x:1', true)] }, { answers: [ans('c:0', true)] }, { answers: [ans('b:quiz:EASY:abc', true)] },
    { answers: [ans(b, 'yes')] }, { answers: [ans(b, true, { text: 'x'.repeat(501) })] }, { answers: [{ ...ans(b, true), extra: 1 }] },
    { answers: [ans(b, true, { scope: 'other' })] }, { answers: Array.from({ length: 51 }, () => ans(b, true)) },
    { answers: [ans(b, true)], foo: 1 },
  ];
  for (const body of bad) {
    const r = await guest('POST', '/api/content/answers', body);
    assert.equal(r.status, 400, JSON.stringify(body).slice(0, 100));
  }
});

test('javoblar: mehmon va kirgan foydalanuvchi; mavjud bo\'lmaganlar hisobga olinmaydi; takror qid bir marta', async () => {
  const items = builtinCatalog().items.filter((q) => q.scope === 'quiz' && q.level === 'hard');
  const [h1, h2] = items;
  const r = await guest('POST', '/api/content/answers', {
    quizId: 'quiz:hard',
    answers: [ans(h1.qid, false), ans(h1.qid, true), ans(h2.qid, true), ans(Q1.qid, false), ans('c:999999', true), ans('b:quiz:hard:zzzzz', true),
      ans(h1.qid.replace(':hard:', ':easy:'), true)],
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.counted, 3, 'h1 (bir marta), h2, Q1');
  const s1 = await prisma.questionStat.findUnique({ where: { qid: h1.qid } });
  assert.deepEqual([s1.shown, s1.correct], [1, 0]);
  assert.equal(s1.text, h1.question.uz, 'matn serverdagi katalogdan olinadi (klientniki emas)');
  assert.equal(await prisma.questionStat.count({ where: { qid: 'c:999999' } }), 0);
  assert.equal((await prisma.questionStat.findUnique({ where: { qid: Q1.qid } })).text, 'Quyosh — sariq mitti uz');

  // Kirgan foydalanuvchi: /api/me/quiz da answers (eski klientlar answers'siz ham ishlaydi)
  assert.equal((await alice('POST', '/api/me/quiz', { quizId: 'quiz:hard', score: 1, total: 2 })).status, 201);
  const me = await alice('POST', '/api/me/quiz', { quizId: 'quiz:hard', score: 1, total: 2, answers: [ans(h1.qid, false), ans(h2.qid, true)] });
  assert.equal(me.status, 201);
  assert.equal((await prisma.questionStat.findUnique({ where: { qid: h1.qid } })).shown, 2);
  assert.equal((await alice('POST', '/api/me/quiz', { quizId: 'quiz:hard', score: 1, total: 2, answers: [ans('bad', true)] })).status, 400);

  // Eng qiyin savollar
  for (let i = 0; i < 3; i++) await prisma.questionStat.update({ where: { qid: h1.qid }, data: { shown: { increment: 1 } } });
  const hard = await boss('GET', '/api/admin/stats/questions?min=2');
  assert.equal(hard.status, 200);
  assert.equal(hard.json.items[0].qid, h1.qid);
  assert.equal(hard.json.items[0].rate, 0);
  assert.equal(hard.json.items[0].text, h1.question.uz);
  assert.ok(hard.json.items.every((q) => q.shown >= 2));
  assert.ok(hard.json.tracked >= 3 && hard.json.answers >= 7);
  const csv = await boss('GET', '/api/admin/stats.csv?kind=questions&min=1');
  assert.ok(csv.text.startsWith('﻿qid,scope,level,question_uz,answers,correct,correct_percent\r\n'));
  assert.ok(csv.text.includes(h1.qid));
});

test('statistika: kunlik, mavzular, CSV', async () => {
  const d = await boss('GET', '/api/admin/stats/daily');
  assert.equal(d.status, 200);
  assert.equal(d.json.days.length, 30);
  const today = d.json.days.at(-1);
  assert.equal(today.date, new Date().toISOString().slice(0, 10));
  assert.deepEqual(Object.keys(today).sort(), ['active', 'attempts', 'avgPercent', 'date', 'registrations']);
  assert.ok(today.registrations >= 4);
  assert.ok(today.active >= 3, 'kirishlar + testlar');
  assert.ok(today.attempts >= 3);
  assert.equal(typeof today.avgPercent, 'number');
  assert.equal((await boss('GET', '/api/admin/stats/daily?days=7')).json.days.length, 7);
  assert.equal((await boss('GET', '/api/admin/stats/daily?days=1000')).status, 400);

  const t = await boss('GET', '/api/admin/stats/topics');
  const t05 = t.json.topics.find((x) => x.topicId === 't05');
  assert.deepEqual([t05.readers, t05.testers, t05.avgBest], [1, 1, 75]);
  assert.ok(t05.title && t05.title.uz);
  assert.equal(t.json.topics.filter((x) => /^t\d+$/.test(x.topicId)).length, 40);

  for (const kind of ['daily', 'topics', 'questions']) {
    const r = await boss('GET', `/api/admin/stats.csv?kind=${kind}`);
    assert.equal(r.status, 200);
    assert.ok(r.text.startsWith('﻿'));
    assert.match(r.headers.get('content-disposition'), new RegExp(`stats-${kind}-`));
  }
  const daily = await boss('GET', '/api/admin/stats.csv?kind=daily&days=7');
  assert.equal(daily.text.trim().split('\r\n').length, 8);
  assert.equal((await boss('GET', '/api/admin/stats.csv?kind=evil')).status, 400);
});

test('javoblar: IP bo\'yicha so\'rovlar chegarasi (429)', async () => {
  const b = builtinCatalog().items[5].qid;
  let last;
  for (let i = 0; i < 20; i++) {
    last = await guest('POST', '/api/content/answers', { answers: [ans(b, true)] });
    if (last.status === 429) break;
  }
  assert.equal(last.status, 429);
  assert.equal(last.json.error, 'RATE_LIMIT');
  const s = await prisma.questionStat.findUnique({ where: { qid: b } });
  assert.ok(s.shown <= 15, `bitta IP ko'pi bilan 15 ta to'plam: ${s.shown}`);
});
