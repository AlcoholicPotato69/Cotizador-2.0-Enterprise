const fs = require('fs');
const path = require('path');

const envDevPath = path.join(__dirname, 'frontend', '.env.development');
const envProdPath = path.join(__dirname, 'frontend', '.env.production');

fs.writeFileSync(envDevPath, `VITE_APP_ENV=development
VITE_PB_URL=http://localhost:8090
VITE_APP_TITLE="Cotizador PM - DEV"
`);

fs.writeFileSync(envProdPath, `VITE_APP_ENV=production
VITE_PB_URL=https://api.cotizador-pm.com
VITE_APP_TITLE="Cotizador PM"
`);

console.log('Archivos de entorno configurados.');
