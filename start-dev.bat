@echo off
echo Iniciando Sistema Cotizador 2.0 Enterprise...

:: Intentar levantar PostgreSQL si no esta escuchando
netstat -ano | findstr :5432 >nul
if errorlevel 1 (
    echo [!] PostgreSQL no detectado en el puerto 5432.
    echo Intentando revivir el servicio postgresql-x64-18...
    net start postgresql-x64-18 >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] No se pudo iniciar el servicio de BD automaticamente. Por favor inicie PostgreSQL manualmente o corra este script como Administrador.
    ) else (
        echo [OK] PostgreSQL iniciado correctamente.
    )
    echo.
)
:: Iniciar el backend en una nueva ventana
start "Backend (NestJS)" cmd /k "cd backend && npm run start:dev"

:: Iniciar el frontend en una nueva ventana
start "Frontend (Vite)" cmd /k "cd frontend_generated && npm run dev"

:: Iniciar Directus en una nueva ventana
start "Directus (CMS)" cmd /k "cd directus && npm run start"

echo.
echo ==========================================================
echo Backend iniciado en http://localhost:3000
echo Frontend iniciado en http://localhost:5173
echo Directus iniciado en http://localhost:8055 (o el puerto configurado)
echo ==========================================================
echo.
pause
