// Elektron pochta: tasdiqlash kodlari. Yuboruvchi (provayder) env o'zgaruvchilaridan tanlanadi — ustunlik tartibi:
//  1) Gmail API (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_SENDER) — xatni Google'ning o'zi
//     yuboradi (HTTPS, OAuth2). gmail.com manzilidan yuborilganda SPF/DKIM/DMARC to'g'ri chiqadi → "Spam"ga tushmaydi.
//     Render bepul tarifida ham ishlaydi (SMTP portlari kerak emas). Sozlash: docs/email-setup.md, server/scripts/gmail-setup.js
//  2) Brevo HTTP API (BREVO_API_KEY) — o'z domeningiz Brevo'da tasdiqlangan bo'lsa yaxshi. Bepul gmail.com manzili
//     bilan Brevo orqali yuborilsa DMARC mos kelmaydi → Gmail xatni "Spam"ga tashlaydi.
//  3) SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM) — lokal ishlash uchun (npm run mail:setup).
//  4) Hech biri yo'q: development — kod server oynasiga (konsolga) chiqariladi; production — xato (503),
//     kodsiz hech kim kira olmaydi, jim "yuborildi" deyilmaydi.
//  NODE_ENV=test — xatlar xotiradagi `outbox` ga yoziladi (testlar kodni shu yerdan oladi).
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { config } from './config.js';

const env = process.env;
export const outbox = [];
let transport = null;

const useGmail = () => !!(env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN && env.GMAIL_SENDER);
// Brevo (HTTP API): SMTP portlari yopiq bo'lgan hostinglar uchun (masalan, Render bepul tarifi).
const useBrevo = () => !!env.BREVO_API_KEY;
const useSmtp = () => !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
/** Qaysi yuboruvchi ishlatiladi: 'gmail' | 'brevo' | 'smtp' | null */
export const mailProvider = () => (useGmail() ? 'gmail' : useBrevo() ? 'brevo' : useSmtp() ? 'smtp' : null);
export const mailConfigured = () => mailProvider() !== null;
// Sayt manzili — xat oxiridagi izoh uchun (spam filtrlari "kim va nima uchun yubordi"ni ko'rishni yaxshi ko'radi)
const siteUrl = () => (env.SITE_URL || 'https://zenithra.onrender.com').replace(/\/+$/, '');

// "Zenithra <a@b.uz>" → { name: 'Zenithra', email: 'a@b.uz' }
function parseFrom(s) {
  const m = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(s || '');
  return m ? { name: m[1].trim() || 'Zenithra', email: m[2].trim() } : { name: 'Zenithra', email: String(s || '').trim() };
}
/** Yuboruvchi { name, email }. Gmail API'da From — albatta hisobning o'z manzili (boshqasini Gmail baribir almashtiradi). */
function sender() {
  if (useGmail()) return { name: parseFrom(env.MAIL_FROM).name, email: env.GMAIL_SENDER.trim() };
  return parseFrom(env.MAIL_FROM || env.SMTP_USER || '');
}
export const mailSender = () => { const s = sender(); return s.email ? `${s.name} <${s.email}>` : ''; };
const FREE_MAIL = /@(gmail|googlemail|yahoo|outlook|hotmail|live|mail|yandex|icloud|aol)\./i;

/* ---------------- Brevo ---------------- */
const BREVO = 'https://api.brevo.com/v3';
async function brevo(pathname, init = {}) {
  const r = await fetch(BREVO + pathname, { ...init, signal: AbortSignal.timeout(15000),
    headers: { 'api-key': env.BREVO_API_KEY, accept: 'application/json', 'content-type': 'application/json', ...(init.headers || {}) } });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw Object.assign(new Error(`Brevo ${r.status}: ${body.slice(0, 300)}`), { code: r.status === 401 ? 'EAUTH' : 'BREVO_' + r.status });
  }
  return r.status === 204 ? null : r.json();
}

/* ---------------- SMTP ---------------- */
function getTransport() {
  if (!transport) {
    const port = Number(env.SMTP_PORT) || 465;
    transport = nodemailer.createTransport({
      host: env.SMTP_HOST, port, secure: port === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 20000,
    });
  }
  return transport;
}

/* ---------------- Gmail API (OAuth2 refresh token, faqat HTTPS) ---------------- */
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const GMAIL_SEND = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
let gTok = null;        // { token, exp, key } — access token muddati tugaguncha (≈1 soat) keshda
let gTokPending = null; // bir vaqtda kelgan so'rovlar bitta yangilashni kutadi
const gKey = () => env.GMAIL_CLIENT_ID + '|' + env.GMAIL_REFRESH_TOKEN;
const gErr = (code, msg) => Object.assign(new Error(msg), { code });

