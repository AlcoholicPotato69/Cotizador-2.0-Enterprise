@echo off
echo Starting Cotizador 2.0 Enterprise...
cd "%~dp0"
start "Backend" cmd /c "start-backend.bat"
start "Frontend" cmd /c "start-frontend.bat"
echo Both services started.
