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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto, userId) {
        return this.prisma.client.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    tableId: createOrderDto.tableId,
                    type: createOrderDto.type,
                    createdById: userId,
                    subtotal: 0,
                    tax: 0,
                    total: 0,
                    items: {
                        create: createOrderDto.items.map((item) => ({
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                            unitPrice: item.price,
                            notes: item.notes,
                        }))
                    }
                },
                include: { items: true }
            });
            const subtotal = order.items.reduce((acc, item) => acc + (Number(item.unitPrice) * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            return tx.order.update({
                where: { id: order.id },
                data: { subtotal, tax, total },
                include: { items: true }
            });
        });
    }
    async updateItemStatus(orderId, itemId, status) {
        const item = await this.prisma.client.orderItem.findUnique({
            where: { id: itemId },
            include: { menuItem: { include: { ingredients: true } } }
        });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        if (status === 'PREPARING' && item.status === 'PENDING') {
            await this.deductStock(item.menuItemId, item.quantity);
        }
        return this.prisma.client.orderItem.update({
            where: { id: itemId },
            data: { status: status }
        });
    }
    async deductStock(menuItemId, quantity) {
        const recipe = await this.prisma.client.itemIngredient.findMany({
            where: { menuItemId }
        });
        for (const ingredient of recipe) {
            const deduction = Number(ingredient.quantityUsed) * quantity;
            await this.prisma.client.ingredient.update({
                where: { id: ingredient.ingredientId },
                data: {
                    currentStock: { decrement: deduction },
                    movements: {
                        create: {
                            type: 'SALE_DEDUCTION',
                            quantity: deduction,
                            note: `Order deduction for menu item ${menuItemId}`
                        }
                    }
                }
            });
            const updated = await this.prisma.client.ingredient.findUnique({ where: { id: ingredient.ingredientId } });
            if (updated && Number(updated.currentStock) < Number(updated.minThreshold)) {
            }
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map