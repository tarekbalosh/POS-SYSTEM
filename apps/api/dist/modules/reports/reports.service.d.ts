import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ReportsService {
    private reportQueue;
    private prisma;
    constructor(reportQueue: Queue, prisma: PrismaService);
    createExportJob(type: string, date: string, tenantId: string): Promise<{
        jobId: string | undefined;
    }>;
    getDailyRevenue(date: string): Promise<{
        date: string;
        revenue: number;
        transactionCount: number;
    }>;
}
