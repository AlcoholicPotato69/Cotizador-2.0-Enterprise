const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src');

const quotesServiceContent = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, QuoteStatus } from '@prisma/client';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.QuoteCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.quote.create({
      data: {
        ...data,
        status: QuoteStatus.DRAFT,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async findAll(tenantId: string) {
    return this.prisma.quote.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: QuoteStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.quote.update({
      where: { id },
      data: { status },
    });
  }
}
`;

const contractsServiceContent = `import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ContractStatus } from '@prisma/client';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.ContractCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.contract.create({
      data: {
        ...data,
        status: ContractStatus.DRAFT,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const contract = await this.prisma.contract.findFirst({
      where: { id, tenantId },
    });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async findAll(tenantId: string) {
    return this.prisma.contract.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: ContractStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.contract.update({
      where: { id },
      data: { status },
    });
  }
}
`;

const signaturesServiceContent = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractStatus } from '@prisma/client';

@Injectable()
export class SignaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async signContract(tenantId: string, contractId: string, signatureData: any) {
    const contract = await this.prisma.contract.findFirst({
      where: { id: contractId, tenantId },
    });

    if (!contract) throw new NotFoundException('Contract not found');

    // Mocks external signature provider logic
    return this.prisma.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.SIGNED },
    });
  }
}
`;

const invoicesServiceContent = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.InvoiceCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.invoice.create({
      data: {
        ...data,
        status: InvoiceStatus.DRAFT,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async findAll(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: InvoiceStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }
}
`;

const paymentsServiceContent = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.PaymentCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.payment.create({
      data: {
        ...data,
        status: PaymentStatus.PENDING,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, tenantId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async findAll(tenantId: string) {
    return this.prisma.payment.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: PaymentStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.payment.update({
      where: { id },
      data: { status },
    });
  }
}
`;

const featureFlagsServiceContent = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, featureKey: string, enabled: boolean = false, rolloutPercentage: number = 100) {
    return this.prisma.featureFlag.create({
      data: {
        tenantId,
        featureKey,
        enabled,
        rolloutPercentage,
      },
    });
  }

  async isEnabled(tenantId: string, featureKey: string): Promise<boolean> {
    const flag = await this.prisma.featureFlag.findFirst({
      where: { tenantId, featureKey },
    });
    
    if (!flag) return false;
    
    if (!flag.enabled) return false;

    // Simple rollout percentage check
    const random = Math.floor(Math.random() * 100) + 1;
    return random <= flag.rolloutPercentage;
  }

  async toggleFlag(tenantId: string, featureKey: string, enabled: boolean) {
    const flag = await this.prisma.featureFlag.findFirst({
      where: { tenantId, featureKey },
    });

    if (!flag) throw new NotFoundException('Feature flag not found');

    return this.prisma.featureFlag.update({
      where: { id: flag.id },
      data: { enabled },
    });
  }
}
`;

const storageServiceContent = `import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  // In a real scenario, this would integrate with AWS S3, Azure Blob, Google Cloud Storage
  // For now, it respects Domain Isolation and acts as a generic port
  
  async uploadFile(tenantId: string, fileBuffer: Buffer, fileName: string): Promise<string> {
    const path = \`\${tenantId}/\${Date.now()}-\${fileName}\`;
    // ... logic to upload to S3 ...
    return \`https://storage.provider.com/\${path}\`;
  }

  async getFileUrl(tenantId: string, path: string): Promise<string> {
    // ... logic to sign URL ...
    return \`https://storage.provider.com/\${path}?signed=true\`;
  }

  async deleteFile(tenantId: string, path: string): Promise<void> {
    // ... logic to delete from S3 ...
  }
}
`;

// Helper to write files
const write = (subPath, content) => fs.writeFileSync(path.join(basePath, subPath), content);

write('quotes/quotes.service.ts', quotesServiceContent);
write('contracts/contracts.service.ts', contractsServiceContent);
write('signatures/signatures.service.ts', signaturesServiceContent);
write('invoices/invoices.service.ts', invoicesServiceContent);
write('payments/payments.service.ts', paymentsServiceContent);
write('feature-flags/feature-flags.service.ts', featureFlagsServiceContent);
write('storage/storage.service.ts', storageServiceContent);

console.log('Services generated.');
