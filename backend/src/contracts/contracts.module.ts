import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractEngineService } from './contract.service';
import { ContractsRepository } from './contracts.repository';
import { ContractsListener } from './contracts.listener';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentsModule } from '../documents/documents.module';
import { SignaturesModule } from '../signatures/signatures.module';

@Module({
  imports: [PrismaModule, DocumentsModule, SignaturesModule],
  controllers: [ContractsController],
  providers: [ContractEngineService, ContractsRepository, ContractsListener],
  exports: [ContractEngineService, ContractsRepository],
})
export class ContractsModule {}
