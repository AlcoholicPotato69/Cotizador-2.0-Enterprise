const https = require('https');
const fs = require('fs');

https.get('https://raw.githubusercontent.com/AlcoholicPotato69/Cotizador-2.0-Enterprise/main/README.md', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { fs.writeFileSync('github_readme.md', data); console.log("Done"); });
}).on("error", (err) => { console.log("Error: " + err.message); });
