@echo off
TITLE Backend Development Server (NestJS)
echo ========================================================
echo INICIANDO BACKEND EN MODO DESARROLLO (PORT 3000)
echo ========================================================

REM Resolver la raiz del proyecto (dos niveles arriba de scripts\dev\)
set "PROJECT_ROOT=%~dp0..\.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

echo Matando procesos huerfanos en el puerto 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Instalando dependencias backend...
cd /d "%PROJECT_ROOT%\backend"
call npm install
echo Iniciando servidor de NestJS con auto-reload...
call npm run start:dev
pause
