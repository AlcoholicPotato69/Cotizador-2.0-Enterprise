import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesRepository } from './signatures.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SignaturesRepository, SignaturesService],
  exports: [SignaturesRepository, SignaturesService],
})
export class SignaturesModule {}
