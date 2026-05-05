import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async processPush(clientId: string, operations: any[]) {
    const success: number[] = [];
    const conflicts: any[] = [];
    const errors: any[] = [];

    for (const op of operations) {
      try {
        // Check for Idempotency: Has this local_id already been synced?
        const existingLog = await this.prisma.client.syncLog.findFirst({
          where: { clientId, entityId: op.local_id.toString() },
        });

        if (existingLog) {
          success.push(op.local_id);
          continue;
        }

        // Process based on entity type
        if (op.entity_type === 'ORDER') {
          await this.processOrderOp(op);
        }

        // Log successful sync
        await this.prisma.client.syncLog.create({
          data: {
            clientId,
            entity: op.entity_type,
            entityId: op.local_id.toString(),
            action: op.action,
            payloadJson: op.payload,
            syncedAt: new Date(),
          },
        });

        success.push(op.local_id);
      } catch (err) {
        console.error('Sync operation failed:', err);
        errors.push({ local_id: op.local_id, message: err.message });
      }
    }

    return { success, conflicts, errors };
  }

  private async processOrderOp(op: any) {
    if (op.action === 'CREATE') {
      // Create the order in the database
      // Similar to OrdersService.create but uses payload from offline
    }
  }

  async processPull(since: string) {
    const lastSync = new Date(since);

    // Fetch everything updated after lastSync
    const menuChanges = await this.prisma.client.menuItem.findMany({
      where: { updatedAt: { gt: lastSync } },
    });

    return {
      changes: menuChanges,
      timestamp: new Date().toISOString(),
    };
  }
}
