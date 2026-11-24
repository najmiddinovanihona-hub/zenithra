// Gmail API orqali xat yuborishni ulash (Render va boshqa SMTP yopiq hostinglar uchun):
//   node server/scripts/gmail-setup.js
// Qo'llanma: docs/email-setup.md (avval Google Cloud'da loyiha, Gmail API, OAuth "Desktop app" mijozi yaratiladi).
//  1) Client ID va Client secret so'raladi (secret ekranda ko'rinmaydi; ikkalasi ham chiqarilmaydi).
//  2) Brauzerda Google ruxsat oynasi ochiladi (faqat gmail.send — "xat yuborish" ruxsati, PKCE bilan).
//     Javob shu kompyuterdagi vaqtinchalik 127.0.0.1:<tasodifiy port> manzilga qaytadi.
//  3) Refresh token olinadi, o'zingizga sinov xati yuboriladi.
//  4) Render → Environment ga qo'yiladigan o'zgaruvchilar chiqariladi (ixtiyoriy — lokal .env ga ham yoziladi).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import readline from 'node:readline';
import { spawn } from 'node:child_process';
import { ROOT } from '../config.js';

const ENV = path.join(ROOT, '.env');
const SCOPE = 'https://www.googleapis.com/auth/gmail.send';

function ask(q, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => { rl.output.write(s.includes(q) ? s : s.replace(/[^\r\n]/g, '•')); };
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(a.trim()); });
  });
}
function saveEnv(values) {
  const lines = existsSync(ENV) ? readFileSync(ENV, 'utf8').split(/\r?\n/) : [];
  for (const [k, v] of Object.entries(values)) {
    const line = `${k}=${/[\s#"<>]/.test(v) ? JSON.stringify(v) : v}`;
    const i = lines.findIndex((l) => l.startsWith(k + '='));
    if (i >= 0) lines[i] = line; else lines.push(line);
  }
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  writeFileSync(ENV, lines.join('\n') + '\n');
}
function openBrowser(url) {
  // Windows'da "start" & belgisini buzadi — rundll32 URL'ni butunligicha oladi
  const [cmd, args] = process.platform === 'win32' ? ['rundll32', ['url.dll,FileProtocolHandler', url]]
    : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { spawn(cmd, args, { stdio: 'ignore', detached: true }).on('error', () => {}).unref(); } catch { /* havola baribir ekranda */ }
}
const fail = (msg) => { console.error('\n  ✖ ' + msg + '\n'); process.exit(1); };
const page = (title, body) => `<!doctype html><meta charset="utf-8"><title>${title}</title>`
  + `<body style="font-family:Segoe UI,Arial,sans-serif;background:#0b1024;color:#e6ecff;display:grid;place-items:center;height:100vh;margin:0">`
  + `<div style="max-width:420px;text-align:center"><h2>${title}</h2><p>${body}</p></div></body>`;

console.log('\n  Zenithra — Gmail API orqali tasdiqlash kodlarini yuborishni ulash');
console.log('  Avval docs/email-setup.md dagi 1–4-qadamlarni bajaring (Google Cloud: Gmail API + OAuth "Desktop app").\n');

const clientId = await ask('  OAuth Client ID: ');
if (!/^[\w.-]+\.apps\.googleusercontent\.com$/.test(clientId)) fail('Client ID "....apps.googleusercontent.com" ko\'rinishida bo\'lishi kerak.');
const clientSecret = await ask('  OAuth Client secret: ', true);
if (clientSecret.length < 10) fail('Client secret juda qisqa.');
const senderEmail = (await ask('  Xat yuboriladigan Gmail manzili: ')).toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) fail('Manzil noto\'g\'ri.');

// PKCE (RFC 7636) va CSRF himoyasi (state)
const verifier = crypto.randomBytes(48).toString('base64url');
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
const state = crypto.randomBytes(16).toString('hex');

let redirectUri = '';
const codePromise = new Promise((resolve, reject) => {
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    if (u.pathname !== '/' || !u.searchParams.has('state')) { res.writeHead(404).end(); return; }   // favicon va h.k.
    const done = (ok, title, body) => {
      res.writeHead(ok ? 200 : 400, { 'content-type': 'text/html; charset=utf-8' }).end(page(title, body));
      srv.close();
    };
    if (u.searchParams.get('state') !== state) return done(false, 'Xato', 'So\'rov tasdiqlanmadi (state mos emas). Terminalga qayting.'), reject(new Error('state mos emas'));
    if (u.searchParams.get('error')) {
      const e = u.searchParams.get('error');
      done(false, 'Ruxsat berilmadi', 'Terminalga qayting.');
      return reject(new Error(e === 'access_denied' ? 'Ruxsat rad etildi (access_denied). Agar "Access blocked" chiqqan bo\'lsa — OAuth consent screen\'da hisobingiz "Test users"ga qo\'shilganini yoki ilova "In production" ekanini tekshiring.' : 'Google xatosi: ' + e));
    }
    const code = u.searchParams.get('code');
    if (!code) return done(false, 'Xato', 'Kod kelmadi.'), reject(new Error('code yo\'q'));
    done(true, '✔ Tayyor', 'Ruxsat olindi. Bu oynani yopib, terminalga qayting.');
    resolve(code);
  });
  srv.on('error', reject);
  srv.listen(0, '127.0.0.1', () => {
    redirectUri = `http://127.0.0.1:${srv.address().port}`;
    const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    auth.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: SCOPE,
      code_challenge: challenge, code_challenge_method: 'S256', state, access_type: 'offline', prompt: 'consent',
      login_hint: senderEmail }).toString();
    console.log('\n  Brauzerda Google oynasi ochilmoqda. Ochilmasa, quyidagi havolani brauzerga nusxalang:\n');
    console.log('  ' + auth.href + '\n');
    console.log('  • ' + senderEmail + ' hisobini tanlang.');
    console.log('  • "Google hasn\'t verified this app" chiqsa: Advanced → Go to ... (unsafe) — bu sizning o\'z ilovangiz.');
    console.log('  • "Send email on your behalf" ruxsatini bering.\n  Kutilmoqda (5 daqiqa)...');
    if (!process.env.NO_BROWSER) openBrowser(auth.href);
  });
  setTimeout(() => { srv.close(); reject(new Error('5 daqiqa ichida javob kelmadi.')); }, 5 * 60 * 1000).unref();
});

