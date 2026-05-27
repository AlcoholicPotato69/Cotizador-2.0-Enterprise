@echo off
TITLE ERP Cotizador Enterprise - Diagnostico
REM Resolver raiz del proyecto (dos niveles arriba de scripts\ops\)
set "PROJECT_ROOT=%~dp0..\.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

cd /d "%PROJECT_ROOT%"
set "REPORT=%PROJECT_ROOT%\diagnostic-report.txt"

echo Generando reporte de diagnostico en %REPORT%...
echo ====================================== > "%REPORT%"
echo REPORTE DE DIAGNOSTICO TI >> "%REPORT%"
echo ====================================== >> "%REPORT%"
echo Fecha: %date% %time% >> "%REPORT%"
echo. >> "%REPORT%"
echo --- Node.js --- >> "%REPORT%"
node -v >> "%REPORT%" 2>&1
echo --- NPM --- >> "%REPORT%"
npm -v >> "%REPORT%" 2>&1
echo --- PostgreSQL --- >> "%REPORT%"
pg_isready -h 127.0.0.1 -p 5432 >> "%REPORT%" 2>&1
echo --- Puertos en uso (3000) --- >> "%REPORT%"
netstat -aon | findstr :3000 >> "%REPORT%"
echo. >> "%REPORT%"

echo [REPORTE GENERADO CON EXITO EN %REPORT%]
type "%REPORT%"
pause