async function refreshGmailToken() {
  let r;
  try {
    r = await fetch(GOOGLE_TOKEN, { method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: new URLSearchParams({ client_id: env.GMAIL_CLIENT_ID, client_secret: env.GMAIL_CLIENT_SECRET,
        refresh_token: env.GMAIL_REFRESH_TOKEN, grant_type: 'refresh_token' }) });
  } catch (e) { throw gErr('GMAIL_NETWORK', `Gmail: Google OAuth serveriga ulanib bo'lmadi (${e.name}: ${e.message})`); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) {
    const e = j.error || 'http_' + r.status;
    if (e === 'invalid_grant') throw gErr('GMAIL_TOKEN_REVOKED', 'Gmail: refresh token revoked/expired (bekor qilingan yoki muddati o\'tgan). '
      + 'Sabab: Google hisobida ruxsat olib tashlangan, parol almashtirilgan yoki OAuth ilovasi "Testing" holatida (7 kunda tugaydi). '
      + 'Yechim: node server/scripts/gmail-setup.js ni qayta ishga tushirib, yangi GMAIL_REFRESH_TOKEN ni Render\'ga qo\'ying.');
    if (e === 'invalid_client' || e === 'unauthorized_client') throw gErr('EAUTH', `Gmail: GMAIL_CLIENT_ID yoki GMAIL_CLIENT_SECRET noto'g'ri (${e}).`);
    throw gErr('GMAIL_TOKEN_' + String(e).toUpperCase(), `Gmail: access token olinmadi (${r.status} ${e}${j.error_description ? ': ' + j.error_description : ''})`);
  }
  if (j.scope && !String(j.scope).split(/\s+/).some((s) => s === 'https://www.googleapis.com/auth/gmail.send' || s === 'https://mail.google.com/'))
    throw gErr('GMAIL_SCOPE', 'Gmail: token "gmail.send" ruxsatiga ega emas — gmail-setup.js ni qayta ishga tushiring.');
  return { token: j.access_token, exp: Date.now() + (Number(j.expires_in) || 3600) * 1000, key: gKey() };
}
async function gmailToken(force = false) {
  if (!force && gTok && gTok.key === gKey() && gTok.exp - Date.now() > 60000) return gTok.token;
  if (!gTokPending) gTokPending = refreshGmailToken().then((t) => { gTok = t; return t.token; }).finally(() => { gTokPending = null; });
  return gTokPending;
}
async function gmailSend(mime) {
  const raw = Buffer.from(mime, 'utf8').toString('base64url');
  for (let attempt = 0; ; attempt++) {
    const token = await gmailToken(attempt > 0);
    let r;
    try {
      r = await fetch(GMAIL_SEND, { method: 'POST', signal: AbortSignal.timeout(20000),
        headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ raw }) });
    } catch (e) { throw gErr('GMAIL_NETWORK', `Gmail API'ga ulanib bo'lmadi (${e.name}: ${e.message})`); }
    if (r.ok) return r.json().catch(() => null);
    const body = await r.text().catch(() => '');
    let reason = '';
    try { const j = JSON.parse(body); reason = j.error?.errors?.[0]?.reason || j.error?.status || ''; } catch { /* matn */ }
    // 401: access token eskirgan/bekor qilingan — bir marta yangisini olib, qayta urinamiz
    if (r.status === 401 && attempt === 0) { gTok = null; continue; }
    if (r.status === 401) throw gErr('EAUTH', `Gmail API 401: ruxsat rad etildi (${reason || body.slice(0, 200)})`);
    if (r.status === 403) throw gErr('GMAIL_FORBIDDEN', `Gmail API 403 (${reason || 'forbidden'}): Gmail API loyihada yoqilmagan yoki token gmail.send ruxsatiga ega emas. `
      + body.slice(0, 200));
    if (r.status === 429) throw gErr('GMAIL_RATE_LIMIT', `Gmail API 429: yuborish chegarasi oshdi (${reason}). Birozdan keyin qayta urinib ko'ring.`);
    throw gErr('GMAIL_' + r.status, `Gmail API ${r.status}: ${body.slice(0, 300)}`);
  }
}

