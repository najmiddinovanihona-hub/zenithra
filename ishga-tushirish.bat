@echo off
chcp 65001 >nul
title ASTRO server
cd /d "%~dp0"
if not exist node_modules (
  echo Paketlar o'rnatilmoqda...
  call npm install
)
if not exist prisma\dev.db call npx prisma db push --skip-generate
echo.
echo ASTRO: http://localhost:3000   (admin: http://localhost:3000/admin)
echo To'xtatish uchun shu oynani yoping yoki Ctrl+C bosing.
echo.
start "" http://localhost:3000
node server\index.js
pause
