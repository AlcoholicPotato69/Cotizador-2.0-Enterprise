@echo off
TITLE Frontend Development Server (Vue 3 / Vite)
echo ========================================================
echo INICIANDO FRONTEND EN MODO DESARROLLO (PORT 5173)
echo ========================================================

cd frontend
echo Instalando dependencias frontend...
call npm install
echo Iniciando Vite Dev Server...
call npm run dev
pause
