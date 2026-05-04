import { PrismaService } from '../../prisma/prisma.service';
export declare class SyncService {
    private prisma;
    constructor(prisma: PrismaService);
    processPush(clientId: string, operations: any[]): Promise<{
        success: number[];
        conflicts: any[];
        errors: any[];
    }>;
    private processOrderOp;
    processPull(since: string): Promise<{
        changes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            sku: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            cost: import("@prisma/client/runtime/library").Decimal | null;
            imageUrl: string | null;
            preparationSec: number;
            isAvailable: boolean;
        }[];
        timestamp: string;
    }>;
}
