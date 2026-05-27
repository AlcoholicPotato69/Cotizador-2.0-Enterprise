# Orquestador de Desarrollo: Backend + Frontend + Directus
# Ejecuta los tres servidores en paralelo usando 'concurrently'

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $ProjectRoot

Write-Host "=============================================="
Write-Host "ORQUESTADOR DE DESARROLLO - Cotizador 2.0"
Write-Host "=============================================="
Write-Host "Raiz del proyecto: $ProjectRoot"
Write-Host ""
Write-Host "  Backend  -> http://localhost:3000/api/v1"
Write-Host "  Frontend -> http://localhost:5173"
Write-Host "  Directus -> http://localhost:8055"
Write-Host ""

npx concurrently -k -p "[{name}]" -n "Frontend,Backend,Directus" -c "bgCyan.bold,bgMagenta.bold,bgYellow.bold" "cd frontend && npm run dev" "cd backend && npm run start:dev" "cd directus && npx directus start"
