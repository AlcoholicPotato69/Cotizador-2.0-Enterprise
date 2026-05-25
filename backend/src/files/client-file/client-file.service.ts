import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientFileRepository } from './client-file.repository';
import {
  CreateClientFileDto,
  AddClientFileDocumentDto,
} from './client-file.dto';
import {
  ClientFileCreatedEvent,
  ClientFileDocumentAddedEvent,
} from '../events/file.events';

@Injectable()
export class ClientFileService {
  constructor(
    private readonly repository: ClientFileRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createClientFile(tenantId: string, dto: CreateClientFileDto) {
    const file = await this.repository.createClientFile({
      tenantId,
      clientId: dto.clientId,
      name: dto.name,
    });

    this.eventEmitter.emit(
      'clientFile.created',
      new ClientFileCreatedEvent(tenantId, file.id, file.clientId),
    );

    return file;
  }

  async getClientFiles(tenantId: string, clientId: string) {
    return this.repository.findClientFiles(tenantId, clientId);
  }

  async addDocument(
    tenantId: string,
    clientFileId: string,
    dto: AddClientFileDocumentDto,
  ) {
    const file = await this.repository.findClientFileById(
      tenantId,
      clientFileId,
    );
    if (!file) {
      throw new NotFoundException(
        `ClientFile with ID ${clientFileId} not found`,
      );
    }

    const document = await this.repository.addDocument({
      tenantId,
      clientFileId,
      url: dto.url,
      documentType: dto.documentType,
    });

    this.eventEmitter.emit(
      'clientFile.documentAdded',
      new ClientFileDocumentAddedEvent(
        tenantId,
        clientFileId,
        document.id,
        document.documentType,
      ),
    );

    return document;
  }
}
