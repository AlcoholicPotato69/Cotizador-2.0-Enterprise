Write-Host "Iniciando orquestador de servicios (Backend, Frontend, Directus)..."

# Ejecutaremos todo en la misma consola usando 'concurrently' para evitar el error de creación de ventanas (0x800700e8)
npx concurrently -k -p "[{name}]" -n "Frontend,Backend,Directus" -c "bgCyan.bold,bgMagenta.bold,bgYellow.bold" "cd frontend && npm run dev" "cd backend && npm run start:dev" "cd directus && npx directus start"
