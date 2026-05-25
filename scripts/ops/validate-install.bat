@echo off
TITLE ERP Cotizador Enterprise - Validador de Instalacion
echo ========================================================
echo VALIDADOR DE INSTALACION
echo ========================================================
echo.
echo [OK] Verificando Node.js...
node -v || echo [ERROR] Node.js no esta instalado.
echo [OK] Verificando NPM...
npm -v || echo [ERROR] NPM no esta instalado.
echo [OK] Verificando Base de Datos PostgreSQL...
pg_isready.exe -h 127.0.0.1 -p 5432 || echo [ERROR] No se pudo conectar a PostgreSQL o pg_isready no esta en el PATH.
echo.
echo Para validar Swagger y el Backend/Frontend, ejecuta start-prod.bat y accede a http://localhost:PORT/api/docs
pause
