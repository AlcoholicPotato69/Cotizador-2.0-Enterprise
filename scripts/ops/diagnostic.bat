@echo off
TITLE ERP Cotizador Enterprise - Diagnostico
echo Generando reporte de diagnostico...
echo ====================================== > diagnostic-report.txt
echo REPORTE DE DIAGNOSTICO TI - V11.1 >> diagnostic-report.txt
echo ====================================== >> diagnostic-report.txt
echo Fecha: %date% %time% >> diagnostic-report.txt
echo Node Version: >> diagnostic-report.txt
node -v >> diagnostic-report.txt 2>&1
echo NPM Version: >> diagnostic-report.txt
npm -v >> diagnostic-report.txt 2>&1
echo Puertos Ocupados (3000): >> diagnostic-report.txt
netstat -aon | findstr :3000 >> diagnostic-report.txt
echo. >> diagnostic-report.txt
echo [REPORTE GENERADO CON EXITO EN diagnostic-report.txt]
pause
