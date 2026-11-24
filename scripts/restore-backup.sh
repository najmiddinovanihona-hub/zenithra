#!/usr/bin/env bash
# Shifrlangan zaxirani (zenithra-*.dump.gpg) ochib, PostgreSQL bazaga tiklaydi.
# To'liq yo'riqnoma: scripts/restore-backup.md
#
# Ishlatish (Linux/macOS yoki Windows'da Git Bash):
#   export TARGET_DATABASE_URL='postgresql://...'      # QAYSI bazaga tiklash (tavsiya: Neon'da yangi branch)
#   bash scripts/restore-backup.sh zenithra-2026-11-24T0230Z.dump.gpg
#
# Kerak: gpg (Git for Windows ichida bor), pg_restore (PostgreSQL client, Neon bilan bir xil yoki yangiroq
# versiya — 17+), node (manzilni tozalash uchun).
# Parol (BACKUP_PASSPHRASE) gpg tomonidan so'raladi yoki BACKUP_PASSPHRASE_FILE faylidan o'qiladi.
set -euo pipefail

die() { echo "XATO: $*" >&2; exit 1; }

enc="${1:-}"
[ -n "$enc" ] || die "fayl ko'rsatilmadi. Ishlatish: bash scripts/restore-backup.sh <zenithra-....dump.gpg>"
[ -f "$enc" ] || die "fayl topilmadi: $enc"
[ -n "${TARGET_DATABASE_URL:-}" ] || die "TARGET_DATABASE_URL o'rnatilmagan (qaysi bazaga tiklash kerakligi)"
command -v gpg >/dev/null || die "gpg topilmadi"
command -v pg_restore >/dev/null || die "pg_restore topilmadi (PostgreSQL client o'rnating; Windows: postgresql.org → Download → faqat Command Line Tools)"
command -v node >/dev/null || die "node topilmadi"

here="$(cd "$(dirname "$0")" && pwd)"

# Checksum bo'lsa — tekshiramiz (fayl buzilmaganmi)
if [ -f "$enc.sha256" ] && command -v sha256sum >/dev/null; then
  (cd "$(dirname "$enc")" && sha256sum -c "$(basename "$enc").sha256") || die "checksum mos kelmadi — fayl buzilgan"
fi

url="$(SRC_DATABASE_URL="$TARGET_DATABASE_URL" node "$here/pg-url.mjs")" || die "TARGET_DATABASE_URL noto'g'ri"
host="$(PGURL="$url" node -e 'process.stdout.write(new URL(process.env.PGURL).host)')"
db="$(PGURL="$url" node -e 'process.stdout.write(new URL(process.env.PGURL).pathname.slice(1))')"

tmp="$(mktemp -d)"
cleanup() { rm -rf "$tmp"; }
trap cleanup EXIT
chmod 700 "$tmp"
plain="$tmp/restore.dump"

echo "1/3  Shifr ochilmoqda..."
gpg_args=(--yes --quiet --output "$plain" --decrypt "$enc")
if [ -n "${BACKUP_PASSPHRASE_FILE:-}" ]; then
  gpg --batch --pinentry-mode loopback --passphrase-file "$BACKUP_PASSPHRASE_FILE" "${gpg_args[@]}" \
    || die "shifrni ochib bo'lmadi (parol noto'g'rimi?)"
else
  gpg "${gpg_args[@]}" || die "shifrni ochib bo'lmadi (parol noto'g'rimi?)"
fi

echo "2/3  Zaxira tarkibi:"
pg_restore --list "$plain" | grep -E " TABLE DATA " | awk '{print "     - " $NF}' || true
echo
echo "DIQQAT: '$host' serveridagi '$db' bazasidagi Zenithra jadvallari O'CHIRILIB, zaxiradagi holat bilan"
echo "        almashtiriladi. Zaxiradan keyingi barcha o'zgarishlar (yangi foydalanuvchilar, progress) yo'qoladi."
read -r -p "Davom etish uchun HA deb yozing: " ans
[ "$ans" = "HA" ] || die "bekor qilindi"

echo "3/3  Tiklanmoqda..."
pg_restore --dbname="$url" --clean --if-exists --no-owner --no-privileges --single-transaction --exit-on-error "$plain"
echo "Tayyor. Saytni tekshiring; kerak bo'lsa Render → Environment → DATABASE_URL ni shu bazaga almashtiring."
