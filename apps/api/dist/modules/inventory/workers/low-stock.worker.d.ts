import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { KitchenGateway } from '../../kitchen/kitchen.gateway';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class LowStockNotificationWorker extends WorkerHost {
    private readonly kitchenGateway;
    private readonly prisma;
    constructor(kitchenGateway: KitchenGateway, prisma: PrismaService);
    process(job: Job<any, any, string>): Promise<any>;
}
