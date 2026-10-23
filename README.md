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

## Ishga tushirish

Talab: **Node.js 22+** (tavsiya: 24).

```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run db:push             # bazani yaratadi (prisma/dev.db)
npm start                   # http://localhost:3000
```

Ishlab chiqishda `npm run dev` — `server/` dagi o'zgarishda server o'zi qayta ishga tushadi.

**Admin tayinlash:** avval saytda oddiy ro'yxatdan o'ting, so'ng server kompyuterida:
`npm run make-admin -- email@example.com`. Admin paneli: `http://localhost:3000/admin`
(yoki saytda 👤 → «Admin panel»). Ro'yxatdan o'tish orqali admin bo'lib bo'lmaydi — email tasdiqlanmagani
uchun bu xavfsiz emas edi (oldingi `ADMIN_EMAIL` sozlamasi olib tashlandi).

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

## Sayyora teksturalari

`textures/` — NASA ma'lumotlari asosidagi 2K xaritalar ([Solar System Scope](https://www.solarsystemscope.com/textures/),
**CC BY 4.0**; muallif yozuvi intro ekranida). Sahna avval kod orqali chizilgan teksturalar bilan darhol ochiladi,
so'ng haqiqiy xaritalar fonda navbat bilan yuklanib almashtiriladi (`script.js` → 26b-bo'lim). Server bo'lmasa
(`index.html` to'g'ridan-to'g'ri ochilsa) protsedural teksturalar qoladi. Solishtirish uchun: `http://localhost:3000/?notex`.

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
- `GET /api/admin/users?q=&role=&blocked=&page=` · `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id` `{role?, blocked?}` · `DELETE /api/admin/users/:id`
- `GET /api/admin/quiz?userId=&quizId=&q=&page=` · `GET /api/admin/quiz.csv` (Excel uchun UTF-8)

Test ID'lari: `quiz:easy|medium|hard` (asosiy test), `quiz:dz:1-40` (darslik savollari), `topic:t07` (mavzu testi).

## Xavfsizlik

- Parollar **bcrypt** (12 raund) bilan xeshlanadi. Eski demo-auth (`st_users` — zaif djb2 xesh) brauzerdan o'chiriladi.
- Sessiya: tasodifiy 256-bit token, `httpOnly` + `SameSite=Lax` cookie (`NODE_ENV=production` da `Secure`),
  bazada faqat token xeshi saqlanadi; 30 kun amal qiladi. Bloklangan foydalanuvchining sessiyalari darhol o'chadi.
- CSRF: o'zgartiruvchi so'rovlarda `Origin` tekshiriladi.
- Statik fayllar oq ro'yxat bo'yicha beriladi — `server/`, `prisma/`, `.env`, `uploads/`, `node_modules/` brauzerga hech qachon berilmaydi.
- Admin o'zini bloklay, o'chira yoki rolini pasaytira olmaydi (tizim adminsiz qolmasligi uchun).

## PostgreSQL'ga o'tish

1. `prisma/schema.prisma` da `provider = "postgresql"` qiling.
2. `.env` da `DATABASE_URL="postgresql://user:parol@host:5432/astro"`.
3. `npm run db:push`.

Kod o'zgarmaydi (qidiruvdagi katta-kichik harf farqi avtomatik hisobga olinadi).

## Production

- `NODE_ENV=production` (cookie faqat HTTPS orqali), nginx/Caddy orqasida bo'lsa `TRUST_PROXY=1`.
- Serverni `pm2` yoki systemd bilan ishga tushiring: `node server/index.js`.
- `single/` va `uploads/` deployga kirmaydi (server ularni bermaydi).
