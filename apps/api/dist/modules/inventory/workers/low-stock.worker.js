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
exports.LowStockNotificationWorker = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const kitchen_gateway_1 = require("../../kitchen/kitchen.gateway");
const prisma_service_1 = require("../../../prisma/prisma.service");
let LowStockNotificationWorker = class LowStockNotificationWorker extends bullmq_1.WorkerHost {
    kitchenGateway;
    prisma;
    constructor(kitchenGateway, prisma) {
        super();
        this.kitchenGateway = kitchenGateway;
        this.prisma = prisma;
    }
    async process(job) {
        if (job.name === 'low-stock-alert') {
            const { ingredientId, ingredientName, currentStock, unit } = job.data;
            const tenantId = job.asJSON().opts.tenantId;
            this.kitchenGateway.server.to(`tenant:${tenantId}:managers`).emit('inventory:low_stock', {
                ingredientName,
                currentStock,
                unit,
            });
            console.log(`LOW STOCK ALERT: ${ingredientName} is at ${currentStock}${unit}`);
        }
    }
};
exports.LowStockNotificationWorker = LowStockNotificationWorker;
exports.LowStockNotificationWorker = LowStockNotificationWorker = __decorate([
    (0, bullmq_1.Processor)('low-stock'),
    __metadata("design:paramtypes", [kitchen_gateway_1.KitchenGateway,
        prisma_service_1.PrismaService])
], LowStockNotificationWorker);
//# sourceMappingURL=low-stock.worker.js.map