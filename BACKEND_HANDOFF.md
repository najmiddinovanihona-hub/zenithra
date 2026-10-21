> **Tarixiy hujjat.** Bu backend yozilishidan oldingi topshiriq. Amalda qilingan ish, ishga tushirish va API uchun [README.md](README.md) ga qarang. Farqlar: admin `ADMIN_EMAIL` orqali emas, `npm run make-admin` bilan tayinlanadi; joylashuv xavfsizlik uchun serverga sinxronlanmaydi; `SESSION_SECRET` kerak emas (sessiya tokeni tasodifiy, bazada faqat xeshi).

# ASTRO · Quyosh tizimi — Backend qo'shish uchun topshiriq (Claude Code)

## Hozirgi holat
- To'liq **statik frontend** (HTML + CSS + vanilla JS, Three.js CDN orqali). Build tizimi yo'q — `index.html` ni to'g'ridan-to'g'ri ochish mumkin.
- O'z serveri yo'q. Ma'lumotlar `localStorage` da, tashqi bepul API'lar to'g'ridan-to'g'ri brauzerdan chaqiriladi.
- Interfeys 3 tilda: `uz` / `ru` / `en` (`data.js` → `window.LOC`, `labs/*` da `{uz,ru,en}` obyektlar). **Har qanday yangi matn ham 3 tilda bo'lishi shart.**

## Fayl tuzilmasi
- `index.html` — asosiy sahifa (loader, intro, topbar, panellar, `#authView` kirish oynasi).
- `script.js` — asosiy mantiq: 3D sahna, i18n (`applyLanguage`), sayohatlar, **auth (≈5878–5950-qatorlar)**.
- `style.css` — barcha stillar.
- `data.js`, `photos.js`, `extras.js`, `guide.js`, `quiz-extra*.js` — kontent va testlar.
- `labs/core.js` — laboratoriyalar yadrosi: `window.LAB` (til, joylashuv, geocode, GPS/IP).
- `labs/darslik.js` + `labs/dz-*.js` — Darslik (40 mavzu), progress `window.DZP`.
- `labs/ilmiy*.js`, `labs/ilm3d-*.js` — Ilmiy bo'lim (8 mavzu, 3D sahnalar).
- `labs/weather.js` — ob-havo (Open-Meteo), `labs/leaflet/` — xarita.
- `photos/` — rasmlar. `single/index.html` — eski bir faylli nusxa (backend uchun kerak emas, o'chirsa bo'ladi). `uploads/` — ishchi materiallar (deployga kirmaydi).

## Hozir localStorage'da saqlanayotganlar (serverga ko'chiriladi)
- `st_users`, `st_session` — **demo auth** (parol djb2 hash bilan — xavfsiz emas, almashtirilishi kerak).
- `dz_prog` — darslik progressi: `{ [topicId]: { v:1, test:{score,total,at} ... } }` (`labs/darslik.js` → `window.DZP`).
- `solar_lang`, `solar_voice`, `dz_theme`, `dz_side` — foydalanuvchi sozlamalari.
- `sky_loc`, `loc_manual` — tanlangan joylashuv.
- `wx_grid`, `wx_base` — ob-havo keshi / xarita foni (client'da qolishi mumkin).

## Tashqi API'lar (hozir brauzerdan)
- Open-Meteo (`labs/weather.js`), BigDataCloud reverse-geocode va Nominatim (`labs/core.js`), ipwho.is / geojs.io (IP joylashuv), Esri tile'lar.
- Tavsiya: Open-Meteo va geocode'ni backend orqali **proxy + kesh** (15–30 daqiqa) qilish; Nominatim uchun 1 so'rov/soniya limitini serverda ushlash.

## Kerakli backend
### 1. Kirish / ro'yxatdan o'tish
- `POST /api/auth/register` {name, email, password} — email unikal, parol ≥ 8 belgi.
- `POST /api/auth/login` {email, password}
- `POST /api/auth/logout`
- `GET  /api/auth/me` → {id, name, email, role, lang}
- Parol: **argon2id yoki bcrypt**. Sessiya: httpOnly + Secure + SameSite=Lax cookie (JWT yoki server sessiya).
- Login'ga rate-limit (masalan 5 urinish / 15 daqiqa), parolni tiklash (email orqali) — ixtiyoriy.
- Frontend: `script.js` dagi `authUsers/authSubmit/authEnter/userBtn` mantig'ini API chaqiruvlariga almashtirish. `#authView` UI'si va 3 tilli matnlar (`window.LOC[lang].auth`) saqlanadi.
- Hozir kirish oynasi boshlang'ich yuklanishda yashirilgan — mehmon rejimi qolsin; kirgan foydalanuvchida progress sinxronlansin.

### 2. Foydalanuvchi ma'lumotlari
- `GET/PUT /api/me/progress` — `dz_prog` obyektini sinxronlash (birinchi kirishda localStorage'dagini serverga birlashtirish/merge).
- `POST /api/me/quiz` — test natijasi {quizId, score, total, at}.
- `GET/PUT /api/me/settings` — til, ovoz, mavzu, joylashuv.

### 3. Admin qismi (`role = 'admin'`)
- Alohida sahifa `admin.html` (yoki `/admin` route), faqat admin uchun (server tomonda tekshiriladi).
- Foydalanuvchilar: ro'yxat, qidiruv, rolni o'zgartirish, bloklash/o'chirish.
- Statistika: ro'yxatdan o'tganlar soni, faol foydalanuvchilar, eng ko'p o'qilgan mavzular, test natijalari o'rtachasi.
- Test natijalari jadvali (foydalanuvchi bo'yicha filtr, CSV eksport).
- Ixtiyoriy: kontent boshqaruvi (fakt/test savollarini tahrirlash) — hozir kontent JS fayllarda, bu katta o'zgarish.
- Birinchi admin: `.env` dagi `ADMIN_EMAIL` bilan ro'yxatdan o'tgan foydalanuvchiga avtomatik `admin` roli yoki seed skript.
- Admin UI ham 3 tilda va saytning mavjud uslubida (qorong'i kosmik fon, `.glass` panellar, `--neon` ko'k aksent — `style.css`).

## Tavsiya etilgan stek
- **Node.js + Express (yoki Fastify) + PostgreSQL + Prisma**; statik fayllarni ham shu server beradi.
- Muqobil (tezroq): **Supabase** (Auth + Postgres + Row Level Security) — server kodi minimal.
- Jadval'lar: `users(id, name, email, password_hash, role, blocked, lang, created_at)`, `progress(user_id, topic_id, data jsonb, updated_at)`, `quiz_results(id, user_id, quiz_id, score, total, created_at)`, `settings(user_id, data jsonb)`.
- `.env`: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `PORT`.

## Muhim cheklovlar
- Mavjud frontend ishlashi buzilmasin: backend o'chiq bo'lsa ham sayt mehmon rejimida (localStorage bilan) ishlayversin.
- Performance: 3D sahna og'ir — yangi skriptlar `defer` bilan, asosiy oqimni bloklamasin.
- Kesh uchun skriptlarda `?v=N` versiyalash ishlatiladi — o'zgartirganda raqamni oshiring.
