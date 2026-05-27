@echo off
echo ========================================================
echo INSTALANDO INTERFAZ DE ADMINISTRACION DE POSTGRESQL (PGADMIN 4)
echo ========================================================
echo.
echo Ejecutando winget para descargar e instalar pgAdmin 4 de manera nativa...
winget install -e --id PostgreSQL.pgAdmin --silent --accept-package-agreements --accept-source-agreements

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Falló la instalación de pgAdmin 4.
    echo Por favor, verifica tu conexión a internet o intenta ejecutar este script como Administrador.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo EXITO: pgAdmin 4 ha sido instalado correctamente.
echo Puedes encontrarlo en tu menú de inicio de Windows.
echo ========================================================
pause
