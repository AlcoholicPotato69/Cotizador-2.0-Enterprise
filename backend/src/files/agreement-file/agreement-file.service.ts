import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgreementFileRepository } from './agreement-file.repository';
import { CreateAgreementFileDto } from './agreement-file.dto';

export class AgreementFileCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly fileId: string,
    public readonly agreementId: string,
  ) {}
}

@Injectable()
export class AgreementFileService {
  constructor(
    private readonly repository: AgreementFileRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createAgreementFile(tenantId: string, dto: CreateAgreementFileDto) {
    const file = await this.repository.createAgreementFile({
      tenantId,
      agreementId: dto.agreementId,
      url: dto.url,
    });

    this.eventEmitter.emit(
      'agreementFile.created',
      new AgreementFileCreatedEvent(tenantId, file.id, file.agreementId),
    );

    return file;
  }

  async getAgreementFiles(tenantId: string, agreementId: string) {
    return this.repository.findAgreementFiles(tenantId, agreementId);
  }
}
