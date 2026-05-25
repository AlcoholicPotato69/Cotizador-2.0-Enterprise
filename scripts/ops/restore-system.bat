@echo off
TITLE ERP Cotizador Enterprise - Restauracion de Base de Datos
set /p FILE_NAME="Ingresa el nombre exacto del archivo .sql a restaurar: "
if not exist "%FILE_NAME%" (
    echo [ERROR] El archivo no existe.
    pause
    exit /b 1
)
echo Restaurando copia de seguridad...
pg_restore.exe -U postgres -h 127.0.0.1 -p 5432 -d cotizador_db -v "%FILE_NAME%"
if %errorlevel% neq 0 (
    echo [ERROR] Falla al ejecutar pg_restore. Asegurese de que PostgreSQL este instalado y en el PATH.
) else (
    echo Restauracion completada.
)
pause
