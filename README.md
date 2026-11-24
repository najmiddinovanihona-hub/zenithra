# Zenithra · Quyosh tizimi

*Space Exploration Platform — Look Up. Explore. Discover.*

O'zbek tilidagi (rus va ingliz tillari bilan) interaktiv 3D astronomiya platformasi (statik frontend) + Node.js backend:
kirish/ro'yxatdan o'tish (email kodi bilan), darslik progressi va test natijalarini serverda saqlash, osmon eslatmalari (Web Push), admin paneli.

### Asosiy imkoniyatlar

- **3D Quyosh tizimi** — sayyoralar, yo'ldoshlar, real vaqt rejimi, sayohatlar, osmon to'ri va 88 ta yulduz turkumi.
- **Darslik** — astronomiya va kosmonavtika bo'yicha 40 mavzu: 3D modellar, grafiklar, formulalar, masalalar, testlar.
- **Ulug'bek rasadxonasi** — 3D qayta tiklangan rasadxona, Faxriy sekstanti, «Zij».
- **Dunyo rasadxonalari** — 14 ta rasadxonaning realistik 3D modeli, maqolalar, grafiklar, haqiqiy suratlar.
- **Astronomik asboblar** — 20 ta asbobning 3D modeli (gnomondan Habbl va LIGO gacha), ishlash namoyishi va qismlari.
- **Astronom olimlar** — 54 ta olim: hayoti, asarlari, asboblari, formulalari, xronologiyasi.
- **Kosmonavtlar** — 50 ta kosmonavt: parvozlari, rekordlari, kemalari, kosmosda o'tkazilgan vaqt taqqoslamasi.

Suratlar Wikimedia Commons'dan, faqat erkin litsenziyalar ostida — mualliflar `photos/*/CREDITS.md` fayllarida.

## Lokal ishga tushirish (tezkor boshlash)

Talab: **Node.js 22+** (tavsiya: 24). Lokal baza — SQLite (`prisma/dev.db`), hech narsa o'rnatish shart emas.

```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run db:push             # bazani yaratadi (prisma/dev.db)
npm start                   # http://localhost:3000
npm test                    # avtomatik testlar (alohida test bazalari bilan)
```

Ishlab chiqishda `npm run dev` — `server/` dagi o'zgarishda server o'zi qayta ishga tushadi.
Pochta sozlanmagan bo'lsa (development), tasdiqlash kodi server oynasiga (konsolga) chiqadi.
Pochtani sozlash: [docs/email-setup.md](docs/email-setup.md).

**Admin tayinlash:** avval saytda oddiy ro'yxatdan o'ting, so'ng server kompyuterida:
`npm run make-admin -- email@example.com`. Admin paneli: `http://localhost:3000/admin`
(yoki saytda 👤 → «Admin panel»). Konsolsiz hostingda (Render) — `ADMIN_EMAIL`: tizimda hali birorta admin
bo'lmasa, shu email bilan ro'yxatdan o'tib, emailini tasdiqlagan foydalanuvchi server ishga tushganda admin bo'ladi.
Admin paydo bo'lgach, `ADMIN_EMAIL` hech narsa qilmaydi (keyingi adminlar — admin panelidan).

Backend o'chiq bo'lsa ham sayt ishlaydi: `index.html` ni to'g'ridan-to'g'ri ochsangiz yoki statik
hostingga qo'ysangiz, 👤 tugma ko'rinmaydi va hamma narsa avvalgidek localStorage'da saqlanadi (mehmon rejimi).

## Tuzilma

| Joy | Nima |
|---|---|
| `index.html`, `script.js`, `style.css`, `data.js`, `labs/`, `photos/` | Sayt (frontend) |
| `api.js` | Frontend ↔ backend: kirish, progress/sozlamalar/test natijalari sinxroni |
| `admin.html`, `admin.js`, `admin.css` | Admin paneli (3 tilda) |
| `server/` | Express server: `app.js` (marshrutlar, statik fayllar), `routes/auth.js`, `routes/me.js`, `routes/admin.js` |
| `prisma/schema.prisma` | Ma'lumotlar bazasi sxemasi |
| `test/` | Avtomatik testlar (`npm test`) |
| `server/scripts/` | Yordamchi buyruqlar: `make-admin`, pochta sozlash, `prepare-db.js` (deployda bazani PostgreSQL'ga o'tkazadi) |
| `render.yaml` | Render Blueprint — hosting sozlamalari |
| `.github/workflows/` | GitHub Actions: CI, keepalive, zaxira, workflow-keepalive |
| `scripts/` | Zaxiradan tiklash: `restore-backup.md`, `restore-backup.sh`, `pg-url.mjs` |

