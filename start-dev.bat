@echo off
echo Iniciando Sistema Cotizador 2.0 Enterprise...

:: Iniciar el backend en una nueva ventana
start "Backend (NestJS)" cmd /k "cd backend && npm run start:dev"

:: Iniciar el frontend en una nueva ventana
start "Frontend (Vite)" cmd /k "cd frontend_generated && npm run dev"

echo.
echo ==========================================================
echo Backend iniciado en http://localhost:3000
echo Frontend iniciado en http://localhost:5173
echo ==========================================================
echo.
pause
