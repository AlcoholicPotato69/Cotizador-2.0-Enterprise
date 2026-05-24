import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuoteFileRepository } from './quote-file.repository';
import { CreateQuoteFileDto } from './quote-file.dto';
import { QuoteFileCreatedEvent } from '../events/file.events';

@Injectable()
export class QuoteFileService {
  constructor(
    private readonly repository: QuoteFileRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createQuoteFile(tenantId: string, dto: CreateQuoteFileDto) {
    const file = await this.repository.createQuoteFile({
      tenantId,
      quoteId: dto.quoteId,
      url: dto.url,
    });

    this.eventEmitter.emit(
      'quoteFile.created',
      new QuoteFileCreatedEvent(tenantId, file.id, file.quoteId),
    );

    return file;
  }

  async getQuoteFiles(tenantId: string, quoteId: string) {
    return this.repository.findQuoteFiles(tenantId, quoteId);
  }
}
