import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomerCreditsRepository } from './customer-credits.repository';
import { AddTransactionDto } from './dto/add-transaction.dto';
import {
  CreditTransactionCreatedEvent,
  CreditBalanceUpdatedEvent,
} from './events/customer-credits.events';

@Injectable()
export class CustomerCreditsService {
  constructor(
    private readonly repository: CustomerCreditsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getBalance(tenantId: string, clientId: string) {
    const balance = await this.repository.getBalance(tenantId, clientId);
    return balance || { tenantId, clientId, balanceAmount: 0 };
  }

  async addTransaction(
    tenantId: string,
    dto: AddTransactionDto,
    userId: string,
  ) {
    if (dto.amount < 0) {
      const currentBalance = await this.getBalance(tenantId, dto.clientId);
      if (Number(currentBalance.balanceAmount) < Math.abs(dto.amount)) {
        throw new BadRequestException('Insufficient credit balance');
      }
    }

    const { transaction, balance } = await this.repository.addTransaction({
      tenantId,
      clientId: dto.clientId,
      amount: dto.amount,
      transactionType: dto.type as any,
      correlationId: dto.referenceId,
      deletedBy: null, // placeholder
    });

    this.eventEmitter.emit(
      'credit.transaction.created',
      new CreditTransactionCreatedEvent(
        tenantId,
        dto.clientId,
        transaction.id,
        Number(transaction.amount),
      ),
    );

    this.eventEmitter.emit(
      'credit.balance.updated',
      new CreditBalanceUpdatedEvent(
        tenantId,
        dto.clientId,
        Number(balance.balanceAmount),
      ),
    );

    return { transaction, balance };
  }
}
