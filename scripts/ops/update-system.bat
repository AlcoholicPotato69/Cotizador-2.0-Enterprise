@echo off
TITLE ERP Cotizador Enterprise - Actualizador
REM Resolver raiz del proyecto (dos niveles arriba de scripts\ops\)
set "PROJECT_ROOT=%~dp0..\.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

echo Descargando ultimos cambios del repositorio (git pull)...
cd /d "%PROJECT_ROOT%"
git pull origin main

echo Instalando dependencias de Backend...
cd /d "%PROJECT_ROOT%\backend"
call npm install

echo Instalando dependencias de Frontend...
cd /d "%PROJECT_ROOT%\frontend"
call npm install

echo Ejecutando migraciones de Base de Datos...
cd /d "%PROJECT_ROOT%\backend"
call npx prisma migrate deploy

echo.
echo Actualizacion completada. Ejecuta start-prod.bat para reanudar el servicio.
pause
