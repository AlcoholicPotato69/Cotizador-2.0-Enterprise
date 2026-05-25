@echo off
TITLE ERP Cotizador Enterprise - Backup de Base de Datos
set DUMP_FILE=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql
echo Creando copia de seguridad de la base de datos a %DUMP_FILE%...
pg_dump.exe -U postgres -h 127.0.0.1 -p 5432 -F c -b -v -f %DUMP_FILE% cotizador_db
if %errorlevel% neq 0 (
    echo [ERROR] Falla al ejecutar pg_dump. Asegurese de que PostgreSQL este instalado y en el PATH.
) else (
    echo Backup generado con exito.
)
pause
