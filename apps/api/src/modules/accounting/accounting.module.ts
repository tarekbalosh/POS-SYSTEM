import { Module } from '@nestjs/common';
import { AccountingBridgeService } from './accounting-bridge.service';
import { JournalEntryMapper } from './mappers/journal-entry.mapper';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [AccountingBridgeService, JournalEntryMapper, PrismaService],
  exports: [AccountingBridgeService],
})
export class AccountingModule {}