## Sayyora teksturalari

`textures/` — NASA ma'lumotlari asosidagi 2K xaritalar ([Solar System Scope](https://www.solarsystemscope.com/textures/),
**CC BY 4.0**; muallif yozuvi intro ekranida). Sahna avval kod orqali chizilgan teksturalar bilan darhol ochiladi,
so'ng haqiqiy xaritalar fonda navbat bilan yuklanib almashtiriladi (`script.js` → 26b-bo'lim). Server bo'lmasa
(`index.html` to'g'ridan-to'g'ri ochilsa) protsedural teksturalar qoladi. Solishtirish uchun: `http://localhost:3000/?notex`.

## Grafika darajasi (tezlik)

`quality.js` qurilmaga qarab darajani o'zi tanlaydi: **low** (telefon, ≤4 yadro yoki ≤4 GB xotira), **mid**, **high**.
Daraja sfera segmentlari, zarralar soni, galaktika teksturalari, `devicePixelRatio` chegarasi va sayyora xaritalari
o'lchamini (low — `textures/1k_*`, ~1,2 MB; aks holda 2K, ~7,3 MB) belgilaydi. Qo'lda tanlash: `?q=low|mid|high`
yoki konsolda `QUALITY.set('low')` (localStorage'da saqlanadi).

Katta ma'lumot fayllari (rasadxonalar, asboblar, olimlar, kosmonavtlar, ilmiy bo'lim — `labs/lazy.js`) va darslik
mavzulari (`labs/dz-load.js`) sahifa ochilganda emas, tegishli bo'lim birinchi ochilganda yuklanadi.

## API

Barcha javoblar JSON. Xatolarda `{ "error": "KOD" }` qaytadi (`VALIDATION`, `UNAUTHORIZED`, `FORBIDDEN`,
`INVALID_CREDENTIALS`, `EMAIL_EXISTS`, `BLOCKED`, `RATE_LIMIT`, `SELF_ACTION`, `NOT_FOUND`) —
frontend kod bo'yicha 3 tilli matnni o'zi tanlaydi.

