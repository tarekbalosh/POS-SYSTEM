import { PrismaService } from '../../../prisma/prisma.service';
import { Decimal } from 'decimal.js';
export declare class COGSEngine {
    private prisma;
    constructor(prisma: PrismaService);
    calculateOrderCOGS(orderId: string): Promise<Decimal>;
}
