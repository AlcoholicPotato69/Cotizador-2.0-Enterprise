import { Injectable, NotFoundException } from '@nestjs/common';
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
