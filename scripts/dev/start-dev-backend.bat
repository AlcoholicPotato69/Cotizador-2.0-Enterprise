@echo off
TITLE Backend Development Server (NestJS)
echo ========================================================
echo INICIANDO BACKEND EN MODO DESARROLLO (PORT 3000)
echo ========================================================

echo Matando procesos huérfanos en el puerto 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)

cd backend
echo Instalando dependencias backend...
call npm install
echo Iniciando servidor de NestJS con auto-reload...
call npm run start:dev
pause
