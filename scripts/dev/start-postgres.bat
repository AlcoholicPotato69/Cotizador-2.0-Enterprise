@echo off
echo ========================================================
echo INICIANDO POSTGRESQL 18 EN BACKGROUND
echo ========================================================
echo.

set "PG_BIN=C:\Program Files\PostgreSQL\18\bin"
set "PG_DATA=C:\Program Files\PostgreSQL\18\data"

if not exist "%PG_BIN%\pg_ctl.exe" (
    echo ERROR: No se encontro pg_ctl.exe en %PG_BIN%.
    echo Verifica si PostgreSQL 18 esta instalado en la ruta por defecto.
    pause
    exit /b 1
)

if not exist "%PG_DATA%" (
    echo ERROR: No se encontro el directorio de datos en %PG_DATA%.
    pause
    exit /b 1
)

echo Iniciando el motor de PostgreSQL...
"%PG_BIN%\pg_ctl.exe" start -D "%PG_DATA%"

if %errorlevel% equ 0 (
    echo.
    echo EXITO: PostgreSQL esta corriendo.
) else (
    echo.
    echo ADVERTENCIA: PostgreSQL ya podria estar corriendo o hubo un problema.
)

pause
