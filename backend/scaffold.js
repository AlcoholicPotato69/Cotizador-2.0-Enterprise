const fs = require('fs');
const path = require('path');

const modules = [
  'quotes',
  'contracts',
  'signatures',
  'invoices',
  'payments',
  'feature-flags',
  'storage',
  'health'
];

const basePath = path.join(__dirname, 'src');

modules.forEach(mod => {
  const modPath = path.join(basePath, mod);
  if (!fs.existsSync(modPath)) {
    fs.mkdirSync(modPath, { recursive: true });
  }

  const modNameCamel = mod.replace(/-([a-z])/g, g => g[1].toUpperCase());
  const modNamePascal = modNameCamel.charAt(0).toUpperCase() + modNameCamel.slice(1);
  
  // Create module
  const moduleContent = `import { Module } from '@nestjs/common';
import { ${modNamePascal}Service } from './${mod}.service';
import { ${modNamePascal}Controller } from './${mod}.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [${modNamePascal}Controller],
  providers: [${modNamePascal}Service],
  exports: [${modNamePascal}Service],
})
export class ${modNamePascal}Module {}
`;

  // Create service
  const serviceContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ${modNamePascal}Service {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Add domain logic
}
`;

  // Create controller
  const controllerContent = `import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ${modNamePascal}Service } from './${mod}.service';

@Controller('${mod}')
export class ${modNamePascal}Controller {
  constructor(private readonly service: ${modNamePascal}Service) {}

  // TODO: Add endpoints
}
`;

  fs.writeFileSync(path.join(modPath, `${mod}.module.ts`), moduleContent);
  fs.writeFileSync(path.join(modPath, `${mod}.service.ts`), serviceContent);
  // Don't overwrite health.controller.ts if it exists
  if (mod !== 'health') {
    fs.writeFileSync(path.join(modPath, `${mod}.controller.ts`), controllerContent);
  }
});

console.log('Modules scaffolded.');
