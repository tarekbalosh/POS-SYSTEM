import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { KitchenGateway } from '../../kitchen/kitchen.gateway';
import { PrismaService } from '../../../prisma/prisma.service';

@Processor('low-stock')
export class LowStockNotificationWorker extends WorkerHost {
  constructor(
    private readonly kitchenGateway: KitchenGateway,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'low-stock-alert') {
      const { ingredientId, ingredientName, currentStock, unit } = job.data;
      
      const tenantId = (job.asJSON().opts as any).tenantId; // Example of getting tenantId from job opts

      // 1. Emit Socket.io event to manager room
      this.kitchenGateway.server.to(`tenant:${tenantId}:managers`).emit('inventory:low_stock', {
        ingredientName,
        currentStock,
        unit,
      });

      // 2. Log alert in DB (Simplified logic for the task)
      console.log(`LOW STOCK ALERT: ${ingredientName} is at ${currentStock}${unit}`);
      
      // 3. Integration with FCM or Email would go here
    }
  }
}
