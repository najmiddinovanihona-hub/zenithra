@echo off
chcp 65001 >nul
title ASTRO server
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js topilmadi. https://nodejs.org dan 22 yoki undan yangi versiyani o'rnating.
  pause
  exit /b 1
)

if not exist .env (
  echo .env yaratilmoqda ^(.env.example dan^)...
  copy /y .env.example .env >nul
)
if not exist node_modules (
  echo Paketlar o'rnatilmoqda...
  call npm install
  if errorlevel 1 ( pause & exit /b 1 )
)
if not exist prisma\dev.db call npx prisma db push --skip-generate

echo.
echo ASTRO: http://localhost:3000   ^(admin: http://localhost:3000/admin^)
echo To'xtatish uchun shu oynani yoping yoki Ctrl+C bosing.
echo.
rem Brauzer server ishga tushgach (3 soniyadan keyin) ochiladi
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start "" http://localhost:3000"
node server\index.js
pause
