@echo off
TITLE ERP Cotizador Enterprise - Backup de Base de Datos
REM Resolver raiz del proyecto (dos niveles arriba de scripts\ops\)
set "PROJECT_ROOT=%~dp0..\.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

cd /d "%PROJECT_ROOT%"
set DUMP_FILE=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql
echo Creando copia de seguridad de la base de datos a %DUMP_FILE%...
pg_dump.exe -U postgres -h 127.0.0.1 -p 5432 -F c -b -v -f "%PROJECT_ROOT%\%DUMP_FILE%" cotizador_db
if %errorlevel% neq 0 (
    echo [ERROR] Falla al ejecutar pg_dump. Asegurese de que PostgreSQL este instalado y en el PATH.
) else (
    echo Backup generado con exito en: %PROJECT_ROOT%\%DUMP_FILE%
)
pause
