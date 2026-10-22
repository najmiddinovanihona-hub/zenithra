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
export const mailConfigured = () => !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
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

const T = {
  uz: { subject: (c) => `ASTRO — tasdiqlash kodi: ${c}`, register: 'Ro‘yxatdan o‘tishni yakunlash uchun kod:', login: 'Hisobingizga kirish uchun kod:',
    ttl: 'Kod 10 daqiqa amal qiladi.', ignore: 'Agar bu siz bo‘lmasangiz, xatni e’tiborsiz qoldiring — hisobingizga hech kim kira olmaydi.', hello: 'Salom' },
  ru: { subject: (c) => `ASTRO — код подтверждения: ${c}`, register: 'Код для завершения регистрации:', login: 'Код для входа в аккаунт:',
    ttl: 'Код действует 10 минут.', ignore: 'Если это были не вы, просто проигнорируйте письмо — без кода в аккаунт никто не войдёт.', hello: 'Здравствуйте' },
  en: { subject: (c) => `ASTRO — verification code: ${c}`, register: 'Your code to finish signing up:', login: 'Your sign-in code:',
    ttl: 'The code is valid for 10 minutes.', ignore: 'If this wasn’t you, just ignore this email — nobody can sign in without the code.', hello: 'Hello' },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render(lang, purpose, code, name) {
  const t = T[lang] || T.uz;
  const lead = purpose === 'register' ? t.register : t.login;
  const text = `${t.hello}${name ? ', ' + name : ''}!\n\n${lead} ${code}\n\n${t.ttl}\n${t.ignore}\n\n— ASTRO · Quyosh tizimi`;
  const html = `<!doctype html><html><body style="margin:0;background:#070b1a;font-family:Segoe UI,Arial,sans-serif;color:#e6ecff">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070b1a;padding:32px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#0e1530;border:1px solid #26305a;border-radius:16px;padding:28px">
<tr><td style="font-size:12px;letter-spacing:.25em;color:#7fa8ff;font-weight:700">ASTRO · QUYOSH TIZIMI</td></tr>
<tr><td style="padding-top:18px;font-size:16px">${esc(t.hello)}${name ? ', ' + esc(name) : ''}!</td></tr>
<tr><td style="padding-top:8px;font-size:15px;color:#b9c6ee">${esc(lead)}</td></tr>
<tr><td align="center" style="padding:22px 0"><div style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:700;color:#fff;background:#1a2350;border:1px solid #3a4a8c;border-radius:12px;padding:14px 22px">${code}</div></td></tr>
<tr><td style="font-size:13px;color:#9aa8d6">${esc(t.ttl)}</td></tr>
<tr><td style="padding-top:6px;font-size:12px;color:#7d89b5">${esc(t.ignore)}</td></tr>
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
  await getTransport().sendMail({ from: env.MAIL_FROM || env.SMTP_USER, to, subject: msg.subject, text: msg.text, html: msg.html });
}

// Ishga tushganda ulanishni tekshirish (login/parol to'g'rimi)
export const verifyMail = () => getTransport().verify();
