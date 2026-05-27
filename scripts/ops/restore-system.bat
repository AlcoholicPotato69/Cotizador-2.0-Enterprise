@echo off
TITLE ERP Cotizador Enterprise - Restauracion de Base de Datos
REM Resolver raiz del proyecto (dos niveles arriba de scripts\ops\)
set "PROJECT_ROOT=%~dp0..\.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

cd /d "%PROJECT_ROOT%"
set /p FILE_NAME="Ingresa el nombre exacto del archivo .sql a restaurar: "
if not exist "%PROJECT_ROOT%\%FILE_NAME%" (
    echo [ERROR] El archivo %FILE_NAME% no existe en %PROJECT_ROOT%.
    pause
    exit /b 1
)
echo Restaurando copia de seguridad...
pg_restore.exe -U postgres -h 127.0.0.1 -p 5432 -d cotizador_db -v "%PROJECT_ROOT%\%FILE_NAME%"
if %errorlevel% neq 0 (
    echo [ERROR] Falla al ejecutar pg_restore. Asegurese de que PostgreSQL este instalado y en el PATH.
) else (
    echo Restauracion completada.
)
pause
