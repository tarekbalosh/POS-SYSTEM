import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectQueue('reports') private reportQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async createExportJob(type: string, date: string, tenantId: string) {
    const job = await this.reportQueue.add('generate-report', {
      type,
      date,
      tenantId,
    });

    return { jobId: job.id };
  }

  async getDailyRevenue(date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const payments = await this.prisma.client.payment.findMany({
      where: {
        paidAt: { gte: startOfDay, lte: endOfDay },
        voidedAt: null,
      },
    });

    const total = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      date,
      revenue: total,
      transactionCount: payments.length,
    };
  }
}
