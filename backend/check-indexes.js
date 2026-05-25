const fs = require('fs');

const schema = fs.readFileSync('h:/Cotizador-2.0-Enterprise/backend/prisma/schema.prisma', 'utf8');

const models = schema.split('model ');
models.shift();

let missingIndexes = [];

models.forEach(modelStr => {
  const lines = modelStr.split('\n');
  const modelName = lines[0].split(' ')[0].trim();
  const indexLines = lines.filter(l => l.trim().startsWith('@@index'));
  const indexes = indexLines.map(l => l.match(/\(\[(.*?)\]\)/)?.[1]?.split(',').map(s => s.trim()) || []).flat();
  
  const fks = lines.filter(l => l.includes('@relation')).map(l => {
    const match = l.match(/fields:\s*\[(.*?)\]/);
    return match ? match[1].split(',').map(s => s.trim()) : [];
  }).flat();

  fks.forEach(fk => {
    // Check if fk is the first field in any index
    const hasIndex = indexLines.some(l => {
      const match = l.match(/\(\[(.*?)\]\)/);
      if (match) {
        const fields = match[1].split(',').map(s => s.trim());
        return fields[0] === fk || fields.includes(fk); // Prisma can use index if field is part of it. Better if it's first or we have it.
      }
      return false;
    });

    if (!hasIndex && fk !== 'id') {
      missingIndexes.push(`${modelName}: ${fk}`);
    }
  });
});

console.log("Missing Indexes on FKs:", [...new Set(missingIndexes)]);