let code;
try { code = await codePromise; } catch (e) { fail(e.message); }

process.stdout.write('\n  Refresh token olinmoqda... ');
const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', signal: AbortSignal.timeout(20000),
  headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
  body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri,
    grant_type: 'authorization_code', code_verifier: verifier }) }).catch((e) => fail('Google\'ga ulanib bo\'lmadi: ' + e.message));
const tok = await r.json().catch(() => ({}));
if (!r.ok) { console.log('✖'); fail(`Google rad etdi: ${tok.error || r.status}${tok.error_description ? ' — ' + tok.error_description : ''}`
  + (tok.error === 'invalid_client' ? '\n    Client ID / secret noto\'g\'ri yoki mijoz turi "Desktop app" emas.' : '')); }
if (!tok.refresh_token) { console.log('✖'); fail('Google refresh token bermadi. https://myaccount.google.com/permissions da eski ruxsatni olib tashlab, qayta urinib ko\'ring.'); }
if (!String(tok.scope || '').split(' ').includes(SCOPE)) { console.log('✖'); fail('"Send email on your behalf" ruxsati berilmadi — qayta ishga tushirib, katakchani belgilang.'); }
console.log('✔');

// Sinov xati — sayt ishlatadigan kod bilan (server/mailer.js), faqat Gmail API orqali
Object.assign(process.env, { GMAIL_CLIENT_ID: clientId, GMAIL_CLIENT_SECRET: clientSecret, GMAIL_REFRESH_TOKEN: tok.refresh_token,
  GMAIL_SENDER: senderEmail });
if (process.env.NODE_ENV === 'test') process.env.NODE_ENV = 'development';
const { sendMail, mailSender } = await import('../mailer.js');
process.stdout.write(`  Sinov xati ${senderEmail} ga yuborilmoqda (Gmail API)... `);
try {
  await sendMail({ to: senderEmail, subject: 'Zenithra: pochta ulandi (Gmail API)',
    text: 'Tabriklaymiz! Zenithra sayti endi Gmail API orqali tasdiqlash kodlarini yuboradi.\n\nZenithra',
    html: '<div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px">✔ <b>Zenithra</b> sayti endi Gmail API orqali tasdiqlash kodlarini yuboradi.</div>' });
  console.log('✔');
} catch (e) { console.log('✖'); fail(`Xat yuborilmadi (${e.code || ''}): ${e.message}`); }

const fromName = 'Zenithra';
console.log(`\n  ✔ Ishlayapti! "Yuborilganlar" (Sent) papkasida sinov xati bo'lishi kerak. Yuboruvchi: ${mailSender()}\n`);
console.log('  Render → (servisingiz) → Environment → "Add Environment Variable" — quyidagi 4 ta (+1) qiymat:\n');
console.log('    GMAIL_CLIENT_ID       = (yuqorida kiritgan Client ID — Google Console\'dan nusxalang)');
console.log('    GMAIL_CLIENT_SECRET   = (yuqorida kiritgan Client secret — Google Console\'dan nusxalang)');
console.log('    GMAIL_REFRESH_TOKEN   = ' + tok.refresh_token);
console.log('    GMAIL_SENDER          = ' + senderEmail);
console.log(`    MAIL_FROM             = ${fromName} <${senderEmail}>   (ixtiyoriy — xatdagi ism)\n`);
console.log('  ⚠ DIQQAT: refresh token — parol kabi maxfiy! U faqat HOZIR ko\'rsatiladi. Hech kimga yubormang, GitHub\'ga');
console.log('    qo\'ymang. Yo\'qolsa yoki oshkor bo\'lsa — https://myaccount.google.com/permissions da ruxsatni olib tashlab,');
console.log('    shu skriptni qayta ishga tushiring.');
console.log('  ⚠ OAuth consent screen "In production" holatida bo\'lsin — "Testing" holatida token 7 kunda bekor bo\'ladi.\n');

const save = (await ask('  Lokal .env fayliga ham yozilsinmi (shu kompyuterda sinash uchun)? (h — ha, Enter — yo\'q):')).toLowerCase();
if (save === 'h' || save === 'ha' || save === 'y' || save === 'yes') {
  saveEnv({ GMAIL_CLIENT_ID: clientId, GMAIL_CLIENT_SECRET: clientSecret, GMAIL_REFRESH_TOKEN: tok.refresh_token,
    GMAIL_SENDER: senderEmail, MAIL_FROM: `${fromName} <${senderEmail}>` });
  console.log('  ✔ .env ga yozildi (.env GitHub\'ga yuklanmaydi). Serverni qayta ishga tushiring.\n');
} else console.log('  .env o\'zgartirilmadi.\n');
process.exit(0);
