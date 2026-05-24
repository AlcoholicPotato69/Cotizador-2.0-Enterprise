const fs = require('fs');
const path = require('path');

const domains = [
  { name: 'spaces', entity: 'Space' },
  { name: 'quotes', entity: 'Quote' },
  { name: 'contracts', entity: 'Contract' },
  { name: 'documents', entity: 'Document' },
  { name: 'invoices', entity: 'Invoice' },
  { name: 'payments', entity: 'Payment' },
  { name: 'snapshots', entity: 'Snapshot' },
  { name: 'signatures', entity: 'Signature' },
  { name: 'feature-flags', entity: 'FeatureFlag' }
];

const srcPath = path.join(__dirname, 'src');

domains.forEach(domain => {
  const dirPath = path.join(srcPath, domain.name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const repoPath = path.join(dirPath, `${domain.name}.repository.ts`);
  const repoContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ${domain.entity} } from '@prisma/client';

@Injectable()
export class ${domain.entity}sRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.${domain.entity}CreateInput): Promise<${domain.entity}> {
    return this.prisma.client.${domain.entity.charAt(0).toLowerCase() + domain.entity.slice(1)}.create({ data }) as any;
  }

  async findById(id: string): Promise<${domain.entity} | null> {
    return this.prisma.client.${domain.entity.charAt(0).toLowerCase() + domain.entity.slice(1)}.findUnique({
      where: { id } as any,
    }) as any;
  }

  async findFirst(where: Prisma.${domain.entity}WhereInput): Promise<${domain.entity} | null> {
    return this.prisma.client.${domain.entity.charAt(0).toLowerCase() + domain.entity.slice(1)}.findFirst({ where }) as any;
  }

  async findMany(where: Prisma.${domain.entity}WhereInput): Promise<${domain.entity}[]> {
    return this.prisma.client.${domain.entity.charAt(0).toLowerCase() + domain.entity.slice(1)}.findMany({ where }) as any;
  }

  async update(id: string, data: Prisma.${domain.entity}UpdateInput): Promise<${domain.entity}> {
    return this.prisma.client.${domain.entity.charAt(0).toLowerCase() + domain.entity.slice(1)}.update({
      where: { id } as any,
      data,
    }) as any;
  }
}
`;
  if (!fs.existsSync(repoPath)) {
    fs.writeFileSync(repoPath, repoContent);
    console.log(`Created repository for ${domain.name}`);
  }
});
