import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JournalEntryMapper, POSEvent } from './mappers/journal-entry.mapper';
import { Decimal } from 'decimal.js';

@Injectable()
export class AccountingBridgeService {
  constructor(
    private prisma: PrismaService,
    private mapper: JournalEntryMapper,
  ) {}

  async processEvent(event: POSEvent) {
    // 1. Idempotency Check
    const existing = await this.prisma.client.processedEvent.findUnique({
      where: { eventId: event.id },
    });
    if (existing) return;

    // 2. Load Account Mappings (Simplified: would use Redis in prod)
    const mappingRecords = await this.prisma.client.accountMapping.findMany();
    const mappings = mappingRecords.reduce((acc: Record<string, any>, rec) => {
      acc[rec.mappingKey] = { code: rec.accountCode, name: rec.accountName };
      return acc;
    }, {});

    // 3. Build Entry
    const entryData = await this.mapper.buildEntry(event, mappings);

    // 4. Validate Balance
    this.validateBalance(entryData.lines);

    // 5. Save Entry & Mark Processed
    return this.prisma.client.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          eventId: entryData.eventId,
          eventType: entryData.eventType,
          description: entryData.description,
          reference: entryData.reference,
          date: entryData.date,
          lines: {
            create: entryData.lines.map(line => ({
              accountCode: line.accountCode,
              accountName: line.accountName,
              debit: line.debit ? line.debit.toNumber() : null,
              credit: line.credit ? line.credit.toNumber() : null,
            }))
          }
        }
      });

      await tx.processedEvent.create({
        data: {
          eventId: event.id,
          journalEntryId: entry.id,
        }
      });

      return entry;
    });
  }

  private validateBalance(lines: any[]) {
    const totalDebit = lines.reduce((acc, l) => acc.plus(l.debit || 0), new Decimal(0));
    const totalCredit = lines.reduce((acc, l) => acc.plus(l.credit || 0), new Decimal(0));

    if (!totalDebit.equals(totalCredit)) {
      throw new BadRequestException(`Journal entry not balanced. Dr: ${totalDebit}, Cr: ${totalCredit}`);
    }
  }
}
