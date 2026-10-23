// Gmail orqali xat yuborishni ulash:  npm run mail:setup
//  1) Gmail manzili va "ilova paroli" (App password) so'raladi — parol ekranda ko'rinmaydi.
//  2) Gmail'ga ulanib tekshiriladi, o'sha manzilga sinov xati yuboriladi.
//  3) Faqat hammasi ishlasa .env ga yoziladi (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM).
// Ilova paroli: Google hisobida 2 bosqichli tekshiruv yoqilgan bo'lishi kerak → https://myaccount.google.com/apppasswords
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import nodemailer from 'nodemailer';
import { ROOT } from '../config.js';

const ENV = path.join(ROOT, '.env');

function ask(q, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // yozilayotgan belgilar o'rniga • chiqariladi
      rl._writeToOutput = (s) => { rl.output.write(s.includes(q) ? s : s.replace(/[^\r\n]/g, '•')); };
    }
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(a.trim()); });
  });
}

function saveEnv(values) {
  let lines = existsSync(ENV) ? readFileSync(ENV, 'utf8').split(/\r?\n/) : [];
  for (const [k, v] of Object.entries(values)) {
    const line = `${k}=${/[\s#"<>]/.test(v) ? JSON.stringify(v) : v}`;
    const i = lines.findIndex((l) => l.startsWith(k + '='));
    if (i >= 0) lines[i] = line; else lines.push(line);
  }
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  writeFileSync(ENV, lines.join('\n') + '\n');
}

console.log('\n  Zenithra — Gmail orqali tasdiqlash kodlarini yuborishni ulash\n');
console.log('  Kerak bo\'ladi: Gmail manzili va 16 belgili "ilova paroli" (oddiy Gmail parolingiz EMAS).');
console.log('  Ilova parolini olish: https://myaccount.google.com/apppasswords  (2 bosqichli tekshiruv yoqilgan bo\'lishi shart)\n');

const user = (await ask('  Gmail manzili: ')).toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user)) { console.error('\n  ✖ Manzil noto\'g\'ri.'); process.exit(1); }
const pass = (await ask('  Ilova paroli (16 belgi, bo\'sh joylar bilan bo\'lsa ham bo\'ladi): ', true)).replace(/\s+/g, '');
if (pass.length < 16) { console.error('\n  ✖ Ilova paroli 16 belgidan iborat bo\'lishi kerak.'); process.exit(1); }

const host = 'smtp.gmail.com', port = 465;
const t = nodemailer.createTransport({ host, port, secure: true, auth: { user, pass }, connectionTimeout: 15000 });
process.stdout.write('\n  Gmail\'ga ulanmoqda... ');
try { await t.verify(); console.log('✔'); }
catch (e) {
  console.log('✖');
  if (e.code === 'EAUTH') console.error('  Gmail kirishni rad etdi: manzil yoki ilova paroli noto\'g\'ri (oddiy Gmail paroli ishlamaydi —\n  aynan apppasswords sahifasidagi 16 belgili parol kerak).');
  else console.error('  Ulanib bo\'lmadi:', e.code || '', e.message, '\n  Internet yoki antivirus/firewall 465-portni to\'smayotganini tekshiring.');
  process.exit(1);
}
const from = `Zenithra <${user}>`;
process.stdout.write(`  Sinov xati ${user} ga yuborilmoqda... `);
try {
  await t.sendMail({ from, to: user, subject: 'Zenithra — pochta ulandi ✔',
    text: 'Tabriklaymiz! Zenithra sayti endi shu pochta orqali tasdiqlash kodlarini yuboradi.',
    html: '<div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px">✔ <b>Zenithra</b> sayti endi shu pochta orqali tasdiqlash kodlarini yuboradi.</div>' });
  console.log('✔');
} catch (e) { console.log('✖'); console.error('  Xat yuborilmadi:', e.message); process.exit(1); }

saveEnv({ SMTP_HOST: host, SMTP_PORT: String(port), SMTP_USER: user, SMTP_PASS: pass, MAIL_FROM: from });
console.log('\n  ✔ Tayyor! Sozlamalar .env ga yozildi. Pochtangizni tekshiring — sinov xati kelgan bo\'lishi kerak.');
console.log('  Endi serverni qayta ishga tushiring (Ctrl+C, so\'ng: npm start).\n');
