import { SyncService } from './sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    push(body: {
        clientId: string;
        operations: any[];
    }): Promise<{
        success: number[];
        conflicts: any[];
        errors: any[];
    }>;
    pull(since: string): Promise<{
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