**Kirish**
- `POST /api/auth/register` `{name, email, password, lang?}` — parol ≥ 8 belgi, email unikal
- `POST /api/auth/login` `{email, password}` — 15 daqiqada 5 ta xato urinish (IP bo'yicha)
- `POST /api/auth/logout`
- `GET  /api/auth/me` → `{user}` (mehmon uchun `{user: null}`)

**Foydalanuvchi ma'lumotlari** (kirish talab qilinadi)
- `GET /api/me/progress` → `{progress: {t01: {v, s, t, b, d}, ...}}`
- `PUT /api/me/progress` `{progress, mode?: "merge" | "replace"}` — merge: "o'qilgan" belgisi yo'qolmaydi,
  eng yaxshi ball kamaymaydi, oxirgi natija vaqti (`d`) bo'yicha yangirog'i olinadi
- `POST /api/me/quiz` `{quizId, score, total}`, `GET /api/me/quiz`
- `GET/PUT /api/me/settings` `{lang, voice, theme, side, loc, locManual}` — qisman yangilash

**Admin** (`role = admin`)
- `GET /api/admin/stats` — foydalanuvchilar, faollik, 14 kunlik ro'yxatdan o'tishlar, top mavzular va testlar
- `GET /api/admin/stats/daily?days=30` · `GET /api/admin/stats/topics` · `GET /api/admin/stats/questions?min=5&limit=20` — kunlik ko'rsatkichlar, mavzular o'zlashtirishi, eng qiyin savollar
- `GET /api/admin/stats.csv?kind=daily|topics|questions` · `GET /api/admin/users.csv` (Excel uchun: UTF-8 BOM, `,`)
- `GET /api/admin/users?q=&role=&blocked=&page=` · `GET /api/admin/users/:id` (profil, progress, natijalar, sessiyalar, jurnal)
- `PATCH /api/admin/users/:id` `{name?, email?, role?, blocked?}` (email o'zgarsa sessiyalar yopiladi) · `DELETE /api/admin/users/:id`
- `POST /api/admin/users/:id/revoke-sessions` · `POST /api/admin/users/:id/force-reset` (parol bekor qilinadi — foydalanuvchi «Parolni unutdim» orqali tiklaydi)
- `GET /api/admin/quiz?userId=&quizId=&q=&page=` · `GET /api/admin/quiz.csv` (Excel uchun UTF-8)
- `GET /api/admin/audit?action=&actor=&target=&from=&to=&page=` · `GET /api/admin/audit/actions` · `GET /api/admin/audit.csv` — harakatlar jurnali (`action` aniq nom yoki `admin.user.*` prefiks)
- `GET /api/admin/content/meta` · `GET|POST /api/admin/content/questions` · `PUT|PATCH {active}|DELETE /api/admin/content/questions/:id` — admin savollari (3 tilli)
- `GET /api/admin/content/builtin?scope=&level=&q=&hidden=` · `POST /api/admin/content/builtin/hidden` `{qid, hidden}` — kod ichidagi savollarni yashirish

**Kontent** (ommaviy)
- `GET /api/content/questions` → `{custom, hidden}` — saytdagi `content.js` testlarga qo'shadi / yashirilganlarini chiqaradi
- `POST /api/content/answers` `{answers: [{qid, scope, level, text, correct}]}` — savollar statistikasi (≤ 50 ta, IP bo'yicha 10 daqiqada 15 so'rov);
  kirgan foydalanuvchi uchun `POST /api/me/quiz` ham ixtiyoriy `answers` maydonini qabul qiladi

Savol ID (qid, `quiz-ids.js`): admin savoli `c:<id>`, kod ichidagi savol `b:<quiz|dz>:<daraja yoki mavzu>:<o'zbekcha matndan FNV-1a, base36>`.

Test ID'lari: `quiz:easy|medium|hard` (asosiy test), `quiz:dz:1-40` (darslik savollari), `topic:t07` (mavzu testi).

## Xavfsizlik

- Parollar **bcrypt** (12 raund) bilan xeshlanadi. Eski demo-auth (`st_users` — zaif djb2 xesh) brauzerdan o'chiriladi.
- Sessiya: tasodifiy 256-bit token, `httpOnly` + `SameSite=Lax` cookie (`NODE_ENV=production` da `Secure`),
  bazada faqat token xeshi saqlanadi; 30 kun amal qiladi. Bloklangan foydalanuvchining sessiyalari darhol o'chadi.
- CSRF: o'zgartiruvchi so'rovlarda `Origin` tekshiriladi.
- Statik fayllar oq ro'yxat bo'yicha beriladi — `server/`, `prisma/`, `.env`, `uploads/`, `node_modules/` brauzerga hech qachon berilmaydi.
- Admin o'zini bloklay, o'chira yoki rolini pasaytira olmaydi (tizim adminsiz qolmasligi uchun).

## Hosting arxitekturasi

Sayt: **https://zenithra.onrender.com** — hammasi bepul tariflarda.

```
 Brauzer ──HTTPS──► Render (web service, Node 22, Frankfurt)
                     │  node server/index.js — statik fayllar + /api
                     ├──► Neon (PostgreSQL 17, bepul) ............ DATABASE_URL
                     └──► Pochta (HTTPS API: Gmail API yoki Brevo) . tasdiqlash kodlari

 GitHub (najmiddinovanihona-hub/zenithra)
   ├─ push → main ──────────────► Render avtomatik deploy
   └─ Actions: CI (testlar) · keepalive (/api/health) · DB backup (shifrlangan) · workflow-keepalive
```

| Xizmat | Vazifasi | Qayerda boshqariladi |
|---|---|---|
| **Render** (web service, free) | Node.js serveri, statik fayllar, HTTPS | dashboard.render.com → `zenithra` |
| **Neon** (PostgreSQL, free) | Foydalanuvchilar, progress, natijalar, sessiyalar | console.neon.tech |
| **Brevo** / **Gmail API** | Ro'yxatdan o'tish va kirish kodlari (Render bepul tarifida SMTP portlari yopiq — faqat HTTP API) | [docs/email-setup.md](docs/email-setup.md) |
| **GitHub Actions** | CI, keepalive, kunlik zaxira, workflow-keepalive | repo → Actions |

Lokal ishlab chiqish va testlar **SQLite**'da qoladi. Deployda `server/scripts/prepare-db.js` `DATABASE_URL`
`postgresql://` bilan boshlanganini ko'rib, `schema.prisma` dagi provider'ni faqat build serverida `postgresql` ga
almashtiradi (repo'dagi fayl o'zgarmaydi). Kod ikkala bazada bir xil ishlaydi.

## Deploy qanday ishlaydi

1. `main` branch'ga push qilinadi.
2. GitHub'da **CI** ishga tushadi (sintaksis + `npm test`). Render CI'ni kutmaydi — shuning uchun testlarni
   push'dan oldin lokal ham ishlating (`npm test`) yoki o'zgarishni avval boshqa branch'da sinang (CI har bir branch'da ishlaydi).
3. **Render** `render.yaml` bo'yicha avtomatik build qiladi:
   `npm ci --include=dev && node server/scripts/prepare-db.js && npx prisma generate && npx prisma db push --skip-generate`
   — ya'ni Neon'dagi sxema `prisma/schema.prisma` ga moslanadi (migratsiya fayllarisiz). Sxemadan ustun/jadval
   olib tashlansa, `db push` ma'lumot yo'qolishi haqida to'xtaydi — bunday o'zgarishdan oldin zaxira oling.
4. Build muvaffaqiyatli bo'lsa, `/api/health` javob bergach yangi versiya ishga tushadi (eski versiya shu paytgacha ishlaydi).
   Xato bo'lsa, eski versiya qoladi — Render → `zenithra` → **Events / Logs**.
5. Brauzer keshi: o'zgargan JS/CSS fayllarning `index.html` dagi `?v=N` raqamini oshiring.

Orqaga qaytarish: Render → `zenithra` → **Events** → oldingi deploy → **Rollback** (kodni qaytaradi, bazani emas).

## Muhit o'zgaruvchilari

Qiymatlar **hech qachon** repo'ga yozilmaydi: lokal — `.env` (git'ga kirmaydi), production — Render → `zenithra` →
**Environment**, GitHub Actions — repo **Settings → Secrets and variables → Actions**.

