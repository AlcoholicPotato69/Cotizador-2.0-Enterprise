$ErrorActionPreference = "Stop"
Set-Location ".\backend"

# Ensure dependencies are installed just in case
if (-not (Test-Path ".\node_modules")) {
    npm install
}

Write-Host "Syncing Prisma schema..."
npx prisma db push

Write-Host "Backend setup complete."
