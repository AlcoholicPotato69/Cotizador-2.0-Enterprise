import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesRepository } from './signatures.repository';
import { SignaturesController } from './signatures.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SignaturesController],
  providers: [SignaturesRepository, SignaturesService],
  exports: [SignaturesRepository, SignaturesService],
})
export class SignaturesModule {}