| O'zgaruvchi | Qayerda | Nima |
|---|---|---|
| `DATABASE_URL` | Render, GitHub secret, `.env` | Lokal: `file:./dev.db`. Production: Neon manzili `postgresql://...?sslmode=require` |
| `NODE_ENV` | Render (`production`) | production'da cookie faqat HTTPS orqali, pochta majburiy |
| `TRUST_PROXY` | Render (`1`) | Render proksisi orqali haqiqiy IP (login cheklovi uchun) |
| `NODE_VERSION` | Render (`22`) | Render qaysi Node versiyasini ishlatishi |
| `PORT` | lokal | Standart 3000 (Render o'zi beradi) |
| `ADMIN_EMAIL` | Render | Birinchi admin (yuqoriga qarang) |
| `MAIL_FROM` | Render, `.env` | Jo'natuvchi, masalan `Zenithra <siz@gmail.com>` |
| `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_SENDER` | Render | Gmail API orqali pochta ([docs/email-setup.md](docs/email-setup.md)) |
| `BREVO_API_KEY` | Render | Brevo HTTP API orqali pochta |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | `.env` | Lokal SMTP (Render bepul tarifida ishlamaydi) |
| `SITE_URL` | Render (ixtiyoriy) | Xatlardagi sayt manzili (standart: `https://zenithra.onrender.com`) |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Render (ixtiyoriy) | Web Push kalitlari; bo'sh bo'lsa bazada yaratiladi va saqlanadi |
| `COOKIE_SECURE`, `BCRYPT_ROUNDS` | ixtiyoriy | Majburiy Secure cookie (`1`/`0`), bcrypt raundlari (10–14) |
| `BACKUP_PASSPHRASE` | faqat GitHub secret | Kunlik zaxirani shifrlash paroli (pastga qarang) |

## GitHub Actions

| Workflow | Qachon | Nima qiladi |
|---|---|---|
| `ci.yml` — **CI** | har push (istalgan branch) va PR | `npm ci`, `prisma generate`, barcha JS fayllarga `node --check`, `npm test` (SQLite — secret kerak emas) |
| `keepalive.yml` — **Keep Render awake** | har 10 daqiqa (jadval) | `/api/health` ga so'rov — Render uxlab qolmasin |
| `backup.yml` — **DB backup (shifrlangan)** | har kuni 02:30 UTC + qo'lda | Neon → `pg_dump` → gpg AES-256 → artifact (30 kun) |
| `workflow-keepalive.yml` | har oyning 1- va 15-kuni | Jadvalli workflow'larni API orqali qayta yoqadi (60 kun qoidasi, pastga qarang) |

**Kerakli GitHub secretlari** (repo → **Settings → Secrets and variables → Actions → New repository secret**):

| Nomi | Qiymati |
|---|---|
| `DATABASE_URL` | Render'dagi `DATABASE_URL` bilan bir xil Neon manzili (Neon → Connect; pooled bo'lsa ham bo'ladi) |
| `BACKUP_PASSPHRASE` | Uzun tasodifiy parol, kamida 20 belgi (masalan, parol menejerida yarating). **Parol menejerida saqlang** — busiz zaxiralarni hech kim ocha olmaydi |

Secretlar qo'shilmaguncha backup workflow xato bermaydi, faqat «o'tkazib yuborildi» eslatmasini chiqaradi.
Birinchi tekshiruv: Actions → **DB backup (shifrlangan)** → **Run workflow**.

## Zaxira nusxa va tiklash

- Har kuni Neon bazasi to'liq zaxiralanadi (`pg_dump --format=custom`), **yuklashdan oldin gpg AES-256 bilan
  shifrlanadi** va Actions artifact sifatida 30 kun saqlanadi. Repo ommaviy — artifact'larni har qanday GitHub
  foydalanuvchisi yuklab olishi mumkin, shuning uchun shifrsiz fayl hech qachon yuklanmaydi (workflow buni tekshiradi).
- Neon'ning o'z tarixi (bepul tarifda 6 soat) — so'nggi xatolarni tez qaytarish uchun; undan eskisi — shu zaxiralar.
- **Tiklash:** to'liq yo'riqnoma — [scripts/restore-backup.md](scripts/restore-backup.md). Qisqasi:
  Actions → kerakli run → Artifacts'dan yuklab olish → Neon'da yangi branch → 
  `TARGET_DATABASE_URL=... bash scripts/restore-backup.sh zenithra-<sana>.dump.gpg` → tekshirib, Render'dagi
  `DATABASE_URL` ni yangi branch'ga almashtirish.

## Bepul tarif chegaralari (kuzatib boring)

| Xizmat | Chegara | Nima bo'ladi / nima qilish kerak |
|---|---|---|
| **Render** | Oyiga 750 soat (workspace'dagi barcha bepul servislar uchun umumiy); 15 daqiqa so'rovsiz qolsa uxlaydi (keyingi ochilish ~50 s) | Bitta servis 24/7 ga yetadi (~730 soat). Ikkinchi bepul servis qo'shsangiz, soat yetmaydi. Dashboard → Billing |
| **Neon** | 1 GB saqlash (loyiha boshiga), oyiga 100 CU-soat hisoblash, 6 soatlik tarix, 10 branch; 5 daqiqa faoliyatsiz qolsa compute uxlaydi | 1 GB to'lsa — yozish bloklanadi; CU-soat tugasa — baza oy oxirigacha to'xtaydi. 24/7 ishlagan compute (0,25 CU) oyiga ~180 CU-soat sarflaydi — bazaga har 5 daqiqadan tez-tez so'rov ketmasligi kerak (Render health check'i ham shunga kiradi). Console → Usage |
| **Brevo** | Kuniga 300 ta xat; API kaliti 1 yildan keyin yoki 90 kun ishlatilmasa eskirishi mumkin | Kalit eskirsa — kodlar kelmaydi: yangi kalit yaratib, Render'dagi `BREVO_API_KEY` ni almashtiring |
| **GitHub Actions** | Ommaviy repo'da daqiqalar bepul; **60 kun commit bo'lmasa, jadvalli workflow'lar o'chiriladi** | `workflow-keepalive.yml` buni oldini oladi. Baribir o'chsa: GitHub email yuboradi → Actions → workflow → **Enable workflow** |
| **GitHub cron** | Jadval kafolatlanmaydi — yuklama paytida kechikadi yoki tushib qoladi (`*/10` amalda kamdan-kam ishlaydi) | Sayt uyg'oq turishi muhim bo'lsa, tashqi bepul pinger qo'shing (cron-job.org yoki UptimeRobot, 5–10 daqiqada bir) |

## Production (o'z serveringizda)

- `NODE_ENV=production` (cookie faqat HTTPS orqali), nginx/Caddy orqasida bo'lsa `TRUST_PROXY=1`.
- PostgreSQL: `DATABASE_URL="postgresql://..."`, so'ng `node server/scripts/prepare-db.js && npx prisma db push`.
- Serverni `pm2` yoki systemd bilan ishga tushiring: `node server/index.js`.
- `uploads/` deployga kirmaydi (server uni bermaydi).
