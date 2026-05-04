import { PrismaService } from '../../prisma/prisma.service';
import { JournalEntryMapper, POSEvent } from './mappers/journal-entry.mapper';
export declare class AccountingBridgeService {
    private prisma;
    private mapper;
    constructor(prisma: PrismaService, mapper: JournalEntryMapper);
    processEvent(event: POSEvent): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EntryStatus;
        createdAt: Date;
        reference: string;
        eventId: string;
        eventType: string;
        description: string;
        date: Date;
    } | undefined>;
    private validateBalance;
}
