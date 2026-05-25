$ErrorActionPreference = "Stop"

if (-not (Test-Path ".\directus")) {
    New-Item -ItemType Directory -Path ".\directus" -Force | Out-Null
}
Set-Location ".\directus"
Write-Host "Initializing Directus project..."
npm init -y
npm install directus

$directusEnv = @"
KEY=4427b0c3-f4a4-4f05-9507-68b3dcfae249
SECRET=a1f6a6dc-8032-4d2b-b461-2fb1ea494116
ADMIN_EMAIL=admin@cotizador.com
ADMIN_PASSWORD=admin_secure_pass_123

DB_CLIENT=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=cotizador_db
DB_USER=postgres
DB_PASSWORD=postgres_secure_pass_123
"@
Set-Content -Path ".\.env" -Value $directusEnv

Write-Host "Bootstrapping Directus (this will run migrations and create the admin user)..."
npx directus bootstrap
Write-Host "Directus setup complete."
