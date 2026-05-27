@echo off
TITLE ERP Cotizador Enterprise - Validador de Instalacion
REM Resolver raiz del proyecto (dos niveles arriba de scripts\ops\)
set "PROJECT_ROOT=%~dp0..\.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

echo ========================================================
echo VALIDADOR DE INSTALACION
echo ========================================================
echo.
echo [1/3] Verificando Node.js...
node -v || echo [ERROR] Node.js no esta instalado o no esta en el PATH.
echo [2/3] Verificando NPM...
npm -v || echo [ERROR] NPM no esta instalado o no esta en el PATH.
echo [3/3] Verificando Base de Datos PostgreSQL...
pg_isready.exe -h 127.0.0.1 -p 5432 || echo [ERROR] No se pudo conectar a PostgreSQL o pg_isready no esta en el PATH.
echo.
echo Para validar Swagger y el Backend/Frontend, ejecuta start-prod.bat y accede a http://localhost:PORT/api/docs
pause
