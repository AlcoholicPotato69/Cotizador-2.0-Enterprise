@echo off
TITLE ERP Cotizador Enterprise - Production Launcher
echo ========================================================
echo INICIADOR DE PRODUCCION INTERACTIVO V11.1
echo ========================================================
echo.

set /p SERVER_IP="Ingresa la IP del servidor (Ej: 192.168.1.100): "
set /p BACKEND_PORT="Ingresa el puerto del Backend [Por defecto: 3000]: "
set /p FRONTEND_PORT="Ingresa el puerto del Frontend [Por defecto: 80]: "
set /p DB_HOST="Ingresa el Host de Base de Datos [Por defecto: 127.0.0.1]: "
set /p DB_PORT="Ingresa el puerto de Base de Datos [Por defecto: 5432]: "

if "%BACKEND_PORT%"=="" set BACKEND_PORT=3000
if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=80
if "%DB_HOST%"=="" set DB_HOST=127.0.0.1
if "%DB_PORT%"=="" set DB_PORT=5432

echo.
echo [1/4] Inyectando variables de entorno en frontend...
echo VITE_API_BASE_URL=http://%SERVER_IP%:%BACKEND_PORT%/api/v1 > frontend\.env.production

echo [2/4] Recompilando Produccion (Frontend y Backend)...
if not exist production-build\server\main.js (
    powershell -ExecutionPolicy Bypass -File scripts\dev\build-prod.ps1
) else (
    echo Produccion ya compilada. Saltando build... Si desea recompilar, borre la carpeta production-build.
)

echo [3/4] Actualizando app.config.json...
if not exist production-build\config mkdir production-build\config
echo { "serverIp": "%SERVER_IP%", "backendPort": %BACKEND_PORT%, "frontendPort": %FRONTEND_PORT%, "databaseHost": "%DB_HOST%", "databasePort": %DB_PORT% } > production-build\config\app.config.json

echo [4/4] Levantando el Sistema...
set PORT=%BACKEND_PORT%
set NODE_ENV=production
cd production-build
node server/main.js
pause
