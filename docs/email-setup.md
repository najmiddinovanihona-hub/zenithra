# Tasdiqlash kodlari "Spam"ga tushmasligi uchun: Gmail API ni ulash

## Muammo nimada

Sayt kodlarni `najmiddinovanihona@gmail.com` nomidan yuboradi, lekin xatni **Brevo** serverlari jo'natadi.
Gmail buni tekshiradi (DMARC): "gmail.com manzilidan kelgan xat Google serveridan chiqmagan" — demak soxta
bo'lishi mumkin, shuning uchun xat **Spam** papkasiga tushadi. O'z domenimiz bo'lmagani uchun buni Brevo
sozlamalari bilan tuzatib bo'lmaydi.

**Yechim:** xatni Google'ning o'zi yuborsin — **Gmail API** orqali (HTTPS). Bu bepul, Render bepul tarifida
ishlaydi (SMTP portlari kerak emas) va SPF/DKIM/DMARC tekshiruvlari to'g'ri o'tadi.

Server qaysi yo'lni tanlaydi (ustunlik tartibi):

| Tartib | Yo'l | Qachon ishlaydi |
|---|---|---|
| 1 | Gmail API | `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_SENDER` — 4 tasi ham bor |
| 2 | Brevo | `BREVO_API_KEY` bor |
| 3 | SMTP | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` bor (lokal kompyuter, `npm run mail:setup`) |
| 4 | Yo'q | development — kod server oynasida ko'rinadi; production — "pochta sozlanmagan" xatosi |

Ixtiyoriy: `MAIL_FROM` — xatdagi ism (`Zenithra <...>`), `SITE_URL` — xat oxiridagi sayt manzili
(standart: `https://zenithra.onrender.com`).

---

## 1-qadam. Google Cloud loyihasi

