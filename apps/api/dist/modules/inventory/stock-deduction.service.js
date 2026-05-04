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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockDeductionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const decimal_js_1 = require("decimal.js");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let StockDeductionService = class StockDeductionService {
    prisma;
    lowStockQueue;
    constructor(prisma, lowStockQueue) {
        this.prisma = prisma;
        this.lowStockQueue = lowStockQueue;
    }
    async deductStockForOrderItem(orderItemId) {
        const orderItem = await this.prisma.client.orderItem.findUnique({
            where: { id: orderItemId },
            include: { menuItem: { include: { ingredients: true } } },
        });
        if (!orderItem)
            return;
        for (const recipeItem of orderItem.menuItem.ingredients) {
            const ingredient = await this.prisma.client.ingredient.findUnique({
                where: { id: recipeItem.ingredientId },
            });
            if (!ingredient)
                continue;
            const needed = new decimal_js_1.Decimal(recipeItem.quantityUsed).mul(orderItem.quantity);
            const current = new decimal_js_1.Decimal(ingredient.currentStock);
            if (current.lt(needed)) {
                throw new common_1.BadRequestException(`Out of stock: ${ingredient.name}`);
            }
            const newStock = current.minus(needed);
            await this.prisma.client.stockMovement.create({
                data: {
                    ingredientId: ingredient.id,
                    type: 'SALE_DEDUCTION',
                    quantity: needed.negated().toNumber(),
                    referenceId: orderItem.id,
                    note: `Order ${orderItem.orderId} item ${orderItem.id}`,
                },
            });
            await this.prisma.client.ingredient.update({
                where: { id: ingredient.id },
                data: { currentStock: newStock.toNumber() },
            });
            if (newStock.lte(new decimal_js_1.Decimal(ingredient.minThreshold))) {
                await this.lowStockQueue.add('low-stock-alert', {
                    ingredientId: ingredient.id,
                    ingredientName: ingredient.name,
                    currentStock: newStock.toNumber(),
                    unit: ingredient.unit,
                });
            }
            if (newStock.lte(0)) {
                await this.disableItemsUsingIngredient(ingredient.id);
            }
        }
    }
    async disableItemsUsingIngredient(ingredientId) {
        const items = await this.prisma.client.itemIngredient.findMany({
            where: { ingredientId },
            select: { menuItemId: true },
        });
        const itemIds = items.map(i => i.menuItemId);
        await this.prisma.client.menuItem.updateMany({
            where: { id: { in: itemIds } },
            data: { isAvailable: false },
        });
    }
    async reverseStockForOrder(orderId) {
        const items = await this.prisma.client.orderItem.findMany({
            where: { orderId },
            include: { menuItem: { include: { ingredients: true } } },
        });
        for (const item of items) {
            for (const recipeItem of item.menuItem.ingredients) {
                const quantityToReturn = new decimal_js_1.Decimal(recipeItem.quantityUsed).mul(item.quantity);
                await this.prisma.client.stockMovement.create({
                    data: {
                        ingredientId: recipeItem.ingredientId,
                        type: 'RETURN',
                        quantity: quantityToReturn.toNumber(),
                        referenceId: item.id,
                        note: `Reversal for cancelled order ${orderId}`,
                    },
                });
                await this.prisma.client.ingredient.update({
                    where: { id: recipeItem.ingredientId },
                    data: { currentStock: { increment: quantityToReturn.toNumber() } },
                });
            }
        }
    }
};
exports.StockDeductionService = StockDeductionService;
exports.StockDeductionService = StockDeductionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('low-stock')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], StockDeductionService);
//# sourceMappingURL=stock-deduction.service.js.map