import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bullmq';
export declare class StockDeductionService {
    private prisma;
    private lowStockQueue;
    constructor(prisma: PrismaService, lowStockQueue: Queue);
    deductStockForOrderItem(orderItemId: string): Promise<void>;
    private disableItemsUsingIngredient;
    reverseStockForOrder(orderId: string): Promise<void>;
}
