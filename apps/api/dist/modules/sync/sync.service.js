"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SyncService = class SyncService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processPush(clientId, operations) {
        const success = [];
        const conflicts = [];
        const errors = [];
        for (const op of operations) {
            try {
                const existingLog = await this.prisma.client.syncLog.findFirst({
                    where: { clientId, entityId: op.local_id.toString() }
                });
                if (existingLog) {
                    success.push(op.local_id);
                    continue;
                }
                if (op.entity_type === 'ORDER') {
                    await this.processOrderOp(op);
                }
                await this.prisma.client.syncLog.create({
                    data: {
                        clientId,
                        entity: op.entity_type,
                        entityId: op.local_id.toString(),
                        action: op.action,
                        payloadJson: op.payload,
                        syncedAt: new Date()
                    }
                });
                success.push(op.local_id);
            }
            catch (err) {
                console.error('Sync operation failed:', err);
                errors.push({ local_id: op.local_id, message: err.message });
            }
        }
        return { success, conflicts, errors };
    }
    async processOrderOp(op) {
        if (op.action === 'CREATE') {
        }
    }
    async processPull(since) {
        const lastSync = new Date(since);
        const menuChanges = await this.prisma.client.menuItem.findMany({
            where: { updatedAt: { gt: lastSync } }
        });
        return {
            changes: menuChanges,
            timestamp: new Date().toISOString()
        };
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SyncService);
//# sourceMappingURL=sync.service.js.map