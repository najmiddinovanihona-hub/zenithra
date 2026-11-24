# Zaxiradan bazani tiklash

Zaxira nusxalarni `.github/workflows/backup.yml` har kuni 02:30 UTC da oladi: Neon bazasi `pg_dump`
(custom format) bilan olinadi, **gpg AES-256** bilan shifrlanadi va GitHub Actions artifact sifatida
**30 kun** saqlanadi. Artifact'lar ichida faqat shifrlangan `zenithra-<sana>.dump.gpg` va uning
`.sha256` checksum fayli bor.

> **Ogohlantirishlar**
> - Tiklash zaxira olingan paytdagi holatni qaytaradi: undan keyingi **barcha** o'zgarishlar
>   (yangi foydalanuvchilar, progress, test natijalari, admin amallari) yo'qoladi.
> - Avval **yangi Neon branch**ga tiklang va tekshiring, shundan keyingina production'ga o'tkazing.
>   Asosiy (production) bazaga to'g'ridan-to'g'ri tiklash — oxirgi chora.
> - `BACKUP_PASSPHRASE` yo'qolsa, zaxiralarni **hech kim** ocha olmaydi (GitHub ham). Parolni parol
>   menejerida saqlang.
> - Ochilgan `.dump` fayli — foydalanuvchilarning shaxsiy ma'lumotlari (email, parol xeshlari) va server kalitlari (`app_kv` dagi VAPID).
>   Uni hech qayerga yuklamang, ishingiz tugagach o'chiring. Skript buni o'zi qiladi.

## Kerakli dasturlar

| Dastur | Qayerdan |
|---|---|
| `gpg` | Windows: Git for Windows ichida bor (Git Bash). Linux/macOS: `gnupg` paketi |
| `pg_restore` | PostgreSQL client, Neon versiyasi bilan bir xil yoki yangiroq (17+). Windows: postgresql.org → Download → installer'da faqat **Command Line Tools** ni tanlang. Ubuntu: `postgresql-client-17` (PGDG repo) |
| `node` | Loyihaning o'zi uchun allaqachon o'rnatilgan (22+) |

## 1. Zaxirani yuklab olish

1. GitHub → repo → **Actions** → chapda **DB backup (shifrlangan)**.
2. Kerakli kunning yashil run'ini oching → pastda **Artifacts** → `zenithra-db-<sana>` ni yuklab oling.
3. ZIP'ni oching — ichida `zenithra-<sana>.dump.gpg` va `zenithra-<sana>.dump.gpg.sha256`.

Yoki `gh` bilan:

```bash
gh run list --workflow backup.yml --limit 5
gh run download <RUN_ID> --dir backup
```

## 2. Yangi Neon branch (tavsiya)

Neon konsoli → loyiha → **Branches** → **Create branch** (masalan, `restore-2026-11-24`) → shu branch'ning
**Connection string**ini nusxalang ("Pooled connection" belgisini olib tashlang — to'g'ridan-to'g'ri ulanish
kerak; skript pooled manzilni ham o'zi to'g'rilaydi).

## 3. Tiklash (skript bilan)

Git Bash (Windows) yoki terminalda, loyiha papkasida:

```bash
export TARGET_DATABASE_URL='postgresql://...yangi-branch-manzili...?sslmode=require'
bash scripts/restore-backup.sh backup/zenithra-2026-11-24T0230Z.dump.gpg
```

Skript:
1. checksum'ni tekshiradi;
2. `gpg` orqali parolni so'rab, shifrni vaqtinchalik papkaga ochadi;
3. zaxiradagi jadvallar ro'yxatini ko'rsatadi va **HA** deb yozishingizni kutadi;
4. `pg_restore --clean --if-exists --no-owner --no-privileges --single-transaction` bilan tiklaydi
   (xato bo'lsa, hech narsa o'zgarmaydi — bitta tranzaksiya);
5. ochilgan faylni o'chiradi.

Parolni so'ramasdan (masalan, serverda) ishlatish: `BACKUP_PASSPHRASE_FILE=/yo'l/parol.txt` (fayl huquqi 600).

## 3a. Qo'lda tiklash (skriptsiz)

```bash
gpg --output zenithra.dump --decrypt zenithra-2026-11-24T0230Z.dump.gpg
pg_restore --list zenithra.dump | head                      # tarkibni ko'rish
pg_restore --dbname="$TARGET_DATABASE_URL" --clean --if-exists --no-owner --no-privileges \
           --single-transaction --exit-on-error zenithra.dump
rm zenithra.dump                                             # albatta o'chiring
```

`$TARGET_DATABASE_URL` da Prisma parametrlari (`pgbouncer=true`, `schema=...`) bo'lmasin — libpq ularni tanimaydi.

## 4. Saytni yangi bazaga o'tkazish

1. Yangi branch'dagi ma'lumotlarni tekshiring (Neon → **SQL Editor**: `select count(*) from users;`).
2. Render → `zenithra` servisi → **Environment** → `DATABASE_URL` ni yangi branch manziliga almashtiring →
   **Save** (Render qayta deploy qiladi; build'dagi `prisma db push` sxemani tekshiradi).
3. GitHub → Settings → Secrets → Actions → `DATABASE_URL` ni ham yangilang (aks holda zaxira eski bazadan olinadi).
4. Hammasi joyida bo'lsa, eski branch'ni keyinroq o'chiring (Neon bepul tarifida branch'lar soni cheklangan).

Yoki Neon'ning o'zida: **Branches** → asosiy branch → **Restore** (Neon bepul tarifida atigi 6 soatlik tarix;
undan eski holat uchun shu GitHub zaxiralari kerak).
