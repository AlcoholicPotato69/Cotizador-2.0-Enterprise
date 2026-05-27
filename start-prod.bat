@echo off
TITLE ERP Cotizador Enterprise - Production Launcher
REM Resolver raiz del proyecto (directorio donde vive este .bat)
set "PROJECT_ROOT=%~dp0"
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

echo ========================================================
echo INICIADOR DE PRODUCCION INTERACTIVO
echo ========================================================
echo.

set /p SERVER_IP="Ingresa la IP del servidor (Ej: 192.168.1.100): "
set /p BACKEND_PORT="Ingresa el puerto del Backend [Por defecto: 3000]: "
set /p DB_HOST="Ingresa el Host de Base de Datos [Por defecto: 127.0.0.1]: "
set /p DB_PORT="Ingresa el puerto de Base de Datos [Por defecto: 5432]: "

if "%SERVER_IP%"=="" (
    echo [ERROR] La IP no puede estar vacia.
    pause
    exit /b 1
)
if "%BACKEND_PORT%"=="" set BACKEND_PORT=3000
if "%DB_HOST%"=="" set DB_HOST=127.0.0.1
if "%DB_PORT%"=="" set DB_PORT=5432

echo.
echo [1/4] Inyectando variables de entorno en frontend...
echo VITE_API_BASE_URL=http://%SERVER_IP%:%BACKEND_PORT%/api/v1> "%PROJECT_ROOT%\frontend\.env.production"

echo [2/4] Recompilando Produccion (Frontend y Backend)...
if not exist "%PROJECT_ROOT%\production-build\server\main.js" (
    powershell -ExecutionPolicy Bypass -File "%PROJECT_ROOT%\scripts\dev\build-prod.ps1"
) else (
    echo Produccion ya compilada. Saltando build...
    echo Si desea recompilar, borre la carpeta production-build.
)

echo [3/4] Actualizando app.config.json...
if not exist "%PROJECT_ROOT%\production-build\config" mkdir "%PROJECT_ROOT%\production-build\config"
echo { "serverIp": "%SERVER_IP%", "backendPort": %BACKEND_PORT%, "databaseHost": "%DB_HOST%", "databasePort": %DB_PORT% }> "%PROJECT_ROOT%\production-build\config\app.config.json"

echo [4/4] Levantando el Sistema...
set PORT=%BACKEND_PORT%
set NODE_ENV=production
cd /d "%PROJECT_ROOT%\production-build"
node server/main.js
pause
