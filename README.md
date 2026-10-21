# ASTRO · Quyosh tizimi

Interaktiv 3D astronomiya sayti (statik frontend) + Node.js backend: kirish/ro'yxatdan o'tish,
darslik progressi va test natijalarini serverda saqlash, admin paneli.

## Ishga tushirish

Talab: **Node.js 20.12+** (tavsiya: 22 yoki 24).

```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run db:push             # bazani yaratadi (prisma/dev.db)
npm start                   # http://localhost:3000
```

Ishlab chiqishda `npm run dev` — `server/` dagi o'zgarishda server o'zi qayta ishga tushadi.

**Birinchi admin:** `.env` dagi `ADMIN_EMAIL` ga yozilgan email bilan saytda ro'yxatdan o'ting —
hisob avtomatik `admin` bo'ladi. Yoki mavjud foydalanuvchini admin qilish:
`npm run make-admin -- email@example.com`. Admin paneli: `http://localhost:3000/admin`
(yoki saytda 👤 → «Admin panel»).

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
