// Elektron pochta: tasdiqlash kodlari. SMTP .env da (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM).
//  - SMTP sozlangan — haqiqiy xat yuboriladi (masalan, Gmail: smtp.gmail.com, 465, "App password").
//  - Sozlanmagan, development — kod server oynasiga (konsolga) chiqariladi: lokal sinov uchun.
//  - Sozlanmagan, production — xato (503): kodsiz hech kim kira olmaydi, jim "yuborildi" deyilmaydi.
//  - NODE_ENV=test — xatlar xotiradagi `outbox` ga yoziladi (testlar kodni shu yerdan oladi).
import nodemailer from 'nodemailer';
import { config } from './config.js';

const env = process.env;
export const outbox = [];
let transport = null;
// Brevo (HTTP API): SMTP portlari yopiq bo'lgan hostinglar uchun (masalan, Render bepul tarifi). BREVO_API_KEY bo'lsa — ustun.
const useBrevo = () => !!env.BREVO_API_KEY;
export const mailConfigured = () => useBrevo() || !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
export const mailSender = () => env.MAIL_FROM || env.SMTP_USER || '';
// "Zenithra <a@b.uz>" → { name: 'Zenithra', email: 'a@b.uz' }
function parseFrom(s) {
  const m = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(s || '');
  return m ? { name: m[1].trim() || 'Zenithra', email: m[2].trim() } : { name: 'Zenithra', email: String(s || '').trim() };
}
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

// Har bir maqsad (purpose) uchun: lead — kod oldidagi matn, ignore — "bu siz bo'lmasangiz" ogohlantirishi
const T = {
  uz: { subject: (c) => `Zenithra — tasdiqlash kodi: ${c}`, hello: 'Salom', ttl: 'Kod 10 daqiqa amal qiladi.',
    lead: { register: 'Ro‘yxatdan o‘tishni davom ettirish uchun kod:', login: 'Hisobingizga kirish uchun kod:',
      reset: 'Parolni tiklash uchun kod:', 'admin-login': 'Admin paneliga kirish uchun kod:' },
    ignore: { def: 'Agar bu siz bo‘lmasangiz, xatni e’tiborsiz qoldiring — hisobingizga hech kim kira olmaydi.',
      reset: 'Agar parolni tiklashni siz so‘ramagan bo‘lsangiz, xatni e’tiborsiz qoldiring — parolingiz o‘zgarmaydi.',
      'admin-login': 'Agar bu siz bo‘lmasangiz, parolingizni darhol almashtiring — kimdir uni biladi.' } },
  ru: { subject: (c) => `Zenithra — код подтверждения: ${c}`, hello: 'Здравствуйте', ttl: 'Код действует 10 минут.',
    lead: { register: 'Код для продолжения регистрации:', login: 'Код для входа в аккаунт:',
      reset: 'Код для восстановления пароля:', 'admin-login': 'Код для входа в админ-панель:' },
    ignore: { def: 'Если это были не вы, просто проигнорируйте письмо — без кода в аккаунт никто не войдёт.',
      reset: 'Если вы не запрашивали восстановление пароля, проигнорируйте письмо — пароль не изменится.',
      'admin-login': 'Если это были не вы, немедленно смените пароль — кто-то его знает.' } },
  en: { subject: (c) => `Zenithra — verification code: ${c}`, hello: 'Hello', ttl: 'The code is valid for 10 minutes.',
    lead: { register: 'Your code to continue signing up:', login: 'Your sign-in code:',
      reset: 'Your password reset code:', 'admin-login': 'Your admin panel sign-in code:' },
    ignore: { def: 'If this wasn’t you, just ignore this email — nobody can sign in without the code.',
      reset: 'If you didn’t ask to reset your password, ignore this email — your password stays the same.',
      'admin-login': 'If this wasn’t you, change your password right away — someone knows it.' } },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render(lang, purpose, code, name) {
  const t = T[lang] || T.uz;
  const lead = t.lead[purpose] || t.lead.login, ignore = t.ignore[purpose] || t.ignore.def;
  const text = `${t.hello}${name ? ', ' + name : ''}!\n\n${lead} ${code}\n\n${t.ttl}\n${ignore}\n\n— Zenithra · Quyosh tizimi`;
  const html = `<!doctype html><html><body style="margin:0;background:#070b1a;font-family:Segoe UI,Arial,sans-serif;color:#e6ecff">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070b1a;padding:32px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#0e1530;border:1px solid #26305a;border-radius:16px;padding:28px">
<tr><td style="font-size:12px;letter-spacing:.25em;color:#7fa8ff;font-weight:700">ZENITHRA · QUYOSH TIZIMI</td></tr>
<tr><td style="padding-top:18px;font-size:16px">${esc(t.hello)}${name ? ', ' + esc(name) : ''}!</td></tr>
<tr><td style="padding-top:8px;font-size:15px;color:#b9c6ee">${esc(lead)}</td></tr>
<tr><td align="center" style="padding:22px 0"><div style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:700;color:#fff;background:#1a2350;border:1px solid #3a4a8c;border-radius:12px;padding:14px 22px">${code}</div></td></tr>
<tr><td style="font-size:13px;color:#9aa8d6">${esc(t.ttl)}</td></tr>
<tr><td style="padding-top:6px;font-size:12px;color:#7d89b5">${esc(ignore)}</td></tr>
</table></td></tr></table></body></html>`;
  return { subject: t.subject(code), text, html };
}

export async function sendCode({ to, name, lang, purpose, code }) {
  const msg = render(lang, purpose, code, name);
  if (env.NODE_ENV === 'test') { outbox.push({ to, code, purpose, ...msg }); return; }
  if (!mailConfigured()) {
    if (config.isProd) throw Object.assign(new Error('SMTP sozlanmagan'), { code: 'MAIL_NOT_CONFIGURED' });
    console.log(`[mail] SMTP sozlanmagan — sinov rejimi. ${to} uchun kod: ${code}`);
    return;
  }
  if (useBrevo()) {
    await brevo('/smtp/email', { method: 'POST', body: JSON.stringify({ sender: parseFrom(mailSender()), to: [{ email: to }],
      subject: msg.subject, textContent: msg.text, htmlContent: msg.html }) });
    return;
  }
  await getTransport().sendMail({ from: mailSender(), to, subject: msg.subject, text: msg.text, html: msg.html });
}

// Ishga tushganda ulanishni tekshirish (SMTP login-parol to'g'rimi). Brevo kaliti odatda faqat "Transactional email"
// ruxsati bilan cheklangan (/account ga ruxsat yo'q) — u birinchi xatda tekshiriladi, xato bo'lsa jurnalga yoziladi.
export const verifyMail = () => (useBrevo() ? Promise.resolve() : getTransport().verify());
