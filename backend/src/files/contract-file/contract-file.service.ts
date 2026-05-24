import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContractFileRepository } from './contract-file.repository';
import { CreateContractFileDto } from './contract-file.dto';
import { ContractFileCreatedEvent } from '../events/file.events';

@Injectable()
export class ContractFileService {
  constructor(
    private readonly repository: ContractFileRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createContractFile(tenantId: string, dto: CreateContractFileDto) {
    const file = await this.repository.createContractFile({
      tenantId,
      contractId: dto.contractId,
      url: dto.url,
    });

    this.eventEmitter.emit(
      'contractFile.created',
      new ContractFileCreatedEvent(tenantId, file.id, file.contractId),
    );

    return file;
  }

  async getContractFiles(tenantId: string, contractId: string) {
    return this.repository.findContractFiles(tenantId, contractId);
  }
}