/* ---------------- MIME (RFC 2822 / RFC 2045 / RFC 2047) ---------------- */
// RFC 2047: ASCII bo'lmagan sarlavha → =?UTF-8?B?...?= bo'laklari (har biri ≤75 belgi, UTF-8 belgi bo'linmaydi)
export function encodeHeader(s) {
  s = String(s).replace(/[\r\n]+/g, ' ');
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  const words = []; let chunk = '';
  for (const ch of s) {   // kod nuqtalari bo'yicha (surrogat juftlar ham butun)
    if (Buffer.byteLength(chunk + ch, 'utf8') > 45) { words.push(chunk); chunk = ''; }   // 45 bayt → 60 base64 belgi
    chunk += ch;
  }
  if (chunk) words.push(chunk);
  return words.map((w) => `=?UTF-8?B?${Buffer.from(w, 'utf8').toString('base64')}?=`).join('\r\n ');
}
const addr = ({ name, email }) => {
  const n = /^[\w .-]*$/.test(name) ? `"${name}"` : encodeHeader(name);
  return name ? `${n} <${email}>` : email;
};
const b64lines = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/.{76}/g, '$&\r\n');
/** To'liq RFC 2822 xat matni: multipart/alternative (text + html), UTF-8, base64. */
export function buildMime({ from, to, replyTo, subject, text, html, date = new Date() }) {
  const boundary = '=_zen_' + crypto.randomBytes(12).toString('hex');
  const clean = (v) => String(v).replace(/[\r\n]/g, '');
  return [
    `From: ${addr(from)}`,
    `To: ${clean(to)}`,
    ...(replyTo ? [`Reply-To: ${clean(replyTo)}`] : []),
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${date.toUTCString().replace('GMT', '+0000')}`,   // Message-ID ni Gmail o'zi qo'yadi
    'MIME-Version: 1.0',
    'Auto-Submitted: auto-generated',   // RFC 3834: avtomatik xat (avto-javoblar unga javob qaytarmaydi)
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64lines(text),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64lines(html),
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

/* ---------------- Xat matni ---------------- */
// Har bir maqsad (purpose) uchun: lead — kod oldidagi matn, ignore — "bu siz bo'lmasangiz" ogohlantirishi
const T = {
  uz: { subject: (c) => `Zenithra tasdiqlash kodi: ${c}`, hello: 'Salom', ttl: 'Kod 10 daqiqa amal qiladi.',
    lead: { register: 'Ro‘yxatdan o‘tishni davom ettirish uchun kod:', login: 'Hisobingizga kirish uchun kod:',
      reset: 'Parolni tiklash uchun kod:', 'admin-login': 'Admin paneliga kirish uchun kod:' },
    ignore: { def: 'Agar bu siz bo‘lmasangiz, xatni e’tiborsiz qoldiring — hisobingizga hech kim kira olmaydi.',
      reset: 'Agar parolni tiklashni siz so‘ramagan bo‘lsangiz, xatni e’tiborsiz qoldiring — parolingiz o‘zgarmaydi.',
      'admin-login': 'Agar bu siz bo‘lmasangiz, parolingizni darhol almashtiring — kimdir uni biladi.' },
    why: 'Bu xat avtomatik yuborildi, chunki shu pochta manzili Zenithra saytida kiritildi. Kodni hech kimga aytmang.' },
  ru: { subject: (c) => `Код подтверждения Zenithra: ${c}`, hello: 'Здравствуйте', ttl: 'Код действует 10 минут.',
    lead: { register: 'Код для продолжения регистрации:', login: 'Код для входа в аккаунт:',
      reset: 'Код для восстановления пароля:', 'admin-login': 'Код для входа в админ-панель:' },
    ignore: { def: 'Если это были не вы, просто проигнорируйте письмо — без кода в аккаунт никто не войдёт.',
      reset: 'Если вы не запрашивали восстановление пароля, проигнорируйте письмо — пароль не изменится.',
      'admin-login': 'Если это были не вы, немедленно смените пароль — кто-то его знает.' },
    why: 'Письмо отправлено автоматически, потому что этот адрес был введён на сайте Zenithra. Никому не сообщайте код.' },
  en: { subject: (c) => `Your Zenithra verification code: ${c}`, hello: 'Hello', ttl: 'The code is valid for 10 minutes.',
    lead: { register: 'Your code to continue signing up:', login: 'Your sign-in code:',
      reset: 'Your password reset code:', 'admin-login': 'Your admin panel sign-in code:' },
    ignore: { def: 'If this wasn’t you, just ignore this email — nobody can sign in without the code.',
      reset: 'If you didn’t ask to reset your password, ignore this email — your password stays the same.',
      'admin-login': 'If this wasn’t you, change your password right away — someone knows it.' },
    why: 'This email was sent automatically because this address was entered on the Zenithra website. Never share the code.' },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render(lang, purpose, code, name) {
  const t = T[lang] || T.uz, L = T[lang] ? lang : 'uz', url = siteUrl();
  const lead = t.lead[purpose] || t.lead.login, ignore = t.ignore[purpose] || t.ignore.def;
  const text = `${t.hello}${name ? ', ' + name : ''}!\n\n${lead} ${code}\n\n${t.ttl}\n${ignore}\n\n--\n${t.why}\nZenithra · ${url}\n`;
  // Tashqi rasm, skript va kuzatuv yo'q — faqat oddiy jadval va inline uslublar
  const html = `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${esc(t.subject(code))}</title></head>
<body style="margin:0;background:#070b1a;font-family:Segoe UI,Arial,sans-serif;color:#e6ecff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#070b1a;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#0e1530;border:1px solid #26305a;border-radius:16px;padding:28px">
<tr><td style="font-size:12px;letter-spacing:.25em;color:#7fa8ff;font-weight:700">ZENITHRA · QUYOSH TIZIMI</td></tr>
<tr><td style="padding-top:18px;font-size:16px">${esc(t.hello)}${name ? ', ' + esc(name) : ''}!</td></tr>
<tr><td style="padding-top:8px;font-size:15px;color:#b9c6ee">${esc(lead)}</td></tr>
<tr><td align="center" style="padding:22px 0"><div style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:700;color:#fff;background:#1a2350;border:1px solid #3a4a8c;border-radius:12px;padding:14px 22px">${esc(code)}</div></td></tr>
<tr><td style="font-size:13px;color:#9aa8d6">${esc(t.ttl)}</td></tr>
<tr><td style="padding-top:6px;font-size:12px;color:#7d89b5">${esc(ignore)}</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:460px"><tr><td style="padding:14px 6px 0;font-size:11px;line-height:1.5;color:#6f7aa3;text-align:center">
${esc(t.why)}<br><a href="${esc(url)}" style="color:#7fa8ff;text-decoration:none">${esc(url.replace(/^https?:\/\//, ''))}</a></td></tr></table>
</td></tr></table></body></html>`;
  return { subject: t.subject(code), text, html };
}

/** Istalgan xatni joriy provayder orqali yuborish ({ to, subject, text, html }). */
export async function sendMail({ to, subject, text, html }) {
  const p = mailProvider(), from = sender(), replyTo = from.email;
  if (p === 'gmail') { await gmailSend(buildMime({ from, to, replyTo, subject, text, html })); return; }
  if (p === 'brevo') {
    await brevo('/smtp/email', { method: 'POST', body: JSON.stringify({ sender: from, to: [{ email: to }],
      replyTo: { email: replyTo, name: from.name }, subject, textContent: text, htmlContent: html,
      headers: { 'Auto-Submitted': 'auto-generated' } }) });
    return;
  }
  await getTransport().sendMail({ from: mailSender(), replyTo, to, subject, text, html, headers: { 'Auto-Submitted': 'auto-generated' } });
}

export async function sendCode({ to, name, lang, purpose, code }) {
  const msg = render(lang, purpose, code, name);
  if (env.NODE_ENV === 'test') { outbox.push({ to, code, purpose, ...msg }); return; }
  if (!mailConfigured()) {
    if (config.isProd) throw Object.assign(new Error('Pochta sozlanmagan'), { code: 'MAIL_NOT_CONFIGURED' });
    console.log(`[mail] Pochta sozlanmagan — sinov rejimi. ${to} uchun kod: ${code}`);
    return;
  }
  await sendMail({ to, ...msg });
}

// Ishga tushganda tekshirish. Gmail — refresh token bilan access token olinadi (token bekor qilingan bo'lsa darhol
// ko'rinadi). SMTP — login-parol tekshiriladi. Brevo kaliti odatda faqat "Transactional email" ruxsati bilan cheklangan
// (/account ga ruxsat yo'q) — u birinchi xatda tekshiriladi; bepul pochta manzili bilan Brevo ishlatilsa ogohlantiramiz.
export async function verifyMail() {
  const p = mailProvider();
  if (p === 'gmail') { await gmailToken(true); return; }
  if (p === 'brevo') {
    if (FREE_MAIL.test(sender().email)) console.warn(`[mail] ⚠ Brevo + bepul manzil (${sender().email}): DMARC mos kelmaydi — xatlar "Spam"ga tushadi. `
      + 'Gmail API ni ulang (docs/email-setup.md) yoki Brevo\'da o\'z domeningizni tasdiqlang.');
    return;
  }
  await getTransport().verify();
}

export const _test = { render, resetGmailCache: () => { gTok = null; gTokPending = null; } };
