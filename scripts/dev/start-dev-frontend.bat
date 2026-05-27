@echo off
TITLE Frontend Development Server (Vue 3 / Vite)
echo ========================================================
echo INICIANDO FRONTEND EN MODO DESARROLLO (PORT 5173)
echo ========================================================

REM Resolver la raiz del proyecto (dos niveles arriba de scripts\dev\)
set "PROJECT_ROOT=%~dp0..\.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

echo Instalando dependencias frontend...
cd /d "%PROJECT_ROOT%\frontend"
call npm install
echo Iniciando Vite Dev Server...
call npm run dev
pause
