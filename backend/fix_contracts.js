const fs = require('fs');
const path = require('path');

const srcPath = path.join('h:', 'Cotizador-2.0-Enterprise', 'backend', 'src');

function walk(dir, extension, callback) {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    let stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walk(filepath, extension, callback);
    } else if (stats.isFile() && filepath.endsWith(extension)) {
      callback(filepath);
    }
  });
}

function fixControllers() {
  walk(srcPath, '.controller.ts', (filepath) => {
    let content = fs.readFileSync(filepath, 'utf-8');
    if (!content.includes('@ApiTags(')) {
      console.log('Fixing controller:', filepath);
      
      // Determine tag name from filename
      const baseName = path.basename(filepath, '.controller.ts');
      const tag = baseName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Add import if needed
      if (!content.includes('@nestjs/swagger')) {
        // Find last import
        const lines = content.split('\n');
        let lastImportIdx = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            lastImportIdx = i;
          }
        }
        if (lastImportIdx !== -1) {
          lines.splice(lastImportIdx + 1, 0, `import { ApiTags } from '@nestjs/swagger';`);
        } else {
          lines.unshift(`import { ApiTags } from '@nestjs/swagger';`);
        }
        content = lines.join('\n');
      } else {
        // Add ApiTags to existing import if possible, or just add a new import
        if (!content.includes('ApiTags')) {
           content = content.replace(/import\s+{([^}]+)}\s+from\s+['\"]@nestjs\/swagger['\"];?/, (match, p1) => {
             return `import { ${p1}, ApiTags } from '@nestjs/swagger';`;
           });
        }
      }
      
      // Add decorator
      content = content.replace(/@Controller\((.*?)\)/, `@ApiTags('${tag}')\n@Controller($1)`);
      fs.writeFileSync(filepath, content, 'utf-8');
    }
  });
}

function fixDTOs() {
  walk(srcPath, '.dto.ts', (filepath) => {
    let content = fs.readFileSync(filepath, 'utf-8');
    // Check if it has any class-validator decorators
    const hasClassValidator = content.includes('class-validator');
    if (!hasClassValidator) {
      console.log('Fixing DTO (no class-validator):', filepath);
      let lines = content.split('\n');
      let newLines = [];
      let imported = false;
      let propertiesAdded = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!imported && line.startsWith('export class')) {
          newLines.push(`import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';`);
          newLines.push('');
          imported = true;
        }
        
        // Match a property declaration, e.g., "  propertyName: type;" or "  propertyName?: type;"
        const propMatch = line.match(/^(\s*)([a-zA-Z0-9_]+)(\??)\s*:\s*([^;]+);/);
        if (propMatch && imported) {
          newLines.push(propMatch[1] + '@IsOptional()');
          if (propMatch[4].includes('number')) {
            newLines.push(propMatch[1] + '@IsNumber()');
          } else if (propMatch[4].includes('boolean')) {
            newLines.push(propMatch[1] + '@IsBoolean()');
          } else {
            newLines.push(propMatch[1] + '@IsString()');
          }
          propertiesAdded = true;
        }
        newLines.push(line);
      }
      
      if (propertiesAdded) {
         let contentModified = newLines.join('\n');
         fs.writeFileSync(filepath, contentModified, 'utf-8');
      } else {
          // If no properties found, maybe they are empty DTOs or DTOs extending others without new properties.
          // In that case, we still might want to add class-validator if not present, just in case, or leave as is.
      }
    }
  });
}

fixControllers();
fixDTOs();
console.log('Done script.');
