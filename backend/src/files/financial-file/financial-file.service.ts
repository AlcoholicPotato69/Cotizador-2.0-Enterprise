import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FinancialFileRepository } from './financial-file.repository';
import { CreateFinancialFileDto } from './financial-file.dto';
import { FinancialFileCreatedEvent } from '../events/file.events';

@Injectable()
export class FinancialFileService {
  constructor(
    private readonly repository: FinancialFileRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createFinancialFile(tenantId: string, dto: CreateFinancialFileDto) {
    const file = await this.repository.createFinancialFile({
      tenantId,
      invoiceId: dto.invoiceId,
      url: dto.url,
    });

    this.eventEmitter.emit(
      'financialFile.created',
      new FinancialFileCreatedEvent(tenantId, file.id, file.invoiceId),
    );

    return file;
  }

  async getFinancialFiles(tenantId: string, invoiceId: string) {
    return this.repository.findFinancialFiles(tenantId, invoiceId);
  }
}
