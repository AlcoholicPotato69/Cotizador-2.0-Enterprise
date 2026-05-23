@echo off
echo Running Health Check...
curl -s http://127.0.0.1:8090/api/health
echo.
curl -s http://localhost:5173/ > NUL
if %ERRORLEVEL% EQU 0 (
  echo Frontend is reachable.
) else (
  echo Frontend is unreachable.
)