1. <https://console.cloud.google.com> ga **o'sha Gmail hisobi** bilan kiring (`najmiddinovanihona@gmail.com`).
2. Yuqoridagi loyiha tanlagich → **New project** → nomi: `Zenithra mail` → **Create**.
3. Yangi loyiha tanlanganiga ishonch hosil qiling (yuqori chap burchakda nomi ko'rinadi).

Pul to'lash (billing) ulash **shart emas** — Gmail API bepul.

## 2-qadam. Gmail API ni yoqish

1. Menyu → **APIs & Services → Library**.
2. Qidiruvga `Gmail API` yozing → **Gmail API** → **Enable**.

## 3-qadam. OAuth ruxsat oynasi (consent screen)

Menyu → **APIs & Services → OAuth consent screen** (yangi ko'rinishda u **Google Auth Platform** deb ataladi).

1. **Get started** (yoki **Configure**):
   - App name: `Zenithra`
   - User support email: Gmail manzilingiz
   - Audience: **External**
   - Contact information: Gmail manzilingiz
   - Shartlarga rozilik → **Create**.
2. **Data access** (yoki "Scopes") → **Add or remove scopes** → ro'yxatdan
   `https://www.googleapis.com/auth/gmail.send` ni belgilang → **Update** → **Save**.
   (Bu faqat "sizning nomingizdan xat yuborish" ruxsati — pochtangizni o'qish ruxsati EMAS.)
3. **Audience** (yoki "OAuth consent screen" sahifasi) → **Publishing status** → **Publish app** →
   **Confirm**. Holat **In production** bo'lishi kerak.

> ⚠ **Muhim:** ilova **Testing** holatida qolsa, refresh token **7 kundan keyin** bekor bo'ladi va
> xatlar yana yuborilmay qoladi. Albatta **In production** ga o'tkazing.
>
> Google "ilovani tekshiruvdan o'tkazing (verification)" deb yozishi mumkin — bu shaxsiy, bitta hisob
> ishlatadigan yuboruvchi uchun shart emas. Ruxsat berishda "Google hasn't verified this app" ogohlantirishi
> chiqadi — bu normal (ilova sizniki).

## 4-qadam. OAuth mijozi (Desktop app)

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   (yangi ko'rinishda: **Google Auth Platform → Clients → Create client**).
2. Application type: **Desktop app**, Name: `Zenithra mail setup` → **Create**.
3. Oynada **Client ID** va **Client secret** ko'rinadi. Ularni vaqtincha nusxalab turing
   (yoki **Download JSON**). Client secret'ni hech kimga bermang.

## 5-qadam. Yordamchi skriptni ishga tushirish (o'z kompyuteringizda)

Loyiha papkasida (terminal / PowerShell):

```
node server/scripts/gmail-setup.js
```

Skript:

1. Client ID va Client secret'ni so'raydi (secret yozilayotganda `•••` bo'lib ko'rinadi), keyin Gmail manzilini.
2. Brauzerda Google oynasini ochadi (ochilmasa — terminaldagi havolani brauzerga nusxalang).
   - Gmail hisobingizni tanlang.
   - "Google hasn't verified this app" → **Advanced** → **Go to Zenithra (unsafe)**.
   - **Send email on your behalf** ruxsatini belgilab, **Continue**.
   - Brauzerda "✔ Tayyor" chiqadi — terminalga qayting.
3. Refresh token oladi va **o'zingizga sinov xati** yuboradi (Gmail'da **Sent / Yuborilganlar** papkasida
   ko'rinadi — o'zingizga yuborilgan xat Inbox'ga tushmasligi mumkin).
4. Render uchun qiymatlarni chiqaradi. **Refresh token faqat bir marta ko'rsatiladi** — darhol nusxalang.
   U parol kabi maxfiy: GitHub'ga, chatga, skrinshotga qo'ymang.
5. Xohlasangiz lokal `.env` ga ham yozadi (`.env` GitHub'ga yuklanmaydi).

## 6-qadam. Render'ga qo'yish

1. <https://dashboard.render.com> → Zenithra servisi → **Environment**.
2. **Add Environment Variable** orqali qo'shing:

   | Key | Value |
   |---|---|
   | `GMAIL_CLIENT_ID` | Google Console'dagi Client ID |
   | `GMAIL_CLIENT_SECRET` | Google Console'dagi Client secret |
   | `GMAIL_REFRESH_TOKEN` | skript chiqargan token (`1//...`) |
   | `GMAIL_SENDER` | `najmiddinovanihona@gmail.com` |
   | `MAIL_FROM` (ixtiyoriy) | `Zenithra <najmiddinovanihona@gmail.com>` |

3. **Save, rebuild, and deploy** (yoki **Save changes** → **Manual Deploy → Deploy latest commit**).
4. `BREVO_API_KEY` ni o'chirish shart emas — Gmail API ustun turadi. Lekin zaxira sifatida qoldirsangiz,
   Gmail ishlamay qolganda xatlar yana Spam'ga tushishi mumkinligini unutmang.

## 7-qadam. Tekshirish

1. Render → **Logs**: ishga tushganda shunday qator chiqishi kerak:
   `[mail] ✔ Pochta ulangan (...): Zenithra <najmiddinovanihona@gmail.com>`.
   Agar `GMAIL_TOKEN_REVOKED` yoki `refresh token revoked/expired` chiqsa — pastdagi jadvalga qarang.
2. Saytda **boshqa** pochta (masalan, ikkinchi Gmail yoki mail.ru) bilan ro'yxatdan o'tishni boshlang —
   kod **Inbox**'ga kelishi kerak.
3. Gmail'da xatni oching → **⋮ → Show original**: `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS` bo'lishi kerak.
4. Agar birinchi xatlar baribir Spam'da bo'lsa — **Report not spam / Spam emas** tugmasini bosing;
   Gmail tezda o'rganadi.

## Muammolar

| Xabar | Sabab va yechim |
|---|---|
| `refresh token revoked/expired` (`invalid_grant`) | Ilova **Testing** holatida qolgan (7 kun), Google hisob parolini almashtirgansiz yoki <https://myaccount.google.com/permissions> da ruxsat olib tashlangan. Ilovani **In production** ga o'tkazing, skriptni qayta ishga tushirib, yangi tokenni Render'ga qo'ying. |
| `GMAIL_CLIENT_ID yoki GMAIL_CLIENT_SECRET noto'g'ri` (`invalid_client`) | Render'dagi qiymatlarda bo'sh joy/xato bor yoki mijoz o'chirilgan. |
| `Gmail API 403 ... accessNotConfigured` | 2-qadam: Gmail API yoqilmagan (yoki boshqa loyihada yoqilgan). |
| `Access blocked` / `access_denied` | Consent screen sozlanmagan yoki Testing holatida hisobingiz "Test users"da yo'q. 3-qadamni qayta bajaring. |
| `redirect_uri_mismatch` | Mijoz turi **Desktop app** emas (Web application yaratilgan). 4-qadamda Desktop app yarating. |
| `Gmail API 429` | Kunlik limit (oddiy Gmail hisobi uchun taxminan 500 ta xat/kun). Ertaga o'zi tiklanadi. |

---

## O'z domeningiz bo'lsa (muqobil yo'l: Brevo + domen autentifikatsiyasi)

Agar keyinchalik o'z domeningiz bo'lsa (masalan, `zenithra.uz`), xatlarni `noreply@zenithra.uz` nomidan
Brevo orqali yuborish ham to'g'ri ishlaydi — faqat domen tasdiqlanishi kerak:

1. Brevo → **Settings → Senders, Domains & Dedicated IPs → Domains → Add a domain** → domeningizni kiriting.
2. Brevo ko'rsatgan DNS yozuvlarini domen DNS paneliga qo'shing:
   - **Brevo code** (TXT) — domen sizniki ekanini tasdiqlaydi;
   - **DKIM** (CNAME yoki TXT, Brevo bergan nom/qiymat) — xat imzosi;
   - **SPF** (TXT, `@`): `v=spf1 include:spf.brevo.com ~all` (agar SPF yozuvi bor bo'lsa — mavjudiga
     `include:spf.brevo.com` qo'shing, ikkinchi SPF yozuvi yaratmang);
   - **DMARC** (TXT, `_dmarc`): `v=DMARC1; p=none; rua=mailto:sizning@manzilingiz` — boshlanishiga `p=none`,
     hammasi PASS bo'lgach `p=quarantine` ga o'tkazish mumkin.
3. Brevo'da **Authenticate** → hammasi yashil bo'lishini kuting (DNS 1–24 soat).
4. **Senders** bo'limida `noreply@zenithra.uz` yuboruvchisini qo'shing.
5. Render → Environment: `BREVO_API_KEY` (Brevo → SMTP & API → API keys), `MAIL_FROM=Zenithra <noreply@zenithra.uz>`.
   `GMAIL_*` o'zgaruvchilarini **o'chiring** — aks holda Gmail API ustun turadi.
6. 7-qadamdagi kabi tekshiring (`Show original` → SPF/DKIM/DMARC PASS).
