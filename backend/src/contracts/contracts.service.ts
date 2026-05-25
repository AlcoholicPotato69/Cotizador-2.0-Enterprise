import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async getContract(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
    });
    return contract;
  }
}
