@echo off
setlocal EnableDelayedExpansion

echo =======================================================
echo Lanzador de Produccion - Cotizador 2.0 Enterprise
echo =======================================================
echo.
echo Este script configurara las IPs y puertos para que la aplicacion
echo sea accesible en su red local o servidor.
echo.

:: Intentar detectar la IP de la red local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr IPv4') do (
    set "AUTO_IP=%%a"
)
if "!AUTO_IP!"=="" (
    set "AUTO_IP=0.0.0.0"
) else (
    set "AUTO_IP=!AUTO_IP: =!"
)

:: Solicitar IP
set "IP=!AUTO_IP!"
set /p IP="Ingrese la IP de este servidor (ej. !AUTO_IP!) [!AUTO_IP!]: "

:: Solicitar Puertos
set "PORT_BACKEND=3000"
set /p PORT_BACKEND="Ingrese el puerto para el Backend [%PORT_BACKEND%]: "

set "PORT_DIRECTUS=8055"
set /p PORT_DIRECTUS="Ingrese el puerto para Directus [%PORT_DIRECTUS%]: "

set "PORT_FRONTEND=5173"
set /p PORT_FRONTEND="Ingrese el puerto para el Frontend [%PORT_FRONTEND%]: "

echo.
echo =======================================================
echo Configurando variables de entorno...
echo =======================================================

:: Actualizar puertos dinamicamente (sin ensuciar los .env)
echo Variables en memoria listas para inyectarse a los procesos.

echo.
echo =======================================================
echo Verificando base de datos PostgreSQL...
echo =======================================================

netstat -ano | findstr :5432 >nul
if errorlevel 1 (
    echo [!] PostgreSQL no detectado en el puerto 5432.
    echo Intentando revivir el servicio postgresql-x64-18...
    net start postgresql-x64-18 >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] No se pudo iniciar el servicio de BD automaticamente.
        echo Por favor inicie PostgreSQL manualmente.
    ) else (
        echo [OK] PostgreSQL iniciado correctamente.
    )
) else (
    echo [OK] PostgreSQL detectado.
)

echo.
echo =======================================================
echo Levantando servicios de Produccion
echo =======================================================

:: Iniciar el backend en una nueva ventana
start "Backend (Produccion)" cmd /c "cd backend && set PORT=%PORT_BACKEND%&& set HOST=%IP%&& npm run start:prod"

:: Iniciar Directus en una nueva ventana
start "Directus (CMS)" cmd /c "cd directus && set PORT=%PORT_DIRECTUS%&& set HOST=%IP%&& npm run start"

:: Construir y servir el frontend en una nueva ventana
start "Frontend (Produccion)" cmd /c "cd frontend_generated && set VITE_API_URL=http://%IP%:%PORT_BACKEND%/api/v1&& set VITE_DIRECTUS_URL=http://%IP%:%PORT_DIRECTUS%&& npm run build && npx vite preview --host %IP% --port %PORT_FRONTEND%"

echo.
echo Los servicios se estan levantando en ventanas independientes.
echo Acceda al Frontend en: http://%IP%:%PORT_FRONTEND%
echo Acceda al Backend en:  http://%IP%:%PORT_BACKEND%
echo Acceda a Directus en:  http://%IP%:%PORT_DIRECTUS%
echo.
echo =======================================================
pause
